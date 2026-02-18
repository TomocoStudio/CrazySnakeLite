// CrazySnakeLite - Score Popup Module
// Story 7.2: Visual feedback for food consumption
// Story 7.5: Popup queue system for preventing overlap
// Story 7.6: Reduced motion mode for accessibility
import { CONFIG } from './config.js';

// Reduced motion detection (Story 7.6)
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Apply class to body for CSS targeting
if (prefersReducedMotion) {
  document.body.classList.add('reduced-motion');
}

// Export for other modules to check
export const isReducedMotion = prefersReducedMotion;

// Queue state (Story 7.5)
let lastPopupTime = 0;
let pendingPopups = [];
let stackOffset = 0;
let isProcessingQueue = false;

/**
 * Convert grid coordinates to viewport pixel coordinates
 * @param {number} gridX - Grid X coordinate
 * @param {number} gridY - Grid Y coordinate
 * @returns {{x: number, y: number}} - Viewport pixel coordinates
 */
export function gridToPixel(gridX, gridY) {
  const canvas = document.getElementById('game-canvas');
  const rect = canvas.getBoundingClientRect();

  // Calculate center of grid cell in viewport coordinates
  return {
    x: rect.left + (gridX * CONFIG.UNIT_SIZE) + (CONFIG.UNIT_SIZE / 2),
    y: rect.top + (gridY * CONFIG.UNIT_SIZE) + (CONFIG.UNIT_SIZE / 2)
  };
}

// Victory message pool (Story 11.1 - rotating messages)
const VICTORY_MESSAGES = [
  "UNSTOPPABLE!",
  "BRILLIANT!",
  "LEGENDARY!",
  "AMAZING!",
  "YOU RULE!",
  "YOU ROCK!",
  "AWESOME!"
];

// Speed Boost victory message pool (Story 7.7)
const SPEED_BOOST_MESSAGES = [
  "SO FAST!",
  "BLAZING!",
  "LIGHTNING!",
  "SPEED DEMON!",
  "SUPERSONIC!",
  "WARP SPEED!",
  "TURBO MODE!"
];

// Wall Phase victory message pool (Story 7.8)
const WALL_PHASE_MESSAGES = [
  "PHASED!",
  "WALL CROSSED!",
  "NO LIMITS!",
  "PHASE MASTER!",
  "WALL BREAKER!",
  "GHOSTED IT!",
  "BOUNDARY BROKEN!"
];

// Invincibility power message pool (Story 7.9)
export const INVINCIBILITY_MESSAGES = [
  "INVINCIBLE!",
  "IMMORTAL!",
  "SHIELDED!",
  "FEARLESS!",
  "NO DAMAGE!",
  "ARMORED!",
  "IMMUNE!"
];

/**
 * Spawn a random victory message flash (Story 11.1)
 * Used for RC survival celebration with rotating messages
 * @param {number} x - X position in viewport pixels
 * @param {number} y - Y position in viewport pixels
 */
export function spawnVictoryFlash(x, y) {
  const randomMessage = VICTORY_MESSAGES[Math.floor(Math.random() * VICTORY_MESSAGES.length)];

  const flash = document.createElement('div');
  flash.className = 'victory-flash';
  flash.textContent = randomMessage;

  // Position flash at pixel coordinates
  flash.style.left = `${x}px`;
  flash.style.top = `${y}px`;

  // Add to DOM
  document.body.appendChild(flash);

  // Auto-remove after animation completes (3500ms)
  flash.addEventListener('animationend', () => {
    flash.remove();
  });
}

/**
 * Spawn a random speed-themed victory message flash (Story 7.7)
 * Used for Speed Boost celebration with rotating messages
 * @param {number} x - X position in viewport pixels
 * @param {number} y - Y position in viewport pixels
 */
export function spawnSpeedFlash(x, y) {
  const randomMessage = SPEED_BOOST_MESSAGES[Math.floor(Math.random() * SPEED_BOOST_MESSAGES.length)];

  const flash = document.createElement('div');
  flash.className = 'speed-flash';
  flash.textContent = randomMessage;

  // Position flash at pixel coordinates
  flash.style.left = `${x}px`;
  flash.style.top = `${y}px`;

  // Add to DOM
  document.body.appendChild(flash);

  // Auto-remove after animation completes (3500ms)
  flash.addEventListener('animationend', () => {
    flash.remove();
  });
}

/**
 * Spawn a random wall-crossing victory message flash (Story 7.8)
 * Used for Wall Phase celebration with rotating messages
 * @param {number} x - X position in viewport pixels
 * @param {number} y - Y position in viewport pixels
 */
