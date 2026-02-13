# Story 10.1: Implement Probability-Based Combo Activation

**Epic:** 10 - Combo Mode System
**Story ID:** 10.1
**Status:** 🔴 not started
**Created:** 2026-02-08

---

## Story

**As a** player,
**I want** combo mode to trigger occasionally at high scores,
**So that** I experience peak scoring moments without overwhelming frequency.

## Acceptance Criteria

**Given** my score is between 0-39
**When** I eat food
**Then** combo mode never activates (0% probability)

**Given** my score is between 40-59
**When** I eat food
**Then** combo mode has a 10% chance to activate

**Given** my score is between 60-79
**When** I eat food
**Then** combo mode has a 20% chance to activate

**Given** my score is between 80-99
**When** I eat food
**Then** combo mode has a 30% chance to activate

**Given** my score is between 100-119
**When** I eat food
**Then** combo mode has a 35% chance to activate

**Given** my score is 120 or above
**When** I eat food
**Then** combo mode has a 40% chance to activate (capped)

**Given** combo mode is already active
**When** I eat food during combo
**Then** the combo activation probability check does NOT run
**And** the existing combo continues processing

**Given** combo mode activates
**When** the trigger occurs
**Then** the currently consumed food becomes Effect A
**And** combo.active = true
**And** combo.effectA stores the food type and point value

## Tasks / Subtasks

- [ ] Add getComboProbability(score) to progression.js
  - [ ] Return probability based on score thresholds
  - [ ] 5 tiers: 0% (0-39), 10% (40-59), 20% (60-79), 30% (80-99), 35% (100-119), 40% (120+)
- [ ] Add COMBO_PROBABILITIES to config.js
  - [ ] Array of tier objects: {minScore, maxScore, probability}
- [ ] Add combo state object to state.js
  - [ ] active: boolean (false by default)
  - [ ] effectA: {type, points} (null by default)
  - [ ] effectB: {type, points} (null by default)
  - [ ] canvasColor: string (null by default)
  - [ ] foodCount: number (0 by default)
- [ ] Check combo activation on food consumption in game.js
  - [ ] If !combo.active && score >= 40
  - [ ] Calculate probability = getComboProbability(score)
  - [ ] Roll RNG: Math.random() < probability
  - [ ] If true: activate combo with current food as Effect A
- [ ] Implement activateCombo(food, gameState) in combo.js
  - [ ] Set combo.active = true
  - [ ] Set combo.effectA = {type: food.type, points: food.points}
  - [ ] Set combo.foodCount = 1
  - [ ] Trigger canvas color transition (Story 10.2)
- [ ] Test all 6 tiers
  - [ ] Score 0-39: verify 0% combo (no activations)
  - [ ] Score 40-59: verify ~10% combo rate
  - [ ] Score 60-79: verify ~20% combo rate
  - [ ] Score 80-99: verify ~30% combo rate
  - [ ] Score 100-119: verify ~35% combo rate
  - [ ] Score 120+: verify 40% combo rate (capped)

---

## Developer Context

### 🎯 STORY OBJECTIVE

Implement progressive combo activation probability that scales with score. Combos create peak emotional moments (multiplicative scoring) but must not overwhelm gameplay. No combos until score 40 (mastery phase), then probability increases from 10% to 40% cap. This creates surprise and delight without constant interruption.

**CRITICAL SUCCESS FACTORS:**
- No combos until score 40 (grace period for combo learning)
- Probability scales with score (10% → 40% cap)
- Combo activation check skipped if combo already active
- Current food becomes Effect A when combo activates

---

### 🏗️ ARCHITECTURE COMPLIANCE

**New Modules:**
- `js/combo.js` — Combo state management and activation logic

**Files to Modify:**
- `js/progression.js` — Add getComboProbability(score)
- `js/config.js` — Add COMBO_PROBABILITIES
- `js/state.js` — Add combo state object
- `js/game.js` — Check combo activation on food consumption

**Module Boundaries:**
- `progression.js` owns difficulty scaling logic (pure functions)
- `combo.js` owns combo state machine (activate, deactivate, check active)
- `state.js` owns state structure (combo object)
- `game.js` owns food consumption orchestration (calls combo.js)

**Data Flow:**
```
1. Player eats food
2. game.js: check if combo already active
3. If not active: progression.js: getComboProbability(score) → probability
4. game.js: RNG roll (Math.random() < probability)
5. If true: combo.js: activateCombo(food, gameState)
6. combo.js: set combo.active = true, effectA = {type, points}, foodCount = 1
7. Story 10.2: trigger canvas color transition
```

---

### 📦 CONFIG.JS UPDATES

Add combo probability tiers:

