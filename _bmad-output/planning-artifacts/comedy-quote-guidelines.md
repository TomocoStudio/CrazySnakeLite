# Comedy Quote Content Guidelines

**Version:** 1.0
**Date:** 2026-02-16
**For:** CrazySnake Caller Quote Database
**Epic:** 18 - Dashboard Comedy Integration
**Story:** 18.9 - Create Comedy Quote Content Guidelines

---

## Purpose

This document provides guidelines for writing new caller quotes that maintain CrazySnake's voice, tone, and quality standards. Use these guidelines when:
- Adding new quotes to the CALLER_QUOTES database (`js/comedy.js`)
- Expanding existing caller quote pools
- Creating context-specific quotes for new features
- Reviewing or revising existing quotes

**Target Audience:** Content creators, developers, UX designers contributing to CrazySnake's comedy system

---

## Content Principles

### 1. Tech Puns and Programming Humor

**WHY:** Caller names are tech puns (Al Gorithm, Kernel Sanders, Lambda Calculus). Quotes should match this theme to maintain brand consistency and on-brand humor.

**✅ GOOD:**
- "Your prefrontal cortex just filed a pull request. Merged without conflicts." (Git metaphor)
- "12 days straight? Your brain is now officially a gym rat." (Exercise/training metaphor)
- "Have you tried turning your strategy off and on again?" (IT helpdesk humor)
- "Your sorting algorithm is on point. High score achieved!" (Computer science reference)

**❌ BAD:**
- "Great job! You're doing amazing!" (Generic, no tech theme)
- "Keep up the good work!" (Platitude, no personality)
- "Congratulations on your achievement!" (Corporate speak, no tech flavor)

---

### 2. Celebrate Player Achievement

**WHY:** Quotes should make players feel good about their progress, not criticized. Positive reinforcement drives engagement and supports the growth mindset required for cognitive training.

**✅ GOOD:**
- "Lightning reflexes detected. Your neurons are on espresso today." (Celebrates reaction time)
- "100 sessions in? Your brain is officially a gym legend." (Celebrates dedication)
- "Survived 4 Reverse Controls — brain on fire 🔥" (Celebrates cognitive flexibility)

**❌ BAD:**
- "You died because you weren't paying attention." (Negative framing, blaming)
- "That score could've been better if you tried harder." (Condescending, discouraging)
- "Your performance was below average." (Negative comparison)

---

### 3. Brief and Punchy

**WHY:** Quotes appear in overlays during post-game and dashboard views. Long text requires scrolling, breaks immersion, and feels like work rather than fun.

**RULE:** 1-2 sentences max, under 80 characters ideal (allows room for caller attribution).

**✅ GOOD:**
- "Your spatial awareness is off the charts." (43 chars)
- "Five sessions complete! Your brain map just rendered." (54 chars)
- "Score 92? Your brain just unlocked achievement: Overachiever Mode." (67 chars)

**❌ BAD:**
- "Congratulations on completing your fifth session! You've reached a major milestone in your cognitive training journey, and now you can access the Skill Map feature to see detailed metrics about your performance across all six cognitive domains. Great work!" (264 chars - way too long, requires scrolling, feels clinical)

**EDITING TIP:** Remove filler words ruthlessly.
- **Before:** "That was really impressive how you survived all those Reverse Controls!"
- **After:** "Survived 4 Reverse Controls — brain on fire 🔥"

---

### 4. Contextual to Performance

**WHY:** Quotes should feel relevant to the session, not random. Players notice when quotes don't match their performance, breaking immersion and reducing trust in the system.

**✅ GOOD Contextual Matching:**
- High score (90+) → "Score 92? Your brain just unlocked achievement: Overachiever Mode."
- RC death → "Orange food is tough love. Your executive function is in training."
- 30-day streak → "30 days straight? That streak is hotter than a CPU at 95°C."
- Calibration complete → "Five sessions complete! Your brain map just rendered. Check it out!"

