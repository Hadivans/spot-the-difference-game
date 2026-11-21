// Seeded RNG (mulberry32) so ?shot=...&seed=N renders identically every run.
export function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function parseSeed(search) {
  const n = Number(new URLSearchParams(search).get('seed'));
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 1;
}
export function shotName(search) {
  const s = new URLSearchParams(search).get('shot');
  return s === 'play' || s === 'end' ? s : 'start';
}