```javascript
export const CONFIG = {
  // ... existing config ...

  // Combo Mode System (v2 - Epic 10)
  COMBO_PROBABILITIES: [
    { minScore: 0,   maxScore: 39,  probability: 0.0 },   // No combos (learning phase)
    { minScore: 40,  maxScore: 59,  probability: 0.1 },   // 10%
    { minScore: 60,  maxScore: 79,  probability: 0.2 },   // 20%
    { minScore: 80,  maxScore: 99,  probability: 0.3 },   // 30%
    { minScore: 100, maxScore: 119, probability: 0.35 },  // 35%
    { minScore: 120, maxScore: Infinity, probability: 0.4 } // 40% (cap)
  ]
};
```

---

### 🎨 IMPLEMENTATION DETAILS

**1. progression.js — Add getComboProbability():**

```javascript
import { CONFIG } from './config.js';

/**
 * Calculate combo activation probability based on current score.
 * @param {number} score - Current game score
 * @returns {number} Probability (0.0 to 0.4) that combo should activate
 */
export function getComboProbability(score) {
  for (const tier of CONFIG.COMBO_PROBABILITIES) {
    if (score >= tier.minScore && score <= tier.maxScore) {
      return tier.probability;
    }
  }

  // Fallback: return max probability
  return 0.4;
}
```

**2. state.js — Add combo state object:**

```javascript
export function createInitialState() {
  return {
    // ... existing state ...

    // Combo Mode (v2 - Epic 10)
    combo: {
      active: false,            // Is combo mode currently active?
      effectA: null,            // First food effect: {type, points}
      effectB: null,            // Second food effect: {type, points}
      canvasColor: null,        // Dark background color during combo
      foodCount: 0              // Foods eaten during combo (1, 2, or 3)
    }
  };
}

export function resetGameState(state) {
  state.combo.active = false;
  state.combo.effectA = null;
  state.combo.effectB = null;
  state.combo.canvasColor = null;
  state.combo.foodCount = 0;
  // ... reset other state ...
}
```

**3. combo.js — Implement activateCombo():**

```javascript
import { CONFIG } from './config.js';

/**
 * Activate combo mode with the given food as Effect A.
 * @param {object} food - The food that triggered combo
 * @param {object} gameState - Game state
 */
export function activateCombo(food, gameState) {
  // Set combo active
  gameState.combo.active = true;

  // Store Effect A (current food)
  gameState.combo.effectA = {
    type: food.type,
    points: getFoodPoints(food.type)
  };

  // Reset food count (this is food #1)
  gameState.combo.foodCount = 1;

  // Select random canvas color (Story 10.2)
  const colors = CONFIG.COMBO_CANVAS_COLORS;
  gameState.combo.canvasColor = colors[Math.floor(Math.random() * colors.length)];

  // Trigger canvas color transition (Story 10.2)
  const canvas = document.getElementById('game-canvas');
  canvas.style.transition = 'background-color 500ms ease-in-out';
  canvas.style.backgroundColor = gameState.combo.canvasColor;

  console.log(`Combo activated! Effect A: ${food.type} (+${gameState.combo.effectA.points})`);
}

/**
 * Check if combo mode is currently active.
 * @param {object} gameState - Game state
 * @returns {boolean} True if combo active
 */
export function isComboActive(gameState) {
  return gameState.combo.active;
}

function getFoodPoints(foodType) {
  // Use Fibonacci scoring from Epic 7
  const points = {
    growing: 1,
    speedDecrease: 2,
    wallPhase: 1, // Base value (bonus handled separately)
    speedBoost: 5,
    reverseControls: 8,
    invincibility: 0
  };
  return points[foodType] || 0;
}
```

**4. game.js — Check combo activation on food consumption:**

