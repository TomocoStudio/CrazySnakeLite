# Story 20.5: Create Event-Driven Border State Foundation

**Epic:** 20 - Progressive Arcade Transformation (Neon Noir)
**Story ID:** 20.5
**Status:** 🔴 NOT STARTED
**Created:** 2026-02-16
**Completed:** —

---

## Story

**As a** developer preparing for Epic 21's reactive border,
**I want** an event-driven border state management system,
**So that** border color updates happen only when game events occur, not via per-frame polling.

---

## Acceptance Criteria

**Given** the border will react to 7 different game states (death, phone ring, phone pickup, combo, reverse controls, invincibility, default)
**When** creating the border state foundation
**Then** a border state manager tracks current border state via priority cascade

**And** game events (death, phone show/dismiss, combo start/exit, effect activation/clear) trigger state updates
**And** border state updates are event-driven (NOT checked 60 times per second)
**And** border color is applied via CSS border-color property on canvas element
**And** state priority cascade is defined: death > phone ring > phone pickup > combo > reverse controls > invincibility > default

**Given** multiple simultaneous states (e.g., combo active + phone ringing)
**When** border state is resolved
**Then** highest priority state wins (phone gold overrides combo purple)

---

## Tasks / Subtasks

- [ ] Define BORDER_COLORS in config.js
  - [ ] 7 border colors for 7 states (death red, phone gold/green, combo dynamic, RC orange, invincibility yellow, default purple)
- [ ] Create updateBorderState() in game.js
  - [ ] Implement priority cascade (death > phone > combo > effects > default)
  - [ ] Set canvas.style.borderColor based on current game state
  - [ ] Handle special cases (death flash 500ms, combo dynamic color)
- [ ] Add event-driven calls to updateBorderState()
  - [ ] Call in onDeath() (death flash)
  - [ ] Call in phone.show() and phone.dismiss() (phone states)
  - [ ] Call in combo.activate() and combo.exit() (combo state)
  - [ ] Call in effects.applyEffect() and effects.clearEffect() (effect states)
- [ ] Add CSS border transition to #game-canvas
  - [ ] transition: border-color 300ms ease-in-out
  - [ ] Faster than background (300ms vs 2000ms)
- [ ] Test priority cascade
  - [ ] Trigger overlapping states, verify highest priority wins
  - [ ] Test all 7 border states individually

---

## Developer Context

### 🎯 STORY OBJECTIVE

Create the foundation for Epic 21's 7-state reactive border system. This story implements the priority cascade and event-driven architecture, preparing for full border visual implementation in Story 21.4. Border color communicates game state at a glance: gold phone = decision point, red = death, purple combo = multiplier active.

**CRITICAL SUCCESS FACTORS:**
- 7 border states with clear priority cascade (death highest, default lowest)
- Event-driven updates (triggered by game events, not polled every frame)
- CSS border-color with 300ms transition (faster than background)
- Priority cascade handles overlapping states correctly (highest wins)
- Foundation ready for Epic 21 enhancements (pulse, glow, width changes)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/config.js` — Add BORDER_COLORS section
- `js/game.js` — Add updateBorderState() function, event-driven calls
- `css/style.css` — Add border-color transition to #game-canvas

**Module Boundaries:**
- `config.js` owns border color data
- `game.js` orchestrates border state updates (priority cascade logic)
- CSS handles border rendering and transitions

**Data Flow:**
```
1. Game event occurs (death, phone show, combo activate, effect apply)
2. game.js: updateBorderState(gameState) called
3. game.js: priority cascade evaluates current state (death > phone > combo > effects > default)
4. game.js: canvas.style.borderColor = color (highest priority state)
5. CSS: transition animates border color change over 300ms
```

---

### 📦 CONFIG.JS UPDATES

**Add new section:**

```javascript
// V4: Reactive Border System (Epic 20 foundation, Epic 21 full implementation)
BORDER_COLORS: {
  death: '#FF0000',           // Red (500ms flash, highest priority)
  phoneRing: '#FFD700',       // Gold (decision point, 2nd priority)
  phonePickup: '#28a745',     // Green (committed, 3rd priority)
  combo: null,                // Dynamic (set from gameState.combo.canvasColor, 4th priority)
  reverseControls: '#FFA500', // Orange (5th priority)
  invincibility: '#FFFF00',   // Yellow (6th priority)
  default: '#9D4EDD'          // Purple (lowest priority, base state)
},

