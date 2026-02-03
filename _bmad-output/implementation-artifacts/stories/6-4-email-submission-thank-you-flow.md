# Story 6.4: Email Submission & Thank You Flow

**Epic:** Epic 6 - User Feedback Collection System
**Status:** review
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

---

## 🎯 COMPREHENSIVE DEVELOPER CONTEXT

### Story Objective

Implement **mailto: email submission with thank you flow** that enables beta players to send structured feedback via their default email client without requiring backends, followed by an appreciative thank you screen that auto-closes after 3 seconds.

**CRITICAL SUCCESS FACTORS:**
- mailto: link opens email client with pre-filled subject + body
- Email contains all feedback data + auto-captured metadata (from Story 6.3)
- Subject and body are properly URL-encoded
- Thank you screen shows appreciation message
- Auto-close after 3 seconds OR manual close via button
- Game resumes to previous state after thank you closes
- Error handling if mailto: fails (fallback message)

**FOR BETA SCALE (10-20 users):**
- Zero backend needed
- Zero infrastructure costs
- Structured email → easily copy-pasted to spreadsheet
- Instant implementation

**FILES TO MODIFY:**
- `index.html` (add thank you screen DOM)
- `css/style.css` (style thank you screen)
- `js/feedback.js` (add mailto generation + thank you screen logic)
- `js/main.js` (update form submit handler)
- `js/config.js` (add developer email constant)

---

### 📁 DETAILED FILE STRUCTURE & IMPLEMENTATION

**index.html - Add Thank You Screen:**

```html
<!-- Add after feedback modal -->
<div id="thank-you-screen" class="thank-you-screen hidden">
  <div class="thank-you-container">
    <div class="thank-you-content">
      <div class="thank-you-icon">🎉</div>
      <h2>Thanks!</h2>
      <p>Your feedback helps make Crazy Snake even better!</p>
      <button id="back-to-game-btn" class="btn btn-primary">Back to Game</button>
    </div>
  </div>
</div>
```

**css/style.css - Thank You Screen Styling:**

```css
/* Thank You Screen Overlay */
.thank-you-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1001;  /* Above feedback modal */
}

.thank-you-screen.hidden {
  display: none;
}

.thank-you-container {
  background-color: #1a1a1a;
  border: 4px solid #FFD700;
  border-radius: 12px;
  padding: 40px;
  max-width: 400px;
  text-align: center;
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.5);
  animation: fadeInScale 0.3s ease;
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.thank-you-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.thank-you-content h2 {
  font-family: 'Press Start 2P', monospace;
  font-size: 24px;
  color: #FFD700;
  margin: 0 0 15px 0;
}

.thank-you-content p {
  font-family: 'Courier New', monospace;
  font-size: 14px;
  color: #fff;
  margin: 0 0 30px 0;
  line-height: 1.6;
}

#back-to-game-btn {
  width: 100%;
  padding: 12px 20px;
  font-family: 'Press Start 2P', monospace;
  font-size: 12px;
  background-color: #FFD700;
  color: #1a1a1a;
  border: 2px solid #fff;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

#back-to-game-btn:hover {
  background-color: #FFA500;
  transform: translateY(-2px);
}

/* Mobile Responsiveness */
@media (max-width: 768px) {
  .thank-you-container {
    padding: 30px 20px;
    max-width: 90%;
  }

  .thank-you-icon {
    font-size: 48px;
  }

  .thank-you-content h2 {
    font-size: 18px;
  }

  .thank-you-content p {
    font-size: 12px;
  }
}
```

**js/feedback.js - Add Email Submission Logic:**

```javascript
// Add to existing feedback.js

import { CONFIG } from './config.js';

let autoCloseTimer = null;  // Track auto-close timeout

/**
 * Submit feedback via mailto: link
 * Opens email client with pre-filled subject and body
 * @param {Object} gameState - Current game state
 */
export function submitFeedback(gameState) {
  // Get form data (from Story 6.1)
  const formData = getFormData();

  // Validate minimum requirement (at least one rating)
  if (formData.funRating === 0 && formData.difficultyRating === 0) {
    alert('Please provide at least one rating before submitting.');
    return;
  }

  // Capture metadata (from Story 6.3)
  const metadata = captureMetadata(gameState);

  // Format email subject and body
  const subject = formatEmailSubject(formData, metadata);
  const body = formatEmailBody(formData, metadata);

  // Generate mailto: link
  const mailtoLink = `mailto:${CONFIG.FEEDBACK_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Attempt to open email client
  try {
    window.location.href = mailtoLink;
    console.log('[Feedback] Email client opened');

    // Show thank you screen
    showThankYouScreen(gameState);

    // Hide feedback modal
    const modal = document.getElementById('feedback-modal');
    modal.classList.add('hidden');

    // Reset form for next submission (Story 6.5)
    resetFeedbackForm();

  } catch (error) {
    console.error('[Feedback] Failed to open email client:', error);
    showEmailError();
  }
}

