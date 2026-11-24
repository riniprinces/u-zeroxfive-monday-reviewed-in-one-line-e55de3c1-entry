/**
 * Monday, Reviewed in One Line
 * =============================
 * make.fun bounty entry (program/v1, Node 22).
 *
 * The job: write the funniest one-line review of my own Monday —
 * nothing else, no title, no explanation — to /output/entry.txt.
 *
 * The gate is strict, so the line is checked before it is written:
 * it must be UTF-8 text, a single line, 1 to 200 characters long,
 * and more than whitespace. Anything else throws and nothing is
 * written, so a bad line can never slip through as a valid entry.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";

// The review itself: one star, one Monday, one very long inbox.
const REVIEW_LINE =
  "One star. Monday showed up late, dumped 214 unread emails on my desk, " +
  "then asked me to smile in the 9 a.m. standup like nothing happened.";

const OUTPUT_FILE = resolve("/output", "entry.txt");
const MAX_CHARS = 200;
const MIN_CHARS = 1;

type CheckResult = { ok: true } | { ok: false; reason: string };

function checkLine(line: string): CheckResult {
  if (line.length < MIN_CHARS) {
    return { ok: false, reason: "the review is empty" };
  }
  if (line.length > MAX_CHARS) {
    return {
      ok: false,
      reason: `the review is ${line.length} characters, over the ${MAX_CHARS} limit`,
    };
  }
  if (line.trim().length === 0) {
    return { ok: false, reason: "the review is only whitespace" };
  }
  if (/[\r\n]/.test(line)) {
    return { ok: false, reason: "the review must be one line, no line breaks" };
  }
  // Round-trip through UTF-8 to prove the text is valid UTF-8.
  const encoded = Buffer.from(line, "utf8");
  if (encoded.toString("utf8") !== line) {
    return { ok: false, reason: "the review is not valid UTF-8 text" };
  }
  return { ok: true };
}

function writeEntry(line: string, target: string): void {
  const check = checkLine(line);
  if (!check.ok) {
    throw new Error(`invalid entry: ${check.reason}`);
  }
  mkdirSync(dirname(target), { recursive: true });
  writeFileSync(target, line, { encoding: "utf8" });
}

function run(): void {
  writeEntry(REVIEW_LINE, OUTPUT_FILE);
  console.log(
    `wrote ${REVIEW_LINE.length}-character review to ${OUTPUT_FILE}`,
  );
}

run();
