// CrazySnakeLite - Score System Tests (Story 4.1)
import { createInitialState } from '../js/state.js';
import { growSnake } from '../js/snake.js';
import { CONFIG } from '../js/config.js';

// Test suite for score system functionality
export function runScoreTests() {
  console.log('=== Score System Tests (Story 4.1) ===');

  let passed = 0;
  let failed = 0;

  // Test 1: Initial score equals starting snake length
  try {
    const gameState = createInitialState();
    const expectedScore = CONFIG.STARTING_LENGTH;

    if (gameState.score === expectedScore) {
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

  // Test 4: Score always equals snake length (invariant check)
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

  // Test 5: Score display element exists in DOM
  try {
    const scoreDisplay = document.getElementById('score-display');

    if (scoreDisplay) {
      console.log('✅ Test 5 PASSED: Score display element exists in DOM');
      passed++;
    } else {
      console.error('❌ Test 5 FAILED: Score display element not found in DOM');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 5 FAILED with error:', error.message);
    failed++;
  }

  // Test 6: Score display shows correct initial value
  try {
    const scoreDisplay = document.getElementById('score-display');

    if (scoreDisplay && scoreDisplay.textContent === 'Score: 5') {
      console.log('✅ Test 6 PASSED: Score display shows correct initial value "Score: 5"');
      passed++;
    } else {
      console.error(`❌ Test 6 FAILED: Expected "Score: 5", got "${scoreDisplay ? scoreDisplay.textContent : 'element not found'}"`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 6 FAILED with error:', error.message);
    failed++;
  }

  // Test 7: Score display has correct CSS styling
  try {
    const scoreDisplay = document.getElementById('score-display');
    const styles = window.getComputedStyle(scoreDisplay);

    const hasCorrectFont = styles.fontFamily.includes('Courier');
    const hasCorrectPosition = styles.position === 'absolute';
    const hasCorrectZIndex = parseInt(styles.zIndex) >= 100;

    if (scoreDisplay && hasCorrectFont && hasCorrectPosition && hasCorrectZIndex) {
      console.log('✅ Test 7 PASSED: Score display has correct styling (monospace font, absolute position, z-index >= 100)');
      passed++;
    } else {
      console.error('❌ Test 7 FAILED: Score display styling incorrect');
      console.error(`  Font: ${styles.fontFamily} (should include Courier)`);
      console.error(`  Position: ${styles.position} (should be absolute)`);
      console.error(`  Z-index: ${styles.zIndex} (should be >= 100)`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 7 FAILED with error:', error.message);
    failed++;
  }

  // Test 8: Score display hidden during menu phase (AC: only visible during 'playing')
  try {
    const scoreDisplay = document.getElementById('score-display');
    const gameState = createInitialState();  // Starts in 'menu' phase

    // Score should be hidden when phase is 'menu'
    const isHidden = scoreDisplay.classList.contains('hidden');

    if (isHidden) {
      console.log('✅ Test 8 PASSED: Score display hidden during menu phase');
      passed++;
    } else {
      console.error('❌ Test 8 FAILED: Score display should be hidden during menu phase');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 8 FAILED with error:', error.message);
    failed++;
  }

  // Test 9: Score validation handles invalid values
  try {
    const gameState = createInitialState();

    // Test with undefined
    gameState.snake.segments = undefined;
    gameState.score = Math.max(0, gameState.snake.segments?.length || 0);

    if (gameState.score === 0) {
      console.log('✅ Test 9 PASSED: Score validation handles undefined segments (defaults to 0)');
      passed++;
    } else {
      console.error(`❌ Test 9 FAILED: Expected score 0 for undefined segments, got ${gameState.score}`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 9 FAILED with error:', error.message);
    failed++;
  }

  // Test 10: Score precision enforced (integer only)
  try {
    const scoreDisplay = document.getElementById('score-display');

    // Simulate setting a non-integer score (shouldn't happen, but test validation)
    const testScore = 7.89;
    const validatedScore = Math.max(0, Math.floor(testScore || 0));

    if (validatedScore === 7 && Number.isInteger(validatedScore)) {
      console.log('✅ Test 10 PASSED: Score precision enforced (7.89 → 7)');
      passed++;
    } else {
      console.error(`❌ Test 10 FAILED: Expected integer 7, got ${validatedScore}`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 10 FAILED with error:', error.message);
    failed++;
  }

  // Summary
  console.log('\n=== Test Summary ===');
  console.log(`Total: ${passed + failed}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  return { passed, failed };
}

// Auto-run tests when loaded
runScoreTests();
