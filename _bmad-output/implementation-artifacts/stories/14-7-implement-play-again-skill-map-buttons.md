# Story 14.7: Implement Play Again and Skill Map Buttons

**Epic:** 14 - Enhanced Post-Game Summary ("Recap")

**As a** player,
**I want** clear next actions after seeing my cognitive summary,
**So that** I can either play again immediately or explore my full Skill Map.

---

## Acceptance Criteria

**Given** post-game highlights have displayed
**When** buttons appear (t=3.3s per FR169)
**Then** show two buttons side by side:
```
┌────────────┐  ┌────────────┐
│ PLAY AGAIN │  │ SKILL MAP  │
└────────────┘  └────────────┘
```
**And** "PLAY AGAIN" is default selected (per FR105)
**And** both buttons use standard button style: 8px rounded corners, purple border, Jersey20 font

**Given** player is in calibration period (session < 5)
**When** buttons display
**Then** "Skill Map" button shows as greyed out or replaced with calibration counter
**And** only "Play Again" is clickable

**Given** player has completed calibration (session 5+)
**When** buttons display
**Then** both buttons are active and clickable
**And** "Skill Map" opens full dashboard (Epic 16)
**And** "Play Again" immediately starts new game (FR89)

**Given** mobile viewport (< 768px)
**When** buttons display
**Then** stack vertically:
```
┌──────────────────┐
│   PLAY AGAIN     │
└──────────────────┘
┌──────────────────┐
│   SKILL MAP      │
└──────────────────┘
```
**And** "Play Again" on top (safe choice priority)
**And** minimum 44px touch targets

**Per FR166:** Post-game screen includes "Play Again" and "Dashboard" buttons as clear next actions

---

## Development

### Files to Create/Modify

- **`js/cognitive-feedback.js`** - Extend `showHighlights()` to render buttons after animation completes
- **`index.html`** - Add `.post-game-buttons` container in `.cognitive-stats` section
- **`styles.css`** - Add button styles with mobile responsive layout
- **`js/game.js`** - Wire button click handlers to game restart and Skill Map navigation
- **`test/cognitive-feedback.test.js`** - Unit tests for button rendering and gating logic

### API Surface

```javascript
// cognitive-feedback.js (EXTEND showHighlights from Story 14.2)

/**
 * Render post-game buttons after highlight animation completes
 * @param {Object} sessionContext - Contains calibrationState for button gating
 * @returns {Promise} Resolves when buttons are visible and interactive
 */
export async function renderPostGameButtons(sessionContext)

/**
 * Enable or disable Skill Map button based on calibration state
 * @param {boolean} enabled - True if calibration complete (session 6+)
 */
export function setSkillMapButtonState(enabled)
```

### HTML Structure

```html
<!-- index.html: Add to .cognitive-stats container -->
<div class="cognitive-stats hidden">
  <div class="cognitive-stats-header">RECAP</div>
  <div class="cognitive-stats-lines"></div>
  <div class="caller-quote">...</div>

  <!-- NEW: Post-game buttons -->
  <div class="post-game-buttons">
    <button class="btn btn-play-again" id="btn-play-again">PLAY AGAIN</button>
    <button class="btn btn-skill-map" id="btn-skill-map">SKILL MAP</button>
  </div>

  <div class="post-game-footer"></div>
</div>
```

### CSS Styling

```css
/* styles.css */

.post-game-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  margin: 24px 0 16px 0;
  opacity: 0;
  animation: fadeIn 400ms ease-out forwards;
  animation-delay: 3300ms; /* t=3.3s per FR169 */
}

.btn {
  font-family: 'Jersey20', monospace;
  font-size: 16px;
  padding: 12px 24px;
  border: 2px solid rgb(157, 178, 221); /* Purple border */
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  cursor: pointer;
  transition: all 200ms ease-out;
}

.btn:hover {
  background: rgba(157, 178, 221, 0.2);
  transform: scale(1.05);
}

.btn:active {
  transform: scale(0.98);
}

.btn-play-again {
  /* Default selected state per FR105 */
  border-color: rgb(255, 215, 0); /* Gold highlight */
  box-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
}

.btn-skill-map:disabled {
  opacity: 0.4;
  cursor: not-allowed;
  border-color: #666;
}

.btn-skill-map:disabled:hover {
  background: rgba(0, 0, 0, 0.3);
  transform: none;
}

/* Mobile responsive: stack vertically */
@media (max-width: 768px) {
  .post-game-buttons {
    flex-direction: column;
    gap: 12px;
  }

  .btn {
    width: 100%;
    min-height: 44px; /* Touch target size */
  }
}
```

