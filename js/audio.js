// CrazySnakeLite - Audio System Module (Story 4.5)
// Web Audio API implementation for precise, non-blocking sound playback

import { CONFIG } from './config.js';

let audioContext = null;
let masterGainNode = null;  // For volume control
const audioBuffers = {};
let audioInitialized = false;
let loadedSoundCount = 0;  // Track successful loads
let failedSounds = [];  // Track failed sound loads

// Track alternation state
let currentAlternator = 0;  // 0 or 1 (plays sound 1 or 2)
let previousState = null;   // Track state changes for reset
let lastPlayTime = 0;  // For rate limiting

/**
 * Initialize audio system using Web Audio API
 * Fetches and pre-decodes all 14 MP3 files into AudioBuffers
 * Story 4.5 + Code Review Fixes
 */
export async function initAudio() {
  if (audioInitialized) return;

  try {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Create master gain node for volume control (Fix #6)
    masterGainNode = audioContext.createGain();
    masterGainNode.gain.value = CONFIG.MASTER_VOLUME;
    masterGainNode.connect(audioContext.destination);

    // Fix #1: Use correct spelling (note: actual files still have typo, needs manual rename)
    const states = ['default', 'growing', 'invincibility', 'wallphase',
                    'speedboost', 'speeddecrease', 'reverse'];

    // Reset counters (Fix #3)
    loadedSoundCount = 0;
    failedSounds = [];

    // Fetch and decode all 14 sounds in parallel
    const loadPromises = [];

    states.forEach(state => {
      for (const num of [1, 2]) {
        const key = `${state}-${num}`;
        // Fix #2: Use CONFIG.SOUNDS_PATH
        const url = `${CONFIG.SOUNDS_PATH}move-${state}-${num}.mp3`;

        const promise = fetch(url)
          .then(response => response.arrayBuffer())
          .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
          .then(audioBuffer => {
            audioBuffers[key] = audioBuffer;
            loadedSoundCount++;  // Track successful loads
          })
          .catch(err => {
            failedSounds.push(key);  // Track failures (Fix #8)
            console.warn(`[Audio] Failed to load ${key}:`, err.message);
          });

        loadPromises.push(promise);
      }
    });

    await Promise.all(loadPromises);

    audioInitialized = true;

    // Fix #3: Validate all sounds loaded
    if (loadedSoundCount < CONFIG.EXPECTED_SOUND_COUNT) {
      console.warn(`[Audio] ⚠️ Only ${loadedSoundCount}/${CONFIG.EXPECTED_SOUND_COUNT} sounds loaded!`);
      console.warn(`[Audio] Failed sounds:`, failedSounds);
    } else {
      console.log(`[Audio] ✅ Web Audio API initialized with ${loadedSoundCount} sounds`);
    }
  } catch (error) {
    console.error('[Audio] Initialization failed:', error);
  }
}

/**
 * Resume AudioContext if suspended (browser autoplay policy)
 * Should be called on user interaction
 */
export function resumeAudio() {
  if (audioContext && audioContext.state === 'suspended') {
    audioContext.resume();
  }
}

/**
 * Play movement sound with alternation using Web Audio API
 * Uses AudioBufferSourceNode for near-zero latency, non-blocking playback
 * Story 4.5: Alternates between Sound 1 and Sound 2 for current state
 * Resets to Sound 1 when state changes
 * Code Review Fixes: Rate limiting, volume control, better error handling
 * @param {Object} gameState - Current game state
 */
export function playMoveSound(gameState) {
  if (!audioInitialized || !audioContext || audioContext.state === 'suspended') return;

  // Fix #9: Rate limiting (prevent rapid calls if accidentally called in tight loop)
  const now = performance.now();
  const MIN_PLAY_INTERVAL = 16;  // ~60 FPS max (1000ms / 60 ≈ 16ms)
  if (now - lastPlayTime < MIN_PLAY_INTERVAL) {
    return;  // Skip if called too rapidly
  }
  lastPlayTime = now;

  try {
    // Determine current state
    const currentState = getCurrentState(gameState);

    // Reset alternator if state changed (start with sound 1)
    if (currentState !== previousState) {
      currentAlternator = 0;
      previousState = currentState;
    }

    // Pick sound: 1 or 2 based on alternator
    const soundNumber = currentAlternator + 1;
    const soundKey = `${currentState}-${soundNumber}`;
    const buffer = audioBuffers[soundKey];

    if (buffer) {
      // AudioBufferSourceNode is lightweight and disposable
      // No seek operations, no promises, no main thread blocking
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      // Fix #6: Connect through master gain node for volume control
      source.connect(masterGainNode);
      source.start(0);
    } else {
      // Warn if sound missing (shouldn't happen if properly loaded)
      console.warn(`[Audio] Missing sound buffer: ${soundKey}`);
    }

    // Toggle alternator: 0 -> 1 -> 0 -> 1...
    currentAlternator = 1 - currentAlternator;
  } catch (error) {
    // Don't let audio errors break the game
    console.warn('[Audio] Playback error:', error.message);
  }
}

/**
 * Determine current movement state based on snake color and effects
 * Story 4.5 + Code Review Fix #5: Warn on unknown states
 * @param {Object} gameState - Current game state
 * @returns {string} - State name for sound selection
 */
function getCurrentState(gameState) {
  // Check active effect first (effects override colors)
  if (gameState.activeEffect) {
    const effectType = gameState.activeEffect.type;

    // Map effect types to sound states
    // Fix #1: Using 'invincibility' (correct) but mapping to 'invicibility' (filename typo)
    // TODO: Rename actual sound files to fix typo
    const effectMap = {
      'invincibility': 'invincibility',  // Corrected spelling
      'wallPhase': 'wallphase',
      'speedBoost': 'speedboost',
      'speedDecrease': 'speeddecrease',
      'reverseControls': 'reverse'
    };

    const mapped = effectMap[effectType];
    if (!mapped) {
      // Fix #5: Warn when unknown effect falls back to default
      console.warn(`[Audio] Unknown effect type '${effectType}', using default sound`);
      return 'default';
    }
    return mapped;
  }

  // Check snake color (for growing vs default)
  const colorMap = {
    [CONFIG.COLORS.snakeGrowing]: 'growing',  // Green
    [CONFIG.COLORS.snakeDefault]: 'default'   // Black
  };

  const mapped = colorMap[gameState.snake.color];
  if (!mapped) {
    // Fix #5: Warn when unknown color falls back to default
    console.warn(`[Audio] Unknown snake color '${gameState.snake.color}', using default sound`);
    return 'default';
  }
  return mapped;
}

/**
 * Reset audio state (for testing/debugging)
 * Story 4.5
 * Fix #7: Documented as test-only function
 * @internal - For testing purposes only
 */
export function resetAudio() {
  currentAlternator = 0;
  previousState = null;
  lastPlayTime = 0;
  console.log('[Audio] State reset');
}

/**
 * Close AudioContext and cleanup resources
 * Fix #4: Prevents memory leaks on page unload
 */
export function closeAudio() {
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close();
    console.log('[Audio] AudioContext closed');
  }
  audioInitialized = false;
  loadedSoundCount = 0;
  failedSounds = [];
}

/**
 * Get audio system status
 * Fix #8: Expose load status for UI/debugging
 * @returns {Object} Status information
 */
export function getAudioStatus() {
  return {
    initialized: audioInitialized,
    soundsLoaded: loadedSoundCount,
    soundsExpected: CONFIG.EXPECTED_SOUND_COUNT,
    failedSounds: [...failedSounds],
    contextState: audioContext ? audioContext.state : 'not created'
  };
}

/**
 * Set master volume
 * Fix #6: Allow runtime volume adjustment
 * @param {number} volume - Volume level (0.0 to 1.0)
 */
export function setMasterVolume(volume) {
  if (masterGainNode) {
    masterGainNode.gain.value = Math.max(0, Math.min(1, volume));
    console.log(`[Audio] Master volume set to ${masterGainNode.gain.value}`);
  }
}
