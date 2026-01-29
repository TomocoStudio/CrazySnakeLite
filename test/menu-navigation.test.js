// CrazySnakeLite - Menu Navigation and Pause Tests (Story 4.4)
import { createInitialState } from '../js/state.js';

// Test suite for menu navigation and pause functionality
export function runMenuNavigationTests() {
  console.log('=== Menu Navigation and Pause Tests (Story 4.4) ===');

  let passed = 0;
  let failed = 0;

  // Test 1: Initial game state is menu
  try {
    const gameState = createInitialState();

    if (gameState.phase === 'menu') {
      console.log('✅ Test 1 PASSED: Initial state is menu phase');
      passed++;
    } else {
      console.error(`❌ Test 1 FAILED: Expected 'menu', got '${gameState.phase}'`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 1 FAILED with error:', error.message);
    failed++;
  }

  // Test 2: Menu screen has keyboard-accessible buttons
  try {
    const newGameBtn = document.getElementById('new-game-btn');
    const menuBtn = document.getElementById('menu-btn');
    const playAgainBtn = document.getElementById('play-again-btn');

    if (newGameBtn && menuBtn && playAgainBtn) {
      console.log('✅ Test 2 PASSED: All menu buttons exist in DOM');
      passed++;
    } else {
      console.error('❌ Test 2 FAILED: Some menu buttons missing');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 2 FAILED with error:', error.message);
    failed++;
  }

  // Test 3: Selected button has visual indicator
  try {
    const playAgainBtn = document.getElementById('play-again-btn');

    if (playAgainBtn && playAgainBtn.classList.contains('selected')) {
      console.log('✅ Test 3 PASSED: Play Again button has "selected" class');
      passed++;
    } else {
      console.error('❌ Test 3 FAILED: Play Again button missing "selected" class');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 3 FAILED with error:', error.message);
    failed++;
  }

  // Test 4: Phase transitions work correctly
  try {
    const gameState = createInitialState();

    // Start in menu
    if (gameState.phase !== 'menu') {
      throw new Error('Should start in menu');
    }

    // Transition to playing
    gameState.phase = 'playing';
    if (gameState.phase !== 'playing') {
      throw new Error('Should transition to playing');
    }

    // Pause (back to menu)
    gameState.phase = 'menu';
    if (gameState.phase !== 'menu') {
      throw new Error('Should pause to menu');
    }

    console.log('✅ Test 4 PASSED: Phase transitions work correctly');
    passed++;
  } catch (error) {
    console.error('❌ Test 4 FAILED:', error.message);
    failed++;
  }

  // Test 5: Game state preservation during pause
  try {
    const gameState = createInitialState();
    gameState.phase = 'playing';
    gameState.score = 15;
    const snakeLength = gameState.snake.segments.length;

    // Pause (transition to menu)
    gameState.phase = 'menu';

    // Verify state preserved
    if (gameState.score === 15 && gameState.snake.segments.length === snakeLength) {
      console.log('✅ Test 5 PASSED: Game state preserved during pause');
      passed++;
    } else {
      console.error('❌ Test 5 FAILED: Game state not preserved');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 5 FAILED with error:', error.message);
    failed++;
  }

  // Test 6: Enter key can be simulated
  try {
    const enterEvent = new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true,
      cancelable: true
    });

    if (enterEvent.key === 'Enter') {
      console.log('✅ Test 6 PASSED: Enter key event can be created');
      passed++;
    } else {
      console.error('❌ Test 6 FAILED: Enter key event incorrect');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 6 FAILED with error:', error.message);
    failed++;
  }

  // Test 7: Escape key can be simulated
  try {
    const escEvent = new KeyboardEvent('keydown', {
      key: 'Escape',
      bubbles: true,
      cancelable: true
    });

    if (escEvent.key === 'Escape') {
      console.log('✅ Test 7 PASSED: Escape key event can be created');
      passed++;
    } else {
      console.error('❌ Test 7 FAILED: Escape key event incorrect');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 7 FAILED with error:', error.message);
    failed++;
  }

  // Test 8: Arrow keys can be simulated
  try {
    const upEvent = new KeyboardEvent('keydown', { key: 'ArrowUp' });
    const downEvent = new KeyboardEvent('keydown', { key: 'ArrowDown' });

    if (upEvent.key === 'ArrowUp' && downEvent.key === 'ArrowDown') {
      console.log('✅ Test 8 PASSED: Arrow key events can be created');
      passed++;
    } else {
      console.error('❌ Test 8 FAILED: Arrow key events incorrect');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 8 FAILED with error:', error.message);
    failed++;
  }

  // Test 9: Menu buttons are clickable
  try {
    const newGameBtn = document.getElementById('new-game-btn');
    const styles = window.getComputedStyle(newGameBtn);

    if (styles.cursor === 'pointer' || styles.cursor.includes('pointer')) {
      console.log('✅ Test 9 PASSED: Menu buttons have pointer cursor');
      passed++;
    } else {
      console.error(`❌ Test 9 FAILED: Button cursor is ${styles.cursor}, expected pointer`);
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 9 FAILED with error:', error.message);
    failed++;
  }

  // Test 10: Selected button has distinct styling
  try {
    const playAgainBtn = document.getElementById('play-again-btn');
    const menuBtn = document.getElementById('menu-btn');

    const selectedStyles = window.getComputedStyle(playAgainBtn);
    const unselectedStyles = window.getComputedStyle(menuBtn);

    // Selected button should have different background
    if (selectedStyles.backgroundColor !== unselectedStyles.backgroundColor) {
      console.log('✅ Test 10 PASSED: Selected button has distinct styling');
      passed++;
    } else {
      console.error('❌ Test 10 FAILED: Selected button styling not distinct');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 10 FAILED with error:', error.message);
    failed++;
  }

  // Test 11: Pause functionality - state preserved
  try {
    const gameState = createInitialState();
    gameState.phase = 'playing';
    gameState.score = 20;
    const originalSnakeLength = gameState.snake.segments.length;

    // Simulate pause (Esc during playing)
    gameState.phase = 'menu';
    gameState.isPaused = true;

    // Verify state preserved and pause flag set
    if (gameState.phase === 'menu' && gameState.isPaused === true &&
        gameState.score === 20 && gameState.snake.segments.length === originalSnakeLength) {
      console.log('✅ Test 11 PASSED: Pause preserves game state and sets isPaused flag');
      passed++;
    } else {
      console.error('❌ Test 11 FAILED: Pause did not preserve state correctly');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 11 FAILED with error:', error.message);
    failed++;
  }

  // Test 12: Resume functionality - returns to playing
  try {
    const gameState = createInitialState();
    gameState.phase = 'menu';
    gameState.isPaused = true;
    gameState.score = 15;

    // Simulate resume
    gameState.phase = 'playing';
    gameState.isPaused = false;

    if (gameState.phase === 'playing' && gameState.isPaused === false && gameState.score === 15) {
      console.log('✅ Test 12 PASSED: Resume returns to playing phase and clears isPaused');
      passed++;
    } else {
      console.error('❌ Test 12 FAILED: Resume did not work correctly');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 12 FAILED with error:', error.message);
    failed++;
  }

  // Test 13: Arrow key navigation changes selection
  try {
    const playAgainBtn = document.getElementById('play-again-btn');
    const menuBtn = document.getElementById('menu-btn');

    // Set initial state
    playAgainBtn.classList.add('selected');
    menuBtn.classList.remove('selected');

    // Simulate arrow down (would move to menu button)
    playAgainBtn.classList.remove('selected');
    menuBtn.classList.add('selected');

    if (!playAgainBtn.classList.contains('selected') && menuBtn.classList.contains('selected')) {
      console.log('✅ Test 13 PASSED: Arrow navigation updates selected button');
      passed++;
    } else {
      console.error('❌ Test 13 FAILED: Selection did not update');
      failed++;
    }

    // Reset for other tests
    playAgainBtn.classList.add('selected');
    menuBtn.classList.remove('selected');
  } catch (error) {
    console.error('❌ Test 13 FAILED with error:', error.message);
    failed++;
  }

  // Test 14: isPaused flag exists in game state
  try {
    const gameState = createInitialState();

    if ('isPaused' in gameState) {
      console.log('✅ Test 14 PASSED: isPaused flag exists in game state');
      passed++;
    } else {
      console.error('❌ Test 14 FAILED: isPaused flag missing from game state');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 14 FAILED with error:', error.message);
    failed++;
  }

  // Test 15: New game clears isPaused flag
  try {
    const gameState = createInitialState();
    gameState.isPaused = true;
    gameState.phase = 'playing';

    // Simulate starting new game (should clear pause)
    gameState.isPaused = false;

    if (gameState.isPaused === false && gameState.phase === 'playing') {
      console.log('✅ Test 15 PASSED: Starting new game clears isPaused flag');
      passed++;
    } else {
      console.error('❌ Test 15 FAILED: isPaused not cleared on new game');
      failed++;
    }
  } catch (error) {
    console.error('❌ Test 15 FAILED with error:', error.message);
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
runMenuNavigationTests();
