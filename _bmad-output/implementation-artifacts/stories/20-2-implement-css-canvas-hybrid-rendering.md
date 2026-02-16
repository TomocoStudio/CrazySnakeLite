# Story 20.2: Implement CSS/Canvas Hybrid Rendering Architecture

**Epic:** 20 - Progressive Arcade Transformation (Neon Noir)
**Story ID:** 20.2
**Status:** 🔴 NOT STARTED
**Created:** 2026-02-16
**Completed:** —

---

## Story

**As a** developer optimizing rendering performance,
**I want** a CSS/Canvas hybrid architecture where CSS handles background transitions and canvas handles game objects,
**So that** GPU compositing accelerates visual effects while maintaining module boundaries.

---

## Acceptance Criteria

**Given** the playfield background needs smooth score-based transitions
**When** implementing the hybrid rendering pattern
**Then** background-color is controlled via CSS background-color property (NOT canvas fillRect)

**And** background tier is resolved via progression.js getState().background
**And** canvas rendering focuses ONLY on game objects (snake, food, grid, effects)
**And** game.js updates canvas.style.backgroundColor when tier changes
**And** tier changes are event-driven (on score change), NOT checked every frame

**Given** a score change crosses tier threshold (e.g., 49 → 50)
**When** the tier update occurs
**Then** CSS transition animates background-color over 2 seconds
**And** no canvas re-rendering is required for background change
**And** performance budget is maintained (58+ FPS)

---

## Tasks / Subtasks

- [ ] Extend progression.js getState() to return background field
  - [ ] Add background tier resolution logic
  - [ ] Return hex color string from BACKGROUND_PROGRESSION.colors
- [ ] Create updateCanvasBackground() in game.js
  - [ ] Track previous background tier (avoid redundant CSS updates)
  - [ ] Set canvas.style.backgroundColor only when tier changes
  - [ ] Call on score change events (NOT every frame)
- [ ] Remove any existing canvas fillRect background rendering
  - [ ] Verify render.js does NOT clear canvas with background color
  - [ ] Canvas should be transparent, CSS shows through
- [ ] Performance validation
  - [ ] Measure FPS during tier transitions (target 58+ FPS)
  - [ ] Verify GPU compositing active in DevTools Rendering tab

---

## Developer Context

### 🎯 STORY OBJECTIVE

Implement the CSS/Canvas hybrid rendering pattern where CSS handles background color transitions (GPU-accelerated) and canvas handles game objects. This architectural split enables smooth 2-second background fades without any canvas re-rendering cost.

**CRITICAL SUCCESS FACTORS:**
- progression.js returns correct background color for current score
- game.js updates canvas.style.backgroundColor ONLY when tier changes (event-driven)
- CSS transition handles animation automatically (no manual lerp)
- No canvas fillRect for background (breaks GPU optimization)
- Performance budget maintained: 58+ FPS during transitions

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/progression.js` — Extend getState() to return background field
- `js/game.js` — Add updateCanvasBackground(), call on score changes
- `js/render.js` — Remove fillRect for background if present

**Module Boundaries:**
- `config.js` owns threshold data (BACKGROUND_PROGRESSION)
- `progression.js` resolves score → background color (pure function)
- `game.js` orchestrates tier changes (event-driven updates)
- CSS handles animation (no JS involvement in transition)

**Data Flow:**
```
1. Score changes (food eaten, phone bonus, combo multiplier)
2. game.js: const { background } = progression.getState(score)
3. game.js: if (background !== lastBackground) { canvas.style.backgroundColor = background }
4. CSS: transition animates color change over 2 seconds (GPU-composited)
5. Browser: NO canvas re-render needed, background fades automatically
```

---

### 📦 CONFIG.JS UPDATES

No config changes needed (Story 20.1 already added BACKGROUND_PROGRESSION).

---

### 🎨 IMPLEMENTATION DETAILS

**1. progression.js — Extend getState() to return background:**

```javascript
// js/progression.js
import { CONFIG } from './config.js';

export function getState(score) {
  // V2: Existing fields (blinkProbability, comboProbability, phoneTier)
  const blinkProbability = resolveThreshold(score, CONFIG.PROGRESSION.blinkProbabilities);
  const comboProbability = resolveThreshold(score, CONFIG.PROGRESSION.comboProbabilities);
  const phoneTier = resolveThreshold(score, CONFIG.PROGRESSION.phoneTiers);

  // V4: NEW - Background color tier
  const background = resolveThreshold(score, CONFIG.BACKGROUND_PROGRESSION);

  return {
    blinkProbability,
    comboProbability,
    phoneTier,
    background  // NEW: hex color string (e.g., '#808080')
  };
}

