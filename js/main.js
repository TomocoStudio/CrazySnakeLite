// CrazySnakeLite - Main Entry Point
import { CONFIG } from './config.js';
import { createInitialState, resetGame } from './state.js';
import { startGameLoop } from './game.js';
import { initInput } from './input.js';
import { spawnFood } from './food.js';
import { applyEffect, clearEffect, EFFECT_TYPES } from './effects.js';
import { scheduleNextCall, initPhoneSystem } from './phone.js';
import { saveHighScore, initStorage, getAllTimeHighs, getLastSessionPattern, saveSessionPattern, getTotalSessionCount, getRecentSessions, getCalibrationStatus } from './storage.js';
import { initAudio, resumeAudio, closeAudio, playMenuMusic, stopMenuMusic, isAudioReady } from './audio.js';
import { initStarRatings, initCharCounter, openFeedbackModal, closeFeedbackModal, resetFeedbackForm, getFormData, captureMetadata, formatEmailBody, formatEmailSubject, submitFeedback, showThankYouScreen, closeThankYouScreen, initFeedbackModal } from './feedback.js';
import { showCognitiveStats, showHighlights, selectHighlights, renderStreakCounter } from './cognitive-feedback.js';
import { trackSessionEnd, trackGameStart } from './analytics.js';
import { buildContext, selectQuote } from './comedy.js';
import { getCalibrationState, formatCalibrationCounter } from './calibration.js';
import { getStreakData, formatStreakCounter, isStreakMilestone } from './streaks.js';
import { checkAndUpdateStreak } from './streak.js';
import * as dashboard from './dashboard.js';
import { initBackgroundGlow, setGlowToWhite } from './background-glow.js';  // Story 22.1: Dynamic background glow
import { renderRunSummaryBar } from './run-summary.js';  // Story 23.2: Run Summary Bar

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
const skillMapBtn = document.getElementById('skill-map-btn');

// Story 16.1: Skill Map screen and navigation elements
const skillMapScreen = document.getElementById('skill-map-screen');
const skillMapMenuBtn = document.getElementById('skill-map-menu-btn');
const playNowBtn = document.getElementById('play-now-btn');
const backToMenuBtn = document.getElementById('back-to-menu-btn');

// Story 16.9: Initialize dashboard DOM cache for performance
dashboard.initDashboard();

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
  // Story 12.4: Track isFirstGame and previousScore
  const hasPlayed = sessionStorage.getItem('crazysnake_has_played');
  const isFirstGame = !hasPlayed;
  const previousScore = parseInt(sessionStorage.getItem('crazysnake_previous_score')) || null;

  // Story 12.4: Track game start event
  trackGameStart(isFirstGame, previousScore);

  // Story 12.4: Mark that player has played
  if (isFirstGame) {
    sessionStorage.setItem('crazysnake_has_played', 'true');
    sessionStorage.setItem('crazysnake_session_start', Date.now().toString());
  }

  // Story 12.4: Increment total games counter
  const totalGames = parseInt(sessionStorage.getItem('crazysnake_total_games') || '0');
  sessionStorage.setItem('crazysnake_total_games', (totalGames + 1).toString());

  // Reset game state
  resetGame(gameState);
  gameState.phase = 'playing';
  gameState.isPaused = false;  // Clear pause flag when starting new game

  // Clear any residual canvas inline styles from previous combo mode
  const canvas = document.getElementById('game-canvas');
  if (canvas) {
    canvas.style.backgroundColor = '';  // Clear inline style
  }

  // Initialize score display and ensure it's visible
  updateScoreDisplay(gameState.score, gameState.highScore);
  scoreDisplay.classList.remove('hidden');

  // Story 22.1: Set background glow to white before first food spawns
  setGlowToWhite();

  // Spawn first food (will automatically trigger glow color transition)
  spawnFood(gameState);

  // Schedule first phone call
  scheduleNextCall(gameState, performance.now());

  console.log('[Game] New game started from menu');
}

