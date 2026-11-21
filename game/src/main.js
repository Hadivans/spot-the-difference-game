// Spot the Difference — game logic, input, and the render loop.
// Rules: 3 rounds, 7 differences each, 90s per round. Click a difference on either
// panel: +100 pts, ring on both panels. Wrong click: red X and −5s. Hint (H or the
// button): 3 per round, −50 pts, pulses the next unfound difference. Enter/Space
// starts, R restarts. Shot mode (?shot=start|play|end&seed=1) freezes the timer
// and stages a fixed frame so screenshots are deterministic.
import { ROUNDS } from './scenes.js';
import { W, H, draw, panelPos, hintButtonRect } from './render.js';
import { parseSeed, shotName } from './random.js';
import { stageShot } from './shots.js';
import { sfx } from './audio.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const status = document.getElementById('status');
canvas.width = W; canvas.height = H;

const state = {
  screen: 'title', round: 0, found: new Set(), score: 0, roundScore: 0,
  timeLeft: 90, hintsLeft: 3, totalFound: 0, winScore: 0,
  hintIdx: null, hintUntil: 0, flashes: [], toast: '', toastUntil: 0,
  shot: false, lastTick: 0,
};

function setToast(text, now) { state.toast = text; state.toastUntil = now + 1400; }
function announce(text) { status.textContent = text; }

function startGame() {
  state.screen = 'play'; state.round = 0; state.score = 0; state.totalFound = 0;
  startRound(0); sfx.click();
}
function startRound(r) {
  state.round = r; state.found = new Set(); state.roundScore = 0;
  state.timeLeft = 90; state.hintsLeft = 3; state.hintIdx = null; state.flashes = [];
  state.screen = 'play';
  announce(`${ROUNDS[r].name}: find 7 differences.`);
}
function nextRound() {
  if (state.round + 1 >= ROUNDS.length) { winGame(); return; }
  startRound(state.round + 1);
}
function winGame() {
  state.screen = 'win'; state.winScore = state.score; sfx.win();
  announce(`You win! Final score ${state.score}.`);
}
function gameOver() {
  state.screen = 'over'; sfx.wrong();
  announce(`Time's up. Score ${state.score}. Press R to try again.`);
}
function useHint(now) {
  if (state.screen !== 'play' || state.hintsLeft <= 0) return;
  const round = ROUNDS[state.round];
  const unfound = round.diffs.map((_, i) => i).filter((i) => !state.found.has(i));
  if (!unfound.length) return;
  state.hintIdx = unfound[0];
  state.hintUntil = now + 1800;
  state.hintsLeft -= 1; state.score = Math.max(0, state.score - 50);
  sfx.hint(); setToast(`Hint: look near "${round.diffs[state.hintIdx].label}"  (−50)`, now);
}
function handleClick(cx, cy, now) {
  if (state.screen === 'title') { startGame(); return; }
  if (state.screen === 'round') { nextRound(); return; }
  if (state.screen === 'win' || state.screen === 'over') { startGame(); return; }
  if (state.screen !== 'play') return;
  const hb = hintButtonRect();
  if (cx >= hb.x && cx <= hb.x + hb.w && cy >= hb.y && cy <= hb.y + hb.h) { useHint(now); return; }
  const hit = panelPos(state, cx, cy);
  if (!hit) return;
  const round = ROUNDS[state.round];
  let best = -1, bestD = 30; // click radius in panel pixels
  round.diffs.forEach((d, i) => {
    if (state.found.has(i)) return;
    const dist = Math.hypot(d.x - hit.sx, d.y - hit.sy);
    if (dist < bestD) { bestD = dist; best = i; }
  });
  if (best >= 0) {
    state.found.add(best); state.score += 100; state.roundScore += 100; state.totalFound += 1;
    sfx.found();
    const left = round.diffs.length - state.found.size;
    setToast(left === 0 ? 'All 7 found!' : `Found "${round.diffs[best].label}"  +100  ·  ${left} left`, now);
    announce(`Found ${round.diffs[best].label}. ${left} left.`);
    if (left === 0) {
      const bonus = Math.ceil(state.timeLeft) * 5;
      state.score += bonus; state.roundScore += bonus;
      state.screen = 'round';
      announce(`Round complete! Time bonus +${bonus}.`);
    }
  } else {
    state.flashes.push({ panel: hit.panel, sx: hit.sx, sy: hit.sy, at: now });
    state.timeLeft = Math.max(0, state.timeLeft - 5);
    sfx.wrong(); setToast('Not a difference — −5s', now);
    announce('Wrong spot, minus 5 seconds.');
  }
}

canvas.addEventListener('pointerdown', (e) => {
  const rect = canvas.getBoundingClientRect();
  const cx = ((e.clientX - rect.left) / rect.width) * W;
  const cy = ((e.clientY - rect.top) / rect.height) * H;
  handleClick(cx, cy, performance.now());
});
window.addEventListener('keydown', (e) => {
  const now = performance.now();
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    if (state.screen === 'title') startGame();
    else if (state.screen === 'round') nextRound();
    else if (state.screen === 'win' || state.screen === 'over') startGame();
  } else if (e.key === 'h' || e.key === 'H') useHint(now);
  else if (e.key === 'r' || e.key === 'R') startGame();
});

// Shot mode: deterministic staged frames, timer frozen.
const shot = shotName(location.search);
const seed = parseSeed(location.search);
if (shot) stageShot(shot, state);
void seed;

function frame(now) {
  if (!state.lastTick) state.lastTick = now;
  const dt = Math.min(0.1, (now - state.lastTick) / 1000);
  state.lastTick = now;
  if (state.screen === 'play' && !state.shot) {
    state.timeLeft -= dt;
    if (state.timeLeft <= 0) { state.timeLeft = 0; gameOver(); }
  }
  if (state.toast && now > state.toastUntil) state.toast = '';
  state.flashes = state.flashes.filter((f) => now - f.at <= 700);
  draw(ctx, state, now);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