BORDER_DEATH_FLASH_DURATION: 500,  // Death flash duration (ms)
```

---

### 🎨 IMPLEMENTATION DETAILS

**1. config.js — Add BORDER_COLORS section:**

```javascript
// js/config.js
export const CONFIG = {
  // ... existing config ...

  // V4: Reactive Border System
  BORDER_COLORS: {
    death: '#FF0000',
    phoneRing: '#FFD700',
    phonePickup: '#28a745',
    combo: null,  // Dynamic from gameState.combo.canvasColor
    reverseControls: '#FFA500',
    invincibility: '#FFFF00',
    default: '#9D4EDD'
  },

  BORDER_DEATH_FLASH_DURATION: 500,
};
```

**2. game.js — Implement updateBorderState():**

```javascript
// js/game.js
import { CONFIG } from './config.js';

let deathFlashActive = false;  // Track death flash state

function updateBorderState(gameState) {
  const canvas = document.getElementById('game-canvas');

  // Priority cascade (highest to lowest)

  // 1. Death flash (500ms, highest priority)
  if (deathFlashActive) {
    canvas.style.borderColor = CONFIG.BORDER_COLORS.death;
    return;
  }

  // 2. Phone ring (gold, decision point)
  if (gameState.phoneCall.active && !gameState.phoneCall.pickedUp) {
    canvas.style.borderColor = CONFIG.BORDER_COLORS.phoneRing;
    return;
  }

  // 3. Phone pickup (green, committed)
  if (gameState.phoneCall.pickedUp && gameState.phoneCall.pickUpEndTime > Date.now()) {
    canvas.style.borderColor = CONFIG.BORDER_COLORS.phonePickup;
    return;
  }

  // 4. Combo (dynamic color from combo system)
  if (gameState.combo.active && !gameState.combo.paused) {
    canvas.style.borderColor = gameState.combo.canvasColor;  // Dynamic (#4A148C, #0D47A1, #B71C1C, #1B5E20)
    return;
  }

  // 5. Reverse Controls (orange)
  if (gameState.effects.reverseControlsActive) {
    canvas.style.borderColor = CONFIG.BORDER_COLORS.reverseControls;
    return;
  }

  // 6. Invincibility (yellow)
  if (gameState.activeEffect?.type === 'invincibility') {
    canvas.style.borderColor = CONFIG.BORDER_COLORS.invincibility;
    return;
  }

  // 7. Default (purple)
  canvas.style.borderColor = CONFIG.BORDER_COLORS.default;
}
```

**3. game.js — Add event-driven calls:**

```javascript
// Call in onDeath() (death flash)
function onDeath(gameState) {
  // Trigger death flash (500ms)
  deathFlashActive = true;
  updateBorderState(gameState);

  setTimeout(() => {
    deathFlashActive = false;
    updateBorderState(gameState);  // Re-evaluate after flash
  }, CONFIG.BORDER_DEATH_FLASH_DURATION);

  // ... rest of death logic ...
}

// Call in phone.show() (phone ring state)
// Modify phone.js to call game.updateBorderState() after showing overlay
// OR: Add callback in game.js after phone.show()
function onPhoneCallShow(gameState) {
  phone.show(gameState);
  updateBorderState(gameState);  // Border → gold
}

// Call in phone.dismiss() (clear phone state)
function onPhoneCallDismiss(action, gameState) {
  // ... existing phone dismiss logic ...
  updateBorderState(gameState);  // Border → next priority (combo/effects/default)
}

// Call in combo.activate() (combo state)
function onComboActivate(gameState) {
  combo.activate(gameState);
  updateBorderState(gameState);  // Border → combo color
}

