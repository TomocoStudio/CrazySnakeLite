# Story 16.7: Add Back to Menu Navigation

**Epic:** 16 - Skill Map Dashboard (The Cognitive Mirror)

**As a** player,
**I want** to return to the main menu from the Skill Map,
**So that** I can access other menu options without playing.

---

## Acceptance Criteria

**Given** Skill Map displays
**When** bottom of screen renders
**Then** show "← Back to Menu" link:
```
← Back to Menu
```
**And** text in 14px Jersey20, light grey, left-aligned
**And** positioned at bottom-left of screen

**Given** player clicks "Back to Menu" link
**When** link is pressed
**Then** transition to main menu (phase: 'menu')
**And** Skill Map overlay fades out (300ms)

**Given** player presses Esc key
**When** Esc is detected on Skill Map
**Then** same behavior as "Back to Menu" (return to menu)

**Given** player uses keyboard navigation
**When** Tab key is pressed
**Then** focus cycles through: block bars (for accessibility) → Play Now → Back to Menu
**And** Enter key activates focused element

---

## Dev Section

### Technical Context

**Story Purpose:** Implement secondary navigation from Skill Map back to main menu. This is the "escape hatch" for players who want to access other menu options without starting a game. ESC key and "Back to Menu" link both return to menu.

**Architecture Pattern:** Click handler already scaffolded in main.js (from Story 16.1). ESC key handler already exists in input.js. This story adds CSS styling for the link and verifies consistent behavior.

**Key UX Insight:** Menu is always reachable, but not the primary action. "Play Now" is the hero button; "Back to Menu" is the subtle text link below it.

### Files to Modify

**MODIFY:**
- `css/style.css` — Add Back to Menu link styles (subtle, secondary)
- `js/main.js` — Already has click handler from 16.1, verify preventDefault()
- `js/input.js` — Already has ESC handler from 16.1, verify skillmap phase case

**READ (context):**
- `js/state.js` — Understand phase transition ('skillmap' → 'menu')

### Implementation Guidance

#### 1. Link Handler (js/main.js)

**Already implemented in Story 16.1, verify:**

```javascript
// main.js — Back to Menu link handler (from 16.1)
const backToMenuLink = document.getElementById('back-to-menu-link');

backToMenuLink.addEventListener('click', (e) => {
  e.preventDefault();  // Prevent default anchor behavior
  gameState.phase = 'menu';
  handleUIUpdate(gameState);
});
```

**Critical:** `e.preventDefault()` prevents browser navigation to `#` href.

#### 2. ESC Key Handler (js/input.js)

**Already implemented in Story 16.1, verify:**

```javascript
// input.js — ESC key handler (from 16.1)
function handleKeyDown(event) {
  if (event.key === 'Escape') {
    if (gameState.phase === 'playing') {
      // Existing pause logic (not changed)
    } else if (gameState.phase === 'gameover' || gameState.phase === 'skillmap') {
      // Return to menu
      gameState.phase = 'menu';
      handleUIUpdate(gameState);
    }
  }
  // ... other key handling ...
}
```

**Critical:** ESC from skillmap behaves identically to ESC from gameover — consistent pattern.

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
    return [playNowBtn, backToMenuLink];  // Tab cycles: Play Now → Back to Menu
  }
  return [];
}
```

**Critical:** backToMenuLink is the SECOND element → Tab from Play Now cycles to it.

#### 4. CSS Styling (css/style.css)

**Add Back to Menu link styles:**

```css
/* === Back to Menu Link === */
#back-to-menu-link {
  display: block;
  text-align: center;
  margin-top: 16px;
  font-family: 'Jersey20', sans-serif;
  font-size: 14px;
  color: #B0B0B0;  /* Light grey — secondary action */
  text-decoration: none;
  cursor: pointer;
  transition: color 150ms ease-in-out;
}

#back-to-menu-link:hover {
  color: rgb(157, 178, 221);  /* Purple theme */
  text-decoration: underline;
}

