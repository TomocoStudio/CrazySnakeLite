# Story 14.2: Create Post-Game Highlights UI

**Epic:** 14 - Enhanced Post-Game Summary ("Recap")

**As a** player,
**I want** to see my cognitive highlights in a clear, celebratory format,
**So that** I immediately understand what my brain accomplished.

---

## Acceptance Criteria

**Given** highlights are selected
**When** game-over screen renders
**Then** display structure:
```
┌─────────────────────────────────────┐
│        GAME OVER                    │
│        Score: 67                    │
│     High Score: 78                  │
│                                     │
│  ─── RECAP ───                      │
│                                     │
│  🎯 Reaction Time: NEW PERSONAL BEST!│
│  ⬆ Spatial Awareness up 15%        │
│  🔥 Survived 3 Reverse Controls      │
│                                     │
│  "Your prefrontal cortex just       │
│   bench-pressed a truck."           │
│                   — Kernel Sanders  │
│                                     │
│  ┌────────────┐  ┌────────────┐    │
│  │ PLAY AGAIN │  │ SKILL MAP  │    │
│  └────────────┘  └────────────┘    │
│                                     │
│  Session 4/5 — Warming up...        │
│  🔥 12-day streak                   │
└─────────────────────────────────────┘
```

**And** "RECAP" header uses rgb(157, 178, 221) purple theme (per FR165)
**And** highlights use Jersey20 font, 18-20px, white text
**And** icons use pixel-art style (16x16px)
**And** timing per FR168:
- t=0.0s: Game over + score appear
- t=0.3s: "RECAP" header fades in
- t=0.6s: Highlight 1 fades in (300ms stagger)
- t=0.9s: Highlight 2 fades in
- t=1.2s: Highlight 3 fades in (if 3 highlights)
- t=1.5s: Caller quote fades in
- t=3.3s: "Play Again" and "Skill Map" buttons appear

**And** no clinical metrics or numbers except achievements (per FR165 - simple language only)

**Per FR161:** Post-game screen displays 2-3 dynamic highlights selected from cognitive performance

---

## Development

### Files to Create/Modify

- **`js/cognitive-feedback.js`** - Replace `showCognitiveStats()` with `showHighlights()`
- **`styles.css`** - Update `.cognitive-stats` styles for "RECAP" header and highlight layout
- **`index.html`** - Update cognitive stats container structure for highlights display
- **`test/cognitive-feedback.test.js`** - Visual regression tests for highlight rendering

### API Surface

```javascript
// cognitive-feedback.js (REPLACE existing showCognitiveStats)

/**
 * Render highlights on game-over screen with staggered fade-in animation
 * @param {Array} highlights - Array of highlight objects from selectHighlights()
 * @param {Object} callerQuote - Quote object {text, caller, portrait} from Story 14.3
 * @param {Object} sessionContext - {calibrationState, streakDays} for footer display
 * @returns {Promise} Resolves when stagger animation completes (buttons can appear)
 */
export async function showHighlights(highlights, callerQuote, sessionContext)

/**
 * Hide highlights with fade-out animation (on game restart)
 */
export function hideHighlights()
```

### UI Layout Structure

```html
<!-- index.html: Update .cognitive-stats container -->
<div class="cognitive-stats hidden">
  <!-- RECAP header -->
  <div class="cognitive-stats-header">RECAP</div>

  <!-- Highlights container (2-3 lines) -->
  <div class="cognitive-stats-lines">
    <!-- Dynamically generated highlight lines with icons -->
  </div>

  <!-- Caller quote (Story 14.3) -->
  <div class="caller-quote">
    <div class="quote-text"></div>
    <div class="quote-attribution">
      <img class="caller-portrait" src="" alt="">
      <span class="caller-name"></span>
    </div>
  </div>

  <!-- Buttons (Story 14.7) -->
  <div class="post-game-buttons">
    <button class="btn-play-again">PLAY AGAIN</button>
    <button class="btn-skill-map">SKILL MAP</button>
  </div>

  <!-- Footer: Calibration or Streak (Stories 14.5, 14.6) -->
  <div class="post-game-footer"></div>
</div>
```

### CSS Styling Requirements

