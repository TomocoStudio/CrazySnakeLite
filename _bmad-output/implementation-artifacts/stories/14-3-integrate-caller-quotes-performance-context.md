# Story 14.3: Integrate Caller Quotes with Performance Context

**Epic:** 14 - Enhanced Post-Game Summary ("Recap")

**As a** player,
**I want** tech-pun callers to comment on my performance with humor,
**So that** cognitive feedback feels like CrazySnake, not Lumosity.

---

## Acceptance Criteria

**Given** highlights are displayed
**When** selecting a caller quote
**Then** match quote to performance context:

**High score session (score > 80):**
- "Your neurons are doing the Electric Slide. Keep it up!" — DJ Algorithm
- "Five sessions in and your prefrontal cortex is filing pull requests like a boss." — Git Committer

**Death during Reverse Controls:**
- "Orange food got you? That's executive function boot camp. You'll get it." — Kernel Sanders
- "Reverse Controls: where good snakes go to humble themselves." — Floppy Phil

**Streak milestone (7+ days, 30+ days):**
- "12 days straight? Your brain is now officially a gym rat." — Cache Money
- "That streak is hotter than a CPU at 95°C." — Ray Tracer

**First combo survived:**
- "First combo survived! Welcome to the big leagues." — Array Jay
- "Multiplicative scoring unlocked. Your working memory thanks you." — Lambda Calculus

**And** rotate caller portrait (32x32px) with quote
**And** caller name right-aligned in 14px Jersey20
**And** quote text indented, italicized, 16px
**And** quote selection uses performance-contextual mapping (per FR164, FR201)

**Per FR164:** Each highlight includes comedy caller quote contextual to performance (21 callers available, performance-based selection)

---

## Development

### Files to Create/Modify

- **`js/callers.js`** - NEW module with caller database and quote selection logic
- **`assets/portraits/`** - NEW directory with 21 caller portraits (32x32px pixel art)
- **`js/cognitive-feedback.js`** - Integrate `selectCallerQuote()` into `showHighlights()`
- **`test/callers.test.js`** - Unit tests for contextual quote selection

### API Surface

```javascript
// callers.js (NEW module)

/**
 * Select contextual caller quote based on session performance
 * @param {Object} sessionData - Session data from metrics.js
 * @param {Object} cognitiveStats - Raw event counts from gameState
 * @param {Array} highlights - Selected highlights from Story 14.1
 * @param {Object} sessionContext - {calibrationState, streakDays}
 * @returns {Object} {text, caller, portrait} quote object
 */
export function selectCallerQuote(sessionData, cognitiveStats, highlights, sessionContext)

/**
 * Get all available callers (for testing/debug)
 * @returns {Array} Array of all 21 caller objects
 */
export function getAllCallers()
```

### Caller Database Schema

```javascript
// callers.js internal structure

const CALLERS = [
  {
    name: "Kernel Sanders",
    portrait: "/assets/portraits/kernel-sanders.png",
    quotes: [
      {
        text: "Orange food got you? That's executive function boot camp. You'll get it.",
        context: "death_during_rc"
      },
      {
        text: "Your prefrontal cortex just bench-pressed a truck.",
        context: "high_score" // score > 80
      }
    ]
  },
  {
    name: "DJ Algorithm",
    portrait: "/assets/portraits/dj-algorithm.png",
    quotes: [
      {
        text: "Your neurons are doing the Electric Slide. Keep it up!",
        context: "high_score"
      }
    ]
  },
  {
    name: "Cache Money",
    portrait: "/assets/portraits/cache-money.png",
    quotes: [
      {
        text: "12 days straight? Your brain is now officially a gym rat.",
        context: "streak_milestone" // 7+ days
      }
    ]
  },
  {
    name: "Ray Tracer",
    portrait: "/assets/portraits/ray-tracer.png",
    quotes: [
      {
        text: "That streak is hotter than a CPU at 95°C.",
        context: "streak_milestone"
      }
    ]
  },
  {
    name: "Array Jay",
    portrait: "/assets/portraits/array-jay.png",
    quotes: [
      {
        text: "First combo survived! Welcome to the big leagues.",
        context: "first_combo"
      }
    ]
  },
  {
    name: "Lambda Calculus",
    portrait: "/assets/portraits/lambda-calculus.png",
    quotes: [
      {
        text: "Multiplicative scoring unlocked. Your working memory thanks you.",
        context: "first_combo"
      }
    ]
  },
  {
    name: "Git Committer",
    portrait: "/assets/portraits/git-committer.png",
    quotes: [
      {
        text: "Five sessions in and your prefrontal cortex is filing pull requests like a boss.",
        context: "calibration_progress" // sessions 3-5
      }
    ]
  },
  {
    name: "Floppy Phil",
    portrait: "/assets/portraits/floppy-phil.png",
    quotes: [
      {
        text: "Reverse Controls: where good snakes go to humble themselves.",
        context: "death_during_rc"
      }
    ]
  }
  // ... 13 more callers (total 21 per FR201)
];
```

### Performance Context Mapping

**High score session** (score > 80):
- "Your neurons are doing the Electric Slide. Keep it up!" — DJ Algorithm
- "Your prefrontal cortex just bench-pressed a truck." — Kernel Sanders

**Death during Reverse Controls:**
- "Orange food got you? That's executive function boot camp. You'll get it." — Kernel Sanders
- "Reverse Controls: where good snakes go to humble themselves." — Floppy Phil

