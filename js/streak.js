// CrazySnakeLite - Streak Tracking Module
// Story 17.1: Daily streak tracking with persistent state
// Story 17.3: Persistence across browser sessions + private browsing handling
// Story 17.4: Gentle break messaging - ethical design, no guilt
// Epic 17: Streak System - Ethical habit formation mechanic

import { getStreak, updateStreak, isStorageAvailable } from './storage.js';
import { CONFIG } from './config.js';

/**
 * Get today's date as 'YYYY-MM-DD' string (local timezone)
 *
 * Story 17.1-17.2: CRITICAL - Uses local timezone, NOT UTC
 *
 * Timezone Behavior (Story 17.2):
 * - Midnight crossover: 11:59 PM → 12:01 AM increments calendar day immediately
 * - DST-aware: Date object handles spring forward / fall back automatically
 * - Timezone travel: Uses current browser timezone setting (adapts to travel)
 *
 * Why Local Timezone:
 * - Player expectation: "Today" means their local calendar day
 * - Midnight detection: 11:59 PM → 12:01 AM should count as 2 consecutive days
 * - DST safe: JavaScript Date object handles DST transitions automatically
 *
 * @returns {string} - Date string in 'YYYY-MM-DD' format (e.g., "2026-02-16")
 */
function getTodayDateString() {
  const now = new Date();
  const year = now.getFullYear();                          // Local year (NOT getUTCFullYear)
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Local month (NOT getUTCMonth)
  const day = String(now.getDate()).padStart(2, '0');        // Local day (NOT getUTCDate)

  return `${year}-${month}-${day}`;
}

/**
 * Calculate calendar day difference (local timezone)
 * Story 17.1: Used to determine consecutive days
 * @param {string} dateA - 'YYYY-MM-DD' string (earlier date)
 * @param {string} dateB - 'YYYY-MM-DD' string (later date)
 * @returns {number} - Days between dates (dateB - dateA)
 */
function calculateDaysDifference(dateA, dateB) {
  if (!dateA || !dateB) return null;

  // Parse date strings at midnight local time
  const a = new Date(dateA + 'T00:00:00');
  const b = new Date(dateB + 'T00:00:00');

  const diffMs = b - a;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * Check and update streak on game completion
 * Story 17.1: Main streak logic - increments, resets, preserves longest
 *
 * Rules:
 * - First game per day increments streak
 * - Multiple games same day = no increment
 * - Yesterday = increment by 1
 * - 2+ day gap = reset to 1 (new streak starts)
 * - longestStreak never decreases
 *
 * @returns {Object} - { currentStreak, longestStreak, isNewRecord, message, hadBreak? }
 */
export function checkAndUpdateStreak() {
  // Story 17.3: Check if localStorage available (private browsing detection)
  if (!isStorageAvailable('localStorage')) {
    console.warn('[Story 17.3] localStorage unavailable (private browsing?) - streak not persisted');
    return {
      currentStreak: 0,
      longestStreak: 0,
      isNewRecord: false,
      message: null,
      privateBrowsingWarning: 'Private browsing: streak not saved across sessions'
    };
  }

  const streak = getStreak();
  const today = getTodayDateString();
  const lastPlayed = streak.lastPlayedDate;

  console.log('[Story 17.1] Checking streak:', { today, lastPlayed, currentStreak: streak.currentStreak });

  // First-ever game
  if (!lastPlayed) {
    const updated = {
      currentStreak: 1,
      longestStreak: 1,
      lastPlayedDate: today,
      streakStartDate: today
    };
    updateStreak(updated);
    console.log('[Story 17.1] First-ever game - streak initialized');
    return {
      currentStreak: 1,
      longestStreak: 1,
      isNewRecord: true,
      message: CONFIG.DASHBOARD.STREAK_MESSAGES.freshStart // Story 17.4: Gentle messaging
    };
  }

  const daysDiff = calculateDaysDifference(lastPlayed, today);

  // Same day — no increment (only first game counts per day)
  if (daysDiff === 0) {
    console.log('[Story 17.1] Same day - no streak update');
    return {
      currentStreak: streak.currentStreak,
      longestStreak: streak.longestStreak,
      isNewRecord: false,
      message: null // No message on same-day games
    };
  }

  // Yesterday — increment streak
  if (daysDiff === 1) {
    const newStreak = streak.currentStreak + 1;
    const newLongest = Math.max(newStreak, streak.longestStreak);
    const isNewRecord = newStreak > streak.longestStreak;

    const updated = {
      currentStreak: newStreak,
      longestStreak: newLongest,
      lastPlayedDate: today
      // streakStartDate unchanged (streak continues)
    };
    updateStreak(updated);

    // Story 17.4: Gentle messaging with new record celebration
    let message = `🔥 ${newStreak}-day streak`;
    if (isNewRecord) {
      message += ' — ' + CONFIG.DASHBOARD.STREAK_MESSAGES.newRecord;
    }

    console.log('[Story 17.1] Consecutive day - streak incremented:', newStreak);
    return {
      currentStreak: newStreak,
      longestStreak: newLongest,
      isNewRecord,
      message
    };
  }

  // 2+ days gap — reset streak to 1
  if (daysDiff >= 2) {
    // Preserve longestStreak before reset
    const preservedLongest = Math.max(streak.currentStreak, streak.longestStreak);

    const updated = {
      currentStreak: 1,
      longestStreak: preservedLongest,
      lastPlayedDate: today,
      streakStartDate: today
    };
    updateStreak(updated);

    // Story 17.4: Gentle break message (ethical guardrail: no guilt)
    // If broke significant streak (7+ days), celebrate achievement first
    let message;
    if (streak.currentStreak >= 7) {
      message = CONFIG.DASHBOARD.STREAK_MESSAGES.achievementBeforeBreak(streak.currentStreak);
    } else {
      message = CONFIG.DASHBOARD.STREAK_MESSAGES.break;
    }

    console.log('[Story 17.1] Streak break detected - reset to 1 (gap:', daysDiff, 'days)');
    return {
      currentStreak: 1,
      longestStreak: preservedLongest,
      isNewRecord: false,
      message,
      hadBreak: true
    };
  }

  // Fallback (negative day diff - shouldn't happen unless clock tampering)
  console.warn('[Story 17.1] Unexpected day difference:', daysDiff);
  return {
    currentStreak: streak.currentStreak,
    longestStreak: streak.longestStreak,
    isNewRecord: false,
    message: null
  };
}

/**
 * Get streak message for display
 * Story 17.1: Extract display message from streak result
 * @param {Object} streakResult - Result from checkAndUpdateStreak()
 * @returns {string} - Display message (or empty string if no message)
 */
export function getStreakMessage(streakResult) {
  if (!streakResult || !streakResult.message) return '';
  return streakResult.message;
}

/**
 * Get current streak data (read-only)
 * Story 17.1: For display purposes (dashboard, post-game)
 * @returns {Object} - { currentStreak, longestStreak, lastPlayedDate, streakStartDate }
 */
export function getCurrentStreak() {
  return getStreak();
}
