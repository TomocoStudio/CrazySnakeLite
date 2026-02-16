# Story 16.1: Create Skill Map Screen and Navigation

**Epic:** 16 - Skill Map Dashboard (The Cognitive Mirror)

**As a** player,
**I want** to access my Skill Map from the main menu,
**So that** I can view my cognitive profile before or after gameplay.

---

## Acceptance Criteria

**Given** calibrationComplete === true
**When** main menu displays
**Then** show "Skill Map" menu option:
```
🎯 Skill Map
```
**And** clicking it navigates to Skill Map screen (new game phase: 'skillmap')

**Given** Skill Map screen loads
**When** skillmap.js initializes
**Then** query storage.js for:
- Rolling averages for all 6 metrics
- Total session count
- Current streak
- Last played date
**And** render complete dashboard within 500ms (per NFR52)

**Given** player is on Skill Map screen
**When** game phase is 'skillmap'
**Then** game loop pauses (no snake rendering, no gameplay)
**And** DOM-based dashboard overlay rendered on top of canvas
**And** background shows dimmed game canvas (last game state or idle state)

**Given** player clicks "Play Now" button on Skill Map
**When** button is pressed
**Then** transition back to main menu or directly to new game (phase: 'playing')
**And** Skill Map overlay fades out (300ms transition)

**Given** player presses Esc key on Skill Map
**When** Esc is detected
**Then** return to main menu
**And** Skill Map overlay closes gracefully

**Per FR171:** Brain Map accessible from main menu ("Brain Map" option)

---

## Dev Section

### Technical Context

**Story Purpose:** Foundation story for Epic 16. Creates the new `'skillmap'` game phase, DOM screen infrastructure, main menu integration, and navigation routing. This is the skeleton that stories 16.2-16.8 will flesh out with rendering logic.

**Architecture Pattern:** Extends the V3 phase system from 3 to 4 phases (`menu`, `playing`, `gameover`, **`skillmap`**). Follows existing DOM overlay pattern established by phone.js and cognitive-feedback.js.

**Key Dependencies:**
- Epic 13 must be complete (`metrics.js`, `storage.js` async layer with IndexedDB)
- Epic 15 must be complete (`calibrationComplete` boolean in stored profile)

### Files to Create/Modify

**NEW:**
- `js/dashboard.js` — Skill Map rendering module (create skeleton in this story, flesh out in 16.2-16.8)

**MODIFY:**
- `js/state.js` — Add `'skillmap'` to phase enum
- `js/main.js` — Extend `handleUIUpdate()` for skillmap phase, add Skill Map button handlers
- `js/input.js` — Extend keyboard navigation for skillmap phase
- `index.html` — Add `#skill-map-screen` DOM container + Skill Map button on menu
- `css/style.css` — Add Skill Map screen styles (z-index 350, hidden class toggle)

### Implementation Guidance

#### 1. State Extension (js/state.js)

**Pattern:** Extend phase to include `'skillmap'` constant.

```javascript
// state.js — Phase now includes 'skillmap'
export function createGameState() {
  return {
    phase: 'menu',  // 'menu' | 'playing' | 'gameover' | 'skillmap'
    // ... rest unchanged
  };
}
```

**Critical:** Ensure all phase checks elsewhere (`if (gameState.phase === 'playing')`) don't break. The skillmap phase behaves like menu/gameover (game loop paused, DOM overlay shown).

#### 2. DOM Structure (index.html)

**Add after `#gameover-screen`, before closing `<body>`:**

```html
<!-- Skill Map Dashboard (V3) -->
<div id="skill-map-screen" class="screen hidden">
  <div class="skill-map-container">
    <h2 class="skill-map-title">🎯 YOUR SKILL MAP</h2>
    <div id="skill-map-bars-container">
      <!-- Rendered by dashboard.js -->
    </div>
    <div id="skill-map-callouts">
      <!-- Rendered by dashboard.js -->
    </div>
    <div id="skill-map-stats">
      <!-- Sessions + Streak — rendered by dashboard.js -->
    </div>
    <div id="skill-map-quote">
      <!-- Caller quote — rendered by dashboard.js -->
    </div>
    <div class="skill-map-actions">
      <button id="play-now-btn" class="menu-button">PLAY NOW</button>
      <a href="#" id="back-to-menu-link" class="secondary-link">← Back to Menu</a>
    </div>
  </div>
</div>
```

