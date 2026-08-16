import { useState } from "react";
import { SignIn, SignUp } from "@clerk/react";
import { useSignIn } from "@clerk/react/legacy";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backgroundImage from "../assets/Intermission_Background.jpg";
import { API_BASE_URL } from "../lib/api";

export function Intermission() {
  const [mode, setMode] = useState<"sign-in" | "sign-up">("sign-in");
  const { isLoaded, signIn, setActive } = useSignIn();
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestError, setGuestError] = useState<string | null>(null);
  const navigate = useNavigate();

  const continueAsGuest = async () => {
    if (!isLoaded || guestLoading) return;
    setGuestLoading(true);
    setGuestError(null);
    try {
      // The backend mints a one-time Clerk sign-in token for the fixed guest
      // account — this completes immediately with no password or second
      // factor, sidestepping Clerk's device-trust challenge entirely.
      const { data } = await axios.post<{ token: string }>(`${API_BASE_URL}/guest-token`);
      const result = await signIn.create({ strategy: "ticket", ticket: data.token });
      if (result.status === "complete" && result.createdSessionId) {
        await setActive({ session: result.createdSessionId });
        navigate("/");
      } else {
        setGuestError("Guest sign-in didn't complete. Try again.");
      }
    } catch {
      setGuestError("Couldn't sign in as guest right now.");
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center text-zinc-100">
      <div
        className="fixed inset-0 -z-20 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      <div className="fixed inset-0 -z-10 bg-black/55" />

      <div className="intermission-auth flex w-full max-w-md flex-col items-center px-6 py-12">
        <div className="mb-2 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-linear-to-br from-indigo-500 to-sky-600 shadow-lg shadow-indigo-950/50">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" className="h-5 w-5 text-white">
              <path d="M13 2 4 14h6l-1 8 9-12h-6l1-8Z" fill="currentColor" />
            </svg>
          </div>
          <span className="text-xl font-semibold tracking-wide text-zinc-100">
            Proof<span className="text-indigo-400">Forge</span>
          </span>
        </div>
        <p className="mb-8 text-center text-sm text-zinc-400">
          Stress-test your arguments, your debates, and your decisions.
        </p>

        <div className="mb-6 flex rounded-full border border-zinc-500/20 bg-zinc-800/30 p-1 backdrop-blur-md">
          <button
            type="button"
            onClick={() => setMode("sign-in")}
            className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
              mode === "sign-in" ? "bg-zinc-100 text-zinc-900" : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode("sign-up")}
            className={`rounded-full px-5 py-1.5 text-sm font-medium transition-colors ${
              mode === "sign-up" ? "bg-zinc-100 text-zinc-900" : "text-zinc-400 hover:text-zinc-100"
            }`}
          >
            Sign Up
          </button>
        </div>

        {mode === "sign-in" ? <SignIn routing="hash" /> : <SignUp routing="hash" />}

        <div className="mt-6 flex w-full max-w-100 items-center gap-3">
          <div className="h-px flex-1 bg-zinc-500/20" />
          <span className="text-xs tracking-wide text-zinc-500">OR</span>
          <div className="h-px flex-1 bg-zinc-500/20" />
        </div>

        <button
          type="button"
          onClick={continueAsGuest}
          disabled={!isLoaded || guestLoading}
          className="mt-4 w-full max-w-100 rounded-full border border-zinc-500/20 bg-zinc-800/30 py-2.5 text-sm font-medium text-zinc-200 backdrop-blur-md transition-colors hover:bg-zinc-800/50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {guestLoading ? "Signing in…" : "Continue as Guest"}
        </button>
        {guestError && <p className="mt-2 text-center text-xs text-red-400">{guestError}</p>}
      </div>
    </div>
  );
}
