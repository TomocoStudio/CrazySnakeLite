# Story 20.4: Implement Background Transition Logic

**Epic:** 20 - Progressive Arcade Transformation (Neon Noir)
**Story ID:** 20.4
**Status:** 🔴 NOT STARTED
**Created:** 2026-02-16
**Completed:** —

---

## Story

**As a** player,
**I want** smooth background color transitions when I cross score thresholds,
**So that** the visual transformation feels cinematic and earned, not jarring.

---

## Acceptance Criteria

**Given** the player's score crosses a tier threshold (e.g., 49 → 50, entering tier-3)
**When** the tier change is detected
**Then** game.js updates the canvas element's background-color via CSS

**And** CSS transition property animates the background-color change over 2 seconds
**And** tier changes are checked ONLY when score changes (event-driven, not per-frame polling)
**And** previous background color is cached to avoid redundant CSS updates

**Given** rapid score increases (e.g., combo streak crosses multiple tiers)
**When** multiple tier thresholds are crossed in quick succession
**Then** CSS transition handles the progression smoothly
**And** only the final tier color is applied (CSS interpolates to final state)

**Given** game reset (return to menu or new game)
**When** score resets to 0
**Then** canvas background returns to tier-0 (light grey #e8e8e8)

---

## Tasks / Subtasks

- [ ] Implement updateCanvasBackground() in game.js (from Story 20.2)
  - [ ] Track lastBackground to avoid redundant updates
  - [ ] Call progression.getState(score).background
  - [ ] Update canvas.style.backgroundColor only when tier changes
- [ ] Add event-driven calls to updateCanvasBackground()
  - [ ] Call in onFoodEaten() (score change)
  - [ ] Call in onPhoneCallDismiss() (phone bonus)
  - [ ] Call in onDeath() (combo/phone consolation bonuses)
- [ ] Add resetCanvasBackground() for game reset
  - [ ] Call in initGame() or state.reset()
  - [ ] Set canvas.style.backgroundColor = '#e8e8e8' (tier-0)
  - [ ] Reset lastBackground = null
- [ ] Test transition smoothness
  - [ ] Verify 2-second CSS transition on tier changes
  - [ ] Test rapid tier crossing (combo multiplier)
  - [ ] Verify no flashing or intermediate states

---

## Developer Context

### 🎯 STORY OBJECTIVE

Orchestrate background tier changes in game.js using event-driven updates. When score crosses a threshold, update canvas.style.backgroundColor, and CSS handles the 2-second fade automatically. This creates cinematic visual progression that feels earned, not jarring.

**CRITICAL SUCCESS FACTORS:**
- Event-driven (check only when score changes, NOT every frame)
- Cache previous tier to avoid redundant CSS updates
- CSS transition handles animation (no JS involvement)
- Smooth 2-second fades feel cinematic and intentional
- Game reset returns to tier-0 cleanly

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/game.js` — Add updateCanvasBackground(), call in score change events
- `js/state.js` — Add resetCanvasBackground() call in reset()

**Module Boundaries:**
- `progression.js` resolves score → background color (pure function)
- `game.js` orchestrates tier updates (event-driven)
- CSS handles transition animation (browser native)

**Data Flow:**
```
1. Score changes (food eaten, phone bonus, combo multiplier, death bonuses)
2. game.js: updateCanvasBackground(gameState)
3. game.js: const { background } = progression.getState(score)
4. game.js: if (background !== lastBackground) { canvas.style.backgroundColor = background }
5. CSS: transition animates color change over 2 seconds (GPU-composited)
6. Browser: Background fades smoothly, no JS involvement during animation
```

---

### 📦 CONFIG.JS UPDATES

No config changes needed (Stories 20.1 and 20.2 already added BACKGROUND_PROGRESSION).

---

### 🎨 IMPLEMENTATION DETAILS

**1. game.js — Implement updateCanvasBackground() (from Story 20.2):**

```javascript
// js/game.js
import { getState as getProgressionState } from './progression.js';

let lastBackground = null;  // Cache previous tier to avoid redundant updates

function updateCanvasBackground(gameState) {
  const canvas = document.getElementById('game-canvas');
  const { background } = getProgressionState(gameState.score);

  // Only update if tier changed (event-driven, not per-frame)
  if (background !== lastBackground) {
    canvas.style.backgroundColor = background;
    lastBackground = background;

    console.log(`[V4] Background tier changed to ${background} at score ${gameState.score}`);
  }
}
```

**2. game.js — Add event-driven calls:**

```javascript
// Call in onFoodEaten() (score increases when food eaten)
function onFoodEaten(food, gameState) {
  // ... existing food logic (scoring, effects, combo, popups) ...

  // V4: Update background tier if score crossed threshold
  updateCanvasBackground(gameState);

  // ... rest of food logic ...
}

// Call in onPhoneCallDismiss() (score increases from phone bonus)
function onPhoneCallDismiss(action, gameState) {
  // ... existing phone logic (award bonus, resume combo) ...

  // V4: Update background tier if bonus crossed threshold
  updateCanvasBackground(gameState);

  // ... rest of phone logic ...
}

// Call in onDeath() (score increases from death bonuses)
function onDeath(gameState) {
  // ... existing death logic (award combo/phone consolation bonuses) ...

  // V4: Update background tier if death bonuses crossed threshold
  updateCanvasBackground(gameState);

  // ... rest of death logic ...
}
```

**Why these 3 call points?**
- `onFoodEaten()` — score increases from food value (most frequent)
- `onPhoneCallDismiss()` — score increases from Pick Up bonus (Fibonacci sequence)
- `onDeath()` — score increases from combo/phone consolation bonuses

These are the ONLY events that change score, so these are the ONLY places to check tier changes.

**3. game.js — Add resetCanvasBackground() for game reset:**

```javascript
// js/game.js
function resetCanvasBackground() {
  const canvas = document.getElementById('game-canvas');
  canvas.style.backgroundColor = '#e8e8e8';  // tier-0 default
  lastBackground = '#e8e8e8';

  console.log('[V4] Background reset to tier-0');
}

// Call in initGame() (new game start)
export function initGame() {
  // ... existing init logic (reset state, spawn food) ...

  // V4: Reset background to tier-0
  resetCanvasBackground();

  // ... rest of init logic ...
}
```

**4. Alternative: Call in state.reset() instead:**

```javascript
// js/state.js
export function resetState(gameState) {
  // ... existing state reset logic ...

  // V4: Reset background tier cache
  // (Requires importing resetCanvasBackground from game.js)
  // OR: Just reset in game.js initGame() — simpler
}
```

**Recommendation:** Reset in `game.js initGame()` to keep all background logic in one module.

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Event-Driven Updates (Console Logs):**
   - Open DevTools console
   - Play game from score 0 → 150
   - Verify console logs show tier changes ONLY when crossing thresholds:
     - "Background tier changed to #d0d0d0 at score 15" (tier-0 → tier-1)
     - "Background tier changed to #b8b8b8 at score 30" (tier-1 → tier-2)
     - "Background tier changed to #808080 at score 50" (tier-2 → tier-3)
     - "Background tier changed to #505050 at score 75" (tier-3 → tier-4)
     - "Background tier changed to #1a1a1a at score 100" (tier-4 → tier-5)
   - Verify NO logs on every frame (should see ~5 logs total for full playthrough)

2. **Smooth 2-Second Transitions:**
   - Eat food at score 49 (next food crosses to tier-3 at score 50)
   - Observe background fade from #b8b8b8 to #808080 over 2 seconds
   - Verify smooth interpolation (no instant snap, no flashing)
   - Repeat for other tier transitions (14→15, 29→30, 74→75, 99→100)

3. **Rapid Tier Crossing (Combo Multiplier):**
   - Activate combo mode (eat Effect A + Effect B)
   - Combo score multiplier (e.g., 5 × 8 = 40 points)
   - Score jumps from 30 → 70 (crosses tier-2 and tier-3)
   - Verify background transitions smoothly to tier-3 color (#808080)
   - Verify no intermediate tier-2 flashing (CSS interpolates to final state)

4. **Game Reset (New Game):**
   - Play game to score 100+ (tier-5, near-black background)
   - Return to menu (ESC key)
   - Start new game
   - Verify background returns to tier-0 (#e8e8e8, light grey)
   - Verify console log: "Background reset to tier-0"

5. **No Redundant CSS Updates:**
   - Add console.log to track CSS update frequency
   - Play game, eat 3 foods in same tier (e.g., score 5 → 8 → 11, all tier-0)
   - Verify updateCanvasBackground() called 3 times (event-driven)
   - Verify "Background tier changed" log appears 0 times (tier didn't change)
   - Confirms lastBackground cache working (no redundant CSS writes)

6. **CSS Transition Persistence:**
   - Inspect #game-canvas in DevTools Elements tab
   - Verify `transition: background-color 2000ms ease-in-out` is applied
   - Verify inline style `background-color: rgb(...)` updates on tier changes
   - Verify no style conflicts or overrides

**Edge Cases:**
- Score 0 at game start — background is tier-0 (#e8e8e8)
- Death at high score, consolation bonuses push to next tier — background updates during death sequence
- Phone Pick Up bonus crosses multiple tiers — CSS transitions smoothly to final tier
- Pause game during transition — CSS continues animating (browser native, independent of game loop)

---

### 📚 CRITICAL DATA FORMATS

**Event-driven update pattern:**
```javascript
// CORRECT — check ONLY when score changes
function onFoodEaten(food, gameState) {
  // ... score logic ...
  updateCanvasBackground(gameState);  // Score just changed, check tier
}

// WRONG — check every frame
function update(gameState) {
  updateCanvasBackground(gameState);  // Called 8x/sec at 125ms tick rate!
}

// WRONG — check every render
function render(ctx, gameState) {
  updateCanvasBackground(gameState);  // Called 60x/sec!
}
```

**Cache check pattern:**
```javascript
if (background !== lastBackground) {
  canvas.style.backgroundColor = background;  // CORRECT — update only when tier changes
  lastBackground = background;
}

// WRONG — update every time (even if tier unchanged)
canvas.style.backgroundColor = background;
```

**Reset pattern:**
```javascript
canvas.style.backgroundColor = '#e8e8e8';  // CORRECT — tier-0 default
lastBackground = '#e8e8e8';                // CORRECT — sync cache

canvas.style.backgroundColor = CONFIG.BACKGROUND_PROGRESSION.colors[0];  // OK but verbose
lastBackground = null;  // WRONG — next update will incorrectly trigger (null !== '#e8e8e8')
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/project-context.md` — V4 Event-Driven Border Pattern (line 362, similar pattern)
- `_bmad-output/planning-artifacts/ux-design-retro-graphic-upgrade-technical-addendum.md` — Pattern 1 (Canvas Background Color Management)
- `_bmad-output/planning-artifacts/architecture.md` — Decision 15 (Event-Driven Updates)

**Key Design Principles:**
- **Event-driven, not polling** — tier changes are rare, check only when score changes
- **Cinematic progression** — 2-second fades feel earned, not instant snaps
- **Cache previous state** — avoid redundant CSS updates (performance optimization)
- **Browser-native animation** — CSS handles interpolation, zero JS cost during transition

---

### 📋 FRs COVERED

FR-V3-1 (Progressive Dark Playfield with smooth transitions)

**Detailed FR Mapping:**
- Smooth background transitions → CSS `transition: background-color 2s`
- Score-based triggers → updateCanvasBackground() called on score change events
- Cinematic feel → 2-second duration (not instant, not too slow)
- Event-driven → called in onFoodEaten(), onPhoneCallDismiss(), onDeath() only

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] updateCanvasBackground() function created in game.js
- [ ] lastBackground variable tracks previous tier color
- [ ] updateCanvasBackground() calls progression.getState(score).background
- [ ] Background updated ONLY if different from lastBackground (cache check)
- [ ] canvas.style.backgroundColor set to new background color
- [ ] lastBackground updated to new background color
- [ ] updateCanvasBackground() called in onFoodEaten()
- [ ] updateCanvasBackground() called in onPhoneCallDismiss()
- [ ] updateCanvasBackground() called in onDeath()
- [ ] resetCanvasBackground() function created
- [ ] resetCanvasBackground() sets canvas.style.backgroundColor = '#e8e8e8'
- [ ] resetCanvasBackground() resets lastBackground = '#e8e8e8'
- [ ] resetCanvasBackground() called in initGame()
- [ ] Console logs show tier changes only when crossing thresholds
- [ ] No console logs on every frame (event-driven, not polling)
- [ ] CSS transitions are smooth (2 seconds, no flashing)
- [ ] Rapid tier crossing handled smoothly (combo multiplier test)
- [ ] Game reset returns background to tier-0
- [ ] No redundant CSS updates when tier unchanged (cache working)

**Common Mistakes to Avoid:**
- ❌ Calling updateCanvasBackground() in update() loop (60 checks/sec waste)
- ❌ Not caching lastBackground (causes redundant CSS writes every score change)
- ❌ Forgetting to reset lastBackground on game reset (causes incorrect tier detection)
- ❌ Not calling updateCanvasBackground() in all score change events (phone, death bonuses)
- ❌ Using canvas.classList instead of canvas.style.backgroundColor
- ❌ Manually animating color transition in JS (CSS does it automatically)
- ❌ Checking tier every frame (event-driven only)

---

## Dev Agent Record

### Agent Model Used

_To be filled by Dev agent_

### Debug Log References

_To be filled by Dev agent_

### Completion Notes List

_To be filled by Dev agent_

### File List

- js/game.js (modified - add updateCanvasBackground(), resetCanvasBackground(), event-driven calls)
