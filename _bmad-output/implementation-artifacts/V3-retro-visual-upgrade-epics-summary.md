# V3 Retro Visual Upgrade - Epics and Stories Summary

**Created:** 2026-02-16
**PM:** John
**Workflow:** Create Epics and Stories (BMM Phase 3)

---

## Overview

This document summarizes the complete epic and story breakdown for the **V3 Retro Visual Upgrade** (architecturally V4). The upgrade transforms CrazySnakeLite from functional gameplay to an immersive 80s arcade experience through progressive visual enhancements, performance optimizations, and personality-driven polish.

---

## Requirements Coverage

### Functional Requirements (13 total)

- **FR-V3-1:** Progressive Dark Playfield (6 score tiers: 0-14 light grey → 100+ near-black)
- **FR-V3-2:** Distinctive Food Shapes (6 pixel-art shapes for dual-channel recognition)
- **FR-V3-3:** CRT Phosphor Glow (score-based intensity: 0px → 8px blur at tier boundaries)
- **FR-V3-4:** Snake Head Enhancements (direction-tracking pupils, reflection, outline at 50+)
- **FR-V3-5:** Typography Treatments (chrome/neon title, depth GAME OVER, pulsing high score)
- **FR-V3-6:** CRT Scanline Overlay (3% opacity repeating gradient)
- **FR-V3-7:** Reactive Border 7 States (death > phone > combo > effects > default priority)
- **FR-V3-8:** Grid Enhancement (progressive opacity 0.9 → 0.3 + intersection dots)
- **FR-V3-9:** Score-Gated Progression Extension (3 fields → 8 fields)
- **FR-V3-10:** CSS/Canvas Hybrid Rendering (GPU-composited background transitions)
- **FR-V3-11:** Defensive Rendering Patterns (withShadow auto-cleanup)
- **FR-V3-12:** Event-Driven Border Orchestration (foundation → complete)
- **FR-V3-13:** Offscreen Canvas Caching (1,050 ops/frame → 1 op/frame)

### Non-Functional Requirements (8 total)

- **NFR-V3-1:** Performance Budget (58+ FPS minimum, 17.24ms frame time max)
- **NFR-V3-2:** Accessibility Contrast Ratios (WCAG AA 4.5:1 on dark BG)
- **NFR-V3-3:** Grid Visibility (0.3 opacity minimum at tier-5)
- **NFR-V3-4:** Reduced Motion Support (disable high score pulse)
- **NFR-V3-5:** Visual Coherence (all enhancements pass Five-Question Filter)
- **NFR-V3-6:** Zero Dependencies (browser-native only, no libraries)
- **NFR-V3-7:** Module Boundary Compliance (config, progression, render, game, style)
- **NFR-V3-8:** GPU Optimization (CSS compositing for background, offscreen caching for grid)

---

## Epic Structure

### Epic 19: Visual Clarity Enhancement (Food Recognition)
**Status:** 🔴 NOT STARTED
**Stories:** 6
**Focus:** Foundation layer - transform food from single-channel (color) to dual-channel (shape + color + glow) recognition

**Value:** Players identify food in ~200ms (vs ~400ms color-only). Shapes become automatic after 5 encounters. Glow ensures visibility on dark backgrounds. Foundation for Epic 20's darkening playfield.

**Stories:**
1. 19.1 - Extend Progression System to 8 Fields
2. 19.2 - Create Food Shape Rendering System
3. 19.3 - Implement CRT Phosphor Glow Effect
4. 19.4 - Implement Defensive Rendering Pattern
5. 19.5 - Integrate Shapes and Glow into Food Rendering
6. 19.6 - Test Visual Clarity and Performance

---

### Epic 20: Progressive Arcade Transformation (Neon Noir)
**Status:** 🔴 NOT STARTED
**Stories:** 6
**Focus:** Core emotional arc - score-based visual transformation from "safe daylight" to "80s arcade void"

**Value:** Creates mounting cinematic tension. Reaching tier-5 (100+) feels like "entering final boss arena." Grid dimming intentionally increases cognitive challenge (working memory demand). Visual progression maps emotional journey.

**Stories:**
1. 20.1 - Define CSS Tier System with 6 Score Thresholds
2. 20.2 - Implement CSS/Canvas Hybrid Rendering Architecture
3. 20.3 - Create Progressive Grid Opacity System
4. 20.4 - Implement Background Transition Logic
5. 20.5 - Create Event-Driven Border State Foundation
6. 20.6 - Test Visual Transformation and Performance

---

