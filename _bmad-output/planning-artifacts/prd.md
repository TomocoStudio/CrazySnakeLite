---
stepsCompleted: ['step-01-init', 'step-02-discovery', 'step-03-success', 'step-04-journeys', 'step-05-domain', 'step-06-innovation', 'step-07-project-type', 'step-08-scoping', 'step-09-functional', 'step-10-nonfunctional', 'step-11-polish']
inputDocuments: ['_bmad-output/planning-artifacts/product-brief-CrazySnakeLite-2026-01-13.md']
workflowType: 'prd'
briefCount: 1
researchCount: 0
brainstormingCount: 0
projectDocsCount: 0
classification:
  projectType: 'web_app'
  domain: 'gaming'
  complexity: 'low'
  projectContext: 'greenfield'
---

# Product Requirements Document - CrazySnakeLite

**Author:** Tomoco
**Date:** 2026-01-13

## Success Criteria

### User Success

**Primary Success Signal:** Players come back for more

- **Return Rate:** Players return for another session (indicates fun, not one-time curiosity)
- **Session Completion:** Players finish games vs quit mid-session (engagement vs frustration)
- **Multiple Plays Per Visit:** Players immediately hit "play again" (chaos/variety working)
- **Spontaneous Reactions:** Laughter, surprise, "one more game" behavior during first play

**Success Moment:** Within 30 seconds of playing, user encounters first unexpected food type or phone call interruption and thinks "this is NOT regular Snake!"

### Business Success

**Primary Goal:** Ship working Snake variant with strategic depth and chaotic mechanics

**The Win:** Coworkers like it. That's the bar.

**Success at 1 Month:**
- MVP shipped and playable
- 5+ coworkers tested and provided feedback
- Core mechanics (6 food types + phone interruptions) working as intended
- At least 3 coworkers play multiple times without prompting

**Success at 3 Months:**
- Positive coworker feedback validates "fun chaos" experience
- Return players demonstrate replayability
- Decision point clear: iterate on mechanics or consider broader release

### Technical Success

**Performance Requirements:**
- **Frame Rate:** Smooth 60 FPS gameplay (game continues running during phone interruptions without lag)
- **Browser Compatibility:** Works on Chrome, Firefox, Safari, Edge (desktop primary)
- **Mobile Responsive:** Playable on mobile browsers (touch controls functional, even if not perfectly optimized)
- **Load Time:** Game loads and starts within 3 seconds
- **No Game-Breaking Bugs:** Core mechanics work reliably

**Technical Validation:**
- Snake movement responsive and predictable
- Food effects trigger immediately when consumed
- Phone call interruptions display correctly and dismiss on Space/tap
- Collision detection accurate
- Score tracking persists through session

### Measurable Outcomes

**MVP Launch (Week 1-2):**
- Game deployed and accessible via web URL
- All 6 food types functional with distinct behaviors
- Phone call mechanic working (game continues during interruption)
- Basic analytics tracking sessions and returns

**Prototype Testing (Week 2-4):**
- 5+ coworkers test during breaks
- 70%+ finish their first game (vs quit)
- 50%+ play 2+ games in first session
- Qualitative feedback collected (fun? frustrating? boring?)

**Validation Gate (Month 1):**
- If coworkers love it → continue development
- If mechanics need tuning → iterate on probabilities/timing
- If "meh" → reassess core assumptions

## User Journeys

### Primary User: Alex, The Office Break Gamer

**Persona Overview:**
- **Name:** Alex
- **Context:** Office worker, mid-20s to late 30s
- **Situation:** Brain-fried from work, needs quick mental reset during breaks
- **Goal:** Fun, engaging break entertainment that's quick and guilt-free
- **Obstacle:** Traditional Snake is boring, social media scrolling feels empty
- **Solution:** CrazySnakeLite delivers unpredictable chaos and nostalgia

#### Journey 1: Discovery & First Play (Happy Path)

**Opening Scene - The Need:**

It's 2:30pm on a Tuesday. Alex is staring at spreadsheets, brain fried from a morning full of Zoom calls. Coffee isn't helping. They need a mental reset, but doom-scrolling Twitter feels empty and makes them feel worse. They remember playing Snake on their Nokia 3310 back in high school during boring classes - that was simple, mindless fun that actually refreshed them.

Alex Googles "snake game" hoping to find something nostalgic. CrazySnakeLite appears in the results with its retro pixel art thumbnail. "That looks like the old Nokia game," they think. They click.

**Rising Action - The Discovery:**

The page loads instantly. Retro 8-bit pixel art fills the screen with a super light grey background and purple glowing border - playful and inviting. Big "NEW GAME" button. Alex clicks it.

The snake appears (black by default). Arrow keys work. First food (green square) appears in the grid. Alex guides the snake to it, eats it. Snake grows by one segment and turns green. "Yeah, same old Snake," they think, smiling at the nostalgia but expecting to get bored in 30 seconds.

Then a cyan food appears. Alex eats it. Suddenly the snake **SLOWS DOWN** dramatically. "Wait, what?! Why am I crawling?!" Alex is frustrated but intrigued. They keep playing, waiting for the effect to wear off.

10 seconds later, a phone call popup interrupts the screen - a Nokia-era phone UI (black-on-grey) with "Mom" calling and an "End" button. But the game keeps running underneath, visible but blurry! Alex can sense the snake still moving. "Oh no!" They frantically hit Space bar. Phone disappears. Snake barely avoided hitting the wall.

