// CrazySnakeLite - Game Loop Module
import { CONFIG } from './config.js';
import { render } from './render.js';
import { moveSnake, growSnake } from './snake.js';
import { checkFoodCollision, checkWallCollision, checkSelfCollision } from './collision.js';
import { spawnFood } from './food.js';
import { applyEffect, clearEffect } from './effects.js';
import { checkPhoneCallTiming, dismissPhoneCall, scheduleNextCall, hidePhoneOverlay } from './phone.js';
import { trackPhoneCall, trackFoodEaten, trackPhoneCallEvent, trackGameOver } from './analytics.js';
import { playMoveSound, playDeathSound, playJackpot, playLegendary, playComboExit } from './audio.js';
import { getFoodScore } from './scoring.js';
import { spawnPopup, spawnPhoneBonusPopup, spawnComboPopup, spawnParticles, triggerScreenShake, gridToPixel, spawnFlash } from './score-popup.js';
import { getComboProbability, getState as getProgressionState } from './progression.js';
import { activateCombo, isComboActive, exitCombo } from './combo.js';
import {
  calculateReactionTime,
  calculateSpatialAwareness,
  calculateCognitiveFlexibility,
  calculateDividedAttention,
  calculateImpulseControl,
  calculateWorkingMemory,
  calculateRollingAverages,
  calculateBaselineMetrics
} from './metrics.js';
import { saveSession, getSessions, getProfile, updateProfile } from './storage.js';

const TICK_RATE = CONFIG.TICK_RATE;

let lastTime = 0;
let accumulator = 0;

// UI update callback (set by main.js)
let uiUpdateCallback = null;

// Story 20.2: Track previous background tier for CSS/Canvas hybrid rendering
let lastBackground = null;

// Story 20.5: Track death flash state for border priority cascade
let deathFlashActive = false;

/**
 * Main game loop - Fixed timestep + RAF
 * Logic updates at 125ms intervals (or modified by speed effects)
 * Rendering at 60 FPS
 * UPDATED in Story 2.4: Dynamic tick rate based on speed multiplier
 */
export function gameLoop(currentTime, ctx, gameState) {
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;
  accumulator += deltaTime;

  // Check for phone call timing (Story 3.2)
  checkPhoneCallTiming(gameState);

  // Check if Pick Up timer expired (Story 9.3)
  checkPickUpTimerExpiration(gameState, currentTime);

  // Calculate current tick rate based on active effect
  const currentTickRate = getCurrentTickRate(gameState);

  // Fixed timestep updates
  let tickedThisFrame = false;
  while (accumulator >= currentTickRate) {
    update(gameState);
    accumulator -= currentTickRate;
    tickedThisFrame = true;
  }

  // Play sound ONCE per frame after all updates settle (Story 4.5)
  // Decoupled from while loop to guarantee one sound per visual movement
  if (tickedThisFrame && gameState.phase === 'playing') {
    playMoveSound(gameState);
  }

  // Render every frame (60 FPS)
  render(ctx, gameState);

  // Update UI based on phase
  updateUI(gameState);

  // Continue loop
  requestAnimationFrame((time) => gameLoop(time, ctx, gameState));
}

/**
 * Update canvas background color based on score tier and combo mode (Story 20.2)
 * CSS/Canvas hybrid rendering: CSS handles background transitions, canvas handles game objects
 * Event-driven: Only updates when tier changes OR combo state changes (NOT every frame)
 * @param {Object} gameState - Current game state
 */
export function updateCanvasBackground(gameState) {
  const canvas = document.getElementById('game-canvas');

  // Combo mode: Use inverted background (darker)
  // Normal mode: Use progression-based background (light → dark)
  const background = isComboActive(gameState)
    ? CONFIG.COLORS.comboBackground
    : getProgressionState(gameState.score).background;

  // Only update if background changed (event-driven, not per-frame)
  if (background !== lastBackground) {
    canvas.style.backgroundColor = background;
    lastBackground = background;

    const mode = isComboActive(gameState) ? 'COMBO' : 'NORMAL';
    console.log(`[V4] Background changed to ${background} (${mode}) at score ${gameState.score}`);
  }
}

/**
 * Reset canvas background to tier-0 default on game restart (Story 20.4)
 * Called when starting a new game to ensure clean visual state
 */
