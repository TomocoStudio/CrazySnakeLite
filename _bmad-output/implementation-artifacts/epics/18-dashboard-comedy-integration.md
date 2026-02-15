# Epic 18: Dashboard Comedy Integration

**Status:** 🔴 NOT STARTED
**Created:** 2026-02-15
**Completed:** —

---

## Overview

Ensure every dashboard interaction feels like CrazySnake — tech-pun callers comment on cognitive performance with humor, contextual quotes are selected based on player achievements, no clinical language appears anywhere in dashboard UI, and retro pixel art aesthetic is maintained throughout. This epic integrates comedy systematically across Epic 14 (post-game highlights), Epic 15 (calibration celebration), and Epic 16 (Skill Map) by creating a caller quote database with performance context mapping, implementing intelligent quote selection algorithms, and applying CrazySnake's personality layer to all dashboard surfaces. Comedy is NOT decoration — it's a primary engagement driver that differentiates CrazySnake from competitors like Lumosity (clinical) and BrainHQ (medical).

**FRs covered:** FR199-FR205 (Contextual caller quotes, performance-based selection, achievement labels with humor, no medical terminology, retro aesthetic consistency)

**NFRs covered:** NFR65-NFR66 (celebratory tone validation, contextual relevance)

**Value:** Maintains brand personality across all dashboard surfaces. Humor makes cognitive tracking feel fun, not like homework. Quotes provide social validation ("Kernel Sanders says my brain is impressive!"). Comedy is proven engagement driver from phone calls (Epic 9) — extending it to dashboard ensures consistency and delight.

**Dependencies:** Integrates into Epic 14 (post-game quotes), Epic 15 (calibration quotes), Epic 16 (Skill Map quotes)

---

## Stories

### Story 18.1: Create Caller Quote Database with Performance Context

**As a** developer,
**I want** a structured caller quote database with performance context tags,
**So that** quotes can be intelligently matched to player achievements.

**Acceptance Criteria:**

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

### Story 18.2: Implement Contextual Quote Selection Algorithm

**As a** player,
**I want** caller quotes to feel relevant to my performance,
**So that** humor enhances (not distracts from) cognitive feedback.

**Acceptance Criteria:**

**Given** post-game highlights are displayed
**When** selecting caller quote
**Then** determine performance context:
```javascript
const context = [];
if (score > 80) context.push('high_score');
if (score < 20) context.push('low_score');
if (highlights.includes('personal_best')) context.push('personal_best');
if (cognitiveStats.rcSurvived >= 3) context.push('rc_survived');
if (diedDuringRC) context.push('death_during_rc');
if (comboMultipliers >= 3) context.push('combo_master');
if (phoneCallsManaged >= 6) context.push('phone_ace');
```
**And** query CALLER_QUOTES for quotes matching any context tag
**And** prioritize quotes matching multiple tags (higher relevance)

**Given** player achieves personal best in Reaction Time
**When** post-game quote is selected
**Then** prioritize quotes tagged with 'personal_best' and 'reaction_time'
**And** select from matching pool:
```
"Lightning reflexes detected. Your neurons are on espresso today."
                              — Cache Money
```

**Given** player dies during Reverse Controls
**When** post-game quote is selected
**Then** prioritize 'death_during_rc' context
**And** select empathetic/encouraging quote:
```
"Reverse Controls: where good snakes go to humble themselves."
                              — Floppy Phil
```

**Given** player completes calibration (session 5)
**When** celebration message displays
**Then** select quote tagged with 'calibration_complete':
```
"Five sessions complete! Your brain map just rendered. Check it out!"
                              — Git Committer
```

**Given** player achieves 30-day streak
**When** post-game or Skill Map displays
**Then** select quote tagged with 'streak_milestone_30':
```
"30 days straight? That streak is hotter than a CPU at 95°C."
                              — Ray Tracer
```

**Per FR201:** Caller quote selection uses performance context: high score → celebratory, death during RC → empathetic, streak milestone → encouraging

---

### Story 18.3: Integrate Quotes into Post-Game Highlights

**As a** player,
**I want** post-game highlights to include a funny caller quote,
**So that** cognitive feedback feels entertaining, not clinical.

**Acceptance Criteria:**

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

### Story 18.4: Integrate Quotes into Skill Map Dashboard

**As a** player,
**I want** the Skill Map to show a funny quote on each visit,
**So that** checking my profile feels delightful, not dry.

**Acceptance Criteria:**

**Given** Skill Map displays
**When** rendering dashboard (Epic 16)
**Then** select rotating caller quote for this visit
**And** display below session count/streak:
```
┌─────────────────────────────────────┐
│  Sessions: 47     Streak: 12 days 🔥│
│                                     │
│  "Your neurons are doing the        │
│   Electric Slide. Keep it up!"      │
│                   — DJ Algorithm    │
└─────────────────────────────────────┘
```

**Given** player opens Skill Map multiple times
**When** quote selection runs each visit
**Then** rotate through different quotes (never same twice in a row per FR180)
**And** track lastSkillMapQuoteId in sessionStorage

**Given** player has active milestone (30-day streak, 100 sessions)
**When** Skill Map displays
**Then** prioritize milestone-tagged quotes:
```
"100 sessions in? Your brain is officially a gym legend."
                              — Cache Money
```

**Given** strongest domain is Spatial Awareness
**When** selecting Skill Map quote
**Then** occasionally select domain-specific quote:
```
"Your spatial awareness is off the charts. Snake GPS installed."
                              — Ray Tracer
```

**Given** no specific context matches
**When** fallback selection runs
**Then** choose general achievement/encouragement quote
**And** maintain humor tone (never clinical)

**Per FR180, FR200:** Rotating caller quote displayed on each dashboard visit (refreshes on view, humor not clinical)

