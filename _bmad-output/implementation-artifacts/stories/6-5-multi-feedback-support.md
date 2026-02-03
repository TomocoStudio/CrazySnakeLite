# Story 6.5: Multi-Feedback Support

**Epic:** Epic 6 - User Feedback Collection System
**Status:** review
**Priority:** Medium
**Estimated Effort:** Small

---

## User Story

**As a** beta player,
**I want** to submit feedback multiple times during my session,
**So that** I can share evolving thoughts as I play more games.

---

## Context

Players' perceptions change as they gain experience. First-game feedback might be "too hard!" but after 10 games, it becomes "challenging but fair!" Allowing multiple submissions captures this evolution and provides richer insights.

No limits = no artificial constraints on valuable feedback.

---

## Acceptance Criteria

### AC1: Unlimited Submissions
**Given** the player has already submitted feedback once
**When** the player clicks the feedback button again
**Then** the feedback form opens again with empty/reset fields
**And** no warning or limit message is shown

### AC2: No Submission Limits
**Given** the player is playing multiple games
**When** checking feedback submission limits
**Then** there is no limit on how many times feedback can be submitted
**And** each submission generates a new email with updated auto-captured data

### AC3: Updated Metadata
**Given** the player submits feedback multiple times
**When** comparing the auto-captured data
**Then** each submission shows updated values for:
- Current Score (reflects score at that moment)
- Top Score (updates if a new high score was achieved)
- Games Played (increments with each game)
- Session Duration (increases with time)

### AC4: Always Accessible
**Given** the feedback button is always visible
**When** the player is at any point in their session
**Then** the feedback button remains clickable
**And** the player can give feedback before, during, or after gameplay

### AC5: Independent Submissions
**Given** multiple feedback submissions occur
**When** checking email generation
**Then** each submission is treated independently
**And** the timestamp differentiates each feedback email

### AC6: Form Reset
**Given** a feedback submission was just completed
**When** the player opens the feedback form again
**Then** all form fields are reset to empty/default state:
- Star ratings: unselected (0 stars)
- Text area: empty
- Email input: empty (or pre-filled with last-entered email for convenience)

---

## Technical Notes

**Form Reset Logic:**
```javascript
function resetFeedbackForm() {
  // Reset star ratings
  document.querySelectorAll('.star-rating').forEach(rating => {
    rating.dataset.value = '0';
    updateStarDisplay(rating);
  });

  // Reset text area
  document.querySelector('.feedback-textarea').value = '';

  // Reset email (or keep last email for convenience)
  // Option A: Clear it
  document.querySelector('.feedback-email').value = '';

  // Option B: Remember last email (user-friendly)
  // Leave as-is if already filled
}
```

**When to Reset:**
- After thank you screen closes
- When feedback modal is re-opened after submission

**Implementation:**
- No tracking needed for "already submitted" state
- No localStorage persistence of submission count
- Each submit triggers mailto: independently (no batching)

**Email Differentiation:**
- Timestamp in subject line ensures uniqueness: `[Crazy Snake Feedback] Fun:4 Difficulty:5 | 2026-02-03T14:32:10Z`
- Email client creates separate threads for each submission

---

## UX Considerations

**Why No Limits?**
- Beta testing is about gathering maximum insights
- Player might want to give feedback at different stages:
  - After first game: "Whoa, this is hard!"
  - After 5 games: "Oh I get it now, strategy matters"
  - After 20 games: "High score 500! Still loving it!"
- Each perspective is valuable

**Email Pre-Fill:**
Decision to make: Should email input remember the last-entered value?
- **Pro:** Convenience - player doesn't retype email each time
- **Con:** Might confuse if different people play on same browser

**Recommendation:** Pre-fill email if previously entered (use localStorage for persistence).

---

## Dependencies

- Story 6.1 (Feedback Modal UI)
- Story 6.3 (Auto-Capture Data Collection) - provides updated metadata
- Story 6.4 (Email Submission) - handles each submission independently

---

## Edge Cases

**Rapid Submissions:**
**Given** player clicks feedback button repeatedly
**When** submitting multiple times in quick succession
**Then** each submission generates a unique email
**And** timestamps differentiate each submission
**And** no rate limiting is enforced

**Same Ratings, Different Time:**
**Given** player gives same ratings (e.g., Fun:5, Difficulty:5) twice
**When** viewing the emails
**Then** timestamp and session data differ between submissions
**And** context shows progression (games played, session duration increased)

**Cross-Session Tracking:**
**Given** player closes browser and returns later
**When** submitting feedback in new session
**Then** session-specific data resets (games played, session duration)
**And** persistent data remains (top score from localStorage)

---

## Testing Scenarios