```css
/* styles.css additions/updates */

.cognitive-stats-header {
  color: rgb(157, 178, 221); /* Purple theme per FR165 */
  font-family: 'Jersey20', monospace;
  font-size: 20px;
  text-align: center;
  margin-bottom: 16px;
  /* Fade-in at t=0.3s */
}

.cognitive-stat-line {
  font-family: 'Jersey20', monospace;
  font-size: 18px;
  color: white;
  margin: 8px 0;
  /* Stagger fade-in: 300ms delay between lines */
  animation: fadeInUp 400ms ease-out forwards;
  opacity: 0;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Highlight icons (16x16px pixel-art style) */
.highlight-icon {
  display: inline-block;
  width: 16px;
  height: 16px;
  margin-right: 8px;
  vertical-align: middle;
}
```

### Animation Timing Sequence

Per FR168, implement strict timing sequence:

| Time    | Event                             |
|---------|-----------------------------------|
| t=0.0s  | Game over + score appear          |
| t=0.3s  | "RECAP" header fades in           |
| t=0.6s  | Highlight 1 fades in              |
| t=0.9s  | Highlight 2 fades in              |
| t=1.2s  | Highlight 3 fades in (if 3 exist) |
| t=1.5s  | Caller quote fades in (Story 14.3)|
| t=3.3s  | Buttons appear (Story 14.7)       |

**Implementation approach:**
- Use `setTimeout()` with cumulative delays for each element
- Apply `animation-delay` CSS property dynamically
- Return Promise that resolves at t=3.3s (after stagger completes)
- Respect `CONFIG.REDUCED_MOTION` flag (instant display, no stagger)

### Integration Points

- **`game.js`** - Call `showHighlights()` in `onDeath()` after `selectHighlights()` completes
- **`cognitive-feedback.js`** - Story 14.1 provides `highlights` array input
- **`cognitive-feedback.js`** - Story 14.3 provides `callerQuote` object input
- **`cognitive-feedback.js`** - Stories 14.5/14.6 provide `sessionContext` for footer

### Test Strategy

**Unit Tests (`cognitive-feedback.test.js`):**
1. Test `showHighlights([])` with empty array → container hidden
2. Test `showHighlights([h1])` with 1 highlight → single line rendered
3. Test `showHighlights([h1, h2, h3])` with 3 highlights → all 3 rendered
4. Test animation timing: verify delays at 0.3s, 0.6s, 0.9s, 1.2s
5. Test reduced motion mode: verify instant display, no stagger
6. Test icon rendering: verify 🎯, ⬆, 🔥, ↑ icons display correctly
7. Test Promise resolution: verify resolves at t=3.3s

**Manual Testing:**
- Play game → die → verify "RECAP" header appears at t=0.3s in purple
- Verify highlights stagger in 300ms apart with fade-in animation
- Verify caller quote appears at t=1.5s
- Verify buttons appear at t=3.3s
- Enable reduced motion (OS settings) → verify instant display
- Test on mobile (< 768px) → verify responsive layout

### Dependencies

**BLOCKS:** Story 14.7 (buttons need Promise resolution timing)
**BLOCKED BY:** Story 14.1 (needs highlight data structure)

### Implementation Notes

1. **Replace existing `showCognitiveStats()`** - Epic 11 implementation shows basic stat lines → replace with highlights-based approach (breaking change, but both serve game-over screen)

2. **Icon rendering** - Use Unicode emoji (🎯⬆🔥↑) inline in text, NOT separate image assets (simpler, retro aesthetic)

3. **No clinical language** - Per FR165, avoid technical metric names in display text:
   - ❌ "Reaction Time: 0.72" (raw score)
   - ✅ "Reaction Time: NEW PERSONAL BEST!" (achievement language)

4. **Stagger performance** - Use CSS `animation-delay` instead of JavaScript `setTimeout()` for smoother 60 FPS animation

5. **Caller quote placeholder** - Story 14.3 implements quote selection → for now, accept `callerQuote` parameter and render if present

6. **Footer placeholder** - Stories 14.5/14.6 implement calibration/streak display → render `.post-game-footer` dynamically based on `sessionContext.calibrationState` and `sessionContext.streakDays`

7. **Accessibility** - Add `aria-live="polite"` to `.cognitive-stats` container for screen reader announcements

8. **Reduced motion** - Detect via `CONFIG.REDUCED_MOTION` flag (already exists in config.js from Epic 11) → skip all animations, instant display
