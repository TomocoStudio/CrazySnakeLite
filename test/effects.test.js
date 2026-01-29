// Test file for effects.js
import { applyEffect, clearEffect, isEffectActive, getActiveEffect, EFFECT_TYPES } from '../js/effects.js';
import { createInitialState } from '../js/state.js';
import { CONFIG } from '../js/config.js';

console.log('=== Running effects.js tests ===');

// Test EFFECT_TYPES constant
console.log('\n--- EFFECT_TYPES Constant Tests ---');
assert.equal(EFFECT_TYPES.INVINCIBILITY, 'invincibility', 'EFFECT_TYPES.INVINCIBILITY should be "invincibility"');
assert.equal(EFFECT_TYPES.WALL_PHASE, 'wallPhase', 'EFFECT_TYPES.WALL_PHASE should be "wallPhase"');
assert.equal(EFFECT_TYPES.SPEED_BOOST, 'speedBoost', 'EFFECT_TYPES.SPEED_BOOST should be "speedBoost"');
assert.equal(EFFECT_TYPES.SPEED_DECREASE, 'speedDecrease', 'EFFECT_TYPES.SPEED_DECREASE should be "speedDecrease"');
assert.equal(EFFECT_TYPES.REVERSE_CONTROLS, 'reverseControls', 'EFFECT_TYPES.REVERSE_CONTROLS should be "reverseControls"');

// Test applyEffect function
console.log('\n--- applyEffect() Tests ---');
{
  const gameState = createInitialState();
  applyEffect(gameState, EFFECT_TYPES.INVINCIBILITY);
  assert.equal(
    gameState.activeEffect.type,
    'invincibility',
    'applyEffect should set activeEffect.type to "invincibility"'
  );
  assert.equal(
    gameState.activeEffect.speedMultiplier,
    1.0,
    'Non-speed effects should have speedMultiplier of 1.0'
  );
  assert.equal(
    gameState.snake.color,
    CONFIG.COLORS.snakeInvincibility,
    'applyEffect should set snake color to invincibility color (yellow)'
  );
}

{
  const gameState = createInitialState();
  applyEffect(gameState, EFFECT_TYPES.WALL_PHASE);
  assert.equal(
    gameState.snake.color,
    CONFIG.COLORS.snakeWallPhase,
    'applyEffect should set snake color to wallPhase color (purple)'
  );
}

{
  const gameState = createInitialState();
  applyEffect(gameState, EFFECT_TYPES.SPEED_BOOST);
  assert.equal(
    gameState.snake.color,
    CONFIG.COLORS.snakeSpeedBoost,
    'applyEffect should set snake color to speedBoost color (red)'
  );
}

{
  const gameState = createInitialState();
  applyEffect(gameState, EFFECT_TYPES.SPEED_DECREASE);
  assert.equal(
    gameState.snake.color,
    CONFIG.COLORS.snakeSpeedDecrease,
    'applyEffect should set snake color to speedDecrease color (cyan)'
  );
}

{
  const gameState = createInitialState();
  applyEffect(gameState, EFFECT_TYPES.REVERSE_CONTROLS);
  assert.equal(
    gameState.snake.color,
    CONFIG.COLORS.snakeReverseControls,
    'applyEffect should set snake color to reverseControls color (orange)'
  );
}

// Test that applyEffect clears previous effect first
{
  const gameState = createInitialState();
  applyEffect(gameState, EFFECT_TYPES.INVINCIBILITY);
  assert.equal(gameState.snake.color, CONFIG.COLORS.snakeInvincibility, 'First effect should be invincibility (yellow)');

  applyEffect(gameState, EFFECT_TYPES.WALL_PHASE);
  assert.equal(
    gameState.activeEffect.type,
    'wallPhase',
    'applyEffect should replace previous effect with new one'
  );
  assert.equal(
    gameState.snake.color,
    CONFIG.COLORS.snakeWallPhase,
    'Snake color should change to new effect color (purple), not stay yellow'
  );
}

// Test invalid effect type
{
  const gameState = createInitialState();
  applyEffect(gameState, 'invalidEffect');
  assert.isNull(gameState.activeEffect, 'applyEffect should not set activeEffect for invalid effect type');
  assert.equal(gameState.snake.color, CONFIG.COLORS.snakeDefault, 'Snake color should remain default for invalid effect');
}

// Test clearEffect function
console.log('\n--- clearEffect() Tests ---');
{
  const gameState = createInitialState();
  applyEffect(gameState, EFFECT_TYPES.INVINCIBILITY);
  assert.notEqual(gameState.activeEffect, null, 'Effect should be active before clearing');

  clearEffect(gameState);
  assert.isNull(gameState.activeEffect, 'clearEffect should set activeEffect to null');
  assert.equal(
    gameState.snake.color,
    CONFIG.COLORS.snakeDefault,
    'clearEffect should reset snake color to default (black)'
  );
}

// Test isEffectActive function
console.log('\n--- isEffectActive() Tests ---');
{
  const gameState = createInitialState();
  assert.isFalse(
    isEffectActive(gameState, EFFECT_TYPES.INVINCIBILITY),
    'isEffectActive should return false when no effect is active'
  );

  applyEffect(gameState, EFFECT_TYPES.INVINCIBILITY);
  assert.isTrue(
    isEffectActive(gameState, EFFECT_TYPES.INVINCIBILITY),
    'isEffectActive should return true for active invincibility effect'
  );
  assert.isFalse(
    isEffectActive(gameState, EFFECT_TYPES.WALL_PHASE),
    'isEffectActive should return false for non-active effect'
  );
}

// Test getActiveEffect function
console.log('\n--- getActiveEffect() Tests ---');
{
  const gameState = createInitialState();
  assert.isNull(getActiveEffect(gameState), 'getActiveEffect should return null when no effect is active');

  applyEffect(gameState, EFFECT_TYPES.SPEED_BOOST);
  const activeEffect = getActiveEffect(gameState);
  assert.equal(
    activeEffect.type,
    'speedBoost',
    'getActiveEffect should return the active effect object with correct type'
  );
  assert.isTrue(
    activeEffect.speedMultiplier >= 1.5 && activeEffect.speedMultiplier <= 2.0,
    'Speed boost should have speedMultiplier between 1.5 and 2.0'
  );
}

// Test effect persistence
console.log('\n--- Effect Persistence Tests ---');
{
  const gameState = createInitialState();
  applyEffect(gameState, EFFECT_TYPES.INVINCIBILITY);

  // Simulate time passing (effect should remain)
  setTimeout(() => {}, 100);

  assert.equal(
    gameState.activeEffect.type,
    'invincibility',
    'Effect should persist over time (not time-based clearing)'
  );
  assert.equal(
    gameState.snake.color,
    CONFIG.COLORS.snakeInvincibility,
    'Snake color should remain effect color over time'
  );
}

console.log('\n=== Effects tests complete ===');
