// CrazySnakeLite - Effect System Module
// Manages food effect application, clearing, and state checking
import { CONFIG } from './config.js';

// Effect type constants
export const EFFECT_TYPES = {
  INVINCIBILITY: 'invincibility',
  WALL_PHASE: 'wallPhase',
  SPEED_BOOST: 'speedBoost',
  SPEED_DECREASE: 'speedDecrease',
  REVERSE_CONTROLS: 'reverseControls'
};

/**
 * Apply effect to game state
 * Clears previous effect first, then applies new effect
 * UPDATED in Story 2.4: Add speed multiplier for speed effects
 * UPDATED in Story 7.1: Reset wallPhaseUsed flag when Wall Phase activates
 */
export function applyEffect(gameState, effectType) {
  // Validate effect type
  const validTypes = Object.values(EFFECT_TYPES);
  if (!validTypes.includes(effectType)) {
    console.warn(`Invalid effect type: ${effectType}`);
    return;
  }

  // Clear previous effect first
  clearEffect(gameState);

  // Calculate speed multiplier for speed effects
  let speedMultiplier = 1.0;  // Default (no speed change)

  if (effectType === EFFECT_TYPES.SPEED_BOOST) {
    // Random between 1.5x and 2.0x
    speedMultiplier = CONFIG.SPEED_BOOST_MIN +
                 Math.random() * (CONFIG.SPEED_BOOST_MAX - CONFIG.SPEED_BOOST_MIN);
  } else if (effectType === EFFECT_TYPES.SPEED_DECREASE) {
    // Random between 0.3x and 0.5x
    speedMultiplier = CONFIG.SPEED_DECREASE_MIN +
                 Math.random() * (CONFIG.SPEED_DECREASE_MAX - CONFIG.SPEED_DECREASE_MIN);
  }

  // Apply new effect
  gameState.activeEffect = {
    type: effectType,
    speedMultiplier: speedMultiplier  // NEW in Story 2.4
  };

  // Note: wallPhaseUsed reset is now handled in game.js after scoring (Story 7.1)

  // Story 11.1: Set reverseControlsActive flag for RC survival tracking
  if (effectType === EFFECT_TYPES.REVERSE_CONTROLS) {
    gameState.effects.reverseControlsActive = true;
    console.log('[Effects] reverseControlsActive = TRUE (RC activated)');

    // Story 13.4: Track RC start event for cognitive flexibility metric
    gameState.metricsTracking.rawEvents.push({
      type: 'rc_start',
      timestamp: Date.now()
    });
  }

  // Update snake color based on effect
  updateSnakeColor(gameState);
}

/**
 * Clear active effect
 * Sets activeEffect to null and resets snake color to default
 * UPDATED in Story 7.1: Do NOT reset wallPhaseUsed here - it's reset in game.js after scoring
 */
export function clearEffect(gameState) {
  gameState.activeEffect = null;

  // Note: wallPhaseUsed is NOT reset here - it must persist until next food is eaten
  // and bonus is awarded in game.js (Story 7.1)

  // Story 11.1: Clear reverseControlsActive flag when effect ends
  if (gameState.effects.reverseControlsActive) {
    console.log('[Effects] reverseControlsActive = FALSE (effect cleared)');

    // Story 13.4: Track RC end event for cognitive flexibility metric
    gameState.metricsTracking.rawEvents.push({
      type: 'rc_end',
      timestamp: Date.now()
    });
  }
  gameState.effects.reverseControlsActive = false;

  // Reset snake color to default
  gameState.snake.color = CONFIG.COLORS.snakeDefault;
}

/**
 * Check if specific effect is active
 * UPDATED: Also checks combo.effectB for dual effect mode
 */
export function isEffectActive(gameState, effectType) {
  // Check Effect A (activeEffect)
  const effectAActive = gameState.activeEffect !== null &&
                        gameState.activeEffect.type === effectType;

  // Check Effect B (combo dual effect mode)
  const effectBActive = gameState.combo?.active &&
                        gameState.combo?.foodCount === 2 &&
                        gameState.combo?.effectB?.type === effectType;

  return effectAActive || effectBActive;
}

/**
 * Get active effect (or null)
 */
export function getActiveEffect(gameState) {
  return gameState.activeEffect;
}

/**
 * Update snake color based on active effect
 * Internal helper function
 */
function updateSnakeColor(gameState) {
  const effect = gameState.activeEffect;

  if (!effect) {
    gameState.snake.color = CONFIG.COLORS.snakeDefault;
    return;
  }

  // Map effect type to snake color
  switch (effect.type) {
    case EFFECT_TYPES.INVINCIBILITY:
      gameState.snake.color = CONFIG.COLORS.snakeInvincibility;  // Yellow
      break;
    case EFFECT_TYPES.WALL_PHASE:
      gameState.snake.color = CONFIG.COLORS.snakeWallPhase;  // Purple
      break;
    case EFFECT_TYPES.SPEED_BOOST:
      gameState.snake.color = CONFIG.COLORS.snakeSpeedBoost;  // Red
      break;
    case EFFECT_TYPES.SPEED_DECREASE:
      gameState.snake.color = CONFIG.COLORS.snakeSpeedDecrease;  // Cyan
      break;
    case EFFECT_TYPES.REVERSE_CONTROLS:
      gameState.snake.color = CONFIG.COLORS.snakeReverseControls;  // Orange
      break;
    default:
      gameState.snake.color = CONFIG.COLORS.snakeDefault;
  }
}
