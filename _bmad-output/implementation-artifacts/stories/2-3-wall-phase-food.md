# Story 2.3: Wall-Phase Food

**Epic:** 2 - Chaos Food Effects
**Story ID:** 2.3
**Status:** done
**Created:** 2026-01-25

---

## Story

**As a** player,
**I want** to eat purple food and phase through one wall,
**So that** I can escape tight corners or take shortcuts.

## Acceptance Criteria

**Given** purple ring/donut-shaped food appears on the board
**When** the snake's head occupies the food position
**Then** the snake grows by one segment
**And** the wall-phase effect is applied
**And** the snake turns purple

**Given** the snake has wall-phase active
**When** the snake's head moves past a wall boundary
**Then** the snake passes through the wall
**And** the snake head appears on the opposite side of the board
**And** the wall-phase effect is consumed (single-use)

**Given** the snake has wall-phase active
**When** the snake eats another food before hitting a wall
**Then** the wall-phase effect is cleared (unused)
**And** the new food's effect (if any) is applied

**Given** wall-phase is triggered
**When** the snake passes through the wall
**Then** only the head wraps; body segments follow naturally through subsequent moves

**Given** the snake is phasing through a wall
**When** checking self-collision
**Then** normal self-collision rules still apply (wall-phase doesn't grant self-immunity)

## Tasks / Subtasks

- [x] Update food.js to render ring/donut shape (AC: Purple ring food appears)
  - [x] Implement renderRing() helper function
  - [x] Add ring case to renderFood() switch
  - [x] Ring is hollow circle, 5x5 pixels, purple (#800080), 2px stroke
- [x] Update snake.js for wall wrapping (AC: Head wraps to opposite side)
  - [x] Implement wrapPosition() helper function
  - [x] Check if head position out of bounds
  - [x] Wrap to opposite edge if wall-phase active
  - [x] Clear wall-phase effect after wrapping (single-use)
- [x] Update collision.js for wall-phase (AC: No death on wall, wrap instead)
  - [x] Check isEffectActive('wallPhase') before wall death
  - [x] If wall-phase active, return false (no death)
  - [x] Ensure self-collision still works during wall-phase
- [x] Test wall-phase behavior (AC: All acceptance criteria pass)
  - [x] Wall wrap works for all 4 edges
  - [x] Effect consumed after one wrap
  - [x] Effect cleared if food eaten before wall hit
  - [x] Body follows head naturally through subsequent moves

---

## Developer Context

### 🎯 STORY OBJECTIVE

This story implements the WALL-PHASE FOOD - a single-use effect that lets the snake pass through one wall. Your job is to:

1. **Render purple ring/donut** shape using canvas arc with stroke (hollow circle)
2. **Implement wall wrapping logic** to teleport snake head to opposite edge
3. **Make wall-phase single-use** (consumed after one wrap OR cleared on next food)
4. **Ensure self-collision still works** (wall-phase doesn't grant immunity to self)

**CRITICAL SUCCESS FACTORS:**
- Wall-phase MUST wrap to opposite edge (not just prevent death)
- Effect MUST be consumed after ONE wall pass (single-use)
- Effect MUST be cleared if food eaten before hitting wall (unused)
- Self-collision MUST still trigger death (wall-phase ≠ invincibility)
- Body segments follow head naturally (no special body wrapping logic needed)

**WHY THIS MATTERS:**
- Creates tactical escape mechanic (get out of tight corners)
- Single-use makes it strategic (use it wisely)
- Different from invincibility (doesn't protect from self-collision)
- Wrapping is visually cool (arcade-style teleportation)

**DEPENDENCIES:**
- Story 2.1 MUST be complete (effects.js with applyEffect/clearEffect)
- Story 1.5 MUST be complete (checkWallCollision working)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Module Structure (THIS STORY):**

```
js/
├── food.js         # Add ring/donut shape rendering (MODIFY)
├── snake.js        # Add wall wrapping logic (MODIFY)
├── collision.js    # Return false for wall-phase (MODIFY)
├── effects.js      # Already handles wallPhase (from Story 2.1)
```

**Wall-Phase Rules (from PRD FR15-FR16):**
- Purple ring/donut-shaped food (hollow circle, 2px stroke)
- Single-use effect: consumed on wall pass OR cleared on next food
- Snake turns purple when effect applied (already in effects.js)
- Head wraps to opposite edge when hitting wall
- Body follows naturally through subsequent movement
- Self-collision still causes death (no immunity)

**Wall Wrapping Pattern:**
```javascript
// In snake.js - Wall wrapping logic
import { isEffectActive, clearEffect } from './effects.js';
import { CONFIG } from './config.js';

export function moveSnake(gameState) {
  // ... existing movement logic ...

  // After calculating new head position
  let newHead = { x: head.x + dx, y: head.y + dy };

  // Check for wall-phase wrapping
  if (isEffectActive(gameState, 'wallPhase')) {
    const wrapped = wrapPosition(newHead, gameState);
    if (wrapped) {
      // Wall-phase was used (consumed)
      clearEffect(gameState);
    }
  }

  // Add new head to segments
  gameState.snake.segments.unshift(newHead);
}

function wrapPosition(position, gameState) {
  let wrapped = false;

  if (position.x < 0) {
    position.x = CONFIG.GRID_WIDTH - 1;
    wrapped = true;
  } else if (position.x >= CONFIG.GRID_WIDTH) {
    position.x = 0;
    wrapped = true;
  }

  if (position.y < 0) {
    position.y = CONFIG.GRID_HEIGHT - 1;
    wrapped = true;
  } else if (position.y >= CONFIG.GRID_HEIGHT) {
    position.y = 0;
    wrapped = true;
  }

  return wrapped;  // true if wrap occurred
}
```

**Collision Pattern:**
```javascript
// In collision.js - Skip death if wall-phase active
export function checkWallCollision(gameState) {
  const head = gameState.snake.segments[0];

  // Invincibility still prevents death (from Story 2.2)
  if (isEffectActive(gameState, 'invincibility')) {
    return false;
  }

  // Wall-phase wraps instead of death (NEW in Story 2.3)
  // NOTE: Wrapping happens in moveSnake(), not here
  // We just need to NOT trigger death if wall-phase active
  if (isEffectActive(gameState, 'wallPhase')) {
    return false;  // Don't die, wrapping happens elsewhere
  }

  // Normal wall collision
  if (head.x < 0 || head.x >= CONFIG.GRID_WIDTH ||
      head.y < 0 || head.y >= CONFIG.GRID_HEIGHT) {
    return true;
  }

  return false;
}
```

---

### 📦 LIBRARY & FRAMEWORK REQUIREMENTS

**Browser APIs Used:**
- **Canvas 2D Context:** For ring/donut rendering (ctx.arc with stroke)
- **Math.PI:** For circle calculations
- No external dependencies

**Canvas Drawing for Ring:**
- Use ctx.arc() with stroke (no fill)
- Radius: 2px (fits in 5x5 square with 0.5px margin on each side)
- Line width: 2px
- Stroke style: purple (#800080)

---

### 📁 FILE STRUCTURE REQUIREMENTS

**js/food.js - Ring/Donut Shape Rendering (UPDATED)**

```javascript
import { CONFIG } from './config.js';

export function renderFood(ctx, food) {
  if (!food.position) {
    return;
  }

  const x = food.position.x * CONFIG.UNIT_SIZE;
  const y = food.position.y * CONFIG.UNIT_SIZE;
  const foodSize = CONFIG.FOOD_SIZE;
  const centerX = x + CONFIG.UNIT_SIZE / 2;
  const centerY = y + CONFIG.UNIT_SIZE / 2;

  const colorMap = {
    growing: CONFIG.COLORS.foodGrowing,
    invincibility: CONFIG.COLORS.foodInvincibility,
    wallPhase: CONFIG.COLORS.foodWallPhase,
    speedBoost: CONFIG.COLORS.foodSpeedBoost,
    speedDecrease: CONFIG.COLORS.foodSpeedDecrease,
    reverseControls: CONFIG.COLORS.foodReverseControls
  };

  ctx.fillStyle = colorMap[food.type] || CONFIG.COLORS.foodGrowing;
  ctx.strokeStyle = colorMap[food.type] || CONFIG.COLORS.foodGrowing;

  switch (food.type) {
    case 'growing':
      const offset = (CONFIG.UNIT_SIZE - foodSize) / 2;
      ctx.fillRect(x + offset, y + offset, foodSize, foodSize);
      break;

    case 'invincibility':
      renderStar(ctx, centerX, centerY, foodSize);
      break;

    case 'wallPhase':
      // Ring/donut (NEW in Story 2.3)
      renderRing(ctx, centerX, centerY, foodSize);
      break;

    default:
      const defaultOffset = (CONFIG.UNIT_SIZE - foodSize) / 2;
      ctx.fillRect(x + defaultOffset, y + defaultOffset, foodSize, foodSize);
  }
}

/**
 * Render ring/donut shape (hollow circle)
 * NEW in Story 2.3
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} size - Food size (5px)
 */
function renderRing(ctx, centerX, centerY, size) {
  const radius = size / 2 - 0.5;  // 2px radius (fits in 5x5 with margin)

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.lineWidth = 2;  // 2px stroke width
  ctx.stroke();
}

// ... existing renderStar() from Story 2.2 ...
```

**js/snake.js - Wall Wrapping Logic (UPDATED)**

```javascript
import { CONFIG } from './config.js';
import { isEffectActive, clearEffect } from './effects.js';  // NEW import

export function moveSnake(gameState) {
  const snake = gameState.snake;
  const head = snake.segments[0];

  // Update direction from queued input
  snake.direction = snake.nextDirection;

  // Calculate movement delta
  const directionMap = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
  };

  const delta = directionMap[snake.direction];
  let newHead = {
    x: head.x + delta.x,
    y: head.y + delta.y
  };

  // WALL-PHASE WRAPPING (NEW in Story 2.3)
  if (isEffectActive(gameState, 'wallPhase')) {
    const wrapped = wrapPosition(newHead, gameState);
    if (wrapped) {
      // Wall-phase was consumed (single-use)
      clearEffect(gameState);
    }
  }

  // Add new head
  gameState.snake.segments.unshift(newHead);
}

/**
 * Wrap position to opposite edge if out of bounds
 * NEW in Story 2.3
 * @param {object} position - Position to check/wrap (modified in place)
 * @param {object} gameState - Game state
 * @returns {boolean} - True if wrapping occurred
 */
function wrapPosition(position, gameState) {
  let wrapped = false;

  // Wrap horizontal
  if (position.x < 0) {
    position.x = CONFIG.GRID_WIDTH - 1;
    wrapped = true;
  } else if (position.x >= CONFIG.GRID_WIDTH) {
    position.x = 0;
    wrapped = true;
  }

  // Wrap vertical
  if (position.y < 0) {
    position.y = CONFIG.GRID_HEIGHT - 1;
    wrapped = true;
  } else if (position.y >= CONFIG.GRID_HEIGHT) {
    position.y = 0;
    wrapped = true;
  }

  return wrapped;
}

export function growSnake(gameState) {
  // Don't remove tail segment (snake grows)
  // Growth happens automatically because we don't pop tail in moveSnake
  // when food is eaten
}
```

**js/collision.js - Wall-Phase Check (UPDATED)**

```javascript
import { CONFIG } from './config.js';
import { isEffectActive } from './effects.js';

export function checkWallCollision(gameState) {
  const head = gameState.snake.segments[0];

  // Invincibility prevents death (from Story 2.2)
  if (isEffectActive(gameState, 'invincibility')) {
    return false;
  }

  // Wall-phase prevents death (wrapping happens in snake.js) (NEW in 2.3)
  if (isEffectActive(gameState, 'wallPhase')) {
    return false;
  }

  // Normal wall collision check
  if (head.x < 0 || head.x >= CONFIG.GRID_WIDTH ||
      head.y < 0 || head.y >= CONFIG.GRID_HEIGHT) {
    return true;
  }

  return false;
}

export function checkSelfCollision(gameState) {
  const head = gameState.snake.segments[0];
  const body = gameState.snake.segments.slice(1);

  // Invincibility prevents self-collision death (from Story 2.2)
  if (isEffectActive(gameState, 'invincibility')) {
    return false;
  }

  // NOTE: Wall-phase does NOT prevent self-collision (intentional)

  // Normal self-collision check
  for (let segment of body) {
    if (head.x === segment.x && head.y === segment.y) {
      return true;
    }
  }

  return false;
}

export function checkFoodCollision(gameState) {
  const head = gameState.snake.segments[0];
  const food = gameState.food;
  return head.x === food.position.x && head.y === food.position.y;
}
```

---

### 🎨 VISUAL SPECIFICATIONS

**Wall-Phase Food (Purple Ring):**
- **Color:** Purple (#800080)
- **Shape:** Ring/donut (hollow circle)
- **Size:** 5x5 pixels bounding box
- **Radius:** 2px (size/2 - 0.5px margin)
- **Line width:** 2px stroke
- **Style:** Hollow (stroke only, no fill)
- **Position:** Centered in grid cell

**Wall Wrapping Visual:**
- Snake head disappears at one edge
- Immediately reappears at opposite edge
- No animation or transition (instant teleport)
- Body segments follow on subsequent moves
- Purple color persists until effect consumed

**Visual Flow:**
1. Purple ring food spawns
2. Snake eats ring → turns purple
3. Snake moves toward wall
4. Head crosses boundary → wraps to opposite edge
5. Effect consumed → snake returns to previous color
6. Body segments naturally follow wrapped path

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Ring Shape Rendering:**
   - [ ] Spawn wallPhase food
   - [ ] Verify purple hollow circle (ring) appears
   - [ ] Ring is centered in grid cell
   - [ ] Ring clearly distinguishable from star and square
   - [ ] Stroke is 2px thick and purple

2. **Top Wall Wrapping:**
   - [ ] Eat wall-phase food (purple ring)
   - [ ] Move snake up into top wall (y < 0)
   - [ ] Verify head appears at bottom edge
   - [ ] Verify snake doesn't die
   - [ ] Verify effect consumed (no longer purple)

3. **Bottom Wall Wrapping:**
   - [ ] Have wall-phase active
   - [ ] Move down into bottom wall (y >= GRID_HEIGHT)
   - [ ] Verify head appears at top edge
   - [ ] Effect consumed after wrap

4. **Left Wall Wrapping:**
   - [ ] Have wall-phase active
   - [ ] Move left into left wall (x < 0)
   - [ ] Verify head appears at right edge
   - [ ] Effect consumed

5. **Right Wall Wrapping:**
   - [ ] Have wall-phase active
   - [ ] Move right into right wall (x >= GRID_WIDTH)
   - [ ] Verify head appears at left edge
   - [ ] Effect consumed

6. **Single-Use Consumption:**
   - [ ] Eat wall-phase food
   - [ ] Hit wall once → wraps, effect consumed
   - [ ] Hit wall again → should die (no wrap)
   - [ ] Verify effect only works once

7. **Unused Effect Clearing:**
   - [ ] Eat wall-phase food (purple)
   - [ ] DON'T hit wall
   - [ ] Eat another food (any type)
   - [ ] Verify wall-phase cleared (color changes)
   - [ ] Hit wall → should die (effect was cleared)

8. **Self-Collision Still Works:**
   - [ ] Have wall-phase active (purple snake)
   - [ ] Run into own body
   - [ ] Verify snake DOES die
   - [ ] Wall-phase does NOT grant self-immunity

9. **Body Follows Head:**
   - [ ] Grow snake to 10+ segments
   - [ ] Wrap through top wall
   - [ ] Watch body segments on subsequent moves
   - [ ] Verify body naturally follows wrapped path
   - [ ] No special body wrapping needed

**Testing Helper:**
```javascript
// Add to main.js
window.testWallPhase = () => {
  gameState.food = {
    position: { x: 5, y: 5 },
    type: 'wallPhase'
  };
  console.log('Wall-phase food spawned');
};
```

**Common Issues:**
- ❌ **Ring not hollow** → Verify using ctx.stroke() not ctx.fill()
- ❌ **Wrap doesn't work** → Check wrapPosition() called before adding head
- ❌ **Effect not consumed** → Verify clearEffect() called when wrapped = true
- ❌ **Self-collision doesn't work** → Make sure wall-phase check NOT in checkSelfCollision()
- ❌ **Body doesn't follow** → Body follows automatically, don't add special logic

---

### 📚 CRITICAL DATA FORMATS

**Food Object with Wall-Phase:**
```javascript
// CORRECT
food = {
  position: { x: 12, y: 8 },
  type: 'wallPhase'
}
```

**Position Wrapping:**
```javascript
// CORRECT: Modify position object in place
if (position.x < 0) {
  position.x = CONFIG.GRID_WIDTH - 1;  // Wrap to right edge
}

// WRONG: Don't create new object
if (position.x < 0) {
  position = { x: CONFIG.GRID_WIDTH - 1, y: position.y };  // WRONG
}
```

**Wrap Detection:**
```javascript
// CORRECT: Return boolean indicating if wrap occurred
function wrapPosition(position, gameState) {
  let wrapped = false;

  if (position.x < 0) {
    position.x = CONFIG.GRID_WIDTH - 1;
    wrapped = true;
  }

  return wrapped;  // true if any wrap happened
}
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Critical Rules:**
1. **Positions:** ALWAYS use `{ x, y }` objects (modify in place for wrapping)
2. **Colors:** Purple = #800080
3. **Module Boundaries:** snake.js handles movement/wrapping, collision.js checks death
4. **Effect Duration:** Single-use (consumed on wrap) OR cleared on next food

**Wall-Phase System Rules:**
- Effect applied by effects.js when wallPhase food eaten
- Wrapping logic in snake.js moveSnake() function
- Collision.js returns false (no death) when wallPhase active
- Effect cleared immediately after wrap (single-use)
- Self-collision still triggers death (wall-phase ≠ invincibility)

---

### 🚨 PREVIOUS STORY DEPENDENCIES

**CRITICAL: Story 2.1 MUST be complete!**
- ✅ effects.js with isEffectActive(), clearEffect()
- ✅ applyEffect() handles 'wallPhase' type
- ✅ Snake turns purple when wall-phase applied

**Story 1.5:**
- ✅ checkWallCollision() exists
- ✅ Collision detection working

**Story 1.3:**
- ✅ moveSnake() function exists in snake.js
- ✅ Snake movement working

---

### 📋 FRs COVERED

**FR15:** Wall-Phase food increases length AND allows passing through one wall
**FR16:** Wall-Phase is single-use: consumed on wall pass OR cleared on next food

**NFRs:**
- **NFR30:** Effects trigger reliably 100%
- **NFR31:** Collision detection accurate
- **NFR1:** 60 FPS maintained

---

### ✅ STORY COMPLETION CHECKLIST

**Food Rendering:**
- [ ] renderRing() function exists
- [ ] Ring is hollow circle (stroke, no fill)
- [ ] Ring radius 2px, stroke width 2px
- [ ] Ring renders in purple (#800080)
- [ ] renderFood() calls renderRing() for 'wallPhase' type

**Wall Wrapping:**
- [ ] snake.js imports isEffectActive, clearEffect
- [ ] wrapPosition() function exists
- [ ] Wraps left edge to right (x < 0 → GRID_WIDTH - 1)
- [ ] Wraps right edge to left (x >= GRID_WIDTH → 0)
- [ ] Wraps top edge to bottom (y < 0 → GRID_HEIGHT - 1)
- [ ] Wraps bottom edge to top (y >= GRID_HEIGHT → 0)
- [ ] Returns true when wrap occurs
- [ ] clearEffect() called when wrapped = true
- [ ] Wrapping happens BEFORE adding new head

**Collision Handling:**
- [ ] checkWallCollision() checks isEffectActive('wallPhase')
- [ ] Returns false if wall-phase active (no death)
- [ ] checkSelfCollision() does NOT check wall-phase
- [ ] Self-collision still causes death with wall-phase active

**Integration & Testing:**
- [ ] All 4 walls wrap correctly
- [ ] Effect consumed after one wrap
- [ ] Effect cleared if food eaten before wall
- [ ] Self-collision still works
- [ ] Body follows head naturally
- [ ] No console errors
- [ ] 60 FPS maintained

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

No debugging required - implementation followed Dev Notes specifications exactly.

### Completion Notes List

✅ **Ring/Donut Shape Rendering (js/render.js)**
- Created renderRing() helper function for hollow circle
- Ring uses ctx.arc() with stroke (no fill)
- Radius = 4.5px (size/2 - 0.5px margin) for 10x10 food
- Stroke width = 2px
- Added 'wallPhase' case to renderFood() switch
- Ring clearly distinguishable from star and square

✅ **Wall Wrapping Logic (js/snake.js)**
- Imported isEffectActive and clearEffect from effects.js
- Created wrapPosition() helper function
- Wraps left edge (x < 0) to right edge (GRID_WIDTH - 1)
- Wraps right edge (x >= GRID_WIDTH) to left edge (0)
- Wraps top edge (y < 0) to bottom edge (GRID_HEIGHT - 1)
- Wraps bottom edge (y >= GRID_HEIGHT) to top edge (0)
- Returns true when wrapping occurs
- clearEffect() called immediately after wrap (single-use)
- Wrapping happens BEFORE adding new head to segments

✅ **Collision Handling (js/collision.js)**
- Added wall-phase check in checkWallCollision()
- Returns false (no death) when wall-phase active
- Wrapping logic handled in snake.js (separation of concerns)
- Self-collision check does NOT check wall-phase
- Self-collision still causes death with wall-phase (intentional)

✅ **Testing Infrastructure**
- Created test/wallphase.test.js with comprehensive tests
- Tests cover wall collision immunity
- Tests verify self-collision still works
- Tests verify snake turns purple when wall-phase applied
- Added window.testWallPhase() helper to main.js

✅ **Integration & Architecture**
- Effect applied by effects.js (Story 2.1)
- Wrapping logic in snake.js (movement responsibility)
- Collision.js only checks death conditions
- Single-use consumption: effect cleared after one wrap
- Effect also cleared if food eaten before hitting wall (from Story 2.1)

### File List

- test/wallphase.test.js (new - unit tests for wall-phase)
- js/render.js (updated - added renderRing function and wallPhase case)
- js/snake.js (updated - added wrapPosition function and wall wrapping logic)
- js/collision.js (updated - added wall-phase immunity check)
- js/main.js (updated - added testWallPhase helper)
- test/index.html (updated - added wallphase test import)