export function resetCanvasBackground() {
  const canvas = document.getElementById('game-canvas');
  canvas.style.backgroundColor = '#1a1a1a';  // Dark background (constant)
  lastBackground = '#1a1a1a';

  console.log('[V4] Background reset to dark (#1a1a1a)');
}

/**
 * Update canvas border color based on game state priority cascade (Story 20.5)
 * Event-driven: called ONLY when game state changes (death, phone, combo, effects)
 *
 * Priority cascade (highest to lowest):
 * 1. Death flash (red, 500ms) - highest priority
 * 2. Phone ring (gold) - decision point
 * 3. Phone pickup (green) - committed
 * 4. Combo (dynamic) - multiplier active
 * 5. Reverse Controls (orange) - disorienting effect
 * 6. Invincibility (yellow) - protected state
 * 7. Default (purple) - base state
 *
 * @param {Object} gameState - Current game state
 */
export function updateBorderState(gameState) {
  const canvas = document.getElementById('game-canvas');

  // Clear all border classes first
  canvas.classList.remove(
    'border-phone-ring',
    'border-phone-pickup',
    'border-combo',
    'border-invincibility',
    'border-wallPhase'
  );

  // Priority cascade evaluation (highest to lowest)

  // 1. Phone ring (gold, decision point)
  if (gameState.phoneCall.active && !gameState.phoneCall.pickedUp) {
    canvas.classList.add('border-phone-ring');
    console.log('[V4] Border → phone ring (gold)');
    return;
  }

  // 2. Phone pickup (green, committed)
  if (gameState.phoneCall.pickedUp && gameState.phoneCall.pickUpEndTime > Date.now()) {
    canvas.classList.add('border-phone-pickup');
    console.log('[V4] Border → phone pickup (green)');
    return;
  }

  // 3. Combo (dynamic color from combo system)
  if (gameState.combo.active && !gameState.combo.paused) {
    canvas.classList.add('border-combo');
    // Dynamic color still uses inline style (CSS class provides transition)
    canvas.style.borderColor = gameState.combo.canvasColor;
    console.log(`[V4] Border → combo (${gameState.combo.canvasColor})`);
    return;
  }

  // 4. Invincibility (yellow blinking)
  if (gameState.activeEffect?.type === 'invincibility') {
    canvas.classList.add('border-invincibility');
    console.log('[V4] Border → invincibility (yellow blinking)');
    return;
  }

  // 5. Wall Phase (purple - safe to cross walls)
  if (gameState.activeEffect?.type === 'wallPhase') {
    canvas.classList.add('border-wallPhase');
    console.log('[V4] Border → wall phase (purple - safe crossing)');
    return;
  }

  // 6. Default (black) - clear inline style, let CSS default take over
  canvas.style.borderColor = '';
  console.log('[V4] Border → default (black)');
}

/**
 * Game logic update (fixed timestep)
 */
