// CrazySnakeLite - Progression & Difficulty Scaling Module
// Story 8.2: Score-based blinking food probability

import { CONFIG } from './config.js';

/**
 * Calculate blinking probability based on current score
 * Story 8.2: Progressive difficulty scaling (0% → 60% cap)
 * @param {number} score - Current game score
 * @returns {number} Probability (0.0 to 0.6) that food should blink
 */
export function getBlinkingProbability(score) {
  for (const threshold of CONFIG.BLINKING_THRESHOLDS) {
    if (score >= threshold.minScore && score <= threshold.maxScore) {
      return threshold.probability;
    }
  }

  // Fallback: if score exceeds all thresholds, return max probability (60%)
  return 0.6;
}

/**
 * Get difficulty tier name for analytics/debugging
 * Story 8.2: Optional helper for understanding current difficulty
 * @param {number} score - Current game score
 * @returns {string} Tier name ('beginner', 'novice', 'intermediate', 'advanced', 'expert')
 */
export function getDifficultyTier(score) {
  if (score < 15) return 'beginner';      // 0% blinking
  if (score < 30) return 'novice';        // 10-20% blinking
  if (score < 60) return 'intermediate';  // 30-40% blinking
  if (score < 80) return 'advanced';      // 50% blinking
  return 'expert';                        // 60% blinking (capped)
}

/**
 * Calculate combo activation probability based on current score
 * Story 10.1: Progressive combo probability (0% → 40% cap)
 * @param {number} score - Current game score
 * @returns {number} Probability (0.0 to 0.4) that combo should activate
 */
export function getComboProbability(score) {
  for (const tier of CONFIG.COMBO_PROBABILITIES) {
    if (score >= tier.minScore && score <= tier.maxScore) {
      return tier.probability;
    }
  }

  // Fallback: return max probability (40%)
  return 0.4;
}

/**
 * Generic threshold resolver - resolves score to tier value
 * Story 19.1: Supports multiple field types (blur, background, gridLine, opacity, probability, value)
 * @param {number} score - Current game score
 * @param {Array} thresholds - Threshold array with {minScore, maxScore, fieldName}
 * @returns {*} Resolved value (can be number, string, object, etc.)
 */
function resolveThreshold(score, thresholds) {
  // Handle edge case: negative scores
  const normalizedScore = Math.max(0, score);

  for (const tier of thresholds) {
    if (normalizedScore >= tier.minScore && normalizedScore <= tier.maxScore) {
      // Return the first defined field value (supports multiple field name patterns)
      const value = tier.value ?? tier.probability ?? tier.blur ?? tier.background ?? tier.gridLine ?? tier.opacity;

      // If no specific value field found, return the entire tier object (e.g., for PHONE_CALL_TIERS)
      return value !== undefined ? value : tier;
    }
  }

  // Fallback: return the last tier's value (max tier for scores exceeding all thresholds)
  const lastTier = thresholds[thresholds.length - 1];
  const fallbackValue = lastTier.value ?? lastTier.probability ?? lastTier.blur ?? lastTier.background ?? lastTier.gridLine ?? lastTier.opacity;
  return fallbackValue !== undefined ? fallbackValue : lastTier;
}

/**
 * Get current progression state for all 8 visual/gameplay fields
 * Story 19.1: Unified progression system (3 existing + 5 new visual fields)
 * @param {number} score - Current game score
 * @returns {Object} Current state with 8 fields:
 *   - speed, phoneFrequency, effectChance (existing V1/V2 fields)
 *   - glowIntensity, gridOpacity, backgroundColor, gridLineColor, gridDotOpacity (new V4 visual fields)
 */
export function getState(score) {
  return {
    // Existing fields (V1/V2) - using existing threshold patterns
    // Note: These use the legacy specific functions for now (backward compatibility)
    speed: resolveThreshold(score, CONFIG.BLINKING_THRESHOLDS), // Placeholder - actual speed thresholds TBD
    phoneFrequency: resolveThreshold(score, CONFIG.PHONE_CALL_TIERS), // Placeholder - returns tier object
    effectChance: resolveThreshold(score, CONFIG.COMBO_PROBABILITIES),

    // New visual fields (V4) - Story 19.1
    glowIntensity: resolveThreshold(score, CONFIG.GLOW_INTENSITY_THRESHOLDS),
    gridOpacity: resolveThreshold(score, CONFIG.GRID_OPACITY_THRESHOLDS),
    backgroundColor: resolveThreshold(score, CONFIG.BACKGROUND_THRESHOLDS),
    gridLineColor: resolveThreshold(score, CONFIG.GRID_LINE_THRESHOLDS),
    gridDotOpacity: resolveThreshold(score, CONFIG.GRID_DOT_OPACITY_THRESHOLDS)
  };
}
