# Story 10.5: Implement Third Food Exits Combo

**Epic:** 10 - Combo Mode System
**Story ID:** 10.5
**Status:** 🔴 not started
**Created:** 2026-02-08

---

## Story

**As a** player,
**I want** combo mode to end after eating a third food,
**So that** I return to normal gameplay and can potentially trigger a new combo.

## Acceptance Criteria

**Given** combo mode is active with Effect B consumed
**When** I eat a third food
**Then** combo mode exits:
- combo.active = false
- Canvas transitions back to light grey (500ms)
- Snake reverts to single-color rendering
- Combo state clears: effectA = null, effectB = null, canvasColor = null

**Given** combo mode exits
**When** the exit triggers
**Then** a descending "deflation" audio cue plays (300ms)
**And** the audio signals return to normal mode

**Given** I die during combo mode (before third food)
**When** death triggers
**Then** combo mode does NOT naturally exit
**And** the game over screen shows the combo state (for analytics)

**Given** combo exits and I'm at score 50
**When** I eat the next food after combo
**Then** a new combo has a 20% chance to trigger (normal probability check)

## Tasks / Subtasks

- [ ] Track combo.foodCount in state.js (done in Story 10.1)
  - [ ] Increments to 1 (Effect A), 2 (Effect B), 3 (exit)
- [ ] Implement exitCombo() in combo.js (done in Story 10.2)
  - [ ] Transition canvas back to #E8E8E8 (500ms)
  - [ ] Reset combo.active = false
  - [ ] Clear effectA, effectB, canvasColor, foodCount
- [ ] Call exitCombo() when third food eaten
  - [ ] In handleComboFoodProgression(): if foodCount === 2 → exitCombo()
- [ ] Add playComboExit() audio cue
  - [ ] Descending "deflation" tone (300ms)
  - [ ] Signals return to normal mode
- [ ] Test combo exit on third food
  - [ ] Activate combo (Effect A)
  - [ ] Eat second food (Effect B)
  - [ ] Eat third food
  - [ ] Verify combo exits (canvas light grey, snake single-color)
- [ ] Test new combo can trigger after exit
  - [ ] Exit combo at score 50
  - [ ] Eat next food
  - [ ] Verify 20% chance to trigger new combo
- [ ] Test death during combo does NOT exit combo
  - [ ] Activate combo (Effect B consumed)
  - [ ] Die (hit wall)
  - [ ] Verify combo.active still true (for analytics)

---

## Developer Context

### 🎯 STORY OBJECTIVE

Exit combo mode after the third food to return to normal gameplay. This creates a clear combo lifecycle: activate (Effect A) → multiply (Effect B) → exit (third food). The deflation audio cue signals the end of the special state. Death during combo does NOT naturally exit (combo state preserved for analytics).

**CRITICAL SUCCESS FACTORS:**
- Third food triggers exit (foodCount = 3)
- Canvas transitions back to light grey (500ms smooth fade)
- Snake reverts to single-color rendering
- Audio cue plays on exit (deflation tone)
- New combo can trigger immediately after exit

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/combo.js` — exitCombo() already implemented in Story 10.2
- `js/game.js` — Call exitCombo() when third food eaten
- `js/audio.js` — Add playComboExit() function

**Module Boundaries:**
- `combo.js` owns combo state transitions (activate, exit)
- `game.js` owns food consumption orchestration (calls exitCombo)
- `audio.js` owns audio playback

**Data Flow:**
```
1. Combo active with Effect B consumed (foodCount = 2)
2. Player eats third food
3. game.js: handleComboFoodProgression() → foodCount = 3
4. game.js: call exitCombo(gameState)
5. combo.js: transition canvas to #E8E8E8 (500ms)
6. combo.js: reset all combo state fields
7. audio.js: playComboExit() (300ms deflation)
8. Snake rendering: reverts to single-color (no striping)
9. Next food eaten: combo activation check runs normally
```

---

### 📦 CONFIG.JS UPDATES

No config changes needed.

---

### 🎨 IMPLEMENTATION DETAILS

**1. game.js — Call exitCombo() on third food:**

```javascript
import { exitCombo } from './combo.js';
import { playComboExit } from './audio.js';

function handleComboFoodProgression(food, gameState) {
  if (gameState.combo.foodCount === 1) {
    // Second food → set Effect B (Story 10.4)
    gameState.combo.effectB = {
      type: food.type,
      points: getFoodPoints(food.type)
    };
    gameState.combo.foodCount = 2;

    // Award combo score (A × B)
    // ... (Story 10.4 logic)
  } else if (gameState.combo.foodCount === 2) {
    // Third food → exit combo
    gameState.combo.foodCount = 3; // Mark as exited

    // Exit combo mode
    exitCombo(gameState);

    // Play exit audio
    playComboExit();

    console.log('Combo exited after third food.');
  }
}
```

**2. combo.js — exitCombo() (already implemented in Story 10.2):**

```javascript
import { CONFIG } from './config.js';

export function exitCombo(gameState) {
  // Transition canvas back to default color
  const canvas = document.getElementById('game-canvas');
  canvas.style.transition = 'background-color 500ms ease-in-out';
  canvas.style.backgroundColor = CONFIG.DEFAULT_CANVAS_COLOR;

  // Reset combo state
  gameState.combo.active = false;
  gameState.combo.effectA = null;
  gameState.combo.effectB = null;
  gameState.combo.canvasColor = null;
  gameState.combo.foodCount = 0;

  console.log('Combo exited. Canvas returned to default color.');
}
```

**3. audio.js — Add playComboExit():**

```javascript
/**
 * Play combo exit deflation audio (300ms descending tone).
 * Signals return to normal mode.
 */
