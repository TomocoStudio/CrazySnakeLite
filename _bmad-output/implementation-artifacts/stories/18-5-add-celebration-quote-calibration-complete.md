# Story 18.5: Add Celebration Quote for Calibration Complete

**Epic:** 18 - Dashboard Comedy Integration

**As a** player completing calibration,
**I want** a celebratory caller quote when my Skill Map unlocks,
**So that** the achievement feels recognized and fun.

---

## Acceptance Criteria

**Given** player completes session 5 (calibration complete)
**When** post-game celebration displays (Epic 15)
**Then** show calibration-complete quote:
```
Your Skill Map is ready! 🎉

"Five sessions complete! Your brain map just rendered. Check it out!"
                              — Git Committer

┌────────────┐  ┌────────────┐
│ PLAY AGAIN │  │ SKILL MAP  │ (pulsing)
└────────────┘  └────────────┘
```

**And** quote contextually matches celebration moment
**And** caller portrait (32x32px) displayed

**Given** calibration complete celebration shows
**When** selecting from calibration_complete quotes
**Then** prioritize quotes that:
- Congratulate on completion
- Reference brain map unlock
- Encourage clicking "Skill Map" button

**Examples:**
```
"Your brain map is ready. Spoiler: it looks impressive."
                              — Kernel Sanders

"Calibration complete. Time to see what your neurons have been up to."
                              — Lambda Calculus
```

**Per FR204:** Calibration complete message includes caller celebration quote

---

## Development

### Files to Create/Modify

- **`js/calibration.js`** - EXTEND - Add caller quote to calibration complete celebration (Epic 15)
- **`css/style.css`** - EXTEND - Add calibration celebration quote styling
- **`test/calibration.test.js`** - EXTEND - Add tests for quote rendering on session 5

### API Surface

```javascript
// calibration.js (EXTENDED from Epic 15)

// Enhanced renderCalibrationComplete() with celebration quote
export function renderCalibrationComplete(): void
// Now includes: selectQuote(['calibration_complete']) → render quote UI
```

### HTML Structure (Calibration Complete Overlay)

```html
<!-- Extend existing calibration complete celebration (Epic 15) -->
<div id="calibration-complete-overlay" class="overlay">
  <div class="calibration-content">
    <h2>Your Skill Map is ready! 🎉</h2>

    <!-- NEW: Celebration caller quote -->
    <div class="calibration-quote">
      <img class="quote-portrait" src="assets/pictures/17_BessieIOS.png" alt="Bessie IOS">
      <p class="quote-text">"Five sessions complete! Your brain map just rendered. Check it out!"</p>
      <p class="quote-attribution">— Git Committer</p>
    </div>

    <!-- Existing buttons with Skill Map pulsing (Epic 15) -->
    <div class="button-group">
      <button id="btn-play-again-calibration">PLAY AGAIN</button>
      <button id="btn-skill-map-calibration" class="pulsing">SKILL MAP</button>
    </div>
  </div>
</div>
```

### CSS Styling

```css
/* css/style.css - Calibration celebration quote styling */

.calibration-quote {
  margin: 24px auto;
  padding: 16px;
  max-width: 400px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 12px;  /* Slightly more rounded for celebration moment */
  border: 2px solid rgb(157, 178, 221);  /* Prominent purple border */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.calibration-quote .quote-portrait {
  width: 64px;  /* Larger portrait for celebration (not 32px) */
  height: 64px;
  image-rendering: pixelated;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
}

.calibration-quote .quote-text {
  font-family: 'Jersey20', monospace;
  font-size: 18px;  /* Larger text for celebration */
  color: #ffffff;
  font-style: italic;
  text-align: center;
  margin: 0;
  line-height: 1.4;
}

.calibration-quote .quote-attribution {
  font-family: 'Jersey20', monospace;
  font-size: 14px;
  color: rgb(157, 178, 221);  /* Purple for emphasis */
  text-align: center;
  margin: 0;
}

/* Pulsing animation for SKILL MAP button */
@keyframes pulse {
  0%, 100% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.05); opacity: 0.9; }
}

.pulsing {
  animation: pulse 1.5s ease-in-out infinite;
}
```

### Quote Rendering Logic