### Epic 21: Immersive Arcade Polish (Authenticity & Personality)
**Status:** 🔴 NOT STARTED
**Stories:** 7
**Focus:** Polish layer - atmospheric details that make players feel "this is an 80s arcade"

**Value:** Snake pupils create sense of agency (looking where heading). Typography adds emotional punctuation. Scanlines are subliminal texture. Border communicates state peripherally. Grid dots add circuit-board aesthetic. Offscreen caching = 1000x performance gain.

**Stories:**
1. 21.1 - Implement Snake Head Enhancements
2. 21.2 - Create Typography Treatments
3. 21.3 - Implement CRT Scanline Overlay
4. 21.4 - Complete Reactive Border with 7 Color States
5. 21.5 - Implement Grid Intersection Dots with Offscreen Caching
6. 21.6 - Integrate Border Orchestration Across Game Events
7. 21.7 - Test Immersive Arcade Polish and Performance

---

## Implementation Strategy

### Epic Sequencing (User Value Flow)

**Epic 19 → Epic 20 → Epic 21** (Clarity → Transformation → Immersion)

**Rationale:**
- Epic 19 establishes foundation (progression system, shapes, glow, defensive rendering)
- Epic 20 builds emotional arc on top (darkening playfield, grid dimming, border foundation)
- Epic 21 adds final polish (snake personality, typography, scanlines, reactive border, dots)

### Dependency Chain

```
Epic 19 (Foundation)
├── Story 19.1: Progression System Extension → enables all tier-based features
├── Story 19.2: Food Shapes → dual-channel recognition
├── Story 19.3: CRT Glow → dark BG visibility (synergizes with Epic 20)
├── Story 19.4: Defensive Rendering → prevents canvas state leaks
├── Story 19.5: Integration → brings 19.1-19.4 together
└── Story 19.6: Testing → validates foundation

Epic 20 (Transformation) [depends on 19.1 progression system]
├── Story 20.1: CSS Tier System → 6 visual tiers defined
├── Story 20.2: Hybrid Rendering → CSS/Canvas split architecture
├── Story 20.3: Grid Opacity → progressive dimming
├── Story 20.4: Background Transitions → tier change orchestration
├── Story 20.5: Border Foundation → event-driven state manager (foundation for Epic 21)
└── Story 20.6: Testing → validates transformation

Epic 21 (Polish) [depends on 20.5 border foundation]
├── Story 21.1: Snake Head → personality via pupils/reflection/outline
├── Story 21.2: Typography → chrome title, depth GAME OVER, pulsing high score
├── Story 21.3: Scanlines → CRT texture overlay
├── Story 21.4: Reactive Border → 7-state system (depends on 20.5)
├── Story 21.5: Grid Dots → offscreen caching for performance
├── Story 21.6: Border Orchestration → complete event integration (depends on 21.4)
└── Story 21.7: Testing → validates all polish
```

### Critical Path

**Must complete in order:**
1. Story 19.1 (Progression Extension) - unlocks all tier-based features
2. Story 20.1-20.4 (CSS Tier System + Transitions) - establishes visual transformation
3. Story 20.5 (Border Foundation) - enables Epic 21's reactive border
4. Story 21.4-21.6 (Reactive Border Complete + Orchestration) - completes peripheral feedback system

**Can parallelize:**
- Epic 19 Stories 19.2, 19.3, 19.4 (after 19.1 complete)
- Epic 21 Stories 21.1, 21.2, 21.3, 21.5 (independent polish features)

---

## Architectural Integration

### New V4 Decisions

- **Decision 11:** Score-Gated Visual Progression System (8 fields, tier-based resolution)
- **Decision 12:** CSS/Canvas Hybrid Rendering (GPU compositing for background)
- **Decision 13:** Defensive Rendering with Auto-Cleanup (withShadow pattern)
- **Decision 14:** Performance Budgets (58+ FPS, offscreen caching)
- **Decision 15:** Border State Orchestration (event-driven priority cascade)

### Module Boundaries

- **config.js:** Score thresholds, tier definitions, glow/opacity/color configs
- **progression.js:** Tier resolution engine (getProgressionValue for 8 fields)
- **render.js:** Canvas rendering (shapes, glow, grid, dots, defensive patterns)
- **game.js:** Orchestration (tier changes, border state, event coordination)
- **style.css:** Visual definitions (tier classes, border colors, typography, scanlines)

### UX Design Authority

