# Story 16.8: Apply Consistent Dashboard Styling

**Epic:** 16 - Skill Map Dashboard (The Cognitive Mirror)

**As a** player,
**I want** the Skill Map to match CrazySnake's visual aesthetic,
**So that** it feels like part of the game, not a separate analytics tool.

---

## Acceptance Criteria

**Given** Skill Map renders
**When** applying visual styling
**Then** use design system consistently:
- Background overlay: rgba(0, 0, 0, 0.9) (90% black, same as game over screen)
- Border: 8px solid rgb(157, 178, 221) (purple theme)
- Outer shadow: 0 0 0 8px #1A1A2E (dark border layer)
- Border radius: 12px (rounded menu frame style)
- Font: Jersey20 throughout
- Text colors: White #FFFFFF for primary, light grey #B0B0B0 for secondary

**And** all UI elements follow retro 8-bit pixel art aesthetic (per FR205)
**And** no smooth gradients, no drop shadows (except structural borders), no modern effects

**Given** Skill Map container renders
**When** positioning on screen
**Then** center horizontally and vertically
**And** max-width: 600px (desktop), full-width minus padding (mobile)
**And** padding: 40px (desktop), 20px (mobile)

**Given** mobile viewport (< 768px)
**When** Skill Map displays
**Then** stack all elements vertically
**And** reduce font sizes by 15% for readability
**And** block bars scale proportionally (maintain 16x16px blocks or scale to 14x14px)

**Per FR181:** Dashboard uses purple theme color rgb(157, 178, 221) for borders and accents

---

## Dev Section

### Technical Context

**Story Purpose:** Final visual polish pass across the entire Skill Map dashboard. Ensures consistent application of the retro pixel aesthetic, purple theme color, Jersey20 font, and responsive mobile layout. This is the "design system enforcement" story — no new features, just visual coherence.

**Architecture Pattern:** Pure CSS work. No JavaScript changes. Audits all dashboard elements (from stories 16.1-16.7) for consistency with CrazySnake's established visual language.

**Key UX Insight:** The dashboard must feel like CrazySnake, not a separate analytics tool. Visual coherence is critical to the player experience (see ux-design-cognitive-dashboard.md § "Visual Design System Integration").

### Files to Modify

**MODIFY:**
- `css/style.css` — Audit and unify all dashboard styles

**READ (context):**
- `_bmad-output/planning-artifacts/ux-design-cognitive-dashboard.md` — Color palette, typography specs, z-index layers
- `css/style.css` — Existing game styles (menu, game-over, phone overlay) for design system reference

### Implementation Guidance

#### 1. Design System Audit

**Reference existing CrazySnake visual patterns:**

From phone.js, menu screens, game-over screen:
- Background overlay: `rgba(0, 0, 0, 0.9)` (90% black)
- Border: `8px solid rgb(157, 178, 221)` (purple theme)
- Outer shadow: `0 0 0 8px #1A1A2E` (dark border layer)
- Border radius: `12px` (rounded menu frame style)
- Font: `Jersey20` throughout
- Text primary: `#FFFFFF` (white)
- Text secondary: `#B0B0B0` (light grey)

**Dashboard-specific elements added in stories 16.1-16.7:**
- Skill Map screen container
- Block bars (filled/empty)
- Callout cards
- Session/streak stats
- Quote card
- Play Now button
- Back to Menu link

**Audit checklist:** Verify each element uses the design system consistently.

#### 2. Consolidated Dashboard Styles (css/style.css)

**Complete Skill Map section with all stories 16.1-16.8:**

