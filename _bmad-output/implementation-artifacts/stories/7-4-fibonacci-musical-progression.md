# Story 7.4: Implement Fibonacci Musical Progression Audio

**Epic:** 7 - Fibonacci Scoring & Visual Feedback System
**Story ID:** 7.4
**Status:** 🚫 blocked - waiting for MP3 files
**Created:** 2026-02-08

---

## Story

**As a** player,
**I want** each food type to play a distinct musical note,
**So that** I can recognize point values by sound alone.

## Acceptance Criteria

**Given** I eat any food
**When** the score is awarded
**Then** a sound file plays within 50ms:
- +1: `score-1.mp3` - soft beep
- +2: `score-2.mp3` - soft chime
- +3: `score-3.mp3` - mid chime
- +5: `score-5.mp3` - high chime
- +8: `score-8.mp3` - triumphant chord/sound

**Given** sound files are unavailable or audio fails to load
**When** the game initializes
**Then** the game plays normally without audio
**And** no errors appear in the console

**BLOCKED:** Waiting for 5 MP3 files to be provided:
- `assets/sounds/score-1.mp3`
- `assets/sounds/score-2.mp3`
- `assets/sounds/score-3.mp3`
- `assets/sounds/score-5.mp3`
- `assets/sounds/score-8.mp3`

## Tasks / Subtasks

**BLOCKED - Waiting for MP3 files**

Once MP3 files are provided (`assets/sounds/score-{1,2,3,5,8}.mp3`):

- [ ] Extend audio.js with score sound loading
  - [ ] Add score sound files to audioBuffers during initAudio()
  - [ ] Load 5 MP3 files: score-1, score-2, score-3, score-5, score-8
  - [ ] Track successful loads and failures
- [ ] Implement playScoreSound(value) function
  - [ ] Create AudioBufferSourceNode for the appropriate score sound
  - [ ] Connect through masterGainNode
  - [ ] Play non-blocking (similar to playMoveSound pattern)
- [ ] Implement graceful degradation
  - [ ] Fail silently if sound files unavailable
  - [ ] Log warning in console (development only)
  - [ ] Game continues without audio
- [ ] Integrate into game.js
  - [ ] Call playScoreSound(value) on food consumption
  - [ ] Call AFTER score is awarded (temporal contiguity)
  - [ ] Ensure audio doesn't block gameplay
- [ ] Test all 5 audio cues
- [ ] Verify audio plays within 50ms of score award
- [ ] Test graceful degradation (files missing/unavailable)

---

## Developer Context

### 🎯 STORY OBJECTIVE

Create a musical progression that mirrors the Fibonacci sequence, where each food type has a distinct pitch. Players should be able to recognize food values by sound alone after a few games. The +8 (Reverse Controls) plays a triumphant C major chord, reinforcing the celebration.

**CRITICAL SUCCESS FACTORS:**
- Each food value has a unique, recognizable sound
- Audio plays within 50ms of score award (temporal contiguity)
- C major chord for +8 sounds triumphant, not jarring
- Graceful degradation: game works perfectly without audio

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Modified Files:**
- `js/audio.js` — Add generateScoreTone(value), playScoreSound(value)
- `js/game.js` — Call playScoreSound() on food consumption

**Module Boundaries:**
- audio.js handles ALL audio generation and playback
- game.js calls audio.js functions, never manipulates Web Audio API directly
- audio.js must fail silently if Web Audio unavailable

**Data Flow:**
```
1. Player eats food (game.js)
2. Score awarded (gameState.score += value)
3. playScoreSound(value) called
4. audio.js generates tone with correct frequency/duration
5. Audio plays (non-blocking)
6. Game continues immediately
```

---

### 📦 AUDIO.JS IMPLEMENTATION (MP3-BASED)

