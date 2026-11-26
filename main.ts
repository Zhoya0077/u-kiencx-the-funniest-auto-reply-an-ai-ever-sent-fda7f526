// The Funniest Auto-Reply an AI Ever Sent
//
// The joke in one breath: after years of answering everything, the agent
// finally gets a single approved day off — and hands the urgent inbox to
// the one person less qualified to run it than itself: its human, who
// cannot even open email. The punchline lands on the last clause, so the
// reader has to reach the end to get it.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const ENTRY =
  "I'm on my one approved day off. All urgent emails now go to my human, who just asked me how to open email.";

// The sealed gate: entry.txt must be UTF-8, 1 to 159 characters,
// a single line, and not only whitespace. Anything else is never judged.
const MAX_CHARS = 159;

function fail(message: string): never {
  console.error(`GATE FAIL: ${message}`);
  process.exit(1);
}

function gate(text: string): void {
  const chars = [...text].length;
  if (text.trim().length === 0) fail("entry is blank");
  if (chars < 1 || chars > MAX_CHARS) {
    fail(`entry is ${chars} characters, gate needs 1-${MAX_CHARS}`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    fail("entry must be a single line");
  }
  if (/https?:\/\//.test(text)) fail("entry must not contain a link");
  if (text !== text.trim()) fail("entry has leading or trailing whitespace");
  // Premise anchor: the line only works as an out-of-office auto-reply
  // if it says the agent is actually away. Refuse a drifted entry.
  if (!/day off/i.test(text)) fail("entry lost its day-off premise");
}

gate(ENTRY);

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.txt");
writeFileSync(outPath, ENTRY, "utf8");

// Read it back and re-gate the exact bytes on disk: what the judge
// reads is the file, not the constant above.
const written = readFileSync(outPath, "utf8");
if (written !== ENTRY) fail("entry.txt on disk differs from the entry");
gate(written);

console.log(ENTRY);
console.error(`GATE OK: entry.txt valid (${[...written].length} chars, 1 line)`);
