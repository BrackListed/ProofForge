import "dotenv/config"
import express from "express"
import cors from "cors"
import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { clerkClient, clerkMiddleware } from '@clerk/express'
import { verifyWebhook } from "@clerk/express/webhooks"
import Groq from "groq-sdk";
import multer from "multer"
import path from "path"
const app = express()
const pool = new Pool({connectionString: process.env.DATABASE_URL})
const db = drizzle(process.env.DATABASE_URL!)

const GROQ_MODEL = "llama-3.3-70b-versatile"
const GUEST_CLERK_USER_ID = "user_3I0S3d8ipBqUlXGP7TilYrLagbv"

async function getOrCreateUserId(userId: string){
  const existing = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
  if(existing.rows[0]?.id) return existing.rows[0].id as string
  const clerkUser = await clerkClient.users.getUser(userId)
  const email = clerkUser.emailAddresses[0]?.emailAddress ?? ""
  const username = clerkUser.username ?? clerkUser.firstName ?? userId
  const inserted = await pool.query(
    "INSERT INTO users(clerk_user_id, email, username) VALUES($1, $2, $3) RETURNING id",
    [userId, email, username]
  )
  return inserted.rows[0].id as string
}


// Dynamically handles your local dev or your deployed Render frontend URL
const allowedOrigin = process.env.FRONTEND_URL || "http://localhost:5173"

interface transcriptType{
  sender: "ai" | "user" 
  text: string
}
app.use(cors({
  origin: [allowedOrigin], 
  credentials: true
}))

app.post("/webhooks/clerk", express.raw({type: "application/json"}), async (req, res) => {
  try{
    const evt = await verifyWebhook(req)
    const eventType = evt.type
    if(eventType === "user.created"){
      const {id, email_addresses, username, first_name} = evt.data as {
        id: string
        email_addresses: Array<{ email_address: string }>
        username?: string | null
        first_name?: string | null
      }
      await pool.query("INSERT INTO users(clerk_user_id, email, username) VALUES($1, $2, $3)", [id, email_addresses[0]?.email_address ?? "", username ?? first_name])
    }
    return res.status(200).send("Webhook Received")
  } catch(err){
    console.error("Error verifying webhook", err)
    return res.status(400).send('Error verifying webhook')
  }
})
app.use(clerkMiddleware())
app.use(express.json())

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    const shortName = Date.now() + path.extname(file.originalname);
    cb(null, shortName)
  }
})

const upload = multer({storage: storage})
const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});


app.get("/test", (req, res) => {
  res.json({ message: "Backend is alive and connected!" })
})

app.post("/guest-token", async(req, res) => {
  try{
    await getOrCreateUserId(GUEST_CLERK_USER_ID)
    const signInToken = await clerkClient.signInTokens.createSignInToken({
      userId: GUEST_CLERK_USER_ID,
      expiresInSeconds: 60,
    })
    res.json({ token: signInToken.token })
  } catch(err){
    console.error("Error creating guest sign-in token", err)
    res.status(500).json({ error: "Could not create guest sign-in token" })
  }
})

app.get("/logs/scrutinize/:userId", async(req, res) => {
  const {userId} = req.params
  const dbUserId = await getOrCreateUserId(userId)
  const result = await pool.query("SELECT * FROM scrutinize WHERE user_id = $1 ORDER BY created_at DESC", [dbUserId])
  res.json(result.rows)
})

app.get("/rooms/:userId", async(req, res) => {
  const {userId} = req.params
  const dbUserId = await getOrCreateUserId(userId)
  const result = await pool.query("SELECT * FROM debate_room WHERE user_id = $1", [dbUserId])
  res.json(result.rows)
})