/**
 * Navigate to Skill Map dashboard
 * Story 15.3: Navigation function for unlocked Skill Map access
 * Story 15.5: Added defensive calibration gate check
 * Placeholder until Epic 16 implements dashboard.js
 * @param {Object} state - Game state
 */
function navigateToSkillMap(state) {
  // Story 15.5 Task 3: Defensive gate check (prevents programmatic navigation during calibration)
  const calibrationStatus = getCalibrationStatus();

  if (!calibrationStatus.isComplete) {
    console.log('[Story 15.5] Skill Map access blocked - calibration in progress');
    showCalibrationGateModal(calibrationStatus.sessionsCompleted);
    return;
  }

  console.log('[Story 15.3] Navigating to Skill Map - calibration unlocked');

  // Hide current screen
  if (state.phase === 'gameover') {
    gameoverScreen.classList.add('hidden');
  } else if (state.phase === 'menu') {
    menuScreen.classList.add('hidden');
  }

  // Update phase - handleUIUpdate will show Skill Map screen and call dashboard.renderSkillMap()
  state.phase = 'skillmap';

  // Story 16.1: Phase transition handled by handleUIUpdate
  console.log('[Story 16.1] Phase set to skillmap - handleUIUpdate will render dashboard');
}

/**
 * Show calibration tooltip on locked Skill Map button
 * Story 15.2: Tooltip displays when button is clicked during calibration
 * @param {HTMLElement} buttonEl - The button element to attach tooltip to
 * @param {number} sessionsCompleted - Current session count
 */
function showCalibrationTooltip(buttonEl, sessionsCompleted) {
  // Remove any existing tooltip first
  const existingTooltip = buttonEl.querySelector('.calibration-tooltip');
  if (existingTooltip) {
    existingTooltip.remove();
  }

  // Create tooltip element
  const tooltip = document.createElement('div');
  tooltip.className = 'calibration-tooltip';
  tooltip.innerHTML = `
    Complete 5 sessions to unlock your Skill Map<br>
    Currently: Session ${sessionsCompleted}/5
  `;

  // Position tooltip relative to button
  buttonEl.style.position = 'relative';
  buttonEl.appendChild(tooltip);

  // Auto-dismiss after 3 seconds
  setTimeout(() => {
    if (tooltip.parentNode === buttonEl) {
      tooltip.remove();
    }
  }, 3000);
}

/**
 * Show calibration gate modal (full-screen blocker)
 * Story 15.5 Task 3: Defensive gate for direct navigation attempts
 * @param {number} sessionsCompleted - Current session count
 */
function showCalibrationGateModal(sessionsCompleted) {
  // Check if modal already exists
  let modal = document.getElementById('calibration-gate-modal');

  if (!modal) {
    // Create modal structure
    modal = document.createElement('div');
    modal.id = 'calibration-gate-modal';
    modal.className = 'calibration-gate-modal';
    modal.innerHTML = `
      <div class="calibration-gate-content">
        <h2>Your Skill Map is building...</h2>
        <p>Complete 5 sessions to see your cognitive profile.</p>
        <p class="progress-text">Progress: Session ${sessionsCompleted}/5 — Warming up...</p>
        <button class="gate-close-btn">Back to Menu</button>
      </div>
    `;
    document.body.appendChild(modal);

    // Close button handler
    const closeBtn = modal.querySelector('.gate-close-btn');
    closeBtn.addEventListener('click', () => {
      modal.classList.remove('show');
      gameState.phase = 'menu';
      menuScreen.classList.remove('hidden');
    });

    // ESC key handler
    const escHandler = (e) => {
      if (e.key === 'Escape' && modal.classList.contains('show')) {
        modal.classList.remove('show');
        gameState.phase = 'menu';
        menuScreen.classList.remove('hidden');
        document.removeEventListener('keydown', escHandler);
      }
    };
    document.addEventListener('keydown', escHandler);
  }

  // Update progress text if modal already exists
  const progressText = modal.querySelector('.progress-text');
  if (progressText) {
    progressText.textContent = `Progress: Session ${sessionsCompleted}/5 — Warming up...`;
  }

  // Show modal
  modal.classList.add('show');
}

