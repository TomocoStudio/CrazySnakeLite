# Story 10.6: Implement Combo Timer Pause During Phone Calls

**Epic:** 10 - Combo Mode System
**Story ID:** 10.6
**Status:** ✅ review
**Created:** 2026-02-08
**Completed:** 2026-02-14
**Reviewed:** 2026-02-14

---

## Story

**As a** player,
**I want** combo mode to pause while handling phone calls,
**So that** I'm not overwhelmed by simultaneous cognitive demands while learning the combo system.

## Acceptance Criteria

**Given** combo mode is active
**When** a phone call arrives
**Then** the combo timer pauses (foodCount does not advance until phone dismisses)
**And** combo.active remains true
**And** the dark canvas color remains visible under the blur

**Given** the phone overlay is active during combo
**When** I dismiss the call (End or Pick Up)
**Then** combo mode resumes immediately:
- Striped snake pattern remains intact
- Dark canvas color persists
- Combo foodCount continues from where it paused
- Next food eaten increments foodCount normally

**Given** combo is paused during Pick Up
**When** the Pick Up timer is running
**Then** the combo state is fully preserved
**And** eating food during Pick Up is still possible (combo resumes after dismissal)

**Given** I die during a paused combo
**When** death triggers
**Then** combo state is captured for analytics (combo was active)

## Tasks / Subtasks

- [x] Add CONFIG.COMBO_PAUSE_ON_PHONE to config.js
  - [x] Boolean flag (true by default)
- [x] Prevent foodCount increment during phone call
  - [x] In handleComboFoodProgression(): check if phoneCall.active
  - [x] If phone active: skip combo progression logic
  - [x] Return early (do not increment foodCount)
- [x] Test combo pause during phone call
  - [x] Activate combo (Effect A)
  - [x] Trigger phone call
  - [x] Verify dark canvas visible under blur
  - [x] Verify striped snake (if Effect B) or solid (if Effect A only)
  - [x] Dismiss phone
  - [x] Eat food
  - [x] Verify foodCount increments normally
- [x] Test combo resume after phone dismissal
  - [x] Combo with Effect B (striped snake, foodCount = 2)
  - [x] Trigger phone call
  - [x] Dismiss call
  - [x] Verify striped snake still visible
  - [x] Verify dark canvas color persists
  - [x] Eat third food
  - [x] Verify combo exits normally
- [x] Test death during paused combo
  - [x] Activate combo (phone call arrives)
  - [x] Die during Pick Up countdown
  - [x] Verify combo.active = true (captured for analytics)
- [x] Test Pick Up timer during combo
  - [x] Combo active, phone arrives
  - [x] Press Pick Up (blur + countdown)
  - [x] Verify combo state preserved (effectA, effectB, canvasColor)
  - [x] Countdown expires, phone dismisses
  - [x] Verify combo resumes

---

## Developer Context

### 🎯 STORY OBJECTIVE

Pause combo progression during phone calls to respect cognitive budget. Players learning combo mode (first introduced at score 40+) should not be overwhelmed by simultaneous phone + combo demands. Combo state (effectA, effectB, canvas color, striped snake) is fully preserved during pause and resumes immediately after phone dismissal.

