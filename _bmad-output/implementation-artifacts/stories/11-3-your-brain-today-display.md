# Story 11.3: Implement "Your Brain Today" Post-Game Display

**Epic:** 11 - Cognitive Feedback & RC Recognition
**Story ID:** 11.3
**Status:** ✅ review
**Created:** 2026-02-08
**Completed:** 2026-02-14

---

## Story

**As a** player,
**I want** to see what my brain accomplished after I die,
**So that** I feel proud of my cognitive achievements.

## Acceptance Criteria

**Given** I die
**When** the game over screen appears
**Then** the screen displays:
- "GAME OVER" text
- Final score
- High score
- "Your Brain Today" header (purple theme color, uppercase, 14px)
- 2-3 cognitive stat lines (see selection logic below)

**Given** the "Your Brain Today" section appears
**When** the stats render
**Then** the header appears first
**And** each stat line staggers in at 300ms intervals
**And** the stats use white text, 16px, with subtle shadow

**Given** cognitiveStats has multiple non-zero values
**When** selecting stats to display
**Then** the top 2-3 stats with highest values are shown
**And** zero-value stats are never displayed

**Given** cognitiveStats.rcSurvived = 4
**When** the stat is selected
**Then** the display text is: "Reverse Controls survived: 4"

**Given** cognitiveStats.phoneCallsManaged = 7
**When** the stat is selected
**Then** the display text is: "Phone calls managed: 7"

**Given** cognitiveStats.mysteryFoodsEaten = 12
**When** the stat is selected
**Then** the display text is: "Mystery foods decoded: 12"

**Given** cognitiveStats.comboMultipliers = 3
**When** the stat is selected
**Then** the display text is: "Combo multipliers earned: 3"

**Given** cognitiveStats.pickUpStreak = 5
**When** the stat is selected
**Then** the display text is: "Pick Up streak: 5"

**Given** cognitiveStats.peakComboScore = 24
**When** the stat is selected
**Then** the display text is: "Best combo: ×24"

## Tasks / Subtasks

- [ ] Add .cognitive-stats container to game over screen (HTML)
  - [ ] Below high score, above Play Again button
  - [ ] Initially hidden
- [ ] Add .cognitive-stats-header element
  - [ ] Text: "YOUR BRAIN TODAY"
  - [ ] Purple theme color, uppercase, 14px
- [ ] Implement selectTopStats(cognitiveStats) in cognitive-feedback.js
  - [ ] Filter out zero-value stats
  - [ ] Sort by value descending
  - [ ] Apply priority if tied: rcSurvived > comboMultipliers > pickUpStreak > mysteryFoodsEaten > phoneCallsManaged > peakComboScore
  - [ ] Return top 2-3 stats
- [ ] Implement formatStatLine(statKey, statValue) in cognitive-feedback.js
  - [ ] Map stat key to display text
  - [ ] Return formatted string
- [ ] Implement showCognitiveStats(gameState) in cognitive-feedback.js
  - [ ] Select top stats using selectTopStats()
  - [ ] Generate stat line DOM elements
  - [ ] Apply stagger animation (300ms intervals)
  - [ ] Display in .cognitive-stats container
- [ ] Add CSS for .cognitive-stats
  - [ ] Container styling (centered, spaced)
  - [ ] Header styling (purple, uppercase)
  - [ ] Stat line styling (white, 16px, shadow)
  - [ ] Stagger animation (nth-child delays)
- [ ] Call showCognitiveStats() on death
  - [ ] In game.js onDeath()
  - [ ] After game over text displays
- [ ] Test stat selection with various inputs
  - [ ] All stats non-zero: verify top 3 selected
  - [ ] Only 2 non-zero: verify 2 displayed
  - [ ] All zeros: verify no stats displayed (or fallback message)

---

## Developer Context

### 🎯 STORY OBJECTIVE

Display the top 2-3 cognitive achievements on the death screen to reframe death from failure into accomplishment recognition. This is the "brain gym" payoff — players see concrete evidence of cognitive work. Stat selection prioritizes most impressive achievements (highest values, then priority order if tied).

**CRITICAL SUCCESS FACTORS:**
- Only display non-zero stats (hide zeros)
- Select top 2-3 by value (highest first)
- Apply priority order if tied (rcSurvived > combos > pickUps > mystery > phone > peakCombo)
- Text formatting exact (e.g., "Mystery foods decoded" not "Mystery foods eaten")

---

### 🏗️ ARCHITECTURE COMPLIANCE

**New Modules:**
- `js/cognitive-feedback.js` — showCognitiveStats(), selectTopStats(), formatStatLine()

**Files to Modify:**
- `index.html` — Add .cognitive-stats container to game over screen
- `css/style.css` — Add cognitive stats styling
- `js/game.js` — Call showCognitiveStats() on death

