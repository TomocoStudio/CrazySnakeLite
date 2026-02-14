# Story 11.2: Track 6 Cognitive Stats During Gameplay

**Epic:** 11 - Cognitive Feedback & RC Recognition
**Story ID:** 11.2
**Status:** ✅ review
**Created:** 2026-02-08
**Completed:** 2026-02-14

---

## Story

**As a** developer,
**I want** to track cognitive achievements during each game,
**So that** I can display meaningful feedback on the death screen.

## Acceptance Criteria

**Given** I start a new game
**When** the game initializes
**Then** all cognitive stats reset to 0:
- cognitiveStats.rcSurvived = 0
- cognitiveStats.phoneCallsManaged = 0
- cognitiveStats.mysteryFoodsEaten = 0
- cognitiveStats.comboMultipliers = 0
- cognitiveStats.pickUpStreak = 0
- cognitiveStats.peakComboScore = 0

**Given** I survive Reverse Controls (eat next food after RC without dying)
**When** the survival is confirmed
**Then** cognitiveStats.rcSurvived increments by 1

**Given** I dismiss any phone call (End or Pick Up)
**When** the call is dismissed
**Then** cognitiveStats.phoneCallsManaged increments by 1

**Given** I eat a blinking food
**When** the food is consumed
**Then** cognitiveStats.mysteryFoodsEaten increments by 1

**Given** I complete a combo (eat Effect B)
**When** the multiplicative score is awarded
**Then** cognitiveStats.comboMultipliers increments by 1

**Given** I Pick Up a call
**When** the Pick Up action completes
**Then** cognitiveStats.pickUpStreak increments by 1

**Given** I End a call
**When** the End action completes
**Then** cognitiveStats.pickUpStreak resets to 0

**Given** I earn a combo score
**When** checking the peak
**Then** cognitiveStats.peakComboScore = max(current peak, new score)

## Tasks / Subtasks

- [x] Verify cognitiveStats object exists in state.js
  - [x] Fields: rcSurvived, phoneCallsManaged, mysteryFoodsEaten, comboMultipliers, pickUpStreak, peakComboScore
  - [x] All initialized to 0 on game start (state.js:94-101)
- [x] Verify all stats reset on new game
  - [x] In resetGame(): calls createInitialState() which resets all stats to 0 (state.js:119-132)
- [x] Verify rcSurvived tracking (done in Story 11.1)
  - [x] Increments when reverseControlsActive and next food eaten (game.js:206)
- [x] Verify phoneCallsManaged tracking (done in Epic 9)
  - [x] Increments in endCall() and pickUpCall() (phone.js:195, 240)
- [x] Verify mysteryFoodsEaten tracking (done in Epic 8)
  - [x] Increments when food.isBlinking consumed (game.js:104)
- [x] Verify comboMultipliers tracking (done in Epic 10)
  - [x] Increments when combo.effectB consumed (game.js:160)
- [x] Verify pickUpStreak tracking (done in Epic 9)
  - [x] Increments on Pick Up (phone.js:241), resets on End (phone.js:196)
- [x] Verify peakComboScore tracking (done in Epic 10)
  - [x] Updates to max(current, new score) using Math.max (game.js:161-163)
- [x] Test all 6 stats in one game
  - [x] All tracking verified via code inspection
  - [x] Manual integration test: Pending browser verification

---

## Developer Context

### 🎯 STORY OBJECTIVE

Consolidate and verify that all 6 cognitive stats are being tracked correctly during gameplay. These stats were already implemented in Epics 7-10, so this story is primarily verification and ensuring consistency. The stats will be displayed on the death screen in Story 11.3.

**CRITICAL SUCCESS FACTORS:**
- All 6 stats exist in cognitiveStats object
- All stats reset to 0 on new game
- All stats increment at correct events
- pickUpStreak resets on End (not on Pick Up)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Review (already implemented):**
- `js/state.js` — cognitiveStats object structure
- `js/game.js` — RC survival tracking
- `js/phone.js` — phoneCallsManaged, pickUpStreak tracking
- `js/food.js` — mysteryFoodsEaten tracking
- `js/combo.js` — comboMultipliers, peakComboScore tracking

**Module Boundaries:**
- `state.js` owns state structure
- Various event handlers increment stats
- No new modules needed (verification only)

**Data Flow (verification):**
```
1. Game start → all cognitiveStats = 0
2. RC survived → rcSurvived += 1
3. Phone dismissed → phoneCallsManaged += 1
4. Mystery food eaten → mysteryFoodsEaten += 1
5. Combo completed → comboMultipliers += 1
6. Pick Up → pickUpStreak += 1
7. End → pickUpStreak = 0
8. Combo score → peakComboScore = max(current, score)
9. Death → display stats (Story 11.3)
10. New game → all cognitiveStats = 0 (reset)
```

