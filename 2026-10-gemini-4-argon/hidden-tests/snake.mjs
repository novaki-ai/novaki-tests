// SPDX-License-Identifier: MIT
// The robot that played every Snake game in Novaki's "Gemini 4 Argon vs four rivals" test.
// It opens the game in a 960x540 browser window, plays it through window.snake and runs 10 checks
// (described in snake-checks.md). Score = checks passed.
//
//   npm install playwright && npx playwright install chromium
//   node snake.mjs my-snake.html            one game
//   node snake.mjs ../outputs/snake/*.html  several games
//   add --json for machine-readable output
//
// Timing matters: the game is expected to move one cell every 150 ms, so run it on an idle machine.
// PLAYWRIGHT_MODULE and CHROME_PATH can point to a local Playwright install and browser.
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE || 'playwright');

// Text drawn on the canvas is recorded too, so a "Game Over" painted with fillText also counts
const CAPTURE_CANVAS_TEXT = () => {
  window.__texts = [];
  for (const name of ['fillText', 'strokeText']) {
    const original = CanvasRenderingContext2D.prototype[name];
    CanvasRenderingContext2D.prototype[name] = function (t, ...rest) {
      try { window.__texts.push(String(t)); if (window.__texts.length > 400) window.__texts.shift(); } catch {}
      return original.call(this, t, ...rest);
    };
  }
};

async function playSnake(browser, file) {
  const context = await browser.newContext({ viewport: { width: 960, height: 540 } });
  await context.addInitScript(CAPTURE_CANVAS_TEXT);
  const page = await context.newPage();
  const checks = {};
  const state = () => page.evaluate(() => window.snake.state());
  const wait = (ms) => page.waitForTimeout(ms);
  const check = async (name, fn) => {
    try {
      checks[name] = !!(await Promise.race([fn(), new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 8000))]));
    } catch { checks[name] = false; }
  };
  let loadError = null;
  try {
    await page.goto(pathToFileURL(resolve(file)).href, { waitUntil: 'load', timeout: 10000 });
    await wait(300);
    await check('canvas_and_score_element', async () => (await page.locator('canvas').count()) > 0 && /0/.test(await page.locator('#score').innerText()));
    await check('space_starts_game', async () => { await page.keyboard.press('Space'); await wait(200); return (await state()).running === true; });
    let dy = 0;
    await check('starts_moving_right', async () => { const a = (await state()).head; await wait(620); const b = (await state()).head; return b.x > a.x && b.y === a.y; });
    await check('arrow_keys_steer', async () => {
      const a = (await state()).head; await page.keyboard.press('ArrowDown'); await wait(470);
      const b = (await state()).head; dy = Math.sign(b.y - a.y);
      return (await state()).dir === 'down' && b.y !== a.y;
    });
    await check('cannot_reverse_into_itself', async () => { await page.keyboard.press('ArrowUp'); await wait(200); const t = await state(); return t.dir === 'down' && !t.gameOver; });
    await check('food_grows_snake', async () => {
      const a = await state(); const target = { x: a.head.x, y: a.head.y + (dy || 1) };
      await page.evaluate(([x, y]) => window.snake.setFood(x, y), [target.x, target.y]); await wait(330);
      const b = await state(); return b.score === a.score + 10 && b.length === a.length + 1;
    });
    // The score on screen must equal the game's real score (not a fixed "10": the snake may eat twice in a row)
    await check('score_visible', async () => { const t = await state(); return t.score > 0 && new RegExp(`(^|\\D)${t.score}(\\D|$)`).test(await page.locator('#score').innerText()); });
    await check('wall_ends_game', async () => { for (let i = 0; i < 30; i++) { if ((await state()).gameOver) return true; await wait(150); } return false; });
    await check('shows_game_over', async () => {
      await wait(200);
      const dom = await page.locator('body').innerText();
      const drawn = await page.evaluate(() => window.__texts.join(' '));
      return /game\s*over/i.test(dom + ' ' + drawn);
    });
    await check('space_restarts_with_score_0', async () => { await page.keyboard.press('Space'); await wait(250); const t = await state(); return t.running === true && !t.gameOver && t.score === 0; });
  } catch (e) { loadError = String(e.message).slice(0, 120); }
  await context.close();
  const passed = Object.values(checks).filter((v) => v === true).length;
  return { file, passed, total: 10, checks, ...(loadError ? { load_error: loadError } : {}) };
}

const args = process.argv.slice(2);
const json = args.includes('--json');
const files = args.filter((a) => a !== '--json');
if (!files.length) {
  console.log('Usage: node snake.mjs <game.html> [more.html ...] [--json]');
  process.exit(2);
}
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
const all = [];
for (const f of files) {
  const r = await playSnake(browser, f);
  all.push(r);
  if (!json) {
    console.log(`${f}: ${r.passed} / 10`);
    for (const [name, ok] of Object.entries(r.checks)) console.log(`  ${ok ? 'pass' : 'FAIL'}  ${name}`);
    if (r.load_error) console.log(`  could not load: ${r.load_error}`);
  }
}
await browser.close();
if (json) console.log(JSON.stringify(all));
