# Epic 6: User Feedback Collection System

**Status:** 📋 PLANNED
**Created:** 2026-02-03
**Priority:** High (Beta Launch Requirement)

---

## Overview

Enable beta players to submit structured feedback (fun rating, difficulty rating, optional comments) via an accessible modal interface, with data captured in parseable email format for analysis. This feedback mechanism supports beta validation and iterative improvement based on real player experience.

**Goal:** Collect high-quality, unbiased feedback from 10-20 beta users to validate that high fun + high difficulty creates engaging, replayable gameplay.

**Success Metric:** Players give feedback when they CHOOSE to (not forced at game over), preventing emotional bias from loss moments.

---

## Context from Party Mode Discussion

### Key Design Decisions

**Always-Visible Button Approach:**
- Feedback button visible at all times (not just after first game)
- Prevents sampling bias: players give feedback when in optimal emotional state
- Avoids "GAME OVER rage feedback" where frustration skews difficulty ratings
- Player agency: they choose when to reflect and share thoughts

**Data Collection Strategy:**
- Target: 10-20 beta users (manageable scale)
- Structured email format (CSV-parseable for analysis)
- Auto-captured metadata: timestamp, browser/OS, scores, session data
- Success pattern: High Fun (≥4) + High Difficulty (≥4) = engaged players

**Technical Approach:**
- Modal overlay (same visual style as other menu screens)
- mailto: mechanism (zero backend needed for beta)
- Auto-pause game if feedback opened during play
- Multiple submissions allowed (no limits)

---

## Stories

### Story 6.1: Feedback Modal UI Component

**As a** beta player,
**I want** a quick, simple feedback form,
**So that** I can share my experience in under 15 seconds.

**Acceptance Criteria:**

**Given** the feedback button is clicked
**When** the modal opens
**Then** a feedback form overlay appears
**And** the modal uses the same visual styling as other menu screens (retro aesthetic)
**And** the modal is centered on screen

**Given** the feedback form is displayed
**When** viewing the form elements
**Then** two 5-star rating inputs are visible: "How fun is Crazy Snake?" and "How's the difficulty?"
**And** each star rating is tappable/clickable for instant rating (no sliders)
**And** an optional text area is shown with label "Anything else to share? (optional)"
**And** the text area has a 500-character limit
**And** an optional single-line email input is shown with label "Want beta updates? (optional email)"
**And** a "Submit Feedback" button is visible and always enabled

**Given** the feedback form modal is open
**When** checking the game state
**Then** the game is auto-paused if it was in 'playing' phase
**And** the game board is visible but blurred underneath (like phone overlay)

**Given** the feedback form is displayed on mobile
**When** viewing on small screens
**Then** the modal scales appropriately to fit viewport
**And** star ratings are large enough for easy tapping
**And** text input is accessible without keyboard obscuring content

**Given** the modal is styled
**When** comparing to other game screens
**Then** the design is consistent with main menu and game over screens
**And** the retro pixel art aesthetic is maintained
**And** buttons use the same styling as other game buttons

**Technical Notes:**
- Create feedback-modal DOM element in index.html
- Style in style.css matching existing menu screens
- Modal structure: feedback-container > feedback-form > (star-ratings + text-area + email-input + submit-button)
- Use CSS blur on game canvas when modal active (same as phone overlay pattern)
- Star rating: 5 clickable star icons (☆ empty, ★ filled)

---

### Story 6.2: Feedback Button Integration

**As a** beta player,
**I want** a feedback button always available,
**So that** I can share feedback when I'm in the right mindset (not just after losing).

**Acceptance Criteria:**

**Given** the game has loaded
**When** viewing any game screen (menu, playing, paused, game over)
**Then** a "Feedback" button is visible
**And** the button is positioned in top-right area of the screen (or integrated into menu UI)
**And** the button is subtle and unobtrusive (not a call-to-action style)

**Given** the feedback button is displayed
**When** viewing on desktop
**Then** the button shows "Feedback" text with optional icon (💬)
**And** the button uses consistent styling with other game buttons