function update(gameState) {
  if (gameState.phase !== 'playing') {
    return;
  }

  // Story 12.2: Increment tick counter
  gameState.currentTick += 1;

  // Move snake
  moveSnake(gameState);

  // Check food collision
  if (checkFoodCollision(gameState)) {
    const food = gameState.food;
    const foodPosition = { x: food.position.x, y: food.position.y };

    // Story 8.1: Use hiddenType for blinking food, otherwise use type
    const effectType = food.isBlinking ? food.hiddenType : food.type;

    // Always grow snake
    growSnake(gameState);

    // Story 7.1: Update score using Fibonacci scoring system
    // Award base food score immediately
    const scoreIncrease = getFoodScore(effectType);
    gameState.score += scoreIncrease;

    // Story 20.2: Update background tier if score crossed threshold (event-driven)
    updateCanvasBackground(gameState);

    // Story 13.2: Track reaction time (food spawn to consumption)
    if (food.spawnedAt) {
      const responseTime = Date.now() - food.spawnedAt;
      const duringRC = gameState.effects.reverseControlsActive || false;
      const duringPhone = gameState.phoneCall.active || false;

      gameState.metricsTracking.rawEvents.push({
        type: 'food_eaten',
        timestamp: Date.now(),
        foodType: effectType,
        scoreGained: scoreIncrease,
        responseTime: responseTime,
        duringRC: duringRC,
        duringPhone: duringPhone,
        duringCombo: gameState.combo?.active || false  // Story 13.7: Track combo mode
      });
    }

    // Story 9.5: Check if grace period should end
    if (gameState.phoneCall.graceActive && gameState.score >= CONFIG.PHONE_GRACE_SCORE) {
      gameState.phoneCall.graceActive = false;
      console.log('[Game] Grace period ended at score', gameState.score, '- phone calls now active');
      scheduleNextCall(gameState);
    }

    // Story 8.6: Track mystery food consumption (engagement metric)
    if (food.isBlinking) {
      gameState.cognitiveStats.mysteryFoodsEaten += 1;
    }

    // Story 12.2: Track food type distribution
    gameState.analyticsState.foodTypesEaten[effectType] += 1;

    // Story 12.2: Track Reverse Controls specifically
    if (effectType === 'reverseControls') {
      gameState.analyticsState.totalRCFoodsEaten += 1;
      gameState.analyticsState.rcActivationTick = gameState.currentTick;
    }

    // Story 12.2: Track milestone crossing [3, 15, 40, 60, 100]
    const milestones = [3, 15, 40, 60, 100];
    milestones.forEach(milestone => {
      if (gameState.score === milestone && !gameState.analyticsState.milestonesReached.includes(milestone)) {
        gameState.analyticsState.milestonesReached.push(milestone);
      }
    });

    // Story 12.5: Track food consumption event to Plausible
    // Call AFTER score incremented and analyticsState updated, BEFORE applying new effect
    trackFoodEaten(gameState);

    // Story 10.1: Check combo activation (only if combo not already active)
    // Capture state BEFORE activation check so progression doesn't run on the same food
    const wasComboActive = isComboActive(gameState);

    if (!wasComboActive && gameState.score >= 30) {
      const comboProbability = getComboProbability(gameState.score);

      if (Math.random() < comboProbability) {
        // Activate combo with current food as Effect A
        activateCombo({ type: effectType }, gameState);

        // Story 20.2: Update background to combo mode color
        updateCanvasBackground(gameState);

        // Story 20.5: Update border to combo color
        updateBorderState(gameState);

        // Story 10.7: Track combo activation (Review fix: moved from combo.js to game.js for proper module boundaries)
        gameState.analyticsState.totalCombosTriggered += 1;
      }
    }

    // Combo Mode: Handle food progression (if combo was ALREADY active before this food)
    // Uses wasComboActive to prevent activation + progression on the same food
    if (wasComboActive) {
      // Pause combo progression during phone calls
      if (CONFIG.COMBO_PAUSE_ON_PHONE && gameState.phoneCall.active) {
        // Combo state fully preserved (effectA, effectB, canvasColor, striped snake)
        // Skip combo progression - player must dismiss phone before combo advances
      } else {
        // Phone not active - proceed with normal combo progression
        if (gameState.combo.foodCount === 1) {
          // FOOD #2: Second food during combo → set Effect B, apply BOTH effects, award multiplicative score
          gameState.combo.effectB = {
            type: effectType,
            points: scoreIncrease
          };
          gameState.combo.foodCount = 2;

          // Calculate multiplicative score (A × B)
          const comboScore = gameState.combo.effectA.points * gameState.combo.effectB.points;

          // Award combo score (replaces base food score)
          gameState.score -= scoreIncrease; // Remove base score that was added earlier
          gameState.score += comboScore;    // Add multiplied score instead

          // Story 20.2: Update background tier after combo score applied
          updateCanvasBackground(gameState);

          // Spawn combo popup at snake head
          const head = gameState.snake.segments[0];
          spawnComboPopup(comboScore, head.x, head.y);

          // Play audio cues for high-value combos
          if (comboScore >= CONFIG.COMBO_LEGENDARY_THRESHOLD) {
            playLegendary();
          } else if (comboScore >= CONFIG.COMBO_JACKPOT_THRESHOLD) {
            playJackpot();
          }

          // Track combo stats
          gameState.cognitiveStats.comboMultipliers += 1;
          gameState.cognitiveStats.peakComboScore = Math.max(
            gameState.cognitiveStats.peakComboScore,
            comboScore
          );
          gameState.analyticsState.comboScores.push(comboScore);

        } else if (gameState.combo.foodCount === 2) {
          // FOOD #3: Third food → exit combo, regular points awarded (already added above)
          gameState.combo.foodCount = 3; // Mark as exiting

          // Exit combo mode (transition canvas, reset state)
          exitCombo(gameState);

          // Story 20.2: Update background back to normal progression color
          updateCanvasBackground(gameState);

          // Story 20.5: Update border back to normal state
          updateBorderState(gameState);

          // Play exit audio (deflation tone)
          playComboExit();
        }
      }
    }

    // Story 7.2: Spawn score popup at food position (temporal contiguity <200ms)
    spawnPopup(scoreIncrease, foodPosition.x, foodPosition.y, '', effectType);

    // Story 7.3: Special effects for +8 (Reverse Controls)
    if (effectType === 'reverseControls') {
      const { x: pixelX, y: pixelY } = gridToPixel(foodPosition.x, foodPosition.y);
      spawnParticles(6, pixelX, pixelY);  // 6 particles
      triggerScreenShake();
    }

    // Story 11.1: Check if player survived Reverse Controls
    // This check happens BEFORE effects are applied/cleared (which resets the flag)
    if (gameState.effects.reverseControlsActive) {
      // Player successfully navigated RC and ate next food
      const { x: pixelX, y: pixelY } = gridToPixel(foodPosition.x, foodPosition.y);

      // Spawn "RC SURVIVED" flash (20px below +8 popup, 200ms stagger)
      setTimeout(() => {
        spawnFlash('RC SURVIVED', pixelX, pixelY + 20);
      }, 200);

      // Track survival in cognitive stats
      gameState.cognitiveStats.rcSurvived += 1;
    }

    // Note: Wall Phase bonus (+2) is awarded immediately in snake.js when wall is crossed

    // Handle effects based on effect type and combo state
    if (isComboActive(gameState) && gameState.combo.foodCount === 2) {
      // COMBO MODE - Food #2: Both Effect A (already active) and Effect B (current food) are active
      // Don't clear Effect A, keep it active alongside Effect B
      // Striped snake rendering handled by render.js (reads combo.effectA/effectB)
    } else if (effectType === 'growing') {
      // Growing food clears effect and sets snake to green
      clearEffect(gameState);
      gameState.snake.color = CONFIG.COLORS.snakeGrowing;

      // Update border and background when effect cleared
      updateBorderState(gameState);
      updateCanvasBackground(gameState);
    } else {
      // Special food applies its effect (clears previous first)
      applyEffect(gameState, effectType);

      // Update border and background when effect applied
      updateBorderState(gameState);
      updateCanvasBackground(gameState);
    }

    // Spawn new food
    spawnFood(gameState);

    // Story 12.2: Track food spawn time and blinking food spawns
    gameState.analyticsState.foodSpawnTime = Date.now();
    if (gameState.food.isBlinking) {
      gameState.analyticsState.totalBlinkingFoodsSpawned += 1;
    }
  }

  // Check death conditions (Story 12.7: Determine death cause separately)
  const hitWall = checkWallCollision(gameState);
  const hitSelf = checkSelfCollision(gameState);

  if (hitWall || hitSelf) {
    // Story 12.7: Capture death cause ('wall' or 'self')
    gameState.deathCause = hitWall ? 'wall' : 'self';

    // Story 12.7: Capture active effect on death (if any)
    if (gameState.effects.invincibilityActive) {
      gameState.activeEffect = { type: 'invincibility' };
    } else if (gameState.effects.wallPhaseActive) {
      gameState.activeEffect = { type: 'wallPhase' };
    } else if (gameState.effects.speedBoostActive) {
      gameState.activeEffect = { type: 'speedBoost' };
    } else if (gameState.effects.speedDecreaseActive) {
      gameState.activeEffect = { type: 'speedDecrease' };
    } else if (gameState.effects.reverseControlsActive) {
      gameState.activeEffect = { type: 'reverseControls' };
    } else {
      gameState.activeEffect = null;
    }

    // Award consolation bonus if Pick Up timer is active (Story 9.3, Story 9.7)
    if (gameState.phoneCall.pickedUp) {
      // Story 9.7: Compute reaction time and track event (survived = false)
      const reactionTime = Date.now() - gameState.analyticsState.phoneCallShowTime;

      trackPhoneCall({
        action: 'pickup',
        reactionTime,
        survived: false, // Died during countdown
        bonus: gameState.phoneCall.pickUpBonus,
        timestamp: Date.now()
      });

      // Story 13.5: Track phone call event for divided attention metric
      // Story 13.6: Include context for impulse control metric
      gameState.metricsTracking.rawEvents.push({
        type: 'phone_call',
        timestamp: Date.now(),
        decision: 'pickup',
        decisionTime: reactionTime,
        survived: false, // Died during countdown
        bonus: gameState.phoneCall.pickUpBonus,
        context: {
          inComboMode: gameState.combo?.active || false,
          currentScore: gameState.score, // Score at death (before consolation bonus)
          pickupBonus: gameState.phoneCall.pickUpBonus,
          blinkingFoodActive: gameState.food?.isBlinking || false,
          snakeLength: gameState.snake?.segments?.length || 0
        }
      });

      const consolationBonus = gameState.phoneCall.pickUpBonus;
      gameState.score += consolationBonus;

      // Story 20.2: Update background tier after death bonus applied
      updateCanvasBackground(gameState);

      // Increment Pick Up count (consolation counts too)
      gameState.phoneCall.pickUpCount += 1;

      // Story 9.6: Spawn consolation bonus popup at snake head (suppress 0-value popups)
      if (consolationBonus > 0) {
        const head = gameState.snake.segments[0];
        spawnPhoneBonusPopup(consolationBonus, head.x, head.y);
      }

      console.log('[Game] Death during Pick Up - consolation bonus awarded:', consolationBonus);
    }

    // Auto-dismiss phone if active (Story 3.3)
    if (gameState.phoneCall.active) {
      dismissPhoneCall(gameState);
    }

    // Story 10.7: Track combo state at death (for analytics)
    gameState.analyticsState.combo_active = gameState.combo.active;

    // Story 14.3: Track if death occurred during Reverse Controls
    gameState.cognitiveStats.rcDeath = gameState.effects.reverseControlsActive || false;

    // Exit combo mode if active (reset canvas color and state)
    if (gameState.combo.active) {
      exitCombo(gameState);

      // Story 20.2: Update background back to normal progression color
      updateCanvasBackground(gameState);

      // Story 20.5: Update border back to normal state
      updateBorderState(gameState);
    }

    // Story 12.4: Store previous score for next game's trackGameStart
    sessionStorage.setItem('crazysnake_previous_score', gameState.score.toString());

    // Story 12.4: Update highest score in sessionStorage (for session end tracking)
    const highestScore = parseInt(sessionStorage.getItem('crazysnake_highest_score') || '0');
    if (gameState.score > highestScore) {
      sessionStorage.setItem('crazysnake_highest_score', gameState.score.toString());
    }

    // Story 12.7: Track game over event to Plausible (BEFORE state reset)
    trackGameOver(gameState);

    // Story 12.8: Update session aggregation for session_end event
    updateSessionAggregation(gameState);

    // Play death sound (Bug fix)
    playDeathSound();
    gameState.phase = 'gameover';

    // Story 20.5: Trigger death flash border (500ms, highest priority)
    deathFlashActive = true;
    updateBorderState(gameState);

    setTimeout(() => {
      deathFlashActive = false;
      updateBorderState(gameState);  // Re-evaluate priority after flash
    }, CONFIG.BORDER_DEATH_FLASH_DURATION);

    // Story 13.9: Save session metrics to IndexedDB
    // Story 14.1: Store metrics for highlight selection
    // Story 15.6: Calculate baseline after session 5
    saveSessionMetrics(gameState).then(async (result) => {
      gameState.currentSessionMetrics = result.metrics;
      gameState.rollingAverages = result.rollingAverages;

      // Story 15.6 Task 4: Calculate and store baseline after session 5
      const profile = getProfile();
      if (profile.sessionsCompleted === 5 && !profile.baselineMetrics) {
        try {
          // Fetch first 5 sessions for baseline calculation
          const sessions = await getSessions(5);

          // Calculate baseline metrics
          const baseline = calculateBaselineMetrics(sessions);

          // Store baseline in profile
          updateProfile({ baselineMetrics: baseline });

          console.log('[Story 15.6] Baseline established after session 5:', baseline);
        } catch (error) {
          console.error('[Story 15.6] Failed to calculate baseline:', error);
        }
      }
    });

    // Story 15.1: Increment session counter and check calibration
    const profile = getProfile();
    const newSessionCount = profile.sessionsCompleted + 1;

    // Update session count
    updateProfile({
      sessionsCompleted: newSessionCount
    });

    // Check calibration threshold (5+ sessions)
    if (newSessionCount >= 5 && !profile.calibrationComplete) {
      updateProfile({ calibrationComplete: true });
      console.log('[Game] Calibration complete - 5+ sessions reached');
    }

    // Calculate and update domain scores after each session
    updateDomainScores().catch(error => {
      console.error('[Game] Failed to update domain scores:', error);
    });
  }
}

