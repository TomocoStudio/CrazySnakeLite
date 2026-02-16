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

**Formula (per FR152):**
```javascript
spatialAwareness = snakeLengthAtDeath / (snakeArea / totalGridArea)
// Higher = better. Indicates efficient space usage before collision
```

---

## Implementation Status

**✅ COMPLETED** - 2026-02-16 (Epic 13)

**File:** `js/metrics.js` (lines 122-152)
- `calculateSpatialAwareness(snakeLength, gridWidth, gridHeight, gridUnitSize)` implemented
- Calculates grid coverage percentage from snake area
- Normalizes to 0-1 scale (100=poor, 1000=excellent)
- Returns 0.5 neutral if no data

**Tests:** `test/metrics.test.js` (Tests 19-21) cover short/medium/long snake scenarios

✅ All acceptance criteria met. ⚠️ Not yet integrated into game loop.

---

## Development

### Files to Modify

- **`js/metrics.js`** - Add calculateSpatialAwareness() function
- **`test/metrics.test.js`** - Unit tests

### Dependencies

- Story 13.1 (storage schema)
- Story 13.10 (metrics module structure)
