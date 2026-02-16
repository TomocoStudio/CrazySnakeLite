# Story 13.7: Implement Working Memory Metric Calculation

**Epic:** 13 - Cognitive Metrics Data Engine

**As a** player,
**I want** the game to measure my performance during combo mode,
**So that** I can see my working memory and multitasking capability.

---

## Acceptance Criteria

**Given** combo mode activates
**When** player is in combo state
**Then** track all food consumed during combo as "comboFoodCount"
**And** track combo duration in seconds
**And** calculate combo score rate = comboFoodCount / comboDurationSeconds

**Given** player completes a full game session
**When** calculating workingMemory metric
**Then** calculate normal score rate = (totalFoodEaten - comboFoodCount) / normalPlayDurationSeconds
**And** compute workingMemory = comboScoreRate / normalScoreRate
**And** clamp value between 0.0 and 3.0 (combo can be 3x normal rate due to multipliers)

**Given** player never enters combo mode in a session
**When** calculating workingMemory
**Then** use previous session's value or default to 1.0 (neutral)
**And** flag metric as "insufficient data" for that session

**Formula (per FR156):**
```javascript
workingMemory = (combo_score_rate) / (normal_score_rate)
// Higher = better. Measures ability to manage multiplicative scoring under cognitive load
```

---

## Development

### Files to Create/Modify

- **`js/metrics.js`** - Add `calculateWorkingMemory()` function
- **`js/game.js`** - Track combo periods: start time, end time, food consumed during combo
- **`test/metrics.test.js`** - Unit tests for working memory calculation

### API Surface

```javascript
// metrics.js

/**
 * Calculate working memory metric from combo vs normal performance
 * @param {Array} rawEvents - Session events including combo_start, combo_end, food_eaten
 * @returns {number|null} Performance ratio (0.0-3.0), or null if no combo encountered
 */
function calculateWorkingMemory(rawEvents) {
  // Find combo periods from combo_start/combo_end events
  // Count food eaten during combo vs normal
  // Calculate score rates (food/second)
  // Return ratio, clamped to 0.0-3.0
}
```

### Integration Points

- **`combo.js`** - Record combo period events:
  ```javascript
  // When combo starts
  metrics.recordEvent({ type: 'combo_start', timestamp: Date.now() });

  // When combo ends
  metrics.recordEvent({
    type: 'combo_end',
    timestamp: Date.now(),
    multiplier: finalMultiplier,
    foodCount: totalFoodInCombo
  });

  // Mark food events during combo
  { type: 'food_eaten', duringCombo: true, ... }
  ```

### Test Strategy

**Unit Tests (`metrics.test.js`):**
1. **No combo:** rawEvents with no combo periods → return `null`
2. **Combo same performance:** Combo rate = 1.0 × normal rate → return 1.0
3. **Combo worse performance:** Combo rate = 0.8 × normal rate → return 0.8
4. **Combo better performance:** Combo rate = 2.5 × normal rate → return 2.5
5. **Multiple combo periods:** Sum all combo time and food
6. **Edge case:** Combo period with 0 food → handle division by zero
7. **Clamping:** Test values > 3.0 get clamped to 3.0

**Test Data Example:**
```javascript
const testEvents = [
  { type: 'combo_start', timestamp: 1000 },
  { type: 'food_eaten', timestamp: 1200, duringCombo: true },  // 5 food in combo
  { type: 'food_eaten', timestamp: 1400, duringCombo: true },
  { type: 'food_eaten', timestamp: 1600, duringCombo: true },
  { type: 'food_eaten', timestamp: 1800, duringCombo: true },
  { type: 'food_eaten', timestamp: 2000, duringCombo: true },
  { type: 'combo_end', timestamp: 3000 },  // 2s combo period
  { type: 'food_eaten', timestamp: 4000, duringCombo: false }, // 2 food normal
  { type: 'food_eaten', timestamp: 6000, duringCombo: false }  // 3s normal period
];
// Combo rate: 5 food / 2s = 2.5
// Normal rate: 2 food / 3s = 0.667
// Working memory: 2.5 / 0.667 = 3.75 → clamped to 3.0
```

### Dependencies

- **Story 13.1** - Session record schema with rawEvents
- **Story 13.10** - metrics.js module structure
- **Existing Epic 7** - Combo system in combo.js

### Implementation Notes

1. **Time-based calculation** - Use timestamps to calculate duration in seconds
2. **Rate = food/second** - Not just food count, normalize by time
3. **Flag combo periods** - Add `duringCombo: boolean` to food_eaten events
4. **Return null for no combo** - Signals "insufficient data", not poor performance
5. **Clamp to 0.0-3.0** - Combo can achieve 3x normal rate due to multipliers
6. **Division by zero** - If normal period has 0 duration, return `null`
7. **Multiple combo periods** - Sum total combo time and combo food across all periods
8. **Combo multipliers** - Player can eat faster during combo due to score multipliers
9. **Use previous session value** - If null, dashboard can fall back to previous session's score
