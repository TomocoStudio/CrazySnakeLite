# Story 10.3: Implement Striped Snake Rendering

**Epic:** 10 - Combo Mode System
**Story ID:** 10.3
**Status:** 🔴 not started
**Created:** 2026-02-08

---

## Story

**As a** player,
**I want** the snake to display a striped pattern during combo mode,
**So that** I visually understand I'm managing two simultaneous effects.

## Acceptance Criteria

**Given** combo mode is active with Effect A
**When** the snake is rendered
**Then** all segments display Effect A's color (solid, pre-stripe)

**Given** I eat the second food during combo (Effect B)
**When** the food is consumed
**Then** the snake rendering switches to striped pattern:
- Head (segment 0): Effect B color
- Segment 1: Effect A color
- Segment 2: Effect B color
- Segment 3: Effect A color
- Pattern continues alternating for all segments

**Given** the snake has a striped pattern
**When** viewing the snake
**Then** the alternating colors create a clear barber-pole effect
**And** the head color (Effect B) is visually distinct

**Given** segment colors are similar (e.g., purple and red)
**When** rendering striped segments
**Then** 1px black borders are added to all segments during combo
**And** the borders ensure visual separation

**Given** combo mode exits
**When** the third food is eaten
**Then** the snake reverts to standard single-color rendering
**And** the color reflects the most recent food effect

## Tasks / Subtasks

- [ ] Add combo.effectB to state.js (done in Story 10.1)
  - [ ] {type, points} structure
  - [ ] Set when second food eaten during combo
- [ ] Update renderSnake() in render.js for combo mode
  - [ ] Check if combo.active && combo.effectB exists
  - [ ] If true: render striped pattern
  - [ ] If false: render normal single-color snake
- [ ] Implement striped rendering logic
  - [ ] Head (index 0): combo.effectB color
  - [ ] Odd segments (1, 3, 5...): combo.effectA color
  - [ ] Even segments (2, 4, 6...): combo.effectB color
  - [ ] Add 1px black stroke to all segments during combo
- [ ] Get color for effect type
  - [ ] Create getEffectColor(effectType) helper
  - [ ] Map effect types to colors (green, yellow, purple, red, cyan, orange)
- [ ] Test striped pattern with all effect combinations
  - [ ] Speed Boost (red) + Reverse Controls (orange)
  - [ ] Wall Phase (purple) + Speed Decrease (cyan)
  - [ ] Growing (green) + Invincibility (yellow)
- [ ] Test visual separation with similar colors
  - [ ] Wall Phase (purple) + Speed Boost (red) — verify black borders
  - [ ] Reverse Controls (orange) + Speed Boost (red) — verify borders
- [ ] Test reversion to single-color on combo exit
  - [ ] Activate combo (striped snake)
  - [ ] Eat third food (exit combo)
  - [ ] Verify snake returns to single color

---

## Developer Context

### 🎯 STORY OBJECTIVE

Render the snake with alternating Effect A/Effect B colors during combo mode to provide visual feedback of the two-effect state. The striped "barber-pole" pattern makes it clear that the player is managing two simultaneous effects. Black borders ensure visual separation when colors are similar.

**CRITICAL SUCCESS FACTORS:**
- Striped pattern only appears when combo.effectB exists (second food eaten)
- Head displays Effect B color (most recent)
- Odd/even segments alternate between Effect A and Effect B
- Black borders ensure separation for similar colors
- Pattern reverts to single-color on combo exit

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/render.js` — Update renderSnake() to handle combo striped rendering

**Module Boundaries:**
- `render.js` owns all canvas rendering logic
- `combo.js` owns combo state (effectA, effectB)
- `render.js` reads combo state (does not modify)

**Data Flow:**
```
1. render.js: renderSnake(ctx, snake, gameState)
2. render.js: check if combo.active && combo.effectB exists
3. If true:
   a. Get effectA color from getEffectColor(combo.effectA.type)
   b. Get effectB color from getEffectColor(combo.effectB.type)
   c. Loop through segments:
      - Head (index 0): effectB color
      - Odd segments: effectA color
      - Even segments: effectB color
   d. Draw each segment with 1px black stroke