"This is NOT regular Snake!"

**Climax - The Chaos:**

Over the next 3 minutes, Alex experiences:
- **Invincibility food (yellow):** Snake starts blinking rapidly like an old-school power-up! Alex intentionally crashes into a wall to test it - bounces off harmlessly. "WHAT?!"
- **Wall-Phase food (purple):** Snake heads toward a wall and... passes right through, appearing on the opposite side! "Whoa, that's a lifesaver!"
- **Speed Boost food (red):** Snake moves FAST. Alex struggles to control it, laughing at the chaos.
- **Speed Decrease food (cyan):** Snake crawls at a snail's pace. "Ugh, come ON!" Alex waits impatiently for it to wear off.
- **Reverse Controls (orange):** Up becomes down, left becomes right. Complete mayhem. Alex crashes into themselves while laughing.

**Another phone call interrupts.** This time Alex is ready - hits Space immediately while the snake weaves through tight spaces. Survives!

Alex finally crashes into themselves after 4 minutes of increasingly chaotic gameplay. Final score: 287 points.

Game over screen: "GAME OVER!" with "Your score: 287" and "Play Again" button selected by default.

**Resolution - The Hook:**

Without thinking, Alex clicks "PLAY AGAIN" immediately. They want to see what crazy combinations happen this time.

They play 4 more games over the next 10 minutes. Each one feels different - different food sequences, different phone call timing, different chaos.

Alex finally closes the browser tab feeling genuinely refreshed. They're smiling. The mental fog from spreadsheets is gone. They actually had FUN for 10 minutes.

Later that afternoon, Alex Slacks the link to a coworker: "Try this snake game - it's insane 😂"

The next day during morning break, Alex opens CrazySnakeLite again without prompting.

#### Journey 2: Edge Case - Initial Frustration to Recovery

**Opening Scene - The Struggle:**

It's Alex's second day playing. They had fun yesterday, so they're back for more chaos. They start a new game, feeling confident.

Within 15 seconds, they eat reverse control food. Up/down/left/right are inverted. Alex immediately crashes into a wall, confused. "Ugh, what was that?"

They hit "PLAY AGAIN," determined to do better.

Second attempt: Phone call interrupts at 20 seconds. Alex panics, fumbles for Space bar. Misses it. By the time they dismiss the call, snake has crashed. 23 seconds. Score: 12 points.

"This is annoying."

**Rising Action - The Learning:**

Alex is frustrated but refuses to quit. They start a third game, this time being more cautious. They avoid the weird-colored foods, only eating the safe green growing food.

The game becomes... regular boring Snake. No chaos. No surprise. After 2 minutes, Alex is bored and deliberately crashes.

"Wait, the weird foods are what make this fun."

**Climax - The Breakthrough:**

Fourth attempt: Alex decides to embrace the chaos. They intentionally eat every weird food they see just to experience the madness.

Speed Decrease? Annoying, but I can wait it out.
Wall-Phase? Okay, that's actually useful for escaping tight spots!
Invincibility? YES, plow through everything!
Phone call? Bring it on, I'm ready now.

Alex survives for 5 minutes, score: 412. New personal best.

**Resolution - The Mastery:**

Alex realizes the game isn't about avoiding chaos - it's about **riding the chaos**. The phone calls aren't annoying interruptions; they're part of the challenge. The weird foods aren't bugs; they're features.

Alex keeps playing. Now they're strategically choosing which foods to eat based on their current situation. Wall-phase when trapped in a corner. Speed boost when there's open space. It's actually... tactical?

Alex becomes a regular. Every break, they play 2-3 games. They've learned to love the chaos.

### Journey Requirements Summary

**Core Gameplay Capabilities Revealed:**

1. **Game Engine Requirements:**
   - Instant load (< 3 seconds) - Alex needs quick access during short breaks
   - 60 FPS smooth performance - chaos feels laggy/broken if frame rate drops
   - Grid-based snake movement with arrow key/WASD controls
   - Food spawning system with visual distinction between 6 types
   - Collision detection (walls, self-collision, food consumption)

2. **Game Configuration Parameters (all values tweakable for testing/balancing):**

   **Grid & Units:**
   - Grid dimensions: 25 x 20 units
   - Unit size: 10x10 pixels (default, configurable for different screen sizes)
   - Base resolution: 250 x 200 pixels (scales with unit size)

   **Snake Starting State:**
   - Starting length: 5 segments
   - Starting position: Bottom left corner
   - Starting direction: Moving right

   **Speed Settings:**
   - Base speed: 8 moves per second
   - Speed Boost: Random multiplier between 1.5x and 2x base speed
   - Speed Decrease: Random multiplier between 0.3x and 0.5x base speed

   **Food Spawn Probabilities (must total 100%):**
   - Growing (green): 40%
   - Invincibility (yellow): 10%
   - Wall-Phase (purple): 10%
   - Speed Boost (red): 15%
   - Speed Decrease (cyan): 15%
   - Reverse Controls (orange): 10%

   **Phone Call Timing:**
   - Random interval: 15-45 seconds between calls

