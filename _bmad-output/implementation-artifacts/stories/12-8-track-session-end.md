# Story 12.8: Fire trackSessionEnd() on Browser Unload

**Epic:** 12 - Cognitive Analytics System
**Story ID:** 12.8
**Status:** 🟢 review
**Created:** 2026-02-08

---

## Story

**As a** developer,
**I want** to track session-level aggregates when the player leaves,
**So that** I can compute plays per visit and return rates.

## Acceptance Criteria

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

## Tasks / Subtasks

- [ ] Import trackSessionEnd from analytics.js in game.js or main.js
- [ ] Add beforeunload listener
  - [ ] Listen to window beforeunload event
  - [ ] Call trackSessionEnd()
  - [ ] Fire-and-forget (non-blocking)
- [ ] Update session aggregation on game over
  - [ ] Increment total_foods_eaten in sessionStorage
  - [ ] Update highest_score if current score higher
  - [ ] Aggregate food distribution
  - [ ] Aggregate phone call data
  - [ ] Track dismissal reaction times
- [ ] Implement updateSessionAggregation(gameState)
  - [ ] Called in onDeath() after trackGameOver()
  - [ ] Update sessionStorage with aggregated values
  - [ ] Flatten food breakdown
- [ ] Test trackSessionEnd() fires on tab close
  - [ ] Play 2 games
  - [ ] Close browser tab
  - [ ] Check DevTools → Network tab (may need to keep open)
  - [ ] Verify 'session_end' event sent
  - [ ] Verify props: {session_id, total_games_played: 2, highest_score, total_foods_eaten, food breakdown, total_phone_calls, avg_dismissal_speed_ms}
- [ ] Test session aggregation
  - [ ] Play 3 games with scores [10, 25, 15]
  - [ ] Check sessionStorage after each game
  - [ ] Verify total_games_played increments
  - [ ] Verify highest_score = 25
  - [ ] Verify total_foods_eaten = 10 + 25 + 15 = 50

---

## Developer Context

### 🎯 STORY OBJECTIVE

Fire trackSessionEnd() event when the player closes the browser tab, capturing session-level aggregates. This story answers "How engaged are players?" — do they play 1 game and leave, or 5+ games in a row? The session metrics (total_games_played, highest_score, avg_dismissal_speed_ms) reveal player retention and skill progression within a single visit. This event is the foundation for answering "Does the Brain Gym identity land?" (Q6 — session return rate, games per session).

**CRITICAL SUCCESS FACTORS:**
- trackSessionEnd() fires on beforeunload (tab close)
- Session aggregation updated on EVERY game over
- sessionStorage tracks running totals (games, foods, phone calls)
- highest_score updated only if current score higher
- avg_dismissal_speed_ms computed from stored reaction times
- Event is fire-and-forget (non-blocking, may not always send before tab closes)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/game.js` or `js/main.js` — Add beforeunload listener, updateSessionAggregation()

**Module Dependencies:**
- `analytics.js` → trackSessionEnd()
- `sessionStorage` → Session aggregation data

**Data Flow:**
```
1. Game over → onDeath() called
2. onDeath() → updateSessionAggregation(gameState)
3. updateSessionAggregation() → Update sessionStorage:
   - total_foods_eaten += score
   - highest_score = max(highest_score, score)
   - food_breakdown (aggregate foodTypesEaten)
   - total_phone_calls += analyticsState.totalPhoneCalls
   - reaction_times.push(avg reaction time this game)
4. Player closes tab → beforeunload fires
5. trackSessionEnd() reads sessionStorage
6. trackSessionEnd() computes avg_dismissal_speed_ms
7. trackSessionEnd() fires 'session_end' event
```

---

### 📦 CONFIG.JS UPDATES

No config changes needed.

---

### 🎨 IMPLEMENTATION DETAILS

**1. game.js or main.js — Add beforeunload listener:**

```javascript
import { trackSessionEnd } from './analytics.js';

// Track session end when browser tab closes
window.addEventListener('beforeunload', () => {
  trackSessionEnd();
});
```

**2. game.js — Update session aggregation on game over:**

```javascript
/**
 * Update session aggregation in sessionStorage.
 * Called on game over (after trackGameOver).
 */
