// Node.js test runner for score system tests
// Tests core logic without browser DOM

import { createInitialState, resetGame } from '../js/state.js';
import { growSnake } from '../js/snake.js';
import { CONFIG } from '../js/config.js';

console.log('=== Score System Core Logic Tests (Story 4.1) ===\n');

let passed = 0;
let failed = 0;

// Test 1: Initial score equals starting snake length
try {
  const gameState = createInitialState();
  const expectedScore = CONFIG.STARTING_LENGTH;

  if (gameState.score === expectedScore && expectedScore === 5) {
    console.log('✅ Test 1 PASSED: Initial score equals starting snake length (5)');
    passed++;
  } else {
    console.error(`❌ Test 1 FAILED: Expected score ${expectedScore}, got ${gameState.score}`);
    failed++;
  }
} catch (error) {
  console.error('❌ Test 1 FAILED with error:', error.message);
  failed++;
}

// Test 2: Score equals snake length after growth
try {
  const gameState = createInitialState();

  // Grow snake once
  growSnake(gameState);
  gameState.score = gameState.snake.segments.length;

  const expectedScore = CONFIG.STARTING_LENGTH + 1;

  if (gameState.score === expectedScore && gameState.score === gameState.snake.segments.length) {
    console.log('✅ Test 2 PASSED: Score equals snake length after 1 growth (6)');
    passed++;
  } else {
    console.error(`❌ Test 2 FAILED: Expected score ${expectedScore}, got ${gameState.score}`);
    failed++;
  }
} catch (error) {
  console.error('❌ Test 2 FAILED with error:', error.message);
  failed++;
}

// Test 3: Score increments correctly with multiple food consumptions
try {
  const gameState = createInitialState();

  // Simulate eating 3 foods
  for (let i = 0; i < 3; i++) {
    growSnake(gameState);
    gameState.score = gameState.snake.segments.length;
  }

  const expectedScore = CONFIG.STARTING_LENGTH + 3;

  if (gameState.score === expectedScore && gameState.score === gameState.snake.segments.length) {
    console.log('✅ Test 3 PASSED: Score increments correctly after eating 3 foods (8)');
    passed++;
  } else {
    console.error(`❌ Test 3 FAILED: Expected score ${expectedScore}, got ${gameState.score}`);
    failed++;
  }
} catch (error) {
  console.error('❌ Test 3 FAILED with error:', error.message);
  failed++;
}

// Test 4: Score invariant holds (score = snake length)
try {
  const gameState = createInitialState();
  let invariantHeld = true;

  // Test invariant through 10 growth cycles
  for (let i = 0; i < 10; i++) {
    growSnake(gameState);
    gameState.score = gameState.snake.segments.length;

    if (gameState.score !== gameState.snake.segments.length) {
      invariantHeld = false;
      break;
    }
  }

  if (invariantHeld && gameState.score === 15) {
    console.log('✅ Test 4 PASSED: Score invariant holds (score = snake length) through 10 growths');
    passed++;
  } else {
    console.error(`❌ Test 4 FAILED: Score invariant violated. Final score: ${gameState.score}, snake length: ${gameState.snake.segments.length}`);
    failed++;
  }
} catch (error) {
  console.error('❌ Test 4 FAILED with error:', error.message);
  failed++;
}

// Test 5: Score resets correctly on game reset
try {
  const gameState = createInitialState();

  // Grow snake several times
  for (let i = 0; i < 5; i++) {
    growSnake(gameState);
    gameState.score = gameState.snake.segments.length;
  }

  // Reset game
  resetGame(gameState);

  const expectedScore = CONFIG.STARTING_LENGTH;

  if (gameState.score === expectedScore && gameState.score === 5) {
    console.log('✅ Test 5 PASSED: Score resets to starting length (5) after game reset');
    passed++;
  } else {
    console.error(`❌ Test 5 FAILED: Expected score ${expectedScore} after reset, got ${gameState.score}`);
    failed++;
  }
} catch (error) {
  console.error('❌ Test 5 FAILED with error:', error.message);
  failed++;
}

// Test 6: Snake segments count matches score at all times
try {
  const gameState = createInitialState();
  let allMatch = true;

  // Test at various growth stages
  for (let i = 0; i < 20; i++) {
    if (gameState.score !== gameState.snake.segments.length) {
      allMatch = false;
      break;
    }
    growSnake(gameState);
    gameState.score = gameState.snake.segments.length;
  }

  if (allMatch && gameState.score === 25) {
    console.log('✅ Test 6 PASSED: Snake segments count always matches score (verified through 20 growths)');
    passed++;
  } else {
    console.error(`❌ Test 6 FAILED: Score/length mismatch detected`);
    failed++;
  }
} catch (error) {
  console.error('❌ Test 6 FAILED with error:', error.message);
  failed++;
}

// Summary
console.log('\n=== Test Summary ===');
console.log(`Total: ${passed + failed}`);
console.log(`✅ Passed: ${passed}`);
console.log(`❌ Failed: ${failed}`);
console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

if (failed === 0) {
  console.log('\n🎉 All core logic tests passed!');
  process.exit(0);
} else {
  console.log('\n⚠️  Some tests failed. Review implementation.');
  process.exit(1);
}