3. **Food System Requirements:**
   - 6 distinct food types with immediate visual/behavioral feedback
   - **ALL food types give +1 segment when consumed (score = snake length)**
   - Food visuals: simple geometric shapes in pixel style (5x5 pixels)
   - Growing food (green, filled square) - +1 segment only, no special effect (instant)
   - Invincibility food (yellow, 4-point star) - +1 segment + wall/self immunity with rapid strobe/blinking visual
   - Wall-Phase food (purple, ring/donut) - +1 segment + pass through one wall, wrap to opposite side (single use)
   - Speed Boost food (red, cross/plus) - +1 segment + increased movement speed
   - Speed Decrease food (cyan, hollow square) - +1 segment + decreased movement speed (chaos element!)
   - Reverse Control food (orange, X shape) - +1 segment + inverted controls
   - **Duration rule:** ALL timed effects (Invincibility, Speed Boost, Speed Decrease, Reverse Controls) end after eating 1 new food
   - Probability-based spawning system (configurable for difficulty)

4. **Phone Call Interruption Requirements:**
   - Random timing algorithm for pop-ups
   - Visual phone call UI overlay (retro aesthetic)
   - Game continues running during interruption (CRITICAL for tension)
   - Space bar (desktop) / tap End (mobile) to dismiss
   - Clear visual feedback when dismissed

5. **Session Flow Requirements:**
   - One-click start (no friction)
   - Death → immediate "PLAY AGAIN" option (no navigation away)
   - Score display (simple points)
   - Game over screen with score

6. **Learning Curve Requirements:**
   - Immediate food effect feedback (player learns through play)
   - Visual distinction between food types (color/shape)
   - Tolerant of early deaths (fast restart encourages experimentation)
   - Edge case recovery: player can learn to embrace chaos after initial frustration

7. **Platform Requirements:**
   - Desktop browser primary (Alex at work computer)
   - Keyboard controls (arrow keys/WASD/Space)
   - Mobile responsive touch controls (secondary)
   - Works across Chrome, Firefox, Safari, Edge

8. **Session Design Requirements:**
   - 5-10 minute typical session length
   - Multiple plays per visit (fast restart)
   - No save/load needed (pure session-based)
   - No login/account required (zero friction)

## Innovation & Novel Patterns

### Detected Innovation Areas

**1. Phone Call Interruption Mechanic (Meta Gameplay)**

CrazySnakeLite introduces a novel mechanic where "phone calls" interrupt gameplay while the game continues running underneath. This is innovative on multiple levels:

- **Social Commentary:** Turns modern phone distraction behavior into a gameplay mechanic - phones interrupt us constantly in real life, now they interrupt in-game
- **Attention-Splitting Challenge:** Unlike traditional Snake where focus is uninterrupted, this forces split attention and quick reactions
- **Thematic Resonance:** Meta commentary on how phones have changed from Snake's Nokia origins to today's constant interruption machines

**Innovation Type:** Mechanic innovation - novel gameplay pattern not seen in Snake variants or casual browser games

**2. Strategic Depth + Chaos Fusion**

Most Snake variants choose either complexity OR chaos. CrazySnakeLite delivers both simultaneously:

- **6 Food Types:** Create strategic decision-making (which food to pursue based on current situation)
- **Random Interruptions:** Inject unpredictable chaos that disrupts strategic planning
- **Result:** Players must plan tactically while adapting to chaos - higher cognitive engagement than traditional Snake

**Innovation Type:** Design philosophy innovation - challenging the assumption that casual games must be simple/predictable or complex/strategic (not both)

**3. Difficulty Through Probability Distribution**

Traditional Snake difficulty = increase speed. CrazySnakeLite uses configurable food spawn probabilities:

- **Easy Mode:** Higher percentage of safe growing food, lower chaos food
- **Hard Mode:** Higher percentage of chaos-inducing foods (reverse controls, speed decrease, speed boost)
- **Result:** More elegant difficulty scaling that changes experience variety, not just reflexes

**Innovation Type:** Technical innovation - probability-based difficulty tuning in casual games

### Market Context & Competitive Landscape

**Current Snake Variants:**
- **Cosmetic Only:** Different skins/themes, identical mechanics (boring)
- **Multiplayer (Snake.io):** Changes context to competitive, but core gameplay unchanged
- **Speed Increases:** Just make it faster (lazy difficulty)
- **Obstacles Added:** Static barriers that don't fundamentally change decision-making

**What's Missing in the Market:**
- No Snake variant uses attention-splitting interruption mechanics
- No casual browser game has turned phone distractions into gameplay
- No Snake variant combines strategic food choices with unpredictable chaos
- Probability-based difficulty is rare in casual web games

**Competitive Advantage:**
- **Phone call mechanic is defensible:** Thematically tied to phones/Snake nostalgia, not easily copied without looking derivative
- **Chaos + strategy combination:** Creates unique player experience that's hard to replicate with single-axis changes
- **Fast iteration:** Web-based delivery allows rapid tuning of probabilities and timing based on feedback

### Validation Approach

**Primary Validation: Coworker Testing**

Test with 5+ office workers (target demographic) to validate:

1. **Phone Call Mechanic Validation:**
   - **Success Signal:** Laughter, surprise, "one more game" despite interruptions
   - **Failure Signal:** Frustration, complaints about "annoying," quit mid-session
   - **Tuning Levers:** Frequency of calls, timing windows, visual clarity of phone UI

2. **Food System Validation:**
   - **Success Signal:** Players intentionally pursue/avoid specific foods based on strategy
   - **Failure Signal:** Players ignore food types, play like traditional Snake
   - **Tuning Levers:** Visual distinction, effect duration, spawn probabilities

