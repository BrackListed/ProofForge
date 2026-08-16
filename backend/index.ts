import "dotenv/config"
import express from "express"
import cors from "cors"
import { Pool } from "pg"
import { drizzle } from "drizzle-orm/node-postgres"
import { clerkMiddleware } from '@clerk/express'
import { verifyWebhook } from "@clerk/express/webhooks"
import Groq from "groq-sdk";
import multer from "multer"
import path from "path"
const app = express()
const pool = new Pool({connectionString: process.env.DATABASE_URL})
const db = drizzle(process.env.DATABASE_URL!)
import OpenAI from 'openai';


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
const client = new OpenAI({
  baseURL: 'https://api.featherless.ai/v1',
  apiKey: process.env.OPENAPI_API_KEY,
});


app.get("/test", (req, res) => {
  res.json({ message: "Backend is alive and connected!" })
})

app.get("/logs/scrutinize/:userId", async(req, res) => {
  const {userId} = req.params
  const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
  const result = await pool.query("SELECT * FROM scrutinize WHERE user_id = $1 ORDER BY created_at DESC", [id.rows[0].id])
  res.json(result.rows)
})

app.get("/rooms/:userId", async(req, res) => {
  const {userId} = req.params
  const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
  const result = await pool.query("SELECT * FROM debate_room WHERE user_id = $1", [id.rows[0].id])
  res.json(result.rows)
})

app.post("/scrutinize/:userId", async(req, res) => {
  const {userId} = req.params
  const {text, file} = req.body
  const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
  if(text){
    const completions = await client.chat.completions.create({
      model: "Qwen/Qwen2.5-32B-Instruct",
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
    const dbInsert = await pool.query("INSERT INTO scrutinize(user_id, content, premise, logic, flags, flag_count) VALUES($1, $2, $3, $4, $5, $6) RETURNING *", [id.rows[0].id, text, data.extractedPremise, JSON.stringify(data.logic || []), JSON.stringify(data.flags || []), (data.flags || []).length])
    return res.json(dbInsert.rows[0])
  }
})

app.post("/create-room/:userId", async(req, res) => {
  const {userId} = req.params
  const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
  const {title, topic} = req.body
  const result = await pool.query("INSERT INTO debate_room(user_id, title, topic) VALUES($1, $2, $3) RETURNING id", [id.rows[0].id, title, topic])
  res.json(result.rows[0].id)
})

app.post("/process-argument/:userId/:roomId", async(req, res) => {
  const {userId, roomId} = req.params
  const {argument} = req.body
  const id = await pool.query("SELECT id FROM users WHERE clerk_user_id = $1", [userId])
  const result = await pool.query("SELECT transcript FROM debate_logs WHERE user_id = $1 AND room_id = $2", [id.rows[0].id, roomId])
  let transcript = []
  if (result.rows.length > 0) {
    transcript = result.rows[0].transcript;
  }
  const completions = await client.chat.completions.create({
    model: "meta-llama/Meta-Llama-3.1-8B-Instruct",
    response_format: {type: "json_object"},
    messages: [{
      role: "system",
      content: `You are an expert debate opponent. Review the conversation history. Call out evasions or weak points from previous turns if unaddressed, then cross-examine the latest argument. You MUST respond strictly in JSON using this exact format: 
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
    text: reply
  })

  await pool.query("UPDATE debate_logs SET transcript = $1, updated_at = NOW() WHERE room_id = $2 AND user_id = $3", [JSON.stringify(transcript), roomId, id.rows[0].id])
  return res.json(parsedReply)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server listening on port ${PORT}`))
