# Story 12.3: Implement analytics.js Module with Core Event Functions

**Epic:** 12 - Cognitive Analytics System
**Story ID:** 12.3
**Status:** 🟢 review
**Created:** 2026-02-08

---

## Story

**As a** developer,
**I want** analytics.js to fire Plausible custom events,
**So that** we capture cognitive behavioral data.

## Acceptance Criteria

**Given** analytics.js is loaded
**When** any track function is called
**Then** the function checks CONFIG.ANALYTICS_ENABLED first
**And** if disabled, returns immediately (no event fired)
**And** if enabled, calls window.plausible(eventName, { props })

**Given** analytics.js fires an event
**When** the event is sent
**Then** all props are string or number values (no nested objects)
**And** nested objects are flattened (e.g., food_growing, food_invincibility, etc.)

**Given** I call analytics.trackGameStart()
**When** the event fires
**Then** it sends:
- event: 'game_start'
- props: {session_id, is_first_game, previous_score}

**Given** I call analytics.trackFoodEaten(gameState)
**When** the event fires
**Then** it sends:
- event: 'food_eaten'
- props: {session_id, food_type, is_blinking, snake_length, score, time_to_eat, rc_active}

**Given** I call analytics.trackPhoneCall(gameState, action)
**When** the event fires
**Then** it sends:
- event: 'phone_call'
- props: {session_id, action ('end'|'pickup'), caller_name, reaction_time_ms, pickup_bonus, call_sequence_number, combo_active_during_call, score_at_call}

**Given** I call analytics.trackGameOver(gameState)
**When** the event fires
**Then** it sends:
- event: 'game_over'
- props: {session_id, score, duration_seconds, death_cause, foods_eaten, phone_calls_received, last_food_eaten, active_effect_on_death, combo_active_on_death, phone_active_on_death, phone_picked_up_on_death, food_growing, food_invincibility, food_wall_phase, food_speed_boost, food_speed_decrease, food_reverse_controls, rc_survived, phone_calls_managed, mystery_foods_eaten, combo_multipliers, pick_up_streak, peak_combo_score}

**Given** I call analytics.trackSessionEnd()
**When** the event fires
**Then** it sends:
- event: 'session_end'
- props: {session_id, total_games_played, total_time_seconds, highest_score, total_foods_eaten, food_breakdown (flattened), total_phone_calls, avg_dismissal_speed_ms}

## Tasks / Subtasks

- [ ] Create js/analytics.js module
  - [ ] Import CONFIG from config.js
  - [ ] Define getSessionId() helper
  - [ ] Define track() helper (wrapper for window.plausible)
  - [ ] Implement trackGameStart()
  - [ ] Implement trackFoodEaten(gameState)
  - [ ] Implement trackPhoneCall(gameState, action)
  - [ ] Implement trackGameOver(gameState)
  - [ ] Implement trackSessionEnd()
  - [ ] Export all track functions
- [ ] Implement getSessionId() helper
  - [ ] Check sessionStorage for 'crazysnake_session_id'
  - [ ] If exists, return stored UUID
  - [ ] If not, generate UUID v4
  - [ ] Store UUID in sessionStorage
  - [ ] Return UUID
- [ ] Implement track() helper
  - [ ] Check CONFIG.ANALYTICS_ENABLED, return if false
  - [ ] Check if window.plausible exists, return if not
  - [ ] Call window.plausible(eventName, { props })
  - [ ] Fire-and-forget (no await, no error handling)
- [ ] Implement trackGameStart()
  - [ ] Get session_id
  - [ ] Check sessionStorage for isFirstGame flag
  - [ ] Get previousScore from session
  - [ ] Call track('game_start', {session_id, is_first_game, previous_score})
- [ ] Implement trackFoodEaten(gameState)
  - [ ] Extract: food_type, is_blinking, snake_length, score
  - [ ] Compute time_to_eat (Date.now() - analyticsState.foodSpawnTime)
  - [ ] Check rc_active (was reverseControls active before eating?)
  - [ ] Call track('food_eaten', props)
