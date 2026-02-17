---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish', 'step-e-01-discovery', 'step-e-02-review', 'step-e-03-edit']
inputDocuments: ['_bmad-output/planning-artifacts/product-brief-CrazySnakeLite-2026-01-13.md', '_bmad-output/planning-artifacts/product-brief-CrazySnakeLite-2026-02-15.md', '_bmad-output/planning-artifacts/game-ux-principles.md', '_bmad-output/planning-artifacts/game-design-food-v2.md', '_bmad-output/planning-artifacts/game-design-phone-calls-v2.md', '_bmad-output/planning-artifacts/ux-design-food-phone-v2.md']
workflowType: 'prd'
workflow: 'edit'
briefCount: 2
researchCount: 0
brainstormingCount: 0
projectDocsCount: 4
classification:
  projectType: 'web_app'
  domain: 'cognitive_fitness_gaming'
  complexity: 'medium'
  projectContext: 'greenfield'
v2_rewrite: true
repositioning: 'Brain Gym for the Age of AI'
lastEdited: '2026-02-16'
editHistory:
  - date: '2026-02-16'
    changes: 'Integrated V3 Retro Visual Upgrade - added 8 visual enhancements (Progressive Dark Playfield, Distinctive Food Shapes, CRT Glow, Snake Personality, Typography, Scanlines, Reactive Border, Grid Enhancement) implementing authentic 80s arcade aesthetic. Added 23 new FRs (FR206-228) and 19 new NFRs (NFR68-86). Based on UX design spec (ux-design-retro-graphic-upgrade.md) and Architecture V4 decisions. Covers Epics 19-21.'
  - date: '2026-02-15'
    changes: 'Integrated Cognitive Dashboard MVP into V2 scope - added 6 core dashboard features (metrics engine, post-game highlights, brain map, calibration, streaks, comedy integration) across all PRD sections. Added 56 new FRs (FR150-205) and 23 new NFRs (NFR43-67). Updated Success Criteria, User Journeys, Innovation, Scoping, Technical Requirements.'
---

# Product Requirements Document — CrazySnakeLite

**Author:** Mary (Analyst) with Celia (Neuro-Game Design Expert)
**Date:** 2026-02-08 | **Last Updated:** 2026-02-16
**Version:** 3.0 — Brain Gym with Cognitive Dashboard & Neon Noir Aesthetic

---

## Vision Statement

CrazySnakeLite is a **cognitive fitness tool disguised as an arcade game** — a brain gym built for the age of AI. It transforms the universally known Snake into a progressively demanding cognitive training system that targets the faculties most threatened by AI dependency: executive function, working memory, divided attention, decision-making under uncertainty, impulse control, and cognitive flexibility.

The **Cognitive Dashboard** completes the brain gym experience by providing players with a personal "cognitive mirror" — letting them see, understand, and track their cognitive growth over time. Without visible progress, a gym isn't a gym — it's just exercise. The dashboard transforms CrazySnake from "that fun snake game" into "my daily brain workout with receipts."

**Core Design Axioms:**
- Score-based, never time-based — reward what the player achieves
- Difficulty is the product — the cognitive challenge is what the player came for
- Comedy is a system — humor makes the brain workout enjoyable
- Teach by encounter — every mechanic is learned through play
- Targeted challenge over raw chaos — a brain gym rotates cognitive demands
- Progress tracking is free — democratizing cognitive insights that competitors paywall ($14.99/mo Lumosity)
- Privacy by default — local-first storage, no accounts, no server tracking

**Mandatory Foundation:** All design decisions must reference `game-ux-principles.md` — the cognitive science baseline derived from Hodent (2018), Schell (2008), and Sylvester (2013).

---

## Success Criteria

### User Success

**Primary Success Signal:** Players feel mentally sharper after playing

- **Cognitive Engagement:** Players regularly reach score 40+ (indicates sustained engagement beyond comfort zone)
- **System Engagement:** Players use Pick Up (not just End), engage with blinking food, survive combo mode (indicates cognitive systems are being exercised)
- **Replay Rate:** Players immediately hit "Play Again" after death (challenge is compelling, not frustrating)
- **Score Progression:** Scores improve over multiple sessions (indicates genuine cognitive skill growth)
- **Perceived Benefit:** Players describe the experience as "hard but fun" and feel sharper after playing

**Success Moment:** Within 30 seconds of playing, the first phone call arrives (score 3). The player must split attention between navigating the snake and deciding End vs Pick Up. "This is NOT regular Snake — this is making me think!"

### Business Success

**Primary Goal:** Establish CrazySnakeLite as the first casual browser game positioned as cognitive fitness for the AI age

**Success at 1 Month:**
- V2 shipped and playable with all five cognitive challenge systems functional
- Cognitive Dashboard MVP deployed with all 6 core features (metrics engine, post-game highlights, brain map, calibration, streaks, comedy)
- Prototype testing with knowledge workers validates the "brain gym" positioning
- Core cognitive loop working: Fibonacci scoring → phone calls → blinking food → combo mode → reverse controls → dashboard tracking
- Players report feeling cognitively engaged, not just entertained
- Dashboard engagement validated: 60%+ of sessions include brain map view, 70%+ complete calibration period

**Success at 3 Months:**
- Return rate validates lasting engagement (players come back for the cognitive workout)
- Dashboard drives measurable retention lift: Day-7 retention +15% vs. pre-dashboard baseline, Day-30 retention +25%
- Post-game highlights ("Your Brain Today" Layer 1) resonate: 80%+ see highlights before Play Again
- Streak mechanic takes hold: 50%+ of weekly players maintain 3+ day streak
- Players actively check cognitive progress: Brain map becomes part of pre-game ritual for 40%+ of returning players
- Decision point clear: proceed to V2 dashboard expansion (sharing, trends, milestones) or focus on distribution

### Technical Success

**Performance Requirements:**
- **Frame Rate:** Smooth 60 FPS gameplay (maintained during phone overlays, combo mode, blinking food, and all concurrent systems)
- **Browser Compatibility:** Works on Chrome, Firefox, Safari, Edge (desktop primary)
- **Mobile Responsive:** Playable on mobile browsers with touch controls
- **Load Time:** Game loads and starts within 3 seconds
- **No Game-Breaking Bugs:** All five cognitive challenge systems function reliably

**Technical Validation:**
- Snake movement responsive and predictable
- Food effects trigger within 200ms of consumption (temporal contiguity — Hodent)
- Phone call overlay renders correctly with game continuing underneath
- Blinking food color cycling smooth at 200ms intervals
- Combo mode canvas transitions at 500ms smooth fade
- Score popup system queues correctly with 300ms stagger
- Post-game cognitive feedback displays correct stats
- Collision detection accurate across all effect states

### Measurable Outcomes

| Metric | Target | What It Validates |
|--------|--------|-------------------|
| Session replay rate | 70%+ play 2+ games | Challenge is compelling, not frustrating |
| Score 40+ reach rate | 50%+ of sessions | Players engage beyond comfort zone |
| Pick Up usage | 40%+ of phone calls | Risk/reward decision is appealing |
| Return rate (next day) | 30%+ | Lasting engagement, not one-time novelty |
| Post-game highlights engagement | 80%+ see highlights before Play Again | Dashboard Layer 1 (hot moment) resonates |
| Brain map view rate | 60%+ of sessions | Dashboard Layer 2 (cool moment) is compelling |
| Calibration completion rate | 70%+ reach session 5 | Calibration creates anticipation, not churn |
| Streak adoption | 50%+ of weekly players maintain 3+ day streak | Daily habit mechanic works |
| Day-7 retention lift | +15% vs. pre-dashboard baseline | Dashboard drives return visits |
| Day-30 retention lift | +25% vs. pre-dashboard baseline | Dashboard sustains long-term engagement |
| Average session length | 5-10 minutes | Fits break-time cognitive workout use case |

---

## User Journeys

### Primary User: Alex, The Cognitive Athlete

**Persona Overview:**
- **Name:** Alex
- **Context:** Knowledge worker, mid-20s to late 30s, heavy AI tool user
- **Situation:** Notices they're less sharp — harder to focus, harder to hold complex ideas, more reliant on AI assistants for tasks they used to do mentally
- **Goal:** A quick cognitive workout during breaks that leaves the brain feeling active, not numb
- **Obstacle:** Traditional break activities (social media, passive video) make cognitive softness worse. Brain training apps feel like homework.
- **Solution:** CrazySnakeLite delivers genuine cognitive exercise through a game they already know how to play

#### Journey 1: Discovery & First Cognitive Workout (Happy Path)

**Opening Scene — The Need:**

It's 2:30pm on a Tuesday. Alex is staring at spreadsheets, brain fried from a morning of meetings. They realize they just asked their AI assistant to write an email they could have written themselves — it was easier than thinking. That thought nags. They remember playing Snake on their Nokia 3310 — simple, engaging, no cognitive outsourcing. They search for a quick brain break.

CrazySnakeLite appears: "A brain gym disguised as Snake." Curiosity piqued. Click.

**Rising Action — The Cognitive Layers Unfold:**