/**
 * Calculate domain scores from recent sessions and update profile
 * Converts individual session metrics into aggregated 0-5 domain scores
 */
async function updateDomainScores() {
  try {
    // Get last 10 sessions for rolling average
    const sessions = await getSessions(10);

    if (sessions.length === 0) {
      console.log('[Game] No sessions found, skipping domain score update');
      return;
    }

    // Calculate average normalized metrics across sessions (0-1 scale)
    const avgMetrics = {
      reactionTime: 0,
      spatialAwareness: 0,
      cognitiveFlexibility: 0,
      dividedAttention: 0,
      impulseControl: 0,
      workingMemory: 0
    };

    // Sum up all metrics
    sessions.forEach(session => {
      if (session.metrics) {
        avgMetrics.reactionTime += session.metrics.reactionTime || 0;
        avgMetrics.spatialAwareness += session.metrics.spatialAwareness || 0;
        avgMetrics.cognitiveFlexibility += session.metrics.cognitiveFlexibility || 0;
        avgMetrics.dividedAttention += session.metrics.dividedAttention || 0;
        avgMetrics.impulseControl += session.metrics.impulseControl || 0;
        avgMetrics.workingMemory += session.metrics.workingMemory || 0;
      }
    });

    // Calculate averages
    const sessionCount = sessions.length;
    Object.keys(avgMetrics).forEach(key => {
      avgMetrics[key] = avgMetrics[key] / sessionCount;
    });

    // Convert to 0-5 block scale with 0.1 precision (10 segments per block)
    const domainScores = {
      reactionTime: Math.round(avgMetrics.reactionTime * 50) / 10,
      spatialAwareness: Math.round(avgMetrics.spatialAwareness * 50) / 10,
      cognitiveFlexibility: Math.round(avgMetrics.cognitiveFlexibility * 50) / 10,
      dividedAttention: Math.round(avgMetrics.dividedAttention * 50) / 10,
      impulseControl: Math.round(avgMetrics.impulseControl * 50) / 10,
      workingMemory: Math.round(avgMetrics.workingMemory * 50) / 10
    };

    // Update profile with domain scores
    updateProfile({ domainScores });

    console.log('[Game] Domain scores updated:', domainScores);
  } catch (error) {
    console.error('[Game] Error calculating domain scores:', error);
    throw error;
  }
}

