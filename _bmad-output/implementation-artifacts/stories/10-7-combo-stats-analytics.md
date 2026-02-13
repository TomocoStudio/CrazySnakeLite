# Story 10.7: Track Combo Stats for Analytics and Cognitive Feedback

**Epic:** 10 - Combo Mode System
**Story ID:** 10.7
**Status:** 🔴 not started
**Created:** 2026-02-08

---

## Story

**As a** developer,
**I want** to track combo mode interactions,
**So that** we can validate working memory training and display cognitive stats.

## Acceptance Criteria

**Given** combo mode activates
**When** the trigger occurs
**Then** analyticsState.totalCombosTriggered increments by 1

**Given** I complete a combo (eat Effect B)
**When** the multiplicative score is awarded
**Then** cognitiveStats.comboMultipliers increments by 1
**And** analyticsState.comboScores.push(A × B)

**Given** I earn a combo score
**When** checking the peak combo score
**Then** cognitiveStats.peakComboScore = max(current, new score)

**Given** I die during combo mode
**When** death triggers
**Then** analyticsState.combo_active = true (for game_over event)

**Given** a phone call occurs during combo
**When** the overlap happens
**Then** analyticsState.comboPhoneOverlaps increments by 1

**Given** I survive a phone call during combo
**When** the call dismisses and combo resumes
**Then** analyticsState.comboPhoneOverlapSurvived increments by 1

## Tasks / Subtasks

- [ ] Add cognitiveStats.comboMultipliers to state.js
  - [ ] Counter: total combos completed (Effect B consumed)
  - [ ] Reset to 0 on new game
- [ ] Add cognitiveStats.peakComboScore to state.js
  - [ ] Tracker: highest combo score this game
  - [ ] Reset to 0 on new game
- [ ] Add analyticsState.totalCombosTriggered to state.js
  - [ ] Counter: total combo activations (Effect A consumed)
  - [ ] Reset to 0 on new game
- [ ] Add analyticsState.comboScores to state.js
  - [ ] Array: all combo scores for distribution analysis
  - [ ] Reset to [] on new game
- [ ] Add analyticsState.comboPhoneOverlaps to state.js
  - [ ] Counter: phone calls during active combo
  - [ ] Reset to 0 on new game
- [ ] Add analyticsState.comboPhoneOverlapSurvived to state.js
  - [ ] Counter: survived phone calls during combo
  - [ ] Reset to 0 on new game
- [ ] Track combo activation in activateCombo()
  - [ ] analyticsState.totalCombosTriggered += 1
- [ ] Track combo completion in handleComboFoodProgression()
  - [ ] When Effect B consumed:
    - cognitiveStats.comboMultipliers += 1
    - Update cognitiveStats.peakComboScore
    - Push score to analyticsState.comboScores
- [ ] Track phone overlap in showPhoneCall()
  - [ ] If combo.active: analyticsState.comboPhoneOverlaps += 1
- [ ] Track phone overlap survival in dismissPhoneCall()
  - [ ] If combo.active: analyticsState.comboPhoneOverlapSurvived += 1
- [ ] Track combo_active at death
  - [ ] In onDeath(): set analyticsState.combo_active = combo.active

---

## Developer Context

### 🎯 STORY OBJECTIVE

Add comprehensive analytics tracking for combo mode to support Epic 11 (cognitive feedback UI) and Epic 12 (cognitive analytics). Track combo activations, completions, scores, peak scores, and phone call overlaps. This data validates the working memory training hypothesis and enables personalized feedback.

**CRITICAL SUCCESS FACTORS:**
- Track both activation (totalCombosTriggered) and completion (comboMultipliers)
- Track all combo scores for distribution analysis
- Track peak combo score for highlighting achievements
- Track phone + combo overlaps for cognitive load analysis

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/state.js` — Add cognitiveStats and analyticsState counters
- `js/combo.js` — Track totalCombosTriggered in activateCombo()
- `js/game.js` — Track comboMultipliers, peakComboScore, comboScores in handleComboFoodProgression()
- `js/phone.js` — Track comboPhoneOverlaps in showPhoneCall(), comboPhoneOverlapSurvived in dismissPhoneCall()
- `js/game.js` — Track combo_active at death

**Module Boundaries:**
- `state.js` owns state structure (counters, arrays)
- `combo.js` owns combo activation tracking
- `game.js` owns combo completion tracking
- `phone.js` owns phone + combo overlap tracking

**Data Flow:**
```
1. Combo activates
2. combo.js: analyticsState.totalCombosTriggered += 1
3. Player eats Effect B
4. game.js: cognitiveStats.comboMultipliers += 1
5. game.js: peakComboScore = max(current, score)
6. game.js: comboScores.push(score)
7. Phone call arrives during combo
8. phone.js: comboPhoneOverlaps += 1
9. Phone call dismissed
10. phone.js: comboPhoneOverlapSurvived += 1
11. Epic 11/12: analyze combo stats for cognitive insights
```

---

### 📦 STATE.JS UPDATES

Add combo analytics counters:

```javascript
export function createInitialState() {
  return {
    // ... existing state ...

    // Cognitive Stats (v2 - Epic 10)
    cognitiveStats: {
      phoneCallsManaged: 0,      // From Epic 9
      pickUpStreak: 0,           // From Epic 9
      mysteryFoodsEaten: 0,      // From Epic 8
      comboMultipliers: 0,       // NEW: Total combos completed (Effect B consumed)
      peakComboScore: 0          // NEW: Highest combo score this game
    },

    // Analytics State (v2 - Epic 10)
    analyticsState: {
      totalPhoneCalls: 0,        // From Epic 9
      totalPickUps: 0,           // From Epic 9
      totalEnds: 0,              // From Epic 9
      phoneCallShowTime: null,   // From Epic 9
      totalBlinkingFoodsSpawned: 0, // From Epic 8
      totalCombosTriggered: 0,   // NEW: Total combo activations
      comboScores: [],           // NEW: All combo scores (for distribution)
      comboPhoneOverlaps: 0,     // NEW: Phone calls during active combo
      comboPhoneOverlapSurvived: 0, // NEW: Survived phone calls during combo
      combo_active: false        // NEW: Combo active at death (for game_over event)
    }
  };
}

