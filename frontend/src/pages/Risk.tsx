import { useEffect, useState } from "react";
import { LeftSidebar } from "../components/LeftSidebar";
import backgroundImage from "../assets/Risk_Background.jpg";
import { useAuth } from "@clerk/react";
import axios from "axios";
import { useTourPrefill } from "../tour/useTourPrefill";
import { useTourReady } from "../tour/useTourReady";
import { DEMO_RISK_ANSWERS, DEMO_RISK_DECISION, DEMO_RISK_FALLBACK_ANSWER } from "../tour/steps";


interface probingType{
    id: string
    question: string
    placeholder: string
}

interface answerType{
    id: string
    question: string
    answer: string
}

interface timelineType{
    step: number
    title: string
    description: string
    target_date: string
}

interface blast_radius{
    affected_area: string
    impact_level: "LOW" | "MEDIUM" | "HIGH"
    description: string
}

interface exitType{
    trigger: string
    action: string
    fallback_plan: string
}

const threatColor: Record<string, string> = {
  LOW: "text-emerald-400",
  MODERATE: "text-amber-400",
  CRITICAL: "text-rose-400",
};

const impactColor: Record<string, string> = {
  LOW: "text-emerald-400",
  MEDIUM: "text-amber-400",
  HIGH: "text-rose-400",
};

