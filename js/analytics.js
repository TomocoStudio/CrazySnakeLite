// CrazySnakeLite - Analytics Module
// Story 9.7: Phone call event tracking for cognitive analytics
// Story 12.3: Plausible custom events tracking

import { CONFIG } from './config.js';

// Debug logging flag - set to false for production
const DEBUG = false;

// Phone call event history (for Epic 12 cognitive analytics)
const phoneCallHistory = [];

// ============================================================================
// HELPERS
// ============================================================================

/**
 * Get or generate session ID (UUID v4).
 * Stored in sessionStorage, persists across games in same browser session.
 * Story 12.3: Session ID generation
 */
function getSessionId() {
  const STORAGE_KEY = 'crazysnake_session_id';
  let sessionId = sessionStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    // Generate UUID v4
    sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    sessionStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Fire analytics event to Plausible.
 * Fire-and-forget, non-blocking, graceful degradation.
 * Story 12.3: Core track helper
 */
function track(eventName, props = {}) {
  // Check if analytics enabled
  if (!CONFIG.ANALYTICS_ENABLED) {
    return;
  }

  // Check if Plausible loaded
  if (typeof window.plausible === 'undefined') {
    return;
  }

  // Fire event (non-blocking)
  window.plausible(eventName, { props });

  if (DEBUG) {
    console.log(`[Analytics] Event: ${eventName}`, props);
  }
}

// ============================================================================
// PUBLIC TRACK FUNCTIONS (Story 12.3)
// ============================================================================

/**
 * Track game start.
 * Called when new game begins.
 * Story 12.3: trackGameStart implementation
 */
export function trackGameStart(isFirstGame = false, previousScore = null) {
  const props = {
    session_id: getSessionId(),
    is_first_game: isFirstGame,
    previous_score: previousScore || 0
  };

  track('game_start', props);
}

/**
 * Track food eaten.
 * Called when player consumes food.
 * Story 12.3: trackFoodEaten implementation
 */
export function trackFoodEaten(gameState) {
  const food = gameState.food;
  const timeToEat = Date.now() - gameState.analyticsState.foodSpawnTime;

  const props = {
    session_id: getSessionId(),
    food_type: food.type,
    is_blinking: food.isBlinking || false,
    snake_length: gameState.snake.segments.length,
    score: gameState.score,
    time_to_eat: timeToEat,
    rc_active: gameState.effects.reverseControlsActive || false
  };

  track('food_eaten', props);
}

/**
 * Track phone call dismissal.
 * Called when player picks up or ends call.
 * Story 12.3: trackPhoneCall implementation (Plausible events)
 */
export function trackPhoneCallEvent(gameState, action) {
  const reactionTime = Date.now() - gameState.analyticsState.phoneCallShowTime;
  const caller = gameState.phoneCall.currentCaller;

  const props = {
    session_id: getSessionId(),
    action: action,  // 'end' or 'pickup'
    caller_name: caller ? caller.name : 'Unknown',
    reaction_time_ms: reactionTime,
    pickup_bonus: action === 'pickup' ? gameState.phoneCall.pickUpBonus : 0,
    call_sequence_number: gameState.analyticsState.totalPhoneCalls,
    combo_active_during_call: gameState.combo?.active || false,
    score_at_call: gameState.score
  };

  track('phone_call', props);
}

/**
 * Track game over.
 * Called when player dies.
 * Story 12.3: trackGameOver implementation
 */
export function trackGameOver(gameState) {
  const duration = (Date.now() - gameState.analyticsState.gameStartTime) / 1000;

  // Flatten foodTypesEaten
  const foodTypes = gameState.analyticsState.foodTypesEaten;

  // Story 12.7: Get death cause (captured in game.js before calling trackGameOver)
  const deathCause = gameState.deathCause || 'unknown';

  // Story 12.7: Get last food type on screen when player died
  const lastFoodType = gameState.food?.type || 'none';

  // Story 12.7: Get active effect on death (captured in game.js before calling trackGameOver)
  const activeEffectOnDeath = gameState.activeEffect?.type || null;

  const props = {
    session_id: getSessionId(),
    score: gameState.score,
    duration_seconds: Math.round(duration * 10) / 10,  // 1 decimal place
    death_cause: deathCause,
    foods_eaten: gameState.score,  // Score = foods eaten
    phone_calls_received: gameState.analyticsState.totalPhoneCalls,
    last_food_eaten: lastFoodType,
    active_effect_on_death: activeEffectOnDeath,
    combo_active_on_death: gameState.combo?.active || false,
    phone_active_on_death: gameState.phoneCall?.active || false,
    phone_picked_up_on_death: gameState.phoneCall?.pickedUp || false,

    // Flatten food distribution
    food_growing: foodTypes.growing,
    food_invincibility: foodTypes.invincibility,
    food_wall_phase: foodTypes.wallPhase,
    food_speed_boost: foodTypes.speedBoost,
    food_speed_decrease: foodTypes.speedDecrease,
    food_reverse_controls: foodTypes.reverseControls,

    // Cognitive stats (from Epic 11)
    rc_survived: gameState.cognitiveStats.rcSurvived,
    phone_calls_managed: gameState.cognitiveStats.phoneCallsManaged,
    mystery_foods_eaten: gameState.cognitiveStats.mysteryFoodsEaten,
    combo_multipliers: gameState.cognitiveStats.comboMultipliers,
    pick_up_streak: gameState.cognitiveStats.pickUpStreak,
    peak_combo_score: gameState.cognitiveStats.peakComboScore
  };

  track('game_over', props);
}

/**
 * Track session end.
 * Called when browser tab closes (beforeunload).
 * Story 12.3: trackSessionEnd implementation
 */
export function trackSessionEnd() {
  // Read aggregated session data from sessionStorage
  const totalGames = parseInt(sessionStorage.getItem('crazysnake_total_games') || '0');
  const sessionStartTime = parseInt(sessionStorage.getItem('crazysnake_session_start') || Date.now());
  const highestScore = parseInt(sessionStorage.getItem('crazysnake_highest_score') || '0');
  const totalFoods = parseInt(sessionStorage.getItem('crazysnake_total_foods') || '0');
  const totalPhoneCalls = parseInt(sessionStorage.getItem('crazysnake_total_phone_calls') || '0');
  const avgDismissalSpeed = parseInt(sessionStorage.getItem('crazysnake_avg_dismissal_speed') || '0');

  // Flatten food breakdown
  const foodBreakdownStr = sessionStorage.getItem('crazysnake_food_breakdown') || '{}';
  let foodBreakdown = {};
  try {
    foodBreakdown = JSON.parse(foodBreakdownStr);
  } catch (e) {
    foodBreakdown = {};
  }

  const totalTime = (Date.now() - sessionStartTime) / 1000;

  const props = {
    session_id: getSessionId(),
    total_games_played: totalGames,
    total_time_seconds: Math.round(totalTime),
    highest_score: highestScore,
    total_foods_eaten: totalFoods,
    food_growing: foodBreakdown.growing || 0,
    food_invincibility: foodBreakdown.invincibility || 0,
    food_wall_phase: foodBreakdown.wallPhase || 0,
    food_speed_boost: foodBreakdown.speedBoost || 0,
    food_speed_decrease: foodBreakdown.speedDecrease || 0,
    food_reverse_controls: foodBreakdown.reverseControls || 0,
    total_phone_calls: totalPhoneCalls,
    avg_dismissal_speed_ms: avgDismissalSpeed
  };

  track('session_end', props);
}

// ============================================================================
// LEGACY PHONE CALL TRACKING (Story 9.7 - preserved for backward compatibility)
// ============================================================================

/**
 * Track a phone call interaction (legacy function)
 * Story 9.7: Record End/Pick Up actions with reaction time and survival data
 * @param {Object} event - Phone call event data
 * @param {string} event.action - 'end' or 'pickup'
 * @param {number} event.reactionTime - ms from show to dismiss
 * @param {boolean} event.survived - true if Pick Up countdown completed without death
 * @param {number} event.bonus - Points awarded
 * @param {number} event.timestamp - When call was dismissed
 */
export function trackPhoneCall(event) {
  phoneCallHistory.push({
    action: event.action,
    reactionTime: event.reactionTime,
    survived: event.survived,
    bonus: event.bonus,
    timestamp: event.timestamp
  });

  // Future: Send to analytics service (Epic 12)
  if (DEBUG) {
    console.log('[Analytics] Phone call tracked:', event.action,
                `reaction: ${event.reactionTime}ms`,
                `survived: ${event.survived}`,
                `bonus: +${event.bonus}`);
  }
}

/**
 * Get phone call event history
 * @returns {Array} Array of phone call events
 */
export function getPhoneCallHistory() {
  return phoneCallHistory;
}

/**
 * Reset phone call history (on new game)
 * @returns {void}
 */
export function resetPhoneCallHistory() {
  phoneCallHistory.length = 0;
  if (DEBUG) console.log('[Analytics] Phone call history reset');
}

/**
 * Calculate Pick Up risk profile (Epic 12 preview)
 * @param {Object} state - Game state
 * @returns {Object} Risk profile analysis
 */
export function calculatePickUpProfile(state) {
  const totalCalls = state.analyticsState.totalPhoneCalls;
  const totalPickUps = state.analyticsState.totalPickUps;
  const totalEnds = state.analyticsState.totalEnds;

  if (totalCalls === 0) {
    return { profile: 'No data' };
  }

  const pickUpRate = totalPickUps / totalCalls;

  return {
    totalCalls,
    totalPickUps,
    totalEnds,
    pickUpRate: (pickUpRate * 100).toFixed(1) + '%',
    interpretation: pickUpRate > 0.7 ? 'Risk-seeking' :
                    pickUpRate > 0.4 ? 'Balanced' :
                                       'Risk-averse'
  };
}
