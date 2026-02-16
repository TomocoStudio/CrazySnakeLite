# Story 21.3: Implement CRT Scanline Overlay

**Epic:** 21 - Immersive Arcade Polish (Authenticity & Personality)
**Status:** 🔴 NOT STARTED
**Created:** 2026-02-16
**Completed:** —

---

## User Story

**As a** player
**I want** a subtle CRT scanline texture overlaying the playfield
**So that** the game evokes authentic 80s arcade CRT monitor aesthetics

---

## Acceptance Criteria

**Given** the playfield is rendered
**When** adding the scanline overlay
**Then** it uses a CSS pseudo-element (::before or ::after) with repeating-linear-gradient

**And** scanlines are horizontal lines (2px transparent, 2px rgba(0,0,0,0.03)) creating subtle texture
**And** overlay opacity is 3% (felt more than seen, subliminal texture)
**And** scanlines cover the entire canvas area
**And** overlay uses pointer-events: none to not interfere with game interaction

**Given** players observe the playfield
**When** focusing on gameplay
**Then** scanlines create subconscious CRT authenticity without being distracting

**And** effect enhances "this is an 80s arcade" immersion

---

## Technical Notes

- Module: `style.css` (canvas pseudo-element with gradient background)
- Implementation:
  ```css
  #gameCanvas::after {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0; bottom: 0;
    background: repeating-linear-gradient(
      0deg,
      transparent 0px,
      transparent 2px,
      rgba(0, 0, 0, 0.03) 2px,
      rgba(0, 0, 0, 0.03) 4px
    );
    pointer-events: none;
  }
  ```