```css
/* ========================================
   SKILL MAP DASHBOARD (V3)
   ======================================== */

/* === Screen Container === */
#skill-map-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);  /* Match game-over screen */
  z-index: 350;  /* Between tooltips (300) and phone (400) */
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 1;
  transition: opacity 300ms ease-in-out;
}

#skill-map-screen.hidden {
  opacity: 0;
  pointer-events: none;
}

.skill-map-container {
  max-width: 600px;
  width: 90%;
  padding: 40px;
  border: 8px solid rgb(157, 178, 221);  /* Purple theme */
  box-shadow: 0 0 0 8px #1A1A2E;  /* Dark border layer */
  border-radius: 12px;
  background: rgba(0, 0, 0, 0.85);
}

.skill-map-title {
  font-family: 'Jersey20', sans-serif;
  font-size: 28px;
  color: #FFFFFF;
  text-align: center;
  margin-bottom: 30px;
}

/* === Block Bars (Story 16.2) === */
#skill-map-bars-container {
  margin-bottom: 20px;
}

.block-bar-row {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  gap: 12px;
}

.domain-label {
  font-family: 'Jersey20', sans-serif;
  font-size: 14px;
  color: #FFFFFF;
  min-width: 120px;
  text-align: left;
}

.blocks-container {
  display: flex;
  gap: 2px;
}

.block {
  width: 16px;
  height: 16px;
  border-radius: 0;  /* Perfect squares, no rounded corners */
}

.block.filled {
  background-color: rgb(157, 178, 221);  /* Purple theme */
  border: none;
}

.block.empty {
  background-color: #3A3A3A;  /* Dark grey */
  border: 1px solid #555555;  /* Subtle border */
}

.rating-text {
  font-family: 'Jersey20', sans-serif;
  font-size: 12px;
  color: #B0B0B0;  /* Light grey */
  margin-left: 8px;
  min-width: 30px;
}

/* === Growth Indicators (Story 16.3) === */
.indicators {
  display: inline-flex;
  gap: 6px;
  margin-left: 8px;
}

.indicator {
  font-size: 14px;
  font-weight: bold;
}

.indicator.star {
  color: #FFC107;  /* Gold */
}

.indicator.growth-arrow {
  color: #81C784;  /* Light green */
}

.indicator.improved-arrow {
  color: #81C784;  /* Green */
}

/* === Callout Cards (Story 16.3) === */
#skill-map-callouts {
  margin-top: 30px;
  margin-bottom: 20px;
}

.callout-card {
  background: rgba(26, 26, 46, 0.6);
  border: 2px solid rgb(157, 178, 221);  /* Purple theme */
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.callout-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 8px;
}

.callout-icon {
  font-size: 18px;
  font-weight: bold;
}

.callout-icon.star {
  color: #FFC107;
}

.callout-icon.growth {
  color: #81C784;
}

.callout-title {
  font-family: 'Jersey20', sans-serif;
  font-size: 16px;
  font-weight: bold;
  color: #FFFFFF;
}

.callout-quote {
  font-family: 'Jersey20', sans-serif;
  font-size: 14px;
  font-style: italic;
  color: #B0B0B0;
  padding-left: 26px;  /* Indent quote */
  line-height: 1.4;
}

/* === Session & Streak Stats (Story 16.4) === */
#skill-map-stats {
  margin-bottom: 20px;
}

.session-stats-row {
  display: flex;
  justify-content: center;
  gap: 40px;
  margin-top: 20px;
  margin-bottom: 20px;
}

.session-count,
.streak-count {
  font-family: 'Jersey20', sans-serif;
  font-size: 14px;
  color: #B0B0B0;  /* Light grey */
}

.streak-count {
  font-weight: bold;
}

.streak-count.milestone {
  color: #FFD700;  /* Gold */
  animation: pulse-milestone 2s ease-in-out infinite;
}

@keyframes pulse-milestone {
  0%, 100% {
    transform: scale(1.0);
  }
  50% {
    transform: scale(1.05);
  }
}

.streak-count.streak-broken {
  color: #B0B0B0;
  font-style: italic;
}

/* === Quote Card (Story 16.5) === */
#skill-map-quote {
  margin-top: 20px;
  margin-bottom: 20px;
}

.quote-card {
  background: rgba(26, 26, 46, 0.4);
  border: 1px solid rgba(157, 178, 221, 0.3);  /* Subtle purple border */
  border-radius: 8px;
  padding: 16px;
}

.quote-text {
  font-family: 'Jersey20', sans-serif;
  font-size: 14px;
  font-style: italic;
  color: #B0B0B0;
  line-height: 1.4;
  margin: 0 0 12px 0;
}

.caller-attribution {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.caller-portrait-small {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid rgba(157, 178, 221, 0.5);
}

.caller-name {
  font-family: 'Jersey20', sans-serif;
  font-size: 12px;
  color: #B0B0B0;
}

/* === Play Now Button (Story 16.6) === */
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
  background: rgb(157, 178, 221);
  color: #1A1A2E;
  transform: scale(1.05);
  box-shadow: 0 0 12px rgba(157, 178, 221, 0.6);
}

#play-now-btn:active {
  transform: scale(0.98);
  box-shadow: 0 0 8px rgba(157, 178, 221, 0.8);
}

#play-now-btn:focus {
  outline: 2px solid rgb(157, 178, 221);
  outline-offset: 4px;
}

/* === Back to Menu Link (Story 16.7) === */
#back-to-menu-link {
  display: block;
  text-align: center;
  margin-top: 16px;
  font-family: 'Jersey20', sans-serif;
  font-size: 14px;
  color: #B0B0B0;
  text-decoration: none;
  cursor: pointer;
  transition: color 150ms ease-in-out;
}

#back-to-menu-link:hover {
  color: rgb(157, 178, 221);
  text-decoration: underline;
}

#back-to-menu-link:focus {
  outline: 2px solid rgb(157, 178, 221);
  outline-offset: 4px;
  border-radius: 4px;
}

#back-to-menu-link:active {
  color: #FFFFFF;
}

/* === Calibration Placeholder === */
.calibration-message {
  font-family: 'Jersey20', sans-serif;
  font-size: 16px;
  color: #B0B0B0;
  text-align: center;
  margin-top: 30px;
  line-height: 1.6;
}

/* ========================================
   RESPONSIVE MOBILE LAYOUT (< 768px)
   ======================================== */

@media (max-width: 768px) {
  .skill-map-container {
    width: 95%;
    padding: 20px;
  }

  .skill-map-title {
    font-size: 24px;
    margin-bottom: 20px;
  }

  /* Block bars */
  .block-bar-row {
    gap: 8px;
  }

  .domain-label {
    min-width: 90px;
    font-size: 12px;
  }

  .block {
    width: 14px;
    height: 14px;
  }

  .rating-text {
    font-size: 10px;
  }

  /* Callouts */
  .callout-card {
    padding: 12px;
  }

  .callout-title {
    font-size: 14px;
  }

  .callout-quote {
    font-size: 12px;
    padding-left: 20px;
  }

  /* Session stats */
  .session-stats-row {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .session-count,
  .streak-count {
    font-size: 12px;
  }

  /* Quote */
  .quote-text {
    font-size: 12px;
  }

  .caller-name {
    font-size: 10px;
  }

  .caller-portrait-small {
    width: 28px;
    height: 28px;
  }

  /* Play Now button */
  #play-now-btn {
    width: 100%;
    max-width: 300px;
    min-height: 44px;
    font-size: 18px;
    padding: 14px 20px;
  }

  /* Back to Menu link */
  #back-to-menu-link {
    font-size: 12px;
    margin-top: 12px;
  }
}

/* ========================================
   REDUCED MOTION
   ======================================== */

@media (prefers-reduced-motion: reduce) {
  #skill-map-screen {
    transition: none;
  }

  .streak-count.milestone {
    animation: none;
  }

  #play-now-btn {
    transition: none;
  }

  #play-now-btn:hover {
    transform: none;
  }

  #back-to-menu-link {
    transition: none;
  }
}
```