---

### 📦 STATE.JS STRUCTURE (Verification)

Ensure cognitiveStats object has all fields:

```javascript
export function createInitialState() {
  return {
    // ... existing state ...

    cognitiveStats: {
      rcSurvived: 0,            // From Epic 7 + Story 11.1
      phoneCallsManaged: 0,     // From Epic 9
      mysteryFoodsEaten: 0,     // From Epic 8
      comboMultipliers: 0,      // From Epic 10
      pickUpStreak: 0,          // From Epic 9
      peakComboScore: 0         // From Epic 10
    }
  };
}

export function resetGameState(state) {
  state.cognitiveStats.rcSurvived = 0;
  state.cognitiveStats.phoneCallsManaged = 0;
  state.cognitiveStats.mysteryFoodsEaten = 0;
  state.cognitiveStats.comboMultipliers = 0;
  state.cognitiveStats.pickUpStreak = 0;
  state.cognitiveStats.peakComboScore = 0;
  // ... reset other state ...
}
```

---

### 🎨 IMPLEMENTATION VERIFICATION

**1. RC Survived (Story 11.1):**
```javascript
// In game.js onFoodEaten()
if (gameState.effects.reverseControlsActive) {
  gameState.cognitiveStats.rcSurvived += 1;
}
```

**2. Phone Calls Managed (Epic 9):**
```javascript
// In phone.js endCall()
gameState.cognitiveStats.phoneCallsManaged += 1;

// In phone.js pickUpCall()
gameState.cognitiveStats.phoneCallsManaged += 1;
```

**3. Mystery Foods Eaten (Epic 8):**
```javascript
// In game.js onFoodEaten()
if (food.isBlinking) {
  gameState.cognitiveStats.mysteryFoodsEaten += 1;
}
```

**4. Combo Multipliers (Epic 10):**
```javascript
// In game.js handleComboFoodProgression()
if (gameState.combo.foodCount === 1) {
  // Effect B consumed
  gameState.cognitiveStats.comboMultipliers += 1;
}
```

**5. Pick Up Streak (Epic 9):**
```javascript
// In phone.js pickUpCall()
gameState.cognitiveStats.pickUpStreak += 1;

// In phone.js endCall()
gameState.cognitiveStats.pickUpStreak = 0; // Reset
```

**6. Peak Combo Score (Epic 10):**
```javascript
// In game.js handleComboFoodProgression()
const comboScore = effectA.points * effectB.points;
gameState.cognitiveStats.peakComboScore = Math.max(
  gameState.cognitiveStats.peakComboScore || 0,
  comboScore
);
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **All Stats Reset on Game Start:**
   - Start new game
   - Check all cognitiveStats fields
   - Verify all = 0

2. **RC Survived Tracking:**
   - Survive RC 2 times
   - Check rcSurvived = 2

3. **Phone Calls Managed Tracking:**
   - End 3 calls
   - Pick Up 2 calls
   - Check phoneCallsManaged = 5 (3 + 2)

4. **Mystery Foods Eaten Tracking:**
   - Reach score 15 (blinking food appears)
   - Eat 8 blinking foods
   - Check mysteryFoodsEaten = 8

5. **Combo Multipliers Tracking:**
   - Complete 3 combos (eat Effect B 3 times)
   - Check comboMultipliers = 3

6. **Pick Up Streak Tracking:**
   - Pick Up 4 calls in a row
   - Check pickUpStreak = 4
   - End next call
   - Check pickUpStreak = 0 (reset)

7. **Peak Combo Score Tracking:**
   - Complete combo: 3 × 2 = 6
   - Check peakComboScore = 6
   - Complete combo: 8 × 5 = 40
   - Check peakComboScore = 40 (updated)
   - Complete combo: 2 × 1 = 2
   - Check peakComboScore = 40 (still peak)

8. **All Stats in One Game:**
   - Play complete game with all mechanics
   - Verify all 6 stats tracked correctly
   - Die
   - Start new game
   - Verify all stats reset to 0

**Edge Cases:**
- Combo with peakComboScore = 0 initially (null handling)
- pickUpStreak = 10+ (very long streak)
- All stats = 0 at death (valid, no achievements)

---

### 📚 CRITICAL DATA FORMATS

**cognitiveStats object structure:**
```javascript
cognitiveStats = {
  rcSurvived: 2,
  phoneCallsManaged: 5,
  mysteryFoodsEaten: 8,
  comboMultipliers: 3,
  pickUpStreak: 4,
  peakComboScore: 40
}
```

**Reset on new game:**
```javascript
// CORRECT: explicit reset
state.cognitiveStats.rcSurvived = 0;

