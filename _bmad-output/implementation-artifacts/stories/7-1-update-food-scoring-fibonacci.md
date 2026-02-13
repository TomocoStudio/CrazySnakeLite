# Story 7.1: Update Food Scoring to Fibonacci Values

**Epic:** 7 - Fibonacci Scoring & Visual Feedback System
**Story ID:** 7.1
**Status:** ✅ review
**Created:** 2026-02-08

---

## Story

**As a** player,
**I want** food to reward points proportional to their difficulty,
**So that** I feel appropriately rewarded for challenging choices.

## Acceptance Criteria

**Given** the game is running
**When** I eat any food type
**Then** the score increases by its Fibonacci value:
- Growing (green): +1 point
- Speed Decrease (cyan): +2 points
- Wall Phase (purple): +1 point default, +3 points if wall interaction occurs
- Speed Boost (red): +5 points
- Reverse Controls (orange): +8 points
- Invincibility (yellow): 0 points

**Given** I eat a Wall Phase food
**When** I pass through a wall boundary while the effect is active
**Then** I receive +3 points (Wall Phase bonus)
**And** if I don't interact with a wall before eating the next food, I only received +1 point

## Tasks / Subtasks

- [x] Update CONFIG.SCORING with Fibonacci values
  - [x] FOOD_SCORES: {growing: 1, speedDecrease: 2, wallPhase: 1, speedBoost: 5, reverseControls: 8, invincibility: 0}
  - [x] WALL_PHASE_BONUS: 2 (additional bonus, total +3)
- [x] Implement wallPhaseUsed flag in effects.js
  - [x] Add wallPhaseUsed boolean to effects state
  - [x] Set to false when Wall Phase activates
  - [x] Set to true when snake crosses wall boundary during Wall Phase
  - [x] Reset to false when Wall Phase effect ends
- [x] Update scoring.js to check wallPhaseUsed for conditional scoring
  - [x] Default: award +1 on Wall Phase consumption
  - [x] If wallPhaseUsed detected before next food: award additional +2 points
  - [x] Track wall crossing in snake.js (not collision.js)
- [x] Test all 6 food types award correct points
- [x] Test Wall Phase awards +3 when wall is crossed, +1 when not crossed
- [x] Verify score calculations match Fibonacci values exactly

---

## Developer Context

### 🎯 STORY OBJECTIVE

Update the scoring system from flat +1 for all foods to Fibonacci-based values (0, +1, +2, +3, +5, +8). The key complexity is Wall Phase: it awards +1 by default but +3 if the player actively uses the wall-crossing ability. This requires tracking wall interaction during the effect.

**CRITICAL SUCCESS FACTORS:**
- All food types must award their Fibonacci values immediately on consumption
- Wall Phase must award +1 initially, then +2 more if wall is crossed
- Invincibility must award 0 points (safety tax)
- No regression: existing food consumption logic must continue working

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/config.js` — Add SCORING object with Fibonacci values
- `js/scoring.js` — Update score calculation logic
- `js/effects.js` — Add wallPhaseUsed tracking
- `js/collision.js` — Detect wall crossing during Wall Phase
- `js/game.js` — Award Wall Phase bonus when wallPhaseUsed = true

**Module Boundaries:**
- `config.js` stores scoring values (single source of truth)
- `scoring.js` calculates score awards (no state mutation)
- `effects.js` tracks effect state including wallPhaseUsed flag
- `collision.js` detects wall boundaries and updates wallPhaseUsed
- `game.js` orchestrates: reads wallPhaseUsed, awards bonus, resets flag

**Data Flow:**
```
1. Player eats Wall Phase food
2. effects.js: wallPhase.active = true, wallPhaseUsed = false
3. scoring.js: award +1 immediately
4. Player navigates to wall boundary
5. collision.js: detects wall crossing, sets wallPhaseUsed = true
6. Player eats next food
7. game.js: checks wallPhaseUsed → if true, award +2 bonus
8. effects.js: wallPhase.active = false, reset wallPhaseUsed = false
```

---

### 📦 CONFIG.JS UPDATES

Add SCORING object to CONFIG:

```javascript
export const CONFIG = {
  // ... existing config ...

  // Fibonacci Scoring (v2)
  SCORING: {
    FOOD: {
      growing: 1,
      speedDecrease: 2,
      wallPhase: 1,          // Default on consumption
      speedBoost: 5,
      reverseControls: 8,
      invincibility: 0        // Safety tax
    },
    WALL_PHASE_BONUS: 2,     // Additional +2 if wall is crossed (total +3)
    PHONE_END: 1,            // Epic 9
    // Phone Pick Up bonuses added in Epic 9
  }
};
```

---

### 🎨 IMPLEMENTATION DETAILS

**1. effects.js — Add wallPhaseUsed tracking:**

```javascript
// In effects state
effects: {
  // ... existing fields ...
  wallPhase: {
    active: false,
    used: false             // NEW: Track if player crossed a wall
  }
}

