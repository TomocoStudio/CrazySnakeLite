---
stepsCompleted: [1, 2, 3, 4, 5]
inputDocuments: []
date: 2026-01-13
author: Tomoco
---

# Product Brief: CrazySnakeLite

## Executive Summary

CrazySnakeLite reimagines the classic Nokia Snake game by injecting strategic depth and chaotic unpredictability into a beloved formula. While traditional Snake has become predictable and boring after decades of identical gameplay, CrazySnakeLite introduces two core innovations: a strategic food system with six distinct types (growing, invincibility, wall-phase, speed boost, speed decrease, and reverse controls), and random "phone call" interruptions that force players to maintain split attention while the game continues running. Built as a web-first experience with retro arcade 8-bit pixel art aesthetics, the game targets players seeking quick, intense, chaotic sessions with a playful, fun mood.

**Target Audience:** Players who remember Snake from Nokia phones and want a fresh, chaotic twist on the classic formula
**Platform:** Web browser (desktop and mobile responsive)
**Core Innovation:** Strategic food choices + attention-splitting phone call mechanic
**Session Type:** Single-player, play until death (classic arcade style)

---

## Core Vision

### Problem Statement

Traditional Snake is a well-known classic, but it has become predictable and boring. Players know exactly what to expect: eat food, grow longer, avoid walls and yourself. There's no surprise, no strategic depth, and no reason to play more than a few minutes before the repetitive nature sets in. The game that once captivated millions on Nokia phones now feels stale in a world of dynamic, engaging experiences.

### Problem Impact

Players who have nostalgia for Snake find themselves losing interest quickly when they try modern versions. The lack of variety and strategic decision-making means:
- Low replay value (every game feels the same)
- Predictable outcomes (only difficulty is speed increase)
- Minimal engagement (can play mindlessly without real focus)
- Missed opportunity to evolve a beloved classic

### Why Existing Solutions Fall Short

Current Snake variants typically fall into these categories:
- **Cosmetic changes only:** Different skins, themes, or graphics but identical mechanics
- **Multiplayer variants (Snake.io):** Change the context but not the core gameplay innovation
- **Simple difficulty increases:** Just make the snake faster, which doesn't add strategic depth
- **Obstacle additions:** Add barriers but don't fundamentally change decision-making

None of these solutions address the core issue: **the mechanics themselves have become boring**. They add complexity or visual polish without injecting genuine surprise, strategy, or chaos into the experience.

### Proposed Solution

**CrazySnakeLite** transforms Snake through two core mechanical innovations:

**1. Strategic Food System (6 Types):**
ALL foods give +1 segment (score = snake length). Simple geometric shapes (5x5 pixels):
- Growing food (green, filled square) - +1 segment only, no special effect
- Invincibility food (yellow, 4-point star) - +1 segment + immunity with rapid strobe/blinking (until next food)
- Wall-Phase food (purple, ring/donut) - +1 segment + pass through one wall, wrap to opposite side (single use)
- Speed Boost food (red, cross/plus) - +1 segment + faster movement (until next food)
- Speed Decrease food (cyan, hollow square) - +1 segment + slower movement (until next food)
- Reverse Control food (orange, X shape) - +1 segment + inverted controls (until next food)

**Duration Rule:** ALL timed effects end after eating 1 new food. Simple!

Each food type appears based on configurable probability percentages, allowing difficulty levels from "Easy" (mostly traditional) to "Hard" (maximum craziness). Players must make strategic choices about which food to pursue based on their current situation, adding tactical depth absent from traditional Snake.

**2. Phone Call Interruption Mechanic:**
Random "phone calls" interrupt gameplay at random intervals (15-45 seconds). Players hit Space (desktop) or tap "End" button (mobile) to dismiss. Critically, **the game continues running during interruptions** (visible but blurry behind overlay), forcing split attention and quick reactions.