// Create initial game state
const gameState = createInitialState();

// Initialize high score display (Story 4.2)
updateHighScoreDisplay(gameState.highScore);

// Story 22.1: Initialize dynamic background glow system (white glow for menu)
initBackgroundGlow();

// Initialize phone system (Story 3.3)
initPhoneSystem(gameState, () => Date.now());

// Initialize IndexedDB storage for cognitive metrics (Story 13.1)
initStorage().then((db) => {
  if (db) {
    console.log('[Main] Cognitive metrics storage initialized');
  } else {
    console.warn('[Main] Cognitive metrics storage unavailable - graceful degradation active');
  }
});

// Initialize audio on first user interaction (Story 4.5)
// Web Audio API: AudioContext created in user gesture context avoids autoplay block
document.addEventListener('click', async () => {
  console.log('[Main] Click detected - initializing audio');
  await initAudio();
  await resumeAudio();
  console.log('[Main] Audio initialized, phase:', gameState.phase);
  // Start menu music if on menu screen
  if (gameState.phase === 'menu') {
    console.log('[Main] Starting menu music');
    playMenuMusic();
  } else {
    console.log('[Main] Not on menu, skipping menu music');
  }
}, { once: true });

document.addEventListener('keydown', async () => {
  console.log('[Main] Keydown detected - initializing audio');
  await initAudio();
  await resumeAudio();
  console.log('[Main] Audio initialized, phase:', gameState.phase);
  // Start menu music if on menu screen
  if (gameState.phase === 'menu') {
    console.log('[Main] Starting menu music');
    playMenuMusic();
  } else {
    console.log('[Main] Not on menu, skipping menu music');
  }
}, { once: true });