The page loads instantly. Retro 8-bit pixel art, light grey canvas. Big "NEW GAME" button. Alex clicks.

The snake appears. Arrow keys work. Green food — eat it — +1 popup. Classic Snake. "Yeah, I know this."

Score reaches 3. A phone rings — **AL GORITHM is calling.** Two buttons: End (+1) or Pick Up (+2). The game keeps running underneath, blurred! Alex's brain snaps to attention — navigate the snake AND make a decision? They hit Space (End). +1 point. Phone vanishes. "Wait, the game was still going? That's... different."

Score 8. Another call — **Floppy Phil**. Pick Up +3 this time. Alex presses Enter. A countdown bar appears. "I only have 1.44 MB to talk, so quick!" Alex laughs — but the snake is moving under blur. Bar expires. +3 CALL BONUS popup. Survived!

Score 15. A food item starts blinking through colors — green, yellow, purple, red, cycling rapidly. Tooltip: "Mystery Food! Effect hidden until consumed." Alex eats it — it's Reverse Controls. Up is down, left is right. Brain scrambles. +8 points (huge popup, particles, screen shake). They crash. "WHAT?!"

**Climax — The Realization:**

Play Again. This time Alex knows the systems. By score 40, the canvas turns dark purple — **combo mode.** Snake becomes striped. They eat a second food: 3 × 8 = 24 points! Massive popup. Phone rings during combo — Mona Tor, +8 bonus. Triple cognitive load: combo stakes + phone decision + snake navigation.

Alex survives. Score 67. Dies to self-collision during reverse controls.

**Your Brain Today** appears with dynamic highlights:
- "Personal Best: Reverse Controls survived - 3 times! 🎯"
- "Phone Mastery: Managed 6 calls without panic"
- Caller quote: "Your prefrontal cortex just bench-pressed a truck. Impressive." — Kernel Sanders

Below the highlights: "Session 1/5 — Calibrating your brain..." and "12-day streak 🔥"

Alex stares at the stats. They didn't just play a game. Their brain did real cognitive work — divided attention, executive function override, decisions under uncertainty. And it was *fun*. And now there's... a calibration counter? "What unlocks at session 5?"

**Resolution — The Habit:**

Alex plays 2 more games. Session 3/5... Session 4/5...

**Day 5** — After the fifth game, a message appears: "**Your brain map is ready! Check the dashboard.**" with pixel art fanfare.

Alex clicks "Dashboard." A radar chart blooms on screen — six domains with dot-based ratings:
- **Reaction Time:** 3/5 dots
- **Spatial Awareness:** 4/5 dots
- **Cognitive Flexibility:** 2/5 dots ⬆ (growth area)
- **Divided Attention:** 3/5 dots
- **Impulse Control:** 3/5 dots
- **Working Memory:** 2/5 dots

Callout: "**Your strongest domain:** Spatial Awareness. **Growth opportunity:** Cognitive Flexibility — Reverse Controls are your gym."

Rotating caller quote: "Five sessions in and your neurons are doing the Electric Slide. Keep it up!" — DJ Algorithm

Alex screenshots it. Shares with the same coworker: "Try this — it's like a gym for your brain. Here's my brain map after 5 days."

Next day during morning break, Alex opens CrazySnakeLite, checks their brain map (Cognitive Flexibility jumped to 3 dots!), then hits Play. The streak counter reads: 6 days 🔥

Not for entertainment. For the cognitive workout. With receipts.

#### Journey 2: Edge Case — Frustration to Mastery Motivation

**Opening Scene:**

Second day. Alex starts confident. Score 3 — phone rings immediately. "Already?" Fumbles, hits End. Score 6 — orange food. Reverse Controls. Crashes instantly. 15 seconds. "This is annoying."

**The Learning:**

Third attempt: Alex avoids colored foods, only eats green. No chaos. No challenge. After 2 minutes — bored. Deliberately crashes.

"Wait. The challenge IS the point."

**The Breakthrough:**

Fourth attempt: Alex embraces everything. Speed Boost while long? Navigate carefully. Reverse Controls? Deep breath, think before pressing. Phone call during blinking food? End it fast, reassess.

Score 52. Combo mode triggers. Canvas turns dark blue. Strategic eating — chase the +8 Reverse Controls for maximum combo multiplier. 8 × 5 = 40 points!

Alex dies at score 78. New personal best. **Your Brain Today:** Reverse Controls survived: 5. That number feels like a medal.

**The Mastery:**

Alex realizes: this isn't about avoiding difficulty. Difficulty is the product. Every system is training a different part of the brain. Reverse Controls = executive function. Phone calls = divided attention. Blinking food = uncertainty tolerance. Combo mode = working memory.

**Week 2** — Alex checks the brain map before playing. Cognitive Flexibility has climbed from 2 to 4 dots. Working Memory is still at 2. "That's my target today."

They deliberately seek combo mode. Survive two combos in one game. Post-game highlight: "Working Memory Performance: +22% this session ⬆"

Alex plays every break. Not because it's fun (though it is). Because it makes their brain *work*. And now they can see the work paying off in dots, streaks, and improvement arrows.

### Journey Requirements Summary

**Core Capabilities Revealed:**

1. **Five Cognitive Challenge Systems (All Required):**
   - Fibonacci scoring (6 food types, difficulty-proportional rewards)
   - Phone call interruptions (End vs Pick Up, Fibonacci bonuses, 21 callers)
   - Progressive blinking food (mystery food from score 15, caps at 60%)
   - Combo mode (multiplicative scoring from score 40, caps at 40%)
   - Post-game cognitive feedback ("Your Brain Today" stats)

2. **Core Game Engine:**
   - Grid-based snake movement, 60 FPS, collision detection
   - Four keyboard layouts + mobile touch controls
   - Food spawning with probability-based distribution
   - Effect system (invincibility, wallPhase, speedBoost, speedDecrease, reverseControls)

3. **Progressive Difficulty Curve (Score-Gated):**
   - Score 0-2: Pure motor learning (no phone calls)
   - Score 3-14: Phone calls introduced (divided attention)
   - Score 15-39: Blinking food introduced (uncertainty management)
   - Score 40-99: Combo mode introduced (working memory)
   - Score 100+: Peak cognitive demand (all systems at calibrated levels)

4. **Session Design:**
   - 5-10 minute cognitive workout sessions
   - Play until death (classic arcade style)
   - Immediate restart (no friction)
   - No login, no save/load, zero installation friction

5. **Platform Support:**
   - Desktop web browser primary (Chrome, Firefox, Safari, Edge)
   - Mobile responsive with touch controls (secondary)
   - Static site, no backend for core gameplay

---

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. Cognitive Fitness Through Familiar Gameplay — A New Category**

CrazySnakeLite creates a new product category: **casual cognitive fitness gaming**. No existing product combines universal accessibility (everyone knows Snake), genuine cognitive targeting (each mechanic trains a specific faculty), progressive difficulty (score-gated complexity), and intrinsic entertainment (comedy, emotional peaks, arcade charm).

**Innovation Type:** Category innovation — positioning a casual game as deliberate cognitive exercise for the AI age

**Why This Matters Now:**
- AI integration is accelerating cognitive offloading across daily tasks
- Brain training apps (Lumosity, Peak) failed on engagement — they feel like homework
- Traditional Snake variants add cosmetic changes, not cognitive depth
- No product addresses the specific concern: "AI is making my brain softer"
- CrazySnakeLite is the answer positioned at the intersection of nostalgia, science, and fun

**2. Five-Layer Progressive Cognitive Training System**

Each game mechanic targets a specific cognitive faculty, introduced through score-gated progression:

| Layer | Mechanic | Cognitive Faculty Trained | Score Gate |
|-------|----------|--------------------------|------------|
| 1 | Fibonacci Scoring | Pattern recognition, risk assessment | Score 0+ |
| 2 | Phone Call Interruptions | Divided attention, context-switching | Score 3+ |
| 3 | Progressive Blinking Food | Decision-making under uncertainty | Score 15+ |
| 4 | Combo Mode | Working memory, multiplicative thinking | Score 40+ |
| 5 | Reverse Controls | Executive function override (crown jewel) | Any time |

**Innovation Type:** Mechanic innovation — structured cognitive training through layered game systems, not random difficulty spikes

**3. Comedy as Cognitive Engagement System**

21 tech-pun callers with retro pixel portraits and one-liners (revealed only on Pick Up) make cognitive interruptions *entertaining*. Humor functions as an epistemic reward (Kang et al., 2009) — satisfying curiosity activates the same dopamine pathways as monetary rewards. Players Pick Up partly to *discover* what each caller says.

**Innovation Type:** Engagement innovation — humor as a systemic driver of risk-taking and replay, not decoration

**4. Post-Game Metacognitive Feedback**

"Your Brain Today" transforms the death screen from failure into cognitive achievement recognition. This is **metacognitive feedback** (Flavell, 1979) — awareness of one's own cognitive processes improves learning and motivation. No other casual game tells the player what their brain just accomplished.

**Innovation Type:** Experience innovation — game-over as cognitive reflection, not just retry prompt