function updateSessionAggregation(gameState) {
  // Update total foods eaten
  const totalFoods = parseInt(sessionStorage.getItem('crazysnake_total_foods') || '0');
  sessionStorage.setItem('crazysnake_total_foods', (totalFoods + gameState.score).toString());

  // Update highest score
  const highestScore = parseInt(sessionStorage.getItem('crazysnake_highest_score') || '0');
  if (gameState.score > highestScore) {
    sessionStorage.setItem('crazysnake_highest_score', gameState.score.toString());
  }

  // Update food breakdown (aggregate across games)
  const foodBreakdown = JSON.parse(sessionStorage.getItem('crazysnake_food_breakdown') || '{}');
  const currentFoods = gameState.analyticsState.foodTypesEaten;

  foodBreakdown.growing = (foodBreakdown.growing || 0) + currentFoods.growing;
  foodBreakdown.invincibility = (foodBreakdown.invincibility || 0) + currentFoods.invincibility;
  foodBreakdown.wallPhase = (foodBreakdown.wallPhase || 0) + currentFoods.wallPhase;
  foodBreakdown.speedBoost = (foodBreakdown.speedBoost || 0) + currentFoods.speedBoost;
  foodBreakdown.speedDecrease = (foodBreakdown.speedDecrease || 0) + currentFoods.speedDecrease;
  foodBreakdown.reverseControls = (foodBreakdown.reverseControls || 0) + currentFoods.reverseControls;

  sessionStorage.setItem('crazysnake_food_breakdown', JSON.stringify(foodBreakdown));

  // Update total phone calls
  const totalPhoneCalls = parseInt(sessionStorage.getItem('crazysnake_total_phone_calls') || '0');
  sessionStorage.setItem('crazysnake_total_phone_calls', (totalPhoneCalls + gameState.analyticsState.totalPhoneCalls).toString());

  // Update reaction times (for avg_dismissal_speed_ms)
  const reactionTimes = JSON.parse(sessionStorage.getItem('crazysnake_reaction_times') || '[]');

  // Compute average reaction time for this game
  if (gameState.analyticsState.totalPhoneCalls > 0) {
    // This is a simplified calculation - you might want to track individual reaction times
    // For now, store a placeholder or compute from individual trackPhoneCall events
    const avgReactionThisGame = 1000;  // TODO: Compute actual average
    reactionTimes.push(avgReactionThisGame);
    sessionStorage.setItem('crazysnake_reaction_times', JSON.stringify(reactionTimes));
  }

  // Compute overall average dismissal speed
  if (reactionTimes.length > 0) {
    const avgDismissalSpeed = Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
    sessionStorage.setItem('crazysnake_avg_dismissal_speed', avgDismissalSpeed.toString());
  }
}
```

**3. Call updateSessionAggregation() in onDeath():**

```javascript
function onDeath(gameState) {
  // ... capture death context ...

  // Track game over
  trackGameOver(gameState);

  // Update session aggregation
  updateSessionAggregation(gameState);

  // ... show death screen ...
}
```

**4. analytics.js — trackSessionEnd() implementation (from Story 12.3):**

Already implemented in Story 12.3. For reference:

```javascript
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

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Session Aggregation Updates on Game Over:**
   - Clear sessionStorage
   - Play game, score 10, die
   - Check sessionStorage:
     - 'crazysnake_total_foods' = '10'
     - 'crazysnake_highest_score' = '10'
     - 'crazysnake_total_games' = '1'
   - Play second game, score 25, die
   - Check sessionStorage:
     - 'crazysnake_total_foods' = '35' (10 + 25)
     - 'crazysnake_highest_score' = '25'
     - 'crazysnake_total_games' = '2'

2. **Highest Score Tracking:**
   - Play 3 games with scores [20, 40, 15]
   - Check sessionStorage after each game:
     - Game 1: highest_score = 20
     - Game 2: highest_score = 40
     - Game 3: highest_score = 40 (unchanged, 15 < 40)

