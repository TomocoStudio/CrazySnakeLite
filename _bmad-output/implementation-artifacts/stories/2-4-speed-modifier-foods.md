# Story 2.4: Speed Modifier Foods

**Epic:** 2 - Chaos Food Effects
**Story ID:** 2.4
**Status:** done
**Created:** 2026-01-25

---

## Story

**As a** player,
**I want** speed-changing foods to make the game more chaotic,
**So that** I experience varied gameplay intensity.

## Acceptance Criteria

**Given** red cross/plus-shaped food appears on the board
**When** the snake's head occupies the food position
**Then** the snake grows by one segment
**And** the speed boost effect is applied
**And** the snake turns red
**And** the snake moves faster (1.5x to 2x base speed, randomly selected)

**Given** cyan hollow square food appears on the board
**When** the snake's head occupies the food position
**Then** the snake grows by one segment
**And** the speed decrease effect is applied
**And** the snake turns cyan
**And** the snake moves slower (0.3x to 0.5x base speed, randomly selected)

**Given** the snake has speed boost active
**When** the game loop processes movement
**Then** the tick rate is reduced (snake moves more frequently)
**And** 60 FPS rendering is maintained

**Given** the snake has speed decrease active
**When** the game loop processes movement
**Then** the tick rate is increased (snake moves less frequently)
**And** the player waits noticeably longer between moves

**Given** the snake has any speed modifier active
**When** the snake eats any other food
**Then** the speed returns to normal (8 moves per second)
**And** the new food's effect (if any) is applied

## Tasks / Subtasks

- [x] Update food.js to render cross and hollow square shapes (AC: Red cross and cyan square appear)
  - [x] Implement renderCross() helper function
  - [x] Implement renderHollowSquare() helper function
  - [x] Add cross case for speedBoost
  - [x] Add hollow square case for speedDecrease
- [x] Update effects.js to store speed multiplier (AC: Speed multiplier randomized)
  - [x] Modify applyEffect() to generate random multiplier for speed effects
  - [x] Store multiplier in activeEffect object
  - [x] Speed boost: random between 1.5x and 2.0x
  - [x] Speed decrease: random between 0.3x and 0.5x
- [x] Update game.js to use dynamic tick rate (AC: Movement speed changes)
  - [x] Read speed multiplier from activeEffect
  - [x] Calculate modified tick rate (BASE_TICK_RATE / multiplier)
  - [x] Apply modified tick rate to game loop accumulator
  - [x] Restore normal tick rate when effect clears
- [x] Update config.js with speed constants (AC: Configurable speed ranges)
  - [x] Add SPEED_BOOST_MIN, SPEED_BOOST_MAX
  - [x] Add SPEED_DECREASE_MIN, SPEED_DECREASE_MAX
- [x] Test speed modifier behavior (AC: All acceptance criteria pass)
  - [x] Speed boost makes snake noticeably faster
  - [x] Speed decrease makes snake noticeably slower
  - [x] Speed returns to normal on next food
  - [x] 60 FPS maintained at all speeds

---

## Developer Context

### 🎯 STORY OBJECTIVE

This story implements TWO SPEED MODIFIER FOODS - speed boost and speed decrease. Your job is to:

1. **Render cross (red) and hollow square (cyan)** shapes using canvas drawing
2. **Generate random speed multipliers** when speed effect applied (1.5-2x boost, 0.3-0.5x decrease)
3. **Modify game loop tick rate dynamically** based on active speed effect
4. **Restore normal speed** when effect clears (8 moves per second)

**CRITICAL SUCCESS FACTORS:**
- Speed multiplier MUST be randomized (not fixed value)
- Tick rate MUST change (not just visual feedback)
- Speed boost MUST be noticeably faster (1.5x-2x)
- Speed decrease MUST be noticeably slower (0.3x-0.5x)
- 60 FPS rendering MUST be maintained (only logic tick rate changes)
- Normal speed MUST restore when effect clears