1. **First-time feedback:** Submit with all fields filled
2. **Second feedback:** Re-open form, verify fields are reset
3. **Email persistence:** Enter email once, verify it's pre-filled next time
4. **Updated metadata:** Check that scores, games played, duration update correctly
5. **Cross-browser:** Test in Chrome, Firefox, Safari for email client behavior
6. **Mobile:** Ensure multiple submissions work on mobile devices

---

## Definition of Done

- [ ] Feedback form can be opened and submitted multiple times per session
- [ ] No limits or warnings on submission count
- [ ] Form fields reset after each submission (except optional email pre-fill)
- [ ] Auto-captured data updates correctly for each submission
- [ ] Each submission generates unique email with timestamp
- [ ] Feedback button remains accessible throughout session
- [ ] No performance issues with multiple submissions
- [ ] Email pre-fill works correctly (if implemented)
- [ ] Tested with 5+ submissions in single session
- [ ] Tested across different game states (menu, playing, game over)

---

## 🎯 COMPREHENSIVE DEVELOPER CONTEXT

### Story Objective

Enable **unlimited feedback submissions** per session, allowing players to share evolving thoughts as they gain experience, with proper form resets and updated metadata for each submission.

**CRITICAL SUCCESS FACTORS:**
- No limits on feedback submission count
- Form resets after each submission (clean slate)
- Optional email pre-fill for user convenience
- Each submission has unique timestamp + updated metadata
- No performance degradation with multiple submissions
- Feedback button always accessible

**KEY INSIGHT:**
Players' perceptions evolve with experience:
- **First game:** "Too hard!"
- **After 10 games:** "Challenging but fair!"
- **After 20 games:** "I'm getting good at this!"

**Capturing this evolution provides richer insights than one-time feedback.**

**FILES TO MODIFY:**
- `js/feedback.js` (enhance resetFeedbackForm with email pre-fill logic)
- `js/storage.js` (NEW - optional, for email persistence)

---

### 📋 PREVIOUS STORY PATTERNS

**From Story 6.1 - Form Reset Pattern:**
```javascript
export function resetFeedbackForm() {
  // Reset star ratings to 0
  document.querySelectorAll('.star-rating').forEach(container => {
    container.dataset.rating = '0';
    updateStarDisplay(container, 0);
  });

  // Reset text area
  const textarea = document.getElementById('feedback-comments');
  if (textarea) textarea.value = '';

  // Reset character counter
  const charCount = document.getElementById('char-count');
  if (charCount) charCount.textContent = '0';

  // Email input: TO BE ENHANCED IN STORY 6.5
}
```

**From Story 6.4 - Submission Flow:**
```javascript
export function submitFeedback(gameState) {
  // ... generate email and open mailto: ...

  // Reset form after submission (calls resetFeedbackForm)
  resetFeedbackForm();
}
```

**From Story 6.3 - Metadata Updates:**
- Timestamp: Always current (Date.now())
- Current Score: Updates with gameState.score
- Top Score: Updates if new high score achieved
- Games Played: Increments each game (gameState.gamesPlayed)
- Session Duration: Increases over time

---

### 📁 DETAILED FILE STRUCTURE & IMPLEMENTATION

**js/feedback.js - Enhanced Form Reset with Email Pre-Fill:**

```javascript
// Enhance existing resetFeedbackForm() from Story 6.1

/**
 * Reset feedback form to empty state
 * Story 6.5: Enhanced with email pre-fill for multi-submission UX
 * Used after submission or on modal re-open
 * @param {boolean} keepEmail - Whether to preserve email input (default: true)
 */
export function resetFeedbackForm(keepEmail = true) {
  // Reset star ratings
  document.querySelectorAll('.star-rating').forEach(container => {
    container.dataset.rating = '0';
    updateStarDisplay(container, 0);
  });

  // Reset text area
  const textarea = document.getElementById('feedback-comments');
  if (textarea) textarea.value = '';

  // Reset character counter
  const charCount = document.getElementById('char-count');
  if (charCount) {
    charCount.textContent = '0';
    charCount.style.color = '#888';  // Reset warning color
  }

  // Email input: Keep or clear based on parameter
  if (!keepEmail) {
    const emailInput = document.getElementById('feedback-email');
    if (emailInput) emailInput.value = '';
  }

  console.log('[Feedback] Form reset', keepEmail ? '(email preserved)' : '(email cleared)');
}

// Update submitFeedback to use enhanced reset
export function submitFeedback(gameState) {
  // ... existing submission logic ...

  // Reset form but KEEP email for convenience (Story 6.5)
  resetFeedbackForm(true);  // keepEmail = true
}
```

**js/storage.js - OPTIONAL EMAIL PERSISTENCE:**

