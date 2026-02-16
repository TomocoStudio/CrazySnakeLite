# Quote Contextual Relevance Test Plan

**Story:** 18.8 - Test Quote Contextual Relevance
**Date:** 2026-02-16
**Purpose:** Validate that caller quotes match player performance context accurately

---

## Executive Summary

This test plan verifies that CrazySnake's comedy quote system delivers contextually relevant humor based on player performance. Quotes should feel personalized to the session experience, not random. Tests cover high/low score scenarios, milestone achievements, RC challenges, and variety maintenance across multiple sessions.

---

## Automated Test Results

**Test Suite:** `test/comedy-relevance.test.js`
**Tests Run:** 10
**Tests Passed:** 10 ✅
**Status:** ALL TESTS PASSED

### Test Coverage

1. ✅ High Score Performance (score > 80) → celebratory quotes
2. ✅ Death During Reverse Controls → empathetic/relevant quotes
3. ✅ Calibration Complete (session 5) → milestone quotes
4. ✅ 30-Day Streak Milestone → achievement celebration quotes
5. ✅ Low Score Generic → encouraging quotes
6. ✅ Multi-Tag Relevance Prioritization → highest relevance selected
7. ✅ Quote Variety (20 sessions) → 13+ unique quotes, max 3 repetitions
8. ✅ Fallback to General Context → always returns relevant quote
9. ✅ Consecutive Quote Deduplication → no back-to-back repeats
10. ✅ Context Building Accuracy → all expected tags present

---

## Manual Test Scenarios

### Setup Instructions

**Before Starting:**
1. Open game in browser
2. Clear sessionStorage and localStorage: `localStorage.clear(); sessionStorage.clear(); location.reload()`
3. Open DevTools Console to view quote logs
4. Have this test plan ready to check off scenarios

---

### Scenario 1: High Score Session (Celebratory Quotes)

**Objective:** Verify high-scoring sessions receive celebratory quotes

**Action:**
1. Play session aiming for score > 80
2. Note final score
3. Observe post-game quote

**Expected Outcome:**
- Quote tone is celebratory (not empathetic/encouraging)
- Quote references high performance or achievement
- Quote does NOT reference struggle/failure

**Example Quotes:**
- "Your brain just unlocked achievement: Overachiever Mode."
- "Score 92? That's executive function on fire."
- "Let me help you organize this: HIGH SCORE achieved!"

**Validation Checklist:**
- [ ] Score ≥ 80
- [ ] Quote feels celebratory
- [ ] Quote references achievement/success
- [ ] Quote does NOT mention difficulty/struggle

**Notes:**
_Record score, quote text, and tone assessment here_

---

### Scenario 2: RC Death Session (Empathetic Quotes)

**Objective:** Verify dying during Reverse Controls triggers empathetic quotes

**Action:**
1. Play until Reverse Controls (orange food) spawns
2. Eat orange food to activate RC
3. Die while RC is still active
4. Observe post-game quote

**Expected Outcome:**
- Quote tone is empathetic/encouraging (not mocking)
- Quote acknowledges RC difficulty
- Quote provides encouragement to keep trying

**Example Quotes:**
- "Orange food is tough love. Your executive function is in training."
- "Reverse Controls: where good snakes go to humble themselves."
- "I'm buffering too. We all need a moment. Keep going!"

**Validation Checklist:**
- [ ] Died during active RC effect
- [ ] Quote feels empathetic/encouraging
- [ ] Quote acknowledges difficulty
- [ ] Quote does NOT mock player

**Notes:**
_Record quote text and tone assessment here_

---

### Scenario 3: Low Score Session (Encouraging Quotes)

**Objective:** Verify low-scoring sessions receive encouraging (not celebratory) quotes

**Action:**
1. Play session and die quickly (score < 20)
2. Ensure no special events (no RC, combo, phone calls)
3. Observe post-game quote

**Expected Outcome:**
- Quote tone is encouraging/supportive
- Quote does NOT reference achievements player didn't earn
- No mentions of combo/phone if player didn't engage those systems

**Example Quotes:**
- "Every session trains your brain. Keep going!"
- "Your neurons are warming up. Give them time."
- "Back in my day, we all started somewhere. Keep going!"

**Validation Checklist:**
- [ ] Score < 20
- [ ] Quote feels encouraging (not celebratory)
- [ ] Quote does NOT reference unearned achievements
- [ ] Quote appropriate for beginner/struggling player

**Notes:**
_Record score, quote text, and tone assessment here_

---

### Scenario 4: Calibration Complete (Milestone Quotes)

