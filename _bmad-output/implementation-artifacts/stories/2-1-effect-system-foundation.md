# Story 2.1: Effect System Foundation

**Epic:** 2 - Chaos Food Effects
**Story ID:** 2.1
**Status:** done
**Created:** 2026-01-25

---

## Story

**As a** player,
**I want** food effects to apply immediately and last until I eat the next food,
**So that** I can strategically plan which foods to pursue.

## Acceptance Criteria

**Given** the snake eats any special food (not growing)
**When** the food is consumed
**Then** the effect is applied immediately
**And** the effect is stored in gameState.activeEffect

**Given** the snake has an active effect
**When** the snake eats any food (including growing)
**Then** the previous effect is cleared immediately
**And** the new effect (if any) is applied

**Given** the snake has an active effect
**When** checking the effect state
**Then** the effect type is accessible for collision, movement, and rendering logic

**Given** the effects system is implemented
**When** multiple games are played
**Then** effects trigger reliably 100% of the time when the corresponding food is consumed

## Tasks / Subtasks

- [x] Implement effects.js module (AC: Effect system functional)
  - [x] Create applyEffect(gameState, effectType) function
  - [x] Create clearEffect(gameState) function
  - [x] Create isEffectActive(gameState, effectType) helper
  - [x] Create getActiveEffect(gameState) helper
- [x] Define effect type constants (AC: All 5 effect types defined)
  - [x] EFFECT_TYPES constant with all 5 effects
  - [x] Effect type validation
- [x] Update game.js food collision handling (AC: Effects apply on consumption)
  - [x] Clear previous effect before applying new one
  - [x] Apply effect based on food type
  - [x] Handle growing food (clears effect, no new effect)
- [x] Update food.js spawning (AC: Food type stored correctly)
  - [x] Ensure food.type is set correctly
  - [x] Prepare for probability-based spawning (Story 2.6)
- [x] Update snake color based on active effect (AC: Visual feedback works)
  - [x] Modify renderSnake() to use effect-based color
  - [x] Color changes immediately on effect application
- [x] Validate effect reliability (AC: 100% trigger rate)

---

## Developer Context

### 🎯 STORY OBJECTIVE

This story creates the EFFECT SYSTEM FOUNDATION that all special foods will use. Your job is to:

1. Create effects.js module with apply/clear/check functions
2. Implement effect lifecycle: apply → active → clear
3. Update food collision to manage effects
4. Change snake color based on active effect (visual feedback)

**CRITICAL SUCCESS FACTORS:**
- Effects MUST apply immediately on food consumption (no delay)
- Previous effect MUST clear before new effect applies
- Effect state MUST be accessible to collision, movement, and rendering
- 100% reliability (effects always trigger when food eaten)

**WHY THIS MATTERS:**
- No effect system = can't implement special foods in Stories 2.2-2.5
- Effects not clearing = stacking bugs, broken gameplay
- No visual feedback = player doesn't know what effect is active
- Unreliable effects = frustrating, unpredictable gameplay

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Module Structure (THIS STORY):**

```
js/
├── effects.js      # Effect system module (NEW)
├── game.js         # Update food collision to handle effects (MODIFY)
├── food.js         # Ensure food.type is set (already done in 1.4)
├── render.js       # Update snake color based on effect (MODIFY)
├── state.js        # Already has activeEffect field
├── collision.js    # Will use effects in Stories 2.2-2.3
├── snake.js        # Will use effects in Story 2.4
├── input.js        # Will use effects in Story 2.5
└── config.js       # Already has effect colors
```

**Effect System Pattern:**

From architecture.md and PRD:
- Effect applies IMMEDIATELY when special food eaten
- Effect lasts UNTIL next food eaten (any food type)
- Only ONE effect active at a time (new effect replaces old)
- Growing food CLEARS effect but doesn't apply new one
- Effect stored in gameState.activeEffect: `{ type: 'invincibility' }` or `null`

**Effect Types (5 total):**
1. `invincibility` - No death on wall/self collision
2. `wallPhase` - Pass through walls (wrap to opposite side)
3. `speedBoost` - Move faster (1.5x to 2x speed)
4. `speedDecrease` - Move slower (0.3x to 0.5x speed)
5. `reverseControls` - Arrow keys inverted

---

### 📦 LIBRARY & FRAMEWORK REQUIREMENTS

**Browser APIs Used:**
- None (pure JavaScript logic)
- No external dependencies

**Effect System:**
- Simple state management (activeEffect object)
- Type-based behavior switching
- No complex effect stacking or timing

