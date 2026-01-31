# Story 1: Visual Identity Overhaul

**Epic:** Visual & Audio Polish v2.0
**Status:** Ready for Implementation
**Priority:** High
**Complexity:** Low
**Created:** 2026-01-31

---

## User Story

As a player, I want a consistent retro/pixel aesthetic with the Jersey_20 font and sharp corners, so the game feels like a classic arcade experience rather than a modern web game.

---

## Description

Transform visual identity by:
1. Integrating Jersey_20 font across all text elements
2. Removing all rounded corners (border-radius)
3. Removing decorative glow and fade effects

This establishes the foundational visual language for the entire game.

---

## Acceptance Criteria

### AC1: Jersey_20 Font Integration
- [ ] Jersey_20 font files loaded from `assets/Jersey_20/`
- [ ] `@font-face` declaration added to CSS
- [ ] Font applied to ALL text elements:
  - [ ] Game title (h1.game-title)
  - [ ] Menu buttons (.menu-button)
  - [ ] Score display (#score-display)
  - [ ] High score display (#high-score-display)
  - [ ] Game over screen (#gameover-screen h2, p, button)
  - [ ] Phone call overlay (.call-status, .caller-name, .end-button)
- [ ] Fallback to 'Courier New', monospace if font fails to load
- [ ] Font renders correctly in all browsers (Chrome, Safari, Firefox)

### AC2: Sharp Corners (Remove Border Radius)
- [ ] All `border-radius` values set to `0` in CSS
- [ ] Affected elements verified:
  - [ ] #menu-screen (was 8px)
  - [ ] .menu-button (inherited from button styles)
  - [ ] #score-display (was 4px)
  - [ ] #high-score-display (was 4px)
  - [ ] #gameover-screen (inherited)
  - [ ] .phone-screen (was 8px)
  - [ ] .end-button (was 4px)
- [ ] Visual regression test: All corners are sharp 90° angles

### AC3: Remove Glow/Fade Effects
- [ ] Remove `box-shadow` glow effects:
  - [ ] #menu-screen: Remove `box-shadow: 0 0 20px rgba(157, 78, 221, 0.5)`
  - [ ] #gameover-screen: Remove `box-shadow: 0 0 10px #9D4EDD, 0 0 20px #9D4EDD`
  - [ ] #gameover-screen button.selected: Remove `box-shadow: 0 0 10px #9D4EDD`
  - [ ] .menu-button:hover: Remove `box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3)`
  - [ ] .phone-screen: Remove `box-shadow: 0 8px 16px rgba(0, 0, 0, 0.5)`
- [ ] Remove `text-shadow` glow effects:
  - [ ] .game-title: Remove glow, keep `2px 2px 0px #000000` (solid offset)
  - [ ] #gameover-screen h2: Remove `text-shadow: 0 0 5px #9D4EDD`
- [ ] Remove animations:
  - [ ] #gameover-screen .new-high-score: Remove `animation: pulse-glow 1.5s ease-in-out infinite`
  - [ ] .call-status: Remove `animation: pulse 1.5s ease-in-out infinite`
  - [ ] Remove `@keyframes pulse-glow` definition
  - [ ] Remove `@keyframes pulse` definition
- [ ] KEEP functional effects:
  - [ ] #game-canvas.blurred: Keep `filter: blur(4px)` (functional during phone calls)
  - [ ] Transition effects on hover/active (functional feedback)

---

## Files to Modify

### Primary Files
- `css/style.css` - Main changes (font, border-radius, effects)
- `index.html` - Add font loading (if needed for @font-face path)

### Font Asset
- `assets/Jersey_20/` - Confirm font files exist and are valid

---

## Dependencies

- Jersey_20 font files confirmed in `assets/Jersey_20/` ✅
- No blocking dependencies

---

## Implementation Notes

1. **Font Loading:** Check font file format (TTF, WOFF, WOFF2) and add appropriate @font-face declaration
2. **Browser Compatibility:** Test font rendering across Chrome, Safari, Firefox
3. **Visual Testing:** Before/after screenshots recommended
4. **CSS Organization:** Consider grouping all border-radius removals together for clarity

---

## Testing Checklist

- [ ] Font loads correctly on page load
- [ ] All text elements use Jersey_20 font
- [ ] Fallback works if font fails to load
- [ ] All corners are sharp (no rounded edges visible)
- [ ] No glow/shadow effects on any elements (except functional blur)
- [ ] No fade/pulse animations active
- [ ] Game still fully playable after changes
- [ ] Visual consistency across all screens (menu, playing, game over, phone call)

---

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Visual regression testing completed
- [ ] Code reviewed
- [ ] Changes tested in multiple browsers
- [ ] No regressions in existing functionality
- [ ] User (Tomoco) validates the visual transformation
- [ ] Ready to ship to production

---

## Related Documents

- **Epic:** `_bmad-output/implementation-artifacts/epics/epic-visual-audio-polish-v2.md`
- **User Feedback:** `/UserFeedback.md`
- **Next Story:** `story-2-score-display-redesign.md`
