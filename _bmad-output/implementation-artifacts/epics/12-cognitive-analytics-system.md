# Epic 12: Cognitive Analytics System

**Status:** 🔴 NOT STARTED
**Created:** 2026-02-08
**Completed:** —

---

## Overview

Implement a two-tier cognitive analytics system to validate the Brain Gym thesis. Tier 1 (cognitiveStats) is player-facing achievements already tracked in Epic 11. Tier 2 (analyticsState) provides denominators, timestamps, and distributions needed to answer Celia's 7 cognitive validation questions. Create analytics.js module that fires non-blocking events to Plausible (privacy-first, cookie-free, GDPR-compliant). Track 5 core events: game_start, game_over, food_eaten, phone_call_dismissed, session_end. All tracking is fire-and-forget with graceful degradation — the game is always playable even if analytics fails.

**FRs covered:** FR95-FR99 (Analytics tracking), references `analytics-requirements.md` and `cognitive-analytics-requirements.md`

**Value:** Answers the critical questions: "Is the brain gym working? Are players engaging with cognitive systems? Is divided attention, uncertainty tolerance, and executive function actually being trained?"

---

## Stories

### Story 12.1: Set Up Plausible Integration

**As a** developer,
**I want** to integrate Plausible analytics,
**So that** we can track custom events without violating user privacy.

**Acceptance Criteria:**

**Given** the game loads
**When** the index.html is rendered
**Then** the Plausible tracking script is loaded asynchronously:
```html
<script async src="https://plausible.io/js/pa-5lDK3arREKbPzQ_2_Jhfm.js"></script>
```
**And** the inline queue snippet initializes window.plausible:
```javascript
window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
plausible.init()
```

**Given** Plausible script fails to load
**When** the game runs
**Then** the game continues normally
**And** analytics.js calls fail silently (no errors in console)
**And** gameplay is unaffected

**Given** analytics events are fired
**When** window.plausible() is called
**Then** events are buffered in plausible.q until the script loads
**And** buffered events are sent when Plausible becomes available

**Given** CONFIG.ANALYTICS_ENABLED = false (dev mode)
**When** any analytics function is called
**Then** no events are fired
**And** tracking is disabled

**Technical Notes:**
- Add Plausible script to index.html <head>
- Add CONFIG.ANALYTICS_ENABLED = true in config.js (default)
- analytics.js checks CONFIG.ANALYTICS_ENABLED before all calls
- Guard: if (typeof plausible === 'undefined') return; (fail silently)

**FRs:** FR95

---

### Story 12.2: Implement analyticsState Tracking (Tier 2)

**As a** developer,
**I want** to track internal analytics state during gameplay,
**So that** I can compute rates, distributions, and timestamps for cognitive validation.

**Acceptance Criteria:**

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

**Technical Notes:**
- Add analyticsState to gameState
- Update in game.js event handlers:
  - onFoodSpawn(): foodSpawnTime, totalBlinkingFoodsSpawned
  - onFoodEaten(): foodTypesEaten, totalRCFoodsEaten, rcActivationTick
  - onPhoneShow(): totalPhoneCalls, phoneCallShowTime, comboPhoneOverlaps
  - onPhoneDismiss(): totalPickUps or totalEnds, pickUpCompletionTime
  - onComboActivate(): totalCombosTriggered
  - onComboScore(): comboScores.push(value)
  - onMilestone(): milestonesReached.push(score)

**FRs:** Supports FR96-FR99

---

### Story 12.3: Implement analytics.js Module with Core Event Functions

**As a** developer,
**I want** analytics.js to fire Plausible custom events,
**So that** we capture cognitive behavioral data.

**Acceptance Criteria:**

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

**Technical Notes:**
- Create js/analytics.js with 5 track functions
- Each function: if (!CONFIG.ANALYTICS_ENABLED) return;
- Helper: getSessionId() → generates/retrieves UUID from sessionStorage
- Helper: track(eventName, props) → calls window.plausible() with guard clause
- Flatten nested objects: food_breakdown → food_growing, food_invincibility, etc.
- All calls are fire-and-forget (no awaits, no error handling visible to user)

**FRs:** FR95-FR99

---

### Story 12.4: Fire trackGameStart() on New Game

**As a** developer,
**I want** to track when games start,
**So that** I can compute completion rates.

**Acceptance Criteria:**

**Given** I click "New Game" from menu
**When** the game initializes
**Then** analytics.trackGameStart(isFirstGame: true, previousScore: null) is called

**Given** I click "Play Again" from game over
**When** the new game starts
**Then** analytics.trackGameStart(isFirstGame: false, previousScore: lastGameScore) is called