3. **Chaos Balance Validation:**
   - **Success Signal:** 50%+ play multiple games per session (replayability)
   - **Failure Signal:** <30% completion rate (too hard/frustrating)
   - **Tuning Levers:** Probability distribution by difficulty, effect durations

**Validation Metrics:**
- Session completion rate (70%+ target)
- Return rate next day (50%+ target)
- Multiple plays per visit (2+ games target)
- Qualitative feedback (fun/frustrating/boring scale)

**Iteration Cycle:**
- Week 1: Ship MVP with baseline probabilities
- Week 2-3: Gather coworker feedback
- Week 3-4: Tune probabilities/timing based on data
- Month 1: Validation gate - proceed or pivot

### Risk Mitigation

**Risk 1: Phone calls are annoying, not fun**

**Mitigation Strategy:**
- Start with lower frequency (every 45-60 seconds)
- Make dismissal obvious and fast (big DECLINE button, Space bar)
- Visual clarity: game continues underneath with slight transparency on phone UI
- **Fallback:** Frequency slider in settings (post-MVP) or reduce default frequency

**Risk 2: Too much chaos = unplayable frustration**

**Mitigation Strategy:**
- Configurable probability percentages (easy to tune without code changes)
- Start conservative on chaos foods (lower spawn rates)
- Monitor completion rates - if <50%, dial down chaos
- **Fallback:** "Classic Mode" with just growing food (no chaos effects)

**Risk 3: Innovation doesn't resonate with target users**

**Mitigation Strategy:**
- Test with actual office workers (target demographic), not just any gamers
- A/B test: control group plays traditional Snake, test group plays CrazySnakeLite
- Measure engagement difference (session length, return rate)
- **Fallback:** If innovation falls flat, ship traditional Snake with retro aesthetic (still viable product)

**Risk 4: Technical implementation of "game continues during interruption"**

**Mitigation Strategy:**
- Prototype phone call mechanic first (highest technical risk)
- Ensure 60 FPS maintained during overlay (performance testing)
- Test across browsers for rendering consistency
- **Fallback:** Pause game during phone call (less innovative but still unique)

**Risk 5: Hard to tune without data**

**Mitigation Strategy:**
- Build analytics from day 1 (session tracking, food consumption, phone call dismissal speed)
- Instrument everything: which foods eaten, death causes, session lengths
- Use coworker feedback + data to inform tuning decisions
- **Fallback:** Manual observation during coworker testing sessions (watch them play)

## Web App Specific Requirements

### Project-Type Overview

CrazySnakeLite is a Single Page Application (SPA) delivered via web browser. Pure client-side JavaScript game with no server-side rendering or backend dependencies for core gameplay. Designed for instant load and immediate play with zero installation friction.

**Architecture:**
- Client-side JavaScript game engine
- Canvas-based rendering for retro pixel art
- Stateless sessions (no server persistence for MVP)
- Basic analytics via client-side tracking

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

**Known Limitations:**
- IE11 not supported (EOL, no longer relevant)
- Older mobile browsers may have performance issues (acceptable for MVP)

### Responsive Design Approach

**Desktop Primary (Primary Target):**
- Game board sized for typical desktop browser window
- Keyboard controls (arrow keys, WASD, Space bar)
- Optimized for 1920x1080 and 1366x768 common resolutions
- Minimum viable resolution: 1024x768

**Mobile Responsive (Secondary Target):**
- Touch swipe controls for snake direction
- Tap to dismiss phone call overlay
- Game board scales to fit mobile viewport
- Portrait and landscape orientations supported
- Acceptable if not perfectly optimized for MVP

**Control Mapping:**
- Desktop: Arrow keys or WASD for movement, Space for phone dismiss
- Mobile: Swipe gestures for movement, tap for phone dismiss
- No virtual D-pad needed (swipe is more intuitive)

### Performance Targets

**Critical Performance Requirements:**

1. **Frame Rate:**
   - 60 FPS during normal gameplay (CRITICAL)
   - 60 FPS maintained during phone call overlay (game continues underneath)
   - No frame drops during food consumption or snake growth
   - Smooth animation for all visual effects

2. **Load Time:**
   - Initial page load: < 3 seconds
   - Game start (after load): < 0.5 seconds
   - No loading screens during gameplay

3. **Memory:**
   - Client-side memory usage < 100MB
   - No memory leaks during extended play sessions
   - Garbage collection doesn't cause frame drops

4. **Responsiveness:**
   - Input lag < 50ms (keyboard/touch to snake movement)
   - Phone call dismiss < 100ms (Space/tap to overlay removal)
   - Instant restart on "PLAY AGAIN" click

**Performance Validation:**
- Test on mid-range devices (not just high-end)
- Monitor frame rate during chaos (multiple effects active)
- Test prolonged sessions (30+ minutes) for memory leaks

### SEO Strategy

**Minimal SEO for MVP:**

CrazySnakeLite is a game, not content. SEO is low priority for MVP.

**Basic SEO Requirements:**
- Descriptive page title: "CrazySnakeLite - Chaotic Snake Game"
- Meta description: "Classic Nokia Snake with chaotic twists - 6 food types, phone interruptions, pure chaos!"
- Open Graph tags for link sharing (image preview when shared)
- Semantic HTML structure

**Out of Scope for MVP:**
- Dynamic meta tags
- Schema.org markup
- Sitemap generation
- Blog/content marketing

