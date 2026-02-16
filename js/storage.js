// CrazySnakeLite - Storage Module (Story 4.2 + 13.1)
// Handles IndexedDB (cognitive metrics) + localStorage (high score, profile, streak)

// ========================================
// INDEXEDDB CONFIGURATION (Story 13.1 - Cognitive Metrics)
// ========================================

const DB_NAME = 'CrazySnakeMetrics';
const DB_VERSION = 1;
const SESSIONS_STORE = 'sessions';
const MAX_SESSIONS = 100; // Prune beyond this limit per NFR57

let dbInstance = null;

/**
 * Initialize IndexedDB for cognitive metrics storage
 * @returns {Promise<IDBDatabase|null>} Database instance or null on failure
 */
export async function initStorage() {
  // Check if IndexedDB is available
  if (!isStorageAvailable('indexedDB')) {
    console.warn('[Storage] IndexedDB unavailable (private browsing?). Metrics will not persist.');
    return null;
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      console.error('[Storage] IndexedDB initialization failed:', request.error);
      resolve(null); // Graceful degradation
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      console.log('[Storage] IndexedDB initialized successfully');
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;

      // Create sessions object store with sessionId keyPath
      if (!db.objectStoreNames.contains(SESSIONS_STORE)) {
        const sessionsStore = db.createObjectStore(SESSIONS_STORE, { keyPath: 'sessionId' });

        // Create indexes for chronological and performance queries
        sessionsStore.createIndex('timestamp', 'timestamp', { unique: false });
        sessionsStore.createIndex('score', 'score', { unique: false });

        console.log('[Storage] Created sessions object store with timestamp + score indexes');
      }
    };
  });
}

/**
 * Save a completed session to IndexedDB
 * @param {Object} sessionData - Session object with sessionId, timestamp, score, metrics, rawEvents
 * @returns {Promise<boolean>} Success status
 */
export async function saveSession(sessionData) {
  if (!dbInstance) {
    await initStorage();
  }

  if (!dbInstance) {
    console.warn('[Storage] Cannot save session - IndexedDB unavailable');
    return false;
  }

  return new Promise((resolve) => {
    const transaction = dbInstance.transaction([SESSIONS_STORE], 'readwrite');
    const store = transaction.objectStore(SESSIONS_STORE);
    const request = store.add(sessionData);

    request.onsuccess = async () => {
      console.log(`[Storage] Session saved: ${sessionData.sessionId}`);

      // Prune old sessions if over limit
      await pruneOldSessions();

      resolve(true);
    };

    request.onerror = () => {
      console.error('[Storage] Failed to save session:', request.error);
      resolve(false);
    };
  });
}

/**
 * Retrieve recent sessions from IndexedDB
 * @param {number} limit - Number of sessions to retrieve (default 10 for rolling avg)
 * @returns {Promise<Array>} Array of session objects, newest first
 */
export async function getSessions(limit = 10) {
  if (!dbInstance) {
    await initStorage();
  }

  if (!dbInstance) {
    console.warn('[Storage] Cannot get sessions - IndexedDB unavailable');
    return [];
  }

  return new Promise((resolve) => {
    const transaction = dbInstance.transaction([SESSIONS_STORE], 'readonly');
    const store = transaction.objectStore(SESSIONS_STORE);
    const index = store.index('timestamp');
    const request = index.openCursor(null, 'prev'); // Descending order (newest first)

    const sessions = [];
    request.onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor && sessions.length < limit) {
        sessions.push(cursor.value);
        cursor.continue();
      } else {
        resolve(sessions);
      }
    };

    request.onerror = () => {
      console.error('[Storage] Failed to get sessions:', request.error);
      resolve([]);
    };
  });
}

/**
 * Prune old sessions to maintain MAX_SESSIONS limit
 * @returns {Promise<void>}
 */
async function pruneOldSessions() {
  if (!dbInstance) return;

  return new Promise((resolve) => {
    const transaction = dbInstance.transaction([SESSIONS_STORE], 'readwrite');
    const store = transaction.objectStore(SESSIONS_STORE);
    const countRequest = store.count();

    countRequest.onsuccess = () => {
      const totalSessions = countRequest.result;

      if (totalSessions <= MAX_SESSIONS) {
        resolve();
        return;
      }

      const toDelete = totalSessions - MAX_SESSIONS;
      const index = store.index('timestamp');
      const request = index.openCursor(null, 'next'); // Ascending (oldest first)

      let deleted = 0;
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor && deleted < toDelete) {
          cursor.delete();
          deleted++;
          cursor.continue();
        } else {
          console.log(`[Storage] Pruned ${deleted} old sessions`);
          resolve();
        }
      };
    };
  });
}

// ========================================
// HIGHLIGHT SELECTION STORAGE (Story 14.1)
// ========================================

/**
 * Get all-time high values for each cognitive metric across all sessions
 * @returns {Promise<Object>} Max values for each of 6 metrics
 */
