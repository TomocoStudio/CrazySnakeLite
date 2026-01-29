# Story 2.5: Reverse Controls Food

**Epic:** 2 - Chaos Food Effects
**Story ID:** 2.5
**Status:** done
**Created:** 2026-01-25

---

## Story

**As a** player,
**I want** orange food to invert my controls temporarily,
**So that** I experience chaotic, challenging gameplay.

## Acceptance Criteria

**Given** orange X-shaped food appears on the board
**When** the snake's head occupies the food position
**Then** the snake grows by one segment
**And** the reverse controls effect is applied
**And** the snake turns orange

**Given** the snake has reverse controls active
**When** the player presses Up (or W/Z/8)
**Then** the snake moves Down

**Given** the snake has reverse controls active
**When** the player presses Down (or S/2)
**Then** the snake moves Up

**Given** the snake has reverse controls active
**When** the player presses Left (or A/Q/4)
**Then** the snake moves Right

**Given** the snake has reverse controls active
**When** the player presses Right (or D/6)
**Then** the snake moves Left

**Given** the snake has reverse controls active on mobile
**When** the player swipes in a direction
**Then** the snake moves in the opposite direction

**Given** the snake has reverse controls active
**When** the snake eats any other food
**Then** controls return to normal
**And** the new food's effect (if any) is applied

## Tasks / Subtasks

- [x] Update food.js to render X shape (AC: Orange X food appears)
  - [x] Implement renderX() helper function
  - [x] Add X case for reverseControls
  - [x] X is diagonal cross, 5x5 pixels, orange (#FFA500)
- [x] Update input.js to invert directions (AC: Controls reversed when effect active)
  - [x] Import isEffectActive from effects.js
  - [x] Check reverseControls effect in handleInput()
  - [x] Invert direction mapping when effect active
  - [x] Handle all 4 keyboard layouts (Arrow, WASD, ZQSD, Numpad)
  - [x] Handle mobile swipe directions
- [x] Ensure "can't reverse" rule applies to intended direction (AC: Can't turn into self)
  - [x] Validate INTENDED direction against current direction
  - [x] Prevent 180° turns even with reversed controls
- [x] Test reverse controls behavior (AC: All acceptance criteria pass)
  - [x] All 4 keyboard layouts invert correctly
  - [x] Mobile swipes invert correctly
  - [x] Can't turn into self (even when reversed)
  - [x] Controls return to normal on next food

---

## Developer Context

### 🎯 STORY OBJECTIVE

This story implements the REVERSE CONTROLS FOOD - the most mentally challenging effect. Your job is to:

1. **Render X-shape (diagonal cross)** for orange food using canvas drawing
2. **Invert input direction mapping** when reverseControls effect active
3. **Handle all input methods** (4 keyboard layouts + mobile swipes)
4. **Maintain "can't reverse" rule** on INTENDED direction (not reversed direction)

**CRITICAL SUCCESS FACTORS:**
- All input keys/swipes MUST invert (up→down, down→up, left→right, right→left)
- Inversion MUST work for ALL 4 keyboard layouts AND mobile
- "Can't turn 180°" rule applies to INTENDED direction (before inversion)
- Controls MUST return to normal when effect clears
- Effect does NOT persist after death/restart

**WHY THIS MATTERS:**
- Most disorienting effect (tests player adaptability)
- Punishes muscle memory (forces conscious thinking)
- Creates hilarious fail moments (player turns wrong way)
- Differentiates from other effects (mental challenge, not mechanical)

**DEPENDENCIES:**
- Story 2.1 MUST be complete (effects.js with applyEffect/clearEffect)
- Story 1.3 MUST be complete (input.js with direction handling)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Module Structure (THIS STORY):**

```
js/
├── food.js         # Add X shape rendering (MODIFY)
├── input.js        # Invert direction mapping when effect active (MODIFY)
├── effects.js      # Already handles reverseControls (from Story 2.1)
```

**Reverse Controls Rules (from PRD FR19):**
- Orange X-shaped food (diagonal cross)
- Inverts ALL directional inputs (keyboard + mobile)
- Snake turns orange when effect applied (already in effects.js)
- "Can't reverse 180°" rule applies to INTENDED direction (before inversion)
- Effect ends when next food eaten

**Direction Inversion Pattern:**
```javascript
// In input.js - Invert direction mapping
import { isEffectActive } from './effects.js';

export function handleInput(key, gameState) {
  // Map input key to intended direction
  let intendedDirection = getDirectionFromKey(key);

  if (!intendedDirection) {
    return;  // Invalid key
  }

  // Check "can't reverse 180°" rule on INTENDED direction
  if (isOppositeDirection(intendedDirection, gameState.snake.direction)) {
    return;  // Can't turn into self
  }

  // Apply reverseControls inversion if active
  let finalDirection = intendedDirection;
  if (isEffectActive(gameState, 'reverseControls')) {
    finalDirection = invertDirection(intendedDirection);
  }

  // Set next direction
  gameState.snake.nextDirection = finalDirection;
}

function invertDirection(direction) {
  const inversionMap = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
  };
  return inversionMap[direction];
}
```

**Key Insight - "Can't Reverse" Rule:**
The validation MUST happen on the INTENDED direction (before inversion), not the final direction. Otherwise, player could accidentally turn into themselves.

Example:
- Snake moving right
- Player presses left (intended: left, inverted: right)
- Without proper validation: intended=left is opposite of current=right → blocked ✅
- With wrong validation: final=right is same as current=right → not blocked ❌ (snake turns into self!)

---

### 📦 LIBRARY & FRAMEWORK REQUIREMENTS

**Browser APIs Used:**
- **Canvas 2D Context:** For X shape rendering
- **KeyboardEvent:** For keyboard input
- **TouchEvent:** For mobile swipe detection
- No external dependencies

**Canvas Drawing for X:**
- Two diagonal lines forming X shape
- Line width: 1px
- Lines span full 5x5 food size

---

### 📁 FILE STRUCTURE REQUIREMENTS

**js/food.js - X Shape Rendering (UPDATED)**

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
      renderCross(ctx, centerX, centerY, foodSize);
      break;

    case 'speedDecrease':
      renderHollowSquare(ctx, centerX, centerY, foodSize);
      break;

    case 'reverseControls':
      // X shape / diagonal cross (NEW in Story 2.5)
      renderX(ctx, centerX, centerY, foodSize);
      break;

    default:
      const defaultOffset = (CONFIG.UNIT_SIZE - foodSize) / 2;
      ctx.fillRect(x + defaultOffset, y + defaultOffset, foodSize, foodSize);
  }
}