**Given** the feedback button is displayed on mobile
**When** viewing on small screens
**Then** the button may show just an icon (💬) to save space
**And** the button remains easily tappable (min 44x44px tap target)

**Given** the game is in 'playing' phase
**When** the player clicks the feedback button
**Then** the game auto-pauses immediately
**And** the feedback modal opens
**And** the game board is visible but blurred underneath

**Given** the game is in 'menu' or 'gameover' phase
**When** the player clicks the feedback button
**Then** the feedback modal opens immediately
**And** the game remains in its current phase

**Given** the feedback button is always visible
**When** checking discoverability
**Then** the button is visible without being aggressive or distracting
**And** the button placement respects existing UI (score display, game board)

**Technical Notes:**
- Add feedback-button element to index.html
- Position using CSS (top-right corner or menu integration)
- Add click handler to open feedback modal
- Auto-pause logic: if gameState.phase === 'playing', set to 'paused' on modal open
- Ensure button doesn't obstruct score display or gameplay area

---

### Story 6.3: Auto-Capture Data Collection

**As a** product manager,
**I want** automatic metadata collection with each feedback submission,
**So that** I can correlate player perception with gameplay data.

**Acceptance Criteria:**

**Given** the player submits feedback
**When** generating the email body
**Then** the following data is automatically captured and included:
  - **Timestamp:** ISO format date/time of submission
  - **User Agent:** Browser name, version, and OS (parsed from navigator.userAgent)
  - **Screen Resolution:** Viewport dimensions (window.innerWidth x window.innerHeight)
  - **Current Score:** Player's score at time of feedback submission
  - **Top Score:** Player's best score from localStorage
  - **Games Played:** Total games played this session (tracked in gameState)
  - **Session Duration:** Time elapsed since page load (calculated from initial timestamp)

**Given** the auto-captured data is formatted
**When** including in the email body
**Then** the data is structured in a CSV-parseable format
**And** each field is clearly labeled
**And** the format matches this structure:
```
Fun Rating: ⭐⭐⭐⭐☆ (4/5)
Difficulty Rating: ⭐⭐⭐⭐⭐ (5/5)

Player Comments:
[Free text here]

Optional Email: [email if provided, or "Not provided"]

--- AUTO-CAPTURED DATA ---
Timestamp: 2026-02-03T14:32:10Z
Browser: Chrome 120.0 (Desktop)
OS: macOS
Screen: 1920x1080
Current Score: 234
Top Score: 891
Games Played: 47
Session Duration: 8m 32s
```

**Given** the data collection code runs
**When** accessing browser APIs
**Then** all data is captured without blocking the UI thread
**And** if any data point fails to collect, it defaults to "Unknown" or "N/A"

**Technical Notes:**
- Implement in feedback.js or main.js
- Parse navigator.userAgent for browser/OS info
- Track gamesPlayed in gameState (increment on each game start)
- Track sessionStart timestamp on page load
- Calculate session duration: (Date.now() - sessionStart) converted to minutes/seconds
- Format stars as Unicode: "⭐" (filled) and "☆" (empty)

---

### Story 6.4: Email Submission & Thank You Flow

**As a** beta player,
**I want** my feedback sent easily via email,
**So that** my input reaches the developer without requiring accounts or backends.

**Acceptance Criteria:**

**Given** the player has filled out the feedback form (at minimum, star ratings)
**When** the player clicks "Submit Feedback"
**Then** the default email client opens with a pre-filled email
**And** the email "To" field is set to the developer's email address
**And** the email subject is: "[Crazy Snake Feedback] Fun:X Difficulty:Y | DATE"
**And** the email body contains the structured feedback + auto-captured data (from Story 6.3)

**Given** the email client opens successfully
**When** the feedback modal detects the mailto: link was triggered
**Then** the feedback modal is replaced with a "Thank You" screen
**And** the thank you screen displays: "🎉 Thanks! Your feedback helps make Crazy Snake even better!"
**And** a "Back to Game" button is shown

**Given** the thank you screen is displayed
**When** 3 seconds elapse
**Then** the thank you screen auto-closes
**And** the game returns to its previous state (playing resumes if it was paused, or stays on menu/gameover)

