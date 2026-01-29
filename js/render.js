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

  ctx.fillStyle = snakeColor;

  snake.segments.forEach((segment, index) => {
    const x = segment.x * CONFIG.UNIT_SIZE;
    const y = segment.y * CONFIG.UNIT_SIZE;

    // Draw segment
    ctx.fillRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);

    // Head distinction: white border on first segment (head at index 0)
    if (index === 0) {
      ctx.strokeStyle = CONFIG.HEAD_BORDER_COLOR;
      ctx.lineWidth = CONFIG.HEAD_BORDER_WIDTH;
      ctx.strokeRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);
    }
  });
}

/**
 * Render food with shape based on type
 * UPDATED in Story 2.2: Add star shape for invincibility
 */
function renderFood(ctx, food) {
  if (!food.position) {
    return;
  }

  const x = food.position.x * CONFIG.UNIT_SIZE;
  const y = food.position.y * CONFIG.UNIT_SIZE;
  const foodSize = CONFIG.FOOD_SIZE;

  // Center point for shapes
  const centerX = x + CONFIG.UNIT_SIZE / 2;
  const centerY = y + CONFIG.UNIT_SIZE / 2;

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

  // Render shape based on food type
  switch (food.type) {
    case 'growing':
      // Filled square
      const offset = (CONFIG.UNIT_SIZE - foodSize) / 2;
      ctx.fillRect(x + offset, y + offset, foodSize, foodSize);
      break;

    case 'invincibility':
      // 4-point star (Story 2.2)
      renderStar(ctx, centerX, centerY, foodSize);
      break;

    case 'wallPhase':
      // Ring/donut (Story 2.3)
      renderRing(ctx, centerX, centerY, foodSize);
      break;

    case 'speedBoost':
      // Red cross/plus (NEW in Story 2.4)
      renderCross(ctx, centerX, centerY, foodSize);
      break;

    case 'speedDecrease':
      // Cyan hollow square (Story 2.4)
      renderHollowSquare(ctx, centerX, centerY, foodSize);
      break;

    case 'reverseControls':
      // Orange X (NEW in Story 2.5)
      renderX(ctx, centerX, centerY, foodSize);
      break;

    // Other shapes in later stories
    default:
      const defaultOffset = (CONFIG.UNIT_SIZE - foodSize) / 2;
      ctx.fillRect(x + defaultOffset, y + defaultOffset, foodSize, foodSize);
  }
}

/**
 * Render 4-point star shape
 * NEW in Story 2.2
 */
function renderStar(ctx, centerX, centerY, size) {
  const outerRadius = size / 2;           // 5px
  const innerRadius = outerRadius * 0.4;  // 2px
  const points = 4;                       // 4-point star

  ctx.beginPath();

  for (let i = 0; i < points * 2; i++) {
    // Rotate -90° so first point is at top
    const angle = (Math.PI / points) * i - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    const px = centerX + Math.cos(angle) * radius;
    const py = centerY + Math.sin(angle) * radius;

    if (i === 0) {
      ctx.moveTo(px, py);
    } else {
      ctx.lineTo(px, py);
    }
  }

  ctx.closePath();
  ctx.fill();
}

/**
 * Render ring/donut shape (hollow circle)
 * NEW in Story 2.3
 */
function renderRing(ctx, centerX, centerY, size) {
  const radius = size / 2 - 0.5;  // 4.5px radius (fits in 10x10 with margin)

  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.lineWidth = 2;  // 2px stroke width
  ctx.stroke();
}

/**
 * Render cross/plus shape (+)
 * NEW in Story 2.4
 */
function renderCross(ctx, centerX, centerY, size) {
  const barWidth = 2;  // 2px wide bars
  const barLength = size;  // Full size

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
 */
function renderHollowSquare(ctx, centerX, centerY, size) {
  const squareSize = size - 1;  // Slightly smaller for margin

  ctx.lineWidth = 2;  // 2px stroke width - must be set BEFORE strokeRect
  ctx.strokeRect(
    centerX - squareSize / 2,
    centerY - squareSize / 2,
    squareSize,
    squareSize
  );
}

/**
 * Render X shape (diagonal cross)
 * NEW in Story 2.5
 */
function renderX(ctx, centerX, centerY, size) {
  const halfSize = size / 2;

  ctx.lineWidth = 2;
  ctx.beginPath();

  // Diagonal line from top-left to bottom-right
  ctx.moveTo(centerX - halfSize, centerY - halfSize);
  ctx.lineTo(centerX + halfSize, centerY + halfSize);

  // Diagonal line from top-right to bottom-left
  ctx.moveTo(centerX + halfSize, centerY - halfSize);
  ctx.lineTo(centerX - halfSize, centerY + halfSize);

  ctx.stroke();
}