**WHY THIS MATTERS:**
- Creates dynamic difficulty (boost = harder, decrease = easier)
- Random multiplier adds unpredictability (more chaotic)
- Tests player adaptability to changing speeds
- Makes game more replayable (different experience each time)

**DEPENDENCIES:**
- Story 2.1 MUST be complete (effects.js with applyEffect/clearEffect)
- Story 1.2 MUST be complete (game loop with fixed timestep)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Module Structure (THIS STORY):**

```
js/
├── food.js         # Add cross and hollow square rendering (MODIFY)
├── effects.js      # Store speed multiplier in activeEffect (MODIFY)
├── game.js         # Use dynamic tick rate based on effect (MODIFY)
├── config.js       # Add speed multiplier constants (MODIFY)
```

**Speed Modifier Rules (from PRD FR17-FR18):**
- Red cross/plus food: Speed boost (1.5x to 2x, random)
- Cyan hollow square food: Speed decrease (0.3x to 0.5x, random)
- Snake turns red or cyan when effect applied (already in effects.js)
- Multiplier randomized when effect applied (stored in activeEffect)
- Tick rate modified (logic speed changes, not render FPS)
- Effect ends when next food eaten

**Speed Multiplier Pattern:**
```javascript
// In effects.js - Store speed multiplier
export function applyEffect(gameState, effectType) {
  clearEffect(gameState);

  let speedMultiplier = 1.0;  // Default (no speed change)

  if (effectType === EFFECT_TYPES.SPEED_BOOST) {
    // Random between 1.5x and 2.0x
    speedMultiplier = CONFIG.SPEED_BOOST_MIN +
                 Math.random() * (CONFIG.SPEED_BOOST_MAX - CONFIG.SPEED_BOOST_MIN);
  } else if (effectType === EFFECT_TYPES.SPEED_DECREASE) {
    // Random between 0.3x and 0.5x
    speedMultiplier = CONFIG.SPEED_DECREASE_MIN +
                 Math.random() * (CONFIG.SPEED_DECREASE_MAX - CONFIG.SPEED_DECREASE_MIN);
  }

  gameState.activeEffect = {
    type: effectType,
    speedMultiplier: speedMultiplier  // NEW field
  };

  updateSnakeColor(gameState);
}
```

**Dynamic Tick Rate Pattern:**
```javascript
// In game.js - Use dynamic tick rate
function gameLoop(currentTime, ctx, gameState) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  accumulator += deltaTime;

  // Calculate current tick rate based on active effect
  const currentTickRate = getCurrentTickRate(gameState);

  while (accumulator >= currentTickRate) {
    update(gameState);
    accumulator -= currentTickRate;
  }

  render(ctx, gameState);
  requestAnimationFrame((time) => gameLoop(time, ctx, gameState));
}

function getCurrentTickRate(gameState) {
  const baseTickRate = CONFIG.TICK_RATE;  // 125ms (8 moves/sec)

  if (!gameState.activeEffect) {
    return baseTickRate;
  }

  const speedMultiplier = gameState.activeEffect.speedMultiplier;
  if (speedMultiplier && speedMultiplier !== 1.0) {
    // Faster speed = shorter tick rate
    // Slower speed = longer tick rate
    return baseTickRate / speedMultiplier;
  }

  return baseTickRate;
}
```

---

### 📦 LIBRARY & FRAMEWORK REQUIREMENTS

**Browser APIs Used:**
- **Canvas 2D Context:** For cross and hollow square rendering
- **Math.random():** For speed multiplier randomization
- No external dependencies

**Canvas Drawing:**
- **Cross/Plus:** Use ctx.fillRect() for horizontal and vertical bars
- **Hollow Square:** Use ctx.strokeRect() with line width

---

### 📁 FILE STRUCTURE REQUIREMENTS

