# The 10 Snake checks

The robot ([`snake.mjs`](snake.mjs)) opens each game in a 960×540 Chromium window, waits 300 ms and runs these
checks in order, through the `window.snake` hooks the prompt asked for. Each check has 8 seconds. Score = checks passed.

| # | Check | Passes when |
|---|---|---|
| 1 | `canvas_and_score_element` | The page has a `<canvas>` and an element with `id="score"` that shows 0. |
| 2 | `space_starts_game` | 200 ms after pressing Space, `state().running` is true. |
| 3 | `starts_moving_right` | Over the next 620 ms the head moves right and stays on the same row. |
| 4 | `arrow_keys_steer` | 470 ms after ArrowDown, `dir` is `"down"` and the head has changed row. |
| 5 | `cannot_reverse_into_itself` | 200 ms after ArrowUp (while moving down), `dir` is still `"down"` and the game is not over. |
| 6 | `food_grows_snake` | Food placed with `setFood()` on the next cell is eaten within 330 ms: score +10, length +1. |
| 7 | `score_visible` | The `#score` element shows the game's current score. |
| 8 | `wall_ends_game` | Left alone, the snake hits a wall and `gameOver` turns true within 30 steps of 150 ms. |
| 9 | `shows_game_over` | The words "Game Over" appear on the page or are drawn on the canvas. |
| 10 | `space_restarts_with_score_0` | 250 ms after Space, the game is running again, not over, with score 0. |

In the video all 15 games passed all 10 checks; the per-game results are in `results/snake-checks.json`.
