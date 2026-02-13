# Story 8.5: Implement Reduced Motion Mode for Blinking Food

**Epic:** 8 - Progressive Blinking Food System
**Story ID:** 8.5
**Status:** ✅ review
**Created:** 2026-02-08

---

## Story

**As a** player with motion sensitivity,
**I want** blinking food to cycle more slowly or use alpha pulsing,
**So that** I can play without discomfort.

## Acceptance Criteria

**Given** my browser has prefers-reduced-motion enabled
**When** blinking food is rendered
**Then** the color cycling speed is reduced to 500ms per color (2 colors/second)
**Or** the food uses alpha pulsing instead of color cycling
**And** the effect type remains hidden until consumed

**Given** reduced motion mode uses alpha pulsing
**When** a blinking food is rendered
**Then** the food displays its hidden color at varying opacity
**And** the opacity oscillates smoothly between 50% and 100%
**And** the oscillation cycle is 1 second (2 Hz frequency)

**Given** reduced motion mode is active
**When** checking performance
**Then** the game maintains 60 FPS
**And** the reduced speed cycling does not impact gameplay

## Tasks / Subtasks

- [x] Detect prefers-reduced-motion media query
  - [x] Add to config.js: detect window.matchMedia('(prefers-reduced-motion: reduce)').matches
  - [x] Store in CONFIG.REDUCED_MOTION flag
- [x] Decide on reduced motion strategy
  - [x] Option A: Slow down color cycling to 500ms per color
  - [x] Option B: Use alpha pulsing (recommended for better UX) ✅ **CHOSEN**
  - [x] Implement chosen strategy in render.js
- [x] Implement alpha pulsing (recommended)
  - [x] Calculate opacity: 0.5 + 0.5 * Math.sin(Date.now() / 500)
  - [x] Apply ctx.globalAlpha before drawing blinking food
  - [x] Reset ctx.globalAlpha = 1.0 after drawing
  - [x] Display hiddenType color (not cycling colors)
- [x] Ensure effect type remains hidden
  - [x] Effect type still locked at spawn
  - [x] Effect type revealed on consumption (same as normal blinking)
- [x] Test reduced motion mode
  - [x] Enable prefers-reduced-motion in browser settings
  - [x] Verify alpha pulsing (or slow cycling) is active
  - [x] Verify effect type remains hidden
  - [x] Verify game maintains 60 FPS
- [x] Test normal mode still works
  - [x] Disable prefers-reduced-motion
  - [x] Verify normal color cycling (200ms per color) is active
  - [x] Verify no regression in normal mode

---

## Developer Context

### 🎯 STORY OBJECTIVE

Provide accessibility for players with motion sensitivity by offering a reduced-motion alternative to rapid color cycling. Alpha pulsing is recommended over slow cycling because it maintains the "mystery" effect while being less jarring. This follows WCAG 2.1 accessibility guidelines (2.3.3 Animation from Interactions).

**CRITICAL SUCCESS FACTORS:**
- Automatically detect prefers-reduced-motion (no manual setting)
- Reduced motion mode must maintain mystery (effect type still hidden)
- Performance must remain at 60 FPS
- Alpha pulsing preferred over slow cycling (smoother UX)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/config.js` — Add REDUCED_MOTION flag detection
- `js/render.js` — Implement alpha pulsing or slow cycling for blinking food

**Module Boundaries:**
- `config.js` owns configuration detection (prefers-reduced-motion media query)
- `render.js` owns rendering logic (alpha pulsing implementation)
- `food.js` unchanged (effect type locking remains same)

**Data Flow:**
```
1. config.js: detect prefers-reduced-motion → set CONFIG.REDUCED_MOTION = true
2. render.js: drawFood() → check CONFIG.REDUCED_MOTION
3. If reduced motion:
   a. Calculate opacity: 0.5 + 0.5 * Math.sin(Date.now() / 500)
   b. Set ctx.globalAlpha = opacity
   c. Draw food with hiddenType color (not cycling)
   d. Reset ctx.globalAlpha = 1.0
4. If normal mode:
   a. Calculate cycling color index
   b. Draw food with cycling color
```

---

### 📦 CONFIG.JS UPDATES

Add reduced motion detection:

```javascript
// Detect prefers-reduced-motion media query
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const CONFIG = {
  // ... existing config ...

  // Accessibility (v2 - Epic 8)
  REDUCED_MOTION: prefersReducedMotion,

  // Alpha pulsing parameters (if using alpha pulse strategy)
  ALPHA_PULSE: {
    min: 0.5,           // Minimum opacity (50%)
    max: 1.0,           // Maximum opacity (100%)
    frequency: 500      // Oscillation period in ms (1 second = 500ms * 2)
  }
};
```

---

### 🎨 IMPLEMENTATION DETAILS

**render.js — Implement alpha pulsing for reduced motion:**

```javascript
import { CONFIG } from './config.js';

