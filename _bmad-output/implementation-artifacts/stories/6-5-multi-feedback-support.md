# Story 6.5: Multi-Feedback Support

**Epic:** Epic 6 - User Feedback Collection System
**Status:** 📋 TODO
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
