# Story 6.4: Email Submission & Thank You Flow

**Epic:** Epic 6 - User Feedback Collection System
**Status:** 📋 TODO
**Priority:** High
**Estimated Effort:** Medium

---

## User Story

**As a** beta player,
**I want** my feedback sent easily via email,
**So that** my input reaches the developer without requiring accounts or backends.

---

## Context

For beta scale (10-20 users), mailto: mechanism is the simplest approach. Zero backend needed, zero infrastructure costs, zero complexity. Structured email format enables easy copy-paste into spreadsheet for analysis.

---

## Acceptance Criteria

### AC1: Email Client Opening
**Given** the player has filled out the feedback form (at minimum, star ratings)
**When** the player clicks "Submit Feedback"
**Then** the default email client opens with a pre-filled email
**And** the email "To" field is set to the developer's email address
**And** the email subject is: "[Crazy Snake Feedback] Fun:X Difficulty:Y | DATE"
**And** the email body contains the structured feedback + auto-captured data (from Story 6.3)

### AC2: Subject Line Format
**Given** feedback is being submitted
**When** generating the email subject
**Then** format as: `[Crazy Snake Feedback] Fun:4 Difficulty:5 | 2026-02-03`
**And** use actual rating values from the form
**And** use current date in YYYY-MM-DD format

### AC3: Thank You Screen Display
**Given** the email client opens successfully
**When** the feedback modal detects the mailto: link was triggered
**Then** the feedback modal is replaced with a "Thank You" screen
**And** the thank you screen displays: "🎉 Thanks! Your feedback helps make Crazy Snake even better!"
**And** a "Back to Game" button is shown

### AC4: Auto-Close Behavior
**Given** the thank you screen is displayed
**When** 3 seconds elapse
**Then** the thank you screen auto-closes
**And** the game returns to its previous state (playing resumes if it was paused, or stays on menu/gameover)

### AC5: Manual Close
**Given** the thank you screen is displayed
**When** the player clicks "Back to Game" before 3 seconds
**Then** the thank you screen closes immediately
**And** the game returns to its previous state

### AC6: Game Resume
**Given** the game was paused for feedback
**When** the thank you screen closes
**Then** the game resumes from 'paused' to 'playing' phase
**And** the blur effect is removed from the game canvas
**And** gameplay continues immediately

### AC7: Error Handling
**Given** the mailto: link fails to open (browser blocks it, no email client)
**When** detecting the failure
**Then** an error message is shown: "Please email your feedback to [email@domain.com]"
**And** the feedback form remains open for the player to copy/paste manually

---

## Technical Notes

**Mailto: URI Format:**
```javascript
const mailtoLink = `mailto:your-email@example.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
window.location.href = mailtoLink;
```

**Important:**
- Must URL-encode subject and body (use `encodeURIComponent()`)
- Newlines in body: use `%0A` or `\n` (both work)
- Long bodies may get truncated (keep under ~2000 chars to be safe)

**Email Template:**
```
To: tomoco@example.com
Subject: [Crazy Snake Feedback] Fun:4 Difficulty:5 | 2026-02-03

Fun Rating: ⭐⭐⭐⭐☆ (4/5)
Difficulty Rating: ⭐⭐⭐⭐⭐ (5/5)

Player Comments:
This game is addictively difficult! Love the chaos.

Optional Email: player@example.com

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

**Thank You Screen:**
- Implement as DOM overlay (similar to feedback modal)
- Use setTimeout() for 3-second auto-close
- Clear timeout if user clicks "Back to Game" early

**State Management:**
- Store previous game phase before opening feedback: `previousPhase = gameState.phase`
- Restore on thank you close: `gameState.phase = previousPhase`

**Error Detection:**
- mailto: may fail silently in some browsers
- Provide fallback: show email address to copy manually
- Could add a "Copy Feedback" button to copy formatted text to clipboard

---

## Dependencies

- Story 6.1 (Feedback Modal UI)
- Story 6.3 (Auto-Capture Data Collection) - provides formatted body
- gameState.phase management (for pause/resume)

---

## Alternative Approaches Considered

**Why not use a backend?**
- Beta scale (10-20 users) doesn't justify infrastructure
- Mailto: is instant to implement (zero setup)
- Structured email is easily copy-pasted to spreadsheet

**Why not use Google Forms?**
- Loses visual consistency with game aesthetic
- External dependency (requires internet, third-party service)
- Mailto: keeps everything self-contained

**For post-beta:** If scaling beyond 50 users, consider backend or form service.

---

## Definition of Done

- [ ] Submit button triggers mailto: with pre-filled email
- [ ] Email "To" field is set to correct developer email
- [ ] Email subject follows format: [Crazy Snake Feedback] Fun:X Difficulty:Y | DATE
- [ ] Email body contains structured feedback + auto-captured data
- [ ] Email subject and body are properly URL-encoded
- [ ] Thank you screen appears after submit
- [ ] Thank you message is friendly and appreciative
- [ ] Thank you screen auto-closes after 3 seconds
- [ ] "Back to Game" button closes thank you screen immediately
- [ ] Game resumes to previous phase after thank you closes
- [ ] Blur effect is removed when returning to game
- [ ] Error handling displays fallback message if mailto: fails
- [ ] Tested on Chrome, Firefox, Safari (different mail client behaviors)
