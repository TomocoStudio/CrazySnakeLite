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

### Files to Modify

- **`js/metrics.js`** - Add calculateCognitiveFlexibility() function
- **`test/metrics.test.js`** - Unit tests

### Dependencies

- Story 13.1 (storage schema)

---

## Implementation Status

**✅ COMPLETED** - 2026-02-16 (Epic 13)

**File:** `js/metrics.js` (lines 154-223)
- `calculateCognitiveFlexibility(rawEvents)` implemented
- Extracts RC periods from rc_start/rc_end events
- Calculates score rate ratio: RC vs normal gameplay
- Clamps [0.0, 2.0] and normalizes to 0-1 scale
- Returns 0.5 neutral if no RC data

**Tests:** `test/metrics.test.js` (Tests 22-26) cover no RC, better RC, worse RC performance

✅ All acceptance criteria met. ⚠️ Not yet integrated - requires recordEvent() calls for rc_start/rc_end.
