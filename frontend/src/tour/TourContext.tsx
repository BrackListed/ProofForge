import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TourContext, TOUR_STORAGE_KEY, type TourStep } from "./useTour";

export function TourProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);
  const [isStepReady, setIsStepReady] = useState(false);
  // Each step starts un-ready — a fresh step never inherits the previous
  // step's "the real action already happened" flag. Adjusted during render
  // (React's documented pattern for resetting state when a value changes)
  // rather than in an effect, since this is TourProvider reacting to its
  // own stepIndex, not synchronizing with anything external.
  const [readyForStepIndex, setReadyForStepIndex] = useState(stepIndex);
  if (readyForStepIndex !== stepIndex) {
    setReadyForStepIndex(stepIndex);
    setIsStepReady(false);
  }
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isActive) return;
    const step = steps[stepIndex];
    if (step?.route && step.route !== location.pathname) {
      navigate(step.route);
    }
  }, [isActive, stepIndex, steps, location.pathname, navigate]);

  const setStepReady = useCallback((ready: boolean) => {
    setIsStepReady(ready);
  }, []);

  const start = useCallback((newSteps: TourStep[]) => {
    setSteps(newSteps);
    setStepIndex(0);
    setIsActive(true);
  }, []);

  const skip = useCallback(() => {
    setIsActive(false);
    localStorage.setItem(TOUR_STORAGE_KEY, "true");
  }, []);

  const next = useCallback(() => {
    setStepIndex((prev) => {
      if (prev + 1 >= steps.length) {
        setIsActive(false);
        localStorage.setItem(TOUR_STORAGE_KEY, "true");
        return prev;
      }
      return prev + 1;
    });
  }, [steps.length]);

  const currentStepId = isActive ? (steps[stepIndex]?.id ?? null) : null;

  return (
    <TourContext.Provider
      value={{ isActive, stepIndex, steps, currentStepId, isStepReady, start, next, skip, setStepReady }}
    >
      {children}
    </TourContext.Provider>
  );
}
