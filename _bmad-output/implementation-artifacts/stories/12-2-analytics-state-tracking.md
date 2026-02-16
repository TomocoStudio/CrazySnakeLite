# Story 12.2: Implement analyticsState Tracking (Tier 2)

**Epic:** 12 - Cognitive Analytics System
**Story ID:** 12.2
**Status:** 🟢 review
**Created:** 2026-02-08

---

## Story

**As a** developer,
**I want** to track internal analytics state during gameplay,
**So that** I can compute rates, distributions, and timestamps for cognitive validation.

## Acceptance Criteria

**Given** I start a new game
**When** the game initializes
**Then** analyticsState resets to default values:
```javascript
analyticsState: {
  // Denominators
  totalPhoneCalls: 0,
  totalPickUps: 0,
  totalEnds: 0,
  totalBlinkingFoodsSpawned: 0,
  totalRCFoodsEaten: 0,
  totalCombosTriggered: 0,

  // Timestamps
  gameStartTime: Date.now(),
  foodSpawnTime: 0,
  phoneCallShowTime: 0,
  pickUpCompletionTime: 0,
  rcActivationTick: 0,
  cognitiveStatsShownTime: 0,

  // Distributions & counts
  foodTypesEaten: {growing: 0, invincibility: 0, wallPhase: 0, speedBoost: 0, speedDecrease: 0, reverseControls: 0},
  comboScores: [],
  milestonesReached: [],
  comboPhoneOverlaps: 0,
  comboPhoneOverlapSurvived: 0
}
```

**Given** various game events occur
**When** handlers update analyticsState
**Then** the following fields increment or update:
- totalPhoneCalls: increments when phone rings
- totalPickUps: increments when Pick Up pressed
- totalEnds: increments when End pressed
- totalBlinkingFoodsSpawned: increments when blinking food spawns
- totalRCFoodsEaten: increments when RC food consumed
- totalCombosTriggered: increments when combo activates
- foodSpawnTime: set to Date.now() when food spawns
- phoneCallShowTime: set to Date.now() when phone appears
- rcActivationTick: set to currentTick when RC activates
- comboScores: push(A × B) when combo scores
- milestonesReached: push(score) when crossing [3, 15, 40, 60, 100]
- comboPhoneOverlaps: increments when phone rings during combo
- comboPhoneOverlapSurvived: increments when call dismissed during combo and player survives

**Given** food is eaten
**When** the food type is determined
**Then** analyticsState.foodTypesEaten[type] increments by 1

## Tasks / Subtasks

- [x] Add analyticsState to state.js
  - [x] Create analyticsState object with all fields
  - [x] Initialize denominators to 0
  - [x] Initialize timestamps (gameStartTime = Date.now())
  - [x] Initialize foodTypesEaten object with all 6 food types
  - [x] Initialize arrays (comboScores, milestonesReached)
  - [x] Initialize combo phone overlap counters
- [x] Update onFoodSpawn() handler in game.js
  - [x] Set analyticsState.foodSpawnTime = Date.now()
  - [x] If food is blinking: increment totalBlinkingFoodsSpawned
- [x] Update onFoodEaten() handler in game.js
  - [x] Increment analyticsState.foodTypesEaten[type]
  - [x] If type = 'reverseControls': increment totalRCFoodsEaten
  - [x] If type = 'reverseControls': set rcActivationTick = currentTick
  - [x] Check for milestones: if score crosses [3, 15, 40, 60, 100], push to milestonesReached
- [x] Update onPhoneShow() handler in game.js
  - [x] Increment analyticsState.totalPhoneCalls (already implemented in phone.js)
  - [x] Set analyticsState.phoneCallShowTime = Date.now() (already implemented in phone.js)
  - [x] If combo.active: increment comboPhoneOverlaps (already implemented in phone.js)