### Testing Guidance

**Visual Consistency Checklist:**

1. **Color Palette:**
   - [ ] Purple theme rgb(157, 178, 221) used for: screen border, block fills, callout borders, button border, focus outlines
   - [ ] Background: rgba(0, 0, 0, 0.9) matches game-over screen
   - [ ] Text primary: #FFFFFF for titles, labels, button text
   - [ ] Text secondary: #B0B0B0 for rating text, quotes, session info, Back to Menu link
   - [ ] No color deviations from design system

2. **Typography:**
   - [ ] Jersey20 font used throughout (all text elements)
   - [ ] Font sizes: 28px title, 20px button, 16px callout titles, 14px labels/quotes, 12px attribution
   - [ ] No fallback fonts rendering (Jersey20 loads correctly)

3. **Layout & Spacing:**
   - [ ] Screen container: max-width 600px, 90% width, 40px padding (desktop)
   - [ ] Border: 8px solid purple + 8px dark outer shadow
   - [ ] Border radius: 12px (consistent with menu/game-over screens)
   - [ ] Section spacing: 20-30px between major sections
   - [ ] No layout jank or misalignment

4. **Retro Aesthetic:**
   - [ ] Block bars: perfect 16x16px squares, no rounded corners
   - [ ] No smooth gradients (only flat colors)
   - [ ] No drop shadows (except structural borders)
   - [ ] Visual feels like CrazySnake, not a corporate dashboard

5. **Z-Index Layers:**
   - [ ] Skill Map at z-index 350 (above game canvas, below phone overlay)
   - [ ] No z-index conflicts or visual stacking issues

6. **Mobile Responsive (< 768px):**
   - [ ] Container width: 95%, padding: 20px
   - [ ] All text 15% smaller: title 24px, labels 12px, quotes 12px
   - [ ] Block bars: 14x14px (down from 16x16px)
   - [ ] Session stats: stack vertically (not horizontal)
   - [ ] Play Now: full-width (max 300px), 44px min height
   - [ ] All content readable, no horizontal scroll

7. **Reduced Motion:**
   - [ ] prefers-reduced-motion: no animations (milestone pulse, hover scale, fade transitions)
   - [ ] Dashboard still functional with instant transitions

### Definition of Done

- [ ] All dashboard styles consolidated in single CSS section
- [ ] Purple theme rgb(157, 178, 221) applied consistently to borders and accents
- [ ] Jersey20 font used throughout
- [ ] Text colors: #FFFFFF (primary), #B0B0B0 (secondary)
- [ ] Background: rgba(0, 0, 0, 0.9) matches game-over screen
- [ ] Border: 8px solid purple + 8px dark outer shadow
- [ ] Z-index 350 (no conflicts)
- [ ] Mobile responsive layout (< 768px): vertical stack, 15% smaller fonts, 14x14px blocks
- [ ] Reduced motion handling: no animations if prefers-reduced-motion
- [ ] Retro aesthetic preserved: flat colors, no gradients, square blocks
- [ ] Visual consistency checklist passed (7/7 scenarios)
- [ ] No console errors
- [ ] Skill Map visually indistinguishable from game's native screens (menu, game-over, phone)

### Dependencies

**Blocked By:**
- Stories 16.1-16.7 complete (all dashboard elements exist)

**Blocks:**
- Story 16.9 (performance testing requires final visual implementation)

### References

- [Source: ux-design-cognitive-dashboard.md — Visual Design System Integration, Color Palette, Typography, Z-Index Layers]
- [Source: project-context.md — V3 Design System, Retro Pixel Aesthetic]
- [Source: css/style.css — Existing menu/game-over/phone styles for reference]