---

### 📁 FILE STRUCTURE REQUIREMENTS

**js/effects.js - Effect System Module (NEW)**

```javascript
import { CONFIG } from './config.js';

// Effect type constants
export const EFFECT_TYPES = {
  INVINCIBILITY: 'invincibility',
  WALL_PHASE: 'wallPhase',
  SPEED_BOOST: 'speedBoost',
  SPEED_DECREASE: 'speedDecrease',
  REVERSE_CONTROLS: 'reverseControls'
};

/**
 * Apply effect to game state
 * Clears previous effect first
 */
export function applyEffect(gameState, effectType) {
  // Validate effect type
  const validTypes = Object.values(EFFECT_TYPES);
  if (!validTypes.includes(effectType)) {
    console.warn(`Invalid effect type: ${effectType}`);
    return;
  }

  // Clear previous effect first
  clearEffect(gameState);

  // Apply new effect
  gameState.activeEffect = {
    type: effectType
  };

  // Update snake color based on effect
  updateSnakeColor(gameState);
}

/**
 * Clear active effect
 */
export function clearEffect(gameState) {
  gameState.activeEffect = null;

  // Reset snake color to default
  gameState.snake.color = CONFIG.COLORS.snakeDefault;
}

/**
 * Check if specific effect is active
 */
export function isEffectActive(gameState, effectType) {
  return gameState.activeEffect !== null &&
         gameState.activeEffect.type === effectType;
}

/**
 * Get active effect (or null)
 */
export function getActiveEffect(gameState) {
  return gameState.activeEffect;
}

/**
 * Update snake color based on active effect
 */
function updateSnakeColor(gameState) {
  const effect = gameState.activeEffect;

  if (!effect) {
    gameState.snake.color = CONFIG.COLORS.snakeDefault;
    return;
  }

  // Map effect type to snake color
  switch (effect.type) {
    case EFFECT_TYPES.INVINCIBILITY:
      gameState.snake.color = CONFIG.COLORS.snakeInvincibility;  // Yellow
      break;
    case EFFECT_TYPES.WALL_PHASE:
      gameState.snake.color = CONFIG.COLORS.snakeWallPhase;  // Purple
      break;
    case EFFECT_TYPES.SPEED_BOOST:
      gameState.snake.color = CONFIG.COLORS.snakeSpeedBoost;  // Red
      break;
    case EFFECT_TYPES.SPEED_DECREASE:
      gameState.snake.color = CONFIG.COLORS.snakeSpeedDecrease;  // Cyan
      break;
    case EFFECT_TYPES.REVERSE_CONTROLS:
      gameState.snake.color = CONFIG.COLORS.snakeReverseControls;  // Orange
      break;
    default:
      gameState.snake.color = CONFIG.COLORS.snakeDefault;
  }
}
```

**js/game.js - Updated Food Collision with Effects**

```javascript
import { CONFIG } from './config.js';
import { render } from './render.js';
import { moveSnake, growSnake } from './snake.js';
import { checkFoodCollision, checkWallCollision, checkSelfCollision } from './collision.js';
import { spawnFood } from './food.js';
import { applyEffect, clearEffect } from './effects.js';  // NEW

const TICK_RATE = CONFIG.TICK_RATE;

let lastTime = 0;
let accumulator = 0;

const gameoverScreen = document.getElementById('gameover-screen');
const scoreValueElement = document.getElementById('score-value');

export function gameLoop(currentTime, ctx, gameState) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  accumulator += deltaTime;

  while (accumulator >= TICK_RATE) {
    update(gameState);
    accumulator -= TICK_RATE;
  }

  render(ctx, gameState);
  updateUI(gameState);
  requestAnimationFrame((time) => gameLoop(time, ctx, gameState));
}

/**
 * Game logic update
 * UPDATED in Story 2.1: Handle effect application on food consumption
 */
function update(gameState) {
  if (gameState.phase !== 'playing') {
    return;
  }

  moveSnake(gameState);

  // Check food collision (UPDATED for effects)
  if (checkFoodCollision(gameState)) {
    const foodType = gameState.food.type;

    // Always grow snake
    growSnake(gameState);
    gameState.score = gameState.snake.segments.length;

    // Handle effects based on food type
    if (foodType === 'growing') {
      // Growing food clears effect but doesn't apply new one
      clearEffect(gameState);
    } else {
      // Special food applies its effect (clears previous first)
      applyEffect(gameState, foodType);
    }

    // Spawn new food
    spawnFood(gameState);
  }

  // Check death conditions
  if (checkWallCollision(gameState) || checkSelfCollision(gameState)) {
    gameState.phase = 'gameover';
  }
}

function updateUI(gameState) {
  if (gameState.phase === 'gameover') {
    gameoverScreen.classList.remove('hidden');
    scoreValueElement.textContent = gameState.score;
  } else {
    gameoverScreen.classList.add('hidden');
  }
}

export function startGameLoop(ctx, gameState) {
  lastTime = performance.now();
  accumulator = 0;
  requestAnimationFrame((time) => gameLoop(time, ctx, gameState));
}
```