**Post-MVP Considerations:**
- If game goes viral, add proper OG tags for Twitter/Slack previews
- Landing page with game embedded (better for SEO)

### Accessibility Level

**MVP Accessibility:**

**Included in MVP:**
- Keyboard navigation (arrow keys, WASD, Space) - inherently accessible
- Clear visual distinction between food types (color + shape)
- Large tap targets for mobile (phone dismiss button)
- No reliance on audio (visual-only feedback)

**Post-MVP Accessibility:**
- Colorblind mode (alternative color palettes)
- Screen reader support for scores and game state
- Adjustable game speed for motor impairments
- High contrast mode
- WCAG 2.1 AA compliance

**Rationale:**
Focus MVP on core mechanics validation with coworkers (target demographic has no specific accessibility needs identified). Add accessibility features based on user feedback and broader release.

### Technical Implementation Considerations

**Technology Stack:**
- Vanilla JavaScript or lightweight framework (React/Vue if needed)
- HTML5 Canvas for rendering
- CSS for UI elements (score, game over, phone overlay)
- No build tool required for MVP (optional optimization for production)

**Game Loop Architecture:**
- RequestAnimationFrame for smooth 60 FPS rendering
- Fixed time step for game logic (consistent gameplay regardless of frame rate)
- Separate render and update loops
- Event-driven input handling

**State Management:**
- Simple client-side state (no Redux needed for MVP)
- Game state: snake position, food positions, active effects, score
- Session state: current game only (no persistence)
- Config state: food probability percentages (tunable without code changes)

**Deployment:**
- Static site hosting (Netlify, Vercel, GitHub Pages)
- Single HTML file + JS + CSS (simple deployment)
- No server-side components for MVP
- Analytics via client-side snippet (Google Analytics or similar)

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** Experience MVP - Validate Innovation

CrazySnakeLite follows an experience MVP strategy focused on validating that the innovative chaos mechanics (6 food types + phone interruptions) create a fun, replayable experience. Success is defined by coworker validation, not feature completeness.

**Core Philosophy:**
- Ship ALL innovative mechanics in MVP (no partial implementation)
- Validate with target demographic (office workers) through direct testing
- Iterate quickly based on real user feedback and observed behavior
- Prioritize core gameplay perfection over polish or features

**Success Bar:** Coworkers like it and play multiple sessions

**Resource Requirements:**
- Solo developer or small team (1-2 developers)
- 2-4 weeks for MVP development
- UX designer collaboration for visual distinction of food types (mentioned working with "Sally")
- Coworker testers (5+) for validation

### MVP Feature Set (Phase 1)

**Core User Journey Supported:**
- Alex's Happy Path: Discovery → First Play → Multiple Sessions → Return Next Day

**Must-Have Capabilities:**

1. **Complete Food System (All 6 Types):**
   - Growing food (green) - traditional Snake growth, +1 segment
   - Invincibility food (yellow) - temporary wall/self immunity with rapid strobe/blinking visual
   - Wall-Phase food (purple) - pass through one wall and wrap to opposite side (single use)
   - Speed Boost food (red) - increased movement speed for duration
   - Speed Decrease food (cyan) - decreased movement speed for duration (chaos element!)
   - Reverse Control food (orange) - inverted controls for duration
   - Configurable probability distribution (easy to tune)
   - Immediate visual feedback for each food effect

2. **Phone Call Interruption Mechanic:**
   - Random timing algorithm (start at 45-60 second intervals)
   - Visual phone call UI overlay (retro aesthetic)
   - Game continues running during interruption (CRITICAL for innovation)
   - Space bar (desktop) / End tap (mobile) to dismiss
   - Clear visual feedback

3. **Core Snake Gameplay:**
   - Grid-based movement with arrow keys/WASD controls
   - Collision detection (walls, self-collision = death)
   - Dynamic snake length based on food consumed
   - 60 FPS smooth performance
   - Food spawning with probability-based system

4. **One Balanced Difficulty Mode:**
   - Single default probability configuration
   - Tuned for "fun chaos" balance (not too easy, not frustrating)
   - Post-launch: dial up/down based on completion rates

5. **Essential UI:**
   - Retro pixel art aesthetic (Nokia homage)
   - Simple, clean game board
   - Distinct visual representation for each food type (color + shape/icon)
   - Score display during gameplay
   - Game over screen with final score
   - "PLAY AGAIN" button (instant restart, no friction)

6. **Session Flow:**
   - One-click start from landing page
   - Play until death
   - Display score
   - Immediate restart option
   - No login, no save/load, no persistence

7. **Platform Support:**
   - Desktop web browser (Chrome, Firefox, Safari, Edge)
   - Mobile responsive with touch controls (good enough, not perfect)

8. **Basic Analytics:**
   - Session tracking (starts, completions, deaths)
   - Food consumption tracking (which types eaten)
   - Phone call dismissal speed
   - Return rate tracking

**Out of MVP Scope:**
- Multiple difficulty levels (post-validation)
- Advanced scoring algorithms or combos
- Leaderboards or score persistence
- Settings/preferences menu
- Pause functionality
- Tutorial or onboarding
- Visual polish beyond basic retro aesthetic

### Post-MVP Features

**Phase 2: Growth (If Coworkers Love It)**