**Phone Call UI:**
- Nokia-era phone screen aesthetic (black-on-grey, monochrome)
- Full screen overlay with blurry game visible in background
- Displays random funny caller name + "End" button at bottom center
- Caller names pool includes: "Mom", "Boss", "Your Ex", "Spam Likely", "Anxiety", "Nigerian Prince", "Snake Headquarters", "1-800-CHAOS", and many more
- Stays on screen until dismissed (does not auto-dismiss)

**Presentation:**
- Retro arcade 8-bit pixel art style (colorful, playful, fun mood)
- Super light grey background with subtle light grey grid
- Game board border: regular line with purple neon glow
- Snake: classic blocky segments, color matches last food eaten (default: black), blinks on color transition
- Food: simple geometric shapes in pixel style (5x5 pixels)
- Web-first, mobile-responsive (works in any browser)
- Single-player, play until death
- Score system: Snake length = score (counter at top-center + visual snake size)
- Active effects indicated by snake color + movement sound only (minimal UI)
- Pure personal experience (no social sharing initially)

**Screens:**
- Main Menu: "New Game" and "Top Score" options
- Game Over: "GAME OVER!" + "Your score: XX" + "Play Again" (default) / "Menu" options
- Top Score: Displays best score (stored in browser localStorage; post-MVP: player accounts + database)

**Controls:**
- Arrow keys: Up, Down, Left, Right
- Numpad: 8=Up, 2=Down, 4=Left, 6=Right
- WASD (US keyboards): W=Up, S=Down, A=Left, D=Right
- ZQSD (French AZERTY): Z=Up, S=Down, Q=Left, D=Right
- Mobile: Swipe gestures
- Enter/Click: Validate menu choice
- Esc: Open menu / cancel

**Sound Design (8-bit style):**
- Movement sounds: Short impulse played at each snake step, varies by snake color/state:
  - Default (black): Neutral "blip" - classic arcade
  - Growing (green): Pleasant, positive tone
  - Invincibility (yellow): Powerful, strong tone
  - Wall-Phase (purple): Ethereal, magical tone
  - Speed Boost (red): Quick, energetic - higher pitch
  - Speed Decrease (cyan): Slow, heavy - lower pitch
  - Reverse Controls (orange): Dissonant, off-kilter tone
- Game Over: 8-bit style short melody

**Game Configuration (all values tweakable for balancing):**
- Grid: 25 x 20 units
- Unit size: 10x10 pixels (default, configurable for screen scaling)
- Snake start: 5 segments, bottom left corner, moving right
- Base speed: 8 moves/second
- Speed Boost: Random 1.5x-2x multiplier
- Speed Decrease: Random 0.3x-0.5x multiplier
- Food probabilities: Growing 40%, Invincibility 10%, Wall-Phase 10%, Speed Boost 15%, Speed Decrease 15%, Reverse Controls 10%
- Phone call interval: 15-45 seconds (random)

### Key Differentiators

**What makes CrazySnakeLite unique:**

1. **Strategic Depth + Chaos:** Unlike variants that choose complexity OR chaos, CrazySnakeLite delivers both. Food choices require strategy, while phone calls inject unpredictable chaos.

2. **Phone Call Mechanic is Meta:** The game literally comments on how phones distract us, turning interruption into a gameplay mechanic. This is clever, funny, and thematically resonant with modern life.

3. **Difficulty Through Probability:** Rather than just increasing speed, difficulty comes from the probability distribution of chaotic food types. This is more elegant and creates varied experiences.

4. **Nostalgia with Substance:** Not just a cosmetic retro skin - this genuinely innovates on the formula while honoring the Nokia original.

5. **Challenge + Chaos + Surprise = Replayability:** Every game feels different due to random food spawns and call interruptions, ensuring players stay engaged and surprised.

**Why Now:**
- Browser games are experiencing a renaissance (quick play, no install friction)
- Nostalgia for early mobile gaming is strong (Nokia-era players are adults now)
- Meta commentary on attention/distraction resonates in our notification-heavy world
- Web technology makes responsive, cross-device experiences trivial to deploy

**Success Looks Like:**
Players saying "I need to try this again" because each session delivers a unique combination of challenge and chaos, creating moments of surprise, laughter, and intense focus that traditional Snake never could.

