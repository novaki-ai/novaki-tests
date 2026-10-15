# Judge sheets

The exact images the two blind judges scored for the four visual tests: 60 sheets, one per run. Each sheet
shows 8 frames of the recording, taken at 1, 2.5, 4, 5.5, 7, 8.5, 10 and 11.5 seconds. The octopus test is a single
image of the SVG. For the lighthouse, the judges also got the frame where the brightness of the whole recording
jumped the most, to judge the lightning: `<code>-brightest-frame.jpg` (15 files).

The files are named by the anonymous code judge 1 (GPT-6.1 Sol, high effort) saw. Judge 2 (a fresh Claude Opus 5.5
with no other context) saw the same images reshuffled under new codes, listed in the `code_judge2` column. Neither
judge ever saw a model name. The rubric and the exact judge prompt are in [`../rubric.md`](../rubric.md).

Try scoring a few yourself before you open [`key.csv`](key.csv): it says which model and effort made each sheet,
and what both judges gave it.
