import { useState } from "react";
import { LeftSidebar } from "../components/LeftSidebar";
import backgroundImage from "../assets/Risk_Background.jpg";

export function Risk() {
  const [stage, setStage] = useState<"terminal" | "probe" | "dashboard">("terminal");
  const [decision, setDecision] = useState("");
  const [constraint1, setConstraint1] = useState("");
  const [constraint2, setConstraint2] = useState("");
  const [constraint3, setConstraint3] = useState("");

  const reset = () => {
    setDecision("");
    setConstraint1("");
    setConstraint2("");
    setConstraint3("");
    setStage("terminal");
  };

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

        {stage !== "dashboard" && (
          <div className="border border-slate-700/50 bg-slate-900/80 p-4 backdrop-blur-sm">
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
              onClick={() => setStage("probe")}
              className="mt-4 w-full border border-rose-500/40 bg-rose-500/10 py-2.5 text-sm tracking-widest text-rose-400 transition-colors hover:bg-rose-500/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              [INITIALIZE DIAGNOSIS &gt;]
            </button>
          </div>
        )}

        {stage === "dashboard" && (
          <>
            <section className="grid grid-cols-3 gap-4">
              <div className="border border-rose-800/40 bg-slate-950/80 p-4 backdrop-blur-sm">
                <p className="mb-2 text-xs tracking-widest text-zinc-500">[THREAT LEVEL]</p>
                <p className="text-3xl font-bold text-rose-400">88%</p>
                <p className="mt-1 text-xs tracking-widest text-rose-500">CRITICAL</p>
              </div>
              <div className="border border-slate-700/50 bg-slate-950/80 p-4 backdrop-blur-sm">
                <p className="mb-2 text-xs tracking-widest text-zinc-500">[REVERSIBILITY INDEX]</p>
                <span className="inline-block border border-rose-500/40 bg-rose-500/10 px-3 py-1 text-sm tracking-widest text-rose-400">
                  IRREVERSIBLE
                </span>
              </div>
              <div className="border border-slate-700/50 bg-slate-950/80 p-4 backdrop-blur-sm">
                <p className="mb-2 text-xs tracking-widest text-zinc-500">[PRIMARY FAILURE VECTOR]</p>
                <p className="text-sm leading-relaxed text-amber-400">
                  Runway exhaustion before the pivot completes.
                </p>
              </div>
            </section>

            <div className="mt-6 grid grid-cols-5 gap-6">
              <div className="col-span-3 border border-slate-700/50 bg-slate-950/80 p-5 backdrop-blur-sm">
                <p className="mb-5 text-xs tracking-widest text-zinc-500">[CASCADING FAILURE TIMELINE]</p>
                <div className="relative space-y-8 border-l-2 border-rose-500/30 pl-6">
                  <div className="relative">
                    <span className="absolute top-1 -left-7.25 h-3 w-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                    <p className="text-xs tracking-widest text-amber-400">[MONTH 1: INCEPTION FRICTION]</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                      Zero incoming revenue. Fixed costs continue unabated, drawn entirely from savings.
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute top-1 -left-7.25 h-3 w-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                    <p className="text-xs tracking-widest text-amber-400">[MONTH 3: RUNWAY CRITICAL]</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                      Liquid buffer drops to 20% remaining. Decision fatigue and stress compound, degrading judgment.
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute top-1 -left-7.25 h-3 w-3 rounded-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.8)]" />
                    <p className="text-xs tracking-widest text-amber-400">[MONTH 6: PIVOT POINT]</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                      Forced to accept a low-tier fallback role just to sustain rent and dependent obligations.
                    </p>
                  </div>
                  <div className="relative">
                    <span className="absolute top-1 -left-7.25 h-3 w-3 rounded-full bg-rose-600 shadow-[0_0_14px_rgba(244,63,94,1)]" />
                    <p className="text-xs tracking-widest text-rose-400">[MONTH 9: TERMINAL POINT]</p>
                    <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                      Original position is no longer recoverable. Recovery plan shifts from "return" to "rebuild."
                    </p>
                  </div>
                </div>
              </div>

              <div className="col-span-2 flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="border border-slate-700/50 bg-slate-950/80 p-3 backdrop-blur-sm">
                    <p className="mb-1.5 text-[10px] tracking-widest text-zinc-500">[FINANCIAL DRAWDOWN]</p>
                    <p className="text-xl font-semibold text-rose-400">-$18,400</p>
                  </div>
                  <div className="border border-slate-700/50 bg-slate-950/80 p-3 backdrop-blur-sm">
                    <p className="mb-1.5 text-[10px] tracking-widest text-zinc-500">[TIME LOSS]</p>
                    <p className="text-xl font-semibold text-amber-400">6mo</p>
                  </div>
                  <div className="border border-slate-700/50 bg-slate-950/80 p-3 backdrop-blur-sm">
                    <p className="mb-1.5 text-[10px] tracking-widest text-zinc-500">[OPPORTUNITY COST]</p>
                    <p className="text-xl font-semibold text-amber-400">7.2/10</p>
                  </div>
                  <div className="border border-slate-700/50 bg-slate-950/80 p-3 backdrop-blur-sm">
                    <p className="mb-1.5 text-[10px] tracking-widest text-zinc-500">[STRESS LOAD]</p>
                    <p className="text-xl font-semibold text-amber-400">8.4/10</p>
                  </div>
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
                    <p className="text-xs tracking-widest text-rose-400">[CIRCUIT BREAKERS]</p>
                  </div>
                  <div className="space-y-3 text-xs leading-relaxed text-zinc-400">
                    <p className="border-b border-rose-500/20 pb-3">
                      <span className="text-rose-400">⚠</span> If savings drop below $5,000, halt immediately and liquidate non-essential assets.
                    </p>
                    <p className="border-b border-rose-500/20 pb-3">
                      <span className="text-rose-400">⚠</span> If recovery time exceeds 6 months, execute fallback re-entry to prior industry.
                    </p>
                    <p>
                      <span className="text-rose-400">⚠</span> If dependents' baseline needs are unmet for 2+ consecutive months, abort and reassess.
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
          <div className="w-full max-w-md border border-rose-500/40 bg-slate-950/90 p-5 font-mono shadow-[0_0_40px_rgba(244,63,94,0.15)] backdrop-blur-sm">
            <p className="mb-1 text-xs tracking-widest text-amber-400">[DIAGNOSTIC CROSS-EXAMINATION]</p>
            <p className="mb-4 text-xs text-zinc-500">Answer these to sharpen the simulation, or skip to an estimate.</p>

            <label className="mb-1 block text-xs text-zinc-500">Liquid runway / financial buffer</label>
            <input
              type="text"
              value={constraint1}
              onChange={(e) => setConstraint1(e.target.value)}
              placeholder="e.g. 6 months of expenses saved"
              className="mb-4 w-full border border-slate-700/50 bg-black/40 p-2 text-sm text-zinc-300 outline-none focus:border-rose-500/50"
            />

            <label className="mb-1 block text-xs text-zinc-500">Key commitments / dependents</label>
            <input
              type="text"
              value={constraint2}
              onChange={(e) => setConstraint2(e.target.value)}
              placeholder="e.g. 1 dependent, rent due monthly"
              className="mb-4 w-full border border-slate-700/50 bg-black/40 p-2 text-sm text-zinc-300 outline-none focus:border-rose-500/50"
            />

            <label className="mb-1 block text-xs text-zinc-500">Hard exit date / non-negotiables</label>
            <input
              type="text"
              value={constraint3}
              onChange={(e) => setConstraint3(e.target.value)}
              placeholder="e.g. Must be stable again within 1 year"
              className="mb-5 w-full border border-slate-700/50 bg-black/40 p-2 text-sm text-zinc-300 outline-none focus:border-rose-500/50"
            />

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setStage("dashboard")}
                className="border border-slate-700/50 px-4 py-2 text-xs tracking-widest text-zinc-500 transition-colors hover:border-zinc-500 hover:text-zinc-300"
              >
                [SKIP &amp; ESTIMATE]
              </button>
              <button
                type="button"
                onClick={() => setStage("dashboard")}
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
}
