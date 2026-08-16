import { useEffect, useState } from "react";
import { LeftSidebar } from "../components/LeftSidebar";
import backgroundImage from "../assets/Debate_Background.jpg";

function formatTime(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60).toString().padStart(2, "0");
  const seconds = (totalSeconds % 60).toString().padStart(2, "0");
  return `${minutes}:${seconds}`;
}

export function Debate() {
  const [argument, setArgument] = useState("");
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (isDone) return;
    const interval = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(interval);
  }, [isDone]);

  return (
    <div className="relative flex min-h-screen font-mono text-zinc-300">
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="fixed inset-0 -z-10 bg-black/70" />

      <LeftSidebar />

      <main
        className="relative flex-1 overflow-y-auto px-8 py-8"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <header className="mb-6">
          <h1 className="text-lg font-semibold tracking-wide text-zinc-100">
            Debate <span className="text-red-400">Simulator</span>
          </h1>
          <p className="mt-1 text-xs text-zinc-500">
            Speak or type your argument — the AI cuts in and interrupts you on the spot.
          </p>
        </header>

        <div className="grid grid-cols-2 gap-6">
          <div className="border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-xs tracking-widest text-zinc-500">[YOUR ARGUMENT]</p>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <span className={`h-1.5 w-1.5 rounded-full ${isDone ? "bg-zinc-600" : "bg-red-400 animate-pulse"}`} />
                {formatTime(seconds)}
              </div>
            </div>

            <div className="relative">
              <textarea
                value={argument}
                onChange={(e) => setArgument(e.target.value)}
                readOnly={isDone}
                placeholder="Start Typing your arguments... Or click start speaking at the bottom right of this box to speak instead"
                className="h-64 w-full resize-none border border-zinc-800 bg-black/60 p-3 pb-12 text-sm text-zinc-300 outline-none focus:border-red-500/50"
              />
              <button
                type="button"
                disabled={isDone}
                onClick={() => setIsSpeaking((v) => !v)}
                className={`absolute right-3 bottom-3 border px-3 py-1.5 text-xs tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-40 ${
                  isSpeaking
                    ? "border-red-500/60 bg-red-500/10 text-red-400"
                    : "border-zinc-700 bg-black/70 text-zinc-400 hover:border-red-500/50 hover:text-red-400"
                }`}
              >
                {isSpeaking ? "● Stop Speaking" : "Start Speaking"}
              </button>
            </div>
          </div>

          <div className="border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.75}
                stroke="currentColor"
                className="h-4 w-4 text-zinc-500"
              >
                <rect x="5" y="8" width="14" height="10" rx="2" />
                <path d="M12 8V5M9 5h6" />
                <path d="M3 12h2M19 12h2" />
                <circle cx="9.5" cy="13" r="1" fill="currentColor" stroke="none" />
                <circle cx="14.5" cy="13" r="1" fill="currentColor" stroke="none" />
              </svg>
              <p className="text-xs tracking-widest text-zinc-500">[AI RESPONSE]</p>
            </div>

            <textarea
              readOnly
              value=""
              placeholder="AI response will appear here..."
              className="h-64 w-full resize-none border border-zinc-800 bg-black/60 p-3 text-sm text-zinc-300 outline-none"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button
            type="button"
            disabled={isDone}
            onClick={() => setIsDone(true)}
            className="border border-zinc-700 px-10 py-2.5 text-sm tracking-wide text-zinc-300 transition-colors hover:border-red-500/50 hover:text-red-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isDone ? "✓ Done" : "> Done <"}
          </button>
        </div>
      </main>
    </div>
  );
}
