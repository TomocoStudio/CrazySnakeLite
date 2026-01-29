---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
status: 'complete'
completedAt: '2026-01-24'
inputDocuments:
  - '_bmad-output/planning-artifacts/prd.md'
  - '_bmad-output/planning-artifacts/architecture.md'
  - '_bmad-output/planning-artifacts/ux-design-specification.md'
  - '_bmad-output/project-context.md'
---

# CrazySnakeLite - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for CrazySnakeLite, decomposing the requirements from the PRD, UX Design if it exists, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**Core Gameplay (FR1-FR8)**
- FR1: Players can control snake movement in four cardinal directions (up, down, left, right)
- FR2: The snake automatically moves in the current direction at a consistent speed
- FR3: The snake grows in length when consuming ANY food type (+1 segment per food)
- FR4: The snake dies upon collision with walls (unless invincibility or wall-phase active)
- FR5: The snake dies upon collision with itself (unless invincibility active)
- FR6: Players can see the snake's current position and length on the game board
- FR7: The game board has defined boundaries that trigger death on collision (with exceptions)
- FR8: The game continues until the player's snake dies

**Food System (FR10-FR24)**
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

**Phone Call Interruption Mechanic (FR25-FR34)**
- FR25: Phone call UI uses Nokia-era phone screen aesthetic (black-on-grey, monochrome, simple)
- FR26: Phone call overlay covers full screen with blurry game visible in background
- FR27: Phone call overlay is centered on screen
- FR28: Phone call displays a random funny caller name and "End" button at bottom center
- FR29: Phone call interruptions occur at random intervals between 15-45 seconds
- FR30: The game continues running underneath the phone call overlay (CRITICAL)
- FR31: Phone call stays on screen until player dismisses it (does not auto-dismiss)
- FR32: Players dismiss phone calls by pressing Space bar on desktop
- FR33: Players dismiss phone calls by tapping "End" button on mobile
- FR34: Phone call overlay disappears immediately upon dismissal

**Session Flow (FR35-FR40)**
- FR35: Players can start a new game from the landing page
- FR36: Each game session begins with a snake of default starting length
- FR37: Game sessions end when the player's snake dies
- FR38: Players can see their final score upon death
- FR39: Players can restart immediately after death without navigation
- FR40: Game sessions are independent with no state persistence between sessions

**Scoring System (FR41-FR45)**
- FR41: ALL food types increase snake length by one segment when consumed
- FR42: Score equals snake length (simple, visual scoring)
- FR43: Players can see a small score counter during gameplay displaying current snake length
- FR44: Players can visually gauge their score by the snake's size on screen
- FR45: Final score (snake length at death) is displayed on the game over screen

**User Interface (FR46-FR72)**
- FR46: Game uses retro arcade 8-bit pixel art style (colorful, playful, fun mood)
- FR47: Game board has super light grey background with subtle light grey grid
- FR48: Game board border is a regular line with purple neon glow (matching wall-phase food color)
- FR49: Food items are simple geometric shapes in pixel style with distinct colors
- FR50: Snake uses classic blocky pixel segments
- FR51: Snake color matches the last food eaten (default: black)
- FR52: Snake blinks briefly when transitioning from one color to another (on eating new food)
- FR53: Invincibility effect displays as rapid strobe/blinking on the snake (yellow)
- FR54: Players can distinguish between different food types by color and shape
- FR55: The phone call overlay displays Nokia-era aesthetic (black-on-grey, monochrome)
- FR56: Score counter displays at top-center of the game board
- FR57: Active effects are indicated by snake color + movement sound only (no additional UI elements)
- FR58: UI elements use clear visual hierarchy for important information
- FR59: Main menu displays "New Game" and "Top Score" options
- FR60: "New Game" starts a new game session
- FR61: "Top Score" displays the player's best score stored in browser localStorage
- FR62: Post-MVP: Player accounts with database storage for scores
- FR63: Game over screen displays "GAME OVER!" title text
- FR64: Game over screen displays "Your score: XX" with final snake length
- FR65: Game over screen shows two options: "Play Again" and "Menu"
- FR66: "Play Again" is selected by default on game over screen
- FR67: "Play Again" starts a new game immediately
- FR68: "Menu" returns to main menu screen
- FR69: Enter key validates/selects the current menu choice
- FR70: Mouse click on buttons validates the choice
- FR71: Esc key cancels current action and opens the Menu screen
- FR72: Esc key during gameplay opens the Menu screen (pauses game)

**Input Controls (FR73-FR80)**
- FR73: Arrow keys control snake direction (Up, Down, Left, Right)
- FR74: Numpad controls snake direction (8=Up, 2=Down, 4=Left, 6=Right)
- FR75: WASD keys control snake direction for US keyboards (W=Up, S=Down, A=Left, D=Right)
- FR76: ZQSD keys control snake direction for French AZERTY keyboards (Z=Up, S=Down, Q=Left, D=Right)
- FR77: Swipe gestures control snake direction on mobile
- FR78: Space bar dismisses phone calls on desktop
- FR79: Tap on "End" button dismisses phone calls on mobile
- FR80: Input controls respond with minimal latency

**Sound Design (FR81-FR89)**
- FR81: Each snake movement step plays a sound based on current snake color/state
- FR82: Default state (black snake): Neutral "blip" - classic arcade step sound
- FR83: After Growing food (green snake): Pleasant, positive tone
- FR84: After Invincibility food (yellow snake): Powerful, strong tone
- FR85: After Wall-Phase food (purple snake): Ethereal, magical tone
- FR86: After Speed Boost food (red snake): Quick, energetic tone - higher pitch
- FR87: After Speed Decrease food (cyan snake): Slow, heavy tone - lower pitch, sluggish
- FR88: After Reverse Controls food (orange snake): Dissonant, off-kilter tone
- FR89: Game over screen plays 8-bit style short melody

**Platform Support (FR90-FR94)**
- FR90: The game runs in Chrome, Firefox, Safari, and Edge browsers
- FR91: The game supports desktop screen resolutions from 1024x768 and above
- FR92: The game adapts to mobile screen sizes with responsive layout
- FR93: Touch controls function on mobile browsers
- FR94: The game loads and becomes playable within 3 seconds

