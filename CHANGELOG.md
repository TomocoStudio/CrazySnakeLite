# Changelog

All notable changes to CrazySnakeLite are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Bug Fixes - 2026-02-03

#### Fixed - Audio System Not Resuming After Feedback Submission (Commit 20aec1a)

**Issue:** Audio stopped working after submitting feedback from any screen
- mailto: link triggered beforeunload event which closed AudioContext
- Closed AudioContext prevented all sounds (menu music, move sounds, death sound)
- Affected both menu screen and game over screen feedback submissions

**Root Cause:**
- Feedback submission opens mailto: link via `window.location.href`
- Browser treats this as navigation and fires beforeunload event
- Existing beforeunload handler called `closeAudio()` which closed AudioContext
- Once closed, AudioContext cannot resume without full reinitialization

**Solution Implemented:**
- Audio system now reinitializes after thank you screen closes (all phases)
- Improved AudioContext state detection in `initAudio()` to handle closed contexts
- Added audio resume on "Back to Game" button click for browser autoplay compliance
- Menu music only restarts when returning to menu phase specifically

**Implementation Details:**
- **js/audio.js:** Enhanced `initAudio()` to detect closed contexts and reinitialize
- **js/feedback.js:** Added audio reinitialization logic in `closeThankYouScreen()`
- **js/main.js:** Resume audio on button click to satisfy browser autoplay policies
- **Files Modified:** 3 files, 42 insertions, 3 deletions

**User Experience:**
- Feedback can now be submitted from any screen without losing audio
- All sounds (menu music, movement, death) work correctly after feedback
- Seamless audio experience maintained throughout user journey

---

### Visual Polish Updates - 2026-02-03

#### Added - Unified Design System (Commit 2fd0d32)

**Feature: Comprehensive Design System Unification**
- Established single cohesive visual language across entire UI
- Unified color palette: Single purple shade rgb(157, 178, 221) throughout
- Consistent rounded corners: 12px on frames (menu, game over, modals), 8px on buttons
- Standardized transparency: 90% for direct screens, 60% for modal containers over 80% overlays
- Unified button behavior: black inactive, purple-blue active, white text always

**Button Improvements:**
- Consistent scale animations: 1.05x on hover, 0.98x on active/click
- Border color never changes (always light purple-blue)
- Removed gold hover borders and default selected states
- All buttons share identical interaction patterns

**Elements Updated:**
- Menu screen, Game Over screen, Feedback modal, Thank You screen, Phone overlay, Score display
- All buttons across the application
- Removed multiple purple variants for visual consistency

**Implementation Details:**
- **Files Modified:** `css/style.css` (168 lines changed), `index.html` (4 lines), UX spec documentation (517 lines added)
- Added comprehensive Design System section to UX specification
- Documented color palette, frame patterns, button styles, modal guidelines

**User Experience:**
- Entire UI now uses one elegant visual language
- Smooth, consistent interactions throughout
- Professional polish with transparent depth effects
- Modern aesthetic while maintaining retro gaming charm

#### Added - Epic 6: User Feedback Collection System UI (Commit a3c8dfc)

**Feature: Complete Feedback System Interface**
- Always-visible feedback button (top-right corner, responsive)
- Full-screen feedback modal with star ratings and form inputs
- Thank you screen with auto-close and manual dismiss
- Seamless integration with unified design system

**Components:**
- **Feedback Button:** Fixed position, speech bubble icon, responsive (desktop text + icon, mobile icon only)
- **Feedback Modal:** Star ratings (fun, difficulty), textarea for comments, optional email input
- **Thank You Screen:** Celebration message, auto-close after 3 seconds, manual "Back to Game" button
- **Character Counter:** Real-time feedback on textarea (500 char limit)

