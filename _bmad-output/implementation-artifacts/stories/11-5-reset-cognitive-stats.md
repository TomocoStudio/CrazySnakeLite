# Story 11.5: Reset Cognitive Stats on New Game

**Epic:** 11 - Cognitive Feedback & RC Recognition
**Story ID:** 11.5
**Status:** 🔴 not started
**Created:** 2026-02-08

---

## Story

**As a** player,
**I want** cognitive stats to reset when I start a new game,
**So that** each game session is tracked independently.

## Acceptance Criteria

**Given** I die and see cognitive stats
**When** I click "Play Again"
**Then** all cognitive stats reset to 0:
- rcSurvived = 0
- phoneCallsManaged = 0
- mysteryFoodsEaten = 0
- comboMultipliers = 0
- pickUpStreak = 0
- peakComboScore = 0

**Given** I start a new game
**When** the game initializes
**Then** cognitiveStats is a fresh object with all zeros

**Given** I achieve stats in game 1, die, and start game 2
**When** I achieve new stats in game 2
**Then** the stats displayed after game 2 death are ONLY from game 2
**And** game 1 stats are not carried over

## Tasks / Subtasks

- [ ] Verify resetGameState() in state.js resets all cognitiveStats
  - [ ] Set all 6 fields to 0
  - [ ] Called on Play Again button click
- [ ] Verify createInitialState() in state.js initializes all cognitiveStats to 0
  - [ ] rcSurvived = 0
  - [ ] phoneCallsManaged = 0
  - [ ] mysteryFoodsEaten = 0
  - [ ] comboMultipliers = 0
  - [ ] pickUpStreak = 0
  - [ ] peakComboScore = 0
- [ ] Test stats reset on Play Again
  - [ ] Game 1: achieve stats, die
  - [ ] Click Play Again
  - [ ] Verify all cognitiveStats = 0
  - [ ] Play game 2, achieve new stats
  - [ ] Verify only game 2 stats displayed on death
- [ ] Test stats independence across games
  - [ ] Game 1: rcSurvived = 5
  - [ ] Die, Play Again
  - [ ] Game 2: rcSurvived = 2
  - [ ] Die
  - [ ] Verify display shows "Reverse Controls survived: 2" (not 5, not 7)

---

## Developer Context

### 🎯 STORY OBJECTIVE

Ensure cognitive stats are session-based (reset each game) rather than cumulative across games. This keeps the feedback focused on the current game's achievements, not historical performance. Players see what they just accomplished, not what they did 5 games ago.

**CRITICAL SUCCESS FACTORS:**
- All 6 cognitiveStats reset to 0 on new game
- resetGameState() called when Play Again clicked
- Stats independence verified (game 1 does not affect game 2)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Verify (already implemented):**
- `js/state.js` — resetGameState() and createInitialState()
- `js/game.js` — Play Again button calls resetGameState()

**Module Boundaries:**
- `state.js` owns state reset logic
- `game.js` owns game initialization (calls resetGameState)

**Data Flow:**
```
1. Player dies, sees stats from game 1
2. Player clicks Play Again
3. game.js: resetGameState(state) → all cognitiveStats = 0
4. game.js: initialize new game
5. Player plays game 2
6. cognitiveStats increment from 0 (not from game 1 values)
7. Player dies
8. Stats displayed are ONLY from game 2
```

---

### 📦 STATE.JS VERIFICATION

Ensure resetGameState() resets all cognitiveStats:

```javascript
export function resetGameState(state) {
  // Reset cognitive stats (Epic 11)
  state.cognitiveStats.rcSurvived = 0;
  state.cognitiveStats.phoneCallsManaged = 0;
  state.cognitiveStats.mysteryFoodsEaten = 0;
  state.cognitiveStats.comboMultipliers = 0;
  state.cognitiveStats.pickUpStreak = 0;
  state.cognitiveStats.peakComboScore = 0;

  // ... reset other game state ...
}

export function createInitialState() {
  return {
    // ... existing state ...

    cognitiveStats: {
      rcSurvived: 0,
      phoneCallsManaged: 0,
      mysteryFoodsEaten: 0,
      comboMultipliers: 0,
      pickUpStreak: 0,
      peakComboScore: 0
    }
  };
}
```

---

### 🎨 IMPLEMENTATION VERIFICATION

**1. game.js — Play Again button calls resetGameState():**