**Objective:** Verify session 5 completion triggers milestone celebration quotes

**Action:**
1. Play 5 complete sessions (clear storage if needed: `localStorage.clear(); sessionStorage.clear()`)
2. Complete session 5
3. Observe post-game quote

**Expected Outcome:**
- Quote congratulates completion
- Quote references brain map/Skill Map unlock
- Quote encourages clicking SKILL MAP button

**Example Quotes:**
- "Five sessions complete! Your brain map just rendered. Check it out!"
- "Your brain map is ready. Spoiler: it looks impressive."
- "Five sessions tuned! Your brain map frequency is locked in!"

**Validation Checklist:**
- [ ] Session 5 completion confirmed
- [ ] Quote congratulates calibration
- [ ] Quote mentions Skill Map/brain map
- [ ] Quote encourages exploration

**Notes:**
_Record quote text and calibration state here_

---

### Scenario 5: 30-Day Streak (Streak Celebration Quotes)

**Objective:** Verify 30-day milestone triggers streak celebration

**Action:**
1. Simulate 30-day streak (set in localStorage or play 30 days)
2. Play session on day 30
3. Observe post-game quote

**Expected Outcome:**
- Quote celebrates streak achievement
- Quote references consistency/dedication
- Quote encourages continued play

**Example Quotes:**
- "30 days straight? That streak is hotter than a CPU at 95°C."
- "Your brain is now officially a gym rat."
- "I'm calling from a very specific location: the streak zone!"

**Validation Checklist:**
- [ ] 30-day streak confirmed in storage
- [ ] Quote celebrates streak milestone
- [ ] Quote references dedication/consistency
- [ ] Quote feels celebratory

**Notes:**
_Record streak count, quote text here_

---

### Scenario 6: Quote Variety Test (10 Sessions)

**Objective:** Verify no quote repeats back-to-back and variety maintained

**Action:**
1. Play 10 consecutive sessions (varying score/performance)
2. Record each post-game quote
3. Check for variety

**Expected Outcome:**
- No quote repeats consecutively (session N ≠ session N+1)
- At least 7-8 unique quotes across 10 sessions
- Quotes contextually relevant to each session's performance

**Validation Checklist:**
- [ ] Session 1 quote ≠ Session 2 quote
- [ ] Session 2 quote ≠ Session 3 quote
- [ ] Session 3 quote ≠ Session 4 quote
- [ ] Session 4 quote ≠ Session 5 quote
- [ ] Session 5 quote ≠ Session 6 quote
- [ ] Session 6 quote ≠ Session 7 quote
- [ ] Session 7 quote ≠ Session 8 quote
- [ ] Session 8 quote ≠ Session 9 quote
- [ ] Session 9 quote ≠ Session 10 quote
- [ ] Unique quote count: ___ / 10 (target: 7+)

**Quote Log:**

| Session | Score | Context | Quote (first 40 chars) | Repeat? |
|---------|-------|---------|------------------------|---------|
| 1 | | | | - |
| 2 | | | | Y/N |
| 3 | | | | Y/N |
| 4 | | | | Y/N |
| 5 | | | | Y/N |
| 6 | | | | Y/N |
| 7 | | | | Y/N |
| 8 | | | | Y/N |
| 9 | | | | Y/N |
| 10 | | | | Y/N |

---

### Scenario 7: Skill Map Rotation (5 Visits)

**Objective:** Verify Skill Map quotes rotate on each visit

**Action:**
1. Complete calibration (5 sessions)
2. Open Skill Map
3. Close and reopen Skill Map 4 more times (5 total visits)
4. Record quote on each visit

**Expected Outcome:**
- Different quote on each visit
- At least 4 unique quotes across 5 visits
- Quotes contextually relevant to player profile

**Validation Checklist:**
- [ ] Visit 1 quote ≠ Visit 2 quote
- [ ] Visit 2 quote ≠ Visit 3 quote
- [ ] Visit 3 quote ≠ Visit 4 quote
- [ ] Visit 4 quote ≠ Visit 5 quote
- [ ] Unique quote count: ___ / 5 (target: 4+)

**Quote Log:**

| Visit | Streak | Sessions | Quote (first 40 chars) | Repeat? |
|-------|--------|----------|------------------------|---------|
| 1 | | | | - |
| 2 | | | | Y/N |
| 3 | | | | Y/N |
| 4 | | | | Y/N |
| 5 | | | | Y/N |

---

### Scenario 8: Mixed Performance (Relevance Check)

**Objective:** Verify quotes remain relevant across varied performance levels