**CRITICAL SUCCESS FACTORS:**
- foodCount does not increment during phone call
- Combo state fully preserved (effectA, effectB, canvasColor, striped snake)
- Dark canvas color visible under phone blur
- Combo resumes seamlessly after phone dismissal

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/config.js` — Add COMBO_PAUSE_ON_PHONE flag
- `js/game.js` — Check phoneCall.active before incrementing combo.foodCount

**Module Boundaries:**
- `game.js` owns combo + phone interaction logic
- `combo.js` owns combo state (effectA, effectB)
- `phone.js` owns phone state (active, pickedUp)

**Data Flow:**
```
1. Combo active (foodCount = 1 or 2)
2. Phone call arrives (phoneCall.active = true)
3. Player eats food while phone overlay visible
4. game.js: check if phoneCall.active
5. If true: skip handleComboFoodProgression() (foodCount unchanged)
6. Player dismisses phone (phoneCall.active = false)
7. Player eats next food
8. game.js: handleComboFoodProgression() runs normally (foodCount increments)
```

---

### 📦 CONFIG.JS UPDATES

Add combo pause flag:

```javascript
export const CONFIG = {
  // ... existing config ...

  // Combo + Phone Interaction (v2 - Epic 10)
  COMBO_PAUSE_ON_PHONE: true  // Pause combo progression during phone calls
};
```

---

### 🎨 IMPLEMENTATION DETAILS

**1. game.js — Pause combo during phone call:**

```javascript
function onFoodEaten(food, gameState) {
  // Award base food score
  const baseScore = getFoodScore(food.type);
  gameState.score += baseScore;

  // Apply food effect
  applyFoodEffect(food.type, gameState);

  // Check combo activation (only if combo not active and no phone call)
  if (!isComboActive(gameState) && !gameState.phoneCall.active && gameState.score >= 40) {
    const comboProbability = getComboProbability(gameState.score);

    if (Math.random() < comboProbability) {
      activateCombo(food, gameState);
    }
  }

  // If combo active AND phone NOT active, handle combo progression
  if (isComboActive(gameState) && !gameState.phoneCall.active) {
    handleComboFoodProgression(food, gameState);
  }

  // If combo active BUT phone IS active, skip combo progression (pause)
  if (isComboActive(gameState) && gameState.phoneCall.active) {
    console.log('Combo paused during phone call. foodCount unchanged.');
    // Combo state preserved (effectA, effectB, canvasColor, striped snake)
  }

  // Spawn new food
  spawnFood(gameState);
}
```

**2. Alternative: Check in handleComboFoodProgression():**

```javascript
function handleComboFoodProgression(food, gameState) {
  // If phone call active, pause combo progression
  if (CONFIG.COMBO_PAUSE_ON_PHONE && gameState.phoneCall.active) {
    console.log('Combo paused during phone call.');
    return; // Exit early, foodCount unchanged
  }

  // Normal combo progression
  if (gameState.combo.foodCount === 1) {
    // Second food → set Effect B
    // ... (Story 10.4 logic)
  } else if (gameState.combo.foodCount === 2) {
    // Third food → exit combo
    // ... (Story 10.5 logic)
  }
}
```

**3. Ensure canvas color + blur stack correctly (no changes needed):**

```css
/* Canvas blur applied by phone overlay CSS */
#game-canvas.phone-active {
  filter: blur(4px);
}

/* Combo canvas color persists underneath blur */
/* No additional code needed — CSS handles stacking */
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Combo Pauses During Phone Call:**
   - Activate combo (Effect A, foodCount = 1)
   - Trigger phone call (phone overlay appears)
   - Eat food while phone visible
   - Verify foodCount still = 1 (unchanged)
   - Dismiss phone
   - Eat next food
   - Verify foodCount increments to 2 (Effect B set)

2. **Dark Canvas Visible Under Blur:**
   - Activate combo (dark canvas)
   - Trigger phone call
   - Verify dark combo color visible under 4px blur
   - Verify both effects stack (dark + blur)

3. **Striped Snake Preserved During Pause:**
   - Activate combo (Effect A)
   - Eat second food (Effect B, striped snake)
   - Trigger phone call
   - Verify striped snake still visible under blur
   - Dismiss phone
   - Verify striped snake persists (no reversion to solid)

4. **Combo Resumes After Phone Dismissal:**
   - Combo with Effect B (foodCount = 2, striped snake)
   - Trigger phone call
   - Dismiss phone (End or Pick Up)
   - Eat third food
   - Verify combo exits normally (canvas light grey, snake single-color)

5. **Pick Up Timer During Combo:**
   - Combo active (dark canvas, striped snake)
   - Trigger phone call, press Pick Up
   - Observe countdown (1-3s blur)
   - Verify dark canvas + blur stack correctly
   - Countdown expires, phone dismisses
   - Verify combo still active (dark canvas, striped snake)
   - Eat food
   - Verify foodCount increments normally

6. **Death During Paused Combo:**
   - Activate combo (phone call arrives)
   - Die during Pick Up countdown
   - Verify combo.active = true (preserved for analytics)
   - Verify effectA, effectB still populated

**Edge Cases:**
- Phone call arrives exactly when Effect B consumed (pause immediately)
- Multiple phone calls during one combo (pause each time)
- Combo exits normally after multiple phone pauses

---

### 📚 CRITICAL DATA FORMATS

**Phone active check:**
```javascript
if (gameState.phoneCall.active) { /* pause combo */ }  // CORRECT
if (gameState.phone.active) { /* pause combo */ }      // WRONG (incorrect state path)
```

