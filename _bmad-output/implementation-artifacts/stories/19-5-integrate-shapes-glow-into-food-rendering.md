# Story 19.5: Integrate Shapes and Glow into Food Rendering

**Epic:** 19 - Visual Clarity Enhancement (Food Recognition)
**Status:** 🔴 NOT STARTED
**Created:** 2026-02-16
**Completed:** —

---

## User Story

**As a** player
**I want** the new food shapes and glow effects to appear during gameplay
**So that** I benefit from improved visual recognition and dark background visibility

---

## Acceptance Criteria

**Given** Stories 19.1-19.4 are complete (progression system, shapes, glow, defensive pattern)
**When** food is rendered in food.js
**Then** it uses the distinctive shape for its type (star, ring, cross, etc.)

**And** it applies the score-appropriate glow intensity from progression system
**And** it uses the withShadow() helper for glow rendering
**And** shape + glow rendering completes within performance budget (< 2ms per frame for all food items)

**Given** a gameplay session from score 0 to 100+
**When** observing food appearance
**Then** shapes remain recognizable at all score tiers
**And** glow smoothly intensifies as background darkens (verified in Epic 20)
**And** no visual artifacts or shadow leaks occur

---

## Technical Notes

- Module: `food.js`, integrates with `render.js` helpers
- Dependencies: Stories 19.1, 19.2, 19.3, 19.4
- Update `renderFood()` function to call shape renderer + apply glow
- Performance budget: NFR-V3-1 (58+ FPS, max 17.24ms frame time)
- Validation: Play session 0-100+ score, FPS monitoring, visual inspection

---

## Development

### Files to Create/Modify

- **`js/render.js`** - Update `renderFood()` to use shapes + glow (already done in 19.2/19.3)
- **`js/food.js`** - No changes needed (already provides type, position, blinking state)
- **Manual testing checklist**

### Integration Summary

**This story is INTEGRATION ONLY** - all code written in Stories 19.1-19.4, now we validate it works together.

**renderFood() final form (from Stories 19.2 + 19.3 + 19.4):**

```javascript
export function renderFood(ctx, gameState) {
  const { position, type, isBlinking, blinkCycleIndex } = gameState.food;
  const x = position.x * CONFIG.UNIT_SIZE;
  const y = position.y * CONFIG.UNIT_SIZE;

  // Story 19.1: Get glow intensity from progression
  const { glowIntensity } = progression.getState(gameState.score);

  // Determine color (blinking or normal)
  let color, outlineColor, currentType;
  if (isBlinking) {
    currentType = CONFIG.BLINK_CYCLE[blinkCycleIndex];
    color = CONFIG.COLORS[`food${capitalize(currentType)}`];
    outlineColor = CONFIG.COLORS[`food${capitalize(currentType)}Outline`];
  } else {
    currentType = type;
    color = CONFIG.COLORS[`food${capitalize(type)}`];
    outlineColor = CONFIG.COLORS[`food${capitalize(type)}Outline`];
  }

  // Story 19.4: Use defensive rendering pattern for glow
  withShadow(ctx, { color, blur: glowIntensity }, (ctx) => {
    // Story 19.2: Render distinctive shape
    renderFoodShape(ctx, x, y, currentType, color, outlineColor);
  });
}
```

### Integration Points

- **Story 19.1** - `progression.getState(score).glowIntensity`
- **Story 19.2** - `renderFoodShape(ctx, x, y, type, color, outlineColor)`
- **Story 19.3** - Glow application (shadowBlur)
- **Story 19.4** - `withShadow()` defensive pattern

### Test Strategy

**Visual Validation Checklist:**

1. **All shapes render with correct glow:**
   - [ ] Score 0-49: All 6 shapes with 3px subtle glow
   - [ ] Score 50-79: All 6 shapes with 5px medium glow
   - [ ] Score 80+: All 6 shapes with 8px strong glow

2. **Blinking food works correctly:**
   - [ ] Shape cycles through all 6 types
   - [ ] Color cycles in sync with shape
   - [ ] Glow color matches current cycle color

3. **No visual artifacts:**
   - [ ] No shadow bleed on snake
   - [ ] No shadow bleed on grid
   - [ ] Shapes remain centered in cells

4. **Performance validation:**
   - [ ] FPS stays 58+ with 6 different foods on screen
   - [ ] No frame drops during blinking food cycles
   - [ ] No jank when spawning new food

**Performance Testing:**

```javascript
// Open DevTools → Performance tab
// Record 10 seconds of gameplay at score 50+
// Check "Main" thread:
//   - Frame time should be < 17.24ms (58 FPS)
//   - "Rendering" section should show < 2ms for food
```

**Accessibility Testing:**

```javascript
// Test contrast at score 100+ (dark background #2A2A2A)
// Use Chrome DevTools Color Picker or WebAIM Contrast Checker
// All 6 food colors + 8px glow should achieve 4.5:1 contrast minimum

// Expected results:
// - Green (#00FF00) + glow: ✓ PASS
// - Yellow (#FFFF00) + glow: ✓ PASS
// - Purple (#800080) + glow: ✓ PASS
// - Red (#FF0000) + glow: ✓ PASS
// - Cyan (#00CED1) + glow: ✓ PASS
// - Orange (#FFA500) + glow: ✓ PASS
```

**Edge Case Testing:**

1. **Rapid food spawning** (dev console force spawn)
2. **All 6 food types on screen simultaneously**
3. **Blinking food during high score (80+) with max glow**
4. **Food near grid edges** (verify no clipping)

### Dependencies

- **Story 19.1** ✓ MUST be complete (progression.getState)
- **Story 19.2** ✓ MUST be complete (renderFoodShape)
- **Story 19.3** ✓ MUST be complete (glow logic)
- **Story 19.4** ✓ MUST be complete (withShadow helper)

### Implementation Notes

1. **This is validation, not new code** - All implementation done in previous stories
2. **Test across score ranges** - 0-14, 15-49, 50-79, 80-99, 100+
3. **Blinking food critical path** - Uses `currentType` from cycle, not static `type`
4. **Performance budget** - Total food rendering < 2ms per frame
5. **No regressions** - Existing food spawn/consumption logic unchanged
6. **capitalize() helper** - Convert 'growing' → 'Growing' for color key lookup
7. **Config lookups** - All colors come from CONFIG.COLORS object
8. **Glow matches fill** - shadowColor = color (authentic CRT effect)
9. **Defensive cleanup** - withShadow() guarantees no shadow leaks
10. **Sign-off criteria** - All manual tests pass + FPS ≥ 58 + no visual artifacts