**Module Boundaries:**
- `cognitive-feedback.js` owns stat display logic
- `game.js` owns death event (calls cognitive-feedback.js)
- `style.css` owns visual styling

**Data Flow:**
```
1. Player dies
2. game.js: onDeath() → call showCognitiveStats(gameState)
3. cognitive-feedback.js: selectTopStats(cognitiveStats) → top 2-3 stats
4. cognitive-feedback.js: for each stat: formatStatLine(key, value)
5. cognitive-feedback.js: create DOM elements
6. cognitive-feedback.js: apply stagger animation (300ms, 600ms, 900ms)
7. Stats visible for 2.5s (Story 11.4)
8. Fade out, Play Again button appears
```

---

### 📦 CONFIG.JS UPDATES

Add cognitive stat display config:

```javascript
export const CONFIG = {
  // ... existing config ...

  // Cognitive Feedback (v2 - Epic 11)
  COGNITIVE_STATS_DISPLAY: {
    maxStats: 3,              // Display top 3 stats
    staggerDelay: 300,        // 300ms between stat lines
    holdDuration: 2500,       // Hold visible for 2.5s
    fadeDuration: 500         // Fade out over 500ms
  },

  // Purple theme color for "Your Brain Today" header
  THEME_COLOR_PURPLE: '#9C27B0'
};
```

---

### 🎨 IMPLEMENTATION DETAILS

**1. index.html — Add cognitive stats container:**

```html
<div id="game-over-screen" class="hidden">
  <h1>GAME OVER</h1>
  <p>Score: <span id="final-score">0</span></p>
  <p>High Score: <span id="high-score">0</span></p>

  <!-- Cognitive Stats Container -->
  <div class="cognitive-stats hidden">
    <div class="cognitive-stats-header">YOUR BRAIN TODAY</div>
    <div class="cognitive-stats-lines">
      <!-- Stat lines injected dynamically -->
    </div>
  </div>

  <button id="play-again-btn" class="hidden">Play Again</button>
</div>
```

**2. cognitive-feedback.js — Implement selectTopStats():**

```javascript
import { CONFIG } from './config.js';

/**
 * Select top 2-3 cognitive stats to display.
 * @param {object} cognitiveStats - All cognitive stats
 * @returns {array} Array of {key, value} objects
 */
export function selectTopStats(cognitiveStats) {
  // Define priority order (for tie-breaking)
  const priority = {
    rcSurvived: 6,
    comboMultipliers: 5,
    pickUpStreak: 4,
    mysteryFoodsEaten: 3,
    phoneCallsManaged: 2,
    peakComboScore: 1
  };

  // Convert to array of {key, value, priority}
  const stats = Object.entries(cognitiveStats)
    .filter(([key, value]) => value > 0) // Filter out zeros
    .map(([key, value]) => ({
      key,
      value,
      priority: priority[key] || 0
    }));

  // Sort by value descending, then priority descending (for ties)
  stats.sort((a, b) => {
    if (b.value !== a.value) {
      return b.value - a.value; // Higher value first
    }
    return b.priority - a.priority; // Higher priority first if tied
  });

  // Return top 3 (or fewer if less than 3 non-zero stats)
  return stats.slice(0, CONFIG.COGNITIVE_STATS_DISPLAY.maxStats);
}

/**
 * Format stat key and value into display text.
 * @param {string} key - Stat key (e.g., 'rcSurvived')
 * @param {number} value - Stat value
 * @returns {string} Formatted text (e.g., "Reverse Controls survived: 4")
 */
export function formatStatLine(key, value) {
  const templates = {
    rcSurvived: `Reverse Controls survived: ${value}`,
    phoneCallsManaged: `Phone calls managed: ${value}`,
    mysteryFoodsEaten: `Mystery foods decoded: ${value}`,
    comboMultipliers: `Combo multipliers earned: ${value}`,
    pickUpStreak: `Pick Up streak: ${value}`,
    peakComboScore: `Best combo: ×${value}`
  };

  return templates[key] || `${key}: ${value}`;
}
```

**3. cognitive-feedback.js — Implement showCognitiveStats():**

```javascript
export function showCognitiveStats(gameState) {
  const container = document.querySelector('.cognitive-stats');
  const linesContainer = document.querySelector('.cognitive-stats-lines');

  // Clear previous lines
  linesContainer.innerHTML = '';

  // Select top stats
  const topStats = selectTopStats(gameState.cognitiveStats);

  // If no stats, hide container
  if (topStats.length === 0) {
    container.classList.add('hidden');
    return;
  }

  // Show container
  container.classList.remove('hidden');

  // Create stat line elements with stagger
  topStats.forEach((stat, index) => {
    const line = document.createElement('div');
    line.className = 'cognitive-stat-line';
    line.textContent = formatStatLine(stat.key, stat.value);

    // Apply stagger delay via data attribute (CSS will use this)
    line.style.animationDelay = `${index * CONFIG.COGNITIVE_STATS_DISPLAY.staggerDelay}ms`;

    linesContainer.appendChild(line);
  });
}
```

