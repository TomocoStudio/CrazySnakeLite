# Story 6.3: Auto-Capture Data Collection

**Epic:** Epic 6 - User Feedback Collection System
**Status:** 📋 TODO
**Priority:** High
**Estimated Effort:** Medium

---

## User Story

**As a** product manager,
**I want** automatic metadata collection with each feedback submission,
**So that** I can correlate player perception with gameplay data.

---

## Context

Auto-captured metadata provides critical context for analyzing feedback. For beta scale (10-20 users), this structured data enables pattern recognition: Does skill level affect fun ratings? Does browser/device impact difficulty perception?

**Success Pattern to Identify:** High Fun (≥4) + High Difficulty (≥4) = Engaged Players

---

## Acceptance Criteria

### AC1: Data Points Captured
**Given** the player submits feedback
**When** generating the email body
**Then** the following data is automatically captured and included:
- **Timestamp:** ISO format date/time of submission (e.g., 2026-02-03T14:32:10Z)
- **User Agent:** Browser name, version, and OS (parsed from navigator.userAgent)
- **Screen Resolution:** Viewport dimensions (window.innerWidth x window.innerHeight)
- **Current Score:** Player's score at time of feedback submission
- **Top Score:** Player's best score from localStorage
- **Games Played:** Total games played this session (tracked in gameState)
- **Session Duration:** Time elapsed since page load (calculated from initial timestamp)

### AC2: Data Format Structure
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

### AC3: Non-Blocking Collection
**Given** the data collection code runs
**When** accessing browser APIs
**Then** all data is captured without blocking the UI thread
**And** if any data point fails to collect, it defaults to "Unknown" or "N/A"

### AC4: Browser/OS Parsing
**Given** navigator.userAgent is available
**When** parsing browser information
**Then** extract browser name (Chrome, Firefox, Safari, Edge)
**And** extract browser version (major version number)
**And** extract OS (Windows, macOS, Linux, iOS, Android)
**And** detect device type (Desktop or Mobile)

### AC5: Session Tracking
**Given** the page loads
**When** initializing the game
**Then** capture initial timestamp (sessionStart)
**And** initialize gamesPlayed counter in gameState
**And** increment gamesPlayed on each new game start

### AC6: Duration Formatting
**Given** session duration is calculated
**When** formatting for display
**Then** convert milliseconds to readable format (e.g., "8m 32s")
**And** handle edge cases (< 1 minute, > 1 hour)

---

## Technical Notes

**Implementation Location:**
- Create `feedback.js` module or extend existing module
- Functions needed:
  - `captureMetadata()` - Collect all auto-data
  - `parseUserAgent(uaString)` - Extract browser/OS info
  - `formatSessionDuration(ms)` - Convert ms to readable time
  - `formatEmailBody(feedbackData)` - Generate structured email body

**Browser APIs Used:**
- `navigator.userAgent` - Browser/OS information
- `window.innerWidth`, `window.innerHeight` - Screen resolution
- `Date.now()` - Timestamp generation
- `localStorage.getItem('crazysnakeLite_highScore')` - Top score

**Data Storage:**
- Track `sessionStart` in global scope or gameState
- Track `gamesPlayed` in gameState (increment in state.js resetGame())

**User Agent Parsing:**
Use regex or existing patterns to extract:
```javascript
const ua = navigator.userAgent;
// Example: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"

// Parse to: "Chrome 120.0 (Desktop), macOS"
```

**Star Formatting:**
- Filled star: ⭐ (U+2B50)
- Empty star: ☆ (U+2606)
- Generate string: repeat filled stars × rating, repeat empty stars × (5 - rating)

---

## Dependencies

- gameState (for current score, gamesPlayed tracking)
- localStorage (for top score retrieval)
- Story 6.4 (Email Submission) - uses formatted data

---

## Data Privacy Considerations

**What we collect:**
- Browser/OS (technical info, not personal)
- Scores and session data (gameplay metrics)
- Optional email (user-provided, explicit consent)

**What we DON'T collect:**
- IP addresses (not accessible client-side)
- Personal identifiers (no tracking IDs)
- Browsing history

**For beta:** This is acceptable. For public release, add privacy notice in modal.

---

## Definition of Done

- [ ] All 7 data points are captured automatically
- [ ] User agent is parsed into browser, version, OS, device type
- [ ] Session duration is tracked and formatted correctly
- [ ] Games played counter increments on each new game
- [ ] Data format matches the structured template
- [ ] Star ratings are formatted with Unicode stars
- [ ] Failed data collection defaults to "Unknown" gracefully
- [ ] Data collection doesn't block UI or cause performance issues
- [ ] Formatted email body is CSV-parseable for analysis
- [ ] All data points are tested across browsers (Chrome, Firefox, Safari)
