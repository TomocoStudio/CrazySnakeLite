// CrazySnakeLite - Rendering Module
import { CONFIG } from './config.js';
import { isEffectActive } from './effects.js';
import { isComboActive } from './combo.js';
import { getState as getProgressionState } from './progression.js';  // Story 19.3: Get glow intensity, Story 20.3: Get grid opacity

// Story 21.5: Offscreen canvas cache for grid intersection dots (1000x performance gain)
// Instead of drawing 546 dots per frame (1,092 operations), we draw once and blit (1 operation)
let gridDotsCache = null;           // Cached offscreen canvas with pre-rendered dots
let gridDotsCacheValid = false;     // Cache invalidation flag (set false on canvas resize)

/**
 * Main render function - called every frame (60 FPS)
 */
export function render(ctx, gameState) {
  clearCanvas(ctx, gameState);
  renderGrid(ctx, gameState);
  renderGridDots(ctx, gameState);  // Story 21.5: Spatial anchor points (offscreen cached)
  renderFood(ctx, gameState);  // Story 19.3: Pass full gameState for glow intensity
  renderSnake(ctx, gameState);  // Pass full gameState for strobe effect
  // Epic 4: renderScore()
}

/**
 * Clears the canvas to transparent
 * Story 20.2: CSS/Canvas hybrid rendering - CSS handles background, canvas is transparent
 * Removed fillRect for background color (breaks GPU optimization and prevents CSS transitions)
 */
function clearCanvas(ctx, gameState) {
  // Clear to transparent - CSS background-color shows through
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  // Note: Background color (including combo mode) now handled by CSS via game.js updateCanvasBackground()
}

/**
 * Renders subtle grid lines with progressive opacity dimming
 * Story 20.3: Grid fades from 0.9 (tier-0) to 0.3 (tier-5) as score increases
 * Combo mode: Inverted grid color (lighter)
 */
function renderGrid(ctx, gameState) {
  // Story 20.3: Get progressive grid opacity (0.9 → 0.3)
  const { gridOpacity } = getProgressionState(gameState.score);

  // Combo mode: Use lighter grid (232, 232, 232)
  // Normal mode: Use darker grid (216, 216, 216)
  ctx.strokeStyle = isComboActive(gameState)
    ? CONFIG.COLORS.comboGridLine
    : CONFIG.COLORS.gridLine;
  ctx.lineWidth = CONFIG.GRID_LINE_WIDTH;

  // Story 20.3: Apply progressive opacity (affects all grid drawing)
  ctx.globalAlpha = gridOpacity;

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

  // CRITICAL: Reset globalAlpha to prevent opacity bleed to other rendering
  ctx.globalAlpha = 1.0;
}

/**
 * Generate offscreen canvas with pre-rendered grid intersection dots (Story 21.5)
 * Called once and cached - provides 1000x performance gain over per-frame dot rendering
 * @param {number} canvasWidth - Main canvas width
 * @param {number} canvasHeight - Main canvas height
 * @returns {HTMLCanvasElement} Offscreen canvas with white dots at all grid intersections
 */
function generateGridDotsCache(canvasWidth, canvasHeight) {
  // Create offscreen canvas matching main canvas dimensions
  const offscreenCanvas = document.createElement('canvas');
  offscreenCanvas.width = canvasWidth;
  offscreenCanvas.height = canvasHeight;
  const offscreenCtx = offscreenCanvas.getContext('2d');

  // Draw dots at all grid line intersections
  // (GRID_WIDTH + 1) vertical lines × (GRID_HEIGHT + 1) horizontal lines
  // = (20 + 1) × (25 + 1) = 21 × 26 = 546 intersection points
  offscreenCtx.fillStyle = '#FFFFFF';  // White dots

  for (let x = 0; x <= CONFIG.GRID_WIDTH; x++) {
    for (let y = 0; y <= CONFIG.GRID_HEIGHT; y++) {
      const xPos = x * CONFIG.UNIT_SIZE;
      const yPos = y * CONFIG.UNIT_SIZE;

      offscreenCtx.beginPath();
      offscreenCtx.arc(xPos, yPos, CONFIG.GRID_DOT_RADIUS, 0, Math.PI * 2);
      offscreenCtx.fill();
    }
  }

  return offscreenCanvas;
}

