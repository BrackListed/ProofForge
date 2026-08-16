import { createContext, useContext } from "react";

export interface TourStep {
  id: string;
  route?: string;
  target?: string;
  title: string;
  description: string;
  /** When true, the "Next" button stays hidden behind a "Waiting for you…"
   * indicator until the page reports (via useTourReady) that the real
   * action (submit, AI response, etc.) actually completed — it never
   * advances on its own, the user still has to click Next. */
  auto?: boolean;
}

export interface TourContextValue {
  isActive: boolean;
  stepIndex: number;
  steps: TourStep[];
  currentStepId: string | null;
  isStepReady: boolean;
  start: (steps: TourStep[]) => void;
  next: () => void;
  skip: () => void;
  setStepReady: (ready: boolean) => void;
}

export const TourContext = createContext<TourContextValue | undefined>(undefined);

export const TOUR_STORAGE_KEY = "proofforge_tour_completed";

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within a TourProvider");
  return ctx;
}