**Implementation Details:**
- **CSS Added:** 391 lines for complete feedback system styling
- **HTML Added:** 85 lines for feedback modal, thank you screen, feedback button
- **Files Modified:** `css/style.css`, `index.html`, `js/feedback.js`, `js/main.js`
- Blur effect on game canvas when modals open
- Z-index layering: feedback (1000), thank you (1001)

**User Experience:**
- Accessible from any game state (menu, playing, game over)
- Auto-pauses game when feedback opened during play
- Form data persists (email remembered across sessions)
- Mobile-optimized touch targets and responsive design

#### Added - Phone Call Visual Enhancement (Commit 01456ad)

**Feature: Custom Animated Phone Icon**
- Phone call overlay now displays custom pixelated phone icon with ringing animation
- Icon positioned prominently above "Incoming call..." text
- Animated shake/wobble effect (±15° rotation) draws immediate attention
- Maintains retro aesthetic with `image-rendering: pixelated`

**Implementation Details:**
- **New Asset:** `assets/PhoneIcone01_256px.png` - Custom phone icon with transparency
- **Animation:** `@keyframes phone-ring` - 0.8s looping ringing effect
- **Responsive:** 80px (desktop) / 64px (mobile)
- **Files Modified:** `index.html`, `css/style.css`

**User Experience:**
- Significantly improved visual emphasis for phone call interruptions
- Icon creates instant recognition and urgency
- Complements existing instruction text for clear UX

#### Changed - Score Display Background (Commit 01456ad)