```javascript
import { getComboProbability } from './progression.js';
import { activateCombo, isComboActive } from './combo.js';

function onFoodEaten(food, gameState) {
  // Award base food score
  const baseScore = getFoodScore(food.type);
  gameState.score += baseScore;

  // Apply food effect
  applyFoodEffect(food.type, gameState);

  // Check combo activation (only if combo not already active)
  if (!isComboActive(gameState) && gameState.score >= 40) {
    const comboProbability = getComboProbability(gameState.score);

    if (Math.random() < comboProbability) {
      // Activate combo with current food as Effect A
      activateCombo(food, gameState);
    }
  }

  // If combo is active, handle combo food progression (Story 10.4, 10.5)
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

1. **No Combos Until Score 40:**
   - Start new game
   - Eat 39 foods (score 0-39)
   - Verify NO combo ever activates

2. **Combo Probability at Score 40-59 (10%):**
   - Reach score 40
   - Eat 30 foods, track combo activations
   - Verify approximately 3 combos activate (~10%)

3. **Combo Probability at Score 60-79 (20%):**
   - Reach score 60
   - Eat 30 foods, track combo activations
   - Verify approximately 6 combos activate (~20%)

4. **Combo Probability at Score 80-99 (30%):**
   - Reach score 80
   - Eat 30 foods, track combo activations
   - Verify approximately 9 combos activate (~30%)

5. **Combo Probability at Score 100-119 (35%):**
   - Reach score 100
   - Eat 30 foods, track combo activations
   - Verify approximately 10-11 combos activate (~35%)

6. **Combo Probability at Score 120+ (40% cap):**
   - Reach score 120
   - Eat 30 foods, track combo activations
   - Verify approximately 12 combos activate (~40%)
   - Reach score 200
   - Verify probability still 40% (cap holds)

7. **No Double Activation:**
   - Reach score 50
   - Trigger combo (Effect A assigned)
   - Eat second food during combo
   - Verify combo does NOT re-activate (Effect A unchanged)

8. **Effect A Stored Correctly:**
   - Trigger combo with Speed Boost food
   - Check gameState.combo.effectA
   - Verify type = 'speedBoost', points = 5

**Edge Cases:**
- Combo triggers on exactly score 40 (first eligible food)
- Combo triggers on exactly score 120 (cap tier starts)
- Multiple combos in a row (activate, complete, activate again)
- Score jumps from 38 to 42 (skips score 40) — combo can still trigger

---

### 📚 CRITICAL DATA FORMATS

**Probability as decimal:**
```javascript
const probability = 0.1;           // CORRECT (10%)
const probability = 10;            // WRONG (use decimal)
```

**RNG comparison:**
```javascript
if (Math.random() < probability) { }  // CORRECT
if (Math.random() > probability) { }  // WRONG (inverted)
```

**Effect A structure:**
```javascript
combo.effectA = {
  type: 'speedBoost',    // Food type (string)
  points: 5              // Food point value (integer)
}
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/game-ux-principles.md` — Flow theory, peak moments design
- `_bmad-output/planning-artifacts/prd.md` — FR40-FR41 (combo activation requirements)

**Key Design Principles:**
- **Progressive frequency:** Combo rate scales with skill (Flow Theory)
- **Peak moments:** Combos are rare enough to feel special (not overwhelming)
- **Score-based gating:** No combos until score 40 (mastery phase)
- **Cap at 40%:** Prevents combos from dominating gameplay (max 4 in 10 foods)

---

### 📋 FRs COVERED

FR40-FR41 (Combo activation probability)

**Detailed FR Mapping:**
- FR40: Combo activates at score 40+ with progressive probability → getComboProbability()
- FR41: Current food becomes Effect A → activateCombo() stores food type and points

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] getComboProbability(score) added to progression.js
- [ ] CONFIG.COMBO_PROBABILITIES defined with 6 tiers
- [ ] combo state object added to state.js
- [ ] combo.active, effectA, effectB, canvasColor, foodCount fields exist
- [ ] activateCombo(food, gameState) implemented in combo.js
- [ ] isComboActive(gameState) implemented
- [ ] game.js checks combo activation on food consumption
- [ ] Combo activation skipped if combo already active
- [ ] Combo activation skipped if score < 40
- [ ] RNG comparison: Math.random() < probability
- [ ] effectA stores {type, points} correctly
- [ ] foodCount set to 1 on activation
- [ ] Score 0-39: 0% combo (verified with 30+ foods)
- [ ] Score 40-59: ~10% combo (verified with 30+ foods)
- [ ] Score 60-79: ~20% combo (verified with 30+ foods)
- [ ] Score 80-99: ~30% combo (verified with 30+ foods)
- [ ] Score 100-119: ~35% combo (verified with 30+ foods)
- [ ] Score 120+: 40% combo CAPPED (verified with 30+ foods)
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (score 40, score 120, multiple combos)

**Common Mistakes to Avoid:**
- ❌ Using percentage values instead of decimals (0.1, not 10)
- ❌ Inverted RNG logic (Math.random() > probability instead of <)
- ❌ Combo activates before score 40 (grace period violated)
- ❌ Combo probability exceeds 40% at high scores (cap violated)
- ❌ Double activation during active combo (check not working)
- ❌ Effect A not storing food points (only type)

---

## Dev Agent Record

### Agent Model Used

_To be filled by implementing agent_

### Debug Log References

_To be filled during implementation_

### Completion Notes List

_To be filled on completion_

### File List

- js/progression.js (modified - add getComboProbability)
- js/config.js (modified - add COMBO_PROBABILITIES)
- js/state.js (modified - add combo state object)
- js/combo.js (new - combo state management and activation)
- js/game.js (modified - check combo activation on food consumption)
