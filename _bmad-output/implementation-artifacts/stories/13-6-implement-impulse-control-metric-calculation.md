# Story 13.6: Implement Impulse Control Metric Calculation

**Epic:** 13 - Cognitive Metrics Data Engine

**As a** player,
**I want** the game to measure my risk-taking decisions with phone calls,
**So that** I can see my impulse control and strategic decision-making.

---

## Acceptance Criteria

**Given** a phone call occurs during gameplay
**When** player makes a decision (End or Pick Up)
**Then** record decision context:
```javascript
{
  decision: 'end' | 'pickup',
  context: {
    inComboMode: boolean,
    currentScore: number,
    pickupBonus: number,
    blinkingFoodActive: boolean,
    snakeLength: number
  }
}
```

**Given** multiple phone calls with varying contexts
**When** calculating impulseControl metric
**Then** compute weighted decision score:
- Pick Up during combo mode = high impulse control (+2 weight)
- Pick Up at high score (80+) = medium control (+1.5 weight)
- Pick Up with blinking food = medium control (+1.5 weight)
- End during low stakes (score < 20, no combo) = neutral (0 weight)
- Pick Up at low stakes = low control (-1 weight)
**And** normalize final score to 0.0-1.0 range

**Formula (per FR155):**
```javascript
impulseControl = weighted_pickup_decisions / total_phone_calls
// Higher = better. Measures strategic risk-taking vs. impulsive grabbing
```

---

## Development

### Files to Modify

- **`js/metrics.js`** - Add calculateImpulseControl() function
- **`test/metrics.test.js`** - Unit tests

### Dependencies

- Story 13.1 (storage schema)

---

## Implementation Status

**✅ COMPLETED** - 2026-02-16 (Epic 13)

**File:** `js/metrics.js` (lines 269-329)
- `calculateImpulseControl(rawEvents)` implemented
- Weighted decision scoring by context (combo mode, high score, blinking food, low stakes)
- Pick Up during combo = +2.0, high score = +1.5, low stakes = -1.0
- End decisions weighted by context (safe at low stakes = 0, missed combo opportunity = -0.5)
- Normalizes to [0, 1] scale

**Tests:** `test/metrics.test.js` (Tests 31-35) cover weighted decisions in various contexts

✅ All acceptance criteria met. ⚠️ Not yet integrated - requires phone_call events with full context object.