**Given** the thank you screen is displayed
**When** the player clicks "Back to Game" before 3 seconds
**Then** the thank you screen closes immediately
**And** the game returns to its previous state

**Given** the game was paused for feedback
**When** the thank you screen closes
**Then** the game resumes from 'paused' to 'playing' phase
**And** the blur effect is removed from the game canvas
**And** gameplay continues immediately

**Given** the mailto: link fails to open (browser blocks it, no email client)
**When** detecting the failure
**Then** an error message is shown: "Please email your feedback to [email@domain.com]"
**And** the feedback form remains open for the player to copy/paste manually

**Technical Notes:**
- Use mailto: URI scheme: `mailto:your-email@domain.com?subject=...&body=...`
- URL-encode the subject and body properly for mailto: format
- Implement thank you screen as DOM overlay (similar to feedback modal)
- 3-second auto-close using setTimeout()
- Store previous game phase before opening feedback, restore after closing

---

### Story 6.5: Multi-Feedback Support

**As a** beta player,
**I want** to submit feedback multiple times during my session,
**So that** I can share evolving thoughts as I play more games.

**Acceptance Criteria:**

**Given** the player has already submitted feedback once
**When** the player clicks the feedback button again
**Then** the feedback form opens again with empty/reset fields
**And** no warning or limit message is shown

**Given** the player is playing multiple games
**When** checking feedback submission limits
**Then** there is no limit on how many times feedback can be submitted
**And** each submission generates a new email with updated auto-captured data

**Given** the player submits feedback multiple times
**When** comparing the auto-captured data
**Then** each submission shows updated values for:
  - Current Score (reflects score at that moment)
  - Top Score (updates if a new high score was achieved)
  - Games Played (increments with each game)
  - Session Duration (increases with time)

**Given** the feedback button is always visible
**When** the player is at any point in their session
**Then** the feedback button remains clickable
**And** the player can give feedback before, during, or after gameplay

**Given** multiple feedback submissions occur
**When** checking email generation
**Then** each submission is treated independently
**And** the timestamp differentiates each feedback email

**Technical Notes:**
- Reset feedback form fields after each submission (clear star ratings, text area, email input)
- No state tracking needed for "already submitted" - allow unlimited submissions
- Each mailto: generates a new email (no batching or aggregation)

---

## Success Criteria

**Feedback Quality:**
- ✅ Player can submit feedback in under 15 seconds
- ✅ Feedback is given when player chooses (not forced at emotional low point)
- ✅ Auto-captured metadata provides context for analysis

**Data Analysis:**
- ✅ Email format is CSV-parseable for spreadsheet analysis
- ✅ Can correlate Fun/Difficulty ratings with player skill (score, games played)
- ✅ Can identify patterns: High Fun + High Difficulty = success metric

**UX Quality:**
- ✅ Feedback button is discoverable but not intrusive
- ✅ Modal matches game's retro aesthetic
- ✅ Game auto-pauses during feedback (no deaths while giving feedback)
- ✅ Thank you message feels appreciative and quick

---

## Technical Dependencies

**Existing Systems:**
- gameState (for current score, games played tracking)
- localStorage (for top score retrieval)
- Retro CSS styling (for modal consistency)
- Pause/resume game phase logic (for auto-pause)

**New Modules:**
- feedback.js (modal control, data collection, email generation)
- DOM elements (feedback modal, thank you screen, feedback button)

---

## Notes from Party Mode Discussion

**Team Insights:**
- **Mary (Analyst):** Identified sampling bias risk - GAME OVER feedback is emotionally charged and skews negative
- **Winston (Architect):** Recommended structured email format (CSV-parseable) for 10-20 user scale, no backend needed
- **Sally (UX Designer):** Emphasized player agency - always-visible button respects timing, prevents forced engagement
- **Bob (Scrum Master):** Validated story breakdown clarity and implementation readiness

**Rationale for Always-Visible Button:**
Tomoco's key insight: "When a player is losing, I'm not sure if it's the right time to ask feedback. Because this is maybe the most frustrating moment in the user experience. So, my concern is to increase bias." This drove the decision to make feedback always accessible rather than prompted at game over.