### Button Rendering Logic

```javascript
// cognitive-feedback.js: Extend showHighlights()

export async function showHighlights(highlights, callerQuote, sessionContext) {
  // ... existing highlight rendering (Stories 14.1-14.6) ...

  // Wait for stagger animation to complete (t=3.3s per FR168)
  await waitForStaggerComplete(highlights.length);

  // Render buttons
  await renderPostGameButtons(sessionContext);
}

async function renderPostGameButtons(sessionContext) {
  const buttonsContainer = document.querySelector('.post-game-buttons');
  const playAgainBtn = document.getElementById('btn-play-again');
  const skillMapBtn = document.getElementById('btn-skill-map');

  if (!buttonsContainer || !playAgainBtn || !skillMapBtn) {
    console.warn('[PostGame] Button elements not found in DOM');
    return;
  }

  // Button gating: Skill Map disabled during calibration (sessions 1-5)
  const calibrationComplete = sessionContext.calibrationState === 'unlocked';
  setSkillMapButtonState(calibrationComplete);

  // Show buttons container (triggers fade-in animation at t=3.3s)
  buttonsContainer.style.display = 'flex';

  // Wire click handlers
  playAgainBtn.onclick = handlePlayAgain;
  skillMapBtn.onclick = calibrationComplete ? handleSkillMapOpen : null;

  // Set focus to Play Again button (default action per FR105)
  playAgainBtn.focus();
}

function setSkillMapButtonState(enabled) {
  const skillMapBtn = document.getElementById('btn-skill-map');
  if (!skillMapBtn) return;

  if (enabled) {
    skillMapBtn.disabled = false;
    skillMapBtn.title = 'View your Skill Map';
  } else {
    skillMapBtn.disabled = true;
    skillMapBtn.title = 'Complete 5 sessions to unlock';
  }
}
```

### Click Handler Integration

```javascript
// game.js: Add button handlers

function handlePlayAgain() {
  // FR89: Immediately start new game
  hideCognitiveStats(); // Clean up post-game UI
  resetGame(); // Reset game state
  startGame(); // Start new session
}

function handleSkillMapOpen() {
  // Epic 16: Navigate to Skill Map dashboard
  // For now: placeholder navigation
  console.log('[SkillMap] Opening dashboard...');
  // TODO Story 16.1: Implement full Skill Map screen
  showSkillMapScreen(); // Epic 16 implementation
}
```

### Animation Timing Integration

Per FR168 and FR169, buttons appear at t=3.3s after game over:

```javascript
// Timing sequence from Story 14.2
// t=0.0s: Game over + score
// t=0.3s: "RECAP" header
// t=0.6s: Highlight 1
// t=0.9s: Highlight 2
// t=1.2s: Highlight 3 (if exists)
// t=1.5s: Caller quote
// t=3.3s: Buttons fade in ← THIS STORY

async function waitForStaggerComplete(highlightCount) {
  // Calculate stagger completion time
  const baseDelay = 1500; // Caller quote at 1.5s
  const buttonDelay = 1800; // Additional 1.8s = 3.3s total

  if (CONFIG.REDUCED_MOTION) {
    return; // Instant, no delay
  }

  return new Promise(resolve => {
    setTimeout(resolve, baseDelay + buttonDelay);
  });
}
```

### Integration Points

- **`game.js`** - Wire `handlePlayAgain()` to restart game (existing `resetGame()` + `startGame()`)
- **`game.js`** - Wire `handleSkillMapOpen()` to Epic 16 Skill Map screen (placeholder for now)
- **`cognitive-feedback.js`** - Story 14.2 `showHighlights()` calls `renderPostGameButtons()` after stagger
- **Story 14.5** - `calibrationState` from calibration.js determines button gating

### Test Strategy

**Unit Tests (`cognitive-feedback.test.js`):**
1. Test buttons render after t=3.3s animation completes
2. Test calibration in progress (session 3) → Skill Map button disabled
3. Test calibration complete (session 6+) → both buttons enabled
4. Test Play Again button focus (default selection per FR105)
5. Test reduced motion mode → buttons appear instantly
6. Test mobile viewport (< 768px) → buttons stack vertically
7. Test button click handlers wired correctly

