// CrazySnakeLite - Audio System Module (Story 4.5)
// Web Audio API implementation for precise, non-blocking sound playback

import { CONFIG } from './config.js';

let audioContext = null;
let masterGainNode = null;  // For volume control
const audioBuffers = {};
let audioInitialized = false;
let loadedSoundCount = 0;  // Track successful loads
let failedSounds = [];  // Track failed sound loads
let deathSoundLoaded = false;  // Track death sound separately
let menuMusicLoaded = false;  // Track menu music load
let menuMusicSource = null;  // Track current menu music source for stopping

// Track alternation state
let currentAlternator = 0;  // 0 or 1 (plays sound 1 or 2)
let previousState = null;   // Track state changes for reset
let lastPlayTime = 0;  // For rate limiting

/**
 * Initialize audio system using Web Audio API
 * Fetches and pre-decodes all 14 MP3 files (V3 versions) into AudioBuffers
 * Story 4.5 + Code Review Fixes + V3 Sound Upgrade
 */
export async function initAudio() {
  // Check if audio is already initialized AND context is usable
  if (audioInitialized && audioContext && audioContext.state !== 'closed') {
    console.log('[Audio] Already initialized, skipping');
    return;
  }

  // Reset flag if context was closed
  if (audioContext && audioContext.state === 'closed') {
    console.log('[Audio] Context was closed, reinitializing...');
    audioInitialized = false;
  }

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
        // All sounds now use V3 versions
        const url = `${CONFIG.SOUNDS_PATH}move-${state}-${num}-V3.mp3`;

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

    // Load death sound (V3)
    const deathPromise = fetch(`${CONFIG.SOUNDS_PATH}SnakeDie01-V3.mp3`)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        audioBuffers['death'] = audioBuffer;
        deathSoundLoaded = true;
        console.log('[Audio] Death sound V3 loaded');
      })
      .catch(err => {
        console.warn('[Audio] Failed to load death sound:', err.message);
      });

    // Load menu music (V3)
    const menuMusicPromise = fetch(`${CONFIG.SOUNDS_PATH}StartSequence-V3.mp3`)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        audioBuffers['menuMusic'] = audioBuffer;
        menuMusicLoaded = true;
        console.log('[Audio] Menu music V3 loaded');
      })
      .catch(err => {
        console.warn('[Audio] Failed to load menu music:', err.message);
      });

    // Wait for all sounds including death and menu music
    loadPromises.push(deathPromise, menuMusicPromise);
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
export async function resumeAudio() {
  if (audioContext && audioContext.state === 'suspended') {
    await audioContext.resume();
    console.log('[Audio] AudioContext resumed');
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
  stopMenuMusic();  // Stop menu music if playing
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
 * Check if audio is ready to play
 * @returns {boolean}
 */
export function isAudioReady() {
  return audioInitialized && audioContext && audioContext.state !== 'suspended';
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

/**
 * Play death sound when snake dies
 * Bug fix: Missing acoustic feedback on death
 */
export function playDeathSound() {
  if (!audioInitialized || !audioContext || audioContext.state === 'suspended') return;
  if (!deathSoundLoaded) {
    console.warn('[Audio] Death sound not loaded');
    return;
  }

  try {
    const buffer = audioBuffers['death'];
    if (buffer) {
      const source = audioContext.createBufferSource();
      source.buffer = buffer;
      source.connect(masterGainNode);
      source.start(0);
      console.log('[Audio] Death sound played');
    }
  } catch (error) {
    console.warn('[Audio] Death sound playback error:', error.message);
  }
}

/**
 * Play menu music in loop mode
 * Plays when menu screen is displayed
 */
export function playMenuMusic() {
  console.log('[Audio] playMenuMusic called');
  console.log('[Audio] audioInitialized:', audioInitialized);
  console.log('[Audio] audioContext:', audioContext);
  console.log('[Audio] audioContext.state:', audioContext?.state);
  console.log('[Audio] menuMusicLoaded:', menuMusicLoaded);

  if (!audioInitialized || !audioContext || audioContext.state === 'suspended') {
    console.warn('[Audio] Cannot play menu music - audio not ready');
    return;
  }
  if (!menuMusicLoaded) {
    console.warn('[Audio] Menu music not loaded');
    return;
  }

  // Stop existing music if already playing
  stopMenuMusic();

  try {
    const buffer = audioBuffers['menuMusic'];
    console.log('[Audio] Menu music buffer:', buffer);
    if (buffer) {
      menuMusicSource = audioContext.createBufferSource();
      menuMusicSource.buffer = buffer;
      menuMusicSource.loop = true;  // Enable looping
      menuMusicSource.connect(masterGainNode);
      menuMusicSource.start(0);
      console.log('[Audio] Menu music started (looping)');
    } else {
      console.warn('[Audio] Menu music buffer is null');
    }
  } catch (error) {
    console.error('[Audio] Menu music playback error:', error);
  }
}

/**
 * Stop menu music
 * Called when leaving menu screen
 */
export function stopMenuMusic() {
  if (menuMusicSource) {
    try {
      menuMusicSource.stop();
      menuMusicSource.disconnect();
      menuMusicSource = null;
      console.log('[Audio] Menu music stopped');
    } catch (error) {
      // Ignore errors if already stopped
      menuMusicSource = null;
    }
  }
}

/**
 * Play jackpot fanfare for high-value combos (15-29 points)
 * Story 10.4: 600ms triumphant ascending chord
 * TODO: Implement audio synthesis or load sound file
 */
export function playJackpot() {
  console.log('🎉 [Audio] JACKPOT! 600ms fanfare (15-29 points)');
  // TODO: AudioContext synthesis or HTMLAudioElement playback
  // Could use Web Audio API oscillators to create ascending chord:
  // - 440 Hz (A4) → 523 Hz (C5) → 659 Hz (E5) over 600ms
}

/**
 * Play legendary fanfare for massive combos (30+ points)
 * Story 10.4: 800ms extended triumphant chord with harmonic richness
 * TODO: Implement audio synthesis or load sound file
 */
export function playLegendary() {
  console.log('🏆 [Audio] LEGENDARY! 800ms extended fanfare (30+ points)');
  // TODO: AudioContext synthesis or HTMLAudioElement playback
  // Could use Web Audio API oscillators to create rich harmonic chord:
  // - Multiple frequencies for harmonic richness
  // - Extended duration (800ms) for more dramatic effect
}

/**
 * Play combo exit deflation audio (300ms descending tone)
 * Story 10.5: Signals return to normal mode
 * TODO: Implement audio synthesis or load sound file
 */
export function playComboExit() {
  console.log('📉 [Audio] COMBO EXIT: 300ms deflation (descending tone)');
  // TODO: AudioContext synthesis — descending tone from high to low frequency
  // Could use Web Audio API oscillator:
  // - Start at 800Hz, exponentially decay to 200Hz over 300ms
  // - Fade out volume for "deflation" feel
}
