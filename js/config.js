// CrazySnakeLite - Game Configuration
// All tunable game parameters in one place

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

  // Phone call timing (milliseconds)
  PHONE_MIN_DELAY: 5000,   // 5 seconds (reduced for more frequent calls)
  PHONE_MAX_DELAY: 15000,  // 15 seconds (reduced for more frequent calls)

  // Colors (hex strings)
  COLORS: {
    background: '#E8E8E8',
    gridLine: '#A0A0A0',
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
  EXPECTED_SOUND_COUNT: 14  // 7 states × 2 sounds each
};
