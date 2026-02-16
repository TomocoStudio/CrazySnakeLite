# Story 18.1: Create Caller Quote Database with Performance Context

**Epic:** 18 - Dashboard Comedy Integration

**As a** developer,
**I want** a structured caller quote database with performance context tags,
**So that** quotes can be intelligently matched to player achievements.

---

## Acceptance Criteria

**Given** comedy integration initializes
**When** comedy.js module loads
**Then** expose caller quote database structure:
```javascript
const CALLER_QUOTES = [
  {
    callerId: 'kernel-sanders',
    name: 'Kernel Sanders',
    portrait: 'assets/callers/kernel-sanders-32.png',
    quotes: [
      {
        text: "Your prefrontal cortex just bench-pressed a truck. Impressive.",
        context: ['high_score', 'rc_survived', 'personal_best']
      },
      {
        text: "Five sessions in and your neurons are filing pull requests like a boss.",
        context: ['calibration_complete', 'streak_milestone']
      },
      {
        text: "Orange food got you? That's executive function boot camp.",
        context: ['death_during_rc', 'rc_struggle']
      }
    ]
  },
  {
    callerId: 'dj-algorithm',
    name: 'DJ Algorithm',
    quotes: [
      {
        text: "Your neurons are doing the Electric Slide. Keep it up!",
        context: ['general', 'streak_active']
      },
      {
        text: "12 days straight? Your brain is now officially a gym rat.",
        context: ['streak_milestone_7', 'streak_milestone_30']
      }
    ]
  },
  // ... 19 more callers (21 total from phone calls system)
]
```

**And** each quote tagged with 1+ context keywords:
- Performance: 'high_score', 'low_score', 'personal_best', 'improvement'
- Cognitive: 'rc_survived', 'death_during_rc', 'combo_master', 'phone_ace'
- Milestones: 'calibration_complete', 'streak_milestone_7', 'streak_milestone_30', 'session_50', 'session_100'
- General: 'general', 'encouragement', 'celebration'

**Given** quote database is queried
**When** selecting quote by context
**Then** filter quotes matching provided context tags
**And** return random quote from matching pool
**And** fallback to 'general' context if no matches

**Per FR199:** Post-game highlights include tech pun caller quotes contextual to performance (21 callers available)

---

## Development

### Files to Create/Modify

- **`js/comedy.js`** - NEW MODULE - Caller quote database and selection logic
- **`test/comedy.test.js`** - NEW - Unit tests for quote selection

### API Surface

```javascript
// comedy.js (NEW module for V3 dashboard comedy)

// Database: 21 callers with 3-5 quotes each
export const CALLER_QUOTES = [...]  // Full structure per AC

// Quote selection by context tags
export function selectQuote(contextTags: Array<string>, excludeQuoteId?: string): Object
// Returns: { callerId, callerName, portrait, text, quoteId }

// Get all available context tags (for testing/validation)
export function getAvailableContexts(): Array<string>
```

### Caller Quote Database Structure

```javascript
// Each caller from phone.js CALLERS (21 total)
export const CALLER_QUOTES = [
  {
    callerId: 'al-gorithm',  // slug from phone.js, kebab-case
    name: 'Al Gorithm',      // Display name from phone.js
    portrait: 'assets/pictures/01_AlGorithm.png',  // From phone.js
    quotes: [
      {
        id: 'al-gorithm-high-score-1',  // Unique ID for deduplication
        text: "Your sorting algorithm is on point. High score achieved!",
        context: ['high_score', 'personal_best']
      },
      {
        id: 'al-gorithm-general-1',
        text: "Have you tried sorting your priorities? Just checking.",
        context: ['general', 'encouragement']
      },
      {
        id: 'al-gorithm-rc-survived-1',
        text: "Reverse Controls survived? Your algorithms adapt well.",
        context: ['rc_survived', 'cognitive_flexibility']
      }
      // 2-3 more quotes per caller (3-5 total)
    ]
  },
  // ... 20 more callers (21 total from phone.js)
]
```

### Context Tag Taxonomy