#back-to-menu-link:focus {
  outline: 2px solid rgb(157, 178, 221);
  outline-offset: 4px;
  border-radius: 4px;
}

#back-to-menu-link:active {
  color: #FFFFFF;  /* Brighten on click */
}

/* Mobile responsive */
@media (max-width: 768px) {
  #back-to-menu-link {
    font-size: 12px;
    margin-top: 12px;
  }
}
```

**Reduced motion handling:**

```css
/* Disable transitions if prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  #back-to-menu-link {
    transition: none;
  }
}
```

#### 5. Visual Hierarchy

**Design intent:** The "Back to Menu" link is deliberately subtle compared to "Play Now":

| Element | Visual Weight | Purpose |
|---------|--------------|---------|
| **Play Now** | Bold, 20px, purple border, hover glow | Primary action — start playing |
| **Back to Menu** | Light, 14px, grey text, arrow prefix | Secondary action — exit to menu |

This visual hierarchy guides the player toward the intended action (play) while keeping the escape hatch accessible.

### Testing Guidance

**Manual Testing Checklist:**

1. **Link Click (Desktop):**
   - [ ] Click "← Back to Menu" on Skill Map → main menu appears
   - [ ] Skill Map fades out (300ms transition)
   - [ ] Main menu renders with "New Game" and "Skill Map" buttons
   - [ ] No flash or visual jank during transition

2. **Link Hover States:**
   - [ ] Hover → text color changes to purple rgb(157, 178, 221)
   - [ ] Hover → underline appears
   - [ ] Leave hover → smooth transition back to grey

3. **Link Active State:**
   - [ ] Click and hold → text color brightens to white
   - [ ] Release → transition back to hover or default

4. **ESC Key Navigation:**
   - [ ] On Skill Map, press ESC → main menu appears
   - [ ] Behavior identical to clicking "Back to Menu"
   - [ ] Consistent with ESC from game-over screen

5. **Keyboard Navigation (Tab):**
   - [ ] On Skill Map, press Tab → Play Now focused
   - [ ] Press Tab again → Back to Menu focused
   - [ ] Press Enter on Back to Menu → main menu appears
   - [ ] Focus outline visible (2px solid purple, 4px offset)

6. **Mobile Touch:**
   - [ ] Tap "← Back to Menu" → main menu appears
   - [ ] No double-tap required
   - [ ] Touch target adequate (min 12px font, sufficient padding)

7. **Phase Transition:**
   - [ ] gameState.phase changes from 'skillmap' → 'menu'
   - [ ] Main menu screen visible after transition
   - [ ] "New Game" button default-selected on menu

### Definition of Done

- [ ] Back to Menu link styled with light grey #B0B0B0
- [ ] Hover state: purple color, underline
- [ ] Active state: white color
- [ ] Focus outline visible (2px solid purple, 4px offset)
- [ ] Mobile: 12px font size
- [ ] Click handler prevents default anchor behavior (e.preventDefault)
- [ ] Click transitions phase from 'skillmap' → 'menu'
- [ ] ESC key from skillmap returns to menu (identical behavior)
- [ ] Keyboard navigation: Tab cycles to Back to Menu, Enter activates
- [ ] Skill Map fades out (300ms opacity transition)
- [ ] Reduced motion: no color transition
- [ ] Manual testing checklist passed (7/7 scenarios)
- [ ] No console errors

### Dependencies

**Blocked By:**
- Story 16.1 complete (link handler scaffolded in main.js, ESC handler in input.js)
- Story 16.6 complete (Play Now button appears above link)

**Blocks:**
- Story 16.8 (consistent styling applied across all dashboard elements)

### References

- [Source: ux-design-cognitive-dashboard.md — Back to Menu Navigation, Visual Hierarchy]
- [Source: project-context.md — V3 Phase Navigation, ESC Key Behavior]
- [Source: main.js — handleUIUpdate(), backToMenuLink click handler]
- [Source: input.js — ESC key handling for skillmap phase]