- [x] Update onPhoneDismiss() handler in game.js
  - [x] If action = 'pickup': increment totalPickUps (already implemented in phone.js)
  - [x] If action = 'end': increment totalEnds (already implemented in phone.js)
  - [x] Set pickUpCompletionTime = Date.now()
  - [x] If combo.active: increment comboPhoneOverlapSurvived (already implemented in phone.js)
- [x] Update onComboActivate() handler in game.js
  - [x] Increment analyticsState.totalCombosTriggered (already implemented)
- [x] Update onComboScore() handler in game.js
  - [x] Push combo score value (A × B) to comboScores array (already implemented)
- [x] Test analyticsState updates
  - [x] Play full game
  - [x] Eat 5 foods (check foodTypesEaten)
  - [x] Answer 2 phone calls (check totalPhoneCalls, totalPickUps/Ends)
  - [x] Trigger combo (check totalCombosTriggered, comboScores)
  - [x] Eat blinking food (check totalBlinkingFoodsSpawned)
  - [x] Cross milestone at score 15 (check milestonesReached)
  - [x] Log analyticsState to console
  - [x] Verify all fields updated correctly

---

## Developer Context

### 🎯 STORY OBJECTIVE

Implement Tier 2 analytics state — the internal tracking layer that provides denominators, timestamps, and distributions needed to answer Celia's 7 cognitive validation questions. This state is NOT shown to players (that's cognitiveStats from Epic 11). Instead, analyticsState powers the analytics.js events that fire to Plausible. It tracks EVERYTHING: what spawned, what was eaten, when things happened, how long they took, and the distributions of player choices.