// Call in combo.exit() (clear combo state)
function onComboExit(gameState) {
  combo.exit(gameState);
  updateBorderState(gameState);  // Border → next priority (effects/default)
}

// Call in effects.applyEffect() (effect state)
function onFoodEaten(food, gameState) {
  // ... existing food logic ...

  // If food has effect, apply it
  if (food.type !== 'growing') {
    effects.applyEffect(gameState, food.type);
    updateBorderState(gameState);  // Border → effect color
  }

  // ... rest of food logic ...
}

// Call in effects.clearEffect() (clear effect state)
// Effects clear when next food eaten, so updateBorderState() already called in onFoodEaten()
```

**4. style.css — Add border-color transition:**

```css
/* css/style.css */
#game-canvas {
  background-color: #e8e8e8;
  border: 6px solid #9D4EDD;  /* Default purple */

  /* V4: Smooth transitions */
  transition:
    background-color 2000ms ease-in-out,  /* Slow background fade */
    border-color 300ms ease-in-out;       /* Fast border snap */
}
```

**Why 300ms border transition vs 2000ms background?**
- Border communicates state (phone, combo, effects) — needs to be noticed quickly
- Background creates atmosphere — slow fade enhances cinematic feel
- 300ms is fast enough to feel responsive but slow enough to avoid jarring snaps

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Default Border (Purple):**
   - Start new game
   - Verify canvas border is purple (#9D4EDD)
   - Play without triggering any events (just eat growing food)
   - Border stays purple

2. **Death Flash (Red, 500ms):**
   - Die (hit wall or self)
   - Verify border flashes red (#FF0000)
   - Verify flash lasts ~500ms
   - Verify border returns to default purple after flash

3. **Phone Ring (Gold):**
   - Wait for phone call to appear
   - Verify border turns gold (#FFD700) when overlay shows
   - Verify border transitions in 300ms (smooth but quick)

4. **Phone Pickup (Green):**
   - Answer phone call (Enter key or Pick Up button)
   - Verify border turns green (#28a745) during blur timer
   - Verify border returns to default after timer expires

5. **Combo (Dynamic Color):**
   - Activate combo mode (eat Effect A, triggers combo)
   - Verify border matches combo canvas color (purple, blue, red, or green)
   - Combo color is dynamic from gameState.combo.canvasColor

6. **Reverse Controls (Orange):**
   - Eat Reverse Controls food (orange X)
   - Verify border turns orange (#FFA500)
   - Verify border returns to default after eating next food

7. **Invincibility (Yellow):**
   - Eat Invincibility food (yellow star)
   - Verify border turns yellow (#FFFF00)
   - Verify border returns to default after eating next food

8. **Priority Cascade (Overlapping States):**
   - Trigger combo (border → purple combo color)
   - Phone call appears (border → gold, overrides combo)
   - Answer phone (border → green, overrides combo)
   - Phone timer expires (border → purple combo color again, combo still active)
   - Eat food (exit combo, border → default purple)

9. **CSS Transition Smoothness:**
   - Trigger border state changes
   - Verify all transitions take ~300ms (smooth, not instant)
   - Verify no flashing or intermediate colors

**Edge Cases:**
- Death during phone call — death flash (red) overrides phone (gold)
- Death during combo — death flash (red) overrides combo (dynamic)
- Phone call during Reverse Controls — phone (gold) overrides RC (orange)
- Multiple effects sequentially — border updates each time

---

### 📚 CRITICAL DATA FORMATS

**Priority cascade order (MUST follow exactly):**
```javascript
// CORRECT order (highest to lowest priority)
1. Death flash (red, 500ms)
2. Phone ring (gold)
3. Phone pickup (green)
4. Combo (dynamic)
5. Reverse Controls (orange)
6. Invincibility (yellow)
7. Default (purple)

// WRONG — different order breaks priority logic
```

**Event-driven pattern:**
```javascript
// CORRECT — call ONLY when state changes
function onPhoneCallShow(gameState) {
  updateBorderState(gameState);  // State just changed
}

