# Story 14.7: Play Again and Skill Map Buttons - Manual Test Plan

## Test Environment Setup
1. Open `index.html` in a modern browser (Chrome, Firefox, Safari)
2. Open DevTools Console to monitor log messages
3. Test on both desktop (> 768px) and mobile (< 768px) viewports

---

## Test Case 1: Button Layout - Desktop Viewport

**Given:** Browser viewport width > 768px
**When:** Game over screen appears
**Then:**
- [ ] Two buttons displayed side by side
- [ ] "Play Again" button on the left
- [ ] "Skill Map" button on the right
- [ ] Both buttons have equal width (flex: 1)
- [ ] 16px gap between buttons
- [ ] Buttons use Jersey20 font
- [ ] Buttons have 8px rounded corners
- [ ] Purple border (rgb(157, 178, 221))

**Visual inspection:**
```
┌────────────┐  ┌────────────┐
│ PLAY AGAIN │  │ SKILL MAP  │
└────────────┘  └────────────┘
```

---

## Test Case 2: Button Layout - Mobile Viewport

**Given:** Browser viewport width < 768px (use DevTools responsive mode)
**When:** Game over screen appears
**Then:**
- [ ] Two buttons stacked vertically
- [ ] "Play Again" button on top (safe choice priority)
- [ ] "Skill Map" button below
- [ ] Both buttons full width
- [ ] Both buttons minimum 44px height (touch target)
- [ ] 12px gap between buttons

**Visual inspection:**
```
┌──────────────────┐
│   PLAY AGAIN     │
└──────────────────┘
┌──────────────────┐
│   SKILL MAP      │
└──────────────────┘
```

---

## Test Case 3: Button Timing (FR169)

**Given:** Player dies in game
**When:** Game over screen appears
**Then:**
- [ ] t=0.0s: Game Over + Score appear
- [ ] t=0.3s: RECAP header fades in
- [ ] t=0.6s-1.2s: Highlights fade in (staggered)
- [ ] t=1.5s: Caller quote fades in
- [ ] **t=3.3s: Play Again and Skill Map buttons appear**

**How to test:**
1. Play game and die
2. Watch console logs: `[Main] Highlights animation complete - showing Play Again and Skill Map buttons`
3. Verify buttons appear after caller quote completes

---

## Test Case 4: Default Selection (FR105)

**Given:** Buttons appear on game over screen
**When:** Buttons are rendered
**Then:**
- [ ] "Play Again" button has `.selected` class applied
- [ ] "Play Again" button has purple background (rgb(157, 178, 221))
- [ ] "Play Again" button is visually highlighted/scaled
- [ ] "Skill Map" button has default black background

---

## Test Case 5: Calibration Period - Sessions 1-4 (In Progress)

**Given:** Player is in calibration period (completed < 5 sessions)
**When:** Game over screen displays
**Then:**
- [ ] "Skill Map" button is disabled (`:disabled` attribute)
- [ ] "Skill Map" button has greyed out appearance:
  - Background: #1a1a1a (darker grey)
  - Text: #666666 (grey)
  - Border: #444444 (grey)
  - Opacity: 0.5
- [ ] "Skill Map" button cursor shows `not-allowed`
- [ ] Clicking "Skill Map" does nothing
- [ ] Console log: `[Story 14.7] Skill Map button disabled - calibration in progress`

**How to test:**
1. Clear IndexedDB and localStorage (DevTools > Application > Storage > Clear site data)
2. Play and die 4 times
3. On each game over, verify Skill Map is disabled

---

## Test Case 6: Calibration Complete - Session 5 (One-time celebration)

**Given:** Player completes session 5 (calibration complete)
**When:** Game over screen displays
**Then:**
- [ ] "Skill Map" button is **enabled**
- [ ] "Skill Map" button has normal active styling
- [ ] Console log: `[Story 14.7] Skill Map button enabled - calibration complete`
- [ ] Calibration footer shows: "Your Skill Map is ready! 🎉"
- [ ] Clicking "Skill Map" is allowed (placeholder: returns to menu)

**How to test:**
1. Complete 4 sessions (clear storage first)
2. On 5th session death, verify button is enabled
3. Verify celebration message in footer

---

## Test Case 7: Calibration Unlocked - Session 6+ (Normal state)

**Given:** Player has completed calibration (session 6+)
**When:** Game over screen displays
**Then:**
- [ ] "Skill Map" button is **enabled**
- [ ] "Skill Map" button has normal active styling
- [ ] No calibration message in footer (only streak counter)
- [ ] Console log: `[Story 14.7] Skill Map button enabled - calibration complete`

**How to test:**
1. Complete 6+ sessions
2. Verify button always enabled
3. Verify no calibration messages (only streak)

---

## Test Case 8: Play Again Button Click (FR89)