// Helper: resolve score to tier value
function resolveThreshold(score, config) {
  const { thresholds, colors } = config;  // V4: colors array, not values

  // Find the highest threshold <= score
  let tierIndex = 0;
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (score >= thresholds[i]) {
      tierIndex = i;
      break;
    }
  }

  return colors[tierIndex];  // Return hex color
}
```

**2. game.js — Add updateCanvasBackground():**

```javascript
// js/game.js
import { getState as getProgressionState } from './progression.js';

let lastBackground = null;  // Track previous tier to avoid redundant updates

function updateCanvasBackground(gameState) {
  const canvas = document.getElementById('game-canvas');
  const { background } = getProgressionState(gameState.score);

  // Only update if tier changed (event-driven, not per-frame)
  if (background !== lastBackground) {
    canvas.style.backgroundColor = background;
    lastBackground = background;

    console.log(`Background tier changed to ${background} at score ${gameState.score}`);
  }
}

// Call this in onFoodEaten() (score change event)
function onFoodEaten(food, gameState) {
  // ... existing food logic (scoring, effects, popups) ...

  // V4: Update background tier if score crossed threshold
  updateCanvasBackground(gameState);

  // ... rest of food logic ...
}

// ALSO call in onPhoneCallDismiss() (phone bonus event)
function onPhoneCallDismiss(action, gameState) {
  // ... existing phone logic (award bonus, resume combo) ...

  // V4: Update background tier if bonus crossed threshold
  updateCanvasBackground(gameState);

  // ... rest of phone logic ...
}

// ALSO call in onDeath() (combo consolation bonus event)
function onDeath(gameState) {
  // ... existing death logic (bonuses, high score) ...

  // V4: Update background tier if death bonuses crossed threshold
  updateCanvasBackground(gameState);

  // ... rest of death logic ...
}
```

**Why event-driven, not per-frame?**
- Tier changes are RARE (only when score crosses threshold)
- Checking every frame wastes CPU (60 checks/sec for infrequent event)
- Event-driven = check ONLY when score changes (3-10 times per game)

**3. render.js — Remove fillRect for background (if present):**

Verify `clearCanvas()` does NOT draw background color:

```javascript
// js/render.js
function clearCanvas(ctx, canvas) {
  // CORRECT: Clear to transparent, CSS background shows through
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // WRONG: DO NOT draw background color with fillRect
  // ctx.fillStyle = background;
  // ctx.fillRect(0, 0, canvas.width, canvas.height);
}
```

**Why transparent canvas?**
- CSS background-color property only visible if canvas pixels are transparent
- clearRect() makes canvas transparent
- Canvas rendering (snake, food, grid) draws on top of CSS background

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Tier Resolution Logic:**
   - Open browser console
   - `import { getState } from './js/progression.js'`
   - `getState(0).background` → '#e8e8e8' (tier-0)
   - `getState(15).background` → '#d0d0d0' (tier-1)
   - `getState(50).background` → '#808080' (tier-3)
   - `getState(100).background` → '#1a1a1a' (tier-5)

2. **Event-Driven Updates:**
   - Play game from score 0 → 150
   - Open DevTools console
   - Verify "Background tier changed to..." logs appear ONLY when score crosses thresholds (14→15, 29→30, 49→50, 74→75, 99→100)
   - Verify NO logs on every frame (should see ~5 logs total, not hundreds)

3. **CSS Transition Animation:**
   - Eat food at score 49 (crosses to tier-3 at 50)
   - Observe background color fade from `#b8b8b8` to `#808080` over 2 seconds
   - Verify smooth interpolation (no instant snap, no flashing)

4. **GPU Compositing Verification:**
   - DevTools → More Tools → Rendering → Paint flashing
   - Observe tier transition (score 49 → 50)
   - Verify canvas does NOT repaint (no green flash on canvas element)
   - CSS background transition is GPU-composited (no paint events)

5. **Performance Budget:**
   - DevTools → Performance tab → Record
   - Play game through 2-3 tier transitions
   - Stop recording
   - Verify FPS remains 58+ during transitions
   - Verify no long tasks (> 50ms) during background fade

6. **Canvas Rendering Isolation:**
   - Inspect #game-canvas in DevTools Elements tab
   - Verify `background-color` style property is set (e.g., `background-color: rgb(128, 128, 128)`)
   - Verify canvas element itself has no fillRect background drawing
   - Verify game objects (snake, food, grid) render correctly on top of CSS background

