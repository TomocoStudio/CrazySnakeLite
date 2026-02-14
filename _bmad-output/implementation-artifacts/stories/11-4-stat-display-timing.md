# Story 11.4: Implement Stat Display Timing and Play Again Delay

**Epic:** 11 - Cognitive Feedback & RC Recognition
**Story ID:** 11.4
**Status:** ✅ review
**Created:** 2026-02-08
**Completed:** 2026-02-14

---

## Story

**As a** player,
**I want** cognitive stats to appear briefly before the Play Again button,
**So that** I have time to absorb my achievements.

## Acceptance Criteria

**Given** I die
**When** the death animation completes
**Then** the following sequence occurs:
1. Game Over text + score appears immediately
2. 300ms delay
3. "Your Brain Today" header fades in
4. First stat line fades in
5. 300ms delay
6. Second stat line fades in (if exists)
7. 300ms delay
8. Third stat line fades in (if exists)
9. Stats hold visible for 2.5 seconds
10. Stats fade out (500ms)
11. Play Again button appears

**Given** the cognitive stats are visible
**When** 2.5 seconds elapse
**Then** the stats fade out smoothly (500ms fade)
**And** the Play Again button appears after the fade completes

**Given** the total delay before Play Again
**When** calculating time
**Then** the delay is approximately 3.3 seconds:
- 300ms initial delay
- 900ms stagger (3 lines × 300ms, worst case)
- 2500ms hold
- 500ms fade out
- Total ≈ 4200ms, but Play Again appears after fade starts (~3700ms)

**Given** only 1 stat qualifies for display
**When** the stats render
**Then** only 1 line appears (no padding with empty lines)
**And** the Play Again button still waits for the full sequence

## Tasks / Subtasks

- [ ] Implement setTimeout chain in cognitive-feedback.js
  - [ ] showCognitiveStats() triggers stagger animation
  - [ ] Calculate total display time based on stat count
  - [ ] Hold stats visible for 2.5s
  - [ ] Fade out stats after hold (500ms)
  - [ ] Show Play Again button after fade completes
- [ ] Update showCognitiveStats() to return promise or callback
  - [ ] Notify game.js when stats sequence completes
  - [ ] game.js shows Play Again button after notification
- [ ] Add hideCognitiveStats() in cognitive-feedback.js
  - [ ] Apply fade-out animation
  - [ ] Remove .cognitive-stats visibility after fade
- [ ] Test timing with 1 stat
  - [ ] Verify sequence: 300ms delay + 300ms stagger + 2500ms hold + 500ms fade = ~3600ms
- [ ] Test timing with 3 stats
  - [ ] Verify sequence: 300ms delay + 900ms stagger + 2500ms hold + 500ms fade = ~4200ms
- [ ] Test Play Again button appears at correct time
  - [ ] After stats fade completes (not during fade)

---

## Developer Context

### 🎯 STORY OBJECTIVE

Orchestrate the death screen timing to give players time to absorb cognitive achievements before seeing the Play Again button. The staggered appearance (300ms intervals) feels premium and draws attention to each achievement. The 2.5s hold gives time to read and reflect. The 500ms fade-out provides smooth transition to the Play Again button.

**CRITICAL SUCCESS FACTORS:**
- Stats stagger in at 300ms intervals (not instant)
- Stats hold visible for 2.5s (readable duration)
- Stats fade out smoothly (500ms)
- Play Again button appears AFTER fade completes (not during)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/cognitive-feedback.js` — Add timing orchestration, hideCognitiveStats()
- `js/game.js` — Show Play Again button after stats complete

**Module Boundaries:**
- `cognitive-feedback.js` owns stats display timing
- `game.js` owns death screen orchestration

**Data Flow:**
```
1. Player dies
2. game.js: show game over screen immediately
3. game.js: setTimeout(300ms) → showCognitiveStats()
4. cognitive-feedback.js: stagger stat lines (300ms each)
5. cognitive-feedback.js: hold 2500ms
6. cognitive-feedback.js: fadeOut stats (500ms)
7. cognitive-feedback.js: callback to game.js when complete
8. game.js: show Play Again button
```

---

### 📦 CONFIG.JS UPDATES (already added in Story 11.3)

```javascript
export const CONFIG = {
  // ... existing config ...

  COGNITIVE_STATS_DISPLAY: {
    maxStats: 3,
    staggerDelay: 300,        // 300ms between stat lines
    holdDuration: 2500,       // Hold visible for 2.5s
    fadeDuration: 500,        // Fade out over 500ms
    initialDelay: 300         // Delay before header appears
  }
};
```

---

### 🎨 IMPLEMENTATION DETAILS

**1. cognitive-feedback.js — Add timing orchestration:**

```javascript
import { CONFIG } from './config.js';

/**
 * Show cognitive stats with timed sequence.
 * @param {object} gameState - Game state
 * @returns {Promise} Resolves when stats sequence completes
 */
