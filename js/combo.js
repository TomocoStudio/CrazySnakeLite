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

  // Story 10.2: Select random canvas color
  const colors = CONFIG.COMBO_CANVAS_COLORS;
  gameState.combo.canvasColor = colors[Math.floor(Math.random() * colors.length)];

  // Story 10.2: Apply canvas color transition (500ms smooth fade)
  // Issue #4 fix: Add null check for canvas element
  const canvas = getCanvas();
  if (canvas) {
    canvas.style.transition = 'background-color 500ms ease-in-out';
    canvas.style.backgroundColor = gameState.combo.canvasColor;
  }
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
  // Transition canvas back to default color
  // Issue #4 fix: Add null check for canvas element
  const canvas = getCanvas();
  if (canvas) {
    canvas.style.transition = 'background-color 500ms ease-in-out';
    canvas.style.backgroundColor = CONFIG.DEFAULT_CANVAS_COLOR;
  }

  // Reset combo state
  gameState.combo.active = false;
  gameState.combo.effectA = null;
  gameState.combo.effectB = null;
  gameState.combo.canvasColor = null;
  gameState.combo.foodCount = 0;
}
