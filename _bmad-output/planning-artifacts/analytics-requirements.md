# Analytics Requirements - CrazySnakeLite Beta Testing

**Author:** John (Product Manager)
**Date:** 2026-02-01
**Status:** Ready for Implementation
**Context:** Pre-beta analytics specification for validation and iteration

---

## Overview

### Purpose

Track player behavior during beta testing to validate core assumptions from the PRD:
- Are phone call interruptions fun or frustrating?
- Do players strategically engage with chaos food effects?
- Is the game replayable and engaging?

### Success Metrics (from PRD)

| Metric | Target | How We Measure |
|--------|--------|----------------|
| Session completion rate | 70%+ | `game_over` / `game_start` |
| Plays per visit | 2+ games | `total_games_played` in `session_end` |
| Return rate (next day) | 50%+ | Returning `session_id` count |
| Phone calls engaging | Qualitative | `dismissal_speed_ms` + survived rate |
| Food effects strategic | Qualitative | `food_eaten` distribution patterns |

### Philosophy

**"We improve only what we measure."**

Simple client-side event tracking focused on validation, not vanity metrics. All events tie directly to PRD hypotheses.

---

## Implementation Approach

### Tier 1: Client-Side Event Tracking (Beta Phase)

**Selected Tool:** Plausible (privacy-first, cookie-free, GDPR-compliant by default)

**Why:**
- Privacy-first: no cookies, no personal data, GDPR-compliant out of the box
- Custom event tracking via `window.plausible()` API
- Real-time dashboard during beta testing
- Lightweight script (~1KB), non-blocking, no performance impact
- No backend/database needed

**Integration:**
```html
<!-- Add to index.html <head> -->
<!-- Privacy-friendly analytics by Plausible -->
<script async src="https://plausible.io/js/pa-5lDK3arREKbPzQ_2_Jhfm.js"></script>
<script>
  window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
  plausible.init()
</script>
```

### Tier 2: Local Session Tracking

Enhance existing `storage.js` with session-level aggregation:
- Store session data in localStorage
- Aggregate across multiple games in one visit
- Send summary on session end

---

## Core Events Specification

### Event 1: game_start

**What it tracks:** Player initiates a new game

**When it fires:**
- User clicks "New Game" from menu
- User clicks "Play Again" from game over

**Data Schema:**
```javascript
{
  event: 'game_start',
  session_id: 'uuid-1234',        // Persistent across multiple games in one visit
  timestamp: 1738454321000,       // Unix timestamp (milliseconds)
  is_first_game: true,            // Boolean: first game of this session?
  previous_score: 42              // Number: score from last game (null if first game)
}
```

**Implementation Location:** `js/main.js` → `startNewGame()` function

**Why it matters:**
- Denominator for completion rate calculation
- Tracks "plays per visit" momentum
- Shows immediate replay behavior (previous_score exists = they hit Play Again)

---

### Event 2: game_over

**What it tracks:** Game ends (death or quit)

**When it fires:**
- Snake dies (wall collision, self-collision)
- Player quits mid-game (closes tab, navigates away during gameplay)

**Data Schema:**
```javascript
{
  event: 'game_over',
  session_id: 'uuid-1234',
  timestamp: 1738454448000,
  score: 42,                             // Number: final snake length
  duration_seconds: 127,                 // Number: time from game_start to game_over
  death_cause: 'wall',                   // String: 'wall' | 'self' | 'quit'
  foods_eaten: 37,                       // Number: total foods consumed this game
  phone_calls_received: 3,               // Number: total interruptions this game
  phone_call_active_on_death: false,     // Boolean: died during phone call overlay?
  last_food_eaten: 'speedDecrease',      // String: food type consumed before death
  active_effect_on_death: 'speedDecrease', // String: effect active when died (null if none)
  snake_color_on_death: '#00CED1'        // String: hex color (visual validation)
}
```

**Implementation Location:**
- `js/game.js` → death condition triggers
- `js/main.js` → beforeunload handler for quit detection

**Why it matters:**
- **Completion rate validation:** Are players finishing games or rage-quitting?
- **Death cause analysis:** Are walls or self-collisions the main killer?
- **Effect correlation:** Do certain effects (speedDecrease, reverseControls) lead to more deaths?
- **Phone call frustration check:** High death rate during phone calls = mechanic too punishing

**Critical Analysis Questions:**
- If `active_effect_on_death = 'invincibility'` → BUG (invincibility should prevent death)
- If most deaths have `last_food_eaten = 'speedDecrease' | 'reverseControls'` → effects too punishing
- If `phone_call_active_on_death = true` frequently → timing algorithm needs tuning