**Add Skill Map button to main menu** (after `#new-game-btn`):

```html
<!-- Inside #menu-screen -->
<button id="skill-map-menu-btn" class="menu-button">Skill Map</button>
```

**Add Skill Map button to game over** (replace `#menu-btn` with):

```html
<!-- Inside #gameover-screen -->
<button id="skill-map-gameover-btn" class="menu-button">Skill Map</button>
```

#### 3. CSS Styling (css/style.css)

**Add Skill Map screen base styles:**

```css
/* === Skill Map Dashboard === */
#skill-map-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  z-index: 350;  /* Between phone (400) and tooltips (300) */
  display: flex;
  align-items: center;
  justify-content: center;
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

/* Detailed bar/callout/quote styles added in Story 16.2-16.8 */
```

#### 4. Phase Transition Logic (js/main.js)

**Extend `handleUIUpdate()` with skillmap phase:**

```javascript
// main.js — handleUIUpdate()
function handleUIUpdate(gameState) {
  const { phase } = gameState;

  // Hide all screens first
  menuScreen.classList.add('hidden');
  gameoverScreen.classList.add('hidden');
  skillMapScreen.classList.add('hidden');  // NEW
  scoreDisplay.classList.add('hidden');

  if (phase === 'menu') {
    menuScreen.classList.remove('hidden');
  } else if (phase === 'playing') {
    scoreDisplay.classList.remove('hidden');
  } else if (phase === 'gameover') {
    gameoverScreen.classList.remove('hidden');
  } else if (phase === 'skillmap') {  // NEW
    skillMapScreen.classList.remove('hidden');
    dashboard.renderSkillMap();  // Render Skill Map content
  }
}
```

**Add Skill Map button handlers:**

```javascript
// main.js — Button click handlers
skillMapMenuBtn.addEventListener('click', () => {
  gameState.phase = 'skillmap';
  handleUIUpdate(gameState);
});

skillMapGameoverBtn.addEventListener('click', () => {
  gameState.phase = 'skillmap';
  handleUIUpdate(gameState);
});

playNowBtn.addEventListener('click', () => {
  resetGame(gameState);
  gameState.phase = 'playing';
  handleUIUpdate(gameState);
  if (!gameLoopRunning) startGameLoop();
});

backToMenuLink.addEventListener('click', (e) => {
  e.preventDefault();
  gameState.phase = 'menu';
  handleUIUpdate(gameState);
});
```

#### 5. Input Routing (js/input.js)

**Extend ESC key handling for skillmap phase:**

```javascript
// input.js — handleKeyDown
if (event.key === 'Escape') {
  if (gameState.phase === 'playing') {
    // Existing pause logic
  } else if (gameState.phase === 'gameover' || gameState.phase === 'skillmap') {
    // Return to menu
    gameState.phase = 'menu';
    handleUIUpdate(gameState);
  }
}
```

**Add keyboard navigation for Skill Map buttons:**

```javascript
// input.js — navigateMenuOptions()
function getAvailableButtons(phase) {
  if (phase === 'menu') {
    return [newGameBtn, skillMapMenuBtn];
  } else if (phase === 'gameover') {
    return [playAgainBtn, skillMapGameoverBtn];
  } else if (phase === 'skillmap') {
    return [playNowBtn, backToMenuLink];  // NEW
  }
  return [];
}
```

#### 6. Dashboard Module Skeleton (js/dashboard.js)

**Create basic structure** (rendering logic filled in 16.2-16.8):

