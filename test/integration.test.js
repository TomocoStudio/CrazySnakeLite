// Integration test for effect system
import { applyEffect, clearEffect, EFFECT_TYPES } from '../js/effects.js';
import { createInitialState, resetGame } from '../js/state.js';
import { CONFIG } from '../js/config.js';

console.log('=== Running integration tests ===');

// Test complete effect lifecycle
console.log('\n--- Effect Lifecycle Integration Test ---');
{
  const gameState = createInitialState();
  console.log('Initial state:', gameState.activeEffect, gameState.snake.color);
  assert.isNull(gameState.activeEffect, 'Initial state should have no effect');
  assert.equal(gameState.snake.color, CONFIG.COLORS.snakeDefault, 'Initial snake color should be default');

  // Apply invincibility
  applyEffect(gameState, EFFECT_TYPES.INVINCIBILITY);
  console.log('After applying invincibility:', gameState.activeEffect, gameState.snake.color);
  assert.equal(gameState.activeEffect.type, 'invincibility', 'Should have invincibility effect');
  assert.equal(gameState.snake.color, CONFIG.COLORS.snakeInvincibility, 'Snake should be yellow');

  // Apply different effect (replaces previous)
  applyEffect(gameState, EFFECT_TYPES.SPEED_BOOST);
  console.log('After applying speed boost:', gameState.activeEffect, gameState.snake.color);
  assert.equal(gameState.activeEffect.type, 'speedBoost', 'Should have speedBoost effect');
  assert.equal(gameState.snake.color, CONFIG.COLORS.snakeSpeedBoost, 'Snake should be red');

  // Clear effect
  clearEffect(gameState);
  console.log('After clearing effect:', gameState.activeEffect, gameState.snake.color);
  assert.isNull(gameState.activeEffect, 'Effect should be cleared');
  assert.equal(gameState.snake.color, CONFIG.COLORS.snakeDefault, 'Snake should be back to default color');
}

// Test game reset clears effects
console.log('\n--- Game Reset Integration Test ---');
{
  const gameState = createInitialState();

  // Apply effect
  applyEffect(gameState, EFFECT_TYPES.WALL_PHASE);
  assert.equal(gameState.activeEffect.type, 'wallPhase', 'Effect should be active before reset');
  assert.equal(gameState.snake.color, CONFIG.COLORS.snakeWallPhase, 'Snake should be purple');

  // Reset game
  gameState.highScore = 100;
  resetGame(gameState);

  assert.isNull(gameState.activeEffect, 'Effect should be cleared after game reset');
  assert.equal(gameState.snake.color, CONFIG.COLORS.snakeDefault, 'Snake color should be default after reset');
  assert.equal(gameState.highScore, 100, 'High score should be preserved');
}

// Test all 5 effect types
console.log('\n--- All Effect Types Test ---');
{
  const effectTests = [
    { type: EFFECT_TYPES.INVINCIBILITY, color: CONFIG.COLORS.snakeInvincibility, name: 'invincibility' },
    { type: EFFECT_TYPES.WALL_PHASE, color: CONFIG.COLORS.snakeWallPhase, name: 'wallPhase' },
    { type: EFFECT_TYPES.SPEED_BOOST, color: CONFIG.COLORS.snakeSpeedBoost, name: 'speedBoost' },
    { type: EFFECT_TYPES.SPEED_DECREASE, color: CONFIG.COLORS.snakeSpeedDecrease, name: 'speedDecrease' },
    { type: EFFECT_TYPES.REVERSE_CONTROLS, color: CONFIG.COLORS.snakeReverseControls, name: 'reverseControls' }
  ];

  effectTests.forEach(test => {
    const gameState = createInitialState();
    applyEffect(gameState, test.type);
    assert.equal(gameState.activeEffect.type, test.name, `Effect type should be ${test.name}`);
    assert.equal(gameState.snake.color, test.color, `Snake color should match ${test.name} color`);
  });
}

// Test effect replacement (growing food scenario)
console.log('\n--- Growing Food Clears Effect Test ---');
{
  const gameState = createInitialState();

  // Apply effect
  applyEffect(gameState, EFFECT_TYPES.INVINCIBILITY);
  assert.notEqual(gameState.activeEffect, null, 'Effect should be active');

  // Simulate eating growing food (clears effect)
  clearEffect(gameState);
  assert.isNull(gameState.activeEffect, 'Growing food should clear effect');
  assert.equal(gameState.snake.color, CONFIG.COLORS.snakeDefault, 'Snake should be default color after eating growing food');
}

console.log('\n=== Integration tests complete ===');