**5. Cognitive Dashboard — Free Progress Tracking with Comedy**

The Cognitive Dashboard is **the first free, fun, transparent cognitive progress tracking system** in casual gaming. While competitors paywall progress insights (Lumosity $14.99/mo, Peak's Brain Maps behind premium), CrazySnake democratizes cognitive tracking with:

- **Six gameplay-derived metrics** (not abstract puzzles) — Reaction Time, Spatial Awareness, Cognitive Flexibility, Divided Attention, Impulse Control, Working Memory
- **Dual-moment architecture** — hot moment celebration (post-game highlights with caller comedy) + cool moment analysis (brain map radar chart with growth insights)
- **Local-first, privacy by default** — localStorage/IndexedDB, no account required, no server tracking, player controls their data
- **Comedy-integrated, never clinical** — tech pun callers comment on performance, humor makes progress tracking feel like CrazySnake, not a medical report
- **Calibration period as anticipation event** — sessions 1-5 build baseline, brain map unlock becomes motivational moment
- **Ethical streak system** — gentle messaging, no guilt, no anxiety, no push notifications (dashboard pulls, not pushes)

No product in the $9.76B brain training market (19% CAGR) combines free access + fun presentation + transparent metrics + genuine cognitive substance. Lumosity charges for opaque LPI scores. Peak gates Brain Maps. BrainHQ feels medical. Duolingo has streaks but no cognitive training. CrazySnake uniquely positions as the **"Duolingo of casual brain training"** — borrowing proven gamification mechanics and applying them to genuine cognitive exercise through arcade gameplay.

**Innovation Type:** Business model innovation + engagement innovation — free cognitive mirror that competitors paywall, comedy as systemic driver of progress awareness, local-first privacy as competitive advantage

### Market Context & Competitive Landscape

| Category | Examples | Why They Fall Short |
|----------|---------|---------------------|
| **Brain training apps** | Lumosity, Peak, Elevate | Feel like homework. Low engagement. Repetitive. FTC fined Lumosity for false advertising. |
| **Traditional Snake variants** | Snake.io, cosmetic reskins | Zero cognitive innovation. Same mechanics since 1998. |
| **Casual mobile games** | Candy Crush, Wordle | Engaging but don't deliberately target cognitive faculties. |
| **Hardcore brain games** | Chess, Go | Excellent cognitive exercise but high barrier to entry. |

**The gap:** No product combines universal accessibility, genuine cognitive targeting, progressive difficulty, and intrinsic entertainment in a single experience. CrazySnakeLite fills this gap.

### Validation Approach

**Primary Validation: Knowledge Worker Testing**

Test with knowledge workers who actively use AI tools daily:

1. **Cognitive Engagement Validation:**
   - **Success Signal:** Players report feeling "sharper" or "more alert" after playing
   - **Success Signal:** Players describe specific cognitive demands ("the reverse controls really made me think")
   - **Failure Signal:** Players describe it as "just a game" with no cognitive awareness
   - **Tuning Levers:** Score thresholds, blinking food percentages, phone call frequency

2. **Brain Gym Positioning Validation:**
   - **Success Signal:** Players spontaneously use words like "workout," "training," "brain exercise"
   - **Success Signal:** Players share framed around cognitive benefit, not just fun
   - **Failure Signal:** Players focus only on entertainment, miss cognitive dimension
   - **Tuning Levers:** Post-game cognitive feedback framing, "Your Brain Today" stats

3. **Difficulty Curve Validation:**
   - **Success Signal:** 50%+ reach score 40 (engage beyond comfort zone)
   - **Failure Signal:** Most players die before score 15 (too hard) or reach 100+ easily (too easy)
   - **Tuning Levers:** Food probabilities, phone call intervals, blinking/combo percentages

**Validation Metrics:**
- Session replay rate (70%+ target)
- Score 40+ reach rate (50%+ target)
- Pick Up usage (40%+ of calls target)
- Return rate next day (30%+ target)
- Qualitative: "Did that feel like a cognitive workout?"

---

## Web App Specific Requirements

### Project-Type Overview

CrazySnakeLite is a Single Page Application (SPA) delivered via web browser. Pure client-side JavaScript game with no server-side rendering or backend dependencies for core gameplay. Designed for instant load and immediate play with zero installation friction.

**Architecture:**
- Vanilla JavaScript, module-based (ES modules)
- Canvas-based rendering for retro pixel art
- DOM-based overlays for phone calls, menus, cognitive feedback
- Stateless sessions (no server persistence)
- High score via localStorage

### Browser Support Matrix

**Primary Targets (Must Work Perfectly):**
- Chrome 90+ (desktop and mobile)
- Firefox 88+ (desktop and mobile)
- Safari 14+ (desktop and mobile)
- Edge 90+ (desktop)

**Testing Priority:**
1. Chrome desktop (primary development target)
2. Chrome mobile (secondary)
3. Firefox desktop
4. Safari desktop and iOS
5. Edge desktop

### Responsive Design Approach

**Desktop Primary:**
- Game board sized for typical desktop browser window
- Keyboard controls (Arrow keys, WASD, ZQSD, Numpad, Space, Enter)
- Optimized for 1920x1080 and 1366x768 resolutions
- Minimum viable resolution: 1024x768

**Mobile Responsive (Secondary):**
- Touch swipe controls for snake direction
- Tap buttons for phone call decisions (End/Pick Up)
- Game board scales to fit mobile viewport
- Portrait and landscape orientations supported
- Phone call buttons stack vertically on mobile (End on top for safe-choice priority)

**Control Mapping:**
- Desktop: Arrow keys/WASD/ZQSD/Numpad for movement, Space for End call, Enter for Pick Up
- Mobile: Swipe for movement, tap End/Pick Up buttons

### Performance Targets

**Critical Performance Requirements:**

1. **Frame Rate:**
   - 60 FPS during normal gameplay
   - 60 FPS maintained during phone call overlay (game continues underneath)
   - 60 FPS maintained during combo mode (canvas transitions, striped snake)
   - 60 FPS maintained with blinking food cycling + score popups + particles
   - No frame drops during peak cognitive demand (all systems active simultaneously)

2. **Load Time:**
   - Initial page load: < 3 seconds
   - Game start (after load): < 0.5 seconds
   - No loading screens during gameplay

3. **Memory:**
   - Client-side memory usage < 100MB
   - No memory leaks during extended play sessions (30+ minutes)
   - Garbage collection doesn't cause frame drops

4. **Responsiveness:**
   - Input lag < 50ms (keyboard/touch to snake movement)
   - Score popup spawn < 200ms after food consumption (temporal contiguity)
   - Phone call dismiss < 100ms (Space/tap to overlay removal)
   - Instant restart on "Play Again" click

### SEO Strategy

**Brain Gym Positioning SEO:**
- Page title: "CrazySnakeLite — Brain Gym for the Age of AI"
- Meta description: "A cognitive fitness tool disguised as Snake. Five brain training systems. 21 tech-pun callers. Difficulty is the product."
- Open Graph tags for link sharing (retro pixel art preview)
- Semantic HTML structure

**Post-MVP:**
- Landing page with brain-gym positioning and embedded game
- Schema.org Game markup
- OG tags optimized for Twitter/Slack/LinkedIn sharing

### Accessibility Level

**Included in V2:**
- Keyboard navigation (4 layout options) — inherently accessible
- Clear visual distinction between food types (color + shape)
- Large tap targets for mobile (minimum 44px, phone buttons)
- No reliance on audio (visual-only feedback sufficient)
- Reduced motion mode (prefers-reduced-motion detection)
  - Blinking food: 500ms per color instead of 200ms, or alpha pulse
  - Score popups: simple fade, no bounce/rotation
  - Screen shake disabled
  - Combo canvas transition instant (no 500ms fade)

**Post-V2 Accessibility:**
- Colorblind mode (shape-coded food types)
- Screen reader support for scores and game state
- Adjustable game speed
- High contrast mode
- WCAG 2.1 AA compliance

### Technical Implementation

**Technology Stack:**
- Vanilla JavaScript (ES modules, no framework)
- HTML5 Canvas for game rendering
- CSS for UI overlays (phone calls, menus, cognitive feedback, score popups)
- Web Audio API for 8-bit sound system

**Game Loop Architecture:**
- RequestAnimationFrame for smooth 60 FPS rendering
- Fixed time step for game logic (consistent gameplay regardless of frame rate)
- Separate render and update loops
- Event-driven input handling

**State Management:**
- Module-based state (no external state library)
- Game state: snake position, food positions, active effects, score, cognitiveStats
- Phone state: active, caller, pickedUp, pickUpCount, pickUpEndTime
- Combo state: active, effectA, effectB, canvasColor
- Dashboard state: sessionHistory (array of session objects), currentStreak, calibrationComplete, lastPlayedDate
- Metrics state: reaction time buffer, spatial awareness history, cognitive flexibility ratios, divided attention scores, impulse control decisions, working memory performance
- Config state: all tunable parameters in config.js

**Storage Architecture:**
- localStorage for high score and simple preferences (< 10KB)
- IndexedDB for cognitive metrics session history (structured data, 100+ sessions, < 5MB total)
- Session data structure: { sessionId, timestamp, score, metrics: { reactionTime, spatialAwareness, cognitiveFlexibility, dividedAttention, impulseControl, workingMemory }, events: [...] }
- Streak tracking via localStorage (lastPlayedDate, currentStreak)
- Calibration state via localStorage (sessionsCompleted, calibrationComplete)
- No external database, no server-side persistence for core functionality
- Privacy by default: all data local to browser, no transmission

**Deployment:**
- Static site hosting (Netlify, Vercel, GitHub Pages)
- Single HTML file + JS modules + CSS + assets
- No server-side components
- No build step required (optional for production optimization)

---

## Project Scoping & Phased Development

### V2 Strategy & Philosophy

**V2 Approach:** Cognitive Fitness MVP with Progress Tracking — Validate Brain Gym Positioning & Retention

CrazySnakeLite V2 ships all five cognitive challenge systems PLUS the Cognitive Dashboard MVP. Success is defined by whether knowledge workers perceive the game as a cognitive workout — not just entertainment — AND whether the dashboard drives measurable retention lift.

**Core Philosophy:**
- Ship ALL five cognitive training layers in V2 (no partial implementation)
- Ship Cognitive Dashboard MVP (6 core features: metrics engine, post-game highlights, brain map, calibration, streaks, comedy integration)
- Validate the "Brain Gym for the AI Age" positioning with target users
- Validate that visible cognitive progress drives retention (D7 +15%, D30 +25% targets)
- Cognitive engagement is the primary success metric, not just fun
- Every mechanic must have a clear cognitive training target
- Difficulty is the product — never make it easier just to reduce churn
- Progress tracking is free — democratizing cognitive insights that competitors paywall ($14.99/mo Lumosity)

### V2 Feature Set (Current)

**Core User Journey Supported:**
Alex's Journey: Discovery → First Cognitive Workout → Mastery Motivation → Daily Brain Gym Habit

**1. Fibonacci Scoring System (6 Food Types)**

| Food Type | Color | Shape | Points | Cognitive Training |
|-----------|-------|-------|--------|-------------------|
| Invincibility | Yellow | Star | 0 | Impulse control (safety vs. score trade-off) |
| Growing | Green | Circle | +1 | Baseline motor + pattern recognition |
| Speed Decrease | Cyan | Square | +2 | Cognitive breathing room, strategic planning |
| Wall Phase | Purple | Diamond | +1/+3 | Spatial reasoning, active skill expression |
| Speed Boost | Red | Triangle | +5 | Reflexes under pressure, motor precision |
| Reverse Controls | Orange | Hexagon | +8 | Executive function override (crown jewel) |

- Score = foods eaten + phone bonuses + combo multipliers
- All food types give +1 segment when consumed
- Duration rule: timed effects end after eating next food
- Probability distribution configurable in config.js

**Score Popup System (Visual Feedback Proportional to Difficulty):**

| Points | Font Size | Color | Effects | Duration |
|--------|-----------|-------|---------|----------|
| +1 | 16px | White | Simple fade | 500ms |
| +2 | 16px | Light green | Slightly longer | 600ms |
| +3 | 20px | Gold | Slight bounce | 700ms |
| +5 | 28px | Orange | Bounce + glow | 800ms |
| +8 | 40px | Red/Gold | Bounce + rotation + particles + screen shake | 1000ms |

**2. Phone Call V2 — Pick Up vs End (Divided Attention Training)**

- Two-button overlay: End (+1, safe, instant) or Pick Up (+Fibonacci bonus, risky, 1-3s blur)
- 21 tech-pun callers with 64x64 retro pixel portraits and comedy one-liners
- One-liners revealed only on Pick Up (humor as reward for risk-taking)
- Fibonacci Pick Up bonus per game: +2, +3, +5, +8, +13, +21, +34 (cap)
- Pick Up is irreversible — committed once pressed
- Consolation reward: bonus still awarded if player dies during Pick Up
- Score-based grace period: no calls until score 3
- Score-based frequency tiers:

| Score Range | Min Delay | Max Delay | Cognitive Training |
|------------|-----------|-----------|-------------------|
| 3-14 | 12s | 20s | Introduction — learn divided attention |
| 15-39 | 8s | 15s | Integration — manage with uncertainty |
| 40-59 | 6s | 12s | Load stacking — calls + combos |
| 60-99 | 5s | 10s | Mastery — sustained divided attention |
| 100+ | 4s | 8s | Peak — relentless context-switching |

**3. Progressive Blinking Food (Uncertainty Training)**

- Mystery food cycling through all 6 colors at 200ms/color
- Effect type locked at spawn, hidden until consumed
- Starts at score 15, caps at 60% at score 80+

| Score Range | Blinking % | Cognitive Training |
|-------------|-----------|-------------------|
| 0-14 | 0% | Baseline pattern recognition |
| 15-19 | 10% | First uncertainty tolerance |
| 20-29 | 20% | Risk assessment with partial info |
| 30-39 | 30% | Comfort with ambiguity |
| 40-59 | 40% | Multi-system uncertainty |
| 60-79 | 50% | Peak uncertainty challenge |
| 80+ | 60% (cap) | Sustained ambiguity management |

Why cap at 60%: At higher percentages, decisions become random (amygdala-driven reactivity). At 60%, 40% of food remains identifiable — preserving strategic thinking. A brain gym should always have a learnable skill dimension.

First-time tooltip at score 15: "Mystery Food! Effect hidden until consumed"

**4. Combo Mode (Working Memory Training)**

- Two food effects combine for multiplicative scoring
- Canvas changes to dark color (purple, blue, red, or green — random), 500ms fade
- Snake becomes striped (alternating Effect A / Effect B colors)
- Score for food B = A × B (e.g., Reverse 8 × Speed Boost 5 = 40 points)
- Third food eaten = exit combo mode
- Starts at score 40, caps at 40% probability at score 120+

| Score Range | Combo % | Cognitive Training |
|-------------|---------|-------------------|
| 0-39 | 0% | Other systems being learned |
| 40-59 | 10% | Introduction — learn new system |
| 60-79 | 20% | Integration with blinking + phone |
| 80-99 | 30% | Regular challenge |
| 100-119 | 35% | Frequent but not dominant |
| 120+ | 40% (cap) | Regular but never the only challenge |

Why cap at 40%: Above 50%, combo becomes background noise, not a special event. At 40%, it remains a distinct peak experience. Targeted challenge over raw chaos.

**Cross-system rule:** Combo timer pauses during phone calls (respects cognitive budget at combo learning phase).

**5. Post-Game Cognitive Feedback ("Your Brain Today")**

After death, before Play Again, display 2-3 cognitive achievement stats:

| Stat | Display Text | Cognitive Faculty |
|------|-------------|-------------------|
| RC survived | "Reverse Controls survived: N" | Executive function |
| Phone calls managed | "Phone calls managed: N" | Divided attention |
| Mystery foods eaten | "Mystery foods decoded: N" | Uncertainty tolerance |
| Combo multipliers | "Combo multipliers: N" | Working memory |
| Pick Up streak | "Pick Up streak: N" | Risk assessment |
| Peak combo score | "Best combo: ×N" | Peak cognitive performance |

Selection logic: Show top 2-3 stats (highest values). Never show zero-value stats. Only show achievements, never failures.

Timing: Stats fade in 300ms after score, stagger 300ms per line, hold 2.5s, fade out 500ms. Play Again button appears after stats fade (~3.3s total).

Tone: Celebratory, not clinical. "My brain did that." — not a medical report.

**6. Reverse Controls: The Crown Jewel**

- Highest Fibonacci reward (+8) for highest cognitive demand
- Requires executive function override: suppress learned motor pattern, remap controls
- Engages prefrontal cortex — the brain region most threatened by AI dependency
- "RC SURVIVED" flash (12px, white, 400ms) after navigating successfully
- Tracked in cognitive stats as headline achievement

**7. Core Snake Gameplay**

- Grid-based movement (25 × 20 units, 10px/unit)
- Collision detection: walls (unless invincibility/wall-phase), self (unless invincibility)
- Starting length: 5 segments, bottom-left, moving right
- Base speed: 8 moves/second
- Speed Boost: 1.5-2x, Speed Decrease: 0.3-0.5x
- Four keyboard layouts: Arrow, WASD, ZQSD, Numpad
- Mobile: swipe gestures for direction, tap for phone buttons
- 60 FPS via RequestAnimationFrame
- Persistent high score via localStorage

**8. Audio System**

- Web Audio API for zero-latency playback
- Fibonacci musical progression: C(+1), D(+2), E(+3), G(+5), C-major-chord(+8)
- State-based movement sounds (7 states × 2 alternating sounds)
- Combo entrance fanfare (rising arpeggio) + exit deflation (descending slide)
- Nokia-style phone ring loop
- Game over melody
- Menu background music (8-bit looping)

**9. Visual Design System**

- Retro 8-bit pixel art aesthetic
- Jersey20 font throughout
- Purple theme: rgb(157, 178, 221) for UI elements
- Sharp corners on phone overlay (Nokia aesthetic)
- Rounded corners (12px) on menus, (8px) on buttons
- Z-index hierarchy: Phone overlay (400) > Tooltips (300) > Score popups (200) > Score display (100) > Canvas (0)

**10. Cognitive Dashboard MVP (6 Core Features)**

**a) Cognitive Metrics Data Engine**
- Silent collection of 6 gameplay-derived cognitive metrics from session one:
  - **Reaction Time:** Rolling avg of input response time during normal gameplay
  - **Spatial Awareness:** Snake length at death / grid coverage percentage
  - **Cognitive Flexibility:** Performance ratio during Reverse Controls vs. normal play
  - **Divided Attention:** Survival rate + decision speed during phone calls
  - **Impulse Control:** Weighted Pick Up vs End decision ratio by game context
  - **Working Memory:** Score rate during combo mode vs. normal gameplay
