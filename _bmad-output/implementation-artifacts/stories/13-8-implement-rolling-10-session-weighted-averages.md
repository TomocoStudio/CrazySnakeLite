# Story 13.8: Implement Rolling 10-Session Weighted Averages

**Epic:** 13 - Cognitive Metrics Data Engine

**As a** player,
**I want** my metrics to reflect recent improvement,
**So that** I see responsive progress tracking, not just all-time averages.

---

## Acceptance Criteria

**Given** a new session completes
**When** storing metrics to IndexedDB
**Then** query previous 9 sessions (chronologically)
**And** compute rolling average for each metric with recency weighting:
```javascript
weights = [0.2, 0.18, 0.16, 0.14, 0.12, 0.10, 0.06, 0.03, 0.01] // most recent → oldest
rollingAvg = sum(sessionMetrics[i] × weights[i]) / sum(weights)
```
**And** store both raw session metric and rolling average

**Given** fewer than 10 sessions exist
**When** calculating rolling average
**Then** use all available sessions with proportional weights
**And** normalize weights to sum to 1.0

**Given** rolling average is displayed in Skill Map
**When** player views their profile
**Then** show the weighted rolling average (not raw single-session value)
**And** use rolling average for strongest/growth area determinations

**Per FR159:** Rolling averages weighted toward recent 10 sessions for responsive metrics that reflect improvement

---

## Development

### Files to Create/Modify

- **`js/metrics.js`** - Add `calculateRollingAverages()` function
- **`test/metrics.test.js`** - Unit tests for rolling average calculation

### API Surface

```javascript
// metrics.js

/**
 * Calculate rolling weighted averages for all 6 metrics
 * @param {Array} sessions - Up to 10 most recent sessions (newest first)
 * @returns {Object} Rolling averages for each metric
 */
function calculateRollingAverages(sessions) {
  const weights = [0.2, 0.18, 0.16, 0.14, 0.12, 0.10, 0.06, 0.03, 0.01];
  // For each metric:
  //   - Skip null values
  //   - Apply recency weights
  //   - Normalize weights to sum to 1.0
  //   - Return weighted average or null if insufficient data
  return {
    reactionTime: number | null,
    spatialAwareness: number | null,
    cognitiveFlexibility: number | null,
    dividedAttention: number | null,
    impulseControl: number | null,
    workingMemory: number | null
  };
}
```

### Integration Points

- **`game.js`** - In `onDeath()`:
  ```javascript
  const sessions = await storage.getSessions(10);  // Newest first
  const rollingAvgs = metrics.calculateRollingAverages(sessions);
  await storage.updateProfile({ rollingAverages: rollingAvgs });
  ```

- **`dashboard.js`** - Read rolling averages from profile for Skill Map display

### Test Strategy

**Unit Tests (`metrics.test.js`):**
1. **Happy path - 10 sessions:** All metrics present → verify weighted average
2. **Fewer than 10 sessions:** 5 sessions → normalize weights proportionally
3. **Null handling:** Some sessions have `null` for metric → skip those, renormalize weights
4. **All nulls:** All sessions have `null` for a metric → return `null` for that metric
5. **Single session:** 1 session → should equal session value (weight = 1.0)
6. **Weight normalization:** Verify weights always sum to 1.0
7. **Recency bias:** Verify newest session has highest weight (0.2)

**Test Calculation Example:**
```javascript
const sessions = [
  { metrics: { reactionTime: 300 } },  // newest, weight 0.2
  { metrics: { reactionTime: 350 } },  // weight 0.18
  { metrics: { reactionTime: 400 } },  // weight 0.16
];
// Weighted avg = (300×0.2 + 350×0.18 + 400×0.16) / (0.2+0.18+0.16)
//              = (60 + 63 + 64) / 0.54 = 187 / 0.54 ≈ 346
```

**Null Handling Example:**
```javascript
const sessions = [
  { metrics: { cognitiveFlexibility: 0.8 } },  // weight 0.2
  { metrics: { cognitiveFlexibility: null } }, // SKIP, don't use weight
  { metrics: { cognitiveFlexibility: 0.9 } },  // weight 0.16
];
// Weighted avg = (0.8×0.2 + 0.9×0.16) / (0.2+0.16)
//              = (0.16 + 0.144) / 0.36 = 0.844
```

### Dependencies

- **Story 13.1** - Session record schema
- **Story 13.2-13.7** - All metric calculation functions
- **Story 13.9** - `getSessions()` from storage.js

### Implementation Notes

1. **Recency weighting** - Newest session = 0.2, oldest (10th) = 0.01
2. **Weight normalization** - If < 10 sessions, renormalize weights to sum to 1.0
3. **Null propagation** - Skip null metric values, adjust weights accordingly
4. **All nulls → null** - If all sessions have null for a metric, return null (not 0)
5. **Metric independence** - Calculate rolling average per metric separately
6. **Return object with 6 keys** - Always return all 6 metrics (null if insufficient data)
7. **Pure function** - No side effects, takes sessions array as input
8. **Used for dashboard** - Rolling averages shown in Skill Map, NOT single-session values
9. **Growth indicators** - Compare current rolling average to previous to show trends