---

### Event 3: food_eaten

**What it tracks:** Player consumes any food type

**When it fires:** Snake head collides with food position

**Data Schema:**
```javascript
{
  event: 'food_eaten',
  session_id: 'uuid-1234',
  timestamp: 1738454360000,
  food_type: 'invincibility',      // String: 'growing' | 'invincibility' | 'wallPhase' | 'speedBoost' | 'speedDecrease' | 'reverseControls'
  snake_length: 12,                // Number: current length AFTER eating this food
  time_since_game_start: 45        // Number: seconds into current game
}
```

**Implementation Location:** `js/game.js` → food collision handler

**Why it matters:**
- **Strategic validation:** Are players eating ALL food types or avoiding chaos foods?
- **Probability distribution check:** Is the spawn algorithm working as expected (40% growing, 10% invincibility, etc.)?
- **Food popularity:** Which effects do players encounter most in practice?

**Critical Analysis Questions:**
- If `speedDecrease` and `reverseControls` are rarely eaten → players avoiding chaos (fear > curiosity)
- If `growing` is 80%+ of foods eaten → players playing it safe (not engaging with innovation)
- If distribution doesn't match config probabilities → spawning algorithm bug

---

### Event 4: phone_call_dismissed

**What it tracks:** Player dismisses phone interruption

**When it fires:**
- Player presses Space bar (desktop)
- Player taps "End" button (mobile)

**Data Schema:**
```javascript
{
  event: 'phone_call_dismissed',
  session_id: 'uuid-1234',
  timestamp: 1738454385000,
  dismissal_speed_ms: 1247,        // Number: milliseconds from call appearing to dismissal
  caller_name: 'Your Ex',          // String: which funny caller name appeared
  snake_length_when_called: 18,    // Number: how far into game (progression)
  survived: true                   // Boolean: did player survive the interruption?
}
```

**Implementation Location:** `js/phone.js` → `dismissPhoneCall()` function

**Why it matters:**
- **Phone mechanic validation:** Fast dismissal + high survival = tension working. Slow dismissal + low survival = too frustrating.
- **Caller name testing:** Do certain names cause longer pauses? ("Boss" vs "Spam Likely" vs "Your Ex")
- **Timing validation:** Are calls interrupting at fair moments or killing runs unfairly?

**Critical Analysis Questions:**
- If average `dismissal_speed_ms > 2000` AND `survived = false` frequently → phone calls too disruptive
- If average `dismissal_speed_ms < 500` → calls not creating enough tension (too easy to dismiss)
- If certain `caller_name` values correlate with longer dismissal → those names resonate emotionally

**Success Signal:**
- Average dismissal speed: 800-1500ms (creates tension, not panic)
- Survival rate: 70%+ (challenging but fair)

---

### Event 5: session_end

**What it tracks:** Player leaves the game (end of visit)

**When it fires:**
- Browser `beforeunload` event (tab close, navigation away)
- Optional: 5 minutes of inactivity

**Data Schema:**
```javascript
{
  event: 'session_end',
  session_id: 'uuid-1234',
  timestamp: 1738454932000,
  total_games_played: 4,           // Number: how many games in this visit
  total_time_seconds: 612,         // Number: total time on site
  highest_score: 87,               // Number: best score this session
  total_foods_eaten: 142,          // Number: across all games
  food_breakdown: {                // Object: distribution of foods eaten
    growing: 56,
    invincibility: 14,
    speedBoost: 21,
    speedDecrease: 18,
    reverseControls: 12,
    wallPhase: 21
  },
  total_phone_calls: 11,           // Number: total interruptions across all games
  avg_dismissal_speed_ms: 1134     // Number: average response time to phone calls
}
```

**Implementation Location:**
- `js/main.js` → window `beforeunload` event listener
- Session data aggregated in enhanced `storage.js`

**Why it matters:**
- **Plays per visit (PRD target: 2+):** Are players immediately replaying or one-and-done?
- **Engagement depth:** Total time on site shows true engagement vs curiosity clicks
- **Food distribution aggregate:** Session-level view of what players actually experience
- **Return signal:** If `total_games_played = 1` and short `total_time_seconds` → not hooking players

**Critical Analysis Questions:**
- If average `total_games_played < 2` → replayability problem (chaos not fun enough?)
- If `food_breakdown` heavily skewed to `growing` → players not engaging with chaos mechanics
- If `total_time_seconds` is high but `total_games_played` is low → players stuck/confused, not re-engaging

---

## Optional Event 6: effect_activated (Nice to Have)

**What it tracks:** When special effects are actually USED (not just eaten)

