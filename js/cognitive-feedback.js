// CrazySnakeLite - Cognitive Feedback Module
// Story 11.3: Display top cognitive stats on death screen
import { CONFIG } from './config.js';

/**
 * Select top 2-3 cognitive stats to display.
 * Filters out zeros, sorts by value descending, applies priority for ties.
 * @param {object} cognitiveStats - All cognitive stats from gameState
 * @returns {array} Array of {key, value, priority} objects (max 3)
 */
export function selectTopStats(cognitiveStats) {
  // Define priority order (for tie-breaking)
  // Higher number = higher priority
  const priority = {
    rcSurvived: 6,
    comboMultipliers: 5,
    pickUpStreak: 4,
    mysteryFoodsEaten: 3,
    phoneCallsManaged: 2,
    peakComboScore: 1
  };

  // Convert to array of {key, value, priority}
  const stats = Object.entries(cognitiveStats)
    .filter(([key, value]) => value > 0) // Filter out zeros
    .map(([key, value]) => ({
      key,
      value,
      priority: priority[key] || 0
    }));

  // Sort by value descending, then priority descending (for ties)
  stats.sort((a, b) => {
    if (b.value !== a.value) {
      return b.value - a.value; // Higher value first
    }
    return b.priority - a.priority; // Higher priority first if tied
  });

  // Return top 3 (or fewer if less than 3 non-zero stats)
  return stats.slice(0, CONFIG.COGNITIVE_STATS_DISPLAY.maxStats);
}

/**
 * Format stat key and value into display text.
 * @param {string} key - Stat key (e.g., 'rcSurvived')
 * @param {number} value - Stat value
 * @returns {string} Formatted text (e.g., "Reverse Controls survived: 4")
 */
export function formatStatLine(key, value) {
  const templates = {
    rcSurvived: `Reverse Controls survived: ${value}`,
    phoneCallsManaged: `Phone calls managed: ${value}`,
    mysteryFoodsEaten: `Mystery foods decoded: ${value}`,
    comboMultipliers: `Combo multipliers earned: ${value}`,
    pickUpStreak: `Pick Up streak: ${value}`,
    peakComboScore: `Best combo: ×${value}`  // Note: × symbol prefix
  };

  return templates[key] || `${key}: ${value}`;
}

/**
 * Show cognitive highlights on game-over screen with staggered fade-in animation.
 * Story 14.2: Replaces showCognitiveStats() with highlights-based approach.
 *
 * Timing sequence per FR168:
 * - t=0.0s: Game over + score appear
 * - t=0.3s: "RECAP" header fades in
 * - t=0.6s: Highlight 1 fades in (300ms stagger)
 * - t=0.9s: Highlight 2 fades in
 * - t=1.2s: Highlight 3 fades in (if 3 highlights)
 * - t=1.5s: Caller quote fades in (if present)
 * - t=3.3s: Promise resolves (buttons can appear)
 *
 * @param {Array} highlights - Array of highlight objects from selectHighlights()
 * @param {Object} callerQuote - Optional quote object {text, caller, portrait} from Story 14.3
 * @param {Object} sessionContext - Optional {calibrationState, streakDays} for footer display
 * @returns {Promise} Resolves at t=3.3s when animation sequence completes
 */
