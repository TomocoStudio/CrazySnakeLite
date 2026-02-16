# Story 21.2: Create Typography Treatments

**Epic:** 21 - Immersive Arcade Polish (Authenticity & Personality)
**Status:** 🔴 NOT STARTED
**Created:** 2026-02-16
**Completed:** —

---

## User Story

**As a** player
**I want** dramatic text styling for title, GAME OVER, and NEW HIGH SCORE
**So that** key moments have emotional punctuation and feel iconic

---

## Acceptance Criteria

**Given** the game title appears on the menu/start screen
**When** rendering the title
**Then** it uses chrome/neon text effect with CSS text-shadow (layered shadows: dark outline + bright inner glow)

**And** title feels iconic and 80s arcade authentic

**Given** the game ends (death event)
**When** displaying "GAME OVER" text
**Then** it uses depth/shadow effect with dark offset shadow (3-5px)

**And** text has gravitas and finality (not flat/generic)

**Given** the player achieves a new high score
**When** displaying "NEW HIGH SCORE" text
**Then** it uses pulsing gold effect via CSS animation (scale 1.0 → 1.1 → 1.0, 1.5s loop)

**And** pulsing animation is disabled if user has prefers-reduced-motion enabled (NFR-V3-4)
**And** text conveys triumph and celebration

---

## Technical Notes

- Module: `style.css` (typography classes), `index.html` or game UI elements
- Chrome/Neon effect: Multiple text-shadow layers (dark outline + bright glow)
- Depth effect: Single offset text-shadow (e.g., 4px 4px 0 rgba(0,0,0,0.8))
- Pulsing effect: CSS @keyframes animation with transform: scale()
- Accessibility: @media (prefers-reduced-motion: reduce) disables pulse animation
- Reference: FR-V3-5 (Typography Treatments), NFR-V3-4 (Reduced Motion)
- Validation: Visual inspection, reduced motion test, emotional impact assessment

---

## Tasks / Subtasks

### Task 1: Implement Title Chrome/Neon Treatment
- [ ] Add `.game-title` CSS class to `style.css`
- [ ] Apply multi-layer text-shadow (blue glow + 3D depth)
- [ ] Use white base color with blue neon glow + hard 2-layer drop shadow
- [ ] Ensure title uses Jersey20 font, 36px, bold, letter-spacing 3px
- [ ] Map AC: "chrome/neon text effect with CSS text-shadow"

### Task 2: Implement GAME OVER Depth Treatment
- [ ] Add/update `#gameover-screen h2` CSS rule in `style.css`
- [ ] Apply text-shadow with soft glow + hard bottom shadow + soft depth shadow
- [ ] Keep existing blue color `rgb(157, 178, 221)`, letter-spacing 4px
- [ ] Map AC: "depth/shadow effect with dark offset shadow"

### Task 3: Implement NEW HIGH SCORE Pulsing Gold Treatment
- [ ] Add/update `#gameover-screen .new-high-score` CSS rule in `style.css`
- [ ] Apply gold color `#FFD700` with multi-layer gold glow
- [ ] Create `@keyframes highScorePulse` animation (1.5s ease-in-out infinite)
- [ ] Pulse text-shadow intensity (not scale - text-shadow only)
- [ ] Map AC: "pulsing gold effect via CSS animation"

### Task 4: Implement Reduced Motion Override
- [ ] Add `@media (prefers-reduced-motion: reduce)` rule in `style.css`
- [ ] Disable `highScorePulse` animation (`animation: none`)
- [ ] Keep static gold glow (no pulse)
- [ ] Map AC: "pulsing disabled if prefers-reduced-motion enabled"

### Task 5: Implement Score Display Enhancement
- [ ] Add/update `#current-score` CSS rule with subtle white glow
- [ ] Add/update `#top-score` CSS rule with subtle blue glow
- [ ] Use 6px blur, 0.3 opacity for both

### Task 6: Test Typography Treatments
- [ ] Visual test: Title has blue glow + 3D effect
- [ ] Visual test: GAME OVER has depth shadow
- [ ] Visual test: NEW HIGH SCORE pulses gold
- [ ] Accessibility test: Enable prefers-reduced-motion, verify pulse disabled
- [ ] Cross-browser test: Chrome, Firefox, Safari (text-shadow support)

---

## Dev Notes

### File Locations
- **Primary:** `/Users/anthonysalvi/code/CrazySnakeLite/css/style.css` - all typography CSS rules
- **HTML:** `/Users/anthonysalvi/code/CrazySnakeLite/index.html` - verify class names match

### CSS Pattern: Multi-Layer Text-Shadow
80s arcade text used stacked text-shadows for depth. Follow this pattern:
```css
text-shadow:
  0 0 10px rgba(color, 0.8),   /* Inner glow */
  0 0 20px rgba(color, 0.4),   /* Wider glow halo */
  0 2px 0 darker-color,         /* Hard shadow (bevel) */
  0 3px 0 even-darker-color;    /* Deeper shadow (3D) */
```

### Title Treatment Implementation
```css
.game-title {
  font-family: 'Jersey20', 'Courier New', monospace;
  font-size: 36px;
  font-weight: bold;
  color: #FFFFFF;  /* White base for maximum brightness */
  letter-spacing: 3px;
  text-transform: uppercase;
  text-shadow:
    0 0 10px rgba(157, 178, 221, 0.8),   /* Soft blue glow (neon tube) */
    0 0 20px rgba(157, 178, 221, 0.4),   /* Wider glow halo */
    0 2px 0 #5A6A8A,                      /* Hard shadow bottom (bevel depth) */
    0 3px 0 #3A4A6A;                      /* Deeper shadow layer (3D effect) */
}
```

