# Story 6.2: Feedback Button Integration

**Epic:** Epic 6 - User Feedback Collection System
**Status:** 📋 TODO
**Priority:** High
**Estimated Effort:** Small

---

## User Story

**As a** beta player,
**I want** a feedback button always available,
**So that** I can share feedback when I'm in the right mindset (not just after losing).

---

## Context

This story implements the key insight from our party mode discussion: feedback should be player-initiated, not prompted at emotional low points (like game over). This prevents sampling bias where frustrated players give skewed negative feedback.

---

## Acceptance Criteria

### AC1: Always-Visible Button
**Given** the game has loaded
**When** viewing any game screen (menu, playing, paused, game over)
**Then** a "Feedback" button is visible
**And** the button is positioned in top-right area of the screen (or integrated into menu UI)
**And** the button is subtle and unobtrusive (not a call-to-action style)

### AC2: Desktop Display
**Given** the feedback button is displayed
**When** viewing on desktop
**Then** the button shows "Feedback" text with optional icon (💬)
**And** the button uses consistent styling with other game buttons

### AC3: Mobile Display
**Given** the feedback button is displayed on mobile
**When** viewing on small screens
**Then** the button may show just an icon (💬) to save space
**And** the button remains easily tappable (min 44x44px tap target)

### AC4: Auto-Pause During Gameplay
**Given** the game is in 'playing' phase
**When** the player clicks the feedback button
**Then** the game auto-pauses immediately
**And** the feedback modal opens
**And** the game board is visible but blurred underneath

### AC5: Modal Opening from Other States
**Given** the game is in 'menu' or 'gameover' phase
**When** the player clicks the feedback button
**Then** the feedback modal opens immediately
**And** the game remains in its current phase

### AC6: Discoverability vs Intrusiveness
**Given** the feedback button is always visible
**When** checking discoverability
**Then** the button is visible without being aggressive or distracting
**And** the button placement respects existing UI (score display, game board)

---

## Technical Notes

**Implementation:**
- Add feedback-button element to index.html
- Position using CSS (top-right corner, absolute positioning)
- Add click handler to trigger modal opening
- Auto-pause logic: if gameState.phase === 'playing', set to 'paused' on modal open

**Button Placement Options:**
1. Top-right corner (outside game canvas)
2. Integrated into menu bar
3. Fixed position that scrolls with page (if applicable)

**Responsive Considerations:**
- Desktop: Show full "Feedback" text + icon
- Tablet: Show "Feedback" or icon based on available space
- Mobile: Show icon only (💬) to conserve space

**CSS Classes:**
- `.feedback-button` - Main button styling
- `.feedback-button-desktop` - Desktop-specific styling
- `.feedback-button-mobile` - Mobile-specific styling
- `.feedback-icon` - Icon styling

---

## Dependencies

- Story 6.1 (Feedback Modal UI Component) - modal must exist to open
- gameState.phase management
- Existing button styling patterns

---

## Design Considerations

**Why Always Visible?**
From party mode discussion: "When a player is losing, I'm not sure if it's the right time to ask feedback. Because this is maybe the most frustrating moment in the user experience." - Tomoco

**Bias Prevention:**
- GAME OVER feedback = emotional response bias (frustration spike)
- Always-visible = self-selected timing (player chooses calm moment)
- Result: Higher quality, less emotionally-charged feedback

---

## Definition of Done

- [ ] Feedback button is visible on all game screens
- [ ] Button positioned in top-right area without obstructing gameplay
- [ ] Button shows appropriate text/icon based on screen size
- [ ] Clicking button opens feedback modal (Story 6.1)
- [ ] Game auto-pauses when button clicked during gameplay
- [ ] Button styling matches existing game button aesthetic
- [ ] Button is keyboard accessible (tab navigation)
- [ ] Button meets minimum tap target size on mobile (44x44px)
- [ ] Button remains visible but unobtrusive
