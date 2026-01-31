/**
 * Phone Call Overlay Module
 * Handles display, timing, and dismissal of phone call interruption UI
 * Story 3.1: Phone Call Overlay UI
 * Story 3.2: Phone Call Timing and Caller System
 * Story 3.3: Phone Call Dismissal Controls
 */

import { CONFIG } from './config.js';

// Debug logging flag - set to false for production
const DEBUG = false;

/**
 * Tech Pun Caller Names - Story 5-7
 * Hilarious tech-themed puns that sound like real names
 */
const CALLERS = [
  'Al Gorithm',
  'Meg A. Byte',
  'Ali Sing',
  'Anna Log',
  'Ray Tracing',
  'Pat Ch-Notes',
  'Mac Address',
  'Artie Ficial',
  'Floppy Phil',
  'Dot Matrix',
  'Gia Hertz',
  'Terry Byte',
  'Perry Pheral',
  'Cade Ridger',
  'Mona Tor',
  'Syd Ram',
  'Bessie IOS',
  'Dee Frag',
  'Buffy Ring',
  'DJ Snake',
  'GAME OVER'
];

/**
 * Show phone call overlay with specified caller name
 * @param {string} callerName - Name to display on phone screen
 */
export function showPhoneCall(callerName = 'Unknown Caller') {
  const overlay = document.getElementById('phone-overlay');
  const callerNameElement = overlay.querySelector('.caller-name');
  const canvas = document.getElementById('game-canvas');

  if (!overlay || !callerNameElement || !canvas) {
    console.error('[Phone] Required DOM elements not found');
    return;
  }

  // Set caller name
  callerNameElement.textContent = callerName;

  // Show overlay
  overlay.classList.remove('hidden');

  // Blur game canvas
  canvas.classList.add('blurred');

  if (DEBUG) console.log('[Phone] Call displayed:', callerName);
}

/**
 * Dismiss phone call overlay
 * Removes overlay, restores game canvas clarity, and clears phone state
 * Updated in Story 3.3 to accept gameState parameter
 * @param {Object} gameState - Optional game state object (for state clearing)
 */
export function dismissPhoneCall(gameState) {
  const overlay = document.getElementById('phone-overlay');
  const canvas = document.getElementById('game-canvas');

  if (!overlay || !canvas) {
    console.error('[Phone] Required DOM elements not found');
    return;
  }

  // Hide overlay
  overlay.classList.add('hidden');

  // Remove blur from canvas
  canvas.classList.remove('blurred');

  // Clear phone state (Story 3.3)
  if (gameState) {
    gameState.phoneCall.active = false;
    gameState.phoneCall.caller = null;
  }

  if (DEBUG) console.log('[Phone] Call dismissed');
}

/**
 * Check if phone call is currently active
 * @returns {boolean} True if phone overlay is visible
 */
export function isPhoneCallActive() {
  const overlay = document.getElementById('phone-overlay');
  return overlay && !overlay.classList.contains('hidden');
}

/**
 * Schedule the next phone call (Story 3.2)
 * @param {Object} gameState - Game state object
 * @param {number} currentTime - Current timestamp in milliseconds
 */
export function scheduleNextCall(gameState, currentTime) {
  const minDelay = CONFIG.PHONE_MIN_DELAY;
  const maxDelay = CONFIG.PHONE_MAX_DELAY;
  const randomInterval = Math.random() * (maxDelay - minDelay) + minDelay;
  gameState.phoneCall.nextCallTime = currentTime + randomInterval;
  if (DEBUG) console.log('[Phone] Next call scheduled in', (randomInterval / 1000).toFixed(1), 'seconds');
}

/**
 * Trigger a phone call with random caller (Story 3.2)
 * @param {Object} gameState - Game state object
 */
export function triggerPhoneCall(gameState) {
  const randomIndex = Math.floor(Math.random() * CALLERS.length);
  const caller = CALLERS[randomIndex];
  gameState.phoneCall.active = true;
  gameState.phoneCall.caller = caller;
  showPhoneCall(caller);
  if (DEBUG) console.log('[Phone] Call triggered from:', caller);
}

/**
 * Check if it's time to trigger a phone call (Story 3.2)
 * Called every frame by game loop
 * @param {Object} gameState - Game state object
 * @param {number} currentTime - Current timestamp in milliseconds
 */
export function checkPhoneCallTiming(gameState, currentTime) {
  if (gameState.phase !== 'playing') return;
  if (gameState.phoneCall.active) return;
  if (currentTime >= gameState.phoneCall.nextCallTime) {
    triggerPhoneCall(gameState);
  }
}

/**
 * Handle phone call dismissal and schedule next call (Story 3.3)
 * @param {Object} gameState - Game state object
 * @param {number} currentTime - Current timestamp in milliseconds
 */
export function handlePhoneDismiss(gameState, currentTime) {
  dismissPhoneCall(gameState);
  scheduleNextCall(gameState, currentTime);
}

/**
 * Initialize phone call system - add End button listener (Story 3.3)
 * Call this once during game initialization
 * @param {Object} gameState - Game state object
 * @param {Function} getCurrentTime - Function to get current timestamp
 */
export function initPhoneSystem(gameState, getCurrentTime) {
  const endButton = document.querySelector('.end-button');

  if (!endButton) {
    console.error('[Phone] End button not found');
    return;
  }

  // Add click handler to End button
  endButton.addEventListener('click', () => {
    if (gameState.phoneCall.active) {
      handlePhoneDismiss(gameState, getCurrentTime());
    }
  });

  if (DEBUG) console.log('[Phone] System initialized');
}
