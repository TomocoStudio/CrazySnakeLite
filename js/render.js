// CrazySnakeLite - Rendering Module
import { CONFIG } from './config.js';
import { isEffectActive } from './effects.js';

/**
 * Main render function - called every frame (60 FPS)
 */
export function render(ctx, gameState) {
  clearCanvas(ctx);
  renderGrid(ctx);
  renderFood(ctx, gameState.food);
  renderSnake(ctx, gameState);  // Pass full gameState for strobe effect
  // Epic 4: renderScore()
}

/**
 * Clears the canvas
 */
function clearCanvas(ctx) {
  ctx.fillStyle = CONFIG.COLORS.background;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * Renders subtle grid lines
 */
function renderGrid(ctx) {
  ctx.strokeStyle = CONFIG.COLORS.gridLine;
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
 */
function renderSnake(ctx, gameState) {
  const snake = gameState.snake;
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
 * Color-coding preserved for effect identification
 */
function renderFood(ctx, food) {
  if (!food.position) {
    return;
  }

  const x = food.position.x * CONFIG.UNIT_SIZE;
  const y = food.position.y * CONFIG.UNIT_SIZE;
  const foodSize = CONFIG.FOOD_SIZE;

  // Get food color from CONFIG
  const colorMap = {
    growing: CONFIG.COLORS.foodGrowing,
    invincibility: CONFIG.COLORS.foodInvincibility,
    wallPhase: CONFIG.COLORS.foodWallPhase,
    speedBoost: CONFIG.COLORS.foodSpeedBoost,
    speedDecrease: CONFIG.COLORS.foodSpeedDecrease,
    reverseControls: CONFIG.COLORS.foodReverseControls
  };

  ctx.fillStyle = colorMap[food.type] || CONFIG.COLORS.foodGrowing;

  // All food types render as filled squares (Story 5-3)
  const offset = (CONFIG.UNIT_SIZE - foodSize) / 2;
  ctx.fillRect(x + offset, y + offset, foodSize, foodSize);
}

// Story 5-3: Custom shape functions removed - all food now renders as squares for improved visibility
