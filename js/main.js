// CrazySnakeLite - Main Entry Point
import { CONFIG } from './config.js';
import { createInitialState, resetGame } from './state.js';
import { startGameLoop } from './game.js';
import { initInput } from './input.js';
import { spawnFood } from './food.js';
import { applyEffect, clearEffect, EFFECT_TYPES } from './effects.js';
import { scheduleNextCall, initPhoneSystem } from './phone.js';
import { saveHighScore } from './storage.js';
import { initAudio, resumeAudio, closeAudio } from './audio.js';

// Initialize canvas and context
const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext('2d');

// Set canvas size from config
canvas.width = CONFIG.GRID_WIDTH * CONFIG.UNIT_SIZE;
canvas.height = CONFIG.GRID_HEIGHT * CONFIG.UNIT_SIZE;

// Cache UI elements (DOM access only in main.js per architecture)
const menuScreen = document.getElementById('menu-screen');
const newGameBtn = document.getElementById('new-game-btn');
const highScoreValueElement = document.getElementById('high-score-value');
const gameoverScreen = document.getElementById('gameover-screen');
const scoreValueElement = document.getElementById('score-value');
const newHighScoreIndicator = document.getElementById('new-high-score-indicator');
const scoreDisplay = document.getElementById('score-display');
const playAgainBtn = document.getElementById('play-again-btn');
const menuBtn = document.getElementById('menu-btn');

/**
 * Update score display DOM element
 * Story 5-2: Dual score display (current + top score)
 * @param {number} score - Current score
 * @param {number} topScore - Top/high score
 */
function updateScoreDisplay(score, topScore) {
  const currentScoreElement = document.getElementById('current-score');
  const topScoreElement = document.getElementById('top-score');

  if (!currentScoreElement || !topScoreElement) {
    console.error('[UI] Score display elements not found in DOM');
    return;
  }

  // Validate scores are valid numbers
  const validScore = Math.max(0, Math.floor(score || 0));
  const validTopScore = Math.max(0, Math.floor(topScore || 0));

  currentScoreElement.textContent = `Score: ${validScore}`;
  topScoreElement.textContent = `Top Score: ${validTopScore}`;
}

/**
 * Update high score display on menu
 * Story 4.2
 * @param {number} highScore - High score to display
 */
function updateHighScoreDisplay(highScore) {
  if (highScoreValueElement) {
    highScoreValueElement.textContent = highScore;
  }
}

/**
 * Start a new game from menu
 * Story 4.2
 */
function startNewGame() {
  // Reset game state
  resetGame(gameState);
  gameState.phase = 'playing';
  gameState.isPaused = false;  // Clear pause flag when starting new game

  // Initialize score display and ensure it's visible
  updateScoreDisplay(gameState.score, gameState.highScore);
  scoreDisplay.classList.remove('hidden');
  previousScore = gameState.score;  // Track initial score

  // Spawn first food
  spawnFood(gameState);

  // Schedule first phone call
  scheduleNextCall(gameState, performance.now());

  console.log('[Game] New game started from menu');
}

// Create initial game state
const gameState = createInitialState();

// Initialize high score display (Story 4.2)
updateHighScoreDisplay(gameState.highScore);

// Initialize phone system (Story 3.3)
initPhoneSystem(gameState, () => performance.now());

// Initialize audio on first user interaction (Story 4.5)
// Web Audio API: AudioContext created in user gesture context avoids autoplay block
document.addEventListener('click', () => {
  initAudio();
  resumeAudio();
}, { once: true });

document.addEventListener('keydown', () => {
  initAudio();
  resumeAudio();
}, { once: true });

// Cleanup audio resources on page unload (Story 4.5 review fix)
window.addEventListener('beforeunload', () => {
  closeAudio();
});

// Don't spawn food or schedule calls yet - wait for New Game button
// (Food and phone calls initialized when game starts from menu)

// Play Again handler
function handlePlayAgain() {
  startNewGame();
}