**js/food.js - Cross and Hollow Square Rendering (UPDATED)**

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
      renderRing(ctx, centerX, centerY, foodSize);
      break;

    case 'speedBoost':
      // Red cross/plus (NEW in Story 2.4)
      renderCross(ctx, centerX, centerY, foodSize);
      break;

    case 'speedDecrease':
      // Cyan hollow square (NEW in Story 2.4)
      renderHollowSquare(ctx, centerX, centerY, foodSize);
      break;

    default:
      const defaultOffset = (CONFIG.UNIT_SIZE - foodSize) / 2;
      ctx.fillRect(x + defaultOffset, y + defaultOffset, foodSize, foodSize);
  }
}

/**
 * Render cross/plus shape (+)
 * NEW in Story 2.4
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} size - Food size (5px)
 */
function renderCross(ctx, centerX, centerY, size) {
  const barWidth = 1;  // 1px wide bars
  const barLength = size;  // 5px long

  // Horizontal bar
  ctx.fillRect(
    centerX - barLength / 2,
    centerY - barWidth / 2,
    barLength,
    barWidth
  );

  // Vertical bar
  ctx.fillRect(
    centerX - barWidth / 2,
    centerY - barLength / 2,
    barWidth,
    barLength
  );
}

/**
 * Render hollow square (outline only)
 * NEW in Story 2.4
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} size - Food size (5px)
 */
function renderHollowSquare(ctx, centerX, centerY, size) {
  ctx.lineWidth = 1;  // 1px stroke
  ctx.strokeRect(
    centerX - size / 2,
    centerY - size / 2,
    size,
    size
  );
}

// ... existing renderStar(), renderRing() from previous stories ...
```

**js/effects.js - Speed Multiplier Storage (UPDATED)**

```javascript
import { CONFIG } from './config.js';

export const EFFECT_TYPES = {
  INVINCIBILITY: 'invincibility',
  WALL_PHASE: 'wallPhase',
  SPEED_BOOST: 'speedBoost',
  SPEED_DECREASE: 'speedDecrease',
  REVERSE_CONTROLS: 'reverseControls'
};

/**
 * Apply effect to game state
 * UPDATED in Story 2.4: Add speed multiplier for speed effects
 */
export function applyEffect(gameState, effectType) {
  const validTypes = Object.values(EFFECT_TYPES);
  if (!validTypes.includes(effectType)) {
    console.warn(`Invalid effect type: ${effectType}`);
    return;
  }

  clearEffect(gameState);

  // Calculate speed multiplier for speed effects (NEW in Story 2.4)
  let speedMultiplier = 1.0;  // Default (no speed change)

  if (effectType === EFFECT_TYPES.SPEED_BOOST) {
    // Random between 1.5x and 2.0x
    const min = CONFIG.SPEED_BOOST_MIN;
    const max = CONFIG.SPEED_BOOST_MAX;
    speedMultiplier = min + Math.random() * (max - min);
  } else if (effectType === EFFECT_TYPES.SPEED_DECREASE) {
    // Random between 0.3x and 0.5x
    const min = CONFIG.SPEED_DECREASE_MIN;
    const max = CONFIG.SPEED_DECREASE_MAX;
    speedMultiplier = min + Math.random() * (max - min);
  }

  // Apply new effect with speed multiplier
  gameState.activeEffect = {
    type: effectType,
    speedMultiplier: speedMultiplier  // NEW field (always present, 1.0 if not speed effect)
  };

  updateSnakeColor(gameState);
}

export function clearEffect(gameState) {
  gameState.activeEffect = null;
  gameState.snake.color = CONFIG.COLORS.snakeDefault;
}

export function isEffectActive(gameState, effectType) {
  return gameState.activeEffect !== null &&
         gameState.activeEffect.type === effectType;
}

export function getActiveEffect(gameState) {
  return gameState.activeEffect;
}

