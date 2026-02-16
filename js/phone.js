/**
 * Phone Call Overlay Module
 * Handles display, timing, and dismissal of phone call interruption UI
 * Story 3.1: Phone Call Overlay UI
 * Story 3.2: Phone Call Timing and Caller System
 * Story 3.3: Phone Call Dismissal Controls
 */

import { CONFIG } from './config.js';
import { spawnPhoneBonusPopup } from './score-popup.js';
import { trackPhoneCall } from './analytics.js';

// Debug logging flag - set to false for production
const DEBUG = false;

/**
 * Tech Pun Caller Names - Story 5-7, Story 9.4
 * Hilarious tech-themed puns with portraits and one-liners
 * Story 9.4: Added portrait paths and one-liners for Pick Up comedy reward
 */
const CALLERS = [
  { id: 1, name: 'Al Gorithm', slug: '01_AlGorithm', line: 'Have you tried sorting your life out?' },
  { id: 2, name: 'Meg A. Byte', slug: '02_MegaByte', line: "I'm running out of space for this call!" },
  { id: 3, name: 'Ali Sing', slug: '03_AliSing', line: 'Stop giving me mixed signals!' },
  { id: 4, name: 'Anna Log', slug: '04_AnnaLog', line: 'Everything used to be simpler in my day...' },
  { id: 5, name: 'Ray Tracing', slug: '05_RayTracing', line: 'I can see right through your strategy.' },
  { id: 6, name: 'Pat Ch-Notes', slug: '06_PatCh-Notes', line: 'We need to fix a few things between us.' },
  { id: 7, name: 'Mac Address', slug: '07_MacAddress', line: "I'm calling from a very specific location." },
  { id: 8, name: 'Artie Ficial', slug: '08_ArtieFicial', line: "I'm not a real person, but I play one on TV." },
  { id: 9, name: 'Floppy Phil', slug: '09_FloppyPhil', line: 'I only have 1.44 MB to talk, so quick!' },
  { id: 10, name: 'Dot Matrix', slug: '10_DotMatrix', line: "You're looking a bit pixelated today." },
  { id: 11, name: 'Gia Hertz', slug: '11_GiaHertz', line: "I'm vibrating with excitement to talk to you!" },
  { id: 12, name: 'Perry Pheral', slug: '12_PerryPheral', line: "I'm just on the side... don't mind me." },
  { id: 13, name: 'Terry Byte', slug: '13_TerryByte', line: "I've got a LOT of data to share with you." },
  { id: 14, name: 'Cade Ridger', slug: '14_CadeRidger', line: 'Let me bridge the gap in your gameplay.' },
  { id: 15, name: 'Mona Tor', slug: '15_MonaTor', line: "I've been watching your every move..." },
  { id: 16, name: 'Syd Ram', slug: '16_SydRam', line: 'I forgot what I was gonna say... hold on...' },
  { id: 17, name: 'Bessie IOS', slug: '17_BessieIOS', line: "Moo-ve over, I'm updating!" },
  { id: 18, name: 'Dee Frag', slug: '18_DeeFrag', line: 'Let me help you get your life together.' },
  { id: 19, name: 'Buffy Ring', slug: '19_BuffyRing', line: "Hold on, I'm buffering..." },
  { id: 20, name: 'DJ Snake', slug: '20_DJsnake', line: 'Ssssomeone requested a remix of your game!' },
  { id: 21, name: 'GAME OVER', slug: '21_GAMEOVER', line: "Just checking if you're still alive..." }
];

/**
 * Get random caller from CALLERS array
 * Story 9.4: Select random caller with portrait and one-liner
 * @returns {Object} - Caller object with name, portrait path, and one-liner
 */
function getRandomCaller() {
  const randomIndex = Math.floor(Math.random() * CALLERS.length);
  const caller = CALLERS[randomIndex];

  return {
    name: caller.name,
    portrait: `assets/pictures/${caller.slug}.png`,
    line: caller.line
  };
}

/**
 * Show phone call overlay with random caller
 * Story 9.2 (redesigned): Display effect-based bonuses for both End and Pick Up
 * Story 9.4: Display caller portrait and name, reset status to "Incoming call..."
 * Story 9.7: Track total calls and show time
 * @param {string} callerName - DEPRECATED (now using random selection)
 * @param {Object} gameState - Game state object (for bonus calculation and caller storage)
 */