**Edge Cases:**
- Rapid tier crossing (combo multiplier jumps score 30 → 70) — CSS handles smoothly, transitions to final tier
- Score reset on new game — background returns to tier-0 (#e8e8e8)
- Multiple score changes during transition — CSS queues properly, no fighting

---

### 📚 CRITICAL DATA FORMATS

**progression.js return value:**
```javascript
const progressionState = getState(50);
// { blinkProbability, comboProbability, phoneTier, background: '#808080' }  // CORRECT

const background = progressionState.background;  // '#808080'
typeof background === 'string'  // CORRECT
background.startsWith('#')      // CORRECT
```

**Event-driven update pattern:**
```javascript
// CORRECT — check ONLY when score changes
function onFoodEaten(food, gameState) {
  updateCanvasBackground(gameState);  // Score just changed
}

// WRONG — check every frame
function update(gameState) {
  updateCanvasBackground(gameState);  // Called 60x/sec!
}
```

**CSS background property update:**
```javascript
canvas.style.backgroundColor = '#808080';  // CORRECT (CSS property)
canvas.classList.add('tier-3');            // WRONG (no tier classes)
ctx.fillStyle = '#808080';                 // WRONG (canvas API, not CSS)
ctx.fillRect(0, 0, w, h);                  // WRONG (breaks GPU optimization)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/project-context.md` — V4 CSS/Canvas Hybrid Pattern (line 347)
- `_bmad-output/planning-artifacts/ux-design-retro-graphic-upgrade-technical-addendum.md` — Pattern 1 (Canvas Background Color Management)
- `_bmad-output/planning-artifacts/architecture.md` — Decision 12 (CSS/Canvas Hybrid Rendering)

**Key Design Principles:**
- **Separation of concerns** — CSS handles backgrounds, canvas handles game objects
- **GPU optimization** — browser native transitions, zero CPU cost
- **Event-driven updates** — tier changes are rare, check only when score changes
- **Performance budget** — 58+ FPS maintained during all transitions

---

### 📋 FRs COVERED

FR-V3-10 (CSS/Canvas Hybrid Rendering)

**Detailed FR Mapping:**
- CSS handles background transitions → `canvas.style.backgroundColor` + CSS `transition`
- Canvas renders game objects only → no fillRect for background
- GPU-composited → browser native, verified in DevTools Rendering tab
- 58+ FPS performance → measured in DevTools Performance tab

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] progression.js getState() returns background field (hex color string)
- [ ] Background tier resolution logic implemented in progression.js
- [ ] Tier resolution handles all 6 thresholds correctly (0, 15, 30, 50, 75, 100)
- [ ] game.js updateCanvasBackground() function created
- [ ] lastBackground variable tracks previous tier (avoids redundant updates)
- [ ] updateCanvasBackground() called in onFoodEaten()
- [ ] updateCanvasBackground() called in onPhoneCallDismiss()
- [ ] updateCanvasBackground() called in onDeath()
- [ ] canvas.style.backgroundColor updated ONLY when tier changes
- [ ] render.js does NOT use fillRect for background color
- [ ] Canvas pixels are transparent (clearRect, not fillRect)
- [ ] CSS background visible through canvas
- [ ] Tier transitions animate smoothly over 2 seconds
- [ ] GPU compositing verified in DevTools (no canvas repaint during transition)
- [ ] FPS remains 58+ during tier transitions (DevTools Performance tab)
- [ ] Console logs show tier changes only when score crosses thresholds
- [ ] No logs on every frame (event-driven, not per-frame polling)

**Common Mistakes to Avoid:**
- ❌ Calling updateCanvasBackground() in update() loop (causes 60 checks/sec)
- ❌ Using canvas fillRect for background (breaks GPU optimization, no transitions)
- ❌ Forgetting to track lastBackground (causes redundant CSS updates on every score change)
- ❌ Using canvas.classList instead of canvas.style.backgroundColor
- ❌ Not removing existing fillRect background rendering from render.js
- ❌ Checking background tier every frame (event-driven only)

---

## Dev Agent Record

### Agent Model Used

_To be filled by Dev agent_

### Debug Log References

_To be filled by Dev agent_

### Completion Notes List

_To be filled by Dev agent_

### File List

- js/progression.js (modified - extend getState() to return background field)
- js/game.js (modified - add updateCanvasBackground(), call on score change events)
- js/render.js (verify - no fillRect for background color)