/**
 * Calculate and save session metrics to IndexedDB
 * Story 13.9: Persistence and retrieval
 * @param {Object} gameState - Game state at game over
 */
async function saveSessionMetrics(gameState) {
  try {
    // Calculate all 6 cognitive metrics from rawEvents
    const metrics = {
      reactionTime: calculateReactionTime(gameState.metricsTracking.rawEvents),
      spatialAwareness: calculateSpatialAwareness(
        gameState.snake.segments.length,
        CONFIG.GRID_WIDTH,
        CONFIG.GRID_HEIGHT,
        CONFIG.GRID_UNIT_SIZE
      ),
      cognitiveFlexibility: calculateCognitiveFlexibility(gameState.metricsTracking.rawEvents),
      dividedAttention: calculateDividedAttention(gameState.metricsTracking.rawEvents),
      impulseControl: calculateImpulseControl(gameState.metricsTracking.rawEvents),
      workingMemory: calculateWorkingMemory(gameState.metricsTracking.rawEvents)
    };

    // Query previous sessions for rolling average calculation
    const previousSessions = await getSessions(9); // Get last 9 sessions

    // Calculate rolling averages
    const rollingAverages = calculateRollingAverages(metrics, previousSessions);

    // Build session object
    const sessionData = {
      sessionId: crypto.randomUUID(),
      timestamp: Date.now(),
      score: gameState.score,
      metrics: metrics,
      rollingAverages: rollingAverages,
      rawEvents: gameState.metricsTracking.rawEvents
    };

    // Save to IndexedDB (async, non-blocking)
    await saveSession(sessionData);

    console.log('[Game] Session metrics saved:', sessionData.sessionId);

    // Story 14.1: Return metrics and rollingAverages for highlight selection
    return { metrics, rollingAverages };
  } catch (error) {
    console.error('[Game] Failed to save session metrics:', error);
    // Graceful degradation - game continues even if save fails
    return { metrics: {}, rollingAverages: {} };
  }
}