export async function getAllTimeHighs() {
  // Query all sessions (up to MAX_SESSIONS)
  const sessions = await getSessions(MAX_SESSIONS);

  // First session edge case: return all zeros
  if (sessions.length === 0) {
    return {
      reactionTime: 0,
      spatialAwareness: 0,
      cognitiveFlexibility: 0,
      dividedAttention: 0,
      impulseControl: 0,
      workingMemory: 0
    };
  }

  // Track max value for each metric
  const allTimeHighs = {
    reactionTime: 0,
    spatialAwareness: 0,
    cognitiveFlexibility: 0,
    dividedAttention: 0,
    impulseControl: 0,
    workingMemory: 0
  };

  // Iterate sessions and track Math.max() for each metric
  sessions.forEach(session => {
    if (session.metrics) {
      Object.keys(allTimeHighs).forEach(metric => {
        const value = session.metrics[metric];
        if (typeof value === 'number' && !isNaN(value)) {
          allTimeHighs[metric] = Math.max(allTimeHighs[metric], value);
        }
      });
    }
  });

  return allTimeHighs;
}

/**
 * Retrieve last session's highlight pattern from localStorage
 * Used for variety enforcement (Story 14.1)
 * @returns {Array<string>} Array of highlight types or empty array
 */
export function getLastSessionPattern() {
  const stored = localStorage.getItem('crazysnakeLite_lastSessionPattern');
  return stored ? JSON.parse(stored) : [];
}

/**
 * Save current session's highlight pattern to localStorage
 * Used for variety enforcement in next session (Story 14.1)
 * @param {Array<string>} pattern - Array of highlight types
 */
export function saveSessionPattern(pattern) {
  if (!Array.isArray(pattern)) {
    console.warn('[Storage] Invalid session pattern - expected array');
    return;
  }

  try {
    localStorage.setItem('crazysnakeLite_lastSessionPattern', JSON.stringify(pattern));
  } catch (error) {
    console.warn('[Storage] Failed to save session pattern:', error.message);
  }
}

// ========================================
// LOCALSTORAGE METHODS (Profile, Streak, Highlights)
// ========================================

/**
 * Get player profile data (calibration state, session count)
 * @returns {Object} Profile object
 */
export function getProfile() {
  const stored = localStorage.getItem('crazysnakeLite_profile');
  return stored ? JSON.parse(stored) : {
    calibrationComplete: false,
    sessionsCompleted: 0,
    lastPlayedDate: null
  };
}

/**
 * Update player profile data
 * @param {Object} profileData - Partial profile object to merge
 */
export function updateProfile(profileData) {
  const current = getProfile();
  const updated = { ...current, ...profileData };
  localStorage.setItem('crazysnakeLite_profile', JSON.stringify(updated));
}

/**
 * Get streak data
 * @returns {Object} Streak object
 */
export function getStreak() {
  const stored = localStorage.getItem('crazysnakeLite_streak');
  return stored ? JSON.parse(stored) : {
    currentStreak: 0,
    longestStreak: 0,
    lastPlayedDate: null,
    streakStartDate: null
  };
}

/**
 * Update streak data
 * @param {Object} streakData - Partial streak object to merge
 */
export function updateStreak(streakData) {
  const current = getStreak();
  const updated = { ...current, ...streakData };
  localStorage.setItem('crazysnakeLite_streak', JSON.stringify(updated));
}

/**
 * Check if storage API is available
 * @param {string} type - 'localStorage' or 'indexedDB'
 * @returns {boolean} Availability status
 */
export function isStorageAvailable(type) {
  try {
    if (type === 'localStorage') {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } else if (type === 'indexedDB') {
      return 'indexedDB' in window && indexedDB !== null;
    }
    return false;
  } catch (e) {
    return false;
  }
}

// ========================================
// LEGACY LOCALSTORAGE METHODS (High Score, Feedback)
// ========================================

const HIGH_SCORE_KEY = 'crazysnakeLite_highScore';

/**
 * Load high score from localStorage
 * @returns {number} - High score (0 if none exists)
 */
export function loadHighScore() {
  try {
    const stored = localStorage.getItem(HIGH_SCORE_KEY);
    // Parse and validate, fallback to 0 if invalid/NaN
    const score = stored ? (parseInt(stored, 10) || 0) : 0;
    const validScore = Math.max(0, score);  // Ensure non-negative
    console.log('[Storage] High score loaded:', validScore);
    return validScore;
  } catch (error) {
    console.error('[Storage] Failed to load high score:', error.message);
    return 0;  // Fallback to 0 on error
  }
}

/**
 * Save high score to localStorage
 * @param {number} score - Score to save
 */
export function saveHighScore(score) {
  // Validate score is a valid positive integer
  const validScore = Math.max(0, Math.floor(score || 0));

  try {
    localStorage.setItem(HIGH_SCORE_KEY, validScore.toString());
    console.log('[Storage] High score saved:', validScore);
  } catch (error) {
    console.error('[Storage] Failed to save high score:', error.message);
  }
}

// Feedback Email Persistence (Story 6.5)
const FEEDBACK_EMAIL_KEY = 'crazysnakeLite_feedbackEmail';

/**
 * Load saved feedback email from localStorage
 * @returns {string} Saved email or empty string
 */
export function loadFeedbackEmail() {
  try {
    return localStorage.getItem(FEEDBACK_EMAIL_KEY) || '';
  } catch (error) {
    console.warn('[Storage] Failed to load feedback email:', error.message);
    return '';
  }
}

/**
 * Save feedback email to localStorage
 * @param {string} email - Email address to save
 */
export function saveFeedbackEmail(email) {
  if (!email || !email.trim()) return;

  try {
    localStorage.setItem(FEEDBACK_EMAIL_KEY, email.trim());
    console.log('[Storage] Feedback email saved');
  } catch (error) {
    console.warn('[Storage] Failed to save feedback email:', error.message);
  }
}