**Analytics & Tracking (FR95-FR99) - Deferred to Post-MVP**
- FR95: The system tracks game session starts
- FR96: The system tracks game session completions (deaths)
- FR97: The system tracks which food types are consumed
- FR98: The system tracks phone call dismissal response times
- FR99: The system tracks player return rate across sessions

### NonFunctional Requirements

**Performance (NFR1-NFR13)**
- NFR1: The game maintains 60 frames per second (FPS) during normal gameplay
- NFR2: The game maintains 60 FPS when phone call overlay is active with game running underneath
- NFR3: Frame rate does not drop below 55 FPS during food consumption or snake growth
- NFR4: Frame rate does not drop below 55 FPS when multiple food effects are active simultaneously
- NFR5: Initial page load completes within 3 seconds on broadband connections (5 Mbps+)
- NFR6: Game becomes playable (start button clickable) within 0.5 seconds after page load
- NFR7: No loading screens or delays during gameplay transitions
- NFR8: Input lag from keyboard/touch to snake direction change is less than 50 milliseconds
- NFR9: Phone call dismissal (Space/tap) removes overlay within 100 milliseconds
- NFR10: "PLAY AGAIN" button responds within 100 milliseconds and restarts game immediately
- NFR11: Client-side memory usage remains below 100 MB during gameplay
- NFR12: No memory leaks occur during extended play sessions (30+ minutes)
- NFR13: Garbage collection does not cause noticeable frame drops or stuttering

**Browser Compatibility (NFR14-NFR25)**
- NFR14: Game functions correctly on Chrome 90+ (desktop and mobile)
- NFR15: Game functions correctly on Firefox 88+ (desktop and mobile)
- NFR16: Game functions correctly on Safari 14+ (desktop and iOS)
- NFR17: Game functions correctly on Edge 90+ (desktop)
- NFR18: Visual appearance is consistent across all supported browsers (within 95% similarity)
- NFR19: Gameplay mechanics behave identically across all supported browsers
- NFR20: Performance targets (60 FPS, load time) are met across all supported browsers
- NFR21: Game is playable on desktop resolutions from 1024x768 up to 4K displays
- NFR22: Game scales appropriately to mobile screen sizes (320px to 768px width)
- NFR23: Touch controls function correctly on mobile browsers (iOS Safari, Chrome Mobile)
- NFR24: Unsupported browsers display clear message with browser recommendations
- NFR25: Older browsers that partially support features degrade gracefully without crashes

**Reliability (NFR26-NFR35)**
- NFR26: Game does not crash or freeze during normal gameplay
- NFR27: Game recovers gracefully from unexpected errors without losing current session
- NFR28: No game-breaking bugs that prevent core gameplay loop from functioning
- NFR29: Snake movement speed is consistent across different devices and browsers
- NFR30: Food effects trigger reliably 100% of the time when consumed
- NFR31: Collision detection is accurate and consistent (no false positives/negatives)
- NFR32: Phone call interruptions trigger consistently based on configured timing algorithm
- NFR33: Score calculations are accurate for all food types and scenarios
- NFR34: Analytics data is captured reliably without affecting gameplay performance
- NFR35: Game state remains consistent throughout a session (no state corruption)

**Usability (NFR36-NFR40)**
- NFR36: New players understand basic controls (arrow keys/swipe) without instructions within first 30 seconds
- NFR37: Food effect behaviors are clear from visual feedback alone (no text required)
- NFR38: Phone call dismissal mechanism is immediately obvious upon first occurrence
- NFR39: Rapid input changes (multiple quick key presses) do not cause erratic behavior
- NFR40: Game handles edge cases gracefully (snake length of 1, wall-phase wrap-around)

**Maintainability (NFR41-NFR46)**
- NFR41: Game logic is modular and separable from rendering logic
- NFR42: Food probability configuration is easily adjustable without code changes
- NFR43: Phone call timing algorithm parameters are configurable without code recompilation
- NFR44: Core gameplay mechanics are unit testable
- NFR45: Food effects can be tested in isolation
- NFR46: Cross-browser compatibility can be validated through automated testing

### Additional Requirements

**From Architecture:**

**Starter Template:**
- Plain HTML/JS/CSS (No Starter) - zero external dependencies
- Vanilla JavaScript (ES6+) with ES6 modules (`type="module"`)
- HTML5 Canvas for rendering
- Plain CSS (no preprocessor)
- No build tool - direct file serving

**Game Loop Architecture:**
- Fixed Timestep (125ms = 8 moves/second) + RequestAnimationFrame (60 FPS render)
- Delta time accumulated, logic ticks when threshold reached
- Separate render and update loops

**State Management:**
- Single state object with phase field ('menu' | 'playing' | 'gameover')
- gameState holds: snake, food, activeEffect, score, highScore, phoneCall
- Easy to reset on "Play Again"

**Phone Overlay Implementation:**
- DOM elements with CSS styling (not canvas-rendered)
- CSS `filter: blur()` on game canvas during phone call
- Game continues running during overlay (critical)

**Input Handling:**
- Input abstraction layer supporting 4 keyboard layouts + touch
- Arrow, WASD, ZQSD (French), Numpad mappings
- Touch swipe for mobile direction control

**Project Structure (13 modules):**
- main.js (entry point), config.js (parameters), state.js (game state)
- game.js (game loop), snake.js (movement/growth), food.js (spawning/types)
- collision.js (wall/self/food), effects.js (apply/clear effects)
- phone.js (overlay control), input.js (keyboard/touch abstraction)
- render.js (canvas rendering), audio.js (sound system), storage.js (localStorage)

**Module Boundaries:**
- State access only through passed gameState parameter
- DOM access only in main.js (setup), render.js (canvas), phone.js (overlay)
- All tunable values in config.js (no magic numbers)
- Named exports only (no default exports)

**Deployment:**
- Static site hosting (GitHub Pages, Netlify, Vercel)
- Single deployable artifact (HTML + JS + CSS)
- Zero server dependencies

**From UX Design:**

**Visual Clarity Requirements:**
- Six food types must be instantly recognizable within 100-200ms visual scan
- Color + shape/icon system must work at small sizes, in motion, under partial occlusion
- Snake visual changes based on consumed food (snake as living status indicator)
- Food appearance → snake appearance relationship must be learnable through play