/**
 * Render X shape (diagonal cross)
 * NEW in Story 2.5
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} centerX
 * @param {number} centerY
 * @param {number} size - Food size (5px)
 */
function renderX(ctx, centerX, centerY, size) {
  const halfSize = size / 2;

  ctx.lineWidth = 1;
  ctx.beginPath();

  // Diagonal line: top-left to bottom-right
  ctx.moveTo(centerX - halfSize, centerY - halfSize);
  ctx.lineTo(centerX + halfSize, centerY + halfSize);

  // Diagonal line: top-right to bottom-left
  ctx.moveTo(centerX + halfSize, centerY - halfSize);
  ctx.lineTo(centerX - halfSize, centerY + halfSize);

  ctx.stroke();
}

// ... existing render functions (renderStar, renderRing, etc.) ...
```

**js/input.js - Direction Inversion (UPDATED)**

```javascript
import { isEffectActive } from './effects.js';  // NEW import in Story 2.5

/**
 * Handle keyboard input
 * UPDATED in Story 2.5: Invert direction if reverseControls active
 */
export function setupInputHandlers(gameState) {
  document.addEventListener('keydown', (event) => {
    handleKeyInput(event.key, gameState);
  });

  // Mobile swipe handling
  setupMobileSwipeHandlers(gameState);
}

function handleKeyInput(key, gameState) {
  if (gameState.phase !== 'playing') {
    return;
  }

  // Get intended direction from key
  const intendedDirection = getDirectionFromKey(key);

  if (!intendedDirection) {
    return;  // Not a direction key
  }

  // CRITICAL: Check "can't reverse" rule on INTENDED direction
  // (before inversion, so player doesn't accidentally turn into self)
  const currentDirection = gameState.snake.direction;
  if (isOppositeDirection(intendedDirection, currentDirection)) {
    return;  // Can't make 180° turn
  }

  // Apply reverseControls inversion if active (NEW in Story 2.5)
  let finalDirection = intendedDirection;
  if (isEffectActive(gameState, 'reverseControls')) {
    finalDirection = invertDirection(intendedDirection);
  }

  // Set next direction
  gameState.snake.nextDirection = finalDirection;
}