/**
 * Render grid intersection dots with progressive opacity (Story 21.5)
 * Uses offscreen canvas caching for 1000x performance gain
 * - Without caching: 546 dots × 2 operations/dot = 1,092 operations per frame
 * - With caching: 1 operation per frame (drawImage blit)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} gameState - Current game state (for score-based opacity)
 */
function renderGridDots(ctx, gameState) {
  // Feature flag: Skip if disabled
  if (!CONFIG.GRID_DOTS_ENABLED) {
    return;
  }

  // Get progressive dot opacity from progression system (Story 19.1)
  // Dots emerge at score 50 and intensify as grid fades
  const dotOpacity = CONFIG.GRID_DOT_OPACITY_THRESHOLDS.find(
    threshold => gameState.score >= threshold.minScore && gameState.score <= threshold.maxScore
  )?.opacity || 0;

  // Early exit if dots not visible yet (score < 50)
  if (dotOpacity === 0) {
    return;
  }

  // Generate cache if not yet created or invalidated (e.g., canvas resize)
  if (!gridDotsCache || !gridDotsCacheValid) {
    gridDotsCache = generateGridDotsCache(ctx.canvas.width, ctx.canvas.height);
    gridDotsCacheValid = true;
  }

  // Blit cached dot canvas with progressive opacity (1 operation vs 1,092)
  ctx.globalAlpha = dotOpacity;
  ctx.drawImage(gridDotsCache, 0, 0);
  ctx.globalAlpha = 1.0;  // CRITICAL: Reset to prevent opacity bleed
}

/**
 * Invalidate grid dots cache (Story 21.5)
 * Call this when canvas is resized to regenerate dot positions
 * Export for use by game initialization/resize handlers
 */
export function invalidateGridDotsCache() {
  gridDotsCacheValid = false;
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

  // Story 21.1: Check if body outline needed for dark backgrounds (score >= 50)
  const needsOutline = gameState.score >= CONFIG.SNAKE_DARK_OUTLINE_SCORE;

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

      // Draw segment with glow effect - white glow for black segments
      const glowColor = color === '#000000' ? '#FFFFFF' : color;
      withShadow(ctx, { color: glowColor, blur: 6 }, (ctx) => {
        ctx.fillStyle = color;
        ctx.fillRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);

        // Add 1px border - white when snake is black, black otherwise (visibility on dark background)
        ctx.strokeStyle = color === '#000000' ? '#FFFFFF' : '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);

        // Story 21.1: Add light outline on dark backgrounds (score >= 50)
        if (needsOutline) {
          ctx.strokeStyle = CONFIG.SNAKE_DARK_OUTLINE_COLOR;
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);
        }
      });

      // Head distinction: eyes, pupils, and reflection on first segment (Story 21.1)
      if (index === 0) {
        renderSnakeHead(ctx, x, y, snake.direction);
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

      // Draw segment with glow effect - white glow for black snake
      const glowColor = snakeColor === '#000000' ? '#FFFFFF' : snakeColor;
      withShadow(ctx, { color: glowColor, blur: 6 }, (ctx) => {
        ctx.fillStyle = snakeColor;
        ctx.fillRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);

        // Crisp 1px border - white when snake is black, black otherwise (visibility on dark background)
        ctx.strokeStyle = snakeColor === '#000000' ? '#FFFFFF' : '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);

        // Story 21.1: Add light outline on dark backgrounds (score >= 50)
        if (needsOutline) {
          ctx.strokeStyle = CONFIG.SNAKE_DARK_OUTLINE_COLOR;
          ctx.lineWidth = 1;
          ctx.strokeRect(x, y, CONFIG.UNIT_SIZE, CONFIG.UNIT_SIZE);
        }
      });

      // Head distinction: eyes, pupils, and reflection (drawn after shadow for crisp details)
      if (index === 0) {
        renderSnakeHead(ctx, x, y, snake.direction);
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
 * Render snake head with eyes, directional pupils, and top-light reflection
 * Story 5-4: White eyes that rotate with direction
 * Story 21.1: Directional pupils + top-light reflection (Mega Man technique)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} headX - Head segment top-left x coordinate
 * @param {number} headY - Head segment top-left y coordinate
 * @param {string} direction - Movement direction ('up', 'down', 'left', 'right')
 */