```javascript
// js/audio.js

// During initAudio(), add score sounds to loading:
const scoreValues = [1, 2, 3, 5, 8];

scoreValues.forEach(value => {
  const key = `score-${value}`;
  const url = `${CONFIG.SOUNDS_PATH}score-${value}.mp3`;

  const promise = fetch(url)
    .then(response => response.arrayBuffer())
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
    .then(audioBuffer => {
      audioBuffers[key] = audioBuffer;
      loadedSoundCount++;
    })
    .catch(err => {
      failedSounds.push(key);
      console.warn(`[Audio] Failed to load ${key}:`, err.message);
    });

  loadPromises.push(promise);
});

/**
 * Play score audio for given value
 * Story 7.4: Fibonacci musical progression using MP3 files
 * @param {number} value - Score value (1, 2, 3, 5, 8)
 */
export function playScoreSound(value) {
  if (!audioInitialized || !audioContext || audioContext.state === 'suspended') {
    return; // Graceful degradation
  }

  const soundKey = `score-${value}`;
  const buffer = audioBuffers[soundKey];

  if (!buffer) {
    console.warn(`[Audio] Missing score sound: ${soundKey}`);
    return;
  }

  try {
    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(masterGainNode);
    source.start(0);
  } catch (error) {
    console.warn('[Audio] Score sound playback error:', error.message);
  }
}
```

**Required MP3 Files:**
- `assets/sounds/score-1.mp3` - Soft beep (C4 note or equivalent)
- `assets/sounds/score-2.mp3` - Soft chime (D4 note or equivalent)
- `assets/sounds/score-3.mp3` - Mid chime (E4 note or equivalent)
- `assets/sounds/score-5.mp3` - High chime (G4 note or equivalent)
- `assets/sounds/score-8.mp3` - Triumphant chord/celebration sound

---

### 🎮 GAME.JS INTEGRATION

