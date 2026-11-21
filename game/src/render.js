// All 2D drawing: HUD, the two panels, markers, and the title / round / win screens.
// Logical canvas is 1280x480 so screenshots at 1280x480 match exactly.
import { PANEL_W, PANEL_H, ROUNDS, drawScene } from './scenes.js';

export const W = 1280, H = 480;
export const PANEL_Y = 92;
export const LEFT_X = 40, RIGHT_X = 680;

export function panelPos(state, x, y) {
  // Convert a canvas click to {panel:0|1, sx, sy} in panel space, or null.
  for (const [panel, px] of [[0, LEFT_X], [1, RIGHT_X]]) {
    if (x >= px && x <= px + PANEL_W && y >= PANEL_Y && y <= PANEL_Y + PANEL_H) {
      return { panel, sx: x - px, sy: y - PANEL_Y };
    }
  }
  return null;
}

function roundRect(c, x, y, w, h, r) {
  c.beginPath(); c.moveTo(x + r, y); c.arcTo(x + w, y, x + w, y + h, r); c.arcTo(x + w, y + h, x, y + h, r);
  c.arcTo(x, y + h, x, y, r); c.arcTo(x, y, x + w, y, r); c.closePath();
}

function button(c, x, y, w, h, label, accent) {
  c.fillStyle = accent ? '#ffb703' : '#33415c'; roundRect(c, x, y, w, h, 10); c.fill();
  c.strokeStyle = 'rgba(255,255,255,0.5)'; c.lineWidth = 2; roundRect(c, x, y, w, h, 10); c.stroke();
  c.fillStyle = accent ? '#1c2333' : '#fff'; c.font = 'bold 18px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(label, x + w / 2, y + h / 2 + 1);
}

export function hintButtonRect() { return { x: 1080, y: 14, w: 160, h: 44 }; }

export function draw(c, state, now) {
  c.fillStyle = '#1c2333'; c.fillRect(0, 0, W, H);
  if (state.screen === 'title') return drawTitle(c, state);
  if (state.screen === 'win') return drawWin(c, state);
  if (state.screen === 'over') return drawOver(c, state);
  if (state.screen === 'round') return drawRound(c, state);
  drawPlay(c, state, now);
}

function drawHUD(c, state) {
  const round = ROUNDS[state.round];
  c.fillStyle = '#fff'; c.font = 'bold 26px sans-serif'; c.textAlign = 'left'; c.textBaseline = 'middle';
  c.fillText('🔍 Spot the Difference', 24, 36);
  c.font = '18px sans-serif'; c.fillStyle = '#ffd166';
  c.fillText(round.name, 340, 36);
  c.fillStyle = '#fff'; c.font = 'bold 20px sans-serif'; c.textAlign = 'center';
  const left = round.diffs.length - state.found.size;
  c.fillText(`${left} left`, 640, 36);
  c.fillText(`Score ${state.score}`, 800, 36);
  const t = Math.max(0, Math.ceil(state.timeLeft));
  c.fillStyle = t <= 15 ? '#ff5d5d' : '#fff';
  c.fillText(`⏱ ${t}s`, 950, 36);
  const hb = hintButtonRect();
  button(c, hb.x, hb.y, hb.w, hb.h, `💡 Hint (${state.hintsLeft})`, false);
  // progress dots for the 3 rounds, under the hint button
  for (let i = 0; i < 3; i++) {
    c.fillStyle = i < state.round ? '#7ec850' : i === state.round ? '#ffb703' : '#556';
    c.beginPath(); c.arc(hb.x + 20 + i * 24, hb.y + hb.h + 14, 6, 0, Math.PI * 2); c.fill();
  }
}

function drawMarkers(c, state, now) {
  const round = ROUNDS[state.round];
  for (const idx of state.found) {
    const d = round.diffs[idx];
    for (const px of [LEFT_X, RIGHT_X]) {
      c.strokeStyle = '#2ee66b'; c.lineWidth = 4;
      c.beginPath(); c.arc(px + d.x, PANEL_Y + d.y, 26, 0, Math.PI * 2); c.stroke();
      c.strokeStyle = 'rgba(46,230,107,0.4)'; c.lineWidth = 8;
      c.beginPath(); c.arc(px + d.x, PANEL_Y + d.y, 32, 0, Math.PI * 2); c.stroke();
    }
  }
  // hint pulse
  if (state.hintIdx !== null && state.hintUntil > now) {
    const d = round.diffs[state.hintIdx];
    const pulse = 24 + 6 * Math.sin(now / 120);
    for (const px of [LEFT_X, RIGHT_X]) {
      c.strokeStyle = '#ffb703'; c.lineWidth = 4;
      c.beginPath(); c.arc(px + d.x, PANEL_Y + d.y, pulse, 0, Math.PI * 2); c.stroke();
    }
  }
  // wrong-click red X flashes
  for (const f of state.flashes) {
    const age = now - f.at;
    if (age > 700) continue;
    const px = (f.panel === 0 ? LEFT_X : RIGHT_X) + f.sx;
    const py = PANEL_Y + f.sy;
    c.strokeStyle = '#ff4040'; c.lineWidth = 5; c.lineCap = 'round';
    c.beginPath(); c.moveTo(px - 12, py - 12); c.lineTo(px + 12, py + 12); c.moveTo(px + 12, py - 12); c.lineTo(px - 12, py + 12); c.stroke();
  }
}