- Storage: localStorage/IndexedDB (no server, no account, privacy by default)
- Data persists across sessions on same device/browser
- Rolling averages weighted toward recent sessions for responsive metrics
- All calculation logic follows formulas defined in Cognitive Analytics Requirements

**b) Enhanced Post-Game Summary (Layer 1 — Hot Moment)**
- Replaces/enhances current "Your Brain Today" with dynamic, comedy-integrated highlights
- 2-3 highlights selected dynamically per session (never same pattern twice in a row)
- Selection priority: Personal Best > Biggest Improvement > Notable Event > Growth Opportunity
- Comedy caller quotes comment on performance (performance-contextual)
- Up/down arrows and simple language — no clinical metrics shown
- "Play Again" and "Dashboard" buttons as clear next actions
- Streak counter visible at bottom
- Timing: Stats fade in 300ms after score, stagger 300ms per line, hold 2.5s, fade out 500ms

**c) Brain Map Dashboard (Layer 2 — Cool Moment)**
- Player-initiated from menu — the cognitive mirror
- Radar chart showing all 6 domains with dot-based ratings (5 dots max, filled/empty visual)
- Strongest domain and growth area callouts (dynamically determined)
- Session count and current streak display prominently
- "Play Now" button always visible — dashboard is launchpad, not dead end
- Comedy: rotating caller quote or achievement title on each visit
- Pixel art styling consistent with CrazySnake's retro aesthetic
- Accessible from main menu: "Brain Map" option

