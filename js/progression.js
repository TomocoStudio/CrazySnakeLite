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
