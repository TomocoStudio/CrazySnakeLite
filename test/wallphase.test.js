// Test file for wall-phase food (Story 2.3)
import { checkWallCollision, checkSelfCollision } from '../js/collision.js';
import { applyEffect, clearEffect, EFFECT_TYPES } from '../js/effects.js';
import { createInitialState } from '../js/state.js';
import { CONFIG } from '../js/config.js';

console.log('=== Running wall-phase tests ===');

// Test wall collision returns false with wall-phase
console.log('\n--- Wall Collision with Wall-Phase Tests ---');
{
  const gameState = createInitialState();

  // Position snake at wall boundary
  gameState.snake.segments[0] = { x: -1, y: 10 };

  // Without wall-phase - should collide
  const collisionWithout = checkWallCollision(gameState);
  assert.isTrue(collisionWithout, 'Snake should die at wall without wall-phase');

  // With wall-phase - should NOT collide (wrapping happens elsewhere)
  applyEffect(gameState, EFFECT_TYPES.WALL_PHASE);
  const collisionWith = checkWallCollision(gameState);
  assert.isFalse(collisionWith, 'Snake should NOT die at wall with wall-phase');
}

// Test self-collision still works with wall-phase
console.log('\n--- Self-Collision with Wall-Phase Tests ---');
{
  const gameState = createInitialState();

  // Position snake head on body
  gameState.snake.segments = [
    { x: 5, y: 5 },  // Head
    { x: 6, y: 5 },
    { x: 7, y: 5 },
    { x: 7, y: 6 },
    { x: 6, y: 6 },
    { x: 5, y: 6 },
    { x: 5, y: 5 }   // Body at same position as head
  ];

  // With wall-phase - should STILL collide (wall-phase ≠ invincibility)
  applyEffect(gameState, EFFECT_TYPES.WALL_PHASE);
  const collision = checkSelfCollision(gameState);
  assert.isTrue(collision, 'Snake should STILL die on self-collision with wall-phase (no self-immunity)');
}

// Test snake color when wall-phase applied
console.log('\n--- Wall-Phase Color Tests ---');
{
  const gameState = createInitialState();

  applyEffect(gameState, EFFECT_TYPES.WALL_PHASE);
  assert.equal(
    gameState.snake.color,
    CONFIG.COLORS.snakeWallPhase,
    'Snake should turn purple when wall-phase applied'
  );
}

console.log('\n=== Wall-phase tests complete ===');