**Enhancements Based on Validation:**
- Multiple refined difficulty levels (Easy/Medium/Hard with tuned probabilities)
- Advanced scoring system (combos, food-sequence bonuses)
- Sound design and retro audio effects
- Visual polish and smooth animations
- Better mobile optimization (native feel on mobile browsers)
- Settings menu (difficulty, sound volume, phone call frequency)

**Additional Features:**
- Leaderboards (local or global)
- Score persistence across sessions
- Player stats (games played, high score, average score)
- Pause functionality

**Phase 3: Expansion (If It Goes Viral)**

**Platform Expansion:**
- Progressive Web App (PWA) for offline play
- Native mobile app (iOS/Android)
- Steam release as premium retro game

**Social Features:**
- Share score screenshots with visual summary
- Challenge a friend with seed-based replication
- Global leaderboards with rankings
- Social media integration

**Gameplay Expansion:**
- Additional food types based on feedback
- Daily challenge modes or special events
- Multiple game modes (time attack, endless, classic)
- Customization (snake skins, board themes)

**Monetization (If Desired):**
- Cosmetic skins (retro phone aesthetics, snake colors/patterns)
- Premium difficulty modes
- Ad-supported free play with ad-removal option
- Donation/tip jar model

### Risk Mitigation Strategy

**Technical Risks:**

**Risk:** Game continues running during phone call overlay (highest technical complexity)
**Mitigation:**
- Prototype this mechanic FIRST before building full game
- Ensure 60 FPS maintained during overlay rendering
- Test across all target browsers for consistency
- **Fallback:** Pause game during phone call (less innovative but still unique differentiator)

**Risk:** Performance degradation with multiple active effects
**Mitigation:**
- Optimize render loop from day 1
- Test with all 6 food effects active simultaneously
- Profile on mid-range devices, not just high-end
- **Fallback:** Limit number of concurrent active effects to 3

**Risk:** Browser compatibility issues
**Mitigation:**
- Test on all target browsers weekly
- Use well-supported Canvas APIs (no experimental features)
- Graceful degradation for older browsers
- **Fallback:** Display "Unsupported browser" message with recommendations

**Market Risks:**

**Risk:** Innovation doesn't resonate (phone calls are annoying, not fun)
**Mitigation:**
- Test with actual target demographic (office workers), not just any gamers
- Start with conservative phone call frequency, tune based on feedback
- Observe play sessions to see emotional reactions
- **Fallback:** Reduce frequency or make optional in settings

**Risk:** Too much chaos = frustration, not fun
**Mitigation:**
- Configurable probability system (easy to tune without code changes)
- Monitor completion rates - if <50%, dial down chaos
- Start conservative, gradually increase chaos based on tolerance
- **Fallback:** Classic mode with just growing food (no chaos effects)

