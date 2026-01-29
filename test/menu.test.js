// CrazySnakeLite - Menu System Tests (Story 4.2)
import { loadHighScore, saveHighScore } from '../js/storage.js';

// Test suite for menu and storage functionality
export function runMenuTests() {
  console.log('=== Menu System Tests (Story 4.2) ===');

  let passed = 0;
  let failed = 0;

  // Test 1: localStorage functions exist
  try {
    if (typeof loadHighScore === 'function' && typeof saveHighScore === 'function') {
      console.log('✅ Test 1 PASSED: Storage functions exported correctly');
      passed++;
    } else {
      console.error('❌ Test 1 FAILED: Storage functions not found');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 1 FAILED with error:', error.message);
    failed++;
  }

  // Test 2: loadHighScore returns 0 when no score exists
  try {
    // Clear any existing score
    localStorage.removeItem('crazysnakeLite_highScore');

    const score = loadHighScore();

    if (score === 0) {
      console.log('✅ Test 2 PASSED: loadHighScore returns 0 when no score exists');
      passed++;
    } else {
      console.error(`❌ Test 2 FAILED: Expected 0, got ${score}`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 2 FAILED with error:', error.message);
    failed++;
  }

  // Test 3: saveHighScore stores value correctly
  try {
    saveHighScore(42);
    const stored = localStorage.getItem('crazysnakeLite_highScore');

    if (stored === '42') {
      console.log('✅ Test 3 PASSED: saveHighScore stores value correctly');
      passed++;
    } else {
      console.error(`❌ Test 3 FAILED: Expected '42', got '${stored}'`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 3 FAILED with error:', error.message);
    failed++;
  }

  // Test 4: loadHighScore retrieves stored value
  try {
    saveHighScore(123);
    const loaded = loadHighScore();

    if (loaded === 123) {
      console.log('✅ Test 4 PASSED: loadHighScore retrieves stored value correctly');
      passed++;
    } else {
      console.error(`❌ Test 4 FAILED: Expected 123, got ${loaded}`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 4 FAILED with error:', error.message);
    failed++;
  }

  // Test 5: High score persists across saves
  try {
    saveHighScore(50);
    saveHighScore(100);
    const loaded = loadHighScore();

    if (loaded === 100) {
      console.log('✅ Test 5 PASSED: High score updates correctly with new values');
      passed++;
    } else {
      console.error(`❌ Test 5 FAILED: Expected 100, got ${loaded}`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 5 FAILED with error:', error.message);
    failed++;
  }

  // Test 6: Menu screen element exists
  try {
    const menuScreen = document.getElementById('menu-screen');

    if (menuScreen) {
      console.log('✅ Test 6 PASSED: Menu screen element exists in DOM');
      passed++;
    } else {
      console.error('❌ Test 6 FAILED: Menu screen element not found');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 6 FAILED with error:', error.message);
    failed++;
  }

  // Test 7: New Game button exists
  try {
    const newGameBtn = document.getElementById('new-game-btn');

    if (newGameBtn) {
      console.log('✅ Test 7 PASSED: New Game button exists in DOM');
      passed++;
    } else {
      console.error('❌ Test 7 FAILED: New Game button not found');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 7 FAILED with error:', error.message);
    failed++;
  }

  // Test 8: High score display element exists
  try {
    const highScoreDisplay = document.getElementById('high-score-display');
    const highScoreValue = document.getElementById('high-score-value');

    if (highScoreDisplay && highScoreValue) {
      console.log('✅ Test 8 PASSED: High score display elements exist in DOM');
      passed++;
    } else {
      console.error('❌ Test 8 FAILED: High score display elements not found');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 8 FAILED with error:', error.message);
    failed++;
  }

  // Test 9: Game title exists
  try {
    const gameTitle = document.querySelector('.game-title');

    if (gameTitle && gameTitle.textContent === 'CrazySnakeLite') {
      console.log('✅ Test 9 PASSED: Game title displays correctly');
      passed++;
    } else {
      console.error('❌ Test 9 FAILED: Game title incorrect or missing');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 9 FAILED with error:', error.message);
    failed++;
  }

  // Test 10: Menu has correct CSS styling
  try {
    const menuScreen = document.getElementById('menu-screen');
    const styles = window.getComputedStyle(menuScreen);

    const hasCorrectPosition = styles.position === 'absolute';
    const hasCorrectZIndex = parseInt(styles.zIndex) >= 200;

    if (hasCorrectPosition && hasCorrectZIndex) {
      console.log('✅ Test 10 PASSED: Menu has correct styling (absolute position, z-index >= 200)');
      passed++;
    } else {
      console.error('❌ Test 10 FAILED: Menu styling incorrect');
      console.error(`  Position: ${styles.position} (should be absolute)`);
      console.error(`  Z-index: ${styles.zIndex} (should be >= 200)`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 10 FAILED with error:', error.message);
    failed++;
  }

  // Test 11: loadHighScore handles corrupted data (returns 0 for NaN)
  try {
    // Manually corrupt localStorage
    localStorage.setItem('crazysnakeLite_highScore', 'corrupted_data');
    const loaded = loadHighScore();

    if (loaded === 0) {
      console.log('✅ Test 11 PASSED: loadHighScore handles corrupted data (returns 0)');
      passed++;
    } else {
      console.error(`❌ Test 11 FAILED: Expected 0 for corrupted data, got ${loaded}`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 11 FAILED with error:', error.message);
    failed++;
  }

  // Test 12: loadHighScore handles negative stored values
  try {
    localStorage.setItem('crazysnakeLite_highScore', '-50');
    const loaded = loadHighScore();

    if (loaded === 0) {
      console.log('✅ Test 12 PASSED: loadHighScore handles negative values (returns 0)');
      passed++;
    } else {
      console.error(`❌ Test 12 FAILED: Expected 0 for negative value, got ${loaded}`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 12 FAILED with error:', error.message);
    failed++;
  }

  // Test 13: saveHighScore validates negative input
  try {
    saveHighScore(-100);
    const loaded = loadHighScore();

    if (loaded === 0) {
      console.log('✅ Test 13 PASSED: saveHighScore validates negative input (saves 0)');
      passed++;
    } else {
      console.error(`❌ Test 13 FAILED: Expected 0 for negative input, got ${loaded}`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 13 FAILED with error:', error.message);
    failed++;
  }

  // Test 14: saveHighScore validates NaN input
  try {
    saveHighScore(NaN);
    const loaded = loadHighScore();

    if (loaded === 0) {
      console.log('✅ Test 14 PASSED: saveHighScore validates NaN input (saves 0)');
      passed++;
    } else {
      console.error(`❌ Test 14 FAILED: Expected 0 for NaN input, got ${loaded}`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 14 FAILED with error:', error.message);
    failed++;
  }

  // Test 15: saveHighScore validates undefined input
  try {
    saveHighScore(undefined);
    const loaded = loadHighScore();

    if (loaded === 0) {
      console.log('✅ Test 15 PASSED: saveHighScore validates undefined input (saves 0)');
      passed++;
    } else {
      console.error(`❌ Test 15 FAILED: Expected 0 for undefined input, got ${loaded}`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 15 FAILED with error:', error.message);
    failed++;
  }

  // Clean up
  localStorage.removeItem('crazysnakeLite_highScore');

  // Summary
  console.log('\n=== Test Summary ===');
  console.log(`Total: ${passed + failed}`);
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  return { passed, failed };
}

// Auto-run tests when loaded
runMenuTests();