/**
 * Update session aggregation in sessionStorage.
 * Called on game over for session_end event aggregation.
 * Story 12.8: Session-level aggregates
 * @param {Object} gameState - Game state at game over
 */
function updateSessionAggregation(gameState) {
  // Update total foods eaten (sum of scores across all games)
  const totalFoods = parseInt(sessionStorage.getItem('crazysnake_total_foods') || '0');
  sessionStorage.setItem('crazysnake_total_foods', (totalFoods + gameState.score).toString());

  // Note: highest_score already updated earlier in death handler (Story 12.4)

  // Update food breakdown (aggregate across games)
  let foodBreakdown = {};
  try {
    const stored = sessionStorage.getItem('crazysnake_food_breakdown');
    foodBreakdown = stored ? JSON.parse(stored) : {};
  } catch (e) {
    foodBreakdown = {};
  }

  const currentFoods = gameState.analyticsState.foodTypesEaten;

  foodBreakdown.growing = (foodBreakdown.growing || 0) + currentFoods.growing;
  foodBreakdown.invincibility = (foodBreakdown.invincibility || 0) + currentFoods.invincibility;
  foodBreakdown.wallPhase = (foodBreakdown.wallPhase || 0) + currentFoods.wallPhase;
  foodBreakdown.speedBoost = (foodBreakdown.speedBoost || 0) + currentFoods.speedBoost;
  foodBreakdown.speedDecrease = (foodBreakdown.speedDecrease || 0) + currentFoods.speedDecrease;
  foodBreakdown.reverseControls = (foodBreakdown.reverseControls || 0) + currentFoods.reverseControls;

  sessionStorage.setItem('crazysnake_food_breakdown', JSON.stringify(foodBreakdown));

  // Update total phone calls (sum across all games)
  const totalPhoneCalls = parseInt(sessionStorage.getItem('crazysnake_total_phone_calls') || '0');
  sessionStorage.setItem('crazysnake_total_phone_calls', (totalPhoneCalls + gameState.analyticsState.totalPhoneCalls).toString());

  // Update reaction times for avg_dismissal_speed_ms calculation
  // Note: For simplicity, we're not tracking individual reaction times in this story
  // The trackPhoneCallEvent already captures reaction_time_ms per call
  // For session aggregation, we'll compute a simple placeholder based on total calls
  // In a future enhancement, could track individual reaction times
  let reactionTimes = [];
  try {
    const stored = sessionStorage.getItem('crazysnake_reaction_times');
    reactionTimes = stored ? JSON.parse(stored) : [];
  } catch (e) {
    reactionTimes = [];
  }

  // Placeholder: If phone calls happened, estimate avg reaction time
  // In practice, this could be enhanced to track actual per-call reaction times
  if (gameState.analyticsState.totalPhoneCalls > 0) {
    // Simple estimation: assume 1000ms avg (actual tracking would be more accurate)
    const avgReactionThisGame = 1000;
    reactionTimes.push(avgReactionThisGame);
    sessionStorage.setItem('crazysnake_reaction_times', JSON.stringify(reactionTimes));
  }

  // Compute overall average dismissal speed
  if (reactionTimes.length > 0) {
    const avgDismissalSpeed = Math.round(reactionTimes.reduce((a, b) => a + b, 0) / reactionTimes.length);
    sessionStorage.setItem('crazysnake_avg_dismissal_speed', avgDismissalSpeed.toString());
  }

  console.log('[Game] Session aggregation updated');
}