export function showHighlights(highlights = [], callerQuote = null, sessionContext = null) {
  return new Promise((resolve) => {
    const container = document.querySelector('.cognitive-stats');
    const header = document.querySelector('.cognitive-stats-header');
    const linesContainer = document.querySelector('.cognitive-stats-lines');
    const quoteContainer = document.querySelector('.caller-quote');
    const footerContainer = document.querySelector('.post-game-footer');

    if (!container || !linesContainer) {
      resolve();
      return;
    }

    // Clear previous content
    linesContainer.innerHTML = '';

    // If no highlights, hide container and resolve immediately
    if (highlights.length === 0) {
      container.classList.add('hidden');
      resolve();
      return;
    }

    // Show container
    container.classList.remove('hidden');

    // Reduced motion mode: instant display, no stagger
    if (CONFIG.REDUCED_MOTION) {
      // Header
      if (header) {
        header.style.opacity = '1';
        header.style.animation = 'none';
      }

      // Highlights
      highlights.forEach((highlight) => {
        const line = document.createElement('div');
        line.className = 'cognitive-stat-line';
        line.textContent = formatHighlightText(highlight);
        line.style.opacity = '1';
        line.style.animation = 'none';
        linesContainer.appendChild(line);
      });

      // Caller quote (if present)
      if (callerQuote && quoteContainer) {
        renderCallerQuote(callerQuote, quoteContainer);
        quoteContainer.classList.remove('hidden');
        quoteContainer.style.opacity = '1';
        quoteContainer.style.animation = 'none';
      }

      // Footer (if context present)
      if (sessionContext && footerContainer) {
        renderFooter(sessionContext, footerContainer);
        footerContainer.classList.remove('hidden');
        footerContainer.style.opacity = '1';
        footerContainer.style.animation = 'none';
      }

      // Resolve immediately
      resolve();
      return;
    }

    // Normal mode: staggered animation per FR168
    // t=0.3s: RECAP header
    if (header) {
      header.style.animationDelay = '300ms';
    }

    // t=0.6s, 0.9s, 1.2s: Highlights (300ms stagger)
    highlights.forEach((highlight, index) => {
      const line = document.createElement('div');
      line.className = 'cognitive-stat-line';
      line.textContent = formatHighlightText(highlight);

      // Stagger delay: 600ms base + (index * 300ms)
      const delay = 600 + (index * 300);
      line.style.animationDelay = `${delay}ms`;

      linesContainer.appendChild(line);
    });

    // t=1.5s: Caller quote (if present)
    if (callerQuote && quoteContainer) {
      renderCallerQuote(callerQuote, quoteContainer);
      quoteContainer.classList.remove('hidden');
      quoteContainer.style.animationDelay = '1500ms';
    }

    // Footer (Stories 14.5/14.6 will implement timing)
    if (sessionContext && footerContainer) {
      renderFooter(sessionContext, footerContainer);
      footerContainer.classList.remove('hidden');
      footerContainer.style.animationDelay = '1800ms';
    }

    // t=3.3s: Resolve (buttons can appear)
    setTimeout(() => {
      resolve();
    }, 3300);
  });
}

/**
 * Render caller quote in the quote container.
 * Story 14.3 will provide quote selection logic.
 *
 * @param {Object} quote - {text, caller, portrait}
 * @param {HTMLElement} container - .caller-quote element
 */
function renderCallerQuote(quote, container) {
  const textEl = container.querySelector('.quote-text');
  const nameEl = container.querySelector('.caller-name');
  const portraitEl = container.querySelector('.caller-portrait');

  if (textEl) textEl.textContent = `"${quote.text}"`;
  if (nameEl) nameEl.textContent = `— ${quote.caller}`;
  if (portraitEl && quote.portrait) {
    portraitEl.src = quote.portrait;
    portraitEl.alt = quote.caller;
  }
}

/**
 * Render footer content (calibration progress or streak).
 * Story 14.5: Calibration counter implementation.
 * Story 14.6: Streak display (TBD).
 *
 * @param {Object} context - {calibrationState, calibrationSessionCount, streakDays}
 * @param {HTMLElement} container - .post-game-footer element
 */
function renderFooter(context, container) {
  if (!context) {
    container.classList.add('hidden');
    return;
  }

  // Story 14.5: Calibration states
  if (context.calibrationState === 'in_progress') {
    // Sessions 1-4: Show progress counter with pulsing animation
    container.textContent = `Session ${context.calibrationSessionCount}/5 — Warming up...`;
    container.className = 'post-game-footer calibration-counter';
    container.classList.remove('hidden');

  } else if (context.calibrationState === 'complete') {
    // Session 5: One-time celebration
    container.textContent = 'Your Skill Map is ready! 🎉';
    container.className = 'post-game-footer calibration-complete';
    container.classList.remove('hidden');

    // Trigger celebration animation (100ms flash + confetti)
    if (!CONFIG.REDUCED_MOTION) {
      triggerCalibrationCelebration(container);
    }

  } else if (context.calibrationState === 'unlocked') {
    // Session 6+: Check for streak display (Story 14.6)
    if (context.streakDays && context.streakDays > 0) {
      // Story 14.6: Streak display
      container.textContent = `🔥 ${context.streakDays}-day streak`;
      container.className = 'post-game-footer';
      container.classList.remove('hidden');
    } else {
      // No streak: hide footer
      container.classList.add('hidden');
    }
  } else {
    // Default: hide footer
    container.classList.add('hidden');
  }
}