---

## Target Users

### Primary User: Alex, The Office Break Gamer

**Profile:**
- **Context:** Office worker spending workdays at a computer
- **Age Range:** Mid-20s to late 30s (has nostalgic memories of Nokia Snake)
- **Gaming Background:** Remembers and enjoyed the original Snake, but not a hardcore gamer
- **Access:** Desktop web browser (primary), though responsive design allows mobile play
- **Play Pattern:** Quick break entertainment - sessions fit within short work breaks

**Problem Experience:**
Alex finds traditional Snake too predictable and boring after a few plays. Current break-time options (scrolling social media, repetitive mobile games) either feel mindless or don't provide the engaging mental refresh they're looking for. They want something quick, fun, and surprising that doesn't turn into a time sink.

**Success Vision:**
For Alex, success means:
- A quick game that fits their 5-10 minute break perfectly
- Enough variety and chaos that each play feels fresh
- A mental reset that's engaging without guilt
- Something fun that brings back Nokia nostalgia with a modern twist

**Validation Approach:**
Additional user insights and refinements will be gathered through prototype testing with real office workers to validate assumptions about play patterns, session length preferences, and feature priorities.

### User Journey (Lightweight)

**Discovery:** Alex discovers CrazySnakeLite through a shared link from a coworker or stumbles upon it during a web search for "snake game."

**First Play:** Opens the web page during a break, immediately recognizes the Snake concept, notices the retro aesthetic, and starts playing. Within 30 seconds, encounters their first unexpected food type or phone call interruption - they're hooked by the chaos.

**Return:** During the next break, Alex returns to play again, curious to see what crazy combinations will happen this time. The unpredictability and quick session length make it perfect for repeated break-time play without guilt or time investment concerns.

**Note:** User journey will be refined based on prototype testing feedback from actual office workers.

---

## Success Metrics

### User Success Indicators

**Engagement Signals:**
- **Return Rate:** Do players come back for another session? (indicates the game is fun and not just a one-time curiosity)
- **Session Completion:** Do players finish games or quit mid-session? (indicates engagement vs frustration)
- **Multiple Plays Per Visit:** Do players immediately hit "play again" after a game? (indicates the chaos/variety is working)

**Qualitative Feedback:**
- Coworker feedback during prototype testing
- Observing player reactions during first play (laughter, surprise, frustration)
- Spontaneous sharing (did anyone share the link without prompting?)

### Business Objectives

**Primary Goal:** Ship a working, fun Snake variant with strategic depth and chaotic mechanics

**Success Criteria:**
- Game is playable on desktop and mobile browsers
- Core mechanics (6 food types + phone interruptions) work as intended
- Prototype testing with coworkers validates the "fun chaos" experience
- Game provides quick, replayable break entertainment

### Key Performance Indicators (Lightweight)

**Basic Usage Tracking:**
- **Total Sessions:** How many games are played
- **Unique Players:** How many different people try it
- **Average Session Length:** Are sessions fitting the 5-10 minute break window?
- **Return Players:** How many players come back for a second session

**Implementation Note:** Simple analytics (page views, session tracking) - no complex instrumentation needed for initial launch. Focus on shipping and validating the core experience first.

---

## MVP Scope

### Core Features (Full Chaos Included!)

**Essential Gameplay Mechanics:**
1. **All 6 Food Types** (the strategic chaos core):
   ALL foods give +1 segment (score = snake length). Simple geometric shapes (5x5 pixels):
   - Growing food (green, filled square) - +1 segment only, no special effect
   - Invincibility food (yellow, 4-point star) - +1 segment + immunity with rapid strobe/blinking (until next food)
   - Wall-Phase food (purple, ring/donut) - +1 segment + pass through one wall, wrap to opposite side (single use)
   - Speed Boost food (red, cross/plus) - +1 segment + faster movement (until next food)
   - Speed Decrease food (cyan, hollow square) - +1 segment + slower movement (until next food)
   - Reverse Control food (orange, X shape) - +1 segment + inverted controls (until next food)

