# Story 18.3: Integrate Quotes into Post-Game Highlights

**Epic:** 18 - Dashboard Comedy Integration

**As a** player,
**I want** post-game highlights to include a funny caller quote,
**So that** cognitive feedback feels entertaining, not clinical.

---

## Acceptance Criteria

**Given** post-game highlights display 2-3 achievements
**When** rendering highlights UI (Epic 14)
**Then** append caller quote below highlights:
```
┌─────────────────────────────────────┐
│  🎯 Reaction Time: NEW PERSONAL BEST!│
│  ⬆ Spatial Awareness up 15%        │
│  🔥 Survived 3 Reverse Controls      │
│                                     │
│  "Your prefrontal cortex just       │
│   bench-pressed a truck."           │
│                   — Kernel Sanders  │
└─────────────────────────────────────┘
```
**And** quote text indented, italicized, 16px Jersey20
**And** caller portrait (32x32px) displayed with quote
**And** caller name right-aligned, 12px Jersey20

**Given** quote selection runs
**When** choosing from matching quotes
**Then** never repeat same quote in consecutive sessions
**And** track lastQuoteId in sessionStorage
**And** filter out lastQuoteId from selection pool

**Given** no context-specific quotes match
**When** fallback to general quotes
**Then** select from 'general' tag pool:
```
"Every session trains your brain. Keep going!"
                              — Array Jay
```

**Given** quote renders on post-game screen
**When** timing animation plays
**Then** quote fades in at t=1.5s (after highlights, per Epic 14 FR168)
**And** holds until player dismisses screen

**Per FR199, FR164:** Post-game highlights include tech pun caller quotes contextual to performance

---

## Development

### Files to Create/Modify

- **`js/cognitive-feedback.js`** - EXTEND - Add caller quote rendering to post-game highlights (Epic 14)
- **`css/style.css`** - EXTEND - Add quote styling (Jersey20 font, portrait display, retro aesthetic)
- **`test/cognitive-feedback.test.js`** - EXTEND - Add tests for quote rendering and deduplication

### API Surface

```javascript
// cognitive-feedback.js (EXTENDED from Epic 14)

// Enhanced renderPostGameHighlights() with quote integration
export function renderPostGameHighlights(highlights: Array<Object>, sessionData: Object): void
// Now includes: buildContext() → selectQuote() → render quote UI
```

### HTML Structure (Post-Game Overlay)

```html
<!-- Extend existing post-game highlights overlay -->
<div id="post-game-highlights" class="overlay">
  <div class="highlights-content">
    <h2>Session Recap</h2>

    <!-- Existing highlights (Epic 14) -->
    <div class="highlights-list">
      <div class="highlight-item">🎯 Reaction Time: NEW PERSONAL BEST!</div>
      <div class="highlight-item">⬆ Spatial Awareness up 15%</div>
      <div class="highlight-item">🔥 Survived 3 Reverse Controls</div>
    </div>

    <!-- NEW: Caller quote section -->
    <div class="caller-quote">
      <img class="quote-portrait" src="assets/pictures/01_AlGorithm.png" alt="Al Gorithm">
      <p class="quote-text">"Your prefrontal cortex just bench-pressed a truck."</p>
      <p class="quote-attribution">— Al Gorithm</p>
    </div>

    <!-- Existing buttons -->
    <div class="button-group">
      <button id="btn-play-again">PLAY AGAIN</button>
      <button id="btn-skill-map">SKILL MAP</button>
    </div>
  </div>
</div>
```

### CSS Styling

```css
/* css/style.css - Add quote styling */

.caller-quote {
  margin-top: 24px;
  padding-top: 16px;
  border-top: 2px solid rgba(157, 178, 221, 0.3); /* Purple accent */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  opacity: 0;  /* Start hidden for fade-in animation */
}

.caller-quote.visible {
  animation: fadeIn 0.5s ease-out 1.5s forwards; /* Fade in at t=1.5s */
}

.quote-portrait {
  width: 32px;
  height: 32px;
  image-rendering: pixelated;  /* Crisp pixel edges */
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

.quote-text {
  font-family: 'Jersey20', monospace;
  font-size: 16px;
  color: #ffffff;
  font-style: italic;
  text-align: center;
  margin: 0;
  padding: 0 16px;
  line-height: 1.4;
}

.quote-attribution {
  font-family: 'Jersey20', monospace;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.7);
  text-align: right;
  margin: 0;
  align-self: flex-end;
  padding-right: 16px;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
```

### Quote Rendering Logic

