# Story 15.2: Add Session Counter and Progress Tracking

**Epic:** 15 - Calibration Period System

**As a** player during calibration,
**I want** to see my progress toward unlock,
**So that** I know how many sessions remain before the full Skill Map appears.

---

## Acceptance Criteria

**Given** player completes session 1
**When** post-game summary displays
**Then** show calibration counter:
```
Session 1/5 — Warming up...
```
**And** text in 12px Jersey20, light grey #B0B0B0

**Given** player completes session 3
**When** post-game summary displays
**Then** show:
```
Session 3/5 — Warming up...
```
**And** subtle pulsing animation (opacity 0.7 → 1.0 → 0.7, 2s cycle per UX design)

**Given** player tries to access "Skill Map" button during calibration
**When** button is clicked (if shown)
**Then** display tooltip:
```
Complete 5 sessions to unlock your Skill Map
Currently: Session 3/5
```
**And** button appears greyed out or disabled

**Given** player navigates to main menu during calibration
**When** menu displays
**Then** "Brain Map" option shows:
```
🔒 Skill Map (Session 3/5)
```
**And** clicking it shows same tooltip message

**Per FR184:** Calibration state displays "Calibrating your brain..." with session progress counter (Session 1/5, 2/5, 3/5...)

---

## Tasks / Subtasks

- [ ] **Task 1: Add calibration counter to post-game screen (cognitive-feedback.js)**
  - [ ] In `showPostGameScreen()`, check calibration status before rendering
  - [ ] Call `storage.getCalibrationStatus()` to get `{ isComplete, sessionsCompleted }`
  - [ ] If `!isComplete`, render calibration counter below highlights
  - [ ] Text content: `Session ${sessionsCompleted}/5 — Warming up...`
  - [ ] **Maps to AC:** "show calibration counter" in post-game summary

- [ ] **Task 2: Style calibration counter text**
  - [ ] Create CSS class `.calibration-counter` in style.css
  - [ ] Font: 12px Jersey20, color: #B0B0B0 (light grey)
  - [ ] Margin-top: 16px (spacing from highlights section)
  - [ ] Text-align: center
  - [ ] **Maps to AC:** "text in 12px Jersey20, light grey #B0B0B0"

- [ ] **Task 3: Add pulsing animation to calibration counter**
  - [ ] Create CSS keyframe `@keyframes calibration-pulse`
  - [ ] Opacity transition: 0.7 → 1.0 → 0.7
  - [ ] Animation duration: 2s, iteration: infinite, easing: ease-in-out
  - [ ] Apply animation to `.calibration-counter` class
  - [ ] **Maps to AC:** "subtle pulsing animation (opacity 0.7 → 1.0 → 0.7, 2s cycle)"

- [ ] **Task 4: Add locked Skill Map button state to post-game**
  - [ ] In cognitive-feedback.js, check `!isComplete` before rendering Skill Map button
  - [ ] If calibration incomplete, disable button or grey out with CSS
  - [ ] Add `.disabled` class with reduced opacity (0.5), cursor: not-allowed
  - [ ] **Maps to AC:** "button appears greyed out or disabled"

- [ ] **Task 5: Add tooltip to locked Skill Map button**
  - [ ] Create tooltip element with content:
    ```
    Complete 5 sessions to unlock your Skill Map
    Currently: Session 3/5
    ```
  - [ ] Position tooltip above button on hover/click
  - [ ] Tooltip background: `#2A2A2A`, text: `#E0E0E0`, padding: 8px, border-radius: 4px
  - [ ] **Maps to AC:** "display tooltip"

- [ ] **Task 6: Add locked state to main menu Skill Map option**
  - [ ] In main.js menu rendering, check `storage.getCalibrationStatus().isComplete`
  - [ ] If false, display: `🔒 Skill Map (Session ${sessionsCompleted}/5)`
  - [ ] Add same tooltip on click as post-game button
  - [ ] **Maps to AC:** "Brain Map option shows: 🔒 Skill Map (Session 3/5)"