---

### Story 18.5: Add Celebration Quote for Calibration Complete

**As a** player completing calibration,
**I want** a celebratory caller quote when my Skill Map unlocks,
**So that** the achievement feels recognized and fun.

**Acceptance Criteria:**

**Given** player completes session 5 (calibration complete)
**When** post-game celebration displays (Epic 15)
**Then** show calibration-complete quote:
```
Your Skill Map is ready! 🎉

"Five sessions complete! Your brain map just rendered. Check it out!"
                              — Git Committer

┌────────────┐  ┌────────────┐
│ PLAY AGAIN │  │ SKILL MAP  │ (pulsing)
└────────────┘  └────────────┘
```

**And** quote contextually matches celebration moment
**And** caller portrait (32x32px) displayed

**Given** calibration complete celebration shows
**When** selecting from calibration_complete quotes
**Then** prioritize quotes that:
- Congratulate on completion
- Reference brain map unlock
- Encourage clicking "Skill Map" button

**Examples:**
```
"Your brain map is ready. Spoiler: it looks impressive."
                              — Kernel Sanders

"Calibration complete. Time to see what your neurons have been up to."
                              — Lambda Calculus
```

**Per FR204:** Calibration complete message includes caller celebration quote

---

### Story 18.6: Verify No Clinical Language Across Dashboard UI

**As a** player,
**I want** all dashboard text to feel like a game, not a medical report,
**So that** cognitive tracking is fun and approachable.

**Acceptance Criteria:**

**Given** any dashboard screen displays (post-game, Skill Map, calibration)
**When** reviewing all text content
**Then** verify NO clinical/medical terminology:

**❌ FORBIDDEN TERMS:**
- "cognitive deficit", "impairment", "dysfunction"
- "clinical assessment", "diagnostic"
- "neurological", "neuropsychological"
- "brain age", "mental acuity score"
- "percentile ranking" (competitive clinical framing)

**✅ ALLOWED GAME-NATIVE TERMS:**
- "Skill Map" (not "Brain Map" in player-facing UI)
- "Recap" (not "Cognitive Assessment")
- "Warming up..." (not "Calibrating brain...")
- "Top Skill" / "Level Up" (not "Strongest" / "Weakest")
- "Rest day logged" (not "Streak broken")

**Given** domain labels display on Skill Map
**When** rendering 6 cognitive domains
**Then** use game-friendly labels:
- "Reaction" or "Reaction Time" ✅ (not "Processing Speed" ❌)
- "Spatial" ✅ (not "Spatial Cognition" ❌)
- "Flexibility" ✅ (not "Executive Function" ❌)
- "Attention" ✅ (not "Divided Attention Capacity" ❌)
- "Impulse" ✅ (not "Inhibitory Control" ❌)
- "Memory" or "Working Memory" ✅ (not "Working Memory Capacity" ❌)

**Given** achievement labels display
**When** celebrating player performance
**Then** use humor, not clinical precision:
```
✅ "Your prefrontal cortex just filed a pull request. Merged without conflicts."
❌ "Executive function performance increased by 12.3% (p < 0.05)."

✅ "Survived 4 Reverse Controls — brain on fire 🔥"
❌ "Cognitive flexibility score: 0.87 (above average)"
```

**Per FR202-FR203:** Achievement-style labels use humor not clinical language, no medical terminology anywhere in dashboard

---

### Story 18.7: Maintain Retro Aesthetic Consistency

**As a** player,
**I want** all dashboard screens to match CrazySnake's retro pixel art style,
**So that** the cognitive mirror feels like part of the game, not a corporate analytics tool.

**Acceptance Criteria:**

**Given** any dashboard screen renders
**When** applying visual styling
**Then** follow retro 8-bit aesthetic:
- Jersey20 font throughout (no modern sans-serif)
- Pixel art caller portraits (32x32px or 64x64px, crisp edges)
- Solid flat colors (no gradients)
- Sharp or minimally rounded borders (8px or 12px border-radius max)
- Purple theme color rgb(157, 178, 221) for accents
- Dark overlays with structural borders (double-border pattern)

**Given** Skill Map block bars render
**When** displaying 6 domains
**Then** use square pixel blocks (16x16px, no rounded corners per UX audit)
**And** filled blocks: solid purple (no gradient)
**And** empty blocks: dark grey with 1px border (pixel-perfect alignment)

**Given** caller portraits display
**When** rendering quotes
**Then** use `image-rendering: pixelated` CSS property
**And** maintain crisp pixel edges (no anti-aliasing blur)
**And** consistent portrait size: 32x32px on post-game/Skill Map

**Given** animations run on dashboard
**When** elements transition or pulse
**Then** keep animations simple and retro-authentic:
- Simple fades (opacity changes)
- Scale pulses (1.0 → 1.05 → 1.0)
- No easing curves that feel "smooth/modern" (use linear or ease-out only)

**Given** user compares dashboard to game board
**When** visual consistency check runs
**Then** dashboard feels like "menu screen" (same aesthetic family as main menu, game over screen)
**And** does NOT feel like "external analytics dashboard" (modern, clinical, corporate)

**Per FR205:** Dashboard maintains CrazySnake's retro pixel art and Jersey20 font aesthetic

---

### Story 18.8: Test Quote Contextual Relevance

**As a** developer,
**I want** quotes to feel relevant to player performance,
**So that** comedy enhances engagement rather than feeling random.

**Acceptance Criteria:**

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

### Story 18.9: Create Comedy Quote Content Guidelines

**As a** content creator,
**I want** clear guidelines for writing new caller quotes,
**So that** all quotes maintain CrazySnake's voice and quality.

**Acceptance Criteria:**

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
