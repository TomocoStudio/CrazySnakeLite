# Story 18.8: Test Quote Contextual Relevance

**Epic:** 18 - Dashboard Comedy Integration

**As a** developer,
**I want** quotes to feel relevant to player performance,
**So that** comedy enhances engagement rather than feeling random.

---

## Acceptance Criteria

**Given** player achieves high score (90+) with no RC survival
**When** post-game quote is selected
**Then** choose 'high_score' context quote (not 'rc_survived')
**And** quote celebrates score achievement:
```
"Score 92? Your brain just unlocked achievement: Overachiever Mode."
```

**Given** player dies at score 5 during first Reverse Controls encounter
**When** post-game quote is selected
**Then** choose 'death_during_rc' + 'low_score' context
**And** quote is empathetic/encouraging:
```
"Orange food is tough love. Your executive function is in training."
```

**Given** player completes session with zero phone calls (low score, no calls spawned)
**When** post-game quote is selected
**Then** choose 'low_score' or 'general' context
**And** avoid 'phone_ace' or 'combo_master' quotes (player didn't engage those systems)

**Given** player views Skill Map after 30-day milestone
**When** quote selection runs
**Then** prioritize 'streak_milestone_30' quote first visit after milestone
**And** subsequent visits rotate through general quotes

**Given** 20 consecutive sessions display quotes
**When** reviewing quote history
**Then** verify high variety (no quote appears more than 2x in 20 sessions)
**And** context relevance maintained (quotes match performance)

**Per NFR66:** Caller comedy quotes contextual to performance, not random (relevance matters)

---

## Development

### Files to Create/Modify

- **`test/comedy-relevance.test.js`** - NEW - Contextual relevance integration tests
- **`_bmad-output/implementation-artifacts/validation/18-8-quote-relevance-test-plan.md`** - NEW - Test scenarios and expected outcomes

### Test Scope

**What We're Testing:**
1. Quote selection matches performance context accurately
2. High-relevance quotes prioritized over low-relevance
3. No random/irrelevant quotes appear
4. Variety maintained (no excessive repetition)
5. Fallback to 'general' works when no context matches

### Test Scenarios

#### Scenario 1: High Score Performance

```javascript
// test/comedy-relevance.test.js

describe('High Score Performance', () => {
  it('should select celebratory quote for score > 80', () => {
    const sessionData = {
      score: 92,
      highlights: [],
      cognitiveStats: { rcSurvived: 0 },
      diedDuringRC: false,
      comboMultipliers: 0,
      phoneCallsManaged: 0,
      streak: 0,
      sessionCount: 3
    };

    const context = buildContext(sessionData);
    const quote = selectQuote(context);

    // Verify quote has 'high_score' context tag
    const quoteData = findQuoteById(quote.id);
    expect(quoteData.context).toContain('high_score');

    // Verify quote is celebratory (manual verification of tone)
    console.log('High score quote:', quote.text);
  });
});
```

#### Scenario 2: Death During Reverse Controls

```javascript
describe('Death During RC', () => {
  it('should select empathetic quote for RC death', () => {
    const sessionData = {
      score: 5,
      highlights: [],
      cognitiveStats: { rcSurvived: 0 },
      diedDuringRC: true,  // Key context
      comboMultipliers: 0,
      phoneCallsManaged: 0,
      streak: 0,
      sessionCount: 2
    };

    const context = buildContext(sessionData);
    const quote = selectQuote(context);

    // Verify quote has 'death_during_rc' context tag
    const quoteData = findQuoteById(quote.id);
    expect(quoteData.context).toContain('death_during_rc');

    // Verify quote is empathetic/encouraging
    console.log('RC death quote:', quote.text);
  });
});
```

#### Scenario 3: Calibration Complete Milestone

```javascript
describe('Calibration Complete', () => {
  it('should select milestone quote for session 5', () => {
    const sessionData = {
      score: 45,
      highlights: [],
      cognitiveStats: { rcSurvived: 2 },
      diedDuringRC: false,
      comboMultipliers: 1,
      phoneCallsManaged: 3,
      streak: 5,
      sessionCount: 5  // Calibration complete
    };

    const context = buildContext(sessionData);
    const quote = selectQuote(context);

    // Verify quote has 'calibration_complete' context tag
    const quoteData = findQuoteById(quote.id);
    expect(quoteData.context).toContain('calibration_complete');

    // Verify quote congratulates and encourages Skill Map visit
    console.log('Calibration quote:', quote.text);
  });
});
```

#### Scenario 4: 30-Day Streak Milestone

```javascript
describe('30-Day Streak', () => {
  it('should select streak celebration quote', () => {
    const sessionData = {
      score: 60,
      highlights: [{ type: 'personal_best', domain: 'reactionTime' }],
      cognitiveStats: { rcSurvived: 3 },
      diedDuringRC: false,
      comboMultipliers: 2,
      phoneCallsManaged: 5,
      streak: 30,  // Milestone
      sessionCount: 45
    };

    const context = buildContext(sessionData);
    const quote = selectQuote(context);

    // Verify quote has 'streak_milestone_30' context tag
    const quoteData = findQuoteById(quote.id);
    expect(quoteData.context).toContain('streak_milestone_30');

    // Verify quote celebrates streak achievement
    console.log('30-day streak quote:', quote.text);
  });
});
```

#### Scenario 5: Low Score, No Special Context

```javascript
describe('Low Score Generic', () => {
  it('should select low score or general quote', () => {
    const sessionData = {
      score: 8,
      highlights: [],
      cognitiveStats: { rcSurvived: 0 },
      diedDuringRC: false,
      comboMultipliers: 0,
      phoneCallsManaged: 0,
      streak: 0,
      sessionCount: 1
    };

    const context = buildContext(sessionData);
    const quote = selectQuote(context);

    // Verify quote has 'low_score' or 'general' context tag
    const quoteData = findQuoteById(quote.id);
    const validContexts = ['low_score', 'general', 'encouragement'];
    const hasValidContext = quoteData.context.some(c => validContexts.includes(c));
    expect(hasValidContext).toBe(true);

    // Verify quote is encouraging (not celebratory)
    console.log('Low score quote:', quote.text);
  });
});
```

#### Scenario 6: Multi-Tag Relevance Prioritization

```javascript
describe('Multi-Tag Relevance', () => {
  it('should prioritize quotes matching multiple context tags', () => {
    const sessionData = {
      score: 95,  // → 'high_score'
      highlights: [{ type: 'personal_best', domain: 'spatialAwareness' }],  // → 'personal_best'
      cognitiveStats: { rcSurvived: 4 },  // → 'rc_survived'
      diedDuringRC: false,
      comboMultipliers: 3,  // → 'combo_master'
      phoneCallsManaged: 7,  // → 'phone_ace'
      streak: 0,
      sessionCount: 12
    };

    const context = buildContext(sessionData);
    // context = ['high_score', 'personal_best', 'rc_survived', 'combo_master', 'phone_ace']

    const quote = selectQuote(context);
    const quoteData = findQuoteById(quote.id);

    // Count matching tags (higher = more relevant)
    const matchCount = quoteData.context.filter(c => context.includes(c)).length;

    // Verify quote matches 2+ tags (prioritized over 1-tag matches)
    expect(matchCount).toBeGreaterThanOrEqual(2);

    console.log(`Multi-tag quote (${matchCount} matches):`, quote.text);
  });
});
```

#### Scenario 7: Quote Variety (No Excessive Repetition)

```javascript
describe('Quote Variety', () => {
  it('should return different quotes across 20 sessions', () => {
    const quotes = [];

    for (let i = 0; i < 20; i++) {
      const sessionData = {
        score: Math.floor(Math.random() * 100),
        highlights: [],
        cognitiveStats: { rcSurvived: Math.floor(Math.random() * 5) },
        diedDuringRC: Math.random() > 0.7,
        comboMultipliers: Math.floor(Math.random() * 4),
        phoneCallsManaged: Math.floor(Math.random() * 8),
        streak: Math.floor(Math.random() * 10),
        sessionCount: i + 1
      };

      const context = buildContext(sessionData);
      const lastQuoteId = quotes.length > 0 ? quotes[quotes.length - 1].id : null;
      const quote = selectQuote(context, lastQuoteId);

      quotes.push(quote);
    }

    // Verify variety: no quote appears more than 2x in 20 sessions
    const quoteCounts = {};
    quotes.forEach(q => {
      quoteCounts[q.id] = (quoteCounts[q.id] || 0) + 1;
    });

    const maxRepetition = Math.max(...Object.values(quoteCounts));
    expect(maxRepetition).toBeLessThanOrEqual(2);

    console.log('Quote variety:', Object.keys(quoteCounts).length, 'unique quotes in 20 sessions');
  });
});
```

#### Scenario 8: Fallback to General Context

```javascript
describe('Fallback to General', () => {
  it('should fallback to general quotes when no specific context matches', () => {
    // Simulate edge case: context tags that match zero quotes
    const context = ['nonexistent_tag'];

    const quote = selectQuote(context);

    // Verify fallback quote has 'general' context
    const quoteData = findQuoteById(quote.id);
    expect(quoteData.context).toContain('general');

    console.log('Fallback quote:', quote.text);
  });
});
```

### Manual Test Scenarios

**Test Plan Document: `18-8-quote-relevance-test-plan.md`**

```markdown
# Quote Contextual Relevance Test Plan

## Test Execution Instructions

### Setup
1. Clear sessionStorage and localStorage
2. Start fresh game session
3. Have DevTools Console open for logging

### Scenario 1: High Score Session
**Action:** Play until score > 80
**Expected:** Post-game quote is celebratory
**Examples:**
- "Your brain just unlocked achievement: Overachiever Mode."
- "Score 92? That's executive function on fire."

**Validation:**
- [ ] Quote tone is celebratory
- [ ] Quote references high performance
- [ ] Quote does NOT reference struggle/failure

### Scenario 2: RC Death Session
**Action:** Die during active Reverse Controls (orange food)
**Expected:** Post-game quote is empathetic/encouraging
**Examples:**
- "Orange food is tough love. Your executive function is in training."
- "Reverse Controls: where good snakes go to humble themselves."

**Validation:**
- [ ] Quote tone is empathetic
- [ ] Quote acknowledges RC difficulty
- [ ] Quote does NOT mock player

### Scenario 3: Low Score Session
**Action:** Die at score < 20 (no special events)
**Expected:** Post-game quote is encouraging or general
**Examples:**
- "Every session trains your brain. Keep going!"
- "Your neurons are warming up. Give them time."

**Validation:**
- [ ] Quote tone is encouraging
- [ ] Quote does NOT reference achievements player didn't earn
- [ ] No mentions of combo/phone if player didn't engage those systems

### Scenario 4: Calibration Complete
**Action:** Complete session 5
**Expected:** Celebration quote references brain map unlock
**Examples:**
- "Five sessions complete! Your brain map just rendered. Check it out!"
- "Your brain map is ready. Spoiler: it looks impressive."

**Validation:**
- [ ] Quote congratulates completion
- [ ] Quote references Skill Map unlock
- [ ] Quote encourages clicking SKILL MAP button

### Scenario 5: 30-Day Streak
**Action:** Achieve 30-day streak milestone
**Expected:** Streak celebration quote
**Examples:**
- "30 days straight? That streak is hotter than a CPU at 95°C."
- "Your brain is now officially a gym rat."

**Validation:**
- [ ] Quote celebrates streak
- [ ] Quote references consistency/dedication
- [ ] Quote is encouraging for continued play

### Scenario 6: Variety Check
**Action:** Play 10 consecutive sessions
**Expected:** No quote repeats back-to-back
**Validation:**
- [ ] Session 1 quote ≠ Session 2 quote
- [ ] Session 2 quote ≠ Session 3 quote
- [ ] ... all consecutive pairs are different
- [ ] At least 7-8 unique quotes across 10 sessions

### Scenario 7: Skill Map Rotation
**Action:** Open and close Skill Map 5 times
**Expected:** Different quote each visit
**Validation:**
- [ ] Visit 1 quote ≠ Visit 2 quote
- [ ] Visit 2 quote ≠ Visit 3 quote
- [ ] At least 4 unique quotes across 5 visits
```

### Integration Test Helpers

```javascript
// test/comedy-relevance.test.js

// Helper: Find quote in CALLER_QUOTES by ID
function findQuoteById(quoteId) {
  for (const caller of CALLER_QUOTES) {
    const found = caller.quotes.find(q => q.id === quoteId);
    if (found) {
      return { ...found, callerId: caller.callerId, callerName: caller.name };
    }
  }
  return null;
}

// Helper: Verify quote tone (manual review)
function verifyQuoteTone(quoteText, expectedTone) {
  console.log(`\nQuote: "${quoteText}"`);
  console.log(`Expected tone: ${expectedTone}`);
  console.log('✅ PASS if tone matches, ❌ FAIL if tone mismatched');
}
```

### Test Strategy

**Automated Tests:**
1. Run `npm test -- comedy-relevance.test.js` → All scenarios PASS
2. Verify context building (buildContext produces correct tags)
3. Verify quote selection (selectQuote returns quotes matching context)
4. Verify relevance prioritization (multi-tag matches prioritized)
5. Verify variety (no excessive repetition)
6. Verify fallback (general quotes when no match)

**Manual Tests:**
1. Execute all 7 manual test scenarios
2. Verify quote tone matches performance context
3. Verify no irrelevant quotes appear
4. Verify variety across 10+ sessions
5. Verify quotes feel contextual, not random

### Pass Criteria

**Story 18.8 passes if:**
- ✅ All automated tests pass
- ✅ All manual test scenarios validated
- ✅ No irrelevant quotes observed in 20-session playthrough
- ✅ Quote tone matches context (celebratory for high score, empathetic for RC death, etc.)
- ✅ Variety maintained (no quote appears > 2x in 20 sessions)
- ✅ Fallback works (general quotes when no context matches)

### Dependencies

**BEFORE this story:**
- Story 18.1 (CALLER_QUOTES database)
- Story 18.2 (buildContext + selectQuote functions)
- Story 18.3, 18.4, 18.5 (quote integration in all contexts)

**AFTER this story:**
- BLOCKING for Epic 18 sign-off (contextual relevance validates core feature)

### Implementation Notes

1. **Relevance is subjective** - Automated tests verify technical correctness, manual tests verify tone/feel
2. **Variety vs relevance tradeoff** - High relevance may reduce variety (acceptable if contextual accuracy maintained)
3. **Edge cases matter** - Test low score + no events, high score + multiple events
4. **Logging for debugging** - Log selected quote + context tags during testing
5. **Quote pool size** - Minimum 63 quotes (21 callers × 3 quotes) ensures variety
6. **Fallback is critical** - General quotes must always be available (never return null/undefined)