**MANDATORY:** All implementation MUST reference Sally's UX design documents:
1. `ux-design-retro-graphic-upgrade.md` (primary spec)
2. `ux-design-retro-graphic-upgrade-technical-addendum.md` (implementation patterns)
3. `game-ux-principles.md` (cognitive science foundation)
4. `dataviz-principles.md` (if dashboard-related)

---

## Success Metrics

### Performance
- FPS: 58+ minimum (all epics tested)
- Frame time: < 17.24ms maximum
- Grid dots: 1,050 ops → 1 op/frame (1000x gain via offscreen caching)
- Tier changes: ~5 per game (event-driven, not 60/sec polling)

### UX
- Food recognition: ~200ms (dual-channel) vs ~400ms (single-channel)
- Shape learning: Automatic after ~5 encounters
- Contrast: WCAG AA 4.5:1 on dark backgrounds
- Grid visibility: 0.3 opacity minimum at tier-5
- Emotional arc: "Safe daylight → Final boss arena" progression

### Accessibility
- Reduced motion: Disables high score pulse animation
- Contrast compliance: All text/elements meet WCAG AA
- Grid visibility: Always perceivable even at 0.3 opacity

---

## Testing Strategy

Each epic includes a dedicated testing story (19.6, 20.6, 21.7) covering:

**Visual Validation:**
- Shape distinctiveness (Epic 19)
- Color progression accuracy (Epic 20)
- Polish element rendering (Epic 21)

**Performance Validation:**
- FPS monitoring (all epics)
- Frame time profiling (all epics)
- Offscreen caching gains (Epic 21)

**Accessibility Validation:**
- Contrast ratios (Epics 19, 20)
- Reduced motion compliance (Epic 21)
- Grid visibility (Epic 20)

**Integration Validation:**
- Border state priority cascade (Epic 21)
- Tier transition smoothness (Epic 20)
- Food visibility across all tiers (Epics 19 + 20 combined)

---

## File Manifest

### Epic Files (3)
- `_bmad-output/implementation-artifacts/epics/19-visual-clarity-enhancement.md`
- `_bmad-output/implementation-artifacts/epics/20-progressive-arcade-transformation.md`
- `_bmad-output/implementation-artifacts/epics/21-immersive-arcade-polish.md`

### Story Files (19)
**Epic 19:**
- `19-1-extend-progression-system.md`
- `19-2-create-food-shape-rendering-system.md`
- `19-3-implement-crt-glow-effect.md`
- `19-4-implement-defensive-rendering-pattern.md`
- `19-5-integrate-shapes-glow-into-food-rendering.md`
- `19-6-test-visual-clarity-performance.md`

**Epic 20:**
- `20-1-define-css-tier-system.md`
- `20-2-implement-css-canvas-hybrid-rendering.md`
- `20-3-create-progressive-grid-opacity-system.md`
- `20-4-implement-background-transition-logic.md`
- `20-5-create-event-driven-border-foundation.md`
- `20-6-test-visual-transformation-performance.md`

**Epic 21:**
- `21-1-implement-snake-head-enhancements.md`
- `21-2-create-typography-treatments.md`
- `21-3-implement-crt-scanline-overlay.md`
- `21-4-complete-reactive-border-7-states.md`
- `21-5-implement-grid-dots-offscreen-caching.md`
- `21-6-integrate-border-orchestration.md`
- `21-7-test-immersive-polish-performance.md`

---

## Next Steps

1. **Sprint Planning:** Run `/bmm/workflows/sprint-planning` to generate sprint-status.yaml
2. **Story Development:** Begin with Epic 19 Story 19.1 (progression extension foundation)
3. **Dev Handoff:** Use `/bmm/workflows/dev-story` to implement each story
4. **Testing:** Execute testing stories (19.6, 20.6, 21.7) after each epic
5. **Retrospective:** Run `/bmm/workflows/retrospective` after epic completion

---

## Alignment Validation

✅ **PRD Alignment:** All 13 FRs and 8 NFRs from PRD covered across 3 epics
✅ **Architecture Alignment:** All 5 V4 decisions and 3 patterns integrated into stories
✅ **UX Design Alignment:** All stories reference Sally's design specs and technical addendum
✅ **Module Boundaries:** Stories respect config/progression/render/game/style separation
✅ **Performance Budget:** All stories validated against 58+ FPS requirement
✅ **Accessibility:** WCAG AA, reduced motion, grid visibility requirements included
✅ **User Value Flow:** Epic sequence (Clarity → Transformation → Immersion) delivers progressive enhancement

---

**Status:** ✅ Complete - Ready for Sprint Planning
