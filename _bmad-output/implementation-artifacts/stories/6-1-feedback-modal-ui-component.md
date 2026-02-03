# Story 6.1: Feedback Modal UI Component

**Epic:** Epic 6 - User Feedback Collection System
**Status:** 📋 TODO
**Priority:** High
**Estimated Effort:** Medium

---

## User Story

**As a** beta player,
**I want** a quick, simple feedback form,
**So that** I can share my experience in under 15 seconds.

---

## Acceptance Criteria

### AC1: Modal Display
**Given** the feedback button is clicked
**When** the modal opens
**Then** a feedback form overlay appears
**And** the modal uses the same visual styling as other menu screens (retro aesthetic)
**And** the modal is centered on screen

### AC2: Form Elements
**Given** the feedback form is displayed
**When** viewing the form elements
**Then** two 5-star rating inputs are visible: "How fun is Crazy Snake?" and "How's the difficulty?"
**And** each star rating is tappable/clickable for instant rating (no sliders)
**And** an optional text area is shown with label "Anything else to share? (optional)"
**And** the text area has a 500-character limit
**And** an optional single-line email input is shown with label "Want beta updates? (optional email)"
**And** a "Submit Feedback" button is visible and always enabled

### AC3: Game Pause Behavior
**Given** the feedback form modal is open
**When** checking the game state
**Then** the game is auto-paused if it was in 'playing' phase
**And** the game board is visible but blurred underneath (like phone overlay)

### AC4: Mobile Responsiveness
**Given** the feedback form is displayed on mobile
**When** viewing on small screens
**Then** the modal scales appropriately to fit viewport
**And** star ratings are large enough for easy tapping
**And** text input is accessible without keyboard obscuring content

### AC5: Visual Consistency
**Given** the modal is styled
**When** comparing to other game screens
**Then** the design is consistent with main menu and game over screens
**And** the retro pixel art aesthetic is maintained
**And** buttons use the same styling as other game buttons

---

## Technical Notes

**DOM Structure:**
- Create feedback-modal DOM element in index.html
- Style in style.css matching existing menu screens
- Modal structure: feedback-container > feedback-form > (star-ratings + text-area + email-input + submit-button)

**Implementation Details:**
- Use CSS blur on game canvas when modal active (same as phone overlay pattern)
- Star rating: 5 clickable star icons (☆ empty, ★ filled)
- Implement click handlers for star rating (1-5 selection)
- Text area with maxlength="500" attribute
- Email input with type="email" for basic validation

**CSS Classes:**
- `.feedback-modal` - Main modal container
- `.feedback-form` - Form wrapper
- `.star-rating` - Star rating component
- `.feedback-textarea` - Text input area
- `.feedback-email` - Email input field
- `.submit-feedback-btn` - Submit button

---

## Dependencies

- gameState.phase management (for auto-pause)
- Existing CSS retro styling patterns
- Phone overlay blur pattern (reuse same approach)

---

## Definition of Done

- [ ] Feedback modal renders with all form elements
- [ ] Star ratings are clickable and update visually
- [ ] Text area enforces 500 character limit
- [ ] Email input accepts valid email format
- [ ] Modal matches retro aesthetic of other screens
- [ ] Game auto-pauses when modal opens during gameplay
- [ ] Game canvas shows blur effect when modal is active
- [ ] Modal is responsive on mobile devices
- [ ] All form fields are accessible via keyboard
- [ ] Submit button is always enabled (even with empty fields)
