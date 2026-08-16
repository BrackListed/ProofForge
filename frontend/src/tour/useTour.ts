import { createContext, useContext } from "react";

export interface TourStep {
  id: string;
  route?: string;
  target?: string;
  title: string;
  description: string;
}

export interface TourContextValue {
  isActive: boolean;
  stepIndex: number;
  steps: TourStep[];
  currentStepId: string | null;
  start: (steps: TourStep[]) => void;
  next: () => void;
  skip: () => void;
}

export const TourContext = createContext<TourContextValue | undefined>(undefined);

export const TOUR_STORAGE_KEY = "proofforge_tour_completed";

export function useTour() {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within a TourProvider");
  return ctx;
}