**Streak milestone** (7+ days, 30+ days):
- "12 days straight? Your brain is now officially a gym rat." — Cache Money
- "That streak is hotter than a CPU at 95°C." — Ray Tracer

**First combo survived:**
- "First combo survived! Welcome to the big leagues." — Array Jay
- "Multiplicative scoring unlocked. Your working memory thanks you." — Lambda Calculus

**Calibration progress** (sessions 3-5):
- "Five sessions in and your prefrontal cortex is filing pull requests like a boss." — Git Committer

**Personal Best achieved:**
- "New high score? Your hippocampus is taking notes." — RAM Ramirez

**Generic encouragement** (fallback):
- "Every rep counts. Your brain is stronger than yesterday." — Byte Williams

### Quote Selection Algorithm

```javascript
function selectCallerQuote(sessionData, cognitiveStats, highlights, sessionContext) {
  // 1. Determine performance context (priority order)
  let context = 'generic';

  if (sessionContext.streakDays >= 30) context = 'streak_milestone';
  else if (sessionContext.streakDays >= 7) context = 'streak_milestone';
  else if (cognitiveStats.comboMultipliers === 1 && sessionContext.totalSessions === 1) context = 'first_combo';
  else if (cognitiveStats.rcDeath === true) context = 'death_during_rc';
  else if (sessionData.score > 80) context = 'high_score';
  else if (sessionContext.calibrationState === 'in_progress') context = 'calibration_progress';
  else if (highlights.some(h => h.type === 'personal_best')) context = 'personal_best';

  // 2. Filter callers with matching context quotes
  const matchingCallers = CALLERS.filter(caller =>
    caller.quotes.some(q => q.context === context)
  );

  // 3. Fallback to generic if no match
  const pool = matchingCallers.length > 0 ? matchingCallers : CALLERS.filter(c =>
    c.quotes.some(q => q.context === 'generic')
  );

  // 4. Random selection from pool
  const caller = pool[Math.floor(Math.random() * pool.length)];
  const contextQuotes = caller.quotes.filter(q => q.context === context || q.context === 'generic');
  const quote = contextQuotes[Math.floor(Math.random() * contextQuotes.length)];

  return {
    text: quote.text,
    caller: caller.name,
    portrait: caller.portrait
  };
}
```

### Integration Points

- **`game.js`** - Call `selectCallerQuote()` after `selectHighlights()`, pass to `showHighlights()`
- **`cognitive-feedback.js`** - Story 14.2 `showHighlights()` renders quote in `.caller-quote` container
- **`storage.js`** - Provides `sessionContext.totalSessions` for first-time achievements
- **`state.js`** - Provides `cognitiveStats.rcDeath` flag (track if death occurred during RC)

### Test Strategy

**Unit Tests (`callers.test.js`):**
1. Test context detection: high score → "high_score" context
2. Test context detection: death during RC → "death_during_rc" context
3. Test context detection: 7-day streak → "streak_milestone" context
4. Test context detection: first combo → "first_combo" context
5. Test fallback: no matching context → generic quote
6. Test randomization: multiple calls with same context → different quotes (probabilistic)
7. Test all 21 callers have valid portrait paths
8. Test no duplicate quotes across callers (uniqueness validation)

**Manual Testing:**
- Play game with score > 80 → verify high score quote appears
- Die during Reverse Controls → verify RC-themed quote
- Achieve 7-day streak → verify streak milestone quote
- Survive first combo → verify combo celebration quote
- Play sessions 1-5 → verify calibration progress quotes

### Dependencies

**BLOCKS:** None (standalone quote selection)
**BLOCKED BY:** Story 14.1 (needs highlights array for context)

### Implementation Notes

1. **Caller portraits** - Create 21 pixel-art portraits (32x32px) in `/assets/portraits/`:
   - Style: Retro 80s arcade aesthetic, 4-color palette
   - Format: PNG with transparency
   - Naming: kebab-case matching caller names (e.g., `kernel-sanders.png`)

2. **Quote variety** - Each caller should have 2-3 quotes across different contexts to maximize rotation variety (per FR164 performance-based selection)

3. **Comedy tone** - All quotes maintain humor without clinical language:
   - ✅ "Your prefrontal cortex just bench-pressed a truck." (funny)
   - ❌ "Your executive function improved by 15%." (clinical)

4. **Context priority order** - Streak milestones > First-time achievements > Death context > Score-based > Generic (ensures rarest events get celebrated)

5. **RC death detection** - Add `rcDeath: boolean` flag to `cognitiveStats` in game.js (check if active RC period exists when `onDeath()` triggered)

6. **Portrait loading** - Preload all 21 portraits on game init to avoid flash during post-game display

7. **Rotation tracking** - Story 18 (Comedy Integration) will add quote history tracking to prevent repetition → for now, pure random selection from context pool

8. **21 Callers list** (per FR201):
   - Kernel Sanders, DJ Algorithm, Cache Money, Ray Tracer
   - Array Jay, Lambda Calculus, Git Committer, Floppy Phil
   - RAM Ramirez, Byte Williams, Ada Lovelace Jr., Turing McTuring
   - Pixel Pete, Vector Vicky, Node Nelson, Stack Steph
   - Queue Quinn, Heap Harper, Tree Taylor, Graph Gary, Hash Helen
