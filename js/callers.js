// CrazySnakeLite - Caller Quote System (Story 14.3)
// Tech-pun callers with performance-contextual quotes

/**
 * Caller database with 21 tech-pun personalities (per FR201)
 * Each caller has quotes mapped to performance contexts for contextual humor
 */
const CALLERS = [
  {
    name: "Kernel Sanders",
    portrait: "/assets/portraits/kernel-sanders.png",
    quotes: [
      {
        text: "Orange food got you? That's executive function boot camp. You'll get it.",
        context: "death_during_rc"
      },
      {
        text: "Your prefrontal cortex just bench-pressed a truck.",
        context: "high_score"
      },
      {
        text: "Another round, another chance to optimize those neural pathways.",
        context: "generic"
      }
    ]
  },
  {
    name: "DJ Algorithm",
    portrait: "/assets/portraits/dj-algorithm.png",
    quotes: [
      {
        text: "Your neurons are doing the Electric Slide. Keep it up!",
        context: "high_score"
      },
      {
        text: "That's what I call a killer performance. Drop the beat!",
        context: "personal_best"
      },
      {
        text: "Time to remix those reflexes and drop another track.",
        context: "generic"
      }
    ]
  },
  {
    name: "Cache Money",
    portrait: "/assets/portraits/cache-money.png",
    quotes: [
      {
        text: "12 days straight? Your brain is now officially a gym rat.",
        context: "streak_milestone"
      },
      {
        text: "Consistency is the compound interest of cognitive gains.",
        context: "streak_milestone"
      },
      {
        text: "Cache hit! Your working memory is on point today.",
        context: "generic"
      }
    ]
  },
  {
    name: "Ray Tracer",
    portrait: "/assets/portraits/ray-tracer.png",
    quotes: [
      {
        text: "That streak is hotter than a CPU at 95°C.",
        context: "streak_milestone"
      },
      {
        text: "Rendering those reflexes in real-time. Beautiful.",
        context: "high_score"
      },
      {
        text: "Every pixel counts, every rep matters.",
        context: "generic"
      }
    ]
  },
  {
    name: "Array Jay",
    portrait: "/assets/portraits/array-jay.png",
    quotes: [
      {
        text: "First combo survived! Welcome to the big leagues.",
        context: "first_combo"
      },
      {
        text: "Your indexing skills are zero-based perfection.",
        context: "high_score"
      },
      {
        text: "Push, pop, and never stop. That's the array way.",
        context: "generic"
      }
    ]
  },
  {
    name: "Lambda Calculus",
    portrait: "/assets/portraits/lambda-calculus.png",
    quotes: [
      {
        text: "Multiplicative scoring unlocked. Your working memory thanks you.",
        context: "first_combo"
      },
      {
        text: "Pure functions, pure focus. That's how we do it.",
        context: "high_score"
      },
      {
        text: "Compose yourself and try again. No side effects here.",
        context: "generic"
      }
    ]
  },
  {
    name: "Git Committer",
    portrait: "/assets/portraits/git-committer.png",
    quotes: [
      {
        text: "Five sessions in and your prefrontal cortex is filing pull requests like a boss.",
        context: "calibration_progress"
      },
      {
        text: "That's a clean commit. No merge conflicts in that brain.",
        context: "personal_best"
      },
      {
        text: "Push harder, merge smarter. Your branches are looking good.",
        context: "generic"
      }
    ]
  },
  {
    name: "Floppy Phil",
    portrait: "/assets/portraits/floppy-phil.png",
    quotes: [
      {
        text: "Reverse Controls: where good snakes go to humble themselves.",
        context: "death_during_rc"
      },
      {
        text: "Remember when I had 1.44MB of glory? You've got way more capacity.",
        context: "calibration_progress"
      },
      {
        text: "Old school cool. Your brain's got that vintage processing power.",
        context: "generic"
      }
    ]
  },
  {
    name: "RAM Ramirez",
    portrait: "/assets/portraits/ram-ramirez.png",
    quotes: [
      {
        text: "New high score? Your hippocampus is taking notes.",
        context: "personal_best"
      },
      {
        text: "More memory, more problems? Nah. More memory, more wins.",
        context: "high_score"
      },
      {
        text: "Random access, maximum impact. That's the RAM way.",
        context: "generic"
      }
    ]
  },
  {
    name: "Byte Williams",
    portrait: "/assets/portraits/byte-williams.png",
    quotes: [
      {
        text: "Every rep counts. Your brain is stronger than yesterday.",
        context: "generic"
      },
      {
        text: "Small bites, big gains. Keep chomping.",
        context: "calibration_progress"
      },
      {
        text: "8 bits of wisdom: practice makes perfect.",
        context: "generic"
      }
    ]
  },
  {
    name: "Ada Lovelace Jr.",
    portrait: "/assets/portraits/ada-lovelace-jr.png",
    quotes: [
      {
        text: "That's some next-level pattern recognition. Ada would be proud.",
        context: "personal_best"
      },
      {
        text: "Your analytical engine is firing on all cylinders.",
        context: "high_score"
      },
      {
        text: "The first programmer knew: loops make perfect. Keep iterating.",
        context: "generic"
      }
    ]
  },
  {
    name: "Turing McTuring",
    portrait: "/assets/portraits/turing-mcturing.png",
    quotes: [
      {
        text: "Reverse Controls got you? Even Turing failed a few tests.",
        context: "death_during_rc"
      },
      {
        text: "You're passing the cognitive Turing Test with flying colors.",
        context: "high_score"
      },
      {
        text: "Computation is iteration. Keep computing.",
        context: "generic"
      }
    ]
  },
  {
    name: "Pixel Pete",
    portrait: "/assets/portraits/pixel-pete.png",
    quotes: [
      {
        text: "Combo multiplier? That's some 16-bit magic right there.",
        context: "first_combo"
      },
      {
        text: "Your spatial awareness is rendering at 60 FPS. Smooth.",
        context: "high_score"
      },
      {
        text: "One pixel at a time, one point at a time. Classic arcade wisdom.",
        context: "generic"
      }
    ]
  },
  {
        name: "Vector Vicky",
    portrait: "/assets/portraits/vector-vicky.png",
    quotes: [
      {
        text: "That direction change? Pure vector mathematics. Chef's kiss.",
        context: "death_during_rc"
      },
      {
        text: "Your trajectory is heading straight for the high score hall of fame.",
        context: "personal_best"
      },
      {
        text: "Magnitude and direction. You've got both.",
        context: "generic"
      }
    ]
  },
  {
    name: "Node Nelson",
    portrait: "/assets/portraits/node-nelson.png",
    quotes: [
      {
        text: "Your neural network just leveled up. Backpropagation successful.",
        context: "personal_best"
      },
      {
        text: "Connected, optimized, and ready to scale. That's the node way.",
        context: "streak_milestone"
      },
      {
        text: "Every connection matters. Your graph is getting stronger.",
        context: "generic"
      }
    ]
  },
  {
    name: "Stack Steph",
    portrait: "/assets/portraits/stack-steph.png",
    quotes: [
      {
        text: "Combo stacking like LIFO perfection. Last in, first out, all in.",
        context: "first_combo"
      },
      {
        text: "Your call stack is deep and your focus is deeper.",
        context: "high_score"
      },
      {
        text: "Push through the challenges, pop out victorious.",
        context: "generic"
      }
    ]
  },
  {
    name: "Queue Quinn",
    portrait: "/assets/portraits/queue-quinn.png",
    quotes: [
      {
        text: "Patience is a virtue. FIFO never lies. First in line, first to win.",
        context: "streak_milestone"
      },
      {
        text: "Waiting your turn paid off. That's queue discipline.",
        context: "calibration_progress"
      },
      {
        text: "Line up those neurons and process them in order.",
        context: "generic"
      }
    ]
  },
  {
    name: "Heap Harper",
    portrait: "/assets/portraits/heap-harper.png",
    quotes: [
      {
        text: "Priority sorted: your brain is always max-heap ready.",
        context: "personal_best"
      },
      {
        text: "Memory management on point. No garbage collection needed here.",
        context: "high_score"
      },
      {
        text: "Allocate, deallocate, dominate. Heap style.",
        context: "generic"
      }
    ]
  },
  {
    name: "Tree Taylor",
    portrait: "/assets/portraits/tree-taylor.png",
    quotes: [
      {
        text: "Your decision tree just grew a new branch. And it's beautiful.",
        context: "personal_best"
      },
      {
        text: "Balanced like a perfect AVL tree. That's how you do it.",
        context: "high_score"
      },
      {
        text: "Root, branch, leaf. Every level matters.",
        context: "generic"
      }
    ]
  },
  {
    name: "Graph Gary",
    portrait: "/assets/portraits/graph-gary.png",
    quotes: [
      {
        text: "Your neural pathways are forming new edges. Graph theory in action.",
        context: "calibration_progress"
      },
      {
        text: "Shortest path to victory? You just found it.",
        context: "high_score"
      },
      {
        text: "Vertices connect, edges strengthen. Keep building that graph.",
        context: "generic"
      }
    ]
  },
  {
    name: "Hash Helen",
    portrait: "/assets/portraits/hash-helen.png",
    quotes: [
      {
        text: "O(1) lookup on that personal best. Hash table efficiency at its finest.",
        context: "personal_best"
      },
      {
        text: "No collisions, just pure hashed perfection.",
        context: "high_score"
      },
      {
        text: "Map your goals, hash your wins. That's the Helen method.",
        context: "generic"
      }
    ]
  }
];

