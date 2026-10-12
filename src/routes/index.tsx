import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "neatHack Mission Control — Plan your 48h agent build" },
      { name: "description", content: "Plan your neatHack entry: idea, required tools, checklist, judging weights and deadlines." },
      { property: "og:title", content: "neatHack Mission Control" },
      { property: "og:description", content: "Plan your 48-hour AI agent hackathon build with neatlogs, Entire and cfo.ai." },
    ],
  }),
  component: Index,
});

const START = new Date("2026-10-10T00:00:00+05:30").getTime();
const END = new Date("2026-10-12T23:55:00+05:30").getTime();

const TOOLS = [
  { name: "neatlogs", role: "Observability", desc: "Trace every LLM call, tool call and retry. Show a failure found and fixed.", url: "https://neatlogs.com" },
  { name: "Entire", role: "Agent context", desc: "Checkpoints and session history behind every code change.", url: "https://entire.io" },
  { name: "cfo.ai", role: "Business plan", desc: "Pricing, costs, unit economics and runway for your agent.", url: "https://cfo.ai" },
];

const JUDGING = [
  ["The agent itself", 30],
  ["Use of the 3 tools", 25],
  ["Demo video (≤ 3 min)", 20],
  ["Building in public", 15],
  ["Usefulness & originality", 10],
] as const;

const IDEA_DEFAULT = {
  title: "Checkpoint",
  task: "Given a GitHub issue URL, the agent investigates the issue, reads the relevant code, writes a fix, runs the tests, and produces a complete, verifiable output (a working diff + passing tests + clear explanation).",
  why: "Developers spend hours investigating and fixing GitHub issues. An agent that can reliably turn a real issue into a tested fix saves significant engineering time and can act as an always-on junior engineer.",
};

const IDEAS = [
  "Fix a GitHub issue end-to-end",
  "Research answers with citations",
  "Monitor, diagnose, auto-correct a system",
  "Coordinate specialized agents",
  "Long-running work in a changing environment",
];

const SCOPE = [
  {
    title: "One task, end-to-end",
    detail: "Build only the one substantial task the agent completes end-to-end. No extra features, dashboards or secondary agents unless the core task cannot work without them.",
  },
  {
    title: "Depth over breadth",
    detail: "Spend the hours on reliable recovery, good traces and a measurable improvement — not on more surface area.",
  },
  {
    title: "Every feature earns its place",
    detail: "A feature stays only if it serves the single task or one of the three required tools. If it does neither, it's out.",
  },
];

const PITFALLS = [
  { title: "Scope creep", fix: "Run every feature past the scope rules in section 03 — if it isn't on the one task's path, cut it." },
  { title: "Demo-day surprises", fix: "Run the exact demo task 3 times before recording. Capture the neatlogs trace of a clean run." },
  { title: "Tools as an afterthought", fix: "Instrument neatlogs on day one, not hour 47. Judges check real traces, not slides." },
  { title: "No business case", fix: "Spend 30 minutes in cfo.ai early — it shapes which features are worth building." },
  { title: "Silent building", fix: "Building in public is 15% of the score. Post progress on X at least once a day." },
];

const EVIDENCE = [
  {
    id: "traces",
    tool: "neatlogs",
    req: "Two traces: same task, before → after",
    proof: "A measurable difference in success rate, latency, cost or recovery. Same task both times.",
  },
  {
    id: "failure",
    tool: "neatlogs",
    req: "One trace showing a failure and the recovery",
    proof: "Capture it deliberately: the failing run, then the same run recovering. Keep both links.",
  },
  {
    id: "checkpoints",
    tool: "Entire",
    req: "Checkpoints or entire-graph output tied to key code changes",
    proof: "Every major commit points back to the session and checkpoint that produced it.",
  },
  {
    id: "plan",
    tool: "cfo.ai",
    req: "Full business plan",
    proof: "Pricing, unit economics, costs (inference + infra), revenue model and runway — all present.",
  },
  {
    id: "commits",
    tool: "GitHub",
    req: "Public repo, commits only inside the event window",
    proof: "Nothing before Oct 10 kickoff, nothing after the Oct 12 deadline. Check the graph before submitting.",
  },
  {
    id: "video",
    tool: "Demo",
    req: "Demo video under 3 minutes",
    proof: "Explicitly covers architecture, implementation, runtime behavior and results for all three tools.",
  },
];

const DEMO = [
  { id: "problem", t: "0:00–0:30", s: 30, name: "Problem + the single substantial task", show: "Name the task the agent solves end-to-end. No feature tour, no throat-clearing." },
  { id: "run", t: "0:30–1:15", s: 45, name: "Live agent run", show: "The agent completing the task end-to-end, in one take — proof it actually works." },
  { id: "neatlogs", t: "1:15–1:50", s: 35, name: "neatlogs", show: "Traces on screen: failure detection, then the before → after improvement.", tool: true },
  { id: "entire", t: "1:50–2:20", s: 30, name: "Entire", show: "Checkpoints, session context, and how the coding agent used the repo.", tool: true },
  { id: "cfo", t: "2:20–2:45", s: 25, name: "cfo.ai", show: "The business plan on screen: pricing, costs, runway.", tool: true },
  { id: "close", t: "2:45–3:00", s: 15, name: "Closing", show: "Usefulness, plus one original insight worth remembering." },
];

