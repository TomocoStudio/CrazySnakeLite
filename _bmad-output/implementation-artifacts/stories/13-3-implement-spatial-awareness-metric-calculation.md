# Story 13.3: Implement Spatial Awareness Metric Calculation

**Epic:** 13 - Cognitive Metrics Data Engine

**As a** player,
**I want** the game to measure how efficiently I use the game board space,
**So that** I can see my spatial navigation skill.

---

## Acceptance Criteria

**Given** the game ends (player dies)
**When** calculating spatialAwareness metric
**Then** record final snake length at death
**And** calculate grid coverage percentage: (snake.length × GRID_UNIT_SIZE²) / (GRID_WIDTH × GRID_HEIGHT)
**And** compute spatialAwareness = snakeLengthAtDeath / gridCoveragePercentage

**Given** player reaches score 50 with snake length 55
**When** death occurs
**Then** spatialAwareness = 55 / ((55 × 10²) / (250 × 200)) = 55 / 0.11 = 500
**And** store spatialAwareness value in metrics object

**Formula (per FR152):**
```javascript
spatialAwareness = snakeLengthAtDeath / (snakeArea / totalGridArea)
// Higher = better. Indicates efficient space usage before collision
```

---

## Development

### Files to Create/Modify

- **`js/metrics.js`** - Add `calculateSpatialAwareness()` function
- **`js/config.js`** - Verify `GRID_WIDTH`, `GRID_HEIGHT`, `GRID_UNIT_SIZE` constants
- **`test/metrics.test.js`** - Unit tests for spatial awareness calculation

### API Surface

```javascript
// metrics.js

/**
 * Calculate spatial awareness metric from final snake length
 * @param {number} snakeLengthAtDeath - Final snake length when player died
 * @param {Object} gridConfig - { width, height, unitSize } from config.js
 * @returns {number} Spatial awareness score (higher = better)
 */
function calculateSpatialAwareness(snakeLengthAtDeath, gridConfig) {
  const snakeArea = snakeLengthAtDeath * (gridConfig.unitSize ** 2);
  const totalGridArea = gridConfig.width * gridConfig.height;
  const gridCoverage = snakeArea / totalGridArea;
  return snakeLengthAtDeath / gridCoverage;
}
```

### Integration Points

- **`game.js`** - Pass `gameState.snake.length` to metrics on death
- **`config.js`** - Read `GRID_WIDTH`, `GRID_HEIGHT`, `GRID_UNIT_SIZE`
- **Session record** - Store as `metrics.spatialAwareness`

### Test Strategy

**Unit Tests (`metrics.test.js`):**
1. **Example from AC:** Snake length 55, grid 250×200, unit 10 → verify ≈ 500
2. **Small snake:** Length 10 → verify low score
3. **Large snake:** Length 100 → verify high score
4. **Grid size variation:** Test with different grid dimensions
5. **Edge case:** Length 0 → return 0 (not null, player died immediately)

**Test Calculation Example:**
```javascript
// Grid: 250×200, Unit: 10, Snake: 55
const snakeArea = 55 * (10 ** 2) = 5500
const totalArea = 250 * 200 = 50000
const coverage = 5500 / 50000 = 0.11
const score = 55 / 0.11 = 500
```

### Dependencies

- **Story 13.1** - Session record schema
- **Story 13.10** - `metrics.js` module structure

### Implementation Notes

1. **Simple calculation** - No statistical processing, just final snake length
2. **Always valid** - Every game produces this metric (no null case)
3. **Grid constants** - Import from `config.js`: `GRID_WIDTH`, `GRID_HEIGHT`, `GRID_UNIT_SIZE`
4. **Higher is better** - Longer snake in same space = better spatial efficiency
5. **No time component** - Pure spatial metric, ignores survival time
6. **Typical range** - 100-1000 for most players (use for sanity checks)
7. **Record at death** - Capture `gameState.snake.length` in `onDeath()` before reset