- [ ] Implement trackPhoneCall(gameState, action)
  - [ ] Extract: caller_name, pickup_bonus, score_at_call
  - [ ] Compute reaction_time_ms (Date.now() - analyticsState.phoneCallShowTime)
  - [ ] Get call_sequence_number (analyticsState.totalPhoneCalls)
  - [ ] Check combo_active_during_call
  - [ ] Call track('phone_call', props)
- [ ] Implement trackGameOver(gameState)
  - [ ] Compute duration_seconds ((Date.now() - gameStartTime) / 1000)
  - [ ] Flatten foodTypesEaten → food_growing, food_invincibility, etc.
  - [ ] Include all cognitiveStats fields
  - [ ] Call track('game_over', props)
- [ ] Implement trackSessionEnd()
  - [ ] Read sessionStorage for aggregated session data
  - [ ] Flatten food breakdown
  - [ ] Call track('session_end', props)
- [ ] Test all track functions
  - [ ] Call each function with mock gameState
  - [ ] Verify events sent to Plausible (DevTools → Network tab)
  - [ ] Verify all props are strings or numbers (no nested objects)
  - [ ] Verify CONFIG.ANALYTICS_ENABLED = false prevents events

---

## Developer Context

### 🎯 STORY OBJECTIVE

Create the analytics.js module — the core event tracking layer that fires Plausible custom events. This module defines 5 track functions (trackGameStart, trackFoodEaten, trackPhoneCall, trackGameOver, trackSessionEnd) that READ from analyticsState (Story 12.2) and cognitiveStats (Epic 11), compute derived values (durations, rates, reactions), and fire events to Plausible. All events are fire-and-forget, non-blocking, and respect CONFIG.ANALYTICS_ENABLED.

**CRITICAL SUCCESS FACTORS:**
- All track functions check CONFIG.ANALYTICS_ENABLED first
- All props are flat (strings or numbers, no nested objects)
- getSessionId() generates/retrieves UUID from sessionStorage
- track() helper wraps window.plausible with guard clauses
- Fire-and-forget (no awaits, no blocking)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Create:**
- `js/analytics.js` — Core analytics module with 5 track functions

**Module Dependencies:**
- `config.js` → CONFIG.ANALYTICS_ENABLED
- `state.js` → analyticsState, cognitiveStats (read only)
- `window.plausible` → External Plausible script (Story 12.1)

**Data Flow:**
```
1. Game event occurs (food eaten, phone dismissed, death)
2. game.js calls analytics.trackEvent(gameState)
3. analytics.js reads analyticsState + cognitiveStats
4. analytics.js computes derived values (time_to_eat, reaction_time_ms, duration_seconds)
5. analytics.js flattens nested objects (foodTypesEaten → food_growing, food_invincibility, etc.)
6. analytics.js calls track(eventName, props)
7. track() checks CONFIG.ANALYTICS_ENABLED
8. track() calls window.plausible(eventName, {props})
9. Plausible receives event (fire-and-forget)
```

---

### 📦 CONFIG.JS UPDATES

No config changes (CONFIG.ANALYTICS_ENABLED already added in Story 12.1).

---

### 🎨 IMPLEMENTATION DETAILS

**1. js/analytics.js — Module structure:**

