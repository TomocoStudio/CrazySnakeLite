// CrazySnakeLite - Dynamic Background Glow System
// Story 22.1: Atmospheric enhancement with food-synchronized glow

/**
 * Hue rotation mapping for food type colors
 * Base gradient is red (hue-rotate(0deg)), all other colors rotate from this base
 * Colors are thematic approximations that evoke food identity (smooth transitions prioritized)
 */
export const FOOD_HUE_MAP = {
  growing: 120,        // Green (growth theme)
  invincibility: 60,   // Yellow (safety/invulnerability theme)
  wallPhase: 300,      // Purple (mystical/phase theme)
  speedBoost: 0,       // Red - base color (energy/speed theme)
  speedDecrease: 180,  // Cyan (calm/slow theme)
  reverseControls: 30  // Orange (chaotic/warning theme)
};

// DOM element references
let glowElement = null;
let vignetteElement = null;

/**
 * Initialize background glow system
 * Creates glow and vignette DOM elements, sets initial white glow
 * Should be called once on page load
 */
export function initBackgroundGlow() {
  // Create glow element (z-index: -2, farthest back)
  glowElement = document.createElement('div');
  glowElement.className = 'background-glow white-glow';
  document.body.prepend(glowElement);

  // Create vignette overlay (z-index: -1, above glow but below all game elements)
  vignetteElement = document.createElement('div');
  vignetteElement.className = 'background-vignette';
  document.body.appendChild(vignetteElement);

  console.log('[Background Glow] System initialized - white glow active');
}

/**
 * Update glow color based on food type
 * Uses CSS filter hue-rotate for smooth color interpolation
 * @param {string} foodType - Type of food ('growing', 'invincibility', etc.)
 */
export function updateGlowForFood(foodType) {
  if (!glowElement) {
    console.warn('[Background Glow] Cannot update - glow element not initialized');
    return;
  }

  const hueRotation = FOOD_HUE_MAP[foodType];

  if (hueRotation !== undefined) {
    // Remove white glow class (switches to red base gradient)
    glowElement.classList.remove('white-glow');

    // Apply hue rotation to shift to food color (browser smoothly interpolates)
    glowElement.style.filter = `blur(50px) hue-rotate(${hueRotation}deg)`;

    console.log(`[Background Glow] Updated to ${foodType} (hue: ${hueRotation}deg)`);
  } else {
    // Fallback to white if unknown food type
    console.warn(`[Background Glow] Unknown food type "${foodType}" - falling back to white`);
    setGlowToWhite();
  }
}

/**
 * Set glow to white (for menu/game-over/skill-map/default states)
 * Provides neutral backdrop for non-gameplay screens
 */
export function setGlowToWhite() {
  if (!glowElement) {
    console.warn('[Background Glow] Cannot set white - glow element not initialized');
    return;
  }

  // Add white glow class (switches to white gradient)
  glowElement.classList.add('white-glow');

  // Reset filter to no hue rotation
  glowElement.style.filter = 'blur(50px) hue-rotate(0deg)';

  console.log('[Background Glow] Set to white (system state)');
}

/**
 * Clean up glow elements (for testing/cleanup)
 * Removes DOM elements and clears references
 */
export function cleanupBackgroundGlow() {
  if (glowElement) {
    glowElement.remove();
    glowElement = null;
  }

  if (vignetteElement) {
    vignetteElement.remove();
    vignetteElement = null;
  }

  console.log('[Background Glow] Cleaned up - elements removed');
}