function drawPlay(c, state, now) {
  drawHUD(c, state);
  drawScene(c, LEFT_X, PANEL_Y, state.round, false);
  drawScene(c, RIGHT_X, PANEL_Y, state.round, true);
  c.fillStyle = '#ffd166'; c.font = 'bold 18px sans-serif'; c.textAlign = 'center';
  c.fillText('A', LEFT_X + PANEL_W / 2, PANEL_Y - 12);
  c.fillText('B', RIGHT_X + PANEL_W / 2, PANEL_Y - 12);
  drawMarkers(c, state, now);
  c.fillStyle = '#cdd3e0'; c.font = '15px sans-serif';
  c.fillText(ROUNDS[state.round].hint + '  ·  Click a difference on either picture  ·  H = hint, R = restart', W / 2, H - 14);
  if (state.toast) {
    c.fillStyle = 'rgba(0,0,0,0.65)'; roundRect(c, W / 2 - 180, 62, 360, 34, 8); c.fill();
    c.fillStyle = '#ffd166'; c.font = 'bold 16px sans-serif'; c.fillText(state.toast, W / 2, 80);
  }
}

function overlay(c) { c.fillStyle = 'rgba(20,26,40,0.88)'; c.fillRect(0, 0, W, H); }
function bigTitle(c, text, y, color = '#fff') {
  c.fillStyle = color; c.font = 'bold 52px sans-serif'; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(text, W / 2, y);
}
function sub(c, text, y, color = '#cdd3e0', size = 20) {
  c.fillStyle = color; c.font = `${size}px sans-serif`; c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillText(text, W / 2, y);
}

function drawTitle(c, state) {
  // mini preview: café scene faded behind the title
  drawScene(c, LEFT_X, PANEL_Y, 0, false);
  drawScene(c, RIGHT_X, PANEL_Y, 0, true);
  overlay(c);
  bigTitle(c, '🔍 SPOT THE DIFFERENCE', 120, '#ffd166');
  sub(c, 'Two pictures. Seven differences. Three rounds. 90 seconds each.', 175);
  sub(c, 'Cat Café  ·  Harbor at Sunset  ·  Garden Picnic', 208, '#7ec850', 20);
  sub(c, 'Click a difference on either picture  ·  +100 pts each  ·  Hint (H) costs 50  ·  Wrong click −5s', 246, '#cdd3e0', 17);
  button(c, W / 2 - 110, 290, 220, 52, '▶  START  (Enter)', true);
  sub(c, 'Best score wins — find all 7 to unlock the next round!', 372, '#8fa0b8', 16);
}

function drawRound(c, state) {
  drawPlay(c, state, performance.now());
  overlay(c);
  bigTitle(c, `Round ${state.round} Complete! 🎉`, 150, '#7ec850');
  sub(c, `You found all 7 differences · Round score ${state.roundScore} · Total ${state.score}`, 205);
  button(c, W / 2 - 110, 250, 220, 52, 'Next Round ▶ (Enter)', true);
}

function drawWin(c, state) {
  overlay(c);
  bigTitle(c, '🏆 YOU FOUND THEM ALL!', 120, '#ffd166');
  sub(c, 'All 21 differences across 3 rounds — sharp eyes!', 170);
  sub(c, `FINAL SCORE  ${state.winScore ?? state.score}`, 225, '#7ec850', 30);
  sub(c, 'Cat Café ✓   Harbor at Sunset ✓   Garden Picnic ✓', 275, '#cdd3e0', 20);
  button(c, W / 2 - 110, 320, 220, 52, '↻  Play Again  (R)', true);
  sub(c, 'Thanks for playing Spot the Difference!', 402, '#8fa0b8', 16);
}

function drawOver(c, state) {
  overlay(c);
  bigTitle(c, "⏱ Time's Up!", 140, '#ff5d5d');
  sub(c, `Round ${state.round + 1} ran out of time — you found ${state.found.size} of 7 differences.`, 195);
  sub(c, `Score so far: ${state.score}`, 235, '#ffd166', 22);
  button(c, W / 2 - 110, 280, 220, 52, '↻  Try Again  (R)', true);
}
