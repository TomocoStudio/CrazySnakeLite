# Story 16.6: Implement Play Now Button

**Epic:** 16 - Skill Map Dashboard (The Cognitive Mirror)

**As a** player,
**I want** a clear "Play Now" button on the Skill Map,
**So that** I can quickly jump into a game after checking my profile.

---

## Acceptance Criteria

**Given** Skill Map displays
**When** rendering action buttons
**Then** show "Play Now" button prominently:
```
┌──────────────┐
│   PLAY NOW   │
└──────────────┘
```
**And** button uses standard style: 8px rounded corners, purple border, Jersey20 20px, white text
**And** positioned below caller quote, centered

**Given** player clicks "Play Now" button
**When** button is pressed
**Then** transition directly to new game (phase: 'playing')
**And** Skill Map overlay fades out (300ms)
**And** game initializes immediately (no menu screen)

**Given** player hovers over "Play Now" button
**When** mouse enters button area
**Then** button background changes to purple rgb(157, 178, 221)
**And** scale animation: transform: scale(1.05)
**And** cursor: pointer

**Given** mobile viewport (< 768px)
**When** "Play Now" button renders
**Then** increase button size to full-width (within padding)
**And** minimum 44px height for touch target

**Per FR179:** "Play Now" button always visible on dashboard (dashboard is launchpad, not dead end)

---

## Dev Section

### Technical Context

**Story Purpose:** Implement the primary call-to-action on the Skill Map dashboard. "Play Now" transitions directly from Skill Map → new game, skipping the main menu. This is the critical conversion point — the dashboard's job is to make the player want to play.

**Architecture Pattern:** Button click handler already scaffolded in main.js (from Story 16.1). This story adds CSS styling (hover/active states, mobile touch targets) and ensures smooth phase transition with 300ms fade-out.

**Key UX Insight:** The dashboard is a launchpad, not a dead end (FR179). "Play Now" is always visible, always prominent, always the default action.

### Files to Modify

**MODIFY:**
- `css/style.css` — Add Play Now button styles (hover, active, mobile)
- `js/main.js` — Already has click handler from 16.1, verify fade-out transition

**READ (context):**
- `js/state.js` — Understand phase transition ('skillmap' → 'playing')
- `js/game.js` — Understand resetGame() call on new game start

### Implementation Guidance

#### 1. Button Handler (js/main.js)

**Already implemented in Story 16.1, verify:**

```javascript
// main.js — Play Now button handler (from 16.1)
const playNowBtn = document.getElementById('play-now-btn');

playNowBtn.addEventListener('click', () => {
  resetGame(gameState);
  gameState.phase = 'playing';
  handleUIUpdate(gameState);
  if (!gameLoopRunning) startGameLoop();
});
```

**Phase transition logic (from 16.1 handleUIUpdate):**

```javascript
function handleUIUpdate(gameState) {
  const { phase } = gameState;

  // Hide all screens
  menuScreen.classList.add('hidden');
  gameoverScreen.classList.add('hidden');
  skillMapScreen.classList.add('hidden');
  scoreDisplay.classList.add('hidden');

  if (phase === 'menu') {
    menuScreen.classList.remove('hidden');
  } else if (phase === 'playing') {
    scoreDisplay.classList.remove('hidden');
    // Skill Map fades out via CSS transition
  } else if (phase === 'gameover') {
    gameoverScreen.classList.remove('hidden');
  } else if (phase === 'skillmap') {
    skillMapScreen.classList.remove('hidden');
    dashboard.renderSkillMap();
  }
}
```

**Critical:** The `.hidden` class toggle triggers CSS transition. No JavaScript animation needed.

#### 2. CSS Styling (css/style.css)

**Add Play Now button styles:**

```css
/* === Play Now Button === */
#play-now-btn {
  display: block;
  margin: 20px auto;
  padding: 12px 40px;
  font-family: 'Jersey20', sans-serif;
  font-size: 20px;
  font-weight: bold;
  color: #FFFFFF;
  background: transparent;
  border: 3px solid rgb(157, 178, 221);  /* Purple theme */
  border-radius: 8px;
  cursor: pointer;
  transition: all 200ms ease-in-out;
}

#play-now-btn:hover {
  background: rgb(157, 178, 221);  /* Solid purple fill */
  color: #1A1A2E;  /* Dark text on purple background */
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(157, 178, 221, 0.6);  /* Glow effect */
}

#play-now-btn:active {
  transform: scale(0.98);  /* Press down effect */
  box-shadow: 0 0 8px rgba(157, 178, 221, 0.8);
}

#play-now-btn:focus {
  outline: 2px solid rgb(157, 178, 221);
  outline-offset: 4px;
}

/* Mobile responsive — full-width, larger touch target */
@media (max-width: 768px) {
  #play-now-btn {
    width: 100%;
    max-width: 300px;
    min-height: 44px;  /* WCAG touch target minimum */
    font-size: 18px;
    padding: 14px 20px;
  }
}
```

**Screen fade-out transition:**

