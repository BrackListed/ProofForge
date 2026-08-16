import { useEffect } from "react";
import { useTour } from "./useTour";

/**
 * Reports to the tour whether the real action for `stepId` (submit, AI
 * reply, stress-test) has actually completed. It never advances the tour by
 * itself — TourOverlay swaps its "Waiting for you…" indicator for a
 * clickable Next button once this is true, and the user still has to click
 * it. Runs in an effect because it updates TourProvider, a different
 * component than whoever calls this hook — synchronously updating a
 * foreign component during this component's render is invalid and throws.
 */
export function useTourReady(stepId: string, condition: boolean) {
  const tour = useTour();
  const active = tour.currentStepId === stepId;

  useEffect(() => {
    tour.setStepReady(active && condition);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, condition]);
}
