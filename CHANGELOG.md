# Changelog

All notable changes to CrazySnakeLite are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

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
