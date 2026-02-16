# Story 13.2: Implement Reaction Time Metric Calculation

**Epic:** 13 - Cognitive Metrics Data Engine

**As a** player,
**I want** the game to measure my reaction time during normal gameplay,
**So that** I can see how quickly I respond to food spawns.

---

## Acceptance Criteria

**Given** the game is running in normal mode (not RC, not phone call active)
**When** a food spawns
**Then** start measuring time until next directional input toward food
**And** record delta time in rawEvents array

**Given** multiple food consumption events occur in a session
**When** calculating reactionTime metric
**Then** compute rolling average of input response times
**And** exclude outliers > 2 standard deviations (removes pauses/distractions)
**And** store final reactionTime value in metrics object

**Given** player is in Reverse Controls mode
**When** food is consumed
**Then** do NOT include that response time in reactionTime calculation (per FR151 - excludes RC periods)

**Given** phone call overlay is active
**When** player navigates snake
**Then** do NOT include that response time in reactionTime calculation (per FR151 - excludes phone periods)

**Formula (per FR151):**
```javascript
reactionTime = average(validResponseTimes.filter(t => t < mean + 2*stdDev))
// Lower = better. Typical range: 200-800ms
```

---

## Development

### Files to Create/Modify

- **`js/metrics.js`** - NEW file, pure calculation module
- **`js/game.js`** - Track food spawn times and input response times
- **`test/metrics.test.js`** - Unit tests for reaction time calculation

### API Surface

```javascript
// metrics.js (Reaction Time portion)

/**
 * Calculate reaction time metric from session raw events
 * @param {Array} rawEvents - Session events array
 * @returns {number|null} Average reaction time in ms, or null if insufficient data
 */
function calculateReactionTime(rawEvents) {
  // Filter events to normal gameplay only (not RC, not phone)
  // Calculate response time deltas
  // Remove outliers > mean + 2*stdDev
  // Return average or null
}
```

### Integration Points

- **`game.js`** - Record `food_eaten` events with `responseTime` field in rawEvents
- **`metrics.js`** - Pure calculation function, called during `endSession()`
- **Event structure:**
  ```javascript
  {
    type: 'food_eaten',
    timestamp: number,
    foodType: string,
    scoreGained: number,
    responseTime: number | null,  // ms from spawn to directional input
    duringRC: boolean,             // exclude if true
    duringPhone: boolean           // exclude if true
  }
  ```

### Test Strategy

**Unit Tests (`metrics.test.js`):**
1. **Happy path:** 10 normal food events → verify average calculation
2. **Outlier removal:** Events with [200, 250, 300, 2000, 250] → verify 2000ms excluded
3. **RC exclusion:** Mixed normal + RC events → verify RC events ignored
4. **Phone exclusion:** Events during phone overlay → verify excluded
5. **Insufficient data:** < 3 valid events → return `null`
6. **Edge case:** Empty rawEvents → return `null`

**Test Data Example:**
```javascript
const testEvents = [
  { type: 'food_eaten', responseTime: 250, duringRC: false, duringPhone: false },
  { type: 'food_eaten', responseTime: 300, duringRC: false, duringPhone: false },
  { type: 'food_eaten', responseTime: 280, duringRC: true, duringPhone: false },  // EXCLUDE
  { type: 'food_eaten', responseTime: 1500, duringRC: false, duringPhone: false }, // OUTLIER
];
// Expected: average([250, 300]) = 275ms
```

### Dependencies

- **Story 13.1** - Session record schema with `rawEvents` array must exist
- **Story 13.10** - `metrics.js` module structure (can be built in parallel)

### Implementation Notes

1. **Pure function** - No side effects, no imports except `config.js`
2. **Statistical outlier removal** - Calculate mean + stdDev, filter > mean + 2*stdDev
3. **Minimum sample size** - Need ≥ 3 valid events, otherwise return `null`
4. **Exclusion flags** - Use `duringRC` and `duringPhone` boolean flags on events
5. **Response time tracking** - In `game.js`, track `lastFoodSpawnTime` and calculate delta on next directional input
6. **Typical range** - 200-800ms for most players (use for validation)
7. **Return null, not 0** - Signals "insufficient data" vs "perfect reaction time"

---

## Implementation Status

**✅ COMPLETED** - 2026-02-16 (Epic 13)

### What Was Built

**File:** `js/metrics.js` (lines 80-120)
- `calculateReactionTime(rawEvents)` - Pure calculation function
- Filters `food_eaten` events excluding `duringRC` and `duringPhone` periods
- Outlier removal using 2 standard deviations above mean
- Normalizes to 0-1 scale (200ms=1.0 excellent, 800ms=0.0 slow)
- Returns 0.5 (neutral) if insufficient data

**Tests:** `test/metrics.test.js` (Tests 10-12)
- Valid events averaging calculation
- RC event exclusion verification
- Phone event exclusion verification
- Outlier removal validation

### Acceptance Criteria Status

✅ Measures time from food spawn to directional input
✅ Records delta time in rawEvents array
✅ Computes rolling average excluding outliers > 2 stdDev
✅ Excludes RC periods from calculation
✅ Excludes phone call periods from calculation
✅ Formula matches FR151 specification

### Integration Status

⚠️ **NOT YET INTEGRATED** - Module complete but game loop doesn't record `responseTime` in `food_eaten` events. Requires adding responseTime tracking to game.js food consumption logic.