4. If false: render normal single-color snake
```

---

### 📦 CONFIG.JS UPDATES

No config changes needed (colors already defined).

---

### 🎨 IMPLEMENTATION DETAILS

**1. render.js — Update renderSnake():**

```javascript
import { CONFIG } from './config.js';

export function renderSnake(ctx, snake, gameState) {
  // Check if combo mode with striped pattern active
  const isStriped = gameState.combo.active && gameState.combo.effectB !== null;

  if (isStriped) {
    // Render striped snake
    const colorA = getEffectColor(gameState.combo.effectA.type);
    const colorB = getEffectColor(gameState.combo.effectB.type);

    snake.segments.forEach((segment, index) => {
      // Determine color: head (0) = effectB, odd = effectA, even = effectB
      let color;
      if (index === 0) {
        color = colorB; // Head is Effect B (most recent)
      } else if (index % 2 === 1) {
        color = colorA; // Odd segments
      } else {
        color = colorB; // Even segments
      }

      // Draw segment with black border
      ctx.fillStyle = color;
      ctx.fillRect(
        segment.x * CONFIG.GRID_SIZE,
        segment.y * CONFIG.GRID_SIZE,
        CONFIG.GRID_SIZE,
        CONFIG.GRID_SIZE
      );

      // Add 1px black border for visual separation
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(
        segment.x * CONFIG.GRID_SIZE,
        segment.y * CONFIG.GRID_SIZE,
        CONFIG.GRID_SIZE,
        CONFIG.GRID_SIZE
      );
    });
  } else {
    // Render normal single-color snake
    const color = getSnakeColor(snake, gameState);

    snake.segments.forEach((segment) => {
      ctx.fillStyle = color;
      ctx.fillRect(
        segment.x * CONFIG.GRID_SIZE,
        segment.y * CONFIG.GRID_SIZE,
        CONFIG.GRID_SIZE,
        CONFIG.GRID_SIZE
      );
    });
  }
}

/**
 * Get color for a food effect type.
 * @param {string} effectType - Effect type (e.g., 'speedBoost')
 * @returns {string} Hex color
 */
function getEffectColor(effectType) {
  const colors = {
    growing: '#00FF00',           // Green
    invincibility: '#FFFF00',     // Yellow
    wallPhase: '#800080',         // Purple
    speedBoost: '#FF0000',        // Red
    speedDecrease: '#00FFFF',     // Cyan
    reverseControls: '#FFA500'    // Orange
  };
  return colors[effectType] || '#00FF00';
}