interface riskType{
    id: string
    user_id: string
    status: "PROBING" | "COMPLETED" | "FAILED"
    initial_decision: string
    category: string | null
    probing_questions: probingType[]
    user_answers: answerType[]
    risk_score: number
    threat_level: "LOW" | "MODERATE" | "CRITICAL"
    reversibility_level: "HIGH" | "MEDIUM" | "IRREVERSIBLE"
    primary_obstacle: string
    timeline: timelineType[]
    blast_radius: blast_radius[]
    exit: exitType
    createdAt: Date
    updatedAt: Date
}
export function Risk() {
  const [stage, setStage] = useState<"terminal" | "probe" | "dashboard">("terminal");
  const [decision, setDecision] = useState("");
  const {userId, getToken} = useAuth()
  const [risks, setRisks] = useState<riskType[]>([])
  const [selectedRisk, setSelectedRisk] = useState<riskType | undefined>(undefined)
  const [answers, setAnswers] = useState<Record<string, string>>({})

  useTourPrefill("risk-decision", stage === "terminal" && !decision, () => {
    setDecision(DEMO_RISK_DECISION);
  });

  useTourPrefill(
    "risk-answers",
    Boolean(selectedRisk?.probing_questions?.length) && Object.keys(answers).length === 0,
    () => {
      const prefilled: Record<string, string> = {};
      selectedRisk?.probing_questions.forEach((q) => {
        prefilled[q.id] = DEMO_RISK_ANSWERS[q.id] ?? DEMO_RISK_FALLBACK_ANSWER;
      });
      setAnswers(prefilled);
    }
  );

  useTourReady("risk-decision", Boolean(selectedRisk?.probing_questions?.length));
  useTourReady("risk-answers", selectedRisk?.status === "COMPLETED");

  const reset = () => {
    setDecision("");
    setAnswers({});
    setSelectedRisk(undefined);
    setStage("terminal");
  };

  const selectRisk = (risk: riskType) => {
    setSelectedRisk(risk);
    setAnswers({});
    setStage(risk.status === "COMPLETED" ? "dashboard" : "probe");
  };

  const fetchRisks = async (userId: string | null | undefined) => {
    if (!userId) return;
    const token = await getToken()
    const result = await axios.get(`http://localhost:5000/risks/${userId}`, {headers: {Authorization: `Bearer ${token}`}})
    setRisks(Array.isArray(result.data) ? result.data : [])
  }

  useEffect(() => {
    const timeout = setTimeout(() => fetchRisks(userId), 0);
    return () => clearTimeout(timeout);
  }, [userId])

  return (
    <div className="relative flex min-h-screen font-mono text-zinc-300">
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="fixed inset-0 -z-10 bg-[#090d16]/60" />

      <LeftSidebar />

      <main
        className="relative flex-1 overflow-y-auto px-8 py-8"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <header className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-lg font-semibold tracking-widest text-zinc-100">
              [RISK <span className="text-rose-400">SIMULATOR</span>]
            </h1>
            <p className="mt-1 text-xs text-zinc-500">
              Diagnostic stress-testing for high-stakes personal decisions.
            </p>
          </div>
          {stage === "dashboard" && (
            <button
              type="button"
              onClick={reset}
              className="text-xs tracking-wide text-zinc-500 transition-colors hover:text-rose-400"
            >
              &larr; New Diagnosis
            </button>
          )}
        </header>

        <div className="mb-6 flex flex-wrap items-center gap-2">
          <p className="mr-1 text-xs tracking-widest text-zinc-500">[RISKS]</p>
          {risks.length === 0 && <p className="text-xs text-zinc-600">No risks yet.</p>}
          {risks.map((risk) => (
            <button
              key={risk.id}
              type="button"
              onClick={() => selectRisk(risk)}
              className={`border px-3 py-1.5 text-xs tracking-wide transition-colors ${
                selectedRisk?.id === risk.id
                  ? "border-rose-500/60 bg-rose-500/10 text-rose-400"
                  : "border-slate-700/50 text-zinc-400 hover:border-rose-500/40 hover:text-rose-400"
              }`}
            >
              {risk.category ? risk.category.replace(/_/g, " ").toUpperCase() : "UNCATEGORIZED"}
            </button>
          ))}
        </div>

        {stage !== "dashboard" && (
          <div data-tour="risk-decision-input" className="border border-slate-700/50 bg-slate-900/80 p-4 backdrop-blur-sm">
            <p className="mb-3 text-xs tracking-widest text-zinc-500">[DECISION TERMINAL]</p>
            <textarea
              value={decision}
              onChange={(e) => setDecision(e.target.value)}
              readOnly={stage === "probe"}
              placeholder="State the decision or dilemma you are considering..."
              className="h-40 w-full resize-none border border-slate-700/50 bg-black/40 p-3 text-sm text-zinc-300 outline-none focus:border-rose-500/50"
            />
            <button
              type="button"
              disabled={!decision.trim()}
              onClick={() => {setStage("probe"); processDecision(decision, userId)}}
              className="mt-4 w-full border border-rose-500/40 bg-rose-500/10 py-2.5 text-sm tracking-widest text-rose-400 transition-colors hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              [INITIALIZE DIAGNOSIS &gt;]
            </button>
          </div>
        )}

        {stage === "dashboard" && (!selectedRisk || selectedRisk.status !== "COMPLETED") && (
          <div className="flex items-center gap-2 border border-slate-700/50 bg-slate-950/80 p-8 text-xs text-zinc-500 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" />
            Running full stress test...
          </div>
        )}

        {stage === "dashboard" && selectedRisk && selectedRisk.status === "COMPLETED" && (
          <>
            <section data-tour="risk-threat" className="grid grid-cols-3 gap-4">
              <div className="border border-rose-800/40 bg-slate-950/80 p-4 backdrop-blur-sm">
                <p className="mb-2 text-xs tracking-widest text-zinc-500">[THREAT LEVEL]</p>
                <p className={`text-3xl font-bold ${threatColor[selectedRisk.threat_level] ?? "text-rose-400"}`}>
                  {selectedRisk.risk_score}%
                </p>
                <p className={`mt-1 text-xs tracking-widest ${threatColor[selectedRisk.threat_level] ?? "text-rose-500"}`}>
                  {selectedRisk.threat_level}
                </p>
              </div>
              <div className="border border-slate-700/50 bg-slate-950/80 p-4 backdrop-blur-sm">
                <p className="mb-2 text-xs tracking-widest text-zinc-500">[REVERSIBILITY INDEX]</p>
                <span className="inline-block border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-sm tracking-widest text-rose-400">
                  {selectedRisk.reversibility_level}
                </span>
              </div>
              <div className="border border-slate-700/50 bg-slate-950/80 p-4 backdrop-blur-sm">
                <p className="mb-2 text-xs tracking-widest text-zinc-500">[PRIMARY FAILURE VECTOR]</p>
                <p className="text-sm leading-relaxed text-amber-400">
                  {selectedRisk.primary_obstacle}
                </p>
              </div>
            </section>

            <div className="mt-6 grid grid-cols-5 gap-6">
              <div data-tour="risk-timeline" className="col-span-3 border border-slate-700/50 bg-slate-950/80 p-5 backdrop-blur-sm">
                <p className="mb-5 text-xs tracking-widest text-zinc-500">[CASCADING FAILURE TIMELINE]</p>
                <div className="relative space-y-8 border-l-2 border-rose-500/30 pl-6">
                  {selectedRisk.timeline.map((t, i) => {
                    const isLast = i === selectedRisk.timeline.length - 1;
                    return (
                      <div key={t.step} className="relative">
                        <span
                          className={`absolute top-1 -left-7.25 h-3 w-3 rounded-full ${
                            isLast
                              ? "bg-rose-600 shadow-[0_0_14px_rgba(244,63,94,1)]"
                              : "bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]"
                          }`}
                        />
                        <p className={`text-xs tracking-widest ${isLast ? "text-rose-400" : "text-amber-400"}`}>
                          [{t.title.toUpperCase()}]
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">{t.description}</p>
                        <p className="mt-1 text-[10px] tracking-widest text-zinc-600">TARGET: {t.target_date}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div data-tour="risk-consequences" className="col-span-2 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  {selectedRisk.blast_radius.map((b, i) => (
                    <div key={i} className="border border-slate-700/50 bg-slate-950/80 p-3 backdrop-blur-sm">
                      <p className="mb-1.5 text-[10px] tracking-widest text-zinc-500">{b.affected_area.toUpperCase()}</p>
                      <p className={`text-sm font-semibold ${impactColor[b.impact_level] ?? "text-amber-400"}`}>
                        {b.impact_level}
                      </p>
                      <p className="mt-1 text-xs leading-relaxed text-zinc-500">{b.description}</p>
                    </div>
                  ))}
                </div>

                <div className="flex-1 border border-rose-800/40 bg-rose-950/20 p-4 backdrop-blur-sm">
                  <div className="mb-3 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-4 w-4 text-rose-400">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 9v3.75m0 3h.008v.008H12v-.008ZM9.401 3.6 1.67 17.25a1.5 1.5 0 0 0 1.299 2.25h18.062a1.5 1.5 0 0 0 1.299-2.25L14.599 3.6a1.5 1.5 0 0 0-2.598 0Z"
                      />
                    </svg>
                    <p className="text-xs tracking-widest text-rose-400">[EXIT PLAN]</p>
                  </div>
                  <div className="space-y-3 text-xs leading-relaxed text-zinc-400">
                    <p>
                      <span className="text-rose-400">⚠ IF</span> {selectedRisk.exit.trigger}
                    </p>
                    <p>
                      <span className="text-rose-400">&rarr; THEN</span> {selectedRisk.exit.action}
                    </p>
                    <p className="border-t border-rose-500/20 pt-3 text-zinc-500">
                      {selectedRisk.exit.fallback_plan}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {stage === "probe" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div data-tour="risk-answers" className="flex max-h-[85vh] w-full max-w-md flex-col border border-rose-500/40 bg-slate-950/90 font-mono shadow-[0_0_40px_rgba(244,63,94,0.15)] backdrop-blur-sm">
            <div className="p-5 pb-1">
              <p className="mb-1 text-xs tracking-widest text-amber-400">[DIAGNOSTIC CROSS-EXAMINATION]</p>
              <p className="text-xs text-zinc-500">
                Category: <span className="text-rose-400">{selectedRisk?.category ?? "—"}</span>
                {"  ·  "}
                Status: <span className="text-rose-400">{selectedRisk?.status ?? "—"}</span>
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-5 py-4">
              {!selectedRisk?.probing_questions?.length ? (
                <div className="flex items-center gap-2 py-8 text-xs text-zinc-500">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-rose-400" />
                  Analyzing your decision...
                </div>
              ) : (
                selectedRisk.probing_questions.map((q) => (
                  <div key={q.id} className="mb-4 last:mb-0">
                    <label className="mb-1 block text-xs text-zinc-500">{q.question}</label>
                    <input
                      type="text"
                      value={answers[q.id] ?? ""}
                      onChange={(e) => setAnswers((prev) => ({ ...prev, [q.id]: e.target.value }))}
                      placeholder={q.placeholder}
                      className="w-full border border-slate-700/50 bg-black/40 p-2 text-sm text-zinc-300 outline-none focus:border-rose-500/50"
                    />
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end gap-3 border-t border-slate-800 p-5 pt-4">
              <button
                type="button"
                onClick={() => setStage("dashboard")}
                className="border border-slate-700/50 px-4 py-2 text-xs tracking-widest text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-300"
              >
                [SKIP &amp; ESTIMATE]
              </button>
              <button
                type="button"
                onClick={() => {
                  const payload: answerType[] = selectedRisk?.probing_questions.map((q) => ({
                    id: q.id,
                    question: q.question,
                    answer: answers[q.id] ?? "",
                  })) ?? [];
                  setStage("dashboard");
                  stressTest(payload, selectedRisk?.initial_decision, selectedRisk?.category, selectedRisk!.id);
                }}
                className="border border-rose-500 bg-rose-600 px-4 py-2 text-xs tracking-widest text-white shadow-[0_0_20px_rgba(244,63,94,0.5)] transition-colors hover:bg-rose-500"
              >
                [RUN FULL STRESS-TEST]
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  async function processDecision(decision: string, userId: string | null | undefined){
    if(!userId) return
    setSelectedRisk(undefined)
    setAnswers({})
    const token = await getToken()
    const result = await axios.post(`http://localhost:5000/analyze-risk/${userId}`, {decision: decision}, {headers: {Authorization: `Bearer ${token}`}})
    await fetchRisks(userId)
    setSelectedRisk(result.data)
  }
  async function stressTest(answers: answerType[] | undefined, initialDecision: string | undefined, category: string | null | undefined, id: string){
    const token = await getToken()
    const result = await axios.post(`http://localhost:5000/analyze-risk/answers/${id}`, {answers: answers, initialDecision: initialDecision, category: category}, {headers: {Authorization: `Bearer ${token}`}})
    const completedRisk: riskType = result.data
    setSelectedRisk(completedRisk)
    setRisks((prev) => prev.map((r) => (r.id === completedRisk.id ? completedRisk : r)))
  }
}