// When Wall Phase activates
export function activateWallPhase(effects) {
  effects.wallPhase.active = true;
  effects.wallPhase.used = false;  // Reset tracking
}

// When effect ends
export function deactivateWallPhase(effects) {
  effects.wallPhase.active = false;
  effects.wallPhase.used = false;
}
```

**2. collision.js — Detect wall crossing:**

```javascript
export function checkWallCollision(snake, effects) {
  const head = snake.segments[0];

  // Wall Phase: wrap to opposite side and mark as used
  if (effects.wallPhase.active) {
    if (head.x < 0) {
      head.x = CONFIG.GRID_WIDTH - 1;
      effects.wallPhase.used = true;  // Mark wall interaction
      return false; // No death
    }
    if (head.x >= CONFIG.GRID_WIDTH) {
      head.x = 0;
      effects.wallPhase.used = true;
      return false;
    }
    if (head.y < 0) {
      head.y = CONFIG.GRID_HEIGHT - 1;
      effects.wallPhase.used = true;
      return false;
    }
    if (head.y >= CONFIG.GRID_HEIGHT) {
      head.y = 0;
      effects.wallPhase.used = true;
      return false;
    }
  }

  // Normal wall collision (death)
  if (head.x < 0 || head.x >= CONFIG.GRID_WIDTH ||
      head.y < 0 || head.y >= CONFIG.GRID_HEIGHT) {
    return true; // Wall collision = death
  }

  return false;
}
```

**3. scoring.js — Calculate food score:**

```javascript
import { CONFIG } from './config.js';

export function getFoodScore(foodType) {
  return CONFIG.SCORING.FOOD[foodType] || 0;
}

export function getWallPhaseBonus() {
  return CONFIG.SCORING.WALL_PHASE_BONUS;
}
```

**4. game.js — Award scores:**

```javascript
// On food consumption
function onFoodEaten(food, gameState) {
  // Award base food score immediately
  const baseScore = getFoodScore(food.type);
  gameState.score += baseScore;

  // Apply food effect
  applyFoodEffect(food.type, gameState);

  // Check for Wall Phase bonus from PREVIOUS effect
  if (gameState.effects.wallPhase.used) {
    const bonus = getWallPhaseBonus();
    gameState.score += bonus;
    // Note: This awards bonus when NEXT food is eaten, not immediately
  }

  // Deactivate previous effects
  deactivatePreviousEffects(gameState.effects);

  // Spawn new food
  spawnFood(gameState);
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Growing Food (+1):**
   - Eat green food
   - Verify score increases by +1
   - Repeat 5 times, verify total increase = +5

2. **Speed Decrease Food (+2):**
   - Eat cyan food
   - Verify score increases by +2

3. **Wall Phase Food (+1 default):**
   - Eat purple food
   - Do NOT cross any wall
   - Eat next food
   - Verify score increased by +1 (not +3)

4. **Wall Phase Food (+3 with wall crossing):**
   - Eat purple food
   - Navigate to wall and cross it (wrap to opposite side)
   - Eat next food
   - Verify score increased by +3 total (+1 initial, +2 bonus)

5. **Speed Boost Food (+5):**
   - Eat red food
   - Verify score increases by +5

6. **Reverse Controls Food (+8):**
   - Eat orange food
   - Verify score increases by +8

7. **Invincibility Food (0):**
   - Eat yellow food
   - Verify score does NOT increase
   - Verify invincibility effect still activates

**Edge Cases:**
- Eat Wall Phase twice in a row (second one should not get bonus from first)
- Die during Wall Phase before crossing wall (no bonus awarded)
- Cross wall multiple times during one Wall Phase (bonus only awarded once)

---

### 📚 CRITICAL DATA FORMATS

**Score must be an integer:**
```javascript
gameState.score = 0;           // CORRECT
gameState.score += 1;           // CORRECT
gameState.score += 1.5;         // WRONG (no decimals)
```

**Food types as strings:**
```javascript
const foodType = 'wallPhase';   // CORRECT
const foodType = 2;             // WRONG
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/project-context.md` — Core game rules
- `_bmad-output/planning-artifacts/game-design-food-v2.md` — Fibonacci scoring design
- `_bmad-output/planning-artifacts/prd.md` — FR10-FR17 (food scoring requirements)

**Key Rules:**
- Score = foods eaten + bonuses (no time-based scoring)
- All timed effects end when next food is consumed
- Wall Phase bonus awarded when NEXT food eaten (not immediately)

---

### 📋 FRs COVERED

FR10-FR17 (Updated food scoring values)

**Detailed FR Mapping:**
- FR10: Food spawns with probability distribution → No changes (existing)
- FR11: Food consumed when head occupies position → No changes (existing)
- FR12: Growing food +1 → Update to Fibonacci
- FR13: Invincibility food 0 pts → Update to Fibonacci
- FR14: Wall Phase food +1/+3 → New conditional scoring logic
- FR15: Speed Boost food +5 → Update to Fibonacci
- FR16: Speed Decrease food +2 → Update to Fibonacci
- FR17: Reverse Controls food +8 → Update to Fibonacci

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] CONFIG.SCORING object added with all Fibonacci values
- [ ] effects.wallPhase.used flag implemented
- [ ] Wall crossing detection sets wallPhaseUsed = true
- [ ] Wall Phase awards +1 on consumption
- [ ] Wall Phase awards +2 bonus on next food if wall was crossed
- [ ] Growing food awards +1
- [ ] Speed Decrease food awards +2
- [ ] Speed Boost food awards +5
- [ ] Reverse Controls food awards +8
- [ ] Invincibility food awards 0
- [ ] Wall Phase bonus only awarded once per effect
- [ ] Score calculations match Fibonacci values exactly
- [ ] No regression: all existing food effects still work
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (Wall Phase twice, die during Wall Phase, etc.)

