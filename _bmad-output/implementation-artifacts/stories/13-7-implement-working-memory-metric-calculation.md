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

### Files to Modify

- **`js/metrics.js`** - Add calculateWorkingMemory() function
- **`test/metrics.test.js`** - Unit tests

### Dependencies

- Story 13.1 (storage schema)

---

## Implementation Status

**✅ COMPLETED** - 2026-02-16 (Epic 13)

**File:** `js/metrics.js` (lines 331-400)
- `calculateWorkingMemory(rawEvents)` implemented
- Extracts combo periods from combo_start/combo_end events
- Calculates score rate ratio: combo vs normal gameplay
- Clamps [0.0, 3.0] and normalizes to 0-1 scale (combo can be 3x due to multipliers)
- Returns 0.5 neutral if no combo data

**Tests:** `test/metrics.test.js` (Tests 36-40) cover no combo, high combo performance, low combo performance

✅ All acceptance criteria met. ⚠️ Not yet integrated - requires combo_start/combo_end event recording.
