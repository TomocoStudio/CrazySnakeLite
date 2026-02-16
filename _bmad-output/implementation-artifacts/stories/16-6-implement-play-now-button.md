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

- [ ] Play Now button styled with purple border, white text
- [ ] Hover state: solid purple fill, dark text, scale 1.05, glow effect
- [ ] Active state: scale 0.98 (press down)
- [ ] Focus outline visible (2px solid purple, 4px offset)
- [ ] Mobile: full-width (max 300px), minimum 44px height
- [ ] Click handler transitions phase from 'skillmap' → 'playing'
- [ ] Skill Map fades out (300ms opacity transition)
- [ ] Keyboard navigation: Tab cycles to Play Now, Enter activates
- [ ] Reduced motion: no scale animation, instant fade
- [ ] Manual testing checklist passed (7/7 scenarios)
- [ ] No console errors

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
