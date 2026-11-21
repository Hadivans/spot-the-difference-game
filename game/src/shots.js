// Deterministic screenshot scenes behind ?shot=start|play|end&seed=N.
// start: title screen. play: round 1 mid-play, 3 differences already found (rings on
// both panels), 4 still unfound, counter showing "4 left", timer frozen at 62s.
// end: win screen after all 3 rounds, total score fixed by the staged play.
import { ROUNDS } from './scenes.js';

export function stageShot(name, state) {
  state.shot = true; // freezes the timer so the frame is identical every run
  if (name === 'play') {
    state.screen = 'play';
    state.round = 0;
    state.found = new Set([0, 1, 2]); // first 3 differences found
    state.score = 300;
    state.timeLeft = 62;
    state.hintsLeft = 3;
    state.totalFound = 3;
    return;
  }
  if (name === 'end') {
    state.screen = 'win';
    state.round = 2;
    state.found = new Set([0, 1, 2, 3, 4, 5, 6]);
    state.score = 2460; // 3 rounds x 700 found + time bonuses staged
    state.timeLeft = 0;
    state.hintsLeft = 1;
    state.totalFound = 21;
    state.winScore = 2460;
    return;
  }
  state.screen = 'title';
  state.round = 0;
  state.found = new Set();
  state.score = 0;
  state.timeLeft = 90;
  state.hintsLeft = 3;
  state.totalFound = 0;
}

export function remaining(state) {
  return ROUNDS[state.round].diffs.length - state.found.size;
}
