// CrazySnakeLite - State Management Module
import { CONFIG } from './config.js';
import { loadHighScore } from './storage.js';

/**
 * Creates initial snake segments
 * Snake starts at bottom-left, facing right
 * Head is at segments[0], tail is at segments[length-1]
 */
function createInitialSnake() {
  const segments = [];
  const startX = CONFIG.STARTING_POSITION.x;
  const startY = CONFIG.STARTING_POSITION.y;

  // Build snake from head to tail
  // Head is rightmost (startX + length - 1), tail is leftmost (startX)
  for (let i = CONFIG.STARTING_LENGTH - 1; i >= 0; i--) {
    segments.push({
      x: startX + i,
      y: startY
    });
  }

  return segments;
}

/**
 * Creates initial game state
 * Called on: game start, Play Again
 * Story 4.2: Initial phase is 'menu', high score loaded from localStorage
 */
export function createInitialState() {
  return {
    phase: 'menu',  // 'menu' | 'playing' | 'gameover'
    isPaused: false,  // Story 4.4: Track if game is paused

    snake: {
      segments: createInitialSnake(),
      direction: CONFIG.STARTING_DIRECTION,
      nextDirection: CONFIG.STARTING_DIRECTION,
      color: CONFIG.COLORS.snakeDefault
    },

    food: {
      position: null,
      type: 'growing'
    },

    activeEffect: null,

    score: 0,
    highScore: loadHighScore(),  // Story 4.2: Load from localStorage

    phoneCall: {
      active: false,
      caller: null,
      nextCallTime: 0
    }
  };
}

/**
 * Resets game state for Play Again
 * Preserves high score
 */
export function resetGame(gameState) {
  const newState = createInitialState();
  newState.highScore = gameState.highScore;

  Object.assign(gameState, newState);
}
