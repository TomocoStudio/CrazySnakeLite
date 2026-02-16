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
 * Show cognitive stats on game over screen with stagger animation.
 * Returns Promise that resolves when stagger animation completes, allowing
 * caller to show Play Again/Menu buttons after stats finish animating in.
 *
 * Design Decision (Code Review 2026-02-16): Stats remain visible indefinitely
 * (no auto-close, no fade-out). Original AC specified 2.5s hold + 500ms fade,
 * but this was intentionally changed for:
 * - Accessibility: screen reader users can read at their own pace
 * - UX: players aren't rushed to absorb cognitive feedback
 * - Cleanup: stats DOM cleared automatically on game reset (Play Again/Menu)
 *
 * Sequence: stagger in → resolve → caller shows buttons → stats stay visible
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
 * Hide cognitive stats with fade-out animation.
 * Currently unused in normal game flow (stats persist until game reset).
 * Retained for future use if timed fade-out is reintroduced.
 * Story 11.4: Applies .fade-out class for smooth 500ms transition.
 * Story 11.6: Instant disappearance if reduced motion mode active.
 */
export function hideCognitiveStats() {
  const container = document.querySelector('.cognitive-stats');
  const header = document.querySelector('.cognitive-stats-header');
  const lines = document.querySelectorAll('.cognitive-stat-line');

  if (!container || !header) {
    return;
  }

  // Story 11.6: Check reduced motion mode
  if (CONFIG.REDUCED_MOTION) {
    // Reduced motion: instant disappearance
    container.classList.add('hidden');
  } else {
    // Normal: fade-out animation
    header.classList.add('fade-out');
    lines.forEach(line => line.classList.add('fade-out'));

    // Hide container after fade completes
    setTimeout(() => {
      container.classList.add('hidden');
      // Clean up fade-out classes for next time
      header.classList.remove('fade-out');
      lines.forEach(line => line.classList.remove('fade-out'));
    }, CONFIG.COGNITIVE_STATS_DISPLAY.fadeDuration);
  }
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
