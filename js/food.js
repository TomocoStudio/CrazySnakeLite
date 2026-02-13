// CrazySnakeLite - Food Spawning Module
import { CONFIG } from './config.js';
import { getBlinkingProbability } from './progression.js';

/**
 * Spawn food at random empty position
 * Ensures food never spawns on snake
 * UPDATED in Story 2.6: Use probability-based food type selection
 */
export function spawnFood(gameState) {
  const snake = gameState.snake;
  let position;
  let attempts = 0;
  const maxAttempts = 1000;

  do {
    position = {
      x: Math.floor(Math.random() * CONFIG.GRID_WIDTH),
      y: Math.floor(Math.random() * CONFIG.GRID_HEIGHT)
    };
    attempts++;
  } while (isPositionOnSnake(position, snake) && attempts < maxAttempts);

  if (attempts >= maxAttempts) {
    position = findFirstEmptyPosition(gameState);
  }

  const foodType = selectFoodType();  // Story 2.6: Use probability-based selection

  // Story 8.2: Calculate blinking probability based on current score
  const blinkingProbability = getBlinkingProbability(gameState.score);
  const shouldBlink = Math.random() < blinkingProbability;

  gameState.food.position = position;
  gameState.food.type = foodType;  // Always set type (used by render.js for non-blinking)
  gameState.food.isBlinking = shouldBlink;
  gameState.food.hiddenType = shouldBlink ? foodType : null;  // Lock effect type if blinking

  // Story 8.6: Track blinking food spawn in analytics (opportunity metric)
  if (shouldBlink) {
    gameState.analyticsState.totalBlinkingFoodsSpawned += 1;
  }
}

/**
 * Check if position is occupied by snake
 */
function isPositionOnSnake(position, snake) {
  return snake.segments.some(segment =>
    segment.x === position.x && segment.y === position.y
  );
}

/**
 * Find first empty grid position (fallback)
 */
function findFirstEmptyPosition(gameState) {
  const snake = gameState.snake;

  for (let y = 0; y < CONFIG.GRID_HEIGHT; y++) {
    for (let x = 0; x < CONFIG.GRID_WIDTH; x++) {
      const pos = { x, y };
      if (!isPositionOnSnake(pos, snake)) {
        return pos;
      }
    }
  }

  return { x: 0, y: 0 };
}

/**
 * Select food type based on probability distribution
 * NEW in Story 2.6
 * Uses cumulative probability algorithm for weighted random selection
 * @returns {string} - Food type string ('growing', 'invincibility', etc.)
 */
function selectFoodType() {
  const probabilities = CONFIG.FOOD_PROBABILITIES;
  const random = Math.random() * 100;  // 0-100 range

  let cumulative = 0;

  // Iterate through probabilities and select based on random roll
  for (const [foodType, probability] of Object.entries(probabilities)) {
    cumulative += probability;
    if (random < cumulative) {
      return foodType;
    }
  }

  // Fallback (should never reach here if probabilities sum to 100)
  return 'growing';
}