/**
 * Trigger calibration completion celebration animation.
 * Story 14.5: Brief fanfare with flash and confetti particles.
 *
 * @param {HTMLElement} container - Footer container element
 */
function triggerCalibrationCelebration(container) {
  // 1. Flash animation (handled by CSS .calibration-complete class)
  // Already applied via className assignment in renderFooter

  // 2. Confetti particles (simple emoji confetti)
  createConfettiParticles(container);
}

/**
 * Create confetti particle animation.
 * Story 14.5: Simple emoji particles that fade out.
 *
 * @param {HTMLElement} container - Footer container element
 */
function createConfettiParticles(container) {
  const emojis = ['🎉', '🎊', '✨'];
  const particleCount = 8;

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('span');
    particle.className = 'confetti-particle';
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    particle.style.left = `${20 + Math.random() * 60}%`; // Center area
    particle.style.animationDelay = `${Math.random() * 100}ms`;
    container.appendChild(particle);

    // Remove after animation completes
    setTimeout(() => {
      if (particle.parentNode === container) {
        particle.remove();
      }
    }, 600);
  }
}

/**
 * Show cognitive stats on game over screen with stagger animation.
 * DEPRECATED: Use showHighlights() instead (Story 14.2).
 * Retained for backward compatibility during Epic 14 transition.
 *
 * @param {object} gameState - Full game state with cognitiveStats
 * @returns {Promise} Resolves when stagger animation completes (~300-900ms).
 */
export function showCognitiveStats(gameState) {
  return new Promise((resolve) => {
    const container = document.querySelector('.cognitive-stats');
    const linesContainer = document.querySelector('.cognitive-stats-lines');

    if (!container || !linesContainer) {
      resolve();
      return;
    }

    // Clear previous lines
    linesContainer.innerHTML = '';

    // Select top stats
    const topStats = selectTopStats(gameState.cognitiveStats);

    // If no stats, hide container and resolve immediately
    if (topStats.length === 0) {
      container.classList.add('hidden');
      resolve();
      return;
    }

    // Show container
    container.classList.remove('hidden');

    // Create stat line elements with stagger
    topStats.forEach((stat, index) => {
      const line = document.createElement('div');
      line.className = 'cognitive-stat-line';
      line.textContent = formatStatLine(stat.key, stat.value);

      // Story 11.6: Apply stagger delay ONLY if not reduced motion
      if (!CONFIG.REDUCED_MOTION) {
        const delay = index * CONFIG.COGNITIVE_STATS_DISPLAY.staggerDelay;
        line.style.animationDelay = `${delay}ms`;
      } else {
        // Reduced motion: instant appearance (no delay, no animation)
        line.style.opacity = '1';
        line.style.animation = 'none';
      }

      linesContainer.appendChild(line);
    });

    // Resolve after stagger animation completes
    // Stats remain visible (no auto-close) for user to read
    if (CONFIG.REDUCED_MOTION) {
      // Reduced motion: resolve immediately (no animation delay)
      resolve();
    } else {
      // Normal: resolve after stagger animation completes
      const staggerTime = topStats.length * CONFIG.COGNITIVE_STATS_DISPLAY.staggerDelay;
      setTimeout(() => {
        resolve();
      }, staggerTime);
    }
  });
}

/**
 * Hide highlights with fade-out animation (on game restart).
 * Story 14.2: Replaces hideCognitiveStats() with highlights-aware version.
 */