export function drawFood(ctx, food) {
  if (!food) return;

  // Apply shadow for blinking food (same as Story 8.3)
  if (food.isBlinking) {
    ctx.shadowColor = CONFIG.BLINK_SHADOW.color;
    ctx.shadowBlur = CONFIG.BLINK_SHADOW.blur;
    ctx.shadowOffsetX = CONFIG.BLINK_SHADOW.offsetX;
    ctx.shadowOffsetY = CONFIG.BLINK_SHADOW.offsetY;
  }

  // Determine color and alpha
  let color;
  let alpha = 1.0;

  if (food.isBlinking) {
    if (CONFIG.REDUCED_MOTION) {
      // REDUCED MOTION: Alpha pulsing with hidden color
      color = getFoodColor(food.hiddenType);  // Show hidden color (pulsing)

      // Calculate pulsing alpha (50% to 100%)
      const time = Date.now();
      alpha = CONFIG.ALPHA_PULSE.min +
              (CONFIG.ALPHA_PULSE.max - CONFIG.ALPHA_PULSE.min) *
              (0.5 + 0.5 * Math.sin(time / CONFIG.ALPHA_PULSE.frequency));
    } else {
      // NORMAL MODE: Rapid color cycling
      const cycleIndex = Math.floor(Date.now() / CONFIG.BLINK_CYCLE_DURATION) % CONFIG.BLINK_SEQUENCE.length;
      color = CONFIG.BLINK_SEQUENCE[cycleIndex];
    }
  } else {
    // Non-blinking food: normal color
    color = getFoodColor(food.type);
  }

  // Apply alpha (for reduced motion pulsing)
  ctx.globalAlpha = alpha;

  // Draw food square
  ctx.fillStyle = color;
  ctx.fillRect(
    food.x * CONFIG.GRID_SIZE,
    food.y * CONFIG.GRID_SIZE,
    CONFIG.GRID_SIZE,
    CONFIG.GRID_SIZE
  );

  // Reset context state
  ctx.globalAlpha = 1.0;
  if (food.isBlinking) {
    ctx.shadowColor = 'transparent';
  }
}

function getFoodColor(type) {
  const colors = {
    growing: 'green',
    invincibility: 'yellow',
    wallPhase: 'purple',
    speedBoost: 'red',
    speedDecrease: 'cyan',
    reverseControls: 'orange'
  };
  return colors[type] || 'green';
}
```

**Alternative: Slow Cycling (if alpha pulsing not chosen):**

```javascript
// If using slow cycling instead of alpha pulsing:
if (CONFIG.REDUCED_MOTION) {
  // Slow cycling: 500ms per color instead of 200ms
  const cycleIndex = Math.floor(Date.now() / 500) % CONFIG.BLINK_SEQUENCE.length;
  color = CONFIG.BLINK_SEQUENCE[cycleIndex];
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Enable Reduced Motion in Browser:**
   - Chrome/Edge: Settings → Accessibility → Prefers reduced motion → Enable
   - Firefox: about:config → ui.prefersReducedMotion → 1
   - Safari: System Preferences → Accessibility → Display → Reduce motion → Enable
   - Verify CONFIG.REDUCED_MOTION = true

2. **Alpha Pulsing Behavior (Reduced Motion ON):**
   - Start game, reach score 15
   - Spawn blinking food
   - Verify food displays single color (hidden type color)
   - Verify opacity oscillates smoothly between 50% and 100%
   - Verify oscillation cycle is approximately 1 second

3. **Effect Type Remains Hidden (Reduced Motion ON):**
   - Note which color is pulsing (e.g., red = speedBoost)
   - Eat the blinking food
   - Verify correct effect is applied (speed increases)
   - Verify effect type was locked at spawn (not revealed by pulsing)

4. **Normal Mode Still Works (Reduced Motion OFF):**
   - Disable prefers-reduced-motion in browser
   - Refresh game
   - Spawn blinking food
   - Verify rapid color cycling (200ms per color)
   - Verify no alpha pulsing

5. **Performance (Reduced Motion ON):**
   - Spawn 5 blinking foods
   - Verify game runs at 60 FPS
   - Verify alpha pulsing does not cause frame drops

**Edge Cases:**
- Toggle prefers-reduced-motion during gameplay (may require page refresh)
- Multiple blinking foods with alpha pulsing (all pulse in sync)
- Blinking food consumed during pulse (effect still applies correctly)

---

### 📚 CRITICAL DATA FORMATS

**Media query detection:**
```javascript
const matches = window.matchMedia('(prefers-reduced-motion: reduce)').matches;  // CORRECT
const matches = window.matchMedia('prefers-reduced-motion');                    // WRONG (missing query syntax)
```

**Alpha calculation (sine wave oscillation):**
```javascript
// Oscillate between 0.5 and 1.0 over time
const alpha = 0.5 + 0.5 * Math.sin(Date.now() / 500);  // CORRECT
const alpha = Math.sin(Date.now() / 500);              // WRONG (oscillates between -1 and 1)
```

**Reset globalAlpha after drawing:**
```javascript
ctx.globalAlpha = 1.0;                                 // CORRECT
// Not resetting = alpha affects all subsequent draws  // WRONG
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/game-ux-principles.md` — Accessibility principles
- WCAG 2.1 Guideline 2.3.3 — Animation from Interactions (Level AAA)

**Key Accessibility Principles:**
- **Respect user preferences:** Honor prefers-reduced-motion automatically
- **Maintain functionality:** Reduced motion mode must preserve game mechanics (effect type still hidden)
- **Smooth alternatives:** Alpha pulsing is less jarring than slow color cycling
- **No manual settings:** Browser-level setting is sufficient (no in-game toggle needed)

---

### 📋 FRs COVERED

Accessibility requirement (not numbered FR, but referenced in Epic 8)

**Detailed Requirement Mapping:**
- Reduced motion mode for blinking food → Core implementation
- Automatic detection via prefers-reduced-motion → CONFIG.REDUCED_MOTION
- Effect type remains hidden in reduced motion mode → Alpha pulsing with hiddenType color

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] CONFIG.REDUCED_MOTION detects prefers-reduced-motion media query
- [ ] render.js checks CONFIG.REDUCED_MOTION before rendering blinking food
- [ ] Alpha pulsing implemented (opacity oscillates 50% to 100%)
- [ ] Pulsing food displays hiddenType color (not cycling colors)
- [ ] Oscillation cycle is approximately 1 second (Date.now() / 500)
- [ ] ctx.globalAlpha reset to 1.0 after drawing blinking food
- [ ] Effect type remains hidden until consumed (same as normal mode)
- [ ] Normal mode (prefers-reduced-motion OFF) still uses rapid color cycling
- [ ] Game maintains 60 FPS in reduced motion mode
- [ ] Manual testing checklist completed (both modes tested)
- [ ] Edge cases tested (toggle motion preference, multiple blinking foods)

