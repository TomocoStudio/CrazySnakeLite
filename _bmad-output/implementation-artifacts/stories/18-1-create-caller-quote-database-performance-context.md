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

---

## Tasks / Subtasks

- [x] Create js/comedy.js module foundation (AC: Module loads without errors)
  - [x] Create file with module header comment
  - [x] Import CALLERS from phone.js for reference
  - [x] Set up module exports structure
- [x] Build CALLER_QUOTES database (AC: 21 callers with 3+ quotes each)
  - [x] Map all 21 callers from phone.js to CALLER_QUOTES structure
  - [x] Write 3 quotes per caller with context tags (minimum 63 quotes total)
  - [x] Ensure unique quote IDs (format: {caller-slug}-{context}-{number})
  - [x] Verify each quote has 1+ context tags from taxonomy
  - [x] Validate quote text length < 80 characters
  - [x] Verify portrait paths match phone.js pattern
- [x] Implement selectQuote() function (AC: Context-based quote selection works)
  - [x] Filter quotes matching ANY context tag
  - [x] Implement relevance scoring (multi-tag matches prioritized)
  - [x] Sort by relevance score (descending)
  - [x] Implement excludeQuoteId filtering
  - [x] Implement fallback to 'general' context if no matches
  - [x] Random selection from top-relevance tier
  - [x] Return object with all required fields
- [x] Implement getAvailableContexts() helper (AC: Returns all context tags)
  - [x] Extract unique context tags from all quotes
  - [x] Return sorted array of context strings
- [x] Create test/comedy.test.js unit tests (AC: All tests pass)
  - [x] Test selectQuote(['high_score']) returns high_score quote
  - [x] Test multi-tag relevance prioritization
  - [x] Test excludeQuoteId parameter works
  - [x] Test fallback to 'general' context
  - [x] Test all 21 callers have 3+ quotes
  - [x] Test all quote IDs are unique
  - [x] Test quote text length < 80 characters
  - [x] Test variety (10 selections return different quotes if pool > 10)
- [x] Manual validation (AC: Quote database production-ready)
  - [x] Run tests and verify all pass
  - [x] Check console for no duplicate quoteIds
  - [x] Verify module loads without errors
  - [x] Check portrait path format matches phone.js

---

## Dev Agent Record

### Implementation Plan

**Approach:** TDD (Test-Driven Development)
1. Created comprehensive test suite in `test/comedy.test.js` covering all acceptance criteria
2. Implemented `comedy.js` module with CALLER_QUOTES database (21 callers, 63 quotes)
3. Implemented `selectQuote()` with relevance scoring algorithm
4. Implemented `getAvailableContexts()` helper
5. Validated all tests pass

**Database Structure:**
- All 21 callers from `phone.js` mapped with matching portraits
- Each caller has 3 quotes minimum (63 total quotes)
- Quote IDs follow format: `{caller-slug}-{context}-{number}`
- 16 unique context tags across all quotes
- All quotes under 80 characters (max: 63 chars)

### Debug Log

**Issue 1: Curly Quotes**
- **Problem:** Syntax error due to curly apostrophes (') in quote strings
- **Solution:** Used Python script to replace all curly quotes with straight quotes
- **Impact:** Module now loads successfully without syntax errors

**Issue 2: Apostrophe in Single-Quoted String**
- **Problem:** Line 159 had apostrophe in "You're" within single-quoted string
- **Solution:** Changed to double-quoted string to properly escape apostrophe
- **Impact:** Fixed final syntax error preventing module load

### Completion Notes

✅ **Successfully implemented Story 18.1**

**Created:**
- `js/comedy.js` - Caller quote database module with selection logic
- `test/comedy.test.js` - Comprehensive unit test suite
- `test/test-runner-comedy.html` - Browser-based test runner

**Validation Results:**
- ✓ 21 callers present with correct names/portraits
- ✓ 63 total quotes (3 per caller minimum)
- ✓ All quote IDs unique
- ✓ All quotes under 80 characters
- ✓ 16 context tags available
- ✓ selectQuote() returns valid objects
- ✓ Fallback to 'general' context works
- ✓ excludeQuoteId filtering works
- ✓ All 8 unit tests pass

**Module Exports:**
- `CALLER_QUOTES` - Database of 21 callers with contextual quotes
- `selectQuote(contextTags, excludeQuoteId)` - Context-based quote selection
- `getAvailableContexts()` - Returns array of all context tags

---

## File List

**New Files:**
- `js/comedy.js` - Caller quote database and selection logic module
- `test/comedy.test.js` - Unit test suite for comedy module
- `test/test-runner-comedy.html` - Browser test runner for comedy tests

**Modified Files:**
- None

**Deleted Files:**
- None

---

## Change Log

**2026-02-16 - Story 18.1 Implementation**

- Created comedy.js module with CALLER_QUOTES database (21 callers, 63 quotes, 16 context tags)
- Implemented selectQuote() function with relevance scoring algorithm
  - Filters quotes by context tags
  - Prioritizes multi-tag matches
  - Supports excludeQuoteId for variety
  - Falls back to 'general' context
- Implemented getAvailableContexts() helper function
- Created comprehensive test suite (8 tests, all passing)
- Fixed curly quote syntax errors for production readiness
- All acceptance criteria satisfied

---

## Status

**Status:** review
**Assigned:** Dev Agent
**Last Updated:** 2026-02-16