**❌ BAD Mismatches:**
- Low score (8) + celebratory quote → "You're crushing it! Personal best!" (Irrelevant)
- No phone calls engaged + phone quote → "Phone call master detected!" (Player didn't use phone system)
- First session + streak quote → "100 days straight? Legend status!" (Impossible)

---

### 5. Encouraging or Empathetic

**WHY:** Even when players struggle, quotes should support and encourage, not mock or condescend. Cognitive training requires psychological safety.

**✅ GOOD Empathy:**
- "Reverse Controls: where good snakes go to humble themselves." (Empathetic reframe, acknowledges difficulty)
- "Your neurons are warming up. Give them time." (Encouraging for low score)
- "I'm buffering too. We all need a moment. Keep going!" (Empathetic, relatable)

**❌ BAD Mockery:**
- "Wow, that was terrible. Try again." (Mocking, discouraging)
- "Maybe this game isn't for you." (Actively discouraging, insulting)
- "Did you even try?" (Condescending, accusatory)

---

## Writing Process

### Step 1: Identify Context

What performance scenario is this quote for?

**Performance Contexts:**
- High score (> 80)
- Low score (< 20)
- Personal best (new all-time high)
- Improvement (15%+ increase)

**Cognitive Contexts:**
- RC survived (3+ orange food encounters survived)
- RC death (died while RC active)
- Combo master (3+ combo multipliers)
- Phone ace (6+ phone calls managed)

**Milestone Contexts:**
- Calibration complete (session 5)
- Streak milestones (7 days, 30 days)
- Session milestones (50, 100 sessions)

**General:**
- General encouragement (fallback)
- Celebration (any achievement)

---

### Step 2: Match Caller Personality

Each caller has an established personality from their phone call one-liner. **Quotes must match their personality to maintain consistency.**

| Caller | One-Liner | Personality | Quote Style |
|--------|-----------|-------------|-------------|
| **Al Gorithm** | "Have you tried sorting your life out?" | Helpful problem-solver | Offers solutions, optimization tips |
| **Meg A. Byte** | "I'm running out of space for this call!" | Always pressed for space | References storage, capacity limits |
| **Ali Sing** | "Stop giving me mixed signals!" | Confused by ambiguity | References communication, signals |
| **Anna Log** | "Everything used to be simpler..." | Nostalgic, old-school | References "back in my day," simpler times |
| **Ray Tracing** | "I can see right through your strategy." | Perceptive, analytical | References vision, seeing through things |
| **Pat Ch-Notes** | "We need to fix a few things..." | Relationship fixer | References bugs, patches, improvements |
| **Mac Address** | "Calling from a very specific location." | Precise, location-focused | References specific locations, tracking |
| **Artie Ficial** | "I'm not a real person..." | Self-aware AI | References acting, not being real |
| **Floppy Phil** | "Only 1.44 MB to talk, so quick!" | Limited capacity, rushed | Self-deprecating, mentions limitations |
| **Dot Matrix** | "You're looking pixelated today." | Visual observer | References visuals, resolution, pixels |
| **Gia Hertz** | "Vibrating with excitement!" | Energetic, high-frequency | References vibration, frequency, energy |
| **Perry Pheral** | "I'm just on the side..." | Sideline observer | References periphery, side observations |
| **Terry Byte** | "I've got a LOT of data..." | Info-heavy, talkative | References big data, lots to share |
| **Cade Ridger** | "Let me bridge the gap..." | Connector, problem-solver | References bridging, connecting |
| **Mona Tor** | "Watching your every move..." | Watchful observer | References monitoring, watching, tracking |
| **Syd Ram** | "I forgot what I was gonna say..." | Forgetful, memory issues | Self-deprecating memory jokes |
| **Bessie IOS** | "Moo-ve over, I'm updating!" | Update-focused, pushy | References updates, versions |
| **Dee Frag** | "Let me help you get organized." | Organizer, optimizer | References organization, optimization |
| **Buffy Ring** | "Hold on, I'm buffering..." | Slow-loading, patient | References buffering, loading, patience |
| **DJ Snake** | "Ssssomeone requested a remix!" | Music mixer, remixer | References music, remixes, beats |
| **GAME OVER** | "Just checking if you're still alive..." | Dark humor, morbid | References death, endings (appropriately) |

**Example:** If writing a quote for **Syd Ram** (forgetful), incorporate memory humor:
- ✅ "I forgot... wait, no! Five sessions complete! Memory loaded!"
- ❌ "Your spatial awareness is excellent!" (Doesn't match Syd Ram's personality)

---

### Step 3: Add Tech Flavor

Brainstorm tech/programming metaphors relevant to the context:

**Common Tech Metaphors:**
- **Git:** commits, pull requests, merge conflicts, branches
- **CPU/RAM:** processing power, memory, cache, bandwidth
- **Functions:** calling, returning, recursion, stack overflow
- **Compilation:** building, debugging, compiling, runtime errors
- **Networking:** bandwidth, latency, packets, connections
- **Storage:** disk space, memory, capacity, fragmentation
- **Graphics:** pixels, rendering, resolution, ray tracing
- **Audio:** frequency, amplitude, vibration, buffering
- **Hardware:** overclocking, thermal throttling, hardware upgrade

**Example Progression:**
1. **Base idea:** "You handled 8 phone calls!"
2. **Add tech flavor:** "8 phone calls handled. Your bandwidth is impressive."
3. **Match caller (Terry Byte - big data):** "I've got a LOT of data: 8 phone calls handled!"

---

### Step 4: Keep It Brief

Edit ruthlessly. Remove filler words. Aim for impact, not length.

**Editing Examples:**

**Before:** "That was really quite impressive how you managed to survive all those Reverse Controls encounters!"
**After:** "Survived 4 Reverse Controls — brain on fire 🔥"

**Before:** "Congratulations on achieving a new personal best score in reaction time!"
**After:** "Reaction Time: NEW PERSONAL BEST!"

**Before:** "Your brain is now officially considered to be a gym rat after 12 days of consistent training."
**After:** "12 days straight? Your brain is now officially a gym rat."

**Tip:** Read quote aloud. If it feels like work to say, it's too long.

---

### Step 5: Tag Appropriately

Assign 1-3 context tags to enable contextual selection. More tags = more opportunities for relevance scoring.

**Tag Categories:**

**Performance Tags:**
- `high_score` - Score > 80
- `low_score` - Score < 20
- `personal_best` - New all-time high for any domain
- `improvement` - 15%+ increase vs rolling average

**Cognitive Tags:**
- `rc_survived` - Survived 3+ Reverse Controls encounters
- `death_during_rc` - Died while RC active
- `combo_master` - 3+ combo multipliers activated
- `phone_ace` - 6+ phone calls managed

**Milestone Tags:**
- `calibration_complete` - Session 5 completion
- `streak_milestone_7` - 7-day streak achieved
- `streak_milestone_30` - 30-day streak achieved
- `session_50` - 50 sessions completed
- `session_100` - 100 sessions completed

**General Tags:**
- `general` - Universal fallback (all quotes should have this as backup)
- `encouragement` - Supportive, motivational
- `celebration` - Achievement-focused, celebratory

**Tagging Examples:**
```javascript
{
  id: 'al-gorithm-high-score-1',
  text: 'Your sorting algorithm is on point. High score achieved!',
  context: ['high_score', 'personal_best']  // 2 tags for multi-tag relevance
}

{
  id: 'floppy-phil-low-score-1',
  text: "I've crashed too. We all start somewhere. You got this!",
  context: ['low_score', 'encouragement']  // Empathetic for struggle
}
```

---

## Examples by Context

### High Score (score > 80)

**Context:** Player achieved high score, deserves celebration

✅ **GOOD:**
- "Score 92? Your brain just unlocked achievement: Overachiever Mode." (Al Gorithm)
- "That score deserves a compiler optimization award." (Pat Ch-Notes)
- "High score detected. Your neurons are running at peak efficiency." (Mona Tor)
- "Let me help you organize this: HIGH SCORE achieved!" (Dee Frag)

❌ **BAD:**
- "Good job!" (Too generic, no tech theme, no personality)
- "Congratulations on your excellent cognitive performance." (Too clinical, violates Story 18.6)
- "You scored high." (Statement of fact, no celebration)

---

### Low Score (score < 20)

**Context:** Player struggled, needs encouragement not mockery

✅ **GOOD:**
- "Your neurons are warming up. Give them time." (General encouragement)
- "Every session is training. You're building those pathways." (Anna Log)
- "Rome wasn't compiled in a day. Keep going." (Pat Ch-Notes)
- "I've crashed too. We all start somewhere. You got this!" (Floppy Phil)

❌ **BAD:**
- "That was awful. Try harder." (Negative framing, discouraging)
- "Maybe you should practice more." (Condescending tone)
- "Your cognitive performance needs significant improvement." (Clinical language)

---

### RC Survived (3+ Reverse Controls)

**Context:** Player survived multiple orange food encounters, impressive feat

✅ **GOOD:**
- "Survived 4 Reverse Controls — brain on fire 🔥" (Celebratory)
- "Your executive function just bench-pressed a truck." (Kernel Sanders)
- "Orange food didn't stand a chance. Cognitive flexibility unlocked." (Ray Tracing)
- "Reverse Controls survived? Your neural oscillations are strong!" (Gia Hertz)

❌ **BAD:**
- "You handled Reverse Controls well." (Too dry, no excitement)
- "Cognitive flexibility score: 0.87" (Clinical, numerical)
- "Good reflexes." (Generic, no tech flavor)

---

### RC Death

**Context:** Player died during Reverse Controls, needs empathy not criticism

✅ **GOOD:**
- "Orange food is tough love. Your executive function is in training." (Empathetic reframe)
- "Reverse Controls: where good snakes go to humble themselves." (Humorous perspective)
- "That orange food has humbled greater snakes. Keep training." (Encouraging)
- "Orange food scrambled your memory? Happens to me daily!" (Syd Ram - relatable)

❌ **BAD:**
- "You died during Reverse Controls. Better luck next time." (Blunt, unhelpful)
- "Your cognitive flexibility needs improvement." (Clinical, discouraging)
- "Try paying more attention next time." (Condescending, blaming)

---

### Calibration Complete (session 5)

**Context:** Major milestone, unlock Skill Map, should feel celebratory

✅ **GOOD:**
- "Five sessions complete! Your brain map just rendered. Check it out!" (Encourages Skill Map visit)
- "Calibration complete. Time to see what your neurons have been up to." (Lambda Calculus)
- "Your Skill Map is ready. Spoiler: it looks impressive." (Kernel Sanders)
- "Five sessions tuned! Your brain map frequency is locked in!" (Gia Hertz)

❌ **BAD:**
- "Baseline established. Proceed to assessment phase." (Too clinical, cold)
- "You finished 5 sessions." (Statement of fact, no celebration)
- "Your cognitive profile is now available for review." (Corporate, not exciting)

---

### 30-Day Streak

**Context:** Major achievement, celebrates consistency and dedication

✅ **GOOD:**
- "30 days straight? That streak is hotter than a CPU at 95°C." (Tech metaphor)
- "Your brain is now officially a gym rat. 30 days!" (Brain gym positioning)
- "Consistency detected. Your neural pathways are firing like a well-oiled machine." (Mona Tor)
- "Thirty days? Your consistency is printer-perfect!" (Dot Matrix)

❌ **BAD:**
- "You've played 30 days in a row." (Statement of fact, no celebration)
- "Excellent adherence to training protocol." (Clinical, corporate)
- "Nice streak." (Too casual, no excitement)

---

### General / Encouragement

**Context:** Fallback for any session, universally supportive

✅ **GOOD:**
- "Every session trains your brain. Keep going!" (Universal encouragement)
- "Your neurons are doing the Electric Slide. Keep it up!" (Humorous, encouraging)
- "Gameplay detected. Brain training initiated." (Tech flavor, neutral-positive)
- "Your brain data is looking massive. Impressive!" (Terry Byte)

❌ **BAD:**
- "Good effort." (Generic platitude)
- "Continue cognitive exercises." (Clinical instruction)
- "Thanks for playing." (Corporate, transactional)

---

## Anti-Patterns (DO NOT DO)

### ❌ Medical/Clinical Language

**FORBIDDEN TERMS:**
- "Your cognitive performance shows significant improvement."
- "Executive function capacity increased by 12%."
- "Neuroplasticity detected in prefrontal cortex."
- "Cognitive assessment complete. Results: above average."

**WHY FORBIDDEN:** Violates Story 18.6 (no clinical language in dashboard UI). Feels like medical report, not game. Players want fun, not diagnosis.

**REPLACEMENT STRATEGY:** Use tech metaphors instead of clinical terms:
- ❌ "Your executive function improved" → ✅ "Your brain just filed a pull request. Merged!"
- ❌ "Cognitive flexibility score: 0.85" → ✅ "Orange food survival rate: legendary"
- ❌ "Above-average performance" → ✅ "Your neurons are on espresso today"

---

### ❌ Generic Platitudes

**FORBIDDEN PHRASES:**
- "Good job!"
- "Keep trying!"
- "You can do it!"
- "Great work!"
- "Nice effort!"

**WHY FORBIDDEN:** No personality, no tech theme, no connection to caller. Could appear in any game/app. Doesn't leverage CrazySnake's unique voice.

**REPLACEMENT STRATEGY:** Add tech flavor and caller personality:
- ❌ "Good job!" → ✅ "Your prefrontal cortex just filed a pull request. Merged!"
- ❌ "Keep trying!" → ✅ "Every session is compilation practice. You're building those functions."
- ❌ "Great work!" → ✅ "Let me help you organize this: HIGH SCORE achieved!"

---

### ❌ Negative Framing

**FORBIDDEN APPROACHES:**
- "You failed because..."
- "That was a terrible strategy."
- "Maybe this game isn't for you."
- "Your performance was poor."
- "You need to improve significantly."

**WHY FORBIDDEN:** Discouraging, violates "celebrate achievement" principle. Cognitive training requires psychological safety and growth mindset.

**REPLACEMENT STRATEGY:** Reframe negatives as growth opportunities:
- ❌ "You failed" → ✅ "Your neurons are warming up. Give them time."
- ❌ "Terrible strategy" → ✅ "Every session teaches something new. Keep building."
- ❌ "Poor performance" → ✅ "Rome wasn't compiled in a day. Keep going."

---

### ❌ Too Long (Verbose)

**FORBIDDEN LENGTH:**
- Anything over 100 characters
- 3+ sentences
- Requires scrolling to read fully

**EXAMPLE OF TOO LONG:**
"Congratulations on completing your fifth consecutive session of cognitive training! You've unlocked the Skill Map feature, which provides detailed analytics across six cognitive domains including reaction time, spatial awareness, cognitive flexibility, divided attention, impulse control, and working memory. Click the button below to explore your personalized brain profile!" (385 chars)

**WHY FORBIDDEN:** Requires scrolling, feels like work, loses impact, breaks immersion in retro arcade aesthetic.

**FIX:** Edit ruthlessly
- **Too long (385 chars):** [see above]
- **Fixed (54 chars):** "Five sessions complete! Your brain map just rendered."

---

### ❌ Offensive or Exclusionary

**FORBIDDEN TOPICS:**
- Jokes about mental illness, disability, age, gender, race, religion
- Sarcasm that could be misread as mean-spirited
- Cultural references that exclude international players
- Political references
- Inappropriate language or innuendo

**WHY FORBIDDEN:** CrazySnake is inclusive. Humor should unite players, not divide. Cognitive training is for everyone.

**SAFE TOPICS:**
- Tech/programming humor (universal among target audience)
- Self-deprecating AI/computer jokes
- Achievement celebration
- Brain gym / training metaphors
- Retro gaming references (80s arcade, pixels)

---

## Quality Checklist

Before adding a new quote to CALLER_QUOTES, verify ALL criteria:

### Content Quality
- [ ] Tech pun or programming humor present
- [ ] Celebrates achievement or encourages player
- [ ] Under 80 characters (1-2 sentences max)
- [ ] Matches caller personality and voice
- [ ] NO clinical/medical language
- [ ] NO generic platitudes ("Good job!", "Keep trying!")
- [ ] NO negative framing ("You failed because...")
- [ ] NO offensive or exclusionary content

### Context Tagging
- [ ] Contextually tagged appropriately (1-3 tags)
- [ ] Includes 'general' tag as fallback (if universally applicable)
- [ ] Tags match quote content (no mismatch)

### Relevance
- [ ] Quote feels relevant to tagged context
- [ ] Would make sense if player saw it after that performance
- [ ] Not too specific (allows reuse across sessions)
- [ ] Not too generic (has personality and tech flavor)

### Tone
- [ ] Passes "would I want to see this?" test
- [ ] Feels like it came from a tech pun character
- [ ] Maintains CrazySnake's retro arcade playfulness
- [ ] Appropriate for all ages (PG rated)

---

## Caller Distribution

**RULE:** Ensure all 21 callers have 3-5 quotes minimum to maintain variety and equal representation.

**Current Status (as of Story 18.5):**

| Caller | Slug | Quote Count | Status |
|--------|------|-------------|--------|
| Al Gorithm | 01_AlGorithm | 4 | ✅ Above minimum |
| Meg A. Byte | 02_MegaByte | 3 | ✅ At minimum |
| Ali Sing | 03_AliSing | 3 | ✅ At minimum |
| Anna Log | 04_AnnaLog | 3 | ✅ At minimum |
| Ray Tracing | 05_RayTracing | 4 | ✅ Above minimum |
| Pat Ch-Notes | 06_PatCh-Notes | 3 | ✅ At minimum |
| Mac Address | 07_MacAddress | 3 | ✅ At minimum |
| Artie Ficial | 08_ArtieFicial | 3 | ✅ At minimum |
| Floppy Phil | 09_FloppyPhil | 3 | ✅ At minimum |
| Dot Matrix | 10_DotMatrix | 4 | ✅ Above minimum |
| Gia Hertz | 11_GiaHertz | 4 | ✅ Above minimum |
| Perry Pheral | 12_PerryPheral | 3 | ✅ At minimum |
| Terry Byte | 13_TerryByte | 3 | ✅ At minimum |
| Cade Ridger | 14_CadeRidger | 3 | ✅ At minimum |
| Mona Tor | 15_MonaTor | 4 | ✅ Above minimum |
| Syd Ram | 16_SydRam | 3 | ✅ At minimum |
| Bessie IOS | 17_BessieIOS | 4 | ✅ Above minimum |
| Dee Frag | 18_DeeFrag | 3 | ✅ At minimum |
| Buffy Ring | 19_BuffyRing | 3 | ✅ At minimum |
| DJ Snake | 20_DJsnake | 4 | ✅ Above minimum |
| GAME OVER | 21_GAMEOVER | 3 | ✅ At minimum |

**Total Current:** 70 quotes (21 callers, avg 3.3 quotes per caller)
**Minimum Viable:** 63 quotes (21 × 3)
**Recommended Target:** 84-105 quotes (21 × 4-5) for optimal variety

**Next Expansion:** Add 14-35 more quotes to reach 4-5 per caller

---

## Review Process

### For New Quotes

1. **Write draft quote**
   - Identify context (high score, RC death, etc.)
   - Match caller personality
   - Add tech flavor
   - Keep brief (< 80 chars)

2. **Apply quality checklist**
   - Go through all checklist items
   - Fix any violations
   - Verify tone and relevance

3. **Tag with context**
   - Assign 1-3 appropriate tags
   - Include 'general' if universally applicable
   - Verify tags match content

4. **Assign to caller**
   - Choose caller whose personality matches quote
   - Verify caller has < 5 quotes (distribute evenly)
   - Check caller's existing quotes for duplication

5. **Peer review** (recommended)
   - Get 2nd set of eyes
   - Check for tone, relevance, appropriateness
   - Validate tech humor lands

6. **Add to CALLER_QUOTES database**
   - Insert into `js/comedy.js`
   - Follow existing format
   - Ensure unique quote ID

7. **Test in-game**
   - Play session that matches context
   - Verify quote appears appropriately
   - Check tone feels right in context

---

### For Quote Revisions

1. **Identify problem**
   - Too long / Too clinical / Irrelevant / Negative tone

2. **Rewrite following guidelines**
   - Apply relevant principle from this document
   - Use examples as reference

3. **Re-apply quality checklist**
   - Verify all criteria met
   - Compare to anti-patterns

4. **Update in CALLER_QUOTES**
   - Replace old version in `js/comedy.js`
   - Keep same quote ID for tracking

5. **Re-test in-game**
   - Verify revised quote feels better
   - Check contextual relevance still matches

---

## Related Documentation

**Core References:**
- **Story 18.1:** CALLER_QUOTES database structure (`js/comedy.js`)
- **Story 18.2:** Context building and quote selection algorithm
- **Story 18.6:** Clinical language audit (forbidden terms)
- **Story 18.7:** Retro aesthetic guidelines (visual coherence)
- **Story 18.8:** Quote contextual relevance tests

**UX Authority:**
- **`game-ux-principles.md`:** Cognitive science foundation (Hodent, 2018)
- **`ux-design-cognitive-dashboard.md`:** Dashboard UX specifications
- **MEMORY.md:** Sally's UX design authority (visual design bible)

**Phone System:**
- **Epic 9:** Phone call system with caller one-liners
- **`js/phone.js`:** CALLERS database with personality one-liners

---

## Contact & Questions

**Questions about quote guidelines?**
1. Review this document first (check examples and anti-patterns)
2. Check existing CALLER_QUOTES in `js/comedy.js` for reference
3. Refer to Story 18.6 (clinical language) and Story 18.7 (retro aesthetic)
4. Test quotes in-game to validate tone/relevance
5. Use quality checklist to self-review before submitting

**For Updates:**
This is a living document. Update as new patterns emerge, anti-patterns are discovered, or caller personalities evolve.

---

**Document Version History:**
- v1.0 (2026-02-16): Initial guidelines (Story 18.9)