const PHASES = [
  {
    id: "kickoff",
    t: "0–2",
    h: 2,
    name: "Kickoff · architecture + scaffolding",
    do: "Architecture locked. Public repo created. neatlogs, Entire and cfo.ai wired in and writing data from the very first commit.",
    key: false,
  },
  {
    id: "loop",
    t: "2–12",
    h: 10,
    name: "Core agent loop",
    do: "Planning → tool calls → state → basic recovery, completing the demo task end-to-end. Save the first \"before\" trace here.",
    key: true,
  },
  {
    id: "reliable",
    t: "12–24",
    h: 12,
    name: "Make it reliable",
    do: "Failure recovery, verification, iteration, state persistence. Run the task 5 times and log each outcome — that becomes your success-rate number.",
    key: false,
  },
  {
    id: "instrument",
    t: "24–36",
    h: 12,
    name: "Polish + instrumentation",
    do: "Rich neatlogs traces (before → after, plus one deliberate failure and recovery), Entire checkpoints on every key change, cfo.ai model filled in.",
    key: true,
  },
  {
    id: "film",
    t: "36–42",
    h: 6,
    name: "Demo + building in public",
    do: "Film to the 3:00 structure, post progress on X, final repo cleanup — without rewriting history outside the commit window.",
    key: true,
  },
  {
    id: "buffer",
    t: "42–48",
    h: 6,
    name: "Buffer, testing, submission",
    do: "Rehearse the live run, verify all six evidence items and the commit graph, submit the kit with time to spare.",
    key: false,
  },
];

const CRITERIA = [
  {
    id: "unattended",
    req: "Finishes unattended",
    test: "Completes the full task without human intervention in the majority of runs.",
    proof: "Run the task 10 times and count completions. That number is your success-rate claim, and it comes straight from the traces.",
  },
  {
    id: "recover",
    req: "Recovers from real failures",
    test: "Handles at least 2–3 realistic failure modes and recovers.",
    proof: "Name the modes before you build: timeout, malformed tool output, missing data, rate limit. Force each one and keep the trace of the recovery.",
  },
  {
    id: "state",
    req: "Remembers where it was",
    test: "Maintains useful state across steps and retries.",
    proof: "A retry resumes from the step that failed instead of starting over — visible in the trace and in the checkpoint.",
  },
  {
    id: "verifiable",
    req: "Proves the result",
    test: "Produces verifiable final output — not just \"I did it\".",
    proof: "Something a judge can check: a diff that passes tests, a citation that resolves, a file that exists with the right contents.",
  },
];

const POSTS = [
  {
    id: "arch",
    when: "Hour 0–2",
    name: "Architecture decision",
    include: "The one task, the design you picked, and what you refused to build. A sketch beats a paragraph.",
    draft: `#neatHack kickoff — building {title}.\n\nOne task, end-to-end: {task}\n\nDesign: [the loop you chose] because [why]\nRefused to build: [what you cut]\n\nTracing every step with @neatlogs.`,
  },
  {
    id: "run",
    when: "Hour ~12",
    name: "First working run",
    include: "A short clip of the agent finishing the task end-to-end for the first time. Rough is fine — the point is it works.",
    draft: `First working run of {title} 🎬\n\n{task}\n\nPlan → tool calls → verify → done, unattended.\n\nNext: make the failure path as good as the happy path.\n\n#neatHack`,
  },
  {
    id: "fail",
    when: "Hour 12–36",
    name: "A failure + the fix",
    include: "The trace that caught the failure, what you changed, and the after trace. This post doubles as your neatlogs evidence.",
    draft: `{title} broke in a way I didn't expect.\n\n[what failed] → @neatlogs trace showed [the cause]\n\nFix: [what changed]\nBefore: [success rate] → After: [success rate]\n\nTrace: [link]\n\n#neatHack`,
  },
  {
    id: "teaser",
    when: "Hour 36–42",
    name: "Final demo teaser",
    include: "20 seconds of the demo plus the repo link, tagging all three tools. The last thing judges see before your submission.",
    draft: `{title} — 48 hours, one task, end-to-end.\n\n{task}\n\nBuilt with @neatlogs, @Entire and @cfo_ai.\n\nRepo: [url] · Demo: [url]\n\n#neatHack`,
  },
];

const CHECKLIST = [

  { id: "team", label: "Team registered on Luma with the same team name", phase: "Before" },
  { id: "discord", label: "Joined the neatlogs Discord", phase: "Before" },
  { id: "idea", label: "Idea and task chosen (planning only, no code)", phase: "Before" },
  { id: "repo", label: "Public repo created after kickoff — nothing committed before Oct 10", phase: "Build" },
  { id: "neatlogs", label: "neatlogs wired in from hour one, traces saved as you go", phase: "Build" },
  { id: "entire", label: "Entire checkpoint taken on every key code change", phase: "Build" },
  { id: "cfo", label: "cfo.ai plan started early — it decides what's worth building", phase: "Build" },
  { id: "x", label: "Progress posts on X tagged #neatHack", phase: "Build" },
  { id: "video", label: "Demo filmed to the 3:00 structure in section 07", phase: "Submit" },

  { id: "tweet", label: "Quote-tweet official post: team, project, repo, demo", phase: "Submit" },
];

const DELIVERABLES = [
  { id: "agent", name: "Working agent", detail: "Runs the one task end-to-end, unattended, in a public repo.", where: "Agent success criteria" },
  { id: "neatlogs", name: "neatlogs project with traces", detail: "The before → after pair plus the failure → recovery trace.", where: "Evidence for the judges" },
  { id: "entire", name: "Entire checkpoints / graph evidence", detail: "Checkpoint output tied to the key code changes made during the event.", where: "Evidence for the judges" },
  { id: "cfo", name: "cfo.ai business plan", detail: "Pricing, unit economics, costs, revenue model and runway.", where: "Evidence for the judges" },
  { id: "video", name: "3-minute demo video", detail: "Six beats, strict 3:00, all three tools on screen.", where: "Demo video" },
  { id: "readme", name: "README mapping every claim to evidence", detail: "Each claim links to the trace, checkpoint, plan or run that proves it.", where: "Built during hour 36–42" },
  { id: "tweet", name: "Ready-to-post X quote-tweet", detail: "Submission text with team, project, repo and demo links filled in.", where: "Submission kit" },
];