/**
 * Pause game handler (Story 4.4)
 * Shows menu while preserving game state
 */
function handlePause() {
  if (gameState.phase === 'playing') {
    gameState.phase = 'menu';
    gameState.isPaused = true;  // Mark as paused to enable resume
    console.log('[Game] Game paused - returning to menu (can resume)');
  }
}

/**
 * Resume paused game handler (Story 4.4)
 * Returns to playing phase from paused menu
 */
function handleResume() {
  if (gameState.isPaused) {
    gameState.phase = 'playing';
    gameState.isPaused = false;
    console.log('[Game] Game resumed from pause');
  }
}

/**
 * Return to menu handler (Story 4.4)
 * From game over screen
 */
function handleReturnToMenu() {
  gameState.phase = 'menu';
  gameState.isPaused = false;  // Clear pause flag
  updateHighScoreDisplay(gameState.highScore);
  console.log('[Game] Returned to menu from game over');
}

// Track previous phase and score to detect transitions
let previousPhase = null;
let previousScore = null;

// UI update callback (called by game loop)
function handleUIUpdate(state) {
  const phaseChanged = state.phase !== previousPhase;
  const scoreChanged = state.score !== previousScore;

  // Story 4.2: Handle menu, playing, and gameover phases
  if (state.phase === 'menu') {
    if (phaseChanged) {
      menuScreen.classList.remove('hidden');
      gameoverScreen.classList.add('hidden');
      scoreDisplay.classList.add('hidden');  // Fix: Hide score on menu
      updateHighScoreDisplay(state.highScore);
    }
  } else if (state.phase === 'playing') {
    if (phaseChanged) {
      menuScreen.classList.add('hidden');
      gameoverScreen.classList.add('hidden');
      scoreDisplay.classList.remove('hidden');  // Fix: Show score during gameplay
    }
    // Fix: Only update score when it changes (not every frame)
    if (scoreChanged) {
      updateScoreDisplay(state.score, state.highScore);
      previousScore = state.score;
    }
  } else if (state.phase === 'gameover') {
    // Only execute gameover logic ONCE when transitioning to gameover
    if (phaseChanged) {
      menuScreen.classList.add('hidden');
      gameoverScreen.classList.remove('hidden');
      scoreDisplay.classList.add('hidden');  // Fix: Hide score on game over
      // Story 4.2/4.3: Save high score if new record and show indicator
      console.log('[Game] Game Over - Score:', state.score, 'High Score:', state.highScore);
      // Validate scores are valid numbers before comparison
      const validScore = Math.max(0, Math.floor(state.score || 0));
      const validHighScore = Math.max(0, Math.floor(state.highScore || 0));
      scoreValueElement.textContent = validScore;

      if (validScore > validHighScore) {
        state.highScore = validScore;
        saveHighScore(validScore);
        // Story 4.3: Show "New High Score!" indicator
        if (newHighScoreIndicator) {
          newHighScoreIndicator.classList.remove('hidden');
          console.log('[Game] ✨ New high score indicator SHOWN!', state.highScore);
        } else {
          console.error('[Game] ❌ New high score indicator element not found!');
        }
        console.log('[Game] New high score!', state.highScore);
      } else {
        // Hide indicator if not a new high score
        if (newHighScoreIndicator) {
          newHighScoreIndicator.classList.add('hidden');
        }
        console.log('[Game] Not a new high score. Current:', state.score, 'Record:', state.highScore);
      }
    }
  }

  // Update previous phase for next frame
  previousPhase = state.phase;
}

// Initialize input (Story 4.4: Added pause, resume, and menu callbacks)
const menuCallbacks = {
  newGame: startNewGame,
  returnToMenu: handleReturnToMenu
};
initInput(gameState, handlePlayAgain, handlePause, handleResume, menuCallbacks);

// Wire up New Game button (Story 4.2)
newGameBtn.addEventListener('click', startNewGame);