**js/render.js - Snake Color from Effect (UPDATED)**

```javascript
import { CONFIG } from './config.js';

export function render(ctx, gameState) {
  clearCanvas(ctx);
  renderGrid(ctx);
  renderFood(ctx, gameState.food);
  renderSnake(ctx, gameState.snake);  // Snake color now from gameState.snake.color
}

function clearCanvas(ctx) {
  ctx.fillStyle = CONFIG.COLORS.background;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

function renderGrid(ctx) {
  ctx.strokeStyle = CONFIG.COLORS.gridLine;
  ctx.lineWidth = CONFIG.GRID_LINE_WIDTH;
  ctx.globalAlpha = CONFIG.GRID_LINE_OPACITY;

  for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
    const xPos = x * CONFIG.UNIT_SIZE;
    ctx.beginPath();
    ctx.moveTo(xPos, 0);
    ctx.lineTo(xPos, ctx.canvas.height);
    ctx.stroke();
  }

  for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
    const yPos = y * CONFIG.UNIT_SIZE;
    ctx.beginPath();
    ctx.moveTo(0, yPos);
    ctx.lineTo(ctx.canvas.width, yPos);
    ctx.stroke();
  }

  ctx.globalAlpha = 1.0;
}

/**
 * Render snake with effect-based color
 * Color is set by effects.js when effect is applied
 */
function renderSnake(ctx, snake) {
  // Use snake.color (set by effects system)
  ctx.fillStyle = snake.color;

  snake.segments.forEach((segment, index) => {
    const x = segment.x * CONFIG.UNIT_SIZE;
    const y = segment.y * CONFIG.UNIT_SIZE;

    ctx.fillRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);

    // Head distinction
    if (index === snake.segments.length - 1) {
      ctx.strokeStyle = '#FFFFFF';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);
    }
  });
}

function renderFood(ctx, food) {
  if (!food.position) {
    return;
  }

  const x = food.position.x * CONFIG.UNIT_SIZE;
  const y = food.position.y * CONFIG.UNIT_SIZE;

  const foodSize = CONFIG.FOOD_SIZE;
  const offset = (CONFIG.UNIT_SIZE - foodSize) / 2;

  // Food color based on type (from CONFIG)
  let foodColor;
  switch (food.type) {
    case 'growing':
      foodColor = CONFIG.COLORS.foodGrowing;
      break;
    case 'invincibility':
      foodColor = CONFIG.COLORS.foodInvincibility;
      break;
    case 'wallPhase':
      foodColor = CONFIG.COLORS.foodWallPhase;
      break;
    case 'speedBoost':
      foodColor = CONFIG.COLORS.foodSpeedBoost;
      break;
    case 'speedDecrease':
      foodColor = CONFIG.COLORS.foodSpeedDecrease;
      break;
    case 'reverseControls':
      foodColor = CONFIG.COLORS.foodReverseControls;
      break;
    default:
      foodColor = CONFIG.COLORS.foodGrowing;
  }

  ctx.fillStyle = foodColor;
  ctx.fillRect(x + offset, y + offset, foodSize, foodSize);
}
```

**js/state.js - No Changes Needed**

The `activeEffect` field already exists in gameState from Story 1.2:
```javascript
activeEffect: null,  // { type: 'invincibility' } or null
```

---

### 🎨 VISUAL SPECIFICATIONS