```javascript
function initPlayAgainButton(gameState) {
  const btn = document.getElementById('play-again-btn');

  btn.addEventListener('click', () => {
    // Reset game state (includes cognitiveStats)
    resetGameState(gameState);

    // Hide game over screen
    hideGameOverScreen();

    // Start new game
    startGame(gameState);
  });
}
```

**2. Verify stats reset in all places:**

```javascript
// Ensure cognitiveStats reset anywhere game state is reset:
// - Play Again button (primary)
// - Initial game load (createInitialState)
// - Any other game restart mechanisms
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Stats Reset on Play Again:**
   - Game 1: achieve rcSurvived = 3, phoneCallsManaged = 5
   - Die, observe stats displayed
   - Click Play Again
   - Check gameState.cognitiveStats
   - Verify all fields = 0

2. **Stats Independence Across Games:**
   - Game 1: achieve rcSurvived = 4, comboMultipliers = 2
   - Die (stats displayed: "RC survived: 4", "Combo multipliers: 2")
   - Play Again
   - Game 2: achieve rcSurvived = 1, mysteryFoodsEaten = 8
   - Die
   - Verify stats displayed: "Mystery foods decoded: 8", "RC survived: 1"
   - Verify NO carryover from game 1 (comboMultipliers = 2 not shown)

3. **Multiple Games in a Row:**
   - Game 1: rcSurvived = 5
   - Die, Play Again
   - Game 2: rcSurvived = 2
   - Die, Play Again
   - Game 3: rcSurvived = 3
   - Die
   - Verify display shows "RC survived: 3" (from game 3 only)

4. **All Stats Reset:**
   - Game 1: achieve all 6 stats with various values
   - Die, Play Again
   - Verify all 6 cognitiveStats = 0
   - Play game 2, achieve only 2 stats
   - Die
   - Verify only those 2 stats displayed (not all 6)

5. **Initial Game State:**
   - Refresh page (clean load)
   - Start game
   - Check gameState.cognitiveStats
   - Verify all fields initialized to 0

**Edge Cases:**
- Die immediately in game 2 (no achievements) — no stats displayed
- Achieve same stat values in game 2 as game 1 (still independent)
- Play 10 games in a row (stats reset every time)

---

### 📚 CRITICAL DATA FORMATS

**Reset logic:**
```javascript
state.cognitiveStats.rcSurvived = 0;  // CORRECT (explicit reset)
delete state.cognitiveStats;          // WRONG (removes object)
state.cognitiveStats = {};            // WRONG (removes fields)
```

**Independence verification:**
```javascript
// Game 1 ends with rcSurvived = 5
// Play Again resets rcSurvived = 0
// Game 2 increments rcSurvived to 2
// Display shows: 2 (not 5, not 7)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/prd.md` — FR80 (reset cognitive stats on new game)

**Key Design Principles:**
- **Session-based tracking:** Each game is independent
- **Immediate context:** Show what just happened, not historical data
- **Clean slate:** Every game starts fresh (no accumulation)

---

### 📋 FRs COVERED

FR80 (Reset cognitive stats on new game)

**Detailed FR Mapping:**
- FR80: Stats reset when Play Again clicked → resetGameState() called

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] resetGameState() in state.js resets all 6 cognitiveStats fields
- [ ] All fields set to 0 explicitly
- [ ] createInitialState() initializes all cognitiveStats to 0
- [ ] game.js Play Again button calls resetGameState()
- [ ] Stats reset verified with console inspection
- [ ] Stats independence tested (game 1 vs game 2)
- [ ] All 6 stats reset (not just some)
- [ ] Multiple games in a row tested
- [ ] Initial game state verified (all zeros)
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (immediate death game 2, same values, 10 games)

**Common Mistakes to Avoid:**
- ❌ Not resetting all 6 fields (some carry over)
- ❌ Deleting cognitiveStats object instead of resetting fields
- ❌ Not calling resetGameState() on Play Again (stats accumulate)
- ❌ Resetting analyticsState instead of cognitiveStats (wrong object)
- ❌ Stats carry over from game 1 to game 2

---

## Dev Agent Record

### Agent Model Used

_To be filled by implementing agent_

### Debug Log References

_To be filled during implementation_

### Completion Notes List

_To be filled on completion_

### File List

- js/state.js (verify - resetGameState and createInitialState reset cognitiveStats)
- js/game.js (verify - Play Again button calls resetGameState)