**Performance Tags:**
- `high_score` - Score > 80
- `low_score` - Score < 20
- `personal_best` - Any metric personal best
- `improvement` - Session-over-session improvement

**Cognitive Tags:**
- `rc_survived` - Survived 3+ Reverse Controls
- `death_during_rc` - Died during RC
- `combo_master` - 3+ combo multipliers achieved
- `phone_ace` - 6+ phone calls managed

**Milestone Tags:**
- `calibration_complete` - Session 5 complete
- `streak_milestone_7` - 7-day streak
- `streak_milestone_30` - 30-day streak
- `session_50` - 50 sessions total
- `session_100` - 100 sessions total

**General Tags:**
- `general` - Fallback for any context
- `encouragement` - Low score or struggle support
- `celebration` - High achievement moments

### Selection Algorithm

```javascript
// Pseudocode for selectQuote()
function selectQuote(contextTags, excludeQuoteId = null) {
  // 1. Filter all quotes matching ANY context tag
  const matchingQuotes = CALLER_QUOTES.flatMap(caller =>
    caller.quotes
      .filter(q => q.context.some(tag => contextTags.includes(tag)))
      .map(q => ({ ...q, callerId: caller.callerId, callerName: caller.name, portrait: caller.portrait }))
  );

  // 2. Prioritize multi-tag matches (relevance scoring)
  const scored = matchingQuotes.map(q => ({
    ...q,
    relevance: q.context.filter(tag => contextTags.includes(tag)).length
  }));
  scored.sort((a, b) => b.relevance - a.relevance);

  // 3. Exclude lastQuoteId to prevent repetition
  const available = excludeQuoteId
    ? scored.filter(q => q.id !== excludeQuoteId)
    : scored;

  // 4. Fallback to 'general' context if no matches
  if (available.length === 0) {
    return selectQuote(['general'], excludeQuoteId);
  }

  // 5. Random selection from top-relevance tier
  const topRelevance = available[0].relevance;
  const topTier = available.filter(q => q.relevance === topRelevance);
  return topTier[Math.floor(Math.random() * topTier.length)];
}
```

### Integration Points

- **`phone.js`** - CALLERS array provides 21 caller names/portraits (read-only reference)
- **`cognitive-feedback.js`** (Epic 14) - Will call `selectQuote()` for post-game highlights
- **`dashboard.js`** (Epic 16) - Will call `selectQuote()` for Skill Map quotes
- **`calibration.js`** (Epic 15) - Will call `selectQuote(['calibration_complete'])` on session 5

### Test Strategy

**Unit Tests (`comedy.test.js`):**
1. Test `selectQuote(['high_score'])` returns quote with 'high_score' tag
2. Test multi-tag relevance prioritization ('high_score' + 'personal_best' > 'high_score' alone)
3. Test `excludeQuoteId` parameter filters correctly
4. Test fallback to 'general' when no context matches
5. Test all 21 callers have 3-5 quotes minimum
6. Test all quotes have unique IDs
7. Test quote text length < 80 characters (per AC)
8. Test variety: 10 selections from same context return 10 different quotes (if pool > 10)

**Manual Testing:**
- Verify quote database loads without errors
- Check console: no duplicate quoteIds
- Verify all caller portraits exist at specified paths

### Dependencies

**BEFORE this story:**
- NONE (foundation module)

**AFTER this story:**
- Story 18.2 (quote selection algorithm uses this database)
- Story 18.3, 18.4, 18.5 (all integration stories depend on this module)

### Implementation Notes

1. **Reuse phone.js CALLERS** - Import CALLERS from phone.js to maintain single source of truth for names/portraits
2. **Quote ID format** - `{caller-slug}-{context}-{number}` (e.g., 'al-gorithm-high-score-1')
3. **Portrait paths** - Match phone.js pattern: `assets/pictures/{slug}.png`
4. **Content writing** - Follow Story 18.9 guidelines (tech puns, brief, encouraging)
5. **Start with 3 quotes per caller** - Can expand to 5 later (minimum viable: 63 quotes total)
6. **Null safety** - Always return valid quote object (never null/undefined)
7. **Module boundary** - comedy.js ONLY handles quote data and selection logic, NOT UI rendering
