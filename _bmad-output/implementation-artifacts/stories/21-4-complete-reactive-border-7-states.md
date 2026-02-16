# Story 21.4: Complete Reactive Border with 7 Color States

**Epic:** 21 - Immersive Arcade Polish (Authenticity & Personality)
**Status:** 🔴 NOT STARTED
**Created:** 2026-02-16
**Completed:** —

---

## User Story

**As a** player
**I want** the arcade bezel border to reactively change color based on game state
**So that** I receive peripheral feedback about danger, rewards, and power-ups without looking away from the snake

---

## Acceptance Criteria

**Given** the border state foundation from Story 20.5 exists
**When** implementing the 7-state reactive border
**Then** border displays 7 distinct colors based on priority cascade:
  1. Death: Red flash (0.3s duration)
  2. Phone ringing: Gold pulse (2s animation loop)
  3. Phone answered: Green flash (0.5s)
  4. Combo active: Synced to combo color (purple/cyan)
  5. Effect active: Orange (RC) or Yellow (other effects)
  6. Default low score: Purple
  7. Default high score (50+): Cyan

**And** state priority cascade ensures highest priority state wins (death > phone > combo > effects > default)
**And** border updates are event-driven via border state manager (NOT per-frame polling)
**And** CSS classes define border colors and animations
**And** gold pulse uses CSS @keyframes for border-color animation

**Given** the player dies
**When** death event triggers
**Then** border flashes red for 0.3s against dark void background (visceral feedback)

**Given** the phone rings
**When** phone event triggers
**Then** border pulses gold, creating peripheral "reward opportunity" signal

---

## Technical Notes

- Module: `game.js` (border state manager), `style.css` (border color classes + animations)
- Dependencies: Story 20.5 (border state foundation)
- Pattern: Border State Orchestration (Decision 15, Pattern 13)
- Event sources: death, phone.ring, phone.answered, combo.start/end, effects.activate/expire
- Reference: FR-V3-7 (Reactive Border 7 states), FR-V3-12 (Event-Driven Border complete)
- Cognitive principle: Peripheral color signals create subconscious game state awareness
- Validation: Trigger all 7 states, verify priority cascade, check event-driven updates (should be ~5/game, not 60/sec)

---

## Tasks / Subtasks

### Task 1: Implement Priority Cascade in updateBorderState()
- [ ] Create `updateBorderState(gameState)` function in `game.js`
- [ ] Implement 7-state priority cascade (death > phone > combo > effects > default)
- [ ] Clear all border classes before applying new state
- [ ] Use early returns for each priority level
- [ ] Map AC: "state priority cascade ensures highest priority wins"

### Task 2: Add Border State CSS Classes
- [ ] Add 7 border color classes to `style.css` (`.border-death`, `.border-phone-ring`, etc.)
- [ ] Set border-color for each state (red, gold, green, combo dynamic, orange, yellow, purple)
- [ ] Add CSS transition for smooth color changes (300ms ease-in-out)
- [ ] Map AC: "CSS classes define border colors and animations"

### Task 3: Integrate Death Border Flash
- [ ] In `game.js onDeath()`, set `gameState.justDied = true` flag
- [ ] Call `updateBorderState(gameState)` to trigger red border
- [ ] Set timeout to clear flag after `CONFIG.BORDER_DEATH_FLASH_DURATION` (500ms)
- [ ] Re-evaluate border state after timeout
- [ ] Map AC: "border flashes red for 0.3s against dark void"

### Task 4: Integrate Phone Ring Border Pulse
- [ ] In `game.js onPhoneCallShow()`, call `updateBorderState(gameState)`
- [ ] Border should display gold when `phoneCall.active && !phoneCall.pickedUp`
- [ ] Map AC: "border pulses gold, creating peripheral reward opportunity signal"

### Task 5: Integrate Phone Pickup Border
- [ ] When phone picked up, border shows green
- [ ] Green persists until pickup timer expires
- [ ] Call `updateBorderState()` on phone dismiss to return to default/effect state
- [ ] Map AC: "Phone answered: Green flash (0.5s)"

### Task 6: Integrate Combo Border Sync
- [ ] When combo active, border matches `gameState.combo.canvasColor`
- [ ] Use inline style for dynamic color: `canvas.style.borderColor = gameState.combo.canvasColor`
- [ ] Priority: below phone, above effects
- [ ] Map AC: "Combo active: Synced to combo color (purple/cyan)"