**d) Calibration Period**
- First 3-5 sessions build baseline before brain map unlocks
- "Calibrating your brain..." state with session progress counter (Session 1/5, 2/5, 3/5...)
- Post-game highlights still show during calibration (individual session data immediate)
- Brain map unlock is motivational event — the reveal after calibration creates anticipation
- Prevents volatile early data from undermining trust in metrics
- Calibration complete message: "Your brain map is ready! Check the dashboard."

**e) Streak System**
- Consecutive daily play tracking
- Visual streak counter on post-game screen and dashboard
- Streak increments on any completed game per calendar day (local timezone)
- Gentle messaging on streak break: "Your brain took a rest day. Ready to come back stronger?"
- No guilt, no anxiety — ethical guardrails per game UX principles
- Streak data stored locally alongside cognitive metrics
- No notifications, no push — dashboard pulls, not pushes

**f) Comedy Integration**
- Dashboard and post-game screens maintain CrazySnake's personality
- Tech pun caller quotes on post-game highlights (21 callers available, performance-contextual selection)
- Rotating caller quotes on dashboard visits (refresh on each view)
- Achievement-style labels using humor, not clinical language (e.g., "Your prefrontal cortex just filed a pull request. Merged without conflicts.")
- No medical terminology, no clinical framing anywhere in dashboard UI

### Out of V2 Scope (Future)

**Dashboard V2 Features (Deferred):**
- Trend graphs (Layer 3 deep analytics) — 30-day domain trends, improvement curves
- Social sharing / brain map cards — shareable cognitive profile cards (Wordle grid moment)
- Milestones & achievements — cognitive achievement badges and celebrations
- Streak freeze — risk mitigation for streak anxiety
- Weekly summary reports — email/in-app cognitive summaries
- Growth opportunity suggestions — "Your weakest domain is..." nudges
- Premium tier analytics — extended history, detailed breakdowns
- Cross-device sync — requires accounts/server infrastructure
- Leaderboards — cognitive fitness rankings

**Other Future Features:**
- Multiple difficulty levels / difficulty selection
- Player accounts / profiles (for cross-device sync only)
- Native mobile app packaging
- Haptic feedback on mobile
- Caller collection / discovery system
- Targeted workout modes ("Focus Training," "Flexibility Training")

### Post-V2 Vision

**Horizon 1 — Dashboard V2: Social & Depth (3-6 months post-MVP)**

If Cognitive Dashboard MVP validates (60%+ brain map view rate, +15% D7 retention lift, 70%+ calibration completion), expand dashboard with:
- Shareable brain map cards (the "Wordle grid" moment for organic growth)
- Trend graphs and Layer 3 deep analytics (30-day improvement curves per domain)
- Milestones and achievement system (cognitive badges, celebrations)
- Streak freeze and gentle re-engagement messaging
- Growth opportunity suggestions per domain ("Focus on Working Memory this week")
- Weekly cognitive reports with caller-narrated summaries

**Horizon 2 — Cognitive Fitness Platform (6-12 months)**

- Targeted workout modes: "Focus Training" (phone-heavy), "Flexibility Training" (RC-heavy), "Uncertainty Training" (high blinking)
- Cross-device sync with optional account creation (privacy-first, local-first default)
- Leaderboards framed as cognitive fitness rankings (non-competitive framing)
- "Challenge a coworker" with shared game seeds
- Cognitive warm-up mode for pre-work brain activation

**Horizon 3 — Ecosystem (12+ months)**

- Premium tier with extended history and personalized coaching (business model exploration)
- Corporate wellness integration (brain breaks for teams, aggregate analytics)
- API for research partnerships (anonymized, opt-in cognitive data for academic research)
- Progressive Web App for offline play
- Native mobile with haptic feedback
- Steam release as premium cognitive fitness game
- Educational institutions (cognitive warm-ups before classes)
- New game modes targeting additional cognitive faculties

### Risk Mitigation Strategy

**Risk 1: Brain gym positioning doesn't resonate**
- **Mitigation:** Test with knowledge workers who actively use AI tools daily
- **Signal:** Players use cognitive language spontaneously vs. only describe "fun"
- **Fallback:** Position as "the smartest Snake game ever made" (cognitive depth without clinical framing)

**Risk 2: Difficulty curve too aggressive (frustration)**
- **Mitigation:** Score-gated progression ensures each system is introduced after demonstrated readiness
- **Tuning levers:** All thresholds, percentages, and intervals configurable in config.js
- **Fallback:** Widen score gates (e.g., blinking at 20 instead of 15)

**Risk 3: Difficulty curve too gentle (cognitive autopilot)**
- **Mitigation:** Short comfort zone (phone calls at score 3, blinking at 15)
- **Signal:** Average scores too high, players report game is "easy"
- **Fallback:** Tighten phone call intervals, lower blinking/combo start thresholds

**Risk 4: Too much concurrent cognitive load at high scores**
- **Mitigation:** Caps on blinking (60%) and combo (40%) prevent information overload
- **Mitigation:** Combo timer pauses during phone calls (respects cognitive budget)
- **Signal:** Death rate spikes unnaturally at specific score ranges
- **Fallback:** Lower caps further, increase breathing room between phone calls

**Risk 5: Phone calls feel annoying, not cognitively challenging**
- **Mitigation:** Comedy (21 callers with one-liners) transforms interruption into entertainment
- **Mitigation:** Fibonacci escalation makes Pick Up increasingly tempting
- **Mitigation:** Consolation reward prevents "I wasted my Pick Up" frustration
- **Fallback:** Reduce frequency at lower tiers, make Pick Up timer shorter

**Risk 6: Technical — game continues during phone overlay (60 FPS under blur)**
- **Mitigation:** Prototype phone overlay mechanic first (highest technical risk)
- **Mitigation:** Test across all target browsers for consistent rendering
- **Fallback:** Pause game during phone call (less innovative but still functional)

---

## Functional Requirements

### Core Gameplay

- FR1: Players control snake direction in four cardinal directions
- FR2: Snake automatically moves in current direction at configurable speed
- FR3: Snake grows by +1 segment when consuming ANY food type
- FR4: Snake dies on wall collision (unless invincibility or wall-phase active)
- FR5: Snake dies on self-collision (unless invincibility active)
- FR6: Game board displays snake position, food positions, score, and active effects
- FR7: Game board uses grid-based layout (25 × 20 units, 10px per unit)
- FR8: Game continues until player's snake dies

### Fibonacci Scoring System