export function spawnPhaseFlash(x, y) {
  const randomMessage = WALL_PHASE_MESSAGES[Math.floor(Math.random() * WALL_PHASE_MESSAGES.length)];

  const flash = document.createElement('div');
  flash.className = 'phase-flash';
  flash.textContent = randomMessage;

  // Position flash at pixel coordinates
  flash.style.left = `${x}px`;
  flash.style.top = `${y}px`;

  // Add to DOM
  document.body.appendChild(flash);

  // Auto-remove after animation completes (3500ms)
  flash.addEventListener('animationend', () => {
    flash.remove();
  });
}

/**
 * Spawn a random invincibility power message flash (Story 7.9)
 * Used for Invincibility celebration with rotating messages
 * @param {number} x - X position in viewport pixels
 * @param {number} y - Y position in viewport pixels
 */
export function spawnInvincibilityFlash(x, y) {
  const randomMessage = INVINCIBILITY_MESSAGES[Math.floor(Math.random() * INVINCIBILITY_MESSAGES.length)];

  const flash = document.createElement('div');
  flash.className = 'invincibility-flash';
  flash.textContent = randomMessage;

  // Position flash at pixel coordinates
  flash.style.left = `${x}px`;
  flash.style.top = `${y}px`;

  // Add to DOM
  document.body.appendChild(flash);

  // Auto-remove after animation completes (3500ms)
  flash.addEventListener('animationend', () => {
    flash.remove();
  });
}

/**
 * Spawn a text flash (Story 11.1)
 * Generic flash function for custom text
 * @param {string} text - Flash text
 * @param {number} x - X position in viewport pixels
 * @param {number} y - Y position in viewport pixels
 */
export function spawnFlash(text, x, y) {
  const flash = document.createElement('div');
  flash.className = 'rc-survived-flash';
  flash.textContent = text;

  // Position flash at pixel coordinates
  flash.style.left = `${x}px`;
  flash.style.top = `${y}px`;

  // Add to DOM
  document.body.appendChild(flash);

  // Auto-remove after animation completes (3500ms)
  flash.addEventListener('animationend', () => {
    flash.remove();
  });
}

/**
 * Spawn a "COMBO MODE!" flash centered on the game canvas
 * @param {string} text - Flash text (e.g., 'COMBO MODE!')
 */
export function spawnCenterComboFlash(text) {
  const canvas = document.getElementById('game-canvas');
  const rect = canvas.getBoundingClientRect();

  const flash = document.createElement('div');
  flash.className = 'combo-center-flash';
  flash.textContent = text;

  // Position at canvas center — CSS transform handles the -50%/-50% offset
  flash.style.left = `${rect.left + rect.width / 2}px`;
  flash.style.top = `${rect.top + rect.height / 2}px`;

  document.body.appendChild(flash);

  flash.addEventListener('animationend', () => {
    flash.remove();
  });
}

/**
 * Spawn a phone bonus popup (Story 9.6)
 * Convenience wrapper for phone call bonuses with gold styling
 * @param {number} value - Bonus points awarded
 * @param {number} gridX - Grid X coordinate (not pixels!)
 * @param {number} gridY - Grid Y coordinate (not pixels!)
 */
export function spawnPhoneBonusPopup(value, gridX, gridY) {
  spawnPopup(value, gridX, gridY, 'CALL BONUS', 'phone');
}

/**
 * Spawn a combo score popup (Story 10.4)
 * Convenience wrapper for combo multiplier scoring with dramatic styling
 * @param {number} value - Combo score (A × B)
 * @param {number} gridX - Grid X coordinate (not pixels!)
 * @param {number} gridY - Grid Y coordinate (not pixels!)
 */
export function spawnComboPopup(value, gridX, gridY) {
  spawnPopup(value, gridX, gridY, 'COMBO', 'combo');
}

/**
 * Spawn a score popup with queue management (Story 7.5)
 * @param {number} value - Point value (1, 2, 3, 5, 8, etc.)
 * @param {number} gridX - Grid X coordinate (not pixels!)
 * @param {number} gridY - Grid Y coordinate (not pixels!)
 * @param {string} label - Optional label (e.g., "COMBO", "CALL BONUS")
 * @param {string} foodType - Optional food type for color matching (e.g., "growing", "speedBoost", "phone")
 */
