// CrazySnakeLite - State Management Module
import { CONFIG } from './config.js';
import { loadHighScore } from './storage.js';
import { resetPhoneCallHistory } from './analytics.js';

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
      type: 'growing',
      isBlinking: false,      // Story 8.1: Is this food blinking (mystery food)?
      hiddenType: null        // Story 8.1: Locked effect type (for blinking food)
    },

    activeEffect: null,

    // Effects tracking (Story 7.1)
    effects: {
      wallPhaseUsed: false  // Tracks if wall was crossed during Wall Phase (for +1/+3 scoring)
    },

    score: 0,
    highScore: loadHighScore(),  // Story 4.2: Load from localStorage

    phoneCall: {
      active: false,
      caller: null,
      currentCaller: null,    // Story 9.4: Current caller object {name, portrait, line}
      nextCallTime: null,     // Story 9.5: When next call triggers (null until first scheduled)
      pickUpCount: 0,         // Story 9.2: Tracks consecutive Pick Ups (for Fibonacci bonus)
      pickUpBonus: 0,         // Story 9.2: Stored bonus for current Pick Up (awarded on timer expiry)
      pickedUp: false,        // Story 9.3: True when Pick Up button pressed
      pickUpEndTime: null,    // Story 9.3: When blur timer expires
      graceActive: true       // Story 9.5: No calls until score >= PHONE_GRACE_SCORE
    },

    // Session tracking (Story 6.3)
    sessionStart: Date.now(),  // Timestamp when page loaded
    gamesPlayed: 0,             // Increments on each new game

    // Analytics State (Story 8.6 - Epic 8, Story 9.7 - Epic 9, prepares for Epic 12)
    analyticsState: {
      totalBlinkingFoodsSpawned: 0,  // Total mystery foods spawned (opportunity metric)
      totalPhoneCalls: 0,            // Story 9.7: Total calls shown (opportunity)
      totalPickUps: 0,               // Story 9.7: Total Pick Ups committed
      totalEnds: 0,                  // Story 9.7: Total End actions
      phoneCallShowTime: null        // Story 9.7: Timestamp when current call showed
    },

    // Cognitive Stats (Story 8.6 - Epic 8, Story 9.7 - Epic 9)
    cognitiveStats: {
      mysteryFoodsEaten: 0,          // Total mystery foods consumed (engagement metric)
      phoneCallsManaged: 0,          // Story 9.7: Total calls dismissed (End + Pick Up)
      pickUpStreak: 0                // Story 9.7: Consecutive Pick Ups (reset on End)
    }
  };
}

/**
 * Resets game state for Play Again
 * Preserves high score, session tracking
 * Story 8.6: Resets analytics counters (per-game tracking)
 */
export function resetGame(gameState) {
  const newState = createInitialState();
  newState.highScore = gameState.highScore;

  // Preserve session tracking (Story 6.3)
  newState.sessionStart = gameState.sessionStart;
  newState.gamesPlayed = gameState.gamesPlayed + 1;  // Increment games played

  // Analytics and cognitive stats reset automatically in createInitialState()
  // Each game starts fresh for per-game analytics (Story 8.6)
  // Review fix: Reset phone call history array (module-scoped in analytics.js)
  resetPhoneCallHistory();

  Object.assign(gameState, newState);
}
