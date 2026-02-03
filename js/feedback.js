// CrazySnakeLite - Feedback Modal Module (Story 6.1)
// Enables beta players to submit structured feedback with auto-pause behavior

import { CONFIG } from './config.js';
import { loadFeedbackEmail, saveFeedbackEmail } from './storage.js';
import { isAudioReady, playMenuMusic, resumeAudio, stopMenuMusic, initAudio } from './audio.js';

let previousPhase = null;  // Track game phase before opening feedback

/**
 * Open feedback modal and auto-pause game if playing
 * @param {Object} gameState - Current game state
 */
export function openFeedbackModal(gameState) {
  // Store current phase for restoration later
  previousPhase = gameState.phase;

  // Auto-pause if game is currently playing
  if (gameState.phase === 'playing') {
    gameState.phase = 'paused';
  }

  // Show modal overlay
  const modal = document.getElementById('feedback-modal');
  modal.classList.remove('hidden');

  // Blur game canvas (same pattern as phone overlay)
  const canvas = document.getElementById('game-canvas');
  canvas.classList.add('blurred');

  // Focus first star rating for keyboard accessibility
  const firstRating = document.querySelector('#fun-rating .star');
  if (firstRating) firstRating.focus();
}

/**
 * Close feedback modal and restore game state
 * @param {Object} gameState - Current game state
 */
export function closeFeedbackModal(gameState) {
  // Hide modal overlay
  const modal = document.getElementById('feedback-modal');
  modal.classList.add('hidden');

  // Remove blur from game canvas
  const canvas = document.getElementById('game-canvas');
  canvas.classList.remove('blurred');

  // Restore previous game phase
  if (previousPhase) {
    gameState.phase = previousPhase;
    previousPhase = null;
  }
}

/**
 * Initialize star rating interactivity
 * Sets up click handlers for all star rating elements
 */
export function initStarRatings() {
  const ratingContainers = document.querySelectorAll('.star-rating');

  ratingContainers.forEach(container => {
    const stars = container.querySelectorAll('.star');

    stars.forEach(star => {
      // Click handler
      star.addEventListener('click', () => {
        const value = parseInt(star.dataset.value);
        container.dataset.rating = value;
        updateStarDisplay(container, value);
      });

      // Hover preview (only on devices with hover capability)
      star.addEventListener('mouseenter', () => {
        const value = parseInt(star.dataset.value);
        highlightStars(container, value);
      });
    });

    // Reset highlight on mouse leave
    container.addEventListener('mouseleave', () => {
      const currentRating = parseInt(container.dataset.rating) || 0;
      updateStarDisplay(container, currentRating);
    });
  });
}

/**
 * Update star display based on rating value
 * @param {HTMLElement} container - Star rating container
 * @param {number} rating - Rating value (1-5)
 */
function updateStarDisplay(container, rating) {
  const stars = container.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add('filled');
      star.textContent = '★';
    } else {
      star.classList.remove('filled');
      star.textContent = '☆';
    }
  });
}

/**
 * Highlight stars on hover (preview)
 * @param {HTMLElement} container - Star rating container
 * @param {number} value - Hover value (1-5)
 */
function highlightStars(container, value) {
  const stars = container.querySelectorAll('.star');
  stars.forEach((star, index) => {
    if (index < value) {
      star.style.color = '#FFA500';  // Orange preview
    } else {
      star.style.color = '#555';
    }
  });
}

/**
 * Initialize character counter for textarea
 */
export function initCharCounter() {
  const textarea = document.getElementById('feedback-comments');
  const charCount = document.getElementById('char-count');

  if (textarea && charCount) {
    textarea.addEventListener('input', () => {
      charCount.textContent = textarea.value.length;

      // Warn if approaching limit
      if (textarea.value.length >= 450) {
        charCount.style.color = '#FFD700';
      } else {
        charCount.style.color = '#888';
      }
    });
  }
}

/**
 * Reset feedback form to empty state
 * Used after submission or on modal re-open
 */
export function resetFeedbackForm() {
  // Reset star ratings
  document.querySelectorAll('.star-rating').forEach(container => {
    container.dataset.rating = '0';
    updateStarDisplay(container, 0);
  });

  // Reset text area
  const textarea = document.getElementById('feedback-comments');
  if (textarea) textarea.value = '';

  // Reset character counter
  const charCount = document.getElementById('char-count');
  if (charCount) {
    charCount.textContent = '0';
    charCount.style.color = '#888';
  }

  // Email input is NOT reset to allow convenience for multiple submissions (Story 6.5)
}

/**
 * Get current form data for submission
 * @returns {Object} Form data with ratings and optional fields
 */
export function getFormData() {
  const funRating = parseInt(document.getElementById('fun-rating').dataset.rating) || 0;
  const difficultyRating = parseInt(document.getElementById('difficulty-rating').dataset.rating) || 0;
  const comments = document.getElementById('feedback-comments').value.trim();
  const email = document.getElementById('feedback-email').value.trim();

  return {
    funRating,
    difficultyRating,
    comments,
    email
  };
}

