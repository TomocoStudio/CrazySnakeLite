// CrazySnakeLite - Snake Movement Logic
import { CONFIG } from './config.js';
import { isEffectActive, clearEffect } from './effects.js';

/**
 * Move snake one step in current direction
 * Called every game tick (125ms)
 * UPDATED in Story 2.3: Add wall wrapping for wall-phase effect
 * Head is at segments[0] (first element)
 */
export function moveSnake(gameState) {
  const snake = gameState.snake;

  // Apply queued direction change
  snake.direction = snake.nextDirection;

  // Calculate new head position (head is at segments[0])
  const head = snake.segments[0];
  const newHead = getNewHeadPosition(head, snake.direction);

  // WALL WRAPPING for wall-phase and invincibility
  if (isEffectActive(gameState, 'wallPhase')) {
    const wrapped = wrapPosition(newHead);
    if (wrapped) {
      // Wall-phase was consumed (single-use)
      clearEffect(gameState);
    }
  } else if (isEffectActive(gameState, 'invincibility')) {
    // Invincibility also wraps (but doesn't consume the effect)
    wrapPosition(newHead);
  }

  // Add new head at the beginning
  snake.segments.unshift(newHead);

  // Remove tail from the end (unless growing - handled in food collision story)
  snake.segments.pop();
}

/**
 * Calculate new head position based on direction
 */
function getNewHeadPosition(head, direction) {
  const newHead = { x: head.x, y: head.y };

  switch (direction) {
    case 'up':
      newHead.y -= 1;
      break;
    case 'down':
      newHead.y += 1;
      break;
    case 'left':
      newHead.x -= 1;
      break;
    case 'right':
      newHead.x += 1;
      break;
  }

  return newHead;
}

/**
 * Get snake head position
 * Head is at segments[0] (first element)
 */
export function getSnakeHead(snake) {
  return snake.segments[0];
}

/**
 * Grow snake by one segment
 * Called when food is eaten (Story 1.4)
 * Tail is at segments[length-1] (last element)
 */
export function growSnake(gameState) {
  const tail = gameState.snake.segments[gameState.snake.segments.length - 1];
  gameState.snake.segments.push({ x: tail.x, y: tail.y });
}

/**
 * Wrap position to opposite edge if out of bounds
 * NEW in Story 2.3
 * @param {object} position - Position to check/wrap (modified in place)
 * @returns {boolean} - True if wrapping occurred
 */
function wrapPosition(position) {
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