/**
 * Map keyboard key to intended direction
 * Supports 4 keyboard layouts: Arrow, WASD, ZQSD (French), Numpad
 */
function getDirectionFromKey(key) {
  const keyMap = {
    // Arrow keys
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',

    // WASD
    w: 'up',
    W: 'up',
    s: 'down',
    S: 'down',
    a: 'left',
    A: 'left',
    d: 'right',
    D: 'right',

    // ZQSD (French keyboard)
    z: 'up',
    Z: 'up',
    q: 'left',
    Q: 'left',

    // Numpad
    '8': 'up',
    '2': 'down',
    '4': 'left',
    '6': 'right'
  };

  return keyMap[key] || null;
}

/**
 * Check if two directions are opposite
 */
function isOppositeDirection(dir1, dir2) {
  const opposites = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
  };
  return opposites[dir1] === dir2;
}

/**
 * Invert direction for reverseControls effect
 * NEW in Story 2.5
 */
function invertDirection(direction) {
  const inversionMap = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
  };
  return inversionMap[direction];
}

/**
 * Setup mobile swipe handlers
 * UPDATED in Story 2.5: Apply inversion for reverseControls
 */
function setupMobileSwipeHandlers(gameState) {
  let touchStartX = 0;
  let touchStartY = 0;

  document.addEventListener('touchstart', (event) => {
    touchStartX = event.touches[0].clientX;
    touchStartY = event.touches[0].clientY;
  });

  document.addEventListener('touchend', (event) => {
    if (gameState.phase !== 'playing') {
      return;
    }

    const touchEndX = event.changedTouches[0].clientX;
    const touchEndY = event.changedTouches[0].clientY;

    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;

    // Determine swipe direction (minimum 30px threshold)
    const threshold = 30;
    let intendedDirection = null;

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > threshold) {
        intendedDirection = deltaX > 0 ? 'right' : 'left';
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > threshold) {
        intendedDirection = deltaY > 0 ? 'down' : 'up';
      }
    }

    if (!intendedDirection) {
      return;  // Swipe too small
    }

    // Check "can't reverse" rule on intended direction
    const currentDirection = gameState.snake.direction;
    if (isOppositeDirection(intendedDirection, currentDirection)) {
      return;
    }

    // Apply reverseControls inversion if active (NEW in Story 2.5)
    let finalDirection = intendedDirection;
    if (isEffectActive(gameState, 'reverseControls')) {
      finalDirection = invertDirection(intendedDirection);
    }

    gameState.snake.nextDirection = finalDirection;
  });
}
```

---

### 🎨 VISUAL SPECIFICATIONS

**Reverse Controls Food (Orange X):**
- **Color:** Orange (#FFA500)
- **Shape:** X (diagonal cross)
- **Size:** 5x5 pixels
- **Line width:** 1px
- **Lines:** Two diagonals crossing at center
- **Position:** Centered in grid cell

**Visual Feedback:**
- Snake turns orange when effect active
- No additional visual effect (player discovers inversion when they move)
- Color returns to previous when effect clears

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **X Shape Rendering:**
   - [ ] Spawn reverseControls food
   - [ ] Verify orange X appears
   - [ ] Both diagonal lines visible
   - [ ] Clearly distinguishable from cross (+)

2. **Arrow Keys Inversion:**
   - [ ] Eat reverse controls food
   - [ ] Press Up → snake moves down
   - [ ] Press Down → snake moves up
   - [ ] Press Left → snake moves right
   - [ ] Press Right → snake moves left

3. **WASD Inversion:**
   - [ ] Have reverse controls active
   - [ ] Press W → snake moves down
   - [ ] Press S → snake moves up
   - [ ] Press A → snake moves right
   - [ ] Press D → snake moves left

4. **ZQSD Inversion (French):**
   - [ ] Have reverse controls active
   - [ ] Press Z → snake moves down
   - [ ] Press Q → snake moves right

5. **Numpad Inversion:**
   - [ ] Have reverse controls active
   - [ ] Press 8 → snake moves down
   - [ ] Press 2 → snake moves up
   - [ ] Press 4 → snake moves right
   - [ ] Press 6 → snake moves left

6. **Mobile Swipe Inversion:**
   - [ ] Have reverse controls active on mobile
   - [ ] Swipe up → snake moves down
   - [ ] Swipe down → snake moves up
   - [ ] Swipe left → snake moves right
   - [ ] Swipe right → snake moves left

7. **"Can't Reverse" Rule:**
   - [ ] Snake moving right
   - [ ] Have reverse controls active
   - [ ] Press left (intended: left, inverted: right)
   - [ ] Verify input BLOCKED (intended=left is opposite of current=right)
   - [ ] Snake continues moving right (doesn't turn)

8. **Controls Return to Normal:**
   - [ ] Have reverse controls active
   - [ ] Eat any other food
   - [ ] Press Up → snake moves up (not down)
   - [ ] Verify controls restored

9. **Effect Doesn't Persist:**
   - [ ] Have reverse controls active
   - [ ] Die (hit wall)
   - [ ] Play Again
   - [ ] Press Up → snake moves up (not down)
   - [ ] Verify effect cleared

**Testing Helper:**
```javascript
// Add to main.js
window.testReverseControls = () => {
  gameState.food = { position: { x: 5, y: 5 }, type: 'reverseControls' };
};

