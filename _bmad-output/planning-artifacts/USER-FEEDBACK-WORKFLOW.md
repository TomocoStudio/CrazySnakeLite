# User Feedback → Implementation Workflow
## Complete Guide for Iterating on CrazySnakeLite

**Created for:** CrazySnakeLite MVP
**Date:** 2026-01-29
**Authors:** Alice (Product Owner), Bob (Scrum Master), Charlie (Senior Dev), Dana (QA Engineer), Winston (Architect)

---

## Table of Contents

1. [Overview](#overview)
2. [Phase 1: Collect Feedback](#phase-1-collect-feedback)
3. [Phase 2: Organize Feedback](#phase-2-organize-feedback)
4. [Phase 3: Analyze & Prioritize](#phase-3-analyze--prioritize)
5. [Phase 4: Decide What to Build](#phase-4-decide-what-to-build)
6. [Phase 5: Implement Improvements](#phase-5-implement-improvements)
7. [Phase 6: Test & Iterate](#phase-6-test--iterate)
8. [Decision Tree: Which Workflow to Use](#decision-tree-which-workflow-to-use)
9. [Templates & Tools](#templates--tools)
10. [Best Practices](#best-practices)
11. [Real-World Example](#real-world-example)
12. [Communication with Testers](#communication-with-testers)

---

## Overview

### The Feedback Loop

```
COLLECT → ORGANIZE → ANALYZE → DECIDE → IMPLEMENT → TEST → ITERATE
   ↓          ↓          ↓         ↓          ↓          ↓       ↓
 1-2 weeks | 2 hours | 1 hour | 30 min | 1-5 days | 2 days | Repeat
```

### Why This Process?

After completing Epic 4 with 100% code review rework, we learned:
- Not all feedback is equal (prioritization matters)
- Building everything = wasted effort
- Structured decision-making prevents scope creep
- Quick wins build momentum

### Success Metrics from PRD

**MVP Success (1 Month):**
- 5+ coworkers tested
- 70%+ finish first game
- 50%+ play multiple times
- Qualitative feedback collected

---

## Phase 1: Collect Feedback

**Timeline:** 1-2 weeks
**Goal:** Gather structured feedback from 5-10 testers

### Collection Methods

#### Option A: Structured Feedback Form (Recommended)

Create a feedback form with these sections:

**1. Overall Experience**
- "On a scale of 1-5, how fun was the game?"
- "Would you play it again during your break?" (Yes/No)
- "How many games did you play?" (1, 2-3, 4-5, 6+)

**2. Gameplay Mechanics**
- "Which food effect was most fun?" (Invincibility, Wall-Phase, Speed Boost, etc.)
- "Which food effect was least fun?"
- "Did phone call interruptions feel annoying or exciting?"
- "Was the game too easy, too hard, or just right?"

**3. Technical Performance**
- "Did you experience any bugs, freezes, or problems?" (Describe)
- "Which browser did you use?" (Chrome, Firefox, Safari, Edge)
- "Which device?" (Desktop, Mobile - specify model)
- "Did the game run smoothly?" (Yes/No)

**4. Improvement Ideas**
- "What would make this game better?"
- "What frustrated you the most?"
- "If you could add one feature, what would it be?"

**5. Open Comments**
- "Any other thoughts or reactions?"

**How to deliver:**
- Google Form (easy to collect/analyze)
- Markdown file they email back
- Quick Slack/email survey
- In-person interview (best for detailed insights)

---

#### Option B: Observational Testing

**What:** Play alongside coworkers, observe reactions

**What to capture:**
- Spontaneous laughter, frustration, excitement
- When do they die? What causes it?
- Do they restart immediately or give up?
- Which food effects cause visible reactions?

**Example observations:**
- "Sarah laughed when reverse controls kicked in"
- "Mike died 3 times to speed boost + wall collision"
- "Jessica immediately hit Play Again after first death"

**Why this matters:** Emotional reactions reveal what's fun vs frustrating

---

#### Option C: Analytics (Post-MVP)

**Future enhancement:** Track automatically
- Session starts/completions
- Food types consumed
- Phone call dismiss times
- Death causes

**For MVP:** Manual feedback is sufficient

---

### Feedback Collection Checklist

- ✅ Share game URL with 5-10 coworkers
- ✅ Provide feedback form or survey
- ✅ Set deadline (1 week to play and respond)
- ✅ Observe at least 2-3 people playing live
- ✅ Take notes on spontaneous reactions
- ✅ Collect all responses in one place

---

## Phase 2: Organize Feedback

**Timeline:** 1-2 hours after collection complete
**Goal:** Structure raw feedback into analyzable format

### Create Feedback Document

**File:** `_bmad-output/user-feedback-round-1.md`

**Template Structure:**

```markdown
# User Feedback - Round 1

**Collection Period:** [Start Date] to [End Date]
**Number of Testers:** X coworkers
**Game Version:** MVP v1.0 (Epics 1-4 complete)
**Game URL:** https://YOUR_USERNAME.github.io/CrazySnakeLite

---

## Executive Summary

**Key Findings:**
- Overall fun rating: X.X/5 average
- Completion rate: X out of Y finished first game (X%)
- Return rate: X out of Y played multiple games (X%)
- Critical bugs: X identified
- Top requested feature: [Feature] (X mentions)

**Recommendation:** [Fix bugs immediately / Iterate on mechanics / Major changes needed]

---

## Detailed Feedback by Category

### 🎮 Gameplay & Mechanics

#### What Players Loved ❤️

**Food Effects:**
- "Speed boost food is thrilling and challenging" (3 mentions)
- "Invincibility lets me play aggressively" (2 mentions)

**Phone Calls:**
- "Phone calls create real tension - genius mechanic!" (4 mentions)
- "Laughed at the caller names" (3 mentions)

**Overall Feel:**
- "Perfect length for a quick break" (5 mentions)
- "More strategic than regular Snake" (2 mentions)

#### What Players Struggled With 😤

**Difficulty:**
- "Game gets too hard too fast after 30 seconds" (3 mentions)
- "Can't keep up when speed boost spawns repeatedly" (2 mentions)

**Controls:**
- "Reverse controls too disorienting - died immediately" (2 mentions)
- "Wish there was a practice mode" (1 mention)

**Food Effects:**
- "Wall-phase is confusing - didn't understand it wraps" (2 mentions)
- "Speed decrease feels like punishment, not fun" (1 mention)

#### Feature Requests 💡

**High Interest (3+ mentions):**
- "Want to compete with coworkers on a leaderboard" (4 mentions)
- "Need difficulty levels - easy/normal/hard" (3 mentions)

**Medium Interest (2 mentions):**
- "More variety in phone caller names" (2 mentions)
- "Would love background music" (2 mentions)

**Low Interest (1 mention):**
- "Different snake skins or colors" (1 mention)
- "Power-up combinations" (1 mention)
- "Daily challenges" (1 mention)

---

### 🐛 Technical Issues

#### Bugs & Problems

**Critical (Game-breaking):**
- "High score doesn't save on iPhone Safari" (1 mention - Mobile)
- "Game freezes after eating 5 foods rapidly" (1 mention - Firefox)

**Major (Impacts experience):**
- "Audio cuts out randomly on Safari desktop" (2 mentions - Safari)
- "Lag spikes when phone call appears" (1 mention - Old laptop)

**Minor (Annoying but playable):**
- "Menu button sometimes requires two clicks" (1 mention - Chrome mobile)
- "Score display overlaps with game on small screens" (1 mention - Mobile)

#### Performance Reports

**Smooth Experience:**
- Chrome Desktop (5/5 testers) ✅
- Firefox Desktop (3/3 testers) ✅
- Edge Desktop (1/1 tester) ✅

**Issues Reported:**
- Safari Desktop: Audio problems (2/2 testers)
- Safari iOS: High score not saving (1/1 tester)
- Older devices: Lag when phone call triggers (1 tester)

---

### 😊 Emotional Reactions & Quotes

**Positive Reactions:**
- "I laughed out loud when my boss called mid-game!" - Sarah
- "The chaos is perfect for a quick break. Played 5 times." - Mike
- "More addictive than I expected. Shared with whole team." - Jessica
- "Finally, Snake is interesting again!" - David

**Frustration Points:**
- "Died 10 times in a row to speed boost + walls. Gave up." - Alex
- "Reverse controls made me rage quit. Too much." - Maria

**Surprise & Delight:**
- "Didn't expect phone calls - that's hilarious!" (4 mentions)
- "Speed boost is terrifying in a good way" (3 mentions)

---

### 📊 Quantitative Data

| Metric | Count | Percentage |
|--------|-------|------------|
| Testers | 8 | 100% |
| Completed first game | 7 | 87.5% |
| Played 2+ games | 6 | 75% |
| Played 5+ games | 3 | 37.5% |
| Reported bugs | 4 | 50% |
| Would recommend | 7 | 87.5% |

**Fun Rating Distribution:**
- 5 stars: 3 testers (37.5%)
- 4 stars: 4 testers (50%)
- 3 stars: 1 tester (12.5%)
- 2 stars: 0 testers
- 1 star: 0 testers

**Average: 4.25/5** ⭐⭐⭐⭐

---

### 🎯 Success Criteria Assessment

**From PRD:**

| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Finish first game | 70%+ | 87.5% | ✅ PASS |
| Play multiple games | 50%+ | 75% | ✅ PASS |
| Coworker testers | 5+ | 8 | ✅ PASS |
| Technical issues | None critical | 2 critical bugs | ⚠️ ACTION NEEDED |

**Verdict:** MVP is FUN and engaging, but critical bugs must be fixed before wider release.

---

## Raw Feedback (Unedited)

### Tester 1: Sarah (Chrome Desktop)
- Fun rating: 5/5
- Played: 7 games
- "Absolutely loved it! The phone calls are genius - I was laughing so hard when 'Your Conscience' called. Speed boost is thrilling but manageable. Only issue: sometimes the menu button needs two clicks on my phone."

### Tester 2: Mike (Safari Desktop)
- Fun rating: 4/5
- Played: 5 games
- "Really fun for breaks. Phone calls create great tension. BUT the audio cuts out randomly on Safari - super annoying. Also, game gets HARD fast. Would love an easy mode."

[Continue for all testers...]

---

## Next Steps

1. **Fix Critical Bugs:**
   - Safari audio cutting out
   - iPhone high score not saving

2. **Quick Wins:**
   - Add 20+ more phone caller names

3. **Plan Features:**
   - Difficulty levels (high demand)
   - Leaderboard (medium demand, high effort)

4. **Round 2 Testing:**
   - Deploy fixes
   - Ask same testers to retest
   - Collect Round 2 feedback
```

---

### Organization Tips

**Group by theme, not by tester:**
- ❌ Bad: "Tester 1 said X, Y, Z. Tester 2 said A, B, C."
- ✅ Good: "3 testers mentioned difficulty. 2 testers requested leaderboard."

**Count mentions:**
- Track how many people mention each issue/request
- High mention count = high confidence

**Separate bugs from features:**
- Bugs: Things that don't work as designed
- Features: New things people want

**Capture emotion:**
- Direct quotes reveal what's fun vs frustrating
- "I laughed" = delight
- "I rage quit" = problem

---

## Phase 3: Analyze & Prioritize

**Timeline:** 1 hour (team session or solo with framework)
**Goal:** Score and rank feedback items for implementation

### ICE Prioritization Framework

**ICE = Impact × Confidence × Ease**

Higher ICE score = Higher priority

#### Impact (1-10)

**Question:** How much will this improve the user experience?

| Score | Description | Example |
|-------|-------------|---------|
| 10 | Game-changing improvement | Fix critical bug that blocks 50% of users |
| 8-9 | Major enhancement | Add difficulty levels (highly requested) |
| 6-7 | Notable improvement | Add more phone callers (nice variety) |
| 4-5 | Minor improvement | Different snake colors |
| 1-3 | Negligible impact | Trivial cosmetic change |

---

#### Confidence (1-10)

**Question:** How sure are we users want this?

| Score | Description | Example |
|-------|-------------|---------|
| 10 | Hard data or universal feedback | 8 out of 8 testers mentioned it |
| 8-9 | Strong signal | 5+ testers mentioned it |
| 6-7 | Moderate signal | 2-3 testers mentioned it |
| 4-5 | Weak signal | 1 tester mentioned it |
| 1-3 | Speculation | We think users might want this |

---

#### Ease (1-10)

**Question:** How easy is this to implement?

| Score | Description | Estimated Effort | Example |
|-------|-------------|------------------|---------|
| 10 | Trivial | < 1 hour | Add phone caller names to array |
| 8-9 | Very easy | 1-2 hours | Fix simple bug, CSS tweak |
| 6-7 | Moderate | 3-8 hours | New menu screen, config changes |
| 4-5 | Challenging | 1-2 days | Difficulty system, new game mode |
| 2-3 | Very hard | 3-5 days | Leaderboard with backend |
| 1 | Massive | 1+ weeks | Multiplayer, total redesign |

**Note:** Use Epic 4 experience as reference. Story 4.5 was ease=3 (wrong tech choice, architect review, 3 cycles).

---

### ICE Scoring Template

Create a table in your feedback document:

| Feedback Item | Impact | Confidence | Ease | ICE Score | Priority |
|---------------|--------|------------|------|-----------|----------|
| Fix Safari audio bug | 8 | 10 | 7 | 560 | 🔴 CRITICAL |
| Fix iPhone high score bug | 9 | 10 | 8 | 720 | 🔴 CRITICAL |
| Add 20 more phone callers | 6 | 6 | 10 | 360 | 🟢 HIGH |
| Add difficulty levels | 9 | 8 | 4 | 288 | 🟡 MEDIUM |
| Add leaderboard | 7 | 7 | 2 | 98 | 🟡 MEDIUM |
| Add background music | 5 | 4 | 6 | 120 | 🔵 LOW |
| Snake skins/colors | 4 | 2 | 7 | 56 | 🔵 LOW |
| Wall-phase tutorial | 6 | 4 | 8 | 192 | 🟡 MEDIUM |

**Sort by ICE score (high to low)**

---

### Priority Categories

After ICE scoring, assign to categories:

#### 🔴 CRITICAL (Fix Immediately)

**Criteria:**
- Game-breaking bugs
- Data loss issues (saves not working)
- Performance problems affecting majority
- Security vulnerabilities

**Timeline:** Fix within 1-2 days
**Workflow:** `/bmad:bmm:workflows:quick-dev`

**Example:**
- Safari audio cutting out (ICE: 560)
- iPhone high score not saving (ICE: 720)

---

#### 🟢 HIGH PRIORITY (Next Sprint)

**Criteria:**
- High ICE score (300+)
- Easy wins (high ease, decent impact)
- Highly requested (3+ mentions)
- Quick implementation

**Timeline:** Implement within 1 week
**Workflow:** `/bmad:bmm:workflows:quick-dev` or `/quick-spec`

**Example:**
- Add 20 more phone callers (ICE: 360, easy win)
- Fix menu double-click issue (ICE: 320)

---

#### 🟡 MEDIUM PRIORITY (Future Iteration)

**Criteria:**
- Moderate ICE score (100-300)
- Nice-to-have features
- Requires planning
- Moderate effort

**Timeline:** Plan and implement in 2-4 weeks
**Workflow:** `/bmad:bmm:workflows:quick-spec` then `/quick-dev` or `/create-story`

**Example:**
- Difficulty levels (ICE: 288, requires design)
- Leaderboard (ICE: 98, requires backend research)
- Wall-phase tutorial (ICE: 192)

---

#### 🔵 LOW PRIORITY (Backlog)

**Criteria:**
- Low ICE score (< 100)
- Single-tester request
- Low confidence
- High effort, low impact

**Timeline:** Revisit later or never
**Workflow:** Document in backlog, don't implement yet

**Example:**
- Snake skins (ICE: 56)
- Background music (ICE: 120)
- Daily challenges (ICE: 45)

---

### Prioritization Tips

**1. Bugs Always Trump Features**
- Fix critical bugs before adding features
- Users forgive missing features, not broken ones

**2. Easy Wins Build Momentum**
- Quick wins (high ease + decent impact) = fast user satisfaction
- "We added 20 more callers!" feels responsive

**3. Don't Build Everything**
- If only 1 person mentioned it = low confidence
- Save low-priority items for later

**4. Consider Cumulative Effort**
- 10 small fixes might take longer than 1 big feature
- Batch related improvements

**5. Align with Vision**
- Core vision: "Break-time Snake with strategic chaos"
- ✅ Fits: More chaos elements, difficulty settings
- ❌ Doesn't fit: Story mode, turn-based gameplay

---

## Phase 4: Decide What to Build

**Timeline:** 30 minutes (team decision or solo review)
**Goal:** Finalize what makes the cut for implementation

### Decision Framework

Use these questions for each prioritized item:

#### Question 1: Is This an Enhancement or New Feature?

**Enhancement:** Improves existing functionality
- Examples: More phone callers, better mobile layout, bug fixes
- **Action:** Usually implement with `/quick-dev`
- **Effort:** Lower (works with existing architecture)

**New Feature:** Adds new functionality
- Examples: Difficulty levels, leaderboard, tutorial mode
- **Action:** Spec first with `/quick-spec`, then implement
- **Effort:** Higher (requires design, testing, integration)

---

#### Question 2: Does This Align with Core Vision?

**Core Vision:** "Break-time Snake with strategic chaos"

**Primary Goals:**
- Quick, engaging gameplay (5-10 minute sessions)
- Strategic depth from food effects
- Chaotic fun from phone interruptions
- Social sharing (coworkers competing)

**Alignment Check:**

| Feature Request | Aligns? | Reasoning |
|-----------------|---------|-----------|
| Difficulty levels | ✅ YES | Makes game accessible to more players |
| Leaderboard | ✅ YES | Supports coworker competition |
| Background music | ⚠️ MAYBE | Might distract from break-time use |
| Story mode | ❌ NO | Contradicts "quick break" goal |
| Turn-based mode | ❌ NO | Loses real-time chaos |
| More food effects | ✅ YES | Core mechanic enhancement |

**Decision Rule:** If it doesn't align, defer to backlog or reject.

---

#### Question 3: What's the Effort vs Impact?

**Quick Wins (Do First):**
- High impact, low effort
- ICE score > 300, Ease > 7
- Example: Add phone callers (ICE: 360, Ease: 10)

**Big Bets (Plan Carefully):**
- High impact, high effort
- ICE score > 200, Ease < 5
- Example: Difficulty levels (ICE: 288, Ease: 4)

**Time Sinks (Defer or Drop):**
- Low impact, high effort
- ICE score < 100, Ease < 5
- Example: Complex animations (ICE: 60, Ease: 3)

---

### Decision Template

For each item in your prioritized list:

```markdown
## Decision: [Feature/Fix Name]

**ICE Score:** [Score] | **Priority:** [CRITICAL/HIGH/MEDIUM/LOW]

**What is it?**
[Brief description of the request]

**Why are users asking for this?**
[Root cause: "Game too hard" → Difficulty levels]

**Alignment Check:**
- Enhances core gameplay? [Yes/No]
- Aligns with vision? [Yes/No]
- Requested by multiple users? [Yes/No]

**Effort Analysis:**
- Estimated hours: [X-Y hours]
- Dependencies: [None / Requires X]
- Risk: [Low/Medium/High]

**Decision:**
- ✅ IMPLEMENT NOW (Critical/High priority)
- 📋 PLAN & IMPLEMENT (Medium priority, spec first)
- 🗂️ BACKLOG (Low priority, defer)
- ❌ REJECT (Doesn't align with vision)

**If implementing, which workflow?**
- `/quick-dev` (bugs, small enhancements)
- `/quick-spec` → `/quick-dev` (medium features)
- `/create-story` (large features tied to epic)

**Owner:** [Name]
**Target completion:** [Date]
```

---

### Example Decision Session

**Scenario:** After Round 1 feedback, you have these top items:

1. Fix Safari audio bug (ICE: 560)
2. Fix iPhone high score (ICE: 720)
3. Add 20 more phone callers (ICE: 360)
4. Add difficulty levels (ICE: 288)
5. Add leaderboard (ICE: 98)

**Team Discussion:**

---

**Item 1: Fix Safari audio bug**

**Decision:** ✅ IMPLEMENT NOW
- Priority: CRITICAL (affects 25% of users)
- Workflow: `/quick-dev`
- Owner: Charlie
- Timeline: Today
- Reasoning: Bugs block before features

---

**Item 2: Fix iPhone high score**

**Decision:** ✅ IMPLEMENT NOW
- Priority: CRITICAL (data loss)
- Workflow: `/quick-dev`
- Owner: Charlie
- Timeline: Today
- Reasoning: High score persistence is core feature

---

**Item 3: Add 20 more phone callers**

**Decision:** ✅ IMPLEMENT NOW (Quick Win)
- Priority: HIGH (easy win, decent impact)
- Workflow: `/quick-dev`
- Owner: Charlie
- Timeline: Today (15 minutes)
- Reasoning: Fast user satisfaction, low effort

---

**Item 4: Add difficulty levels**

**Decision:** 📋 PLAN & IMPLEMENT
- Priority: MEDIUM (high demand, moderate effort)
- Workflow: `/quick-spec` (plan approach) → `/quick-dev` (implement)
- Owner: Winston (spec), then Charlie (implement)
- Timeline: Next week (2-3 days total)
- Reasoning: Requires design decisions (how many levels? what changes?), but highly requested

---

**Item 5: Add leaderboard**

**Decision:** 🗂️ BACKLOG
- Priority: LOW (requires backend, major scope change)
- Reasoning: Current MVP is client-side only. Leaderboard needs database, authentication, API. Significant architectural change. Defer to "Phase 2" after MVP validation.
- Alternative: Consider localStorage-based "personal best" leaderboard (easier, client-side)

---

### Decision Summary

**Implement Immediately (This Week):**
1. ✅ Fix Safari audio bug (Critical)
2. ✅ Fix iPhone high score bug (Critical)
3. ✅ Add 20 more phone callers (Quick win)

**Plan & Implement (Next Week):**
4. 📋 Difficulty levels (Spec first, then build)

**Defer to Backlog:**
5. 🗂️ Leaderboard (Requires backend, revisit in Phase 2)
6. 🗂️ Background music (Low priority)
7. 🗂️ Snake skins (Low priority)

**Reject:**
- ❌ Story mode (Doesn't align with vision)

---

## Phase 5: Implement Improvements

**Timeline:** 1-5 days depending on scope
**Goal:** Execute on prioritized decisions

### Implementation by Complexity

#### For Quick Fixes & Small Enhancements

**Use:** `/bmad:bmm:workflows:quick-dev`

**When to use:**
- Bug fixes
- Simple enhancements (< 2 hours)
- No planning needed

**Example 1: Add Phone Callers**

```bash
/bmad:bmm:workflows:quick-dev

Instructions: "Add 25 new funny phone caller names to the CALLERS array in js/phone.js.

Categories to include:
- Work-related: Recruiter, IT Support, Conference Call, LinkedIn Notification
- Personal: Dentist Reminder, Gym Membership, Student Loans, Credit Card Company
- Absurd: Time Travel Bureau, Alien Embassy, Past You, Future You, Snake Headquarters
- Meta: Game Over (calling early), Achievement Unlocked, Your High Score

Use existing format and maintain retro humor style."
```

**Example 2: Fix Safari Audio Bug**

```bash
/bmad:bmm:workflows:quick-dev

Instructions: "Fix audio cutting out in Safari desktop browser.

Bug: Audio plays initially but stops after 5-10 moves.
Root cause investigation needed:
- Check Web Audio API compatibility in Safari
- Verify AudioContext state management
- Test AudioBufferSourceNode creation/cleanup
- Add Safari-specific handling if needed

Test on Safari desktop and iOS after fix."
```

---

#### For Medium Features (Requires Planning)

**Use:** `/bmad:bmm:workflows:quick-spec` → `/bmad:bmm:workflows:quick-dev`

**When to use:**
- New features needing design decisions
- Multiple implementation approaches possible
- Moderate complexity (3-8 hours)

**Example: Difficulty Levels**

**Step 1: Spec the approach**

```bash
/bmad:bmm:workflows:quick-spec

Objective: "Design difficulty level system (easy/normal/hard) for CrazySnakeLite.

Requirements:
- Three difficulty levels: Easy, Normal (current), Hard
- Easy: Slower snake, more time to react
- Hard: Faster snake, higher food effect probability
- User selects difficulty on main menu
- Difficulty affects: snake speed, food spawn probability, phone call frequency

Questions to answer:
- Where to store difficulty setting? (localStorage or session only)
- What exact speeds for each level? (config.js values)
- Do food probabilities change per level?
- Do phone calls change per level?
- UI design for difficulty selector (buttons? dropdown?)

Deliverable: Technical specification with config values and implementation plan."
```

**Step 2: Implement the spec**

```bash
/bmad:bmm:workflows:quick-dev

Instructions: "Implement difficulty levels based on the spec from quick-spec workflow.

Use the config values and approach documented in the spec.
Follow quality checklist from Epic 4 retro before marking complete."
```

---

#### For Large Features (Tied to Epic)

**Use:** `/bmad:bmm:workflows:create-story`

**When to use:**
- Significant new functionality
- Part of larger epic
- Multiple days of work
- Requires acceptance criteria, testing, review

**Example: Leaderboard System**

```bash
/bmad:bmm:workflows:create-story

Epic: 5 (Social Features)
Story: Add Leaderboard

User Story:
As a player, I want to see a leaderboard of top scores, so that I can compete with coworkers.

Acceptance Criteria:
- Leaderboard displays top 10 scores
- Shows player name and score
- Persists across sessions
- Updates when new high score achieved
- Accessible from main menu

[Workflow will create full story with tasks, context, testing requirements]
```

**Note:** Only use this for major features. Most post-MVP improvements use quick-dev or quick-spec.

---

### Quality Checklist (From Epic 4 Retro)

**Before marking ANY implementation complete, verify:**

- ✅ **Validation:** All inputs validated (NaN, undefined, negative, type checks)
- ✅ **Error Handling:** Try/catch blocks, graceful degradation, console warnings
- ✅ **Performance:** 60 FPS maintained, no unnecessary DOM updates
- ✅ **Completeness:** All acceptance criteria met (not just happy path)
- ✅ **Aesthetic Consistency:** Matches retro pixel art theme
- ✅ **Cleanup:** Event listeners removed, no memory leaks
- ✅ **Accessibility:** Keyboard support where appropriate

**Why:** Epic 4 had 100% code review rework because we skipped this checklist. Don't repeat those mistakes.

---

### Implementation Workflow

**Daily implementation routine:**

```bash
# 1. Pull latest code
cd /Users/anthonysalvi/code/CrazySnakeLite
git pull

# 2. Implement improvement
/bmad:bmm:workflows:quick-dev "Your task here"

# 3. Test locally
# - Verify fix/feature works
# - Check quality checklist
# - Test on relevant browsers

# 4. Commit and push
git add .
git commit -m "Fix Safari audio bug

- Added Safari-specific AudioContext handling
- Verified audio plays continuously
- Tested on Safari desktop and iOS

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push

# 5. Wait for GitHub Pages deploy (1-2 minutes)
# 6. Test on live site
# 7. Move to next item
```

---

### Batch Related Changes

**Good approach:**
```bash
# Day 1: Fix all critical bugs
/quick-dev "Fix Safari audio"
/quick-dev "Fix iPhone high score"
git push

# Day 2: Add quick wins
/quick-dev "Add 25 phone callers"
/quick-dev "Fix menu double-click"
git push

# Day 3-4: Plan and implement difficulty
/quick-spec "Design difficulty system"
/quick-dev "Implement difficulty based on spec"
git push
```

**Bad approach:**
```bash
# Deploy 10 times for 10 changes (inefficient)
/quick-dev "Fix bug 1"
git push
/quick-dev "Fix bug 2"
git push
# ... repeat 8 more times
```

**Why batch:** Faster iteration, easier testing, cleaner git history

---

## Phase 6: Test & Iterate

**Timeline:** 2 days after implementation
**Goal:** Verify improvements and prepare for Round 2 feedback

### Testing Checklist

After implementing improvements:

**Functional Testing:**
- ✅ New feature works as intended
- ✅ Bug is actually fixed (not just hidden)
- ✅ Edge cases covered

**Regression Testing:**
- ✅ Didn't break existing features
- ✅ All menus still work
- ✅ Score tracking still correct
- ✅ Audio still plays
- ✅ Phone calls still appear

**Cross-Browser Testing:**
- ✅ Chrome desktop (primary)
- ✅ Firefox desktop
- ✅ Safari desktop (if Safari bugs were reported)
- ✅ Mobile browsers (if mobile issues reported)

**Performance Testing:**
- ✅ Still 60 FPS during gameplay
- ✅ No new lag or freezing
- ✅ Load time < 3 seconds

---

### Round 2 Feedback

**After deploying improvements:**

1. **Notify testers:** "We've implemented your feedback - please retest!"
2. **Target feedback:** Ask specifically about changes
   - "Did the Safari audio fix work for you?"
   - "Do the new difficulty levels feel right?"
3. **Short survey:** 3-5 focused questions
4. **Compare results:** Round 1 vs Round 2

**Round 2 Questions:**

1. "We fixed [X bugs]. Are these working now?" (Yes/No)
2. "We added [Y feature]. How does it feel?" (1-5 rating)
3. "Is the game more fun than last week?" (Yes/No/Same)
4. "What's the #1 thing to improve next?"
5. "Would you recommend this to other teams?" (Yes/No)

---

### Iteration Decision Point

**After Round 2, decide:**

**Option A: Keep Iterating (More Feedback Rounds)**
- If: Users love it but have more requests
- Action: Implement Round 2 priorities, collect Round 3 feedback
- Timeline: 1-2 week cycles

**Option B: Launch Wider (Share Beyond Coworkers)**
- If: Feedback is positive (4+ stars), bugs fixed, core features solid
- Action: Share on social media, Reddit, product communities
- Prepare for larger user base

**Option C: Pivot (Major Changes Needed)**
- If: Feedback reveals fundamental problems
- Action: Return to PRD/architecture, rethink core mechanics
- Example: "Too hard" feedback persists → rethink food effects

**Option D: Declare MVP Complete (Move to Maintenance)**
- If: Coworkers love it, no critical requests, ready to move on
- Action: Minimal updates, focus on next project
- Keep game live for break-time use

---

## Decision Tree: Which Workflow to Use?

```
User Feedback Received
    ↓
Is it a bug or critical issue?
    ├─ YES → Is it breaking the game?
    │           ├─ YES → /quick-dev (CRITICAL - fix today)
    │           └─ NO → /quick-dev (fix this week)
    │
    └─ NO → Is it a feature request?
            ├─ YES → How many users requested it?
            │           ├─ 3+ users → High priority
            │           │      ↓
            │           │   Is it a small enhancement (< 2 hours)?
            │           │      ├─ YES → /quick-dev (quick win)
            │           │      └─ NO → Needs planning?
            │           │              ├─ YES → /quick-spec → /quick-dev
            │           │              └─ NO → /create-story (if major)
            │           │
            │           └─ 1-2 users → Medium/Low priority
            │                  ↓
            │              Is effort LOW (< 2 hours)?
            │                  ├─ YES → /quick-dev (easy win)
            │                  └─ NO → Backlog (defer)
            │
            └─ Is it feedback about difficulty/balance?
                    └─ → /quick-spec (design solution) → /quick-dev
```

---

### Quick Reference Guide

| Scenario | Workflow | Timeline | Example |
|----------|----------|----------|---------|
| Critical bug | `/quick-dev` | Same day | Safari audio, high score not saving |
| Small bug | `/quick-dev` | This week | Menu double-click, score overlap |
| Easy enhancement | `/quick-dev` | 1-2 hours | Add phone callers, CSS tweak |
| Medium feature (plan first) | `/quick-spec` → `/quick-dev` | 2-3 days | Difficulty levels, tutorial |
| Large feature (epic-sized) | `/create-story` | 3-5 days | Leaderboard, multiplayer |
| Balance/design issue | `/quick-spec` | 1 day | Food probability tuning |

---

## Templates & Tools

### Template 1: Feedback Collection Form

**File:** `_bmad-output/feedback-form-template.md`

```markdown
# CrazySnakeLite Feedback Form

**Your Name (optional):** ___________
**Date Played:** ___________
**Browser:** [ ] Chrome [ ] Firefox [ ] Safari [ ] Edge [ ] Mobile
**Device:** [ ] Desktop [ ] Mobile (model: _______)

---

## Overall Experience

1. **How fun was the game?**
   [ ] 1 - Not fun [ ] 2 [ ] 3 [ ] 4 [ ] 5 - Very fun

2. **Would you play it again during your break?**
   [ ] Yes [ ] No

3. **How many games did you play?**
   [ ] 1 [ ] 2-3 [ ] 4-5 [ ] 6+

4. **Did you play it to the end or give up?**
   [ ] Finished multiple games [ ] Gave up after a few tries

---

## Gameplay

5. **Which food effect was MOST FUN?**
   [ ] Invincibility (yellow)
   [ ] Wall-Phase (purple)
   [ ] Speed Boost (red)
   [ ] Speed Decrease (cyan)
   [ ] Reverse Controls (orange)
   [ ] Growing (green)

6. **Which food effect was LEAST FUN?**
   [ ] Invincibility [ ] Wall-Phase [ ] Speed Boost
   [ ] Speed Decrease [ ] Reverse Controls [ ] Growing

7. **Did phone call interruptions feel:**
   [ ] Exciting and fun [ ] Annoying [ ] Just right

8. **Was the game difficulty:**
   [ ] Too easy [ ] Just right [ ] Too hard

9. **What caused most of your deaths?**
   [ ] Wall collisions [ ] Self-collision [ ] Phone distractions
   [ ] Speed boost chaos [ ] Reverse controls [ ] Other: _____

---

## Technical

10. **Did you experience any bugs, freezes, or problems?**
    [ ] No issues
    [ ] Yes: ___________________________________________

11. **Did the game run smoothly?**
    [ ] Yes, perfectly smooth
    [ ] Mostly smooth with occasional lag
    [ ] Noticeable performance issues

12. **Did sounds/audio work correctly?**
    [ ] Yes [ ] No [ ] Sometimes cut out

13. **Did your high score save correctly?**
    [ ] Yes [ ] No [ ] Didn't check

---

## Improvements

14. **What would make this game BETTER?**
    _________________________________________________
    _________________________________________________

15. **What FRUSTRATED you the most?**
    _________________________________________________
    _________________________________________________

16. **If you could add ONE feature, what would it be?**
    _________________________________________________
    _________________________________________________

---

## Open Comments

17. **Any other thoughts, reactions, or ideas?**
    _________________________________________________
    _________________________________________________
    _________________________________________________

---

**Thank you for testing CrazySnakeLite! 🐍**
```

---

### Template 2: Feedback Analysis Document

**File:** `_bmad-output/feedback-analysis-template.md`

```markdown
# Feedback Analysis - Round [X]

**Date:** [Date]
**Testers:** [Number]
**Game Version:** [Version]

---

## Executive Summary

**Key Findings:**
- Average fun rating: X.X/5
- Completion rate: X%
- Return rate: X%
- Critical bugs: [Number]
- Top requested feature: [Feature]

**Recommendation:** [1-2 sentence decision]

---

## Top Themes

1. **[Theme]** (X mentions)
   - [Supporting quote or detail]

2. **[Theme]** (X mentions)
   - [Supporting quote or detail]

3. **[Theme]** (X mentions)
   - [Supporting quote or detail]

---

## ICE Prioritization

| Item | Impact | Confidence | Ease | ICE | Priority |
|------|--------|------------|------|-----|----------|
|      |        |            |      |     |          |
|      |        |            |      |     |          |

---

## Decisions

### ✅ Implement Now (Critical/High)
1. [Item] - Timeline: [Date]
2. [Item] - Timeline: [Date]

### 📋 Plan & Implement (Medium)
1. [Item] - Timeline: [Date]
2. [Item] - Timeline: [Date]

### 🗂️ Backlog (Low)
1. [Item] - Reason: [Why deferring]
2. [Item] - Reason: [Why deferring]

### ❌ Not Doing
1. [Item] - Reason: [Why rejecting]

---

## Action Items

1. **[Task]**
   - Owner: [Name]
   - Deadline: [Date]
   - Workflow: [Which workflow to use]

2. **[Task]**
   - Owner: [Name]
   - Deadline: [Date]
   - Workflow: [Which workflow to use]

---

## Next Steps

1. [Step]
2. [Step]
3. [Step]
```

---

### Template 3: Round 2 Feedback Form (Focused)

**File:** `_bmad-output/feedback-form-round-2-template.md`

```markdown
# CrazySnakeLite Round 2 Feedback

**Your Name:** ___________
**Date:** ___________

---

## What We Fixed/Added

Based on your Round 1 feedback, we:
- ✅ Fixed Safari audio bug
- ✅ Fixed iPhone high score saving
- ✅ Added 25 new phone caller names
- ✅ Added difficulty levels (easy/normal/hard)

---

## Round 2 Questions

1. **Did the [Bug X] fix work for you?**
   [ ] Yes, completely fixed
   [ ] Partially better
   [ ] Still broken
   [ ] Didn't experience this bug

2. **Did the [Bug Y] fix work for you?**
   [ ] Yes, completely fixed
   [ ] Partially better
   [ ] Still broken
   [ ] Didn't experience this bug

3. **We added [Feature X]. How does it feel?**
   [ ] 1 - Didn't improve game
   [ ] 2
   [ ] 3
   [ ] 4
   [ ] 5 - Major improvement

4. **Is the game more fun than last week?**
   [ ] Yes, much better
   [ ] Slightly better
   [ ] About the same
   [ ] Worse

5. **What's the #1 thing to improve NEXT?**
   _________________________________________________

6. **Would you recommend this game to other teams?**
   [ ] Yes [ ] No

7. **Any new issues or bugs?**
   _________________________________________________

---

**Thank you for retesting! 🙏**
```

---

## Best Practices

### 1. Don't React to Every Piece of Feedback

**Bad Approach:**
- "One person said X, let's build it immediately!"
- Building everything = wasted effort

**Good Approach:**
- "Three people mentioned X → high confidence, prioritize it"
- "One person mentioned Y → interesting, but low confidence, backlog it"

**Rule of Thumb:**
- 1 mention = Low confidence (backlog unless critical bug)
- 2 mentions = Medium confidence (consider if easy)
- 3+ mentions = High confidence (prioritize)

---

### 2. Bugs Before Features

**Why:** Broken features damage trust more than missing features

**Priority Order:**
1. Critical bugs (data loss, crashes, blocks gameplay)
2. Major bugs (affects experience but playable)
3. Quick wins (easy features, high delight)
4. Medium features (requires planning)
5. Minor bugs (annoying but doesn't break flow)
6. Low-priority features

**Example:**
- Fix "high score not saving" before adding "leaderboard"
- Fix "audio cutting out" before adding "background music"

---

### 3. Quick Wins First

**What's a quick win?**
- High Ease (7-10)
- Decent Impact (5-7)
- Low risk
- Fast user satisfaction

**Examples:**
- Adding phone caller names (15 minutes, high delight)
- CSS tweaks for mobile (30 minutes, better UX)
- Adjusting food spawn probability (5 minutes, balances gameplay)

**Why prioritize:** Users see responsiveness, builds momentum

---

### 4. Validate Assumptions Before Building

**Scenario:** "Users want difficulty levels"

**Bad Approach:**
- Immediately build easy/normal/hard/expert/nightmare modes
- Spend 5 days on complex system
- Turns out users just wanted "slightly easier" option

**Good Approach:**
```bash
# Step 1: Ask clarifying questions
"When you say difficulty levels, what specifically?
- Slower snake speed?
- Fewer food effects?
- Easier food effects only?
- Practice mode with no phone calls?"

# Step 2: Propose simple solution
"What if we just add an 'Easy Mode' button that slows snake speed by 25%?"

# Step 3: Validate
"Would that solve your problem?" → If yes, build simple version first
```

**Spec it out:**
```bash
/quick-spec "Design minimal viable difficulty system"
```

---

### 5. Use Quality Checklist (Learned from Epic 4)

**Epic 4 Lesson:** 100% code review rework because we skipped quality checks

**Prevent this:**
- ✅ Run through checklist BEFORE marking done
- ✅ No exceptions ("but it's just a small fix")
- ✅ Treat checklist as mandatory gate

**Quality Checklist:**
1. Validation (NaN, undefined, negative values)
2. Error handling (try/catch, console warnings)
3. Performance (60 FPS, no unnecessary updates)
4. Completeness (all ACs, not just happy path)
5. Aesthetic consistency (retro theme)
6. Cleanup (event listeners, memory leaks)
7. Accessibility (keyboard support)

**Result:** Ship quality code first time, avoid rework

---

### 6. Batch Small Changes

**Bad workflow:**
```bash
# Fix bug 1
git commit "fix 1"
git push
# Wait for deploy (2 min)

# Fix bug 2
git commit "fix 2"
git push
# Wait for deploy (2 min)

# ... repeat 10 times = 20 minutes waiting
```

**Good workflow:**
```bash
# Fix all bugs in one session
/quick-dev "Fix Safari audio"
/quick-dev "Fix high score bug"
/quick-dev "Add phone callers"

# Commit all together
git add .
git commit -m "Fix critical bugs and add phone callers"
git push
# Wait once (2 min)

# Test everything together
```

**Benefits:**
- Faster iteration
- Easier testing (one deploy)
- Cleaner git history
- Less context switching

---

### 7. Communicate Progress to Testers

**Why:** Shows you're listening, builds engagement

**After Round 1:**
```
"Thanks for testing! We heard you loud and clear:
- 🐛 Fixing Safari audio this week
- ✨ Adding 20 more phone callers
- 📋 Planning difficulty levels

Round 2 testing next week!"
```

**After deploying fixes:**
```
"Updates live! We fixed:
- ✅ Safari audio
- ✅ iPhone high score
- ✅ 25 new callers

Please retest: [URL]"
```

**After Round 2:**
```
"Your Round 2 feedback is in! Next up:
- Difficulty levels (coming next week)
- Leaderboard (planning for Phase 2)

Keep the feedback coming!"
```

---

### 8. Know When to Stop Iterating

**Signs you're done with MVP iteration:**
- ✅ Users rate it 4+ stars consistently
- ✅ Critical bugs fixed
- ✅ Core features working reliably
- ✅ Feedback becomes "nice-to-haves" not "needs"
- ✅ You're excited to work on something else

**Don't over-iterate:**
- Perfect is the enemy of shipped
- 80% polished + new project > 100% polished + burned out
- MVP is about validation, not perfection

**Decision point:**
- If coworkers love it → share wider or move on
- If coworkers request features → 1-2 more rounds max
- If fundamental problems → pivot or stop

---

## Real-World Example

### Scenario: You Collected Feedback from 8 Coworkers

**Raw Feedback Received:**

**From Sarah (Chrome Desktop):**
- "5/5 stars - loved it! Phone calls made me laugh."
- "Played 7 games. Speed boost is thrilling."
- "Only issue: menu button sometimes needs two clicks on my phone."

**From Mike (Safari Desktop):**
- "4/5 stars - really fun for breaks."
- "Audio cuts out randomly on Safari - super annoying!"
- "Game gets HARD fast. Would love an easy mode."

**From Jessica (Mobile):**
- "5/5 stars - more addictive than I expected. Shared with whole team."
- "High score didn't save on my iPhone (Safari browser)."
- "Played 12 games - want leaderboard to compete with coworkers!"

**From David (Firefox):**
- "4/5 stars - finally, Snake is interesting again!"
- "Reverse controls made me rage quit twice - too disorienting."
- "Need more variety in phone callers - saw same ones repeatedly."

**From Alex (Chrome Mobile):**
- "3/5 stars - fun idea but too frustrating."
- "Died 10 times in a row to speed boost + walls. Gave up."
- "Wish there was practice mode or difficulty settings."

**From Maria (Chrome Desktop):**
- "4/5 stars - good break-time game."
- "Phone calls are hilarious - 'Your Conscience' called!"
- "Would play more if it wasn't so hard after 30 seconds."

**From Tom (Edge Desktop):**
- "5/5 stars - smooth experience, no bugs."
- "Want to see top scores - leaderboard would be great."
- "Played 6 games, will play more tomorrow."

**From Linda (Safari iOS):**
- "4/5 stars - fun but has issues."
- "High score didn't save between sessions (iPhone)."
- "Laggy when phone call appears on older iPhone 8."

---

### Step 1: Organize Feedback

**Summary Stats:**
- Testers: 8
- Average rating: 4.25/5
- Completion rate: 8/8 (100%)
- Played multiple games: 7/8 (87.5%)
- Played 5+ games: 4/8 (50%)

**Themes:**

**🎮 Gameplay:**
- TOO HARD (4 mentions: Mike, Alex, Maria, Linda indirectly)
- REVERSE CONTROLS frustrating (1 mention: David)
- SPEED BOOST chaos (2 mentions: Sarah positive, Alex negative)
- PHONE CALLS loved (4 mentions)

**🐛 Bugs:**
- SAFARI AUDIO cuts out (2 mentions: Mike, critical)
- IPHONE HIGH SCORE not saving (2 mentions: Jessica, Linda, critical)
- MENU DOUBLE-CLICK (1 mention: Sarah, minor)
- OLDER PHONE LAG (1 mention: Linda, minor)

**💡 Features:**
- LEADERBOARD (2 mentions: Jessica, Tom)
- DIFFICULTY LEVELS (3 mentions: Mike, Alex, Maria)
- MORE PHONE CALLERS (1 mention: David)
- PRACTICE MODE (1 mention: Alex)

---

### Step 2: ICE Prioritization

| Item | Impact | Confidence | Ease | ICE | Priority |
|------|--------|------------|------|-----|----------|
| Fix Safari audio | 8 | 10 (2 mentions) | 7 | 560 | 🔴 CRITICAL |
| Fix iPhone high score | 9 | 10 (2 mentions) | 8 | 720 | 🔴 CRITICAL |
| Add difficulty levels | 9 | 8 (3 mentions) | 4 | 288 | 🟡 MEDIUM |
| Add more phone callers | 6 | 5 (1 mention) | 10 | 300 | 🟢 HIGH (quick win) |
| Add leaderboard | 7 | 6 (2 mentions) | 2 | 84 | 🟡 MEDIUM |
| Fix menu double-click | 5 | 5 (1 mention) | 8 | 200 | 🟢 HIGH (quick win) |
| Balance reverse controls | 6 | 3 (1 mention) | 5 | 90 | 🔵 LOW |
| Older phone performance | 5 | 2 (1 mention) | 4 | 40 | 🔵 LOW |

---

### Step 3: Decisions

**🔴 CRITICAL (Fix Immediately):**

1. **Fix iPhone high score bug** (ICE: 720)
   - Decision: ✅ IMPLEMENT NOW
   - Workflow: `/quick-dev`
   - Owner: Charlie
   - Timeline: Today
   - Reasoning: Data loss affects 25% of users (2/8 on iPhone)

2. **Fix Safari audio bug** (ICE: 560)
   - Decision: ✅ IMPLEMENT NOW
   - Workflow: `/quick-dev`
   - Owner: Charlie
   - Timeline: Today
   - Reasoning: Breaks core experience, affects Safari users

---

**🟢 HIGH (Quick Wins):**

3. **Add 20+ more phone callers** (ICE: 300)
   - Decision: ✅ IMPLEMENT NOW
   - Workflow: `/quick-dev`
   - Owner: Charlie
   - Timeline: Today (15 minutes)
   - Reasoning: Easy win, adds variety, fast user satisfaction

4. **Fix menu double-click** (ICE: 200)
   - Decision: ✅ IMPLEMENT NOW
   - Workflow: `/quick-dev`
   - Owner: Charlie
   - Timeline: This week
   - Reasoning: Easy fix, improves mobile UX

---

**🟡 MEDIUM (Plan & Implement):**

5. **Add difficulty levels** (ICE: 288)
   - Decision: 📋 PLAN & IMPLEMENT
   - Workflow: `/quick-spec` → `/quick-dev`
   - Owner: Winston (spec), Charlie (implement)
   - Timeline: Next week (2-3 days)
   - Reasoning: Highly requested (3 mentions), addresses "too hard" theme

6. **Add leaderboard** (ICE: 84)
   - Decision: 🗂️ BACKLOG
   - Reasoning: Requires backend (database, auth, API). Major scope change. Defer to Phase 2 after MVP validation.
   - Alternative: Consider localStorage "personal best" leaderboard (easier)

---

**🔵 LOW (Backlog/Reject):**

7. **Balance reverse controls** (ICE: 90)
   - Decision: 🗂️ BACKLOG
   - Reasoning: Only 1 mention, low confidence. Monitor in Round 2.

8. **Optimize older phone performance** (ICE: 40)
   - Decision: 🗂️ BACKLOG
   - Reasoning: Only 1 user, specific hardware issue. Not worth effort for 12.5% of users.

---

### Step 4: Implementation Plan

**Day 1 (Today): Critical Fixes + Quick Wins**

```bash
# Morning: Critical bugs
/quick-dev "Fix iPhone Safari high score not saving - investigate localStorage on iOS Safari"

/quick-dev "Fix Safari desktop audio cutting out - check AudioContext state, add Safari-specific handling"

# Afternoon: Quick wins
/quick-dev "Add 25 new phone caller names: Work (Recruiter, IT Support), Personal (Dentist, Gym), Absurd (Time Travel Bureau, Past You), Meta (Snake Headquarters)"

/quick-dev "Fix mobile menu double-click issue - investigate event handling on touch devices"

# End of day: Commit and push
git add .
git commit -m "Fix critical bugs and add quick wins

Critical fixes:
- iPhone high score localStorage issue resolved
- Safari audio cutting out fixed

Quick wins:
- 25 new phone caller names added
- Mobile menu double-click issue fixed

Tested on Safari desktop, Safari iOS, Chrome mobile

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push
```

---

**Day 2: Spec Difficulty System**

```bash
/quick-spec "Design difficulty level system for CrazySnakeLite

Requirements:
- Three levels: Easy, Normal (current), Hard
- Easy: 30% slower snake, 50% more Growing food, phone calls 50% less frequent
- Hard: 30% faster snake, 50% more chaos foods, phone calls 50% more frequent
- User selects on main menu (buttons: Easy | Normal | Hard)
- Store in localStorage, default to Normal

Questions:
- Exact config.js values for each level?
- How to display current difficulty during gameplay?
- Should high scores be per-difficulty or combined?

Output: Technical spec with config values and implementation approach"
```

---

**Day 3-4: Implement Difficulty System**

```bash
/quick-dev "Implement difficulty levels based on quick-spec output

Follow spec exactly. Use quality checklist before marking complete:
- ✅ Validation (difficulty value check)
- ✅ localStorage persistence
- ✅ Config values correct
- ✅ Menu UI styled with retro theme
- ✅ High score per difficulty
- ✅ Test all three levels

Test extensively on both desktop and mobile."
```

---

### Step 5: Deploy and Test

```bash
# After implementation complete
git add .
git commit -m "Add difficulty level system

Three levels: Easy, Normal, Hard
- Easy: Slower snake, more Growing food, fewer phone calls
- Normal: Current balance (default)
- Hard: Faster snake, more chaos, more interruptions

Features:
- Menu UI with difficulty selector
- localStorage persistence
- Separate high scores per difficulty
- Difficulty displayed during gameplay

All quality checklist items verified

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>"
git push

# Wait 2 minutes for GitHub Pages deploy
# Test on live site:
# - All three difficulties work
# - High scores save per difficulty
# - Menu displays correctly
# - 60 FPS maintained on all levels
```

---

### Step 6: Communicate with Testers

**Email to 8 testers:**

```
Subject: CrazySnakeLite Updates - Your Feedback Implemented! 🎉

Hi team,

Thank you so much for testing CrazySnakeLite and providing detailed feedback!
I'm excited to share that we've implemented your suggestions:

FIXED (Based on Your Reports):
✅ Safari audio cutting out - now works smoothly
✅ iPhone high score not saving - localStorage fixed
✅ Mobile menu double-click - now responds instantly

ADDED (You Asked, We Delivered):
✅ 25 NEW phone caller names - more variety and laughs!
✅ DIFFICULTY LEVELS - Easy, Normal, Hard (addresses "too hard" feedback)
   - Easy: Slower snake, more time to react
   - Normal: Original balance
   - Hard: For speed demons who want chaos!

PLAY THE UPDATED GAME:
https://YOUR_USERNAME.github.io/CrazySnakeLite

ROUND 2 FEEDBACK (5 minutes):
We'd love your quick feedback on the updates:
[Link to Round 2 feedback form]

Specifically:
- Did the Safari/iPhone bugs get fixed for you?
- Do the difficulty levels feel right?
- Is the game more fun now?

COMING SOON (Your Requests):
📋 We're planning a leaderboard for Phase 2 (requires backend work)

Thank you for making CrazySnakeLite better! 🐍

Best,
Tomoco
```

---

### Step 7: Collect Round 2 Feedback

**Wait 1 week, then:**
- Collect Round 2 responses
- Analyze new feedback
- Decide: More iteration or launch wider?

**Expected Round 2 results:**
- Bugs confirmed fixed → confidence boost
- Difficulty levels loved → validation of prioritization
- New requests emerge → plan Round 3 (if needed)

---

## Communication with Testers

### Initial Request (Before Round 1)

**Subject:** Help Test My New Snake Game! 🐍

```
Hi [Team],

I built a fun twist on classic Snake and would love your feedback!

It's designed for quick office breaks (5-10 minutes) with chaos mechanics
like phone call interruptions and wild food effects.

PLAY HERE: https://YOUR_USERNAME.github.io/CrazySnakeLite

FEEDBACK FORM (5 minutes): [Link to form]

What I'm looking for:
- Is it fun?
- Any bugs or issues?
- What would make it better?

Thanks for helping me improve this!

- Tomoco
```

---

### After Round 1 Collection

**Subject:** Thanks for Testing! Here's What We Learned 📊

```
Hi [Team],

Huge thanks for testing CrazySnakeLite! Your feedback was incredibly helpful.

HERE'S WHAT YOU TOLD US:
✅ LOVED: Phone call interruptions (100% of you mentioned this!)
✅ LOVED: Quick break-time format
✅ LOVED: Food effect variety

🐛 BUGS WE'RE FIXING:
- Safari audio cutting out (2 reports)
- iPhone high score not saving (2 reports)

😤 FRUSTRATION POINTS:
- "Too hard after 30 seconds" (4 of you said this)
- Need difficulty options

OUR PLAN:
This week: Fix bugs + add more phone callers
Next week: Add difficulty levels (Easy/Normal/Hard)

I'll let you know when updates are live for Round 2 testing!

- Tomoco
```

---

### After Deploying Improvements

**Subject:** Updates Live! Please Retest 🚀

```
Hi [Team],

Based on your feedback, CrazySnakeLite has been updated!

WHAT'S NEW:
✅ Safari audio bug - FIXED
✅ iPhone high score bug - FIXED
✅ 25 new phone caller names - ADDED
✅ Difficulty levels (Easy/Normal/Hard) - ADDED

RETEST NOW: https://YOUR_USERNAME.github.io/CrazySnakeLite

QUICK ROUND 2 SURVEY (3 minutes): [Link]
- Did the bugs get fixed?
- Do difficulty levels help?
- Is it more fun now?

Your input makes this better - thank you!

- Tomoco
```

---

### After Round 2 (Decision Point)

**Option A: Continue Iterating**

```
Subject: Round 2 Feedback - More Updates Coming!

Hi [Team],

Your Round 2 feedback is in - thank you!

GOOD NEWS:
✅ Bugs confirmed fixed (100% said yes)
✅ Difficulty levels loved (average 4.5/5 rating)
✅ Fun rating improved from 4.25 to 4.75!

NEW REQUESTS:
- Leaderboard (4 requests this round)
- More food effects (2 requests)

NEXT STEPS:
I'm planning a Phase 2 with leaderboards and social features.
Will keep you posted!

Keep the feedback coming!
- Tomoco
```

---

**Option B: Launch Wider**

```
Subject: CrazySnakeLite is Ready - Thanks for Your Help! 🎉

Hi [Team],

After two rounds of your excellent feedback, CrazySnakeLite is polished
and ready for prime time!

YOUR IMPACT:
- You helped fix critical bugs
- Your requests shaped the difficulty system
- You made this game 10x better

SHARE IT:
Feel free to share with other teams, post on social media, or send to
friends. The game is live and stable thanks to you!

PLAY: https://YOUR_USERNAME.github.io/CrazySnakeLite

You're all in the credits. Thank you! 🙏

- Tomoco
```

---

## Summary Checklist

When you return with user feedback, follow this checklist:

### □ Phase 1: Collect (1-2 weeks)
- □ Share game URL with 5-10 testers
- □ Provide feedback form or survey
- □ Observe some testers playing live
- □ Take notes on reactions and behaviors

### □ Phase 2: Organize (2 hours)
- □ Create feedback document from template
- □ Group by themes (gameplay, bugs, features)
- □ Count mentions for each item
- □ Extract direct quotes
- □ Calculate summary statistics

### □ Phase 3: Analyze (1 hour)
- □ Score each item with ICE framework
- □ Sort by ICE score (high to low)
- □ Assign priority categories
- □ Identify quick wins vs big bets

### □ Phase 4: Decide (30 minutes)
- □ Review alignment with vision
- □ Separate bugs from features
- □ Bugs first, quick wins second
- □ Document decisions with reasoning
- □ Assign workflows for each item

### □ Phase 5: Implement (1-5 days)
- □ Start with critical bugs
- □ Then quick wins (< 2 hours each)
- □ Then medium features (spec first)
- □ Use quality checklist for each
- □ Batch related changes together
- □ Commit and push when ready

### □ Phase 6: Test & Iterate (2 days)
- □ Test all implementations locally
- □ Test on relevant browsers/devices
- □ Verify didn't break existing features
- □ Deploy to GitHub Pages
- □ Test on live site
- □ Notify testers
- □ Collect Round 2 feedback
- □ Decide: iterate more or launch wider

---

## Quick Reference

### Workflows at a Glance

| What | Workflow | When |
|------|----------|------|
| Critical bug | `/quick-dev` | Today |
| Small bug | `/quick-dev` | This week |
| Quick enhancement | `/quick-dev` | < 2 hours |
| Medium feature | `/quick-spec` → `/quick-dev` | Plan first |
| Large feature | `/create-story` | Epic-sized |

### Priority Formula

```
ICE Score = Impact × Confidence × Ease

CRITICAL  = ICE > 500 OR game-breaking bug
HIGH      = ICE 300-500 OR easy win
MEDIUM    = ICE 100-300
LOW       = ICE < 100
```

### Decision Rules

1. **Bugs before features**
2. **3+ mentions = high confidence**
3. **Easy + decent impact = quick win (do first)**
4. **Doesn't align with vision = backlog or reject**
5. **Requires backend = Phase 2 (defer for MVP)**

---

**Ready to turn feedback into improvements! 🚀**

---

**Last Updated:** 2026-01-29
**Authors:** Alice (Product Owner), Bob (Scrum Master), Charlie (Senior Dev), Dana (QA Engineer), Winston (Architect)
**For:** Tomoco (Project Lead)
**Project:** CrazySnakeLite MVP
