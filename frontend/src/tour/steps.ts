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
      "Your truth and strategy engine. Scrutinize statements to expose misinformation, debate your assumptions in real time, and quantify risk so you can execute your future with absolute clarity.",
  },
  {
    id: "sidebar-nav",
    route: "/",
    target: "sidebar-nav",
    title: "Your toolkit",
    description:
      "Dashboard, Text Scrutinizer, Debate Simulator, and Risk Simulator all live here. We'll walk through all three with a real example in each.",
  },
  {
    id: "stat-cards",
    route: "/",
    target: "stat-cards",
    title: "Live counts",
    description:
      "These update in real time: every document scrutinized, debate simulated, and risk assessed you've ever run.",
  },
  {
    id: "tools-grid",
    route: "/",
    target: "tools-grid",
    title: "Pick a tool",
    description: "Click any card to open that tool directly. Next stop: the Text Scrutinizer.",
  },
  {
    id: "recent-activity",
    route: "/",
    target: "recent-activity",
    title: "Recent activity",
    description: "Every verdict lands here — tool used, a summary, the outcome, and when it happened.",
  },
  {
    id: "scrutinize-intro",
    route: "/scrutinize",
    target: "scrutinize-input",
    title: "Text Scrutinizer",
    auto: true,
    description:
      'We\'ve dropped a real viral post into the input below. Click "Begin Audit" to watch ProofForge extract its premise and flag every unproven leap and absolute claim — we\'ll continue once your results are in.',
  },
  {
    id: "debate-create",
    route: "/debate",
    target: "debate-create-room",
    title: "Start a debate",
    auto: true,
    description: `We've opened a room for you — "${DEMO_ROOM_TITLE}", arguing whether it should be legalized. Click "Create" to enter it.`,
  },
  {
    id: "debate-argument",
    route: "/debate",
    target: "debate-argument-input",
    title: "Make your case",
    auto: true,
    description:
      'We\'ve loaded a deliberately one-sided argument. Click "Done" and watch the AI opponent cross-examine every weak point in it — we\'ll move on once it responds.',
  },
  {
    id: "risk-decision",
    route: "/risk",
    target: "risk-decision-input",
    title: "Risk Simulator",
    auto: true,
    description: `We've filled in a real decision: "${DEMO_RISK_DECISION}". Click "[INITIALIZE DIAGNOSIS >]" to generate cross-examination questions for it.`,
  },
  {
    id: "risk-answers",
    route: "/risk",
    target: "risk-answers",
    title: "Answer honestly",
    auto: true,
    description:
      "We've suggested an answer for each question based on a plausible scenario. Edit anything that doesn't fit, then run the full stress-test — we'll wrap up once it comes back.",
  },
  {
    id: "replay-tour",
    target: "replay-tour",
    title: "Lost later?",
    description: "Replay this walkthrough any time from the bottom of the sidebar.",
  },
];
