# Story 19.1: Extend Progression System to 8 Fields

**Epic:** 19 - Visual Clarity Enhancement (Food Recognition)
**Status:** 🔴 NOT STARTED
**Created:** 2026-02-16
**Completed:** —

---

## User Story

**As a** developer implementing visual enhancements
**I want** the progression system to support 8 configuration fields instead of 3
**So that** I can gate visual effects (glow intensity, grid opacity) based on score alongside existing mechanics

---

## Acceptance Criteria

**Given** the current progression system supports 3 fields (speed, phoneFrequency, effectChance)
**When** I extend it to support 8 fields total
**Then** the system should support 5 additional fields: glowIntensity, gridOpacity, backgroundColor, borderColor, titleEffect

**And** existing 3 fields continue to work without regression
**And** new fields follow the same tier-based resolution pattern
**And** config.js defines thresholds for all 8 fields
**And** progression.js resolves current tier for any requested field

---

## Technical Notes

- Module: `progression.js`, `config.js`
- Pattern: Score-Gated Visual Progression System (Decision 11)
- Dependencies: None (foundation work)
- Validation: Unit tests for tier resolution with all 8 fields

---

## Development

### Files to Create/Modify

- **`js/progression.js`** - Add `getState()` function to return 8 fields based on score
- **`js/config.js`** - Add 5 new progression threshold arrays
- **`test/progression.test.js`** - Unit tests for multi-field tier resolution

### API Surface

```javascript
// progression.js (NEW exports)

/**
 * Get current progression state for all 8 visual/gameplay fields
 * @param {number} score - Current game score
 * @returns {Object} Current state with 8 fields
 */
export function getState(score) {
  return {
    // Existing fields (from V1/V2)
    speed: resolveThreshold(score, CONFIG.SPEED_THRESHOLDS),
    phoneFrequency: resolveThreshold(score, CONFIG.PHONE_FREQUENCY_THRESHOLDS),
    effectChance: resolveThreshold(score, CONFIG.EFFECT_CHANCE_THRESHOLDS),

    // New visual fields (V4)
    glowIntensity: resolveThreshold(score, CONFIG.GLOW_INTENSITY_THRESHOLDS),
    gridOpacity: resolveThreshold(score, CONFIG.GRID_OPACITY_THRESHOLDS),
    backgroundColor: resolveThreshold(score, CONFIG.BACKGROUND_THRESHOLDS),
    gridLineColor: resolveThreshold(score, CONFIG.GRID_LINE_THRESHOLDS),
    gridDotOpacity: resolveThreshold(score, CONFIG.GRID_DOT_OPACITY_THRESHOLDS)
  };
}

/**
 * Generic threshold resolver (already exists, but needs to handle new field types)
 * @param {number} score - Current score
 * @param {Array} thresholds - Threshold array with {minScore, maxScore, value}
 * @returns {*} Resolved value (can be number, string, etc.)
 */
function resolveThreshold(score, thresholds) {
  for (const tier of thresholds) {
    if (score >= tier.minScore && score <= tier.maxScore) {
      return tier.value || tier.probability || tier.blur || tier.background || tier.opacity;
    }
  }
  return thresholds[thresholds.length - 1].value; // Fallback to max tier
}
```

### Config Changes

**Add to `config.js`:**

