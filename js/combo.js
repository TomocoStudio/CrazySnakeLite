// CrazySnakeLite - Combo Mode Module
// Story 10.1: Probability-based combo activation

import { CONFIG } from './config.js';
import { getFoodScore } from './scoring.js';

// Cache canvas element for performance (Issue #8 fix)
let cachedCanvas = null;

function getCanvas() {
  if (!cachedCanvas) {
    cachedCanvas = document.getElementById('game-canvas');
  }
  return cachedCanvas;
}

/**
 * Activate combo mode with the given food as Effect A
 * Story 10.1: Set combo state, store Effect A, initialize food count
 * Story 10.2: Canvas color transition (implemented in 10.1)
 * @param {object} food - The food that triggered combo
 * @param {object} gameState - Game state
 */
export function activateCombo(food, gameState) {
  // Issue #9 fix: Validate food parameter
  if (!food || !food.type) {
    console.error('[Combo] activateCombo() called with invalid food:', food);
    return;
  }

  // Set combo active
  gameState.combo.active = true;

  // Store Effect A (current food)
  // Issue #2 fix: Use canonical getFoodScore() from scoring.js instead of duplicated code
  gameState.combo.effectA = {
    type: food.type,
    points: getFoodScore(food.type)
  };

  // Reset food count (this is food #1)
  gameState.combo.foodCount = 1;

  // Story 13.7: Track combo start event for working memory metric
  gameState.metricsTracking.rawEvents.push({
    type: 'combo_start',
    timestamp: Date.now()
  });

  // Story 10.2: Select random canvas color (stored but not applied - grid inversion used instead)
  const colors = CONFIG.COMBO_CANVAS_COLORS;
  gameState.combo.canvasColor = colors[Math.floor(Math.random() * colors.length)];

  // NOTE: Canvas background color handled by render.js clearCanvas() using grid inversion
  // Combo mode uses subtle color inversion (232↔216) instead of dark colors
}

/**
 * Check if combo mode is currently active
 * Story 10.1: Used to prevent double activation
 * @param {object} gameState - Game state
 * @returns {boolean} True if combo active
 */
export function isComboActive(gameState) {
  return gameState.combo.active;
}

/**
 * Exit combo mode and reset canvas to default color
 * Story 10.2: Smooth 500ms transition back to light grey
 * @param {object} gameState - Game state
 */
export function exitCombo(gameState) {
  // NOTE: Canvas background color handled by render.js clearCanvas() using grid inversion
  // No need to manually reset canvas.style.backgroundColor

  // Story 13.7: Track combo end event for working memory metric
  gameState.metricsTracking.rawEvents.push({
    type: 'combo_end',
    timestamp: Date.now()
  });

  // Reset combo state
  gameState.combo.active = false;
  gameState.combo.effectA = null;
  gameState.combo.effectB = null;
  gameState.combo.canvasColor = null;
  gameState.combo.foodCount = 0;
}
