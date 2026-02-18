/**
 * Snake Background — packed snake mosaic for the page background
 * Static, generated once on load. Full viewport canvas behind the game.
 */

const UNIT = 20;
const PAD  = 1;

const PALETTE = [
  '#000000',  // black snake
];

const DIR_VECTORS = [
  { dx: 1,  dy: 0,  name: 'right' },
  { dx: -1, dy: 0,  name: 'left'  },
  { dx: 0,  dy: 1,  name: 'down'  },
  { dx: 0,  dy: -1, name: 'up'    },
];

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function renderSnakeHead(ctx, headX, headY, direction) {
  const eyeRadius   = 2.5;
  const eyeSpacing  = 8;
  const pupilRadius = 1.5;
  const pupilOffset = 1.5;

  const centerX = headX + UNIT / 2;
  const centerY = headY + UNIT / 2;

  let eye1X, eye1Y, eye2X, eye2Y;
  let pupilDx = 0, pupilDy = 0;

  switch (direction) {
    case 'right':
      eye1X = centerX - eyeSpacing / 2; eye2X = centerX + eyeSpacing / 2;
      eye1Y = eye2Y = headY + UNIT / 3;
      pupilDx = pupilOffset; break;
    case 'left':
      eye1X = centerX - eyeSpacing / 2; eye2X = centerX + eyeSpacing / 2;
      eye1Y = eye2Y = headY + UNIT / 3;
      pupilDx = -pupilOffset; break;
    case 'up':
      eye1Y = centerY - eyeSpacing / 2; eye2Y = centerY + eyeSpacing / 2;
      eye1X = eye2X = headX + UNIT / 3;
      pupilDy = -pupilOffset; break;
    case 'down':
      eye1Y = centerY - eyeSpacing / 2; eye2Y = centerY + eyeSpacing / 2;
      eye1X = eye2X = headX + UNIT / 3;
      pupilDy = pupilOffset; break;
    default:
      eye1X = centerX - eyeSpacing / 2; eye2X = centerX + eyeSpacing / 2;
      eye1Y = eye2Y = headY + UNIT / 3;
      pupilDx = pupilOffset;
  }

  // White eyes
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath(); ctx.arc(eye1X, eye1Y, eyeRadius, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(eye2X, eye2Y, eyeRadius, 0, Math.PI * 2); ctx.fill();

  // Black pupils offset toward movement direction
  ctx.fillStyle = '#000000';
  ctx.beginPath(); ctx.arc(eye1X + pupilDx, eye1Y + pupilDy, pupilRadius, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(eye2X + pupilDx, eye2Y + pupilDy, pupilRadius, 0, Math.PI * 2); ctx.fill();

  // Leading-edge highlight (Mega Man technique)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  switch (direction) {
    case 'right': ctx.moveTo(headX + UNIT - 0.5, headY + 2); ctx.lineTo(headX + UNIT - 0.5, headY + UNIT - 2); break;
    case 'left':  ctx.moveTo(headX + 0.5,        headY + 2); ctx.lineTo(headX + 0.5,        headY + UNIT - 2); break;
    case 'up':    ctx.moveTo(headX + 2, headY + 0.5);        ctx.lineTo(headX + UNIT - 2, headY + 0.5);        break;
    case 'down':  ctx.moveTo(headX + 2, headY + UNIT - 0.5); ctx.lineTo(headX + UNIT - 2, headY + UNIT - 0.5); break;
  }
  ctx.stroke();
  ctx.strokeStyle = 'transparent';
}

export function initSnakeBackground() {
  const canvas = document.getElementById('snake-bg');
  if (!canvas) return;

  const ctx  = canvas.getContext('2d');
  const VW   = window.innerWidth;
  const VH   = window.innerHeight;
  canvas.width  = VW;
  canvas.height = VH;

  const COLS = Math.ceil(VW / UNIT);
  const ROWS = Math.ceil(VH / UNIT);

  // grid[row][col] = snake id (0 = empty)
  const grid = Array.from({ length: ROWS }, () => new Array(COLS).fill(0));
  const snakes = {};  // id → { color, headCol, headRow, dir }

  function inBounds(x, y) { return x >= 0 && x < COLS && y >= 0 && y < ROWS; }
  function empty(x, y)    { return inBounds(x, y) && grid[y][x] === 0; }

  // Shuffled start positions — ensures full coverage
  const positions = [];
  for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++)
      positions.push([x, y]);
  shuffle(positions);

  let nextId = 1;

  for (const [sx, sy] of positions) {
    if (!empty(sx, sy)) continue;

    const id    = nextId++;
    const color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    const maxLen = 3 + Math.floor(Math.random() * 14);  // 3–16 segments
    let dir = DIR_VECTORS[Math.floor(Math.random() * 4)];

    snakes[id] = { color, headCol: sx, headRow: sy, dir: dir.name };
    grid[sy][sx] = id;

    let x = sx, y = sy;

    for (let step = 1; step < maxLen; step++) {
      const pool = Math.random() < 0.75
        ? [dir, ...shuffle([...DIR_VECTORS])]
        : shuffle([...DIR_VECTORS]);

      let moved = false;
      for (const d of pool) {
        const nx = x + d.dx, ny = y + d.dy;
        if (empty(nx, ny)) {
          dir = d; x = nx; y = ny;
          grid[y][x] = id;
          moved = true;
          break;
        }
      }
      if (!moved) break;
    }
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  ctx.fillStyle = '#0d0d0d';
  ctx.fillRect(0, 0, VW, VH);

  // Pass 1: segments
  for (let row = 0; row < ROWS; row++) {
    for (let col = 0; col < COLS; col++) {
      const id = grid[row][col];
      if (!id) continue;

      const { color } = snakes[id];
      const px   = col * UNIT + PAD;
      const py   = row * UNIT + PAD;
      const size = UNIT - PAD * 2;

      ctx.fillStyle = color;
      ctx.fillRect(px, py, size, size);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 0.5, py + 0.5, size - 1, size - 1);
    }
  }

  // Pass 2: heads
  for (const snake of Object.values(snakes)) {
    renderSnakeHead(ctx, snake.headCol * UNIT, snake.headRow * UNIT, snake.dir);
  }
}