### GAME OVER Treatment Implementation
```css
#gameover-screen h2 {
  font-size: 36px;
  color: rgb(157, 178, 221);  /* Keep existing blue */
  letter-spacing: 4px;
  text-shadow:
    0 0 8px rgba(157, 178, 221, 0.6),   /* Soft glow */
    0 2px 0 rgba(0, 0, 0, 0.8),         /* Hard bottom shadow */
    0 4px 8px rgba(0, 0, 0, 0.4);       /* Soft depth shadow */
}
```

### NEW HIGH SCORE Pulsing Treatment Implementation
```css
#gameover-screen .new-high-score {
  font-size: 20px;
  font-weight: bold;
  color: #FFD700;
  text-shadow:
    0 0 10px rgba(255, 215, 0, 0.8),
    0 0 20px rgba(255, 215, 0, 0.4),
    0 0 30px rgba(255, 165, 0, 0.2);
  animation: highScorePulse 1.5s ease-in-out infinite;
}

@keyframes highScorePulse {
  0%, 100% {
    text-shadow:
      0 0 10px rgba(255, 215, 0, 0.8),
      0 0 20px rgba(255, 215, 0, 0.4);
  }
  50% {
    text-shadow:
      0 0 15px rgba(255, 215, 0, 1.0),
      0 0 30px rgba(255, 215, 0, 0.6),
      0 0 40px rgba(255, 165, 0, 0.3);
  }
}

/* Reduced motion: disable pulse */
@media (prefers-reduced-motion: reduce) {
  #gameover-screen .new-high-score {
    animation: none;
    text-shadow:
      0 0 10px rgba(255, 215, 0, 0.8),
      0 0 20px rgba(255, 215, 0, 0.4);
  }
}
```

### Score Display Enhancement
```css
#current-score {
  color: #FFFFFF;
  text-shadow: 0 0 6px rgba(255, 255, 255, 0.3);
}

#top-score {
  color: rgb(157, 178, 221);
  text-shadow: 0 0 6px rgba(157, 178, 221, 0.3);
}
```

### Integration Points
- **Existing typography:** Jersey20 font already loaded, existing blue color scheme preserved
- **Existing HTML structure:** Verify class names (`#gameover-screen h2`, `.new-high-score`, etc.) match current DOM
- **Reduced motion detection:** CONFIG.REDUCED_MOTION detected once in main.js (V2 pattern), CSS media query handles animation disable

### Browser Compatibility
- `text-shadow`: Supported in all modern browsers (Chrome 4+, Firefox 3.5+, Safari 4+)
- `@keyframes`: Supported in all modern browsers
- `prefers-reduced-motion`: Supported in Chrome 74+, Firefox 63+, Safari 10.1+
- No vendor prefixes needed for text-shadow (legacy `-webkit-text-shadow` no longer required)

---

## Project Structure Notes

### Module Boundaries (project-context.md compliance)
- **style.css:** Owns all visual styling. Does NOT contain game logic.
- **index.html:** Structure only. Class names and IDs are stable references.
- **main.js:** Detects `prefers-reduced-motion` once, sets `CONFIG.REDUCED_MOTION` flag (but CSS media query is the primary mechanism for animation disable).

### V4 Pattern Alignment
- **CSS-only implementation:** No JavaScript needed. Pure declarative styling.
- **Accessibility-first:** `prefers-reduced-motion` support built-in via media query.
- **Zero dependencies:** Uses browser-native CSS features only.

### Performance Considerations
- Text-shadow rendering: GPU-accelerated on all modern browsers. No FPS impact.
- CSS animations: GPU-composited (transform property). No CPU cost.
- Multiple text-shadows: Maximum 4 layers per element. Well under browser limits (typically 20+).

---

## References

### UX Design Specifications
- **ux-design-retro-graphic-upgrade.md - Enhancement 5:** "Typography Enhancements (Arcade Text Treatment)"
  - 5A: Title Treatment - "multi-layer shadow stack, chrome/arcade treatment"
  - 5B: GAME OVER Treatment - "subtle glow and depth, heavy but not overwhelming"
  - 5C: NEW HIGH SCORE Treatment - "celebration moment, should SHINE"
  - 5D: Score Display Enhancement - "subtle glow, lit rather than printed"
- **ux-design-retro-graphic-upgrade-technical-addendum.md - CSS Updates:** Complete CSS code for all typography treatments (lines 623-697)

### Project Context V4 Patterns
- **project-context.md - V2 DOM & CSS Patterns:** Visual state changes use CSS classes (line 165)
- **project-context.md - V2 Reduced Motion:** CSS media query pattern for prefers-reduced-motion (line 175)
- **project-context.md - Configuration Rules:** Jersey20 font, color values in config.js (line 416)

### Cognitive Science Validation
- **80s Design Principle:** "Typography evolved into intense aesthetic experimentation and brand identity" - 80s Graphic Design Overview
- **Five-Question Filter (Enhancement 5):**
  - Working Memory: Zero WM cost (text treatments add feeling, not information)
  - Competence Feedback: NEW HIGH SCORE pulsing gold = triumph, GAME OVER depth = gravitas
  - Clarity: All text remains fully readable, glow enhances salience
  - Flow Preservation: Only appears on non-gameplay screens (no flow impact)
  - Emotional Impact: Title feels iconic, GAME OVER feels significant, HIGH SCORE feels victorious
