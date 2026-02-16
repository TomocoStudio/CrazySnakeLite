# Story 13.5: Implement Divided Attention Metric Calculation

**Epic:** 13 - Cognitive Metrics Data Engine

**As a** player,
**I want** the game to measure how well I manage phone calls during gameplay,
**So that** I can see my context-switching and divided attention skill.

---

## Acceptance Criteria

**Given** a phone call occurs during gameplay
**When** player responds (End or Pick Up)
**Then** track decision time (ms from call appearance to button press)
**And** track survival: did player die during Pick Up countdown? (boolean)
**And** record in rawEvents: { type: 'phone_call', decisionTime, survived, decision }

**Given** multiple phone calls occur in a session
**When** calculating dividedAttention metric
**Then** calculate survival rate = (calls survived / total calls)
**And** calculate avg decision speed = average(decisionTimes)
**And** compute composite score:
```javascript
dividedAttention = (survivalRate × 0.7) + ((1 - normalizedDecisionSpeed) × 0.3)
// 70% weight on survival, 30% on decision speed
// normalizedDecisionSpeed = avgDecisionTime / 3000ms (3s = max reasonable decision time)
```
**And** clamp final value between 0.0 and 1.0

**Formula (per FR154):**
```javascript
dividedAttention = (survival_rate × 0.7) + ((1 - decision_speed_normalized) × 0.3)
// Higher = better. Measures both survival under distraction and decision efficiency
```

---

## Development

### Files to Create/Modify

- **`js/metrics.js`** - Add `calculateDividedAttention()` function
- **`js/phone.js`** - Track decision time and survival outcome for each call
- **`test/metrics.test.js`** - Unit tests for divided attention calculation

### API Surface

```javascript
// metrics.js

/**
 * Calculate divided attention metric from phone call performance
 * @param {Array} rawEvents - Session events including phone_call events
 * @returns {number|null} Composite score (0.0-1.0), or null if no phone calls
 */
function calculateDividedAttention(rawEvents) {
  // Filter phone_call events
  // Calculate survival rate (survived / total)
  // Calculate avg decision speed, normalize to 0-1 (3000ms = max)
  // Composite: (survivalRate × 0.7) + ((1 - normalizedSpeed) × 0.3)
}
```

### Phone Call Event Schema

```javascript
{
  type: 'phone_call',
  timestamp: number,
  decision: 'end' | 'pickup',
  decisionTime: number,  // ms from call appearance to button press
  survived: boolean,     // Did player survive Pick Up countdown (N/A for End)
  bonus: number          // Score bonus received
}
```

### Integration Points

- **`phone.js`** - Track timing:
  ```javascript
  const callStartTime = Date.now();
  // On End or Pick Up button click
  const decisionTime = Date.now() - callStartTime;

  // After Pick Up countdown
  const survived = !gameState.gameOver;

  metrics.recordEvent({
    type: 'phone_call',
    decision: 'end' | 'pickup',
    decisionTime,
    survived,
    bonus
  });
  ```

### Test Strategy

**Unit Tests (`metrics.test.js`):**
1. **No phone calls:** Empty events → return `null`
2. **All survived, fast decisions:** 100% survival, 500ms avg → return ≈ 0.87
3. **All died:** 0% survival → return ≈ 0.3 (only decision speed contributes)
4. **Mixed outcomes:** 60% survival, 1500ms avg → test composite formula
5. **Slow decisions:** 3000ms (max) → decision component = 0
6. **Very fast decisions:** 100ms → decision component ≈ 1.0
7. **Clamping:** Verify final score stays in 0.0-1.0 range

**Test Calculation Example:**
```javascript
// 3 phone calls: 2 survived, 1 died
// Decision times: 500ms, 1000ms, 1500ms (avg = 1000ms)
const survivalRate = 2/3 = 0.667
const avgDecisionTime = 1000
const normalizedSpeed = 1000 / 3000 = 0.333
const score = (0.667 × 0.7) + ((1 - 0.333) × 0.3)
            = 0.467 + 0.200 = 0.667
```

### Dependencies

- **Story 13.1** - Session record schema with rawEvents
- **Story 13.10** - metrics.js module structure
- **Existing Epic 3** - Phone call system in phone.js

### Implementation Notes

1. **Composite metric** - Weighted combination of survival (70%) + decision speed (30%)
2. **3000ms max decision time** - Used for normalization (anything slower = 0 contribution)
3. **Survival only for Pick Up** - End calls don't have survival component, use decision time only
4. **Fast is better** - Normalize speed as `1 - (time/3000)` so lower time = higher score
5. **Return null for no calls** - Not 0, signals insufficient data
6. **Track call appearance time** - In `phone.js`, record `Date.now()` when overlay appears
7. **Handle Pick Up death** - If player dies during countdown, `survived = false`
8. **Clamp to 0.0-1.0** - Final composite score bounded
