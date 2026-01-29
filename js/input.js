// CrazySnakeLite - Input Abstraction Layer
import { CONFIG } from './config.js';
import { isEffectActive } from './effects.js';
import { isPhoneCallActive, handlePhoneDismiss } from './phone.js';

// Key mappings for different keyboard layouts
const KEY_MAPPINGS = {
  // Arrow keys
  'ArrowUp': 'up',
  'ArrowDown': 'down',
  'ArrowLeft': 'left',
  'ArrowRight': 'right',

  // WASD (US layout)
  'w': 'up',
  'W': 'up',
  's': 'down',
  'S': 'down',
  'a': 'left',
  'A': 'left',
  'd': 'right',
  'D': 'right',

  // ZQSD (French AZERTY layout)
  'z': 'up',
  'Z': 'up',
  'q': 'left',
  'Q': 'left',

  // Numpad
  '8': 'up',
  '2': 'down',
  '4': 'left',
  '6': 'right'
};

// Opposite directions for reversal prevention
const OPPOSITES = {
  'up': 'down',
  'down': 'up',
  'left': 'right',
  'right': 'left'
};

let touchStartX = null;
let touchStartY = null;

// Store callbacks
let playAgainCallback = null;
let pauseCallback = null;
let resumeCallback = null;
let menuCallbacks = null;

/**
 * Initialize input listeners
 * Story 4.4: Added pause, resume, and menu callbacks
 */
export function initInput(gameState, onPlayAgain, onPause, onResume, menuActions) {
  playAgainCallback = onPlayAgain;
  pauseCallback = onPause;
  resumeCallback = onResume;
  menuCallbacks = menuActions;

  // Keyboard input (Story 4.4 review fix: removed capture phase to avoid conflicts)
  document.addEventListener('keydown', (e) => {
    handleKeyboardInput(e, gameState);
  });

  // Touch input (mobile)
  document.addEventListener('touchstart', handleTouchStart, { passive: true });
  document.addEventListener('touchend', (e) => {
    handleTouchEnd(e, gameState);
  });
}

/**
 * Handle keyboard input
 * Story 4.4: Added Esc for pause, Enter for menu, Arrow keys for navigation
 */
function handleKeyboardInput(event, gameState) {
  // Space bar to dismiss phone call (Story 3.3)
  // HIGHEST PRIORITY - check this first
  if (event.key === ' ' || event.key === 'Spacebar') {
    if (isPhoneCallActive()) {
      event.preventDefault();  // Prevent page scroll
      handlePhoneDismiss(gameState, performance.now());
      return;  // Stop processing other inputs
    }
  }

  // Story 4.4: Esc key handling
  if (event.key === 'Escape') {
    event.preventDefault();

    // During playing: Pause the game
    if (gameState.phase === 'playing') {
      if (pauseCallback) {
        pauseCallback();
      }
      return;
    }

    // During paused menu: Resume the game
    if (gameState.phase === 'menu' && gameState.isPaused) {
      if (resumeCallback) {
        resumeCallback();
      }
      return;
    }

    // During game over: Return to menu
    if (gameState.phase === 'gameover') {
      if (menuCallbacks && menuCallbacks.returnToMenu) {
        menuCallbacks.returnToMenu();
      }
      return;
    }
  }

  // Story 4.4: Enter key activates selected option
  if (event.key === 'Enter') {
    event.preventDefault();
    event.stopPropagation();

    // Activate the currently selected button
    if (gameState.phase === 'menu' || gameState.phase === 'gameover') {
      activateSelectedButton(gameState.phase);
      return;
    }
  }

  // Story 4.4: Arrow keys for menu navigation
  if (event.key === 'ArrowUp' || event.key === 'ArrowDown') {
    if (gameState.phase === 'menu' || gameState.phase === 'gameover') {
      event.preventDefault();
      navigateMenuOptions(event.key, gameState.phase);
      return;
    }
  }

  // Direction keys (only during playing phase)
  const direction = KEY_MAPPINGS[event.key];
  if (direction && gameState.phase === 'playing') {
    event.preventDefault();
    setDirection(gameState, direction);
  }
}

