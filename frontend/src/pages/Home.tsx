import { useEffect, useState } from "react";
import { LeftSidebar } from "../components/LeftSidebar";
import backgroundImage from "../assets/Background.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";

const accentClasses: Record<string, { text: string; ring: string }> = {
  sky: { text: "text-sky-400", ring: "hover:border-sky-500/50" },
  red: { text: "text-red-400", ring: "hover:border-red-500/50" },
  amber: { text: "text-amber-400", ring: "hover:border-amber-500/50" },
};

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate()
  const {isLoaded, userId} = useAuth()
  useEffect(() => {
    if(isLoaded && !userId){
        navigate("/intermission")
    }
  }, [isLoaded, userId, navigate])
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex min-h-screen font-mono text-zinc-300">
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="fixed inset-0 -z-10 bg-black/60" />

      <LeftSidebar />

      <main
        className="relative flex-1 overflow-y-auto px-10 py-8"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      >
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
              Proof<span className="bg-linear-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">Forge</span>
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              Stress-test your arguments, your debates, and your decisions.
            </p>
          </div>
          <div className="flex items-center gap-2 border border-zinc-700 bg-zinc-950/70 px-3 py-1.5 text-xs tracking-wide text-zinc-400 backdrop-blur-sm">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            [ALL SYSTEMS NOMINAL]
          </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 animate-pulse border border-zinc-700 bg-zinc-950/70 backdrop-blur-sm" />
            <div className="h-24 animate-pulse border border-zinc-700 bg-zinc-950/70 backdrop-blur-sm" />
            <div className="h-24 animate-pulse border border-zinc-700 bg-zinc-950/70 backdrop-blur-sm" />
          </div>
        ) : (
          <section className="grid grid-cols-3 gap-4">
            <div className={`border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm transition-colors ${accentClasses.sky.ring}`}>
              <p className={`mb-3 flex items-center gap-2 text-xs tracking-widest ${accentClasses.sky.text}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-4 w-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM21 21l-4.35-4.35"
                  />
                </svg>
                [DOCUMENTS SCRUTINIZED]
              </p>
              <p className="text-2xl font-semibold text-zinc-50">128</p>
              <p className="mt-1 text-xs text-zinc-500">+12% this week</p>
            </div>

            <div className={`border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm transition-colors ${accentClasses.red.ring}`}>
              <p className={`mb-3 flex items-center gap-2 text-xs tracking-widest ${accentClasses.red.text}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-4 w-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 9.75h7.5M8.25 12.75h4.5M21 12c0 4.556-4.03 8.25-9 8.25-1.11 0-2.172-.184-3.15-.522L3 21l1.395-4.185C3.512 15.523 3 13.822 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                  />
                </svg>
                [DEBATES SIMULATED]
              </p>
              <p className="text-2xl font-semibold text-zinc-50">34</p>
              <p className="mt-1 text-xs text-zinc-500">+4% this week</p>
            </div>

            <div className={`border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm transition-colors ${accentClasses.amber.ring}`}>
              <p className={`mb-3 flex items-center gap-2 text-xs tracking-widest ${accentClasses.amber.text}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-4 w-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m0 3h.008v.008H12v-.008ZM9.401 3.6 1.67 17.25a1.5 1.5 0 0 0 1.299 2.25h18.062a1.5 1.5 0 0 0 1.299-2.25L14.599 3.6a1.5 1.5 0 0 0-2.598 0Z"
                  />
                </svg>
                [RISKS ASSESSED]
              </p>
              <p className="text-2xl font-semibold text-zinc-50">19</p>
              <p className="mt-1 text-xs text-zinc-500">-2% this week</p>
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="mb-3 text-xs tracking-widest text-zinc-500">[TOOLS]</h2>
          <div className="grid grid-cols-3 gap-4">
            <div
              onClick={() => navigate("/scrutinize")}
              className={`group cursor-pointer border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm transition-colors hover:bg-zinc-900 ${accentClasses.sky.ring}`}
            >
              <p className={`mb-2 flex items-center gap-2 text-xs tracking-widest ${accentClasses.sky.text}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-4 w-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM21 21l-4.35-4.35"
                  />
                </svg>
                [TEXT SCRUTINIZER]
              </p>
              <p className="text-xs leading-relaxed text-zinc-500">
                Extracts the premise, maps the logical chains, and flags unproven leaps, weak evidence, and absolute claims.
              </p>
              <span className={`mt-2 inline-block text-xs opacity-0 transition-opacity group-hover:opacity-100 ${accentClasses.sky.text}`}>
                Open &rarr;
              </span>
            </div>

            <div
              onClick={() => navigate("/debate")}
              className={`group cursor-pointer border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm transition-colors hover:bg-zinc-900 ${accentClasses.red.ring}`}
            >
              <p className={`mb-2 flex items-center gap-2 text-xs tracking-widest ${accentClasses.red.text}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-4 w-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 9.75h7.5M8.25 12.75h4.5M21 12c0 4.556-4.03 8.25-9 8.25-1.11 0-2.172-.184-3.15-.522L3 21l1.395-4.185C3.512 15.523 3 13.822 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                  />
                </svg>
                [DEBATE SIMULATOR]
              </p>
              <p className="text-xs leading-relaxed text-zinc-500">
                A live back-and-forth — state your point and get interrupted on the spot by an AI opponent.
              </p>
              <span className={`mt-2 inline-block text-xs opacity-0 transition-opacity group-hover:opacity-100 ${accentClasses.red.text}`}>
                Open &rarr;
              </span>
            </div>

            <div
              onClick={() => navigate("/risk")}
              className={`group cursor-pointer border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm transition-colors hover:bg-zinc-900 ${accentClasses.amber.ring}`}
            >
              <p className={`mb-2 flex items-center gap-2 text-xs tracking-widest ${accentClasses.amber.text}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-4 w-4">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m0 3h.008v.008H12v-.008ZM9.401 3.6 1.67 17.25a1.5 1.5 0 0 0 1.299 2.25h18.062a1.5 1.5 0 0 0 1.299-2.25L14.599 3.6a1.5 1.5 0 0 0-2.598 0Z"
                  />
                </svg>
                [RISK SIMULATOR]
              </p>
              <p className="text-xs leading-relaxed text-zinc-500">
                Feed in your options and their risks to see the worst-case scenario mapped out for each.
              </p>
              <span className={`mt-2 inline-block text-xs opacity-0 transition-opacity group-hover:opacity-100 ${accentClasses.amber.text}`}>
                Open &rarr;
              </span>
            </div>
          </div>
        </section>

        <section className="mt-10 pb-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-xs tracking-widest text-zinc-500">[RECENT ACTIVITY]</h2>
            <span className="text-xs text-zinc-600">View all &rarr;</span>
          </div>
          <div className="border border-zinc-700 bg-zinc-950/70 backdrop-blur-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-900/60 text-xs tracking-widest text-zinc-500">
                <tr className="border-b border-zinc-800">
                  <th className="px-5 py-3 font-normal">TOOL</th>
                  <th className="px-5 py-3 font-normal">SUMMARY</th>
                  <th className="px-5 py-3 font-normal">VERDICT</th>
                  <th className="px-5 py-3 font-normal">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                <tr className="transition-colors hover:bg-zinc-900/60">
                  <td className="px-5 py-3">
                    <span className="inline-flex items-center gap-2 text-zinc-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                      Text Scrutinizer
                    </span>
                  </td>
                  <td className="px-5 py-3 text-zinc-400">
                    "This policy will always improve outcomes for everyone."
                  </td>
                  <td className="px-5 py-3">
                    <span className="border border-amber-500/20 bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-400">
                      2 weak claims flagged
                    </span>
                  </td>
                  <td className="px-5 py-3 text-zinc-500">Aug 14, 2026</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