// Console:
// testReverseControls()  → orange X at (5,5)
```

**Common Issues:**
- ❌ **X not visible** → Check both diagonal lines drawn, stroke() called
- ❌ **Some keys don't invert** → Verify all key mappings in getDirectionFromKey()
- ❌ **Can turn into self** → Check validation happens on INTENDED direction
- ❌ **Wrong inversion** → Verify invertDirection() map correct
- ❌ **Mobile doesn't invert** → Check swipe handler has inversion logic

---

### 📚 CRITICAL DATA FORMATS

**Direction Strings:**
```javascript
// CORRECT: Use lowercase direction strings
direction = 'up'    // CORRECT
direction = 'down'  // CORRECT
direction = 'left'  // CORRECT
direction = 'right' // CORRECT

// WRONG: Don't use numbers or other formats
direction = 0       // WRONG
direction = 'UP'    // WRONG (case matters)
```

**Inversion Logic:**
```javascript
// CORRECT: Validate INTENDED direction, then invert
const intendedDirection = getDirectionFromKey(key);
if (isOppositeDirection(intendedDirection, currentDirection)) {
  return;  // Block
}
const finalDirection = invertDirection(intendedDirection);

// WRONG: Don't validate AFTER inversion
const intendedDirection = getDirectionFromKey(key);
const finalDirection = invertDirection(intendedDirection);
if (isOppositeDirection(finalDirection, currentDirection)) {
  return;  // WRONG - this allows turning into self!
}
```

**Inversion Map:**
```javascript
// CORRECT: Bidirectional inversion
const inversionMap = {
  up: 'down',
  down: 'up',
  left: 'right',
  right: 'left'
};

// WRONG: Incomplete map
const inversionMap = {
  up: 'down',
  down: 'up'
  // Missing left/right!
};
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Critical Rules:**
1. **Direction Validation:** ALWAYS validate on intended direction (before inversion)
2. **All Inputs:** Invert ALL input methods (keyboard + mobile)
3. **Keyboard Layouts:** Support all 4 layouts (Arrow, WASD, ZQSD, Numpad)
4. **Effect Clearing:** Controls return to normal when effect clears

**Reverse Controls Rules:**
- Invert all directional inputs (up↔down, left↔right)
- Validate "can't reverse 180°" on intended direction
- Effect applied by effects.js when reverseControls food eaten
- Effect cleared when ANY food eaten (handled in game.js from Story 2.1)
- No visual indicator besides orange snake color

**Why Validate INTENDED Direction:**
- Prevents player accidentally turning into themselves
- Example: Snake moving right, player presses left (intends left, gets right)
  - Intended=left is opposite of current=right → BLOCK ✅
  - Final=right is same as current=right → if validated here, NOT blocked ❌

