# Epic 19: Visual Clarity Enhancement (Food Recognition)

**Status:** 🔴 NOT STARTED
**Created:** 2026-02-16
**Completed:** —

---

## Overview

Transform food rendering from single-channel recognition (color only) to dual-channel recognition (shape + color + glow), enabling players to instantly distinguish all 6 food types even in peripheral vision. Implements distinctive pixel-art shapes for each food type, CRT phosphor glow effect with score-based intensity, defensive rendering patterns to prevent canvas state leaks, and extends the progression engine from 3 fields to 8 fields. This epic solves the current UX deficit where all foods are identical squares, directly improving cognitive training effectiveness (pattern recognition, divided attention) and reducing "didn't see it" failures.

**FRs covered:** FR-V3-2 (Distinctive Food Shapes), FR-V3-3 (CRT Phosphor Glow), FR-V3-9 (Score-Gated Progression Extension), FR-V3-11 (Defensive Rendering Patterns)

**NFRs covered:** NFR-V3-1 (Performance Budget 58+ FPS), NFR-V3-2 (Accessibility Contrast Ratios), NFR-V3-5 (Visual Coherence), NFR-V3-7 (Module Boundary Compliance)

**Value:** Players can identify food types in ~200ms (dual-channel processing) vs ~400ms (single-channel color decoding). Shape recognition becomes automatic after ~5 encounters (procedural learning). The 6 distinct shapes (filled square, 4-point star, ring, cross, hollow square, X) map semantically to function (star = power-up, ring = pass-through, X = danger/inversion). CRT glow ensures visibility on both light and dark backgrounds. Foundation layer for Epic 20's dark playfield transformation — the glow system compensates for reduced contrast at high scores.

---

## Stories

### Story 19.1: Extend Progression System to 8 Fields

**As a** developer implementing visual enhancements
**I want** the progression system to support 8 configuration fields instead of 3
**So that** I can gate visual effects (glow intensity, grid opacity) based on score alongside existing mechanics

**Acceptance Criteria:**
- Given the current progression system supports 3 fields (speed, phoneFrequency, effectChance)
- When I extend it to support 8 fields total
- Then the system should support 5 additional fields: glowIntensity, gridOpacity, backgroundColor, borderColor, titleEffect
- And existing 3 fields continue to work without regression
- And new fields follow the same tier-based resolution pattern

---

### Story 19.2: Create Food Shape Rendering System

**As a** player
**I want** each food type to have a distinctive pixel-art shape
**So that** I can instantly recognize food types in peripheral vision without reading colors

**Acceptance Criteria:**
- Given 6 food types exist (normal, invincibility, wallPhase, speedBoost, speedDecrease, reverseControls)
- When food is rendered on the canvas
- Then each type displays a unique shape: filled square (normal), 4-point star (invincibility), ring (wallPhase), cross (speedBoost), hollow square (speedDecrease), X (reverseControls)
- And shapes are centered within the grid cell
- And shapes maintain consistent visual weight (similar perceived size)
- And dual-channel recognition (shape + color) achieves ~200ms identification vs ~400ms for color-only

---

### Story 19.3: Implement CRT Phosphor Glow Effect

**As a** player
**I want** food items to have a subtle CRT phosphor glow that intensifies as my score increases
**So that** food remains visible on both light backgrounds (low score) and dark backgrounds (high score)

**Acceptance Criteria:**
- Given the player has a score within a specific tier
- When food is rendered
- Then the glow intensity matches the progression tier (0-14: blur 0px, 15-49: blur 3px, 50-99: blur 5px, 100+: blur 8px)
- And glow color matches the food item's base color
- And glow effect uses canvas shadowBlur/shadowColor
- Given the player reaches score 100+ (Neon Noir tier)
- Then the 8px glow ensures WCAG AA contrast ratio (4.5:1 minimum)

---

### Story 19.4: Implement Defensive Rendering Pattern

**As a** developer working with canvas effects
**I want** a defensive rendering pattern that guarantees canvas state cleanup
**So that** shadow/glow effects never leak between render calls

**Acceptance Criteria:**
- Given multiple canvas operations use shadow effects (food glow, snake head highlight)
- When implementing the `withShadow()` helper function
- Then it accepts ctx, shadowConfig object, and drawFn callback
- And it sets shadow properties before calling drawFn
- And it GUARANTEES cleanup by resetting shadow properties after drawFn completes
- And cleanup happens even if drawFn throws an error (try/finally pattern)

---

### Story 19.5: Integrate Shapes and Glow into Food Rendering

**As a** player
**I want** the new food shapes and glow effects to appear during gameplay
**So that** I benefit from improved visual recognition and dark background visibility

**Acceptance Criteria:**
- Given Stories 19.1-19.4 are complete
- When food is rendered in food.js
- Then it uses the distinctive shape for its type
- And it applies the score-appropriate glow intensity from progression system
- And it uses the withShadow() helper for glow rendering
- And shape + glow rendering completes within performance budget (< 2ms per frame)

---

### Story 19.6: Test Visual Clarity and Performance

**As a** QA tester
**I want** to validate food recognition improvements and performance
**So that** Epic 19 meets all functional and non-functional requirements

**Acceptance Criteria:**
- Given Epic 19 implementation is complete
- When running visual clarity tests
- Then all 6 food shapes are visually distinct and recognizable
- When running performance tests
- Then FPS remains 58+ with all 6 food types on screen simultaneously
- When testing accessibility
- Then food colors + glow achieve WCAG AA contrast (4.5:1) on dark background
- When testing across score tiers
- Then glow intensity correctly matches tier thresholds
