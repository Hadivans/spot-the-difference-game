// Original canvas art: three scenes, each drawn twice (left = A, right = B).
// The right panel differs in exactly 7 places. All coordinates are in panel space
// (W=560, H=340); diffs list the centre of each changed element.
export const PANEL_W = 560;
export const PANEL_H = 340;

export const ROUNDS = [
  {
    name: '1 · Cat Café',
    hint: 'A cosy café with a sleepy cat. 7 things changed on the right!',
    diffs: [
      { x: 92, y: 62, label: 'sun in the window' },
      { x: 298, y: 58, label: 'wall clock' },
      { x: 472, y: 88, label: 'flower on the plant' },
      { x: 148, y: 232, label: "cat's tail" },
      { x: 352, y: 238, label: 'coffee cup' },
      { x: 482, y: 288, label: 'toy mouse' },
      { x: 84, y: 306, label: 'rug stripe' },
    ],
  },
  {
    name: '2 · Harbor at Sunset',
    hint: 'Golden hour at the harbor. 7 things changed on the right!',
    diffs: [
      { x: 96, y: 66, label: 'setting sun' },
      { x: 302, y: 196, label: 'sailboat sail' },
      { x: 478, y: 118, label: 'lighthouse light' },
      { x: 196, y: 56, label: 'seagull' },
      { x: 418, y: 282, label: 'buoy' },
      { x: 176, y: 282, label: 'jumping fish' },
      { x: 352, y: 48, label: 'cloud' },
    ],
  },
  {
    name: '3 · Garden Picnic',
    hint: 'A picnic under the old oak. 7 things changed on the right!',
    diffs: [
      { x: 118, y: 66, label: 'butterfly' },
      { x: 282, y: 252, label: 'apple on the blanket' },
      { x: 452, y: 182, label: 'tulip colour' },
      { x: 82, y: 198, label: 'picnic basket' },
      { x: 348, y: 88, label: 'bee' },
      { x: 482, y: 76, label: 'apples on the tree' },
      { x: 198, y: 222, label: 'teacup' },
    ],
  },
];

function circle(c, x, y, r, fill) { c.fillStyle = fill; c.beginPath(); c.arc(x, y, r, 0, Math.PI * 2); c.fill(); }
function rect(c, x, y, w, h, fill) { c.fillStyle = fill; c.fillRect(x, y, w, h); }
function ellipse(c, x, y, rx, ry, fill) { c.fillStyle = fill; c.beginPath(); c.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2); c.fill(); }

// right === true draws the B variant (with the 7 differences applied).
export function drawScene(c, ox, oy, round, right) {
  c.save();
  c.translate(ox, oy);
  c.beginPath(); c.rect(0, 0, PANEL_W, PANEL_H); c.clip();
  if (round === 0) drawCafe(c, right);
  else if (round === 1) drawHarbor(c, right);
  else drawPicnic(c, right);
  // soft frame
  c.strokeStyle = 'rgba(0,0,0,0.35)'; c.lineWidth = 4; c.strokeRect(2, 2, PANEL_W - 4, PANEL_H - 4);
  c.restore();
}