export function showPhoneCall(callerName = 'Unknown Caller', gameState = null) {
  const overlay = document.getElementById('phone-overlay');
  const callerNameElement = overlay.querySelector('.caller-name');
  const callStatusElement = overlay.querySelector('.call-status');
  const portraitElement = overlay.querySelector('.phone-icon');
  const canvas = document.getElementById('game-canvas');
  const endBtn = document.getElementById('phone-btn-end');
  const pickupBtn = document.getElementById('phone-btn-pickup');
  const endBonusSpan = endBtn ? endBtn.querySelector('.btn-points') : null;
  const pickupBonusSpan = pickupBtn ? pickupBtn.querySelector('.btn-bonus') : null;

  if (!overlay || !callerNameElement || !canvas) {
    console.error('[Phone] Required DOM elements not found');
    return;
  }

  // Story 9.7: Track call shown
  if (gameState) {
    gameState.analyticsState.totalPhoneCalls += 1;
    gameState.analyticsState.phoneCallShowTime = Date.now();

    // Story 10.7: Track phone + combo overlap
    if (gameState.combo.active) {
      gameState.analyticsState.comboPhoneOverlaps += 1;
      if (DEBUG) console.log('[Phone] Call during active combo (overlap tracked)');
    }
  }

  // Story 9.4: Select random caller
  const caller = getRandomCaller();
  if (gameState) {
    gameState.phoneCall.currentCaller = caller;
  }

  // Story 9.4: Update caller portrait
  if (portraitElement) {
    portraitElement.src = caller.portrait;
    portraitElement.classList.remove('call-answered'); // Reset animation for new call

    // Fallback to generic phone icon if portrait missing
    portraitElement.onerror = function() {
      this.onerror = null; // Prevent infinite loop
      this.src = 'assets/PhoneIcone01_256px.png';
      if (DEBUG) console.log('[Phone] Portrait not found, using fallback for:', caller.name);
    };
  }

  // Story 9.4: Set caller name and reset status text
  callerNameElement.textContent = caller.name;
  if (callStatusElement) {
    callStatusElement.textContent = 'Incoming call...';
    callStatusElement.classList.remove('one-liner-reveal');
  }

  // Update End bonus display based on current active effect (Story 9.2 redesigned bugfix)
  if (endBonusSpan && gameState) {
    const endBonus = getEndBonus(gameState);
    endBonusSpan.textContent = `+${endBonus}`;
  }

  // Update Pick Up bonus display based on current active effect (Story 9.2 redesigned)
  if (pickupBonusSpan && gameState) {
    const pickupBonus = getPickUpBonus(gameState);
    pickupBonusSpan.textContent = `+${pickupBonus}`;
  }

  // Show overlay
  overlay.classList.remove('hidden');

  // Blur game canvas
  canvas.classList.add('blurred');

  if (DEBUG) {
    const effectType = gameState?.activeEffect?.type || 'growing';
    const endBonus = endBonusSpan ? endBonusSpan.textContent : '?';
    const pickupBonus = pickupBonusSpan ? pickupBonusSpan.textContent : '?';
    console.log('[Phone] Call displayed:', caller.name, '| End: ' + endBonus, '| Pick Up: ' + pickupBonus,
                '| Active effect:', effectType);
  }
}

/**
 * Dismiss phone call overlay with action routing
 * Story 9.1: Updated to accept action parameter ('end' | 'pickup' | 'cancel')
 * @param {string|Object} action - Action to take ('end', 'pickup', or 'cancel'), or gameState for backward compatibility
 * @param {Object} gameState - Game state object (optional if action is gameState)
 */
export function dismissPhoneCall(action, gameState) {
  // Backward compatibility: if action is an object (gameState), treat as 'cancel'
  if (typeof action === 'object' && action !== null) {
    gameState = action;
    action = 'cancel';
  }

  if (DEBUG) console.log('[Phone] Dismiss action:', action);

  if (action === 'end') {
    endCall(gameState);
  } else if (action === 'pickup') {
    pickUpCall(gameState);
  } else if (action === 'cancel') {
    // Just hide overlay without awarding points (used for auto-dismiss on death)
    hidePhoneOverlay(gameState);
  } else {
    console.error('[Phone] Invalid action:', action);
  }
}

/**
 * Handle End button action
 * Story 9.2 (redesigned): Award bonus based on current active effect
 * Story 9.6: Spawn phone bonus popup
 * Story 9.7: Track stats and analytics
 * @param {Object} gameState - Game state object
 */
