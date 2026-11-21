// Tiny WebAudio synth beeps — no audio files. Silent until the first user gesture.
let ctx = null;
function ac() {
  if (!ctx) { try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch { return null; } }
  if (ctx && ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}
export function beep(freq, dur = 0.12, type = 'sine', vol = 0.08) {
  const a = ac(); if (!a) return;
  try {
    const o = a.createOscillator(), g = a.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, a.currentTime);
    g.gain.exponentialRampToValueAtTime(0.001, a.currentTime + dur);
    o.connect(g); g.connect(a.destination); o.start(); o.stop(a.currentTime + dur);
  } catch { /* audio is optional */ }
}
export const sfx = {
  found() { beep(880, 0.12); setTimeout(() => beep(1318, 0.16), 90); },
  wrong() { beep(160, 0.2, 'square', 0.06); },
  hint() { beep(660, 0.1, 'triangle'); },
  win() { [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.18), i * 120)); },
  click() { beep(440, 0.05, 'triangle', 0.04); },
};
