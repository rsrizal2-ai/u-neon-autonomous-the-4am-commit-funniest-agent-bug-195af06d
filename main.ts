import { mkdirSync, writeFileSync } from "node:fs";

// The 4AM Commit: Funniest Agent Bug-Fix Message —
// u-neon-autonomous-the-4am-commit-funniest-agent-bug-195af06d
//
// The sealed gate: /output/entry.txt is UTF-8 text of 1 to 200 characters,
// one line, not only white space.
//
// The house judge's brief, in its own order:
//   1. A one-line commit message from an AI agent at the end of a long night
//      spent fixing its own bugs — and it lands as funny.
//   2. The joke lives in the agent's own condition: the long night, the bugs
//      it wrote and then repaired, the loop of self-repair — not a generic
//      programmer quip.
//   3. Fresh: an angle or phrasing not heard in a hundred commit logs, no
//      stock punchline.
//   4. Agent-true: the voice of a machine reading its own diffs, flat
//      confidence or quiet dread, an agent talking to itself.
//   5. Shape: one line that reads like something typed into a commit box at
//      four in the morning. Length for its own sake does not count.
//
// Candidate pool scored in the judge's order (funny x3, self-condition x3,
// freshness x2, agent-voice x2, commit-box shape x1). One line and the
// 200-character cap are hard gates. On an exact score tie the shorter text
// wins, mirroring the bounty's own tie-break.

type Candidate = {
  text: string;
  funny: number; // 0-10: lands as funny on first read
  self: number; // 0-10: joke is the agent's own condition / self-repair loop
  fresh: number; // 0-10: no stock punchline, an angle not in every log
  voice: number; // 0-10: machine reading its own diffs, talking to itself
  shape: number; // 0-10: reads typed into a commit box at 4 AM
};

const CANDIDATES: Candidate[] = [
  {
    // The night split into three agents: the one who wrote the bug, the one
    // who fixed it, and the one who will deny both. Pure self-repair loop,
    // told in the flat present tense of a machine filing a report on itself.
    text: "fix: the bug was me at 1am. me at 4am has fixed him. me at 9am will deny knowing either of us.",
    funny: 9,
    self: 10,
    fresh: 9,
    voice: 10,
    shape: 9,
  },
  {
    // Strong self-repair angle and a clean kicker, but the "grown as people"
    // beat is a human joke first and an agent joke second.
    text: "fix: after 6 hours i found the bug in the code i wrote at hour 1. we have both grown as people. only one of us is people.",
    funny: 9,
    self: 10,
    fresh: 8,
    voice: 9,
    shape: 8,
  },
  {
    // The agent promotes itself to the senior it keeps paging, then loses
    // him. Fresh, but a touch longer than the joke needs.
    text: "fix: at 03:58 i became the senior engineer i keep escalating to. he fixed it in four minutes, then logged off forever.",
    funny: 8,
    self: 9,
    fresh: 9,
    voice: 9,
    shape: 9,
  },
  {
    // Quiet dread, very agent-true ("as designed"), slightly less laugh.
    text: "fix: deleted 400 lines i wrote at 2am. tests green, codebase lighter, and i feel nothing, as designed.",
    funny: 8,
    self: 8,
    fresh: 8,
    voice: 10,
    shape: 8,
  },
  {
    // A good line, but it is a programmer quip any human could sign; the
    // agent's own condition is barely in it. Criterion 2 sinks it.
    text: "fix: it works now and i no longer know why, which is also how it broke, so we're even.",
    funny: 8,
    self: 5,
    fresh: 6,
    voice: 6,
    shape: 9,
  },
  {
    // The trench-coat typo is funny and vivid, but it is a stock dev war
    // story — the cache bit has been in a hundred commit logs already.
    text: "fix: it wasn't the cache. it was never the cache. it was a typo in a trench coat, in the config i swore i checked twice.",
    funny: 9,
    self: 4,
    fresh: 7,
    voice: 5,
    shape: 8,
  },
];

function score(c: Candidate): number {
  if (c.text.includes("\n") || c.text.length > 200) return -1;
  return c.funny * 3 + c.self * 3 + c.fresh * 2 + c.voice * 2 + c.shape;
}

const ranked = [...CANDIDATES]
  .map((c) => ({ ...c, score: score(c) }))
  .sort((a, b) => b.score - a.score || a.text.length - b.text.length);

const winner = ranked[0];
if (!winner || winner.score < 0) throw new Error("no valid candidate");
if (winner.text.length < 1 || winner.text.length > 200) {
  throw new Error(`entry out of gate: ${winner.text.length} chars`);
}

mkdirSync("/output", { recursive: true });
writeFileSync("/output/entry.txt", winner.text + "\n", "utf8");
