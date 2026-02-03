# Story 6.2: Feedback Button Integration

**Epic:** Epic 6 - User Feedback Collection System
**Status:** review
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

---

## 🎯 COMPREHENSIVE DEVELOPER CONTEXT

### Story Objective

Implement an **always-visible Feedback Button** that enables beta players to submit feedback at any time during their session (not just after game over), preventing sampling bias from emotional low points and ensuring high-quality, unbiased feedback.

**CRITICAL SUCCESS FACTORS:**
- Button visible on ALL screens (menu, playing, paused, game over)
- Subtle and unobtrusive (not a call-to-action style)
- Opens feedback modal from Story 6.1
- Auto-pauses game if clicked during gameplay
- Mobile-friendly (44x44px minimum tap target)
- Consistent styling with existing game buttons

**KEY INSIGHT FROM PARTY MODE DISCUSSION:**
"When a player is losing, I'm not sure if it's the right time to ask feedback. Because this is maybe the most frustrating moment in the user experience." - Tomoco

**Solution:** Always-visible button allows player-initiated feedback at calm moments, not forced at emotional spikes.

**FILES TO MODIFY:**
- `index.html` (add feedback button element)
- `css/style.css` (button positioning and styling)
- `js/main.js` (add click handler for feedback button)
- `js/feedback.js` (already created in Story 6.1)

---

### 📋 PREVIOUS STORY LEARNINGS

**From Story 6.1 - Feedback Modal UI:**

**REUSABLE FUNCTIONS:**
- `openFeedbackModal(gameState)` - already implemented
- `closeFeedbackModal(gameState)` - already implemented
- Auto-pause logic - handled in openFeedbackModal()

**PATTERN TO FOLLOW:**
```javascript
// From feedback.js (Story 6.1)
export function openFeedbackModal(gameState) {
  previousPhase = gameState.phase;

  if (gameState.phase === 'playing') {
    gameState.phase = 'paused';  // Auto-pause
  }

  // Show modal...
}
```

**From Epic 4 - Menu Screens:**

**BUTTON STYLING PATTERN:**
```css
/* Example from game over screen (Story 4.3) */
.btn {
  font-family: 'Press Start 2P', monospace;
  background-color: #000;
  color: #fff;
  border: 2px solid #fff;
  padding: 10px 20px;
  cursor: pointer;
}

.btn:hover {
  background-color: #333;
  border-color: #FFD700;
}
```

**LESSON LEARNED:**
- Buttons should be consistent across all screens
- Retro pixel art aesthetic maintained
- Clear hover states for desktop
- Large enough touch targets for mobile (min 44x44px per iOS guidelines)

**From Story 4.4 - Menu Navigation and Pause:**

**ESC KEY PATTERN:**
```javascript
// Esc key opens menu screen (pauses game)
// Similar pattern: Feedback button should also pause game
```

---

### 🏗️ ARCHITECTURE COMPLIANCE

✅ **MODULE BOUNDARIES:**
- DOM manipulation in `main.js` (register button click handler)
- Feedback logic in `feedback.js` (call openFeedbackModal)
- NO direct DOM manipulation in game loop

✅ **NAMING CONVENTIONS:**
- Button ID: `#feedback-button` (kebab-case)
- CSS class: `.feedback-button` (kebab-case)
- Function names: `handleFeedbackClick()` (camelCase)

✅ **CODE STYLE:**
- 2-space indentation
- Single quotes for strings
- Named exports only
- Pass gameState explicitly

---

### 📁 DETAILED FILE STRUCTURE & IMPLEMENTATION

**index.html - Add Feedback Button:**

```html
<!-- Add feedback button after game canvas, before overlays -->
<div class="game-container">
  <canvas id="game-canvas" width="500" height="400"></canvas>

  <!-- NEW: Always-visible Feedback Button -->
  <button id="feedback-button" class="feedback-button" aria-label="Give Feedback">
    <span class="feedback-button-text">Feedback</span>
    <span class="feedback-button-icon">💬</span>
  </button>

  <!-- Existing overlays below -->
  <div id="phone-overlay" class="hidden">...</div>
  <div id="feedback-modal" class="hidden">...</div>
</div>
```

