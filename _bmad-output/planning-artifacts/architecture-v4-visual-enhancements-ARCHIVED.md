# Architecture V4: Visual Enhancement System (Retro Upgrade)

**Date:** 2026-02-16
**Author:** Winston (Architect)
**Status:** Draft for Integration
**Purpose:** Architectural decisions for the 8-enhancement retro graphic upgrade

**Input Documents:**
- `ux-design-retro-graphic-upgrade.md` (Sally, UX Designer)
- `ux-design-retro-graphic-upgrade-technical-addendum.md` (Sally, UX Designer)
- `80s Video Game Graphic Design Overview.pdf` (Tomoco research)
- `game-ux-principles.md` (cognitive science foundation)
- `architecture.md` V3 (current state)

---

## V4 Overview

### Scope
8 visual enhancements inspired by 1980s arcade design principles:
1. Progressive dark playfield ("Neon Noir")
2. Distinctive food shapes (pixel silhouette economy)
3. CRT phosphor glow on food items
4. Snake head character enhancements
5. Typography treatments (arcade text)
6. CRT scanline overlay
7. Reactive arcade bezel border
8. Grid intersection dots + progressive dimming

### Strategic Rationale

**Why This Evolution:**
- Deepens retro authenticity (aligns with game's aesthetic identity)
- Strengthens cognitive training (dual-channel recognition, spatial progression)
- Amplifies emotional peaks (score progression creates cinematic transformation)

**Architectural Impact:**
- Extends progression engine (3 fields → 8 fields)
- Establishes CSS/Canvas hybrid rendering patterns
- Introduces defensive rendering patterns (auto-cleanup)
- Defines performance budgets for visual systems
- Creates border state orchestration system

**V1+V2+V3 Compatibility:** Fully additive. All enhancements build on existing modules without breaking changes.

---

## Core Architectural Decisions

### Decision 1: Score-Gated Visual Progression System

**Decision:** All visual enhancements that vary with gameplay progress MUST use score-based thresholds resolved through the `progression.js` module.

**Pattern:**

```javascript
// progression.js — centralized tier resolution
export function getState(score) {
  return {
    // Existing V2 fields
    blinkProbability: resolveThreshold(score, CONFIG.BLINK_THRESHOLDS),
    comboProbability: resolveThreshold(score, CONFIG.COMBO_THRESHOLDS),
    phoneTier: resolveThreshold(score, CONFIG.PHONE_TIERS),

    // V4 Visual Enhancement fields
    background: resolveThreshold(score, CONFIG.BACKGROUND_PROGRESSION, 'background'),
    gridLine: resolveThreshold(score, CONFIG.BACKGROUND_PROGRESSION, 'gridLine'),
    glowIntensity: resolveThreshold(score, CONFIG.FOOD_GLOW, 'blur'),
    lineOpacity: resolveThreshold(score, CONFIG.GRID_OPACITY_PROGRESSION, 'lineOpacity'),
    dotOpacity: resolveThreshold(score, CONFIG.GRID_OPACITY_PROGRESSION, 'dotOpacity')
  };
}
```

**Rationale:**
- Single source of truth for score-tier mapping
- One call per frame in render loop (performance)
- Future visual systems extend this pattern, not create parallel resolution
- Aligns with Axiom 1: "Score-based, never time-based"

**Implementation Rule:**
- `render.js` calls `progression.getState(gameState.score)` ONCE per frame
- Destructure all 8 fields at top of render function
- Pass resolved values to sub-rendering functions
- NEVER call `getState()` multiple times in the same frame

**Anti-Pattern:**
```javascript
// WRONG — multiple calls per frame
const bg = progression.getState(score).background;
const glow = progression.getState(score).glowIntensity;
const opacity = progression.getState(score).lineOpacity;
```

**Correct Pattern:**
```javascript
// CORRECT — single call, destructure
const progressionState = progression.getState(gameState.score);
const { background, glowIntensity, lineOpacity, dotOpacity } = progressionState;
```

**Module Ownership:**
- `config.js`: Owns all threshold tables (tunable data)
- `progression.js`: Resolves score → tier (logic)
- `render.js`: Consumes resolved values (rendering)

---

### Decision 2: CSS/Canvas Hybrid Rendering Architecture

**Decision:** Visual rendering is split across two layers with clear boundaries: CSS for declarative styling/transitions, Canvas for real-time gameplay drawing.

**Rendering Boundaries:**

| Layer | Technology | Responsibilities | Examples |
|-------|------------|------------------|----------|
| **Canvas** | Canvas 2D API | Real-time 60 FPS gameplay visuals that change every frame | Food shapes, snake segments, grid lines, grid dots |
| **CSS** | Stylesheets + transitions | Declarative styling, smooth transitions, overlays | Background color, border color, text effects, scanlines |

**Canvas Background Pattern:**

Use CSS `background-color` on the canvas element, NOT canvas drawing API `fillRect()`.

```javascript
// render.js or game.js
function updateCanvasBackground(gameState) {
  const canvas = document.getElementById('game-canvas');
  const { background } = progression.getState(gameState.score);

  // CSS background-color (GPU-composited transition)
  canvas.style.backgroundColor = background;
}
```

**CSS Transition Rule:**
```css
#game-canvas {
  transition: background-color 2000ms ease-in-out;
}
```

**Why CSS for Background:**
- Browser handles color interpolation automatically (no manual lerp math)
- GPU-composited (zero CPU cost)
- Matches existing combo mode transition pattern
- Canvas drawing operations don't support CSS transitions

**Why Canvas for Food/Snake:**
- Positions change every frame (can't predefine in CSS)
- Collision detection requires pixel-perfect coordinates
- 60 FPS updates (too fast for CSS animations)

**Integration Point:**
- Call `updateCanvasBackground(gameState)` in `game.js` update loop, before `render()`
- Only update when tier changes (cache last background value to prevent redundant DOM writes)

**Caching Pattern:**
```javascript
let lastBackgroundTier = null;

function updateCanvasBackground(gameState) {
  const { background } = progression.getState(gameState.score);

  // Only touch DOM if background tier actually changed
  if (background !== lastBackgroundTier) {
    canvas.style.backgroundColor = background;
    lastBackgroundTier = background;
  }
}
```

---

### Decision 3: Defensive Rendering with Auto-Cleanup Pattern

**Decision:** Canvas rendering operations that modify context state (shadow, opacity, transform) MUST use higher-order functions that guarantee cleanup.

**Problem:**
Canvas 2D context carries implicit state across draw calls. If you forget to reset `shadowBlur`, the glow bleeds onto subsequent draws (snake, grid, everything).

**Defensive Pattern:**

```javascript
// render.js — defensive shadow pattern
function withShadow(ctx, shadowConfig, drawFn) {
  const { color, blur } = shadowConfig;

  // Apply shadow state
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  // Execute draw function
  drawFn(ctx);

  // GUARANTEED cleanup (even if drawFn throws)
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
}

// Usage in renderFood()
export function renderFood(ctx, gameState) {
  const { position, type, color } = gameState.food;
  const { glowIntensity } = progression.getState(gameState.score);

  withShadow(ctx, { color: color, blur: glowIntensity }, (ctx) => {
    renderFoodShape(ctx, x, y, type, color, outlineColor);
  });

  // Shadow state is guaranteed clean here
}
```

**Extensible Pattern:**

This pattern extends to other stateful canvas operations:

```javascript
// Higher-order functions for other canvas state
function withOpacity(ctx, alpha, drawFn) {
  const prev = ctx.globalAlpha;
  ctx.globalAlpha = alpha;
  drawFn(ctx);
  ctx.globalAlpha = prev;
}

function withTransform(ctx, matrix, drawFn) {
  ctx.save();
  ctx.setTransform(...matrix);
  drawFn(ctx);
  ctx.restore();
}

function withClip(ctx, path, drawFn) {
  ctx.save();
  ctx.clip(path);
  drawFn(ctx);
  ctx.restore();
}
```

**Rationale:**
- Makes cleanup automatic and un-forgettable
- Developer can't accidentally skip reset
- Functional programming pattern (pure, composable)
- Self-documenting (the name `withShadow` signals "this handles shadow state")

**Implementation Rule:**
- ALL canvas state modifications MUST use `withX()` pattern
- NO manual `ctx.shadowBlur = 0` scattered in code
- Create the helper function once, use everywhere

**Anti-Pattern:**
```javascript
// WRONG — manual cleanup, easy to forget
ctx.shadowBlur = 8;
renderFoodShape(ctx, x, y, type, color, outlineColor);
ctx.shadowBlur = 0;  // If this line is forgotten, bug!
```

---

### Decision 4: Performance Budgets for Visual Enhancements

**Decision:** All visual enhancements MUST meet a 58 FPS minimum threshold on mid-range devices. Enhancements that fail this budget require optimization before shipping.

**Performance Budget:**

| Metric | Threshold | Test Scenario |
|--------|-----------|---------------|
| **Average FPS** | ≥ 58 FPS | 10-second gameplay recording at score 100+ (worst-case visual complexity) |
| **GPU Usage** | < 60% | Stress test with all systems active (combo + phone + max snake length) |
| **Frame Time** | < 16.67ms | 95th percentile frame time (allows 2 FPS margin) |

**Optimization Strategies:**

#### Grid Dots (525 arc calls per frame)

**Naive Implementation:**
```javascript
// 525 circles × 2 ops (arc + fill) = 1,050 canvas ops per frame
for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
  for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
    ctx.beginPath();
    ctx.arc(x * CONFIG.UNIT_SIZE, y * CONFIG.UNIT_SIZE, CONFIG.GRID_DOT_RADIUS, 0, Math.PI * 2);
    ctx.fill();
  }
}
```

**Optimized Implementation (Offscreen Canvas):**
```javascript
// Render dots to offscreen canvas ONCE, stamp 60x/sec
let gridDotsCache = null;

function renderGridDots(ctx, gameState) {
  const { gridLine, dotOpacity } = progression.getState(gameState.score);

  // Invalidate cache only when opacity tier changes
  if (!gridDotsCache || gridDotsCache.opacity !== dotOpacity) {
    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const offCtx = offscreen.getContext('2d');

    // Render all 525 dots ONCE
    offCtx.fillStyle = gridLine;
    offCtx.globalAlpha = dotOpacity;
    for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
      for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
        offCtx.beginPath();
        offCtx.arc(x * CONFIG.UNIT_SIZE, y * CONFIG.UNIT_SIZE, CONFIG.GRID_DOT_RADIUS, 0, Math.PI * 2);
        offCtx.fill();
      }
    }

    gridDotsCache = { canvas: offscreen, opacity: dotOpacity };
  }

  // Single drawImage call (1 op instead of 1,050)
  ctx.drawImage(gridDotsCache.canvas, 0, 0);
}
```

**Performance Impact:** ~1000x reduction in canvas ops (1 drawImage vs 1,050 arc/fill calls).

**Cache Invalidation:** Only when opacity tier changes (6 times per game maximum, not 60x/sec).

**Implementation Rule:**
- Implement offscreen canvas optimization from day one, not as fallback
- Any rendering operation with > 100 canvas ops per frame requires caching review
- Profile with DevTools Performance tab before shipping

**Validation Process:**
1. Implement enhancement
2. Record 10-second gameplay at score 100+ in DevTools Performance
3. Check FPS graph for sustained 58+ FPS
4. If < 58 FPS, implement optimization strategy
5. Re-test until budget met

---

### Decision 5: Border State Orchestration Pattern

**Decision:** Multiple game systems can trigger border color changes. A priority cascade with event-driven updates (not polling) resolves conflicts.

**Priority Order (Highest to Lowest):**

1. **Death flash** (500ms red flash, then return to underlying state)
2. **Phone states** (ringing = gold, picked up = green)
3. **Combo mode** (matches canvas color)
4. **Active effects** (reverse controls = orange, invincibility = yellow)
5. **Default** (purple)

**Implementation Pattern:**

```javascript
// game.js — border state orchestration
function updateBorderState(gameState) {
  const canvas = document.getElementById('game-canvas');

  // Clear all border classes
  canvas.classList.remove(
    'border-death',
    'border-phone-ring',
    'border-phone-pickup',
    'border-combo',
    'border-reverse',
    'border-invincibility'
  );

  // Priority cascade
  if (gameState.justDied) {
    canvas.classList.add('border-death');
    setTimeout(() => {
      canvas.classList.remove('border-death');
      updateBorderState(gameState); // Re-evaluate after flash
    }, CONFIG.BORDER_DEATH_FLASH_DURATION);
    return;
  }

  if (gameState.phoneCall.active && !gameState.phoneCall.pickedUp) {
    canvas.classList.add('border-phone-ring');
    return;
  }

  if (gameState.phoneCall.pickedUp && gameState.phoneCall.pickUpEndTime > Date.now()) {
    canvas.classList.add('border-phone-pickup');
    return;
  }

  if (gameState.combo.active) {
    canvas.classList.add('border-combo');
    canvas.style.borderColor = gameState.combo.canvasColor;
    return;
  }

  if (gameState.activeEffect?.type === 'reverseControls') {
    canvas.classList.add('border-reverse');
    return;
  }

  if (gameState.activeEffect?.type === 'invincibility') {
    canvas.classList.add('border-invincibility');
    return;
  }

  // Default purple (CSS default)
  canvas.style.borderColor = '';
}
```

**Event-Driven Call Points (NOT Polling):**

```javascript
// Call updateBorderState() only when state CHANGES

// In game.js event handlers:
function onPhoneShow(gameState) {
  // ... phone logic ...
  updateBorderState(gameState);  // State changed
}

function onPhonePickup(gameState) {
  // ... pickup logic ...
  updateBorderState(gameState);  // Immediate border change

  // Timer expiration callback (one-shot, not polling)
  setTimeout(() => {
    gameState.phoneCall.pickedUp = false;
    updateBorderState(gameState);
  }, pickupDuration);
}

function onFoodEaten(gameState) {
  // ... food logic ...
  if (effectChanged) {
    updateBorderState(gameState);  // Only if effect changed
  }
}

function onDeath(gameState) {
  // ... death logic ...
  gameState.justDied = true;
  updateBorderState(gameState);
  setTimeout(() => {
    gameState.justDied = false;
  }, CONFIG.BORDER_DEATH_FLASH_DURATION);
}
```

**CSS Setup:**

```css
#game-canvas {
  border: 8px solid #800080;  /* Default purple */
  transition: border-color 300ms ease-in-out;
}

.border-phone-ring { border-color: #FFD700; }
.border-phone-pickup { border-color: #28a745; }
.border-invincibility { border-color: #FFFF00; }
.border-reverse { border-color: #FFA500; }
.border-death {
  border-color: #FF0000;
  transition: border-color 100ms ease-in;  /* Fast snap */
}
```

**Rationale:**
- Event-driven reduces border evaluation from 60x/sec to ~5x/game
- Priority cascade ensures deterministic behavior when systems overlap
- CSS classes make state transitions declarative
- `setTimeout` for timer expiration (one-shot callback, not polling)

**Implementation Rule:**
- NEVER poll border state in game loop
- ONLY call `updateBorderState()` in event handlers when state changes
- Future systems: add to priority cascade in correct order

**Anti-Pattern:**
```javascript
// WRONG — polling in game loop
function update(gameState) {
  // ... game logic ...
  updateBorderState(gameState);  // Called 60x/sec, wasteful!
}
```

---

## Implementation Patterns

### Pattern 1: Progression State Destructuring

**Context:** `progression.getState()` now returns 8 fields. Calling it multiple times per frame is wasteful.

**Pattern:**

```javascript
// render.js — call once, destructure all
export function render(ctx, gameState) {
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

**Anti-Pattern:**
```javascript
// WRONG — calling getState() in each sub-function
function renderGrid(ctx, gameState) {
  const { gridLine } = progression.getState(gameState.score);  // Redundant call
  // ...
}

function renderFood(ctx, gameState) {
  const { glowIntensity } = progression.getState(gameState.score);  // Redundant call
  // ...
}
```

---

### Pattern 2: CSS Tier Caching (Prevent DOM Thrashing)

**Context:** Updating `canvas.style.backgroundColor` every frame is wasteful if the tier hasn't changed.

**Pattern:**

```javascript
let lastBackgroundTier = null;

function updateCanvasBackground(gameState) {
  const { background } = progression.getState(gameState.score);

  // Only update DOM if tier actually changed
  if (background !== lastBackgroundTier) {
    canvas.style.backgroundColor = background;
    lastBackgroundTier = background;
  }
}
```

**Rationale:**
- Background tier changes at most 6 times per game (score thresholds)
- DOM writes are expensive (trigger style recalc)
- Caching reduces DOM writes from 60x/sec to 6x/game

---

### Pattern 3: Offscreen Canvas Caching

**Context:** Rendering operations with > 100 canvas ops should be pre-rendered to an offscreen canvas and stamped.

**Pattern:**

```javascript
// Cache structure
let cache = null;

function renderExpensiveLayer(ctx, config) {
  const cacheKey = getCacheKey(config);  // e.g., opacity tier

  // Invalidate cache if config changed
  if (!cache || cache.key !== cacheKey) {
    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const offCtx = offscreen.getContext('2d');

    // Render expensive operation ONCE to offscreen
    renderExpensiveOperationToOffscreen(offCtx, config);

    cache = { canvas: offscreen, key: cacheKey };
  }

  // Stamp cached result (single drawImage)
  ctx.drawImage(cache.canvas, 0, 0);
}
```

**When to Use:**
- Grid dots (525 circles)
- Static background patterns
- Complex shape assemblies that don't change every frame

**When NOT to Use:**
- Food position (changes every frame when eaten)
- Snake segments (position changes every tick)
- Dynamic per-frame effects

---

## Module Boundaries (V4 Updates)

### Extended Module Responsibilities

| Module | V4 Additions |
|--------|--------------|
| `config.js` | 6 new config sections: BACKGROUND_PROGRESSION, FOOD_GLOW, BORDER_COLORS, GRID_OPACITY_PROGRESSION, food outline colors, snake outline threshold |
| `progression.js` | Extended `getState()` return: 8 fields total (3 existing + 5 new) |
| `render.js` | New functions: `withShadow()`, `renderFoodShape()`, `renderGridDots()`, `renderSnakeHead()`. Updated: `renderGrid()`, `renderFood()`, `renderSnake()` |
| `game.js` | New functions: `updateCanvasBackground()`, `updateBorderState()`. Event-driven border calls in handlers. |
| `style.css` | New sections: Typography text-shadow rules, scanline pseudo-element, border state classes, high score pulse animation |

### Module Communication Flow (V4)

```
┌─────────────┐
│   game.js   │ (orchestrator)
└──────┬──────┘
       │
       ├─→ updateCanvasBackground(gameState) → canvas.style.backgroundColor
       ├─→ updateBorderState(gameState) → canvas.classList + borderColor
       │
       └─→ render(ctx, gameState)
                 │
                 ├─→ progression.getState(score) → { 8 fields }
                 │
                 ├─→ renderGrid(ctx, gridLine, lineOpacity)
                 ├─→ renderGridDots(ctx, gridLine, dotOpacity)
                 ├─→ renderFood(ctx, gameState, glowIntensity)
                 │     └─→ withShadow(ctx, config, drawFn)
                 │           └─→ renderFoodShape(ctx, x, y, type, color, outline)
                 └─→ renderSnake(ctx, gameState)
                       └─→ renderSnakeHead(ctx, x, y, direction, gameState)
```

---

## Performance Considerations

### V4 Performance Profile

**Before V4:**
- Canvas ops per frame: ~150 (grid lines + snake + food)
- DOM updates per frame: 0 (all canvas)
- Average FPS: 60

**After V4 (Naive Implementation):**
- Canvas ops per frame: ~1,200 (grid + grid dots + food glow/shapes + snake)
- DOM updates per frame: 1-2 (background color check, border state check)
- Predicted FPS: 45-50 (fails budget)

**After V4 (Optimized Implementation):**
- Canvas ops per frame: ~200 (grid + grid dots cached + food glow/shapes + snake)
- DOM updates per frame: 0.1 average (cached tier checks)
- Predicted FPS: 58-60 (meets budget)

**Key Optimizations:**
1. Offscreen canvas for grid dots (1,050 ops → 1 op)
2. CSS tier caching (60 DOM writes/sec → 0.1 writes/sec)
3. Event-driven border updates (60 checks/sec → ~5 checks/game)

---

## V4 Implementation Sequence

### Phase 1: Infrastructure (Batch 0)

**Goal:** Extend config and progression without visual changes.

1. Add 6 new config sections to `config.js`
2. Extend `progression.js` `getState()` to return 8 fields
3. Add `resolveThreshold()` field parameter support
4. Test: `progression.getState(50)` returns all 8 fields correctly

**Validation:** No visual changes, but progression engine is ready.

---

### Phase 2: Neon Noir Foundation (Batch 1)

**Goal:** Deliver score-based visual transformation (light → dark).

**Implementation order:**
1. Food glow (Enhancement 3) — `withShadow()` pattern, smallest change
2. Food shapes (Enhancement 2) — `renderFoodShape()`, dual-channel recognition
3. Dark playfield (Enhancement 1) — `updateCanvasBackground()`, CSS transition
4. Typography (Enhancement 5) — CSS text-shadow rules, no JS changes

**Deliverable:** Game transforms from bright playfield to neon arcade void at high scores.

**Validation:** Visual progression at scores 0, 15, 50, 80, 100. Food items glow on dark backgrounds.

---

### Phase 3: Character & Atmosphere (Batch 2)

**Goal:** Detail layers (snake personality, grid texture, border feedback).

**Implementation order:**
1. Grid dots (Enhancement 8) — with offscreen canvas optimization from day one
2. Snake head (Enhancement 4) — pupils, highlight, outline
3. Reactive border (Enhancement 7) — event-driven `updateBorderState()`
4. Scanlines (Enhancement 6) — CSS pseudo-element

**Deliverable:** Snake has directional gaze, border communicates state, playfield has CRT texture.

**Validation:** Snake pupils track direction. Border changes color for phone/combo/effects. Scanlines visible on dark backgrounds.

---

## V4 Quality Assurance

### Architectural Coherence Checks

- [ ] All V4 patterns compatible with V1+V2+V3 foundations
- [ ] No breaking changes to existing modules
- [ ] Module boundaries respected (config, progression, render, game)
- [ ] Performance budgets met (58+ FPS worst-case)
- [ ] CSS/Canvas hybrid boundaries clear

### Implementation Readiness

- [ ] All 5 decisions documented with code examples
- [ ] All 3 patterns documented with anti-patterns
- [ ] Module responsibilities updated
- [ ] Performance optimization strategies defined
- [ ] Implementation sequence ordered with dependencies

### Risk Mitigation

- [ ] Canvas shadow state leak → `withShadow()` auto-cleanup
- [ ] Grid dot performance → offscreen canvas from day one
- [ ] Border state thrashing → event-driven, not polling
- [ ] CSS transition conflicts → tier caching prevents DOM spam

---

## V4 Architecture Status

**Status:** READY FOR REVIEW

**Next Steps:**
1. Review this V4 architecture document with Tomoco
2. Integrate approved sections into main `architecture.md`
3. Update `project-context.md` with V4 module boundaries
4. Create epics/stories from V4 architecture
5. Begin Phase 1 implementation (infrastructure)

---

## Document Maintenance

**When to Update:**
- Performance budgets change (new devices, browser updates)
- New visual enhancements added (extend progression fields)
- New canvas state patterns discovered (add `withX()` helpers)
- Border priority order changes (new overlays, new effects)

**Version History:**
- V4 Draft: 2026-02-16 (Winston, Architect)

---

**End of V4 Architecture Document**
