// CrazySnakeLite - Wall Phase Scoring Integration Tests
// Story 7.1: Test Wall Phase +1/+3 conditional scoring

import { createInitialState } from '../js/state.js';
import { spawnFood } from '../js/food.js';
import { applyEffect, clearEffect } from '../js/effects.js';
import { getFoodScore, getWallPhaseBonus } from '../js/scoring.js';
import { moveSnake } from '../js/snake.js';

const assert = window.assert;

console.log('\n=== Wall Phase Scoring Integration Tests ===\n');

// Test 1: Wall Phase food eaten without crossing wall = +1
console.log('Test 1: Wall Phase eaten without crossing wall');
{
  const gameState = createInitialState();
  gameState.phase = 'playing';
  spawnFood(gameState);

  // Eat Wall Phase food
  applyEffect(gameState, 'wallPhase');

  // Verify wallPhaseUsed is false initially
  assert.isTrue(gameState.effects.wallPhaseUsed === false, 'wallPhaseUsed starts as false');

  // Eat next food without crossing wall
  const score = calculateFoodScore('growing', gameState.effects.wallPhaseUsed);
  assert.equal(score, 1, 'Growing food after Wall Phase (no wall cross) = +1');
}

// Test 2: Wall Phase food + wall crossing = immediate +2 bonus (Story 7.1 - instant reward)
console.log('\nTest 2: Wall Phase eaten with wall crossing - instant bonus');
{
  const gameState = createInitialState();
  gameState.phase = 'playing';
  gameState.snake.direction = 'left';
  gameState.snake.nextDirection = 'left';
  spawnFood(gameState);

  // Eat Wall Phase food
  gameState.score = 10;  // Starting score
  const wallPhaseScore = getFoodScore('wallPhase');
  gameState.score += wallPhaseScore;
  assert.equal(gameState.score, 11, 'Score after eating Wall Phase = +1');

  // Apply Wall Phase effect
  applyEffect(gameState, 'wallPhase');

  // Move snake to left edge to trigger wall crossing
  gameState.snake.segments[0].x = 0;
  gameState.snake.segments[0].y = 10;

  // This should wrap and award +2 bonus immediately
  moveSnake(gameState);

  // Score should now be 13 (11 + 2 bonus)
  assert.equal(gameState.score, 13, 'Score after wall crossing = +2 bonus (instant reward)');
}

// Test 3: Wall Phase bonus only awarded once (single-use effect)
console.log('\nTest 3: Wall Phase is single-use - bonus awarded once');
{
  const gameState = createInitialState();
  gameState.phase = 'playing';
  gameState.snake.direction = 'left';
  gameState.snake.nextDirection = 'left';
  spawnFood(gameState);

  gameState.score = 10;

  // Apply Wall Phase effect
  applyEffect(gameState, 'wallPhase');
  assert.isTrue(gameState.activeEffect !== null, 'Wall Phase effect is active');

  // Move snake to wall
  gameState.snake.segments[0].x = 0;
  moveSnake(gameState);  // Wraps and awards +2 bonus

  assert.equal(gameState.score, 12, 'Score = 10 + 2 bonus = 12');
  assert.isTrue(gameState.activeEffect === null, 'Wall Phase effect cleared after single use');

  // Moving to wall again should NOT wrap (no effect active)
  const scoreBefore = gameState.score;
  gameState.snake.segments[0].x = 0;
  // This would normally cause death without Wall Phase active
  // So we can't test wall wrapping without the effect
}

// Test 4: Wall Phase bonus value
console.log('\nTest 4: Wall Phase bonus is +2');
{
  const bonus = getWallPhaseBonus();
  assert.equal(bonus, 2, 'Wall Phase bonus = +2');
}

// Test 5: Wall Phase cleared after single use
console.log('\nTest 5: Wall Phase clears after crossing wall (single-use)');
{
  const gameState = createInitialState();
  gameState.phase = 'playing';
  gameState.snake.direction = 'left';
  gameState.snake.nextDirection = 'left';

  // Apply Wall Phase
  applyEffect(gameState, 'wallPhase');
  assert.isTrue(gameState.activeEffect !== null, 'Wall Phase active');
  assert.equal(gameState.activeEffect.type, 'wallPhase', 'Effect type is wallPhase');

  // Cross wall
  gameState.snake.segments[0].x = 0;
  moveSnake(gameState);

  // Effect should be cleared
  assert.isTrue(gameState.activeEffect === null, 'Wall Phase cleared after crossing wall');
}

console.log('\n=== Wall Phase Scoring Tests Complete ===\n');