/**
 * Show thank you screen with auto-close timer
 * @param {Object} gameState - Current game state
 */
function showThankYouScreen(gameState) {
  const thankYouScreen = document.getElementById('thank-you-screen');
  thankYouScreen.classList.remove('hidden');

  // Set auto-close timer (3 seconds)
  autoCloseTimer = setTimeout(() => {
    closeThankYouScreen(gameState);
  }, CONFIG.THANK_YOU_DURATION);
}

/**
 * Close thank you screen and restore game state
 * @param {Object} gameState - Current game state
 */
export function closeThankYouScreen(gameState) {
  // Clear auto-close timer if active
  if (autoCloseTimer) {
    clearTimeout(autoCloseTimer);
    autoCloseTimer = null;
  }

  // Hide thank you screen
  const thankYouScreen = document.getElementById('thank-you-screen');
  thankYouScreen.classList.add('hidden');

  // Remove blur from game canvas
  const canvas = document.getElementById('game-canvas');
  canvas.classList.remove('blurred');

  // Restore game phase (from closeFeedbackModal pattern)
  if (previousPhase) {
    gameState.phase = previousPhase;
    previousPhase = null;
  }

  console.log('[Feedback] Thank you screen closed, game resumed');
}

/**
 * Show error message if mailto: fails
 */
function showEmailError() {
  const errorMsg = `Unable to open email client.\\n\\nPlease send your feedback manually to:\\n${CONFIG.FEEDBACK_EMAIL}`;
  alert(errorMsg);
}
```

**js/main.js - Update Form Submit Handler:**

```javascript
// Update existing form submit handler (from Story 6.1)
import { submitFeedback, closeThankYouScreen } from './feedback.js';

function init() {
  // ... existing initialization ...

  // Form submit handler (now complete with Story 6.4)
  const feedbackForm = document.getElementById('feedback-form');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      submitFeedback(gameState);  // Story 6.4
    });
  }

  // Thank you screen "Back to Game" button
  const backToGameBtn = document.getElementById('back-to-game-btn');
  if (backToGameBtn) {
    backToGameBtn.addEventListener('click', () => {
      closeThankYouScreen(gameState);
    });
  }
}
```

**js/config.js - Add Feedback Email:**

```javascript
// Add to existing CONFIG object
export const CONFIG = {
  // ... existing config ...

  // Feedback System
  FEEDBACK_EMAIL: 'tomoco@example.com',  // ⚠️ UPDATE WITH ACTUAL EMAIL
  THANK_YOU_DURATION: 3000,  // 3 seconds auto-close
  MAX_COMMENT_LENGTH: 500,
};
```

---

### 🧪 COMPREHENSIVE TESTING REQUIREMENTS

**Test Scenarios:**

1. **Email Client Opening:**
   - Submit feedback → verify email client opens
   - Verify "To" field = CONFIG.FEEDBACK_EMAIL
   - Verify subject line correct format
   - Verify body contains all feedback + metadata

2. **Subject Line Format:**
   - Fun:4 Difficulty:5 → verify subject includes "Fun:4 Difficulty:5"
   - Verify date in YYYY-MM-DD format
   - Verify subject starts with "[Crazy Snake Feedback]"

3. **Email Body Content:**
   - Verify fun rating stars (⭐⭐⭐⭐☆)
   - Verify difficulty rating stars
   - Verify player comments (or "No comments")
   - Verify optional email (or "Not provided")
   - Verify all 7 auto-captured data points present

4. **URL Encoding:**
   - Submit with special characters (!@#$%) in comments
   - Verify email body displays correctly (no broken encoding)
   - Verify newlines preserved in body

5. **Thank You Screen Display:**
   - Submit feedback → verify thank you screen appears immediately
   - Verify feedback modal is hidden
   - Verify 🎉 emoji displays
   - Verify message: "Thanks! Your feedback helps make Crazy Snake even better!"
   - Verify "Back to Game" button visible

6. **Auto-Close Timer:**
   - Submit feedback
   - Wait 3 seconds
   - Verify thank you screen auto-closes
   - Verify game resumes

7. **Manual Close:**
   - Submit feedback
   - Click "Back to Game" before 3 seconds
   - Verify thank you screen closes immediately
   - Verify timer is cleared (no delayed close after manual close)

8. **Game State Restoration:**
   - Submit from menu → verify returns to menu after close
   - Submit during gameplay (paused) → verify resumes to 'playing'
   - Submit from game over → verify returns to game over screen
   - Verify blur removed from canvas

9. **Form Reset After Submission:**
   - Submit feedback with all fields filled
   - Re-open feedback modal
   - Verify star ratings reset to 0 (Story 6.5)
   - Verify comments cleared
   - Verify character counter reset

10. **Error Handling:**
    - Block mailto: (e.g., browser setting, corporate network)
    - Submit feedback
    - Verify alert message shows fallback email address
    - Verify feedback modal stays open (not hidden)

**Cross-Browser mailto: Behavior:**

11. **Chrome:** Opens Gmail (if default) or system mail client
12. **Firefox:** Opens default mail client or shows picker
13. **Safari:** Opens Mail.app on macOS/iOS
14. **Edge:** Opens Outlook or default mail client
15. **Mobile Safari:** Opens Mail app on iOS

**Edge Cases:**

16. **No Email Client Configured:**
    - User has no default email client
    - Verify error message displays
    - Verify mailto: link copied to clipboard (if implemented)

17. **Long Email Body:**
    - Submit with 500 character comments
    - Verify email body isn't truncated
    - Verify all data still present

18. **Rapid Submissions:**
    - Submit feedback
    - Immediately click "Back to Game"
    - Open feedback modal again
    - Submit again
    - Verify no conflicts or timer issues

---

### ⚠️ KNOWN ISSUES & EDGE CASES

**Issue 1: mailto: Character Limit**
- mailto: URIs have practical length limits (~2000 characters)
- Long comments + metadata might approach limit
- **Current state:** 500 char comments + metadata ≈ 800 chars total (safe)
- **Mitigation:** Character limit already enforced (Story 6.1)

**Issue 2: Email Client Detection**
- Can't reliably detect if mailto: succeeded
- User might close email client without sending
- **Acceptable for beta:** Trust that users send if they opened
- **Post-MVP:** Consider backend tracking

**Issue 3: Spam Filters**
- Structured format might trigger spam filters
- Multiple emails from same session might be flagged
- **Mitigation:** Recommend users whitelist feedback email
- **Low risk:** Tomoco's email likely not on spam lists

**Issue 4: Auto-Close Timing**
- 3 seconds might feel too fast for some users
- 3 seconds might feel too slow for others
- **Current choice:** 3 seconds is industry standard
- **Configurable:** CONFIG.THANK_YOU_DURATION can be adjusted

**Issue 5: Multiple Email Clients**
- User has multiple email clients installed
- Browser may show picker dialog
- **Acceptable:** User choice, workflow continues normally

---

### 📚 TECHNICAL REFERENCES

**Mailto: URI Scheme RFC 6068:**
```
mailto:email@example.com?subject=SUBJECT&body=BODY