```javascript
import { CONFIG } from './config.js';

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Get or generate session ID (UUID v4).
 * Stored in sessionStorage, persists across games in same browser session.
 */
function getSessionId() {
  const STORAGE_KEY = 'crazysnake_session_id';
  let sessionId = sessionStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    // Generate UUID v4
    sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    sessionStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Fire analytics event to Plausible.
 * Fire-and-forget, non-blocking, graceful degradation.
 */
function track(eventName, props = {}) {
  // Check if analytics enabled
  if (!CONFIG.ANALYTICS_ENABLED) {
    return;
  }

  // Check if Plausible loaded
  if (typeof window.plausible === 'undefined') {
    return;
  }

  // Fire event (non-blocking)
  window.plausible(eventName, { props });
}

// ============================================================================
// PUBLIC TRACK FUNCTIONS
// ============================================================================

/**
 * Track game start.
 * Called when new game begins.
 */
export function trackGameStart(isFirstGame = false, previousScore = null) {
  const props = {
    session_id: getSessionId(),
    is_first_game: isFirstGame,
    previous_score: previousScore || 0
  };

  track('game_start', props);
}

/**
 * Track food eaten.
 * Called when player consumes food.
 */
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

/**
 * Track phone call dismissal.
 * Called when player picks up or ends call.
 */
export function trackPhoneCall(gameState, action) {
  const reactionTime = Date.now() - gameState.analyticsState.phoneCallShowTime;

  const props = {
    session_id: getSessionId(),
    action: action,  // 'end' or 'pickup'
    caller_name: gameState.phone.callerName || 'Unknown',
    reaction_time_ms: reactionTime,
    pickup_bonus: action === 'pickup' ? gameState.phone.pickupBonus : null,
    call_sequence_number: gameState.analyticsState.totalPhoneCalls,
    combo_active_during_call: gameState.combo?.active || false,
    score_at_call: gameState.score
  };

  track('phone_call', props);
}

/**
 * Track game over.
 * Called when player dies.
 */
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

/**
 * Track session end.
 * Called when browser tab closes (beforeunload).
 */
export function trackSessionEnd() {
  // Read aggregated session data from sessionStorage
  const totalGames = parseInt(sessionStorage.getItem('crazysnake_total_games') || '0');
  const sessionStartTime = parseInt(sessionStorage.getItem('crazysnake_session_start') || Date.now());
  const highestScore = parseInt(sessionStorage.getItem('crazysnake_highest_score') || '0');
  const totalFoods = parseInt(sessionStorage.getItem('crazysnake_total_foods') || '0');
  const totalPhoneCalls = parseInt(sessionStorage.getItem('crazysnake_total_phone_calls') || '0');
  const avgDismissalSpeed = parseInt(sessionStorage.getItem('crazysnake_avg_dismissal_speed') || '0');

  // Flatten food breakdown
  const foodBreakdown = JSON.parse(sessionStorage.getItem('crazysnake_food_breakdown') || '{}');

  const totalTime = (Date.now() - sessionStartTime) / 1000;

  const props = {
    session_id: getSessionId(),
    total_games_played: totalGames,
    total_time_seconds: Math.round(totalTime),
    highest_score: highestScore,
    total_foods_eaten: totalFoods,
    food_growing: foodBreakdown.growing || 0,
    food_invincibility: foodBreakdown.invincibility || 0,
    food_wall_phase: foodBreakdown.wallPhase || 0,
    food_speed_boost: foodBreakdown.speedBoost || 0,
    food_speed_decrease: foodBreakdown.speedDecrease || 0,
    food_reverse_controls: foodBreakdown.reverseControls || 0,
    total_phone_calls: totalPhoneCalls,
    avg_dismissal_speed_ms: avgDismissalSpeed
  };

  track('session_end', props);
}
```

**2. Listen to beforeunload for session end:**

Add to `game.js` or `main.js`:

```javascript
import { trackSessionEnd } from './analytics.js';

// Track session end when browser tab closes
window.addEventListener('beforeunload', () => {
  trackSessionEnd();
});
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **getSessionId() Generates UUID:**
   - Clear sessionStorage
   - Call getSessionId()
   - Verify UUID format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
   - Verify stored in sessionStorage as 'crazysnake_session_id'

2. **getSessionId() Persists Across Games:**
   - Play 3 games in same browser session
   - Check sessionStorage after each game
   - Verify same session_id for all games

3. **track() Respects CONFIG.ANALYTICS_ENABLED:**
   - Set CONFIG.ANALYTICS_ENABLED = false
   - Call track('test_event', {foo: 'bar'})
   - Verify no event sent to Plausible (DevTools → Network tab)

4. **track() Graceful Degradation:**
   - Block Plausible script
   - Call track('test_event', {foo: 'bar'})
   - Verify no console errors
   - Verify game continues normally

5. **trackGameStart() Fires:**
   - Start new game
   - Check DevTools → Network tab
   - Verify 'game_start' event sent
   - Verify props: {session_id, is_first_game, previous_score}

6. **trackFoodEaten() Fires:**
   - Eat food
   - Check DevTools → Network tab
   - Verify 'food_eaten' event sent
   - Verify props: {session_id, food_type, is_blinking, snake_length, score, time_to_eat, rc_active}

7. **trackPhoneCall() Fires:**
   - Dismiss phone call (Pick Up or End)
   - Check DevTools → Network tab
   - Verify 'phone_call' event sent
   - Verify props: {session_id, action, caller_name, reaction_time_ms, pickup_bonus, call_sequence_number, combo_active_during_call, score_at_call}

8. **trackGameOver() Fires:**
   - Die
   - Check DevTools → Network tab
   - Verify 'game_over' event sent
   - Verify all props present (score, duration_seconds, death_cause, food_growing, rc_survived, etc.)
   - Verify foodTypesEaten flattened (food_growing, food_invincibility, etc.)

9. **trackSessionEnd() Fires:**
   - Close browser tab (or manually call trackSessionEnd())
   - Check DevTools → Network tab
   - Verify 'session_end' event sent
   - Verify props: {session_id, total_games_played, total_time_seconds, highest_score, food breakdown}

**Edge Cases:**
- Plausible script blocked (graceful degradation, no errors)
- CONFIG.ANALYTICS_ENABLED = false (no events sent)
- Multiple events fired rapidly (all buffered and sent)
- Session end fires before events sent (events lost, acceptable)

---

### 📚 CRITICAL DATA FORMATS

**UUID v4 format:**
```javascript
'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'  // CORRECT (4 in 3rd group, y in 4th)
'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx'  // WRONG (not UUID v4)
```

**Flattened food types:**
```javascript
// CORRECT (flat props)
{
  food_growing: 5,
  food_invincibility: 2,
  food_wall_phase: 3
}

// WRONG (nested object)
{
  foodTypesEaten: {
    growing: 5,
    invincibility: 2
  }
}
```

**Event names:**
```javascript
'game_start'     // CORRECT (snake_case)
'gameStart'      // WRONG (camelCase not recognized by Plausible)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/analytics-requirements.md` — Event schemas
- `_bmad-output/planning-artifacts/cognitive-analytics-requirements.md` — Celia's 7 validation questions

**Key Design Principles:**
- **Fire-and-forget:** No awaits, no blocking, no error handling
- **Graceful degradation:** Game works if analytics fails
- **Flat props:** Plausible requires strings or numbers, no nested objects
- **Session persistence:** UUID in sessionStorage, cleared on browser close

---

### 📋 FRs COVERED

FR95-FR99 (all analytics events)