function getSnakeColor(snake, gameState) {
  // Existing logic for normal snake color
  // (based on current effect or default green)
  return '#00FF00'; // Placeholder
}
```

**2. game.js — Set effectB when second food eaten during combo:**

```javascript
function handleComboFoodProgression(food, gameState) {
  if (gameState.combo.foodCount === 1) {
    // Second food during combo → set Effect B
    gameState.combo.effectB = {
      type: food.type,
      points: getFoodPoints(food.type)
    };
    gameState.combo.foodCount = 2;

    console.log(`Combo Effect B: ${food.type} (+${gameState.combo.effectB.points})`);
  } else if (gameState.combo.foodCount === 2) {
    // Third food → exit combo (Story 10.5)
    exitCombo(gameState);
  }
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Solid Color Before Effect B:**
   - Activate combo (Effect A set)
   - Verify snake displays solid Effect A color (not striped yet)

2. **Striped Pattern After Effect B:**
   - Eat second food during combo (Effect B set)
   - Verify snake switches to striped pattern:
     - Head (segment 0): Effect B color
     - Segment 1: Effect A color
     - Segment 2: Effect B color
     - Segment 3: Effect A color
     - Pattern continues alternating

3. **Striped Pattern with All Effect Combinations:**
   - Test multiple effect combinations:
     - Speed Boost (red) + Reverse Controls (orange)
     - Wall Phase (purple) + Speed Decrease (cyan)
     - Growing (green) + Invincibility (yellow)
     - Speed Decrease (cyan) + Speed Boost (red)
   - Verify striped pattern appears for all combinations

4. **Black Borders on Similar Colors:**
   - Combo: Wall Phase (purple) + Speed Boost (red)
   - Verify 1px black borders visible between segments
   - Verify colors are visually distinct despite similarity

5. **Reversion to Single-Color on Exit:**
   - Activate combo with striped snake
   - Eat third food (exit combo)
   - Verify snake returns to single-color rendering
   - Verify color reflects most recent food effect

6. **Head Color is Effect B:**
   - Activate combo: Effect A = Speed Boost (red)
   - Eat second food: Effect B = Wall Phase (purple)
   - Verify head is purple (Effect B), not red (Effect A)

**Edge Cases:**
- Very long snake (50+ segments) — striped pattern continues correctly
- Combo with invincibility (yellow) — stripes still visible
- Snake dies during combo — striped pattern visible in death state

---

### 📚 CRITICAL DATA FORMATS

**Segment index logic:**
```javascript
if (index === 0) { color = colorB; }        // Head
else if (index % 2 === 1) { color = colorA; } // Odd segments
else { color = colorB; }                     // Even segments
```

**Color mapping:**
```javascript
const color = getEffectColor('speedBoost');  // Returns '#FF0000' (red)
const color = getEffectColor('invalid');     // Returns '#00FF00' (fallback green)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/game-ux-principles.md` — Visual feedback, perceptual clarity
- `_bmad-output/planning-artifacts/prd.md` — FR45 (striped snake rendering)

**Key Design Principles:**
- **Visual clarity:** Striped pattern immediately communicates "two effects active"
- **Head distinction:** Effect B color on head shows most recent effect
- **Barber-pole effect:** Alternating colors create clear pattern recognition
- **Border separation:** Black borders ensure visibility for similar colors

---

### 📋 FRs COVERED

FR45 (Striped snake rendering during combo)

**Detailed FR Mapping:**
- FR45: Snake renders with alternating Effect A/Effect B colors → renderSnake() striped logic

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] renderSnake() updated with combo mode branch
- [ ] Check: if combo.active && combo.effectB exists → striped rendering
- [ ] getEffectColor(effectType) implemented
- [ ] All 6 effect types map to colors (green, yellow, purple, red, cyan, orange)
- [ ] Head (index 0) renders with effectB color
- [ ] Odd segments (1, 3, 5...) render with effectA color
- [ ] Even segments (2, 4, 6...) render with effectB color
- [ ] 1px black border (stroke) applied to all segments during combo
- [ ] Normal snake rendering when combo not active or effectB null
- [ ] Striped pattern tested with multiple effect combinations
- [ ] Black borders visible on similar colors (purple + red, orange + red)
- [ ] Snake reverts to single-color on combo exit
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (long snake, invincibility combo, death during combo)

**Common Mistakes to Avoid:**
- ❌ Head displays effectA instead of effectB (wrong order)
- ❌ Segment index logic wrong (odd/even swapped)
- ❌ No black borders (similar colors blend together)
- ❌ Striped rendering active before effectB set (should be solid effectA first)
- ❌ Not reverting to single-color on combo exit

---

## Dev Agent Record

### Agent Model Used

_To be filled by implementing agent_

### Debug Log References

_To be filled during implementation_

### Completion Notes List

_To be filled on completion_

### File List

- js/render.js (modified - update renderSnake with combo striped rendering)
- js/game.js (modified - set effectB when second food eaten during combo)