2. **Phone Call Interruption Mechanic:**
   - Random phone call pop-ups during gameplay
   - Game continues running during interruption (CRITICAL)
   - Space bar (desktop) / End button (mobile) to dismiss
   - Visual phone call UI overlay
   - Algorithm for random timing (start simple, can tune later)

3. **Core Snake Gameplay:**
   - Grid-based movement (arrow keys/WASD on desktop, touch swipe on mobile)
   - Collision detection (walls, self-collision = death)
   - Dynamic snake length based on food consumed
   - Food spawning system with probability distribution

4. **Difficulty System:**
   - At least one balanced difficulty mode with configurable food probability percentages
   - Easy to add more difficulty levels post-MVP (just different probability configs)

5. **Visual Presentation:**
   - Retro pixel art aesthetic (Nokia homage)
   - Simple, clean game board
   - Distinct visual representations for each food type
   - Basic UI (snake length counter, game over screen with final score, play again button)

6. **Session Flow:**
   - Start game → Play until death → Display final score → Play Again option
   - Simple score tracking: snake length = score (small counter + visual snake size)

7. **Platform Support:**
   - Desktop web browser (primary target)
   - Responsive design works on mobile browsers (good enough for MVP)

### Out of Scope for MVP

**Deferred to V2+ (Don't let these creep in!):**
- ❌ Multiple polished difficulty levels (start with one, add more after validation)
- ❌ Advanced scoring algorithms or combo systems
- ❌ Leaderboards or score persistence
- ❌ Settings/preferences menu
- ❌ Pause functionality
- ❌ Animations and visual polish beyond basic retro aesthetic
- ❌ Tutorial or onboarding
- ❌ Analytics dashboard (basic tracking only)
- ❌ Mobile app packaging (web-only for MVP)
- ❌ Additional game modes or variations

**Rationale:** Focus 100% on making the core chaotic mechanics WORK and FEEL FUN. Polish, features, and optimization come after we validate that the 6 food types + phone interruptions create the experience we envision.

### MVP Success Criteria

**The MVP is successful when:**

1. **Core Experience Works:**
   - All 6 food types behave as intended with clear visual feedback
   - Phone call interruptions create the intended "split attention" pressure
   - Game feels chaotic, surprising, and replayable

2. **Prototype Validation:**
   - Coworkers test and provide feedback
   - Players experience "aha!" moments with unexpected food effects
   - Multiple plays per session (indicates engagement)
   - Positive reactions to chaos mechanics

3. **Technical Validation:**
   - Runs smoothly on desktop browsers
   - Works on mobile browsers (even if not perfectly optimized)
   - No game-breaking bugs that ruin the experience

4. **Decision Point:**
   - If coworkers love it → invest in polish, more difficulty levels, scoring improvements
   - If mechanics need tuning → iterate on food probabilities and phone call timing
   - If it's "meh" → reassess core assumptions about what makes it fun

### Future Vision

**If CrazySnakeLite is wildly successful, it could evolve into:**

**Enhanced Gameplay (V2):**
- Multiple refined difficulty levels (Easy/Medium/Hard/Insane with tuned probabilities)
- Additional food types based on player feedback and testing
- Combo scoring system (reward strategic food sequences)
- Daily challenges or special event modes
- Sound design and retro audio effects

**Platform Expansion:**
- Native mobile app with touch optimization
- Progressive Web App (PWA) for offline play
- Steam release as a premium retro game pack

**Social Features:**
- Global leaderboards
- Share score screenshots with visual summary
- "Challenge a friend" with seed-based game replication
- Spectator mode or replay system

**Monetization (if desired):**
- Cosmetic skins (different retro phone aesthetics, snake colors)
- Premium difficulty modes or special food types
- Ad-supported free play with option to remove ads

**Market Expansion:**
- Localization for international markets
- Accessibility features (colorblind modes, keyboard alternatives)
- Educational variant (math problems during phone calls?)
- Corporate team-building version (office-themed interruptions)

**Note:** Future vision is aspirational - MVP focus is on validating the core chaos mechanics work and are fun. Everything else builds on that foundation.