```javascript
// NEW MODULE (optional enhancement for Story 6.5)
// Persist email to localStorage for better UX across sessions

const EMAIL_STORAGE_KEY = 'crazysnakeLite_feedbackEmail';

/**
 * Save feedback email to localStorage
 * @param {string} email - Email address to save
 */
export function saveFeedbackEmail(email) {
  if (!email) return;

  try {
    localStorage.setItem(EMAIL_STORAGE_KEY, email);
  } catch (error) {
    console.warn('[Storage] Failed to save email:', error);
  }
}

/**
 * Load saved feedback email from localStorage
 * @returns {string} Saved email or empty string
 */
export function loadFeedbackEmail() {
  try {
    return localStorage.getItem(EMAIL_STORAGE_KEY) || '';
  } catch (error) {
    console.warn('[Storage] Failed to load email:', error);
    return '';
  }
}

/**
 * Clear saved feedback email from localStorage
 */
export function clearFeedbackEmail() {
  try {
    localStorage.removeItem(EMAIL_STORAGE_KEY);
  } catch (error) {
    console.warn('[Storage] Failed to clear email:', error);
  }
}
```

**js/feedback.js - Optional Email Auto-Fill on Init:**

```javascript
// Add to feedback.js if implementing email persistence

import { loadFeedbackEmail, saveFeedbackEmail } from './storage.js';

/**
 * Initialize feedback modal (called once on page load)
 * Story 6.5: Pre-fill email if previously saved
 */
export function initFeedbackModal() {
  // Load saved email from localStorage
  const savedEmail = loadFeedbackEmail();
  if (savedEmail) {
    const emailInput = document.getElementById('feedback-email');
    if (emailInput) {
      emailInput.value = savedEmail;
      console.log('[Feedback] Pre-filled saved email');
    }
  }
}

// Update submitFeedback to save email
export function submitFeedback(gameState) {
  // Get form data
  const formData = getFormData();

  // Save email if provided (for next time)
  if (formData.email) {
    saveFeedbackEmail(formData.email);
  }

  // ... rest of submission logic ...
}
```

**js/main.js - Call Init (if using email persistence):**

```javascript
// Add to existing init() if implementing email persistence
import { initFeedbackModal } from './feedback.js';

function init() {
  // ... existing initialization ...

  // Initialize feedback modal (pre-fill email if saved)
  initFeedbackModal();
}
```

---

### 🧪 COMPREHENSIVE TESTING REQUIREMENTS

**Multi-Submission Test Scenarios:**

1. **First Submission:**
   - Fill all fields (fun:4, difficulty:5, comments, email)
   - Submit feedback
   - Verify email client opens with data
   - Verify thank you screen shows
   - Close thank you screen

2. **Second Submission (Form Reset):**
   - Re-open feedback modal
   - Verify star ratings reset to 0 stars
   - Verify comments text area is empty
   - Verify character counter shows "0/500"
   - Verify email input is PRE-FILLED with previous email (if implemented)

3. **Second Submission (Updated Metadata):**
   - Play 3 more games (total: 4 games now)
   - Achieve new high score
   - Re-open feedback modal
   - Submit with different ratings (fun:5, difficulty:4)
   - Verify email body contains:
     - New ratings (5 and 4)
     - Updated games played (4)
     - Updated session duration (longer)
     - Updated top score (new high score)
     - New timestamp (later than first submission)

4. **Multiple Submissions (5+ times):**
   - Submit feedback 5 times in one session
   - Verify each submission:
     - Opens email client successfully
     - Has unique timestamp in subject line
     - Contains updated metadata
     - Form resets after each submission
   - Verify no performance degradation
   - Verify no memory leaks

5. **Submission from Different Game States:**
   - Submit from menu screen
   - Submit during gameplay (paused)
   - Submit from game over screen
   - Play more games
   - Submit again from menu
   - Verify all work correctly with updated data

6. **Email Pre-Fill Persistence:**
   - Submit feedback with email "test@example.com"
   - Reload page (refresh browser)
   - Open feedback modal
   - Verify email input pre-filled with "test@example.com"

7. **Email Pre-Fill Clear:**
   - Submit without email (leave email blank)
   - Verify previous email is NOT replaced with empty
   - Verify email stays pre-filled on next open

8. **Cross-Session Email Persistence:**
   - Submit with email
   - Close browser completely
   - Re-open game URL
   - Open feedback modal
   - Verify email still pre-filled (localStorage persisted)

9. **No Submission Limits Warning:**
   - Submit 10+ times rapidly
   - Verify no warning messages
   - Verify no "limit reached" popups
   - Verify all submissions processed normally