```javascript
// calibration.js

import { selectQuote } from './comedy.js';

export function renderCalibrationComplete() {
  // 1. Show calibration complete overlay
  const overlay = document.getElementById('calibration-complete-overlay');
  overlay.classList.add('visible');

  // 2. Select calibration-specific quote
  const quote = selectQuote(['calibration_complete']);

  // 3. Render quote UI
  const quoteSection = document.querySelector('.calibration-quote');
  if (quoteSection) {
    const portrait = quoteSection.querySelector('.quote-portrait');
    const text = quoteSection.querySelector('.quote-text');
    const attribution = quoteSection.querySelector('.quote-attribution');

    portrait.src = quote.portrait;
    portrait.alt = quote.callerName;
    text.textContent = `"${quote.text}"`;
    attribution.textContent = `— ${quote.callerName}`;
  }

  // 4. Add pulsing animation to SKILL MAP button
  const skillMapBtn = document.getElementById('btn-skill-map-calibration');
  if (skillMapBtn) {
    skillMapBtn.classList.add('pulsing');
  }

  // 5. Wire up button handlers
  document.getElementById('btn-play-again-calibration').addEventListener('click', () => {
    overlay.classList.remove('visible');
    startNewGame();
  });

  document.getElementById('btn-skill-map-calibration').addEventListener('click', () => {
    overlay.classList.remove('visible');
    renderSkillMap();  // From dashboard.js
  });
}
```

### Calibration-Complete Quote Examples

```javascript
// Add to CALLER_QUOTES in comedy.js (Story 18.1)

// Calibration-specific quotes (context: 'calibration_complete')
{
  callerId: 'git-committer',
  name: 'Git Committer',
  quotes: [
    {
      id: 'git-committer-calibration-1',
      text: "Five sessions complete! Your brain map just rendered. Check it out!",
      context: ['calibration_complete', 'celebration']
    }
  ]
},
{
  callerId: 'kernel-sanders',
  name: 'Kernel Sanders',
  quotes: [
    {
      id: 'kernel-sanders-calibration-1',
      text: "Your brain map is ready. Spoiler: it looks impressive.",
      context: ['calibration_complete', 'celebration']
    }
  ]
},
{
  callerId: 'lambda-calculus',
  name: 'Lambda Calculus',
  quotes: [
    {
      id: 'lambda-calculus-calibration-1',
      text: "Calibration complete. Time to see what your neurons have been up to.",
      context: ['calibration_complete', 'celebration']
    }
  ]
}
// Ensure 8-10 callers have calibration quotes for variety
```

### Triggering Calibration Complete

```javascript
// game.js onDeath lifecycle (Epic 15 integration)

async function onDeath() {
  // ... existing death logic ...

  const sessionCount = await getSessionCount();

  if (sessionCount === 5) {
    // Session 5: calibration complete
    renderCalibrationComplete();  // From calibration.js
  } else {
    // Normal post-game flow
    renderPostGameHighlights(highlights, sessionData);
  }
}
```

### Integration Points

- **`comedy.js`** - Import selectQuote(), use ['calibration_complete'] context
- **`game.js`** - Call renderCalibrationComplete() on session 5 completion
- **`storage.js`** - Provide getSessionCount() to determine when calibration complete
- **`dashboard.js`** - renderSkillMap() called when SKILL MAP button clicked
- **Epic 15** - Calibration state management determines when session 5 occurs

### Test Strategy

**Unit Tests (`calibration.test.js`):**
1. Test renderCalibrationComplete() calls selectQuote(['calibration_complete'])
2. Test quote portrait rendered at 64x64px (larger than post-game/Skill Map)
3. Test quote text rendered at 18px (larger than other contexts)
4. Test SKILL MAP button has 'pulsing' class applied
5. Test button handlers wired correctly (PLAY AGAIN → startNewGame, SKILL MAP → renderSkillMap)

**Manual Testing:**
- Play 5 sessions → verify calibration complete overlay appears
- Verify celebration quote contextually matches achievement
- Verify quote text encourages clicking SKILL MAP button
- Verify portrait is 64x64px with crisp pixel edges
- Verify SKILL MAP button pulses (animation)
- Click SKILL MAP → verify Skill Map screen opens
- Verify overlay closes after button click

### Dependencies

**BEFORE this story:**
- Story 18.1 (CALLER_QUOTES database with 'calibration_complete' quotes)
- Story 18.2 (selectQuote function)
- Epic 15 (calibration state management, session counting)
- Story 18.3 (post-game quote integration provides pattern reference)

**AFTER this story:**
- No blocking dependencies (optional celebration enhancement)

### Implementation Notes

1. **Larger visuals** - Portrait 64x64px, text 18px (celebration moment gets emphasis)
2. **No deduplication** - Calibration only happens once per player, no need to track lastQuoteId
3. **Direct context** - Use ['calibration_complete'] directly (no buildContext needed)
4. **Button emphasis** - SKILL MAP button pulses to encourage exploration
5. **Quote content focus** - All calibration quotes should:
   - Congratulate completion
   - Reference brain map/Skill Map unlock
   - Encourage player to click SKILL MAP button
6. **Fallback** - If no 'calibration_complete' quotes exist → selectQuote() falls back to 'general' + 'celebration'
7. **One-time event** - Session 5 is the ONLY trigger (sessionCount === 5, not >= 5)
8. **Visual hierarchy** - Purple border, larger portrait, centered layout emphasize importance