function drawCafe(c, r) {
  rect(c, 0, 0, PANEL_W, PANEL_H, '#f7e8c9');           // wall
  rect(c, 0, 250, PANEL_W, 90, '#c98f5f');              // floor
  // window + sun (diff 0: sun missing on right)
  rect(c, 40, 30, 110, 100, '#bfe3f2'); rect(c, 40, 30, 110, 100, 'rgba(255,255,255,0.25)');
  c.strokeStyle = '#8a5a2b'; c.lineWidth = 5; c.strokeRect(40, 30, 110, 100);
  c.beginPath(); c.moveTo(95, 30); c.lineTo(95, 130); c.moveTo(40, 80); c.lineTo(150, 80); c.stroke();
  if (!r) { circle(c, 92, 62, 18, '#ffcf3f'); circle(c, 92, 62, 26, 'rgba(255,207,63,0.35)'); }
  // clock (diff 1: clock missing on right)
  if (!r) {
    circle(c, 298, 58, 26, '#fffdf5'); c.strokeStyle = '#5b3a1e'; c.lineWidth = 4; c.beginPath(); c.arc(298, 58, 26, 0, Math.PI * 2); c.stroke();
    c.beginPath(); c.moveTo(298, 58); c.lineTo(298, 40); c.moveTo(298, 58); c.lineTo(314, 58); c.stroke();
  }
  // shelf + plant (diff 2: flower red on left, blue on right)
  rect(c, 420, 110, 110, 10, '#8a5a2b');
  rect(c, 458, 78, 30, 34, '#d96b4f');
  circle(c, 473, 66, 9, '#3f9e4d'); circle(c, 462, 74, 8, '#3f9e4d'); circle(c, 484, 74, 8, '#3f9e4d');
  circle(c, 472, 88, 10, r ? '#4f7dd9' : '#e23b3b');
  // table
  rect(c, 60, 250, 440, 14, '#8a5a2b'); rect(c, 90, 264, 16, 76, '#6e4520'); rect(c, 454, 264, 16, 76, '#6e4520');
  // cat (diff 3: tail up on left, tail down on right)
  ellipse(c, 170, 238, 62, 30, '#f2a541');           // body
  circle(c, 122, 216, 26, '#f2a541');                 // head
  c.fillStyle = '#f2a541';
  c.beginPath(); c.moveTo(104, 196); c.lineTo(112, 172); c.lineTo(124, 194); c.closePath(); c.fill();
  c.beginPath(); c.moveTo(128, 194); c.lineTo(140, 172); c.lineTo(146, 196); c.closePath(); c.fill();
  circle(c, 114, 214, 3, '#222'); circle(c, 130, 214, 3, '#222');
  c.strokeStyle = '#f2a541'; c.lineWidth = 10; c.lineCap = 'round'; c.beginPath();
  if (!r) { c.moveTo(228, 232); c.quadraticCurveTo(258, 210, 250, 182); } // tail up
  else { c.moveTo(228, 238); c.quadraticCurveTo(256, 252, 252, 276); }   // tail drooping
  c.stroke();
  // coffee cup (diff 4: cup missing on right)
  if (!r) {
    rect(c, 336, 216, 34, 26, '#fff'); c.strokeStyle = '#5b3a1e'; c.lineWidth = 3; c.strokeRect(336, 216, 34, 26);
    c.beginPath(); c.arc(372, 229, 8, -Math.PI / 2, Math.PI / 2); c.stroke();
    rect(c, 332, 242, 42, 6, '#5b3a1e');
  }
  // toy mouse (diff 5: mouse missing on right)
  if (!r) {
    ellipse(c, 482, 288, 18, 11, '#9aa0a6'); circle(c, 466, 282, 8, '#9aa0a6');
    circle(c, 462, 276, 4, '#e23b3b'); c.strokeStyle = '#9aa0a6'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(498, 288); c.quadraticCurveTo(516, 292, 520, 280); c.stroke();
  }
  // rug (diff 6: stripe orange on left, teal on right)
  rect(c, 40, 296, 130, 22, '#e23b3b');
  rect(c, 40, 304, 130, 6, r ? '#2a9d8f' : '#ff9f1c');
  rect(c, 400, 296, 120, 22, '#e23b3b');
}

function drawHarbor(c, r) {
  rect(c, 0, 0, PANEL_W, 210, '#ff9e57');              // sunset sky
  rect(c, 0, 140, PANEL_W, 70, '#ff7b54');
  rect(c, 0, 210, PANEL_W, 130, '#2a6f97');            // sea
  // sun (diff 0: sun missing on right)
  if (!r) { circle(c, 96, 66, 30, '#fff3b0'); circle(c, 96, 66, 42, 'rgba(255,243,176,0.4)'); }
  // cloud (diff 6: cloud missing on right)
  if (!r) { ellipse(c, 352, 48, 44, 14, '#ffe8d6'); ellipse(c, 376, 40, 30, 12, '#ffe8d6'); }
  ellipse(c, 130, 44, 40, 12, '#ffe8d6');
  // seagull (diff 3: extra gull on left only)
  c.strokeStyle = '#333'; c.lineWidth = 3; c.lineCap = 'round';
  c.beginPath(); c.moveTo(180, 56); c.quadraticCurveTo(188, 48, 196, 56); c.quadraticCurveTo(204, 48, 212, 56); c.stroke();
  if (!r) { c.beginPath(); c.moveTo(236, 66); c.quadraticCurveTo(242, 60, 248, 66); c.quadraticCurveTo(254, 60, 260, 66); c.stroke(); }
  // lighthouse (diff 2: beam on left, off on right)
  rect(c, 452, 90, 52, 120, '#fff'); rect(c, 452, 130, 52, 14, '#e23b3b'); rect(c, 452, 170, 52, 14, '#e23b3b');
  rect(c, 462, 66, 32, 26, '#333'); circle(c, 478, 79, 8, r ? '#555' : '#ffe66d');
  if (!r) { c.fillStyle = 'rgba(255,230,109,0.45)'; c.beginPath(); c.moveTo(478, 79); c.lineTo(560, 50); c.lineTo(560, 108); c.closePath(); c.fill(); }
  // sailboat (diff 1: sail white on left, red on right)
  c.fillStyle = '#6e4520'; c.beginPath(); c.moveTo(268, 210); c.lineTo(336, 210); c.lineTo(322, 228); c.lineTo(282, 228); c.closePath(); c.fill();
  c.strokeStyle = '#333'; c.lineWidth = 3; c.beginPath(); c.moveTo(302, 210); c.lineTo(302, 140); c.stroke();
  c.fillStyle = r ? '#e23b3b' : '#fffdf5';
  c.beginPath(); c.moveTo(302, 142); c.lineTo(302, 208); c.lineTo(344, 208); c.closePath(); c.fill();
  // waves
  c.strokeStyle = 'rgba(255,255,255,0.7)'; c.lineWidth = 3;
  for (const y of [240, 272, 306]) { c.beginPath(); for (let x = 20; x < 540; x += 40) { c.moveTo(x, y); c.quadraticCurveTo(x + 20, y - 8, x + 40, y); } c.stroke(); }
  // fish (diff 5: jumping fish on left only)
  if (!r) { ellipse(c, 176, 282, 16, 8, '#ffd166'); c.beginPath(); c.moveTo(190, 282); c.lineTo(202, 274); c.lineTo(202, 290); c.closePath(); c.fillStyle = '#ffd166'; c.fill(); circle(c, 166, 280, 2, '#222'); }
  // buoy (diff 4: buoy orange on left, green on right)
  circle(c, 418, 282, 12, r ? '#2a9d8f' : '#ff6b35'); rect(c, 414, 262, 8, 12, '#333');
}

