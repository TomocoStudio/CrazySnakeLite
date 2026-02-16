# Story 19.2: Create Food Shape Rendering System

**Epic:** 19 - Visual Clarity Enhancement (Food Recognition)
**Status:** 🔴 NOT STARTED
**Created:** 2026-02-16
**Completed:** —

---

## User Story

**As a** player
**I want** each food type to have a distinctive pixel-art shape
**So that** I can instantly recognize food types in peripheral vision without reading colors

---

## Acceptance Criteria

**Given** 6 food types exist (normal, invincibility, wallPhase, speedBoost, speedDecrease, reverseControls)
**When** food is rendered on the canvas
**Then** each type displays a unique shape: filled square (normal), 4-point star (invincibility), ring (wallPhase), cross (speedBoost), hollow square (speedDecrease), X (reverseControls)

**And** shapes are centered within the grid cell
**And** shapes maintain consistent visual weight (similar perceived size)
**And** shapes use the existing food type colors
**And** shapes are rendered at 80% cell size for padding consistency

**Given** the player encounters each shape 5 times
**When** measuring recognition speed
**Then** dual-channel recognition (shape + color) achieves ~200ms identification vs ~400ms for color-only

---

## Technical Notes

- Module: `food.js`, `render.js`
- Reference: Sally's technical addendum - "Six Distinctive Food Shapes" section
- Shape rendering uses canvas path operations (fillRect, arc, moveTo/lineTo)
- Semantic mapping: star = power, ring = pass-through, X = danger
- Validation: Visual inspection + performance test (food rendering < 2ms per frame)

---

## Development

### Files to Create/Modify

- **`js/render.js`** - Add `renderFoodShape()` function with 6 shape cases
- **`js/config.js`** - Add food outline colors and update FOOD_SIZE
- **`js/food.js`** - Update to pass shape type to render function

### API Surface

```javascript
// render.js (NEW function)

/**
 * Render distinctive shape for food type (Enhancement 2)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - Top-left x coordinate
 * @param {number} y - Top-left y coordinate
 * @param {string} type - Food type (growing, invincibility, wallPhase, etc.)
 * @param {string} color - Fill color
 * @param {string} outlineColor - Outline color (darker variant)
 */
function renderFoodShape(ctx, x, y, type, color, outlineColor) {
  const cx = x + CONFIG.UNIT_SIZE / 2;  // center x
  const cy = y + CONFIG.UNIT_SIZE / 2;  // center y

  ctx.fillStyle = color;
  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = 1;

  switch (type) {
    case 'growing':
      // Filled square (12x12, centered)
      ctx.fillRect(cx - 6, cy - 6, 12, 12);
      ctx.strokeRect(cx - 6, cy - 6, 12, 12);
      break;

    case 'invincibility':
      // 4-point star
      ctx.beginPath();
      ctx.moveTo(cx, cy - 7);
      ctx.lineTo(cx + 3, cy - 3);
      ctx.lineTo(cx + 7, cy);
      ctx.lineTo(cx + 3, cy + 3);
      ctx.lineTo(cx, cy + 7);
      ctx.lineTo(cx - 3, cy + 3);
      ctx.lineTo(cx - 7, cy);
      ctx.lineTo(cx - 3, cy - 3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case 'wallPhase':
      // Hollow circle (ring)
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(cx, cy, 7.5, 0, Math.PI * 2);
      ctx.lineWidth = 1;
      ctx.strokeStyle = outlineColor;
      ctx.stroke();
      break;

    case 'speedBoost':
      // Cross / Plus (+)
      ctx.fillRect(cx - 2, cy - 7, 4, 14);
      ctx.fillRect(cx - 7, cy - 2, 14, 4);
      ctx.strokeRect(cx - 2, cy - 7, 4, 14);
      ctx.strokeRect(cx - 7, cy - 2, 14, 4);
      break;

    case 'speedDecrease':
      // Hollow square
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 7, cy - 7, 14, 14);
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - 8, cy - 8, 16, 16);
      break;

    case 'reverseControls':
      // X shape (diagonal cross)
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - 6);
      ctx.lineTo(cx + 6, cy + 6);
      ctx.moveTo(cx + 6, cy - 6);
      ctx.lineTo(cx - 6, cy + 6);
      ctx.stroke();
      ctx.lineWidth = 5;
      ctx.strokeStyle = outlineColor;
      ctx.globalCompositeOperation = 'destination-over';
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - 6);
      ctx.lineTo(cx + 6, cy + 6);
      ctx.moveTo(cx + 6, cy - 6);
      ctx.lineTo(cx - 6, cy + 6);
      ctx.stroke();
      ctx.globalCompositeOperation = 'source-over';
      break;
  }
}
```