```javascript
// dashboard.js — Skill Map rendering module
import { getProfile } from './storage.js';
import CONFIG from './config.js';

/**
 * Render the Skill Map screen.
 * Shows either calibration placeholder or full skill map based on profile state.
 */
export async function renderSkillMap() {
  const profile = await getProfile();

  if (!profile || !profile.calibrationComplete) {
    renderCalibrationPlaceholder(profile);
  } else {
    renderFullSkillMap(profile);
  }
}

function renderCalibrationPlaceholder(profile) {
  const barsContainer = document.getElementById('skill-map-bars-container');
  const calloutsContainer = document.getElementById('skill-map-callouts');

  // Story 16.2: Render empty block bars
  barsContainer.innerHTML = '<p>Calibrating...</p>';

  // Story 16.3-16.5: Clear callouts/quotes during calibration
  calloutsContainer.innerHTML = `
    <p class="calibration-message">
      Warming up...<br>
      Session ${profile?.totalSessions || 0}/5
    </p>
  `;
}

function renderFullSkillMap(profile) {
  // Story 16.2: Render filled block bars
  // Story 16.3: Render callout cards
  // Story 16.4: Render session count + streak
  // Story 16.5: Render rotating quote
  console.log('Full Skill Map rendering — implemented in stories 16.2-16.5');
}

export function hideSkillMap() {
  const skillMapScreen = document.getElementById('skill-map-screen');
  skillMapScreen.classList.add('hidden');
}
```

### Testing Guidance

**Unit Tests:** (Not applicable for this story — navigation logic is integration-level)

**Manual Testing Checklist:**

1. **Main Menu → Skill Map:**
   - [ ] Click "Skill Map" button on main menu
   - [ ] `#skill-map-screen` appears, game canvas dimmed in background
   - [ ] "Warming up..." message shown (if calibration not complete)

2. **Game Over → Skill Map:**
   - [ ] Play game, die
   - [ ] Click "Skill Map" button on game over screen
   - [ ] Skill Map loads correctly
   - [ ] Highlights remain visible until Skill Map button clicked

3. **Skill Map → Play Now:**
   - [ ] Click "Play Now" button
   - [ ] New game starts immediately (phase: 'playing')
   - [ ] Skill Map overlay hidden

4. **Skill Map → Back to Menu:**
   - [ ] Click "← Back to Menu" link
   - [ ] Main menu appears
   - [ ] Skill Map overlay hidden

5. **ESC Key Navigation:**
   - [ ] From Skill Map, press ESC → returns to main menu
   - [ ] From Game Over, press ESC → returns to main menu (existing behavior preserved)

6. **Keyboard Navigation:**
   - [ ] On Skill Map, Tab cycles between Play Now and Back to Menu
   - [ ] Enter activates focused button

7. **Phase Isolation:**
   - [ ] Game loop does NOT run during skillmap phase (snake frozen, no food spawns)
   - [ ] Score display hidden during skillmap phase

### Definition of Done

- [ ] `'skillmap'` phase added to state.js
- [ ] `#skill-map-screen` DOM structure added to index.html
- [ ] Skill Map buttons added to main menu and game over screens
- [ ] `handleUIUpdate()` extended with skillmap case
- [ ] ESC key returns to menu from skillmap phase
- [ ] Keyboard navigation works for Skill Map buttons (Tab + Enter)
- [ ] `dashboard.js` skeleton created with `renderSkillMap()` and `hideSkillMap()`
- [ ] CSS z-index 350 applied to Skill Map screen
- [ ] Manual testing checklist passed (7/7 scenarios)
- [ ] No console errors when navigating to/from Skill Map

### Dependencies

**Blocks:**
- Story 16.2 (block bars rendering)
- Story 16.3 (callouts rendering)
- Story 16.4 (session count rendering)
- Story 16.5 (quotes rendering)

**Blocked By:**
- Epic 13 complete (storage.js, metrics.js exist)
- Epic 15 complete (calibrationComplete boolean exists in profile)

### References

- [Source: project-context.md — V3 Phase Navigation]
- [Source: ux-design-cognitive-dashboard.md — Skill Map Screen, Navigation Flow]
- [Source: architecture.md — Decision 14: Skill Map Dashboard, Decision 16: Phase System Extension]
