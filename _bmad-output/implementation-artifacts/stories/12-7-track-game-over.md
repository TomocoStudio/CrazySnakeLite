# Story 12.7: Fire trackGameOver() on Death

**Epic:** 12 - Cognitive Analytics System
**Story ID:** 12.7
**Status:** 🔴 not started
**Created:** 2026-02-08

---

## Story

**As a** developer,
**I want** to capture a complete snapshot at death,
**So that** I can analyze what kills players and what cognitive stats they achieved.

## Acceptance Criteria

**Given** I die
**When** the death triggers
**Then** analytics.trackGameOver(gameState) is called
**And** the event includes all fields from analyticsState + cognitiveStats:
- score, duration_seconds (Date.now() - gameStartTime)
- death_cause ('wall' | 'self')
- foods_eaten (score, since score = foods eaten)
- phone_calls_received (analyticsState.totalPhoneCalls)
- last_food_eaten (food type consumed before death)
- active_effect_on_death (current effect when died, or null)
- combo_active_on_death (boolean)
- phone_active_on_death (boolean)
- phone_picked_up_on_death (boolean)
- Food distribution: food_growing, food_invincibility, food_wall_phase, food_speed_boost, food_speed_decrease, food_reverse_controls
- Cognitive stats: rc_survived, phone_calls_managed, mystery_foods_eaten, combo_multipliers, pick_up_streak, peak_combo_score

**Given** I die during active combo mode
**When** trackGameOver() fires
**Then** combo_active_on_death = true

**Given** I die during Pick Up
**When** trackGameOver() fires
**Then** phone_active_on_death = true, phone_picked_up_on_death = true

**Given** the food distribution is captured
**When** the event fires
**Then** analyticsState.foodTypesEaten is flattened to individual props

## Tasks / Subtasks

- [ ] Import trackGameOver from analytics.js in game.js
- [ ] Call trackGameOver() in onDeath() handler
  - [ ] Call BEFORE any state reset
  - [ ] Pass full gameState snapshot
- [ ] Verify all state fields available
  - [ ] analyticsState (totalPhoneCalls, foodTypesEaten, gameStartTime, etc.)
  - [ ] cognitiveStats (rcSurvived, phoneCallsManaged, mysteryFoodsEaten, etc.)
  - [ ] death context (deathCause, lastFoodType, activeEffect)
  - [ ] game context (combo.active, phone.active, phone.pickedUp)
- [ ] Test trackGameOver() fires on death
  - [ ] Die by hitting wall
  - [ ] Check DevTools → Network tab
  - [ ] Verify 'game_over' event sent
  - [ ] Verify all props present (score, duration_seconds, death_cause, food distribution, cognitive stats)
- [ ] Test death_cause tracking
  - [ ] Die by hitting wall → death_cause = 'wall'
  - [ ] Die by hitting self → death_cause = 'self'
- [ ] Test combo_active_on_death flag
  - [ ] Trigger combo mode
  - [ ] Die during combo
  - [ ] Verify combo_active_on_death = true
- [ ] Test phone_active_on_death flag
  - [ ] Receive phone call, Pick Up
  - [ ] Die during countdown
  - [ ] Verify phone_active_on_death = true, phone_picked_up_on_death = true

---

## Developer Context

### 🎯 STORY OBJECTIVE

Fire trackGameOver() event when the player dies, capturing a complete snapshot of the game state, analytics state, and cognitive stats. This event is the RICHEST data point in the entire analytics system — it answers "What killed the player?" (wall vs self), "What did they achieve?" (cognitive stats), and "What were they doing when they died?" (combo, phone, active effect). This event is the foundation for answering all 7 cognitive validation questions.

**CRITICAL SUCCESS FACTORS:**
- trackGameOver() fires on EVERY death
- Snapshot captured BEFORE any state reset
- All analyticsState fields included (totalPhoneCalls, foodTypesEaten, etc.)
- All cognitiveStats fields included (rcSurvived, phoneCallsManaged, etc.)
- foodTypesEaten flattened to individual props (food_growing, food_invincibility, etc.)
- Death context captured (combo active, phone active, active effect)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/game.js` — Call trackGameOver() in onDeath() handler

**Module Dependencies:**
- `analytics.js` → trackGameOver()
- `state.js` → analyticsState, cognitiveStats, deathCause, lastFoodType, activeEffect

**Data Flow:**
```
1. Player dies (wall collision or self collision)
2. game.js: onDeath() called
3. game.js: Snapshot full gameState (BEFORE reset)
4. game.js: Call trackGameOver(gameState)
5. analytics.js: Compute duration_seconds ((Date.now() - gameStartTime) / 1000)
6. analytics.js: Flatten foodTypesEaten → food_growing, food_invincibility, etc.
7. analytics.js: Fire 'game_over' event with full snapshot
8. game.js: Show death screen, reset state, etc.
```

---

### 📦 CONFIG.JS UPDATES

No config changes needed.

---

### 🎨 IMPLEMENTATION DETAILS

**1. game.js — Call trackGameOver() in onDeath():**

```javascript
import { trackGameOver } from './analytics.js';