**4. game.js — Call showCognitiveStats() on death:**

```javascript
import { showCognitiveStats } from './cognitive-feedback.js';

function onDeath(gameState) {
  // ... existing death logic ...

  // Show game over screen
  showGameOverScreen(gameState);

  // Show cognitive stats (after brief delay)
  setTimeout(() => {
    showCognitiveStats(gameState);
  }, 300); // 300ms delay before stats appear
}
```

**5. style.css — Add cognitive stats styling:**

```css
/* Cognitive Stats Container */
.cognitive-stats {
  margin: 20px auto;
  text-align: center;
  max-width: 400px;
}

.cognitive-stats-header {
  font-family: 'Jersey20', sans-serif;
  font-size: 14px;
  color: #9C27B0; /* Purple theme */
  text-transform: uppercase;
  letter-spacing: 2px;
  margin-bottom: 12px;
  opacity: 0;
  animation: fadeIn 300ms ease-out forwards;
}

.cognitive-stats-lines {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.cognitive-stat-line {
  font-family: 'Jersey20', sans-serif;
  font-size: 16px;
  color: white;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
  opacity: 0;

  /* Stagger animation (delay set via inline style) */
  animation: fadeIn 300ms ease-out forwards;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Top 3 Stats Selected:**
   - Achieve: rcSurvived = 4, phoneCallsManaged = 7, mysteryFoodsEaten = 12, comboMultipliers = 3
   - Die
   - Verify displayed stats:
     - "Mystery foods decoded: 12" (highest)
     - "Phone calls managed: 7" (2nd highest)
     - "Reverse Controls survived: 4" (3rd highest)

2. **Priority Order on Ties:**
   - Achieve: rcSurvived = 5, comboMultipliers = 5, pickUpStreak = 5
   - Die
   - Verify displayed order (by priority):
     - "Reverse Controls survived: 5" (priority 6)
     - "Combo multipliers earned: 5" (priority 5)
     - "Pick Up streak: 5" (priority 4)

3. **Only 2 Non-Zero Stats:**
   - Achieve: rcSurvived = 2, phoneCallsManaged = 3 (all others = 0)
   - Die
   - Verify only 2 stats displayed (no empty 3rd line)

4. **All Stats Zero:**
   - Play short game, achieve nothing
   - Die
   - Verify .cognitive-stats container hidden (no stats displayed)

5. **Stat Text Formatting:**
   - Verify each stat displays exact text:
     - rcSurvived: "Reverse Controls survived: N"
     - phoneCallsManaged: "Phone calls managed: N"
     - mysteryFoodsEaten: "Mystery foods decoded: N"
     - comboMultipliers: "Combo multipliers earned: N"
     - pickUpStreak: "Pick Up streak: N"
     - peakComboScore: "Best combo: ×N"

6. **Stagger Animation:**
   - Die with 3 stats
   - Verify header appears first
   - Verify stat 1 appears 300ms later
   - Verify stat 2 appears 600ms after header (300ms after stat 1)
   - Verify stat 3 appears 900ms after header (300ms after stat 2)

**Edge Cases:**
- peakComboScore = 64 (very high value, should be top stat)
- pickUpStreak = 0 but other stats non-zero (pickUpStreak hidden)
- All stats tied at value 1 (priority order applied)

---

### 📚 CRITICAL DATA FORMATS

**Top stats array:**
```javascript
topStats = [
  { key: 'rcSurvived', value: 4, priority: 6 },
  { key: 'comboMultipliers', value: 3, priority: 5 },
  { key: 'pickUpStreak', value: 2, priority: 4 }
]
```

**Stat text formatting:**
```javascript
formatStatLine('rcSurvived', 4);          // "Reverse Controls survived: 4"
formatStatLine('peakComboScore', 24);     // "Best combo: ×24" (not "Best combo: 24")
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/game-ux-principles.md` — Metacognitive feedback, achievement framing
- `_bmad-output/planning-artifacts/prd.md` — FR75-FR78 (post-game cognitive feedback)

**Key Design Principles:**
- **Achievement framing:** Reframe death from failure to accomplishment
- **Selective display:** Show top achievements only (not overwhelming)
- **Clear hierarchy:** Highest values first, priority tie-breaking
- **Purple theme:** "Your Brain Today" header uses game's purple accent color

---

### 📋 FRs COVERED

FR75-FR78 (Post-game cognitive feedback display)

**Detailed FR Mapping:**
- FR75: Display "Your Brain Today" header → .cognitive-stats-header
- FR76: Display top 2-3 stats → selectTopStats() logic
- FR77: Filter zero-value stats → filter(value > 0)
- FR78: Stat text formatting → formatStatLine()

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] .cognitive-stats container added to game over screen HTML
- [ ] .cognitive-stats-header element with "YOUR BRAIN TODAY" text
- [ ] .cognitive-stats-lines container for dynamic stat lines
- [ ] selectTopStats() implemented in cognitive-feedback.js
- [ ] Zero-value stats filtered out
- [ ] Stats sorted by value descending
- [ ] Priority tie-breaking applied (rcSurvived > combos > pickUps > mystery > phone > peakCombo)
- [ ] Top 3 stats returned (or fewer if < 3 non-zero)
- [ ] formatStatLine() implemented with exact text templates
- [ ] showCognitiveStats() implemented
- [ ] Stat line DOM elements created dynamically
- [ ] Stagger animation applied (300ms intervals)
- [ ] game.js calls showCognitiveStats() on death
- [ ] CSS styling: purple header, white stat lines, shadows
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (all zeros, ties, peakCombo formatting)

**Common Mistakes to Avoid:**
- ❌ Displaying zero-value stats (should filter out)
- ❌ Not applying priority order on ties (random order instead)
- ❌ Wrong stat text (e.g., "Mystery foods eaten" instead of "Mystery foods decoded")
- ❌ "Best combo: 24" instead of "Best combo: ×24" (missing × symbol)
- ❌ All stats appear at once (no stagger animation)
- ❌ Hardcoding 3 stat lines (should be dynamic 0-3)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

- js/config.js:178-189 - COGNITIVE_STATS_DISPLAY and THEME_COLOR_PURPLE constants
- js/cognitive-feedback.js - New module created
- js/cognitive-feedback.js:14-41 - selectTopStats() with priority-based sorting
- js/cognitive-feedback.js:43-59 - formatStatLine() with exact text templates
- js/cognitive-feedback.js:61-107 - showCognitiveStats() with DOM manipulation
- index.html:40-47 - .cognitive-stats container added to gameover screen
- css/style.css:251-298 - Cognitive stats styling with fadeInStats animation
- js/main.js:12 - showCognitiveStats import added
- js/main.js:249-252 - showCognitiveStats() called on gameover with 300ms delay

### Completion Notes List

✅ **Implementation Complete (2026-02-14)**

**New Module Created:**
- `js/cognitive-feedback.js` - Complete stat selection, formatting, and display logic

**Core Functions:**
1. **selectTopStats(cognitiveStats)**
   - Filters out zero-value stats
   - Sorts by value descending
   - Priority tie-breaking: rcSurvived(6) > comboMultipliers(5) > pickUpStreak(4) > mysteryFoodsEaten(3) > phoneCallsManaged(2) > peakComboScore(1)
   - Returns top 3 stats (or fewer if < 3 non-zero)

2. **formatStatLine(key, value)**
   - Maps stat keys to exact display text
   - Special formatting for peakComboScore: "Best combo: ×N" (with × symbol)
   - Templates for all 6 stat types

3. **showCognitiveStats(gameState)**
   - Selects top stats
   - Hides container if all zeros
   - Creates DOM elements dynamically
   - Applies stagger animation (300ms intervals via inline style)

**HTML Changes:**
- Added `.cognitive-stats` container to gameover screen
- Contains header "YOUR BRAIN TODAY" and dynamic stats lines
- Initially hidden (shown/hidden by JS)

**CSS Changes:**
- Purple header (#9C27B0) with uppercase styling
- White stat lines (16px) with subtle shadow
- fadeInStats animation (300ms, translateY fade-up)
- Stagger delays set via inline style

**Integration:**
- Called from main.js gameover phase transition
- 300ms delay after gameover screen appears
- Runs after high score check/save

**Technical Decisions:**
- Used priority array for tie-breaking (explicit ordering)
- Console logging for debugging stat selection
- Graceful handling of missing DOM elements
- Inline animation delays for stagger (cleaner than nth-child)

### File List

- js/cognitive-feedback.js (new - stat display logic with selectTopStats, formatStatLine, showCognitiveStats)
- index.html (modified - add .cognitive-stats container to gameover screen)
- css/style.css (modified - add cognitive stats styling with purple header and fade animation)
- js/main.js (modified - import showCognitiveStats, call on gameover with 300ms delay)
- js/config.js (modified - add COGNITIVE_STATS_DISPLAY config and THEME_COLOR_PURPLE constant)
