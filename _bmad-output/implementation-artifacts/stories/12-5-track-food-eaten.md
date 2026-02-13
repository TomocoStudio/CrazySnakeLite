# Story 12.5: Fire trackFoodEaten() on Food Consumption

**Epic:** 12 - Cognitive Analytics System
**Story ID:** 12.5
**Status:** 🔴 not started
**Created:** 2026-02-08

---

## Story

**As a** developer,
**I want** to track each food consumption event,
**So that** I can analyze food type distributions and blinking food engagement.

## Acceptance Criteria

**Given** I eat any food
**When** the food is consumed
**Then** analytics.trackFoodEaten(gameState) is called
**And** the event includes:
- food_type (string)
- is_blinking (boolean)
- snake_length (current length after eating)
- score (current score)
- time_to_eat (Date.now() - analyticsState.foodSpawnTime)
- rc_active (was reverse controls the previous effect?)

**Given** analyticsState.foodSpawnTime is set
**When** food is consumed
**Then** time_to_eat calculates how long the food was on screen

**Given** reverse controls was active before eating
**When** food is consumed
**Then** rc_active = true (indicates player navigated with RC)

## Tasks / Subtasks

- [ ] Import trackFoodEaten from analytics.js in game.js
- [ ] Call trackFoodEaten() in onFoodEaten() handler
  - [ ] Call after score incremented
  - [ ] Call before applying new food effect
  - [ ] Pass full gameState
- [ ] Verify analyticsState.foodSpawnTime set
  - [ ] Already implemented in Story 12.2
  - [ ] Set in onFoodSpawn()
- [ ] Verify food properties available
  - [ ] food.type (growing, invincibility, wallPhase, speedBoost, speedDecrease, reverseControls)
  - [ ] food.isBlinking (boolean)
  - [ ] gameState.snake.length
  - [ ] gameState.score
  - [ ] gameState.effects.reverseControlsActive
- [ ] Test trackFoodEaten() fires
  - [ ] Eat growing food
  - [ ] Check DevTools → Network tab
  - [ ] Verify 'food_eaten' event sent
  - [ ] Verify all props present
- [ ] Test blinking food tracking
  - [ ] Eat blinking food (mystery food)
  - [ ] Verify is_blinking = true in event
- [ ] Test RC active tracking
  - [ ] Eat Reverse Controls food
  - [ ] Navigate with RC active
  - [ ] Eat next food
  - [ ] Verify rc_active = true in event

---

## Developer Context

### 🎯 STORY OBJECTIVE

Fire trackFoodEaten() event on every food consumption. This story tracks what foods players eat, how long foods stay on screen (time_to_eat), and whether players engage with blinking mystery foods. The rc_active flag captures whether the player successfully navigated with Reverse Controls active — a key cognitive load indicator. This event is the foundation for answering "Is blinking food training uncertainty tolerance?" (Q3).

**CRITICAL SUCCESS FACTORS:**
- trackFoodEaten() fires on EVERY food consumption
- time_to_eat computed from analyticsState.foodSpawnTime
- rc_active captures if RC was active before eating
- is_blinking tracks mystery food engagement
- Event fires BEFORE applying new food effect (captures previous state)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/game.js` — Call trackFoodEaten() in onFoodEaten() handler

**Module Dependencies:**
- `analytics.js` → trackFoodEaten()
- `state.js` → analyticsState.foodSpawnTime, effects.reverseControlsActive

**Data Flow:**
```
1. Player eats food
2. game.js: onFoodEaten() called
3. game.js: Increment score
4. game.js: Check effects.reverseControlsActive (rc_active flag)
5. game.js: Call trackFoodEaten(gameState)
6. analytics.js: Compute time_to_eat (Date.now() - foodSpawnTime)
7. analytics.js: Fire 'food_eaten' event with {session_id, food_type, is_blinking, snake_length, score, time_to_eat, rc_active}
8. game.js: Apply new food effect (reverseControlsActive may change)
```

---

### 📦 CONFIG.JS UPDATES

No config changes needed.

---

### 🎨 IMPLEMENTATION DETAILS

**1. game.js — Call trackFoodEaten() in onFoodEaten():**

```javascript
import { trackFoodEaten } from './analytics.js';

/**
 * Handle food consumption.
 * Called when snake head collides with food.
 */