app.delete("/rooms/:userId/:roomId", async(req, res) => {
  const {userId, roomId} = req.params
  const dbUserId = await getOrCreateUserId(userId)
  const result = await pool.query("DELETE FROM debate_room WHERE id = $1 AND user_id = $2 RETURNING id", [roomId, dbUserId])
  if(result.rows.length === 0) return res.status(404).json({error: "Room not found"})
  res.json({id: result.rows[0].id})
})

app.get("/debate/logs/:roomId/:userId", async(req, res) => {
  const {userId, roomId} = req.params
  const dbUserId = await getOrCreateUserId(userId)
  const result = await pool.query("SELECT transcript FROM debate_logs WHERE room_id = $1 AND user_id = $2", [roomId, dbUserId])
  res.json(result.rows)
})

app.get("/risks/:userId", async(req, res) => {
  const {userId} = req.params
  const dbUserId = await getOrCreateUserId(userId)
  const result = await pool.query("SELECT * FROM risks WHERE user_id = $1", [dbUserId])
  res.json(result.rows)
})

app.get("/activity/:userId", async(req, res) => {
  const {userId} = req.params
  const dbUserId = await getOrCreateUserId(userId)
  const result = await pool.query(`
    SELECT 'Text Scrutinizer' AS tool, LEFT(content, 140) AS summary,
      CASE WHEN flag_count = 0 THEN 'No issues flagged' ELSE flag_count || ' issue' || CASE WHEN flag_count = 1 THEN '' ELSE 's' END || ' flagged' END AS verdict,
      CASE WHEN flag_count = 0 THEN 'clean' WHEN flag_count <= 2 THEN 'warn' ELSE 'bad' END AS tone,
      created_at::timestamptz AS date
    FROM scrutinize WHERE user_id = $1

    UNION ALL

    SELECT 'Debate Simulator' AS tool, dr.title AS summary,
      COALESCE(jsonb_array_length(dl.transcript), 0) || ' exchanges' AS verdict,
      'neutral' AS tone,
      dl.updated_at::timestamptz AS date
    FROM debate_logs dl
    JOIN debate_room dr ON dr.id = dl.room_id
    WHERE dl.user_id = $1

    UNION ALL

    SELECT 'Risk Simulator' AS tool, COALESCE(initial_decision, 'Untitled decision') AS summary,
      CASE WHEN status = 'COMPLETED' THEN threat_level || ' risk' WHEN status = 'FAILED' THEN 'Failed' ELSE 'Probing' END AS verdict,
      CASE WHEN threat_level = 'CRITICAL' THEN 'bad' WHEN threat_level = 'MODERATE' THEN 'warn' WHEN threat_level = 'LOW' THEN 'clean' ELSE 'neutral' END AS tone,
      updated_at::timestamptz AS date
    FROM risks WHERE user_id = $1

    ORDER BY date DESC
    LIMIT 8
  `, [dbUserId])
  res.json(result.rows)
})

app.get("/stats/:userId", async(req, res) => {
  const {userId} = req.params
  const dbUserId = await getOrCreateUserId(userId)
  const [scrutinized, debates, risks] = await Promise.all([
    pool.query("SELECT COUNT(*) FROM scrutinize WHERE user_id = $1", [dbUserId]),
    pool.query("SELECT COUNT(*) FROM debate_room WHERE user_id = $1", [dbUserId]),
    pool.query("SELECT COUNT(*) FROM risks WHERE user_id = $1", [dbUserId]),
  ])
  res.json({
    scrutinized: Number(scrutinized.rows[0].count),
    debates: Number(debates.rows[0].count),
    risks: Number(risks.rows[0].count),
  })
})

