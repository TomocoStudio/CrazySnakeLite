# Epic 21: Immersive Arcade Polish (Authenticity & Personality)

**Status:** 🔴 NOT STARTED
**Created:** 2026-02-16
**Completed:** —

---

## Overview

Layer atmospheric polish and character personality onto the Neon Noir foundation, creating an authentic 80s arcade experience through CRT scanlines, reactive border feedback, directional snake personality, and dramatic text treatments. Implements snake head enhancements (pupils track movement direction, top-light reflection, body outline at score 50 for dark BG visibility), typography treatments (chrome/neon title, depth-shadowed GAME OVER, pulsing gold NEW HIGH SCORE), CRT scanline texture (3% opacity repeating gradient), reactive border (7 color states with priority cascade: death red flash > phone gold/green > combo sync > effects orange/yellow > default purple), grid intersection dots (1.5px radius, 525 dots cached via offscreen canvas for performance), and completes event-driven border orchestration.

**FRs covered:** FR-V3-4 (Snake Head Enhancements), FR-V3-5 (Typography Treatments), FR-V3-6 (CRT Scanlines), FR-V3-7 (Reactive Border 7 states), FR-V3-8 (Grid Intersection Dots), FR-V3-12 (Event-Driven Border complete), FR-V3-13 (Offscreen Canvas Caching)

**NFRs covered:** NFR-V3-1 (Performance Budget with offscreen optimization), NFR-V3-4 (Reduced Motion: disable high score pulse), NFR-V3-5 (Visual Coherence), NFR-V3-6 (Zero Dependencies, browser-native only), NFR-V3-8 (GPU Optimization)

**Value:** The polish layer that makes players feel "this is an 80s arcade." Snake pupils tracking direction create subtle sense of agency — the snake is *looking* where it's heading, not just moving there (Pac-Man wedge-mouth technique). Typography text-shadows create emotional punctuation: title feels iconic, GAME OVER has gravitas, NEW HIGH SCORE is triumph. CRT scanlines are felt more than seen (subliminal texture at 3% opacity). Reactive border communicates game state peripherally — gold pulse means reward opportunity (phone), orange means danger (RC), red flash is visceral death feedback against dark void. Grid dots add circuit-board aesthetic + subtle spatial aid. Offscreen canvas caching reduces grid dot rendering from 1,050 ops/frame to 1 op/frame (1000x performance gain). All enhancements pass Five-Question Filter validation.

---

## Stories

### Story 21.1: Implement Snake Head Enhancements

**As a** player
**I want** the snake head to show personality through pupils that track movement direction, top-light reflection, and body outline at high scores
**So that** the snake feels alive and intentional, not just a moving line

**Acceptance Criteria:**
- Given the snake is moving in any direction
- When rendering the snake head
- Then pupils are positioned in the direction of movement
- And a subtle top-light reflection appears on the head segment
- Given the player reaches score 50+ (dark background tiers)
- Then each body segment displays a 1px outline for visibility

---

### Story 21.2: Create Typography Treatments

**As a** player
**I want** dramatic text styling for title, GAME OVER, and NEW HIGH SCORE
**So that** key moments have emotional punctuation and feel iconic

**Acceptance Criteria:**
- Given the game title appears on the menu/start screen
- When rendering the title
- Then it uses chrome/neon text effect with CSS text-shadow
- Given the game ends
- Then "GAME OVER" uses depth/shadow effect with dark offset shadow
- Given the player achieves a new high score
- Then "NEW HIGH SCORE" uses pulsing gold effect via CSS animation
- And pulsing is disabled if user has prefers-reduced-motion enabled

---

### Story 21.3: Implement CRT Scanline Overlay

**As a** player
**I want** a subtle CRT scanline texture overlaying the playfield
**So that** the game evokes authentic 80s arcade CRT monitor aesthetics

**Acceptance Criteria:**
- Given the playfield is rendered
- When adding the scanline overlay
- Then it uses a CSS pseudo-element with repeating-linear-gradient
- And scanlines are 2px transparent/2px rgba(0,0,0,0.03) creating subtle texture
- And overlay opacity is 3% (felt more than seen, subliminal texture)
- And overlay uses pointer-events: none

---

### Story 21.4: Complete Reactive Border with 7 Color States

**As a** player
**I want** the arcade bezel border to reactively change color based on game state
**So that** I receive peripheral feedback about danger, rewards, and power-ups

**Acceptance Criteria:**
- Given the border state foundation from Story 20.5 exists
- When implementing the 7-state reactive border
- Then border displays 7 colors based on priority: death red > phone gold/green > combo > effects > default
- And state priority cascade ensures highest priority wins
- And border updates are event-driven (NOT per-frame polling)
- Given the player dies
- Then border flashes red for 0.3s against dark void (visceral feedback)

---

### Story 21.5: Implement Grid Intersection Dots with Offscreen Caching

**As a** player
**I want** subtle dots at grid intersections creating a circuit-board aesthetic
**So that** the playfield has refined spatial texture without performance cost

**Acceptance Criteria:**
- Given the grid has 26x22 intersections (~525 interior dots)
- When rendering grid intersection dots
- Then each intersection displays a 1.5px radius circle in grid line color
- And dots are rendered via offscreen canvas caching pattern
- Given offscreen canvas caching is implemented
- Then cached version reduces operations from 1,050 ops/frame to 1 op/frame (~1000x gain)

---

### Story 21.6: Integrate Border Orchestration Across Game Events

**As a** developer completing the border state system
**I want** all game modules to emit border state events to the central orchestrator
**So that** border color accurately reflects game state via priority cascade

**Acceptance Criteria:**
- Given the reactive border system from Story 21.4 exists
- When integrating border orchestration
- Then all game modules emit border events (death, phone, combo, effects)
- And priority cascade resolves to highest priority active state
- And event-driven design achieves ~5 updates/game (not 60/sec)

---

### Story 21.7: Test Immersive Arcade Polish and Performance

**As a** QA tester
**I want** to validate all polish enhancements and performance optimizations
**So that** Epic 21 meets all functional and non-functional requirements

**Acceptance Criteria:**
- Given Epic 21 implementation is complete
- When running visual polish tests
- Then snake pupils, outline, typography, scanlines, and grid dots display correctly
- When running reactive border tests
- Then all 7 states trigger with proper priority cascade
- When running performance tests
- Then FPS remains 58+ with all polish features active
- And offscreen caching achieves ~1000x performance gain
- When testing accessibility
- Then prefers-reduced-motion disables animations
