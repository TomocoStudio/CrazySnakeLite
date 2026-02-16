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
    phase: 'menu',  // 'menu' | 'playing' | 'gameover' | 'skillmap'
    isPaused: false,  // Story 4.4: Track if game is paused
    currentTick: 0,  // Story 12.2: Game tick counter (for rcActivationTick tracking)

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
      hiddenType: null,       // Story 8.1: Locked effect type (for blinking food)
      spawnedAt: null         // Story 13.2: Timestamp when food spawned (for reaction time)
    },

    activeEffect: null,

    // Effects tracking (Story 7.1, Story 11.1)
    effects: {
      wallPhaseUsed: false,         // Tracks if wall was crossed during Wall Phase (for +1/+3 scoring)
      reverseControlsActive: false  // Story 11.1: Tracks if Reverse Controls currently active
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

    // Analytics State (Story 8.6 - Epic 8, Story 9.7 - Epic 9, Story 10.4/10.7 - Epic 10, Story 12.2 - Epic 12)
    // Tier 2 analytics: Internal tracking for Plausible events (denominators, timestamps, distributions)
    analyticsState: {
      // Denominators (for rate calculations)
      totalPhoneCalls: 0,            // Story 9.7: Total calls shown (opportunity)
      totalPickUps: 0,               // Story 9.7: Total Pick Ups committed
      totalEnds: 0,                  // Story 9.7: Total End actions
      totalBlinkingFoodsSpawned: 0,  // Total mystery foods spawned (opportunity metric)
      totalRCFoodsEaten: 0,          // Story 12.2: Reverse Controls foods consumed
      totalCombosTriggered: 0,       // Story 10.7: Total combo activations (Effect A)

      // Timestamps (for duration/reaction time calculations)
      gameStartTime: Date.now(),     // Story 12.2: When game started
      foodSpawnTime: 0,              // Story 12.2: When current food spawned (for time_to_eat)
      phoneCallShowTime: 0,          // Story 9.7: When current call showed (for reaction_time_ms)
      pickUpCompletionTime: 0,       // Story 12.2: When Pick Up/End completed
      rcActivationTick: 0,           // Story 12.2: Game tick when RC activated
      cognitiveStatsShownTime: 0,    // Story 12.2: When cognitive stats displayed

      // Distributions & counts (for behavioral analysis)
      foodTypesEaten: {              // Story 12.2: Food type distribution
        growing: 0,
        invincibility: 0,
        wallPhase: 0,
        speedBoost: 0,
        speedDecrease: 0,
        reverseControls: 0
      },
      comboScores: [],               // Story 10.4: Array of all combo scores (A × B values)
      milestonesReached: [],         // Story 12.2: Scores when crossing [3, 15, 40, 60, 100]
      comboPhoneOverlaps: 0,         // Story 10.7: Phone calls during active combo
      comboPhoneOverlapSurvived: 0   // Story 10.7: Survived phone calls during combo
    },

    // Cognitive Stats (Story 8.6 - Epic 8, Story 9.7 - Epic 9, Story 10.4 - Epic 10, Story 11.1 - Epic 11)
    cognitiveStats: {
      rcSurvived: 0,                 // Story 11.1: Food eaten while Reverse Controls active
      mysteryFoodsEaten: 0,          // Total mystery foods consumed (engagement metric)
      phoneCallsManaged: 0,          // Story 9.7: Total calls dismissed (End + Pick Up)
      pickUpStreak: 0,               // Story 9.7: Consecutive Pick Ups (reset on End)
      comboMultipliers: 0,           // Story 10.4: Total combo multipliers triggered
      peakComboScore: 0              // Story 10.4: Highest single combo score this game
    },

    // Metrics Tracking (Story 13.1+ - Cognitive Dashboard)
    metricsTracking: {
      rawEvents: [],                 // Array of gameplay events for metric calculations
      lastInputTime: null            // Timestamp of last directional input (for reaction time)
    },

    // Combo Mode (Epic 10, Story 10.1 - v2)
    combo: {
      active: false,            // Is combo mode currently active?
      effectA: null,            // First food effect: {type, points}
      effectB: null,            // Second food effect: {type, points}
      canvasColor: null,        // Dark background color during combo
      foodCount: 0              // Foods eaten during combo (1, 2, or 3)
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