**Early return for pause:**
```javascript
if (phoneCall.active) { return; }  // CORRECT (exit early, foodCount unchanged)
if (phoneCall.active) { continue; } // WRONG (not in loop)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/game-ux-principles.md` — Cognitive load management
- `_bmad-output/planning-artifacts/prd.md` — FR47-FR48 (combo pause during phone)

**Key Design Principles:**
- **Cognitive budget:** Prevent overwhelming players with simultaneous combo + phone demands
- **Learning phase:** Combo introduced at score 40+ (same time phone frequency increases)
- **Seamless resume:** Combo state fully preserved, resumes immediately after phone
- **Visual stacking:** Dark canvas + blur create layered visual feedback

---

### 📋 FRs COVERED

FR47-FR48 (Combo timer pause during phone calls)

**Detailed FR Mapping:**
- FR47: Combo progression pauses during phone call → phoneCall.active check
- FR48: Combo resumes after phone dismissal → handleComboFoodProgression() continues normally

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] CONFIG.COMBO_PAUSE_ON_PHONE = true
- [ ] handleComboFoodProgression() checks phoneCall.active
- [ ] If phone active: return early (foodCount unchanged)
- [ ] Combo state preserved during pause (effectA, effectB, canvasColor)
- [ ] Striped snake rendering preserved during pause
- [ ] Dark canvas color visible under phone blur
- [ ] Canvas + blur effects stack correctly
- [ ] Combo resumes after phone dismissal (End or Pick Up)
- [ ] foodCount increments normally after resume
- [ ] Death during paused combo preserves combo.active
- [ ] Pick Up timer during combo preserves all combo state
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (phone at Effect B, multiple pauses, exit after pauses)

**Common Mistakes to Avoid:**
- ❌ Incrementing foodCount during phone call (not paused)
- ❌ Exiting combo when phone arrives (should pause, not exit)
- ❌ Not preserving striped snake during pause (reversion to solid)
- ❌ Canvas color resets during phone call (should persist)
- ❌ Combo progression continues during Pick Up timer (should pause)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

No debug issues encountered during implementation.

### Completion Notes List

**Implementation Summary:**
- Added CONFIG.COMBO_PAUSE_ON_PHONE = true to config.js (Epic 10, Story 10.6 - v2)
- Modified game.js combo progression logic to check phoneCall.active before advancing foodCount
- Wrapped combo progression (lines 121-168) in conditional check for phone state
- When phone active: skip combo progression, log pause message, preserve all state
- When phone dismissed: combo progression resumes normally from where it paused
- All combo state preserved during pause: effectA, effectB, canvasColor, foodCount, striped snake rendering
- Dark canvas color remains visible under phone blur (CSS stacking)
- Created comprehensive test suite (combo-pause-phone.test.js) with:
  - Config flag verification
  - Combo pause during phone call tests
  - Dark canvas color preservation tests
  - Striped snake preservation tests
  - Combo resume and exit after phone dismissal tests
  - Pick Up timer during combo tests
  - Death during paused combo tests (analytics preservation)
  - Multiple phone pauses in one combo tests

**Technical Decisions:**
- Implemented pause check at combo progression level (not at food consumption level)
- Used CONFIG.COMBO_PAUSE_ON_PHONE flag for future configurability
- Preserved all combo visual state (canvas color, striped snake) during pause
- No special handling needed for CSS blur stacking (works automatically)
- Death during paused combo preserves state for analytics (intentional design)
- Pick Up timer fully compatible with combo pause (both states stack correctly)

**Cognitive Load Management:**
- Prevents overwhelming players with simultaneous combo + phone demands
- Combo introduced at score 40+ (same time phone frequency increases to 6-12s)
- Pause ensures players can focus on one cognitive task at a time
- Seamless resume maintains flow state after phone dismissal

**Key Implementation Details:**
1. **Pause logic:** `if (CONFIG.COMBO_PAUSE_ON_PHONE && gameState.phoneCall.active)`
2. **State preservation:** All fields (effectA, effectB, canvasColor, foodCount) unchanged during pause
3. **Visual continuity:** Dark canvas + blur stack naturally via CSS
4. **Striped snake:** Rendering logic uses combo.effectA/effectB, which persist during pause

### File List

- js/config.js (modified - added COMBO_PAUSE_ON_PHONE flag)
- js/game.js (modified - added phoneCall.active check before combo progression)
- test/combo-pause-phone.test.js (new - comprehensive combo pause tests)
- test/index.html (modified - added combo-pause-phone.test.js import)