// Wire up Play Again button
playAgainBtn.addEventListener('click', handlePlayAgain);

// Menu button - Return to main menu (Story 4.2)
menuBtn.addEventListener('click', () => {
  gameState.phase = 'menu';
  gameState.isPaused = false;  // Clear pause flag when explicitly returning to menu
  updateHighScoreDisplay(gameState.highScore);
});

// Note: Enter key handling moved to input.js (Story 4.4)
// Removed duplicate handler to prevent double-firing

// Start game loop with UI callback
startGameLoop(ctx, gameState, handleUIUpdate);

// Debug helpers for manual effect testing (Story 2.1)
window.testEffect = (type) => {
  applyEffect(gameState, type);
  console.log('Applied effect:', type);
  console.log('Active effect:', gameState.activeEffect);
  console.log('Snake color:', gameState.snake.color);
};

window.clearTestEffect = () => {
  clearEffect(gameState);
  console.log('Cleared effect');
  console.log('Active effect:', gameState.activeEffect);
  console.log('Snake color:', gameState.snake.color);
};

window.EFFECT_TYPES = EFFECT_TYPES;

// Helper to spawn invincibility food for testing (Story 2.2)
window.testInvincibility = () => {
  gameState.food = {
    position: { x: 5, y: 5 },
    type: 'invincibility'
  };
  console.log('Invincibility food (yellow star) spawned at (5, 5)');
  console.log('Eat it to test invincibility effect!');
};

// Helper to spawn wall-phase food for testing (Story 2.3)
window.testWallPhase = () => {
  gameState.food = {
    position: { x: 5, y: 5 },
    type: 'wallPhase'
  };
  console.log('Wall-phase food (purple ring) spawned at (5, 5)');
  console.log('Eat it then hit a wall to test wrapping!');
};

// Helper to spawn speed boost food for testing (Story 2.4)
window.testSpeedBoost = () => {
  gameState.food = {
    position: { x: 5, y: 5 },
    type: 'speedBoost'
  };
  console.log('Speed boost food (red cross) spawned at (5, 5)');
  console.log('Eat it to move faster!');
};

// Helper to spawn speed decrease food for testing (Story 2.4)
window.testSpeedDecrease = () => {
  gameState.food = {
    position: { x: 5, y: 5 },
    type: 'speedDecrease'
  };
  console.log('Speed decrease food (cyan hollow square) spawned at (5, 5)');
  console.log('Eat it to move slower!');
};

// Helper to spawn reverse controls food for testing (Story 2.5)
window.testReverseControls = () => {
  gameState.food = {
    position: { x: 5, y: 5 },
    type: 'reverseControls'
  };
  console.log('Reverse controls food (orange X) spawned at (5, 5)');
  console.log('Eat it to invert your controls!');
};

console.log('🎮 === CrazySnakeLite - Epic 3 Complete! ===');
console.log('');
console.log('Test helpers available:');
console.log('  window.testInvincibility() - Yellow star ⭐');
console.log('  window.testWallPhase() - Purple ring ⭕');
console.log('  window.testSpeedBoost() - Red cross ➕');
console.log('  window.testSpeedDecrease() - Cyan hollow square ⬜');
console.log('  window.testReverseControls() - Orange X ❌');
console.log('');
console.log('Direct effect apply:');
console.log('  window.testEffect("invincibility")');
console.log('  window.testEffect("wallPhase")');
console.log('  window.testEffect("speedBoost")');
console.log('  window.testEffect("speedDecrease")');
console.log('  window.testEffect("reverseControls")');
console.log('  window.clearTestEffect()');
console.log('');
console.log('Food types spawn with these probabilities:');
console.log('  Growing (green square): 40%');
console.log('  Invincibility (yellow star): 10%');
console.log('  Wall-Phase (purple ring): 10%');
console.log('  Speed Boost (red cross): 15%');
console.log('  Speed Decrease (cyan square): 15%');
console.log('  Reverse Controls (orange X): 10%');