// Story 12.3: Track session end when browser tab closes
window.addEventListener('beforeunload', () => {
  trackSessionEnd();
});

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

  // Story 16.9: Cleanup dashboard when transitioning away from skillmap
  if (phaseChanged && previousPhase === 'skillmap' && state.phase !== 'skillmap') {
    dashboard.cleanupDashboard();
    console.log('[Story 16.9] Dashboard cleanup - transitioning from skillmap to', state.phase);
  }

  // Story 4.2: Handle menu, playing, and gameover phases
  if (state.phase === 'menu') {
    if (phaseChanged) {
      menuScreen.classList.remove('hidden');
      gameoverScreen.classList.add('hidden');
      skillMapScreen.classList.add('hidden');  // Hide Skill Map when returning to menu
      scoreDisplay.classList.add('hidden');  // Fix: Hide score on menu
      // Reset menu button selection to NEW GAME whenever menu appears
      const newGameBtn = document.getElementById('new-game-btn');
      const skillMapMenuBtn = document.getElementById('skill-map-menu-btn');
      if (newGameBtn) newGameBtn.classList.add('selected');
      if (skillMapMenuBtn) skillMapMenuBtn.classList.remove('selected');
      updateHighScoreDisplay(state.highScore);
      // Story 22.1: Set background glow to white on menu
      setGlowToWhite();
      // Only play menu music if audio is initialized (after user interaction)
      if (isAudioReady()) {
        playMenuMusic();  // Start menu music loop
      }
    }
  } else if (state.phase === 'playing') {
    if (phaseChanged) {
      menuScreen.classList.add('hidden');
      gameoverScreen.classList.add('hidden');
      skillMapScreen.classList.add('hidden');  // Hide Skill Map when starting game
      scoreDisplay.classList.remove('hidden');  // Fix: Show score during gameplay
      stopMenuMusic();  // Stop menu music when game starts
    }
    // Fix: Only update score when it changes (not every frame)
    if (scoreChanged) {
      // Milestone blink: every 50 points
      if (previousScore !== null && state.score > 0) {
        const prevMilestone = Math.floor(previousScore / 50);
        const newMilestone  = Math.floor(state.score / 50);
        if (newMilestone > prevMilestone) {
          scoreDisplay.classList.remove('milestone-blink');
          void scoreDisplay.offsetWidth;  // Force reflow to restart animation
          scoreDisplay.classList.add('milestone-blink');
          scoreDisplay.addEventListener('animationend', () => {
            scoreDisplay.classList.remove('milestone-blink');
          }, { once: true });
        }
      }
      updateScoreDisplay(state.score, state.highScore);
      previousScore = state.score;
    }
  } else if (state.phase === 'gameover') {
    // Only execute gameover logic ONCE when transitioning to gameover
    if (phaseChanged) {
      menuScreen.classList.add('hidden');
      gameoverScreen.classList.remove('hidden');
      scoreDisplay.classList.add('hidden');  // Fix: Hide score on game over
      stopMenuMusic();  // Stop menu music on game over
      // Story 22.1: Set background glow to white on game over
      setGlowToWhite();

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
      }

      // Story 23.2: Render Run Summary Bar (food type counts for this run)
      renderRunSummaryBar(state.cognitiveStats);

      // Story 14.2: Show highlights with staggered animation
      setTimeout(async () => {
        // Wait for metrics to be available (populated by saveSessionMetrics in game.js)
        // Add small delay to ensure async saveSessionMetrics completes
        await new Promise(resolve => setTimeout(resolve, 100));

        // Story 14.1/14.5/14.6: Query all data in parallel
        const [allTimeHighs, lastPattern, totalSessions, recentSessions] = await Promise.all([
          getAllTimeHighs(),
          Promise.resolve(getLastSessionPattern()),
          getTotalSessionCount(),
          getRecentSessions(30) // Story 14.6: Last 30 days for streak calculation
        ]);

        // Story 14.5: Get calibration state
        const calibrationInfo = getCalibrationState(totalSessions);

        // Story 15.4: Get celebration flag from storage
        const calibrationStatus = getCalibrationStatus();

        // Story 14.6: Get streak data (retrospective, for backwards compatibility)
        const streakInfo = getStreakData(recentSessions);

        // Story 17.1/17.5: Check and update persistent streak
        const streakResult = checkAndUpdateStreak();
        console.log('[Story 17.1] Streak result:', streakResult);

        let highlights = [];
        let callerQuote = null;
        let sessionContext = null;

        // Story 14.1: Select highlights if metrics are available
        if (state.currentSessionMetrics && state.rollingAverages) {
          highlights = selectHighlights(
            state.currentSessionMetrics,
            state.rollingAverages,
            allTimeHighs,
            state.cognitiveStats,
            lastPattern
          );

          // Save pattern for variety enforcement
          saveSessionPattern(highlights.map(h => h.type));

          console.log('[Epic 14] Highlights selected:', highlights);

          // Story 14.3/14.5/14.6/15.4: Build session context for caller quote and footer
          sessionContext = {
            // Story 14.6: Streak data
            streakDays: streakInfo.streakDays,
            streakBroken: streakInfo.isBroken,
            streakMilestone: streakInfo.milestoneReached,
            streakText: formatStreakCounter(streakInfo.streakDays, streakInfo.isBroken),
            // Story 14.5: Calibration data
            calibrationState: calibrationInfo.state, // in_progress, complete, or unlocked
            calibrationSessionCount: calibrationInfo.sessionCount,
            // Story 15.4: Celebration flag for one-time celebration display
            shouldShowCelebration: calibrationStatus.shouldShowCelebration,
            totalSessions: totalSessions
          };

          // Story 18.3: Select caller quote using comedy.js system
          // Build context from session data
          const quoteContext = buildContext({
            score: state.score,
            highlights: highlights,
            cognitiveStats: {
              rcSurvived: state.cognitiveStats.rcSurvived || 0
            },
            diedDuringRC: state.cognitiveStats.rcDeath || false,
            comboMultipliers: state.cognitiveStats.comboMultipliers || 0,
            phoneCallsManaged: state.cognitiveStats.phoneCallsManaged || 0,
            streak: streakInfo.streakDays,
            sessionCount: totalSessions
          });

          // Get last quote ID to prevent repetition
          const lastQuoteId = sessionStorage.getItem('lastPostGameQuoteId');

          // Select quote with deduplication
          const selectedQuote = selectQuote(quoteContext, lastQuoteId);

          // Store quote ID for next session
          sessionStorage.setItem('lastPostGameQuoteId', selectedQuote.id);

          // Format for cognitive-feedback.js (expects {text, caller, portrait})
          callerQuote = {
            text: selectedQuote.text,
            caller: selectedQuote.callerName,
            portrait: selectedQuote.portrait
          };

          console.log('[Epic 14] Caller quote selected:', callerQuote);
          console.log('[Epic 14] Calibration state:', calibrationInfo.state, `(${totalSessions} sessions)`);
          console.log('[Epic 14] Streak data:', `${streakInfo.streakDays} days`, streakInfo.isBroken ? '(broken)' : '', streakInfo.milestoneReached ? '(MILESTONE)' : '');
        } else {
          console.warn('[Epic 14] Session metrics not available yet - skipping highlight selection');
        }

        // Story 14.7: Set Skill Map button state based on calibration (immediately, no delay)
        if (sessionContext && sessionContext.calibrationState === 'in_progress') {
          skillMapBtn.disabled = true;
          console.log('[Story 14.7] Skill Map button disabled - calibration in progress');
        } else {
          skillMapBtn.disabled = false;
          console.log('[Story 14.7] Skill Map button enabled - calibration complete');
        }

        // Story 14.2: Show highlights with staggered animation
        // Story 14.5: sessionContext includes calibration state for footer rendering
        await showHighlights(highlights, callerQuote, sessionContext);

        // Story 17.5: Render streak counter below buttons
        renderStreakCounter(streakResult);
        console.log('[Story 17.5] Post-game streak counter rendered');
      }, CONFIG.COGNITIVE_STATS_DISPLAY.initialDelay);
    }
  } else if (state.phase === 'skillmap') {
    // Story 16.1: Skill Map screen phase
    if (phaseChanged) {
      menuScreen.classList.add('hidden');
      gameoverScreen.classList.add('hidden');
      scoreDisplay.classList.add('hidden');
      skillMapScreen.classList.remove('hidden');
      stopMenuMusic();  // Stop menu music when entering Skill Map
      // Story 22.1: Set background glow to white on Skill Map
      setGlowToWhite();

      // Story 16.1: Render Skill Map content (async with error handling)
      dashboard.renderSkillMap().catch(error => {
        console.error('[BUG FIX] Error rendering Skill Map:', error);
      });
      console.log('[Story 16.1] Skill Map screen displayed');
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

// Story 14.7 + 15.2 + 15.3: Skill Map button (Game Over) - Opens full dashboard (Epic 16)
skillMapBtn.addEventListener('click', () => {
  // Story 15.2: Check calibration status and show tooltip if locked
  const calibrationStatus = getCalibrationStatus();

  if (!calibrationStatus.isComplete) {
    // Calibration in progress - show tooltip and prevent navigation
    showCalibrationTooltip(skillMapBtn, calibrationStatus.sessionsCompleted);
    console.log('[Story 15.2] Skill Map locked - calibration in progress');
    return;
  }

  // Story 15.3: Navigate to Skill Map (unlocked)
  console.log('[Story 15.3] Skill Map button clicked - navigation enabled');
  navigateToSkillMap(gameState);
});

// Story 16.1: Skill Map button (Main Menu) - Opens full dashboard
skillMapMenuBtn.addEventListener('click', () => {
  console.log('[Story 16.1] Skill Map menu button clicked');
  navigateToSkillMap(gameState);
});

// Story 16.1: Play Now button (Skill Map → New Game)
if (playNowBtn) {
  playNowBtn.addEventListener('click', () => {
    console.log('[Story 16.1] Play Now clicked - starting new game');
    resetGame(gameState);
    gameState.phase = 'playing';
    spawnFood(gameState);
  });
} else {
  console.error('[Main] Play Now button not found in DOM');
}

// Story 16.1: Back to Menu button (Skill Map → Menu)
backToMenuBtn.addEventListener('click', () => {
  console.log('[Story 16.1] Back to Menu clicked');
  // Hide Skill Map screen IMMEDIATELY to prevent flash of empty screen during cleanup
  skillMapScreen.classList.add('hidden');
  gameState.phase = 'menu';
});

// Note: Enter key handling moved to input.js (Story 4.4)
// Removed duplicate handler to prevent double-firing

// Wire up feedback button (Story 6.2)
const feedbackButton = document.getElementById('feedback-button');
if (feedbackButton) {
  feedbackButton.addEventListener('click', () => {
    openFeedbackModal(gameState);
    console.log('[Feedback] Button clicked - Phase:', gameState.phase);
  });
}

// Initialize feedback modal (Story 6.1 + 6.5)
initStarRatings();
initCharCounter();
initFeedbackModal();  // Story 6.5: Pre-fill saved email

// Wire up feedback modal close button
const closeFeedbackBtn = document.getElementById('close-feedback-btn');
if (closeFeedbackBtn) {
  closeFeedbackBtn.addEventListener('click', () => {
    closeFeedbackModal(gameState);
  });
}

// Wire up feedback form submit (Story 6.4)
const feedbackForm = document.getElementById('feedback-form');
if (feedbackForm) {
  feedbackForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Show thank you screen FIRST
    showThankYouScreen(gameState);

    // Then trigger mailto: after a short delay
    // This ensures the thank you screen shows before email client opens
    setTimeout(() => {
      const success = submitFeedback(gameState);
      if (!success) {
        // Error: show fallback message
        alert(`Failed to open email client. Please email your feedback to: ${CONFIG.FEEDBACK_EMAIL}`);
      }

      // Reset form AFTER submission for next time
      resetFeedbackForm();
    }, 100);
  });
}