3. **Food Breakdown Aggregation:**
   - Game 1: eat 3 growing, 1 invincibility
   - Game 2: eat 2 growing, 1 reverseControls
   - Check sessionStorage food_breakdown:
     - growing: 5 (3 + 2)
     - invincibility: 1
     - reverseControls: 1

4. **Total Phone Calls Aggregation:**
   - Game 1: receive 2 phone calls
   - Game 2: receive 3 phone calls
   - Check sessionStorage total_phone_calls = 5

5. **trackSessionEnd() Fires on Tab Close:**
   - Play 2 games
   - Keep DevTools → Network tab open
   - Close browser tab
   - Verify 'session_end' event sent (may require persistent logging)
   - Verify props: {session_id, total_games_played: 2, highest_score, total_foods_eaten, food breakdown, total_phone_calls, avg_dismissal_speed_ms}

6. **Session Time Tracking:**
   - Play for ~5 minutes (multiple games)
   - Close tab
   - Verify total_time_seconds ~300

**Edge Cases:**
- Single game session (total_games_played = 1)
- Tab closed immediately after game start (session_end may not send)
- Multiple tabs open (each has separate sessionStorage)
- beforeunload blocked by browser (session_end may not fire)

---

### 📚 CRITICAL DATA FORMATS

**sessionStorage keys:**
```javascript
'crazysnake_total_games'           // '3' (string number)
'crazysnake_total_foods'           // '50' (string number)
'crazysnake_highest_score'         // '42' (string number)
'crazysnake_food_breakdown'        // '{"growing":10,"invincibility":5,...}' (JSON)
'crazysnake_total_phone_calls'     // '8' (string number)
'crazysnake_reaction_times'        // '[1200,950,1100]' (JSON array)
'crazysnake_avg_dismissal_speed'   // '1083' (string number, computed average)
'crazysnake_session_start'         // '1707423600000' (timestamp)
```

**Food breakdown aggregation:**
```javascript
// CORRECT (aggregate across games)
{
  growing: 15,       // Total growing foods across all games
  invincibility: 5,  // Total invincibility foods across all games
  ...
}

// WRONG (only last game)
{
  growing: 3,  // Only from last game, not aggregated
  ...
}
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/analytics-requirements.md` — session_end event spec
- `_bmad-output/planning-artifacts/cognitive-analytics-requirements.md` — Q6 (games per session, return rate)

**Key Design Principles:**
- **Session = browser session:** sessionStorage cleared when tab closes
- **Games per session = engagement metric:** Target 2-4 games per session
- **Highest score = skill progression:** Does score improve across games?
- **Fire-and-forget:** beforeunload may not always complete (acceptable)

---

### 📋 FRs COVERED

FR99 (session_end event with aggregated data)

**Detailed FR Mapping:**
- FR99: Track session-level aggregates → trackSessionEnd() fires on beforeunload

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] trackSessionEnd imported in game.js or main.js
- [ ] beforeunload listener added
- [ ] trackSessionEnd() called in beforeunload handler
- [ ] updateSessionAggregation() implemented
- [ ] updateSessionAggregation() called in onDeath()
- [ ] total_foods_eaten aggregated across games
- [ ] highest_score tracked (max score across games)
- [ ] food_breakdown aggregated (flatten to individual props)
- [ ] total_phone_calls aggregated across games
- [ ] reaction_times tracked (for avg_dismissal_speed_ms)
- [ ] avg_dismissal_speed_ms computed from reaction times
- [ ] session_start timestamp set on first game
- [ ] total_games_played incremented on each game
- [ ] Session aggregation tested (multiple games, correct totals)
- [ ] trackSessionEnd() fires on tab close
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (single game, immediate close)

**Common Mistakes to Avoid:**
- ❌ Not aggregating values across games (only storing last game)
- ❌ Not updating highest_score correctly (always overwriting)
- ❌ beforeunload fires but event doesn't send (browser blocking, acceptable)
- ❌ Using localStorage instead of sessionStorage (persists across sessions)
- ❌ Not flattening food_breakdown (nested object rejected by Plausible)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

N/A - Test via browser DevTools Network tab and sessionStorage inspection