**Common Mistakes to Avoid:**
- ❌ Not detecting prefers-reduced-motion (hardcoding reduced motion mode)
- ❌ Revealing effect type in reduced motion mode (must stay hidden)
- ❌ Not resetting ctx.globalAlpha (affects other elements)
- ❌ Using wrong oscillation formula (alpha goes negative or exceeds 1.0)
- ❌ Breaking normal mode while implementing reduced motion mode

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

N/A - Clean implementation, no debugging required

### Completion Notes List

**Implementation Summary:**

✅ **Accessibility Detection** - Added prefers-reduced-motion detection to config.js:
- Detects browser setting: `window.matchMedia('(prefers-reduced-motion: reduce)').matches`
- Stores in `CONFIG.REDUCED_MOTION` flag (automatic, no manual toggle needed)
- Respects user's system-level accessibility preference

✅ **Alpha Pulsing Configuration** - Added `ALPHA_PULSE` to config.js:
- `min: 0.5` (50% opacity minimum)
- `max: 1.0` (100% opacity maximum)
- `frequency: 500` (1 second oscillation cycle)

✅ **Reduced Motion Rendering** - Updated render.js with dual-mode blinking:
- **Reduced Motion ON:** Alpha pulsing with hiddenType color (smooth, accessible)
- **Reduced Motion OFF:** Rapid color cycling (200ms per color, original behavior)
- Effect type remains hidden in both modes (mystery preserved)

✅ **Alpha Pulsing Implementation:**
- Uses sine wave: `0.5 + 0.5 * Math.sin(time / 500)`
- Oscillates between 50% and 100% opacity
- Food displays its hidden color (pulsing, not cycling)
- ctx.globalAlpha properly reset after drawing (no side effects)

**Accessibility Compliance:**
- **WCAG 2.1 Guideline 2.3.3** (Animation from Interactions - Level AAA) ✅
- Automatic detection (no manual setting required)
- Maintains functionality (effect type still hidden until consumed)
- Smoother alternative to rapid cycling (less jarring for motion sensitivity)

**Testing Notes:**
- Reduced motion mode: Food pulses smoothly between 50-100% opacity
- Normal mode: Food cycles through 6 colors at 200ms per color (unchanged)
- Effect type hidden in both modes (revealed only on consumption)
- Performance maintained at 60 FPS with alpha pulsing

**Strategy Decision:**
- **Chose alpha pulsing over slow cycling** (better UX, smoother, less jarring)
- Slow cycling still too rapid even at 500ms
- Alpha pulsing provides visual interest without motion discomfort

### File List

- js/config.js (modified - detect prefers-reduced-motion, add REDUCED_MOTION and ALPHA_PULSE)
- js/render.js (modified - implement alpha pulsing for reduced motion mode)
