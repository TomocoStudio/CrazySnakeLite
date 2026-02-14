// CrazySnakeLite - Rendering Module
import { CONFIG } from './config.js';
import { isEffectActive } from './effects.js';
import { isComboActive } from './combo.js';

/**
 * Main render function - called every frame (60 FPS)
 */
export function render(ctx, gameState) {
  clearCanvas(ctx, gameState);
  renderGrid(ctx, gameState);
  renderFood(ctx, gameState.food);
  renderSnake(ctx, gameState);  // Pass full gameState for strobe effect
  // Epic 4: renderScore()
}

/**
 * Clears the canvas
 * Combo mode: Inverted background color (darker)
 */
function clearCanvas(ctx, gameState) {
  // Combo mode: Use darker background (216, 216, 216)
  // Normal mode: Use lighter background (232, 232, 232)
  ctx.fillStyle = isComboActive(gameState)
    ? CONFIG.COLORS.comboBackground
    : CONFIG.COLORS.background;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * Renders subtle grid lines
 * Combo mode: Inverted grid color (lighter)
 */
function renderGrid(ctx, gameState) {
  // Combo mode: Use lighter grid (232, 232, 232)
  // Normal mode: Use darker grid (216, 216, 216)
  ctx.strokeStyle = isComboActive(gameState)
    ? CONFIG.COLORS.comboGridLine
    : CONFIG.COLORS.gridLine;
  ctx.lineWidth = CONFIG.GRID_LINE_WIDTH;
  ctx.globalAlpha = CONFIG.GRID_LINE_OPACITY;

  // Vertical lines
  for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
    const xPos = x * CONFIG.UNIT_SIZE;
    ctx.beginPath();
    ctx.moveTo(xPos, 0);
    ctx.lineTo(xPos, ctx.canvas.height);
    ctx.stroke();
  }

  // Horizontal lines
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
 * Renders the snake with head/body distinction
 * UPDATED in Story 2.2: Add invincibility strobe (yellow ↔ black)
 * UPDATED in Story 5-4: Add white eyes to head, subtle border color, directional eyes
 * UPDATED in Story 10.3: Add striped pattern during combo mode (Effect A/B alternating)
 */
function renderSnake(ctx, gameState) {
  const snake = gameState.snake;

  // Story 10.3: Check if combo mode with striped pattern active
  const isStriped = gameState.combo.active && gameState.combo.effectB !== null;

  if (isStriped) {
    // Render striped snake (alternating Effect A/Effect B colors)
    const colorA = getEffectColor(gameState.combo.effectA.type);
    const colorB = getEffectColor(gameState.combo.effectB.type);

    snake.segments.forEach((segment, index) => {
      const x = segment.x * CONFIG.UNIT_SIZE;
      const y = segment.y * CONFIG.UNIT_SIZE;

      // Determine color: head (0) = effectB, odd = effectA, even = effectB
      let color;
      if (index === 0) {
        color = colorB; // Head is Effect B (most recent)
      } else if (index % 2 === 1) {
        color = colorA; // Odd segments
      } else {
        color = colorB; // Even segments
      }

      // Draw segment
      ctx.fillStyle = color;
      ctx.fillRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);

      // Add 1px black border for visual separation (Story 10.3)
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);

      // Head distinction: eyes on first segment
      if (index === 0) {
        renderSnakeEyes(ctx, x, y, snake.direction);
      }
    });
  } else {
    // Normal single-color rendering
    let snakeColor = snake.color;

    // INVINCIBILITY STROBE: Alternate yellow/black every 100ms
    if (isEffectActive(gameState, 'invincibility')) {
      const strobeInterval = CONFIG.STROBE_INTERVAL;  // 100ms
      const strobePhase = Math.floor(performance.now() / strobeInterval) % 2;

      if (strobePhase === 0) {
        snakeColor = CONFIG.COLORS.snakeInvincibility;  // Yellow
      } else {
        snakeColor = CONFIG.COLORS.snakeDefault;  // Black (base color)
      }
    }

    snake.segments.forEach((segment, index) => {
      const x = segment.x * CONFIG.UNIT_SIZE;
      const y = segment.y * CONFIG.UNIT_SIZE;

      // Draw segment with snake color
      ctx.fillStyle = snakeColor;
      ctx.fillRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);

      // Head distinction: border + eyes on first segment (head at index 0)
      if (index === 0) {
        // Subtle border (matches grid background)
        ctx.strokeStyle = CONFIG.HEAD_BORDER_COLOR;
        ctx.lineWidth = CONFIG.HEAD_BORDER_WIDTH;
        ctx.strokeRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);

        // White eyes that rotate with direction (Story 5-4)
        renderSnakeEyes(ctx, x, y, snake.direction);
      }
    });
  }
}

/**
 * Get color for a food effect type (Story 10.3)
 * Used for striped snake rendering during combo mode
 * @param {string} effectType - Effect type (e.g., 'speedBoost')
 * @returns {string} Hex color
 */
function getEffectColor(effectType) {
  const colors = {
    growing: CONFIG.COLORS.foodGrowing,           // Green
    invincibility: CONFIG.COLORS.foodInvincibility, // Yellow
    wallPhase: CONFIG.COLORS.foodWallPhase,       // Purple
    speedBoost: CONFIG.COLORS.foodSpeedBoost,     // Red
    speedDecrease: CONFIG.COLORS.foodSpeedDecrease, // Cyan
    reverseControls: CONFIG.COLORS.foodReverseControls // Orange
  };
  return colors[effectType] || CONFIG.COLORS.foodGrowing;
}

