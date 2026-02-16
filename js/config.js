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
    foodReverseControls: '#FFA500',

    // Food outline colors (Story 19.2 - Enhancement 2: Food Shapes)
    // Darker variants for 1px border - provides contrast on any background
    foodGrowingOutline: '#009900',
    foodInvincibilityOutline: '#B8B800',
    foodWallPhaseOutline: '#550055',
    foodSpeedBoostOutline: '#B30000',
    foodSpeedDecreaseOutline: '#009199',
    foodReverseControlsOutline: '#B37400'
  },

  // Visual settings
  GRID_LINE_WIDTH: 0.5,
  GRID_LINE_OPACITY: 0.9,
  FOOD_SIZE: 14,  // pixels (Story 19.2 - updated from 11 for shape clarity)

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
    { minScore: 0,   maxScore: 29,  probability: 0.0 },   // No combos (learning phase)
    { minScore: 30,  maxScore: 59,  probability: 0.1 },   // 10%
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
  COMBO_PAUSE_ON_PHONE: true,     // Pause combo progression during phone calls

  // Cognitive Feedback Display (Epic 11, Story 11.3-11.4 - v2)
  COGNITIVE_STATS_DISPLAY: {
    maxStats: 3,                  // Display top 3 stats
    initialDelay: 300,            // Delay before header appears
    staggerDelay: 300,            // 300ms between stat lines
    holdDuration: 2500,           // Hold visible for 2.5s
    fadeDuration: 500             // Fade out over 500ms
  },

  // Purple theme color for "Your Brain Today" header
  THEME_COLOR_PURPLE: '#9C27B0',   // Material Design Purple 500

  // Analytics Configuration (Story 12.1 - Epic 12)
  // Set to false in development to disable all tracking
  // Set to true in production to enable Plausible events
  ANALYTICS_ENABLED: true,

  // Skill Map Dashboard Configuration (Story 16.3 - Epic 16)
  DASHBOARD: {
    // Domain-specific comedy quotes for callout cards
    DOMAIN_QUOTES: {
      topSkill: {
        reactionTime: "Your reflexes have their own zip code — they arrive that fast.",
        spatialAwareness: "Your snake navigates like it has GPS. No, wait — better than GPS.",
        cognitiveFlexibility: "Reverse Controls? Please. Your brain treats that like a warm-up.",
        dividedAttention: "Phone calls during gameplay? You multitask like you've got two brains.",
        impulseControl: "You weigh risk like a Wall Street quant with nothing to lose.",
        workingMemory: "Combo mode? Your working memory eats those for breakfast."
      },
      levelUp: {
        reactionTime: "Reaction Time is your next frontier — speed runs, here you come.",
        spatialAwareness: "Spatial Awareness wants some love. Let that snake grow long and proud.",
        cognitiveFlexibility: "Reverse Controls is your gym. Get in there and flip some neurons.",
        dividedAttention: "Phone calls are your next level. Pick up more — you can handle it.",
        impulseControl: "Impulse Control is cooking. A few more strategic Pick Ups and you'll level up.",
        workingMemory: "Working Memory is next on the list. Combo mode is calling your name."
      }
    },

    // Rotating caller quotes for Skill Map dashboard
    // Story 16.5: Comedy quote pools with milestone and domain-specific context
    QUOTES: {
      // General achievement quotes (shown when no milestone/domain context)
      general: [
        {
          text: "Your neurons are doing the Electric Slide. Keep it up!",
          caller: "DJ Algorithm",
          portrait: "assets/callers/dj-algorithm.png"
        },
        {
          text: "This brain gym has better attendance than most actual gyms.",
          caller: "Cache Money",
          portrait: "assets/callers/cache-money.png"
        },
        {
          text: "Neural pathways strengthening detected. Status: impressive.",
          caller: "Mona Tor",
          portrait: "assets/callers/mona-tor.png"
        },
        {
          text: "Your cognitive flexibility is looser than a rubber band factory.",
          caller: "Al Gorithm",
          portrait: "assets/callers/al-gorithm.png"
        },
        {
          text: "Snake wrangling builds character. And synapses. Mostly synapses.",
          caller: "Kernel Sanders",
          portrait: "assets/callers/kernel-sanders.png"
        },
        {
          text: "Your brain is leveling up faster than my download speeds.",
          caller: "Floppy Phil",
          portrait: "assets/callers/floppy-phil.png"
        },
        {
          text: "Pattern recognition on point. You're seeing the matrix now.",
          caller: "Ray Tracer",
          portrait: "assets/callers/ray-tracer.png"
        },
        {
          text: "Cognitive gains detected. This is your prefrontal cortex calling.",
          caller: "Ada Loopback",
          portrait: "assets/callers/ada-loopback.png"
        }
      ],

      // Milestone-specific quotes (7-day, 30-day streaks; 50, 100 sessions)
      milestone: [
        {
          text: "7-day streak! Your brain has better habits than most people.",
          caller: "Cache Money",
          portrait: "assets/callers/cache-money.png"
        },
        {
          text: "30 days? That's not a streak, that's a neural revolution.",
          caller: "Floppy Phil",
          portrait: "assets/callers/floppy-phil.png"
        },
        {
          text: "50 sessions in? Your prefrontal cortex is officially jacked.",
          caller: "Ray Tracer",
          portrait: "assets/callers/ray-tracer.png"
        },
        {
          text: "100 sessions! You've unlocked: Permanent Brain Gains.",
          caller: "Ada Loopback",
          portrait: "assets/callers/ada-loopback.png"
        },
        {
          text: "A week straight? Your consistency game is next level.",
          caller: "DJ Algorithm",
          portrait: "assets/callers/dj-algorithm.png"
        },
        {
          text: "Milestone unlocked. Your neuroplasticity is showing.",
          caller: "Mona Tor",
          portrait: "assets/callers/mona-tor.png"
        }
      ],

      // Domain-specific quotes (shown when strongest domain matches)
      domainSpecific: {
        reactionTime: [
          {
            text: "Your reaction time is clocking in faster than my compiler.",
            caller: "Kernel Sanders",
            portrait: "assets/callers/kernel-sanders.png"
          }
        ],
        spatialAwareness: [
          {
            text: "Spatial awareness off the charts. Snake GPS confirmed installed.",
            caller: "Ray Tracer",
            portrait: "assets/callers/ray-tracer.png"
          }
        ],
        cognitiveFlexibility: [
          {
            text: "Reverse Controls is your warm-up. Your brain flips like a pancake.",
            caller: "Floppy Phil",
            portrait: "assets/callers/floppy-phil.png"
          }
        ],
        dividedAttention: [
          {
            text: "Phone calls during gameplay? Multitasking level: legendary.",
            caller: "Mona Tor",
            portrait: "assets/callers/mona-tor.png"
          }
        ],
        impulseControl: [
          {
            text: "Risk assessment on point. Your impulse control is dialed in.",
            caller: "Cache Money",
            portrait: "assets/callers/cache-money.png"
          }
        ],
        workingMemory: [
          {
            text: "Working memory firing on all cylinders. Combo mode is your playground.",
            caller: "DJ Algorithm",
            portrait: "assets/callers/dj-algorithm.png"
          }
        ]
      }
    },

    // Streak messaging (Story 17.4 - Epic 17)
    // Ethical design: gentle, encouraging, no guilt
    STREAK_MESSAGES: {
      break: "Rest day logged. Ready for another round?",
      freshStart: "🔥 Fresh start — let's build a new streak!",
      achievementBeforeBreak: (days) => `${days}-day streak complete! Ready for round 2?`,
      newRecord: "NEW RECORD! 🎉"
    },

    // Streak milestones (Story 17.5 - Epic 17)
    // Highlight these streaks in gold with pulsing animation
    STREAK_MILESTONES: [7, 14, 30, 60]
  },

  // ========================================================================
  // V4 VISUAL PROGRESSION THRESHOLDS (Story 19.1 - Epic 19)
  // Progressive visual transformation tied to score-based achievement
  // ========================================================================

  // Enhancement 3: CRT Phosphor Glow (Story 19.1)
  // Blur intensity increases with score for retro CRT effect
  GLOW_INTENSITY_THRESHOLDS: [
    { minScore: 0,   maxScore: 49,  blur: 3 },
    { minScore: 50,  maxScore: 79,  blur: 5 },
    { minScore: 80,  maxScore: Infinity, blur: 8 }
  ],

  // Enhancement 1: Progressive Dark Playfield - Background Colors (Story 19.1)
  // Canvas darkens progressively from light gray to near-black (Neon Noir aesthetic)
  BACKGROUND_THRESHOLDS: [
    { minScore: 0,   maxScore: 14,  background: '#E8E8E8' },  // Light gray (beginner)
    { minScore: 15,  maxScore: 29,  background: '#D0D0D0' },  // Medium-light gray
    { minScore: 30,  maxScore: 49,  background: '#B0B0B0' },  // Medium gray
    { minScore: 50,  maxScore: 79,  background: '#808080' },  // Medium-dark gray
    { minScore: 80,  maxScore: 99,  background: '#505050' },  // Dark gray
    { minScore: 100, maxScore: Infinity, background: '#2A2A2A' }  // Near-black (Neon Noir)
  ],

  // Enhancement 1: Progressive Dark Playfield - Grid Line Colors (Story 19.1)
  // Grid lines darken alongside background to maintain subtle contrast
  GRID_LINE_THRESHOLDS: [
    { minScore: 0,   maxScore: 14,  gridLine: '#A0A0A0' },  // Dark gray lines on light BG
    { minScore: 15,  maxScore: 29,  gridLine: '#909090' },
    { minScore: 30,  maxScore: 49,  gridLine: '#808080' },
    { minScore: 50,  maxScore: 79,  gridLine: '#606060' },
    { minScore: 80,  maxScore: 99,  gridLine: '#404040' },
    { minScore: 100, maxScore: Infinity, gridLine: '#1A1A1A' }  // Very dark lines (subtle on black)
  ],

  // Enhancement 8: Grid Line Opacity (Story 19.1)
  // Grid fades out as background darkens for cleaner "ghost grid" effect
  GRID_OPACITY_THRESHOLDS: [
    { minScore: 0,   maxScore: 49,  opacity: 1.0 },   // Fully visible
    { minScore: 50,  maxScore: 79,  opacity: 0.7 },   // Slightly faded
    { minScore: 80,  maxScore: 99,  opacity: 0.5 },   // Half opacity
    { minScore: 100, maxScore: Infinity, opacity: 0.3 }  // Ghost grid (subtle)
  ],

  // Enhancement 8: Grid Dot Opacity (Story 19.1)
  // Intersection dots appear and intensify as grid fades (visual anchor points)
  GRID_DOT_OPACITY_THRESHOLDS: [
    { minScore: 0,   maxScore: 49,  opacity: 0 },      // No dots at low scores
    { minScore: 50,  maxScore: 79,  opacity: 0.15 },   // Faint dots emerge
    { minScore: 80,  maxScore: 99,  opacity: 0.25 },   // Medium intensity
    { minScore: 100, maxScore: Infinity, opacity: 0.35 }  // Full dot visibility
  ]
};
