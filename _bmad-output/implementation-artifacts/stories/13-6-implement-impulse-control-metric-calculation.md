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
    pickupBonus: number,     // Fibonacci value
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

### Files to Create/Modify

- **`js/metrics.js`** - Add `calculateImpulseControl()` function
- **`js/phone.js`** - Capture decision context (combo, score, blinking food state)
- **`test/metrics.test.js`** - Unit tests for impulse control calculation

### API Surface

```javascript
// metrics.js

/**
 * Calculate impulse control metric from weighted phone decisions
 * @param {Array} rawEvents - Session events including phone_call events with context
 * @returns {number|null} Weighted decision score (0.0-1.0), or null if no calls
 */
function calculateImpulseControl(rawEvents) {
  // Filter phone_call events
  // For each decision, calculate weight based on context
  // Sum weighted scores, normalize to 0.0-1.0
}
```

### Phone Call Event Schema (Extended)

```javascript
{
  type: 'phone_call',
  timestamp: number,
  decision: 'end' | 'pickup',
  context: {
    inComboMode: boolean,
    currentScore: number,
    pickupBonus: number,       // Fibonacci value
    blinkingFoodActive: boolean,
    snakeLength: number
  },
  // ... other fields from Story 13.5
}
```

### Integration Points

- **`phone.js`** - Capture game state context when call appears:
  ```javascript
  const context = {
    inComboMode: gameState.combo.isActive,
    currentScore: gameState.score,
    pickupBonus: getCurrentFibonacciBonus(),
    blinkingFoodActive: gameState.blinkingFood.isActive,
    snakeLength: gameState.snake.length
  };

  metrics.recordEvent({ type: 'phone_call', decision, context, ... });
  ```

### Weighting Rules

```javascript
// Pick Up during combo = +2 weight (high control)
// Pick Up at high score (80+) = +1.5 weight (medium control)
// Pick Up with blinking food = +1.5 weight (medium control)
// End during low stakes (score < 20, no combo) = 0 weight (neutral)
// Pick Up at low stakes = -1 weight (low control/impulsive)
```

### Test Strategy

**Unit Tests (`metrics.test.js`):**
1. **No phone calls:** Empty events → return `null`
2. **All strategic Pick Ups:** Combo + high score → high weight → ≈ 0.9
3. **All impulsive Pick Ups:** Low score, no combo → negative weights → ≈ 0.2
4. **All safe Ends:** Low stakes End calls → neutral weights → ≈ 0.5
5. **Mixed decisions:** Combination of strategic/impulsive/neutral → test normalization
6. **Edge case:** All End calls during high stakes → test weight calculation
7. **Normalization:** Verify output always in 0.0-1.0 range

**Test Data Example:**
```javascript
const testEvents = [
  { type: 'phone_call', decision: 'pickup', context: { inComboMode: true, currentScore: 85 } },  // +2 weight
  { type: 'phone_call', decision: 'pickup', context: { inComboMode: false, currentScore: 10 } }, // -1 weight
  { type: 'phone_call', decision: 'end', context: { inComboMode: false, currentScore: 15 } },    // 0 weight
];
// Total weight: 2 + (-1) + 0 = 1
// Max possible: 2 * 3 = 6
// Score: (1 + 3) / (6 + 3) = 4/9 ≈ 0.44  // Add offset to normalize range
```

### Dependencies

- **Story 13.1** - Session record schema
- **Story 13.10** - metrics.js module structure
- **Existing Epic 3** - Phone system, combo system, blinking food system

### Implementation Notes

1. **Context capture** - Read game state snapshot when phone call appears
2. **Multi-factor weighting** - Combine multiple context signals (combo, score, blinking)
3. **Normalization strategy** - Map weighted sum to 0.0-1.0 range (use min-max scaling)
4. **Negative weights allowed** - Impulsive decisions get negative scores
5. **Neutral baseline** - Safe End calls don't penalize or reward
6. **Return null for no calls** - Not 0, signals insufficient data
7. **Access combo state** - Read `gameState.combo.isActive` from combo.js
8. **Access blinking state** - Read `gameState.blinkingFood.isActive` from food.js
9. **Fibonacci bonus** - Current pickup bonus from phone progression system