**Phone Call UX:**
- Interruptions must create tension without frustration
- "Game continues running during interruption" needs crystal-clear visual feedback
- Phone overlay must be obvious enough to demand attention but show game state underneath
- Transparency/blur to show maintained game state

**Learning Through Play:**
- No tutorial in MVP - food effects must be immediately understandable from visual feedback
- Snake appearance changes teach players what effect is active
- First 30 seconds critical for understanding (food types differ, phone calls happen)

**Design Principles:**
- Retro pixel art as clarity tool (forces simple, recognizable shapes)
- Limited color palette creates stronger visual distinction
- Progressive chaos discovery (cautious → experimental → tactical)
- Snake as living status display eliminates need for traditional HUD

**From Project Context:**

**Critical Data Formats:**
- Positions: ALWAYS use { x, y } objects
- Colors: ALWAYS use hex strings
- Time: ALWAYS use milliseconds
- Directions: ALWAYS use string literals ('up', 'down', 'left', 'right')

**Effect Duration Rule:**
- ALL timed effects end when NEXT food is eaten (not time-based)

### FR Coverage Map

**Epic 1: Playable Snake Foundation**
- FR1: Epic 1 - Snake movement in four directions
- FR2: Epic 1 - Snake automatic movement
- FR3: Epic 1 - Snake grows when eating food
- FR4: Epic 1 - Snake dies on wall collision
- FR5: Epic 1 - Snake dies on self collision
- FR6: Epic 1 - Snake position visible on board
- FR7: Epic 1 - Game board boundaries
- FR8: Epic 1 - Game continues until death
- FR10: Epic 1 - Food spawns randomly
- FR11: Epic 1 - Food consumed on collision
- FR12: Epic 1 - Growing food increases length
- FR21: Epic 1 - Food has distinct visual appearance
- FR23: Epic 1 - One food at a time
- FR24: Epic 1 - New food spawns after consumption
- FR35: Epic 1 - Start new game from landing
- FR36: Epic 1 - Default starting length
- FR37: Epic 1 - Session ends on death
- FR38: Epic 1 - Final score visible on death
- FR39: Epic 1 - Restart without navigation
- FR40: Epic 1 - Independent sessions
- FR46: Epic 1 - Retro pixel art style
- FR47: Epic 1 - Light grey background with grid
- FR48: Epic 1 - Purple glow border
- FR49: Epic 1 - Pixel style food shapes
- FR50: Epic 1 - Blocky pixel snake segments
- FR54: Epic 1 - Distinguish food types by color/shape
- FR73: Epic 1 - Arrow key controls
- FR74: Epic 1 - Numpad controls
- FR75: Epic 1 - WASD controls
- FR76: Epic 1 - ZQSD controls (French)
- FR77: Epic 1 - Mobile swipe controls
- FR80: Epic 1 - Minimal input latency
- FR90: Epic 1 - Cross-browser support
- FR91: Epic 1 - Desktop resolution support
- FR92: Epic 1 - Mobile responsive
- FR93: Epic 1 - Touch controls on mobile
- FR94: Epic 1 - Load within 3 seconds

**Epic 2: Chaos Food Effects**
- FR13: Epic 2 - Invincibility food effect
- FR14: Epic 2 - Invincibility strobe visual
- FR15: Epic 2 - Wall-Phase food effect
- FR16: Epic 2 - Wall-Phase single use
- FR17: Epic 2 - Speed Boost food effect
- FR18: Epic 2 - Speed Decrease food effect
- FR19: Epic 2 - Reverse Control food effect
- FR20: Epic 2 - Effects end on next food
- FR22: Epic 2 - Probability-based spawning
- FR51: Epic 2 - Snake color matches food
- FR52: Epic 2 - Snake blinks on color change
- FR53: Epic 2 - Invincibility strobe on snake
- FR57: Epic 2 - Effects indicated by color + sound

**Epic 3: Phone Call Interruption**
- FR25: Epic 3 - Nokia-era phone aesthetic
- FR26: Epic 3 - Full screen overlay with blur
- FR27: Epic 3 - Centered overlay
- FR28: Epic 3 - Random funny caller names
- FR29: Epic 3 - Random intervals (15-45s)
- FR30: Epic 3 - Game continues during overlay
- FR31: Epic 3 - Phone stays until dismissed
- FR32: Epic 3 - Space bar dismisses (desktop)
- FR33: Epic 3 - End button dismisses (mobile)
- FR34: Epic 3 - Immediate overlay removal
- FR55: Epic 3 - Nokia aesthetic for overlay
- FR78: Epic 3 - Space bar dismiss control
- FR79: Epic 3 - Tap End button control

**Epic 4: Audio & Complete Experience**
- FR41: Epic 4 - All food increases length
- FR42: Epic 4 - Score equals snake length
- FR43: Epic 4 - Score counter during gameplay
- FR44: Epic 4 - Visual score gauge by snake size
- FR45: Epic 4 - Final score on game over
- FR56: Epic 4 - Score at top-center
- FR58: Epic 4 - Clear visual hierarchy
- FR59: Epic 4 - Main menu options
- FR60: Epic 4 - New Game starts session
- FR61: Epic 4 - Top Score from localStorage
- FR62: Epic 4 - Post-MVP database storage
- FR63: Epic 4 - Game over title text
- FR64: Epic 4 - Score display on game over
- FR65: Epic 4 - Play Again and Menu options
- FR66: Epic 4 - Play Again default selected
- FR67: Epic 4 - Play Again restarts immediately
- FR68: Epic 4 - Menu returns to main menu
- FR69: Epic 4 - Enter validates menu choice
- FR70: Epic 4 - Mouse click validates choice
- FR71: Epic 4 - Esc opens Menu screen
- FR72: Epic 4 - Esc pauses gameplay
- FR81: Epic 4 - Movement sound per state
- FR82: Epic 4 - Default neutral blip
- FR83: Epic 4 - Growing food pleasant tone
- FR84: Epic 4 - Invincibility powerful tone
- FR85: Epic 4 - Wall-Phase ethereal tone
- FR86: Epic 4 - Speed Boost energetic tone
- FR87: Epic 4 - Speed Decrease sluggish tone
- FR88: Epic 4 - Reverse Controls dissonant tone
- FR89: Epic 4 - Game over melody