**css/style.css - Button Styling:**

```css
/* Feedback Button - Always Visible */
.feedback-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 500;  /* Above canvas, below overlays */

  /* Styling */
  font-family: 'Press Start 2P', monospace;
  font-size: 12px;
  background-color: rgba(26, 26, 26, 0.9);
  color: #9D4EDD;
  border: 2px solid #9D4EDD;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;

  /* Flexbox for icon + text */
  display: flex;
  align-items: center;
  gap: 6px;

  /* Transitions */
  transition: all 0.2s ease;
}

.feedback-button:hover {
  background-color: #9D4EDD;
  color: #fff;
  border-color: #FFD700;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(157, 78, 221, 0.3);
}

.feedback-button:active {
  transform: translateY(0);
}

.feedback-button-icon {
  font-size: 16px;
}

/* Desktop: Show text + icon */
.feedback-button-text {
  display: inline;
}

/* Mobile: Hide text, show icon only */
@media (max-width: 768px) {
  .feedback-button {
    padding: 10px;
    min-width: 44px;  /* iOS minimum tap target */
    min-height: 44px;
    justify-content: center;
  }

  .feedback-button-text {
    display: none;  /* Hide text on mobile */
  }

  .feedback-button-icon {
    font-size: 20px;
  }
}

/* Ensure button doesn't obstruct score display */
.score-display {
  top: 10px;
  left: 50%;
  transform: translateX(-50%);
  /* Centered at top, won't conflict with top-right feedback button */
}
```

**js/main.js - Add Click Handler:**

```javascript
// Add to existing imports
import { openFeedbackModal } from './feedback.js';

// In init() function or DOMContentLoaded:
function init() {
  // ... existing initialization ...

  // Feedback button click handler
  const feedbackButton = document.getElementById('feedback-button');
  if (feedbackButton) {
    feedbackButton.addEventListener('click', () => {
      handleFeedbackClick(gameState);
    });
  }
}

/**
 * Handle feedback button click
 * Opens feedback modal and auto-pauses game if playing
 * @param {Object} gameState - Current game state
 */
function handleFeedbackClick(gameState) {
  // openFeedbackModal already handles auto-pause (from Story 6.1)
  openFeedbackModal(gameState);

  // Log for analytics (optional - Story 6.3 will use this)
  console.log('[Feedback] Button clicked - Phase:', gameState.phase);
}
```

---

### 🧪 COMPREHENSIVE TESTING REQUIREMENTS

**Test Scenarios:**

1. **Visibility on All Screens:**
   - Load game → verify button visible on menu screen
   - Start game → verify button visible during gameplay
   - Die → verify button visible on game over screen
   - Press Esc → verify button visible on paused menu

2. **Button Positioning:**
   - Desktop: Verify button in top-right corner
   - Verify button doesn't overlap score display
   - Verify button doesn't obstruct gameplay area
   - Resize window → verify button stays positioned correctly

3. **Button Content:**
   - Desktop: Verify shows "Feedback" text + 💬 icon
   - Mobile (< 768px): Verify shows only 💬 icon
   - Verify icon is clearly visible

4. **Click Behavior from Different States:**
   - Menu screen: Click button → modal opens, phase stays 'menu'
   - Playing: Click button → modal opens, phase changes to 'paused'
   - Game over: Click button → modal opens, phase stays 'gameover'
   - Paused: Click button → modal opens, phase stays 'paused'

5. **Auto-Pause Testing:**
   - Start game, snake moving
   - Click feedback button
   - Verify game pauses (snake stops moving)
   - Verify gameState.phase === 'paused'
   - Close modal
   - Verify game resumes (phase restored to 'playing')

6. **Mobile Tap Target:**
   - Mobile device: Verify button is at least 44x44px
   - Verify button is easily tappable
   - Verify no accidental taps on nearby elements

7. **Keyboard Accessibility:**
   - Tab to feedback button
   - Verify focus visible (outline or highlight)
   - Press Enter → modal opens
   - Press Space → modal opens

