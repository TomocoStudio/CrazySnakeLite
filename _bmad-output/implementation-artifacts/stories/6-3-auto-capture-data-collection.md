# Story 6.3: Auto-Capture Data Collection

**Epic:** Epic 6 - User Feedback Collection System
**Status:** review
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

---

## 🎯 COMPREHENSIVE DEVELOPER CONTEXT

### Story Objective

Implement **automatic metadata collection** that captures 7 critical data points with each feedback submission, enabling correlation of player perception (fun/difficulty ratings) with gameplay data (scores, session info) and technical context (browser/device).

**CRITICAL SUCCESS FACTORS:**
- Auto-capture 7 data points without user input
- Parse user agent into browser, version, OS, device type
- Track session duration and games played accurately
- Format data as CSV-parseable structured text
- Non-blocking collection (no UI freezes)
- Graceful fallbacks for missing data

**SUCCESS PATTERN TO IDENTIFY:**
High Fun (≥4) + High Difficulty (≥4) = Engaged Players

**FILES TO MODIFY:**
- `js/feedback.js` (add data collection functions)
- `js/state.js` (add session tracking to gameState)
- `js/main.js` (initialize session tracking)
- `js/config.js` (add session tracking constants)

---

### 📋 DATA POINTS TO CAPTURE

**7 Auto-Captured Data Points:**

1. **Timestamp** - ISO format date/time (e.g., `2026-02-03T14:32:10Z`)
2. **Browser** - Name + version + device type (e.g., `Chrome 120.0 (Desktop)`)
3. **OS** - Operating system (e.g., `macOS`, `Windows 10`, `iOS 15`)
4. **Screen Resolution** - Viewport dimensions (e.g., `1920x1080`)
5. **Current Score** - Player's score at feedback submission time
6. **Top Score** - Best score from localStorage
7. **Games Played** - Total games in current session
8. **Session Duration** - Time since page load (e.g., `8m 32s`)

**Data Format Example:**
```
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

---

### 📁 DETAILED FILE STRUCTURE & IMPLEMENTATION

**js/state.js - Add Session Tracking:**

```javascript
// Add to createInitialState() function
export function createInitialState() {
  return {
    phase: 'menu',
    snake: { /* ... */ },
    food: { /* ... */ },
    // ... existing state ...

    // NEW: Session tracking (Story 6.3)
    sessionStart: Date.now(),  // Timestamp when page loaded
    gamesPlayed: 0,            // Increment on each new game
  };
}

// Add to resetGame() function
export function resetGame(gameState) {
  // ... existing reset logic ...

  // Increment games played counter
  gameState.gamesPlayed += 1;

  // Do NOT reset sessionStart (persists across games)
}
```

**js/feedback.js - Add Data Collection Functions:**

```javascript
// Add to existing feedback.js (Story 6.1)

/**
 * Capture all auto-metadata for feedback submission
 * @param {Object} gameState - Current game state
 * @returns {Object} Metadata object with all collected data
 */
export function captureMetadata(gameState) {
  return {
    timestamp: new Date().toISOString(),
    browser: parseBrowser(),
    os: parseOS(),
    screen: `${window.innerWidth}x${window.innerHeight}`,
    currentScore: gameState.score || 0,
    topScore: getTopScore(),
    gamesPlayed: gameState.gamesPlayed || 0,
    sessionDuration: formatSessionDuration(gameState.sessionStart)
  };
}

/**
 * Parse browser name, version, and device type from user agent
 * @returns {string} Browser info (e.g., "Chrome 120.0 (Desktop)")
 */