export function showCognitiveStats(gameState) {
  return new Promise((resolve) => {
    const container = document.querySelector('.cognitive-stats');
    const linesContainer = document.querySelector('.cognitive-stats-lines');

    // Clear previous lines
    linesContainer.innerHTML = '';

    // Select top stats
    const topStats = selectTopStats(gameState.cognitiveStats);

    // If no stats, hide container and resolve immediately
    if (topStats.length === 0) {
      container.classList.add('hidden');
      resolve();
      return;
    }

    // Show container
    container.classList.remove('hidden');

    // Create stat line elements with stagger
    topStats.forEach((stat, index) => {
      const line = document.createElement('div');
      line.className = 'cognitive-stat-line';
      line.textContent = formatStatLine(stat.key, stat.value);

      // Apply stagger delay
      line.style.animationDelay = `${index * CONFIG.COGNITIVE_STATS_DISPLAY.staggerDelay}ms`;

      linesContainer.appendChild(line);
    });

    // Calculate total time
    const staggerTime = topStats.length * CONFIG.COGNITIVE_STATS_DISPLAY.staggerDelay;
    const totalDisplayTime = staggerTime + CONFIG.COGNITIVE_STATS_DISPLAY.holdDuration;

    // Hold visible, then fade out
    setTimeout(() => {
      hideCognitiveStats();

      // Resolve after fade completes
      setTimeout(() => {
        resolve();
      }, CONFIG.COGNITIVE_STATS_DISPLAY.fadeDuration);
    }, totalDisplayTime);
  });
}

/**
 * Hide cognitive stats with fade-out animation.
 */
export function hideCognitiveStats() {
  const container = document.querySelector('.cognitive-stats');
  const header = document.querySelector('.cognitive-stats-header');
  const lines = document.querySelectorAll('.cognitive-stat-line');

  // Apply fade-out class
  header.classList.add('fade-out');
  lines.forEach(line => line.classList.add('fade-out'));

  // Hide container after fade completes
  setTimeout(() => {
    container.classList.add('hidden');
  }, CONFIG.COGNITIVE_STATS_DISPLAY.fadeDuration);
}
```

**2. game.js — Show Play Again button after stats complete:**

```javascript
import { showCognitiveStats } from './cognitive-feedback.js';

async function onDeath(gameState) {
  // ... existing death logic ...

  // Show game over screen immediately
  showGameOverScreen(gameState);

  // Show cognitive stats (with initial delay)
  setTimeout(async () => {
    await showCognitiveStats(gameState);

    // Show Play Again button after stats complete
    showPlayAgainButton();
  }, CONFIG.COGNITIVE_STATS_DISPLAY.initialDelay);
}

function showPlayAgainButton() {
  const btn = document.getElementById('play-again-btn');
  btn.classList.remove('hidden');
}
```

**3. style.css — Add fade-out animation:**

```css
/* Fade-out animation (for hideCognitiveStats) */
.fade-out {
  animation: fadeOut 500ms ease-out forwards !important;
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }
  to {
    opacity: 0;
    transform: translateY(-10px);
  }
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Full Sequence with 3 Stats:**
   - Achieve 3 stats, die
   - Observe sequence timing:
     - 0ms: Game Over + score appear
     - 300ms: "Your Brain Today" header fades in
     - 300ms: Stat 1 fades in
     - 600ms: Stat 2 fades in
     - 900ms: Stat 3 fades in
     - 3700ms (900 + 2500 + 300): Stats start fading out
     - 4200ms: Play Again button appears

2. **Sequence with 1 Stat:**
   - Achieve 1 stat, die
   - Observe sequence timing:
     - 0ms: Game Over + score appear
     - 300ms: Header fades in
     - 300ms: Stat 1 fades in
     - 3100ms (300 + 2500 + 300): Stats start fading out
     - 3600ms: Play Again button appears

3. **Stats Hold for 2.5s:**
   - Die with 2 stats
   - Start timer when last stat appears
   - Verify stats remain visible for ~2.5 seconds
   - Verify fade-out starts after 2.5s

4. **Smooth Fade-Out:**
   - Observe stats fade-out
   - Verify 500ms smooth fade (not instant disappearance)
   - Verify both header and stat lines fade together

5. **Play Again Button Appears After Fade:**
   - Watch entire sequence
   - Verify Play Again button does NOT appear during fade
   - Verify Play Again button appears AFTER fade completes

6. **No Stats (All Zeros):**
   - Die with no achievements
   - Verify Play Again button appears immediately (no delay)
   - Verify no stats displayed

**Edge Cases:**
- Player clicks during stats display (button not clickable yet)
- Very fast death (sequence still plays correctly)
- Browser tab loses focus during sequence (timers still work)

---

### 📚 CRITICAL DATA FORMATS

**Timing calculation:**
```javascript
const staggerTime = statCount * 300;           // E.g., 3 stats = 900ms
const totalTime = staggerTime + 2500;          // Hold duration
const fadeOutStart = totalTime;                // When to start fade
const playAgainTime = totalTime + 500;         // After fade completes
```