export function hideHighlights() {
  const container = document.querySelector('.cognitive-stats');
  const header = document.querySelector('.cognitive-stats-header');
  const lines = document.querySelectorAll('.cognitive-stat-line');
  const quoteContainer = document.querySelector('.caller-quote');
  const footerContainer = document.querySelector('.post-game-footer');

  if (!container) {
    return;
  }

  // Story 11.6: Check reduced motion mode
  if (CONFIG.REDUCED_MOTION) {
    // Reduced motion: instant disappearance
    container.classList.add('hidden');
    if (quoteContainer) quoteContainer.classList.add('hidden');
    if (footerContainer) footerContainer.classList.add('hidden');
  } else {
    // Normal: fade-out animation
    if (header) header.classList.add('fade-out');
    lines.forEach(line => line.classList.add('fade-out'));
    if (quoteContainer) quoteContainer.classList.add('fade-out');
    if (footerContainer) footerContainer.classList.add('fade-out');

    // Hide container after fade completes
    setTimeout(() => {
      container.classList.add('hidden');
      if (quoteContainer) quoteContainer.classList.add('hidden');
      if (footerContainer) footerContainer.classList.add('hidden');

      // Clean up fade-out classes for next time
      if (header) header.classList.remove('fade-out');
      lines.forEach(line => line.classList.remove('fade-out'));
      if (quoteContainer) quoteContainer.classList.remove('fade-out');
      if (footerContainer) footerContainer.classList.remove('fade-out');
    }, CONFIG.COGNITIVE_STATS_DISPLAY.fadeDuration);
  }
}

/**
 * Hide cognitive stats with fade-out animation.
 * DEPRECATED: Use hideHighlights() instead (Story 14.2).
 * Retained for backward compatibility.
 */
export function hideCognitiveStats() {
  hideHighlights();
}

// ========================================
// HIGHLIGHT SELECTION (Story 14.1)
// ========================================

/**
 * Metric display names for highlight text formatting
 */
const METRIC_DISPLAY_NAMES = {
  reactionTime: 'Reaction Time',
  spatialAwareness: 'Spatial Awareness',
  cognitiveFlexibility: 'Cognitive Flexibility',
  dividedAttention: 'Divided Attention',
  impulseControl: 'Impulse Control',
  workingMemory: 'Working Memory'
};

/**
 * Select 2-3 highlights from session based on 4-tier priority system.
 * Story 14.1: Intelligent highlight selection with variety enforcement.
 *
 * Priority Tiers:
 * 1. Personal Best - new all-time high for any metric
 * 2. Biggest Improvement - 15%+ increase vs rolling average
 * 3. Notable Events - achievement milestones (RC survived, combos, etc)
 * 4. Growth Opportunity - lowest rolling average metric (if engaged)
 *
 * @param {Object} sessionMetrics - Current session's 6 cognitive metrics
 * @param {Object} rollingAverages - Rolling averages for 6 metrics
 * @param {Object} allTimeHighs - All-time highs for 6 metrics
 * @param {Object} cognitiveStats - Raw game stats (rcSurvived, phoneCallsManaged, etc)
 * @param {Array<string>} lastSessionPattern - Previous session's highlight types
 * @returns {Array<Object>} Array of 0-3 highlight objects
 */