export function spawnPopup(value, gridX, gridY, label = '', foodType = null) {
  const now = Date.now();

  // Check if we need to queue this popup (within 500ms of last popup)
  if (now - lastPopupTime < 500 && lastPopupTime > 0) {
    // Queue popup for later
    pendingPopups.push({ value, gridX, gridY, label, foodType });

    // Start queue processor if not already running
    if (!isProcessingQueue) {
      isProcessingQueue = true;
      requestAnimationFrame(processPopupQueue);
    }

    return;
  }

  // Spawn immediately
  spawnPopupImmediate(value, gridX, gridY, label, foodType, 0);
  lastPopupTime = now;
  stackOffset = 0; // Reset stack for next burst
}

/**
 * Actually create and render the popup (Story 7.5 refactor)
 * @param {number} value - Point value
 * @param {number} gridX - Grid X coordinate
 * @param {number} gridY - Grid Y coordinate
 * @param {string} label - Optional label
 * @param {string} foodType - Optional food type
 * @param {number} verticalOffset - Stacking offset in pixels
 */
function spawnPopupImmediate(value, gridX, gridY, label, foodType, verticalOffset) {
  // Convert grid coordinates to viewport pixels
  const { x, y } = gridToPixel(gridX, gridY);

  // Create popup element
  const popup = document.createElement('div');

  // Use food type for styling if provided, otherwise fall back to value
  const styleClass = foodType ? `score-popup-${foodType}` : `score-popup-${value}`;
  popup.className = `score-popup ${styleClass}`;

  // Story 10.4: Add jackpot/legendary classes for high-value combos
  if (foodType === 'combo') {
    if (value >= CONFIG.COMBO_LEGENDARY_THRESHOLD) {
      popup.classList.add('legendary');
    } else if (value >= CONFIG.COMBO_JACKPOT_THRESHOLD) {
      popup.classList.add('jackpot');
    }
  }

  popup.textContent = label ? `+${value} ${label}` : `+${value}`;

  // Position at collision point + vertical offset for stacking
  popup.style.left = `${x}px`;
  popup.style.top = `${y + verticalOffset}px`;

  // Append to document body
  document.body.appendChild(popup);

  // Auto-cleanup on animation end (prevent memory leaks)
  popup.addEventListener('animationend', () => {
    popup.remove();
  });
}

/**
 * Process popup queue (runs in RAF loop) (Story 7.5)
 */
function processPopupQueue() {
  const now = Date.now();

  // Check if 300ms elapsed since last popup
  if (now - lastPopupTime >= 300 && pendingPopups.length > 0) {
    // Spawn next popup from queue
    const nextPopup = pendingPopups.shift();
    stackOffset += 50; // Stack 50px below previous

    spawnPopupImmediate(
      nextPopup.value,
      nextPopup.gridX,
      nextPopup.gridY,
      nextPopup.label,
      nextPopup.foodType,
      stackOffset
    );

    lastPopupTime = now;
  }

  // Continue processing if queue not empty
  if (pendingPopups.length > 0) {
    requestAnimationFrame(processPopupQueue);
  } else {
    isProcessingQueue = false;
    stackOffset = 0; // Reset for next burst
  }
}

/**
 * Spawn particle explosion at coordinates
 * @param {number} count - Number of particles (5-7 recommended)
 * @param {number} x - X coordinate in pixels
 * @param {number} y - Y coordinate in pixels
 */
export function spawnParticles(count, x, y) {
  for (let i = 0; i < count; i++) {
    const particle = document.createElement('div');
    particle.className = 'particle-star';

    // Position at explosion origin
    particle.style.left = `${x}px`;
    particle.style.top = `${y}px`;

    // Evenly distributed radial pattern (6 particles for visual balance)
    const angle = (Math.PI * 2 * i) / count; // Radial distribution
    const speed = 40 + Math.random() * 20; // 40-60px travel distance (randomized)
    const vx = Math.cos(angle) * speed;
    const vy = Math.sin(angle) * speed;

    // Set CSS custom properties for animation
    particle.style.setProperty('--particle-x', `${vx}px`);
    particle.style.setProperty('--particle-y', `${vy}px`);

    // Append to document
    document.body.appendChild(particle);

    // Auto-cleanup on animation end (consistent with popup cleanup)
    particle.addEventListener('animationend', () => {
      particle.remove();
    });
  }
}

/**
 * Trigger screen shake effect
 * Applies shake to game canvas container
 * (Story 7.6: Disabled in reduced motion mode)
 */
export function triggerScreenShake() {
  // Skip shake if reduced motion preference
  if (prefersReducedMotion) {
    return; // No shake for accessibility
  }

  const container = document.getElementById('game-container');
  if (!container) return;

  // Add shake class to container (not canvas — canvas has conflicting border animations)
  container.classList.add('shake');

  // Remove after animation completes (200ms)
  setTimeout(() => {
    container.classList.remove('shake');
  }, 200);
}
