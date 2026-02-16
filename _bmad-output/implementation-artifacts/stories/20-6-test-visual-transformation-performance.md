# Story 20.6: Test Visual Transformation and Performance

**Epic:** 20 - Progressive Arcade Transformation (Neon Noir)
**Story ID:** 20.6
**Status:** ✅ REVIEW (Test Infrastructure Ready - Awaiting Manual Testing)
**Created:** 2026-02-16
**Completed:** 2026-02-17

---

## Story

**As a** QA tester,
**I want** to validate the progressive visual transformation and performance,
**So that** Epic 20 meets all functional and non-functional requirements.

---

## Acceptance Criteria

**Given** Epic 20 implementation is complete (Stories 20.1-20.5)
**When** running visual transformation tests
**Then** all 6 tiers display correct background colors (#e8e8e8 → #1a1a1a)
**And** transitions between tiers are smooth (2-second CSS animations)
**And** grid opacity correctly decreases from 0.9 to 0.3 across tiers
**And** border state system responds to all 7 game events

**When** running performance tests
**Then** FPS remains 58+ during tier transitions (NFR-V3-1)
**And** CSS background transitions are GPU-composited (verified in DevTools)
**And** tier changes occur < 10 times per game (event-driven, not per-frame polling)

**When** testing emotional progression
**Then** tier-0/1 feel "safe daylight" (bright, comfortable)
**And** tier-2/3 feel "building intensity" (medium grey, escalating)
**And** tier-4/5 feel "Neon Noir / final boss arena" (dark, stark)

**When** testing cognitive challenge
**Then** grid at 0.3 opacity (tier-5) remains visible but requires stronger spatial awareness
**And** this aligns with working memory training goals (scaffolding removal)

**When** testing edge cases
**Then** rapid tier crossing (combo streak) doesn't cause visual glitches
**And** game reset returns to tier-0 cleanly
**And** border priority cascade handles overlapping states correctly

---

## Tasks / Subtasks

- [x] Create test plan document
  - [x] Visual transformation test scenarios (TESTING-GUIDE.md)
  - [x] Performance validation procedures (DevTools instructions)
  - [x] Emotional arc assessment criteria (playtester questions)
  - [x] Edge case test matrix (6 edge case scenarios)
- [x] Create test infrastructure
  - [x] Test report template (epic-20-test-report.md)
  - [x] Testing guide with step-by-step instructions
  - [x] Screenshots directory with README
  - [x] 46 test cases documented with pass/fail checkboxes
- [ ] Execute visual transformation tests (MANUAL - awaiting tester)
  - [ ] Verify all 6 background tiers (colors, thresholds)
  - [ ] Verify all 6 grid opacity tiers (values, synchronization)
  - [ ] Verify all 7 border states (colors, priority cascade)
  - [ ] Verify transition smoothness (2s background, 300ms border)
- [ ] Execute performance tests (MANUAL - awaiting tester)
  - [ ] Measure FPS during tier transitions (DevTools Performance tab)
  - [ ] Verify GPU compositing (DevTools Rendering tab)
  - [ ] Count tier changes per game (console logs)
  - [ ] Measure memory usage (DevTools Memory tab)
- [ ] Execute emotional arc assessment (MANUAL - awaiting 3+ playtesters)
  - [ ] Playtest tier-0/1 (safe daylight feel)
  - [ ] Playtest tier-2/3 (building intensity feel)
  - [ ] Playtest tier-4/5 (Neon Noir / final boss feel)
- [ ] Execute edge case tests (MANUAL - awaiting tester)
  - [ ] Rapid tier crossing (combo multiplier)
  - [ ] Game reset (new game, return to menu)
  - [ ] Overlapping border states (priority cascade)
- [ ] Document test results (MANUAL - after testing complete)
  - [ ] Fill in test report with pass/fail for each criterion
  - [ ] Capture and save screenshots at each tier
  - [ ] Collect and record DevTools performance data

---

## Developer Context

### 🎯 STORY OBJECTIVE

Comprehensive testing and validation of Epic 20's progressive visual transformation system. This story ensures all 6 tiers work correctly, performance budget is maintained, emotional progression feels right, and edge cases are handled gracefully. Testing covers functional correctness, performance validation, UX assessment, and quality assurance.

**CRITICAL SUCCESS FACTORS:**
- All 6 background tiers display correct colors at correct score thresholds
- All 6 grid opacity tiers synchronized with background tiers
- All 7 border states trigger correctly with proper priority cascade
- 58+ FPS maintained during all tier transitions (GPU-composited)
- Emotional progression validated: bright → intense → Neon Noir
- Grid at tier-5 (0.3 opacity) is still visible (WCAG compliance)
- Edge cases handled without glitches (rapid crossing, reset, overlaps)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Read (for testing context):**
- `js/config.js` — BACKGROUND_PROGRESSION, GRID_OPACITY_PROGRESSION, BORDER_COLORS
- `js/progression.js` — getState() tier resolution logic
- `js/game.js` — updateCanvasBackground(), updateBorderState(), event-driven calls
- `js/render.js` — renderGrid() with opacity
- `css/style.css` — #game-canvas transitions

**Testing Approach:**
- Manual browser testing for visual validation
- DevTools for performance metrics
- Console logs for event-driven verification
- Playtesting for emotional arc assessment

---

### 📦 CONFIG.JS UPDATES

No config changes needed (testing only).

---

### 🎨 IMPLEMENTATION DETAILS

**This is a testing story — no implementation code.**

Instead, execute the comprehensive test plan below and document results.

---

### 🧪 TESTING REQUIREMENTS

## **COMPREHENSIVE TEST PLAN**

### **Test Suite 1: Visual Transformation — Background Tiers**

| Test | Procedure | Expected Result | Pass/Fail |
|------|-----------|----------------|-----------|
| **1.1 Tier-0 (0-14)** | Start new game, score 0-14 | Background = #e8e8e8 (light grey) | [ ] |
| **1.2 Tier-1 (15-29)** | Reach score 15-29 | Background = #d0d0d0 (medium-light grey) | [ ] |
| **1.3 Tier-2 (30-49)** | Reach score 30-49 | Background = #b8b8b8 (medium grey) | [ ] |
| **1.4 Tier-3 (50-74)** | Reach score 50-74 | Background = #808080 (medium-dark grey) | [ ] |
| **1.5 Tier-4 (75-99)** | Reach score 75-99 | Background = #505050 (dark grey) | [ ] |
| **1.6 Tier-5 (100+)** | Reach score 100+ | Background = #1a1a1a (near-black) | [ ] |
| **1.7 Transition Smoothness** | Cross any tier threshold (e.g., 49→50) | 2-second smooth fade, no instant snap | [ ] |

**Screenshot checklist:** Capture screenshot at each tier, verify colors match hex values.

---

### **Test Suite 2: Visual Transformation — Grid Opacity**

| Test | Procedure | Expected Result | Pass/Fail |
|------|-----------|----------------|-----------|
| **2.1 Tier-0 Opacity** | Score 0-14, inspect grid | Grid opacity = 0.9 (strong) | [ ] |
| **2.2 Tier-1 Opacity** | Score 15-29, inspect grid | Grid opacity = 0.75 (slight fade) | [ ] |
| **2.3 Tier-2 Opacity** | Score 30-49, inspect grid | Grid opacity = 0.6 (moderate fade) | [ ] |
| **2.4 Tier-3 Opacity** | Score 50-74, inspect grid | Grid opacity = 0.5 (half) | [ ] |
| **2.5 Tier-4 Opacity** | Score 75-99, inspect grid | Grid opacity = 0.4 (faint) | [ ] |
| **2.6 Tier-5 Opacity** | Score 100+, inspect grid | Grid opacity = 0.3 (ghost, WCAG min) | [ ] |
| **2.7 Synchronization** | Cross tier threshold | Grid opacity changes same time as background | [ ] |
| **2.8 WCAG Compliance** | Score 100+, tier-5 | Grid at 0.3 opacity still visible on #1a1a1a background | [ ] |

**Validation method:** Add console.log to renderGrid() to output `ctx.globalAlpha` value.

---

### **Test Suite 3: Border State System**

| Test | Procedure | Expected Result | Pass/Fail |
|------|-----------|----------------|-----------|
| **3.1 Default Border** | New game, no events | Border = #9D4EDD (purple) | [ ] |
| **3.2 Death Flash** | Die (hit wall) | Border = #FF0000 (red) for 500ms, then returns | [ ] |
| **3.3 Phone Ring** | Phone call appears | Border = #FFD700 (gold) | [ ] |
| **3.4 Phone Pickup** | Answer phone (Enter) | Border = #28a745 (green) during timer | [ ] |
| **3.5 Combo** | Activate combo mode | Border = combo color (purple/blue/red/green) | [ ] |
| **3.6 Reverse Controls** | Eat RC food | Border = #FFA500 (orange) | [ ] |
| **3.7 Invincibility** | Eat invincibility food | Border = #FFFF00 (yellow) | [ ] |
| **3.8 Priority: Death > Phone** | Die during phone call | Death red overrides phone gold | [ ] |
| **3.9 Priority: Phone > Combo** | Phone appears during combo | Phone gold overrides combo color | [ ] |
| **3.10 Priority: Combo > Effects** | Combo + RC active | Combo color overrides RC orange | [ ] |
| **3.11 Border Transition** | Any border state change | 300ms smooth transition (fast but not instant) | [ ] |

---

### **Test Suite 4: Performance Validation**

| Test | Procedure | Expected Result | Pass/Fail |
|------|-----------|----------------|-----------|
| **4.1 FPS During Transitions** | DevTools Performance tab, record tier crossing | FPS ≥ 58 during 2-second background fade | [ ] |
| **4.2 GPU Compositing** | DevTools Rendering → Paint flashing, cross tier | No green flash on canvas (GPU-composited) | [ ] |
| **4.3 Event-Driven Updates** | Console logs, play full game | Tier change logs = 5-6 total (not hundreds) | [ ] |
| **4.4 Memory Usage** | DevTools Memory tab, play 5 games | No memory leaks (heap size stable) | [ ] |
| **4.5 No Long Tasks** | DevTools Performance tab, record tier transitions | No tasks > 50ms during background fade | [ ] |

**Performance baseline:** 58 FPS = ~17ms per frame. Background transitions are CSS-native, should not affect frame budget.

---

### **Test Suite 5: Emotional Arc Assessment**

| Test | Procedure | Expected Result | Pass/Fail |
|------|-----------|----------------|-----------|
| **5.1 Tier-0/1 (Safe Daylight)** | Playtest score 0-29 | Bright, comfortable, low tension | [ ] |
| **5.2 Tier-2/3 (Building Intensity)** | Playtest score 30-74 | Medium grey, escalating challenge feel | [ ] |
| **5.3 Tier-4/5 (Neon Noir)** | Playtest score 75+ | Dark, stark, "final boss arena" feel | [ ] |
| **5.4 Tier-5 Impact** | Reach 100+ for first time | Feels like achievement, entering new phase | [ ] |
| **5.5 Grid Scaffolding Removal** | Tier-5 grid at 0.3 opacity | Forces spatial awareness, intentional challenge | [ ] |

**Validation method:** Playtesting with 3+ people, gather subjective feedback on emotional progression.

---

### **Test Suite 6: Edge Cases**

| Test | Procedure | Expected Result | Pass/Fail |
|------|-----------|----------------|-----------|
| **6.1 Rapid Tier Crossing** | Combo multiplier (score 30 → 70) | Background transitions smoothly to tier-3, no tier-2 flash | [ ] |
| **6.2 Game Reset (New Game)** | Play to tier-5, start new game | Background returns to tier-0 (#e8e8e8) | [ ] |
| **6.3 Game Reset (Menu)** | Play to tier-5, return to menu, new game | Background returns to tier-0 | [ ] |
| **6.4 Overlapping Border States** | Phone + combo + RC all active | Highest priority (phone gold) wins | [ ] |
| **6.5 Death During Transition** | Die while background fading | CSS continues transition, death flash overrides border | [ ] |
| **6.6 Pause During Transition** | Pause game during tier transition | CSS continues fading (browser native, independent of game loop) | [ ] |

---

### **Test Suite 7: Integration Testing**

| Test | Procedure | Expected Result | Pass/Fail |
|------|-----------|----------------|-----------|
| **7.1 Background + Grid Sync** | Cross tier threshold | Background darkens AND grid fades simultaneously | [ ] |
| **7.2 Background + Border Sync** | Phone appears at tier-3 | Background = #808080, border = #FFD700 (gold) | [ ] |
| **7.3 All Systems Active** | Tier-5 + phone + combo | Background near-black, grid 0.3 opacity, border gold | [ ] |
| **7.4 Cross-Browser** | Test on Chrome, Firefox, Safari | All tiers display correctly, transitions smooth | [ ] |

---

## **TEST REPORT TEMPLATE**

```markdown
# Epic 20 Test Report
**Date:** [Date]
**Tester:** [Name]
**Stories Tested:** 20.1, 20.2, 20.3, 20.4, 20.5

## Summary
- Total Tests: 35
- Passed: [X]
- Failed: [X]
- Pass Rate: [X%]

## Test Suite Results

### Background Tiers (7 tests)
- Pass: [X] / 7
- Failures: [List any failures]
- Screenshots: [Attach tier-0 through tier-5 screenshots]

### Grid Opacity (8 tests)
- Pass: [X] / 8
- Failures: [List any failures]

### Border States (11 tests)
- Pass: [X] / 11
- Failures: [List any failures]

### Performance (5 tests)
- Pass: [X] / 5
- FPS Average: [X] FPS
- GPU Compositing: [Active/Inactive]
- Tier Change Count: [X] per game

### Emotional Arc (5 tests)
- Pass: [X] / 5
- Tester Feedback: [Quotes from playtesters]

### Edge Cases (6 tests)
- Pass: [X] / 6
- Failures: [List any failures]

### Integration (4 tests)
- Pass: [X] / 4
- Failures: [List any failures]

## Issues Found
[List any bugs, glitches, or deviations from acceptance criteria]

## Recommendations
[Suggest any fixes or improvements]

## Sign-Off
- [ ] All critical tests passed
- [ ] Performance budget met (58+ FPS)
- [ ] WCAG compliance verified (tier-5 grid visibility)
- [ ] Emotional progression validated
- [ ] Edge cases handled gracefully

**Tester Signature:** __________________
**Date:** __________________
```

---

### 📚 CRITICAL DATA FORMATS

**Test pass criteria:**
- Background colors match hex values exactly (use DevTools color picker)
- Grid opacity values match config (use console.log in renderGrid())
- FPS ≥ 58 during transitions (DevTools Performance tab)
- Tier changes < 10 per game (console.log count)
- Grid at 0.3 opacity visible on #1a1a1a background (visual inspection)

**DevTools setup:**
```
Performance tab:
1. Open DevTools → Performance
2. Click Record (red dot)
3. Play game, cross tier threshold
4. Stop recording after 5 seconds
5. Analyze FPS chart (should be green line at 60 FPS)

Rendering tab:
1. Open DevTools → More Tools → Rendering
2. Enable "Paint flashing"
3. Cross tier threshold
4. Observe canvas element (should NOT flash green = GPU-composited)

Memory tab:
1. Open DevTools → Memory
2. Take heap snapshot
3. Play 5 games
4. Take another snapshot
5. Compare (heap size should be stable, no leaks)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before testing:**
- `_bmad-output/planning-artifacts/prd.md` — NFR-V3-1 (Performance Budget), NFR-V3-3 (Grid Visibility)
- `_bmad-output/planning-artifacts/ux-design-retro-graphic-upgrade.md` — Epic 20 overview, emotional progression
- `_bmad-output/implementation-artifacts/epics/20-progressive-arcade-transformation.md` — Epic 20 acceptance criteria

---

### 📋 FRs COVERED

NFR-V3-1 (Performance Budget: 58+ FPS)
NFR-V3-3 (Grid Visibility: 0.3 opacity minimum)
NFR-V3-8 (GPU Optimization via CSS compositing)

**Detailed FR Mapping:**
- 58+ FPS performance → Test Suite 4
- Grid visibility at 0.3 → Test Suite 2.8
- GPU compositing → Test Suite 4.2
- Emotional progression → Test Suite 5

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] Test plan document created
- [ ] All 7 background tier tests executed
- [ ] All 8 grid opacity tests executed
- [ ] All 11 border state tests executed
- [ ] All 5 performance tests executed
- [ ] All 5 emotional arc tests executed
- [ ] All 6 edge case tests executed
- [ ] All 4 integration tests executed
- [ ] Test report document created with results
- [ ] Screenshots captured at each tier (tier-0 through tier-5)
- [ ] DevTools performance data collected (FPS, GPU compositing, memory)
- [ ] All critical tests passed (background tiers, grid opacity, performance budget)
- [ ] WCAG compliance verified (tier-5 grid at 0.3 opacity still visible)
- [ ] Emotional progression validated with 3+ playtesters
- [ ] Edge cases handled without glitches
- [ ] Cross-browser testing completed (Chrome, Firefox, Safari)
- [ ] Pass rate ≥ 95% (33/35 tests passed minimum)

**Common Issues to Watch For:**
- ❌ Background colors don't match hex values (check CSS typos)
- ❌ Grid opacity not synchronized with background tiers (check progression.js)
- ❌ Border states wrong priority order (check updateBorderState() cascade)
- ❌ FPS drops during transitions (check GPU compositing, remove fillRect)
- ❌ Tier changes every frame (check event-driven calls, not in update() loop)
- ❌ Grid invisible at tier-5 (0.3 opacity too low on dark background)
- ❌ Rapid tier crossing causes flashing (CSS should interpolate smoothly)

---

## Dev Agent Record

### Agent Model Used

Claude Sonnet 4.5 (claude-sonnet-4-5-20250929)

### Debug Log References

None - Test infrastructure creation only (no debugging required)

### Completion Notes List

**Test Infrastructure Created:**

This is a **manual testing story** that requires human QA execution. As an AI dev agent, I cannot play the game, observe visual progressions, gather subjective feedback, or take screenshots. Instead, I've created comprehensive test infrastructure for manual execution:

✅ **Created: epic-20-test-report.md (46 test cases)**
- 7 test suites covering all Epic 20 functionality
- Pass/fail checkboxes for each test
- Space for screenshots, performance data, playtester feedback
- Issue tracking sections
- Final sign-off checklist
- Professional test report format ready for completion

✅ **Created: TESTING-GUIDE.md (step-by-step instructions)**
- Quick start testing checklist (~2 hours total time)
- Detailed procedures for each test suite
- DevTools usage instructions (Performance, Rendering, Memory tabs)
- Screenshot capture instructions
- Common issues and debugging tips
- Time estimates for each test suite
- Cross-browser testing procedures

✅ **Created: screenshots/README.md**
- Screenshot capture instructions (macOS/Windows/Browser)
- Required screenshot checklist (11 screenshots)
- Naming conventions for consistency
- Screenshot best practices
- Example directory structure

✅ **Directory Structure:**
```
_bmad-output/implementation-artifacts/test-reports/
├── epic-20-test-report.md          ← Fill in after manual testing
├── TESTING-GUIDE.md                ← Step-by-step testing instructions
└── screenshots/
    ├── README.md                   ← Screenshot capture guide
    └── [screenshots go here]       ← Save 11 required screenshots
```

**What Was Created:**

**1. Comprehensive Test Report Template (epic-20-test-report.md):**
- Test Suite 1: Background Tiers (7 tests)
- Test Suite 2: Grid Opacity (8 tests)
- Test Suite 3: Border States (11 tests)
- Test Suite 4: Performance (5 tests)
- Test Suite 5: Emotional Arc (5 tests)
- Test Suite 6: Edge Cases (6 tests)
- Test Suite 7: Integration (4 tests)
- **Total: 46 test cases** with pass/fail tracking
- Issues tracking section
- Performance data collection tables
- Playtester feedback forms (3+ testers)
- Final sign-off checklist

**2. Step-by-Step Testing Guide (TESTING-GUIDE.md):**
- Quick start checklist (7 test procedures)
- DevTools setup instructions for:
  - FPS measurement (Performance tab)
  - GPU compositing verification (Rendering tab)
  - Memory leak detection (Memory tab)
  - Console log counting (event-driven validation)
- Screenshot naming conventions
- Time estimates (~2 hours total)
- Common issues and debugging tips
- Cross-browser testing procedures

**3. Screenshot Infrastructure:**
- Created screenshots/ directory
- README with capture instructions
- 11 required screenshots checklist:
  - 6 tier screenshots (tier-0 through tier-5)
  - 5 border state screenshots (death, phone ring, phone pickup, combo, effects)
  - Optional DevTools screenshots

**Testing Scope:**
- **Functional:** All 6 background tiers, 6 grid opacity tiers, 7 border states
- **Performance:** FPS ≥58, GPU compositing, event-driven updates, no memory leaks
- **UX:** Emotional progression (safe → intense → Neon Noir)
- **Edge Cases:** Rapid crossing, resets, overlapping states
- **Integration:** Background + grid + border synchronization
- **Cross-Browser:** Chrome, Firefox, Safari

**Next Steps (Manual Execution Required):**
1. Open game in browser
2. Follow TESTING-GUIDE.md step-by-step
3. Fill in epic-20-test-report.md with results
4. Capture 11 required screenshots
5. Calculate pass rate (target: ≥95%, or 44/46 tests)
6. Sign off if all critical tests pass

**Note:** Manual testing cannot be automated as it requires:
- Visual observation of color changes and transitions
- Subjective assessment of emotional progression
- DevTools performance profiling
- Screenshot capture
- Playtester feedback collection (3+ people)

### File List

- _bmad-output/implementation-artifacts/test-reports/epic-20-test-report.md (created - comprehensive test report template with 46 test cases)
- _bmad-output/implementation-artifacts/test-reports/TESTING-GUIDE.md (created - step-by-step testing instructions)
- _bmad-output/implementation-artifacts/test-reports/screenshots/ (created - directory for test screenshots)
- _bmad-output/implementation-artifacts/test-reports/screenshots/README.md (created - screenshot capture guide)

### Change Log

**2026-02-17:** Story 20.6 test infrastructure ready - Awaiting manual testing execution
- Created comprehensive test report template with 46 test cases across 7 test suites
- Created step-by-step testing guide with DevTools instructions and time estimates
- Created screenshot directory with capture instructions and naming conventions
- Test infrastructure covers: visual transformation (background/grid/border), performance (FPS/GPU/memory), emotional arc, edge cases, integration, cross-browser
- Ready for manual QA execution (~2 hours total testing time)
- Pass rate target: ≥95% (44/46 tests) with all critical tests passing
- After manual testing complete: fill in test report, mark story as done, proceed to Epic 20 retrospective
