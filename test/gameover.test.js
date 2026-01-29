// CrazySnakeLite - Game Over Screen Tests (Story 4.3)
import { createInitialState, resetGame } from '../js/state.js';

// Test suite for game over screen functionality
export function runGameOverTests() {
  console.log('=== Game Over Screen Tests (Story 4.3) ===');

  let passed = 0;
  let failed = 0;

  // Test 1: Game over screen element exists
  try {
    const gameoverScreen = document.getElementById('gameover-screen');

    if (gameoverScreen) {
      console.log('✅ Test 1 PASSED: Game over screen element exists');
      passed++;
    } else {
      console.error('❌ Test 1 FAILED: Game over screen not found');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 1 FAILED with error:', error.message);
    failed++;
  }

  // Test 2: Game over title exists
  try {
    const title = document.querySelector('#gameover-screen h2');

    if (title && title.textContent === 'GAME OVER!') {
      console.log('✅ Test 2 PASSED: "GAME OVER!" title exists');
      passed++;
    } else {
      console.error('❌ Test 2 FAILED: Game over title incorrect or missing');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 2 FAILED with error:', error.message);
    failed++;
  }

  // Test 3: Final score display exists
  try {
    const scoreDisplay = document.querySelector('.final-score');
    const scoreValue = document.getElementById('score-value');

    if (scoreDisplay && scoreValue) {
      console.log('✅ Test 3 PASSED: Final score display elements exist');
      passed++;
    } else {
      console.error('❌ Test 3 FAILED: Score display elements missing');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 3 FAILED with error:', error.message);
    failed++;
  }

  // Test 4: Play Again button exists with selected class
  try {
    const playAgainBtn = document.getElementById('play-again-btn');

    if (playAgainBtn && playAgainBtn.classList.contains('selected')) {
      console.log('✅ Test 4 PASSED: Play Again button exists with "selected" class');
      passed++;
    } else {
      console.error('❌ Test 4 FAILED: Play Again button missing or not selected');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 4 FAILED with error:', error.message);
    failed++;
  }

  // Test 5: Menu button exists
  try {
    const menuBtn = document.getElementById('menu-btn');

    if (menuBtn) {
      console.log('✅ Test 5 PASSED: Menu button exists');
      passed++;
    } else {
      console.error('❌ Test 5 FAILED: Menu button not found');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 5 FAILED with error:', error.message);
    failed++;
  }

  // Test 6: New high score indicator exists
  try {
    const indicator = document.getElementById('new-high-score-indicator');

    if (indicator) {
      console.log('✅ Test 6 PASSED: New high score indicator exists');
      passed++;
    } else {
      console.error('❌ Test 6 FAILED: New high score indicator not found');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 6 FAILED with error:', error.message);
    failed++;
  }

  // Test 7: Game over screen has correct styling
  try {
    const gameoverScreen = document.getElementById('gameover-screen');
    const styles = window.getComputedStyle(gameoverScreen);

    const hasCorrectPosition = styles.position === 'absolute';
    const hasCorrectZIndex = parseInt(styles.zIndex) >= 100;

    if (hasCorrectPosition && hasCorrectZIndex) {
      console.log('✅ Test 7 PASSED: Game over screen has correct styling');
      passed++;
    } else {
      console.error('❌ Test 7 FAILED: Game over screen styling incorrect');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 7 FAILED with error:', error.message);
    failed++;
  }

  // Test 8: Play Again performance test (full flow < 100ms per AC)
  try {
    const gameState = createInitialState();
    gameState.phase = 'gameover';

    const startTime = performance.now();

    // Simulate full Play Again flow: reset + start new game
    for (let i = 0; i < 10; i++) {
      resetGame(gameState);
      gameState.phase = 'playing';  // Simulate startNewGame phase change
    }

    const endTime = performance.now();
    const avgTime = (endTime - startTime) / 10;

    if (avgTime < 100) {
      console.log(`✅ Test 8 PASSED: Play Again avg time: ${avgTime.toFixed(2)}ms (< 100ms AC requirement)`);
      passed++;
    } else {
      console.error(`❌ Test 8 FAILED: Play Again too slow: ${avgTime.toFixed(2)}ms (AC requires < 100ms)`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 8 FAILED with error:', error.message);
    failed++;
  }

  // Test 9: Game state resets correctly
  try {
    const gameState = createInitialState();
    gameState.score = 25;
    gameState.phase = 'gameover';

    resetGame(gameState);

    if (gameState.score === 5 && gameState.phase === 'menu' && gameState.snake.segments.length === 5) {
      console.log('✅ Test 9 PASSED: Game state resets correctly (score, phase, snake)');
      passed++;
    } else {
      console.error('❌ Test 9 FAILED: Game state not reset properly');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 9 FAILED with error:', error.message);
    failed++;
  }

  // Test 10: New high score indicator has animation
  try {
    const indicator = document.getElementById('new-high-score-indicator');
    const styles = window.getComputedStyle(indicator);

    const hasAnimation = styles.animation && styles.animation.includes('pulse-glow');

    if (hasAnimation || styles.animationName === 'pulse-glow') {
      console.log('✅ Test 10 PASSED: New high score indicator has pulse animation');
      passed++;
    } else {
      console.error('❌ Test 10 FAILED: New high score indicator missing animation');
      console.error(`  Animation: ${styles.animation || 'none'}`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 10 FAILED with error:', error.message);
    failed++;
  }

  // Test 11: High score indicator initially hidden
  try {
    const indicator = document.getElementById('new-high-score-indicator');

    if (indicator && indicator.classList.contains('hidden')) {
      console.log('✅ Test 11 PASSED: High score indicator initially hidden');
      passed++;
    } else {
      console.error('❌ Test 11 FAILED: High score indicator should be hidden by default');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 11 FAILED with error:', error.message);
    failed++;
  }

  // Test 12: Play Again flow completes correctly
  try {
    const gameState = createInitialState();
    const initialHighScore = gameState.highScore;

    // Set up game over state
    gameState.phase = 'gameover';
    gameState.score = 15;

    // Simulate Play Again: reset then start new game
    resetGame(gameState);
    gameState.phase = 'playing';

    const playAgainWorked = (
      gameState.phase === 'playing' &&
      gameState.score === 5 &&
      gameState.snake.segments.length === 5 &&
      gameState.highScore === initialHighScore  // High score preserved
    );

    if (playAgainWorked) {
      console.log('✅ Test 12 PASSED: Play Again flow resets game state and starts new game');
      passed++;
    } else {
      console.error('❌ Test 12 FAILED: Play Again flow incomplete');
      console.error(`  Phase: ${gameState.phase} (expected: playing)`);
      console.error(`  Score: ${gameState.score} (expected: 5)`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 12 FAILED with error:', error.message);
    failed++;
  }

  // Test 13: Game over screen has higher z-index than score display
  try {
    const gameoverScreen = document.getElementById('gameover-screen');
    const scoreDisplay = document.getElementById('score-display');
    const gameoverZ = parseInt(window.getComputedStyle(gameoverScreen).zIndex);
    const scoreZ = parseInt(window.getComputedStyle(scoreDisplay).zIndex);

    if (gameoverZ > scoreZ) {
      console.log(`✅ Test 13 PASSED: Game over z-index (${gameoverZ}) > score z-index (${scoreZ})`);
      passed++;
    } else {
      console.error(`❌ Test 13 FAILED: Game over z-index (${gameoverZ}) should be > score z-index (${scoreZ})`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 13 FAILED with error:', error.message);
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
runGameOverTests();
