"""Recomputes results/summary.json scores from the per-test result files in this folder.

python3 score.py   → prints the scoreboard and checks it against results/summary.json
"""
import csv
import json
import os

HERE = os.path.dirname(os.path.abspath(__file__))
VISUAL = ["rocket", "lighthouse", "hexagon", "octopus"]
CODE = ["snake", "duration-parser", "calculator"]
REASONING = ["logic-puzzle", "hard-logic-puzzle", "trick-questions"]


def load(name):
    return json.load(open(os.path.join(HERE, "results", name), encoding="utf-8"))


def test_score(test, key, data):
    if test in VISUAL:
        j = data["visual"][f"{test}/{key}"]
        return (j["judge1_gpt61_sol"] + j["judge2_claude_opus55"]) / 2
    if test == "snake":
        return data["snake"][key]["passed"]
    if test == "duration-parser":
        r = data["duration"][key]
        return r["passed"] / 2
    if test == "calculator":
        r = data["calculator"][key]
        return 0 if r.get("uses_eval") else round(r["passed"] / 3, 2)
    if test in ("logic-puzzle", "hard-logic-puzzle"):
        return 10 if data["puzzles"][test][key]["correct"] else 0
    r = data["trick"]["runs"][key]
    return r["right"] / 8 * 10


def main():
    data = {"visual": load("visual-judges.json"), "snake": load("snake-checks.json"), "duration": load("duration-parser-tests.json"),
            "calculator": load("calculator-tests.json"), "puzzles": load("puzzles.json"), "trick": load("trick-questions.json")}
    rows = list(csv.DictReader(open(os.path.join(HERE, "results", "runs.csv"), encoding="utf-8")))
    summary = load("summary.json")["by_model_and_effort"]
    names = {"Gemini 4 Argon": "argon", "GPT-6.1 Sol": "sol", "GPT-6 Astra": "astra", "Claude Opus 5.5": "opus", "Claude Sonnet 5.5": "sonnet"}
    by_model = {}
    for model, short in names.items():
        for effort in ("low", "medium", "high"):
            key = f"{short}-{effort}"
            scores = [test_score(t, key, data) for t in VISUAL + CODE + REASONING]
            total = round(sum(scores) / len(scores), 2)
            expected = summary[f"{model} · {effort}"]["score"]
            flag = "ok" if abs(total - expected) < 0.006 else f"MISMATCH (summary says {expected})"
            cost = sum(float(r["cost_usd"]) for r in rows if r["model"] == model and r["effort"] == effort)
            print(f"{model:18} {effort:7} {total:5.2f}  ${cost:6.3f}  {flag}")
            by_model.setdefault(model, []).append(total)
    print()
    for model, s in sorted(by_model.items(), key=lambda x: -sum(x[1])):
        print(f"{model:18} {sum(s) / 3:5.2f}")


if __name__ == "__main__":
    main()