function onFoodEaten(food, gameState) {
  // Award base food score
  const baseScore = getFoodScore(food.type);
  gameState.score += baseScore;

  // Update analyticsState (already implemented in Story 12.2)
  gameState.analyticsState.foodTypesEaten[food.type] += 1;

  // Track food consumption (BEFORE applying new effect)
  trackFoodEaten(gameState);

  // Apply food effect (may change reverseControlsActive)
  applyFoodEffect(food.type, gameState);

  // Grow snake
  growSnake(gameState.snake);

  // Spawn new food
  spawnFood(gameState);

  // ... rest of food consumption logic ...
}
```

**2. analytics.js — trackFoodEaten() implementation (from Story 12.3):**

Already implemented in Story 12.3. For reference:

```javascript
export function trackFoodEaten(gameState) {
  const food = gameState.currentFood;
  const timeToEat = Date.now() - gameState.analyticsState.foodSpawnTime;

  const props = {
    session_id: getSessionId(),
    food_type: food.type,
    is_blinking: food.isBlinking || false,
    snake_length: gameState.snake.length,
    score: gameState.score,
    time_to_eat: timeToEat,
    rc_active: gameState.effects.reverseControlsActive || false
  };

  track('food_eaten', props);
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **trackFoodEaten() Fires on Food Consumption:**
   - Start game, eat first food
   - Check DevTools → Network tab
   - Verify 'food_eaten' event sent
   - Verify props: {session_id, food_type, is_blinking, snake_length, score, time_to_eat, rc_active}

2. **Food Type Tracking:**
   - Eat each food type (growing, invincibility, wallPhase, speedBoost, speedDecrease, reverseControls)
   - Verify food_type prop matches food.type

3. **Blinking Food (is_blinking = true):**
   - Play until blinking food spawns (score > threshold)
   - Eat blinking food
   - Verify is_blinking = true in event

4. **Snake Length Tracking:**
   - Start game (snake length = 3)
   - Eat 5 foods
   - Check 5th food_eaten event
   - Verify snake_length = 8 (3 + 5)

5. **time_to_eat Calculation:**
   - Eat food immediately after spawn
   - Check time_to_eat value (should be < 1000ms)
   - Wait 3 seconds, then eat food
   - Check time_to_eat value (should be ~3000ms)

6. **rc_active Flag (Reverse Controls):**
   - Eat Reverse Controls food
   - Navigate with RC active
   - Eat next food
   - Verify rc_active = true in food_eaten event
   - Eat third food (RC no longer active)
   - Verify rc_active = false in food_eaten event

7. **Event Fires Before Effect Applied:**
   - Eat Reverse Controls food
   - Check food_eaten event
   - Verify rc_active = false (RC not active YET when event fires)

**Edge Cases:**
- Eating food very fast (time_to_eat < 100ms)
- Eating multiple foods in combo mode (each food fires separate event)
- Eating blinking food while RC active (both flags true)

---

### 📚 CRITICAL DATA FORMATS

**Food types (must match exactly):**
```javascript
'growing'          // +1 growing food
'invincibility'    // +3 invincibility
'wallPhase'        // +5 wall phase
'speedBoost'       // +5 speed boost
'speedDecrease'    // +5 speed decrease
'reverseControls'  // +8 reverse controls
```

**time_to_eat calculation:**
```javascript
time_to_eat = Date.now() - analyticsState.foodSpawnTime  // Milliseconds
```

**rc_active flag:**
```javascript
rc_active = gameState.effects.reverseControlsActive || false  // Boolean
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/analytics-requirements.md` — food_eaten event spec
- `_bmad-output/planning-artifacts/cognitive-analytics-requirements.md` — Q3 (blinking food uncertainty)

**Key Design Principles:**
- **Per-food tracking:** Every food eaten fires an event (not aggregated)
- **time_to_eat = engagement metric:** Long time = cautious play, short time = confidence
- **rc_active = cognitive load indicator:** Player navigated with reversed controls
- **is_blinking = uncertainty tolerance:** Did player eat mystery food?

---

### 📋 FRs COVERED

FR97 (food_eaten event)

**Detailed FR Mapping:**
- FR97: Track food consumption → trackFoodEaten() called in onFoodEaten()

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] trackFoodEaten imported in game.js
- [ ] trackFoodEaten() called in onFoodEaten() handler
- [ ] Call placed AFTER score incremented
- [ ] Call placed BEFORE applying new food effect
- [ ] analyticsState.foodSpawnTime set in onFoodSpawn() (Story 12.2)
- [ ] food.type prop captured
- [ ] food.isBlinking prop captured
- [ ] gameState.snake.length prop captured
- [ ] gameState.score prop captured
- [ ] time_to_eat computed (Date.now() - foodSpawnTime)
- [ ] rc_active flag captured (effects.reverseControlsActive)
- [ ] Event fires on EVERY food consumption
- [ ] Blinking food tracking tested (is_blinking = true)
- [ ] RC active tracking tested (rc_active = true)
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (fast eating, combo mode, blinking + RC)

**Common Mistakes to Avoid:**
- ❌ Calling trackFoodEaten() AFTER applying new effect (rc_active flag wrong)
- ❌ Not computing time_to_eat (missing foodSpawnTime)
- ❌ Misspelling food types (must match food.type exactly)
- ❌ Using gameState.snake.length before growing snake (length off by 1)
- ❌ Not firing event for blinking foods (must fire for ALL foods)

---

## Dev Agent Record

### Agent Model Used

_To be filled by implementing agent_

### Debug Log References

_To be filled during implementation_

### Completion Notes List

_To be filled on completion_

### File List

- js/game.js (modified - call trackFoodEaten() in onFoodEaten() handler)
