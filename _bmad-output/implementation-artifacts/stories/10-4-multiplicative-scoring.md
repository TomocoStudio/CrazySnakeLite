# Story 10.4: Implement Multiplicative Scoring (A × B)

**Epic:** 10 - Combo Mode System
**Story ID:** 10.4
**Status:** 🔴 not started
**Created:** 2026-02-08

---

## Story

**As a** player,
**I want** the second food in combo mode to award A × B points,
**So that** I earn massive rewards for managing two simultaneous effects.

## Acceptance Criteria

**Given** combo mode is active with Effect A = Reverse Controls (+8)
**When** I eat Effect B = Speed Boost (+5)
**Then** I receive 8 × 5 = 40 points
**And** a large score popup displays "+40 COMBO"
**And** the popup uses the high-value style (dramatic animation)

**Given** combo mode is active with Effect A = Wall Phase (+3)
**When** I eat Effect B = Speed Decrease (+2)
**Then** I receive 3 × 2 = 6 points
**And** a score popup displays "+6 COMBO"

**Given** combo mode is active with Effect A = Growing (+1)
**When** I eat Effect B = Growing (+1)
**Then** I receive 1 × 1 = 1 point (lowest combo)

**Given** combo mode is active with Effect A = Invincibility (0)
**When** I eat Effect B = any food
**Then** I receive 0 × B = 0 points (wasted combo)
**And** the popup still appears: "+0 COMBO"

**Given** I eat a 15+ point combo
**When** the score is awarded
**Then** a special "jackpot" audio fanfare plays (600ms)

**Given** I eat a 30+ point combo
**When** the score is awarded
**Then** a "legendary" audio fanfare plays (800ms extended triumphant chord)

## Tasks / Subtasks

- [ ] Calculate combo score when effectB consumed
  - [ ] Score = combo.effectA.points × combo.effectB.points
  - [ ] Award score to gameState.score
- [ ] Spawn combo score popup
  - [ ] Format: "+{score} COMBO"
  - [ ] Use existing score popup system from Epic 7
  - [ ] Add .score-popup-combo CSS class
- [ ] Implement high-value popup styling
  - [ ] 15+ points: larger size, dramatic animation
  - [ ] 30+ points: even larger, more dramatic
- [ ] Add audio cues for high-value combos
  - [ ] 15-29 points: playJackpot() (600ms fanfare)
  - [ ] 30+ points: playLegendary() (800ms extended chord)
- [ ] Track combo score in analytics (Story 10.7)
  - [ ] Increment cognitiveStats.comboMultipliers
  - [ ] Update cognitiveStats.peakComboScore
  - [ ] Push score to analyticsState.comboScores array
- [ ] Test all score tiers
  - [ ] 1 point combo (1 × 1)
  - [ ] 6 point combo (3 × 2)
  - [ ] 15 point combo (3 × 5) — jackpot audio
  - [ ] 40 point combo (5 × 8) — legendary audio
  - [ ] 64 point combo (8 × 8) — legendary audio

---

## Developer Context

### 🎯 STORY OBJECTIVE

Implement multiplicative scoring for combo mode to create peak emotional moments and massive point rewards. A × B multiplication feels exponentially rewarding compared to simple addition. High-value combos (15+, 30+) trigger special audio cues to enhance the "jackpot" feeling. Invincibility (0 points) creates interesting strategic risk (wasted combo).

**CRITICAL SUCCESS FACTORS:**
- Multiplicative calculation: A × B (not A + B)
- Combo popup displays "COMBO" suffix
- Audio cues for 15+ and 30+ point combos
- Invincibility combos award 0 points (strategic penalty)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/game.js` — Calculate and award combo score when effectB consumed
- `js/score-popup.js` — Add spawnComboPopup() function
- `css/style.css` — Add .score-popup-combo class
- `js/audio.js` — Add playJackpot() and playLegendary() functions

**Module Boundaries:**
- `game.js` owns score calculation and awarding
- `score-popup.js` owns popup rendering
- `audio.js` owns audio playback
- `combo.js` owns combo state (effectA, effectB)

**Data Flow:**
```
1. Player eats second food during combo (effectB)
2. game.js: calculate score = effectA.points × effectB.points
3. game.js: award score to gameState.score
4. score-popup.js: spawnComboPopup(score, x, y)
5. If score >= 30: audio.playLegendary()
6. Else if score >= 15: audio.playJackpot()
7. Popup animates with "COMBO" label
```

---

### 📦 CONFIG.JS UPDATES

Add combo audio thresholds:

```javascript
export const CONFIG = {
  // ... existing config ...

  // Combo Audio Thresholds (v2 - Epic 10)
  COMBO_JACKPOT_THRESHOLD: 15,    // 15+ points triggers jackpot audio
  COMBO_LEGENDARY_THRESHOLD: 30   // 30+ points triggers legendary audio
};
```

---

### 🎨 IMPLEMENTATION DETAILS

**1. game.js — Calculate and award combo score:**

```javascript
import { spawnComboPopup } from './score-popup.js';
import { playJackpot, playLegendary } from './audio.js';