**Post-MVP: Analytics & Tracking**
- FR95: Post-MVP - Track session starts
- FR96: Post-MVP - Track session completions
- FR97: Post-MVP - Track food consumption
- FR98: Post-MVP - Track phone dismiss times
- FR99: Post-MVP - Track return rate

## Epic List

### Epic 1: Playable Snake Foundation
Players can play a basic Snake game - moving the snake, eating food to grow, dying on collision, and immediately restarting. This delivers the core gameplay loop for break-time entertainment.

**FRs covered:** FR1-FR8, FR10-FR12, FR21, FR23-FR24, FR35-FR40, FR46-FR50, FR54, FR73-FR77, FR80, FR90-FR94

### Epic 2: Chaos Food Effects
Players experience the strategic chaos through 5 additional food types with unique effects - invincibility, wall-phase, speed boost, speed decrease, and reverse controls. This is the core innovation that makes CrazySnakeLite different from regular Snake.

**FRs covered:** FR13-FR20, FR22, FR51-FR53, FR57

### Epic 3: Phone Call Interruption
Players experience the signature phone call mechanic - random interruptions where the game continues running underneath, creating tension and split-attention gameplay. The innovative mechanic that creates shareable moments.

**FRs covered:** FR25-FR34, FR55, FR78-FR79

### Epic 4: Audio & Complete Experience
Players enjoy the complete polished game with retro 8-bit sound effects, proper menus, score tracking, and high score persistence. This transforms the prototype into a finished product worth sharing.

**FRs covered:** FR41-FR45, FR56, FR58-FR72, FR81-FR89

---

## Epic 1: Playable Snake Foundation

Players can play a basic Snake game - moving the snake, eating food to grow, dying on collision, and immediately restarting. This delivers the core gameplay loop for break-time entertainment.

### Story 1.1: Project Setup and Game Canvas

**As a** player,
**I want** the game to load quickly in my browser,
**So that** I can start playing without waiting.

**Acceptance Criteria:**

