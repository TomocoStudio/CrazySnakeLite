// CrazySnakeLite - Calibration State Management (Story 14.5)
// Tracks player progress through 5-session brain calibration period

/**
 * Get current calibration state based on total sessions completed.
 * Story 14.5: Determines display state for post-game calibration counter.
 *
 * States:
 * - 'in_progress': Sessions 1-4 (show counter)
 * - 'complete': Session 5 (show celebration, one-time only)
 * - 'unlocked': Session 6+ (hide counter, Skill Map available)
 *
 * @param {number} totalSessions - Total completed sessions from storage
 * @returns {Object} {state: string, sessionCount: number}
 */
export function getCalibrationState(totalSessions) {
  if (totalSessions < 5) {
    return {
      state: 'in_progress',
      sessionCount: totalSessions
    };
  } else if (totalSessions === 5) {
    return {
      state: 'complete', // One-time celebration
      sessionCount: 5
    };
  } else {
    return {
      state: 'unlocked', // Post-calibration
      sessionCount: totalSessions
    };
  }
}

/**
 * Check if calibration just completed this session.
 * Story 14.5: Used for triggering one-time celebration.
 *
 * @param {number} totalSessions - Total sessions including current
 * @returns {boolean} True if this is session 5 (calibration complete)
 */
export function isCalibrationComplete(totalSessions) {
  return totalSessions === 5;
}

/**
 * Format calibration counter text.
 * Story 14.5: Displays session progress (e.g., "Session 3/5 — Warming up...").
 *
 * @param {number} currentSession - Current session number (1-5)
 * @returns {string} Formatted counter text
 */
export function formatCalibrationCounter(currentSession) {
  return `Session ${currentSession}/5 — Warming up...`;
}

/**
 * Format calibration complete celebration message.
 * Story 14.5: One-time message on session 5 completion.
 *
 * @returns {string} Celebration message with emoji
 */
export function formatCalibrationComplete() {
  return 'Your Skill Map is ready! 🎉';
}
