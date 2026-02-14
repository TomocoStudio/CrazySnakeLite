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
 * Stats remain visible indefinitely (no auto-close) - user can read as long
 * as needed. Cleanup happens automatically when game resets on Play Again.
 *
 * Accessibility: Stats persist on screen for screen reader users. Consider
 * ARIA live region announcements if adding future interactive elements.
 *
 * Sequence: stagger in → resolve → caller shows buttons → stats stay visible
 *
 * @param {object} gameState - Full game state with cognitiveStats
 * @returns {Promise} Resolves when stagger animation completes. Stats container
 *                    remains visible with full opacity, ready for user interaction.
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