**Risk:** Coworker feedback is mixed or negative
**Mitigation:**
- Get detailed qualitative feedback on what works/doesn't work
- Iterate on specific mechanics (don't scrap entire concept)
- A/B test variations (higher/lower phone frequency, fewer food types)
- **Fallback:** If mechanics fail, pivot to traditional Snake with excellent polish

**Resource Risks:**

**Risk:** Development takes longer than expected (scope creep)
**Mitigation:**
- Ruthlessly stick to MVP scope - NO feature additions before validation
- Track development velocity weekly
- Cut visual polish first if timeline slips (function > form for MVP)
- **Fallback:** Launch with 4 food types instead of 6 if needed to hit timeline

**Risk:** Can't get coworker participation for testing
**Mitigation:**
- Make testing low-friction (send link, 5-minute commitment)
- Offer incentive (coffee, lunch) for detailed feedback
- Test with friends/family if coworkers unavailable
- **Fallback:** Launch publicly and gather feedback from early adopters online

**Risk:** Solo developer burnout or availability issues
**Mitigation:**
- Set realistic 2-4 week timeline (not overly aggressive)
- Focus on MVP scope only (prevents overwhelm)
- Partner with UX designer (Sally) to share workload
- **Fallback:** Simplify visual aesthetic to reduce scope

## Functional Requirements

### Core Gameplay

- FR1: Players can control snake movement in four cardinal directions (up, down, left, right)
- FR2: The snake automatically moves in the current direction at a consistent speed
- FR3: The snake grows in length when consuming ANY food type (+1 segment per food)
- FR4: The snake dies upon collision with walls (unless invincibility or wall-phase active)
- FR5: The snake dies upon collision with itself (unless invincibility active)
- FR6: Players can see the snake's current position and length on the game board
- FR7: The game board has defined boundaries that trigger death on collision (with exceptions)
- FR8: The game continues until the player's snake dies

### Food System

- FR10: Food items spawn randomly on the game board at available grid positions
- FR11: Food items are consumed when the snake's head occupies the same position
- FR12: Growing food (green) increases snake length by one segment (no special effect)
- FR13: Invincibility food (yellow) increases snake length by one segment AND grants immunity to wall and self-collision until next food is eaten
- FR14: Invincibility effect displays as rapid strobe/blinking visual (old-school arcade style)
- FR15: Wall-Phase food (purple) increases snake length by one segment AND allows snake to pass through one wall and wrap to the opposite side
- FR16: Wall-Phase effect is single-use: activates on consumption, ends after snake fully passes through one wall
- FR17: Speed Boost food (red) increases snake length by one segment AND increases movement speed until next food is eaten
- FR18: Speed Decrease food (cyan) increases snake length by one segment AND decreases movement speed significantly until next food is eaten
- FR19: Reverse Control food (orange) increases snake length by one segment AND inverts directional controls until next food is eaten
- FR20: ALL timed effects (Invincibility, Speed Boost, Speed Decrease, Reverse Controls) end immediately when the next food is consumed
- FR21: Each food type has a distinct visual appearance (color and shape)
- FR22: Food spawning follows configurable probability distribution for each food type
- FR23: Only one food item exists on the board at a time
- FR24: New food spawns immediately after current food is consumed

### Phone Call Interruption Mechanic

**Visual Design:**
- FR25: Phone call UI uses Nokia-era phone screen aesthetic (black-on-grey, monochrome, simple)
- FR26: Phone call overlay covers full screen with blurry game visible in background
- FR27: Phone call overlay is centered on screen
- FR28: Phone call displays a random funny caller name and "End" button at bottom center

**Funny Caller Names Pool:**
Family & Friends: "Mom", "Dad", "Grandma", "Your Ex", "Best Friend", "That Cousin"
Work & Responsibility: "Boss", "HR Department", "Meeting Reminder", "Quick Question", "Monday Morning"
Annoying & Spam: "Spam Likely", "Unknown", "Debt Collector", "Extended Warranty", "Free Vacation", "Nigerian Prince"
Existential & Absurd: "Your Conscience", "Future You", "Past Mistakes", "Anxiety", "The Void", "Destiny Calling", "Reality Check"
Meta & Silly: "Not A Scam", "Please Answer", "Important!!!", "Last Chance", "Snake Headquarters", "Game Over (calling early)"
Random Numbers: "555-0123", "1-800-CHAOS", "666-6666"

**Behavior:**
- FR29: Phone call interruptions occur at random intervals between 15-45 seconds
- FR30: The game continues running underneath the phone call overlay (CRITICAL)
- FR31: Phone call stays on screen until player dismisses it (does not auto-dismiss)
- FR32: Players dismiss phone calls by pressing Space bar on desktop
- FR33: Players dismiss phone calls by tapping "End" button on mobile
- FR34: Phone call overlay disappears immediately upon dismissal

### Session Flow

- FR35: Players can start a new game from the landing page
- FR36: Each game session begins with a snake of default starting length
- FR37: Game sessions end when the player's snake dies
- FR38: Players can see their final score upon death
- FR39: Players can restart immediately after death without navigation
- FR40: Game sessions are independent with no state persistence between sessions

### Scoring System

- FR41: ALL food types increase snake length by one segment when consumed
- FR42: Score equals snake length (simple, visual scoring)
- FR43: Players can see a small score counter during gameplay displaying current snake length
- FR44: Players can visually gauge their score by the snake's size on screen
- FR45: Final score (snake length at death) is displayed on the game over screen

### User Interface

**Visual Style:**
- FR46: Game uses retro arcade 8-bit pixel art style (colorful, playful, fun mood)
- FR47: Game board has super light grey background with subtle light grey grid
- FR48: Game board border is a regular line with purple neon glow (matching wall-phase food color)
- FR49: Food items are simple geometric shapes in pixel style with distinct colors

**Snake Appearance:**
- FR50: Snake uses classic blocky pixel segments
- FR51: Snake color matches the last food eaten (default: black)
- FR52: Snake blinks briefly when transitioning from one color to another (on eating new food)
- FR53: Invincibility effect displays as rapid strobe/blinking on the snake (yellow)

**Other UI:**
- FR54: Players can distinguish between different food types by color and shape
- FR55: The phone call overlay displays Nokia-era aesthetic (black-on-grey, monochrome)
- FR56: Score counter displays at top-center of the game board
- FR57: Active effects are indicated by snake color + movement sound only (no additional UI elements)
- FR58: UI elements use clear visual hierarchy for important information

**Screens:**

*Main Menu Screen:*
- FR59: Main menu displays "New Game" and "Top Score" options
- FR60: "New Game" starts a new game session
- FR61: "Top Score" displays the player's best score stored in browser localStorage
- FR62: Post-MVP: Player accounts with database storage for scores

*Game Over Screen:*
- FR63: Game over screen displays "GAME OVER!" title text
- FR64: Game over screen displays "Your score: XX" with final snake length
- FR65: Game over screen shows two options: "Play Again" and "Menu"
- FR66: "Play Again" is selected by default on game over screen
- FR67: "Play Again" starts a new game immediately
- FR68: "Menu" returns to main menu screen

**Menu Navigation:**
- FR69: Enter key validates/selects the current menu choice
- FR70: Mouse click on buttons validates the choice
- FR71: Esc key cancels current action and opens the Menu screen
- FR72: Esc key during gameplay opens the Menu screen (pauses game)

### Input Controls

**Snake Movement:**
- FR73: Arrow keys control snake direction (Up, Down, Left, Right)
- FR74: Numpad controls snake direction (8=Up, 2=Down, 4=Left, 6=Right)
- FR75: WASD keys control snake direction for US keyboards (W=Up, S=Down, A=Left, D=Right)
- FR76: ZQSD keys control snake direction for French AZERTY keyboards (Z=Up, S=Down, Q=Left, D=Right)
- FR77: Swipe gestures control snake direction on mobile

**Other Controls:**
- FR78: Space bar dismisses phone calls on desktop
- FR79: Tap on "End" button dismisses phone calls on mobile
- FR80: Input controls respond with minimal latency

### Sound Design

**Movement Sounds (8-bit style, short impulse, played at each snake step):**
- FR81: Each snake movement step plays a sound based on current snake color/state
- FR82: Default state (black snake): Neutral "blip" - classic arcade step sound
- FR83: After Growing food (green snake): Pleasant, positive tone
- FR84: After Invincibility food (yellow snake): Powerful, strong tone
- FR85: After Wall-Phase food (purple snake): Ethereal, magical tone
- FR86: After Speed Boost food (red snake): Quick, energetic tone - higher pitch
- FR87: After Speed Decrease food (cyan snake): Slow, heavy tone - lower pitch, sluggish
- FR88: After Reverse Controls food (orange snake): Dissonant, off-kilter tone

**Game Over Music:**
- FR89: Game over screen plays 8-bit style short melody

### Platform Support

- FR90: The game runs in Chrome, Firefox, Safari, and Edge browsers
- FR91: The game supports desktop screen resolutions from 1024x768 and above
- FR92: The game adapts to mobile screen sizes with responsive layout
- FR93: Touch controls function on mobile browsers
- FR94: The game loads and becomes playable within 3 seconds

### Analytics & Tracking

- FR95: The system tracks game session starts
- FR96: The system tracks game session completions (deaths)
- FR97: The system tracks which food types are consumed
- FR98: The system tracks phone call dismissal response times
- FR99: The system tracks player return rate across sessions

## Non-Functional Requirements

### Performance

**Frame Rate:**
- NFR1: The game maintains 60 frames per second (FPS) during normal gameplay
- NFR2: The game maintains 60 FPS when phone call overlay is active with game running underneath
- NFR3: Frame rate does not drop below 55 FPS during food consumption or snake growth
- NFR4: Frame rate does not drop below 55 FPS when multiple food effects are active simultaneously

**Load Time:**
- NFR5: Initial page load completes within 3 seconds on broadband connections (5 Mbps+)
- NFR6: Game becomes playable (start button clickable) within 0.5 seconds after page load
- NFR7: No loading screens or delays during gameplay transitions

**Responsiveness:**
- NFR8: Input lag from keyboard/touch to snake direction change is less than 50 milliseconds
- NFR9: Phone call dismissal (Space/tap) removes overlay within 100 milliseconds
- NFR10: "PLAY AGAIN" button responds within 100 milliseconds and restarts game immediately

**Memory:**
- NFR11: Client-side memory usage remains below 100 MB during gameplay
- NFR12: No memory leaks occur during extended play sessions (30+ minutes)
- NFR13: Garbage collection does not cause noticeable frame drops or stuttering

### Browser Compatibility

**Supported Browsers:**
- NFR14: Game functions correctly on Chrome 90+ (desktop and mobile)
- NFR15: Game functions correctly on Firefox 88+ (desktop and mobile)
- NFR16: Game functions correctly on Safari 14+ (desktop and iOS)
- NFR17: Game functions correctly on Edge 90+ (desktop)

**Cross-Browser Consistency:**
- NFR18: Visual appearance is consistent across all supported browsers (within 95% similarity)
- NFR19: Gameplay mechanics behave identically across all supported browsers
- NFR20: Performance targets (60 FPS, load time) are met across all supported browsers

**Resolution Support:**
- NFR21: Game is playable on desktop resolutions from 1024x768 up to 4K displays
- NFR22: Game scales appropriately to mobile screen sizes (320px to 768px width)
- NFR23: Touch controls function correctly on mobile browsers (iOS Safari, Chrome Mobile)

**Graceful Degradation:**
- NFR24: Unsupported browsers display clear message with browser recommendations
- NFR25: Older browsers that partially support features degrade gracefully without crashes

### Reliability

**Stability:**
- NFR26: Game does not crash or freeze during normal gameplay
- NFR27: Game recovers gracefully from unexpected errors without losing current session
- NFR28: No game-breaking bugs that prevent core gameplay loop from functioning

**Consistency:**
- NFR29: Snake movement speed is consistent across different devices and browsers
- NFR30: Food effects trigger reliably 100% of the time when consumed
- NFR31: Collision detection is accurate and consistent (no false positives/negatives)
- NFR32: Phone call interruptions trigger consistently based on configured timing algorithm

**Data Integrity:**
- NFR33: Score calculations are accurate for all food types and scenarios
- NFR34: Analytics data is captured reliably without affecting gameplay performance
- NFR35: Game state remains consistent throughout a session (no state corruption)

### Usability

**Learnability:**
- NFR36: New players understand basic controls (arrow keys/swipe) without instructions within first 30 seconds
- NFR37: Food effect behaviors are clear from visual feedback alone (no text required)
- NFR38: Phone call dismissal mechanism is immediately obvious upon first occurrence

**Error Tolerance:**
- NFR39: Rapid input changes (multiple quick key presses) do not cause erratic behavior
- NFR40: Game handles edge cases gracefully (snake length of 1, wall-phase wrap-around)

### Maintainability

**Code Quality:**
- NFR41: Game logic is modular and separable from rendering logic
- NFR42: Food probability configuration is easily adjustable without code changes
- NFR43: Phone call timing algorithm parameters are configurable without code recompilation

**Testing:**
- NFR44: Core gameplay mechanics are unit testable
- NFR45: Food effects can be tested in isolation
- NFR46: Cross-browser compatibility can be validated through automated testing