**Detailed FR Mapping:**
- FR95: Plausible integration → track() helper
- FR96: Game over snapshot → trackGameOver()
- FR97: Food consumption tracking → trackFoodEaten()
- FR98: Phone call tracking → trackPhoneCall()
- FR99: Session aggregation → trackSessionEnd()

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] js/analytics.js module created
- [ ] getSessionId() implemented (UUID v4 generation)
- [ ] getSessionId() stores UUID in sessionStorage
- [ ] getSessionId() retrieves stored UUID on subsequent calls
- [ ] track() helper implemented
- [ ] track() checks CONFIG.ANALYTICS_ENABLED
- [ ] track() checks window.plausible exists
- [ ] track() calls window.plausible(eventName, {props})
- [ ] trackGameStart() implemented with correct props
- [ ] trackFoodEaten() implemented with correct props
- [ ] trackFoodEaten() computes time_to_eat
- [ ] trackPhoneCall() implemented with correct props
- [ ] trackPhoneCall() computes reaction_time_ms
- [ ] trackGameOver() implemented with correct props
- [ ] trackGameOver() flattens foodTypesEaten
- [ ] trackGameOver() includes cognitiveStats fields
- [ ] trackSessionEnd() implemented with correct props
- [ ] trackSessionEnd() flattens food breakdown
- [ ] beforeunload listener added for session end
- [ ] All props are strings or numbers (no nested objects)
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (Plausible blocked, CONFIG disabled)

**Common Mistakes to Avoid:**
- ❌ Nested objects in props (Plausible rejects them)
- ❌ Using await with window.plausible (blocking, unnecessary)
- ❌ Not checking CONFIG.ANALYTICS_ENABLED (fires events when disabled)
- ❌ Not checking window.plausible exists (console errors)
- ❌ Wrong UUID format (not UUID v4)
- ❌ Using camelCase event names (should be snake_case)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

N/A - Module creation, test via browser DevTools Network tab

### Completion Notes List

**Implementation Summary:**
- Created complete analytics.js module with 5 Plausible event tracking functions
- Implemented UUID v4 session ID generation with sessionStorage persistence
- Implemented track() helper with CONFIG.ANALYTICS_ENABLED and window.plausible guards
- All event props are flat (strings/numbers only, no nested objects)
- Preserved existing phone call tracking from Story 9.7
- Added beforeunload listener in main.js for session end tracking

**Track Functions Implemented:**
1. **trackGameStart(isFirstGame, previousScore)** - Fires 'game_start' event
2. **trackFoodEaten(gameState)** - Fires 'food_eaten' event with time_to_eat calculation
3. **trackPhoneCallEvent(gameState, action)** - Fires 'phone_call' event with reaction time
4. **trackGameOver(gameState)** - Fires 'game_over' event with flattened food distribution
5. **trackSessionEnd()** - Fires 'session_end' event with aggregated session data

**Helper Functions:**
- **getSessionId()** - Generates/retrieves UUID v4 from sessionStorage ('crazysnake_session_id')
- **track(eventName, props)** - Wrapper for window.plausible with graceful degradation

**Key Design Decisions:**
- Named new phone function `trackPhoneCallEvent()` to avoid conflicts with existing `trackPhoneCall(event)` from Story 9.7
- Preserved all legacy phone tracking functions for backward compatibility
- Fire-and-forget pattern (no awaits, no error handling)
- All nested objects flattened (foodTypesEaten → food_growing, food_invincibility, etc.)
- CONFIG.ANALYTICS_ENABLED checked first in track() for global disable
- window.plausible guard prevents console errors if script blocked

**Next Steps (Stories 12.4-12.8):**
- Wire up trackGameStart() in game initialization
- Wire up trackFoodEaten() in food consumption handler
- Wire up trackPhoneCallEvent() in phone dismissal handlers
- Wire up trackGameOver() in death handler
- Session aggregation data needs to be populated in sessionStorage

### File List

- js/analytics.js (modified - added 5 Plausible track functions + helpers)
- js/main.js (modified - add beforeunload listener + import trackSessionEnd)

---

## Change Log

**2026-02-16** - Story 12.3 implementation complete
- Created analytics.js module with 5 Plausible event tracking functions
- Implemented UUID v4 session ID generation (getSessionId helper)
- Implemented track() wrapper with CONFIG.ANALYTICS_ENABLED and window.plausible guards
- Added beforeunload listener for trackSessionEnd in main.js
- All event props flattened (no nested objects)
- Preserved backward compatibility with existing phone tracking from Story 9.7
- Ready for Stories 12.4-12.8 (wire up track function calls)
