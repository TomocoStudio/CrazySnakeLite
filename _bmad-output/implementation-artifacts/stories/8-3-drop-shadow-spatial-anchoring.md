# Story 8.3: Add Drop Shadow for Spatial Anchoring

**Epic:** 8 - Progressive Blinking Food System
**Story ID:** 8.3
**Status:** ❌ rejected - user feedback
**Created:** 2026-02-08

---

## Story

**As a** player,
**I want** blinking food to have a persistent shadow,
**So that** I can track its position while colors cycle rapidly.

## Acceptance Criteria

**Given** a blinking food is rendered
**When** the color cycles
**Then** a 2px drop shadow is visible beneath the food
**And** the shadow position remains constant regardless of color
**And** the shadow color is rgba(0, 0, 0, 0.5) (50% black)

**Given** I am tracking a blinking food
**When** the colors cycle at 200ms per color
**Then** I can still locate the food position using the shadow
**And** the shadow provides spatial anchoring for magnocellular pathway processing

**Given** a non-blinking food is rendered
**When** the food is drawn
**Then** no shadow is applied (blinking food only)

## Tasks / Subtasks

- [x] Update render.js drawFood() to add shadow for blinking food
  - [x] Check if food.isBlinking === true
  - [x] Set ctx.shadowColor = 'rgba(0, 0, 0, 0.5)'
  - [x] Set ctx.shadowBlur = 0 (hard shadow, not blurred)
  - [x] Set ctx.shadowOffsetX = 2
  - [x] Set ctx.shadowOffsetY = 2
- [x] Reset shadow after drawing blinking food
  - [x] Set ctx.shadowColor = 'transparent'
  - [x] Ensure shadow does not affect other canvas elements
- [x] Ensure non-blinking food has no shadow
  - [x] Only apply shadow when isBlinking === true
  - [x] Verify normal food rendering unchanged
- [x] Test shadow visibility
  - [x] Verify shadow is visible on all 6 cycling colors
  - [x] Verify shadow position remains constant during color cycling
  - [x] Verify shadow does not flicker or disappear
- [x] Test spatial anchoring effectiveness
  - [x] User can track blinking food position during rapid color changes
  - [x] Shadow provides visual anchor for magnocellular pathway

---

## Developer Context

### 🎯 STORY OBJECTIVE

Add a persistent drop shadow to blinking food to provide spatial anchoring during rapid color cycling. This leverages the magnocellular visual pathway (motion/position detection) which processes shadows and spatial information independently from the parvocellular pathway (color processing). The shadow allows players to track food position even when color identification is overloaded.

**CRITICAL SUCCESS FACTORS:**
- Shadow must be visible on all 6 cycling colors (including dark colors like purple/red)
- Shadow position must be constant (not animated or flickering)
- Shadow must NOT appear on non-blinking food (visual distinction)
- Shadow must not degrade performance

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/render.js` — Add shadow rendering logic for blinking food

**Module Boundaries:**
- `render.js` owns all canvas rendering logic (including shadows)
- `food.js` provides isBlinking flag (render.js reads, does not modify)

**Data Flow:**
```
1. render.js: drawFood(ctx, food)
2. render.js: check food.isBlinking
3. If blinking:
   a. Set ctx.shadowColor/shadowBlur/shadowOffset
   b. Draw food square (shadow auto-applies)
   c. Reset ctx.shadowColor = 'transparent'
4. If not blinking:
   a. Draw food square normally (no shadow)
```

---

### 📦 CONFIG.JS UPDATES

Add shadow configuration (optional, for easy tuning):

```javascript
export const CONFIG = {
  // ... existing config ...

  // Blinking Food Shadow (v2 - Epic 8)
  BLINK_SHADOW: {
    color: 'rgba(0, 0, 0, 0.5)',  // 50% black
    blur: 0,                       // Hard shadow (no blur)
    offsetX: 2,
    offsetY: 2
  }
};
```

---

### 🎨 IMPLEMENTATION DETAILS

**render.js — Add shadow to blinking food:**

```javascript
import { CONFIG } from './config.js';

export function drawFood(ctx, food) {
  if (!food) return;

  // Apply shadow ONLY for blinking food
  if (food.isBlinking) {
    ctx.shadowColor = CONFIG.BLINK_SHADOW.color;
    ctx.shadowBlur = CONFIG.BLINK_SHADOW.blur;
    ctx.shadowOffsetX = CONFIG.BLINK_SHADOW.offsetX;
    ctx.shadowOffsetY = CONFIG.BLINK_SHADOW.offsetY;
  }

  // Calculate color (blinking uses cycling color, normal uses type-based color)
  let color;
  if (food.isBlinking) {
    const cycleIndex = Math.floor(Date.now() / CONFIG.BLINK_CYCLE_DURATION) % CONFIG.BLINK_SEQUENCE.length;
    color = CONFIG.BLINK_SEQUENCE[cycleIndex];
  } else {
    color = getFoodColor(food.type);
  }

  // Draw food square
  ctx.fillStyle = color;
  ctx.fillRect(
    food.x * CONFIG.GRID_SIZE,
    food.y * CONFIG.GRID_SIZE,
    CONFIG.GRID_SIZE,
    CONFIG.GRID_SIZE
  );

  // Reset shadow (prevent it from affecting other elements)
  if (food.isBlinking) {
    ctx.shadowColor = 'transparent';
  }
}