function endCall(gameState) {
  if (!gameState) return;

  // Story 9.7: Compute reaction time
  const reactionTime = Date.now() - gameState.analyticsState.phoneCallShowTime;

  // Calculate bonus based on current active effect
  const bonus = getEndBonus(gameState);
  gameState.score += bonus;

  // Story 9.7: Track stats
  gameState.cognitiveStats.phoneCallsManaged += 1;
  gameState.cognitiveStats.pickUpStreak = 0; // Reset streak on End
  gameState.analyticsState.totalEnds += 1;

  // Story 10.7: Track phone + combo overlap survival
  if (gameState.combo.active) {
    gameState.analyticsState.comboPhoneOverlapSurvived += 1;
    if (DEBUG) console.log('[Phone] Call during combo survived (End action)');
  }

  // Story 9.7: Track event
  trackPhoneCall({
    action: 'end',
    reactionTime,
    survived: true, // End always survives (no death risk)
    bonus,
    timestamp: Date.now()
  });

  // Story 13.5: Track phone call event for divided attention metric
  // Story 13.6: Include context for impulse control metric
  gameState.metricsTracking.rawEvents.push({
    type: 'phone_call',
    timestamp: Date.now(),
    decision: 'end',
    decisionTime: reactionTime,
    survived: true, // End always survives
    bonus: bonus,
    context: {
      inComboMode: gameState.combo?.active || false,
      currentScore: gameState.score,
      pickupBonus: 0, // End doesn't have pickup bonus
      blinkingFoodActive: gameState.food?.isBlinking || false,
      snakeLength: gameState.snake?.segments?.length || 0
    }
  });

  // Story 9.6: Spawn phone bonus popup at snake head position (suppress 0-value popups)
  if (bonus > 0) {
    const head = gameState.snake.segments[0];
    spawnPhoneBonusPopup(bonus, head.x, head.y);
  }

  // Hide overlay and clear phone state
  hidePhoneOverlay(gameState);

  if (DEBUG) {
    const effectType = gameState.activeEffect?.type || 'growing';
    console.log('[Phone] Call ended: +' + bonus + ' point(s), active effect:', effectType);
  }
}

/**
 * Handle Pick Up button action
 * Story 9.3: Implement countdown timer (1-3s blur period)
 * Story 9.4: Reveal caller's one-liner (comedy reward), stop ringing animation
 * Story 9.7: Track stats (event tracked on timer expiry or death)
 * @param {Object} gameState - Game state object
 */
function pickUpCall(gameState) {
  if (!gameState) return;

  // Story 9.7: Track stats (action committed, event tracked later)
  gameState.cognitiveStats.phoneCallsManaged += 1;
  gameState.cognitiveStats.pickUpStreak += 1;
  gameState.analyticsState.totalPickUps += 1;

  // Story 10.7: Track phone + combo overlap survival (Pick Up counts as survival)
  if (gameState.combo.active) {
    gameState.analyticsState.comboPhoneOverlapSurvived += 1;
    if (DEBUG) console.log('[Phone] Call during combo survived (Pick Up action)');
  }

  // Story 9.4: Stop phone ringing animation
  const portraitElement = document.querySelector('.phone-icon');
  if (portraitElement) {
    portraitElement.classList.add('call-answered');
  }

  // Story 9.4: Reveal caller's one-liner (comedy reward)
  const caller = gameState.phoneCall.currentCaller;
  if (caller) {
    const callStatusElement = document.querySelector('.call-status');
    if (callStatusElement) {
      callStatusElement.textContent = caller.line;
      callStatusElement.classList.add('one-liner-reveal');
    }
  }

  // Calculate bonus based on current active effect (Story 9.2)
  const bonus = getPickUpBonus(gameState);
  gameState.phoneCall.pickUpBonus = bonus;

  // Calculate random duration (1-3 seconds)
  const duration = CONFIG.PICKUP_TIMER.min +
                   Math.random() * (CONFIG.PICKUP_TIMER.max - CONFIG.PICKUP_TIMER.min);

  // Set timer end time (use performance.now() to match game loop time source)
  gameState.phoneCall.pickUpEndTime = performance.now() + duration;
  gameState.phoneCall.pickedUp = true;

  // Hide buttons, show countdown bar
  document.getElementById('phone-buttons').classList.add('hidden');
  const countdownBar = document.getElementById('phone-countdown-bar');
  const fill = document.getElementById('countdown-bar-fill');

  // Reset fill to 100% width first
  fill.style.transition = 'none';
  fill.style.width = '100%';

  // Show countdown bar
  countdownBar.classList.remove('hidden');

  // Force reflow to ensure transition works
  fill.offsetWidth;

  // Start countdown animation
  fill.style.transition = `width ${duration}ms linear`;
  fill.style.width = '0%';

  if (DEBUG) {
    const effectType = gameState.activeEffect?.type || 'growing';
    console.log('[Phone] Pick Up timer started:', duration.toFixed(0) + 'ms',
                '| Bonus:', bonus, '| Effect:', effectType, '| One-liner:', caller?.line);
  }

  // Canvas blur is already active from showPhoneCall() (4px blur)
  // Bonus will be awarded when timer expires (checked in game loop)
}