function parseBrowser() {
  const ua = navigator.userAgent;

  // Detect browser
  let browser = 'Unknown';
  let version = '';

  if (ua.includes('Firefox/')) {
    browser = 'Firefox';
    version = ua.match(/Firefox\/(\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Edg/')) {
    browser = 'Edge';
    version = ua.match(/Edg\/(\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Chrome/') && !ua.includes('Edg/')) {
    browser = 'Chrome';
    version = ua.match(/Chrome\/(\d+\.\d+)/)?.[1] || '';
  } else if (ua.includes('Safari/') && !ua.includes('Chrome')) {
    browser = 'Safari';
    version = ua.match(/Version\/(\d+\.\d+)/)?.[1] || '';
  }

  // Detect device type
  const isMobile = /Mobile|Android|iPhone|iPad|iPod/i.test(ua);
  const deviceType = isMobile ? 'Mobile' : 'Desktop';

  return version ? `${browser} ${version} (${deviceType})` : `${browser} (${deviceType})`;
}

/**
 * Parse operating system from user agent
 * @returns {string} OS name (e.g., "macOS", "Windows 10", "iOS 15")
 */
function parseOS() {
  const ua = navigator.userAgent;

  if (ua.includes('Mac OS X')) {
    const version = ua.match(/Mac OS X (\d+[._]\d+)/)?.[1]?.replace('_', '.') || '';
    return version ? `macOS ${version}` : 'macOS';
  } else if (ua.includes('Windows NT')) {
    const version = ua.match(/Windows NT (\d+\.\d+)/)?.[1];
    const windowsVersion = {
      '10.0': 'Windows 10',
      '6.3': 'Windows 8.1',
      '6.2': 'Windows 8',
      '6.1': 'Windows 7'
    };
    return windowsVersion[version] || 'Windows';
  } else if (ua.includes('Android')) {
    const version = ua.match(/Android (\d+\.\d+)/)?.[1] || '';
    return version ? `Android ${version}` : 'Android';
  } else if (ua.includes('iPhone') || ua.includes('iPad')) {
    const version = ua.match(/OS (\d+[._]\d+)/)?.[1]?.replace('_', '.') || '';
    return version ? `iOS ${version}` : 'iOS';
  } else if (ua.includes('Linux')) {
    return 'Linux';
  }

  return 'Unknown';
}

/**
 * Get top score from localStorage
 * @returns {number} Top score or 0 if not found
 */
function getTopScore() {
  try {
    const highScore = localStorage.getItem('crazysnakeLite_highScore');
    return parseInt(highScore) || 0;
  } catch (error) {
    console.warn('[Feedback] Failed to get top score:', error);
    return 0;
  }
}

/**
 * Format session duration from start timestamp to readable format
 * @param {number} sessionStart - Timestamp when session started (Date.now())
 * @returns {string} Formatted duration (e.g., "8m 32s", "1h 5m")
 */
function formatSessionDuration(sessionStart) {
  if (!sessionStart) return '0s';

  const durationMs = Date.now() - sessionStart;
  const seconds = Math.floor(durationMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (hours > 0) {
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  } else if (minutes > 0) {
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  } else {
    return `${seconds}s`;
  }
}

/**
 * Format star ratings as Unicode stars
 * @param {number} rating - Rating value (0-5)
 * @returns {string} Star string (e.g., "⭐⭐⭐⭐☆")
 */
function formatStars(rating) {
  const filledStar = '⭐';
  const emptyStar = '☆';
  return filledStar.repeat(rating) + emptyStar.repeat(5 - rating);
}

/**
 * Format complete email body with feedback + metadata
 * @param {Object} formData - Form data from getFormData() (Story 6.1)
 * @param {Object} metadata - Metadata from captureMetadata()
 * @returns {string} Formatted email body
 */
export function formatEmailBody(formData, metadata) {
  const funStars = formatStars(formData.funRating);
  const difficultyStars = formatStars(formData.difficultyRating);

  // Build email body with structured format
  let body = '';

  // Ratings
  body += `Fun Rating: ${funStars} (${formData.funRating}/5)\n`;
  body += `Difficulty Rating: ${difficultyStars} (${formData.difficultyRating}/5)\n\n`;

  // Comments
  body += `Player Comments:\n`;
  body += formData.comments || '(No comments provided)\n';
  body += `\n`;

  // Optional email
  body += `Optional Email: ${formData.email || 'Not provided'}\n\n`;

  // Auto-captured data
  body += `--- AUTO-CAPTURED DATA ---\n`;
  body += `Timestamp: ${metadata.timestamp}\n`;
  body += `Browser: ${metadata.browser}\n`;
  body += `OS: ${metadata.os}\n`;
  body += `Screen: ${metadata.screen}\n`;
  body += `Current Score: ${metadata.currentScore}\n`;
  body += `Top Score: ${metadata.topScore}\n`;
  body += `Games Played: ${metadata.gamesPlayed}\n`;
  body += `Session Duration: ${metadata.sessionDuration}\n`;

  return body;
}

/**
 * Format email subject line
 * @param {Object} formData - Form data with ratings
 * @param {Object} metadata - Metadata with timestamp
 * @returns {string} Email subject (e.g., "[Crazy Snake Feedback] Fun:4 Difficulty:5 | 2026-02-03")
 */
export function formatEmailSubject(formData, metadata) {
  const date = metadata.timestamp.split('T')[0];  // Extract date only (YYYY-MM-DD)
  return `[Crazy Snake Feedback] Fun:${formData.funRating} Difficulty:${formData.difficultyRating} | ${date}`;
}
```

---

### 🧪 COMPREHENSIVE TESTING REQUIREMENTS

**Test Scenarios:**

1. **Timestamp Capture:**
   - Submit feedback → verify timestamp in ISO format
   - Verify timestamp includes timezone (Z or offset)
   - Verify timestamp is current (within 1 second of submission)

2. **Browser Parsing:**
   - Chrome: Verify detects "Chrome X.X (Desktop/Mobile)"
   - Firefox: Verify detects "Firefox X.X (Desktop/Mobile)"
   - Safari: Verify detects "Safari X.X (Desktop/Mobile)"
   - Edge: Verify detects "Edge X.X (Desktop)"
   - Unknown browser: Verify defaults to "Unknown (Desktop/Mobile)"

3. **OS Parsing:**
   - macOS: Verify detects "macOS X.X"
   - Windows: Verify detects "Windows 10" (or appropriate version)
   - iOS: Verify detects "iOS X.X"
   - Android: Verify detects "Android X.X"
   - Linux: Verify detects "Linux"
   - Unknown OS: Verify defaults to "Unknown"

4. **Screen Resolution:**
   - Desktop (1920x1080): Verify captures correctly
   - Mobile (375x667): Verify captures correctly
   - Resize window → submit feedback → verify updated resolution

5. **Current Score:**
   - Score = 0: Verify captures "0"
   - Score = 234: Verify captures "234"
   - During gameplay: Verify captures current score at submission time

6. **Top Score:**
   - No localStorage: Verify returns 0
   - localStorage has score: Verify retrieves correct value
   - Beat high score: Submit feedback → verify shows new high score

7. **Games Played:**
   - First game: Verify gamesPlayed = 1
   - After 5 games: Verify gamesPlayed = 5
   - Each new game start: Verify counter increments

8. **Session Duration:**
   - After 30 seconds: Verify shows "30s"
   - After 2 minutes: Verify shows "2m Xs"
   - After 1 hour: Verify shows "1h Xm"
   - Verify format is human-readable

9. **Star Formatting:**
   - Rating 0: Verify "☆☆☆☆☆"
   - Rating 3: Verify "⭐⭐⭐☆☆"
   - Rating 5: Verify "⭐⭐⭐⭐⭐"

10. **Complete Email Body:**
    - Submit with all fields → verify body includes all data
    - Submit with no comments → verify shows "(No comments provided)"
    - Submit with no email → verify shows "Not provided"
    - Verify CSV-parseable format (structured, labeled fields)

**Error Handling Tests:**

11. **localStorage Blocked:**
    - Block localStorage access
    - Submit feedback
    - Verify topScore defaults to 0
    - Verify no errors thrown

12. **Unusual User Agents:**
    - Bot user agent
    - Old browser user agent
    - Custom/modified user agent
    - Verify defaults to "Unknown" gracefully

13. **Missing sessionStart:**
    - Delete gameState.sessionStart
    - Submit feedback
    - Verify sessionDuration shows "0s"
    - Verify no errors thrown

---

### ⚠️ KNOWN ISSUES & EDGE CASES

**Issue 1: User Agent Parsing Fragility**
- User agent strings vary wildly
- Parsing with regex can fail on unusual formats
- **Mitigation:** Graceful fallbacks to "Unknown"
- **Testing:** Test on multiple browsers and devices

**Issue 2: Timezone in Timestamp**
- `toISOString()` always returns UTC (Z suffix)
- User's local time not captured
- **Acceptable:** UTC is standard for logging, can convert later

**Issue 3: Games Played Resets on Page Reload**
- `gameState.gamesPlayed` resets to 0 on page refresh
- **Expected behavior:** Session tracking is per-session, not persistent
- **For persistent tracking:** Would need localStorage (post-MVP)

**Issue 4: Session Duration Overflow**
- If session lasts > 24 hours, format might look odd
- **Edge case:** Unlikely for beta testing
- **Mitigation:** Format could be enhanced to show days if needed

**Issue 5: Screen Resolution on Mobile**
- May capture viewport size, not physical screen resolution
- **Acceptable:** Viewport size is more relevant for responsive design

---

### 📚 TECHNICAL REFERENCES

**ISO 8601 Timestamp Format:**
```javascript
new Date().toISOString()
// Returns: "2026-02-03T14:32:10.123Z"
```

**User Agent String Examples:**
```
Chrome Desktop:
Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36

Firefox Desktop:
Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/120.0

Safari Mobile:
Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.0 Mobile/15E148 Safari/604.1
```

**Unicode Stars:**
- Filled star: ⭐ (U+2B50)
- Empty star: ☆ (U+2606)

---

### ✅ COMPLETION CHECKLIST

Before marking story as "done":

- [ ] sessionStart added to gameState (in state.js createInitialState)
- [ ] gamesPlayed added to gameState and increments on new game
- [ ] captureMetadata() function implemented
- [ ] parseBrowser() detects Chrome, Firefox, Safari, Edge
- [ ] parseOS() detects macOS, Windows, iOS, Android, Linux
- [ ] formatSessionDuration() returns human-readable format
- [ ] getTopScore() retrieves from localStorage with error handling
- [ ] formatStars() generates Unicode star strings
- [ ] formatEmailBody() creates structured email body
- [ ] formatEmailSubject() creates subject with ratings + date
- [ ] All 7 data points captured automatically
- [ ] Data format is CSV-parseable (structured, labeled)
- [ ] Error handling for missing/failed data (defaults to "Unknown" or 0)
- [ ] Tested on Chrome, Firefox, Safari, Edge
- [ ] Tested on desktop and mobile devices
- [ ] Verified no UI blocking or performance issues
- [ ] No console errors or warnings
