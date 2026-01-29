// Test file for invincibility food (Story 2.2)
import { checkWallCollision, checkSelfCollision } from '../js/collision.js';
import { applyEffect, clearEffect, EFFECT_TYPES } from '../js/effects.js';
import { createInitialState } from '../js/state.js';
import { CONFIG } from '../js/config.js';

console.log('=== Running invincibility tests ===');

// Test wall collision immunity
console.log('\n--- Wall Collision Immunity Tests ---');
{
  const gameState = createInitialState();

  // Position snake head at wall (out of bounds)
  gameState.snake.segments[0] = { x: -1, y: 10 };  // Left wall

  // Without invincibility - should collide
  const collisionWithoutEffect = checkWallCollision(gameState);
  assert.isTrue(collisionWithoutEffect, 'Snake should die at wall without invincibility');

  // With invincibility - should NOT collide
  applyEffect(gameState, EFFECT_TYPES.INVINCIBILITY);
  const collisionWithEffect = checkWallCollision(gameState);
  assert.isFalse(collisionWithEffect, 'Snake should NOT die at wall with invincibility');
}

{
  const gameState = createInitialState();

  // Position snake at right wall
  gameState.snake.segments[0] = { x: CONFIG.GRID_WIDTH, y: 10 };
  applyEffect(gameState, EFFECT_TYPES.INVINCIBILITY);

  const collision = checkWallCollision(gameState);
  assert.isFalse(collision, 'Snake should NOT die at right wall with invincibility');
}

{
  const gameState = createInitialState();

  // Position snake at top wall
  gameState.snake.segments[0] = { x: 10, y: -1 };
  applyEffect(gameState, EFFECT_TYPES.INVINCIBILITY);

  const collision = checkWallCollision(gameState);
  assert.isFalse(collision, 'Snake should NOT die at top wall with invincibility');
}

{
  const gameState = createInitialState();

  // Position snake at bottom wall
  gameState.snake.segments[0] = { x: 10, y: CONFIG.GRID_HEIGHT };
  applyEffect(gameState, EFFECT_TYPES.INVINCIBILITY);

  const collision = checkWallCollision(gameState);
  assert.isFalse(collision, 'Snake should NOT die at bottom wall with invincibility');
}

// Test self collision immunity
console.log('\n--- Self Collision Immunity Tests ---');
{
  const gameState = createInitialState();

  // Position snake head on its own body
  gameState.snake.segments = [
    { x: 5, y: 5 },  // Head
    { x: 6, y: 5 },
    { x: 7, y: 5 },
    { x: 7, y: 6 },
    { x: 6, y: 6 },
    { x: 5, y: 6 },
    { x: 5, y: 5 }   // Body segment at same position as head
  ];

  // Without invincibility - should collide
  const collisionWithoutEffect = checkSelfCollision(gameState);
  assert.isTrue(collisionWithoutEffect, 'Snake should die on self collision without invincibility');

  // With invincibility - should NOT collide
  applyEffect(gameState, EFFECT_TYPES.INVINCIBILITY);
  const collisionWithEffect = checkSelfCollision(gameState);
  assert.isFalse(collisionWithEffect, 'Snake should NOT die on self collision with invincibility');
}

// Test that invincibility clears properly
console.log('\n--- Invincibility Clear Tests ---');
{
  const gameState = createInitialState();

  // Apply invincibility
  applyEffect(gameState, EFFECT_TYPES.INVINCIBILITY);

  // Position at wall
  gameState.snake.segments[0] = { x: -1, y: 10 };

  // Should be immune
  assert.isFalse(checkWallCollision(gameState), 'Should be immune with invincibility');

  // Clear effect
  clearEffect(gameState);

  // Should now collide
  assert.isTrue(checkWallCollision(gameState), 'Should die at wall after invincibility cleared');
}

// Test STROBE_INTERVAL exists in config
console.log('\n--- Config Tests ---');
assert.equal(typeof CONFIG.STROBE_INTERVAL, 'number', 'CONFIG.STROBE_INTERVAL should be a number');
assert.equal(CONFIG.STROBE_INTERVAL, 100, 'CONFIG.STROBE_INTERVAL should be 100ms');

console.log('\n=== Invincibility tests complete ===');
