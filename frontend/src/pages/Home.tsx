import { useEffect, useState } from "react";
import { LeftSidebar } from "../components/LeftSidebar";
import backgroundImage from "../assets/Background.jpg";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/react";
import axios from "axios";
import { motion } from "framer-motion";
import { useTour, TOUR_STORAGE_KEY } from "../tour/useTour";
import { fullTourSteps } from "../tour/steps";
import { API_BASE_URL } from "../lib/api";

interface statsType {
  scrutinized: number
  debates: number
  risks: number
}

interface activityType {
  tool: "Text Scrutinizer" | "Debate Simulator" | "Risk Simulator"
  summary: string
  verdict: string
  tone: "clean" | "warn" | "bad" | "neutral"
  date: string
}

const DEMO_STATS: statsType = { scrutinized: 12, debates: 5, risks: 3 };

const DEMO_ACTIVITY: activityType[] = [
  { tool: "Text Scrutinizer", summary: "\"This policy will always improve outcomes for everyone.\"", verdict: "2 issues flagged", tone: "warn", date: "2026-08-14T00:00:00.000Z" },
  { tool: "Risk Simulator", summary: "Quit my job to freelance full-time", verdict: "MODERATE risk", tone: "warn", date: "2026-08-12T00:00:00.000Z" },
  { tool: "Debate Simulator", summary: "Remote work vs. return to office", verdict: "6 exchanges", tone: "neutral", date: "2026-08-10T00:00:00.000Z" },
];

const accentClasses: Record<string, { text: string; ring: string }> = {
  sky: { text: "text-sky-400", ring: "hover:border-sky-500/50" },
  red: { text: "text-red-400", ring: "hover:border-red-500/50" },
  amber: { text: "text-amber-400", ring: "hover:border-amber-500/50" },
};

const toolDotClasses: Record<activityType["tool"], string> = {
  "Text Scrutinizer": "bg-sky-400",
  "Debate Simulator": "bg-red-400",
  "Risk Simulator": "bg-amber-400",
};

const toneClasses: Record<activityType["tone"], string> = {
  clean: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
  warn: "border-amber-500/20 bg-amber-500/10 text-amber-400",
  bad: "border-rose-500/20 bg-rose-500/10 text-rose-400",
  neutral: "border-zinc-600/30 bg-zinc-500/10 text-zinc-400",
};

export function Home() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<statsType>({ scrutinized: 0, debates: 0, risks: 0 });
  const [activity, setActivity] = useState<activityType[]>([]);
  const navigate = useNavigate()
  const {isLoaded, userId, getToken} = useAuth()
  const tour = useTour()
  useEffect(() => {
    if(isLoaded && !userId){
        navigate("/intermission")
    }
  }, [isLoaded, userId, navigate])
  useEffect(() => {
    const fetchStats = async () => {
      if (!userId) return;
      const token = await getToken()
      const result = await axios.get<statsType>(`${API_BASE_URL}/stats/${userId}`, {headers: {Authorization: `Bearer ${token}`}})
      setStats(result.data)
      setIsLoading(false)
    };
    fetchStats();
  }, [userId, getToken]);
  useEffect(() => {
    const fetchActivity = async () => {
      if (!userId) return;
      const token = await getToken()
      const result = await axios.get<activityType[]>(`${API_BASE_URL}/activity/${userId}`, {headers: {Authorization: `Bearer ${token}`}})
      setActivity(result.data)
    };
    fetchActivity();
  }, [userId, getToken]);
  useEffect(() => {
    if (isLoaded && userId && !localStorage.getItem(TOUR_STORAGE_KEY)) {
      tour.start(fullTourSteps);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded, userId]);

  const displayStats = tour.isActive ? DEMO_STATS : stats;
  const displayActivity = tour.isActive ? DEMO_ACTIVITY : activity;

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
          <section data-tour="stat-cards" className="grid grid-cols-3 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm transition-colors ${accentClasses.sky.ring}`}
            >
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
              <p className="text-2xl font-semibold text-zinc-50">{displayStats.scrutinized}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.05 }}
              className={`border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm transition-colors ${accentClasses.red.ring}`}
            >
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
              <p className="text-2xl font-semibold text-zinc-50">{displayStats.debates}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className={`border border-zinc-700 bg-zinc-950/70 p-4 backdrop-blur-sm transition-colors ${accentClasses.amber.ring}`}
            >
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
              <p className="text-2xl font-semibold text-zinc-50">{displayStats.risks}</p>
            </motion.div>
          </section>
        )}

        <section data-tour="tools-grid" className="mt-10">
          <h2 className="mb-3 text-xs tracking-widest text-zinc-500">[TOOLS]</h2>
          <div className="grid grid-cols-3 gap-4">
            <motion.div
              onClick={() => navigate("/scrutinize")}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
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
            </motion.div>

            <motion.div
              onClick={() => navigate("/debate")}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
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
            </motion.div>

            <motion.div
              onClick={() => navigate("/risk")}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
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
            </motion.div>
          </div>
        </section>

        <section data-tour="recent-activity" className="mt-10 pb-10">
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
                {displayActivity.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-6 text-center text-xs tracking-widest text-zinc-600">
                      [NO ACTIVITY YET — RUN A TOOL TO SEE IT HERE]
                    </td>
                  </tr>
                ) : (
                  displayActivity.map((entry, i) => (
                    <tr key={i} className="transition-colors hover:bg-zinc-900/60">
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-2 text-zinc-200">
                          <span className={`h-1.5 w-1.5 rounded-full ${toolDotClasses[entry.tool]}`} />
                          {entry.tool}
                        </span>
                      </td>
                      <td className="max-w-xs truncate px-5 py-3 text-zinc-400">{entry.summary}</td>
                      <td className="px-5 py-3">
                        <span className={`border px-2 py-1 text-xs font-medium ${toneClasses[entry.tone]}`}>
                          {entry.verdict}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-zinc-500">
                        {new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