function updateSnakeColor(gameState) {
  const effect = gameState.activeEffect;

  if (!effect) {
    gameState.snake.color = CONFIG.COLORS.snakeDefault;
    return;
  }

  switch (effect.type) {
    case EFFECT_TYPES.INVINCIBILITY:
      gameState.snake.color = CONFIG.COLORS.snakeInvincibility;
      break;
    case EFFECT_TYPES.WALL_PHASE:
      gameState.snake.color = CONFIG.COLORS.snakeWallPhase;
      break;
    case EFFECT_TYPES.SPEED_BOOST:
      gameState.snake.color = CONFIG.COLORS.snakeSpeedBoost;
      break;
    case EFFECT_TYPES.SPEED_DECREASE:
      gameState.snake.color = CONFIG.COLORS.snakeSpeedDecrease;
      break;
    case EFFECT_TYPES.REVERSE_CONTROLS:
      gameState.snake.color = CONFIG.COLORS.snakeReverseControls;
      break;
    default:
      gameState.snake.color = CONFIG.COLORS.snakeDefault;
  }
}
```

**js/game.js - Dynamic Tick Rate (UPDATED)**

```javascript
import { CONFIG } from './config.js';
import { render } from './render.js';
import { moveSnake, growSnake } from './snake.js';
import { checkFoodCollision, checkWallCollision, checkSelfCollision } from './collision.js';
import { spawnFood } from './food.js';
import { applyEffect, clearEffect } from './effects.js';

let lastTime = 0;
let accumulator = 0;

const gameoverScreen = document.getElementById('gameover-screen');
const scoreValueElement = document.getElementById('score-value');

export function gameLoop(currentTime, ctx, gameState) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  accumulator += deltaTime;

  // Calculate current tick rate based on active effect (UPDATED in Story 2.4)
  const currentTickRate = getCurrentTickRate(gameState);

  while (accumulator >= currentTickRate) {
    update(gameState);
    accumulator -= currentTickRate;
  }

  render(ctx, gameState);
  updateUI(gameState);
  requestAnimationFrame((time) => gameLoop(time, ctx, gameState));
}

/**
 * Get current tick rate based on speed effects
 * NEW in Story 2.4
 * @param {object} gameState
 * @returns {number} - Tick rate in milliseconds
 */
function getCurrentTickRate(gameState) {
  const baseTickRate = CONFIG.TICK_RATE;  // 125ms (8 moves/sec)

  if (!gameState.activeEffect) {
    return baseTickRate;
  }

  const speedMultiplier = gameState.activeEffect.speedMultiplier;

  // Speed multiplier modifies tick rate:
  // - Multiplier > 1.0 (boost) → shorter tick rate → faster movement
  // - Multiplier < 1.0 (decrease) → longer tick rate → slower movement
  if (speedMultiplier && speedMultiplier !== 1.0) {
    return baseTickRate / speedMultiplier;
  }

  return baseTickRate;
}

