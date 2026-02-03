// CrazySnakeLite - Storage Module (Story 4.2)
// Handles localStorage for high score persistence

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