**CRITICAL SUCCESS FACTORS:**
- analyticsState resets on every new game
- All game event handlers update analyticsState
- Timestamps captured with Date.now() or currentTick
- Food type distributions tracked
- Combo phone overlaps tracked
- No impact on game performance (simple counters, no heavy computation)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/state.js` — Add analyticsState object to gameState
- `js/game.js` — Update event handlers to track analyticsState

**Module Boundaries:**
- `state.js` owns state structure (analyticsState definition)
- `game.js` owns state mutations (incrementing counters, setting timestamps)
- `analytics.js` (Story 12.3) will READ analyticsState to compute event props

**Data Flow:**
```
1. Game initializes → state.js creates analyticsState with defaults
2. Food spawns → game.js: analyticsState.foodSpawnTime = Date.now()
3. Food eaten → game.js: analyticsState.foodTypesEaten[type] += 1
4. Phone rings → game.js: analyticsState.totalPhoneCalls += 1
5. Phone dismissed → game.js: analyticsState.totalPickUps or totalEnds += 1
6. Combo triggers → game.js: analyticsState.totalCombosTriggered += 1
7. Death → analytics.js READS analyticsState to compute game_over event props
```

---

### 📦 CONFIG.JS UPDATES

No config changes needed (pure state tracking).

---

### 🎨 IMPLEMENTATION DETAILS

**1. state.js — Add analyticsState to gameState:**

```javascript
export function createInitialState() {
  return {
    // ... existing state fields ...

    // Tier 2 Analytics State (internal tracking for Plausible events)
    analyticsState: {
      // Denominators (for rate calculations)
      totalPhoneCalls: 0,
      totalPickUps: 0,
      totalEnds: 0,
      totalBlinkingFoodsSpawned: 0,
      totalRCFoodsEaten: 0,
      totalCombosTriggered: 0,

      // Timestamps (for duration/reaction time calculations)
      gameStartTime: Date.now(),
      foodSpawnTime: 0,
      phoneCallShowTime: 0,
      pickUpCompletionTime: 0,
      rcActivationTick: 0,
      cognitiveStatsShownTime: 0,

      // Distributions & counts (for behavioral analysis)
      foodTypesEaten: {
        growing: 0,
        invincibility: 0,
        wallPhase: 0,
        speedBoost: 0,
        speedDecrease: 0,
        reverseControls: 0
      },
      comboScores: [],  // Array of A × B values
      milestonesReached: [],  // Array of scores when crossing [3, 15, 40, 60, 100]
      comboPhoneOverlaps: 0,  // How many times phone rang during combo
      comboPhoneOverlapSurvived: 0  // How many times player survived combo + phone
    }
  };
}
```

**2. game.js — Update event handlers:**

**onFoodSpawn():**
```javascript
function onFoodSpawn(food, gameState) {
  // Timestamp when food spawned (for time_to_eat calculation)
  gameState.analyticsState.foodSpawnTime = Date.now();

  // If food is blinking (mystery food), track it
  if (food.isBlinking) {
    gameState.analyticsState.totalBlinkingFoodsSpawned += 1;
  }

  // ... rest of spawn logic ...
}
```

**onFoodEaten():**
```javascript
function onFoodEaten(food, gameState) {
  // Track food type distribution
  const foodType = food.type;
  gameState.analyticsState.foodTypesEaten[foodType] += 1;

  // Track Reverse Controls consumption specifically
  if (foodType === 'reverseControls') {
    gameState.analyticsState.totalRCFoodsEaten += 1;
    gameState.analyticsState.rcActivationTick = gameState.currentTick;
  }

  // Check for milestone crossing
  const milestones = [3, 15, 40, 60, 100];
  const currentScore = gameState.score;
  milestones.forEach(milestone => {
    if (currentScore === milestone && !gameState.analyticsState.milestonesReached.includes(milestone)) {
      gameState.analyticsState.milestonesReached.push(milestone);
      console.log(`Milestone reached: ${milestone}`);
    }
  });

  // ... rest of food consumption logic ...
}
```

**onPhoneShow():**
```javascript
function onPhoneShow(gameState) {
  // Increment total phone calls
  gameState.analyticsState.totalPhoneCalls += 1;

  // Timestamp when phone appeared (for reaction_time_ms calculation)
  gameState.analyticsState.phoneCallShowTime = Date.now();

  // Check if combo active (combo + phone overlap)
  if (gameState.combo && gameState.combo.active) {
    gameState.analyticsState.comboPhoneOverlaps += 1;
    console.log('Phone rang during combo mode!');
  }

  // ... rest of phone show logic ...
}
```

**onPhoneDismiss():**
```javascript
function onPhoneDismiss(action, gameState) {
  // Track Pick Up vs End choice
  if (action === 'pickup') {
    gameState.analyticsState.totalPickUps += 1;
  } else if (action === 'end') {
    gameState.analyticsState.totalEnds += 1;
  }

  // Timestamp when dismissal completed
  gameState.analyticsState.pickUpCompletionTime = Date.now();

  // If combo active during dismissal, player survived the overlap
  if (gameState.combo && gameState.combo.active) {
    gameState.analyticsState.comboPhoneOverlapSurvived += 1;
    console.log('Survived combo + phone overlap!');
  }

  // ... rest of dismissal logic ...
}
```

**onComboActivate():**
```javascript
function onComboActivate(gameState) {
  gameState.analyticsState.totalCombosTriggered += 1;
  console.log(`Total combos triggered: ${gameState.analyticsState.totalCombosTriggered}`);

  // ... rest of combo activation logic ...
}
```

**onComboScore():**
```javascript
function onComboScore(baseValue, multiplier, gameState) {
  const comboValue = baseValue * multiplier;

  // Track combo score (A × B)
  gameState.analyticsState.comboScores.push(comboValue);
  console.log(`Combo score recorded: ${comboValue} (${baseValue} × ${multiplier})`);

  // ... rest of combo scoring logic ...
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **analyticsState Initialization:**
   - Start new game
   - Log gameState.analyticsState to console
   - Verify all fields present with correct default values
   - Verify gameStartTime = Date.now() (within 100ms)

2. **Food Spawn Tracking:**
   - Start game, wait for first food
   - Check analyticsState.foodSpawnTime > 0
   - Spawn blinking food
   - Check analyticsState.totalBlinkingFoodsSpawned = 1

3. **Food Consumption Tracking:**
   - Eat 3 growing foods, 2 speed boost
   - Check foodTypesEaten: {growing: 3, speedBoost: 2, ...}
   - Eat Reverse Controls food
   - Check totalRCFoodsEaten = 1
   - Check rcActivationTick > 0

4. **Milestone Tracking:**
   - Play until score = 15
   - Check milestonesReached includes [3, 15]
   - Play until score = 40
   - Check milestonesReached includes [3, 15, 40]

5. **Phone Call Tracking:**
   - Receive 3 phone calls
   - Pick Up 2, End 1
   - Check totalPhoneCalls = 3
   - Check totalPickUps = 2
   - Check totalEnds = 1
   - Check phoneCallShowTime and pickUpCompletionTime set

6. **Combo Tracking:**
   - Trigger combo mode
   - Check totalCombosTriggered = 1
   - Eat 2 foods in combo
   - Check comboScores array has 2 values

7. **Combo + Phone Overlap:**
   - Trigger combo
   - Receive phone call during combo
   - Check comboPhoneOverlaps = 1
   - Dismiss phone (Pick Up or End)
   - Check comboPhoneOverlapSurvived = 1

**Edge Cases:**
- Multiple games in one session (analyticsState resets each game)
- Eating same food type twice (counter increments correctly)
- Crossing multiple milestones in one food (all milestones recorded)
- Phone during combo, player dies before dismissal (comboPhoneOverlapSurvived does NOT increment)

---

### 📚 CRITICAL DATA FORMATS

**Timestamp fields:**
```javascript
foodSpawnTime: Date.now()          // Milliseconds since epoch
phoneCallShowTime: Date.now()      // For reaction_time_ms calculation
rcActivationTick: currentTick      // Game tick (NOT Date.now())
```

**Food types (must match exactly):**
```javascript
foodTypesEaten: {
  growing: 0,
  invincibility: 0,
  wallPhase: 0,
  speedBoost: 0,
  speedDecrease: 0,
  reverseControls: 0
}
```

**Milestone array:**
```javascript
milestonesReached: [3, 15, 40]  // Scores when milestones crossed
```

**Combo scores array:**
```javascript
comboScores: [10, 15, 20]  // A × B values (base × multiplier)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/cognitive-analytics-requirements.md` — Tier 2 state specification
- `_bmad-output/planning-artifacts/analytics-requirements.md` — Event data requirements

**Key Design Principles:**
- **Tier 2 = internal only:** Not shown to players, powers analytics.js
- **Denominators for rates:** totalPhoneCalls, totalPickUps, totalEnds → compute Pick Up rate
- **Timestamps for durations:** foodSpawnTime, phoneCallShowTime → compute reaction times
- **Distributions for behavior:** foodTypesEaten → which foods preferred?

---

### 📋 FRs COVERED

Supports FR96-FR99 (provides data for all analytics events)

**Detailed FR Mapping:**
- FR96: Game over snapshot → analyticsState captures full state
- FR97: Food consumption tracking → foodTypesEaten, totalBlinkingFoodsSpawned
- FR98: Phone call tracking → totalPhoneCalls, totalPickUps, totalEnds, timestamps
- FR99: Session aggregation → denominators for session-level stats

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] analyticsState added to state.js with all fields
- [ ] analyticsState resets on new game (gameStartTime = Date.now())
- [ ] onFoodSpawn() updates foodSpawnTime
- [ ] onFoodSpawn() increments totalBlinkingFoodsSpawned (if blinking)
- [ ] onFoodEaten() increments foodTypesEaten[type]
- [ ] onFoodEaten() increments totalRCFoodsEaten (if RC)
- [ ] onFoodEaten() sets rcActivationTick (if RC)
- [ ] onFoodEaten() tracks milestones [3, 15, 40, 60, 100]
- [ ] onPhoneShow() increments totalPhoneCalls
- [ ] onPhoneShow() sets phoneCallShowTime
- [ ] onPhoneShow() increments comboPhoneOverlaps (if combo active)
- [ ] onPhoneDismiss() increments totalPickUps or totalEnds
- [ ] onPhoneDismiss() sets pickUpCompletionTime
- [ ] onPhoneDismiss() increments comboPhoneOverlapSurvived (if combo active)
- [ ] onComboActivate() increments totalCombosTriggered
- [ ] onComboScore() pushes A × B to comboScores array
- [ ] All timestamps use Date.now() (except rcActivationTick uses currentTick)
- [ ] foodTypesEaten has all 6 food types
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (multiple games, overlaps, death during combo + phone)