```css
/* === Skill Map Screen Transition === */
#skill-map-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 350;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 300ms ease-in-out;
}

#skill-map-screen.hidden {
  opacity: 0;
  pointer-events: none;  /* Prevent interaction during fade-out */
  /* Display removed after transition completes */
}
```

**Reduced motion handling:**

```css
/* Disable transitions if prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  #play-now-btn {
    transition: none;
  }

  #play-now-btn:hover {
    transform: none;
  }

  #skill-map-screen {
    transition: none;
  }
}
```

#### 3. Keyboard Navigation (js/input.js)

**Already implemented in Story 16.1, verify:**

```javascript
// input.js — navigateMenuOptions() (from 16.1)
function getAvailableButtons(phase) {
  if (phase === 'menu') {
    return [newGameBtn, skillMapMenuBtn];
  } else if (phase === 'gameover') {
    return [playAgainBtn, skillMapGameoverBtn];
  } else if (phase === 'skillmap') {
    return [playNowBtn, backToMenuLink];  // Play Now is first (default selected)
  }
  return [];
}
```

**Critical:** Play Now is the FIRST button in the array → default selected → Enter key activates.

### Testing Guidance

**Manual Testing Checklist:**

1. **Button Click (Desktop):**
   - [ ] Click Play Now on Skill Map → new game starts immediately
   - [ ] Skill Map fades out (300ms transition)
   - [ ] Game canvas renders, snake starts at initial position
   - [ ] No flash or visual jank during transition

2. **Button Hover States:**
   - [ ] Hover → background fills with purple rgb(157, 178, 221)
   - [ ] Hover → text color changes to dark #1A1A2E
   - [ ] Hover → scale increases to 1.05
   - [ ] Hover → glow effect appears (box-shadow)
   - [ ] Leave hover → smooth transition back to default

3. **Button Active State:**
   - [ ] Click and hold → scale reduces to 0.98 (press down effect)
   - [ ] Release → scale returns to 1.05 (hover state)

4. **Keyboard Navigation:**
   - [ ] On Skill Map, Press Tab → Play Now receives focus
   - [ ] Press Enter → new game starts
   - [ ] Focus outline visible (2px solid purple, 4px offset)

5. **Mobile Touch:**
   - [ ] Button renders full-width (max 300px)
   - [ ] Minimum 44px height (WCAG touch target)
   - [ ] Tap → new game starts (no hover jank)
   - [ ] No double-tap required

6. **Phase Transition:**
   - [ ] gameState.phase changes from 'skillmap' → 'playing'
   - [ ] resetGame() called (score reset, snake reset)
   - [ ] Game loop running (if not already)
   - [ ] Score display visible after transition

7. **Reduced Motion:**
   - [ ] User with prefers-reduced-motion enabled → no scale animation
   - [ ] Skill Map fade-out instant (no 300ms transition)

### Definition of Done

- [x] Play Now button styled with purple border rgb(157, 178, 221), white text
- [x] Hover state: solid purple fill, dark text #1A1A2E, scale 1.05, glow effect
- [x] Active state: scale 0.98 (press down effect)
- [x] Focus outline visible (2px solid purple, 4px offset)
- [x] Mobile: full-width (max 300px), minimum 44px height (WCAG compliant)
- [x] Click handler transitions phase from 'skillmap' → 'playing' (from Story 16.1)
- [x] Skill Map fades out (300ms opacity transition)
- [x] Keyboard navigation: Tab cycles to Play Now, Enter activates (from Story 16.1)
- [x] Reduced motion: no scale animation, instant fade (@media prefers-reduced-motion)
- [x] CSS formatting validated
- [ ] Manual testing checklist passed (7/7 scenarios) — **Recommend user browser testing**

### Dependencies

**Blocked By:**
- Story 16.1 complete (button handler scaffolded in main.js)
- Story 16.5 complete (quote appears above button)

**Blocks:**
- Story 16.7 (Back to Menu link appears below Play Now)

### References

- [Source: ux-design-cognitive-dashboard.md — Play Now Button, Dashboard as Launchpad]
- [Source: project-context.md — V3 Phase Navigation, Button Styling Patterns]
- [Source: main.js — handleUIUpdate(), playNowBtn click handler]

---

## Tasks/Subtasks

### Task 1: Verify existing handler in main.js
- [x] Play Now button click handler already implemented in Story 16.1
- [x] Phase transition logic exists in handleUIUpdate()
- [x] Keyboard navigation already includes Play Now button

### Task 2: Add CSS button styling
- [x] Add #play-now-btn base styles (purple border, white text, transparent background)
- [x] Add hover state (solid purple fill, dark text, scale 1.05, glow)
- [x] Add active state (scale 0.98 press effect)
- [x] Add focus state (2px outline, 4px offset)
- [x] Add mobile responsive styles (full-width max 300px, 44px min-height)

### Task 3: Add screen transition styling
- [x] Add #skill-map-screen opacity: 1 and transition: opacity 300ms
- [x] Add .hidden state with opacity: 0 and pointer-events: none
- [x] Verified existing .hidden class toggle in main.js

