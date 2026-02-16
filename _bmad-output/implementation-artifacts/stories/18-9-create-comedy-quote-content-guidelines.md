# Story 18.9: Create Comedy Quote Content Guidelines

**Epic:** 18 - Dashboard Comedy Integration

**As a** content creator,
**I want** clear guidelines for writing new caller quotes,
**So that** all quotes maintain CrazySnake's voice and quality.

---

## Acceptance Criteria

**Given** new caller quotes are written
**When** adding to CALLER_QUOTES database
**Then** follow content guidelines:

**✅ GOOD QUOTE CHARACTERISTICS:**
- Tech puns or programming humor (on-brand with caller names)
- Celebrates player achievement (positive framing)
- Brief (1-2 sentences, under 80 characters)
- Contextual to specific performance (tagged appropriately)
- Encouraging or empathetic (never condescending)

**❌ BAD QUOTE CHARACTERISTICS:**
- Generic platitudes ("Good job!", "Keep trying!")
- Medical/clinical language ("Your neural pathways...")
- Negative framing ("You failed because...")
- Too long (3+ sentences, requires scrolling)
- Offensive or exclusionary humor

**Examples of GOOD quotes:**
```
✅ "Your prefrontal cortex just filed a pull request. Merged without conflicts."
   (Tech pun, celebrates achievement, brief, encouraging)

✅ "Reverse Controls: where good snakes go to humble themselves."
   (Empathetic to RC struggle, humorous reframe)

✅ "12 days straight? Your brain is now officially a gym rat."
   (Celebrates streak, on-brand with brain gym positioning)
```

**Examples of BAD quotes:**
```
❌ "Your cognitive performance shows significant improvement across multiple domains."
   (Too clinical, no humor, sounds like a medical report)

❌ "You died because you weren't paying attention. Try harder next time."
   (Negative framing, condescending tone)

❌ "That was an okay attempt. Scores have been better, but at least you tried your best."
   (Generic platitude, subtly negative)
```

**Given** 21 callers are available (from phone calls system)
**When** distributing quotes across callers
**Then** ensure all callers have 3-5 quotes minimum
**And** each caller's quotes match their established personality from phone one-liners

**Documentation:** Create `comedy-quote-guidelines.md` with examples and anti-patterns

---

## Development

### Files to Create/Modify

- **`_bmad-output/planning-artifacts/comedy-quote-guidelines.md`** - NEW - Content creation guidelines for caller quotes

### Documentation Structure

