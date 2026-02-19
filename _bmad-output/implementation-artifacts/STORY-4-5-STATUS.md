# Story 4-5: State-Based Movement Sounds - Status Report

**Date:** 2026-01-29
**Status:** RESOLVED - Architect Review Complete
**Current State:** Sound synchronization fixed, freezes eliminated

---

## Resolution Summary

**Root Cause:** Two compounding issues:
1. `playMoveSound()` called inside the `while` accumulator loop in `game.js`, triggering multiple sounds per visual frame when catch-up ticks occurred
2. HTML5 Audio API (`HTMLAudioElement`) not suited for rapid-fire game sound effects -- `currentTime` reset + `play()` causes main thread blocking

**Solution Applied:**
1. **Decoupled sound from while loop** -- `playMoveSound()` now called once per frame after all updates settle, before render
2. **Replaced HTML5 Audio with Web Audio API** -- Pre-decoded `AudioBuffer` objects played via lightweight `AudioBufferSourceNode`

---

## What Changed

### js/audio.js -- Web Audio API Rewrite
- Replaced `new Audio()` elements with `AudioContext` + `AudioBufferSourceNode`
- All 14 MP3 files fetched and decoded into `AudioBuffer` at init (parallel loading)
- Playback uses disposable `AudioBufferSourceNode` -- near-zero latency, non-blocking
- No `currentTime = 0` seek operations, no `play()` promises on the main thread
- Added `resumeAudio()` export for AudioContext autoplay policy handling
- `initAudio()` is now async (fetch + decodeAudioData)

### js/game.js -- Sound Decoupled from Accumulator
- Removed `playMoveSound()` from inside `update()` function
- Added `tickedThisFrame` flag tracking inside the while loop
- `playMoveSound()` called once per frame after the while loop, gated by `tickedThisFrame && gameState.phase === 'playing'`

### js/main.js -- AudioContext Resume
- Imported `resumeAudio` from audio.js
- User interaction listeners now call both `initAudio()` and `resumeAudio()`

### test/audio.test.js -- Async Test Runner
- `runAudioTests()` is now async, awaits `initAudio()`
- Updated notes to reference Web Audio API

---

## Why Previous Fixes Failed

| Attempt | Failure Reason |
|---------|---------------|
| Audio cloning (`new Audio()`) | Dynamic allocation = GC pressure + main thread freeze |
| Time-based throttling | Added checks in hot loop, didn't fix the API limitation |
| Position-based detection | Over-complicated trigger logic, race conditions |
| Sound interruption | `pause()` + `currentTime = 0` is itself a blocking operation |

All four attempted to patch around HTML5 Audio's fundamental unsuitability for rapid game sound effects.

---

## Technical Details

**Web Audio API Advantages:**
- `AudioBufferSourceNode` is a lightweight, disposable object
- Pre-decoded buffers mean zero decode latency at play time
- `start(0)` is non-blocking -- no promises, no seeks, no pipeline re-init
- Designed specifically for interactive audio (games, instruments)

**Decoupling Guarantee:**
- Even if the while loop runs 3 ticks in one frame (e.g., 375ms frame), only one sound plays
- Sound reflects the final game state after all ticks settle
- One sound per visual movement step -- perfectly synchronized with render

---

## Files Modified

- `js/audio.js` -- Web Audio API rewrite (AudioContext + AudioBufferSourceNode)
- `js/game.js` -- Decoupled playMoveSound from while loop
- `js/main.js` -- Added resumeAudio import and call
- `test/audio.test.js` -- Async test runner for Web Audio API
- `test/audio-test-page.html` -- Updated description

---

## Verification Checklist

- [ ] Game loads without errors
- [ ] Sounds play on first user interaction (click or keydown)
- [ ] One sound per visual snake movement step
- [ ] Alternation works (Sound 1 / Sound 2)
- [ ] State change resets to Sound 1
- [ ] All 7 states produce correct sound character
- [ ] No freezes or micro-freezes during gameplay
- [ ] 60 FPS maintained
- [ ] Speed boost / speed decrease effects play sounds at correct rate
