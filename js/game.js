// CrazySnakeLite - Game Loop Module
import { CONFIG } from './config.js';
import { render } from './render.js';
import { moveSnake, growSnake } from './snake.js';
import { checkFoodCollision, checkWallCollision, checkSelfCollision } from './collision.js';
import { spawnFood } from './food.js';
import { applyEffect, clearEffect } from './effects.js';
import { checkPhoneCallTiming, dismissPhoneCall, scheduleNextCall, hidePhoneOverlay } from './phone.js';
import { trackPhoneCall } from './analytics.js';
import { playMoveSound, playDeathSound, playJackpot, playLegendary, playComboExit } from './audio.js';
import { getFoodScore } from './scoring.js';
import { spawnPopup, spawnPhoneBonusPopup, spawnComboPopup, spawnParticles, triggerScreenShake, gridToPixel, spawnFlash } from './score-popup.js';
import { getComboProbability } from './progression.js';
import { activateCombo, isComboActive, exitCombo } from './combo.js';

const TICK_RATE = CONFIG.TICK_RATE;

let lastTime = 0;
let accumulator = 0;

// UI update callback (set by main.js)
let uiUpdateCallback = null;

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
 * Game logic update (fixed timestep)
 */
function update(gameState) {
  if (gameState.phase !== 'playing') {
    return;
  }

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

    // Story 10.1: Check combo activation (only if combo not already active)
    // Capture state BEFORE activation check so progression doesn't run on the same food
    const wasComboActive = isComboActive(gameState);

    if (!wasComboActive && gameState.score >= 30) {
      const comboProbability = getComboProbability(gameState.score);

      if (Math.random() < comboProbability) {
        // Activate combo with current food as Effect A
        activateCombo({ type: effectType }, gameState);

        // Story 10.7: Track combo activation (Review fix: moved from combo.js to game.js for proper module boundaries)
        gameState.analyticsState.totalCombosTriggered += 1;
      }
    }

    // Combo Mode: Handle food progression (if combo was ALREADY active before this food)
    // Uses wasComboActive to prevent activation + progression on the same food
    if (wasComboActive) {
      // Pause combo progression during phone calls
      if (CONFIG.COMBO_PAUSE_ON_PHONE && gameState.phoneCall.active) {
        console.log('[Combo] Paused during phone call. foodCount unchanged:', gameState.combo.foodCount);
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

          console.log(`[Combo] Food #2: ${effectType} (+${scoreIncrease}), Score: ${gameState.combo.effectA.points} × ${gameState.combo.effectB.points} = ${comboScore}, Both effects active`);
        } else if (gameState.combo.foodCount === 2) {
          // FOOD #3: Third food → exit combo, regular points awarded (already added above)
          gameState.combo.foodCount = 3; // Mark as exiting

          // Exit combo mode (transition canvas, reset state)
          exitCombo(gameState);

          // Play exit audio (deflation tone)
          playComboExit();

          console.log(`[Combo] Food #3: ${effectType} (+${scoreIncrease}), Regular points, Combo exited`);
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

      console.log(`[RC] Survived! Total: ${gameState.cognitiveStats.rcSurvived}`);
    }

    // Note: Wall Phase bonus (+2) is awarded immediately in snake.js when wall is crossed

    // Handle effects based on effect type and combo state
    if (isComboActive(gameState) && gameState.combo.foodCount === 2) {
      // COMBO MODE - Food #2: Both Effect A (already active) and Effect B (current food) are active
      // Don't clear Effect A, keep it active alongside Effect B
      // Effect B is stored in combo.effectB, we'll check it in collision/speed calculations
      console.log(`[Combo] Dual effects active: ${gameState.combo.effectA.type} + ${gameState.combo.effectB.type}`);

      // Update snake color to show striped pattern (handled by render.js)
      // activeEffect stays as Effect A, Effect B is in combo.effectB
    } else if (effectType === 'growing') {
      // Growing food clears effect and sets snake to green
      clearEffect(gameState);
      gameState.snake.color = CONFIG.COLORS.snakeGrowing;
    } else {
      // Special food applies its effect (clears previous first)
      applyEffect(gameState, effectType);
    }

    // Spawn new food
    spawnFood(gameState);
  }

  // Check death conditions
  if (checkWallCollision(gameState) || checkSelfCollision(gameState)) {
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

      const consolationBonus = gameState.phoneCall.pickUpBonus;
      gameState.score += consolationBonus;

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

    if (gameState.combo.active) {
      const effectA = gameState.combo.effectA?.type || 'none';
      const effectB = gameState.combo.effectB?.type || 'none';
      console.log(`[Game] Died during combo (Effect A: ${effectA}, Effect B: ${effectB})`);
    }

    // Exit combo mode if active (reset canvas color and state)
    if (gameState.combo.active) {
      exitCombo(gameState);
    }

    // Play death sound (Bug fix)
    playDeathSound();
    gameState.phase = 'gameover';
  }
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

  // Story 9.7: Track event (survived = true, countdown completed without death)
  trackPhoneCall({
    action: 'pickup',
    reactionTime,
    survived: true,
    bonus: gameState.phoneCall.pickUpBonus,
    timestamp: Date.now()
  });

  // Timer expired - award bonus
  const bonus = gameState.phoneCall.pickUpBonus;
  gameState.score += bonus;

  // Increment Pick Up count (for stats/analytics, not used in effect-based bonuses)
  gameState.phoneCall.pickUpCount += 1;

  // Story 9.6: Spawn phone bonus popup at snake head (suppress 0-value popups)
  if (bonus > 0) {
    const head = gameState.snake.segments[0];
    spawnPhoneBonusPopup(bonus, head.x, head.y);
  }

  // Review fix: Use hidePhoneOverlay instead of duplicated inline logic
  hidePhoneOverlay(gameState);

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
  requestAnimationFrame((time) => gameLoop(time, ctx, gameState));
}