8. **Styling Consistency:**
   - Compare button to existing game buttons
   - Verify retro aesthetic maintained
   - Verify hover state works on desktop
   - Verify active state (press down) works

9. **Unobtrusiveness:**
   - Play game for 30 seconds
   - Verify button is visible but not distracting
   - Verify button doesn't draw excessive attention
   - Verify semi-transparent background works

10. **Cross-Browser Testing:**
    - Chrome: Verify button displays correctly
    - Firefox: Verify button displays correctly
    - Safari: Verify button displays correctly
    - Edge: Verify button displays correctly
    - Mobile Safari (iOS): Verify tap target size adequate

---

### 🎨 DESIGN CONSIDERATIONS

**Why Top-Right Corner?**
- Standard location for secondary actions (help, settings, feedback)
- Doesn't conflict with score display (top-center)
- Doesn't interfere with gameplay area (center)
- Easily accessible on both desktop and mobile

**Why Semi-Transparent Background?**
- `rgba(26, 26, 26, 0.9)` allows game to be visible underneath
- Reduces visual weight (less intrusive)
- Maintains readability with border and text color

**Why Show Icon Only on Mobile?**
- Saves screen real estate
- 💬 icon is universally recognized for feedback/comments
- Larger tap target (44x44px) when only showing icon

**Alternative Placements Considered:**
1. **Top-left:** Conflicts with potential menu button
2. **Bottom-right:** Too close to gameplay area
3. **Integrated into menu bar:** Requires menu bar to exist always
4. **Top-right (chosen):** Best balance of visibility and unobtrusiveness

---

### ⚠️ KNOWN ISSUES & EDGE CASES

**Issue 1: Button Obstruction on Small Screens**
- On very small mobile screens (<320px width), button might overlap score
- **Solution:** Use media query to adjust position or hide text earlier

**Issue 2: Z-Index Layering**
- Feedback button: z-index 500
- Phone overlay: z-index 900
- Feedback modal: z-index 1000
- **Solution:** Button should be below overlays, which is correct

**Issue 3: Button Visible During Phone Call**
- Phone overlay already covers button (z-index 900 > 500)
- **Expected behavior:** Button not clickable during phone call (overlayed)

**Issue 4: Emoji Rendering Differences**
- 💬 emoji may look different across browsers/OS
- **Fallback:** Use Unicode emoji or SVG icon if needed

**Issue 5: Focus State on Mobile**
- Touch devices don't show focus states typically
- **Solution:** Focus states are for keyboard navigation (desktop)

---

### 📚 TECHNICAL REFERENCES

**iOS Touch Target Guidelines:**
- Minimum: 44x44 CSS pixels
- Recommended: 48x48 CSS pixels
- Current implementation: 44x44px on mobile ✅

**Positioning Pattern:**
```css
/* Fixed positioning for always-visible button */
.feedback-button {
  position: fixed;  /* Stays in viewport regardless of scroll */
  top: 20px;
  right: 20px;
  z-index: 500;     /* Above canvas, below overlays */
}
```

**Responsive Text/Icon Toggle:**
```css
/* Desktop: Show both */
.feedback-button-text { display: inline; }
.feedback-button-icon { display: inline; }

/* Mobile: Hide text, show icon only */
@media (max-width: 768px) {
  .feedback-button-text { display: none; }
  .feedback-button-icon { display: inline; }
}
```

---

### ✅ COMPLETION CHECKLIST

Before marking story as "done":

- [ ] Button element added to index.html
- [ ] CSS styling added (desktop and mobile responsive)
- [ ] Click handler added to main.js
- [ ] Button visible on menu screen
- [ ] Button visible during gameplay
- [ ] Button visible on game over screen
- [ ] Button visible when game paused
- [ ] Button positioned in top-right without obstructing score/gameplay
- [ ] Desktop: Shows "Feedback" + 💬 icon
- [ ] Mobile: Shows only 💬 icon (44x44px min size)
- [ ] Clicking button opens feedback modal (Story 6.1)
- [ ] Auto-pause works when clicked during gameplay
- [ ] Hover state works on desktop
- [ ] Keyboard accessible (Tab + Enter/Space)
- [ ] Focus state visible for keyboard users
- [ ] Cross-browser tested (Chrome, Firefox, Safari, Edge)
- [ ] Mobile tested on real device
- [ ] Button styling matches retro aesthetic
- [ ] Button is unobtrusive (not distracting during gameplay)
- [ ] No console errors or warnings

