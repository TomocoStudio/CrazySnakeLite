# Story 13.4: Implement Cognitive Flexibility Metric Calculation

**Epic:** 13 - Cognitive Metrics Data Engine

**As a** player,
**I want** the game to measure how well I adapt during Reverse Controls,
**So that** I can see my executive function override capability.

---

## Acceptance Criteria

**Given** player consumes Reverse Controls food
**When** RC effect is active
**Then** track all food consumed during RC period as "rcFoodCount"
**And** track time duration of RC period
**And** calculate RC score rate = rcFoodCount / rcDurationSeconds

**Given** player completes a full game session
**When** calculating cognitiveFlexibility metric
**Then** calculate normal score rate = (totalFoodEaten - rcFoodCount) / normalPlayDurationSeconds
**And** compute cognitiveFlexibility = rcScoreRate / normalScoreRate
**And** clamp value between 0.0 and 2.0 (performance ratio)

**Given** player never encounters Reverse Controls in a session
**When** calculating cognitiveFlexibility
**Then** use previous session's value or default to 1.0 (neutral)
**And** flag metric as "insufficient data" for that session

**Formula (per FR153):**
```javascript
cognitiveFlexibility = (RC_score_rate) / (normal_score_rate)
// Closer to 1.0 = stronger flexibility. < 0.5 = significant RC impact. > 1.0 = thrives under RC
```

---

## Development

### Files to Create/Modify

- **`js/metrics.js`** - Add `calculateCognitiveFlexibility()` function
- **`js/game.js`** - Track RC periods: start time, end time, food consumed during RC
- **`test/metrics.test.js`** - Unit tests for cognitive flexibility calculation

### API Surface

```javascript
// metrics.js

/**
 * Calculate cognitive flexibility metric from RC vs normal performance
 * @param {Array} rawEvents - Session events including rc_start, rc_end, food_eaten
 * @returns {number|null} Flexibility ratio (0.0-2.0), or null if no RC encountered
 */
function calculateCognitiveFlexibility(rawEvents) {
  // Find RC periods from rc_start/rc_end events
  // Count food eaten during RC vs normal
  // Calculate score rates (food/second)
  // Return ratio, clamped to 0.0-2.0
}
```

### Integration Points

- **`game.js`** - Record RC period events:
  ```javascript
  // When RC effect starts
  metrics.recordEvent({ type: 'rc_start', timestamp: Date.now() });

  // When RC effect ends
  metrics.recordEvent({ type: 'rc_end', timestamp: Date.now(), survived: boolean });

  // Mark food events during RC
  { type: 'food_eaten', duringRC: true, ... }
  ```

- **`effects.js`** - Existing RC effect system, add metric hooks

### Test Strategy

**Unit Tests (`metrics.test.js`):**
1. **No RC:** rawEvents with no RC periods → return `null`
2. **RC same performance:** RC rate = 1.0 × normal rate → return 1.0
3. **RC worse performance:** RC rate = 0.5 × normal rate → return 0.5
4. **RC better performance:** RC rate = 1.5 × normal rate → return 1.5
5. **Multiple RC periods:** Sum all RC time and food
6. **Edge case:** RC period with 0 food → handle division by zero
7. **Clamping:** Test values outside 0.0-2.0 range get clamped

**Test Data Example:**
```javascript
const testEvents = [
  { type: 'rc_start', timestamp: 1000 },
  { type: 'food_eaten', timestamp: 1500, duringRC: true },  // 1 food in RC
  { type: 'rc_end', timestamp: 3000 },  // 2s RC period
  { type: 'food_eaten', timestamp: 4000, duringRC: false }, // 3 food in normal
  { type: 'food_eaten', timestamp: 5000, duringRC: false },
  { type: 'food_eaten', timestamp: 6000, duringRC: false }  // 3s normal period
];
// RC rate: 1 food / 2s = 0.5
// Normal rate: 3 food / 3s = 1.0
// Flexibility: 0.5 / 1.0 = 0.5
```

### Dependencies

- **Story 13.1** - Session record schema with rawEvents
- **Story 13.10** - metrics.js module structure
- **Existing Epic 2** - RC effect system in effects.js

### Implementation Notes

1. **Time-based calculation** - Use timestamps to calculate duration in seconds
2. **Rate = food/second** - Not just food count, normalize by time
3. **Flag RC periods** - Add `duringRC: boolean` to food_eaten events
4. **Return null for no RC** - Signals "insufficient data", not poor performance
5. **Clamp to 0.0-2.0** - Extreme outliers get bounded
6. **Division by zero** - If normal period has 0 duration, return `null`
7. **Multiple RC periods** - Sum total RC time and RC food across all periods
8. **Use previous session value** - If null, dashboard can fall back to previous session's score