/**
 * Select contextual caller quote based on session performance.
 * Story 14.3: Performance-based quote selection per FR164.
 *
 * Context Priority Order (highest to lowest):
 * 1. Streak milestones (30+ days, 7+ days)
 * 2. First-time achievements (first combo)
 * 3. Death context (RC death)
 * 4. Score-based (high score > 80)
 * 5. Calibration progress (sessions 3-5)
 * 6. Personal best achieved
 * 7. Generic encouragement (fallback)
 *
 * @param {Object} sessionData - {score, metrics}
 * @param {Object} cognitiveStats - {comboMultipliers, rcDeath, etc.}
 * @param {Array} highlights - Selected highlights from Story 14.1
 * @param {Object} sessionContext - {calibrationState, streakDays, totalSessions}
 * @returns {Object} {text, caller, portrait} quote object
 */
export function selectCallerQuote(sessionData, cognitiveStats, highlights, sessionContext) {
  // 1. Determine performance context (priority order)
  let context = 'generic';

  // Priority 1: Streak milestones (rarest, highest priority)
  if (sessionContext.streakDays >= 30) {
    context = 'streak_milestone';
  } else if (sessionContext.streakDays >= 7) {
    context = 'streak_milestone';
  }
  // Priority 2: First-time achievements
  else if (cognitiveStats.comboMultipliers === 1 && sessionContext.totalSessions === 1) {
    context = 'first_combo';
  }
  // Priority 3: Death context
  else if (cognitiveStats.rcDeath === true) {
    context = 'death_during_rc';
  }
  // Priority 4: Score-based
  else if (sessionData.score > 80) {
    context = 'high_score';
  }
  // Priority 5: Calibration progress
  else if (sessionContext.calibrationState === 'in_progress') {
    context = 'calibration_progress';
  }
  // Priority 6: Personal best
  else if (highlights && highlights.some(h => h.type === 'personal_best')) {
    context = 'personal_best';
  }
  // Priority 7: Generic (fallback)

  // 2. Filter callers with matching context quotes
  const matchingCallers = CALLERS.filter(caller =>
    caller.quotes.some(q => q.context === context)
  );

  // 3. Fallback to generic if no match
  const pool = matchingCallers.length > 0 ? matchingCallers : CALLERS.filter(c =>
    c.quotes.some(q => q.context === 'generic')
  );

  // 4. Random selection from pool
  const caller = pool[Math.floor(Math.random() * pool.length)];
  const contextQuotes = caller.quotes.filter(q => q.context === context || (context !== 'generic' && q.context === 'generic'));
  const quote = contextQuotes.length > 0 ? contextQuotes[Math.floor(Math.random() * contextQuotes.length)] : caller.quotes[0];

  return {
    text: quote.text,
    caller: caller.name,
    portrait: caller.portrait
  };
}

/**
 * Get all available callers (for testing/debug).
 * Story 14.3: Exposes full caller database.
 *
 * @returns {Array} Array of all 21 caller objects
 */
export function getAllCallers() {
  return CALLERS;
}