- FR10: Food spawns with configurable probability distribution (Growing 40%, Invincibility 10%, Wall-Phase 10%, Speed Boost 15%, Speed Decrease 15%, Reverse Controls 10%)
- FR11: Food consumed when snake head occupies food position
- FR12: Growing food (green, +1) — baseline, no special effect
- FR13: Invincibility food (yellow, 0 pts) — wall/self immunity until next food eaten, rapid strobe visual
- FR14: Wall-Phase food (purple, +1 default, +3 on wall interaction) — pass through one wall, wrap to opposite side
- FR15: Speed Boost food (red, +5) — increased movement speed until next food eaten
- FR16: Speed Decrease food (cyan, +2) — decreased movement speed until next food eaten
- FR17: Reverse Controls food (orange, +8) — inverted directional controls until next food eaten
- FR18: All timed effects end when next food consumed
- FR19: Score popup system displays value with visual salience proportional to Fibonacci value (+1 through +8)
- FR20: +8 score popup includes particles (5-7 stars), screen shake (3px, 200ms), and rotation wiggle
- FR21: Score popup spawns within 200ms of food consumption (temporal contiguity)
- FR22: Score popup queue uses 300ms stagger when multiple popups overlap
- FR23: Only one food item exists on the board at a time; new food spawns immediately after consumption

### Progressive Blinking Food System

- FR30: At score 15+, a configurable percentage of food items cycle through all 6 colors
- FR31: Color cycling speed: 200ms per color (5 colors/second)
- FR32: Blinking food effect type locked at spawn, hidden until consumed
- FR33: Blinking food probability increases with score (10% at 15, caps at 60% at 80+)
- FR34: Blinking food uses same spawn probability distribution as visible food
- FR35: First-time tooltip at score 15: "Mystery Food! Effect hidden until consumed" (auto-dismisses after 3s)
- FR36: Blinking food has 2px drop shadow for spatial anchoring during color cycling

### Combo Mode System

- FR40: At score 40+, combo mode can activate after eating food (probability-based)
- FR41: Combo probability increases with score (10% at 40, caps at 40% at 120+)
- FR42: On activation: canvas background transitions to random dark color (500ms fade)
- FR43: Food #1 (activation food) becomes Effect A with regular points; the NEXT food eaten (food #2) becomes Effect B with multiplicative scoring. Activation and progression must not fire on the same food.
- FR44: Score for food #2 = Effect A points × Effect B points (multiplicative, replaces base food score)
- FR45: Snake renders with striped pattern (alternating Effect A / Effect B colors, head = Effect B)
- FR46: Third food eaten exits combo mode; canvas returns to light grey (500ms fade)
- FR47: Combo timer pauses during active phone call overlay
- FR48: After phone dismissal during combo, combo resumes with all state preserved

### Phone Call System

- FR50: Phone calls disabled until player reaches score 3 (grace period)
- FR51: Phone call frequency determined by score-based tiers (12-20s at score 3-14, down to 4-8s at score 100+)
- FR52: Phone overlay displays caller portrait (64x64 pixel art), caller name, and two buttons (End / Pick Up)
- FR53: Game continues running underneath phone overlay with 4px blur
- FR54: End button awards +1 point and instantly dismisses overlay
- FR55: Pick Up button starts 1-3s random timer with countdown bar, awards Fibonacci bonus
- FR56: Pick Up bonus follows Fibonacci sequence per game: +2, +3, +5, +8, +13, +21, +34 (cap)
- FR57: Pick Up bonus value displayed on button before decision ("Pick Up +8")
- FR58: Pick Up is irreversible — cannot End once committed
- FR59: Caller one-liner displayed only after Pick Up (replaces "Incoming call..." text)
- FR60: If player dies during Pick Up, bonus is still awarded (consolation reward)
- FR61: 21 unique callers with tech-pun names, pixel portraits, and one-liners
- FR62: Portrait fallback: generic phone icon if portrait asset missing (onerror handler)
- FR63: Desktop controls: Space = End, Enter = Pick Up
- FR64: Mobile: tap End button or Pick Up button

### Death During Combo + Pick Up (Edge Case)

- FR65: If player dies during active combo AND Pick Up, both rewards stack
- FR66: Combo multiplier awarded (A × B if food B was eaten)
- FR67: Pick Up Fibonacci bonus awarded (consolation reward)

### Reverse Controls Recognition

- FR70: When player survives Reverse Controls (eats next food without dying), display "RC SURVIVED" flash
- FR71: RC SURVIVED flash: 12px, white, 400ms fade, spawns below +8 popup
- FR72: RC survival count tracked in cognitiveStats.rcSurvived

### Post-Game Cognitive Feedback

- FR75: After death, display "Your Brain Today" cognitive stats before Play Again button
- FR76: Track 6 cognitive stats during gameplay: rcSurvived, phoneCallsManaged, mysteryFoodsEaten, comboMultipliers, pickUpStreak, peakComboScore
- FR77: Show top 2-3 stats with highest values; never show zero-value stats
- FR78: Stats stagger in at 300ms intervals, hold 2.5s, fade out 500ms
- FR79: Play Again button appears after stats fade (~3.3s total)
- FR80: All cognitiveStats reset on new game

### Session Flow

- FR85: One-click start from landing page (New Game)
- FR86: Each game begins with snake at default starting state (length 5, bottom-left, moving right)
- FR87: Game ends when snake dies
- FR88: Game over screen displays: score, high score, "Your Brain Today" cognitive stats, Play Again / Menu buttons
- FR89: Play Again immediately starts new game (no navigation)
- FR90: High score persisted via localStorage
- FR91: Esc key during gameplay pauses game

### User Interface

**Unified Design System:**
- FR95: All UI elements use Jersey20 font family
- FR96: Purple theme color: rgb(157, 178, 221) for UI borders, active states, cognitive stats header
- FR97: Rounded corners: 12px on menu frames, 8px on buttons
- FR98: Phone overlay uses sharp corners (Nokia aesthetic exception)
- FR99: Button states: black inactive → purple-blue active, white text, scale animations
- FR100: Retro 8-bit pixel art aesthetic throughout

**Screens:**
- FR101: Main menu with "New Game" and "Top Score" options
- FR102: Game board with score display (top-center, rounded frame with purple border)
- FR103: Game over screen with score, high score, cognitive feedback, Play Again / Menu
- FR104: Phone call overlay (Nokia grey, centered, game blurred underneath)
- FR105: Play Again selected by default on game over screen

**Menu Navigation:**
- FR106: Enter validates current selection
- FR107: Arrow Up/Down navigates between options
- FR108: Mouse click on buttons validates choice
- FR109: Esc returns to menu or pauses gameplay

### Input Controls

**Snake Movement:**
- FR110: Arrow keys (Up, Down, Left, Right)
- FR111: Numpad (8=Up, 2=Down, 4=Left, 6=Right)
- FR112: WASD (W=Up, S=Down, A=Left, D=Right)
- FR113: ZQSD for AZERTY keyboards (Z=Up, S=Down, Q=Left, D=Right)
- FR114: Swipe gestures on mobile

**Phone Call Controls:**
- FR115: Space = End call (desktop)
- FR116: Enter = Pick Up call (desktop)
- FR117: Tap End/Pick Up buttons (mobile)

**Other:**
- FR118: Esc = pause/resume during gameplay
- FR119: Input responds with < 50ms latency

### Sound Design

**Fibonacci Musical Progression:**
- FR120: +1 score: soft beep (C4, 261Hz, sine wave)
- FR121: +2 score: soft chime (D4, 293Hz, sine wave)
- FR122: +3 score: mid chime (E4, 329Hz, triangle wave)
- FR123: +5 score: high chime (G4, 392Hz, triangle wave)
- FR124: +8 score: triumphant C-major chord (C5-E5-G5, 523/659/784Hz)

**State-Based Movement Sounds:**
- FR125: Each snake state has distinct movement sound (7 states × 2 alternating sounds)
- FR126: Default (black): neutral blip; Green: pleasant; Yellow: powerful; Purple: ethereal; Red: energetic; Cyan: heavy; Orange: dissonant

**Combo Audio:**
- FR127: Combo entrance: 8-bit fanfare (rising arpeggio)
- FR128: Combo exit: deflating descending sound
- FR129: High-value combo (15+ pts): jackpot fanfare
- FR130: Legendary combo (30+ pts): extended triumphant chord

**Phone Audio:**
- FR131: Incoming call: Nokia-style retro ring (loops until answered)
- FR132: Pick Up: click/accept tone
- FR133: End: hang-up click

**Game Over:**
- FR134: 8-bit short melody

### Platform Support

- FR140: Game runs on Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- FR141: Desktop resolutions 1024x768 and above
- FR142: Mobile responsive layout (320px to 768px width)
- FR143: Touch controls functional on mobile browsers
- FR144: Game loads within 3 seconds on broadband (5 Mbps+)

### Cognitive Dashboard — Metrics Data Engine