app.post("/scrutinize/:userId", async(req, res) => {
  const {userId} = req.params
  const {text, file} = req.body
  const dbUserId = await getOrCreateUserId(userId)
  if(text){
    const completions = await client.chat.completions.create({
      model: GROQ_MODEL,
      response_format: {type: "json_object"},
      messages: [{
        role: 'system',
        content: `You are a rigorous logical auditor. Analyze the following document text for structural integrity, logical fallacies, and claim support. 
        Return ONLY a valid JSON object matching this exact structure:
        {
          "extractedPremise": "The core foundational assertion of the document",
          "isIsolated": true/false (true if the premise lacks supporting arguments or surrounding logical context),
          "logic": [
          {
            "step": 1,
            "claim": "Direct quote or clear summary of claim 1",
            "relation": {
              "type": "CAUSE" | "EVIDENCE" | "INFERENCE" | "CONTRADICTION" | "SUB-CLAIM",
              "targetStep": 1
            },
            "flagType": "UNPROV." | "ABSOL." | "WEAK." | null
          }
          ],
          "flags": [
          {
            "type": "UNPROV." | "ABSOL." | "WEAK.",
            "instance": "Exact text quote flagged",
            "critique": "Explanation of the logical flaw"
          }
          ]
        }
        Rules:
        1. Maintain strict chronological reading order in 'logicMap'.
        2. Use 'targetStep' inside 'relation' to explicitly link steps, even if a contradiction or evidence appears out of standard sequence.
        3. Classify flags as:
          - 'UNPROV.': Unverified assertions or unbacked assumptions.
          - 'ABSOL.': Overgeneralisations, absolute claims, or false dichotomies.
          - 'WEAK.': Flawed reasoning, non-sequiturs, or poor evidence.`
      },
      {
        role: "user",
        content: text
      }
      ]
    })
    const result = completions.choices?.[0]?.message?.content ?? "{}"
    const data = JSON.parse(result)
    const dbInsert = await pool.query("INSERT INTO scrutinize(user_id, content, premise, logic, flags, flag_count) VALUES($1, $2, $3, $4, $5, $6) RETURNING *", [dbUserId, text, data.extractedPremise, JSON.stringify(data.logic || []), JSON.stringify(data.flags || []), (data.flags || []).length])
    return res.json(dbInsert.rows[0])
  }
})

app.post("/create-room/:userId", async(req, res) => {
  const {userId} = req.params
  const dbUserId = await getOrCreateUserId(userId)
  const {title, topic} = req.body
  const result = await pool.query("INSERT INTO debate_room(user_id, title, topic) VALUES($1, $2, $3) RETURNING id", [dbUserId, title, topic])
  res.json(result.rows[0].id)
})

app.post("/process-argument/:userId/:roomId", async(req, res) => {
  const {userId, roomId} = req.params
  const {argument} = req.body
  const dbUserId = await getOrCreateUserId(userId)
  const result = await pool.query("SELECT transcript FROM debate_logs WHERE user_id = $1 AND room_id = $2", [dbUserId, roomId])
  let transcript = []
  if (result.rows.length > 0) {
    transcript = result.rows[0].transcript;
  }
  const completions = await client.chat.completions.create({
    model: GROQ_MODEL,
    response_format: {type: "json_object"},
    messages: [{
      role: "system",
      content: `ou are an expert debate opponent. Review the conversation history. Call out evasions or weak points from previous turns if unaddressed, then cross-examine the latest argument.
      STRICT LENGTH CONSTRAINT: Your response must be concise and targeted, between 300 to 450 words max (roughly a 3-minute read). Do NOT write long essays or rambling introductory fluff. Get straight to the point with sharp rebuttal points. 
      You MUST respond strictly in JSON using this exact format:
      { 
        "response": your full rebuttal and cross-examination here
      }` 
    },
    {
      role: "user",
      content: `Here is the full conversation history: \n ${JSON.stringify(transcript)}`
    },
    {
      role: "user",
      content: argument
    }
    ]
  })
  const reply = completions.choices[0]?.message?.content ?? "{}";
  const parsedReply = JSON.parse(reply);
  transcript.push({
    sender: "user",
    text: argument
  })
  transcript.push({
    sender: "ai",
    text: parsedReply
  })
  await pool.query(`INSERT INTO debate_logs(user_id, room_id, transcript, updated_at) VALUES($1, $2, $3, NOW()) ON CONFLICT(user_id, room_id) DO UPDATE SET transcript = $3, updated_at = NOW()`, [dbUserId, roomId, JSON.stringify(transcript)])
  return res.json(parsedReply)
})