// Wire up "Back to Game" button (Story 6.4)
const backToGameBtn = document.getElementById('back-to-game-btn');
if (backToGameBtn) {
  backToGameBtn.addEventListener('click', async () => {
    console.log('[Main] Back to Game button clicked');
    // Resume audio context on user interaction
    await resumeAudio();
    console.log('[Main] Audio resumed from button click');
    closeThankYouScreen(gameState);
  });
}

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

// Debug helpers for feedback modal testing (Story 6.1)
window.testOpenFeedback = () => {
  openFeedbackModal(gameState);
  console.log('[Test] Feedback modal opened, phase:', gameState.phase);
};

window.testCloseFeedback = () => {
  closeFeedbackModal(gameState);
  console.log('[Test] Feedback modal closed, phase:', gameState.phase);
};

window.testGetFeedbackData = () => {
  const data = getFormData();
  console.log('[Test] Feedback form data:', data);
  return data;
};

window.testResetFeedback = () => {
  resetFeedbackForm();
  console.log('[Test] Feedback form reset');
};

// Debug helpers for metadata capture testing (Story 6.3)
window.testCaptureMetadata = () => {
  const metadata = captureMetadata(gameState);
  console.log('[Test] Captured metadata:', metadata);
  return metadata;
};

window.testFormatEmailBody = () => {
  const formData = getFormData();
  const metadata = captureMetadata(gameState);
  const emailBody = formatEmailBody(formData, metadata);
  console.log('[Test] Formatted email body:\n', emailBody);
  return emailBody;
};

window.testFormatEmailSubject = () => {
  const formData = getFormData();
  const metadata = captureMetadata(gameState);
  const subject = formatEmailSubject(formData, metadata);
  console.log('[Test] Email subject:', subject);
  return subject;
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

// Debug helper for menu music
window.testMenuMusic = async () => {
  console.log('[Debug] Testing menu music...');
  console.log('[Debug] Current phase:', gameState.phase);
  await initAudio();
  await resumeAudio();
  playMenuMusic();
};

console.log('🎮 === CrazySnakeLite - Epic 3 Complete! ===');
console.log('');
console.log('Audio helpers:');
console.log('  window.testMenuMusic() - Test menu music playback');
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