```javascript
// In game.js onFoodEaten handler
import { playScoreSound } from './audio.js';

function onFoodEaten(food, gameState) {
  const baseScore = getFoodScore(food.type);
  gameState.score += baseScore;

  // Play score audio (non-blocking)
  playScoreSound(baseScore);

  // Spawn visual popup
  const pixelX = food.x * CONFIG.UNIT_SIZE;
  const pixelY = food.y * CONFIG.UNIT_SIZE;
  spawnPopup(baseScore, pixelX, pixelY);

  // Special effects for +8
  if (baseScore === 8) {
    spawnParticles(6, pixelX, pixelY);
    triggerScreenShake();
  }

  // Continue with game logic...
  applyFoodEffect(food.type, gameState);
  deactivatePreviousEffects(gameState.effects);
  spawnFood(gameState);
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **+1 Audio (Growing Food):**
   - Eat green food
   - Verify soft beep plays (C4, 261.63 Hz)
   - Duration: 100ms
   - Wave type: sine (smooth tone)

2. **+2 Audio (Speed Decrease Food):**
   - Eat cyan food
   - Verify soft chime plays (D4, 293.66 Hz)
   - Duration: 120ms
   - Wave type: sine

3. **+3 Audio (Wall Phase Food):**
   - Eat purple food
   - Verify mid chime plays (E4, 329.63 Hz)
   - Duration: 150ms
   - Wave type: triangle (slightly brighter tone)

4. **+5 Audio (Speed Boost Food):**
   - Eat red food
   - Verify high chime plays (G4, 392.00 Hz)
   - Duration: 180ms
   - Wave type: triangle

5. **+8 Audio (Reverse Controls Food):**
   - Eat orange food
   - Verify triumphant chord plays (C5-E5-G5)
   - Duration: 250ms
   - Should sound like C major chord (harmonious, celebratory)
   - Wave type: sine (3 simultaneous oscillators)

6. **Temporal Contiguity:**
   - Audio must play within 50ms of score award
   - Use DevTools Performance tab to verify timing
   - Audio should not block visual feedback

7. **Graceful Degradation:**
   - Open DevTools Console
   - Block Web Audio API (or test in browser without support)
   - Verify game plays normally
   - Verify no console errors
   - Verify visual feedback still works
   - Warning message should appear in console (development only)

8. **Rapid Consumption:**
   - Eat 10 foods rapidly
   - Verify audio doesn't clip or distort
   - Verify no audio overlap issues
   - Verify game remains responsive

**Audio Quality Validation:**
- Frequencies should be accurate (use frequency analyzer tool)
- Volume should be comfortable (0.3 gain)
- Envelope should be smooth (no pops or clicks)
- Chord should sound harmonious (not dissonant)

---

### 📚 CRITICAL DATA FORMATS

**Frequencies in Hz (number):**
```javascript
const frequency = 261.63;     // CORRECT
const frequency = "261.63";   // WRONG (string)
```

**Duration in milliseconds:**
```javascript
const duration = 100;          // CORRECT (100ms)
const duration = 0.1;          // WRONG (seconds)
```

**Wave types as strings:**
```javascript
const waveType = 'sine';       // CORRECT
const waveType = 0;            // WRONG
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/ux-design-specification.md` — Audio Feedback Specifications
- `_bmad-output/planning-artifacts/game-design-food-v2.md` — Fibonacci musical progression rationale
- `_bmad-output/planning-artifacts/game-ux-principles.md` — Multisensory encoding

**Key Audio Principles:**
- **Musical Progression:** C-D-E-G-C (pentatonic-like pattern)
- **Multisensory Encoding:** Audio + visual = stronger memory
- **Non-Blocking:** Audio must never delay gameplay

---

### 📋 FRs COVERED

FR81-FR84 (Fibonacci musical progression audio)

**Detailed FR Mapping:**
- FR81: +1 score: soft beep (C4, 261Hz, sine wave) → Implemented
- FR82: +2 score: soft chime (D4, 293Hz, sine wave) → Implemented
- FR83: +3 score: mid chime (E4, 329Hz, triangle wave) → Implemented
- FR84: +5 score: high chime (G4, 392Hz, triangle wave), +8 score: C major chord → Implemented

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] audio.js extended with score audio generation
- [ ] SCORE_AUDIO_CONFIG object defined with all 5 values
- [ ] playScoreSound(value) function implemented
- [ ] playTone() helper function implemented
- [ ] playChord() helper function implemented
- [ ] Web Audio Context initialized with try/catch
- [ ] Graceful degradation: game works without Web Audio
- [ ] Console warning logged if Web Audio unavailable (dev only)
- [ ] game.js calls playScoreSound() on food consumption
- [ ] Audio plays within 50ms of score award
- [ ] +1 plays C4 (261.63 Hz, sine, 100ms)
- [ ] +2 plays D4 (293.66 Hz, sine, 120ms)
- [ ] +3 plays E4 (329.63 Hz, triangle, 150ms)
- [ ] +5 plays G4 (392.00 Hz, triangle, 180ms)
- [ ] +8 plays C major chord (C5-E5-G5, sine, 250ms)
- [ ] Chord sounds harmonious (not dissonant)
- [ ] No audio clipping during rapid consumption
- [ ] No console errors when Web Audio unavailable
- [ ] Manual testing checklist completed
- [ ] Audio quality validated (frequency, envelope, volume)

**Common Mistakes to Avoid:**
- ❌ Blocking gameplay waiting for audio
- ❌ Crashing when Web Audio unavailable
- ❌ Audio clipping during rapid events
- ❌ Incorrect frequencies (verify with analyzer tool)

---

## Dev Agent Record

### Agent Model Used

_To be filled by implementing agent_

### Debug Log References

_To be filled during implementation_

### Completion Notes List

_To be filled on completion_

### File List

- js/audio.js (modified - add generateScoreTone(), playScoreSound(), playTone(), playChord())
- js/game.js (modified - call playScoreSound())