function drawPicnic(c, r) {
  rect(c, 0, 0, PANEL_W, PANEL_H, '#bfe3f2');           // sky
  rect(c, 0, 180, PANEL_W, 160, '#7ec850');             // grass
  circle(c, 70, 60, 26, '#ffdf3e');                     // sun
  ellipse(c, 300, 50, 46, 13, '#fff');                  // cloud
  // oak tree (diff 5: apples on left, none on right)
  rect(c, 452, 110, 26, 90, '#6e4520');
  circle(c, 466, 92, 52, '#3f9e4d'); circle(c, 428, 108, 34, '#3f9e4d'); circle(c, 504, 108, 34, '#3f9e4d');
  if (!r) { circle(c, 448, 82, 7, '#e23b3b'); circle(c, 482, 76, 7, '#e23b3b'); circle(c, 500, 100, 7, '#e23b3b'); }
  // butterfly (diff 0: butterfly on left only)
  if (!r) {
    ellipse(c, 108, 62, 10, 13, '#b388ff'); ellipse(c, 128, 62, 10, 13, '#b388ff');
    ellipse(c, 110, 74, 8, 9, '#7c4dff'); ellipse(c, 126, 74, 8, 9, '#7c4dff');
    c.strokeStyle = '#333'; c.lineWidth = 2; c.beginPath(); c.moveTo(118, 58); c.lineTo(118, 76); c.stroke();
  }
  // bee (diff 4: bee on left only)
  if (!r) {
    ellipse(c, 348, 88, 11, 8, '#ffd166'); c.strokeStyle = '#333'; c.lineWidth = 2;
    c.beginPath(); c.moveTo(344, 82); c.lineTo(344, 94); c.moveTo(352, 82); c.lineTo(352, 94); c.stroke();
    ellipse(c, 344, 78, 7, 4, 'rgba(255,255,255,0.8)');
  }
  // blanket
  c.fillStyle = '#fff'; c.fillRect(120, 210, 320, 110);
  c.fillStyle = '#e23b3b';
  for (let i = 0; i < 4; i++) for (let j = 0; j < 2; j++) c.fillRect(120 + i * 80 + (j % 2) * 40, 210 + j * 55, 40, 55);
  c.strokeStyle = '#8a5a2b'; c.lineWidth = 3; c.strokeRect(120, 210, 320, 110);
  // basket (diff 3: basket on left only)
  if (!r) {
    rect(c, 52, 188, 60, 34, '#b08954'); c.strokeStyle = '#6e4520'; c.lineWidth = 3;
    c.beginPath(); c.moveTo(58, 190); c.quadraticCurveTo(82, 164, 106, 190); c.stroke();
    c.beginPath(); c.moveTo(52, 200); c.lineTo(112, 200); c.moveTo(52, 210); c.lineTo(112, 210); c.stroke();
  }
  // apple (diff 1: apple on left, pear-green on right? no — apple present left, missing right)
  if (!r) { circle(c, 282, 252, 13, '#e23b3b'); rect(c, 280, 234, 4, 10, '#6e4520'); ellipse(c, 290, 238, 8, 4, '#3f9e4d'); }
  // teacup (diff 6: teacup on left only)
  if (!r) {
    rect(c, 182, 212, 32, 20, '#4f7dd9'); c.strokeStyle = '#333'; c.lineWidth = 2;
    c.beginPath(); c.arc(216, 222, 7, -Math.PI / 2, Math.PI / 2); c.stroke();
  }
  // tulip (diff 2: red on left, yellow on right)
  c.strokeStyle = '#3f9e4d'; c.lineWidth = 4; c.beginPath(); c.moveTo(452, 210); c.lineTo(452, 182); c.stroke();
  circle(c, 452, 176, 11, r ? '#ffd166' : '#e23b3b');
  circle(c, 444, 182, 8, r ? '#ffd166' : '#e23b3b'); circle(c, 460, 182, 8, r ? '#ffd166' : '#e23b3b');
  // daisies
  for (const [x, y] of [[40, 300], [520, 300], [340, 310]]) { circle(c, x, y, 7, '#fff'); circle(c, x, y, 3, '#ffd166'); }
}