function useLocal<T>(key: string, init: T) {
  const [v, setV] = useState<T>(init);
  useEffect(() => {
    const s = localStorage.getItem(key);
    if (!s) return;
    const saved = JSON.parse(s);
    const isObj = (x: unknown) => !!x && typeof x === "object" && !Array.isArray(x);
    if (isObj(init) && isObj(saved)) {
      // a field saved while still blank falls back to its default
      const merged: Record<string, unknown> = { ...(init as object as Record<string, unknown>) };
      for (const [k, val] of Object.entries(saved as Record<string, unknown>))
        if (val !== "" && val !== null && val !== undefined) merged[k] = val;
      setV(merged as T);
    } else {
      setV(saved);
    }
  }, [key]);
  const set = (n: T) => {
    setV(n);
    localStorage.setItem(key, JSON.stringify(n));
  };
  return [v, set] as const;
}

function Countdown() {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (now === null) return <div className="h-20" />;
  const target = now < START ? START : END;
  const label = now < START ? "until kickoff" : now < END ? "until submission closes" : "event over";
  const d = Math.max(0, target - now);
  const parts = [
    [Math.floor(d / 864e5), "d"],
    [Math.floor((d / 36e5) % 24), "h"],
    [Math.floor((d / 6e4) % 60), "m"],
    [Math.floor((d / 1e3) % 60), "s"],
  ] as const;
  return (
    <div>
      <div className="flex gap-3 font-mono text-5xl font-semibold text-primary md:text-7xl">
        {parts.map(([n, u]) => (
          <span key={u}>
            {String(n).padStart(2, "0")}
            <span className="text-2xl text-muted-foreground">{u}</span>
          </span>
        ))}
      </div>
      <p className="mt-2 font-mono text-sm uppercase tracking-widest text-muted-foreground">{label}</p>
    </div>
  );
}

