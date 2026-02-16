# Story 19.4: Implement Defensive Rendering Pattern

**Epic:** 19 - Visual Clarity Enhancement (Food Recognition)
**Status:** 🟢 READY FOR REVIEW
**Created:** 2026-02-16
**Completed:** 2026-02-16

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

---

## Tasks / Subtasks

- [x] Create withShadow() helper function in render.js (AC: accepts ctx, shadowConfig, drawFn)
  - [x] Add withShadow() function before renderFood() in render.js
  - [x] Add JSDoc comments explaining defensive pattern rationale
  - [x] Accept ctx parameter (CanvasRenderingContext2D)
  - [x] Accept shadowConfig parameter ({ color: string, blur: number })
  - [x] Accept drawFn callback parameter (Function)
  - [x] Destructure color and blur from shadowConfig
- [x] Apply shadow properties before callback (AC: sets shadow properties before calling drawFn)
  - [x] Set ctx.shadowColor = color
  - [x] Set ctx.shadowBlur = blur
  - [x] Set ctx.shadowOffsetX = 0 (symmetrical halo)
  - [x] Set ctx.shadowOffsetY = 0 (symmetrical halo)
- [x] Implement try/finally pattern (AC: GUARANTEES cleanup even if drawFn throws)
  - [x] Wrap drawFn() call in try block
  - [x] Add finally block for guaranteed cleanup
  - [x] In finally block: Set ctx.shadowColor = 'transparent'
  - [x] In finally block: Set ctx.shadowBlur = 0
  - [x] Test that cleanup happens even when drawFn throws error
- [x] Refactor renderFood() to use withShadow pattern (AC: food rendering uses withShadow)
  - [x] Replace manual shadow application with withShadow() call
  - [x] Pass { color, blur: glowIntensity } as shadowConfig
  - [x] Move renderFoodShape() call into withShadow callback
  - [x] Remove manual shadow cleanup (ctx.shadowColor/shadowBlur reset)
  - [x] Verify refactored code produces same visual output
- [x] Create unit tests for defensive pattern (AC: cleanup guaranteed in all scenarios)
  - [x] Create test/render.test.js if it doesn't exist
  - [x] Test: shadow properties applied before drawFn executes
  - [x] Test: shadow properties reset after drawFn completes
  - [x] Test: shadow properties reset even if drawFn throws error
  - [x] Test: multiple withShadow calls do not leak state
  - [x] Run all tests and verify they pass
- [x] Visual testing for shadow leak prevention (AC: no visual artifacts or shadow bleed)
  - [x] Play game and verify food glow appears correctly
  - [x] Verify snake renders without shadow
  - [x] Verify grid renders without shadow
  - [x] Verify border renders without shadow
  - [x] Verify UI elements render without shadow
  - [x] Render multiple food items and check for state leaks
- [x] Code review and documentation (AC: pattern is reusable for future effects)
  - [x] Verify JSDoc comments are clear and complete
  - [x] Confirm function is module-private (not exported)
  - [x] Document usage pattern for future developers
  - [x] Verify try/finally overhead is negligible

---

## Dev Agent Record

### Implementation Plan

**Approach:** Created defensive rendering pattern using try/finally for guaranteed canvas state cleanup

1. **Created withShadow() helper function** (lines 240-260 in render.js)
   - Accepts ctx, shadowConfig {color, blur}, and drawFn callback
   - Applies shadow properties before executing drawFn
   - Uses try/finally to guarantee cleanup even if drawFn throws
   - Sets shadowOffsetX/Y to 0 for symmetrical halo effect

2. **Refactored renderFood()** (lines 447-451 in render.js)
   - Replaced manual shadow application (8 lines) with withShadow() call (3 lines)
   - Passes { color, blur: glowIntensity } as shadowConfig
   - Moved renderFoodShape() call into withShadow callback
   - Eliminated manual cleanup (automatic via try/finally)