**Snake Color Changes:**
- Default (no effect): Black (#000000)
- Invincibility: Yellow (#FFFF00)
- Wall Phase: Purple (#800080)
- Speed Boost: Red (#FF0000)
- Speed Decrease: Cyan (#00FFFF)
- Reverse Controls: Orange (#FFA500)

**Color Change Timing:**
- Immediate when effect applied (same frame as food consumption)
- Instant change (no animation/transition)
- Reverts to black when effect cleared

**Food Colors (for visual testing):**
- Growing: Green (#00FF00)
- Invincibility: Yellow (#FFFF00)
- Wall Phase: Purple (#800080)
- Speed Boost: Red (#FF0000)
- Speed Decrease: Cyan (#00FFFF)
- Reverse Controls: Orange (#FFA500)

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Effect Application (placeholder - real foods in 2.2-2.5):**
   - Temporarily modify food.js spawnFood() to spawn 'invincibility' food
   - Eat food → snake turns yellow immediately
   - Verify gameState.activeEffect = { type: 'invincibility' }

2. **Effect Clearing:**
   - Have active effect (yellow snake)
   - Spawn and eat 'growing' food
   - Verify snake turns black (effect cleared)
   - Verify gameState.activeEffect = null

3. **Effect Replacement:**
   - Have invincibility active (yellow snake)
   - Eat wallPhase food (placeholder)
   - Verify snake turns purple immediately (not yellow)
   - Verify gameState.activeEffect.type = 'wallPhase'

4. **Color Accuracy:**
   - Test all 5 effect types
   - Verify each effect shows correct snake color
   - Colors should match CONFIG values exactly

5. **Effect Persistence:**
   - Apply effect
   - Move snake around for 30 seconds
   - Verify effect stays active (color doesn't change)
   - Verify effect only clears when eating food

6. **Multiple Game Sessions:**
   - Play game, apply effect, die
   - Play Again
   - Verify no effect carries over (snake is black)
   - Verify activeEffect is null

**Testing Helper (temporary code for testing):**

```javascript
// Add to main.js temporarily
window.testEffect = (type) => {
  const { applyEffect } = await import('./effects.js');
  applyEffect(gameState, type);
};

// In console:
// testEffect('invincibility')  → snake turns yellow
// testEffect('wallPhase')      → snake turns purple
```

**Common Issues:**
- ❌ Color doesn't change → Check updateSnakeColor() is called
- ❌ Previous effect not cleared → Check clearEffect() called first
- ❌ Wrong color → Verify CONFIG.COLORS values
- ❌ Effect persists after death → Check resetGame() clears activeEffect

---

### 📚 CRITICAL DATA FORMATS

**Active Effect Object:**
```javascript
// CORRECT: Simple object with type field
activeEffect: { type: 'invincibility' }
activeEffect: null  // No active effect

// WRONG: Don't use string directly or other formats
activeEffect: 'invincibility'  // DON'T DO THIS
activeEffect: { name: 'invincibility' }  // Wrong field name
```

**Effect Types:**
```javascript
// CORRECT: Use string literals matching EFFECT_TYPES
effectType = 'invincibility'
effectType = 'wallPhase'
effectType = 'speedBoost'
effectType = 'speedDecrease'
effectType = 'reverseControls'

// WRONG: Don't use numbers or abbreviations
effectType = 0  // DON'T DO THIS
effectType = 'inv'  // DON'T DO THIS
```

**Food Types:**
```javascript
// CORRECT: Food type matches effect type (except growing)
food.type = 'growing'  // Clears effect, no new effect
food.type = 'invincibility'  // Applies invincibility effect
food.type = 'wallPhase'  // Applies wallPhase effect

// Food type and effect type use SAME string values
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Critical Rules for This Story:**

From project-context.md:
1. **Effect Structure:** activeEffect is object with `type` field or `null`
2. **Colors:** ALWAYS use hex strings from CONFIG.COLORS
3. **Module Boundaries:** effects.js manages all effect logic
4. **Naming:** camelCase functions (applyEffect, clearEffect, isEffectActive)

**Effect System Rules:**
- Only ONE effect active at a time
- New effect ALWAYS clears previous effect first
- Growing food clears effect but doesn't apply new one
- Effect stored in gameState.activeEffect
- Snake color updated immediately when effect changes

---

### 🚨 PREVIOUS STORY DEPENDENCIES

**Depends on Story 1.6:**
- ✅ resetGame() must exist (should clear activeEffect)
- ✅ Game session flow must work

**Depends on Story 1.4:**
- ✅ Food system must be working
- ✅ spawnFood() must exist
- ✅ Food collision detection must work
- ✅ gameState.food.type must be set

**Depends on Story 1.2:**
- ✅ gameState.activeEffect must exist
- ✅ gameState.snake.color must exist
- ✅ Rendering system must be working

**Depends on Story 1.1:**
- ✅ CONFIG.COLORS must have all effect colors defined
- ✅ All color values must exist

**If previous stories incomplete, this story will fail!**

---

### 📋 FRs COVERED

FR13-FR20

**Detailed FR Mapping:**
- FR13: Invincibility food → Effect type defined (implementation in 2.2)
- FR14: Wall-phase food → Effect type defined (implementation in 2.3)
- FR15: Speed boost food → Effect type defined (implementation in 2.4)
- FR16: Speed decrease food → Effect type defined (implementation in 2.4)
- FR17: Reverse controls food → Effect type defined (implementation in 2.5)
- FR18: Food types visually distinct → Different colors in CONFIG
- FR19: Food effects clear on snake growth → clearEffect() in growing food handler
- FR20: Effects last until next food → Effect only cleared when food eaten

**NFRs Covered:**
- NFR30: Effects trigger reliably 100% → Direct state manipulation, no delays
- NFR31: Effects apply immediately → applyEffect() called in same tick as collision
- NFR35: Consistent state → activeEffect managed centrally in effects.js

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] js/effects.js exists with all functions (apply, clear, isActive, get)
- [ ] EFFECT_TYPES constant defined with all 5 types
- [ ] applyEffect() clears previous effect before applying new one
- [ ] clearEffect() sets activeEffect to null and resets color
- [ ] isEffectActive() checks type correctly
- [ ] updateSnakeColor() handles all 5 effect types
- [ ] game.js calls applyEffect() when special food eaten
- [ ] game.js calls clearEffect() when growing food eaten
- [ ] render.js uses snake.color (no hardcoded color)
- [ ] Snake color changes immediately when effect applied
- [ ] Snake color resets to black when effect cleared
- [ ] All 5 effect colors match CONFIG specifications
- [ ] Effect structure is { type: 'effectName' } or null
- [ ] resetGame() clears activeEffect (verify in state.js)
- [ ] No console errors
- [ ] All exports are named exports

**Effect System Checklist:**
- [ ] Only one effect active at a time
- [ ] New effect replaces old effect
- [ ] Growing food clears effect without applying new one
- [ ] Effect persists until next food eaten
- [ ] Snake color provides visual feedback of active effect

**Color Validation Checklist:**
- [ ] Invincibility → Yellow (#FFFF00)
- [ ] Wall Phase → Purple (#800080)
- [ ] Speed Boost → Red (#FF0000)
- [ ] Speed Decrease → Cyan (#00FFFF)
- [ ] Reverse Controls → Orange (#FFA500)
- [ ] No Effect → Black (#000000)

**Common Mistakes to Avoid:**
- ❌ Not clearing previous effect before applying new one
- ❌ Using string directly for activeEffect (should be object)
- ❌ Hardcoding snake color in render.js
- ❌ Forgetting to update snake color when effect applied
- ❌ Not handling growing food specially (should clear effect)
- ❌ Effect types not matching food types
- ❌ Missing effect type in switch statement

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

No debugging required - implementation followed Dev Notes specifications exactly.

### Completion Notes List

✅ **Effect System Module (js/effects.js)**
- Created new effects.js module with all required functions
- Implemented applyEffect(), clearEffect(), isEffectActive(), getActiveEffect()
- Added EFFECT_TYPES constant with all 5 effect types
- Effect validation prevents invalid effect types
- Snake color updates immediately when effect applied/cleared

✅ **Game Loop Integration (js/game.js)**
- Imported applyEffect and clearEffect from effects module
- Updated food collision handler to check food type
- Growing food clears effect without applying new one
- Special food applies effect (automatically clears previous)
- Effects trigger 100% reliably on food consumption

✅ **Visual Feedback (js/render.js)**
- renderSnake() uses snake.color from gameState (set by effects)
- renderFood() updated with switch statement for all 6 food types
- Color changes are immediate (same frame as effect application)

✅ **Testing Infrastructure**
- Created test/ directory with test runner (test/index.html)
- Created unit tests (test/effects.test.js) covering all functions
- Created integration tests (test/integration.test.js) for complete lifecycle
- Added manual test helpers to main.js (window.testEffect, window.clearTestEffect)

✅ **State Management Verification**
- Verified resetGame() properly clears activeEffect
- Snake color resets to default on game reset
- Effect persistence confirmed (no time-based clearing)

### File List

- test/index.html (new - test runner)
- test/effects.test.js (new - unit tests)
- test/integration.test.js (new - integration tests)
- js/effects.js (new - effect system module)
- js/game.js (updated - effect handling in food collision)
- js/render.js (updated - effect-based colors for snake and food)
- js/main.js (updated - added effect test helpers)