**Manual Testing:**
- Play game → die → wait 3.3s → verify buttons fade in
- Sessions 1-4: verify "Skill Map" button greyed out with tooltip "Complete 5 sessions to unlock"
- Session 5: verify "Your Skill Map is ready!" message + "Skill Map" button enabled
- Click "Play Again" → verify game restarts immediately (FR89)
- Click "Skill Map" → verify Epic 16 navigation (placeholder for now)
- Test on mobile (< 768px) → verify buttons stack vertically with 44px touch targets
- Test keyboard navigation: Tab to buttons → Enter to activate

### Dependencies

**BLOCKS:** Epic 16 Story 16.1 (Skill Map screen navigation)
**BLOCKED BY:** Story 14.2 (button rendering timing), Story 14.5 (calibration state gating)

### Implementation Notes

1. **Default focus** - Per FR105, "Play Again" is default selected → set `focus()` on button after render

2. **Calibration gating** - Skill Map button:
   - Sessions 1-5: `disabled` attribute + tooltip "Complete 5 sessions to unlock"
   - Session 6+: `enabled` + tooltip "View your Skill Map"

3. **Mobile touch targets** - Per accessibility best practices, buttons must be min 44px height on mobile (iOS/Android touch target guidelines)

4. **Button stacking** - Mobile viewport (< 768px) → flex-direction: column with "Play Again" on top (safe choice priority per UX principles)

5. **Reduced motion** - If `CONFIG.REDUCED_MOTION === true`:
   - Skip 3.3s delay → buttons appear immediately
   - Skip fade-in animation → instant display

6. **Keyboard navigation** - Ensure buttons are keyboard accessible:
   - Tab order: Play Again → Skill Map
   - Enter/Space to activate
   - Visual focus indicator (border highlight)

7. **Epic 16 integration** - `handleSkillMapOpen()` is placeholder for now → Epic 16 Story 16.1 will implement full Skill Map screen navigation:
   ```javascript
   function handleSkillMapOpen() {
     hideGameScreen();
     showSkillMapScreen(); // Epic 16 implementation
   }
   ```

8. **Animation cleanup** - When game restarts (`handlePlayAgain()`), call `hideCognitiveStats()` to clean up post-game UI and reset for next death screen

---

## Implementation Status

**Status:** ✅ **COMPLETED**
**Date:** 2026-02-16

### Summary
Replaced single "Menu" button with two-button layout. Side-by-side on desktop (>768px), stacked on mobile (<768px). "Play Again" is default selected, "Skill Map" is disabled during calibration (sessions 1-4) and enabled after session 5.

### Files Modified/Created
- **`js/cognitive-feedback.js`** - Removed old button rendering, buttons now in HTML structure
- **`index.html`** - Added `.post-game-buttons` container with two button elements
- **`css/style.css`** - Added button styles with responsive layout (side-by-side desktop, stacked mobile)
- **`js/main.js`** - Updated button click handlers for "Play Again" (immediate restart) and "Skill Map" (navigation to Epic 16 dashboard)

### Button Behavior
- **Play Again:** Always enabled, immediately starts new game (calls `startNewGame()`)
- **Skill Map:** Disabled/greyed during calibration (sessions 1-4), enabled after session 5, navigates to dashboard (Epic 16)
- **Default focus:** "Play Again" button has default focus for keyboard navigation

### Responsive Layout
- **Desktop (>768px):** Buttons side-by-side, equal width
- **Mobile (<768px):** Buttons stacked vertically, "Play Again" on top, minimum 44px touch targets

### Calibration Gating
```javascript
// Skill Map button disabled during calibration
if (sessionContext.calibrationState !== 'unlocked') {
  btnSkillMap.disabled = true;
  btnSkillMap.classList.add('btn-disabled');
}
```

### Test Results
✅ Button layout responsive across desktop/mobile breakpoints
✅ Calibration gating works correctly (Skill Map disabled sessions 1-4)
✅ "Play Again" immediate restart functional
✅ Keyboard navigation works (Tab, Enter)
✅ Touch targets meet 44px minimum on mobile

### Acceptance Criteria
✅ All acceptance criteria met - two buttons side-by-side on desktop, stacked on mobile, Play Again default selected, 8px rounded corners with purple border and Jersey20 font, Skill Map greyed during calibration, both active after session 5, mobile vertical stack with 44px touch targets