export function playComboExit() {
  if (!CONFIG.AUDIO_ENABLED) return;

  console.log('📉 COMBO EXIT AUDIO: 300ms deflation');
  // TODO: AudioContext synthesis — descending tone from high to low frequency
  // Example: oscillate from 800Hz to 200Hz over 300ms with exponential decay
}
```

**4. game.js — Ensure death does NOT exit combo:**

```javascript
function onDeath(gameState) {
  // Do NOT call exitCombo() on death
  // Combo state preserved for analytics

  if (gameState.combo.active) {
    console.log('Player died during combo. Combo state preserved for analytics.');
    // analyticsState will capture combo.active = true in death event
  }

  // ... rest of death logic ...
}
```

**5. game.js — New combo can trigger after exit:**

```javascript
function onFoodEaten(food, gameState) {
  // Award base food score
  const baseScore = getFoodScore(food.type);
  gameState.score += baseScore;

  // Apply food effect
  applyFoodEffect(food.type, gameState);

  // Check combo activation (works normally after combo exit)
  if (!isComboActive(gameState) && gameState.score >= 40) {
    const comboProbability = getComboProbability(gameState.score);

    if (Math.random() < comboProbability) {
      activateCombo(food, gameState);
    }
  }

  // If combo active, handle progression
  if (isComboActive(gameState)) {
    handleComboFoodProgression(food, gameState);
  }

  // Spawn new food
  spawnFood(gameState);
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Combo Exits on Third Food:**
   - Activate combo (Effect A)
   - Eat second food (Effect B, striped snake)
   - Eat third food
   - Verify combo exits:
     - combo.active = false
     - Canvas fades back to light grey (#E8E8E8, 500ms)
     - Snake reverts to single-color rendering (no stripes)
     - effectA, effectB, canvasColor all null

2. **Exit Audio Plays:**
   - Exit combo (eat third food)
   - Verify deflation audio plays (300ms descending tone)
   - Verify audio signals "end of special state"

3. **New Combo Can Trigger After Exit:**
   - Exit combo at score 50 (20% combo probability)
   - Eat next food (after exit)
   - Repeat 10 times, track how many combos trigger
   - Verify approximately 2 combos activate (~20%)

4. **Death During Combo Does NOT Exit:**
   - Activate combo (Effect B consumed)
   - Deliberately die (hit wall)
   - Check gameState.combo.active
   - Verify combo.active still true (not exited)
   - Verify effectA, effectB, canvasColor still populated

5. **Canvas Transition Smoothness:**
   - Exit combo
   - Observe canvas background
   - Verify smooth 500ms fade (not instant)

6. **Snake Single-Color After Exit:**
   - Exit combo (striped snake)
   - Verify snake immediately reverts to single-color rendering
   - Verify color reflects most recent food effect

**Edge Cases:**
- Eat third food immediately after Effect B (rapid exit)
- Combo exits then new combo triggers on very next food (back-to-back)
- Pause game during combo, resume, then eat third food (exit works)

---

### 📚 CRITICAL DATA FORMATS

**foodCount progression:**
```javascript
foodCount = 1;  // Effect A consumed
foodCount = 2;  // Effect B consumed
foodCount = 3;  // Third food eaten (exit trigger)
foodCount = 0;  // After exit (reset)
```

**Exit check:**
```javascript
if (gameState.combo.foodCount === 2) { exitCombo(); }  // CORRECT (third food)
if (gameState.combo.foodCount === 3) { exitCombo(); }  // WRONG (too late, already exited)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/game-ux-principles.md` — State transitions, audio feedback
- `_bmad-output/planning-artifacts/prd.md` — FR46 (third food exits combo)

**Key Design Principles:**
- **Clear lifecycle:** Activate → Multiply → Exit (3-step progression)
- **Audio reinforcement:** Deflation tone signals end of special state
- **Immediate reactivation:** New combo can trigger on very next food
- **Analytics preservation:** Death does not exit combo (state preserved)

---

### 📋 FRs COVERED

FR46 (Third food exits combo mode)

**Detailed FR Mapping:**
- FR46: Third food eaten exits combo mode → handleComboFoodProgression() calls exitCombo()

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] handleComboFoodProgression() checks foodCount === 2
- [ ] Third food triggers exitCombo(gameState)
- [ ] exitCombo() transitions canvas to #E8E8E8 (500ms)
- [ ] exitCombo() sets combo.active = false
- [ ] exitCombo() clears effectA, effectB, canvasColor
- [ ] exitCombo() resets foodCount = 0
- [ ] playComboExit() audio implemented (300ms deflation)
- [ ] Audio plays when combo exits
- [ ] Snake reverts to single-color rendering on exit
- [ ] New combo can trigger immediately after exit
- [ ] Death during combo does NOT call exitCombo()
- [ ] combo.active remains true on death (for analytics)
- [ ] Canvas transition is smooth (500ms fade)
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (rapid exit, back-to-back combos, pause)

**Common Mistakes to Avoid:**
- ❌ Exiting on foodCount === 3 instead of === 2 (off-by-one)
- ❌ Instant canvas color change (not smooth transition)
- ❌ Not playing exit audio (missing feedback)
- ❌ Exiting combo on death (breaks analytics)
- ❌ Preventing new combo from triggering after exit

---

## Dev Agent Record

### Agent Model Used

_To be filled by implementing agent_

### Debug Log References

_To be filled during implementation_

### Completion Notes List

_To be filled on completion_

### File List

- js/game.js (modified - call exitCombo on third food, handle death without exiting)
- js/combo.js (already modified in Story 10.2 - exitCombo implementation)
- js/audio.js (modified - add playComboExit)