**When it fires:**
- Wall-phase: When snake passes through a wall boundary
- Invincibility: When snake collides with wall/self but survives
- Speed modifiers: Already tracked by movement (implicit)
- Reverse controls: Already tracked by input (implicit)

**Data Schema:**
```javascript
{
  event: 'effect_activated',
  session_id: 'uuid-1234',
  timestamp: 1738454392000,
  effect_type: 'wallPhase',        // String: which effect was triggered
  context: {
    wall_crossed: 'top',           // For wallPhase: which wall (top/bottom/left/right)
    collision_type: 'wall',        // For invincibility: what did they survive (wall/self)
    snake_length_when_used: 23     // Number: progression when effect activated
  }
}
```

**Implementation Location:**
- `js/collision.js` → wall-phase wrap logic, invincibility collision checks

**Why it matters:**
- **Effect value validation:** Are effects being USED or just consumed passively?
- **Strategic play detection:** Wall-phase used frequently = players using it tactically

**Critical Analysis Questions:**
- If `wallPhase` is eaten often but `effect_activated` (wallPhase) is rare → players don't understand it or don't find value
- If `invincibility` collisions survived are high → players using it aggressively (good!)

**Priority:** Implement this ONLY if time permits. Core 5 events are sufficient for beta validation.

---

## Implementation Checklist

### Pre-Beta (Tonight)

- [ ] Sign up for Plausible and configure site domain
- [ ] Add tracking script to `index.html`
- [ ] Create `js/analytics.js` with event helper functions
- [ ] Wire up 5 core events:
  - [ ] `game_start` in `main.js → startNewGame()`
  - [ ] `game_over` in `game.js → death conditions` + `main.js → beforeunload`
  - [ ] `food_eaten` in `game.js → food collision handler`
  - [ ] `phone_call_dismissed` in `phone.js → dismissPhoneCall()`
  - [ ] `session_end` in `main.js → beforeunload`
- [ ] Test locally - verify events appear in Plausible real-time dashboard
- [ ] Enhance `game_over` event with:
  - [ ] `last_food_eaten`
  - [ ] `active_effect_on_death`
  - [ ] `snake_color_on_death`

### During Beta

- [ ] Monitor Plausible real-time dashboard as coworkers play
- [ ] Take qualitative notes (laughter, frustration, confusion)
- [ ] Check completion rates hourly

### Post-Beta Analysis (Week 1)

**Phone Call Validation:**
- [ ] Average `dismissal_speed_ms` (Target: 800-1500ms)
- [ ] `survived` rate (Target: 70%+)
- [ ] Deaths with `phone_call_active_on_death = true` (Should be < 20%)

**Food System Validation:**
- [ ] `food_eaten` distribution matches probabilities?
- [ ] Are chaos foods (`speedDecrease`, `reverseControls`) avoided?
- [ ] Does `last_food_eaten` correlate with death cause?

**Engagement Validation:**
- [ ] Average `total_games_played` per session (Target: 2+)
- [ ] `completion_rate` = game_over / game_start (Target: 70%+)
- [ ] Average `duration_seconds` per game (Target: 2-5 minutes)

---

## Sample Analytics.js Implementation

