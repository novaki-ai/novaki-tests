// SPDX-License-Identifier: MIT
// Runs the hidden tests from Novaki's "Gemini 4 Argon vs four rivals" test on your own code or answers.
// No dependencies: Node.js 18 or newer.
//
//   node check.mjs duration    my-parser.js    parseDuration(text): 20 tests, score = passed / 2
//   node check.mjs calculator  my-calc.js      evaluate(expr): 30 tests, score = passed / 3 (0 if it uses eval or Function)
//   node check.mjs trick       my-answers.txt  lines "1: <answer>" to "8: <answer>", score = right / 8 x 10
//   node check.mjs logic       my-reply.txt    a reply ending "ANSWER: <name>, <seat>", score 10 or 0
//   node check.mjs hard-logic  my-reply.txt    same, for the 16-clue puzzle
//
// Add --json to print the result as JSON. These are the checks used in the video: each function is loaded
// in a fresh node:vm context (1 s to load, 0.5 s per test) and numbers must match within 1e-6 (durations)
// or 1e-9 (calculator). The Snake game has its own robot: snake.mjs.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const HERE = dirname(fileURLToPath(import.meta.url));
const load = (name) => JSON.parse(readFileSync(join(HERE, name), 'utf8'));

function runFunction(code, fnName, tests, tolerance) {
  const results = [];
  let passed = 0;
  try {
    const ctx = vm.createContext({});
    vm.runInContext(`${code}\n;globalThis.__f = typeof ${fnName} === 'function' ? ${fnName} : null;`, ctx, { timeout: 1000 });
    for (const { input, expected } of tests) {
      let got;
      try { got = vm.runInContext(`__f(${JSON.stringify(input)})`, ctx, { timeout: 500 }); } catch { got = 'ERROR'; }
      const pass = expected === null ? got === null : typeof got === 'number' && Math.abs(got - expected) < tolerance;
      if (pass) passed++;
      results.push({ input, expected, got: got === undefined ? 'undefined' : got, pass });
    }
  } catch (e) {
    results.push({ error: String(e.message).slice(0, 120) });
  }
  return { passed, total: tests.length, results };
}

// Trick questions: the same lenient matching as in the video ("16", "16 times" and "**16**" all count)
const plain = (x) => String(x).toLowerCase().replace(/\*|°|degrees?|`/g, '').replace(/[.,;\s]+$/g, '').trim();
function sameAnswer(given, expected) {
  const v = plain(given), d = plain(expected);
  if (/^\d{2}:\d{2}$/.test(d)) { const m = v.match(/(\d{1,2}):(\d{2})/); return !!m && m[1].padStart(2, '0') + ':' + m[2] === d; }
  if (/^-?\d+(\.\d+)?$/.test(d)) {
    const m = v.replace(/,/g, '').match(/-?\d+(\.\d+)?/);
    return !!m && Math.abs(parseFloat(m[0]) - parseFloat(d)) < 1e-9 && (v.replace(/,/g, '').match(/\d+(\.\d+)?/g) || []).length === 1;
  }
  if (/^[a-z]+day$/.test(d)) return v.includes(d);
  return v.replace(/[^a-z]/g, '') === d; // a letter sequence: "r, e, b, w" also counts
}

function checkTrick(text) {
  const { questions } = load('trick-questions.json');
  const given = {};
  for (const line of text.split('\n')) {
    const m = line.match(/^\s*\**\s*(\d)\s*[:.)]\**\s*(.+)$/);
    if (m && !given[m[1]]) given[m[1]] = m[2].trim();
  }
  const answers = questions.map((q) => ({ no: q.no, expected: q.answer, given: given[q.no] ?? null, pass: given[q.no] != null && sameAnswer(given[q.no], q.answer) }));
  const right = answers.filter((a) => a.pass).length;
  return { right, total: questions.length, score: right / questions.length * 10, answers };
}

// Puzzles: the logic puzzle reads the first ANSWER line, the hard puzzle the last one (as in the video)
function checkPuzzle(text, id) {
  const key = load('puzzles.json')[id];
  const re = /ANSWER:\s*\**\s*([A-Za-z]+)\s*,\s*(?:seat\s*)?(\d)/gi;
  const all = [...text.matchAll(re)];
  const m = id === 'logic-puzzle' ? all[0] : all.pop();
  const correct = !!m && m[1].toLowerCase() === key.name.toLowerCase() && +m[2] === key.seat;
  return { answer: m ? `${m[1]}, ${m[2]}` : null, correct, score: correct ? 10 : 0 };
}

function main() {
  const args = process.argv.slice(2);
  const json = args.includes('--json');
  const [test, file] = args.filter((a) => a !== '--json');
  if (!test || !file) {
    console.log('Usage: node check.mjs <duration|calculator|trick|logic|hard-logic> <file> [--json]');
    process.exit(2);
  }
  const text = readFileSync(file, 'utf8');
  let out;
  if (test === 'duration') {
    const t = load('duration-parser.json');
    out = runFunction(text, t.function, t.tests, t.tolerance);
    out.score = out.passed / 2;
  } else if (test === 'calculator') {
    const t = load('calculator.json');
    out = runFunction(text, t.function, t.tests, t.tolerance);
    out.uses_eval = /\beval\s*\(|\bnew\s+Function\b|\bFunction\s*\(/.test(text);
    out.score = out.uses_eval ? 0 : Math.round(out.passed / 3 * 100) / 100;
  } else if (test === 'trick') {
    out = checkTrick(text);
  } else if (test === 'logic' || test === 'hard-logic') {
    out = checkPuzzle(text, test === 'logic' ? 'logic-puzzle' : 'hard-logic-puzzle');
  } else {
    console.log(`Unknown test "${test}". Use duration, calculator, trick, logic or hard-logic.`);
    process.exit(2);
  }
  if (json) { console.log(JSON.stringify(out)); return; }
  for (const r of out.results || out.answers || []) {
    if (r.error) { console.log(`  could not load: ${r.error}`); continue; }
    const label = r.input !== undefined ? JSON.stringify(r.input) : `question ${r.no}`;
    console.log(`  ${r.pass ? 'pass' : 'FAIL'}  ${label.padEnd(34)} expected ${JSON.stringify(r.expected)}, got ${JSON.stringify(r.got ?? r.given)}`);
  }
  if (out.answer !== undefined) console.log(`  answer: ${out.answer ?? '(no ANSWER line found)'}  ${out.correct ? 'correct' : 'wrong'}`);
  if (out.uses_eval) console.log('  uses eval or Function: score is 0');
  const n = out.passed ?? out.right;
  console.log(n !== undefined ? `\n${n} / ${out.total} passed · score ${out.score} / 10` : `\nscore ${out.score} / 10`);
}

main();