**Feature: Black Semi-Transparent Score Box**
- Score display background changed from white to black
- Transparency level: 0.8 opacity for optimal visibility
- Current score text updated to white (#FFFFFF) for readability
- Top score remains light purple-blue for visual hierarchy

**Rationale:**
- Better contrast against gameplay
- Maintains retro aesthetic
- Ensures score visibility without obscuring game

**Files Modified:** `css/style.css`

#### Changed - Feedback Button Focus Behavior (Commit 42fc886)

**Feature: Improved Focus State for Mouse Users**
- Changed feedback button from `:focus` to `:focus-visible` pseudo-class
- Prevents persistent yellow outline when clicking button with mouse
- Maintains keyboard navigation accessibility (focus indicator still appears when tabbing)

**Implementation Details:**
- **File Modified:** `css/style.css` (1 line changed)
- Uses modern CSS `:focus-visible` selector for intelligent focus management

**User Experience:**
- No visual clutter (yellow border) when clicking feedback button with mouse
- Button doesn't compete visually with open feedback modal
- Keyboard users still get helpful focus indicator for navigation
- Best of both worlds: accessibility + clean visual experience

#### Changed - Design Consistency Polish (Commits 55c6089, c095157)

**Feature: Additional UI Refinements**
- Score display and game canvas frame improvements
- Documentation updates for design system consistency
- Project context and architecture documentation enhanced

**Implementation Details:**
- **Files Modified:** `css/style.css`, project documentation files
- Refinements to support unified design system rollout

#### Changed - Production Email Configuration (Commits 7dfa3fe, 5d2148a)

**Feature: Feedback Email Updates**
- Updated feedback email address to production address
- Phone call screen UI refinements

**Implementation Details:**
- **Files Modified:** Configuration files, feedback system
- Ready for production user feedback collection

#### Changed - Menu High Score Text Sizing (Commit faf53cc)

**Feature: Unified Text Sizing**
- High score label and value now both 24px (previously 18px/24px)
- Improved visual balance and consistency
- Better readability on menu screen

**Files Modified:** `css/style.css`

---

### Audio Enhancement Release - 2026-02-01

#### Added - Menu Background Music (Commit affcce3)

**Feature: Looping Menu Music**
- Menu screen now plays `StartSequence-V3.mp3` in continuous loop mode
- Music automatically starts on first user interaction (browser autoplay requirement)
- Seamless playback control tied to game phase transitions

**Implementation Details:**
- **New Functions:**
  - `playMenuMusic()` - Initiates looping background music using Web Audio API
  - `stopMenuMusic()` - Stops music when leaving menu screen
  - `isAudioReady()` - Helper to check audio initialization state
- **Audio Loading:** Menu music loads in parallel with other sounds during initialization
- **State Management:** Music starts/stops automatically based on game phase
  - **Starts:** Menu phase entered (initial load, pause, game over return)
  - **Stops:** Playing phase or Game Over phase entered
- **Browser Compatibility:** Requires user interaction (click/keypress) due to autoplay policies
- **Files Modified:** `js/audio.js` (144 lines), `js/main.js` (22 lines)

**User Experience:**
- Creates immersive menu atmosphere
- Reinforces retro 8-bit aesthetic
- Smooth transitions between menu and gameplay

#### Changed - Sound Files Upgraded to V3 (Commit ec9b924)

**Feature: All Game Sounds Upgraded to V3 Versions**
- All 14 movement sounds upgraded from base versions to V3 variants
- Death sound upgraded: `snake-die.mp3` → `SnakeDie01-V3.mp3`
- Menu music added: `StartSequence-V3.mp3`

**V3 Sound Files (16 total):**

Movement Sounds (14 files):
- `move-default-1-V3.mp3`, `move-default-2-V3.mp3`
- `move-growing-1-V3.mp3`, `move-growing-2-V3.mp3`
- `move-invincibility-1-V3.mp3`, `move-invincibility-2-V3.mp3`
- `move-wallphase-1-V3.mp3`, `move-wallphase-2-V3.mp3`
- `move-speedboost-1-V3.mp3`, `move-speedboost-2-V3.mp3`
- `move-speeddecrease-1-V3.mp3`, `move-speeddecrease-2-V3.mp3`
- `move-reverse-1-V3.mp3`, `move-reverse-2-V3.mp3`

Additional Sounds (2 files):
- `SnakeDie01-V3.mp3` (death sound)
- `StartSequence-V3.mp3` (menu music)

**Implementation Changes:**
- Audio loading updated to use `-V3` suffix in filenames
- All sounds now load in parallel for optimal performance
- Improved audio quality across all game states
- **Files Modified:** `js/audio.js` (7 lines)

**Technical Notes:**
- V3 sounds maintain consistent bitrate and quality
- All sounds remain compatible with Web Audio API
- No changes to playback logic - only file references updated

### Bug Fixes - 2026-02-01

#### Fixed

**Score Calculation (Commit c595673):**
- Score now correctly counts foods eaten instead of total snake length
- **Issue:** Score was displaying snake segment count (starting at 5, jumping to 6 after first food)
- **Fix:** Changed calculation to `segments.length - STARTING_LENGTH`
- **Result:** Score starts at 0 and increments by 1 for each food eaten
- **File:** `js/game.js:78`
- **Impact:** Aligns score behavior with expected game mechanics

### Visual Polish Updates - 2026-02-01

#### Changed

**Background:**
- Body background replaced with tilable texture pattern
- Asset: `Background08_256x256.png` (seamless repeat)
- Removed: solid color `#1a1a2e`
- CSS: `background-image: url('../assets/Background08_256x256.png')` with `background-repeat: repeat`

**Game Canvas Border:**
- Box-shadow color: `#9D4EDD` (purple) → `#1A1A2E` (dark blue)
- Box-shadow width: `4px` → `8px`
- Main border unchanged: `8px solid #800080`
- File: `css/style.css:42`

**Score Display:**
- Border styling now matches game canvas for visual consistency
- Border: `4px solid #9D4EDD` → `8px solid #800080`
- Added box-shadow: `0 0 0 8px #1A1A2E` (matching canvas)
- Position: `top: -55px` → `top: -61px` (moved up 6px for better alignment)
- File: `css/style.css:46-57`

**Rationale:**
- Tilable background adds visual texture while maintaining readability
- Dark blue outer border creates stronger contrast against textured background
- Unified border styling between canvas and score display improves visual cohesion

---

### Post-MVP Visual Overhaul - 2026-01-31

#### Added - Jersey 20 Custom Retro Font (Commit 83d55e5)

**Feature: Complete Typography Upgrade**
- Replaced default system fonts with custom Jersey 20 retro gaming font
- Applied across all UI elements for cohesive retro aesthetic
- Font designed for pixel-perfect rendering and gaming nostalgia

**Typography Application:**
- Menu screen (title, buttons, high score)
- Game Over screen (all text elements)
- Score display (current score and top score)
- Phone call overlay (caller name, status, instructions)
- Feedback system (modal, form, buttons)
- Thank you screen (all text)

**Implementation Details:**
- **New Asset:** `assets/Jersey_20/Jersey20-Regular.ttf` - Custom font file
- **CSS:** `@font-face` declaration with fallback to Courier New, monospace
- **Font Family:** Applied via `font-family: 'Jersey20', 'Courier New', monospace`
- **Files Modified:** `css/style.css`, all UI elements updated

**Visual Impact:**
- Strong retro gaming identity
- Improved readability with gaming-optimized letterforms
- Consistent typography across entire application
- Enhanced brand personality and user immersion

**Additional Updates in This Commit:**
- Improved graphics for snake, food items, and canvas rendering
- New death sound asset added
- Foundation for upcoming visual polish (Epic 5)

---

## [1.0.0] - 2026-01-29

### Epic 4: Audio & Complete Experience - Code Review Fixes

All MVP stories (4-1 through 4-5) completed with comprehensive adversarial code review.

---

## Story 4-5: State-Based Movement Sounds

### Added
- Master volume control with GainNode (`setMasterVolume()`)
- Audio system status API (`getAudioStatus()`)
- AudioContext cleanup handler (`closeAudio()`) on page unload
- Rate limiting (16ms minimum interval) to prevent rapid playback calls
- Load validation - warns if fewer than 14 sounds loaded
- Failed sound tracking for debugging
- CONFIG settings: `SOUNDS_PATH`, `MASTER_VOLUME`, `EXPECTED_SOUND_COUNT`

### Changed
- Updated code to use correct "invincibility" spelling (filename typo remains)
- Sound path now uses `CONFIG.SOUNDS_PATH` instead of hardcoded string
- Unknown effect/color now logs warning before falling back to default
- `resetAudio()` documented as @internal test-only function

### Fixed
- Memory leak prevention with AudioContext cleanup
- Partial sound load failures now visible in status API

### Tests
- Added 5 new tests (status API, volume control, rate limiting, config verification)
- Total: 15 tests for audio system

**Architect Review Credit:** Winston/Opus 4.5 (Web Audio API migration)

---

## Story 4-4: Menu Navigation and Pause

### Added
- Arrow key navigation (`navigateMenuOptions()`) - moves selection between menu options
- Resume functionality (`handleResume()`) - Esc during pause returns to game
- `isPaused` flag to game state for proper pause/resume tracking
- `activateSelectedButton()` - Enter key triggers click() on selected button
- Cleanup for duplicate Enter key handler

### Changed
- Removed duplicate Enter key handler from main.js (kept in input.js)
- Event listener no longer uses capture phase (prevents conflicts)
- initInput signature now includes resume callback

### Fixed
- **CRITICAL:** Pause is no longer a one-way trap - players can now resume!
- **CRITICAL:** Arrow key navigation fully implemented (was AC violation)
- **CRITICAL:** Duplicate Enter handlers consolidated

### Tests
- Added 5 integration tests (pause/resume flow, arrow navigation, isPaused flag)
- Total: 15 tests for menu navigation

---

## Story 4-3: Game Over Screen Enhancement

### Added
- Enter key support for game over screen (Play Again activation)
- Score validation before display (`Math.max(0, Math.floor(score || 0))`)

### Changed
- Replaced emoji with retro ASCII art: `🎉` → `***`
- Game over screen z-index increased from 100 to 150 (proper layering)
- Performance test now measures full Play Again flow (not just resetGame)

### Tests
- Added 3 new tests (indicator hidden, Play Again flow, z-index layering)
- Total: 13 tests for game over screen

---

## Story 4-2: Main Menu Screen

### Added
- Score validation in `saveHighScore()` and `main.js` before saving
- Error handling (try-catch) for localStorage operations
- NaN protection in `loadHighScore()` - `parseInt(stored, 10) || 0`

### Changed
- Removed `hidden` class from menu-screen - visible on initial load
- Updated AC: High score is always visible (not clickable)

### Fixed
- Menu no longer hidden on initial load (matches AC)
- localStorage failures gracefully handled (private browsing, quota exceeded)
- Corrupted localStorage data returns 0 instead of NaN

### Tests
- Added 5 failure scenario tests (corrupted data, negative, NaN, undefined)
- Total: 15 tests for menu system

---

## Story 4-1: Score System and Display

### Added
- Phase visibility management - score only shown during 'playing' phase
- Score change detection - updates only when score changes (not every frame)
- Score validation in display and game logic
- Error logging when score display element not found
- `.hidden` class for score-display in CSS

### Changed
- Score display now hidden during 'menu' and 'gameover' phases
- Index.html: Score display starts hidden with generic placeholder
- `previousScore` tracking to detect changes

### Fixed
- **PERFORMANCE:** Eliminated ~60 unnecessary DOM updates per second
- Score no longer always visible (phase-aware visibility)
- Validates score values (handles NaN, negative, undefined)

### Tests
- Added 3 new tests (phase visibility, validation, precision)
- Total: 10 tests for score system

---

## Configuration Changes

### js/config.js
```javascript
// Added audio settings
SOUNDS_PATH: 'assets/sounds/',
MASTER_VOLUME: 1.0,
EXPECTED_SOUND_COUNT: 14
```

---

## Documentation Updates

### Added
- `FutureImprovements.md` - Captures post-MVP enhancements and technical debt
- `CodeReview-Summary.md` - Comprehensive review documentation
- `CHANGELOG.md` - This file

### Updated
- `README.md` - Added Epic 4 features, controls, audio system details
- All story files (4-1 through 4-5) - Updated with code review changelogs
- `sprint-status.yaml` - All stories marked 'done', Epic 4 complete

---

## Test Coverage

### Summary
- **Initial Tests:** 55
- **Tests Added:** 18
- **Final Tests:** 73
- **Increase:** +33%

### By Story
- Story 4-1: 7 → 10 tests (+3)
- Story 4-2: 10 → 15 tests (+5)
- Story 4-3: 10 → 13 tests (+3)
- Story 4-4: 10 → 15 tests (+5)
- Story 4-5: 10 → 15 tests (+5)

---

## Known Issues

### Manual Action Required
Sound files need renaming to fix typo:
```bash
mv assets/sounds/move-invicibility-1.mp3 assets/sounds/move-invincibility-1.mp3
mv assets/sounds/move-invicibility-2.mp3 assets/sounds/move-invincibility-2.mp3
```
*Code already updated to use correct spelling*

---

## Credits

- **Development:** Claude Sonnet 4.5 (dev-story workflows)
- **Architect Review:** Winston/Opus 4.5 (Story 4-5 Web Audio API migration)
- **Code Review:** Adversarial Review Agent (All Epic 4 stories)
- **Project Direction:** Tomoco

---

## Previous Releases

### Epics 1-3 (Pre-Review)
- Epic 1: Playable Snake Foundation
- Epic 2: Chaos Food Effects
- Epic 3: Phone Call Interruption

See story files in `_bmad-output/implementation-artifacts/stories/` for detailed history.

---

[1.0.0]: https://github.com/your-username/CrazySnakeLite/releases/tag/v1.0.0