function getFoodColor(type) {
  const colors = {
    growing: 'green',
    invincibility: 'yellow',
    wallPhase: 'purple',
    speedBoost: 'red',
    speedDecrease: 'cyan',
    reverseControls: 'orange'
  };
  return colors[type] || 'green';
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Shadow Visibility on All Colors:**
   - Spawn blinking food
   - Observe color cycling (green → yellow → purple → red → cyan → orange)
   - Verify shadow is visible on ALL 6 colors
   - Pay special attention to dark colors (purple, red) — shadow must still be visible

2. **Shadow Position Constancy:**
   - Observe blinking food during color cycling
   - Verify shadow position does NOT move or flicker
   - Verify shadow offset is consistent (2px bottom-right)

3. **Non-Blinking Food Has No Shadow:**
   - Spawn normal (non-blinking) food
   - Verify no shadow appears
   - Verify normal food rendering is unchanged from before

4. **Spatial Anchoring Effectiveness:**
   - Spawn blinking food in center of screen
   - Watch color cycling for 5 seconds
   - Verify you can easily track food position using shadow
   - Verify shadow provides visual anchor (not distracting)

5. **Performance:**
   - Spawn 5 blinking foods on screen
   - Verify game runs at 60 FPS
   - Verify shadow rendering does not cause frame drops

**Edge Cases:**
- Blinking food at edge of canvas (shadow not clipped)
- Blinking food on dark background (shadow still visible)
- Multiple blinking foods (all have shadows)

---

### 📚 CRITICAL DATA FORMATS

**Canvas shadow API:**
```javascript
ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';  // CORRECT (RGBA format)
ctx.shadowColor = 'black';                // WRONG (no transparency control)

ctx.shadowOffsetX = 2;                    // CORRECT (positive = right)
ctx.shadowOffsetX = -2;                   // WRONG (negative = left, not spec)
```

**Reset shadow after drawing:**
```javascript
ctx.shadowColor = 'transparent';          // CORRECT
ctx.shadowColor = '';                     // LESS RELIABLE
// Not resetting = shadow affects all subsequent draws // WRONG
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/game-ux-principles.md` — Magnocellular vs parvocellular pathways
- `_bmad-output/planning-artifacts/prd.md` — FR36 (shadow for spatial anchoring)

**Key Cognitive Science Principles:**
- **Magnocellular pathway:** Processes position, motion, and spatial relationships (fast, unconscious)
- **Parvocellular pathway:** Processes color and fine detail (slow, conscious)
- **Design goal:** Color cycling overloads parvocellular pathway, shadow engages magnocellular pathway for position tracking
- **Result:** Players can locate food even when color is unreadable

---

### 📋 FRs COVERED

FR36 (Drop shadow for spatial anchoring)

**Detailed FR Mapping:**
- FR36: Blinking food has 2px drop shadow (rgba(0, 0, 0, 0.5)) for spatial anchoring → Core implementation

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] render.js applies shadow only when food.isBlinking === true
- [ ] Shadow color is rgba(0, 0, 0, 0.5)
- [ ] Shadow blur is 0 (hard shadow)
- [ ] Shadow offset is 2px right, 2px down
- [ ] Shadow position is constant during color cycling (no flickering)
- [ ] Shadow is visible on all 6 cycling colors
- [ ] Shadow is visible on dark colors (purple, red)
- [ ] Non-blinking food has NO shadow
- [ ] Shadow is reset after drawing (ctx.shadowColor = 'transparent')
- [ ] Shadow does not affect other canvas elements (snake, walls, etc.)
- [ ] Game maintains 60 FPS with multiple blinking foods
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (edge of canvas, dark background, multiple foods)

**Common Mistakes to Avoid:**
- ❌ Applying shadow to all food (must be blinking only)
- ❌ Not resetting shadow after drawing (affects other elements)
- ❌ Using shadowBlur > 0 (should be hard shadow, not blurred)
- ❌ Wrong offset direction (negative instead of positive)
- ❌ Shadow not visible on dark colors (opacity too low)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

N/A - Clean implementation, no debugging required

### Completion Notes List

**❌ FEATURE REJECTED BY USER (Tomoco) - 2026-02-12**

**Implementation was completed and then reverted per user feedback.**

**User Feedback:**
> "I don't like the drop shadows, please revert, and report that in the specs."

**What Was Implemented (then reverted):**
- ✅ Added `BLINK_SHADOW` configuration to config.js (50% black, hard shadow, 2px offset)
- ✅ Updated render.js to apply shadow only to blinking food
- ✅ Shadow reset after drawing to prevent affecting other elements
- ✅ All tasks completed, feature functionally working

**Reason for Rejection:**
- User aesthetic preference: drop shadows not desired for game visual style
- Feature worked as specified but did not meet user's design vision

**Code Reverted:**
- config.js: Removed `BLINK_SHADOW` configuration
- render.js: Removed shadow rendering logic
- Game returns to Story 8.2 state (blinking food without shadows)

**Design Implications:**
- Blinking food spatial anchoring will rely solely on color cycling animation
- No additional visual cues for position tracking during rapid color changes
- Magnocellular pathway engagement via shadow approach **not pursued**
- Consider alternative spatial anchoring methods if needed (e.g., border, outline, size pulsing)

**Recommendation:**
- Mark this story as "rejected" or "backlog" in sprint status
- Skip to Story 8.4 (Mystery Food Tooltip) for continued Epic 8 implementation
- If spatial tracking becomes an issue during playtesting, consider alternative approaches

### File List

- js/config.js (modified - add BLINK_SHADOW configuration)
- js/render.js (modified - add shadow rendering for blinking food only)