export function resetGameState(state) {
  state.cognitiveStats.phoneCallsManaged = 0;
  state.cognitiveStats.pickUpStreak = 0;
  state.cognitiveStats.mysteryFoodsEaten = 0;
  state.cognitiveStats.comboMultipliers = 0;
  state.cognitiveStats.peakComboScore = 0;

  state.analyticsState.totalPhoneCalls = 0;
  state.analyticsState.totalPickUps = 0;
  state.analyticsState.totalEnds = 0;
  state.analyticsState.phoneCallShowTime = null;
  state.analyticsState.totalBlinkingFoodsSpawned = 0;
  state.analyticsState.totalCombosTriggered = 0;
  state.analyticsState.comboScores = [];
  state.analyticsState.comboPhoneOverlaps = 0;
  state.analyticsState.comboPhoneOverlapSurvived = 0;
  state.analyticsState.combo_active = false;

  // ... reset other state ...
}
```

---

### 🎨 IMPLEMENTATION DETAILS

**1. combo.js — Track combo activation:**

```javascript
export function activateCombo(food, gameState) {
  // Track combo activation
  gameState.analyticsState.totalCombosTriggered += 1;

  // Set combo active
  gameState.combo.active = true;

  // Store Effect A
  gameState.combo.effectA = {
    type: food.type,
    points: getFoodPoints(food.type)
  };

  // ... rest of activateCombo logic ...
}
```

**2. game.js — Track combo completion:**

```javascript
function handleComboFoodProgression(food, gameState) {
  if (gameState.combo.foodCount === 1) {
    // Second food → set Effect B
    gameState.combo.effectB = {
      type: food.type,
      points: getFoodPoints(food.type)
    };
    gameState.combo.foodCount = 2;

    // Calculate combo score (A × B)
    const comboScore = gameState.combo.effectA.points * gameState.combo.effectB.points;

    // Award combo score
    gameState.score += comboScore;

    // Track combo completion
    gameState.cognitiveStats.comboMultipliers += 1;

    // Update peak combo score
    gameState.cognitiveStats.peakComboScore = Math.max(
      gameState.cognitiveStats.peakComboScore || 0,
      comboScore
    );

    // Push score to array for distribution analysis
    gameState.analyticsState.comboScores.push(comboScore);

    // ... rest of combo completion logic ...
  }
}
```

**3. phone.js — Track phone + combo overlaps:**

```javascript
export function showPhoneCall(gameState) {
  // Track call shown
  gameState.analyticsState.totalPhoneCalls += 1;
  gameState.analyticsState.phoneCallShowTime = Date.now();

  // Track phone + combo overlap
  if (gameState.combo.active) {
    gameState.analyticsState.comboPhoneOverlaps += 1;
    console.log('Phone call during active combo (overlap tracked).');
  }

  // ... rest of showPhoneCall logic ...
}