```markdown
# Comedy Quote Content Guidelines
**Version:** 1.0
**Date:** [Date]
**For:** CrazySnake Caller Quote Database

## Purpose

This document provides guidelines for writing new caller quotes that maintain CrazySnake's voice, tone, and quality standards. Use these guidelines when:
- Adding new quotes to the CALLER_QUOTES database
- Expanding existing caller quote pools
- Creating context-specific quotes for new features

---

## Content Principles

### 1. Tech Puns and Programming Humor

**WHY:** Caller names are tech puns (Al Gorithm, Kernel Sanders, Lambda Calculus). Quotes should match this theme.

**GOOD:**
- "Your prefrontal cortex just filed a pull request. Merged without conflicts." (Git metaphor)
- "12 days straight? Your brain is now officially a gym rat." (Exercise/training metaphor)
- "Have you tried turning your strategy off and on again?" (IT helpdesk humor)

**BAD:**
- "Great job! You're doing amazing!" (Generic, no tech theme)
- "Keep up the good work!" (Platitude, no personality)

### 2. Celebrate Player Achievement

**WHY:** Quotes should make players feel good about their progress, not criticized.

**GOOD:**
- "Lightning reflexes detected. Your neurons are on espresso today." (Celebrates reaction time)
- "100 sessions in? Your brain is officially a gym legend." (Celebrates dedication)

**BAD:**
- "You died because you weren't paying attention." (Negative framing)
- "That score could've been better if you tried harder." (Condescending)

### 3. Brief and Punchy

**WHY:** Quotes appear in overlays. Long text requires scrolling and feels like work.

**RULE:** 1-2 sentences max, under 80 characters ideal.

**GOOD:**
- "Your spatial awareness is off the charts." (32 chars)
- "Five sessions complete! Your brain map just rendered." (54 chars)

**BAD:**
- "Congratulations on completing your fifth session! You've reached a major milestone in your cognitive training journey, and now you can access the Skill Map feature to see detailed metrics about your performance across all six cognitive domains. Great work!" (Too long, feels clinical)

### 4. Contextual to Performance

**WHY:** Quotes should feel relevant, not random. Players notice when quotes don't match their performance.

**GOOD:**
- High score → "Score 92? Your brain just unlocked achievement: Overachiever Mode."
- RC death → "Orange food is tough love. Your executive function is in training."
- 30-day streak → "30 days straight? That streak is hotter than a CPU at 95°C."

**BAD:**
- Low score (8) → "You're crushing it! Personal best!" (Mismatch)
- No phone calls → "Phone call master detected!" (Player didn't engage phone system)

### 5. Encouraging or Empathetic

**WHY:** Even when players struggle, quotes should support, not mock.

**GOOD:**
- "Reverse Controls: where good snakes go to humble themselves." (Empathetic reframe)
- "Your neurons are warming up. Give them time." (Encouraging for low score)

**BAD:**
- "Wow, that was terrible. Try again." (Mocking)
- "Maybe this game isn't for you." (Discouraging)

---

## Writing Process

### Step 1: Identify Context

What performance scenario is this quote for?
- High score? Low score? Personal best?
- RC survived? RC death?
- Milestone? (Calibration, streak, session count)
- General encouragement?

### Step 2: Match Caller Personality

Each caller has a personality from their one-liner:

| Caller | One-Liner | Personality |
|--------|-----------|-------------|
| Al Gorithm | "Have you tried sorting your life out?" | Helpful problem-solver |
| Kernel Sanders | — | Confident, slightly smug |
| Lambda Calculus | — | Mathematical precision |
| DJ Algorithm | — | Energetic, celebratory |
| Floppy Phil | "I only have 1.44 MB to talk, so quick!" | Self-deprecating, rushed |

**Match quote tone to caller personality.**

### Step 3: Add Tech Flavor

Brainstorm tech/programming metaphors:
- Git (commits, pull requests, merge conflicts)
- CPU/RAM (processing power, memory)
- Functions (calling, returning, recursion)
- Compilation (building, debugging)
- Networking (bandwidth, latency, packets)

**Example:**
- Base: "You handled 8 phone calls!"
- Tech flavor: "8 phone calls handled. Your bandwidth is impressive."

### Step 4: Keep It Brief

Edit ruthlessly. Remove filler words.

**Before:** "That was really impressive how you survived all those Reverse Controls!"
**After:** "Survived 4 Reverse Controls — brain on fire 🔥"

### Step 5: Tag Appropriately

Assign 1-3 context tags:
- Performance: `high_score`, `low_score`, `personal_best`
- Cognitive: `rc_survived`, `death_during_rc`, `combo_master`, `phone_ace`
- Milestones: `calibration_complete`, `streak_milestone_7`, `streak_milestone_30`
- General: `general`, `encouragement`, `celebration`

---

## Examples by Context

### High Score (score > 80)

✅ GOOD:
- "Score 92? Your brain just unlocked achievement: Overachiever Mode."
- "That score deserves a compiler optimization award."
- "High score detected. Your neurons are running at peak efficiency."

❌ BAD:
- "Good job!" (Too generic)
- "Congratulations on your excellent cognitive performance." (Too clinical)

### Low Score (score < 20)

✅ GOOD:
- "Your neurons are warming up. Give them time."
- "Every session is training. You're building those pathways."
- "Rome wasn't compiled in a day. Keep going."

❌ BAD:
- "That was awful. Try harder." (Negative)
- "Maybe you should practice more." (Condescending)

### RC Survived (3+ Reverse Controls)

✅ GOOD:
- "Survived 4 Reverse Controls — brain on fire 🔥"
- "Your executive function just bench-pressed a truck."
- "Orange food didn't stand a chance. Cognitive flexibility unlocked."

❌ BAD:
- "You handled Reverse Controls well." (Too dry)
- "Cognitive flexibility score: 0.87" (Too clinical)

### RC Death

✅ GOOD:
- "Orange food is tough love. Your executive function is in training."
- "Reverse Controls: where good snakes go to humble themselves."
- "That orange food has humbled greater snakes. Keep training."

❌ BAD:
- "You died during Reverse Controls. Better luck next time." (Blunt)
- "Your cognitive flexibility needs improvement." (Clinical)

### Calibration Complete (session 5)

✅ GOOD:
- "Five sessions complete! Your brain map just rendered. Check it out!"
- "Calibration complete. Time to see what your neurons have been up to."
- "Your Skill Map is ready. Spoiler: it looks impressive."

❌ BAD:
- "Baseline established. Proceed to assessment phase." (Too clinical)
- "You finished 5 sessions." (Too dry)

### 30-Day Streak

✅ GOOD:
- "30 days straight? That streak is hotter than a CPU at 95°C."
- "Your brain is now officially a gym rat. 30 days!"
- "Consistency detected. Your neural pathways are firing like a well-oiled machine."

❌ BAD:
- "You've played 30 days in a row." (Statement of fact, no celebration)
- "Excellent adherence to training protocol." (Clinical)

### General / Encouragement

✅ GOOD:
- "Every session trains your brain. Keep going!"
- "Your neurons are doing the Electric Slide. Keep it up!"
- "Gameplay detected. Brain training initiated."

❌ BAD:
- "Good effort." (Generic)
- "Continue cognitive exercises." (Clinical)

---

## Anti-Patterns (DO NOT DO)

### ❌ Medical/Clinical Language

**FORBIDDEN:**
- "Your cognitive performance shows significant improvement."
- "Executive function capacity increased by 12%."
- "Neuroplasticity detected in prefrontal cortex."

**WHY:** Violates Story 18.6 (no clinical language). Feels like medical report, not game.

### ❌ Generic Platitudes

**FORBIDDEN:**
- "Good job!"
- "Keep trying!"
- "You can do it!"

**WHY:** No personality, no tech theme, no connection to caller.

### ❌ Negative Framing

**FORBIDDEN:**
- "You failed because..."
- "That was a terrible strategy."
- "Maybe this game isn't for you."

**WHY:** Discouraging, violates "celebrate achievement" principle.

### ❌ Too Long

**FORBIDDEN:**
- "Congratulations on completing your fifth consecutive session of cognitive training! You've unlocked the Skill Map feature, which provides detailed analytics across six cognitive domains including reaction time, spatial awareness, cognitive flexibility, divided attention, impulse control, and working memory. Click the button below to explore your personalized brain profile!"

**WHY:** Requires scrolling, feels like work, loses impact.

### ❌ Offensive or Exclusionary

**FORBIDDEN:**
- Jokes about mental illness, disability, age, gender, race
- Sarcasm that could be misread as mean
- Cultural references that exclude players

**WHY:** CrazySnake is inclusive. Humor should unite, not divide.

---

## Quality Checklist

Before adding a new quote to CALLER_QUOTES, verify:

- [ ] Tech pun or programming humor present
- [ ] Celebrates achievement or encourages player
- [ ] Under 80 characters (1-2 sentences)
- [ ] Contextually tagged appropriately
- [ ] Matches caller personality
- [ ] NO clinical/medical language
- [ ] NO generic platitudes
- [ ] NO negative framing
- [ ] NO offensive content
- [ ] Passes "would I want to see this?" test

---

## Caller Distribution

**RULE:** Ensure all 21 callers have 3-5 quotes minimum.

**Current Status:**
- [ ] Al Gorithm: 3 quotes ✅
- [ ] Meg A. Byte: 3 quotes ✅
- [ ] Ali Sing: 3 quotes ✅
- [ ] Anna Log: 3 quotes ✅
- [ ] Ray Tracing: 3 quotes ✅
- [ ] Pat Ch-Notes: 3 quotes ✅
- [ ] Mac Address: 3 quotes ✅
- [ ] Artie Ficial: 3 quotes ✅
- [ ] Floppy Phil: 3 quotes ✅
- [ ] Dot Matrix: 3 quotes ✅
- [ ] Gia Hertz: 3 quotes ✅
- [ ] Perry Pheral: 3 quotes ✅
- [ ] Terry Byte: 3 quotes ✅
- [ ] Cade Ridger: 3 quotes ✅
- [ ] Mona Tor: 3 quotes ✅
- [ ] Syd Ram: 3 quotes ✅
- [ ] Bessie IOS: 3 quotes ✅
- [ ] Dee Frag: 3 quotes ✅
- [ ] Buffy Ring: 3 quotes ✅
- [ ] DJ Snake: 3 quotes ✅
- [ ] GAME OVER: 3 quotes ✅

**Total minimum:** 63 quotes (21 × 3)
**Recommended:** 84-105 quotes (21 × 4-5) for variety

---

## Review Process

**For new quotes:**
1. Write draft quote
2. Apply quality checklist
3. Tag with context
4. Assign to caller (match personality)
5. Peer review (2nd set of eyes)
6. Add to CALLER_QUOTES database
7. Test in-game (verify tone/relevance)

**For quote revisions:**
1. Identify problem (too long, clinical, irrelevant)
2. Rewrite following guidelines
3. Re-apply quality checklist
4. Update in CALLER_QUOTES
5. Re-test in-game

---

## Appendix: Caller Personality Reference

| Caller | Slug | One-Liner | Personality Trait |
|--------|------|-----------|-------------------|
| Al Gorithm | 01_AlGorithm | "Have you tried sorting your life out?" | Helpful problem-solver |
| Meg A. Byte | 02_MegaByte | "I'm running out of space for this call!" | Always pressed for space |
| Ali Sing | 03_AliSing | "Stop giving me mixed signals!" | Confused by ambiguity |
| Anna Log | 04_AnnaLog | "Everything used to be simpler in my day..." | Nostalgic, old-school |
| Ray Tracing | 05_RayTracing | "I can see right through your strategy." | Perceptive, analytical |
| Pat Ch-Notes | 06_PatCh-Notes | "We need to fix a few things between us." | Relationship fixer |
| Mac Address | 07_MacAddress | "I'm calling from a very specific location." | Precise, location-focused |
| Artie Ficial | 08_ArtieFicial | "I'm not a real person, but I play one on TV." | Self-aware AI |
| Floppy Phil | 09_FloppyPhil | "I only have 1.44 MB to talk, so quick!" | Limited capacity, rushed |
| Dot Matrix | 10_DotMatrix | "You're looking a bit pixelated today." | Visual observer |
| Gia Hertz | 11_GiaHertz | "I'm vibrating with excitement to talk to you!" | Energetic, high-frequency |
| Perry Pheral | 12_PerryPheral | "I'm just on the side... don't mind me." | Sideline observer |
| Terry Byte | 13_TerryByte | "I've got a LOT of data to share with you." | Info-heavy, talkative |
| Cade Ridger | 14_CadeRidger | "Let me bridge the gap in your gameplay." | Connector, problem-solver |
| Mona Tor | 15_MonaTor | "I've been watching your every move..." | Watchful observer |
| Syd Ram | 16_SydRam | "I forgot what I was gonna say... hold on..." | Forgetful, memory issues |
| Bessie IOS | 17_BessieIOS | "Moo-ve over, I'm updating!" | Update-focused, pushy |
| Dee Frag | 18_DeeFrag | "Let me help you get your life together." | Organizer, optimizer |
| Buffy Ring | 19_BuffyRing | "Hold on, I'm buffering..." | Slow-loading, patient |
| DJ Snake | 20_DJsnake | "Ssssomeone requested a remix of your game!" | Music mixer, remixer |
| GAME OVER | 21_GAMEOVER | "Just checking if you're still alive..." | Dark humor, morbid |

---

## Contact

**Questions about quote guidelines?**
- Review this document first
- Check existing CALLER_QUOTES for examples
- Refer to Story 18.6 (clinical language) and Story 18.7 (retro aesthetic)
- Test quotes in-game to validate tone/relevance

---
```

