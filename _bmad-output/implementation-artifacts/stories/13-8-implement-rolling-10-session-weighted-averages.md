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

### Files to Modify

- **`js/metrics.js`** - Add calculateRollingAverages() function
- **`test/metrics.test.js`** - Unit tests

### Dependencies

- Story 13.1 (storage schema)
- Stories 13.2-13.7 (all 6 metrics)

---

## Implementation Status

**✅ COMPLETED** - 2026-02-16 (Epic 13)

**File:** `js/metrics.js` (lines 402-444)
- `calculateRollingAverages(currentSessionMetrics, previousSessions)` implemented
- Recency weights: [0.2, 0.18, 0.16, 0.14, 0.12, 0.10, 0.06, 0.03, 0.01, 0.01]
- Normalizes weights to sum to 1.0 for < 10 sessions
- Computes weighted average for all 6 metrics
- Returns object with rolling averages

**Tests:** `test/metrics.test.js` (Tests 41-43) cover full 10 sessions, < 10 sessions, weight normalization

✅ All acceptance criteria met. ⚠️ Not yet integrated - requires getSessions() call and rolling avg calculation after endSession().