**Action:**
1. Play diverse sessions:
   - Session A: High score (90+), survive RC, manage phone calls
   - Session B: Low score (< 10), die quickly
   - Session C: Medium score (40-60), combo activated
   - Session D: Die during RC
   - Session E: Achieve personal best
2. Verify each quote feels relevant to that specific session

**Expected Outcome:**
- High score session → celebratory quote
- Low score session → encouraging quote
- RC death session → empathetic quote
- Each quote matches the session's story

**Validation Checklist:**

**Session A (High Score + Events):**
- [ ] Score: ___
- [ ] Quote feels celebratory/achievement-focused
- [ ] Quote references high performance

**Session B (Low Score):**
- [ ] Score: ___
- [ ] Quote feels encouraging/supportive
- [ ] Quote appropriate for struggle

**Session C (Medium + Combo):**
- [ ] Score: ___
- [ ] Combo activated: Y/N
- [ ] Quote feels relevant to combo or general performance

**Session D (RC Death):**
- [ ] Died during RC: Y/N
- [ ] Quote feels empathetic/acknowledges difficulty

**Session E (Personal Best):**
- [ ] Personal best achieved: Y/N
- [ ] Quote celebrates achievement

---

## Pass Criteria

**Story 18.8 PASSES if:**

1. ✅ **Automated Tests:** All 10 tests in `comedy-relevance.test.js` pass
2. ✅ **High Score:** Celebratory quotes for score > 80 (Scenario 1)
3. ✅ **RC Death:** Empathetic quotes when dying during RC (Scenario 2)
4. ✅ **Low Score:** Encouraging quotes for score < 20 (Scenario 3)
5. ✅ **Calibration:** Milestone quotes on session 5 (Scenario 4)
6. ✅ **Streak:** Celebration quotes for 30-day milestone (Scenario 5)
7. ✅ **Variety:** 7+ unique quotes in 10 sessions, no back-to-back repeats (Scenario 6)
8. ✅ **Skill Map:** Different quotes on each visit, 4+ unique in 5 visits (Scenario 7)
9. ✅ **Relevance:** Quotes match context across diverse performance (Scenario 8)
10. ✅ **Tone:** No inappropriate quotes (mocking on struggle, clinical on celebration)

---

## Test Execution Log

**Tester:** _____________________
**Date:** _____________________
**Environment:** Browser: ________ Version: ________

### Automated Tests
- [ ] All 10 tests passed
- [ ] Test output reviewed
- [ ] No errors logged

### Manual Tests
- [ ] Scenario 1: High Score - PASS / FAIL
- [ ] Scenario 2: RC Death - PASS / FAIL
- [ ] Scenario 3: Low Score - PASS / FAIL
- [ ] Scenario 4: Calibration Complete - PASS / FAIL
- [ ] Scenario 5: 30-Day Streak - PASS / FAIL
- [ ] Scenario 6: Quote Variety - PASS / FAIL
- [ ] Scenario 7: Skill Map Rotation - PASS / FAIL
- [ ] Scenario 8: Mixed Performance - PASS / FAIL

### Overall Assessment

**Quote Relevance:** ☐ Excellent ☐ Good ☐ Fair ☐ Poor
**Quote Variety:** ☐ Excellent ☐ Good ☐ Fair ☐ Poor
**Tone Appropriateness:** ☐ Excellent ☐ Good ☐ Fair ☐ Poor

**Issues Found:**
_List any quotes that felt irrelevant, repetitive, or tonally mismatched_

**Recommendations:**
_Suggestions for improving quote relevance or variety_

---

## Final Sign-Off

**Test Status:** ☐ PASS ☐ FAIL

**Signature:** _____________________
**Date:** _____________________

---

## Appendix: Context Tags Reference

**Performance Tags:**
- `high_score` - Score > 80
- `low_score` - Score < 20
- `personal_best` - New all-time high for any domain

**Cognitive Tags:**
- `rc_survived` - Survived 3+ Reverse Controls encounters
- `death_during_rc` - Died while RC active
- `combo_master` - 3+ combo multipliers activated
- `phone_ace` - 6+ phone calls managed

**Milestone Tags:**
- `calibration_complete` - Session 5 completion
- `streak_milestone_7` - 7-day streak
- `streak_milestone_30` - 30-day streak
- `session_50` - 50 sessions completed
- `session_100` - 100 sessions completed

**General Tags:**
- `general` - Universal fallback
- `encouragement` - Supportive tone
- `celebration` - Achievement tone
- `improvement` - Progress recognition

**Quote Pool:**
- 21 callers with 3+ quotes each
- 63+ total quotes across all contexts
- Relevance scoring prioritizes multi-tag matches