**Common Mistakes to Avoid:**
- ❌ Awarding Wall Phase bonus immediately instead of on next food
- ❌ Awarding Wall Phase bonus multiple times for multiple wall crossings
- ❌ Forgetting to reset wallPhaseUsed flag after bonus is awarded
- ❌ Hardcoding score values instead of using CONFIG.SCORING

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

No issues encountered during implementation. All tests pass.

### Implementation Plan

Followed red-green-refactor TDD cycle with user feedback iteration:
1. Created scoring.js module with pure calculation functions
2. Updated CONFIG with SCORING object containing Fibonacci values
3. Initially implemented deferred bonus (awarded on next food)
4. **User testing revealed need for instant feedback**
5. Refactored to instant reward model (bonus awarded immediately when wall crossed)
6. Updated all tests to reflect instant reward behavior
7. User confirmed working as expected ✅

### Completion Notes List

✅ **Story 7.1 Complete - Fibonacci Scoring System with Instant Rewards**

**What was implemented:**
- Created new `scoring.js` module with pure calculation functions (getFoodScore, getWallPhaseBonus)
- Added `CONFIG.SCORING` object with all Fibonacci values (0, 1, 2, 5, 8) and Wall Phase bonus (+2)
- All 6 food types now award correct Fibonacci scores
- **Wall Phase instant rewards**: +1 on consumption, +2 immediately when wall is crossed (total +3)

**Key technical decisions:**
- Scoring module is pure functions only (no state mutation, no side effects)
- Wall Phase bonus is +2 (added to base +1 for total +3)
- Wall crossing detection happens in snake.js wrapPosition() function
- **INSTANT REWARD**: Bonus awarded immediately in snake.js when wall is crossed (not deferred)
- Wall Phase is single-use: effect clears immediately after crossing wall

**Design iteration (based on user feedback):**
- **Initial design**: Award +1 on consumption, then +2 bonus when NEXT food is eaten
- **User feedback**: "The reward must be instant" - deferred bonus felt unresponsive
- **Final design**: Award +1 on consumption, then +2 bonus INSTANTLY when wall is crossed
- **Rationale**: Aligns with game UX principles - instant feedback drives player engagement and motivation

**Tests created:**
- `test/scoring.test.js` - Unit tests for scoring module
- `test/wallphase-scoring.test.js` - Integration tests for Wall Phase instant bonus
- `test/fibonacci-scoring-manual.html` - Manual test page with automated validation
- All tests updated to reflect instant reward behavior ✅

**Verification:**
- All food types award correct Fibonacci scores (0, 1, 2, 5, 8)
- Invincibility awards 0 points (safety tax) ✅
- Wall Phase awards +1 when consumed ✅
- Wall Phase awards +2 INSTANTLY when wall is crossed ✅
- Wall Phase is single-use (clears after crossing) ✅
- No regressions in existing functionality ✅
- **User tested and confirmed working as expected** ✅

### File List

- js/config.js (modified - add SCORING object with Fibonacci values)
- js/scoring.js (created - pure calculation functions: getFoodScore, getWallPhaseBonus)
- js/effects.js (modified - removed wallPhaseUsed reset from clearEffect)
- js/snake.js (modified - award Wall Phase bonus instantly when wall is crossed)
- js/game.js (modified - simplified to use getFoodScore for base scoring)
- js/state.js (modified - add effects.wallPhaseUsed to initial state)
- test/scoring.test.js (modified - updated for instant reward behavior)
- test/wallphase-scoring.test.js (modified - integration tests for instant bonus)
- test/fibonacci-scoring-manual.html (modified - reflects instant reward design)
- test/index.html (modified - add new test files to test runner)