**Promise resolution:**
```javascript
await showCognitiveStats(gameState);  // CORRECT (waits for sequence)
showCognitiveStats(gameState);        // WRONG (doesn't wait, button appears early)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/game-ux-principles.md` — Timing and pacing for emotional impact
- `_bmad-output/planning-artifacts/prd.md` — FR79 (stat display timing)

**Key Design Principles:**
- **Give time to absorb:** 2.5s hold allows reading and reflection
- **Premium feel:** Staggered appearance (300ms) feels polished
- **Smooth transitions:** 500ms fade-out prevents jarring disappearance
- **Delayed action:** Play Again waits for achievements to be seen first

---

### 📋 FRs COVERED

FR79 (Stat display timing and Play Again delay)

**Detailed FR Mapping:**
- FR79: Stats hold 2.5s, fade out, then Play Again appears → setTimeout orchestration

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] showCognitiveStats() returns Promise
- [ ] Promise resolves when stats sequence completes
- [ ] setTimeout chain implemented (stagger + hold + fade)
- [ ] Total time calculated based on stat count
- [ ] Stats hold visible for 2.5s (holdDuration)
- [ ] hideCognitiveStats() implemented
- [ ] Fade-out animation applied (500ms)
- [ ] .fade-out CSS class added
- [ ] game.js awaits showCognitiveStats() before showing Play Again
- [ ] Play Again button appears AFTER fade completes
- [ ] Initial delay (300ms) before header appears
- [ ] Timing tested with 1 stat (~3.6s total)
- [ ] Timing tested with 3 stats (~4.2s total)
- [ ] Smooth fade-out (not instant)
- [ ] No stats scenario (Play Again appears immediately)
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (click during display, browser focus loss)

**Common Mistakes to Avoid:**
- ❌ Play Again button appears during fade (should wait for completion)
- ❌ Not awaiting Promise (button appears too early)
- ❌ Instant disappearance instead of 500ms fade
- ❌ Fixed timing for all stat counts (should vary based on count)
- ❌ No delay before header appears (should have 300ms initial delay)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

- js/config.js:178 - Added initialDelay: 300 to COGNITIVE_STATS_DISPLAY
- js/cognitive-feedback.js:65-107 - showCognitiveStats() now returns Promise
- js/cognitive-feedback.js:78-82 - Timing calculation based on stat count
- js/cognitive-feedback.js:84-95 - setTimeout chain: hold → fade → resolve
- js/cognitive-feedback.js:97-121 - hideCognitiveStats() with fade-out animation
- css/style.css:299-313 - fadeOutStats animation (500ms, translateY up)
- js/main.js:227-228 - Hide Play Again + Menu buttons initially on gameover
- js/main.js:250-256 - Async await showCognitiveStats(), then show buttons

### Completion Notes List

✅ **Implementation Complete (2026-02-14)**

**Timing Orchestration:**
- showCognitiveStats() converted to return Promise
- Promise resolves after complete sequence: stagger → hold → fade
- Timing calculated dynamically based on stat count:
  - staggerTime = statCount × 300ms
  - totalDisplayTime = staggerTime + 2500ms
  - Resolution after totalDisplayTime + 500ms fade

**Sequence Flow:**
1. Game over screen appears (0ms)
2. Initial delay (300ms) - CONFIG.COGNITIVE_STATS_DISPLAY.initialDelay
3. Stats stagger in (300ms intervals per stat)
4. Hold visible (2500ms) - CONFIG.COGNITIVE_STATS_DISPLAY.holdDuration
5. Fade out (500ms) - CONFIG.COGNITIVE_STATS_DISPLAY.fadeDuration
6. Promise resolves
7. Play Again + Menu buttons appear

**Total Time Examples:**
- 0 stats: 0ms (Play Again shows immediately)
- 1 stat: ~3600ms (300 + 300 + 2500 + 500)
- 3 stats: ~4200ms (300 + 900 + 2500 + 500)

**hideCognitiveStats():**
- Applies .fade-out class to header + all stat lines
- CSS animation: 500ms opacity + translateY(-10px)
- Cleanup: removes fade-out classes after animation

**Button Hiding:**
- Play Again + Menu buttons hidden initially (line 227-228)
- Shown AFTER stats sequence completes (line 254-255)
- Prevents premature clicking during stat display

**Async/Await:**
- main.js setTimeout callback made async
- Awaits showCognitiveStats() Promise
- Ensures buttons appear only after fade-out completes

### File List

- js/cognitive-feedback.js (modified - Promise return, timing orchestration, hideCognitiveStats)
- js/main.js (modified - async/await stats, hide/show buttons with correct timing)
- css/style.css (modified - fadeOutStats animation)
- js/config.js (modified - added initialDelay to COGNITIVE_STATS_DISPLAY)