export function dismissPhoneCall(action, gameState) {
  // Track phone + combo overlap survival
  if (gameState.combo.active) {
    gameState.analyticsState.comboPhoneOverlapSurvived += 1;
    console.log('Phone call during combo survived (overlap survival tracked).');
  }

  if (action === 'end') {
    endCall(gameState);
  } else if (action === 'pickup') {
    pickUpCall(gameState);
  }
}
```

**4. game.js — Track combo_active at death:**

```javascript
function onDeath(gameState) {
  // Capture combo state at death (for analytics)
  gameState.analyticsState.combo_active = gameState.combo.active;

  if (gameState.combo.active) {
    console.log(`Player died during combo (Effect A: ${gameState.combo.effectA?.type}, Effect B: ${gameState.combo.effectB?.type || 'none'})`);
  }

  // ... rest of death logic ...
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Track Combo Activation:**
   - Start new game, reach score 40
   - Trigger 5 combos
   - Check analyticsState.totalCombosTriggered = 5

2. **Track Combo Completion:**
   - Complete 3 combos (eat Effect B for each)
   - Check cognitiveStats.comboMultipliers = 3

3. **Track Peak Combo Score:**
   - Complete combo: 3 × 2 = 6 points
   - Check peakComboScore = 6
   - Complete combo: 8 × 5 = 40 points
   - Check peakComboScore = 40 (updated)
   - Complete combo: 2 × 1 = 2 points
   - Check peakComboScore = 40 (unchanged, still peak)

4. **Track Combo Scores Array:**
   - Complete 5 combos with scores: 6, 15, 40, 1, 12
   - Check analyticsState.comboScores = [6, 15, 40, 1, 12]

5. **Track Phone + Combo Overlap:**
   - Activate 3 combos
   - Trigger phone call during combo #1 and #3 (not #2)
   - Check comboPhoneOverlaps = 2
   - Dismiss both phone calls successfully
   - Check comboPhoneOverlapSurvived = 2

6. **Track combo_active at Death:**
   - Activate combo (Effect A)
   - Die during combo (before Effect B)
   - Check analyticsState.combo_active = true
   - Die outside combo
   - Check analyticsState.combo_active = false

7. **Stats Reset on New Game:**
   - Complete game with 5 combos, peak score 40
   - Start new game
   - Check totalCombosTriggered = 0
   - Check comboMultipliers = 0
   - Check peakComboScore = 0
   - Check comboScores = []

**Edge Cases:**
- Combo activated but not completed (Effect A only) — totalCombosTriggered = 1, comboMultipliers = 0
- 100 combos in one game (large comboScores array)
- Phone call arrives exactly when combo exits (no overlap)

---

### 📚 CRITICAL DATA FORMATS

**Peak score tracking:**
```javascript
const peak = Math.max(current || 0, newScore);  // CORRECT (handles null/undefined)
const peak = Math.max(current, newScore);       // WRONG (null/undefined breaks)
```

**Array push:**
```javascript
comboScores.push(score);  // CORRECT
comboScores[length] = score;  // LESS RELIABLE
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/prd.md` — Epic 11, Epic 12 (cognitive feedback and analytics)
- `_bmad-output/planning-artifacts/analytics-requirements.md` — Analytics system design

**Key Analytics Principles:**
- **Opportunity vs Engagement:** Track both activations (opportunity) and completions (engagement)
- **Peak moments:** peakComboScore highlights player achievements
- **Distribution analysis:** comboScores array enables histogram of combo quality
- **Cognitive load:** Phone + combo overlaps measure simultaneous task handling

---

### 📋 FRs COVERED

Prepares for Epic 11 (Cognitive Feedback) and Epic 12 (Analytics System)

**Detailed Requirement Mapping:**
- Track combo interactions → totalCombosTriggered, comboMultipliers
- Track combo scores → comboScores array, peakComboScore
- Track phone + combo overlaps → comboPhoneOverlaps, comboPhoneOverlapSurvived
- Track combo state at death → combo_active flag

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] cognitiveStats.comboMultipliers added to state.js
- [ ] cognitiveStats.peakComboScore added to state.js
- [ ] analyticsState.totalCombosTriggered added to state.js
- [ ] analyticsState.comboScores array added to state.js
- [ ] analyticsState.comboPhoneOverlaps added to state.js
- [ ] analyticsState.comboPhoneOverlapSurvived added to state.js
- [ ] analyticsState.combo_active added to state.js
- [ ] All counters initialized to 0 on game start
- [ ] All counters reset on new game
- [ ] activateCombo() increments totalCombosTriggered
- [ ] handleComboFoodProgression() increments comboMultipliers on Effect B
- [ ] handleComboFoodProgression() updates peakComboScore
- [ ] handleComboFoodProgression() pushes score to comboScores array
- [ ] showPhoneCall() increments comboPhoneOverlaps if combo.active
- [ ] dismissPhoneCall() increments comboPhoneOverlapSurvived if combo.active
- [ ] onDeath() sets combo_active = combo.active
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (combo not completed, 100 combos, phone at exit)

**Common Mistakes to Avoid:**
- ❌ Not tracking activations separately from completions (both needed)
- ❌ Not handling null/undefined for peakComboScore (initial value)
- ❌ Tracking comboPhoneOverlaps but not survival (both needed)
- ❌ Not resetting counters on new game (data accumulates incorrectly)
- ❌ Tracking combo_active incorrectly (should reflect state at death)

---

## Dev Agent Record

### Agent Model Used

_To be filled by implementing agent_

### Debug Log References

_To be filled during implementation_

### Completion Notes List

_To be filled on completion_

### File List

- js/state.js (modified - add cognitiveStats and analyticsState combo counters)
- js/combo.js (modified - track totalCombosTriggered in activateCombo)
- js/game.js (modified - track comboMultipliers, peakComboScore, comboScores, combo_active at death)
- js/phone.js (modified - track comboPhoneOverlaps, comboPhoneOverlapSurvived)