### Task 7: Integrate Effect Border States
- [ ] Reverse Controls: orange border (`#FFA500`)
- [ ] Invincibility: yellow border (`#FFFF00`)
- [ ] Other effects: default purple
- [ ] Priority: below combo, above default
- [ ] Map AC: "Effect active: Orange (RC) or Yellow (other effects)"

### Task 8: Add Event-Driven Update Calls
- [ ] Call `updateBorderState()` in: onDeath, onPhoneShow, onPhoneDismiss, onFoodEaten (if effect changed), onComboActivate, onComboExit
- [ ] Do NOT call in main game loop (polling forbidden)
- [ ] Map AC: "border updates are event-driven (NOT per-frame polling)"

### Task 9: Add Border Configuration to config.js
- [ ] Add `BORDER_COLORS` object with 7 color values
- [ ] Add `BORDER_DEATH_FLASH_DURATION: 500` (ms)

### Task 10: Test Reactive Border System
- [ ] Test all 7 states trigger correctly
- [ ] Test priority cascade (phone ring overrides combo, death overrides all)
- [ ] Test event-driven pattern (verify ~5-10 updates per game, not 60/sec)
- [ ] Test death flash timing (500ms red, then return to underlying state)
- [ ] Test combo border sync (matches canvas color)
- [ ] Edge case: Death during phone pickup preserves pickup state after flash
- [ ] Edge case: Multiple simultaneous states (combo + RC) resolve correctly

---

## Dev Notes

### File Locations
- **Primary:** `/Users/anthonysalvi/code/CrazySnakeLite/js/game.js` - `updateBorderState()` function and event-driven calls
- **CSS:** `/Users/anthonysalvi/code/CrazySnakeLite/css/style.css` - border color classes and transitions
- **Config:** `/Users/anthonysalvi/code/CrazySnakeLite/js/config.js` - border color values and timing

### Priority Cascade Implementation Pattern
```javascript
// game.js — border state management
function updateBorderState(gameState) {
  const canvas = document.getElementById('game-canvas');

  // Clear all border classes first
  canvas.classList.remove(
    'border-death',
    'border-phone-ring',
    'border-phone-pickup',
    'border-combo',
    'border-reverse',
    'border-invincibility'
  );

  // Priority cascade (highest to lowest)
  // 1. Death flash (500ms, then auto-clear)
  if (gameState.justDied) {
    canvas.classList.add('border-death');
    setTimeout(() => {
      canvas.classList.remove('border-death');
      gameState.justDied = false;
      updateBorderState(gameState); // Re-evaluate after flash
    }, CONFIG.BORDER_DEATH_FLASH_DURATION);
    return;
  }

  // 2. Phone states (time-critical decision point)
  if (gameState.phoneCall.active && !gameState.phoneCall.pickedUp) {
    canvas.classList.add('border-phone-ring');
    return;
  }

  if (gameState.phoneCall.pickedUp && gameState.phoneCall.pickUpEndTime > Date.now()) {
    canvas.classList.add('border-phone-pickup');
    return;
  }

  // 3. Combo (ambient state, lower priority)
  if (gameState.combo.active) {
    canvas.classList.add('border-combo');
    // Dynamic color from combo system
    canvas.style.borderColor = gameState.combo.canvasColor;
    return;
  }

  // 4. Active effect (Reverse Controls > Invincibility)
  if (gameState.activeEffect?.type === 'reverseControls') {
    canvas.classList.add('border-reverse');
    return;
  }

  if (gameState.activeEffect?.type === 'invincibility') {
    canvas.classList.add('border-invincibility');
    return;
  }

  // 5. Default purple (CSS default, no class needed)
  canvas.style.borderColor = ''; // Clear inline style, let CSS take over
}
```

### CSS Border Classes Implementation
```css
/* Default border with transition */
#game-canvas {
  border: 8px solid #800080;  /* Purple default */
  transition:
    background-color 2000ms ease-in-out,  /* Enhancement 1 transition */
    border-color 300ms ease-in-out;        /* Border transition */
}

/* Border state classes */
#game-canvas.border-phone-ring {
  border-color: #FFD700;  /* Gold */
}

#game-canvas.border-phone-pickup {
  border-color: #28a745;  /* Green */
}

#game-canvas.border-combo {
  /* border-color set dynamically via JS style property */
  /* Transition still applies */
}

#game-canvas.border-invincibility {
  border-color: #FFFF00;  /* Yellow */
}

#game-canvas.border-reverse {
  border-color: #FFA500;  /* Orange */
}

#game-canvas.border-death {
  border-color: #FF0000;  /* Red */
  transition: border-color 100ms ease-in;  /* Fast snap for death */
}
```