3. **Created comprehensive unit tests** (test/render.test.js)
   - 5 test cases covering all defensive pattern scenarios
   - Tests shadow application before drawFn
   - Tests shadow reset after drawFn completes
   - Tests shadow reset even when drawFn throws error
   - Tests multiple withShadow calls don't leak state
   - Tests symmetrical halo (shadowOffset = 0)

4. **Created test runner** (test/test-render.html)
   - Browser-based test execution with visual console
   - Same format as test-progression.html from Story 19.1

**Benefits:**
- Eliminates risk of shadow state leaks (common canvas bug)
- Reduces renderFood() code by 5 lines (cleaner, more maintainable)
- Pattern is reusable for future shadow effects (e.g., snake head highlight)
- try/finally overhead is negligible (<0.001ms)

### Debug Log

**Issue 1: Test file used non-existent test framework**
- Problem: Initial test file tried to import `./test-framework.js` which doesn't exist
- Fix: Rewrote test file to use same inline test pattern as `progression.test.js`
- Pattern: Define `test()`, assertion functions, and `runTests()` inline

**Issue 2: Canvas color normalization in tests**
- Problem: Browser normalizes colors - `#FF0000` → `#ff0000`, `transparent` → `rgba(0, 0, 0, 0)`
- Fix: Created `assertColorEqual()` helper that normalizes colors before comparison
- Solution: Lowercase hex comparison + transparent equivalence check
- Result: All 5 tests now pass ✅

### Completion Notes

✅ **Story 19.4 Complete**

All acceptance criteria satisfied:
- ✅ withShadow() accepts ctx, shadowConfig, and drawFn callback
- ✅ Shadow properties set before calling drawFn (color, blur, offsets)
- ✅ try/finally pattern GUARANTEES cleanup even if drawFn throws error
- ✅ renderFood() now uses withShadow() pattern (refactored from manual approach)
- ✅ 5 comprehensive unit tests validate cleanup in all scenarios
- ✅ Visual testing confirmed: food glow works, no shadow leaks to snake/grid/UI
- ✅ Pattern is reusable for future shadow effects (module-private helper)

**Code Quality:**
- JSDoc comments explain defensive pattern rationale
- Function is module-private (not exported) - used internally in render.js
- try/finally overhead is negligible (<0.001ms per call)
- Reduced renderFood() complexity by 5 lines

**Test Results:**
- All 5 unit tests pass: shadow application, cleanup, error handling, state isolation, symmetrical halo
- Visual testing: food glow appears correctly at all score tiers (3px → 5px → 8px)
- No shadow leaks observed on snake, grid, border, or UI elements

**Pattern Benefits:**
- Eliminates entire class of shadow state leak bugs
- Cleaner, more maintainable code (callback pattern)
- Reusable for future shadow effects (e.g., Enhancement 4: snake head highlight)
- Demonstrates defensive programming best practice

**Next Enhancement:**
This defensive pattern is ready for use in future stories requiring canvas shadow effects. Story 19.5 (Integration) and Story 19.6 (Performance Testing) can proceed.

---

## File List

**Modified:**
- `js/render.js` - Added withShadow() helper function, refactored renderFood() to use defensive pattern

**Created:**
- `test/render.test.js` - Unit tests for withShadow() defensive pattern (5 test cases)
- `test/test-render.html` - Test runner for render.test.js

---

## Change Log

- **2026-02-16** - Story 19.4 implementation complete
  - Created withShadow() helper function in render.js (lines 240-260)
  - Added JSDoc comments explaining defensive pattern rationale
  - Implemented try/finally pattern for guaranteed shadow cleanup
  - Refactored renderFood() to use withShadow() instead of manual shadow application
  - Reduced renderFood() code by 5 lines (cleaner, more maintainable)
  - Created test/render.test.js with 5 comprehensive unit tests
  - Created test/test-render.html test runner
  - All unit tests validate cleanup guarantee in all scenarios
  - Pattern is reusable for future canvas shadow effects

---

## Status

review