/**
 * Handle player death.
 * Called when snake hits wall or self.
 */
function onDeath(gameState) {
  // Capture death cause
  gameState.deathCause = determineDeathCause(gameState);  // 'wall' or 'self'

  // Capture last food eaten (for analysis)
  gameState.lastFoodType = gameState.currentFood?.type || 'none';

  // Capture active effect (if any)
  gameState.activeEffect = getActiveEffect(gameState.effects) || null;

  // Track game over (BEFORE any state reset)
  trackGameOver(gameState);

  // Store previous score for next game (Story 12.4)
  sessionStorage.setItem('crazysnake_previous_score', gameState.score.toString());

  // Update session aggregation (Story 12.8)
  updateSessionAggregation(gameState);

  // Show death screen
  showDeathScreen(gameState);

  // ... rest of death logic ...
}

/**
 * Determine how the player died.
 */
function determineDeathCause(gameState) {
  const head = gameState.snake[0];

  // Check wall collision
  if (head.x < 0 || head.x >= CONFIG.GRID_WIDTH || head.y < 0 || head.y >= CONFIG.GRID_HEIGHT) {
    return 'wall';
  }

  // Check self collision
  for (let i = 1; i < gameState.snake.length; i++) {
    if (head.x === gameState.snake[i].x && head.y === gameState.snake[i].y) {
      return 'self';
    }
  }

  return 'unknown';
}

/**
 * Get currently active effect (if any).
 */