/**
 * Capture all auto-metadata for feedback submission (Story 6.3)
 * @param {Object} gameState - Current game state
 * @returns {Object} Metadata object with all collected data
 */
export function captureMetadata(gameState) {
  return {
    timestamp: new Date().toISOString(),
    browser: parseBrowser(),
    os: parseOS(),
    screen: `${window.innerWidth}x${window.innerHeight}`,
    currentScore: gameState.score || 0,
    topScore: getTopScore(),
    gamesPlayed: gameState.gamesPlayed || 0,
    sessionDuration: formatSessionDuration(gameState.sessionStart)
  };
}

/**
 * Parse browser name, version, and device type from user agent
 * @returns {string} Browser info (e.g., "Chrome 120.0 (Desktop)")
 */
function parseBrowser() {
  const ua = navigator.userAgent;

  // Detect browser
  let browser = 'Unknown';
  let version = '';

  if (ua.includes('Firefox/')) {
    browser = 'Firefox';
    version = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Edg/')) {
    browser = 'Edge';
    version = ua.match(/Edg\/(\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    browser = 'Chrome';
    version = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    browser = 'Safari';
    version = ua.match(/Version\/(\d+\.\d+)/)?.[1] || '';
  }

  // Detect device type
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
  const deviceType = isMobile ? 'Mobile' : 'Desktop';

  return version ? `${browser} ${version} (${deviceType})` : `${browser} (${deviceType})`;
}

/**
 * Parse operating system from user agent
 * @returns {string} OS name (e.g., "macOS", "Windows 10", "iOS 15")
 */
function parseOS() {
  const ua = navigator.userAgent;

  if (ua.includes('Mac OS X')) {
    const version = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace('_', '.') || '';
    return version ? `macOS ${version}` : 'macOS';
  } else if (ua.includes('Windows NT')) {
    const version = ua.match(/Windows NT (\d+\.\d+)/)?.[1];
    const windowsVersion = {
      '10.0': 'Windows 10',
      '6.3': 'Windows 8.1',
      '6.2': 'Windows 8',
      '6.1': 'Windows 7'
    };
    return windowsVersion[version] || 'Windows';
  } else if (ua.includes('Android')) {
    const version = ua.match(/Android (\d+\.\d+)/)?.[1] || '';
    return version ? `Android ${version}` : 'Android';
  } else if (ua.includes('iPhone') || ua.includes('iPad')) {
    const version = ua.match(/OS (\d+[._]\d+)/)?.[1]?.replace('_', '.') || '';
    return version ? `iOS ${version}` : 'iOS';
  } else if (ua.includes('Linux')) {
    return 'Linux';
  }

  return 'Unknown';
}

/**
 * Get top score from localStorage
 * @returns {number} Top score or 0 if not found
 */
function getTopScore() {
  try {
    const highScore = localStorage.getItem('crazysnakeLite_highScore');
    return parseInt(highScore) || 0;
  } catch (error) {
    console.warn('[Feedback] Failed to get top score:', error);
    return 0;
  }
}

/**
 * Format session duration from start timestamp to readable format
 * @param {number} sessionStart - Timestamp when session started (Date.now())
 * @returns {string} Formatted duration (e.g., "8m 32s", "1h 5m")
 */
function formatSessionDuration(sessionStart) {
  if (!sessionStart) return '0s';

  const durationMs = Date.now() - sessionStart;
  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  } else if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Format star ratings as Unicode stars
 * @param {number} rating - Rating value (0-5)
 * @returns {string} Star string (e.g., "⭐⭐⭐⭐☆")
 */
function formatStars(rating) {
  const filledStar = '⭐';
  const emptyStar = '☆';
  return filledStar.repeat(rating) + emptyStar.repeat(5 - rating);
}

/**
 * Format complete email body with feedback + metadata (Story 6.3)
 * @param {Object} formData - Form data from getFormData()
 * @param {Object} metadata - Metadata from captureMetadata()
 * @returns {string} Formatted email body
 */
export function formatEmailBody(formData, metadata) {
  const funStars = formatStars(formData.funRating);
  const difficultyStars = formatStars(formData.difficultyRating);

  // Build email body with structured format
  let body = '';

  // Ratings
  body += `Fun Rating: ${funStars} (${formData.funRating}/5)\n`;
  body += `Difficulty Rating: ${difficultyStars} (${formData.difficultyRating}/5)\n\n`;

  // Comments
  body += `Player Comments:\n`;
  body += formData.comments || '(No comments provided)';
  body += `\n\n`;

  // Optional email
  body += `Optional Email: ${formData.email || 'Not provided'}\n\n`;

  // Auto-captured data
  body += `--- AUTO-CAPTURED DATA ---\n`;
  body += `Timestamp: ${metadata.timestamp}\n`;
  body += `Browser: ${metadata.browser}\n`;
  body += `OS: ${metadata.os}\n`;
  body += `Screen: ${metadata.screen}\n`;
  body += `Current Score: ${metadata.currentScore}\n`;
  body += `Top Score: ${metadata.topScore}\n`;
  body += `Games Played: ${metadata.gamesPlayed}\n`;
  body += `Session Duration: ${metadata.sessionDuration}\n`;

  return body;
}

/**
 * Format email subject line (Story 6.3)
 * @param {Object} formData - Form data with ratings
 * @param {Object} metadata - Metadata with timestamp
 * @returns {string} Email subject
 */
export function formatEmailSubject(formData, metadata) {
  const date = metadata.timestamp.split('T')[0];  // Extract date only (YYYY-MM-DD)
  return `[Crazy Snake Feedback] Fun:${formData.funRating} Difficulty:${formData.difficultyRating} | ${date}`;
}

/**
 * Submit feedback via mailto: link (Story 6.4)
 * @param {Object} gameState - Current game state
 * @returns {boolean} True if submission succeeded, false if failed
 */
export function submitFeedback(gameState) {
  try {
    // Get form data and metadata
    const formData = getFormData();
    const metadata = captureMetadata(gameState);

    // Save email for next time (Story 6.5)
    if (formData.email) {
      saveFeedbackEmail(formData.email);
    }

    // Generate email subject and body
    const subject = formatEmailSubject(formData, metadata);
    const body = formatEmailBody(formData, metadata);

    // Create mailto: link
    const mailtoLink = `mailto:${CONFIG.FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    // Trigger email client
    window.location.href = mailtoLink;

    console.log('[Feedback] Email client opened');
    return true;
  } catch (error) {
    console.error('[Feedback] Submission failed:', error);
    return false;
  }
}

/**
 * Initialize feedback modal (Story 6.5)
 * Pre-fill email if previously saved
 */
export function initFeedbackModal() {
  // Load saved email from localStorage
  const savedEmail = loadFeedbackEmail();
  if (savedEmail) {
    const emailInput = document.getElementById('feedback-email');
    if (emailInput) {
      emailInput.value = savedEmail;
      console.log('[Feedback] Pre-filled saved email');
    }
  }
}

let thankYouTimeout = null;  // Track auto-close timeout

/**
 * Show thank you screen after feedback submission (Story 6.4)
 * @param {Object} gameState - Current game state
 */
export function showThankYouScreen(gameState) {
  // Hide feedback modal
  const feedbackModal = document.getElementById('feedback-modal');
  feedbackModal.classList.add('hidden');

  // Show thank you screen
  const thankYouScreen = document.getElementById('thank-you-screen');
  thankYouScreen.classList.remove('hidden');

  // Canvas remains blurred (will be removed when thank you closes)

  // Auto-close after 3 seconds
  thankYouTimeout = setTimeout(() => {
    closeThankYouScreen(gameState);
  }, CONFIG.THANK_YOU_DURATION);

  console.log('[Feedback] Thank you screen shown (auto-close in 3s)');
}

/**
 * Close thank you screen and return to game (Story 6.4)
 * @param {Object} gameState - Current game state
 * @param {boolean} fromUserInteraction - True if triggered by button click
 */
export function closeThankYouScreen(gameState, fromUserInteraction = false) {
  // Clear auto-close timeout if user closed manually
  if (thankYouTimeout) {
    clearTimeout(thankYouTimeout);
    thankYouTimeout = null;
  }

  // Hide thank you screen
  const thankYouScreen = document.getElementById('thank-you-screen');
  thankYouScreen.classList.add('hidden');

  // Remove blur and restore game state (reuse closeFeedbackModal logic)
  const canvas = document.getElementById('game-canvas');
  canvas.classList.remove('blurred');

  // Restore previous game phase
  if (previousPhase) {
    gameState.phase = previousPhase;

    // BUG FIX: Reinitialize audio system after thank you screen
    // mailto: link triggers beforeunload which closes AudioContext
    // Must reinit regardless of phase (menu, gameover, playing) to restore all sounds
    console.log('[Feedback] Reinitializing audio after thank you screen...');

    // Reinitialize audio (handles closed AudioContext from mailto:)
    initAudio().then(() => {
      return resumeAudio();
    }).then(() => {
      console.log('[Feedback] Audio reinitialized, isAudioReady:', isAudioReady());

      // Only restart menu music if returning to menu phase
      if (gameState.phase === 'menu' && isAudioReady()) {
        playMenuMusic();
        console.log('[Feedback] ✓ Menu music restarted');
      } else {
        console.log('[Feedback] ✓ Audio system restored (phase:', gameState.phase + ')');
      }
    }).catch(err => {
      console.error('[Feedback] Failed to reinitialize audio:', err);
    });

    previousPhase = null;
  }

  console.log('[Feedback] Thank you screen closed, game resumed');
}