**Given** trackGameStart() is called
**When** the event fires
**Then** the session_id persists across multiple games in the same browser session

**Technical Notes:**
- Call in game.js startNewGame() or similar
- Track isFirstGame with sessionStorage flag
- Store previousScore from last game in session

**FRs:** FR95

---

### Story 12.5: Fire trackFoodEaten() on Food Consumption

**As a** developer,
**I want** to track each food consumption event,
**So that** I can analyze food type distributions and blinking food engagement.

**Acceptance Criteria:**

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

**Technical Notes:**
- Call in game.js onFoodEaten() handler
- Pass full gameState to trackFoodEaten()
- Calculate time_to_eat: Date.now() - analyticsState.foodSpawnTime
- Check effects.reverseControlsActive for rc_active flag

**FRs:** FR97

---

### Story 12.6: Fire trackPhoneCall() on Phone Dismissal

**As a** developer,
**I want** to track phone call interactions,
**So that** I can validate divided attention training and Pick Up risk/reward balance.

**Acceptance Criteria:**

**Given** I dismiss a phone call (End or Pick Up)
**When** the dismissal completes
**Then** analytics.trackPhoneCall(gameState, action) is called
**And** the event includes:
- action ('end' | 'pickup')
- caller_name
- reaction_time_ms (Date.now() - analyticsState.phoneCallShowTime)
- pickup_bonus (Fibonacci value if Pick Up, null if End)
- call_sequence_number (analyticsState.totalPhoneCalls)
- combo_active_during_call (boolean)
- score_at_call

**Given** I Pick Up a call
**When** the countdown expires
**Then** the event records pickup_bonus with the Fibonacci value

**Given** I End a call
**When** the dismissal completes
**Then** the event records action: 'end', pickup_bonus: null

**Given** a phone call occurs during combo mode
**When** the event fires
**Then** combo_active_during_call = true

**Technical Notes:**
- Call in phone.js dismissPhoneCall() or game.js phone handler
- Compute reaction_time_ms: Date.now() - analyticsState.phoneCallShowTime
- Pass action ('end' | 'pickup') parameter
- Check combo.active for combo_active_during_call flag

**FRs:** FR98

---

### Story 12.7: Fire trackGameOver() on Death

**As a** developer,
**I want** to capture a complete snapshot at death,
**So that** I can analyze what kills players and what cognitive stats they achieved.

**Acceptance Criteria:**

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

**Technical Notes:**
- Call in game.js onDeath() handler
- Snapshot ALL state before any reset occurs
- Flatten foodTypesEaten: food_growing, food_invincibility, etc.
- Include all cognitiveStats fields
- Compute duration_seconds: (Date.now() - analyticsState.gameStartTime) / 1000

**FRs:** FR96

---

### Story 12.8: Fire trackSessionEnd() on Browser Unload

**As a** developer,
**I want** to track session-level aggregates when the player leaves,
**So that** I can compute plays per visit and return rates.

**Acceptance Criteria:**

**Given** I close the browser tab
**When** the beforeunload event fires
**Then** analytics.trackSessionEnd() is called
**And** the event includes:
- session_id
- total_games_played (count from sessionStorage)
- total_time_seconds (Date.now() - sessionStartTime)
- highest_score (max score this session)
- total_foods_eaten (sum across all games)
- Food breakdown (flattened): food_growing, food_invincibility, etc.
- total_phone_calls (sum across all games)
- avg_dismissal_speed_ms (average reaction time)

**Given** I play 4 games in one session
**When** trackSessionEnd() fires
**Then** total_games_played = 4

**Given** my scores are [10, 25, 40, 32]
**When** trackSessionEnd() fires
**Then** highest_score = 40

**Technical Notes:**
- Listen to window beforeunload event
- Store session data in sessionStorage:
  - sessionStartTime (on first game)
  - totalGamesPlayed (increment on each game)
  - highestScore (max across games)
  - aggregated food counts
  - aggregated phone data
- Compute avg_dismissal_speed_ms from stored reaction times

**FRs:** FR99

---

### Story 12.9: Implement Session ID Generation and Persistence

**As a** developer,
**I want** a unique session ID that persists across games,
**So that** I can correlate multiple games from the same player visit.

**Acceptance Criteria:**

**Given** I load the game for the first time
**When** getSessionId() is called
**Then** a new UUID is generated
**And** the UUID is stored in sessionStorage as 'crazysnake_session_id'

**Given** I play multiple games in the same browser session
**When** getSessionId() is called
**Then** the same UUID is returned for all games

**Given** I close the browser and return later
**When** I load the game
**Then** a NEW session ID is generated (sessionStorage cleared)

