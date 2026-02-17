# Technical Addendum — Retro Graphic Design Upgrade

**Purpose:** Implementation-ready code patterns, integration details, and dev handoff checklist for the 8 graphic enhancements.

**Append this to:** `ux-design-retro-graphic-upgrade.md`

**Author:** Sally (UX Designer)
**Date:** 2026-02-16
**Status:** Implementation Reference

---

## Table of Contents

1. [Missing Implementation Patterns](#missing-implementation-patterns)
2. [Module Integration Details](#module-integration-details)
3. [Performance Validation Guide](#performance-validation-guide)
4. [Dev Handoff Checklist](#dev-handoff-checklist)
5. [Testing Scenarios](#testing-scenarios)

---

## Missing Implementation Patterns

### Pattern 1: Canvas Background Color Management (Enhancement 1)

**Decision:** Use CSS `background-color` on the canvas element (NOT canvas drawing API). This leverages browser-native GPU transitions and matches the existing combo mode pattern.

```javascript
// render.js — add to clearCanvas() or create new function
function updateCanvasBackground(gameState) {
  const canvas = document.getElementById('game-canvas');
  const { background } = progression.getState(gameState.score);

  // CSS background-color with GPU-accelerated transition
  canvas.style.backgroundColor = background;

  // The CSS transition rule handles the 2s fade:
  // #game-canvas { transition: background-color 2000ms ease-in-out; }
}

// Call this in game.js update loop (once per tick, not per frame)
function update(gameState) {
  // ... existing update logic ...

  // Update background color (CSS will handle transition)
  updateCanvasBackground(gameState);
}
```

**Why CSS, not canvas fillRect?**
- Browser handles interpolation automatically (no manual color lerp math)
- GPU-composited (zero CPU cost)
- Matches existing combo mode transition behavior
- Canvas drawing operations don't support CSS transitions

**Integration point:** Call `updateCanvasBackground(gameState)` in `game.js` update loop, BEFORE calling `render()`.

---

### Pattern 2: Border State Orchestration (Enhancement 7) — V4.2 SIMPLIFIED

**🔄 V4.2 UPDATE (2026-02-17):** Border system simplified from 7 states to 3 universal semantic states.

**Design Principle:** Border color communicates **immediate danger state**, not game mode or events.

**V4.2 Universal Border Rules (ALL game modes):**
- ⚫ **Black** = Walls dangerous (default)
- 🟣 **Purple** = Walls safe (wall-phase effect active)
- 🟡 **Yellow** = Protected (invincibility effect active)

**Removed:** Death flash, phone borders, combo borders, reverse controls border

```javascript
// game.js — V4.2 simplified border state management
export function updateBorderState(gameState) {
  const canvas = document.getElementById('game-canvas');

  // Clear all border classes first
  canvas.classList.remove(
    'border-phone-ring',
    'border-phone-pickup',
    'border-combo',
    'border-invincibility',
    'border-wallPhase'
  );

  // V4.2 Simplified priority cascade (highest to lowest)

  // 1. Wall Phase (purple - safe to cross walls)
  if (gameState.activeEffect?.type === 'wallPhase') {
    canvas.classList.add('border-wallPhase');
    console.log('[V4.2] Border → wall phase (purple - safe crossing)');
    return;
  }

  // 2. Invincibility (yellow blinking)
  if (gameState.activeEffect?.type === 'invincibility') {
    canvas.classList.add('border-invincibility');
    console.log('[V4.2] Border → invincibility (yellow blinking)');
    return;
  }

  // 3. Default (black) - clear inline style, let CSS default take over
  canvas.style.borderColor = '';
  console.log('[V4.2] Border → default (black)');
}

// V4.2 Call points in game.js (event-driven only):
// - After effects.applyEffect() (when wall-phase or invincibility applied)
// - After effects.clearEffect() (when effect removed)
// - After eating food (effect state changes)
//
// REMOVED call points (no longer affect border):
// - Phone call events (phone.show, phone.dismiss, pickUpCall)
// - Combo events (combo.activate, combo.exit)
// - Death events (death flash removed)
```

**CSS setup (V4.2):**

```css
/* Default border - BLACK (walls dangerous) */
#game-canvas {
  border: 8px solid #000000;  /* Black default (V4.2) */
  transition:
    background-color 2000ms ease-in-out,
    border-color 300ms ease-in-out;
}

/* Wall-phase border - PURPLE (walls safe) */
#game-canvas.border-wallPhase {
  border-color: #800080;  /* Purple */
  box-shadow:
    0 0 0 8px #1A1A2E,
    0 0 20px 4px rgba(128, 0, 128, 1),
    0 0 40px 8px rgba(128, 0, 128, 0.9),
    0 0 60px 12px rgba(128, 0, 128, 0.6);
}

/* Invincibility border - YELLOW BLINKING (protected) */
#game-canvas.border-invincibility {
  border-color: #FFFF00;  /* Yellow */
  animation: borderBlink 400ms steps(2) infinite;
  box-shadow:
    0 0 0 8px #1A1A2E,
    0 0 20px 4px rgba(255, 255, 0, 1),
    0 0 40px 8px rgba(255, 255, 0, 0.9),
    0 0 60px 12px rgba(255, 255, 0, 0.6);
}

#game-canvas.border-reverse {
  border-color: #FFA500;
}

#game-canvas.border-death {
  border-color: #FF0000;
  transition: border-color 100ms ease-in;  /* Fast snap */
}
```

---

### Pattern 3: Grid Rendering with Progressive Opacity (Enhancement 1 + 8)

```javascript
// render.js — updated renderGrid()
function renderGrid(ctx, gameState) {
  const { gridLine, lineOpacity } = progression.getState(gameState.score);

  ctx.strokeStyle = gridLine;
  ctx.globalAlpha = lineOpacity;
  ctx.lineWidth = 0.5;

  // Vertical lines
  for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
    ctx.beginPath();
    ctx.moveTo(x * CONFIG.UNIT_SIZE, 0);
    ctx.lineTo(x * CONFIG.UNIT_SIZE, canvas.height);
    ctx.stroke();
  }

  // Horizontal lines
  for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
    ctx.beginPath();
    ctx.moveTo(0, y * CONFIG.UNIT_SIZE);
    ctx.lineTo(canvas.width, y * CONFIG.UNIT_SIZE);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;  // CRITICAL: Reset alpha
}

// render.js — new function for grid dots (Enhancement 8)
function renderGridDots(ctx, gameState) {
  const { gridLine, dotOpacity } = progression.getState(gameState.score);

  ctx.fillStyle = gridLine;  // Match grid line color
  ctx.globalAlpha = dotOpacity;

  for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
    for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
      const px = x * CONFIG.UNIT_SIZE;
      const py = y * CONFIG.UNIT_SIZE;

      ctx.beginPath();
      ctx.arc(px, py, CONFIG.GRID_DOT_RADIUS, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  ctx.globalAlpha = 1.0;  // CRITICAL: Reset alpha
}

// render.js — main render() function call order
export function render(ctx, gameState) {
  clearCanvas(ctx);           // Clear surface
  renderGrid(ctx, gameState); // Grid lines first
  renderGridDots(ctx, gameState); // Dots on top of lines
  renderFood(ctx, gameState); // Food above grid
  renderSnake(ctx, gameState); // Snake above food
}
```

**Performance note for dots:** If FPS drops, see Performance Validation section below.

---

### Pattern 4: Food Glow Application and Reset (Enhancement 3)

```javascript
// render.js — renderFood() with glow
export function renderFood(ctx, gameState) {
  const { position, type, isBlinking, blinkCycleIndex } = gameState.food;
  const x = position.x * CONFIG.UNIT_SIZE;
  const y = position.y * CONFIG.UNIT_SIZE;

  // Get progression-aware glow intensity
  const { glowIntensity } = progression.getState(gameState.score);

  // Determine color (blinking food cycles, normal food uses type color)
  let color, outlineColor;
  if (isBlinking) {
    const cycleType = CONFIG.BLINK_CYCLE[blinkCycleIndex];
    color = CONFIG.COLORS[`food${capitalize(cycleType)}`];
    outlineColor = CONFIG.COLORS[`food${capitalize(cycleType)}Outline`];
  } else {
    color = CONFIG.COLORS[`food${capitalize(type)}`];
    outlineColor = CONFIG.COLORS[`food${capitalize(type)}Outline`];
  }

  // ENABLE glow BEFORE drawing
  ctx.shadowColor = color;  // Glow uses food's own color
  ctx.shadowBlur = glowIntensity;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Draw the food shape (Enhancement 2 code)
  renderFoodShape(ctx, x, y, type, color, outlineColor);

  // CRITICAL: RESET shadow state immediately after
  // If you don't reset, the glow will bleed onto snake/grid rendering
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

// Helper function
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
```

**Common mistake:** Forgetting to reset `ctx.shadowBlur`. The shadow state persists across draw calls until explicitly cleared.

---

### Pattern 5: Snake Body Outline on Dark Backgrounds (Enhancement 4C)

```javascript
// render.js — renderSnake() updated
export function renderSnake(ctx, gameState) {
  const { segments, direction } = gameState.snake;
  const needsOutline = gameState.score >= CONFIG.SNAKE_DARK_OUTLINE_SCORE;

  segments.forEach((segment, index) => {
    const x = segment.x * CONFIG.UNIT_SIZE;
    const y = segment.y * CONFIG.UNIT_SIZE;
    const isHead = index === 0;

    // Determine segment color (combo stripe, invincibility strobe, or black)
    let color = getSegmentColor(gameState, index);

    // Draw the segment
    ctx.fillStyle = color;
    ctx.fillRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);

    // Add outline on dark backgrounds (score >= 50)
    if (needsOutline) {
      ctx.strokeStyle = CONFIG.SNAKE_DARK_OUTLINE_COLOR;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);
    }

    // Head-specific rendering
    if (isHead) {
      renderSnakeHead(ctx, x, y, direction, gameState);
    }
  });
}

// render.js — new function for head details (Enhancement 4A + 4B)
function renderSnakeHead(ctx, x, y, direction, gameState) {
  const cx = x + CONFIG.UNIT_SIZE / 2;
  const cy = y + CONFIG.UNIT_SIZE / 2;

  // Eye positions (rotate with direction)
  const eyeOffset = 5;
  let eye1X, eye1Y, eye2X, eye2Y;

  switch (direction) {
    case 'right':
      eye1X = cx + 3; eye1Y = cy - eyeOffset;
      eye2X = cx + 3; eye2Y = cy + eyeOffset;
      break;
    case 'left':
      eye1X = cx - 3; eye1Y = cy - eyeOffset;
      eye2X = cx - 3; eye2Y = cy + eyeOffset;
      break;
    case 'up':
      eye1X = cx - eyeOffset; eye1Y = cy - 3;
      eye2X = cx + eyeOffset; eye2Y = cy - 3;
      break;
    case 'down':
      eye1X = cx - eyeOffset; eye1Y = cy + 3;
      eye2X = cx + eyeOffset; eye2Y = cy + 3;
      break;
  }

  // Draw white eyes
  const eyeRadius = 2.5;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(eye1X, eye1Y, eyeRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(eye2X, eye2Y, eyeRadius, 0, Math.PI * 2);
  ctx.fill();

  // 4A: Draw pupils (directional gaze)
  const pupilRadius = 1.5;
  const pupilOffset = 1.5;
  let pupilDx = 0, pupilDy = 0;

  switch (direction) {
    case 'right': pupilDx = pupilOffset; break;
    case 'left':  pupilDx = -pupilOffset; break;
    case 'up':    pupilDy = -pupilOffset; break;
    case 'down':  pupilDy = pupilOffset; break;
  }

  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(eye1X + pupilDx, eye1Y + pupilDy, pupilRadius, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(eye2X + pupilDx, eye2Y + pupilDy, pupilRadius, 0, Math.PI * 2);
  ctx.fill();

  // 4B: Head highlight line (leading edge)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;

  switch (direction) {
    case 'right':
      ctx.beginPath();
      ctx.moveTo(x + CONFIG.UNIT_SIZE - 0.5, y + 2);
      ctx.lineTo(x + CONFIG.UNIT_SIZE - 0.5, y + CONFIG.UNIT_SIZE - 2);
      ctx.stroke();
      break;
    case 'left':
      ctx.beginPath();
      ctx.moveTo(x + 0.5, y + 2);
      ctx.lineTo(x + 0.5, y + CONFIG.UNIT_SIZE - 2);
      ctx.stroke();
      break;
    case 'up':
      ctx.beginPath();
      ctx.moveTo(x + 2, y + 0.5);
      ctx.lineTo(x + CONFIG.UNIT_SIZE - 2, y + 0.5);
      ctx.stroke();
      break;
    case 'down':
      ctx.beginPath();
      ctx.moveTo(x + 2, y + CONFIG.UNIT_SIZE - 0.5);
      ctx.lineTo(x + CONFIG.UNIT_SIZE - 2, y + CONFIG.UNIT_SIZE - 0.5);
      ctx.stroke();
      break;
  }
}
```

---

### Pattern 6: progression.js Extended getState() Return

**Current `getState()` returns:**
```javascript
{
  blinkProbability,
  comboProbability,
  phoneTier
}
```

**NEW `getState()` must return:**

```javascript
// progression.js — updated getState()
export function getState(score) {
  return {
    // Existing fields
    blinkProbability: resolveThreshold(score, CONFIG.BLINK_THRESHOLDS),
    comboProbability: resolveThreshold(score, CONFIG.COMBO_THRESHOLDS),
    phoneTier: resolveThreshold(score, CONFIG.PHONE_TIERS),

    // Enhancement 1: Dark playfield progression
    background: resolveThreshold(score, CONFIG.BACKGROUND_PROGRESSION, 'background'),
    gridLine: resolveThreshold(score, CONFIG.BACKGROUND_PROGRESSION, 'gridLine'),

    // Enhancement 3: Food glow progression
    glowIntensity: resolveThreshold(score, CONFIG.FOOD_GLOW, 'blur'),

    // Enhancement 8: Grid opacity progression
    lineOpacity: resolveThreshold(score, CONFIG.GRID_OPACITY_PROGRESSION, 'lineOpacity'),
    dotOpacity: resolveThreshold(score, CONFIG.GRID_OPACITY_PROGRESSION, 'dotOpacity')
  };
}

// Helper function (updated to accept field parameter)
function resolveThreshold(score, thresholds, field = null) {
  for (let i = 0; i < thresholds.length; i++) {
    const tier = thresholds[i];
    if (score >= tier.minScore && score <= tier.maxScore) {
      // If field specified, return that field value
      if (field) {
        return tier[field];
      }
      // Otherwise return the entire tier object
      return tier;
    }
  }
  // Fallback to last tier
  const lastTier = thresholds[thresholds.length - 1];
  return field ? lastTier[field] : lastTier;
}
```

**Integration:** render.js calls `progression.getState(gameState.score)` ONCE per frame at the top of `render()`, destructures all 8 fields, passes them to sub-functions.

**Performance optimization:**

```javascript
// render.js — call progression once, destructure
export function render(ctx, gameState) {
  // Single progression call per frame
  const progressionState = progression.getState(gameState.score);
  const {
    background,
    gridLine,
    glowIntensity,
    lineOpacity,
    dotOpacity
  } = progressionState;

  clearCanvas(ctx);
  renderGrid(ctx, gridLine, lineOpacity);
  renderGridDots(ctx, gridLine, dotOpacity);
  renderFood(ctx, gameState, glowIntensity);
  renderSnake(ctx, gameState);
}
```

---

## Module Integration Details

### config.js — New Sections to Add

```javascript
// config.js — ADD THESE SECTIONS

// Enhancement 1: Progressive dark playfield
export const BACKGROUND_PROGRESSION = [
  { minScore: 0,   maxScore: 14,  background: '#E8E8E8', gridLine: '#A0A0A0' },
  { minScore: 15,  maxScore: 29,  background: '#D0D0D0', gridLine: '#909090' },
  { minScore: 30,  maxScore: 49,  background: '#B0B0B0', gridLine: '#808080' },
  { minScore: 50,  maxScore: 79,  background: '#808080', gridLine: '#606060' },
  { minScore: 80,  maxScore: 99,  background: '#505050', gridLine: '#404040' },
  { minScore: 100, maxScore: Infinity, background: '#2A2A2A', gridLine: '#1A1A1A' }
];

// Enhancement 2: Food shape outline colors
export const COLORS = {
  // ... existing colors ...

  // Food outline colors (darker variants)
  foodGrowingOutline: '#009900',
  foodInvincibilityOutline: '#B8B800',
  foodWallPhaseOutline: '#550055',
  foodSpeedBoostOutline: '#B30000',
  foodSpeedDecreaseOutline: '#009199',
  foodReverseControlsOutline: '#B37400'
};

export const FOOD_SIZE = 14;  // Updated from 11 for shape clarity

// Enhancement 3: CRT phosphor glow
export const FOOD_GLOW = [
  { minScore: 0,   maxScore: 49,  blur: 3 },
  { minScore: 50,  maxScore: 79,  blur: 5 },
  { minScore: 80,  maxScore: Infinity, blur: 8 }
];

// Enhancement 4: Snake head enhancements
export const SNAKE_DARK_OUTLINE_SCORE = 50;
export const SNAKE_DARK_OUTLINE_COLOR = 'rgba(255, 255, 255, 0.15)';

// Enhancement 6: CRT scanlines
export const CRT_SCANLINES_ENABLED = true;
export const CRT_SCANLINE_OPACITY = 0.03;

// Enhancement 7: Reactive border
export const BORDER_COLORS = {
  default: '#800080',
  phoneRing: '#FFD700',
  phonePickup: '#28a745',
  invincibility: '#FFFF00',
  reverseControls: '#FFA500',
  death: '#FF0000'
};
export const BORDER_DEATH_FLASH_DURATION = 500;  // ms

// Enhancement 8: Grid dots and progressive dimming
export const GRID_DOT_RADIUS = 1.5;
export const GRID_OPACITY_PROGRESSION = [
  { minScore: 0,   maxScore: 14,  lineOpacity: 0.9, dotOpacity: 0.5 },
  { minScore: 15,  maxScore: 29,  lineOpacity: 0.8, dotOpacity: 0.45 },
  { minScore: 30,  maxScore: 49,  lineOpacity: 0.7, dotOpacity: 0.4 },
  { minScore: 50,  maxScore: 79,  lineOpacity: 0.5, dotOpacity: 0.3 },
  { minScore: 80,  maxScore: 99,  lineOpacity: 0.4, dotOpacity: 0.25 },
  { minScore: 100, maxScore: Infinity, lineOpacity: 0.3, dotOpacity: 0.2 }
];
```

---

### game.js — Integration Points

```javascript
// game.js — ADD these function calls in appropriate handlers

function update(gameState) {
  if (gameState.phase !== 'playing' || gameState.isPaused) return;

  // ... existing movement and collision logic ...

  // Enhancement 1: Update canvas background color (CSS)
  updateCanvasBackground(gameState);

  // Enhancement 7: Update border state based on active systems
  updateBorderState(gameState);
}

function onDeath(gameState) {
  // ... existing death logic ...

  // Enhancement 7: Trigger death border flash
  gameState.justDied = true;  // Flag for updateBorderState()
  updateBorderState(gameState);
  setTimeout(() => {
    gameState.justDied = false;
  }, CONFIG.BORDER_DEATH_FLASH_DURATION);
}

function onPhoneCallShow(gameState) {
  // ... existing phone logic ...

  // Enhancement 7: Border reacts to phone ring
  updateBorderState(gameState);
}

function onPhoneCallDismiss(gameState) {
  // ... existing phone logic ...

  // Enhancement 7: Border returns to default/effect state
  updateBorderState(gameState);
}

function onFoodEaten(gameState) {
  // ... existing food logic ...

  // Enhancement 7: If effect changed, update border
  if (effectChanged) {
    updateBorderState(gameState);
  }
}
```

---

### CSS Updates — style.css

```css
/* Enhancement 5: Typography treatments */

/* Title treatment */
.game-title {
  font-family: 'Jersey20', 'Courier New', monospace;
  font-size: 36px;
  font-weight: bold;
  color: #FFFFFF;
  letter-spacing: 3px;
  text-transform: uppercase;
  text-shadow:
    0 0 10px rgba(157, 178, 221, 0.8),
    0 0 20px rgba(157, 178, 221, 0.4),
    0 2px 0 #5A6A8A,
    0 3px 0 #3A4A6A;
}

/* Game Over treatment */
#gameover-screen h2 {
  font-size: 36px;
  color: rgb(157, 178, 221);
  letter-spacing: 4px;
  text-shadow:
    0 0 8px rgba(157, 178, 221, 0.6),
    0 2px 0 rgba(0, 0, 0, 0.8),
    0 4px 8px rgba(0, 0, 0, 0.4);
}

/* New High Score treatment */
#gameover-screen .new-high-score {
  font-size: 20px;
  font-weight: bold;
  color: #FFD700;
  text-shadow:
    0 0 10px rgba(255, 215, 0, 0.8),
    0 0 20px rgba(255, 215, 0, 0.4),
    0 0 30px rgba(255, 165, 0, 0.2);
  animation: highScorePulse 1.5s ease-in-out infinite;
}

@keyframes highScorePulse {
  0%, 100% {
    text-shadow:
      0 0 10px rgba(255, 215, 0, 0.8),
      0 0 20px rgba(255, 215, 0, 0.4);
  }
  50% {
    text-shadow:
      0 0 15px rgba(255, 215, 0, 1.0),
      0 0 30px rgba(255, 215, 0, 0.6),
      0 0 40px rgba(255, 165, 0, 0.3);
  }
}

/* Reduced motion: disable pulse */
@media (prefers-reduced-motion: reduce) {
  #gameover-screen .new-high-score {
    animation: none;
    text-shadow:
      0 0 10px rgba(255, 215, 0, 0.8),
      0 0 20px rgba(255, 215, 0, 0.4);
  }
}

/* Score display enhancement */
#current-score {
  color: #FFFFFF;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.3);
}

#top-score {
  color: rgb(157, 178, 221);
  text-shadow: 0 0 6px rgba(157, 178, 221, 0.3);
}

/* Enhancement 6: CRT scanline overlay */
#game-container {
  position: relative;
}

#game-container::after {
  content: '';
  position: absolute;
  top: 8px;     /* Inside the 8px border */
  left: 8px;
  right: 8px;
  bottom: 8px;
  border-radius: 4px;
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 3px,
    rgba(0, 0, 0, 0.03) 3px,
    rgba(0, 0, 0, 0.03) 4px
  );
  pointer-events: none;
  z-index: 50;
}

/* Scanline toggle */
#game-container.no-scanlines::after {
  display: none;
}

/* Enhancement 7: Reactive border (integrated with Enhancement 1) */
#game-canvas {
  border: 8px solid #800080;  /* Default purple */
  transition:
    background-color 2000ms ease-in-out,  /* Enhancement 1 */
    border-color 300ms ease-in-out;        /* Enhancement 7 */
}

/* Border state classes */
#game-canvas.border-phone-ring {
  border-color: #FFD700;
}

#game-canvas.border-phone-pickup {
  border-color: #28a745;
}

#game-canvas.border-combo {
  /* border-color set dynamically via JS */
}

#game-canvas.border-invincibility {
  border-color: #FFFF00;
}

#game-canvas.border-reverse {
  border-color: #FFA500;
}

#game-canvas.border-death {
  border-color: #FF0000;
  transition: border-color 100ms ease-in;
}
```

---

## Performance Validation Guide

### Test Scenario 1: Grid Dot Rendering (Enhancement 8)

**Concern:** 525 circles per frame (25×20 grid + 1) at 60 FPS = 31,500 arc operations per second.

**Test procedure:**
1. Implement grid dots as specified in Enhancement 8
2. Open DevTools → Performance tab
3. Record 10 seconds of gameplay at score 100+ (worst case: dark background, dots at lowest opacity)
4. Check "FPS" graph — look for sustained 60 FPS

**Pass criteria:** Average FPS >= 58 (allowing 2 FPS margin for browser overhead)

**If test fails (FPS < 58):**

Implement offscreen canvas optimization:

```javascript
// render.js — optimize grid dots with offscreen canvas

// Cache the grid dot pattern on first render
let gridDotsCanvas = null;
let lastGridDotOpacity = -1;

function renderGridDots(ctx, gameState) {
  const { gridLine, dotOpacity } = progression.getState(gameState.score);

  // Regenerate cached canvas only if opacity changed
  if (!gridDotsCanvas || dotOpacity !== lastGridDotOpacity) {
    gridDotsCanvas = document.createElement('canvas');
    gridDotsCanvas.width = canvas.width;
    gridDotsCanvas.height = canvas.height;
    const offCtx = gridDotsCanvas.getContext('2d');

    offCtx.fillStyle = gridLine;
    offCtx.globalAlpha = dotOpacity;

    // Draw all dots to offscreen canvas once
    for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
      for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
        const px = x * CONFIG.UNIT_SIZE;
        const py = y * CONFIG.UNIT_SIZE;
        offCtx.beginPath();
        offCtx.arc(px, py, CONFIG.GRID_DOT_RADIUS, 0, Math.PI * 2);
        offCtx.fill();
      }
    }

    lastGridDotOpacity = dotOpacity;
  }

  // Stamp the cached dot pattern (single drawImage call)
  ctx.drawImage(gridDotsCanvas, 0, 0);
}
```

**Performance improvement:** Reduces 525 arc calls to 1 drawImage call per frame = ~40x faster.

---

### Test Scenario 2: Food Glow + Shape Rendering (Enhancement 2 + 3)

**Concern:** Canvas shadowBlur can be GPU-intensive if applied to complex paths.

**Test procedure:**
1. Implement food shapes + glow as specified
2. Open DevTools → Performance tab
3. Record gameplay with blinking food active (6 shape/color changes per cycle)
4. Check for frame drops during blink cycles

**Pass criteria:** No visible stuttering during food color/shape transitions

**If test fails:**

The shapes are simple enough that this shouldn't happen, but if it does:
- Reduce `shadowBlur` max value from 8 to 6
- OR pre-render the 6 food shapes to offscreen canvases (overkill, likely unnecessary)

---

### Test Scenario 3: Multiple Systems Active (Stress Test)

**Worst-case scenario:**
- Score 100+ (dark background, max glow, ghost grid)
- Combo mode active (canvas color transition, striped snake)
- Phone overlay active (blur filter)
- Reverse Controls effect (border color = orange)
- Snake length 40+ segments

**Test procedure:**
1. Use dev console to set up this state artificially
2. Record 10 seconds of gameplay
3. Check FPS and GPU usage

**Pass criteria:**
- FPS >= 58
- GPU usage < 60% (allows headroom for lower-end devices)

**If test fails:**

Likely culprit: canvas blur filter during phone overlay. The blur is applied to the entire canvas every frame. Optimization:

```css
/* Instead of blur on canvas, blur via backdrop-filter on overlay */
.phone-overlay {
  backdrop-filter: blur(4px);  /* GPU-composited */
  -webkit-backdrop-filter: blur(4px);
}

/* Remove inline JS blur on canvas */
/* canvas.style.filter = 'blur(4px)'; */
```

---

## Dev Handoff Checklist

### Phase 1: Config + Progression Foundation

- [ ] Add 6 new config sections to `config.js` (see Module Integration section)
- [ ] Update `progression.js` — extend `getState()` to return 8 fields
- [ ] Add `resolveThreshold()` field parameter support
- [ ] Test: `progression.getState(50)` returns all 8 fields correctly

**Validation:** Console log the progression state at scores 0, 15, 50, 100, 150 — verify all 6 tiers resolve correctly.

---

### Phase 2: Batch 1 — Independent Enhancements

**Can be implemented in parallel by different devs or sequentially.**

#### Enhancement 3: Food Glow (smallest change, do first)

- [ ] Update `renderFood()` — apply `shadowBlur` before shape, reset after
- [ ] Pass `glowIntensity` from progression state
- [ ] Test: Food items have visible glow at score 80+, subtle glow at score 0

#### Enhancement 2: Food Shapes

- [ ] Create `renderFoodShape()` function with switch/case for 6 types
- [ ] Update `FOOD_SIZE` to 14
- [ ] Add 6 outline colors to config
- [ ] Update blinking food to cycle shapes + colors
- [ ] Test: All 6 food types render with distinct shapes

#### Enhancement 5: Typography

- [ ] Add all CSS text-shadow rules to `style.css`
- [ ] Add `highScorePulse` keyframe animation
- [ ] Add `@media (prefers-reduced-motion)` override
- [ ] Test: Title has blue glow, GAME OVER has depth, NEW HIGH SCORE pulses

#### Enhancement 6: Scanlines

- [ ] Add `#game-container::after` pseudo-element CSS
- [ ] Add `.no-scanlines` toggle class
- [ ] Test: Scanlines visible (but subtle) on playfield

---

### Phase 3: Batch 2 — Dark Playfield + Integration

**Depends on Batch 1 for contrast validation.**

#### Enhancement 1: Progressive Dark Playfield

- [ ] Add `updateCanvasBackground()` function (uses CSS background-color)
- [ ] Call in `game.js` update loop
- [ ] Update `renderGrid()` to use `gridLine` and `lineOpacity` from progression
- [ ] Test: Background darkens smoothly from light grey → near-black as score increases
- [ ] Validate: Food shapes remain visible at all tiers (glow should compensate)
- [ ] Validate: Grid lines remain perceptible at score 100+ (0.3 opacity minimum)

---

### Phase 4: Batch 3 — Snake + Grid + Border

**Depends on Enhancement 1 for dark background context.**

#### Enhancement 4: Snake Head Character Enhancements

- [ ] Add `renderSnakeHead()` function
- [ ] Implement 4A: directional pupils
- [ ] Implement 4B: head highlight line
- [ ] Implement 4C: body outline at score >= 50
- [ ] Test: Pupils track direction, highlight visible on dark backgrounds, outline appears at score 50

#### Enhancement 8: Grid Dots + Dimming

- [ ] Create `renderGridDots()` function
- [ ] Add grid dot rendering to main `render()` call chain
- [ ] Grid opacity progression already handled in Phase 3
- [ ] Test: Dots visible at all score tiers, fading in sync with grid lines
- [ ] **Performance test:** Run FPS validation (see Performance Validation section)
- [ ] If FPS < 58, implement offscreen canvas optimization

#### Enhancement 7: Reactive Border

- [ ] Create `updateBorderState()` function with priority cascade
- [ ] Add CSS border state classes to `style.css`
- [ ] Integrate calls in game.js: onDeath, onPhoneShow, onPhoneDismiss, onFoodEaten, update loop
- [ ] Add `gameState.justDied` flag for death flash
- [ ] Test: Border changes color for phone ring (gold), pickup (green), combo (matches canvas), death (red flash)

---

### Phase 5: Integration Testing

- [ ] Run all 3 performance validation scenarios (see Performance Validation section)
- [ ] Cross-browser test: Chrome, Firefox, Safari, Edge
- [ ] Mobile test: iOS Safari, Android Chrome (touch performance with glow)
- [ ] Accessibility audit:
  - [ ] Food colors maintain 3:1 contrast on darkest background
  - [ ] Grid lines visible at minimum opacity (0.3)
  - [ ] Text remains readable (all text-shadows enhance, not obscure)
  - [ ] `prefers-reduced-motion` disables animation (high score pulse)
- [ ] Visual regression: Compare screenshots at score 0, 50, 100 before/after

---

### Phase 6: Polish + Config Tuning

- [ ] Playtest with external testers
- [ ] Collect feedback on:
  - [ ] Grid dimming curve (too fast? too slow?)
  - [ ] Food glow intensity (too subtle? too bright?)
  - [ ] Scanline visibility (toggle needed?)
  - [ ] Border color transitions (distracting? helpful?)
- [ ] Tune config values based on feedback (all tunable in `config.js`)
- [ ] Document final config values in architecture.md

---

## Testing Scenarios

### Scenario 1: Progressive Visual Journey (Score 0 → 120)

**Goal:** Verify the full Neon Noir transformation arc.

**Steps:**
1. Start new game, observe score 0-14 state (bright, friendly, full grid)
2. Use dev console to set score to 30, observe tier 2 transition
3. Set score to 60, observe tier 3 (solid mid-grey, grid receding)
4. Set score to 90, observe tier 4 (dark grey, food glow prominent)
5. Set score to 110, observe tier 5 (near-black, ghost grid, full glow)

**Expected results:**
- Background transitions are smooth (2s fade, no jarring snaps)
- Food glow becomes increasingly prominent at higher tiers
- Grid remains visible (even at 0.3 opacity)
- Snake body outline appears at score 50
- Food shapes remain distinguishable at all tiers

---

### Scenario 2: Border State Priority Cascade

**Goal:** Verify border color changes follow the priority order correctly.

**Test matrix:**

| Game State | Expected Border Color |
|---|---|
| Normal play, no effects | Purple (default) |
| Phone ringing | Gold |
| Phone picked up | Green |
| Combo active, no phone | Matches combo canvas color (purple/blue/red/green) |
| Reverse Controls, no combo, no phone | Orange |
| Invincibility, no other states | Yellow |
| Death (any prior state) | Red flash (500ms), then return to state |
| Phone ring + combo active | Gold (phone wins) |
| Phone ring + reverse controls | Gold (phone wins) |
| Death during phone pickup | Red flash, then green (pickup state preserved) |

**Steps:**
Use dev console to force each state combination, verify border color matches expected.

---

### Scenario 3: Blinking Food Shape + Color Cycling

**Goal:** Verify food shape changes in sync with color during mystery food blink cycle.

**Steps:**
1. Reach score 15+ to unlock blinking food
2. Wait for mystery food to spawn (blinking border)
3. Observe the 6-step cycle (each ~200ms):
   - Growing: green square
   - Invincibility: yellow star
   - WallPhase: purple ring
   - SpeedBoost: red cross
   - SpeedDecrease: cyan hollow square
   - ReverseControls: orange X

**Expected:** Shape AND color change together each cycle step. Glow color matches current cycle color.

---

### Scenario 4: Typography Emotional Peaks

**Goal:** Verify text treatments create appropriate emotional impact.

**Steps:**
1. Launch game, observe title screen — title should have blue glow + 3D depth
2. Die, observe GAME OVER text — should have subtle blue glow + shadow depth
3. Die with new high score, observe NEW HIGH SCORE — should pulse gold glow
4. Check score display during gameplay — should have very subtle white glow

**Expected:** Text is readable, glows enhance (not obscure), high score pulse is gentle (not seizure-inducing).

---

### Scenario 5: CRT Scanlines Visibility Threshold

**Goal:** Verify scanlines are visible but not distracting.

**Steps:**
1. Play at score 0-49 (light backgrounds) — scanlines should be nearly invisible
2. Play at score 80+ (dark backgrounds) — scanlines should be subtly visible
3. Toggle `.no-scanlines` class via dev console — scanlines should disappear

**Expected:** Scanlines add texture, don't impede food/snake visibility. Should be a "feel" more than a "see."

---

### Scenario 6: Stress Test (All Systems Active)

**Setup via dev console:**
```javascript
gameState.score = 120;
gameState.combo.active = true;
gameState.combo.canvasColor = '#4A148C';
gameState.phoneCall.active = true;
gameState.phoneCall.pickedUp = true;
gameState.activeEffect = { type: 'reverseControls' };
gameState.snake.segments = Array(50).fill({x: 10, y: 10}); // Long snake
```

**Expected:**
- FPS remains at 58-60
- No visual glitches (overlapping effects, z-index issues)
- Border shows green (phone pickup wins priority)
- Canvas shows dark purple combo color
- Food items glow brightly (blur 8)
- Grid is ghost lines (0.3 opacity)
- No console errors

---

## Implementation Notes

### Gotcha 1: Canvas Shadow State Persistence

**Problem:** If you forget to reset `ctx.shadowBlur = 0` after drawing food, the shadow will bleed onto the snake and grid.

**Fix:** Always pair shadow application with immediate reset:

```javascript
// Set shadow
ctx.shadowBlur = 8;
// ... draw ...
// Reset shadow
ctx.shadowBlur = 0;
```

---

### Gotcha 2: CSS Transition on Canvas Background

**Problem:** Setting `canvas.style.backgroundColor` in a tight loop can cause constant transition restarts.

**Fix:** Only update background color when score tier changes, not every frame.

```javascript
// In game.js or render.js
let lastBackgroundTier = -1;

function updateCanvasBackground(gameState) {
  const { background } = progression.getState(gameState.score);

  // Only update CSS if background actually changed (tier transition)
  if (background !== lastBackgroundTier) {
    canvas.style.backgroundColor = background;
    lastBackgroundTier = background;
  }
}
```

---

### Gotcha 3: Border Priority During Death Flash

**Problem:** Death flash is a temporary override (500ms), then border should return to the underlying state (not default purple).

**Fix:** The `updateBorderState()` pattern handles this with the timeout re-evaluation:

```javascript
if (gameState.justDied) {
  canvas.classList.add('border-death');
  setTimeout(() => {
    canvas.classList.remove('border-death');
    updateBorderState(gameState); // Re-evaluate with justDied = false
  }, CONFIG.BORDER_DEATH_FLASH_DURATION);
  return; // Don't evaluate other states during flash
}
```

---

### Gotcha 4: Grid Dot Rendering Order

**Problem:** If you render grid dots BEFORE grid lines, the lines will overwrite the dots.

**Fix:** Rendering order matters:

```javascript
export function render(ctx, gameState) {
  clearCanvas(ctx);
  renderGrid(ctx, gameState);      // Lines first
  renderGridDots(ctx, gameState);  // Dots on top
  renderFood(ctx, gameState);
  renderSnake(ctx, gameState);
}
```

---

## Quick Reference: What Goes Where

| Enhancement | Config | Progression | Render | Game | CSS |
|---|---|---|---|---|---|
| 1. Dark Playfield | ✓ Threshold tables | ✓ Resolve colors | ✓ Apply BG + grid | ✓ Call update | ✓ Transition |
| 2. Food Shapes | ✓ Outline colors | — | ✓ renderFoodShape() | — | — |
| 3. Food Glow | ✓ Blur tiers | ✓ Resolve blur | ✓ Apply shadow | — | — |
| 4. Snake Head | ✓ Outline threshold | — | ✓ Pupils + highlight | — | — |
| 5. Typography | — | — | — | — | ✓ text-shadow |
| 6. Scanlines | ✓ Toggle flag | — | — | — | ✓ ::after |
| 7. Reactive Border | ✓ Colors + duration | — | — | ✓ updateBorderState() | ✓ Classes |
| 8. Grid Dots | ✓ Opacity tiers | ✓ Resolve opacity | ✓ renderGridDots() | — | — |

---

## Final Validation Checklist

Before marking the retro graphic upgrade complete:

- [ ] All 8 enhancements implemented and tested individually
- [ ] Integration testing passed (all enhancements work together)
- [ ] Performance validation passed (FPS >= 58 in worst-case scenario)
- [ ] Cross-browser testing passed (Chrome, Firefox, Safari, Edge)
- [ ] Accessibility audit passed (contrast ratios, reduced motion)
- [ ] Mobile testing passed (iOS Safari, Android Chrome)
- [ ] Config values documented in `architecture.md`
- [ ] Project-context.md updated with new module boundaries
- [ ] Visual regression screenshots captured at scores 0, 50, 100
- [ ] Playtest feedback incorporated (config tuning complete)

---

## V4.2 Enhancement: Black Snake Visibility (2026-02-17)

**Problem:** Black snake (`#000000`) with black glow and black border is nearly invisible against the dark background (`#1a1a1a`), especially at game start and during wall phase effect.

**Solution:** Adaptive glow and border - white when snake is black, colored when snake is any other color.

### Implementation Pattern

```javascript
// render.js — renderSnake() function (both striped and normal paths)

// For striped snake (combo mode):
snake.segments.forEach((segment, index) => {
  const x = segment.x * CONFIG.UNIT_SIZE;
  const y = segment.y * CONFIG.UNIT_SIZE;

  // Determine segment color
  const color = index === 0 ? colorB : (index % 2 === 1 ? colorA : colorB);

  // ADAPTIVE GLOW: White glow for black segments, colored glow otherwise
  const glowColor = color === '#000000' ? '#FFFFFF' : color;

  withShadow(ctx, { color: glowColor, blur: 6 }, (ctx) => {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);

    // ADAPTIVE BORDER: White border for black segments, black otherwise
    ctx.strokeStyle = color === '#000000' ? '#FFFFFF' : '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);

    // Existing Story 21.1 outline (if score >= 50)
    if (needsOutline) {
      ctx.strokeStyle = CONFIG.SNAKE_DARK_OUTLINE_COLOR;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);
    }
  });
});

// For normal snake:
snake.segments.forEach((segment, index) => {
  const x = segment.x * CONFIG.UNIT_SIZE;
  const y = segment.y * CONFIG.UNIT_SIZE;

  // Determine snake color (handles invincibility strobe)
  let snakeColor = snake.color;
  if (isEffectActive(gameState, 'invincibility')) {
    const strobePhase = Math.floor(performance.now() / CONFIG.STROBE_INTERVAL) % 2;
    snakeColor = strobePhase === 0 ? CONFIG.COLORS.snakeInvincibility : CONFIG.COLORS.snakeDefault;
  }

  // ADAPTIVE GLOW: White glow for black snake, colored glow otherwise
  const glowColor = snakeColor === '#000000' ? '#FFFFFF' : snakeColor;

  withShadow(ctx, { color: glowColor, blur: 6 }, (ctx) => {
    ctx.fillStyle = snakeColor;
    ctx.fillRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);

    // ADAPTIVE BORDER: White border for black snake, black otherwise
    ctx.strokeStyle = snakeColor === '#000000' ? '#FFFFFF' : '#000000';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);

    // Existing Story 21.1 outline (if score >= 50)
    if (needsOutline) {
      ctx.strokeStyle = CONFIG.SNAKE_DARK_OUTLINE_COLOR;
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);
    }
  });
});
```

### Visual Behavior

| Snake State | Fill Color | Glow Color | Border Color | Context |
|---|---|---|---|---|
| Game start | Black `#000000` | **White `#FFFFFF`** | **White `#FFFFFF`** | Initial visibility |
| Wall phase active | Black `#000000` | **White `#FFFFFF`** | **White `#FFFFFF`** | During effect |
| Invincibility (yellow) | Yellow `#FFFF00` | Yellow `#FFFF00` | Black `#000000` | Normal glow |
| Invincibility (black strobe) | Black `#000000` | **White `#FFFFFF`** | **White `#FFFFFF`** | Adaptive |
| Combo striped (black segment) | Black `#000000` | **White `#FFFFFF`** | **White `#FFFFFF`** | Per-segment |
| Combo striped (colored segment) | Effect color | Effect color | Black `#000000` | Per-segment |

### Design Rationale

1. **Contrast:** White glow + white border creates maximum visibility against `#1a1a1a` background
2. **Consistency:** Applies to all black segments regardless of game state (start, effects, combo)
3. **Performance:** Blur reduced from 8 to 6 for subtle, crisp effect
4. **Compatibility:** Works with existing Story 21.1 outline system (both can coexist at score 50+)

### Testing Checklist

- [ ] Black snake visible at game start (score 0)
- [ ] Black snake visible during wall phase effect
- [ ] White glow/border during invincibility strobe (black phase)
- [ ] Black segments in combo mode get white glow/border
- [ ] Colored segments keep original glow/border behavior
- [ ] No visual conflicts with Story 21.1 outline at score 50+
- [ ] FPS stable (glow reduction from blur 8→6 maintains 60 FPS)

### Config Impact

**No new config values needed.** All logic uses existing constants:
- `CONFIG.COLORS.snakeDefault` (`#000000`)
- Hard-coded white `#FFFFFF` for adaptive glow/border (intentional - visibility is binary, not tunable)

---

**End of Technical Addendum**

*This document is designed to be used as a direct reference during implementation. All code snippets are copy-paste ready. All test scenarios can be executed as written. All checklists map to specific files and functions.*

*Questions? Sally (UX Designer) is available for clarification on any pattern or integration detail.*
