# Epic 20: Progressive Arcade Transformation (Neon Noir)

**Status:** 🔴 NOT STARTED
**Created:** 2026-02-16
**Completed:** —

---

## Overview

Create a score-based visual transformation that shifts the playfield from "safe daylight" (score 0-14, light grey) to "80s arcade void" (score 100+, near-black) through 6 progressive tiers, mirroring the difficulty curve and creating cinematic emotional progression. Implements CSS/Canvas hybrid rendering (GPU-composited background transitions), progressive grid opacity dimming (0.9 → 0.3), and event-driven border state foundation. The visual world evolves: bright → slight tension → warm-up complete → building intensity → serious arcade → Full Neon Noir. Each tier triggers smooth 2-second CSS transitions. Grid fades from spatial scaffold to ghost lines, forcing players to rely on internal spatial models at high scores (cognitive training via scaffolding removal).

**FRs covered:** FR-V3-1 (Progressive Dark Playfield with 6 score tiers), FR-V3-8 (Grid Progressive Dimming), FR-V3-10 (CSS/Canvas Hybrid Rendering), FR-V3-12 (Event-Driven Border foundation)

**NFRs covered:** NFR-V3-1 (Performance Budget), NFR-V3-3 (Grid Visibility at 0.3 opacity), NFR-V3-5 (Visual Coherence), NFR-V3-8 (GPU Optimization via CSS compositing)

**Value:** Core emotional arc of V3. The darkening playfield creates mounting cinematic tension — "the game looks different because I earned it." Reaching Full Neon Noir at 100+ feels like entering the final boss arena. Grid dimming is intentional cognitive challenge increase (working memory demand rises as visual scaffolding recedes). Synergizes with Epic 19's glow system: darker background amplifies food glow (CRT phosphor principle). The transformation is score-based (never time-based, Axiom 1), so players control the pace. Visual progression maps to RPG color psychology: bright colors = safety, dark/stark greys = danger.

---

## Stories

### Story 20.1: Define CSS Tier System with 6 Score Thresholds

**As a** developer implementing visual progression
**I want** CSS classes for 6 distinct score-based visual tiers
**So that** the playfield transforms from daylight to Neon Noir as players achieve higher scores

**Acceptance Criteria:**
- Given the visual transformation requires 6 progressive tiers
- When defining CSS classes in style.css
- Then 6 tier classes exist: tier-0 (0-14), tier-1 (15-29), tier-2 (30-49), tier-3 (50-74), tier-4 (75-99), tier-5 (100+)
- And each tier defines background-color with 2-second transitions
- And tier-0/1 feel "safe daylight", tier-4/5 feel "Neon Noir"

---

### Story 20.2: Implement CSS/Canvas Hybrid Rendering Architecture

**As a** developer optimizing rendering performance
**I want** a CSS/Canvas hybrid architecture where CSS handles background transitions and canvas handles game objects
**So that** GPU compositing accelerates visual effects while maintaining module boundaries

**Acceptance Criteria:**
- Given the playfield background needs smooth score-based transitions
- When implementing the hybrid rendering pattern
- Then background-color is controlled via CSS class on canvas element (NOT canvas fillRect)
- And canvas rendering focuses ONLY on game objects
- And CSS transition animates background-color over 2 seconds
- And performance budget is maintained (58+ FPS)

---

### Story 20.3: Create Progressive Grid Opacity System

**As a** player
**I want** the grid to progressively fade as my score increases
**So that** the game becomes more challenging at high scores, requiring stronger spatial awareness

**Acceptance Criteria:**
- Given grid provides spatial scaffolding at low scores
- When score increases across tiers
- Then grid opacity progressively decreases: tier-0 0.9 → tier-5 0.3
- And grid remains minimally visible at tier-5 (0.3 opacity ensures WCAG compliance)
- And this intentional difficulty increase aligns with working memory training goals

---

### Story 20.4: Implement Background Transition Logic

**As a** player
**I want** smooth background color transitions when I cross score thresholds
**So that** the visual transformation feels cinematic and earned, not jarring

**Acceptance Criteria:**
- Given the player's score crosses a tier threshold
- When the tier change is detected
- Then game.js updates the canvas element's className to the new tier class
- And CSS transition animates the change over 2 seconds
- And tier changes are event-driven (not per-frame polling)
- And game reset returns to tier-0 cleanly

---

### Story 20.5: Create Event-Driven Border State Foundation

**As a** developer preparing for Epic 21's reactive border
**I want** an event-driven border state management system
**So that** border color updates happen only when game events occur, not via per-frame polling

**Acceptance Criteria:**
- Given the border will react to 7 different game states
- When creating the border state foundation
- Then a border state manager tracks current state and priority
- And game events trigger state updates (event-driven, NOT 60 checks/sec)
- And state priority cascade is defined: death > phone > combo > effects > default

---

### Story 20.6: Test Visual Transformation and Performance

**As a** QA tester
**I want** to validate the progressive visual transformation and performance
**So that** Epic 20 meets all functional and non-functional requirements

**Acceptance Criteria:**
- Given Epic 20 implementation is complete
- When running visual transformation tests
- Then all 6 tiers display correct colors with smooth 2-second transitions
- When running performance tests
- Then FPS remains 58+ during tier transitions
- When testing emotional progression
- Then tier-5 feels like "entering final boss arena"
