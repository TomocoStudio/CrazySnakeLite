// CrazySnakeLite - Collision Detection Module
import { CONFIG } from './config.js';
import { isEffectActive } from './effects.js';

/**
 * Check if snake head collides with food
 * Head is at segments[0] (first element)
 */
export function checkFoodCollision(gameState) {
  const head = gameState.snake.segments[0];
  const food = gameState.food.position;

  if (!food) {
    return false;
  }

  return head.x === food.x && head.y === food.y;
}

/**
 * Check if snake head hits wall boundaries
 * UPDATED in Story 2.2: Skip death if invincibility active
 * UPDATED in Story 2.3: Skip death if wall-phase active (wrapping happens in snake.js)
 * Head is at segments[0] (first element)
 */
export function checkWallCollision(gameState) {
  const head = gameState.snake.segments[0];

  // CRITICAL: Skip collision if invincibility active (Story 2.2)
  if (isEffectActive(gameState, 'invincibility')) {
    return false;  // No death
  }

  // CRITICAL: Skip collision if wall-phase active (Story 2.3)
  // Note: Wrapping happens in snake.js moveSnake(), not here
  if (isEffectActive(gameState, 'wallPhase')) {
    return false;  // No death, wrapping happens elsewhere
  }

  if (head.x < 0 || head.x >= CONFIG.GRID_WIDTH) {
    return true;
  }

  if (head.y < 0 || head.y >= CONFIG.GRID_HEIGHT) {
    return true;
  }

  return false;
}

/**
 * Check if snake head collides with its own body
 * UPDATED in Story 2.2: Skip death if invincibility active
 * Head is at segments[0] (first element)
 */
export function checkSelfCollision(gameState) {
  const segments = gameState.snake.segments;
  const head = segments[0];

  // CRITICAL: Skip collision if invincibility active
  if (isEffectActive(gameState, 'invincibility')) {
    return false;  // No death
  }

  // Check if head matches any body segment (exclude head itself at index 0)
  for (let i = 1; i < segments.length; i++) {
    const segment = segments[i];
    if (head.x === segment.x && head.y === segment.y) {
      return true;
    }
  }

  return false;
}