app.post("/analyze-risk/:userId", async(req, res) => {
  const {userId} = req.params
  const {decision} = req.body
  const dbUserId = await getOrCreateUserId(userId)
  const completions = await client.chat.completions.create({
    model: GROQ_MODEL,
    response_format: {type: "json_object"},
    messages: [{
      role: "system",
      content: `You are an aggressive risk diagnostic tool. Analyze missing constraints and return ONLY a JSON object with:
        1. "category": A concise category label for this decision.
        2. "probing_questions": An array of a maximum(but not required) of 10 objects, each object must contain:
        "id": A short, lowercase, snake_case string representing the topic (e.g. "time_commitment", "sacrificed_stack", "target_goal").
        "question": The question string.
        "placeholder": An example string.
      `
    },
    {
      role: "user",
      content: decision
    }
    ]
  })
  const response = completions.choices[0]?.message?.content ?? "{}"
  const parsedResponse = JSON.parse(response)
  const result = await pool.query("INSERT INTO risks(user_id, status, initial_decision, category, probing_questions) VALUES($1, $2, $3, $4, $5) RETURNING *", [dbUserId, "PROBING", decision, parsedResponse.category, JSON.stringify(parsedResponse.probing_questions)])
  res.json(result.rows[0])
})

app.post("/analyze-risk/answers/:id", async(req, res) => {
  const {id} = req.params
  const {answers, initialDecision, category} = req.body
  const completions = await client.chat.completions.create({
    model: GROQ_MODEL,
    response_format: {type: "json_object"},
    messages: [{
      role: "system",
      content: `You are an aggressive architectural and strategic risk diagnostic engine. Analyze the provided user cross-examination answers against their initial decision.
        Compute and return a raw JSON object containing ALL seven of the following fields:
        1. "risk_score": Integer (0 to 100).
        2. "threat_level": Strictly one of ["LOW", "MODERATE", "CRITICAL"].
        3. "reversibility_level": Strictly one of ["HIGH", "MEDIUM", "IRREVERSIBLE"].
        4. "primary_obstacle": Single high-impact string identifying the core bottleneck.
        5. "blast_radius": Array of objects [{ "affected_area": string, "impact_level": "LOW" | "MEDIUM" | "HIGH", "description": string }].
        6. "timeline": Array of chronological objects [{ "step": number, "title": string, "description": string, "target_date": string }].
        7. "exit": Single object { "trigger": string, "action": string, "fallback_plan": string }.
        OUTPUT RULES:
        - Output MUST be strictly valid JSON matching the specified keys.
        - Do NOT include markdown code blocks (no \`\`\`json), explanations, or preamble.`
    },
    {
      role: 'user',
      content: `Initial Decision: ${initialDecision} \n Category: ${category} \n User Answers: ${JSON.stringify(answers, null, 2)}`
    }
    ]
  })
  const response = completions.choices[0]?.message?.content ?? "{}"
  const parsedResponse = JSON.parse(response)
  const result = await pool.query("UPDATE risks SET user_answers = $1, risk_score = $2, threat_level = $3, reversibility_level = $4, primary_obstacle = $5, timeline = $6, blast_radius = $7, exit = $8, status = $9, updated_at = NOW() WHERE id = $10 RETURNING *", [JSON.stringify(answers), parsedResponse.risk_score, parsedResponse.threat_level, parsedResponse.reversibility_level, parsedResponse.primary_obstacle, JSON.stringify(parsedResponse.timeline), JSON.stringify(parsedResponse.blast_radius), JSON.stringify(parsedResponse.exit), "COMPLETED", id])
  res.json(result.rows[0])
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