### Task 4: Add reduced motion support
- [x] Disable button scale animations if prefers-reduced-motion
- [x] Disable screen fade transition if prefers-reduced-motion
- [x] Added @media (prefers-reduced-motion: reduce) rules

### Task 5: Manual testing and validation
- [ ] Test button click and phase transition
- [ ] Test hover/active/focus states
- [ ] Test keyboard navigation (Tab + Enter)
- [ ] Test mobile touch targets (44px minimum)
- [ ] Test reduced motion behavior

---

## Dev Agent Record

### Implementation Plan

**Implementation Date:** 2026-02-16

**Approach:**
Story 16.6 adds CSS styling for the Play Now button. The button functionality was already implemented in Story 16.1 (click handler, keyboard navigation). This story focuses on visual presentation: hover states, mobile touch targets, and smooth phase transitions.

**Key Components:**
1. **Button Styling** — Purple border theme, hover fill, scale animations
2. **Touch Targets** — WCAG-compliant 44px minimum height on mobile
3. **Screen Transition** — 300ms opacity fade when transitioning to game
4. **Accessibility** — Focus outlines, reduced motion support

**Design Decisions:**
- Purple theme: rgb(157, 178, 221) (matches existing color scheme)
- Scale on hover: 1.05 (subtle emphasis)
- Scale on active: 0.98 (press down feedback)
- Mobile max-width: 300px (centered, not edge-to-edge)
- Transition duration: 300ms (smooth but not sluggish)

### Debug Log

**No issues encountered during implementation.**

All CSS changes completed successfully:
- Added #play-now-btn styles with hover/active/focus states
- Added #skill-map-screen transition styles (opacity 300ms)
- Added reduced motion support for both button and screen
- All CSS rules properly formatted and validated

### Completion Notes

**Implementation Status:** Code complete, ready for manual browser testing

**Completed:**
- ✅ All 4 implementation tasks (Tasks 1-4) completed
- ✅ Button styling: purple border theme with hover/active/focus states
- ✅ Screen transition: 300ms opacity fade with pointer-events control
- ✅ Mobile responsive: full-width (max 300px), 44px minimum height
- ✅ Accessibility: focus outlines, reduced motion support
- ✅ CSS formatting validated

**Pending:**
- ⏳ Task 5: Manual browser testing (7 test scenarios)
- ⏳ User verification of hover states and phase transition

**Implementation Details:**
- Base button: transparent background, 3px purple border, white text
- Hover: solid purple fill rgb(157, 178, 221), dark text, scale 1.05, glow effect
- Active: scale 0.98 (press down feedback)
- Focus: 2px purple outline, 4px offset (keyboard navigation)
- Mobile: full-width with 300px max-width, 44px min-height (WCAG compliant)
- Reduced motion: all animations disabled if user preference set

**Files Modified:** 1 file (style.css)

---

## File List

**Modified Files:**
- `css/style.css` — Added #play-now-btn styles (base, hover, active, focus), #skill-map-screen transition, reduced motion support (~70 lines added)

**No Changes Required:**
- `js/main.js` — Click handler already exists from Story 16.1
- `js/input.js` — Keyboard navigation already exists from Story 16.1
- `index.html` — Button already exists from Story 16.1

**Modified Artifacts:**
- `_bmad-output/implementation-artifacts/stories/16-6-implement-play-now-button.md` — Added Tasks/Subtasks, Dev Agent Record, File List, Change Log sections, marked tasks complete
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Updated story status: ready-for-dev → in-progress

---

## Change Log

**2026-02-16 — Implementation Complete (Dev Agent)**
- ✅ Added #play-now-btn base styles (transparent bg, 3px purple border, white text)
- ✅ Added hover state (solid purple fill, dark text, scale 1.05, glow effect)
- ✅ Added active state (scale 0.98 press down effect)
- ✅ Added focus state (2px purple outline, 4px offset for keyboard navigation)
- ✅ Added mobile responsive styles (full-width max 300px, 44px min-height)
- ✅ Added #skill-map-screen opacity transition (300ms fade-out)
- ✅ Added .hidden state (opacity: 0, pointer-events: none)
- ✅ Added reduced motion support for button animations and screen transition
- ✅ CSS formatting validated
- ⏳ Ready for manual browser testing (visual validation, hover states, phase transition)

---

## Status

**Current Status:** review
**Last Updated:** 2026-02-16
**Implementation Date:** 2026-02-16

**Completion Summary:**
- ✅ All code implementation complete (Tasks 1-4)
- ✅ Definition of Done: 10/11 items complete (manual browser testing pending)
- ✅ All Acceptance Criteria satisfied by code implementation
- ✅ 1 file modified (style.css)
- ✅ Button styling complete: base + hover + active + focus states
- ✅ Screen transition complete: 300ms opacity fade
- ✅ Mobile responsive: 44px minimum touch target (WCAG compliant)
- ✅ Accessibility: focus outlines + reduced motion support
- ⏳ Manual browser testing recommended (7 test scenarios)

**Ready for:** Code review and manual browser testing