**Given** a user navigates to the game URL
**When** the page loads
**Then** the browser displays a game container with a canvas element
**And** the canvas has a light grey background (#E8E8E8) with subtle grid lines
**And** the canvas has a purple neon glow border
**And** the page loads within 3 seconds on broadband connections
**And** the game works in Chrome 90+, Firefox 88+, Safari 14+, and Edge 90+

**Technical Notes:**
- Create project structure per Architecture: index.html, css/style.css, js/ modules
- Implement config.js with all game parameters (grid 25x20, unit size 10px)
- Canvas renders at 250x200 pixels (scales with unit size)
- Use ES6 modules with `type="module"`

**FRs:** FR46-FR48, FR90-FR94

---

### Story 1.2: Game Loop and Snake Rendering

**As a** player,
**I want** to see a snake on the game board,
**So that** I know the game is ready to play.

**Acceptance Criteria:**

**Given** the game canvas is loaded
**When** the game initializes
**Then** a snake appears in the bottom-left area of the grid
**And** the snake has 5 segments rendered as black blocky pixels
**And** the snake head is visually distinguishable from body segments
**And** the game maintains 60 FPS rendering
**And** the game loop uses fixed timestep (125ms) for logic updates

**Technical Notes:**
- Implement state.js with createInitialState() function
- Implement game.js with RAF loop + fixed timestep accumulator
- Implement render.js with renderSnake() and renderGrid()
- Snake starts at bottom-left, facing right

**FRs:** FR6, FR50

---

### Story 1.3: Snake Movement and Input Controls

**As a** player,
**I want** to control the snake's direction using my keyboard or touch,
**So that** I can navigate the snake around the board.

**Acceptance Criteria:**

**Given** the game is running
**When** the player presses an arrow key (Up/Down/Left/Right)
**Then** the snake changes direction accordingly
**And** the snake moves automatically at 8 moves per second

**Given** the game is running
**When** the player presses WASD keys
**Then** the snake changes direction (W=Up, A=Left, S=Down, D=Right)

**Given** the game is running
**When** the player presses ZQSD keys (French layout)
**Then** the snake changes direction (Z=Up, Q=Left, S=Down, D=Right)

**Given** the game is running
**When** the player presses Numpad keys
**Then** the snake changes direction (8=Up, 4=Left, 2=Down, 6=Right)

**Given** the game is running on mobile
**When** the player swipes in a direction
**Then** the snake changes to that direction

**Given** the player presses a direction key
**When** the input is processed
**Then** the snake responds within 50ms

**Given** the snake is moving right
**When** the player presses left (opposite direction)
**Then** the input is ignored (snake cannot reverse into itself)

**Technical Notes:**
- Implement input.js with keyboard and touch abstractions
- Implement snake.js with moveSnake() function
- Use nextDirection to queue direction changes between ticks

**FRs:** FR1, FR2, FR73-FR77, FR80

---

### Story 1.4: Basic Food System

**As a** player,
**I want** to eat food to grow my snake,
**So that** I can increase my score and length.

**Acceptance Criteria:**

**Given** the game starts
**When** the snake is rendered
**Then** one food item appears at a random empty grid position
**And** the food is a green filled square (5x5 pixels)
**And** the food is visually distinct from the snake

**Given** the snake is moving
**When** the snake's head occupies the same position as the food
**Then** the food is consumed
**And** the snake grows by one segment
**And** a new food item spawns immediately at a random empty position

**Given** food needs to spawn
**When** calculating spawn position
**Then** the food never spawns on a position occupied by the snake

**Given** the game is running
**When** checking food state
**Then** only one food item exists on the board at a time

**Technical Notes:**
- Implement food.js with spawnFood() and checkFoodCollision()
- Implement collision.js with checkFoodCollision()
- Food spawns on valid empty grid cells only

**FRs:** FR3, FR10-FR12, FR21, FR23-FR24, FR49, FR54

---

### Story 1.5: Collision Detection and Death

**As a** player,
**I want** the game to end when I crash,
**So that** I understand the game's challenge and boundaries.

**Acceptance Criteria:**

**Given** the snake is moving
**When** the snake's head hits any wall boundary
**Then** the snake dies
**And** the game transitions to 'gameover' phase

**Given** the snake is moving
**When** the snake's head collides with any of its own body segments
**Then** the snake dies
**And** the game transitions to 'gameover' phase

**Given** the snake dies
**When** the game over state is triggered
**Then** the game loop continues running (for future overlay support)
**And** the snake stops moving
**And** no further input affects snake movement

**Given** the game board is rendered
**When** viewing the boundaries
**Then** the walls are clearly visible with the purple glow border

**Technical Notes:**
- Implement collision.js with checkWallCollision() and checkSelfCollision()
- Update game.js to handle phase transitions
- Death triggers phase change to 'gameover'

**FRs:** FR4, FR5, FR7, FR8, FR37

---

### Story 1.6: Session Flow and Restart

**As a** player,
**I want** to see my score and restart immediately after dying,
**So that** I can try again without friction.

**Acceptance Criteria:**

**Given** the snake has died
**When** the game over screen appears
**Then** "GAME OVER!" text is displayed prominently
**And** the final score (snake length) is displayed
**And** "Play Again" button is visible and selected by default
**And** the game over screen uses retro pixel art styling

**Given** the game over screen is displayed
**When** the player clicks "Play Again" or presses Enter
**Then** a new game starts immediately
**And** the snake resets to starting position (bottom-left, 5 segments)
**And** new food spawns
**And** the score resets

**Given** the game over screen is displayed
**When** the player presses Enter
**Then** the default selected option ("Play Again") is activated

**Given** the game is in any state
**When** checking session persistence
**Then** each game session is independent with no state carried over

**Technical Notes:**
- Implement game over screen in index.html (DOM element)
- Update state.js with resetGame() function
- Handle Enter key for menu selection

**FRs:** FR35-FR40, FR63-FR67

---

## Epic 2: Chaos Food Effects

Players experience the strategic chaos through 5 additional food types with unique effects - invincibility, wall-phase, speed boost, speed decrease, and reverse controls. This is the core innovation that makes CrazySnakeLite different from regular Snake.

### Story 2.1: Effect System Foundation

**As a** player,
**I want** food effects to apply immediately and last until I eat the next food,
**So that** I can strategically plan which foods to pursue.

**Acceptance Criteria:**

**Given** the snake eats any special food (not growing)
**When** the food is consumed
**Then** the effect is applied immediately
**And** the effect is stored in gameState.activeEffect

**Given** the snake has an active effect
**When** the snake eats any food (including growing)
**Then** the previous effect is cleared immediately
**And** the new effect (if any) is applied

**Given** the snake has an active effect
**When** checking the effect state
**Then** the effect type is accessible for collision, movement, and rendering logic

**Given** the effects system is implemented
**When** multiple games are played
**Then** effects trigger reliably 100% of the time when the corresponding food is consumed

**Technical Notes:**
- Implement effects.js with applyEffect(), clearEffect(), isEffectActive()
- activeEffect structure: `{ type: 'invincibility' }` or `null`
- Update game.js to clear effect before applying new one on food consumption
- Effect types: 'invincibility', 'wallPhase', 'speedBoost', 'speedDecrease', 'reverseControls'

**FRs:** FR20

---

### Story 2.2: Invincibility Food

**As a** player,
**I want** to eat yellow food and become temporarily invincible,
**So that** I can survive risky situations and play aggressively.

**Acceptance Criteria:**

**Given** yellow star-shaped food appears on the board
**When** the snake's head occupies the food position
**Then** the snake grows by one segment
**And** the invincibility effect is applied
**And** the snake displays a rapid strobe/blinking yellow visual

**Given** the snake has invincibility active
**When** the snake's head hits a wall
**Then** the snake does NOT die
**And** the snake bounces off or stops at the wall boundary

**Given** the snake has invincibility active
**When** the snake's head collides with its own body
**Then** the snake does NOT die
**And** gameplay continues normally

**Given** the snake has invincibility active
**When** the snake eats any other food
**Then** the invincibility effect ends immediately
**And** the strobe visual stops
**And** normal collision rules apply again

**Given** the invincibility strobe is active
**When** rendering the snake
**Then** the snake rapidly alternates between yellow and its base color
**And** the strobe rate is visually clear as a "power-up" indicator

**Technical Notes:**
- Yellow food shape: 4-point star
- Strobe effect: alternate colors every few frames (e.g., every 100ms)
- Update collision.js to check for invincibility before triggering death

**FRs:** FR13, FR14, FR53

---

### Story 2.3: Wall-Phase Food

**As a** player,
**I want** to eat purple food and phase through one wall,
**So that** I can escape tight corners or take shortcuts.

**Acceptance Criteria:**

**Given** purple ring/donut-shaped food appears on the board
**When** the snake's head occupies the food position
**Then** the snake grows by one segment
**And** the wall-phase effect is applied
**And** the snake turns purple

**Given** the snake has wall-phase active
**When** the snake's head moves past a wall boundary
**Then** the snake passes through the wall
**And** the snake head appears on the opposite side of the board
**And** the wall-phase effect is consumed (single-use)

**Given** the snake has wall-phase active
**When** the snake eats another food before hitting a wall
**Then** the wall-phase effect is cleared (unused)
**And** the new food's effect (if any) is applied

**Given** wall-phase is triggered
**When** the snake passes through the wall
**Then** only the head wraps; body segments follow naturally through subsequent moves

**Given** the snake is phasing through a wall
**When** checking self-collision
**Then** normal self-collision rules still apply (wall-phase doesn't grant self-immunity)

**Technical Notes:**
- Purple food shape: ring/donut (hollow circle)
- Wall-phase is single-use: consumed on wall pass OR cleared on next food
- Wrap logic: if head.x < 0, head.x = GRID_WIDTH - 1 (and vice versa for all edges)

**FRs:** FR15, FR16

---

### Story 2.4: Speed Modifier Foods

**As a** player,
**I want** speed-changing foods to make the game more chaotic,
**So that** I experience varied gameplay intensity.

**Acceptance Criteria:**

**Given** red cross/plus-shaped food appears on the board
**When** the snake's head occupies the food position
**Then** the snake grows by one segment
**And** the speed boost effect is applied
**And** the snake turns red
**And** the snake moves faster (1.5x to 2x base speed, randomly selected)

**Given** cyan hollow square food appears on the board
**When** the snake's head occupies the food position
**Then** the snake grows by one segment
**And** the speed decrease effect is applied
**And** the snake turns cyan
**And** the snake moves slower (0.3x to 0.5x base speed, randomly selected)

**Given** the snake has speed boost active
**When** the game loop processes movement
**Then** the tick rate is reduced (snake moves more frequently)
**And** 60 FPS rendering is maintained

**Given** the snake has speed decrease active
**When** the game loop processes movement
**Then** the tick rate is increased (snake moves less frequently)
**And** the player waits noticeably longer between moves

**Given** the snake has any speed modifier active
**When** the snake eats any other food
**Then** the speed returns to normal (8 moves per second)
**And** the new food's effect (if any) is applied

**Technical Notes:**
- Red food shape: cross/plus (+)
- Cyan food shape: hollow square (outline only)
- Speed boost multiplier: random between 1.5x and 2.0x (from config.js)
- Speed decrease multiplier: random between 0.3x and 0.5x (from config.js)
- Modify TICK_RATE dynamically based on active effect

**FRs:** FR17, FR18

---

### Story 2.5: Reverse Controls Food

**As a** player,
**I want** orange food to invert my controls temporarily,
**So that** I experience chaotic, challenging gameplay.

**Acceptance Criteria:**

**Given** orange X-shaped food appears on the board
**When** the snake's head occupies the food position
**Then** the snake grows by one segment
**And** the reverse controls effect is applied
**And** the snake turns orange

**Given** the snake has reverse controls active
**When** the player presses Up (or W/Z/8)
**Then** the snake moves Down

**Given** the snake has reverse controls active
**When** the player presses Down (or S/2)
**Then** the snake moves Up

**Given** the snake has reverse controls active
**When** the player presses Left (or A/Q/4)
**Then** the snake moves Right

**Given** the snake has reverse controls active
**When** the player presses Right (or D/6)
**Then** the snake moves Left

**Given** the snake has reverse controls active on mobile
**When** the player swipes in a direction
**Then** the snake moves in the opposite direction

**Given** the snake has reverse controls active
**When** the snake eats any other food
**Then** controls return to normal
**And** the new food's effect (if any) is applied

**Technical Notes:**
- Orange food shape: X shape (diagonal cross)
- Inversion logic in input.js: if reverseControls active, flip direction before applying
- The "can't reverse into yourself" rule still applies to the INTENDED direction

**FRs:** FR19

---

### Story 2.6: Probability-Based Spawning and Snake Visuals

**As a** player,
**I want** different foods to appear with varying frequencies and see my snake change color,
**So that** I can learn which effects are active and experience varied gameplay.

**Acceptance Criteria:**

**Given** food needs to spawn
**When** the food type is selected
**Then** the type is chosen based on configurable probability distribution
**And** probabilities are: Growing 40%, Invincibility 10%, Wall-Phase 10%, Speed Boost 15%, Speed Decrease 15%, Reverse Controls 10%

**Given** the probability configuration exists
**When** developers need to tune gameplay balance
**Then** all probabilities are defined in config.js
**And** probabilities can be changed without code modifications

**Given** the snake eats any food
**When** the food is consumed
**Then** the snake color changes to match the food type eaten
**And** the snake briefly blinks during the color transition

**Given** the snake changes color
**When** rendering the snake
**Then** the snake displays in the new color: black (default), green (growing), yellow (invincibility), purple (wall-phase), red (speed boost), cyan (speed decrease), orange (reverse controls)

**Given** the snake has no active effect
**When** checking the snake color
**Then** the snake maintains the color of the last food eaten (not default black)

**Given** any special food type
**When** rendering the food
**Then** each food type has a distinct shape AND color for clear identification

**Technical Notes:**
- Update food.js with selectFoodType() using weighted random selection
- Food visual shapes: green=filled square, yellow=4-point star, purple=ring, red=cross, cyan=hollow square, orange=X
- Snake color persists until next food is eaten
- Blink effect: brief flash (100-200ms) on color change

**FRs:** FR22, FR51, FR52, FR54, FR57

---

## Epic 3: Phone Call Interruption

Players experience the signature phone call mechanic - random interruptions where the game continues running underneath, creating tension and split-attention gameplay. The innovative mechanic that creates shareable moments.

### Story 3.1: Phone Call Overlay UI

**As a** player,
**I want** a retro phone call overlay that looks like an old Nokia screen,
**So that** I feel the nostalgic connection to classic Snake's origins.

**Acceptance Criteria:**

**Given** a phone call is triggered
**When** the overlay appears
**Then** the phone UI displays with Nokia-era aesthetic (black-on-grey, monochrome)
**And** the overlay is centered on the screen
**And** the overlay covers the full screen area

**Given** the phone overlay is displayed
**When** looking at the game underneath
**Then** the game canvas is visible but blurred (CSS filter: blur)
**And** the player can sense the game is still running underneath

**Given** the phone overlay structure
**When** rendering the UI
**Then** a caller name is displayed prominently
**And** an "End" button is displayed at the bottom center
**And** the overall design resembles a classic Nokia phone screen

**Given** the phone overlay is active
**When** checking visual hierarchy
**Then** the phone UI is clearly in the foreground
**And** the blur effect makes the game visible but not fully readable
**And** the "End" button is large enough for easy tapping on mobile

**Given** the phone overlay CSS
**When** styling is applied
**Then** the overlay uses monochrome colors (black text on grey background)
**And** fonts are simple/pixelated to match retro aesthetic
**And** the design is simple and clean like original Nokia UI

**Technical Notes:**
- Implement phone overlay as DOM elements in index.html (not canvas-rendered)
- Use CSS `filter: blur(4px)` or similar on game canvas when overlay active
- Phone overlay structure: container > phone-screen > caller-name + end-button
- Style in style.css with Nokia-era aesthetic

**FRs:** FR25, FR26, FR27, FR55

---

### Story 3.2: Phone Call Timing and Caller System

**As a** player,
**I want** random phone calls with funny caller names while the game keeps running,
**So that** I experience tension and split-attention gameplay.

**Acceptance Criteria:**

**Given** the game is in 'playing' phase
**When** the phone call timer elapses
**Then** a phone call overlay appears
**And** the game continues running underneath at 60 FPS
**And** the snake keeps moving in its current direction

**Given** a phone call needs to be scheduled
**When** calculating the next call time
**Then** the interval is randomly selected between 15 and 45 seconds
**And** timing parameters are configurable in config.js

**Given** a phone call is triggered
**When** selecting a caller name
**Then** a random name is chosen from the curated funny names pool
**And** names include categories: Family ("Mom", "Dad", "Grandma", "Your Ex"), Work ("Boss", "HR Department"), Spam ("Spam Likely", "Extended Warranty", "Nigerian Prince"), Absurd ("Your Conscience", "The Void", "Anxiety"), Meta ("Snake Headquarters", "Game Over (calling early)")

**Given** the phone call overlay is displayed
**When** the game loop runs
**Then** the snake continues moving at its current speed
**And** food effects continue to apply
**And** collision detection continues to function
**And** the player can potentially die while the phone is displayed

**Given** a phone call is active
**When** checking game state
**Then** gameState.phoneCall.active is true
**And** gameState.phoneCall.caller contains the selected name

**Given** the phone call stays on screen
**When** the player does not dismiss it
**Then** the overlay remains visible indefinitely
**And** the game continues running underneath until death or dismissal

**Technical Notes:**
- Implement phone.js with scheduleNextCall(), showPhoneCall(), CALLERS array
- Store nextCallTime in gameState.phoneCall.nextCallTime
- Check timer in game.js update loop: if currentTime >= nextCallTime, trigger call
- Game loop must NOT pause when phone is active - this is CRITICAL

**FRs:** FR28, FR29, FR30, FR31

---

### Story 3.3: Phone Call Dismissal Controls

**As a** player,
**I want** to quickly dismiss phone calls with Space bar or tapping End,
**So that** I can return focus to the game before I crash.

**Acceptance Criteria:**

**Given** the phone call overlay is displayed on desktop
**When** the player presses the Space bar
**Then** the phone call overlay disappears immediately
**And** the blur effect on the game canvas is removed
**And** the game continues normally without interruption

**Given** the phone call overlay is displayed on mobile
**When** the player taps the "End" button
**Then** the phone call overlay disappears immediately
**And** the blur effect on the game canvas is removed
**And** the game continues normally without interruption

**Given** the player dismisses a phone call
**When** measuring response time
**Then** the overlay is removed within 100 milliseconds

**Given** a phone call is dismissed
**When** scheduling the next call
**Then** a new random interval (15-45 seconds) is calculated
**And** the timer begins counting from the dismissal moment

**Given** the phone call overlay is active
**When** the player presses any movement key (arrows, WASD, etc.)
**Then** the snake direction changes as normal (game is still running)
**And** the phone call is NOT dismissed by movement keys

**Given** the phone call is dismissed
**When** checking game state
**Then** gameState.phoneCall.active is set to false
**And** gameState.phoneCall.caller is cleared
**And** the game canvas blur is removed

**Given** the player dies while phone call is active
**When** the game transitions to 'gameover' phase
**Then** the phone call overlay is automatically dismissed
**And** the game over screen is displayed normally

**Technical Notes:**
- Implement dismissPhoneCall() in phone.js
- Add Space bar handling to input.js (only when phone active)
- Add click handler to End button in phone.js
- Remove blur by toggling CSS class on game canvas
- Schedule next call immediately after dismissal

**FRs:** FR32, FR33, FR34, FR78, FR79

---

## Epic 4: Audio & Complete Experience

Players enjoy the complete polished game with retro 8-bit sound effects, proper menus, score tracking, and high score persistence. This transforms the prototype into a finished product worth sharing.

### Story 4.1: Score System and Display

**As a** player,
**I want** to see my current score during gameplay,
**So that** I can track my progress and aim for a higher score.

**Acceptance Criteria:**

**Given** the game is in 'playing' phase
**When** viewing the game screen
**Then** a score counter is displayed at the top-center of the game board
**And** the score displays the current snake length

**Given** the snake eats any food type
**When** the food is consumed
**Then** the snake grows by one segment
**And** the score counter increments by 1 immediately

**Given** the game is running
**When** checking the score calculation
**Then** score always equals the current snake length
**And** starting score equals starting snake length (5)

**Given** the score display is rendered
**When** viewing the UI
**Then** the score is clearly visible without obstructing gameplay
**And** the score uses retro pixel art styling consistent with the game
**And** the score has clear visual hierarchy (readable at a glance)

**Given** the player can see the snake
**When** gauging their progress visually
**Then** the snake's size on screen provides a visual representation of the score

**Technical Notes:**
- Add score-display element to index.html
- Update score in gameState on every food consumption
- Style score counter in style.css with retro aesthetic
- Position at top-center of game container

**FRs:** FR41, FR42, FR43, FR44, FR56, FR58

---

### Story 4.2: Main Menu Screen

**As a** player,
**I want** a main menu with game options,
**So that** I can start a new game or view my best score.

**Acceptance Criteria:**

**Given** the game loads initially
**When** the page finishes loading
**Then** the main menu screen is displayed
**And** the game title "CrazySnakeLite" is prominently shown
**And** "New Game" option is visible
**And** "Top Score" option is visible

**Given** the main menu is displayed
**When** the player clicks "New Game"
**Then** a new game session starts immediately
**And** the menu screen is hidden
**And** the game transitions to 'playing' phase

**Given** the main menu is displayed
**When** the player clicks "Top Score"
**Then** the player's best score is displayed
**And** the score is retrieved from browser localStorage

**Given** no previous games have been played
**When** viewing "Top Score"
**Then** a default value of 0 or "No score yet" is displayed

**Given** a player completes a game with a new high score
**When** the game ends
**Then** the new high score is saved to localStorage
**And** it persists across browser sessions

**Given** the main menu screen
**When** viewing the design
**Then** the menu uses retro pixel art styling
**And** buttons are clearly clickable/tappable
**And** the layout works on both desktop and mobile screens

**Technical Notes:**
- Implement menu-screen element in index.html
- Implement storage.js with loadHighScore() and saveHighScore()
- Use localStorage key like 'crazysnakeLite_highScore'
- Update gameState.highScore on game start from localStorage

**FRs:** FR59, FR60, FR61

---

### Story 4.3: Game Over Screen Enhancement

**As a** player,
**I want** clear options after dying,
**So that** I can quickly restart or return to the menu.

**Acceptance Criteria:**

**Given** the snake dies
**When** the game over screen appears
**Then** "GAME OVER!" title text is displayed prominently
**And** "Your score: XX" shows the final snake length
**And** "Play Again" button is visible
**And** "Menu" button is visible

**Given** the game over screen is displayed
**When** checking the default selection
**Then** "Play Again" is selected/highlighted by default
**And** visual indication shows which option is selected

**Given** the game over screen is displayed
**When** the player clicks "Play Again"
**Then** a new game starts immediately (within 100ms)
**And** the snake resets to starting position and length
**And** score resets to starting value (5)

**Given** the game over screen is displayed
**When** the player clicks "Menu"
**Then** the main menu screen is displayed
**And** the game transitions to 'menu' phase

**Given** the player achieved a new high score
**When** the game over screen appears
**Then** the new high score is saved to localStorage
**And** optionally, a "New High Score!" indicator is shown

**Given** the game over screen
**When** viewing the design
**Then** the screen uses retro pixel art styling
**And** the final score is clearly readable
**And** buttons are appropriately sized for both desktop and mobile

**Technical Notes:**
- Enhance gameover-screen element in index.html
- Add visual selection state for buttons (CSS class 'selected')
- Compare final score to highScore and save if higher
- Ensure Play Again responds within 100ms (NFR10)

**FRs:** FR45, FR63, FR64, FR65, FR66, FR67, FR68

---

### Story 4.4: Menu Navigation and Pause

**As a** player,
**I want** to navigate menus with keyboard and pause during gameplay,
**So that** I have full control over my gaming experience.

**Acceptance Criteria:**

**Given** any menu screen is displayed (main menu or game over)
**When** the player presses Enter
**Then** the currently selected option is activated
**And** the appropriate action is taken (start game, restart, go to menu)

**Given** any menu screen is displayed
**When** the player clicks a button with the mouse
**Then** that option is activated immediately
**And** the appropriate action is taken

**Given** the game is in 'playing' phase
**When** the player presses Esc
**Then** the game pauses
**And** the main menu screen is displayed
**And** the game state is preserved (not reset)

**Given** the game is paused (menu shown during gameplay)
**When** the player clicks "New Game"
**Then** the current game is abandoned
**And** a fresh new game starts

**Given** the game over screen is displayed
**When** the player presses Esc
**Then** the main menu screen is displayed

**Given** arrow keys are pressed on a menu screen
**When** multiple options are available
**Then** the selection moves between options (up/down)
**And** visual indication updates to show current selection

**Given** the main menu is displayed during a paused game
**When** checking game state
**Then** the previous game state can be resumed or discarded based on user choice

**Technical Notes:**
- Add Enter key handling to input.js for menu validation
- Add Esc key handling to input.js for pause/menu
- Track 'paused' state or handle via phase transitions
- Arrow keys on menus change selected option index

**FRs:** FR69, FR70, FR71, FR72

---

### Story 4.5: State-Based Movement Sounds

**As a** player,
**I want** to hear different sounds as my snake moves based on its current state,
**So that** I have audio feedback reinforcing the visual effects.

**Acceptance Criteria:**

**Given** the snake is in default state (black)
**When** the snake moves one step
**Then** a neutral "blip" sound plays (classic arcade step sound)

**Given** the snake just ate growing food (green)
**When** the snake moves one step
**Then** a pleasant, positive tone plays

**Given** the snake has invincibility active (yellow)
**When** the snake moves one step
**Then** a powerful, strong tone plays

**Given** the snake has wall-phase active (purple)
**When** the snake moves one step
**Then** an ethereal, magical tone plays

**Given** the snake has speed boost active (red)
**When** the snake moves one step
**Then** a quick, energetic high-pitch tone plays

**Given** the snake has speed decrease active (cyan)
**When** the snake moves one step
**Then** a slow, heavy low-pitch tone plays

**Given** the snake has reverse controls active (orange)
**When** the snake moves one step
**Then** a dissonant, off-kilter tone plays

**Given** the audio system is initialized
**When** the first user interaction occurs
**Then** audio is enabled (respecting browser autoplay policies)

**Given** sounds are playing
**When** the game is running at any speed
**Then** sounds play at each movement step without causing lag
**And** 60 FPS is maintained

**Technical Notes:**
- Implement audio.js with Web Audio API (AudioContext + AudioBufferSourceNode)
- 14 alternating MP3 sound files in assets/sounds/ (7 states × 2 sounds each)
- Sound files: move-{state}-1.mp3 & move-{state}-2.mp3 for each state
- States: default, growing, invicibility, wallphase, speedboost, speeddecrease, reverse
- Sound playback DECOUPLED from while accumulator loop (once per frame, not per tick)
- Handle browser autoplay restrictions with AudioContext resume on user interaction
- **Decision:** Web Audio API required (HTML5 Audio causes freezes at 8 sounds/second)

**FRs:** FR81, FR82, FR83, FR84, FR85, FR86, FR87, FR88

---

### Story 4.6: Game Over Melody

**As a** player,
**I want** to hear a retro melody when I die,
**So that** the game over moment feels complete and memorable.

**Acceptance Criteria:**

**Given** the snake dies
**When** the game over screen appears
**Then** an 8-bit style short melody plays
**And** the melody has a "game over" feel (not too sad, slightly playful)

**Given** the game over melody is playing
**When** the player clicks "Play Again"
**Then** the melody stops (if still playing)
**And** the new game starts cleanly

**Given** the game over melody is playing
**When** the player clicks "Menu"
**Then** the melody stops (if still playing)
**And** the menu is displayed

**Given** the audio system
**When** checking sound quality
**Then** the game over melody matches the 8-bit retro aesthetic
**And** the melody is short (2-4 seconds)
**And** it plays without clipping or distortion

**Given** multiple rapid game overs occur
**When** restarting quickly
**Then** sounds don't overlap or cause audio glitches
**And** each new game over triggers a fresh melody playback

**Given** the audio system is complete
**When** reviewing all audio
**Then** volume levels are balanced between movement sounds and game over melody
**And** all sounds fit the retro arcade aesthetic

**Technical Notes:**
- Add game-over.mp3 to assets/sounds/
- Implement playGameOverSound() in audio.js using Web Audio API (AudioBufferSourceNode)
- Use AudioBufferSourceNode.stop() to halt game-over melody on restart or menu navigation
- Keep melody short (2-4 seconds) for quick restart flow
- **Note:** audio.js uses Web Audio API -- do NOT use HTML5 Audio (see Story 4.5 architect review)

**FRs:** FR89
