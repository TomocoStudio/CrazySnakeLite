// CrazySnakeLite - Scoring Module
// Pure calculation functions for food scoring (Story 7.1 - v2)
import { CONFIG } from './config.js';

/**
 * Get the base score value for a food type
 * @param {string} foodType - Type of food eaten
 * @returns {number} - Score value
 */
export function getFoodScore(foodType) {
  return CONFIG.SCORING.FOOD[foodType] || 0;
}

/**
 * Get the Wall Phase bonus value
 * Awarded immediately when snake crosses wall during Wall Phase effect
 * @returns {number} - Bonus points (+2)
 */
export function getWallPhaseBonus() {
  return CONFIG.SCORING.WALL_PHASE_BONUS;
}