/**
 * Hide phone overlay and restore game canvas
 * Story 9.3: Reset countdown bar state
 * @param {Object} gameState - Game state object
 */
export function hidePhoneOverlay(gameState) {
  const overlay = document.getElementById('phone-overlay');
  const canvas = document.getElementById('game-canvas');

  if (!overlay || !canvas) {
    console.error('[Phone] Required DOM elements not found');
    return;
  }

  // Hide overlay
  overlay.classList.add('hidden');

  // Remove blur from canvas with smooth transition
  canvas.style.transition = 'filter 200ms ease-out';
  canvas.classList.remove('blurred');

  // Reset UI elements (Story 9.3)
  document.getElementById('phone-buttons').classList.remove('hidden');
  document.getElementById('phone-countdown-bar').classList.add('hidden');
  const fill = document.getElementById('countdown-bar-fill');
  fill.style.transition = 'none';
  fill.style.width = '100%';

  // Clear phone state
  if (gameState) {
    gameState.phoneCall.active = false;
    gameState.phoneCall.caller = null;
    gameState.phoneCall.pickedUp = false;
    gameState.phoneCall.pickUpEndTime = null;
  }

  if (DEBUG) console.log('[Phone] Overlay hidden, state reset');
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
 * Calculate End call bonus based on current active effect
 * Story 9.2 (redesigned): Effect-based bonuses instead of Fibonacci
 * @param {Object} gameState - Game state object
 * @returns {number} End bonus value (0 to 1)
 */
function getEndBonus(gameState) {
  // Determine current effect type (null/undefined = growing/default)
  const effectType = gameState.activeEffect?.type || 'growing';

  // Get bonus from config
  const bonusConfig = CONFIG.PHONE_BONUSES[effectType];

  if (!bonusConfig) {
    console.warn('[Phone] Unknown effect type:', effectType, '- defaulting to growing');
    return CONFIG.PHONE_BONUSES.growing.end;
  }

  return bonusConfig.end;
}

/**
 * Calculate Pick Up bonus based on current active effect
 * Story 9.2 (redesigned): Effect-based bonuses instead of Fibonacci
 * Special case: Wall Phase awards +3 if wall was crossed, +2 otherwise
 * @param {Object} gameState - Game state object
 * @returns {number} Pick Up bonus value (0 to 8)
 */
function getPickUpBonus(gameState) {
  // Determine current effect type (null/undefined = growing/default)
  const effectType = gameState.activeEffect?.type || 'growing';

  // Get bonus from config
  const bonusConfig = CONFIG.PHONE_BONUSES[effectType];

  if (!bonusConfig) {
    console.warn('[Phone] Unknown effect type:', effectType, '- defaulting to growing');
    return CONFIG.PHONE_BONUSES.growing.pickup;
  }

  // Special case: Wall Phase bonus depends on wallPhaseUsed flag
  if (effectType === 'wallPhase' && gameState.effects?.wallPhaseUsed) {
    return bonusConfig.pickupUsed; // +3 if wall crossed
  }

  return bonusConfig.pickup;
}

/**
 * Get phone call frequency tier for the given score
 * Story 9.5: Score-based difficulty progression
 * @param {number} score - Current game score
 * @returns {Object} Tier with {minDelay, maxDelay} in milliseconds
 */
export function getTierForScore(score) {
  for (const tier of CONFIG.PHONE_CALL_TIERS) {
    if (score >= tier.minScore && score <= tier.maxScore) {
      return { minDelay: tier.minDelay, maxDelay: tier.maxDelay };
    }
  }

  // Fallback: use highest tier if score exceeds all tiers
  const lastTier = CONFIG.PHONE_CALL_TIERS[CONFIG.PHONE_CALL_TIERS.length - 1];
  return { minDelay: lastTier.minDelay, maxDelay: lastTier.maxDelay };
}

/**
 * Schedule the next phone call (Story 3.2, Story 9.5)
 * Story 9.5: Uses score-based tiers and respects grace period
 * @param {Object} gameState - Game state object
 * @param {number} currentTime - Current timestamp in milliseconds (optional)
 */
export function scheduleNextCall(gameState, currentTime = null) {
  // Story 9.5: If grace period active, do not schedule
  if (gameState.phoneCall.graceActive) {
    if (DEBUG) console.log('[Phone] Grace period active - no call scheduled');
    return;
  }

  // Story 9.5: Get tier for current score
  const tier = getTierForScore(gameState.score);

  // Calculate random delay within tier range
  const randomInterval = tier.minDelay + Math.random() * (tier.maxDelay - tier.minDelay);

  // Schedule next call (use currentTime if provided, otherwise Date.now())
  const now = currentTime !== null ? currentTime : Date.now();
  gameState.phoneCall.nextCallTime = now + randomInterval;

  if (DEBUG) {
    const tierLabel = `${tier.minDelay / 1000}-${tier.maxDelay / 1000}s`;
    console.log(`[Phone] Next call scheduled in ${(randomInterval / 1000).toFixed(1)}s (Tier: ${tierLabel}, Score: ${gameState.score})`);
  }
}

/**
 * Trigger a phone call with random caller (Story 3.2)
 * Story 9.1: Updated to pass gameState to showPhoneCall
 * Story 9.4: Random caller selection now handled in showPhoneCall()
 * @param {Object} gameState - Game state object
 */
export function triggerPhoneCall(gameState) {
  gameState.phoneCall.active = true;
  showPhoneCall(null, gameState);
  if (DEBUG) console.log('[Phone] Call triggered');
}

/**
 * Check if it's time to trigger a phone call (Story 3.2, Story 9.5)
 * Called every frame by game loop
 * Story 9.5: Uses Date.now() and checks for null nextCallTime
 * @param {Object} gameState - Game state object
 */
export function checkPhoneCallTiming(gameState) {
  if (gameState.phase !== 'playing') return;
  if (gameState.phoneCall.active) return;
  if (gameState.phoneCall.nextCallTime === null) return;

  // Story 9.5: Use Date.now() to match scheduling logic
  if (Date.now() >= gameState.phoneCall.nextCallTime) {
    triggerPhoneCall(gameState);

    // Clear nextCallTime (will be rescheduled after dismissal)
    gameState.phoneCall.nextCallTime = null;
  }
}

/**
 * Handle phone call dismissal and schedule next call (Story 3.3)
 * Story 9.1: Updated to use new dismissPhoneCall signature with action
 * Review fix: Only schedule next call for 'end' (Pick Up schedules on timer expiry)
 * @param {string} action - Action to take ('end' or 'pickup')
 * @param {Object} gameState - Game state object
 * @param {number} currentTime - Current timestamp in milliseconds
 */
export function handlePhoneDismiss(action, gameState, currentTime) {
  dismissPhoneCall(action, gameState);
  // Only schedule next call for End action; Pick Up schedules on timer expiry (game.js)
  if (action === 'end') {
    scheduleNextCall(gameState, currentTime);
  }
}

/**
 * Initialize phone call system - add button listeners (Story 3.3, Story 9.1)
 * Story 9.1: Updated for two-button layout
 * Call this once during game initialization
 * @param {Object} gameState - Game state object
 * @param {Function} getCurrentTime - Function to get current timestamp
 */
export function initPhoneSystem(gameState, getCurrentTime) {
  const endButton = document.getElementById('phone-btn-end');
  const pickupButton = document.getElementById('phone-btn-pickup');

  if (!endButton || !pickupButton) {
    console.error('[Phone] Phone buttons not found');
    return;
  }

  // Add click handler to End button
  endButton.addEventListener('click', () => {
    if (gameState.phoneCall.active) {
      handlePhoneDismiss('end', gameState, getCurrentTime());
    }
  });

  // Add click handler to Pick Up button
  pickupButton.addEventListener('click', () => {
    if (gameState.phoneCall.active) {
      handlePhoneDismiss('pickup', gameState, getCurrentTime());
    }
  });

  if (DEBUG) console.log('[Phone] System initialized with two-button layout');
}