/**
 * Handle touch start
 */
function handleTouchStart(event) {
  const touch = event.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
}

/**
 * Handle touch end and detect swipe
 */
function handleTouchEnd(event, gameState) {
  if (touchStartX === null || touchStartY === null) {
    return;
  }

  const touch = event.changedTouches[0];
  const deltaX = touch.clientX - touchStartX;
  const deltaY = touch.clientY - touchStartY;

  const absX = Math.abs(deltaX);
  const absY = Math.abs(deltaY);

  if (absX < CONFIG.MIN_SWIPE_DISTANCE && absY < CONFIG.MIN_SWIPE_DISTANCE) {
    touchStartX = null;
    touchStartY = null;
    return;
  }

  let direction;
  if (absX > absY) {
    direction = deltaX > 0 ? 'right' : 'left';
  } else {
    direction = deltaY > 0 ? 'down' : 'up';
  }

  if (gameState.phase === 'playing') {
    setDirection(gameState, direction);
  }

  touchStartX = null;
  touchStartY = null;
}

/**
 * Set snake direction with validation
 * Prevents 180° reversal
 * UPDATED in Story 2.5: Handle reverse controls
 */
function setDirection(gameState, intendedDirection) {
  const currentDirection = gameState.snake.direction;

  // Check "can't reverse 180°" rule on INTENDED direction (before inversion)
  // This is critical: validate BEFORE inverting, not after
  if (OPPOSITES[currentDirection] === intendedDirection) {
    return;  // Can't turn into self
  }

  // Apply reverseControls inversion if active
  let finalDirection = intendedDirection;
  if (isEffectActive(gameState, 'reverseControls')) {
    finalDirection = invertDirection(intendedDirection);
  }

  gameState.snake.nextDirection = finalDirection;
}

/**
 * Invert direction for reverse controls
 * NEW in Story 2.5
 */
function invertDirection(direction) {
  const inversionMap = {
    up: 'down',
    down: 'up',
    left: 'right',
    right: 'left'
  };
  return inversionMap[direction] || direction;
}

/**
 * Navigate menu options with arrow keys
 * Story 4.4: Implement arrow key navigation
 */
function navigateMenuOptions(key, phase) {
  let buttons = [];

  // Get buttons based on current phase
  if (phase === 'menu') {
    buttons = [document.getElementById('new-game-btn')];
  } else if (phase === 'gameover') {
    buttons = [
      document.getElementById('play-again-btn'),
      document.getElementById('menu-btn')
    ];
  }

  // Filter out null buttons
  buttons = buttons.filter(btn => btn !== null);

  if (buttons.length === 0) return;

  // Find currently selected button
  let selectedIndex = buttons.findIndex(btn => btn.classList.contains('selected'));
  if (selectedIndex === -1) selectedIndex = 0;

  // Move selection
  if (key === 'ArrowDown') {
    selectedIndex = (selectedIndex + 1) % buttons.length;
  } else if (key === 'ArrowUp') {
    selectedIndex = (selectedIndex - 1 + buttons.length) % buttons.length;
  }

  // Update selected class
  buttons.forEach((btn, index) => {
    if (index === selectedIndex) {
      btn.classList.add('selected');
    } else {
      btn.classList.remove('selected');
    }
  });
}

/**
 * Activate the currently selected button
 * Story 4.4: Support for Enter key on selected option
 */
function activateSelectedButton(phase) {
  let selectedButton = null;

  // Find the selected button
  if (phase === 'menu') {
    selectedButton = document.getElementById('new-game-btn');
  } else if (phase === 'gameover') {
    const playAgainBtn = document.getElementById('play-again-btn');
    const menuBtn = document.getElementById('menu-btn');

    if (playAgainBtn && playAgainBtn.classList.contains('selected')) {
      selectedButton = playAgainBtn;
    } else if (menuBtn && menuBtn.classList.contains('selected')) {
      selectedButton = menuBtn;
    } else {
      // Default to play again if nothing selected
      selectedButton = playAgainBtn;
    }
  }

  // Click the selected button
  if (selectedButton) {
    selectedButton.click();
  }
}