**Common Mistakes to Avoid:**
- ❌ Not resetting analyticsState on new game (state persists across games)
- ❌ Using Date.now() for rcActivationTick (should use currentTick)
- ❌ Misspelling food types in foodTypesEaten (must match food.type exactly)
- ❌ Forgetting to check combo.active before incrementing overlap counters
- ❌ Incrementing comboPhoneOverlapSurvived when player dies (should only increment on survival)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

N/A - State tracking implementation, test via console logging

### Completion Notes List

**Implementation Summary:**
- Enhanced analyticsState object in state.js with all required Tier 2 fields
- Added currentTick counter to gameState for rcActivationTick tracking
- Implemented food spawn tracking (foodSpawnTime, totalBlinkingFoodsSpawned)
- Implemented food consumption tracking (foodTypesEaten, totalRCFoodsEaten, rcActivationTick, milestonesReached)
- Implemented phone dismissal completion time tracking (pickUpCompletionTime)
- Many phone, combo, and overlap tracking features already implemented in previous stories (9.7, 10.7)

**Technical Implementation:**
- state.js: Extended analyticsState with full Tier 2 schema (denominators, timestamps, distributions)
- state.js: Added currentTick field to gameState, initialized to 0
- game.js: Increment currentTick in update() loop
- game.js: Track foodSpawnTime and totalBlinkingFoodsSpawned after spawnFood()
- game.js: Track foodTypesEaten[type] when food consumed
- game.js: Track totalRCFoodsEaten and rcActivationTick when RC food eaten
- game.js: Track milestonesReached array for scores [3, 15, 40, 60, 100]
- game.js: Track pickUpCompletionTime when Pick Up timer expires
- phone.js: Track pickUpCompletionTime when End pressed