- [ ] **Task 7: Implement menu option click handler for locked state**
  - [ ] On click during calibration, prevent navigation
  - [ ] Show modal or inline tooltip with unlock message
  - [ ] Modal dismisses on click outside or ESC key
  - [ ] **Maps to AC:** "clicking it shows same tooltip message"

---

## Dev Notes

### File Locations
- **Primary file:** `/Users/anthonysalvi/code/CrazySnakeLite/js/cognitive-feedback.js` (post-game screen rendering)
- **Secondary file:** `/Users/anthonysalvi/code/CrazySnakeLite/js/main.js` (main menu rendering)
- **Styling:** `/Users/anthonysalvi/code/CrazySnakeLite/css/style.css`
- **Storage read:** Call `storage.getCalibrationStatus()` (implemented in Story 15.1)

### Existing cognitive-feedback.js Structure

**Current exports:**
- `showPostGameScreen(gameState)` — renders highlights, caller quote, buttons
- `hidePostGameScreen()` — cleanup function

**Integration point:**
In `showPostGameScreen()`, after rendering highlights section, add calibration counter:
```javascript
export function showPostGameScreen(gameState) {
  // ... existing highlights rendering ...

  // Story 15.2: Add calibration counter if not complete
  const calibrationStatus = storage.getCalibrationStatus();

  if (!calibrationStatus.isComplete) {
    const counterEl = document.createElement('div');
    counterEl.className = 'calibration-counter';
    counterEl.textContent = `Session ${calibrationStatus.sessionsCompleted}/5 — Warming up...`;
    feedbackScreen.appendChild(counterEl);
  }

  // ... render buttons (Skill Map, Play Again, etc.) ...
}
```

### CSS Implementation

**Add to style.css:**
```css
/* Story 15.2: Calibration counter in post-game screen */
.calibration-counter {
  font-family: 'Jersey20', monospace;
  font-size: 12px;
  color: #B0B0B0;
  text-align: center;
  margin-top: 16px;
  animation: calibration-pulse 2s ease-in-out infinite;
}

@keyframes calibration-pulse {
  0%, 100% { opacity: 0.7; }
  50% { opacity: 1.0; }
}

/* Disabled Skill Map button during calibration */
.skill-map-button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
  pointer-events: none;  /* Prevent clicks */
}

/* Tooltip for locked Skill Map */
.calibration-tooltip {
  position: absolute;
  background: #2A2A2A;
  color: #E0E0E0;
  padding: 8px 12px;
  border-radius: 4px;
  font-size: 11px;
  white-space: nowrap;
  z-index: 1000;
  bottom: calc(100% + 8px);  /* Position above button */
  left: 50%;
  transform: translateX(-50%);
}

.calibration-tooltip::after {
  content: '';
  position: absolute;
  top: 100%;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #2A2A2A;  /* Arrow pointing down */
}
```

### Main Menu Integration

**In main.js menu rendering:**
```javascript
function renderMainMenu() {
  const calibrationStatus = storage.getCalibrationStatus();
  const menuOptions = [
    'New Game',
    calibrationStatus.isComplete
      ? '🎯 Skill Map'
      : `🔒 Skill Map (Session ${calibrationStatus.sessionsCompleted}/5)`,
    'Settings'
  ];

  // ... render menu ...

  // Add click handler for Skill Map option
  skillMapButton.addEventListener('click', () => {
    if (!calibrationStatus.isComplete) {
      showCalibrationTooltip(skillMapButton, calibrationStatus.sessionsCompleted);
      return;  // Prevent navigation
    }
    // Navigate to Skill Map (Epic 16)
    navigateToSkillMap();
  });
}

function showCalibrationTooltip(buttonEl, sessionsCompleted) {
  const tooltip = document.createElement('div');
  tooltip.className = 'calibration-tooltip';
  tooltip.innerHTML = `
    Complete 5 sessions to unlock your Skill Map<br>
    Currently: Session ${sessionsCompleted}/5
  `;
  buttonEl.appendChild(tooltip);

  // Auto-dismiss after 3 seconds
  setTimeout(() => tooltip.remove(), 3000);
}
```

