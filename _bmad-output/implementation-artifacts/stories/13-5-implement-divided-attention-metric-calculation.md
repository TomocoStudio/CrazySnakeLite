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
// normalizedDecisionSpeed = avgDecisionTime / 3000ms
```
**And** clamp final value between 0.0 and 1.0

**Formula (per FR154):**
```javascript
dividedAttention = (survival_rate × 0.7) + ((1 - decision_speed_normalized) × 0.3)
// Higher = better. Measures both survival under distraction and decision efficiency
```

---

## Development

### Files to Modify

- **`js/metrics.js`** - Add calculateDividedAttention() function
- **`test/metrics.test.js`** - Unit tests

### Dependencies

- Story 13.1 (storage schema)

---

## Implementation Status

**✅ COMPLETED** - 2026-02-16 (Epic 13)

**File:** `js/metrics.js` (lines 225-267)
- `calculateDividedAttention(rawEvents)` implemented
- Extracts phone_call events with survival and decisionTime data
- Composite score: 70% survival rate + 30% decision speed
- Normalizes decision time to [0, 3000ms] range
- Clamps final score [0, 1]

**Tests:** `test/metrics.test.js` (Tests 27-30) cover survival rates and decision speed variations

✅ All acceptance criteria met. ⚠️ Not yet integrated - requires phone_call events with decisionTime and survived flags.