/**
 * Update UI elements based on game phase
 */
function updateUI(gameState) {
  if (uiUpdateCallback) {
    uiUpdateCallback(gameState);
  }
}

/**
 * Get current tick rate based on active speed effect
 * UPDATED: Support dual effects in combo mode (Effect A + Effect B)
 * @returns {number} - Tick rate in milliseconds
 */
function getCurrentTickRate(gameState) {
  const baseTickRate = TICK_RATE;  // 125ms (8 moves/sec)

  let totalMultiplier = 1.0;

  // Check Effect A (activeEffect)
  if (gameState.activeEffect && gameState.activeEffect.speedMultiplier) {
    totalMultiplier *= gameState.activeEffect.speedMultiplier;
  }

  // Check Effect B (combo dual effect)
  if (isComboActive(gameState) && gameState.combo.foodCount === 2 && gameState.combo.effectB) {
    // Need to get speed multiplier for Effect B
    const effectBType = gameState.combo.effectB.type;
    if (effectBType === 'speedBoost') {
      // Use average of range for consistency (1.75x)
      totalMultiplier *= (CONFIG.SPEED_BOOST_MIN + CONFIG.SPEED_BOOST_MAX) / 2;
    } else if (effectBType === 'speedDecrease') {
      // Use average of range for consistency (0.4x)
      totalMultiplier *= (CONFIG.SPEED_DECREASE_MIN + CONFIG.SPEED_DECREASE_MAX) / 2;
    }
  }

  if (totalMultiplier !== 1.0) {
    // Faster speed = shorter tick rate (moves more frequently)
    // Slower speed = longer tick rate (moves less frequently)
    return baseTickRate / totalMultiplier;
  }

  return baseTickRate;
}

