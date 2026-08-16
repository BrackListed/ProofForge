import { useState } from "react";
import { useTour } from "./useTour";

/**
 * Applies `apply()` once, at render time, the first render where the tour is
 * sitting on `stepId` and `condition` is true — e.g. once async data (probing
 * questions, a newly created room) becomes available. Tracks "already applied
 * for this step" in state (not a ref) so it fires exactly once per
 * step-visit instead of looping, following React's "adjust state while
 * rendering" pattern rather than a setState-in-effect.
 */
export function useTourPrefill(stepId: string, condition: boolean, apply: () => void) {
  const tour = useTour();
  const [appliedFor, setAppliedFor] = useState<string | null>(null);
  const active = tour.currentStepId === stepId;

  if (active && condition && appliedFor !== stepId) {
    setAppliedFor(stepId);
    apply();
  } else if (!active && appliedFor === stepId) {
    setAppliedFor(null);
  }

  return tour;
}
