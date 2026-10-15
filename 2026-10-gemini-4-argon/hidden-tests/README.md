# Hidden tests

The tests the models never saw. Use them to try the same prompts on any model you like, then score its answers
exactly the way the video did. The prompts are in [`../prompts.md`](../prompts.md).

| File | What |
|---|---|
| [`duration-parser.json`](duration-parser.json) | The 20 tests for `parseDuration(text)` (test 6). `expected: null` means the function must return `null`. |
| [`calculator.json`](calculator.json) | The 30 tests for `evaluate(expr)` (test 7). |
| [`snake-checks.md`](snake-checks.md) | The 10 checks the robot ran on every Snake game (test 5). |
| [`trick-questions.json`](trick-questions.json) | The 8 trick questions and their answers (test 10). |
| [`puzzles.json`](puzzles.json) | The answers to both logic puzzles (tests 8 and 9), and the full grid of the hard one. |
| [`check.mjs`](check.mjs) | Runs the function tests, the trick questions and the puzzles. No dependencies. |
| [`snake.mjs`](snake.mjs) | The Snake robot. Needs Playwright. |

## Run them

Save the model's code block to a file, then:

```bash
node check.mjs duration   my-parser.js
node check.mjs calculator my-calc.js
node check.mjs trick      my-answers.txt
node check.mjs logic      my-reply.txt
node check.mjs hard-logic my-reply.txt
```

```bash
npm install playwright && npx playwright install chromium
node snake.mjs my-snake.html
```

To rerun the scoring on the models from the video, point the scripts at their files in `../outputs/`:

```bash
node check.mjs calculator ../outputs/calculator/argon-high.js
node snake.mjs ../outputs/snake/*.html
```

## Scoring

| Test | Score out of 10 |
|---|---|
| Duration parser | passed / 2 |
| Calculator | passed / 3, or 0 if the code uses `eval` or `Function` |
| Snake game | checks passed |
| Trick questions | right / 8 × 10 |
| Logic puzzles | 10 if the final `ANSWER:` line is right, else 0 |

Every function runs in a fresh `node:vm` context: 1 second to load, half a second per test. Numbers must match
within 1e-6 for durations and 1e-9 for the calculator. The trick-question matching is lenient about format
("16", "16 times" and "**16**" all count) but strict about the value.

`check.mjs` and `snake.mjs` are MIT licensed; the test data is CC BY 4.0.
