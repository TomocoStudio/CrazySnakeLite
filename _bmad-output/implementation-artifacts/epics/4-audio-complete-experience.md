# Epic 4: Audio & Complete Experience

**Status:** ✅ COMPLETE
**Created:** 2026-01-24
**Completed:** 2026-01-29

---

## Overview

Players enjoy the complete polished game with retro 8-bit sound effects, proper menus, score tracking, and high score persistence. This transforms the prototype into a finished product worth sharing.

**FRs covered:** FR41-FR45, FR56, FR58-FR72, FR81-FR89

---

## Stories

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
