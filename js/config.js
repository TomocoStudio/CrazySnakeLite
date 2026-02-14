// CrazySnakeLite - Game Configuration
// All tunable game parameters in one place

// Detect prefers-reduced-motion media query (Story 8.5 - Accessibility)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const CONFIG = {
  // Grid dimensions (swapped for mobile portrait)
  GRID_WIDTH: 20,
  GRID_HEIGHT: 25,
  UNIT_SIZE: 20,  // pixels per grid unit

  // Snake starting state
  STARTING_LENGTH: 5,
  STARTING_POSITION: { x: 2, y: 18 },  // bottom-left area
  STARTING_DIRECTION: 'right',

  // Speed settings (moves per second)
  BASE_SPEED: 8,
  TICK_RATE: 125,  // milliseconds (1000 / 8 = 125ms)
  SPEED_BOOST_MIN: 1.5,
  SPEED_BOOST_MAX: 2.0,
  SPEED_DECREASE_MIN: 0.3,
  SPEED_DECREASE_MAX: 0.5,

  // Food probabilities (must sum to 100)
  FOOD_PROBABILITIES: {
    growing: 40,
    invincibility: 10,
    wallPhase: 10,
    speedBoost: 15,
    speedDecrease: 15,
    reverseControls: 10
  },

  // Phone Calls v2 — Grace Period & Frequency Tiers (Story 9.5 - Epic 9)
  PHONE_GRACE_SCORE: 10,  // No calls until score 10 (learning period)

  PHONE_CALL_TIERS: [
    { minScore: 10,  maxScore: 14,  minDelay: 12000, maxDelay: 20000 }, // 12-20s (beginner, matches grace score)
    { minScore: 15,  maxScore: 39,  minDelay: 8000,  maxDelay: 15000 }, // 8-15s
    { minScore: 40,  maxScore: 59,  minDelay: 6000,  maxDelay: 12000 }, // 6-12s
    { minScore: 60,  maxScore: 99,  minDelay: 5000,  maxDelay: 10000 }, // 5-10s
    { minScore: 100, maxScore: Infinity, minDelay: 4000, maxDelay: 8000 }  // 4-8s (peak)
  ],

  // Colors (hex strings)
  COLORS: {
    background: '#E6E6E6',          // RGB(230, 230, 230) - normal mode
    gridLine: '#505050',            // RGB(80, 80, 80) - normal mode (inverted in combo)
    comboBackground: '#505050',     // RGB(80, 80, 80) - combo mode
    comboGridLine: '#E6E6E6',       // RGB(230, 230, 230) - combo mode
    border: '#800080',  // Story 5-8: Match wall phase food color for UX association
    snakeDefault: '#000000',
    snakeGrowing: '#00FF00',
    snakeInvincibility: '#FFFF00',
    snakeWallPhase: '#800080',
    snakeSpeedBoost: '#FF0000',
    snakeSpeedDecrease: '#00CED1',
    snakeReverseControls: '#FFA500',
    foodGrowing: '#00FF00',
    foodInvincibility: '#FFFF00',
    foodWallPhase: '#800080',
    foodSpeedBoost: '#FF0000',
    foodSpeedDecrease: '#00CED1',
    foodReverseControls: '#FFA500'
  },

  // Visual settings
  GRID_LINE_WIDTH: 0.5,
  GRID_LINE_OPACITY: 0.9,
  FOOD_SIZE: 11,  // pixels (food rendered as 11x11 pixel shapes) - Story 5-3 testing

  // Strobe effect (Story 2.2)
  STROBE_INTERVAL: 100,  // milliseconds (10 Hz = 10 flashes per second)

  // Snake head styling
  HEAD_BORDER_COLOR: '#E8E8E8',  // Story 5-4: Match grid background for subtle effect
  HEAD_BORDER_WIDTH: 2,

  // Touch input
  MIN_SWIPE_DISTANCE: 30,  // pixels

  // Audio settings (Story 4.5)
  SOUNDS_PATH: 'assets/sounds/',
  MASTER_VOLUME: 1.0,  // 0.0 to 1.0
  EXPECTED_SOUND_COUNT: 14,  // 7 states × 2 sounds each

  // Feedback System (Story 6.1-6.5)
  MAX_COMMENT_LENGTH: 500,
  FEEDBACK_EMAIL: 'tomocogemini@gmail.com',  // User feedback submission address
  THANK_YOU_DURATION: 120000,  // milliseconds (2 minutes auto-close for thank you message)

  // Fibonacci Scoring (Story 7.1 - v2)
  SCORING: {
    FOOD: {
      growing: 1,
      speedDecrease: 2,
      wallPhase: 1,          // Default on consumption
      speedBoost: 5,
      reverseControls: 8,
      invincibility: 0        // Safety tax
    },
    WALL_PHASE_BONUS: 2,     // Additional +2 if wall is crossed (total +3)
    PHONE_END: 1             // Story 9.2: End call always awards +1 (flat)
  },

  // Phone Calls v2 — Effect-Based Bonuses (Story 9.2 - Epic 9, redesigned)
  // Bonuses based on current active effect (ties risk to reward)
  PHONE_BONUSES: {
    invincibility: { end: 0, pickup: 0 },           // No bonus (prevents exploit)
    growing: { end: 1, pickup: 2 },                  // Default/baseline (no active effect)
    speedDecrease: { end: 1, pickup: 1 },            // Low risk = low reward
    wallPhase: { end: 1, pickup: 2, pickupUsed: 3 }, // +2 default, +3 if wall crossed
    speedBoost: { end: 1, pickup: 5 },               // High risk = high reward
    reverseControls: { end: 1, pickup: 8 }           // Extreme risk = extreme reward
  },

  // Pick Up Timer (Story 9.3 - Epic 9)
  PICKUP_TIMER: {
    min: 1000,    // 1 second minimum
    max: 3000     // 3 seconds maximum
  },

  // Blinking Food System (Story 8.1 - v2)
  BLINK_SEQUENCE: ['#00FF00', '#FFFF00', '#800080', '#FF0000', '#00CED1', '#FFA500'],  // Green → Yellow → Purple → Red → Cyan → Orange
  BLINK_CYCLE_DURATION: 200,  // ms per color (200ms = 5 colors/second)

  // Blinking Food Progression Thresholds (Story 8.2 - v2)
  BLINKING_THRESHOLDS: [
    { minScore: 0,  maxScore: 14,  probability: 0.0 },  // No blinking (beginner)
    { minScore: 15, maxScore: 19,  probability: 0.1 },  // 10% blinking
    { minScore: 20, maxScore: 29,  probability: 0.2 },  // 20% blinking
    { minScore: 30, maxScore: 39,  probability: 0.3 },  // 30% blinking
    { minScore: 40, maxScore: 59,  probability: 0.4 },  // 40% blinking
    { minScore: 60, maxScore: 79,  probability: 0.5 },  // 50% blinking
    { minScore: 80, maxScore: Infinity, probability: 0.6 }  // 60% blinking (capped)
  ],

  // Accessibility (Story 8.5 - v2)
  REDUCED_MOTION: prefersReducedMotion,

  // Alpha Pulsing for Reduced Motion (Story 8.5 - v2)
  ALPHA_PULSE: {
    min: 0.5,           // Minimum opacity (50%)
    max: 1.0,           // Maximum opacity (100%)
    frequency: 500      // Oscillation period in ms (1 second cycle = 500ms * 2)
  },

  // Combo Mode System (Epic 10, Story 10.1 - v2)
  COMBO_PROBABILITIES: [
    { minScore: 0,   maxScore: 4,   probability: 0.0 },   // No combos (learning phase)
    { minScore: 5,   maxScore: 59,  probability: 0.8 },   // 80% - TESTING MODE
    { minScore: 60,  maxScore: 79,  probability: 0.2 },   // 20%
    { minScore: 80,  maxScore: 99,  probability: 0.3 },   // 30%
    { minScore: 100, maxScore: 119, probability: 0.35 },  // 35%
    { minScore: 120, maxScore: Infinity, probability: 0.4 } // 40% (cap)
  ],

  // Combo Mode Canvas Colors (Epic 10, Story 10.2 - v2)
  COMBO_CANVAS_COLORS: [
    '#4A148C',  // Dark purple
    '#0D47A1',  // Dark blue
    '#B71C1C',  // Dark red
    '#1B5E20'   // Dark green
  ],

  // Default canvas background color
  DEFAULT_CANVAS_COLOR: '#E8E8E8',  // Light grey

  // Combo Audio Thresholds (Epic 10, Story 10.4 - v2)
  COMBO_JACKPOT_THRESHOLD: 15,    // 15+ points triggers jackpot audio
  COMBO_LEGENDARY_THRESHOLD: 30,  // 30+ points triggers legendary audio

  // Combo + Phone Interaction (Epic 10, Story 10.6 - v2)
  COMBO_PAUSE_ON_PHONE: true      // Pause combo progression during phone calls
};
