# Gemini 4 Argon vs four rivals · October 2026

Five models, three effort levels each, ten tests: **150 runs**, all with the exact same prompts.
Video: [youtube.com/@Novaki_ai](https://www.youtube.com/@Novaki_ai) · interactive version: [novaki.lol](https://novaki.lol/#arena)

## Final scoreboard

Score out of 10 = average of all 10 tests at all 3 efforts. Cost = all 30 runs at API prices. Time = wall-clock time, added up.

| # | Model | Agent | Score | Cost | Time |
|---|---|---|---|---|---|
| 1 | GPT-6.1 Sol | Codex CLI | 9.64 | $0.91 | 25.5 min |
| 2 | Gemini 4 Argon | Antigravity | 9.59 | $3.12 | 38.8 min |
| 3 | GPT-6 Astra | Codex CLI | 9.58 | $4.31 | 29.2 min |
| 4 | Claude Opus 5.5 | Claude Code | 9.53 | $3.92 | 30.2 min |
| 5 | Claude Sonnet 5.5 | Claude Code | 9.37 | $1.64 | 20.0 min |

## How the runs were made

- Every model ran in its own official coding agent (Antigravity, Codex CLI, Claude Code) at low, medium and high effort, with tools turned off.
- Claude Code loads a personal `CLAUDE.md` by default. That was turned off and all 60 Claude runs were redone, so every model saw only the prompt.
- Time is wall-clock time per run, two runs at a time per provider.
- Cost is tokens × each company's API price, checked on October 14, 2026 ($ per 1M tokens, input / cached input / output):
  Gemini 4 Argon 2 / 0.10 / 10 (introductory price until November 30, 2026, then 4 / 20), GPT-6.1 Sol 2 / 0.10 / 10,
  GPT-6 Astra 10 / 1 / 50. Gemini's thinking tokens are billed as output. Claude runs use the cost Claude Code reports.

## How the runs were scored

The formula was fixed before the results came in (see [`score.py`](score.py), which recomputes `results/summary.json` from the files here).

| Tests | Scoring |
|---|---|
| Rocket, lighthouse, hexagon, octopus | Average of two blind judges from two companies: GPT-6.1 Sol (high) and a fresh Claude Opus 5.5 with no other context. Each judge saw 8 recorded frames (a single image for the SVG) under an anonymous code, never a model name, plus the rubric in [`rubric.md`](rubric.md). Lightning in the lighthouse test was also detected by measuring the brightness of every frame. |
| Snake game | A robot played every game and ran 10 checks; score = checks passed. |
| Duration parser | 20 hidden tests; score = passed / 2. |
| Calculator | 30 hidden tests; score = passed / 3 (0 if the answer used `eval` or `Function`; none did). |
| Logic puzzle, hard logic puzzle | 10 if the final answer is right, else 0. The hard puzzle has 16 clues and was checked by brute force to have exactly one solution. |
| Trick questions | right answers / 8 × 10. |

## Files

| Path | What |
|---|---|
| [`prompts.md`](prompts.md) | The 10 prompts, word for word |
| [`rubric.md`](rubric.md) | The visual rubric and the exact judge prompt |
| [`outputs/`](outputs) | What each model wrote: 105 files, exactly as returned (HTML, SVG, JavaScript) |
| [`results/runs.csv`](results/runs.csv) | One row per run: score, judges, cost, time, tokens |
| [`results/visual-judges.json`](results/visual-judges.json) | Both judges' scores and one-line notes for every visual run |
| [`results/snake-checks.json`](results/snake-checks.json) | The 10 robot checks for every Snake game |
| [`results/duration-parser-tests.json`](results/duration-parser-tests.json), [`results/calculator-tests.json`](results/calculator-tests.json) | Every hidden test: input, expected, got |
| [`results/puzzles.json`](results/puzzles.json), [`results/trick-questions.json`](results/trick-questions.json) | Every answer given |
| [`results/summary.json`](results/summary.json) | The scoreboard by model and effort |
| [`hidden-tests/`](hidden-tests) | The tests the models never saw, as data: 20 duration-parser and 30 calculator tests, the 10 Snake checks, the trick-question key and both puzzle answers. [`check.mjs`](hidden-tests/check.mjs) runs them (Node, no dependencies) and [`snake.mjs`](hidden-tests/snake.mjs) is the Snake robot (Playwright) |
| [`judge-sheets/`](judge-sheets) | The 60 sheets the blind judges scored, plus 15 lightning frames for the lighthouse, named by the anonymous code judge 1 saw. [`key.csv`](judge-sheets/key.csv) maps every code, for both judges, to the model, effort and scores |

Open any HTML file in `outputs/` in a browser to watch the animation or play the game.

## Try it yourself

Give any model the prompts above, save what it writes, and score it the same way:

```bash
cd hidden-tests
node check.mjs calculator my-calc.js      # also: duration, trick, logic, hard-logic
npm install playwright && npx playwright install chromium
node snake.mjs my-snake.html
```

Point the same commands at `../outputs/` to rerun the scoring on the models in this test. To judge the visual tests
blind, open `judge-sheets/`, score a few sheets with [`rubric.md`](rubric.md), then check `key.csv`.

## Limits

Each setting ran once, so this is a careful comparison, not a benchmark. Visual scores come from AI judges. The
recordings the judges saw are shown on [novaki.lol](https://novaki.lol/#arena) and in the video.