**Given:** Buttons are displayed
**When:** User clicks "Play Again" button
**Then:**
- [ ] New game starts immediately
- [ ] Game over screen closes
- [ ] Canvas shows snake at starting position
- [ ] Score resets to 0
- [ ] Food spawns on grid

---

## Test Case 9: Skill Map Button Click (Epic 16 Placeholder)

**Given:** Calibration is complete (session 5+)
**When:** User clicks "Skill Map" button
**Then:**
- [ ] Console log: `[Story 14.7] Skill Map button clicked - Epic 16 not yet implemented`
- [ ] **Placeholder behavior:** Returns to main menu
- [ ] Game over screen closes
- [ ] Main menu appears
- [ ] High score is updated

**Note:** Epic 16 will replace this placeholder with full dashboard navigation.

---

## Test Case 10: Button Hover States

**Given:** Buttons are displayed and enabled
**When:** User hovers over button
**Then:**
- [ ] Button background changes to purple (rgb(157, 178, 221))
- [ ] Button scales up slightly (transform: scale(1.05))
- [ ] Transition is smooth (0.2s)
- [ ] Cursor shows pointer

**When:** User hovers over disabled Skill Map button
**Then:**
- [ ] No hover effect occurs
- [ ] Cursor shows `not-allowed`
- [ ] Button remains greyed out

---

## Test Case 11: Reduced Motion Accessibility

**Given:** User has `prefers-reduced-motion: reduce` enabled
**When:** Buttons are displayed
**Then:**
- [ ] No transform animations on hover
- [ ] No scale effects on `.selected` state
- [ ] All other functionality works normally

**How to test:**
1. DevTools > Rendering > Emulate CSS media feature prefers-reduced-motion: reduce
2. Hover over buttons
3. Verify no transform/scale animations

---

## Test Case 12: Button Focus States (Keyboard Navigation)

**Given:** Buttons are displayed
**When:** User tabs to buttons
**Then:**
- [ ] Focus outline visible on focused button
- [ ] Tab order: Play Again → Skill Map
- [ ] Enter key activates focused button
- [ ] Disabled Skill Map cannot receive focus

---

## Test Case 13: Edge Case - No Session Context

**Given:** Session context is null/undefined (edge case)
**When:** Buttons are displayed
**Then:**
- [ ] Buttons still appear (no crash)
- [ ] Skill Map defaults to enabled (graceful degradation)
- [ ] Console warning may appear

**How to test:**
1. Temporarily modify code to pass null sessionContext
2. Verify no crashes

---

## Acceptance Criteria Checklist

### Layout & Styling
- [ ] Side-by-side layout on desktop (> 768px)
- [ ] Vertical stack on mobile (< 768px)
- [ ] 8px rounded corners
- [ ] Purple border (rgb(157, 178, 221))
- [ ] Jersey20 font
- [ ] Minimum 44px touch targets on mobile

### Timing
- [ ] Buttons appear at t=3.3s after game over (FR169)

### Calibration State
- [ ] Sessions 1-4: Skill Map disabled (greyed out)
- [ ] Session 5+: Skill Map enabled
- [ ] Console logs confirm state transitions

### Default Selection
- [ ] "Play Again" has `.selected` class (FR105)
- [ ] "Play Again" visually highlighted on load

### Click Handlers
- [ ] "Play Again" starts new game (FR89)
- [ ] "Skill Map" opens dashboard (placeholder: menu for now)

### Accessibility
- [ ] Reduced motion support (no transform animations)
- [ ] Keyboard navigation works
- [ ] Focus states visible
- [ ] Disabled button not focusable

---

## Regression Tests

### Other Epic 14 Features Still Work
- [ ] Story 14.1: Highlights still selected correctly
- [ ] Story 14.2: Staggered animation timing unchanged
- [ ] Story 14.3: Caller quotes still display
- [ ] Story 14.5: Calibration counter still shows
- [ ] Story 14.6: Streak counter still shows

### Core Game Features Still Work
- [ ] Game starts and plays normally
- [ ] Score tracking works
- [ ] High score persistence works
- [ ] Phone calls still trigger
- [ ] Food spawning works

---

## Browser Compatibility Testing

Test on:
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Mobile Safari (iOS)
- [ ] Chrome Mobile (Android)

---

## Performance Verification

- [ ] Button render time < 50ms (no perceptible lag)
- [ ] Total game-over-to-buttons time < 3.5s (including animations)
- [ ] No layout thrashing in DevTools Performance panel

---

## Notes

- Epic 16 (Skill Map dashboard) not yet implemented - Skill Map button returns to menu as placeholder
- Calibration state detection uses `sessionContext.calibrationState` from Story 14.5
- Button layout uses flexbox for easy responsive behavior
- All timings follow FR168/FR169 specs from Epic 14