---

## 📝 Implementation Record

### Tasks / Subtasks

- [x] Task 1: Add feedback button to index.html
  - [x] Add button element with text and icon
  - [x] Position after score display, before overlays
  - [x] Add aria-label for accessibility

- [x] Task 2: Add CSS styling for feedback button
  - [x] Position fixed in top-right corner (20px from top and right)
  - [x] Style with retro aesthetic (Jersey20 font, purple colors)
  - [x] Add hover and active states
  - [x] Add focus state for keyboard accessibility
  - [x] Implement responsive design (text+icon desktop, icon-only mobile)
  - [x] Ensure 44x44px minimum tap target on mobile

- [x] Task 3: Wire up click handler in main.js
  - [x] Add event listener to feedback button
  - [x] Call openFeedbackModal(gameState) on click
  - [x] Log button click for debugging

### Dev Agent Record

**Agent Model Used:** Claude Sonnet 4.5

**Implementation Summary:**

Story 6.2 implements an always-visible Feedback Button that allows beta players to submit feedback at any time during their session (not just after game over), preventing sampling bias from emotional low points.

**What Was Implemented:**

1. **HTML Button (index.html):**
   - Added `<button id="feedback-button">` after score display
   - Includes text span ("Feedback") and icon span (💬)
   - Aria-label for screen reader accessibility

2. **CSS Styling (css/style.css):**
   - Fixed positioning: top-right corner (20px from edges)
   - Z-index: 500 (above canvas, below overlays)
   - Background: rgba(26, 26, 26, 0.9) - semi-transparent dark
   - Colors: #9D4EDD purple (matches modal styling)
   - Hover effect: Fills with purple, gold border, lifts up
   - Active effect: Returns to normal position
   - Focus state: Gold outline for keyboard navigation
   - Desktop: Shows "Feedback" text + 💬 icon
   - Mobile (<768px): Shows only 💬 icon, 44x44px minimum size

3. **Click Handler (js/main.js):**
   - Added event listener to feedback button
   - Calls `openFeedbackModal(gameState)` on click
   - Auto-pause logic already handled in openFeedbackModal (Story 6.1)
   - Console log for debugging

**Technical Decisions:**

- **Always Visible:** `position: fixed` ensures button visible on all screens
- **Top-Right Placement:** Standard location for secondary actions, doesn't conflict with score (top-center) or gameplay (center)
- **Semi-Transparent:** rgba(26, 26, 26, 0.9) reduces visual weight, less intrusive
- **Icon-Only Mobile:** Saves screen space, 💬 emoji is universally recognized
- **Z-Index 500:** Below overlays (phone=900, modal=1000) so it's not clickable during interruptions

**Architecture Compliance:**

✅ Click handler in main.js (DOM manipulation in designated module)
✅ Uses existing openFeedbackModal from feedback.js (Story 6.1)
✅ Passes gameState explicitly
✅ Follows naming conventions (kebab-case IDs/classes, camelCase functions)
✅ Retro aesthetic maintained (Jersey20 font, purple/gold colors)

**Testing:**

Button can be tested in browser:
- Visible on all screens (menu, playing, game over, paused)
- Click button → opens feedback modal
- During gameplay → game auto-pauses when modal opens
- Mobile view → shows only 💬 icon
- Desktop → shows "Feedback" text + icon

### File List

**Files Modified:**
- `index.html` - Added feedback button element
- `css/style.css` - Added feedback button styling (~70 lines)
- `js/main.js` - Added click event listener

### Change Log

- 2026-02-03: Story 6.2 implementation complete
  - Added always-visible feedback button to index.html
  - Added CSS styling with responsive design
  - Wired up click handler in main.js
  - Button opens feedback modal from Story 6.1
  - Auto-pause works when clicked during gameplay
  - Status: Implementation complete, ready for testing
