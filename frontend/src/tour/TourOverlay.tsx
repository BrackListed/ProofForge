import { useEffect, useState, type CSSProperties } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTour } from "./useTour";

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const PADDING = 10;
const TOOLTIP_WIDTH = 380;

export function TourOverlay() {
  const { isActive, stepIndex, steps, isStepReady, next, skip } = useTour();
  const [rect, setRect] = useState<Rect | null>(null);
  const step = steps[stepIndex];

  useEffect(() => {
    let scrolledOnce = false;
    const measure = () => {
      if (!isActive || !step || !step.target) {
        setRect(null);
        return;
      }
      const el = document.querySelector(`[data-tour="${step.target}"]`);
      if (!el) {
        setRect(null);
        return;
      }
      if (!scrolledOnce) {
        el.scrollIntoView({ block: "center", behavior: "smooth" });
        scrolledOnce = true;
      }
      const r = el.getBoundingClientRect();
      setRect({
        top: r.top - PADDING,
        left: r.left - PADDING,
        width: r.width + PADDING * 2,
        height: r.height + PADDING * 2,
      });
    };

    measure();
    if (!isActive || !step || !step.target) return;
    // Some targets (modals opened after an async response, a room the user just
    // created) don't exist in the DOM yet when the step becomes active — keep
    // polling for them instead of giving up after one look.
    const interval = setInterval(measure, 400);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [isActive, step]);

  if (!isActive || !step) return null;

  // Once the real action behind an auto step has actually landed, get out of
  // the way — drop the dimming/spotlight and shrink the tooltip into a small
  // corner pill so the user can see their own results instead of a card
  // covering them.
  const minimized = Boolean(step.auto) && isStepReady;

  const viewportW = window.innerWidth;
  const viewportH = window.innerHeight;

  let tooltipStyle: CSSProperties = {
    top: viewportH / 2 - 110,
    left: viewportW / 2 - TOOLTIP_WIDTH / 2,
  };
  if (rect) {
    const spaceRight = viewportW - (rect.left + rect.width);
    const spaceBelow = viewportH - (rect.top + rect.height);
    if (spaceRight > TOOLTIP_WIDTH + 24) {
      tooltipStyle = {
        top: Math.min(Math.max(rect.top, 16), viewportH - 280),
        left: rect.left + rect.width + 20,
      };
    } else if (spaceBelow > 240) {
      tooltipStyle = {
        top: rect.top + rect.height + 20,
        left: Math.min(Math.max(rect.left, 16), viewportW - TOOLTIP_WIDTH - 16),
      };
    } else {
      tooltipStyle = {
        top: Math.max(rect.top - 260, 16),
        left: Math.min(Math.max(rect.left, 16), viewportW - TOOLTIP_WIDTH - 16),
      };
    }
  }

  const spring = { type: "spring" as const, stiffness: 260, damping: 30 };

  return (
    <div className="pointer-events-none fixed inset-0 z-100 font-mono">
      <AnimatePresence>
        {!minimized && (
          <motion.div key="backdrop" exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {rect ? (
              <>
                <motion.div className="pointer-events-auto fixed left-0 right-0 top-0 bg-black/75" animate={{ height: Math.max(rect.top, 0) }} transition={spring} />
                <motion.div className="pointer-events-auto fixed left-0 right-0 bottom-0 bg-black/75" animate={{ top: rect.top + rect.height }} transition={spring} />
                <motion.div className="pointer-events-auto fixed left-0 bg-black/75" animate={{ top: rect.top, height: rect.height, width: Math.max(rect.left, 0) }} transition={spring} />
                <motion.div className="pointer-events-auto fixed right-0 bg-black/75" animate={{ top: rect.top, height: rect.height, left: rect.left + rect.width }} transition={spring} />
                <motion.div
                  className="pointer-events-none fixed rounded-md ring-2 ring-indigo-400/80 shadow-[0_0_0_4px_rgba(99,102,241,0.15),0_0_30px_rgba(56,189,248,0.35)]"
                  animate={{ top: rect.top, left: rect.left, width: rect.width, height: rect.height }}
                  transition={spring}
                />
              </>
            ) : (
              <div className="pointer-events-auto fixed inset-0 bg-black/75" />
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {minimized ? (
          <motion.div
            key={`mini-${stepIndex}`}
            initial={{ opacity: 0, y: 16, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.92 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto fixed right-6 bottom-6 flex items-center gap-3 border border-indigo-500/40 bg-zinc-950/95 px-4 py-3 shadow-2xl shadow-black/60 backdrop-blur-xl"
          >
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-emerald-400" />
            <span className="whitespace-nowrap text-xs text-zinc-300">{step.title} — done</span>
            <button type="button" onClick={skip} className="text-xs tracking-wide text-zinc-500 transition-colors hover:text-zinc-200">
              Skip
            </button>
            <button
              type="button"
              onClick={next}
              className="bg-indigo-500 px-3 py-1.5 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-indigo-400"
            >
              Next &rarr;
            </button>
          </motion.div>
        ) : (
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto fixed w-[380px] border border-indigo-500/30 bg-zinc-950/95 p-5 shadow-2xl shadow-black/60 backdrop-blur-xl"
            style={tooltipStyle}
          >
            <div className="mb-3 flex items-center gap-1.5">
              {steps.map((_, i) => (
                <span key={i} className={`h-1 flex-1 rounded-full transition-colors ${i <= stepIndex ? "bg-indigo-400" : "bg-zinc-700"}`} />
              ))}
            </div>
            <p className="mb-2 text-xs tracking-widest text-indigo-400">
              [STEP {stepIndex + 1} OF {steps.length}]
            </p>
            <h3 className="mb-2 text-lg font-semibold text-zinc-50">{step.title}</h3>
            <p className="mb-5 text-sm leading-relaxed text-zinc-400">{step.description}</p>
            <div className="flex items-center justify-between">
              <button type="button" onClick={skip} className="text-xs tracking-wide text-zinc-500 transition-colors hover:text-zinc-200">
                Skip tour
              </button>
              {step.auto && !isStepReady ? (
                <span className="flex items-center gap-2 text-xs tracking-wide text-zinc-500">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-indigo-400" />
                  Waiting for you&hellip;
                </span>
              ) : (
                <button
                  type="button"
                  onClick={next}
                  className="bg-indigo-500 px-4 py-2 text-xs font-semibold tracking-wide text-white transition-colors hover:bg-indigo-400"
                >
                  {stepIndex + 1 === steps.length ? "Finish" : "Next"} &rarr;
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
