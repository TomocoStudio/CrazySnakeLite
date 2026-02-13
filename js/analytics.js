// CrazySnakeLite - Analytics Module
// Story 9.7: Phone call event tracking for cognitive analytics

// Debug logging flag - set to false for production
const DEBUG = false;

// Phone call event history (for Epic 12 cognitive analytics)
const phoneCallHistory = [];

/**
 * Track a phone call interaction
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
