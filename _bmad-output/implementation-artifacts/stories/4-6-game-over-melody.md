# Story 4.6: Game Over Melody

**Epic:** 4 - Audio & Complete Experience
**Story ID:** 4.6
**Status:** ready-for-dev
**Created:** 2026-01-27

---

## Story

**As a** player,
**I want** to hear a retro melody when I die,
**So that** the game over moment feels complete and memorable.

## Acceptance Criteria

[All existing criteria from epics.md]

## Tasks / Subtasks

- [ ] Source/create game over melody sound file (MP3 format)
  - [ ] 8-bit style melody
  - [ ] 2-4 seconds duration
  - [ ] "Game over" feel (not too sad, slightly playful)
  - [ ] Matches retro arcade aesthetic
  - [ ] Format: MP3, 44.1kHz, 16-bit, mono
- [ ] Add playGameOverSound() to audio.js
  - [ ] Load and decode game-over.mp3 into AudioBuffer at init
  - [ ] Play via AudioBufferSourceNode
  - [ ] Stop any currently playing sounds
- [ ] Integrate into game over sequence
  - [ ] Call playGameOverSound() when snake dies
  - [ ] Stop melody on Play Again or Menu click
- [ ] Balance volume levels
  - [ ] Game over melody balanced with movement sounds
  - [ ] No clipping or distortion
- [ ] Test rapid restarts
  - [ ] Melody doesn't overlap with new game
  - [ ] Fresh playback on each game over
  - [ ] No audio glitches

---

## Developer Context

### 🎯 STORY OBJECTIVE

Implement **Game Over Melody** to complete audio experience.

**CRITICAL SUCCESS FACTORS:**
- 8-bit style melody (2-4 seconds)
- Plays on every death
- Stops when restarting or returning to menu
- No audio overlap or glitches
- Volume balanced with movement sounds

**FILES TO MODIFY:**
- js/audio.js (add game-over AudioBuffer, playGameOverSound, stopAllSounds)
- assets/sounds/game-over.mp3 (NEW sound file)
- js/game.js (call on game over)

### 📁 FILE STRUCTURE

**IMPORTANT:** audio.js uses Web Audio API (AudioContext + AudioBufferSourceNode).
Do NOT use HTML5 Audio (`new Audio()`). See Story 4.5 architect review for rationale.

**js/audio.js - Game Over Sound (Web Audio API):**

```javascript
// Add to existing initAudio() - fetch and decode game-over.mp3
export async function initAudio() {
  // ... existing 14 movement sound initialization ...

  // Game over melody
  try {
    const response = await fetch('assets/sounds/game-over.mp3');
    const arrayBuffer = await response.arrayBuffer();
    audioBuffers['game-over'] = await audioContext.decodeAudioData(arrayBuffer);
  } catch (err) {
    console.warn('[Audio] Failed to load game-over:', err.message);
  }
}

// Track active game-over source for stopping
let gameOverSource = null;

export function playGameOverSound() {
  if (!audioInitialized || !audioContext || audioContext.state === 'suspended') return;

  stopAllSounds();  // Stop any active sounds

  const buffer = audioBuffers['game-over'];
  if (buffer) {
    gameOverSource = audioContext.createBufferSource();
    gameOverSource.buffer = buffer;
    gameOverSource.connect(audioContext.destination);
    gameOverSource.start(0);
    gameOverSource.onended = () => { gameOverSource = null; };
  }

  console.log('[Audio] Game over melody playing');
}

export function stopAllSounds() {
  if (!audioInitialized) return;

  // Stop game-over melody if playing
  if (gameOverSource) {
    try { gameOverSource.stop(); } catch (e) { /* already stopped */ }
    gameOverSource = null;
  }
}
```

**js/game.js - Play on Death:**

```javascript
import { playGameOverSound, stopAllSounds } from './audio.js';

// When game over detected:
if (checkWallCollision(gameState) || checkSelfCollision(gameState)) {
  gameState.phase = 'gameover';
  playGameOverSound();  // Story 4.6
}

// On new game start:
stopAllSounds();  // Stop game-over melody
```

### 🧪 TESTING

1. Die in game - melody plays
2. Click Play Again - melody stops, new game starts
3. Die again - fresh melody playback
4. Click Menu - melody stops
5. Volume balanced with movement sounds
6. No clipping or distortion
7. No overlapping audio glitches

---

## Dev Agent Record

### Files

- js/audio.js (game over sound via Web Audio API -- AudioBuffer + AudioBufferSourceNode)
- assets/sounds/game-over.mp3 (NEW)
- js/game.js (play on death)

