# Story 23.1: Add Per-Food-Type Tracking to Game State

**Epic:** 23 - Run Summary Bar (Post-Game Food Counter)

**As a** developer,
**I want** the game to track how many of each food type the snake ate per run,
**So that** the Run Summary Bar has accurate data to display on the Game Over screen.

---

## Acceptance Criteria

**Given** `state.js` defines `cognitiveStats`
**When** initializing game state
**Then** add a `foodsEaten` sub-object to `cognitiveStats`:
```javascript
cognitiveStats: {
  // existing fields unchanged
  rcSurvived: 0,
  phoneCallsManaged: 0,
  mysteryFoodsEaten: 0,
  comboMultipliers: 0,
  pickUpStreak: 0,
  peakComboScore: 0,
  // NEW
  foodsEaten: {
    growing: 0,
    speedDecrease: 0,
    wallPhase: 0,
    speedBoost: 0,
    reverseControls: 0,
    invincibility: 0
  }
}
```

**Given** `game.js` `onFoodEaten()` handler resolves the food type
**When** any food is eaten
**Then** increment `gameState.cognitiveStats.foodsEaten[foodType]` by 1
**And** use the existing food type string literals exactly: `'growing'`, `'speedBoost'`, `'speedDecrease'`, `'wallPhase'`, `'invincibility'`, `'reverseControls'`
**And** the increment happens once per food eaten, regardless of effect outcome (e.g., wall phase counts even if the wall was not used during that effect)

**Given** the player starts a new game (Play Again or New Game)
**When** `resetGameState()` runs in `state.js`
**Then** `foodsEaten` is reset to all zeros
**And** all existing `cognitiveStats` fields continue to reset as before (no regression)

**Given** phone call data is needed for the Run Summary Bar
**When** game state is read at game-over time
**Then** `gameState.cognitiveStats.phoneCallsManaged` provides the phone badge count
**And** no changes are needed to phone call tracking (already implemented)

---

## Development

### Files to Modify

- **`js/state.js`** — Add `foodsEaten` sub-object to `cognitiveStats` in both initial state and `resetGameState()`
- **`js/game.js`** — Add one increment line in `onFoodEaten()` handler

### Implementation Notes

**state.js — add to cognitiveStats:**
```javascript
foodsEaten: {
  growing: 0,
  speedDecrease: 0,
  wallPhase: 0,
  speedBoost: 0,
  reverseControls: 0,
  invincibility: 0
}
```

Apply identical reset in `resetGameState()` — mirror the same structure with all zeros.

**game.js — in onFoodEaten(), after food type is resolved:**
```javascript
// Track per-food-type eat count for Run Summary Bar
gameState.cognitiveStats.foodsEaten[foodType]++;
```

Place this after the food type is known but before any effect is applied. `foodType` already exists as a local variable in `onFoodEaten()` — no new resolution needed.

**Variable shadowing check:** Before adding any variable, verify no existing `foodType` variable conflicts in scope. Use the existing string — do not create a new local.

### Dependencies

**BLOCKS:** Stories 23.2, 23.3, 23.4
**BLOCKED BY:** None

---

## Implementation Status

**Status:** 🟢 DONE

---

## Dev Agent Record

### Implementation Plan
1. Add `foodsEaten` sub-object to `cognitiveStats` in `createInitialState()` in `state.js`
2. Add `gameState.cognitiveStats.foodsEaten[effectType]++` in `game.js` after `effectType` is resolved on line 197, near existing `analyticsState.foodTypesEaten` tracking
3. Reset is automatic via `createInitialState()` called by `resetGame()` — no separate reset code needed
4. Write tests verifying initial state, reset behavior, and bracket-notation incrementing

### Completion Notes
- Added `foodsEaten: { growing: 0, speedDecrease: 0, wallPhase: 0, speedBoost: 0, reverseControls: 0, invincibility: 0 }` to `cognitiveStats` in `createInitialState()` (state.js:124-132)
- Added increment `gameState.cognitiveStats.foodsEaten[effectType]++` in `game.js` (line 244-245), placed after `analyticsState.foodTypesEaten[effectType] += 1` and before any effect is applied (effects applied starting at line 400+)
- Variable shadowing check: `effectType` is the existing local variable (same as story's `foodType` reference) — no new variable declared
- `resetGame()` already calls `createInitialState()` via `Object.assign(gameState, newState)` — `foodsEaten` automatically resets
- `phoneCallsManaged` already implemented; confirmed no changes needed
- Wrote 7 unit tests in `test/foods-eaten-tracking.test.js`, registered in `test/index.html`

---

## File List
- `js/state.js` — Added `foodsEaten` sub-object to `cognitiveStats` in `createInitialState()`
- `js/game.js` — Added `foodsEaten[effectType]++` increment after food type resolved
- `test/foods-eaten-tracking.test.js` — New: 7 unit tests for Story 23.1
- `test/index.html` — Registered new test file
- `_bmad-output/implementation-artifacts/stories/23-1-add-per-food-type-tracking-to-game-state.md` — Status updated to DONE
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Status updated to review

---

## Change Log
- 2026-02-19: Story 23.1 implemented — added `cognitiveStats.foodsEaten` tracking object to state and per-food-type increment to game loop