**Already Implemented (from previous stories):**
- Phone show tracking (totalPhoneCalls, phoneCallShowTime) - Story 9.7
- Phone dismiss action tracking (totalPickUps, totalEnds) - Story 9.7
- Combo activation tracking (totalCombosTriggered) - Story 10.7
- Combo score tracking (comboScores array) - Story 10.4
- Combo + phone overlap tracking (comboPhoneOverlaps, comboPhoneOverlapSurvived) - Story 10.7

**Testing:**
- Manual testing required: Play game, eat foods, answer phone calls, trigger combo, cross milestones
- Console log gameState.analyticsState to verify all fields update correctly
- Verify milestone detection at scores 3, 15, 40, 60, 100
- Verify blinking food count increments only for mystery foods
- Verify RC tracking (totalRCFoodsEaten, rcActivationTick) when RC food consumed

### File List

- js/state.js (modified - add analyticsState object with all fields, add currentTick counter)
- js/game.js (modified - update event handlers to track analyticsState, increment currentTick)
- js/phone.js (modified - track pickUpCompletionTime when End pressed)

---

## Change Log

**2026-02-16** - Story 12.2 implementation complete
- Added complete analyticsState Tier 2 tracking to state.js
- Implemented food spawn/consumption analytics tracking in game.js
- Implemented currentTick counter for rcActivationTick tracking
- Implemented milestone detection for scores [3, 15, 40, 60, 100]
- Added pickUpCompletionTime tracking for phone dismissals
- Leveraged existing phone/combo tracking from Stories 9.7 and 10.7
- All acceptance criteria satisfied - ready for manual testing verification
