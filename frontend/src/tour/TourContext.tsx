import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { TourContext, TOUR_STORAGE_KEY, type TourStep } from "./useTour";

export function TourProvider({ children }: { children: ReactNode }) {
  const [isActive, setIsActive] = useState(false);
  const [stepIndex, setStepIndex] = useState(0);
  const [steps, setSteps] = useState<TourStep[]>([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isActive) return;
    const step = steps[stepIndex];
    if (step?.route && step.route !== location.pathname) {
      navigate(step.route);
    }
  }, [isActive, stepIndex, steps, location.pathname, navigate]);

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
    <TourContext.Provider value={{ isActive, stepIndex, steps, currentStepId, start, next, skip }}>
      {children}
    </TourContext.Provider>
  );
}