```javascript
// js/analytics.js
// Plausible custom event tracking helpers
// API: window.plausible(eventName, { props: { key: value } })
// Note: Plausible props must be string or number values (no nested objects).

/**
 * Helper: fire Plausible custom event
 * window.plausible is always defined by the inline queue snippet in <head>.
 * Calls before script load are buffered in plausible.q and sent when ready.
 */
function track(eventName, props) {
  window.plausible(eventName, { props });
}

/**
 * Generate unique session ID (persists in sessionStorage)
 */
export function getSessionId() {
  let sessionId = sessionStorage.getItem('crazysnake_session_id');
  if (!sessionId) {
    sessionId = generateUUID();
    sessionStorage.setItem('crazysnake_session_id', sessionId);
  }
  return sessionId;
}

/**
 * Track game start
 */
export function trackGameStart(isFirstGame, previousScore = null) {
  track('game_start', {
    session_id: getSessionId(),
    is_first_game: isFirstGame,
    previous_score: previousScore
  });
}

/**
 * Track game over
 */
export function trackGameOver({
  score,
  durationSeconds,
  deathCause,
  foodsEaten,
  phoneCallsReceived,
  phoneCallActiveOnDeath,
  lastFoodEaten,
  activeEffectOnDeath,
  snakeColorOnDeath
}) {
  track('game_over', {
    session_id: getSessionId(),
    score,
    duration_seconds: durationSeconds,
    death_cause: deathCause,
    foods_eaten: foodsEaten,
    phone_calls_received: phoneCallsReceived,
    phone_call_active_on_death: phoneCallActiveOnDeath,
    last_food_eaten: lastFoodEaten,
    active_effect_on_death: activeEffectOnDeath,
    snake_color_on_death: snakeColorOnDeath
  });
}

/**
 * Track food eaten
 */
export function trackFoodEaten(foodType, snakeLength, timeSinceGameStart) {
  track('food_eaten', {
    session_id: getSessionId(),
    food_type: foodType,
    snake_length: snakeLength,
    time_since_game_start: timeSinceGameStart
  });
}

/**
 * Track phone call dismissed
 */
export function trackPhoneCallDismissed({
  dismissalSpeedMs,
  callerName,
  snakeLengthWhenCalled,
  survived
}) {
  track('phone_call_dismissed', {
    session_id: getSessionId(),
    dismissal_speed_ms: dismissalSpeedMs,
    caller_name: callerName,
    snake_length_when_called: snakeLengthWhenCalled,
    survived
  });
}

/**
 * Track session end
 * Note: Plausible doesn't support nested objects — food_breakdown
 * is flattened to individual props (food_growing, food_invincibility, etc.)
 */
export function trackSessionEnd({
  totalGamesPlayed,
  totalTimeSeconds,
  highestScore,
  totalFoodsEaten,
  foodBreakdown,
  totalPhoneCalls,
  avgDismissalSpeedMs
}) {
  track('session_end', {
    session_id: getSessionId(),
    total_games_played: totalGamesPlayed,
    total_time_seconds: totalTimeSeconds,
    highest_score: highestScore,
    total_foods_eaten: totalFoodsEaten,
    food_growing: foodBreakdown.growing,
    food_invincibility: foodBreakdown.invincibility,
    food_speed_boost: foodBreakdown.speedBoost,
    food_speed_decrease: foodBreakdown.speedDecrease,
    food_reverse_controls: foodBreakdown.reverseControls,
    food_wall_phase: foodBreakdown.wallPhase,
    total_phone_calls: totalPhoneCalls,
    avg_dismissal_speed_ms: avgDismissalSpeedMs
  });
}

/**
 * Helper: Generate UUID v4
 */
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}
```

---

## Analysis Dashboard Queries (Plausible)

### Completion Rate
```
Events: game_over / Events: game_start
Target: 70%+
```

### Plays Per Visit
```
Average: session_end.total_games_played
Target: 2+
```

### Average Session Length
```
Average: game_over.duration_seconds
Healthy Range: 120-300 seconds (2-5 minutes)
```

### Food Distribution
```
Event: food_eaten
Dimension: food_type
Expected: growing ~40%, invincibility ~10%, wallPhase ~10%, speedBoost ~15%, speedDecrease ~15%, reverseControls ~10%
```

### Phone Call Performance
```
Average: phone_call_dismissed.dismissal_speed_ms
Target: 800-1500ms

Survival Rate:
phone_call_dismissed.survived = true / total phone_call_dismissed events
Target: 70%+
```

### Death Cause Breakdown
```
Event: game_over
Dimension: death_cause
Expected: Balanced distribution (wall, self, quit)
Red Flag: quit > 30% = frustration/confusion
```

### Effect-Related Deaths
```
Event: game_over
Filter: active_effect_on_death != null
Dimension: active_effect_on_death
Red Flag: speedDecrease or reverseControls > 40% of deaths = too punishing
```

---

## Privacy & Compliance

**Data Collected:** Anonymous gameplay events only
**No PII:** No names, emails, IP addresses stored explicitly
**Session ID:** Randomly generated UUID, not tied to user identity
**Compliance:** GDPR-compliant by default — Plausible is cookie-free and collects no personal data
**User Control:** Consider adding "analytics opt-out" toggle in settings (post-beta)

---

## Next Steps

1. **Decision Point:** Choose implementation option (tonight, 30min, or manual observation)
2. **If implementing:** Use this document as specification for `analytics.js`
3. **During beta:** Watch real-time data, take qualitative notes
4. **Post-beta:** Run analysis queries, validate PRD assumptions
5. **Iterate:** Tune probabilities, timing, or mechanics based on data

---

## References

- **PRD:** `_bmad-output/planning-artifacts/prd.md` (Success Criteria section)
- **Epics:** `_bmad-output/planning-artifacts/epics.md` (Validation approach)
- **Implementation:** To be added to `js/analytics.js` (new file)

---

**Document Status:** Ready for implementation
**Last Updated:** 2026-02-08
**Owner:** John (PM)