### Event-Driven Call Points
```javascript
// game.js — call updateBorderState() at these points:

function onDeath(gameState) {
  // ... existing death logic ...
  gameState.justDied = true;
  updateBorderState(gameState);
}

function onPhoneCallShow(gameState) {
  // ... existing phone logic ...
  updateBorderState(gameState);
}

function onPhoneCallDismiss(gameState) {
  // ... existing phone logic ...
  updateBorderState(gameState);
}

function onFoodEaten(gameState) {
  // ... existing food logic ...

  // If effect changed, update border
  const effectChanged = /* logic to detect effect change */;
  if (effectChanged) {
    updateBorderState(gameState);
  }
}

function onComboActivate(gameState) {
  // ... existing combo logic ...
  updateBorderState(gameState);
}

function onComboExit(gameState) {
  // ... existing combo logic ...
  updateBorderState(gameState);
}
```

### Configuration Values
```javascript
// config.js — ADD THESE
export const BORDER_COLORS = {
  default: '#800080',
  phoneRing: '#FFD700',
  phonePickup: '#28a745',
  invincibility: '#FFFF00',
  reverseControls: '#FFA500',
  death: '#FF0000'
};

export const BORDER_DEATH_FLASH_DURATION = 500;  // ms
```

### Integration Points
- **Existing border:** Canvas already has 8px border with purple default. This system adds CSS classes to change the color.
- **Existing phone system:** Phone overlay already triggers show/dismiss events. Add `updateBorderState()` calls to these handlers.
- **Existing combo system:** Combo already sets `gameState.combo.canvasColor`. Border syncs to this value.
- **Existing effects:** Effects already stored in `gameState.activeEffect`. Border reads this state.

### Performance Considerations
- **Event-driven pattern:** Border updates only on state changes (death, phone, combo, effects). Typical game: ~5-10 updates total, NOT 60/sec.
- **CSS transitions:** GPU-accelerated. No FPS impact.
- **Class manipulation:** DOM operation cost is negligible (< 0.1ms).

---

## Project Structure Notes

### Module Boundaries (project-context.md compliance)
- **game.js:** Orchestrates border state updates. Does NOT render visuals (that's CSS). Reads gameState, emits DOM class changes.
- **style.css:** Defines border colors and transitions. Does NOT contain game logic.
- **config.js:** Owns all color values and timing constants.

### V4 Pattern Alignment
- **Event-driven border updates:** Pattern from ux-design-retro-graphic-upgrade-technical-addendum.md Pattern 2 (lines 63-131)
- **Priority cascade:** Mirrors audio.js priority system from V2 (highest priority wins)
- **CSS/Canvas hybrid:** Border is CSS (GPU-composited transitions), canvas background is also CSS (Enhancement 1)

### State Management
- **New state field:** `gameState.justDied` (boolean) - temporary flag for death flash timing
- **Existing state fields:** `phoneCall.active`, `phoneCall.pickedUp`, `combo.active`, `activeEffect.type`
- **No persistent border state:** Border color is derived from gameState, not stored separately

---

## References

### UX Design Specifications
- **ux-design-retro-graphic-upgrade.md - Enhancement 7:** "Reactive Arcade Bezel Border"
  - Border State Table: 7 colors with priority cascade (line 693)
  - Priority Resolution: death > phone > combo > effects > default (line 763)
  - Five-Question Filter validation (line 773)
- **ux-design-retro-graphic-upgrade-technical-addendum.md - Pattern 2:** Border State Orchestration (lines 63-171)
  - Complete `updateBorderState()` implementation
  - CSS border classes
  - Event-driven call points

### Project Context V4 Patterns
- **project-context.md - V4 Border State Pattern:** Event-driven ONLY, NEVER poll in game loop (line 362)
- **project-context.md - V2 DOM & CSS Patterns:** Visual state changes use CSS classes (line 165)
- **project-context.md - Module Boundaries:** game.js orchestrates, style.css owns visuals (line 481)

### Cognitive Science Validation
- **80s Design Principle:** "Arcade cabinet bezel wasn't just a frame — it was a design canvas" - 80s Graphic Design Overview
- **Five-Question Filter (Enhancement 7):**
  - Working Memory: Near-zero WM cost (peripheral signal, preattentive processing)
  - Competence Feedback: Border reacting to events = environmental responsiveness = competence validation
  - Clarity: Each color is maximally distinct and semantically consistent
  - Flow Preservation: Peripheral signals reduce need to check UI elements
  - Emotional Impact: Death flash (100ms snap to red) is visceral, instant, unmistakable