```javascript
// V4 Visual Progression Thresholds

// Enhancement 3: CRT Phosphor Glow
export const GLOW_INTENSITY_THRESHOLDS = [
  { minScore: 0,   maxScore: 49,  blur: 3 },
  { minScore: 50,  maxScore: 79,  blur: 5 },
  { minScore: 80,  maxScore: Infinity, blur: 8 }
];

// Enhancement 1: Progressive Dark Playfield (background colors)
export const BACKGROUND_THRESHOLDS = [
  { minScore: 0,   maxScore: 14,  background: '#E8E8E8' },
  { minScore: 15,  maxScore: 29,  background: '#D0D0D0' },
  { minScore: 30,  maxScore: 49,  background: '#B0B0B0' },
  { minScore: 50,  maxScore: 79,  background: '#808080' },
  { minScore: 80,  maxScore: 99,  background: '#505050' },
  { minScore: 100, maxScore: Infinity, background: '#2A2A2A' }
];

// Enhancement 1: Grid line colors (darken with background)
export const GRID_LINE_THRESHOLDS = [
  { minScore: 0,   maxScore: 14,  gridLine: '#A0A0A0' },
  { minScore: 15,  maxScore: 29,  gridLine: '#909090' },
  { minScore: 30,  maxScore: 49,  gridLine: '#808080' },
  { minScore: 50,  maxScore: 79,  gridLine: '#606060' },
  { minScore: 80,  maxScore: 99,  gridLine: '#404040' },
  { minScore: 100, maxScore: Infinity, gridLine: '#1A1A1A' }
];

// Enhancement 8: Grid line opacity (fade out as BG darkens)
export const GRID_OPACITY_THRESHOLDS = [
  { minScore: 0,   maxScore: 49,  opacity: 1.0 },
  { minScore: 50,  maxScore: 79,  opacity: 0.7 },
  { minScore: 80,  maxScore: 99,  opacity: 0.5 },
  { minScore: 100, maxScore: Infinity, opacity: 0.3 }
];

// Enhancement 8: Grid dots opacity (ghost grid effect)
export const GRID_DOT_OPACITY_THRESHOLDS = [
  { minScore: 0,   maxScore: 49,  opacity: 0 },     // No dots at low scores
  { minScore: 50,  maxScore: 79,  opacity: 0.15 },
  { minScore: 80,  maxScore: 99,  opacity: 0.25 },
  { minScore: 100, maxScore: Infinity, opacity: 0.35 }
];
```

### Integration Points

- **`render.js`** - Will call `progression.getState(score)` to get visual settings
- **`game.js`** - Passes score to rendering functions
- **No changes needed to V1/V2 systems** - They already use progression.js

### Test Strategy

**Unit Tests (`progression.test.js`):**
1. **Test getState() at key scores:**
   - Score 0 → verify tier 1 values for all 8 fields
   - Score 50 → verify tier transitions (glow: 5px, gridOpacity: 0.7)
   - Score 100 → verify max tier values (glow: 8px, background: '#2A2A2A')
2. **Test threshold resolution:**
   - Verify blur values resolve correctly (3, 5, 8)
   - Verify color strings resolve correctly (hex codes)
   - Verify opacity decimals resolve correctly (0.3, 0.7, 1.0)
3. **Test edge cases:**
   - Score -1 → should fallback gracefully
   - Score 9999 → should return max tier
4. **Test backward compatibility:**
   - Existing fields (speed, phoneFrequency, effectChance) still work

**Test Data Example:**
```javascript
test('getState at score 100 returns Neon Noir tier', () => {
  const state = progression.getState(100);
  expect(state.glowIntensity).toBe(8);
  expect(state.backgroundColor).toBe('#2A2A2A');
  expect(state.gridOpacity).toBe(0.3);
  expect(state.gridDotOpacity).toBe(0.35);
});
```

### Dependencies

**NONE** - This is the foundation story. Must be implemented FIRST before any other Epic 19 stories.

### Implementation Notes

1. **Generic threshold resolver** - `resolveThreshold()` already exists, just extend to handle new field names
2. **Field name consistency** - Use same keys in `getState()` return object and config arrays
3. **Fallback logic** - Always return max tier value if score exceeds all thresholds
4. **Type flexibility** - Thresholds can return numbers, strings, booleans (handle all types)
5. **No breaking changes** - Existing V1/V2 code continues to work unchanged
6. **Config organization** - Group all visual thresholds together in config.js
7. **Comment each threshold array** - Mark which Enhancement it supports (1, 3, 8, etc.)
8. **Export all new constants** - Don't forget `export const` for each threshold array
9. **Test at boundary scores** - 0, 14, 15, 49, 50, 79, 80, 99, 100, 150
10. **Return object, not individual values** - Single function call returns all 8 fields
