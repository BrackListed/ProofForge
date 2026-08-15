import { useEffect, useState } from "react";
import { LeftSidebar } from "../components/LeftSidebar";
import backgroundImage from "../assets/Background.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";

const accentClasses: Record<string, { badge: string; text: string; ring: string }> = {
  sky: { badge: "bg-sky-500/10 text-sky-400 ring-sky-500/20", text: "text-sky-400", ring: "hover:border-sky-500/50" },
  red: {
    badge: "bg-red-500/10 text-red-400 ring-red-500/20",
    text: "text-red-400",
    ring: "hover:border-red-500/50",
  },
  amber: {
    badge: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
    text: "text-amber-400",
    ring: "hover:border-amber-500/50",
  },
};

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate()
  const {userId} = useAuth()
  useEffect(() => {
    if(!userId){
        navigate("/intermission")
    }
  }, [userId])
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex min-h-screen text-zinc-100">
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="fixed inset-0 -z-10 bg-black/60" />

      <LeftSidebar />

      <main className="flex-1 overflow-y-auto px-10 py-8">
        <header className="mb-8 flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-50">
              Proof<span className="bg-linear-to-r from-indigo-400 to-sky-400 bg-clip-text text-transparent">Forge</span>
            </h1>
            <p className="mt-1.5 text-sm text-zinc-500">
              Stress-test your arguments, your debates, and your decisions.
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-zinc-500/25 bg-zinc-800/40 px-3 py-1.5 text-xs text-zinc-400 backdrop-blur-md">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
            All systems nominal
          </div>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-3 gap-4">
            <div className="h-24 animate-pulse rounded-xl border border-zinc-500/20 bg-zinc-800/30 backdrop-blur-md" />
            <div className="h-24 animate-pulse rounded-xl border border-zinc-500/20 bg-zinc-800/30 backdrop-blur-md" />
            <div className="h-24 animate-pulse rounded-xl border border-zinc-500/20 bg-zinc-800/30 backdrop-blur-md" />
          </div>
        ) : (
          <section className="grid grid-cols-3 gap-4">
            <div
              className={`rounded-xl border border-zinc-500/20 bg-zinc-800/30 backdrop-blur-md px-5 py-4 transition-colors ${accentClasses.sky.ring}`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ${accentClasses.sky.badge}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-4.5 w-4.5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM21 21l-4.35-4.35"
                    />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-zinc-500">+12% this week</span>
              </div>
              <p className="mt-3 text-2xl font-semibold text-zinc-50">128</p>
              <p className="mt-1 text-xs text-zinc-500">Documents Scrutinized</p>
            </div>

            <div
              className={`rounded-xl border border-zinc-500/20 bg-zinc-800/30 backdrop-blur-md px-5 py-4 transition-colors ${accentClasses.red.ring}`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ${accentClasses.red.badge}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-4.5 w-4.5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 9.75h7.5M8.25 12.75h4.5M21 12c0 4.556-4.03 8.25-9 8.25-1.11 0-2.172-.184-3.15-.522L3 21l1.395-4.185C3.512 15.523 3 13.822 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                    />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-zinc-500">+4% this week</span>
              </div>
              <p className="mt-3 text-2xl font-semibold text-zinc-50">34</p>
              <p className="mt-1 text-xs text-zinc-500">Debates Simulated</p>
            </div>

            <div
              className={`rounded-xl border border-zinc-500/20 bg-zinc-800/30 backdrop-blur-md px-5 py-4 transition-colors ${accentClasses.amber.ring}`}
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ${accentClasses.amber.badge}`}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-4.5 w-4.5">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 9v3.75m0 3h.008v.008H12v-.008ZM9.401 3.6 1.67 17.25a1.5 1.5 0 0 0 1.299 2.25h18.062a1.5 1.5 0 0 0 1.299-2.25L14.599 3.6a1.5 1.5 0 0 0-2.598 0Z"
                    />
                  </svg>
                </div>
                <span className="text-[11px] font-medium text-zinc-500">-2% this week</span>
              </div>
              <p className="mt-3 text-2xl font-semibold text-zinc-50">19</p>
              <p className="mt-1 text-xs text-zinc-500">Risks Assessed</p>
            </div>
          </section>
        )}

        <section className="mt-10">
          <h2 className="mb-3 text-sm font-medium text-zinc-400">Tools</h2>
          <div className="grid grid-cols-3 gap-4">
            <div
              className={`group rounded-xl border border-zinc-500/20 bg-zinc-800/30 backdrop-blur-md px-5 py-4 transition-all hover:-translate-y-0.5 hover:bg-zinc-800/45 ${accentClasses.sky.ring}`}
            >
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ${accentClasses.sky.badge}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-4.5 w-4.5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM21 21l-4.35-4.35"
                  />
                </svg>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-100">Text Scrutinizer</p>
                <span className={`text-xs opacity-0 transition-opacity group-hover:opacity-100 ${accentClasses.sky.text}`}>
                  Open &rarr;
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                Extracts the premise, maps the logical chains, and flags unproven leaps, weak evidence, and absolute claims.
              </p>
            </div>

            <div
              className={`group rounded-xl border border-zinc-500/20 bg-zinc-800/30 backdrop-blur-md px-5 py-4 transition-all hover:-translate-y-0.5 hover:bg-zinc-800/45 ${accentClasses.red.ring}`}
            >
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ${accentClasses.red.badge}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-4.5 w-4.5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 9.75h7.5M8.25 12.75h4.5M21 12c0 4.556-4.03 8.25-9 8.25-1.11 0-2.172-.184-3.15-.522L3 21l1.395-4.185C3.512 15.523 3 13.822 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                  />
                </svg>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-100">Debate Simulator</p>
                <span className={`text-xs opacity-0 transition-opacity group-hover:opacity-100 ${accentClasses.red.text}`}>
                  Open &rarr;
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                A live back-and-forth — state your point and get interrupted on the spot by an AI opponent.
              </p>
            </div>

            <div
              className={`group rounded-xl border border-zinc-500/20 bg-zinc-800/30 backdrop-blur-md px-5 py-4 transition-all hover:-translate-y-0.5 hover:bg-zinc-800/45 ${accentClasses.amber.ring}`}
            >
              <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ring-1 ring-inset ${accentClasses.amber.badge}`}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-4.5 w-4.5">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v3.75m0 3h.008v.008H12v-.008ZM9.401 3.6 1.67 17.25a1.5 1.5 0 0 0 1.299 2.25h18.062a1.5 1.5 0 0 0 1.299-2.25L14.599 3.6a1.5 1.5 0 0 0-2.598 0Z"
                  />
                </svg>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-zinc-100">Risk Simulator</p>
                <span className={`text-xs opacity-0 transition-opacity group-hover:opacity-100 ${accentClasses.amber.text}`}>
                  Open &rarr;
                </span>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                Feed in your options and their risks to see the worst-case scenario mapped out for each.
              </p>
            </div>
          </div>
        </section>

        <section className="mt-10 pb-10">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-medium text-zinc-400">Recent Activity</h2>
            <span className="text-xs text-zinc-600">View all &rarr;</span>
          </div>
          <div className="overflow-hidden rounded-xl border border-zinc-500/20 bg-zinc-800/25 backdrop-blur-md">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-800/30 text-xs uppercase tracking-wide text-zinc-500">
                <tr>
                  <th className="px-5 py-3 font-medium">Tool</th>
                  <th className="px-5 py-3 font-medium">Summary</th>
                  <th className="px-5 py-3 font-medium">Verdict</th>
                  <th className="px-5 py-3 font-medium">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-500/20">
                <tr className="transition-colors hover:bg-zinc-800/35">
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
                    <span className="rounded-full bg-amber-500/10 px-2 py-1 text-xs font-medium text-amber-400 ring-1 ring-inset ring-amber-500/20">
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