// WRONG — call every frame
function update(gameState) {
  updateBorderState(gameState);  // Called 8x/sec, wasteful!
}
```

**Death flash timing:**
```javascript
deathFlashActive = true;
updateBorderState(gameState);  // Border → red

setTimeout(() => {
  deathFlashActive = false;
  updateBorderState(gameState);  // Re-evaluate priority
}, 500);  // CORRECT duration

// WRONG — forgetting to re-evaluate after flash
setTimeout(() => {
  deathFlashActive = false;
  // Missing updateBorderState() call — border stays red!
}, 500);
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/ux-design-retro-graphic-upgrade-technical-addendum.md` — Pattern 2 (Border State Orchestration)
- `_bmad-output/planning-artifacts/project-context.md` — V4 Border State Pattern (line 362)
- `_bmad-output/planning-artifacts/architecture.md` — Decision 15 (Event-Driven Updates)

**Key Design Principles:**
- **Event-driven, not polling** — border updates only when game state changes
- **Priority cascade** — highest priority state wins when multiple states active
- **Fast transitions** — 300ms border snaps feel responsive (vs 2000ms background fades)
- **Foundation for Epic 21** — this story sets up infrastructure, Epic 21 adds pulse/glow/width

---

### 📋 FRs COVERED

FR-V3-12 (Event-Driven Border Foundation)

**Detailed FR Mapping:**
- 7 border states → BORDER_COLORS config + priority cascade in updateBorderState()
- Event-driven updates → called on death, phone, combo, effect events only
- Priority cascade → highest priority state wins (death > phone > combo > effects > default)
- CSS transitions → border-color 300ms ease-in-out

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] config.js contains BORDER_COLORS object with 7 states
- [ ] BORDER_COLORS.death = '#FF0000' (red)
- [ ] BORDER_COLORS.phoneRing = '#FFD700' (gold)
- [ ] BORDER_COLORS.phonePickup = '#28a745' (green)
- [ ] BORDER_COLORS.combo = null (dynamic from gameState)
- [ ] BORDER_COLORS.reverseControls = '#FFA500' (orange)
- [ ] BORDER_COLORS.invincibility = '#FFFF00' (yellow)
- [ ] BORDER_COLORS.default = '#9D4EDD' (purple)
- [ ] CONFIG.BORDER_DEATH_FLASH_DURATION = 500
- [ ] game.js updateBorderState() function created
- [ ] Priority cascade implemented (death > phone > combo > effects > default)
- [ ] deathFlashActive boolean tracks death flash state
- [ ] Death flash auto-clears after 500ms
- [ ] updateBorderState() re-evaluated after death flash ends
- [ ] updateBorderState() called in onDeath()
- [ ] updateBorderState() called in onPhoneCallShow()
- [ ] updateBorderState() called in onPhoneCallDismiss()
- [ ] updateBorderState() called in onComboActivate()
- [ ] updateBorderState() called in onComboExit()
- [ ] updateBorderState() called in effects.applyEffect()
- [ ] CSS #game-canvas includes border-color transition (300ms)
- [ ] All 7 border states tested individually
- [ ] Priority cascade tested with overlapping states
- [ ] Border transitions are smooth (300ms, no instant snaps)

**Common Mistakes to Avoid:**
- ❌ Wrong priority order (e.g., combo > phone, should be phone > combo)
- ❌ Calling updateBorderState() every frame (event-driven only)
- ❌ Forgetting to re-evaluate border after death flash ends
- ❌ Using canvas.classList instead of canvas.style.borderColor
- ❌ Not handling combo dynamic color (should use gameState.combo.canvasColor)
- ❌ Border transition too slow (should be 300ms, not 2000ms like background)
- ❌ Not testing priority cascade (overlapping states)

---

## Dev Agent Record

### Agent Model Used

_To be filled by Dev agent_

### Debug Log References

_To be filled by Dev agent_

### Completion Notes List

_To be filled by Dev agent_

### File List

- js/config.js (modified - add BORDER_COLORS and BORDER_DEATH_FLASH_DURATION)
- js/game.js (modified - add updateBorderState(), event-driven calls)
- css/style.css (modified - add border-color transition to #game-canvas)
