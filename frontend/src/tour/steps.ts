import type { TourStep } from "./useTour";

export const DEMO_SCRUTINIZE_TEXT = `POLL: ICE has been abused by the Fake News Media at levels never seen before. They are Great Patriots who work hard, and do a fantastic job in a very hostile environment. Much of this hostility is caused by the Dumocrats and the Fake News. The concept I have had for quite some time — A strong feeling that the name of these Patriots, "ICE," should be changed to, "NICE," in that it will totally discombobulate Crooked, Dishonest, and Unpatriotic Reporters and Journalists. For them to say, "We went to a NICE Facility today," as opposed to "ICE" or, "NICE Agents have deported a Violent Drug Dealer," they won't be able to handle it, they will go totally crazy! All it means is adding an "N" ("National") to "ICE ("Immigration and Customs Enforcement")— A much more prestigious name. Everyone loves it, but I have been told by the legendary Tom Homan that the Agents do not love it as much as the other population. Who thinks that we should add an "N" to change the name of "ICE" to "NICE?"`;

export const DEMO_ROOM_TITLE = "Death Penalty";
export const DEMO_ROOM_TOPIC = "Should Death penalty be legalized";

export const DEMO_ARGUMENT = `The death penalty should be legalized everywhere because it always deters violent crime and guarantees a murderer can never hurt anyone again. Every country that uses it has less crime, so it obviously works. Anyone against it clearly doesn't care about the victims.`;

export const DEMO_RISK_DECISION = "Drop out of school to continue family business";

export const DEMO_RISK_ANSWERS: Record<string, string> = {
  time_commitment: "40+ hours a week once I take over full time",
  sacrificed_stack: "My degree, plus the internship offers tied to finishing it",
  target_goal: "Keep the business profitable and eventually grow it",
  financial_runway: "About 3 months of personal savings as a cushion",
  savings: "Roughly 3 months of expenses saved",
  family_backup_plan: "No formal fallback — my sibling isn't interested in taking it over",
  support_system: "My parents, but they're aging out of running it themselves",
  reversibility: "Re-enrolling later is possible, but I'd lose my current scholarship",
  revenue_stability: "Revenue has dipped about 15% over the last two years",
  exit_plan: "Hire a manager and go back to school part-time if it doesn't work out",
};

export const DEMO_RISK_FALLBACK_ANSWER = "No concrete plan yet — this is something I'd need to figure out.";

export const fullTourSteps: TourStep[] = [
  {
    id: "welcome",
    route: "/",
    title: "Welcome to ProofForge",
    description:
      "This is Proof Forge. Most tools give passive advice; Proof Forge scrutinizes text, cross-examines assumptions, and quantifies real-world risk.",
  },
  {
    id: "dashboard-overview",
    route: "/",
    target: "tools-grid",
    title: "The dashboard",
    description:
      "Text Scrutinizer, Debate Simulator, and Risk Simulator live in the sidebar, with live counts and a recent-activity log up top. Straight into the Text Scrutinizer next.",
  },
  {
    id: "scrutinize-intro",
    route: "/scrutinize",
    target: "scrutinize-input",
    title: "Text Scrutinizer",
    auto: true,
    description:
      'A real viral post is already loaded below — a statement that sounds convincing but isn\'t backed by evidence. Click "Begin Audit" to extract its premise, map its logic, and flag every unproven leap.',
  },
  {
    id: "scrutinize-premise",
    route: "/scrutinize",
    target: "scrutinize-premise",
    title: "Step 1: Extract the premise",
    description:
      "The audit starts by isolating the single foundational claim everything else depends on. If that premise is weak or unsupported, the whole argument collapses — no matter how convincing the rest sounds.",
  },
  {
    id: "scrutinize-logic",
    route: "/scrutinize",
    target: "scrutinize-logic",
    title: "Step 2: Map the logic",
    description:
      "Next, it traces how each claim connects to the last — CAUSE, EVIDENCE, INFERENCE, CONTRADICTION. This is the reasoning chain laid bare, showing exactly where it holds and where it breaks.",
  },
  {
    id: "scrutinize-flags",
    route: "/scrutinize",
    target: "scrutinize-flags",
    title: "Step 3: Flag the failures",
    description:
      "Every weak point gets classified: UNPROV. for claims with no evidence, ABSOL. for overgeneralizations and false dichotomies, WEAK. for non-sequiturs. This turns \"this sounds true\" into \"here's exactly why it isn't.\"",
  },
  {
    id: "debate-create",
    route: "/debate",
    target: "debate-create-room",
    title: "Start a debate",
    auto: true,
    description: `A room is already set up — "${DEMO_ROOM_TITLE}", arguing whether it should be legalized. Click "Create" to enter it.`,
  },
  {
    id: "debate-argument",
    route: "/debate",
    target: "debate-argument-input",
    title: "Make the case",
    auto: true,
    description:
      'A deliberately one-sided argument is loaded — the kind people post online without thinking twice. Click "Done" to watch the AI cross-examine every weak point in it, live.',
  },
  {
    id: "debate-response",
    route: "/debate",
    target: "debate-response",
    title: "Real-time cross-examination",
    description:
      "The AI doesn't just disagree — it calls out the exact evasions and weak points in the argument, point by point, in real time. This is what makes a debate partner useful: pressure-testing a position before someone else does.",
  },
  {
    id: "risk-decision",
    route: "/risk",
    target: "risk-decision-input",
    title: "Risk Simulator",
    auto: true,
    description: `A real decision is already filled in: "${DEMO_RISK_DECISION}". Click "[INITIALIZE DIAGNOSIS >]" to generate the exact questions someone would need to answer before making a call like this.`,
  },
  {
    id: "risk-answers",
    route: "/risk",
    target: "risk-answers",
    title: "Answer honestly",
    auto: true,
    description:
      "An answer is suggested for each question based on a plausible scenario. Edit anything that doesn't fit, then run the full stress-test to turn these answers into a complete risk profile.",
  },
  {
    id: "risk-threat",
    route: "/risk",
    target: "risk-threat",
    title: "The verdict",
    description:
      "A risk score and threat level are computed straight from the answers, alongside how reversible this decision really is and the single biggest failure vector — the number you'd want before committing to anything irreversible.",
  },
  {
    id: "risk-timeline",
    route: "/risk",
    target: "risk-timeline",
    title: "How it plays out",
    description:
      "This is the cascading failure timeline — a step-by-step projection of exactly how this decision could unravel over time if the worst-case constraints hit.",
  },
  {
    id: "risk-consequences",
    route: "/risk",
    target: "risk-consequences",
    title: "Impact and exit plan",
    description:
      "Blast radius shows every area this decision touches and how hard. Below it, the exit plan: an exact trigger to watch for and a fallback to execute — never caught without a plan B.",
  },
  {
    id: "replay-tour",
    target: "replay-tour",
    title: "Lost later?",
    description: "Replay this walkthrough any time from the bottom of the sidebar.",
  },
];
