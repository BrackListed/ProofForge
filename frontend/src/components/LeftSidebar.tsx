import { useState } from "react";

const navItems = [
  {
    id: "dashboard",
    label: "Dashboard",
    accent: "indigo",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 12 12 3.75l8.25 8.25M5.25 10.5v9.75h4.5v-6h4.5v6h4.5V10.5"
      />
    ),
  },
  {
    id: "scrutinizer",
    label: "Text Scrutinizer",
    accent: "sky",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM21 21l-4.35-4.35"
      />
    ),
  },
  {
    id: "debate",
    label: "Debate Simulator",
    accent: "red",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M8.25 9.75h7.5M8.25 12.75h4.5M21 12c0 4.556-4.03 8.25-9 8.25-1.11 0-2.172-.184-3.15-.522L3 21l1.395-4.185C3.512 15.523 3 13.822 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
      />
    ),
  },
  {
    id: "risk",
    label: "Risk Simulator",
    accent: "amber",
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m0 3h.008v.008H12v-.008ZM9.401 3.6 1.67 17.25a1.5 1.5 0 0 0 1.299 2.25h18.062a1.5 1.5 0 0 0 1.299-2.25L14.599 3.6a1.5 1.5 0 0 0-2.598 0Z"
      />
    ),
  },
] as const;

const accentClasses: Record<string, { active: string; bar: string; icon: string }> = {
  indigo: {
    active: "bg-indigo-500/10 text-indigo-300 ring-1 ring-inset ring-indigo-500/30",
    bar: "bg-indigo-400",
    icon: "text-indigo-400",
  },
  sky: {
    active: "bg-sky-500/10 text-sky-300 ring-1 ring-inset ring-sky-500/30",
    bar: "bg-sky-400",
    icon: "text-sky-400",
  },
  red: {
    active: "bg-red-500/10 text-red-300 ring-1 ring-inset ring-red-500/30",
    bar: "bg-red-400",
    icon: "text-red-400",
  },
  amber: {
    active: "bg-amber-500/10 text-amber-300 ring-1 ring-inset ring-amber-500/30",
    bar: "bg-amber-400",
    icon: "text-amber-400",
  },
};

export function LeftSidebar() {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <aside className="flex h-screen w-64 shrink-0 flex-col border-r border-white/10 bg-black/25 backdrop-blur-xl">
      <div className="flex items-center gap-2 px-5 pt-5 pb-4">
        <div className="flex h-7 w-7 items-center justify-center rounded-md bg-linear-to-br from-indigo-500 to-sky-600 shadow-lg shadow-indigo-950/50">
          <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-white">
            <path
              d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z"
              fill="currentColor"
            />
          </svg>
        </div>
        <span className="text-sm font-semibold tracking-wide text-zinc-200">
          Proof<span className="text-indigo-400">Forge</span>
        </span>
      </div>

      <div className="mx-4 flex items-center gap-3 rounded-xl border border-zinc-500/20 bg-zinc-800/30 px-3 py-3 backdrop-blur-md">
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-zinc-700 to-zinc-800 text-sm font-medium text-zinc-300 ring-1 ring-zinc-700">
          <span>JP</span>
          <img src={undefined} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-zinc-900" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs text-zinc-500">Welcome,</p>
          <p className="truncate text-sm font-semibold text-zinc-100">Jayce</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-5">
        {navItems.map((item) => {
          const isActive = activeTab === item.id;
          const accent = accentClasses[item.accent];
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => setActiveTab(item.id)}
              className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-sm transition-colors ${
                isActive ? accent.active : "text-zinc-400 hover:bg-zinc-800/30 hover:text-zinc-100"
              }`}
            >
              <span
                className={`absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-full transition-opacity ${
                  isActive ? `${accent.bar} opacity-100` : "opacity-0"
                }`}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.75}
                stroke="currentColor"
                className={`h-5 w-5 shrink-0 ${isActive ? accent.icon : "text-zinc-500 group-hover:text-zinc-300"}`}
              >
                {item.icon}
              </svg>
              <span className="truncate">{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t border-zinc-500/20 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <p className="text-xs text-zinc-600">ProofForge v0.1</p>
        </div>
      </div>
    </aside>
  );
}