### Config Changes

**Add to `config.js`:**

```javascript
// Enhancement 2: Food shapes
export const FOOD_SIZE = 14;  // Updated from 11 for shape clarity

// Food outline colors (darker variants for 1px border)
export const COLORS = {
  // ... existing colors ...

  // Food outline colors (Enhancement 2)
  foodGrowingOutline: '#009900',
  foodInvincibilityOutline: '#B8B800',
  foodWallPhaseOutline: '#550055',
  foodSpeedBoostOutline: '#B30000',
  foodSpeedDecreaseOutline: '#009199',
  foodReverseControlsOutline: '#B37400'
};
```

### Integration Points

- **`food.js`** - Update `renderFood()` to call `renderFoodShape()` instead of `fillRect()`
- **Blinking food** - During blink cycle, pass current cycle type to `renderFoodShape()`
- **Food position** - Already calculated as `x = position.x * UNIT_SIZE`

### Test Strategy

**Manual Testing (Visual Validation):**
1. **All 6 shapes render correctly:**
   - Growing: green filled square
   - Invincibility: yellow 4-point star
   - WallPhase: purple ring (hollow circle)
   - SpeedBoost: red cross/plus
   - SpeedDecrease: cyan hollow square
   - ReverseControls: orange X
2. **Shapes are centered** in grid cells
3. **Visual weight** feels consistent (no shape dominates)
4. **Outlines visible** against both light and dark backgrounds

**Performance Testing:**
```javascript
// Test food rendering performance
const startTime = performance.now();
for (let i = 0; i < 100; i++) {
  renderFoodShape(ctx, x, y, 'invincibility', '#FFFF00', '#B8B800');
}
const duration = performance.now() - startTime;
console.log(`100 food renders: ${duration}ms (should be < 20ms)`);
```

**Blinking Food Test:**
1. Reach score 15+ to spawn blinking food
2. Verify shape cycles through all 6 types in sync with color
3. Verify no visual glitches during rapid cycling

### Dependencies

- **Story 19.1** - Progression system (NOT required for shapes, but recommended first)
- **Existing food system** - food.js already has type and color logic

### Implementation Notes

1. **Canvas primitive operations** - Uses `fillRect()`, `strokeRect()`, `arc()`, `moveTo()`, `lineTo()`
2. **No image assets** - All shapes drawn procedurally (lightweight, scalable)
3. **Center-based coordinates** - Calculate `cx, cy` as cell center, then draw shapes relative to center
4. **Consistent sizing** - All shapes fit within 14×14 pixel bounding box
5. **Outline strategy** - 1px darker outline provides contrast on any background
6. **Composite operation for X** - Use `destination-over` to put outline behind main X strokes
7. **Reset composite mode** - Always reset `globalCompositeOperation` to `source-over` after X rendering
8. **Helper for capitalize** - `capitalize(type)` to convert 'growing' → 'Growing' for color lookup
9. **Blinking food integration** - Shape type comes from `blinkCycleIndex`, not static food type
10. **Performance** - Simple shapes, no fills with complex paths, should be <0.2ms per shape