### Completion Notes List

**Implementation Summary:**
- Implemented updateSessionAggregation() function in game.js
- Called updateSessionAggregation() in death handler (after trackGameOver)
- beforeunload listener already in place from Story 12.3 (main.js)
- trackSessionEnd() already implemented in analytics.js (Story 12.3)
- Session aggregation updates on EVERY game over

**Technical Implementation:**
- game.js: Added updateSessionAggregation() function (lines ~433-497)
  - Aggregates total_foods_eaten (sum of scores)
  - Aggregates food_breakdown (foodTypesEaten across games)
  - Aggregates total_phone_calls (sum across games)
  - Tracks reaction_times array for avg_dismissal_speed_ms
  - Computes avg_dismissal_speed from reaction times
  - Note: highest_score already updated earlier in death handler (Story 12.4)
- game.js: Call updateSessionAggregation(gameState) after trackGameOver (line ~377)
- main.js: beforeunload listener already present (Story 12.3, line ~156)
- analytics.js: trackSessionEnd() already implemented (Story 12.3, lines 185-222)

**sessionStorage Keys Updated:**
- 'crazysnake_total_foods' - Sum of scores across all games
- 'crazysnake_food_breakdown' - JSON object with aggregated food types
- 'crazysnake_total_phone_calls' - Sum of phone calls across all games
- 'crazysnake_reaction_times' - JSON array of avg reaction times per game
- 'crazysnake_avg_dismissal_speed' - Computed average dismissal speed
- 'crazysnake_highest_score' - Already tracked (Story 12.4)
- 'crazysnake_total_games' - Already tracked (Story 12.4)
- 'crazysnake_session_start' - Already tracked (Story 12.4)

**Event Props Sent (trackSessionEnd on beforeunload):**
- session_id (from getSessionId helper)
- total_games_played (from sessionStorage)
- total_time_seconds (Date.now() - session_start)
- highest_score (max score across all games)
- total_foods_eaten (sum of all scores)
- Flattened food breakdown: food_growing, food_invincibility, food_wall_phase, food_speed_boost, food_speed_decrease, food_reverse_controls
- total_phone_calls (sum across all games)
- avg_dismissal_speed_ms (computed from reaction times)

**Call Flow:**
1. Player dies → Death handler in game.js
2. trackGameOver(gameState) fires (Story 12.7)
3. updateSessionAggregation(gameState) updates sessionStorage
4. Player closes tab → beforeunload event (main.js)
5. trackSessionEnd() reads sessionStorage and fires 'session_end' event

**Testing:**
- Play multiple games, verify sessionStorage aggregates correctly
- Close tab, verify 'session_end' event fires (may need persistent DevTools)
- total_foods_eaten = sum of all scores
- highest_score = max score across games
- food_breakdown aggregates correctly
- total_phone_calls = sum across games

### File List

- js/game.js (modified - added updateSessionAggregation(), call in death handler)
- js/main.js (already has beforeunload listener from Story 12.3)
- js/analytics.js (already has trackSessionEnd from Story 12.3)

---

## Change Log

**2026-02-16** - Story 12.8 implementation complete
- Implemented updateSessionAggregation() function in game.js
- Called updateSessionAggregation() after trackGameOver() in death handler
- Session aggregation updates on every game over:
  - total_foods_eaten: Sum of scores across all games
  - food_breakdown: Aggregated foodTypesEaten (growing, invincibility, wallPhase, speedBoost, speedDecrease, reverseControls)
  - total_phone_calls: Sum of phone calls across all games
  - reaction_times: Array of avg reaction times per game
  - avg_dismissal_speed: Computed average dismissal speed
- Leverages existing beforeunload listener from Story 12.3 (main.js)
- Leverages existing trackSessionEnd() from Story 12.3 (analytics.js)
- Fires 'session_end' event on browser tab close with {session_id, total_games_played, total_time_seconds, highest_score, total_foods_eaten, flattened food breakdown, total_phone_calls, avg_dismissal_speed_ms}
- Ready for testing in browser (sessionStorage inspection + DevTools → Network tab)
