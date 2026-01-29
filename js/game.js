// CrazySnakeLite - Game Loop Module
import { CONFIG } from './config.js';
import { render } from './render.js';
import { moveSnake, growSnake } from './snake.js';
import { checkFoodCollision, checkWallCollision, checkSelfCollision } from './collision.js';
import { spawnFood } from './food.js';
import { applyEffect, clearEffect } from './effects.js';
import { checkPhoneCallTiming, dismissPhoneCall } from './phone.js';
import { playMoveSound } from './audio.js';

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
  checkPhoneCallTiming(gameState, currentTime);

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
    const foodType = gameState.food.type;

    // Always grow snake
    growSnake(gameState);
    // Update score with validation (ensure it's a valid positive integer)
    gameState.score = Math.max(0, gameState.snake.segments.length || 0);

    // Handle effects based on food type
    if (foodType === 'growing') {
      // Growing food clears effect and sets snake to green
      clearEffect(gameState);
      gameState.snake.color = CONFIG.COLORS.snakeGrowing;
    } else {
      // Special food applies its effect (clears previous first)
      applyEffect(gameState, foodType);
    }

    // Spawn new food
    spawnFood(gameState);
  }

  // Check death conditions
  if (checkWallCollision(gameState) || checkSelfCollision(gameState)) {
    // Auto-dismiss phone if active (Story 3.3)
    if (gameState.phoneCall.active) {
      dismissPhoneCall(gameState);
    }
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
 * NEW in Story 2.4
 * @returns {number} - Tick rate in milliseconds
 */
function getCurrentTickRate(gameState) {
  const baseTickRate = TICK_RATE;  // 125ms (8 moves/sec)

  if (!gameState.activeEffect) {
    return baseTickRate;
  }

  const speedMultiplier = gameState.activeEffect.speedMultiplier;
  if (speedMultiplier && speedMultiplier !== 1.0) {
    // Faster speed = shorter tick rate (moves more frequently)
    // Slower speed = longer tick rate (moves less frequently)
    return baseTickRate / speedMultiplier;
  }

  return baseTickRate;
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