function Section({ n, title, children }: { n: string; title: string; children: React.ReactNode }) {
  return (
    <section className="border-t border-border py-12">
      <h2 className="mb-6 flex items-baseline gap-3 text-2xl font-bold">
        <span className="font-mono text-sm text-accent">{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

function Index() {
  const [done, setDone] = useLocal<string[]>("nh-done", []);
  const [ev, setEv] = useLocal<string[]>("nh-ev", []);
  const [filmed, setFilmed] = useLocal<string[]>("nh-demo", []);
  const [plan, setPlan] = useLocal<string[]>("nh-plan", []);

  const [idea, setIdea] = useLocal("nh-idea", IDEA_DEFAULT);
  const [sub, setSub] = useLocal("nh-sub", { team: "", repo: "", demo: "" });
  const [cut, setCut] = useLocal("nh-cut", "");
  const [posts, setPosts] = useLocal<string[]>("nh-posts", []);
  const [agent, setAgent] = useLocal<string[]>("nh-agent", []);
  const [runs, setRuns] = useLocal("nh-runs", { total: "", ok: "", recovered: "" });
  const [del, setDel] = useLocal<string[]>("nh-del", []);
  const [targetHit, setTargetHit] = useLocal<string[]>("nh-target", []);
  const [insight, setInsight] = useLocal("nh-insight", "");
  const [copied, setCopied] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedPost, setCopiedPost] = useState("");
  const pct = Math.round((done.length / CHECKLIST.length) * 100);
  const evPct = Math.round((ev.length / EVIDENCE.length) * 100);
  const demoPct = Math.round((filmed.length / DEMO.length) * 100);
  const planPct = Math.round((plan.length / PHASES.length) * 100);
  const postsPct = Math.round((posts.length / POSTS.length) * 100);
  const agentPct = Math.round((agent.length / CRITERIA.length) * 100);
  const delPct = Math.round((del.length / DELIVERABLES.length) * 100);
  const runsT = parseInt(runs.total, 10) || 0;
  const runsO = parseInt(runs.ok, 10) || 0;
  const runsR = parseInt(runs.recovered, 10) || 0;
  const rate = runsT
    ? `${Math.min(100, Math.round((runsO / runsT) * 100))}% unattended (${runsO}/${runsT} runs)${runsR ? ` · ${runsR} recovered` : ""}`
    : "success rate — log your runs";
  const targetOn = targetHit.length > 0;
  const targetStatus = !runsT
    ? "no runs logged yet — log them in section 09 as they happen"
    : runsT < 10
      ? `${runsO}/${runsT} unattended · ${runsR} recovered — ${10 - runsT} more runs to go`
      : runsO >= 7 && runsR >= 2
        ? `${runsO}/${runsT} unattended · ${runsR} recovered — target met ✓`
        : `${runsO}/${runsT} unattended · ${runsR} recovered — below target, fix reliability`;



  const buildPrompt = `You are my build partner for neatHack (Oct 10–12, 48 hours). Help me build an AI agent.

Project: ${idea.title || "[project name]"}
Task it must complete end-to-end: ${idea.task || "[the one task]"}
Why it's useful: ${idea.why || "[why it matters]"}

Scope rules — these decide what gets built:
- Build ONLY one substantial end-to-end task. No extra features, dashboards, or secondary agents unless they are required for the core task.
- Prefer depth (reliable recovery, good traces, clear improvement) over breadth.
- Every feature must serve the single task or one of the three required tools.${cut ? `\n- Already decided NOT to build: ${cut}` : ""}
- Must use all three required tools and show each in the demo:
  - neatlogs (observability): trace every LLM and tool call; capture a real failure found and fixed from the traces.
  - Entire (agent context): record checkpoints and session history behind code changes.
  - cfo.ai (business plan): pricing, costs, unit economics for the agent.
- Judged on: the agent itself 30%, use of the 3 tools 25%, demo video (≤ 3 min) 20%, building in public 15%, usefulness & originality 10%.
- All code must be written during the event; public repo created after kickoff.
- Building in public is 15% of the score. Post on X tagged #neatHack — at minimum: architecture decision (hour 0–2), first working run (hour ~12), a failure + the fix (hour 12–36), final demo teaser (hour 36–42). Keep the links ready for the submission quote-tweet: repo, demo video, the two before/after traces, the failure → recovery trace, the Entire checkpoint graph, the cfo.ai plan.

The agent is only done when it passes all four of these:
- Completes the full task without human intervention in the majority of runs — measure it: N runs, M completions.
- Handles at least 2–3 realistic failure modes and recovers (timeout, malformed tool output, missing data, rate limit).
- Maintains useful state across steps and retries — a retry resumes instead of restarting.
- Produces verifiable final output: a diff that passes tests, a citation that resolves, a file that exists. Never just "I did it".

Success target — must be hit by end of hour 24, no exceptions:
- Run the same task 10 times.
- At least 7/10 complete successfully without human intervention.
- Of the failures, the agent must recover and finish in at least 2 of them.
- Hour 24 is a hard checkpoint: if the numbers are below target, stop adding anything and fix reliability instead.

Original insight — non-negotiable; this separates good projects from winning ones:
- By the end, state ONE non-obvious thing you learned about making agents reliable. Examples: "state must be saved after every tool call, not just at the end of a step", or "verification must be a separate agent step, not inside the planner".
- It appears twice: as the closing line of the demo (last 15 seconds, 2:45–3:00) and at the top of the README.
- It must come from a real run — an observation from the traces, not a platitude. Instrument so the insight is visible in the data before you write it.

Evidence the judges must be able to verify — build for these from hour one, not at the end:
1. neatlogs: two traces of the same task showing a clear before → after improvement, with a measurable difference in success rate, latency, cost or recovery.
2. neatlogs: one trace that deliberately shows a failure and how the agent recovered.
3. Entire: checkpoints or entire-graph output linked to the key code changes made during the hackathon.
4. cfo.ai: a full business plan covering pricing, unit economics, costs (inference + infra), revenue model and runway.
5. GitHub: public repo with commits only between Oct 10 kickoff and Oct 12 submission deadline.
6. Demo video ≤ 3 minutes explicitly covering architecture, implementation, runtime behavior and results for all three tools.

The demo video is a strict 3:00. Build toward this structure:
- 0:00–0:30 Problem + the single substantial task the agent solves
- 0:30–1:15 Live agent run, completing the task end-to-end
- 1:15–1:50 neatlogs: traces, failure detection, before/after improvement
- 1:50–2:20 Entire: checkpoints, session context, how the coding agent used the repo
- 2:20–2:45 cfo.ai: business plan (pricing, costs, runway)
- 2:45–3:00 Closing: usefulness + one original insight

Final deliverables — the submission is these seven things:
1. Working agent (public repo)
2. neatlogs project with traces (before/after + failure recovery)
3. Entire checkpoints / graph evidence
4. cfo.ai business plan
5. 3-minute demo video
6. Short README that maps every claim to evidence
7. Ready-to-post X quote-tweet text for submission

Start by proposing: (1) the minimal architecture for this agent, (2) the exact demo task script I'll run on camera, (3) what lands in each hour block below.

The 48 hours are already blocked — plan against it:
- Hour 0–2 (kickoff): finalize architecture, set up neatlogs + Entire + cfo.ai scaffolding
- Hour 2–12: core agent loop working (planning → tools → state → basic recovery)
- Hour 12–24: make it reliable (failure recovery, verification, iteration, state persistence)
- Hour 24–36: polish + instrumentation (rich neatlogs traces, Entire checkpoints, cfo.ai model)
- Hour 36–42: demo video + public building posts + final repo cleanup
- Hour 42–48: buffer, testing, submission package`;



  const tweet = `Team ${sub.team || "[team name]"} just shipped ${idea.title || "[project]"} at #neatHack 🚀\n\n${idea.task || "[what the agent does]"}\n\nRepo: ${sub.repo || "[repo url]"}\nDemo: ${sub.demo || "[video url]"}\n\nBuilt with @neatlogs, @Entire and @cfo_ai`;

  const copy = async (text: string, set: (v: boolean) => void) => {
    await navigator.clipboard.writeText(text);
    set(true);
    setTimeout(() => set(false), 2000);
  };

  const copyTweet = () => copy(tweet, setCopied);
  const copyPrompt = () => copy(buildPrompt, setCopiedPrompt);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <header className="pb-12">
        <p className="font-mono text-sm text-primary">// neatHack · 48h · one track</p>
        <h1 className="mt-4 text-5xl font-bold leading-tight md:text-6xl">
          Mission control for an agent
          <br />
          <span className="text-muted-foreground">you'd trust unsupervised.</span>
        </h1>
        <div className="mt-10">
          <Countdown />
        </div>
        <p className="mt-6 max-w-xl rounded border border-accent/50 bg-accent/10 p-3 text-sm">
          Rule: you can plan before Oct 10, but all code must be written during the event.
          <br />
          <span className="text-muted-foreground">
            Six evidence items decide whether judges can verify your work — they're tracked in section 06.
          </span>
        </p>

      </header>

      <Section n="01" title="Your idea">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            {(["title", "task", "why"] as const).map((k) => (
              <label key={k} className="block">
                <span className="font-mono text-xs uppercase text-muted-foreground">
                  {k === "title" ? "Project name" : k === "task" ? "Task it completes end-to-end" : "Why it's useful"}
                </span>
                <textarea
                  rows={k === "title" ? 1 : 3}
                  value={idea[k]}
                  onChange={(e) => setIdea({ ...idea, [k]: e.target.value })}
                  className="mt-1 w-full resize-none rounded border border-input bg-card p-3 outline-none focus:border-ring"
                />
              </label>
            ))}
          </div>
          <div>
            <p className="mb-3 font-mono text-xs uppercase text-muted-foreground">Starter ideas — click to use</p>
            <ul className="space-y-2">
              {IDEAS.map((i) => (
                <li key={i}>
                  <button
                    onClick={() => setIdea({ ...idea, task: i })}
                    className="w-full rounded border border-border bg-card p-3 text-left transition hover:border-primary"
                  >
                    {i}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      <Section n="02" title={`Final deliverables · ${delPct}%`}>
        <p className="mb-5 max-w-xl text-sm text-muted-foreground">
          The submission is these seven things. Tick one only when it exists and a judge could open it.
        </p>
        <div className="space-y-2">
          {DELIVERABLES.map((d, i) => {
            const on = del.includes(d.id);
            return (
              <div
                key={d.id}
                className={`grid grid-cols-[auto_1fr] items-start gap-x-4 rounded border p-4 transition ${on ? "border-primary/60 bg-primary/10" : "border-border bg-card hover:border-primary"}`}
              >
                <input
                  id={`del-${d.id}`}
                  type="checkbox"
                  checked={on}
                  onChange={() => setDel(on ? del.filter((x) => x !== d.id) : [...del, d.id])}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <label
                  htmlFor={`del-${d.id}`}
                  onClick={(x) => {
                    x.preventDefault();
                    setDel(on ? del.filter((x) => x !== d.id) : [...del, d.id]);
                  }}
                  className="flex min-w-0 cursor-pointer items-start gap-4"
                >
                  <span className="w-8 shrink-0 font-mono text-sm text-accent">{String(i + 1).padStart(2, "0")}</span>
                  <span className="min-w-0">
                    <span className={`block font-bold ${on ? "text-muted-foreground" : ""}`}>{d.name}</span>
                    <span className="block text-sm text-muted-foreground">{d.detail}</span>
                    <span className="mt-1 block font-mono text-xs text-primary">→ tracked in {d.where}</span>
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </Section>

      <Section n="03" title="Scope rules">
        <div className="grid gap-4 md:grid-cols-3">
          {SCOPE.map((r, i) => (
            <div key={r.title} className="rounded border border-border bg-card p-5">
              <p className="font-mono text-xs uppercase text-accent">Rule {i + 1}</p>
              <h3 className="mt-2 text-lg font-bold text-primary">{r.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{r.detail}</p>
            </div>
          ))}
        </div>
        <label className="mt-5 block max-w-2xl">
          <span className="font-mono text-xs uppercase text-muted-foreground">Cut list — what I'm explicitly not building</span>
          <textarea
            rows={2}
            value={cut}
            onChange={(e) => setCut(e.target.value)}
            placeholder="Dashboards, multi-agent orchestration, a web UI..."
            className="mt-1 w-full resize-none rounded border border-input bg-card p-3 outline-none focus:border-ring"
          />
        </label>
      </Section>

      <Section n="04" title="Build prompt">
        <p className="mb-3 max-w-xl text-sm text-muted-foreground">
          Fill in your idea above, then copy this. Paste it on Oct 10 when kickoff starts and the build begins from a full brief.
        </p>
        <pre className="whitespace-pre-wrap rounded border border-border bg-card p-4 font-mono text-sm">{buildPrompt}</pre>
        <button
          onClick={copyPrompt}
          className="mt-3 rounded border border-primary bg-primary px-4 py-2 font-mono text-sm text-primary-foreground transition hover:opacity-90"
        >
          {copiedPrompt ? "Copied ✓" : "Copy prompt"}
        </button>
      </Section>

      <Section n="05" title="Three required tools">
        <div className="grid gap-4 md:grid-cols-3">
          {TOOLS.map((t) => (
            <a key={t.name} href={t.url} target="_blank" rel="noreferrer" className="group rounded border border-border bg-card p-5 transition hover:border-primary">
              <p className="font-mono text-xs uppercase text-accent">{t.role}</p>
              <h3 className="mt-2 text-xl font-bold group-hover:text-primary">{t.name} ↗</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
            </a>
          ))}
        </div>
      </Section>

      <Section n="06" title={`Evidence for the judges · ${evPct}%`}>
        <div className="mb-6 h-2 overflow-hidden rounded bg-muted">
          <div className="h-full bg-accent transition-all" style={{ width: `${evPct}%` }} />
        </div>
        <p className="-mt-4 mb-5 max-w-xl text-sm text-muted-foreground">
          Every claim needs something a judge can open and check. Tick an item only when the link or file exists.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {EVIDENCE.map((e) => {
            const on = ev.includes(e.id);
            return (
              <div
                key={e.id}
                className={`grid grid-cols-[auto_1fr] items-start gap-x-3 rounded border p-4 transition ${on ? "border-primary/60 bg-primary/10" : "border-border bg-card hover:border-primary"}`}
              >
                <input
                  id={`ev-${e.id}`}
                  type="checkbox"
                  checked={on}
                  onChange={() => setEv(on ? ev.filter((d) => d !== e.id) : [...ev, e.id])}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <label
                  htmlFor={`ev-${e.id}`}
                  onClick={(x) => {
                    x.preventDefault();
                    setEv(on ? ev.filter((d) => d !== e.id) : [...ev, e.id]);
                  }}
                  className="min-w-0 cursor-pointer"
                >
                  <span className="font-mono text-xs uppercase tracking-wider text-accent">{e.tool}</span>
                  <h3 className={`mt-2 font-bold ${on ? "text-muted-foreground" : ""}`}>{e.req}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{e.proof}</p>
                </label>
              </div>
            );
          })}
        </div>
      </Section>

      <Section n="07" title={`Demo video · 3:00 · ${demoPct}% filmed`}>
        <div className="mb-2 flex h-6 overflow-hidden rounded border border-border">
          {DEMO.map((b) => (
            <div
              key={b.id}
              title={`${b.t} · ${b.name}`}
              className={`flex items-center justify-center border-r border-background/40 font-mono text-[10px] last:border-r-0 ${b.tool ? "bg-primary/70 text-primary-foreground" : "bg-muted text-muted-foreground"} ${filmed.includes(b.id) ? "opacity-40" : ""}`}
              style={{ width: `${(b.s / 180) * 100}%` }}
            >
              {b.s}
            </div>
          ))}
        </div>
        <p className="mb-5 font-mono text-xs text-muted-foreground">
          seconds per beat · lime = a required tool · total 180s, no slack — rehearse to 2:55
        </p>
        <div className="space-y-2">
          {DEMO.map((b) => {
            const on = filmed.includes(b.id);
            return (
              <div
                key={b.id}
                className={`grid grid-cols-[auto_1fr] items-start gap-x-4 rounded border p-4 transition ${on ? "border-primary/60 bg-primary/10" : "border-border bg-card hover:border-primary"}`}
              >
                <input
                  id={`demo-${b.id}`}
                  type="checkbox"
                  checked={on}
                  onChange={() => setFilmed(on ? filmed.filter((d) => d !== b.id) : [...filmed, b.id])}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <label
                  htmlFor={`demo-${b.id}`}
                  onClick={(x) => {
                    x.preventDefault();
                    setFilmed(on ? filmed.filter((d) => d !== b.id) : [...filmed, b.id]);
                  }}
                  className="flex min-w-0 cursor-pointer items-start gap-4"
                >
                  <span className="w-20 shrink-0 font-mono text-sm text-accent">{b.t}</span>
                  <span className="min-w-0">
                    <span className={`block font-bold ${on ? "text-muted-foreground" : ""}`}>{b.name}</span>
                    <span className="block text-sm text-muted-foreground">{b.show}</span>
                    {b.id === "close" && insight && <span className="mt-1 block text-sm text-primary">"{insight}"</span>}
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </Section>

      <Section n="08" title={`48-hour build plan · ${planPct}%`}>
        <div className="mb-2 flex h-6 overflow-hidden rounded border border-border">
          {PHASES.map((p) => (
            <div
              key={p.id}
              title={`Hour ${p.t} · ${p.name}`}
              className={`flex items-center justify-center border-r border-background/40 font-mono text-[10px] last:border-r-0 ${p.key ? "bg-primary/70 text-primary-foreground" : "bg-muted text-muted-foreground"} ${plan.includes(p.id) ? "opacity-40" : ""}`}
              style={{ width: `${(p.h / 48) * 100}%` }}
            >
              {p.h}
            </div>
          ))}
        </div>
        <p className="mb-5 font-mono text-xs text-muted-foreground">
          hours per block · lime = where evidence gets captured · planning only, no code before kickoff
        </p>
        <div className="space-y-2">
          {PHASES.map((p) => {
            const on = plan.includes(p.id);
            return (
              <div
                key={p.id}
                className={`grid grid-cols-[auto_1fr] items-start gap-x-4 rounded border p-4 transition ${on ? "border-primary/60 bg-primary/10" : "border-border bg-card hover:border-primary"}`}
              >
                <input
                  id={`plan-${p.id}`}
                  type="checkbox"
                  checked={on}
                  onChange={() => setPlan(on ? plan.filter((d) => d !== p.id) : [...plan, p.id])}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <label
                  htmlFor={`plan-${p.id}`}
                  onClick={(x) => {
                    x.preventDefault();
                    setPlan(on ? plan.filter((d) => d !== p.id) : [...plan, p.id]);
                  }}
                  className="flex min-w-0 cursor-pointer items-start gap-4"
                >
                  <span className="w-20 shrink-0 font-mono text-sm text-accent">Hour {p.t}</span>
                  <span className="min-w-0">
                    <span className={`block font-bold ${on ? "text-muted-foreground" : ""}`}>{p.name}</span>
                    <span className="block text-sm text-muted-foreground">{p.do}</span>
                  </span>
                </label>
              </div>
            );
          })}
        </div>
      </Section>

      <Section n="09" title={`Agent success criteria · ${agentPct}%`}>
        <div className="mb-2 h-2 overflow-hidden rounded bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${agentPct}%` }} />
        </div>
        <p className="mb-5 max-w-xl text-sm text-muted-foreground">
          What "the agent works" actually means. Tick a criterion only when a run proves it — the same runs that produce your neatlogs evidence.
        </p>
        <div className="grid gap-3 md:grid-cols-2">
          {CRITERIA.map((c) => {
            const on = agent.includes(c.id);
            return (
              <div
                key={c.id}
                className={`grid grid-cols-[auto_1fr] items-start gap-x-3 rounded border p-4 transition ${on ? "border-primary/60 bg-primary/10" : "border-border bg-card hover:border-primary"}`}
              >
                <input
                  id={`ag-${c.id}`}
                  type="checkbox"
                  checked={on}
                  onChange={() => setAgent(on ? agent.filter((d) => d !== c.id) : [...agent, c.id])}
                  className="mt-1 h-4 w-4 accent-primary"
                />
                <label
                  htmlFor={`ag-${c.id}`}
                  onClick={(x) => {
                    x.preventDefault();
                    setAgent(on ? agent.filter((d) => d !== c.id) : [...agent, c.id]);
                  }}
                  className="min-w-0 cursor-pointer"
                >
                  <h3 className={`font-bold ${on ? "text-muted-foreground" : ""}`}>{c.req}</h3>
                  <p className="mt-1 text-sm text-primary">{c.test}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{c.proof}</p>
                </label>
              </div>
            );
          })}
        </div>
        <div className="mt-4 flex flex-wrap items-end gap-4 rounded border border-border bg-card p-4">
          <label className="block">
            <span className="font-mono text-xs uppercase text-muted-foreground">Runs</span>
            <input
              type="number"
              min="0"
              value={runs.total}
              onChange={(e) => setRuns({ ...runs, total: e.target.value })}
              className="mt-1 w-24 rounded border border-input bg-background p-2 font-mono outline-none focus:border-ring"
            />
          </label>
          <label className="block">
            <span className="font-mono text-xs uppercase text-muted-foreground">Finished unattended</span>
            <input
              type="number"
              min="0"
              value={runs.ok}
              onChange={(e) => setRuns({ ...runs, ok: e.target.value })}
              className="mt-1 w-24 rounded border border-input bg-background p-2 font-mono outline-none focus:border-ring"
            />
          </label>
          <label className="block">
            <span className="font-mono text-xs uppercase text-muted-foreground">Recovered + finished</span>
            <input
              type="number"
              min="0"
              value={runs.recovered}
              onChange={(e) => setRuns({ ...runs, recovered: e.target.value })}
              className="mt-1 w-24 rounded border border-input bg-background p-2 font-mono outline-none focus:border-ring"
            />
          </label>
          <p className="pb-2 font-mono text-sm text-primary">{rate}</p>
        </div>
      </Section>

      <Section n="10" title="Success target · hour 24">
        <p className="mb-5 max-w-xl text-sm text-muted-foreground">
          A hard checkpoint, not a stretch goal. The runs you log in section 09 decide it — log every run as it happens, never from memory.
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="rounded border border-border bg-card p-5">
            <p className="font-mono text-xs uppercase text-accent">Run count</p>
            <h3 className="mt-2 text-3xl font-bold text-primary">10</h3>
            <p className="mt-2 text-sm text-muted-foreground">Same task, ten times — logged as you go, not remembered at the end.</p>
          </div>
          <div className="rounded border border-border bg-card p-5">
            <p className="font-mono text-xs uppercase text-accent">Unattended completions</p>
            <h3 className="mt-2 text-3xl font-bold text-primary">≥ 7</h3>
            <p className="mt-2 text-sm text-muted-foreground">At least 7 of the 10 finish with no human intervention.</p>
          </div>
          <div className="rounded border border-border bg-card p-5">
            <p className="font-mono text-xs uppercase text-accent">Recoveries</p>
            <h3 className="mt-2 text-3xl font-bold text-primary">≥ 2</h3>
            <p className="mt-2 text-sm text-muted-foreground">Of the runs that failed, the agent recovers and finishes in at least 2.</p>
          </div>
        </div>
        <div className="mt-4 rounded border border-border bg-card p-4">
          <p className="font-mono text-xs uppercase text-muted-foreground">Where you stand right now</p>
          <p className="mt-2 font-mono text-sm text-primary">{targetStatus}</p>
        </div>
        <div
          className={`mt-3 grid grid-cols-[auto_1fr] items-start gap-x-4 rounded border p-4 transition ${targetOn ? "border-primary/60 bg-primary/10" : "border-border bg-card hover:border-primary"}`}
        >
          <input
            id="target-hit"
            type="checkbox"
            checked={targetOn}
            onChange={() => setTargetHit(targetOn ? [] : ["hit"])}
            className="mt-1 h-4 w-4 accent-primary"
          />
          <label
            htmlFor="target-hit"
            onClick={(x) => {
              x.preventDefault();
              setTargetHit(targetOn ? [] : ["hit"]);
            }}
            className="cursor-pointer text-sm text-muted-foreground"
          >
            Tick only when the numbers are actually met — 10 runs, 7+ unattended, 2+ recoveries.
          </label>
        </div>
      </Section>

      <Section n="11" title="Original insight">
        <p className="mb-5 max-w-xl text-sm text-muted-foreground">
          The last 15 seconds of the demo and the first line of the README. One non-obvious thing you learned about making agents reliable — what separates good projects from winning ones. It must come from a real run, visible in your traces, not a platitude.
        </p>
        <div className="mb-4 grid gap-3 md:grid-cols-2">
          <div className="rounded border border-border bg-card p-4">
            <p className="font-mono text-xs uppercase text-accent">Example</p>
            <p className="mt-2 text-sm text-muted-foreground">"State must be saved after every tool call, not just at the end of a step."</p>
          </div>
          <div className="rounded border border-border bg-card p-4">
            <p className="font-mono text-xs uppercase text-accent">Example</p>
            <p className="mt-2 text-sm text-muted-foreground">"Verification must be a separate agent step, not inside the planner."</p>
          </div>
        </div>
        <label className="block max-w-2xl">
          <span className="font-mono text-xs uppercase text-muted-foreground">Your insight — write it when the traces show it</span>
          <textarea
            rows={3}
            value={insight}
            onChange={(e) => setInsight(e.target.value)}
            placeholder="One sentence. Non-obvious. Backed by a run you can point to."
            className="mt-1 w-full resize-none rounded border border-input bg-card p-3 outline-none focus:border-ring"
          />
        </label>
        <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
          It lands in two places: the demo's closing beat (2:45–3:00 — it appears there once written) and the top of the README's claim → evidence map.
        </p>
      </Section>

      <Section n="12" title={`Building in public · ${postsPct}%`}>
        <div className="mb-2 h-2 overflow-hidden rounded bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${postsPct}%` }} />
        </div>
        <p className="mb-5 max-w-xl text-sm text-muted-foreground">
          15% of the score. Four posts, tagged #neatHack — each one drafted below from your idea. Tick a post once it's live.
        </p>
        <div className="space-y-3">
          {POSTS.map((p) => {
            const on = posts.includes(p.id);
            const text = p.draft.replace(/\{title\}/g, idea.title || "[project name]").replace(/\{task\}/g, idea.task || "[the one task]");
            return (
              <div key={p.id} className={`rounded border p-4 transition ${on ? "border-primary/60 bg-primary/10" : "border-border bg-card hover:border-primary"}`}>
                <div className="grid grid-cols-[auto_1fr] items-start gap-x-4">
                  <input
                    id={`post-${p.id}`}
                    type="checkbox"
                    checked={on}
                    onChange={() => setPosts(on ? posts.filter((d) => d !== p.id) : [...posts, p.id])}
                    className="mt-1 h-4 w-4 accent-primary"
                  />
                  <label
                    htmlFor={`post-${p.id}`}
                    onClick={(x) => {
                      x.preventDefault();
                      setPosts(on ? posts.filter((d) => d !== p.id) : [...posts, p.id]);
                    }}
                    className="min-w-0 cursor-pointer"
                  >
                    <span className="font-mono text-xs uppercase tracking-wider text-accent">{p.when}</span>
                    <h3 className={`mt-2 font-bold ${on ? "text-muted-foreground" : ""}`}>{p.name}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{p.include}</p>
                  </label>
                </div>
                <pre className="mt-3 whitespace-pre-wrap rounded border border-border bg-background p-3 font-mono text-xs">{text}</pre>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(text);
                    setCopiedPost(p.id);
                    setTimeout(() => setCopiedPost(""), 2000);
                  }}
                  className="mt-2 rounded border border-border px-3 py-1.5 font-mono text-xs transition hover:border-primary"
                >
                  {copiedPost === p.id ? "Copied ✓" : "Copy post"}
                </button>
              </div>
            );
          })}
        </div>
        <p className="mt-5 font-mono text-xs text-muted-foreground">
          links to keep ready for the quote-tweet · repo · demo video · before trace · after trace · failure → recovery trace · entire-graph · cfo.ai plan
        </p>
      </Section>

      <Section n="13" title={`Checklist · ${pct}%`}>


        <div className="mb-6 h-2 overflow-hidden rounded bg-muted">
          <div className="h-full bg-primary transition-all" style={{ width: `${pct}%` }} />
        </div>
        {["Before", "Build", "Submit"].map((phase) => (
          <div key={phase} className="mb-6">
            <p className="mb-2 font-mono text-xs uppercase text-muted-foreground">{phase}</p>
            {CHECKLIST.filter((c) => c.phase === phase).map((c) => {
              const on = done.includes(c.id);
              return (
                <div key={c.id} className="flex items-center gap-3 border-b border-border py-3">
                  <input
                    id={`chk-${c.id}`}
                    type="checkbox"
                    checked={on}
                    onChange={() => setDone(on ? done.filter((d) => d !== c.id) : [...done, c.id])}
                    className="h-4 w-4 accent-primary"
                  />
                  <label
                    htmlFor={`chk-${c.id}`}
                    onClick={(x) => {
                      x.preventDefault();
                      setDone(on ? done.filter((d) => d !== c.id) : [...done, c.id]);
                    }}
                    className={`flex-1 cursor-pointer ${on ? "text-muted-foreground line-through" : ""}`}
                  >
                    {c.label}
                  </label>
                </div>
              );
            })}
          </div>
        ))}
      </Section>

      <Section n="14" title="How you're judged">
        <div className="space-y-3">
          {JUDGING.map(([name, w]) => (
            <div key={name} className="grid grid-cols-[1fr_auto] items-center gap-4 md:grid-cols-[14rem_1fr_3rem]">
              <span>{name}</span>
              <div className="hidden h-3 rounded bg-muted md:block">
                <div className="h-full rounded bg-primary" style={{ width: `${(w / 30) * 100}%` }} />
              </div>
              <span className="font-mono text-primary">{w}%</span>
            </div>
          ))}
        </div>
      </Section>

      <Section n="15" title="Timeline">
        <ol className="grid gap-4 md:grid-cols-3">
          {[
            ["Oct 10", "Kickoff. Repo created, coding begins."],
            ["Oct 11", "Build, trace, fix. Post progress on X."],
            ["Oct 12 · 7:00–11:55 PM IST", "Quote-tweet submission with repo + demo."],
          ].map(([d, t]) => (
            <li key={d} className="rounded border border-border bg-card p-5">
              <p className="font-mono text-sm text-accent">{d}</p>
              <p className="mt-2">{t}</p>
            </li>
          ))}
        </ol>
      </Section>

      <Section n="16" title="Common pitfalls">
        <div className="grid gap-4 md:grid-cols-2">
          {PITFALLS.map((p) => (
            <div key={p.title} className="rounded border border-border bg-card p-5">
              <h3 className="font-bold text-primary">{p.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{p.fix}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section n="17" title="Submission kit">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            {([
              ["team", "Team name (must match Luma)"],
              ["repo", "Public repo URL"],
              ["demo", "Demo video URL"],
            ] as const).map(([k, label]) => (
              <label key={k} className="block">
                <span className="font-mono text-xs uppercase text-muted-foreground">{label}</span>
                <input
                  value={sub[k]}
                  onChange={(e) => setSub({ ...sub, [k]: e.target.value })}
                  className="mt-1 w-full rounded border border-input bg-card p-3 outline-none focus:border-ring"
                />
              </label>
            ))}
          </div>
          <div>
            <p className="mb-3 font-mono text-xs uppercase text-muted-foreground">Quote-tweet draft — updates live</p>
            <pre className="whitespace-pre-wrap rounded border border-border bg-card p-4 font-mono text-sm">{tweet}</pre>
            <button
              onClick={copyTweet}
              className="mt-3 rounded border border-primary bg-primary px-4 py-2 font-mono text-sm text-primary-foreground transition hover:opacity-90"
            >
              {copied ? "Copied ✓" : "Copy tweet"}
            </button>
          </div>
        </div>
      </Section>
    </main>
  );
}