```javascript
// cognitive-feedback.js

import { buildContext, selectQuote } from './comedy.js';

export function renderPostGameHighlights(highlights, sessionData) {
  // 1. Render existing highlights (Epic 14 logic)
  const highlightsList = document.querySelector('.highlights-list');
  highlightsList.innerHTML = '';
  highlights.forEach(h => {
    const item = document.createElement('div');
    item.className = 'highlight-item';
    item.textContent = formatHighlight(h);
    highlightsList.appendChild(item);
  });

  // 2. Build context from session data
  const context = buildContext(sessionData);

  // 3. Get last quote ID to prevent repetition
  const lastQuoteId = sessionStorage.getItem('lastPostGameQuoteId');

  // 4. Select quote
  const quote = selectQuote(context, lastQuoteId);

  // 5. Store quote ID for next session
  sessionStorage.setItem('lastPostGameQuoteId', quote.id);

  // 6. Render quote UI
  const quoteSection = document.querySelector('.caller-quote');
  const portrait = quoteSection.querySelector('.quote-portrait');
  const text = quoteSection.querySelector('.quote-text');
  const attribution = quoteSection.querySelector('.quote-attribution');

  portrait.src = quote.portrait;
  portrait.alt = quote.callerName;
  text.textContent = `"${quote.text}"`;
  attribution.textContent = `— ${quote.callerName}`;

  // 7. Trigger fade-in animation at t=1.5s
  setTimeout(() => {
    quoteSection.classList.add('visible');
  }, 1500);
}
```

### Session Data Assembly

```javascript
// Assemble sessionData for renderPostGameHighlights()
// (Likely in game.js onDeath lifecycle)

const sessionData = {
  score: gameState.score,
  highlights: highlightsArray,  // From Epic 14 highlight selection
  cognitiveStats: {
    rcSurvived: gameState.analyticsState.rcSurvivedCount || 0
  },
  diedDuringRC: gameState.effects.activeEffects.some(e => e.type === 'reverseControls'),
  comboMultipliers: gameState.analyticsState.comboActivations || 0,
  phoneCallsManaged: gameState.analyticsState.totalPhoneCalls || 0,
  streak: await getStreak(),       // From storage.js
  sessionCount: await getSessionCount()  // From storage.js
};

renderPostGameHighlights(highlights, sessionData);
```

### Integration Points

- **`comedy.js`** - Import buildContext() and selectQuote()
- **`game.js`** - Assemble sessionData in onDeath lifecycle, pass to renderPostGameHighlights()
- **`storage.js`** - Provide getStreak() and getSessionCount()
- **`metrics.js`** - Provide cognitiveStats data
- **sessionStorage** - Track lastPostGameQuoteId to prevent consecutive repeats

### Test Strategy

**Unit Tests (`cognitive-feedback.test.js`):**
1. Test renderPostGameHighlights() calls buildContext() with correct sessionData
2. Test renderPostGameHighlights() calls selectQuote() with built context
3. Test lastQuoteId stored in sessionStorage after render
4. Test quote portrait src set to quote.portrait
5. Test quote text content includes quote.text
6. Test quote attribution includes caller name
7. Test fade-in animation triggered at t=1.5s

**Manual Testing:**
- Play session → verify quote appears after highlights (t=1.5s)
- Verify quote text is readable, italicized, 16px Jersey20
- Verify caller portrait is 32x32px, pixelated rendering
- Verify caller name right-aligned, 12px Jersey20
- Play 5 consecutive sessions → verify no quote repeats back-to-back
- Test high score (90+) → verify celebratory quote
- Test death during RC → verify empathetic quote
- Test calibration complete (session 5) → verify milestone quote

### Dependencies

**BEFORE this story:**
- Story 18.1 (CALLER_QUOTES database)
- Story 18.2 (buildContext + selectQuote functions)
- Epic 14 (post-game highlights overlay and rendering)

**AFTER this story:**
- Story 18.4 (Skill Map quote integration uses same pattern)

### Implementation Notes

1. **Animation timing** - Quote fades in at t=1.5s AFTER highlights (per Epic 14 FR168)
2. **Deduplication** - sessionStorage.lastPostGameQuoteId prevents same quote twice in a row
3. **Graceful degradation** - If quote selection fails → show generic fallback, don't crash
4. **Portrait error handling** - If portrait image 404s → hide img element, show text only
5. **Quote length** - CSS handles line wrapping, but quotes should be < 80 chars (validated in Story 18.1)
6. **Retro aesthetic** - Jersey20 font, pixelated portraits, purple accent borders (per Story 18.7)
7. **No auto-close** - Quote persists until user clicks PLAY AGAIN or SKILL MAP (per Epic 14)