function update(gameState) {
  if (gameState.phase !== 'playing') {
    return;
  }

  moveSnake(gameState);

  // Check food collision
  if (checkFoodCollision(gameState)) {
    const foodType = gameState.food.type;

    growSnake(gameState);
    gameState.score = gameState.snake.segments.length;

    // Handle effects
    if (foodType === 'growing') {
      clearEffect(gameState);
    } else {
      applyEffect(gameState, foodType);
    }

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

**js/config.js - Speed Multiplier Constants (UPDATED)**

```javascript
export const CONFIG = {
  // Grid
  GRID_WIDTH: 25,
  GRID_HEIGHT: 20,
  UNIT_SIZE: 10,

  // Snake
  STARTING_LENGTH: 5,
  STARTING_DIRECTION: 'right',

  // Game loop
  TICK_RATE: 125,  // Base: 8 moves per second

  // Food
  FOOD_SIZE: 5,

  // Strobe effect
  STROBE_INTERVAL: 100,

  // Speed modifiers (NEW in Story 2.4)
  SPEED_BOOST_MIN: 1.5,    // 1.5x faster (minimum)
  SPEED_BOOST_MAX: 2.0,    // 2.0x faster (maximum)
  SPEED_DECREASE_MIN: 0.3, // 0.3x speed (minimum, very slow)
  SPEED_DECREASE_MAX: 0.5, // 0.5x speed (maximum, half speed)

  // Grid styling
  GRID_LINE_WIDTH: 0.5,
  GRID_LINE_OPACITY: 0.3,

  // Colors
  COLORS: {
    background: '#E8E8E8',
    gridLine: '#D0D0D0',

    // Snake colors
    snakeDefault: '#000000',
    snakeGrowing: '#00FF00',
    snakeInvincibility: '#FFFF00',
    snakeWallPhase: '#800080',
    snakeSpeedBoost: '#FF0000',
    snakeSpeedDecrease: '#00FFFF',
    snakeReverseControls: '#FFA500',

    // Food colors
    foodGrowing: '#00FF00',
    foodInvincibility: '#FFFF00',
    foodWallPhase: '#800080',
    foodSpeedBoost: '#FF0000',
    foodSpeedDecrease: '#00FFFF',
    foodReverseControls: '#FFA500'
  }
};
```

---

### 🎨 VISUAL SPECIFICATIONS

**Speed Boost Food (Red Cross):**
- **Color:** Red (#FF0000)
- **Shape:** Cross/plus (+)
- **Size:** 5x5 pixels
- **Bar width:** 1px
- **Bar length:** 5px (full food size)
- **Position:** Centered in grid cell

**Speed Decrease Food (Cyan Hollow Square):**
- **Color:** Cyan (#00FFFF)
- **Shape:** Hollow square (outline only)
- **Size:** 5x5 pixels
- **Stroke width:** 1px
- **Position:** Centered in grid cell

**Visual Feedback:**
- Speed boost → Snake turns red, moves noticeably faster
- Speed decrease → Snake turns cyan, moves noticeably slower
- Speed change is immediate (same tick as food consumption)
- Speed returns to normal when next food eaten

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Cross Shape Rendering:**
   - [ ] Spawn speedBoost food
   - [ ] Verify red cross/plus appears
   - [ ] Cross is centered, both bars visible
   - [ ] Clearly distinguishable from other shapes

2. **Hollow Square Rendering:**
   - [ ] Spawn speedDecrease food
   - [ ] Verify cyan hollow square appears
   - [ ] Square is hollow (outline only), not filled
   - [ ] Clearly distinguishable from growing food (filled square)

3. **Speed Boost Effect:**
   - [ ] Eat speed boost food (red cross)
   - [ ] Snake turns red
   - [ ] Movement is noticeably faster (1.5x-2x)
   - [ ] Count moves: should be 12-16 moves/sec instead of 8
   - [ ] 60 FPS maintained (rendering smooth)

4. **Speed Decrease Effect:**
   - [ ] Eat speed decrease food (cyan square)
   - [ ] Snake turns cyan
   - [ ] Movement is noticeably slower (0.3x-0.5x)
   - [ ] Count moves: should be 2.4-4 moves/sec instead of 8
   - [ ] Game feels sluggish but responsive

5. **Speed Multiplier Randomization:**
   - [ ] Eat speed boost 5 times
   - [ ] Verify speed varies each time (not always same)
   - [ ] Should feel between 1.5x and 2x
   - [ ] Eat speed decrease 5 times
   - [ ] Verify speed varies each time

6. **Speed Returns to Normal:**
   - [ ] Have speed boost active (red, fast)
   - [ ] Eat any other food
   - [ ] Verify speed returns to 8 moves/sec
   - [ ] Repeat with speed decrease

7. **Speed Effect Stacking:**
   - [ ] Eat speed boost → becomes fast
   - [ ] Eat speed decrease → becomes slow (not faster+slower)
   - [ ] Verify previous effect cleared, new effect applied
   - [ ] Speed should be slow, not both

8. **Gameplay with Speed Changes:**
   - [ ] Play game normally
   - [ ] Alternate between boost/decrease foods
   - [ ] Verify game remains playable at all speeds
   - [ ] No crashes or jittering

**Testing Helper:**
```javascript
// Add to main.js
window.testSpeedBoost = () => {
  gameState.food = { position: { x: 5, y: 5 }, type: 'speedBoost' };
};

window.testSpeedDecrease = () => {
  gameState.food = { position: { x: 5, y: 5 }, type: 'speedDecrease' };
};

// Console:
// testSpeedBoost()  → red cross at (5,5)
// testSpeedDecrease()  → cyan square at (5,5)
```

**Common Issues:**
- ❌ **Cross bars not centered** → Check offset calculations
- ❌ **Hollow square is filled** → Use strokeRect not fillRect
- ❌ **Speed doesn't change** → Verify getCurrentTickRate() called in game loop
- ❌ **Speed not random** → Check Math.random() in applyEffect()
- ❌ **Speed too extreme** → Verify MIN/MAX constants in config.js
- ❌ **FPS drops** → Speed modifies logic tick, not render FPS

---

### 📚 CRITICAL DATA FORMATS

**Active Effect with Speed Multiplier:**
```javascript
// CORRECT: Speed boost effect
activeEffect = {
  type: 'speedBoost',
  speedMultiplier: 1.73  // Random between 1.5 and 2.0
}

// CORRECT: Speed decrease effect
activeEffect = {
  type: 'speedDecrease',
  speedMultiplier: 0.42  // Random between 0.3 and 0.5
}

// CORRECT: Non-speed effect (invincibility)
activeEffect = {
  type: 'invincibility',
  speedMultiplier: 1.0  // No speed change
}

// WRONG: Missing speedMultiplier
activeEffect = {
  type: 'speedBoost'  // WRONG - needs speedMultiplier
}
```

**Tick Rate Calculation:**
```javascript
// CORRECT: Inverse relationship
// Faster speed (2x) → shorter tick (125ms / 2 = 62.5ms)
// Slower speed (0.5x) → longer tick (125ms / 0.5 = 250ms)
tickRate = baseTickRate / speedMultiplier;

// WRONG: Don't multiply
tickRate = baseTickRate * speedMultiplier;  // WRONG - inverse!
```

**Speed Multiplier Range:**
```javascript
// CORRECT: Random within range
const min = CONFIG.SPEED_BOOST_MIN;  // 1.5
const max = CONFIG.SPEED_BOOST_MAX;  // 2.0
const multiplier = min + Math.random() * (max - min);
// Result: 1.5 to 2.0

// WRONG: Don't use fixed values
const multiplier = 1.8;  // WRONG - not random
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Critical Rules:**
1. **Tick Rate:** Modify logic tick (TICK_RATE), NOT render FPS (60 FPS always)
2. **Speed Multiplier:** ALWAYS random, ALWAYS stored in activeEffect
3. **Inverse Relationship:** tickRate = baseTick / multiplier (divide, not multiply!)
4. **Effect Clearing:** Speed returns to 8 moves/sec when effect cleared

**Speed Modifier Rules:**
- Speed boost: 1.5x to 2x faster (TICK_RATE / 1.5 to TICK_RATE / 2)
- Speed decrease: 0.3x to 0.5x speed (TICK_RATE / 0.3 to TICK_RATE / 0.5)
- Multiplier randomized on applyEffect()
- Multiplier stored in activeEffect.speedMultiplier
- Game loop uses getCurrentTickRate() to get modified tick rate

---

### 🚨 PREVIOUS STORY DEPENDENCIES

**CRITICAL: Story 2.1 MUST be complete!**
- ✅ effects.js with applyEffect(), clearEffect()
- ✅ Effect system working

**Story 1.2:**
- ✅ Game loop with fixed timestep working
- ✅ TICK_RATE defined in config
- ✅ Accumulator-based game loop

---

### 📋 FRs COVERED

**FR17:** Speed Boost food increases length AND increases movement speed until next food
**FR18:** Speed Decrease food increases length AND decreases movement speed until next food

**NFRs:**
- **NFR1:** 60 FPS maintained → Only logic tick changes, render always 60 FPS
- **NFR29:** Snake movement speed consistent → Tick rate modified consistently
- **NFR30:** Effects trigger reliably 100%

---

### ✅ STORY COMPLETION CHECKLIST

**Food Rendering:**
- [ ] renderCross() function exists
- [ ] Cross has horizontal and vertical 1px bars
- [ ] Cross renders in red (#FF0000)
- [ ] renderHollowSquare() function exists
- [ ] Hollow square uses strokeRect (not fillRect)
- [ ] Hollow square renders in cyan (#00FFFF)
- [ ] renderFood() calls correct functions for speedBoost/speedDecrease

**Speed Multiplier:**
- [ ] effects.js modified to add speedMultiplier field
- [ ] Speed boost multiplier: random 1.5 to 2.0
- [ ] Speed decrease multiplier: random 0.3 to 0.5
- [ ] Math.random() used for randomization
- [ ] speedMultiplier stored in activeEffect object
- [ ] Non-speed effects have speedMultiplier = 1.0

**Dynamic Tick Rate:**
- [ ] getCurrentTickRate() function exists in game.js
- [ ] Returns baseTickRate when no active effect
- [ ] Returns baseTickRate / speedMultiplier when speed effect active
- [ ] Game loop calls getCurrentTickRate()
- [ ] Accumulator uses dynamic tick rate
- [ ] 60 FPS rendering maintained (RAF unchanged)

**Config Constants:**
- [ ] CONFIG.SPEED_BOOST_MIN = 1.5
- [ ] CONFIG.SPEED_BOOST_MAX = 2.0
- [ ] CONFIG.SPEED_DECREASE_MIN = 0.3
- [ ] CONFIG.SPEED_DECREASE_MAX = 0.5

**Integration & Testing:**
- [ ] Speed boost makes snake noticeably faster
- [ ] Speed decrease makes snake noticeably slower
- [ ] Speed is random each time (varies)
- [ ] Speed returns to normal on next food
- [ ] Both effects clear previous effects
- [ ] No FPS drops during speed changes
- [ ] No console errors
- [ ] All exports are named exports

**Common Mistakes:**
- ❌ Multiplying instead of dividing tick rate
- ❌ Using fixed multiplier instead of random
- ❌ Not storing speedMultiplier in activeEffect
- ❌ Modifying render FPS instead of logic tick
- ❌ Hollow square filled instead of stroked
- ❌ Cross bars not properly centered

---

## Dev Agent Record

### Agent Model Used

Claude (implementation discovered during code review)

### Debug Log References

No debugging required - implementation followed Dev Notes specifications.

### Completion Notes List

✅ **Food Shape Rendering (js/render.js)**
- Created renderCross() helper function for red cross/plus shape
- Created renderHollowSquare() helper function for cyan hollow square
- Added 'speedBoost' and 'speedDecrease' cases to renderFood() switch
- Both shapes clearly distinguishable from other food types

✅ **Speed Multiplier Logic (js/effects.js)**
- Modified applyEffect() to generate random speedMultiplier for speed effects
- Speed boost: random between 1.5x and 2.0x (CONFIG.SPEED_BOOST_MIN/MAX)
- Speed decrease: random between 0.3x and 0.5x (CONFIG.SPEED_DECREASE_MIN/MAX)
- Non-speed effects have speedMultiplier = 1.0
- Multiplier stored in activeEffect object

✅ **Dynamic Tick Rate (js/game.js)**
- Created getCurrentTickRate() function to calculate modified tick rate
- Tick rate = BASE_TICK_RATE / speedMultiplier
- Faster speed (multiplier > 1) = shorter tick rate = more frequent moves
- Slower speed (multiplier < 1) = longer tick rate = less frequent moves
- Game loop uses dynamic tick rate in accumulator comparison

✅ **Configuration (js/config.js)**
- Added SPEED_BOOST_MIN: 1.5, SPEED_BOOST_MAX: 2.0
- Added SPEED_DECREASE_MIN: 0.3, SPEED_DECREASE_MAX: 0.5
- Speed decrease color: #00CED1 (Dark Turquoise)

### File List

- js/render.js (updated - added renderCross, renderHollowSquare functions)
- js/effects.js (updated - added speedMultiplier logic in applyEffect)
- js/game.js (updated - added getCurrentTickRate function)
- js/config.js (updated - added speed constants and food probabilities)