function getActiveEffect(effects) {
  if (effects.invincibilityActive) return 'invincibility';
  if (effects.wallPhaseActive) return 'wallPhase';
  if (effects.speedBoostActive) return 'speedBoost';
  if (effects.speedDecreaseActive) return 'speedDecrease';
  if (effects.reverseControlsActive) return 'reverseControls';
  return null;
}
```

**2. analytics.js — trackGameOver() implementation (from Story 12.3):**

Already implemented in Story 12.3. For reference:

```javascript
export function trackGameOver(gameState) {
  const duration = (Date.now() - gameState.analyticsState.gameStartTime) / 1000;

  // Flatten foodTypesEaten
  const foodTypes = gameState.analyticsState.foodTypesEaten;

  const props = {
    session_id: getSessionId(),
    score: gameState.score,
    duration_seconds: Math.round(duration * 10) / 10,  // 1 decimal place
    death_cause: gameState.deathCause || 'unknown',
    foods_eaten: gameState.score,  // Score = foods eaten
    phone_calls_received: gameState.analyticsState.totalPhoneCalls,
    last_food_eaten: gameState.lastFoodType || 'none',
    active_effect_on_death: gameState.activeEffect || null,
    combo_active_on_death: gameState.combo?.active || false,
    phone_active_on_death: gameState.phone?.active || false,
    phone_picked_up_on_death: gameState.phone?.pickedUp || false,

    // Flatten food distribution
    food_growing: foodTypes.growing,
    food_invincibility: foodTypes.invincibility,
    food_wall_phase: foodTypes.wallPhase,
    food_speed_boost: foodTypes.speedBoost,
    food_speed_decrease: foodTypes.speedDecrease,
    food_reverse_controls: foodTypes.reverseControls,

    // Cognitive stats (from Epic 11)
    rc_survived: gameState.cognitiveStats.rcSurvived,
    phone_calls_managed: gameState.cognitiveStats.phoneCallsManaged,
    mystery_foods_eaten: gameState.cognitiveStats.mysteryFoodsEaten,
    combo_multipliers: gameState.cognitiveStats.comboMultipliers,
    pick_up_streak: gameState.cognitiveStats.pickUpStreak,
    peak_combo_score: gameState.cognitiveStats.peakComboScore
  };

  track('game_over', props);
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **trackGameOver() Fires on Death:**
   - Play game, die by hitting wall
   - Check DevTools → Network tab
   - Verify 'game_over' event sent
   - Verify all props present

2. **death_cause Tracking:**
   - Die by hitting wall
   - Verify death_cause = 'wall'
   - Die by hitting self (snake body)
   - Verify death_cause = 'self'

3. **duration_seconds Calculation:**
   - Play for ~30 seconds, die
   - Check duration_seconds value (should be ~30.0)
   - Play for 2 minutes, die
   - Check duration_seconds value (should be ~120.0)

4. **Food Distribution Tracking:**
   - Eat: 5 growing, 2 invincibility, 1 reverseControls
   - Die
   - Verify flattened props:
     - food_growing = 5
     - food_invincibility = 2
     - food_reverse_controls = 1
     - food_wall_phase = 0
     - food_speed_boost = 0
     - food_speed_decrease = 0

5. **Cognitive Stats Tracking:**
   - Survive Reverse Controls 2 times
   - Manage 3 phone calls
   - Eat 1 mystery food
   - Trigger 1 combo (peak score = 15)
   - Die
   - Verify cognitive stats:
     - rc_survived = 2
     - phone_calls_managed = 3
     - mystery_foods_eaten = 1
     - combo_multipliers = 1
     - peak_combo_score = 15

6. **combo_active_on_death Flag:**
   - Trigger combo mode
   - Die during combo (hit wall or self)
   - Verify combo_active_on_death = true

7. **phone_active_on_death Flag:**
   - Receive phone call
   - Pick Up
   - Die during countdown
   - Verify phone_active_on_death = true
   - Verify phone_picked_up_on_death = true

8. **active_effect_on_death Tracking:**
   - Eat invincibility food
   - Die while invincibility active
   - Verify active_effect_on_death = 'invincibility'
   - Die with no active effect
   - Verify active_effect_on_death = null

**Edge Cases:**
- Death with score = 0 (no foods eaten)
- Death during combo + phone + active effect (all flags true)
- Death on first tick (duration_seconds ~0.0)
- Multiple deaths in same session (each fires separate event)

---

### 📚 CRITICAL DATA FORMATS

**death_cause values:**
```javascript
'wall'     // Hit wall boundary
'self'     // Hit own body
'unknown'  // Fallback (should not happen)
```

**active_effect_on_death values:**
```javascript
'invincibility'    // +3 effect active
'wallPhase'        // +5 effect active
'speedBoost'       // +5 effect active
'speedDecrease'    // +5 effect active
'reverseControls'  // +8 effect active
null               // No effect active
```

**duration_seconds calculation:**
```javascript
duration_seconds = (Date.now() - analyticsState.gameStartTime) / 1000
// Rounded to 1 decimal place: Math.round(duration * 10) / 10
```

**Flattened food distribution:**
```javascript
// CORRECT (flat props)
{
  food_growing: 5,
  food_invincibility: 2,
  food_wall_phase: 0,
  food_speed_boost: 3,
  food_speed_decrease: 1,
  food_reverse_controls: 2
}

// WRONG (nested object)
{
  foodTypesEaten: {growing: 5, invincibility: 2, ...}
}
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/analytics-requirements.md` — game_over event spec (richest event)
- `_bmad-output/planning-artifacts/cognitive-analytics-requirements.md` — All 7 validation questions depend on game_over data

**Key Design Principles:**
- **Snapshot BEFORE reset:** Capture full state before any cleanup
- **Complete picture:** What killed player, what they achieved, what they were doing
- **Death context:** Combo, phone, active effect — multi-tasking overload?
- **Cognitive validation:** This event answers ALL 7 questions (combined with other events)

---

### 📋 FRs COVERED

FR96 (game_over event with full snapshot)

**Detailed FR Mapping:**
- FR96: Game over snapshot → trackGameOver() captures analyticsState + cognitiveStats + death context

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] trackGameOver imported in game.js
- [ ] trackGameOver() called in onDeath() handler
- [ ] Call placed BEFORE any state reset
- [ ] deathCause captured ('wall' or 'self')
- [ ] lastFoodType captured (food type before death)
- [ ] activeEffect captured (current effect or null)
- [ ] score prop captured
- [ ] duration_seconds computed and rounded to 1 decimal
- [ ] foods_eaten = score (same value)
- [ ] phone_calls_received captured (totalPhoneCalls)
- [ ] combo_active_on_death flag captured (combo.active)
- [ ] phone_active_on_death flag captured (phone.active)
- [ ] phone_picked_up_on_death flag captured (phone.pickedUp)
- [ ] foodTypesEaten flattened to food_growing, food_invincibility, etc.
- [ ] All cognitiveStats fields included (rcSurvived, phoneCallsManaged, etc.)
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (death during combo, phone, effect; death at score 0; multiple deaths)

**Common Mistakes to Avoid:**
- ❌ Calling trackGameOver() AFTER state reset (snapshot incomplete)
- ❌ Not flattening foodTypesEaten (nested object rejected by Plausible)
- ❌ Not capturing death context (combo, phone, effect flags)
- ❌ Wrong death_cause values ('Wall' vs 'wall', 'Self' vs 'self')
- ❌ Not including cognitiveStats (missing key validation data)

---

## Dev Agent Record

### Agent Model Used

_To be filled by implementing agent_

### Debug Log References

_To be filled during implementation_

### Completion Notes List

_To be filled on completion_

### File List

- js/game.js (modified - call trackGameOver() in onDeath() handler, capture death context)