### Button State Logic

**Post-game Skill Map button rendering:**
```javascript
// In showPostGameScreen()
const calibrationStatus = storage.getCalibrationStatus();

const skillMapBtn = document.createElement('button');
skillMapBtn.textContent = 'Skill Map';
skillMapBtn.className = calibrationStatus.isComplete
  ? 'skill-map-button'
  : 'skill-map-button disabled';

if (!calibrationStatus.isComplete) {
  skillMapBtn.addEventListener('click', (e) => {
    e.preventDefault();
    showCalibrationTooltip(skillMapBtn, calibrationStatus.sessionsCompleted);
  });
} else {
  skillMapBtn.addEventListener('click', () => {
    hidePostGameScreen();
    navigateToSkillMap();  // Epic 16
  });
}
```

### Project Structure Alignment

**Module Pattern:**
- cognitive-feedback.js imports `storage` module: `import { getCalibrationStatus } from './storage.js';`
- main.js imports `storage` module: same pattern
- Both files read-only consumers of calibration state (no writes)

**DOM Rendering Pattern (V3):**
- Static container in index.html: `<div id="cognitive-feedback-screen" class="hidden"></div>`
- Dynamic content via JS: `createElement()` + `appendChild()`
- Screen visibility: `.hidden` class toggle (NEVER `style.display`)

**Retro Aesthetic Compliance:**
- Jersey20 font (matches game-over screen, menu)
- Light grey #B0B0B0 for secondary text (dataviz-principles.md: muted colors for supporting info)
- Pulsing animation subtle (2s cycle, not jarring)
- Lock icon 🔒 matches retro gaming conventions

### UX Design References

**From dataviz-principles.md:**
- Preattentive attributes: pulsing animation draws eye without being intrusive
- Minimize cognitive load: counter shows exact progress (3/5), not vague "almost there"
- Text hierarchy: 12px secondary text vs 18px celebration text (Story 15.4)

**From ux-design-cognitive-dashboard.md:**
- Calibration messaging: "Warming up..." playful, non-clinical language
- Lock icon + counter: clear affordance (button is disabled, here's why, here's progress)

### Testing Checklist
- [ ] Post-game after session 1: counter shows "Session 1/5 — Warming up..."
- [ ] Post-game after session 3: counter shows "Session 3/5", pulsing animation active
- [ ] Skill Map button greyed out during calibration (opacity 0.5, cursor not-allowed)
- [ ] Tooltip appears on hover/click, displays correct session count
- [ ] Main menu shows lock icon + session count during calibration
- [ ] Main menu Skill Map click shows tooltip, prevents navigation
- [ ] Session 5+: counter REMOVED, Skill Map button active (tested in Story 15.3)

---

## References

**Project Context (V3 Patterns):**
- `/Users/anthonysalvi/code/CrazySnakeLite/_bmad-output/planning-artifacts/project-context.md`
  - Lines 264-280: V3 DOM Rendering Patterns (createElement, appendChild, .hidden class)
  - Lines 299-306: V3 Calibration State (read stored boolean, never recalculate)
  - Lines 461-465: Module Boundaries (cognitive-feedback.js accesses DOM, reads storage)

**UX Design Specifications:**
- `/Users/anthonysalvi/code/CrazySnakeLite/_bmad-output/planning-artifacts/dataviz-principles.md`
  - Preattentive attributes: motion (pulsing) draws attention without cognitive load
  - Text hierarchy: size + color differentiation for primary vs secondary info
- `/Users/anthonysalvi/code/CrazySnakeLite/_bmad-output/planning-artifacts/ux-design-cognitive-dashboard.md`
  - Calibration UX: playful language, clear progress indicators, no clinical jargon

**Epic 15 Overview:**
- `/Users/anthonysalvi/code/CrazySnakeLite/_bmad-output/implementation-artifacts/epics/15-calibration-period-system.md`
  - Lines 13-17: Counter creates forward momentum ("3/5 of the way"), Lens of Curiosity (Schell)
