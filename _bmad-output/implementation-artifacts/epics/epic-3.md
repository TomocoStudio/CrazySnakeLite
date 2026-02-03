# Epic 3: Phone Call Interruption

**Status:** ✅ COMPLETE
**Created:** 2026-01-24
**Completed:** 2026-01-24

---

## Overview

Players experience the signature phone call mechanic - random interruptions where the game continues running underneath, creating tension and split-attention gameplay. The innovative mechanic that creates shareable moments.

**FRs covered:** FR25-FR34, FR55, FR78-FR79

---

## Stories

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