// WRONG: not resetting
// (stats carry over from previous game)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/prd.md` — FR76 (cognitive stats tracking)
- Epics 7-10 implementations (where stats were originally added)

**Key Design Principles:**
- **Comprehensive tracking:** All cognitive achievements captured
- **Session-based:** Stats reset each game (not cumulative)
- **Event-driven:** Stats increment at specific achievement moments
- **Peak tracking:** peakComboScore captures best achievement, not average

---

### 📋 FRs COVERED

FR76 (Track 6 cognitive stats during gameplay)

**Detailed FR Mapping:**
- FR76: 6 cognitive stats tracked → cognitiveStats object with all fields

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] cognitiveStats object exists in state.js
- [ ] All 6 fields present: rcSurvived, phoneCallsManaged, mysteryFoodsEaten, comboMultipliers, pickUpStreak, peakComboScore
- [ ] All fields initialized to 0 on game start
- [ ] All fields reset to 0 on new game (resetGameState)
- [ ] rcSurvived increments on RC survival
- [ ] phoneCallsManaged increments on End and Pick Up
- [ ] mysteryFoodsEaten increments when blinking food consumed
- [ ] comboMultipliers increments when combo Effect B consumed
- [ ] pickUpStreak increments on Pick Up
- [ ] pickUpStreak resets to 0 on End
- [ ] peakComboScore updates to max(current, new score)
- [ ] All stats tracked in single game (integration test)
- [ ] Stats reset properly on new game
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (null peakComboScore, long pickUpStreak, all zeros)

**Common Mistakes to Avoid:**
- ❌ Missing any of the 6 stat fields (incomplete tracking)
- ❌ Not resetting stats on new game (stats accumulate)
- ❌ Resetting pickUpStreak on Pick Up instead of End (inverted logic)
- ❌ Not handling null/undefined for peakComboScore initially
- ❌ Incrementing stats at wrong events (e.g., RC activation instead of survival)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

- js/state.js:94-101 - cognitiveStats object with all 6 fields
- js/state.js:119-132 - resetGame() resets all stats via createInitialState()
- js/game.js:104 - mysteryFoodsEaten tracking
- js/game.js:160 - comboMultipliers tracking
- js/game.js:161-163 - peakComboScore tracking with Math.max
- js/game.js:206 - rcSurvived tracking
- js/phone.js:195 - phoneCallsManaged increment on End
- js/phone.js:196 - pickUpStreak reset on End
- js/phone.js:240 - phoneCallsManaged increment on Pick Up
- js/phone.js:241 - pickUpStreak increment on Pick Up

### Completion Notes List

✅ **Verification Complete (2026-02-14)**

**All 6 Cognitive Stats Verified:**

1. **rcSurvived** (Story 11.1)
   - ✅ Defined in state.js:95
   - ✅ Increments in game.js:206 when reverseControlsActive + food eaten
   - ✅ Resets to 0 on new game

2. **phoneCallsManaged** (Epic 9)
   - ✅ Defined in state.js:97
   - ✅ Increments in phone.js:195 (endCall)
   - ✅ Increments in phone.js:240 (pickUpCall)
   - ✅ Resets to 0 on new game

3. **mysteryFoodsEaten** (Epic 8)
   - ✅ Defined in state.js:96
   - ✅ Increments in game.js:104 when food.isBlinking
   - ✅ Resets to 0 on new game

4. **comboMultipliers** (Epic 10)
   - ✅ Defined in state.js:99
   - ✅ Increments in game.js:160 when combo Effect B consumed
   - ✅ Resets to 0 on new game

5. **pickUpStreak** (Epic 9)
   - ✅ Defined in state.js:98
   - ✅ Increments in phone.js:241 (pickUpCall)
   - ✅ Resets to 0 in phone.js:196 (endCall) - correct logic
   - ✅ Resets to 0 on new game

6. **peakComboScore** (Epic 10)
   - ✅ Defined in state.js:100
   - ✅ Updates in game.js:161-163 using Math.max(current, new)
   - ✅ Resets to 0 on new game

**Reset Mechanism:**
- ✅ resetGame() calls createInitialState() (state.js:120)
- ✅ Object.assign() copies fresh stats to gameState (state.js:132)
- ✅ All 6 stats reset to 0 each game

**No Code Changes Required:**
- All stats were already implemented in Epics 7-10
- Verification confirmed correct implementation
- Story objective: ensure consistency and completeness ✅

### File List

- js/state.js (verified - cognitiveStats object structure and reset)
- js/game.js (verified - rcSurvived, mysteryFoodsEaten, comboMultipliers tracking)
- js/phone.js (verified - phoneCallsManaged, pickUpStreak tracking)

**No files modified** - verification-only story
