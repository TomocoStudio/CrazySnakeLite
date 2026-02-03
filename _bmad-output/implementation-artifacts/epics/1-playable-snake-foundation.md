# Epic 1: Playable Snake Foundation

**Status:** ✅ COMPLETE
**Created:** 2026-01-24
**Completed:** 2026-01-24

---

## Overview

Players can play a basic Snake game - moving the snake, eating food to grow, dying on collision, and immediately restarting. This delivers the core gameplay loop for break-time entertainment.

**FRs covered:** FR1-FR8, FR10-FR12, FR21, FR23-FR24, FR35-FR40, FR46-FR50, FR54, FR73-FR77, FR80, FR90-FR94

---

## Stories

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
