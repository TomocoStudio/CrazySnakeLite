# Story 19.4: Implement Defensive Rendering Pattern

**Epic:** 19 - Visual Clarity Enhancement (Food Recognition)
**Status:** 🔴 NOT STARTED
**Created:** 2026-02-16
**Completed:** —

---

## User Story

**As a** developer working with canvas effects
**I want** a defensive rendering pattern that guarantees canvas state cleanup
**So that** shadow/glow effects never leak between render calls

---

## Acceptance Criteria

**Given** multiple canvas operations use shadow effects (food glow, snake head highlight)
**When** implementing the `withShadow()` helper function
**Then** it accepts ctx, shadowConfig object, and drawFn callback

**And** it sets shadow properties (shadowColor, shadowBlur, shadowOffset) before calling drawFn
**And** it GUARANTEES cleanup by resetting shadow properties after drawFn completes
**And** cleanup happens even if drawFn throws an error (try/finally pattern)

**Given** food rendering uses the withShadow pattern
**When** multiple food items are rendered in sequence
**Then** no visual artifacts or shadow bleed occurs
**And** non-glowing elements (snake, grid) remain shadow-free

---

## Technical Notes

- Module: `render.js` (create utility function)
- Reference: Winston's architecture.md Pattern 11, Sally's technical addendum
- Implementation:
  ```javascript
  function withShadow(ctx, shadowConfig, drawFn) {
    const { color, blur } = shadowConfig;
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
    ctx.shadowOffsetX = 0;
    ctx.shadowOffsetY = 0;
    try {
      drawFn(ctx);
    } finally {
      ctx.shadowColor = 'transparent';
      ctx.shadowBlur = 0;
    }
  }
  ```
- Validation: Render 100 food items, inspect final canvas state (should have no shadow properties set)

---

## Development

### Files to Create/Modify

- **`js/render.js`** - Add `withShadow()` helper function
- **`test/render.test.js`** - Unit tests for cleanup guarantee

### API Surface

```javascript
// render.js (NEW utility function)

/**
 * Defensive rendering pattern - guarantees canvas shadow cleanup
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} shadowConfig - { color: string, blur: number }
 * @param {Function} drawFn - Drawing function to execute with shadow
 */
function withShadow(ctx, shadowConfig, drawFn) {
  const { color, blur } = shadowConfig;

  // Apply shadow properties
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;

  try {
    // Execute drawing function (may throw)
    drawFn(ctx);
  } finally {
    // ALWAYS cleanup, even if drawFn throws
    ctx.shadowColor = 'transparent';
    ctx.shadowBlur = 0;
  }
}
```

### Usage Example

```javascript
// BEFORE (manual cleanup, error-prone)
ctx.shadowColor = color;
ctx.shadowBlur = 8;
renderFoodShape(ctx, x, y, type, color, outlineColor);
ctx.shadowBlur = 0;  // Easy to forget!

// AFTER (defensive pattern, guaranteed cleanup)
withShadow(ctx, { color, blur: 8 }, (ctx) => {
  renderFoodShape(ctx, x, y, type, color, outlineColor);
});
```

### Integration Points

**Use in `renderFood()`:**
```javascript
export function renderFood(ctx, gameState) {
  const { glowIntensity } = progression.getState(gameState.score);
  // ... determine color, outlineColor ...

  withShadow(ctx, { color, blur: glowIntensity }, (ctx) => {
    renderFoodShape(ctx, x, y, type, color, outlineColor);
  });
}
```

**Future use cases:**
- Snake head highlight (Enhancement 4)
- Any other canvas shadow effects

### Test Strategy

**Unit Tests (`render.test.js`):**

```javascript
describe('withShadow defensive pattern', () => {
  let ctx;

  beforeEach(() => {
    ctx = document.createElement('canvas').getContext('2d');
  });

  test('applies shadow properties before calling drawFn', () => {
    let capturedBlur;
    withShadow(ctx, { color: '#FF0000', blur: 5 }, (ctx) => {
      capturedBlur = ctx.shadowBlur;
    });
    expect(capturedBlur).toBe(5);
  });

  test('resets shadow properties after drawFn completes', () => {
    withShadow(ctx, { color: '#FF0000', blur: 8 }, () => {});
    expect(ctx.shadowBlur).toBe(0);
    expect(ctx.shadowColor).toBe('transparent');
  });

  test('resets shadow even if drawFn throws error', () => {
    try {
      withShadow(ctx, { color: '#FF0000', blur: 8 }, () => {
        throw new Error('Test error');
      });
    } catch (e) {
      // Error expected
    }

    // Shadow MUST be reset despite error
    expect(ctx.shadowBlur).toBe(0);
    expect(ctx.shadowColor).toBe('transparent');
  });

  test('multiple withShadow calls do not leak state', () => {
    withShadow(ctx, { color: '#FF0000', blur: 8 }, () => {});
    withShadow(ctx, { color: '#00FF00', blur: 3 }, () => {});
    withShadow(ctx, { color: '#0000FF', blur: 5 }, () => {});

    // Final state should be clean
    expect(ctx.shadowBlur).toBe(0);
  });
});
```

**Visual Testing:**
1. Render 100 food items in sequence
2. Inspect final canvas context shadow state (should be 0)
3. Verify no shadow appears on snake or grid

### Dependencies

- **None** - This is a utility function, can be implemented independently
- **Used by Story 19.3** - Recommended to implement 19.4 before or during 19.3

### Implementation Notes

1. **try/finally pattern** - Guarantees cleanup even if `drawFn()` throws
2. **No return value** - Pure side effect function, modifies canvas state
3. **Callback pattern** - `drawFn` receives ctx as parameter for clarity
4. **Set shadowOffset to 0** - Creates symmetrical glow, not directional shadow
5. **Reset to transparent** - Not just empty string, use 'transparent' for clarity
6. **Module-private function** - Don't export, only used internally in render.js
7. **Consider for other effects** - Can be reused for any shadow-based rendering
8. **Performance** - try/finally has negligible overhead (<0.001ms)
9. **Alternative pattern** - Could use save()/restore() but that resets ALL canvas state (overkill)
10. **Documentation** - Add JSDoc comments explaining the defensive pattern rationale