- FR150: System silently collects 6 cognitive metrics from session one (no opt-in required, automatic and local)
- FR151: Reaction Time metric calculated as rolling average of input response time during normal gameplay (excludes Reverse Controls and phone call periods)
- FR152: Spatial Awareness metric calculated as snake length at death divided by grid coverage percentage
- FR153: Cognitive Flexibility metric calculated as performance ratio: (score rate during Reverse Controls) / (score rate during normal play)
- FR154: Divided Attention metric calculated from survival rate and decision speed during phone call overlays
- FR155: Impulse Control metric calculated as weighted Pick Up vs End decision ratio by game context (combo mode, high score, blinking food)
- FR156: Working Memory metric calculated as score rate during combo mode vs. normal gameplay
- FR157: All cognitive data stored locally via localStorage/IndexedDB (no server, no account, privacy by default)
- FR158: Data persists across sessions on same device/browser
- FR159: Rolling averages weighted toward recent 10 sessions for responsive metrics that reflect improvement
- FR160: Metric calculation follows formulas defined in Cognitive Analytics Requirements document

### Cognitive Dashboard — Enhanced Post-Game Summary (Layer 1)

- FR161: Post-game screen displays 2-3 dynamic highlights selected from cognitive performance (replaces/enhances "Your Brain Today")
- FR162: Highlight selection priority: Personal Best > Biggest Improvement > Notable Event > Growth Opportunity
- FR163: Highlight selection algorithm ensures no repeated pattern in consecutive sessions (variety enforcement)
- FR164: Each highlight includes comedy caller quote contextual to performance (21 callers available, performance-based selection)
- FR165: Highlights use up/down arrows and simple language (no clinical metrics, no numbers except achievements)
- FR166: Post-game screen includes "Play Again" and "Dashboard" buttons as clear next actions
- FR167: Streak counter visible at bottom of post-game screen (current streak days)
- FR168: Highlight timing: fade in 300ms after score display, stagger 300ms per line, hold 2.5s, fade out 500ms
- FR169: "Play Again" button appears after highlights fade (~3.3s total from death)
- FR170: All cognitiveStats reset on new game start

### Cognitive Dashboard — Brain Map Dashboard (Layer 2)

- FR171: Brain Map accessible from main menu ("Brain Map" option)
- FR172: Brain Map displays radar chart with all 6 cognitive domains
- FR173: Each domain rated on 5-dot scale (filled/empty dots, visual not numeric)
- FR174: Radar chart uses pixel art styling consistent with game aesthetic
- FR175: Dashboard displays strongest domain callout (dynamically determined from highest metric)
- FR176: Dashboard displays growth area callout (dynamically determined from lowest metric or biggest recent improvement)
- FR177: Session count displayed prominently (total games played)
- FR178: Current streak displayed prominently (consecutive days with at least one game)
- FR179: "Play Now" button always visible on dashboard (dashboard is launchpad, not dead end)
- FR180: Rotating caller quote or achievement title displayed on each dashboard visit (refreshes on view, humor not clinical)
- FR181: Dashboard uses purple theme color rgb(157, 178, 221) for borders and accents
- FR182: Brain Map unavailable during calibration period (shows calibration state instead)

### Cognitive Dashboard — Calibration Period

- FR183: First 3-5 sessions function as calibration period before brain map unlocks
- FR184: Calibration state displays "Calibrating your brain..." with session progress counter (Session 1/5, 2/5, 3/5...)
- FR185: Post-game highlights display during calibration (individual session data immediate, brain map delayed)
- FR186: Brain map unlocks automatically after session 5 completion
- FR187: Calibration complete message displayed: "Your brain map is ready! Check the dashboard."
- FR188: Calibration completion triggers one-time celebration moment (visual fanfare, caller quote)
- FR189: Calibration state prevents volatile early data from populating brain map (builds baseline first)

### Cognitive Dashboard — Streak System

- FR190: Streak tracks consecutive calendar days with at least one completed game
- FR191: Streak increments on first game completion per calendar day (local timezone)
- FR192: Streak counter displays on post-game screen and brain map dashboard
- FR193: Streak continues across multiple games per day (only first game counts for day)
- FR194: Streak breaks if no game played for 24+ hours (calendar day missed)
- FR195: Gentle messaging on streak break: "Your brain took a rest day. Ready to come back stronger?" (no guilt, no anxiety)
- FR196: Streak data stored locally alongside cognitive metrics (localStorage/IndexedDB)
- FR197: No push notifications, no external reminders (dashboard pulls, not pushes per ethical design)
- FR198: Streak resets to 0 on break, new streak starts on next game

### Cognitive Dashboard — Comedy Integration

- FR199: Post-game highlights include tech pun caller quotes contextual to performance (21 callers available)
- FR200: Brain map dashboard displays rotating caller quote on each visit (refreshes on view)
- FR201: Caller quote selection uses performance context: high score → celebratory, death during RC → empathetic, streak milestone → encouraging
- FR202: Achievement-style labels use humor not clinical language throughout dashboard UI
- FR203: No medical terminology anywhere in dashboard (avoid clinical framing per game UX principles)
- FR204: Calibration complete message includes caller celebration quote
- FR205: Dashboard maintains CrazySnake's retro pixel art and Jersey20 font aesthetic

---

## Non-Functional Requirements

### Performance

**Frame Rate:**
- NFR1: 60 FPS during normal gameplay
- NFR2: 60 FPS during phone call overlay with game running underneath
- NFR3: 60 FPS during combo mode (canvas transitions, striped snake rendering)
- NFR4: 60 FPS with blinking food animation (200ms color cycling)
- NFR5: No frame drops below 55 FPS when all systems active simultaneously (peak cognitive demand at score 100+)

**Load Time:**
- NFR6: Initial page load < 3 seconds on broadband
- NFR7: Game playable within 0.5 seconds after page load
- NFR8: No loading screens during gameplay transitions

**Responsiveness:**
- NFR9: Input lag < 50ms (keyboard/touch to snake movement)
- NFR10: Score popup spawn < 200ms after food consumption (temporal contiguity)
- NFR11: Phone call dismiss < 100ms
- NFR12: Play Again restart < 100ms

**Memory:**
- NFR13: Client-side memory < 100MB
- NFR14: No memory leaks during extended play (30+ minutes)
- NFR15: Garbage collection doesn't cause frame drops

### Browser Compatibility

- NFR16: Visual appearance consistent across all supported browsers (95% similarity)
- NFR17: Gameplay mechanics identical across all supported browsers
- NFR18: Performance targets met across all supported browsers
- NFR19: Desktop resolutions 1024x768 to 4K
- NFR20: Mobile 320px to 768px width
- NFR21: Touch controls on iOS Safari and Chrome Mobile
- NFR22: Unsupported browsers show clear message

### Reliability

- NFR23: Game does not crash during normal gameplay
- NFR24: Snake movement speed consistent across devices and browsers
- NFR25: Food effects trigger 100% of the time when consumed
- NFR26: Collision detection accurate (no false positives/negatives)
- NFR27: Phone call intervals consistent with configured tier for current score
- NFR28: Score calculations accurate for all food types, phone bonuses, and combo multipliers
- NFR29: Cognitive stats tracking accurate for all 6 tracked stats
- NFR30: Game state consistent throughout session (no state corruption)

### Usability

- NFR31: New players understand basic controls within 30 seconds
- NFR32: Food effect behaviors clear from visual feedback alone
- NFR33: Phone call End/Pick Up choice immediately obvious on first occurrence
- NFR34: Blinking food findable despite color cycling (shadow anchor)
- NFR35: Combo mode recognizable within 5 seconds of activation (striped snake, dark canvas)
- NFR36: Post-game cognitive stats feel celebratory, not clinical
- NFR37: Rapid input changes do not cause erratic behavior

### Maintainability

- NFR38: Game logic modular and separable from rendering
- NFR39: All game parameters configurable in config.js without code changes:
  - Food probability distribution
  - Phone call intervals per score tier
  - Blinking food percentage curve
  - Combo probability curve
  - Grace period score threshold
  - Pick Up Fibonacci sequence
  - Effect durations and speed multipliers
  - Dashboard metric calculation weights
  - Calibration session threshold
  - Highlight selection priorities
- NFR40: Core gameplay mechanics unit testable
- NFR41: Food effects testable in isolation
- NFR42: Cross-browser compatibility validatable through automated testing
- NFR43: Dashboard metric calculations unit testable in isolation
- NFR44: Cognitive data engine separable from UI rendering

### Dashboard Data Accuracy & Reliability

- NFR45: Cognitive metric calculations produce consistent results for identical gameplay sessions (deterministic formulas)
- NFR46: Data collection captures 100% of relevant gameplay events (no missed inputs during normal operation)
- NFR47: Metric values update within 500ms of session completion (data processing responsive)
- NFR48: Rolling averages reflect recent 10 sessions accurately (weighted calculation correct)
- NFR49: Brain map radar chart displays metrics within ±5% of calculated values (visualization accuracy)
- NFR50: Streak tracking accurate across browser timezone changes and daylight saving time transitions

### Dashboard Performance & Responsiveness

- NFR51: Post-game highlights render within 300ms of death screen (no perceptible delay)
- NFR52: Brain map dashboard loads within 500ms of menu selection (instant feel)
- NFR53: Radar chart renders smoothly at 60 FPS during any animations (no jank)
- NFR54: Dashboard UI does not cause frame drops in background game rendering (if game preview implemented)
- NFR55: Metric recalculation completes within 200ms per session (background processing)

### Dashboard Storage & Privacy