Parts must be URL-encoded:
- encodeURIComponent() for subject and body
- Newlines: \n works in most clients
- Special chars: !*'();:@&=+$,/?%#[] must be encoded
```

**URL Encoding Examples:**
```javascript
const subject = "[Crazy Snake Feedback] Fun:4 Difficulty:5 | 2026-02-03";
encodeURIComponent(subject);
// "%5BCrazy%20Snake%20Feedback%5D%20Fun%3A4%20Difficulty%3A5%20%7C%202026-02-03"

const body = "Fun Rating: ⭐⭐⭐⭐☆ (4/5)\nDifficulty Rating: ⭐⭐⭐⭐⭐ (5/5)";
encodeURIComponent(body);
// Properly encoded with %0A for newlines, %20 for spaces, etc.
```

**setTimeout Pattern for Auto-Close:**
```javascript
let timer = setTimeout(() => {
  closeScreen();
}, 3000);

// Clear timer if user acts early
clearTimeout(timer);
```

---

### ✅ COMPLETION CHECKLIST

Before marking story as "done":

- [ ] Thank you screen DOM added to index.html
- [ ] Thank you screen styled (matches retro aesthetic)
- [ ] submitFeedback() function implemented
- [ ] mailto: link generated with proper encoding
- [ ] Email subject includes ratings + date
- [ ] Email body includes all feedback + metadata
- [ ] Thank you screen shows after submit
- [ ] Auto-close timer (3 seconds) works
- [ ] Manual close button works
- [ ] Timer cleared on manual close
- [ ] Game state restored after close
- [ ] Blur removed from canvas
- [ ] Form reset after submission (Story 6.5 pattern)
- [ ] Error handling for failed mailto:
- [ ] CONFIG.FEEDBACK_EMAIL updated with actual email
- [ ] Tested on Chrome (email client opens)
- [ ] Tested on Firefox (email client opens)
- [ ] Tested on Safari (email client opens)
- [ ] Tested email content in email client (readable, formatted)
- [ ] No console errors or warnings