### Documentation Deliverable

**File:** `_bmad-output/planning-artifacts/comedy-quote-guidelines.md`
**Content:** Full guidelines document as outlined above

### Test Strategy

**Validation:**
1. Document is complete and covers all required topics
2. Examples are clear and actionable
3. Anti-patterns are well-defined
4. Quality checklist is comprehensive
5. Caller personality reference is accurate

**Usage:**
1. Future quote additions reference this document
2. Peer reviews use quality checklist
3. New contributors read guidelines before writing quotes

### Dependencies

**BEFORE this story:**
- Story 18.1-18.8 (implementation context informs guidelines)
- Epic 9 (caller personalities from phone calls system)
- Story 18.6 (clinical language anti-patterns)

**AFTER this story:**
- Living document - update as new patterns emerge
- Reference for future quote expansions

### Implementation Notes

1. **Living document** - Update guidelines as new patterns emerge
2. **Examples-driven** - Show, don't just tell
3. **Quality checklist** - Make it easy to self-review
4. **Caller personality reference** - Ensure consistency with phone.js CALLERS
5. **Anti-patterns section** - Explicitly show what NOT to do
6. **Review process** - Establish workflow for adding new quotes
7. **Minimum viable content** - 63 quotes (21 callers × 3), recommend 84-105 for variety