function renderSnakeHead(ctx, headX, headY, direction) {
  const eyeRadius = 2.5;  // 2.5px radius for white eyes
  const eyeSpacing = 8;   // 8px apart (center to center)
  const pupilRadius = 1.5;  // 1.5px radius for black pupils
  const pupilOffset = 1.5;  // Offset toward movement direction

  const centerX = headX + CONFIG.UNIT_SIZE / 2;
  const centerY = headY + CONFIG.UNIT_SIZE / 2;

  let eye1X, eye1Y, eye2X, eye2Y;
  let pupilDx = 0, pupilDy = 0;

  // Position eyes based on direction
  switch (direction) {
    case 'right':
      // Eyes horizontal, looking right (upper third of head)
      eye1X = centerX - eyeSpacing / 2;
      eye2X = centerX + eyeSpacing / 2;
      eye1Y = eye2Y = headY + CONFIG.UNIT_SIZE / 3;
      pupilDx = pupilOffset;  // Pupils look right
      break;

    case 'left':
      // Eyes horizontal, looking left (upper third of head)
      eye1X = centerX - eyeSpacing / 2;
      eye2X = centerX + eyeSpacing / 2;
      eye1Y = eye2Y = headY + CONFIG.UNIT_SIZE / 3;
      pupilDx = -pupilOffset;  // Pupils look left
      break;

    case 'up':
      // Eyes vertical, looking up (left third of head)
      eye1Y = centerY - eyeSpacing / 2;
      eye2Y = centerY + eyeSpacing / 2;
      eye1X = eye2X = headX + CONFIG.UNIT_SIZE / 3;
      pupilDy = -pupilOffset;  // Pupils look up
      break;

    case 'down':
      // Eyes vertical, looking down (left third of head)
      eye1Y = centerY - eyeSpacing / 2;
      eye2Y = centerY + eyeSpacing / 2;
      eye1X = eye2X = headX + CONFIG.UNIT_SIZE / 3;
      pupilDy = pupilOffset;  // Pupils look down
      break;

    default:
      // Default to right
      eye1X = centerX - eyeSpacing / 2;
      eye2X = centerX + eyeSpacing / 2;
      eye1Y = eye2Y = headY + CONFIG.UNIT_SIZE / 3;
      pupilDx = pupilOffset;
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

  // Draw black pupils offset toward movement direction (Story 21.1)
  ctx.fillStyle = '#000000';

  // Pupil 1
  ctx.beginPath();
  ctx.arc(eye1X + pupilDx, eye1Y + pupilDy, pupilRadius, 0, Math.PI * 2);
  ctx.fill();

  // Pupil 2
  ctx.beginPath();
  ctx.arc(eye2X + pupilDx, eye2Y + pupilDy, pupilRadius, 0, Math.PI * 2);
  ctx.fill();

  // Draw top-light reflection on leading edge (Story 21.1 - Mega Man technique)
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;

  switch (direction) {
    case 'right':
      // Highlight right edge
      ctx.beginPath();
      ctx.moveTo(headX + CONFIG.UNIT_SIZE - 0.5, headY + 2);
      ctx.lineTo(headX + CONFIG.UNIT_SIZE - 0.5, headY + CONFIG.UNIT_SIZE - 2);
      ctx.stroke();
      break;

    case 'left':
      // Highlight left edge
      ctx.beginPath();
      ctx.moveTo(headX + 0.5, headY + 2);
      ctx.lineTo(headX + 0.5, headY + CONFIG.UNIT_SIZE - 2);
      ctx.stroke();
      break;

    case 'up':
      // Highlight top edge
      ctx.beginPath();
      ctx.moveTo(headX + 2, headY + 0.5);
      ctx.lineTo(headX + CONFIG.UNIT_SIZE - 2, headY + 0.5);
      ctx.stroke();
      break;

    case 'down':
      // Highlight bottom edge
      ctx.beginPath();
      ctx.moveTo(headX + 2, headY + CONFIG.UNIT_SIZE - 0.5);
      ctx.lineTo(headX + CONFIG.UNIT_SIZE - 2, headY + CONFIG.UNIT_SIZE - 0.5);
      ctx.stroke();
      break;
  }

  // Reset stroke style to prevent bleed
  ctx.strokeStyle = 'transparent';
}

/**
 * Defensive rendering pattern - guarantees canvas shadow cleanup
 * Story 19.4 - Enhancement: Defensive Rendering with Auto-Cleanup
 * Uses try/finally to ensure shadow properties are ALWAYS reset, even if drawFn throws
 *
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {Object} shadowConfig - { color: string, blur: number }
 * @param {Function} drawFn - Drawing function to execute with shadow
 */
function withShadow(ctx, shadowConfig, drawFn) {
  const { color, blur } = shadowConfig;

  // Apply shadow properties
  ctx.shadowColor = color;
  ctx.shadowBlur = blur;
  ctx.shadowOffsetX = 0;  // Symmetrical halo (not directional shadow)
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

/**
 * Render distinctive shape for food type
 * Story 19.2 - Enhancement 2: Six Distinctive Food Shapes
 * Each food type has a unique pixel-art shape for instant recognition
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {number} x - Top-left x coordinate
 * @param {number} y - Top-left y coordinate
 * @param {string} type - Food type (growing, invincibility, wallPhase, etc.)
 * @param {string} color - Fill color
 * @param {string} outlineColor - Outline color (darker variant)
 */
function renderFoodShape(ctx, x, y, type, color, outlineColor) {
  const cx = x + CONFIG.UNIT_SIZE / 2;  // center x
  const cy = y + CONFIG.UNIT_SIZE / 2;  // center y

  ctx.fillStyle = color;
  ctx.strokeStyle = outlineColor;
  ctx.lineWidth = 1;

  switch (type) {
    case 'growing':
      // Filled square (12x12, centered)
      ctx.fillRect(cx - 6, cy - 6, 12, 12);
      ctx.strokeRect(cx - 6, cy - 6, 12, 12);
      break;

    case 'invincibility':
      // 4-point star (semantic: power-up)
      ctx.beginPath();
      ctx.moveTo(cx, cy - 7);          // top point
      ctx.lineTo(cx + 3, cy - 3);       // top-right inner
      ctx.lineTo(cx + 7, cy);           // right point
      ctx.lineTo(cx + 3, cy + 3);       // bottom-right inner
      ctx.lineTo(cx, cy + 7);           // bottom point
      ctx.lineTo(cx - 3, cy + 3);       // bottom-left inner
      ctx.lineTo(cx - 7, cy);           // left point
      ctx.lineTo(cx - 3, cy - 3);       // top-left inner
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      break;

    case 'wallPhase':
      // Hollow circle/ring (semantic: pass-through)
      ctx.beginPath();
      ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.stroke();
      // Outer outline
      ctx.beginPath();
      ctx.arc(cx, cy, 7.5, 0, Math.PI * 2);
      ctx.lineWidth = 1;
      ctx.strokeStyle = outlineColor;
      ctx.stroke();
      break;

    case 'speedBoost':
      // Cross / Plus (+)
      ctx.fillRect(cx - 2, cy - 7, 4, 14);  // vertical bar
      ctx.fillRect(cx - 7, cy - 2, 14, 4);  // horizontal bar
      ctx.strokeRect(cx - 2, cy - 7, 4, 14);
      ctx.strokeRect(cx - 7, cy - 2, 14, 4);
      break;

    case 'speedDecrease':
      // Hollow square
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.strokeRect(cx - 7, cy - 7, 14, 14);
      // Outer outline
      ctx.strokeStyle = outlineColor;
      ctx.lineWidth = 1;
      ctx.strokeRect(cx - 8, cy - 8, 16, 16);
      break;

    case 'reverseControls':
      // X shape (semantic: danger/reversal)
      // Main X in color
      ctx.lineWidth = 3;
      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - 6);
      ctx.lineTo(cx + 6, cy + 6);
      ctx.moveTo(cx + 6, cy - 6);
      ctx.lineTo(cx - 6, cy + 6);
      ctx.stroke();
      // Outline behind using composite operation
      ctx.lineWidth = 5;
      ctx.strokeStyle = outlineColor;
      ctx.globalCompositeOperation = 'destination-over';
      ctx.beginPath();
      ctx.moveTo(cx - 6, cy - 6);
      ctx.lineTo(cx + 6, cy + 6);
      ctx.moveTo(cx + 6, cy - 6);
      ctx.lineTo(cx - 6, cy + 6);
      ctx.stroke();
      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';
      break;
  }
}

/**
 * Render food with distinctive shapes and CRT glow
 * Story 5-3: All food types render as squares for better visibility
 * Story 8.1: Blinking food cycles through colors at 200ms per color
 * Story 8.5: Reduced motion mode uses alpha pulsing instead of rapid cycling
 * Story 19.2: Each food type now renders with unique shape (square, star, ring, cross, hollow square, X)
 * Story 19.3: Progressive CRT phosphor glow effect based on score
 * Color-coding preserved for effect identification
 */
function renderFood(ctx, gameState) {
  const food = gameState.food;

  if (!food.position) {
    return;
  }

  const x = food.position.x * CONFIG.UNIT_SIZE;
  const y = food.position.y * CONFIG.UNIT_SIZE;

  // Story 19.3: Get glow intensity from progression system
  const { glowIntensity } = getProgressionState(gameState.score);

  let color;
  let foodType;
  let alpha = 1.0;

  // Story 19.2: Food types array for blinking food cycle
  const foodTypes = ['growing', 'invincibility', 'wallPhase', 'speedBoost', 'speedDecrease', 'reverseControls'];

  // Story 8.1 + 8.5: Blinking food with accessibility support
  if (food.isBlinking) {
    if (CONFIG.REDUCED_MOTION) {
      // REDUCED MOTION: Alpha pulsing with hidden type (accessibility)
      foodType = food.hiddenType || 'growing';
      const colorMap = {
        growing: CONFIG.COLORS.foodGrowing,
        invincibility: CONFIG.COLORS.foodInvincibility,
        wallPhase: CONFIG.COLORS.foodWallPhase,
        speedBoost: CONFIG.COLORS.foodSpeedBoost,
        speedDecrease: CONFIG.COLORS.foodSpeedDecrease,
        reverseControls: CONFIG.COLORS.foodReverseControls
      };
      color = colorMap[foodType];

      // Calculate pulsing alpha (50% to 100%) using sine wave
      const time = Date.now();
      alpha = CONFIG.ALPHA_PULSE.min +
              (CONFIG.ALPHA_PULSE.max - CONFIG.ALPHA_PULSE.min) *
              (0.5 + 0.5 * Math.sin(time / CONFIG.ALPHA_PULSE.frequency));
    } else {
      // NORMAL MODE: Rapid color and shape cycling
      const now = Date.now();
      const cycleIndex = Math.floor(now / CONFIG.BLINK_CYCLE_DURATION) % CONFIG.BLINK_SEQUENCE.length;
      color = CONFIG.BLINK_SEQUENCE[cycleIndex];
      // Cycle through food types in sync with colors (Story 19.2)
      foodType = foodTypes[cycleIndex];
    }
  } else {
    // Normal food: use food.type
    foodType = food.type || 'growing';
    const colorMap = {
      growing: CONFIG.COLORS.foodGrowing,
      invincibility: CONFIG.COLORS.foodInvincibility,
      wallPhase: CONFIG.COLORS.foodWallPhase,
      speedBoost: CONFIG.COLORS.foodSpeedBoost,
      speedDecrease: CONFIG.COLORS.foodSpeedDecrease,
      reverseControls: CONFIG.COLORS.foodReverseControls
    };
    color = colorMap[foodType];
  }

  // Get outline color for the food type (Story 19.2)
  const outlineColorMap = {
    growing: CONFIG.COLORS.foodGrowingOutline,
    invincibility: CONFIG.COLORS.foodInvincibilityOutline,
    wallPhase: CONFIG.COLORS.foodWallPhaseOutline,
    speedBoost: CONFIG.COLORS.foodSpeedBoostOutline,
    speedDecrease: CONFIG.COLORS.foodSpeedDecreaseOutline,
    reverseControls: CONFIG.COLORS.foodReverseControlsOutline
  };
  const outlineColor = outlineColorMap[foodType] || CONFIG.COLORS.foodGrowingOutline;

  // Apply alpha (for reduced motion pulsing)
  ctx.globalAlpha = alpha;

  // Story 19.4: Use defensive rendering pattern for guaranteed shadow cleanup
  withShadow(ctx, { color, blur: glowIntensity }, (ctx) => {
    renderFoodShape(ctx, x, y, foodType, color, outlineColor);
  });

  // Reset global alpha
  ctx.globalAlpha = 1.0;
}