- Reference: FR-V3-6 (CRT Scanlines)
- Design principle: 3% opacity = subliminal authenticity (Tomoco's "felt not seen")
- Validation: Visual inspection, ensure no performance impact, player immersion feedback

---

## Tasks / Subtasks

### Task 1: Implement CRT Scanline CSS Pseudo-Element
- [ ] Add `#game-container::after` pseudo-element rule to `style.css`
- [ ] Set `position: absolute` with full coverage (top/left/right/bottom: 8px to fit inside border)
- [ ] Apply `repeating-linear-gradient` background (horizontal scanlines every 4px)
- [ ] Set `pointer-events: none` to allow click-through
- [ ] Set `z-index: 50` (above canvas, below all UI elements)
- [ ] Map AC: "CSS pseudo-element with repeating-linear-gradient"

### Task 2: Configure Scanline Pattern
- [ ] Set gradient direction `to bottom` (horizontal scanlines)
- [ ] Configure 4px repeat pattern: transparent 0-3px, `rgba(0,0,0,0.03)` 3-4px
- [ ] Verify 3% opacity creates "felt not seen" subliminal texture
- [ ] Map AC: "scanlines are 2px transparent/2px rgba(0,0,0,0.03)"

### Task 3: Ensure Non-Interference
- [ ] Set `border-radius: 4px` to match inner canvas corners
- [ ] Verify overlay covers entire canvas area (500x400px)
- [ ] Test pointer-events: none allows game interaction
- [ ] Map AC: "pointer-events: none to not interfere with game interaction"

### Task 4: Add Optional Scanline Toggle (Config-Driven)
- [ ] Add `CRT_SCANLINES_ENABLED: true` to `config.js`
- [ ] Add `.no-scanlines` CSS class that sets `display: none` on `::after`
- [ ] (Optional) Add toggle button in UI if requested

### Task 5: Test CRT Scanline Overlay
- [ ] Visual test: Scanlines visible on dark backgrounds (score 80+)
- [ ] Visual test: Scanlines subtle/invisible on light backgrounds (score 0-49)
- [ ] Performance test: No FPS impact (scanline is static CSS gradient)
- [ ] Immersion test: Players report "feels like CRT" without consciously noticing lines
- [ ] Edge case: Scanlines don't interfere with food/snake visibility

---

## Dev Notes

### File Locations
- **Primary:** `/Users/anthonysalvi/code/CrazySnakeLite/css/style.css` - scanline pseudo-element CSS
- **Config:** `/Users/anthonysalvi/code/CrazySnakeLite/js/config.js` - scanline toggle flag (optional)

### CSS Implementation: Pseudo-Element Overlay
Use `#game-container::after` (not `#game-canvas::after`) because the canvas element itself can have its background color changed. The container is stable.

```css
/* CRT Scanline overlay — atmospheric retro effect */
#game-container {
  position: relative;  /* Required for absolute positioning of ::after */
}

#game-container::after {
  content: '';
  position: absolute;
  top: 8px;      /* Inside the 8px border */
  left: 8px;
  right: 8px;
  bottom: 8px;
  border-radius: 4px;  /* Match inner canvas corners */
  background: repeating-linear-gradient(
    to bottom,
    transparent 0px,
    transparent 3px,
    rgba(0, 0, 0, 0.03) 3px,
    rgba(0, 0, 0, 0.03) 4px
  );
  pointer-events: none;  /* Click-through to canvas */
  z-index: 50;           /* Above canvas (z-index: 1), below phone overlay (z-index: 400) */
}

/* Optional: Toggle class */
#game-container.no-scanlines::after {
  display: none;
}
```

### Gradient Pattern Explanation
- **Direction:** `to bottom` creates horizontal lines (perpendicular to gradient direction)
- **Repeat:** 4px total height - 3px transparent, 1px dark
- **Opacity:** `rgba(0, 0, 0, 0.03)` = 3% black opacity
- **Effect:** Every 4th pixel row is slightly darker, creating scanline texture

### Integration Points
- **Existing border:** 8px solid border with 10px border-radius on `#game-canvas`. The `::after` overlay must inset by 8px to not overlap border.
- **Existing z-index stack:**
  - Canvas: z-index 1
  - Tooltips: z-index 300
  - Skill Map: z-index 350
  - Phone overlay: z-index 400
  - **Scanlines: z-index 50** (above canvas, below all UI)
- **Performance:** CSS gradient is GPU-composited. Zero CPU cost, no canvas API calls.

### Browser Compatibility
- `repeating-linear-gradient`: Supported in all modern browsers (Chrome 26+, Firefox 16+, Safari 6.1+)
- `::after` pseudo-element: Universal support
- No vendor prefixes needed

### Accessibility Considerations
- **prefers-reduced-motion:** Scanlines are STATIC (no animation), so no motion concern. No media query override needed.
- **Contrast:** 3% opacity is subliminal - does not reduce food/snake visibility or text readability.
- **Photosensitivity:** No strobing/flashing - scanlines are constant.

---

## Project Structure Notes

### Module Boundaries (project-context.md compliance)
- **style.css:** Owns all visual styling. Scanlines are purely CSS, no JS interaction needed.
- **config.js:** Optional toggle flag (`CRT_SCANLINES_ENABLED`). Not required for MVP - can be added later if user requests toggle.

### V4 Pattern Alignment
- **CSS-only implementation:** No JavaScript, no canvas drawing. Pure declarative styling.
- **Zero dependencies:** Uses browser-native CSS only.
- **GPU optimization:** Repeating gradient is GPU-composited (NFR-V3-8).

### Performance Considerations
- **Static gradient:** No per-frame updates. Rendered once by browser, cached.
- **GPU compositing:** Modern browsers composite CSS gradients on GPU. Zero CPU cost.
- **No impact on 60 FPS target:** Scanline overlay is a separate layer in browser rendering pipeline.

### Design Rationale: "Felt Not Seen"
From UX spec: "At 3% opacity, they're felt more than seen — a subliminal texture that makes the playfield feel like a CRT screen rather than a clean LCD."

This is intentional - scanlines should NOT be the dominant visual feature. They become more noticeable on darker backgrounds (score 80+), which is correct - a CRT in a dark room shows its scanlines more.

---

## References

### UX Design Specifications
- **ux-design-retro-graphic-upgrade.md - Enhancement 6:** "CRT Scanline Overlay"
  - Design principle: "near-invisible horizontal lines every 4px"
  - Opacity: "3% opacity, felt more than seen"
  - Accessibility: "players with visual sensitivity might find even subtle scanlines distracting - toggleable via CSS class"
- **ux-design-retro-graphic-upgrade-technical-addendum.md - CSS Updates:** Complete CSS code for scanline overlay (lines 699-726)

### Project Context V4 Patterns
- **project-context.md - Visual Specifications:** Border styling, z-index stack (line 745)
- **project-context.md - NFR-V3-6:** Zero Dependencies - browser-native only (line 15)
- **project-context.md - NFR-V3-8:** GPU Optimization for visual effects (line 15)

### Cognitive Science Validation
- **80s Design Principle:** "The entire aesthetic of the era was inseparable from CRT display characteristics" - 80s Graphic Design Overview
- **Five-Question Filter (Enhancement 6):**
  - Working Memory: Zero (subliminal texture)
  - Competence Feedback: None directly (atmospheric)
  - Clarity: 3% opacity has no readability impact
  - Flow Preservation: Supports flow by deepening immersion ("I'm in an arcade")
  - Emotional Impact: Subtle but cumulative - makes experience feel more authentic