/**
 * Render white eyes on snake head that rotate with direction
 * Story 5-4: Improve head visibility and add personality
 * Eyes face the direction of movement (right/left/up/down)
 */
function renderSnakeEyes(ctx, headX, headY, direction) {
  const eyeRadius = 2.5;  // 2.5px radius
  const eyeSpacing = 8;   // 8px apart (center to center)

  const centerX = headX + CONFIG.UNIT_SIZE / 2;
  const centerY = headY + CONFIG.UNIT_SIZE / 2;

  let eye1X, eye1Y, eye2X, eye2Y;

  // Position eyes based on direction
  switch (direction) {
    case 'right':
      // Eyes horizontal, looking right (upper third of head)
      eye1X = centerX - eyeSpacing / 2;
      eye2X = centerX + eyeSpacing / 2;
      eye1Y = eye2Y = headY + CONFIG.UNIT_SIZE / 3;
      break;

    case 'left':
      // Eyes horizontal, looking left (upper third of head)
      eye1X = centerX - eyeSpacing / 2;
      eye2X = centerX + eyeSpacing / 2;
      eye1Y = eye2Y = headY + CONFIG.UNIT_SIZE / 3;
      break;

    case 'up':
      // Eyes vertical, looking up (left third of head)
      eye1Y = centerY - eyeSpacing / 2;
      eye2Y = centerY + eyeSpacing / 2;
      eye1X = eye2X = headX + CONFIG.UNIT_SIZE / 3;
      break;

    case 'down':
      // Eyes vertical, looking down (left third of head)
      eye1Y = centerY - eyeSpacing / 2;
      eye2Y = centerY + eyeSpacing / 2;
      eye1X = eye2X = headX + CONFIG.UNIT_SIZE / 3;
      break;

    default:
      // Default to right
      eye1X = centerX - eyeSpacing / 2;
      eye2X = centerX + eyeSpacing / 2;
      eye1Y = eye2Y = headY + CONFIG.UNIT_SIZE / 3;
  }

  // Draw white eyes
  ctx.fillStyle = '#FFFFFF';

  // Eye 1
  ctx.beginPath();
  ctx.arc(eye1X, eye1Y, eyeRadius, 0, Math.PI * 2);
  ctx.fill();

  // Eye 2
  ctx.beginPath();
  ctx.arc(eye2X, eye2Y, eyeRadius, 0, Math.PI * 2);
  ctx.fill();
}

/**
 * Render food with uniform square shape
 * Story 5-3: All food types render as squares for better visibility
 * Story 8.1: Blinking food cycles through colors at 200ms per color
 * Story 8.5: Reduced motion mode uses alpha pulsing instead of rapid cycling
 * Color-coding preserved for effect identification
 */
function renderFood(ctx, food) {
  if (!food.position) {
    return;
  }

  const x = food.position.x * CONFIG.UNIT_SIZE;
  const y = food.position.y * CONFIG.UNIT_SIZE;
  const foodSize = CONFIG.FOOD_SIZE;

  let color;
  let alpha = 1.0;

  // Story 8.1 + 8.5: Blinking food with accessibility support
  if (food.isBlinking) {
    if (CONFIG.REDUCED_MOTION) {
      // REDUCED MOTION: Alpha pulsing with hidden color (accessibility)
      const colorMap = {
        growing: CONFIG.COLORS.foodGrowing,
        invincibility: CONFIG.COLORS.foodInvincibility,
        wallPhase: CONFIG.COLORS.foodWallPhase,
        speedBoost: CONFIG.COLORS.foodSpeedBoost,
        speedDecrease: CONFIG.COLORS.foodSpeedDecrease,
        reverseControls: CONFIG.COLORS.foodReverseControls
      };
      color = colorMap[food.hiddenType] || CONFIG.COLORS.foodGrowing;

      // Calculate pulsing alpha (50% to 100%) using sine wave
      const time = Date.now();
      alpha = CONFIG.ALPHA_PULSE.min +
              (CONFIG.ALPHA_PULSE.max - CONFIG.ALPHA_PULSE.min) *
              (0.5 + 0.5 * Math.sin(time / CONFIG.ALPHA_PULSE.frequency));
    } else {
      // NORMAL MODE: Rapid color cycling
      const now = Date.now();
      const cycleIndex = Math.floor(now / CONFIG.BLINK_CYCLE_DURATION) % CONFIG.BLINK_SEQUENCE.length;
      color = CONFIG.BLINK_SEQUENCE[cycleIndex];
    }
  } else {
    // Normal food: use food.type to determine color
    const colorMap = {
      growing: CONFIG.COLORS.foodGrowing,
      invincibility: CONFIG.COLORS.foodInvincibility,
      wallPhase: CONFIG.COLORS.foodWallPhase,
      speedBoost: CONFIG.COLORS.foodSpeedBoost,
      speedDecrease: CONFIG.COLORS.foodSpeedDecrease,
      reverseControls: CONFIG.COLORS.foodReverseControls
    };
    color = colorMap[food.type] || CONFIG.COLORS.foodGrowing;
  }

  // Apply alpha (for reduced motion pulsing)
  ctx.globalAlpha = alpha;

  ctx.fillStyle = color;

  // All food types render as filled squares (Story 5-3)
  const offset = (CONFIG.UNIT_SIZE - foodSize) / 2;
  ctx.fillRect(x + offset, y + offset, foodSize, foodSize);

  // Reset global alpha
  ctx.globalAlpha = 1.0;
}

// Story 5-3: Custom shape functions removed - all food now renders as squares for improved visibility