**Given** the UUID is generated
**When** checking the format
**Then** it follows UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx

**Technical Notes:**
- Create getSessionId() helper in analytics.js
- Check sessionStorage.getItem('crazysnake_session_id')
- If null, generate UUID v4 and store
- If exists, return stored value
- UUID generation: 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, ...)

**FRs:** Supports all events

---

### Story 12.10: Test Graceful Degradation and Performance

**As a** developer,
**I want** to verify analytics never blocks gameplay,
**So that** players have a flawless experience even if tracking fails.

**Acceptance Criteria:**

**Given** Plausible script is blocked by ad-blocker
**When** the game runs
**Then** no console errors appear
**And** the game plays at 60 FPS
**And** all gameplay features work normally

**Given** CONFIG.ANALYTICS_ENABLED = false
**When** any analytics function is called
**Then** the function returns immediately (no-op)
**And** no events are sent

**Given** analytics events fire during gameplay
**When** the game is running
**Then** frame rate remains at 60 FPS
**And** no perceptible lag occurs

**Given** trackGameOver() is called with a full state snapshot
**When** the event fires
**Then** the event completes in < 5ms (non-blocking)

**Technical Notes:**
- All analytics.js functions have early return guards
- No awaits, no blocking operations
- Fire-and-forget: window.plausible() is async, doesn't wait for response
- Test with Plausible blocked in browser (network tab)

**FRs:** NFR requirement (non-blocking, graceful degradation)

---

## Technical Architecture

**New Modules:**
- `js/analytics.js` — trackGameStart(), trackFoodEaten(), trackPhoneCall(), trackGameOver(), trackSessionEnd(), getSessionId()

**Modified Modules:**
- `js/state.js` — Add analyticsState object
- `js/config.js` — Add CONFIG.ANALYTICS_ENABLED = true
- `js/game.js` — Call track functions in event handlers
- `index.html` — Add Plausible script in <head>

**External:**
- Plausible analytics service (privacy-first, cookie-free)

---

## Definition of Done

- [ ] All 10 stories complete with passing acceptance criteria
- [ ] Plausible script integrated in index.html
- [ ] CONFIG.ANALYTICS_ENABLED toggle functional
- [ ] analyticsState tracking implemented (Tier 2)
- [ ] analytics.js module with 5 core track functions
- [ ] trackGameStart() fires on new game
- [ ] trackFoodEaten() fires on food consumption
- [ ] trackPhoneCall() fires on phone dismissal
- [ ] trackGameOver() fires on death with full snapshot
- [ ] trackSessionEnd() fires on browser unload
- [ ] Session ID generation and persistence functional
- [ ] All events use flattened props (no nested objects)
- [ ] Graceful degradation tested (Plausible blocked = game works normally)
- [ ] No console errors when analytics disabled or blocked
- [ ] Game maintains 60 FPS with analytics active
- [ ] Event firing is non-blocking (< 5ms)
- [ ] Session aggregation functional (total games, highest score, food breakdown)
- [ ] Documentation: analytics event schemas reference `analytics-requirements.md`
- [ ] Code reviewed and merged

---

## Validation Questions (from cognitive-analytics-requirements.md)

Once Epic 12 is complete, we can answer Celia's 7 cognitive validation questions:

1. **Q1: Is the Difficulty Curve Producing Flow?**
   - Data: Score distribution, death score by session, milestone reach rates

2. **Q2: Is the Phone System Training Divided Attention?**
   - Data: Pick Up rate (30-50% target), End reaction time (800-1500ms target), Pick Up survival rate (60-80% target)

3. **Q3: Is Blinking Food Training Uncertainty Tolerance?**
   - Data: Blinking food eat rate (50-70% target), eat rate by score, avoidance behavior

4. **Q4: Is Combo Mode Training Working Memory?**
   - Data: Combo completion rate (40-60% target), combo death rate (<30% target), combo + phone survival (30-50% target)

5. **Q5: Is Reverse Controls Training Executive Function?**
   - Data: RC survival rate (30-50% target), RC survival rate improvement across sessions (5-10% per session target)

6. **Q6: Does the Brain Gym Identity Land?**
   - Data: Stats view rate (80%+ target), session return rate (30%+ target), games per session (2-4 target)

7. **Q7: Is Comedy Driving Engagement?**
   - Data: Pick Up rate first vs. later calls, Pick Up rate by caller, one-liner dwell time

---

**Epic Owner:** John (Dev)
**Estimated Effort:** 1.5 weeks
**Priority:** HIGH — Validation framework for Brain Gym thesis
**Dependencies:** Epic 7, 8, 9, 10, 11 (ALL v2 systems must be functional)