10. **Metadata Accuracy Across Submissions:**
    - Record metadata from first submission
    - Play 5 games, wait 2 minutes
    - Submit again
    - Compare metadata:
      - Games played: increased by 5
      - Session duration: increased by ~2 minutes
      - Current score: reflects current game score
      - Top score: updated if beaten
      - Timestamp: later than first submission

**Edge Cases:**

11. **localStorage Blocked:**
    - Block localStorage access (browser setting or private mode)
    - Submit feedback
    - Verify email pre-fill doesn't crash
    - Verify feedback still submits successfully

12. **Rapid Repeated Submissions:**
    - Submit feedback
    - Immediately click "Back to Game"
    - Immediately re-open modal
    - Immediately submit again
    - Verify no race conditions or conflicts

13. **Same Ratings Different Context:**
    - Submit fun:5, difficulty:5 at games=1
    - Play 20 games
    - Submit fun:5, difficulty:5 at games=21
    - Verify emails are distinguishable by metadata (games played, duration, score)

---

### ⚠️ KNOWN ISSUES & EDGE CASES

**Issue 1: Email Pre-Fill Privacy**
- Email stored in plain text in localStorage
- Visible to anyone with browser access
- **Acceptable for beta:** Low security risk
- **Post-MVP:** Consider encryption or session-only storage

**Issue 2: Multiple Players on Same Browser**
- Email persists across browser sessions
- Different person might see previous player's email
- **Mitigation:** User can manually clear email input
- **Low risk for beta:** Usually one player per device

**Issue 3: localStorage Quota**
- Storing email address is trivial (< 100 bytes)
- No quota concerns
- **Safe:** High score already uses localStorage

**Issue 4: Metadata Accuracy**
- If player opens feedback modal, waits 10 minutes, then submits
- Session duration will be longer than expected
- **Acceptable:** Metadata captured at submit time, reflects reality

**Issue 5: Feedback Fatigue**
- No limits means player COULD submit 100 times
- Risk of low-quality spam submissions
- **Low risk for beta:** 10-20 engaged users unlikely to spam
- **Acceptable:** Quality feedback comes from motivated users

---

### 📚 TECHNICAL REFERENCES

**localStorage Pattern:**
```javascript
// Save
localStorage.setItem('key', 'value');

// Load
const value = localStorage.getItem('key') || 'default';

// Remove
localStorage.removeItem('key');

// Error handling
try {
  localStorage.setItem('key', 'value');
} catch (e) {
  // Handle quota exceeded or blocked
}
```

**Form Reset Pattern:**
```javascript
// Reset input value
input.value = '';

// Reset custom data attribute
element.dataset.rating = '0';

// Preserve specific field
if (keepEmail) {
  // Don't reset email input
} else {
  emailInput.value = '';
}
```

---

### 🎨 UX DESIGN RATIONALE

**Why Keep Email Pre-Filled?**
- **Convenience:** User doesn't retype email each time
- **Encourages multiple submissions:** Lower friction
- **Standard UX pattern:** Forms remember user input

**Why No Submission Limits?**
- **Beta testing goal:** Maximize insights
- **Player perception evolves:** Early vs late-game feedback differs
- **Timestamps differentiate:** Each submission is unique

**Feedback Evolution Example:**
```
Submission 1 (Game 1, 30 seconds in):
Fun: 2, Difficulty: 5, Comment: "Way too hard!"

Submission 2 (Game 10, 5 minutes in):
Fun: 4, Difficulty: 4, Comment: "Getting the hang of it, really fun!"

Submission 3 (Game 25, 15 minutes in):
Fun: 5, Difficulty: 5, Comment: "Perfect difficulty, love the chaos!"
```

**This evolution is EXACTLY what we want to capture for beta validation.**

---

### ✅ COMPLETION CHECKLIST

Before marking story as "done":

- [ ] resetFeedbackForm() enhanced with keepEmail parameter
- [ ] Email input preserved after submission (keepEmail=true)
- [ ] Star ratings reset to 0 after submission
- [ ] Comments text area cleared after submission
- [ ] Character counter reset to "0/500" after submission
- [ ] Optional: storage.js created for email persistence
- [ ] Optional: Email auto-filled from localStorage on init
- [ ] Optional: Email saved to localStorage on submit
- [ ] Tested: Multiple submissions (5+) in single session
- [ ] Verified: Each submission has unique timestamp
- [ ] Verified: Metadata updates correctly (games, duration, score)
- [ ] Verified: No performance issues with 10+ submissions
- [ ] Verified: Email pre-fill works (if implemented)
- [ ] Verified: No submission limit warnings
- [ ] Tested: Submissions from different game states
- [ ] Tested: Cross-session email persistence (if implemented)
- [ ] Tested: localStorage error handling (blocked/quota)
- [ ] No console errors or warnings