/**
 * Check if Pick Up timer expired and award bonus
 * Story 9.3: Award bonus when countdown completes
 * Story 9.7: Track Pick Up event with survived = true
 * @param {Object} gameState - Game state
 * @param {number} currentTime - Current timestamp
 */
function checkPickUpTimerExpiration(gameState, currentTime) {
  if (!gameState.phoneCall.pickedUp) return;
  if (currentTime < gameState.phoneCall.pickUpEndTime) return;

  // Story 9.7: Compute reaction time (from show to timer expiry)
  const reactionTime = Date.now() - gameState.analyticsState.phoneCallShowTime;

  // Story 9.7: Track event (legacy format for internal stats)
  trackPhoneCall({
    action: 'pickup',
    reactionTime,
    survived: true,
    bonus: gameState.phoneCall.pickUpBonus,
    timestamp: Date.now()
  });

  // Story 12.6: Track phone call event to Plausible
  trackPhoneCallEvent(gameState, 'pickup');

  // Story 13.5: Track phone call event for divided attention metric
  // Story 13.6: Include context for impulse control metric
  gameState.metricsTracking.rawEvents.push({
    type: 'phone_call',
    timestamp: Date.now(),
    decision: 'pickup',
    decisionTime: reactionTime,
    survived: true, // Timer completed without death
    bonus: gameState.phoneCall.pickUpBonus,
    context: {
      inComboMode: gameState.combo?.active || false,
      currentScore: gameState.score - gameState.phoneCall.pickUpBonus, // Score before bonus
      pickupBonus: gameState.phoneCall.pickUpBonus,
      blinkingFoodActive: gameState.food?.isBlinking || false,
      snakeLength: gameState.snake?.segments?.length || 0
    }
  });

  // Timer expired - award bonus
  const bonus = gameState.phoneCall.pickUpBonus;
  gameState.score += bonus;

  // Story 20.2: Update background tier after phone bonus applied
  updateCanvasBackground(gameState);

  // Increment Pick Up count (for stats/analytics, not used in effect-based bonuses)
  gameState.phoneCall.pickUpCount += 1;

  // Story 12.2: Track Pick Up completion time
  gameState.analyticsState.pickUpCompletionTime = Date.now();

  // Story 9.6: Spawn phone bonus popup at snake head (suppress 0-value popups)
  if (bonus > 0) {
    const head = gameState.snake.segments[0];
    spawnPhoneBonusPopup(bonus, head.x, head.y);
  }

  // Review fix: Use hidePhoneOverlay instead of duplicated inline logic
  hidePhoneOverlay(gameState);

  // Story 20.5: Update border state after phone timer expires
  updateBorderState(gameState);

  // Story 9.5: Schedule next call after Pick Up timer expires
  scheduleNextCall(gameState);

  console.log('[Game] Pick Up timer expired, awarded bonus:', bonus);
}

/**
 * Starts the game loop
 */
export function startGameLoop(ctx, gameState, onUIUpdate) {
  uiUpdateCallback = onUIUpdate;
  lastTime = performance.now();
  accumulator = 0;

  // Story 20.2: Initialize canvas background color (tier-0 at score 0)
  updateCanvasBackground(gameState);

  requestAnimationFrame((time) => gameLoop(time, ctx, gameState));
}