function handleComboFoodProgression(food, gameState) {
  if (gameState.combo.foodCount === 1) {
    // Second food → set Effect B
    gameState.combo.effectB = {
      type: food.type,
      points: getFoodPoints(food.type)
    };
    gameState.combo.foodCount = 2;

    // Calculate multiplicative score (A × B)
    const comboScore = gameState.combo.effectA.points * gameState.combo.effectB.points;

    // Award combo score
    gameState.score += comboScore;

    // Spawn combo popup
    const x = window.innerWidth / 2;
    const y = window.innerHeight / 2;
    spawnComboPopup(comboScore, x, y);

    // Play audio cues for high-value combos
    if (comboScore >= CONFIG.COMBO_LEGENDARY_THRESHOLD) {
      playLegendary();
    } else if (comboScore >= CONFIG.COMBO_JACKPOT_THRESHOLD) {
      playJackpot();
    }

    // Track combo stats (Story 10.7)
    gameState.cognitiveStats.comboMultipliers += 1;
    gameState.cognitiveStats.peakComboScore = Math.max(
      gameState.cognitiveStats.peakComboScore || 0,
      comboScore
    );
    gameState.analyticsState.comboScores.push(comboScore);

    console.log(`Combo score: ${comboScore} (${gameState.combo.effectA.points} × ${gameState.combo.effectB.points})`);
  } else if (gameState.combo.foodCount === 2) {
    // Third food → exit combo (Story 10.5)
    exitCombo(gameState);
  }
}
```

**2. score-popup.js — Add spawnComboPopup():**

```javascript
/**
 * Spawn a combo score popup (large "COMBO" label).
 * @param {number} score - Combo points awarded
 * @param {number} x - X position (canvas coordinates)
 * @param {number} y - Y position (canvas coordinates)
 */
export function spawnComboPopup(score, x, y) {
  const popup = {
    type: 'combo',
    text: `+${score} COMBO`,
    x,
    y,
    timestamp: Date.now(),
    score // For size scaling
  };

  // Add to queue (same as phone bonus popups)
  popupQueue.push(popup);
  processPopupQueue();
}

function renderPopup(popup) {
  const popupEl = document.createElement('div');

  // Apply class based on popup type
  if (popup.type === 'combo') {
    popupEl.className = 'score-popup score-popup-combo';

    // High-value combos get larger size
    if (popup.score >= 30) {
      popupEl.classList.add('legendary');
    } else if (popup.score >= 15) {
      popupEl.classList.add('jackpot');
    }
  } else if (popup.type === 'phone') {
    popupEl.className = 'score-popup score-popup-phone';
  } else {
    popupEl.className = 'score-popup';
  }

  popupEl.textContent = popup.text;

  // Position popup
  popupEl.style.left = `${popup.x}px`;
  popupEl.style.top = `${popup.y}px`;

  // Add to DOM
  document.body.appendChild(popupEl);

  // Remove after animation
  setTimeout(() => {
    if (popupEl.parentNode) {
      popupEl.parentNode.removeChild(popupEl);
    }
  }, 1000); // 1s for combo popups (longer than food popups)
}
```

**3. style.css — Add .score-popup-combo class:**

```css
/* Combo score popup */
.score-popup-combo {
  font-family: 'Jersey20', sans-serif;
  font-size: 28px; /* Larger than food popups */
  color: #FF00FF; /* Magenta/purple for combos */
  font-weight: bold;
  text-shadow: 0 0 15px rgba(255, 0, 255, 0.9);
  position: fixed;
  pointer-events: none;
  z-index: 1000;

  animation: comboPopupBounce 1000ms ease-out;
}

/* Jackpot (15+ points) */
.score-popup-combo.jackpot {
  font-size: 36px;
  text-shadow: 0 0 20px rgba(255, 215, 0, 1);
  color: #FFD700; /* Gold */
}

/* Legendary (30+ points) */
.score-popup-combo.legendary {
  font-size: 48px;
  text-shadow: 0 0 30px rgba(255, 0, 0, 1);
  color: #FF0000; /* Red */
}

@keyframes comboPopupBounce {
  0% {
    transform: translateY(0) scale(0.5);
    opacity: 0;
  }
  20% {
    transform: translateY(-40px) scale(1.5);
    opacity: 1;
  }
  40% {
    transform: translateY(-20px) scale(1.2);
  }
  60% {
    transform: translateY(-30px) scale(1.3);
  }
  100% {
    transform: translateY(-60px) scale(1);
    opacity: 0;
  }
}
```

**4. audio.js — Add jackpot and legendary audio:**

```javascript
/**
 * Play jackpot fanfare (15-29 point combos).
 * 600ms triumphant ascending chord.
 */
export function playJackpot() {
  if (!CONFIG.AUDIO_ENABLED) return;

  // Placeholder: implement audio synthesis or load sound file
  console.log('🎉 JACKPOT AUDIO: 600ms fanfare');
  // TODO: AudioContext synthesis or HTMLAudioElement playback
}

/**
 * Play legendary fanfare (30+ point combos).
 * 800ms extended triumphant chord with harmonic richness.
 */