- NFR56: localStorage/IndexedDB stores minimum 100 sessions of cognitive data per browser (adequate history)
- NFR57: Total storage footprint < 5MB for 100 sessions (efficient data structure)
- NFR58: Data persists across browser restarts and OS updates (durable storage)
- NFR59: No cognitive data transmitted to external servers (privacy by default)
- NFR60: No analytics tracking of dashboard usage (local-only operation)
- NFR61: Data export/deletion functionality accessible if browser storage needs clearing (user control)

### Dashboard Usability

- NFR62: Brain map radar chart comprehensible within 10 seconds for new users (clear visual design)
- NFR63: Dot-based ratings (5-dot scale) immediately understandable without explanation (intuitive mapping)
- NFR64: Calibration progress counter sets clear expectation for unlock timing (reduces uncertainty)
- NFR65: Post-game highlights feel celebratory not clinical (tone validates per user testing)
- NFR66: Caller comedy quotes contextual to performance, not random (relevance matters)
- NFR67: Streak break messaging feels gentle not guilt-inducing per qualitative feedback (ethical design validation)

---

## V3 Retro Visual Upgrade — Functional Requirements

**Context:** V3 transforms CrazySnakeLite from functional gameplay to an immersive 80s arcade experience through 8 progressive visual enhancements. These requirements are derived from UX design specifications (`ux-design-retro-graphic-upgrade.md`) and Architecture V4 decisions, implementing authentic 80s graphic design principles while maintaining cognitive training effectiveness.

**Scope:** Three epics (Visual Clarity Enhancement, Progressive Arcade Transformation, Immersive Arcade Polish) delivering Neon Noir aesthetic, dual-channel food recognition, CRT authenticity, and snake personality.

### Progressive Visual Transformation

- FR206: Playfield background progressively darkens through 6 score-based tiers (0-14: #E8E8E8 light grey → 100+: #2A2A2A near-black), with smooth 2-second CSS transitions between tiers
- FR207: Grid opacity progressively decreases across tiers (0-14: 0.9 opacity → 100+: 0.3 opacity minimum) while maintaining WCAG visibility at all levels
- FR208: CSS/Canvas hybrid rendering architecture: background-color controlled via CSS classes on canvas element (GPU-composited), canvas rendering handles only game objects (snake, food, grid lines, effects)
- FR209: Tier changes are event-driven (triggered on score crossing threshold), not per-frame polling, with previous tier class removed before applying new tier class

### Distinctive Food Recognition

- FR210: Each of 6 food types renders with distinctive pixel-art shape within 14x14 canvas: Growing (filled square), Invincibility (4-point star), Wall-Phase (ring/hollow circle), Speed Boost (cross/plus), Speed Decrease (hollow square), Reverse Controls (X/diagonal cross)
- FR211: All food shapes include 1px outline in darker variant of fill color for separation against any background tier
- FR212: Food items display CRT phosphor glow effect with score-based intensity: 0-14 (0px blur), 15-49 (3px blur), 50-99 (5px blur), 100+ (8px blur), with glow color matching food base color
- FR213: Glow rendering uses defensive rendering pattern (withShadow helper) that guarantees canvas state cleanup via try/finally, preventing shadow leaks between render calls

### Score-Gated Progression System

- FR214: Progression system extended from 3 fields (speed, phoneFrequency, effectChance) to 8 fields, adding: glowIntensity, gridOpacity, backgroundColor, borderColor, titleEffect
- FR215: All visual progression parameters defined in config.js PROGRESSION tables with score thresholds, resolved via progression.js getProgressionValue() function following existing tier-based pattern

### Snake Personality & Character

- FR216: Snake head displays direction-tracking pupils (2px dark circles offset toward current movement direction) and subtle top-light reflection (1-2px lighter pixel highlight)
- FR217: At score 50+, snake body segments display 1px outline in lighter shade of snake color for visibility on dark backgrounds (tiers 3-5)

### Typography & Text Treatment

- FR218: Game title uses chrome/neon text effect via CSS text-shadow (layered shadows: dark outline + bright inner glow)
- FR219: "GAME OVER" text uses depth/shadow effect with dark offset shadow (4px 4px 0 rgba(0,0,0,0.8))
- FR220: "NEW HIGH SCORE" text uses pulsing gold effect via CSS animation (scale 1.0 → 1.1 → 1.0, 1.5s loop), disabled if user has prefers-reduced-motion enabled

### CRT Authenticity Effects

- FR221: CRT scanline overlay applied via CSS pseudo-element (::after) with repeating-linear-gradient (2px transparent, 2px rgba(0,0,0,0.03)), 3% opacity, pointer-events: none
- FR222: Grid intersection dots render at each grid intersection (1.5px radius circles, ~525 interior dots) using grid line color with progressive opacity matching grid lines

### Reactive Border System (V4.2 SIMPLIFIED - 2026-02-17)

**🔄 V4.2 UPDATE:** Border system simplified from 7 states to 3 universal semantic states.

- **FR223 (V4.2):** Canvas border displays 3 danger-level states: wall-phase purple (priority 1, walls safe) > invincibility yellow blinking (priority 2, protected) > default black (priority 3, walls dangerous). Universal across ALL game modes.
- **FR224 (V4.2):** Border state updates are event-driven via centralized `updateBorderState()`, triggered ONLY by effect changes (wall-phase/invincibility applied or cleared), averaging ~3 updates per game (not 60 checks/sec)
- FR225: Border colors and animations defined in CSS classes (`.border-wallPhase`, `.border-invincibility`), applied via className updates on canvas element
- **FR226 (V4.2 REMOVED):** Death flash, phone ring/pickup borders, combo borders, and reverse controls borders REMOVED. Border communicates danger level only, not game events or modes.

**Rationale:** V4.2 simplifies border semantics to communicate immediate danger state consistently across all game modes. Removed event-based borders (phone, combo, death flash) that created visual confusion. See `V4.2-BORDER-SIMPLIFICATION.md` for full design documentation.

### Performance Optimization

- FR227: Grid intersection dots use offscreen canvas caching pattern: dots pre-rendered once to offscreen canvas, copied to main canvas via single drawImage() operation per frame
- FR228: Offscreen canvas cache invalidated and regenerated only when grid opacity tier changes (event-driven), reducing operations from 1,050 ops/frame to 1 op/frame

---

## V3 Retro Visual Upgrade — Non-Functional Requirements

### Performance Budget

- NFR68: 58+ FPS minimum maintained during all V3 visual enhancements active simultaneously (dark playfield, shaped food with glow, grid dots, reactive border, typography effects)
- NFR69: Maximum frame time 17.24ms per frame (1000ms / 58fps budget)
- NFR70: Food shape + glow rendering contributes < 2ms per frame for all 6 food types
- NFR71: Offscreen canvas caching achieves ~1000x performance gain (1,050 ops → 1 op/frame) for grid dot rendering

### Visual Accessibility

- NFR72: Grid lines maintain minimum 0.3 opacity at tier-5 (darkest playfield) ensuring WCAG visibility compliance
- NFR73: Food colors + 8px glow achieve WCAG AA contrast ratio (4.5:1 minimum) on darkest background (#2A2A2A at tier-5)
- NFR74: Dual-channel food recognition (shape + color) aids color-blind players by providing redundant visual channel

### Reduced Motion Support

- NFR75: prefers-reduced-motion CSS media query disables pulsing animation on "NEW HIGH SCORE" text (static gold text instead)
- NFR76: Background tier transitions and border animations continue under reduced motion (slow color shifts, not motion)

### Visual Coherence & Design Authority

- NFR77: All V3 enhancements pass Five-Question Filter validation from game-ux-principles.md (Working Memory cost, Competence feedback, Clarity, Flow preservation, Emotional impact)
- NFR78: Visual enhancements maintain retro 8-bit pixel art aesthetic consistent with existing game design (Jersey20 font, pixel-art caller portraits, sharp corners on phone overlay)

### Module Boundary Compliance

- NFR79: config.js owns all tunable visual progression parameters (tier thresholds, colors, opacity values, glow intensities)
- NFR80: progression.js resolves score → tier values for all 8 fields, no scoring logic in render.js
- NFR81: render.js applies resolved visual values (colors, opacity, glow) via canvas operations, reads from gameState
- NFR82: game.js orchestrates tier changes and border state updates, no visual rendering logic
- NFR83: style.css defines tier classes, border colors, typography effects via declarative CSS

### Zero Dependencies & GPU Optimization

- NFR84: All V3 visual enhancements use browser-native APIs only (Canvas API, CSS, no external libraries)
- NFR85: Background tier transitions use CSS background-color property (NOT canvas fillRect) to leverage GPU compositing
- NFR86: Border state changes use CSS className updates (NOT inline styles) for GPU-optimized rendering

---

*PRD prepared by Mary (Analyst) with Celia (Neuro-Game Design Expert)*
*Updated 2026-02-16 with V3 Retro Visual Upgrade (8 visual enhancements, Neon Noir aesthetic)*
*"A brain gym disguised as Snake. See your cognitive growth in an 80s arcade. Come back tomorrow and do it again."*
