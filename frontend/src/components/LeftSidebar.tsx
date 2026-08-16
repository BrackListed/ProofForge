import { NavLink } from "react-router-dom";
import { useClerk, useUser } from "@clerk/react";

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
  const { user } = useUser();
  const { openUserProfile } = useClerk();
  const displayName = user?.username ?? user?.firstName ?? "there";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col border-r border-zinc-700 bg-black/40 font-mono backdrop-blur-xl">
      <div className="flex items-center gap-2 px-5 pt-5 pb-4">
        <div className="flex h-7 w-7 items-center justify-center border border-indigo-400/30 bg-linear-to-br from-indigo-500 to-sky-600 shadow-lg shadow-indigo-950/50">
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

      <button
        type="button"
        onClick={() => openUserProfile()}
        className="mx-4 flex items-center gap-3 border border-zinc-700 bg-zinc-950/70 px-3 py-3 text-left backdrop-blur-sm transition-colors hover:bg-zinc-900"
      >
        <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-linear-to-br from-zinc-700 to-zinc-800 text-sm font-medium text-zinc-300 ring-1 ring-zinc-700">
          <span>{initials}</span>
          <img src={user?.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <span className="absolute right-0 bottom-0 h-2.5 w-2.5 rounded-full bg-emerald-400 ring-2 ring-zinc-900" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs tracking-widest text-zinc-500">[WELCOME]</p>
          <p className="truncate text-sm font-semibold text-zinc-100">{displayName}</p>
        </div>
      </button>

      <nav className="flex-1 space-y-1 px-3 py-5">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `group relative flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
              isActive ? accentClasses.indigo.active : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-full transition-opacity ${
                  isActive ? `${accentClasses.indigo.bar} opacity-100` : "opacity-0"
                }`}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.75}
                stroke="currentColor"
                className={`h-5 w-5 shrink-0 ${isActive ? accentClasses.indigo.icon : "text-zinc-500 group-hover:text-zinc-300"}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 12 12 3.75l8.25 8.25M5.25 10.5v9.75h4.5v-6h4.5v6h4.5V10.5"
                />
              </svg>
              <span className="truncate">Dashboard</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/scrutinize"
          className={({ isActive }) =>
            `group relative flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
              isActive ? accentClasses.sky.active : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-full transition-opacity ${
                  isActive ? `${accentClasses.sky.bar} opacity-100` : "opacity-0"
                }`}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.75}
                stroke="currentColor"
                className={`h-5 w-5 shrink-0 ${isActive ? accentClasses.sky.icon : "text-zinc-500 group-hover:text-zinc-300"}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 18a7.5 7.5 0 1 0 0-15 7.5 7.5 0 0 0 0 15ZM21 21l-4.35-4.35"
                />
              </svg>
              <span className="truncate">Text Scrutinizer</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/debate"
          className={({ isActive }) =>
            `group relative flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
              isActive ? accentClasses.red.active : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-full transition-opacity ${
                  isActive ? `${accentClasses.red.bar} opacity-100` : "opacity-0"
                }`}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.75}
                stroke="currentColor"
                className={`h-5 w-5 shrink-0 ${isActive ? accentClasses.red.icon : "text-zinc-500 group-hover:text-zinc-300"}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M8.25 9.75h7.5M8.25 12.75h4.5M21 12c0 4.556-4.03 8.25-9 8.25-1.11 0-2.172-.184-3.15-.522L3 21l1.395-4.185C3.512 15.523 3 13.822 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                />
              </svg>
              <span className="truncate">Debate Simulator</span>
            </>
          )}
        </NavLink>

        <NavLink
          to="/risk"
          className={({ isActive }) =>
            `group relative flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors ${
              isActive ? accentClasses.amber.active : "text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100"
            }`
          }
        >
          {({ isActive }) => (
            <>
              <span
                className={`absolute top-1.5 bottom-1.5 left-0 w-0.5 rounded-full transition-opacity ${
                  isActive ? `${accentClasses.amber.bar} opacity-100` : "opacity-0"
                }`}
              />
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.75}
                stroke="currentColor"
                className={`h-5 w-5 shrink-0 ${isActive ? accentClasses.amber.icon : "text-zinc-500 group-hover:text-zinc-300"}`}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v3.75m0 3h.008v.008H12v-.008ZM9.401 3.6 1.67 17.25a1.5 1.5 0 0 0 1.299 2.25h18.062a1.5 1.5 0 0 0 1.299-2.25L14.599 3.6a1.5 1.5 0 0 0-2.598 0Z"
                />
              </svg>
              <span className="truncate">Risk Simulator</span>
            </>
          )}
        </NavLink>
      </nav>

      <div className="border-t border-zinc-700 px-5 py-4">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <p className="text-xs tracking-widest text-zinc-600">[PROOFFORGE v0.1]</p>
        </div>
      </div>
    </aside>
  );
}
