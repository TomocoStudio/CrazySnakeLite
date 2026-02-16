// CrazySnakeLite - Streak Tracking Module (Story 14.6)
// Foundation for Epic 17 Daily Streak Tracking

/**
 * Get current streak data from session history.
 * Story 14.6: Calculate consecutive days played.
 *
 * Algorithm:
 * 1. Extract unique calendar days from sessions (local timezone)
 * 2. Check if today is included (if not, streak is broken)
 * 3. Count consecutive days backward from today
 * 4. Detect milestones (7-day, 30-day)
 *
 * @param {Array} sessions - Session objects with timestamp property, sorted DESC
 * @returns {Object} {streakDays: number, isBroken: boolean, milestoneReached: boolean}
 */
export function getStreakData(sessions) {
  // First session ever edge case
  if (!sessions || sessions.length === 0) {
    return { streakDays: 1, isBroken: false, milestoneReached: false };
  }

  // Extract unique play dates (calendar days in local timezone)
  const playDates = new Set();
  sessions.forEach(session => {
    if (session.timestamp) {
      playDates.add(getDateKey(session.timestamp));
    }
  });

  // Check if player has played today
  const today = getDateKey(Date.now());
  const hasPlayedToday = playDates.has(today);

  if (!hasPlayedToday) {
    // Streak broken (missed today)
    return { streakDays: 0, isBroken: true, milestoneReached: false };
  }

  // Count consecutive days backward from today
  let streakDays = 0;
  let currentDate = new Date();

  while (true) {
    const dateKey = getDateKey(currentDate.getTime());
    if (!playDates.has(dateKey)) {
      break; // Gap found, streak ends
    }

    streakDays++;
    currentDate.setDate(currentDate.getDate() - 1); // Move back one day
  }

  // Check for milestones (7-day or 30-day)
  const milestoneReached = streakDays === 7 || streakDays === 30;

  return { streakDays, isBroken: false, milestoneReached };
}

/**
 * Format streak counter text for display.
 * Story 14.6: User-friendly streak messages.
 *
 * @param {number} streakDays - Current streak length
 * @param {boolean} isBroken - Whether streak was just broken
 * @returns {string} Formatted display text
 */
export function formatStreakCounter(streakDays, isBroken) {
  if (isBroken) {
    // Ethical guardrail (FR195): Gentle, non-guilt messaging
    return 'Rest day logged. Ready for another round?';
  }

  if (streakDays === 1) {
    // First day celebration
    return '🔥 1-day streak — keep it going!';
  }

  // Standard streak display
  return `🔥 ${streakDays}-day streak`;
}

/**
 * Check if current streak is at a milestone.
 * Story 14.6: Used for special styling and caller quote context.
 *
 * @param {number} streakDays - Current streak length
 * @returns {boolean} True if at 7-day or 30-day milestone
 */
export function isStreakMilestone(streakDays) {
  return streakDays === 7 || streakDays === 30;
}

/**
 * Convert timestamp to date key (YYYY-MM-DD) in local timezone.
 * Story 14.6: Consistent date string for day comparison.
 *
 * @param {number} timestamp - Unix timestamp in milliseconds
 * @returns {string} Date key (e.g., "2026-02-16")
 */
function getDateKey(timestamp) {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