export function playLegendary() {
  if (!CONFIG.AUDIO_ENABLED) return;

  console.log('🏆 LEGENDARY AUDIO: 800ms extended fanfare');
  // TODO: AudioContext synthesis or HTMLAudioElement playback
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Lowest Combo (1 × 1 = 1):**
   - Combo: Growing (+1) × Growing (+1)
   - Verify score increases by 1
   - Verify popup: "+1 COMBO"
   - Verify no special audio

2. **Mid-Tier Combo (3 × 2 = 6):**
   - Combo: Wall Phase (+3) × Speed Decrease (+2)
   - Verify score increases by 6
   - Verify popup: "+6 COMBO"
   - Verify no special audio (below 15 threshold)

3. **Jackpot Combo (5 × 3 = 15):**
   - Combo: Speed Boost (+5) × Wall Phase (+3)
   - Verify score increases by 15
   - Verify popup: "+15 COMBO" with jackpot styling (gold, larger)
   - Verify jackpot audio plays (600ms fanfare)

4. **Legendary Combo (8 × 5 = 40):**
   - Combo: Reverse Controls (+8) × Speed Boost (+5)
   - Verify score increases by 40
   - Verify popup: "+40 COMBO" with legendary styling (red, largest)
   - Verify legendary audio plays (800ms extended fanfare)

5. **Highest Combo (8 × 8 = 64):**
   - Combo: Reverse Controls (+8) × Reverse Controls (+8)
   - Verify score increases by 64
   - Verify popup: "+64 COMBO" with legendary styling
   - Verify legendary audio plays

6. **Wasted Combo (0 × N = 0):**
   - Combo: Invincibility (0) × Speed Boost (+5)
   - Verify score increases by 0 (no points)
   - Verify popup: "+0 COMBO"
   - Verify no special audio

**Edge Cases:**
- Combo score exactly 15 (jackpot threshold) — jackpot audio plays
- Combo score exactly 30 (legendary threshold) — legendary audio plays
- Multiple combos in quick succession (audio does not overlap)

---

### 📚 CRITICAL DATA FORMATS

**Multiplicative calculation:**
```javascript
const score = effectA.points * effectB.points;  // CORRECT (multiplication)
const score = effectA.points + effectB.points;  // WRONG (addition, not combo)
```

**Audio threshold checks:**
```javascript
if (score >= 30) { playLegendary(); }       // CORRECT
else if (score >= 15) { playJackpot(); }    // CORRECT

if (score > 30) { playLegendary(); }        // WRONG (excludes 30)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/game-ux-principles.md` — Peak moments, emotional resonance
- `_bmad-output/planning-artifacts/prd.md` — FR44 (multiplicative combo scoring)

**Key Design Principles:**
- **Multiplicative feels exponential:** A × B creates much higher rewards than A + B
- **Peak emotional moments:** 30+ combos feel legendary and shareable
- **Strategic risk:** Invincibility wastes combo (0 × B = 0)
- **Audio reinforcement:** Sound cues enhance jackpot feeling

---

### 📋 FRs COVERED

FR44 (Multiplicative combo scoring A × B)

**Detailed FR Mapping:**
- FR44: Second food awards A × B points → handleComboFoodProgression() multiplication

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] Combo score calculated: effectA.points × effectB.points
- [ ] Combo score awarded to gameState.score
- [ ] spawnComboPopup(score, x, y) implemented
- [ ] Popup text format: "+{score} COMBO"
- [ ] .score-popup-combo CSS class added
- [ ] Jackpot styling (15-29 points): 36px, gold color
- [ ] Legendary styling (30+ points): 48px, red color
- [ ] playJackpot() audio function implemented
- [ ] playLegendary() audio function implemented
- [ ] Audio threshold checks: 30+ → legendary, 15-29 → jackpot
- [ ] Invincibility combos award 0 points (0 × B = 0)
- [ ] "+0 COMBO" popup appears for wasted combos
- [ ] cognitiveStats.comboMultipliers increments
- [ ] cognitiveStats.peakComboScore updates
- [ ] analyticsState.comboScores tracks all scores
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (exactly 15, exactly 30, multiple combos)

**Common Mistakes to Avoid:**
- ❌ Adding instead of multiplying (A + B instead of A × B)
- ❌ Jackpot audio for < 15 points (threshold not checked)
- ❌ Legendary audio for 15-29 points (should be jackpot)
- ❌ Not handling invincibility combos (0 × B = 0)
- ❌ Popup says "+N" instead of "+N COMBO"

---

## Dev Agent Record

### Agent Model Used

_To be filled by implementing agent_

### Debug Log References

_To be filled during implementation_

### Completion Notes List

_To be filled on completion_

### File List

- js/game.js (modified - calculate and award combo score)
- js/score-popup.js (modified - add spawnComboPopup)
- css/style.css (modified - add .score-popup-combo class)
- js/audio.js (modified - add playJackpot and playLegendary)
- js/config.js (modified - add COMBO_JACKPOT_THRESHOLD, COMBO_LEGENDARY_THRESHOLD)