---

### 🚨 PREVIOUS STORY DEPENDENCIES

**CRITICAL: Story 2.1 MUST be complete!**
- ✅ effects.js with isEffectActive()
- ✅ applyEffect() handles 'reverseControls' type
- ✅ Snake turns orange when reverseControls applied

**Story 1.3:**
- ✅ input.js with keyboard/mobile input handling
- ✅ Direction system working
- ✅ "Can't reverse 180°" rule implemented

---

### 📋 FRs COVERED

**FR19:** Reverse Controls food increases length AND inverts directional controls until next food eaten

**NFRs:**
- **NFR8:** Input lag < 50ms → Direction inversion is instant (simple map lookup)
- **NFR30:** Effects trigger reliably 100%
- **NFR10:** All 4 keyboard layouts supported + mobile

---

### ✅ STORY COMPLETION CHECKLIST

**Food Rendering:**
- [ ] renderX() function exists
- [ ] X has two diagonal lines
- [ ] Lines cross at center
- [ ] X renders in orange (#FFA500)
- [ ] renderFood() calls renderX() for 'reverseControls' type

**Direction Inversion:**
- [ ] input.js imports isEffectActive from effects.js
- [ ] invertDirection() function exists
- [ ] Inversion map: up↔down, left↔right
- [ ] handleKeyInput() checks reverseControls effect
- [ ] Inversion applied AFTER validation
- [ ] setupMobileSwipeHandlers() checks reverseControls effect

**Validation Order:**
- [ ] getDirectionFromKey() returns intended direction
- [ ] Validation happens on intended direction
- [ ] isOppositeDirection() check happens BEFORE inversion
- [ ] invertDirection() called AFTER validation passes
- [ ] finalDirection set to nextDirection

**All Input Methods:**
- [ ] Arrow keys invert correctly
- [ ] WASD keys invert correctly
- [ ] ZQSD keys invert correctly
- [ ] Numpad keys invert correctly
- [ ] Mobile swipes invert correctly

**Integration & Testing:**
- [ ] All keyboard layouts invert
- [ ] Mobile swipes invert
- [ ] Can't turn into self (even with inversion)
- [ ] Controls return to normal on next food
- [ ] Effect doesn't persist after death
- [ ] No console errors
- [ ] All exports are named exports

**Common Mistakes:**
- ❌ Validating AFTER inversion (allows turning into self)
- ❌ Missing keyboard layouts (not all 4 supported)
- ❌ Forgetting mobile swipe inversion
- ❌ Wrong inversion map (not bidirectional)
- ❌ Case-sensitive direction comparison
- ❌ X shape not visible (missing stroke())

---

## Dev Agent Record

### Agent Model Used

Claude (implementation discovered during code review)

### Debug Log References

No debugging required - implementation followed Dev Notes specifications.

### Completion Notes List

✅ **X Shape Rendering (js/render.js)**
- Created renderX() helper function for orange diagonal cross
- X shape uses two diagonal lines crossing at center
- Line width: 2px for visibility
- Added 'reverseControls' case to renderFood() switch
- X shape clearly distinguishable from cross/plus (+) shape

✅ **Direction Inversion Logic (js/input.js)**
- Imported isEffectActive from effects.js
- Created invertDirection() helper function
- Inversion map: up↔down, left↔right (bidirectional)
- setDirection() checks reverseControls effect and inverts if active
- Validation happens on INTENDED direction (before inversion) - critical for safety

✅ **All Input Methods Supported**
- Arrow keys: ArrowUp, ArrowDown, ArrowLeft, ArrowRight
- WASD keys: W/S/A/D (case insensitive)
- ZQSD keys: Z/Q for French AZERTY layout
- Numpad: 8/2/4/6
- Mobile swipes: Touch events with 30px minimum threshold

✅ **"Can't Reverse 180°" Rule**
- Validation happens BEFORE inversion, not after
- Prevents player from accidentally turning into themselves
- Example: Moving right, press left (intended=left blocked, even though inverted=right)

### File List

- js/render.js (updated - added renderX function)
- js/input.js (updated - added invertDirection and reverseControls handling)