export function selectHighlights(sessionMetrics, rollingAverages, allTimeHighs, cognitiveStats, lastSessionPattern = []) {
  const highlights = [];

  // PRIORITY 1: Personal Bests
  Object.keys(sessionMetrics).forEach(metric => {
    const sessionValue = sessionMetrics[metric];
    const allTimeHigh = allTimeHighs[metric];

    // Check for new personal best (must be greater than previous high)
    if (sessionValue > allTimeHigh && allTimeHigh > 0) {
      highlights.push({
        type: 'personal_best',
        metric: metric,
        value: sessionValue,
        text: `${METRIC_DISPLAY_NAMES[metric]}: NEW PERSONAL BEST!`,
        icon: '🎯',
        priority: 1
      });
    }
  });

  // PRIORITY 2: Biggest Improvements (15%+ delta)
  const improvements = [];
  Object.keys(sessionMetrics).forEach(metric => {
    const sessionValue = sessionMetrics[metric];
    const rollingAvg = rollingAverages[metric];

    // Skip if no rolling average yet (first few sessions)
    if (!rollingAvg || rollingAvg === 0) return;

    const delta = (sessionValue - rollingAvg) / rollingAvg;

    // 15% improvement threshold (>= for "15%+" means 15% or more)
    if (delta >= 0.15) {
      const percentImprovement = Math.round(delta * 100);
      improvements.push({
        type: 'improvement',
        metric: metric,
        value: sessionValue,
        delta: delta,
        text: `${METRIC_DISPLAY_NAMES[metric]} up ${percentImprovement}% this session`,
        icon: '⬆',
        priority: 2
      });
    }
  });

  // Sort improvements by delta descending, add biggest improvement
  improvements.sort((a, b) => b.delta - a.delta);
  if (improvements.length > 0) {
    highlights.push(improvements[0]);
  }

  // PRIORITY 3: Notable Events
  const notableEvents = [];

  if (cognitiveStats.rcSurvived >= 3) {
    notableEvents.push({
      type: 'notable',
      subtype: 'rc_survived',
      value: cognitiveStats.rcSurvived,
      text: `Survived ${cognitiveStats.rcSurvived} Reverse Controls — brain on fire`,
      icon: '🔥',
      priority: 3
    });
  }

  if (cognitiveStats.comboMultipliers >= 1) {
    notableEvents.push({
      type: 'notable',
      subtype: 'combo',
      value: cognitiveStats.comboMultipliers,
      text: 'First combo survived! Welcome to the big leagues',
      icon: '🔥',
      priority: 3
    });
  }

  if (cognitiveStats.phoneCallsManaged >= 5) {
    notableEvents.push({
      type: 'notable',
      subtype: 'phone_calls',
      value: cognitiveStats.phoneCallsManaged,
      text: '5 phone calls managed — multitasking master',
      icon: '🔥',
      priority: 3
    });
  }

  if (cognitiveStats.mysteryFoodsEaten >= 10) {
    notableEvents.push({
      type: 'notable',
      subtype: 'mystery_foods',
      value: cognitiveStats.mysteryFoodsEaten,
      text: '10 mystery foods decoded — pattern recognition elite',
      icon: '🔥',
      priority: 3
    });
  }

  // Add notable events to highlights
  highlights.push(...notableEvents);

  // PRIORITY 4: Growth Opportunity (show lowest rolling average if engaged)
  // Only show if player has at least some engagement (not just green food)
  const totalEngagement = (cognitiveStats.rcSurvived || 0) +
                          (cognitiveStats.comboMultipliers || 0) +
                          (cognitiveStats.phoneCallsManaged || 0) +
                          (cognitiveStats.mysteryFoodsEaten || 0);

  if (totalEngagement > 0 && Object.keys(rollingAverages).length > 0) {
    const lowestMetric = Object.entries(rollingAverages)
      .filter(([_, value]) => value > 0) // Only consider metrics with data
      .sort((a, b) => a[1] - b[1])[0]; // Sort ascending, take first

    if (lowestMetric) {
      const [metric, value] = lowestMetric;
      highlights.push({
        type: 'growth',
        metric: metric,
        value: value,
        text: `${METRIC_DISPLAY_NAMES[metric]} — time to level up`,
        icon: '↑',
        priority: 4
      });
    }
  }

  // Sort by priority (ascending - lower number = higher priority)
  highlights.sort((a, b) => a.priority - b.priority);

  // Select top 2-3 highlights
  let selectedHighlights = highlights.slice(0, 3);

  // VARIETY ENFORCEMENT: If pattern matches last session, swap lowest-priority highlight
  if (selectedHighlights.length > 1 && lastSessionPattern.length > 0) {
    const currentPattern = selectedHighlights.map(h => h.type);
    const patternsMatch = currentPattern.every((type, index) => type === lastSessionPattern[index]);

    if (patternsMatch && highlights.length > 3) {
      // Swap out lowest-priority selected highlight with next available
      selectedHighlights[selectedHighlights.length - 1] = highlights[3];
    }
  }

  // FALLBACK: Zero qualifying highlights → encouragement
  if (selectedHighlights.length === 0) {
    const score = cognitiveStats.score || 0;
    selectedHighlights = [{
      type: 'encouragement',
      text: `Score achieved: ${score} — Every session trains your brain`,
      icon: '🧠',
      priority: 5
    }];
  }

  return selectedHighlights;
}

/**
 * Format highlight object into display string.
 * Story 14.1: Prepares highlight for UI rendering (Story 14.2).
 *
 * @param {Object} highlight - Highlight object from selectHighlights()
 * @returns {string} Formatted display string
 */
export function formatHighlightText(highlight) {
  if (!highlight) return '';

  // Icon + text format
  return `${highlight.icon} ${highlight.text}`;
}
