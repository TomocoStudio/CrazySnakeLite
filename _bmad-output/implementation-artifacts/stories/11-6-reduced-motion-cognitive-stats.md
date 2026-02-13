# Story 11.6: Implement Reduced Motion Mode for Cognitive Stats

**Epic:** 11 - Cognitive Feedback & RC Recognition
**Story ID:** 11.6
**Status:** 🔴 not started
**Created:** 2026-02-08

---

## Story

**As a** player with motion sensitivity,
**I want** cognitive stats to appear instantly without stagger,
**So that** I can play without discomfort.

## Acceptance Criteria

**Given** my browser has prefers-reduced-motion enabled
**When** the cognitive stats appear
**Then** all stat lines appear instantly (no 300ms stagger)
**And** the stats are immediately visible
**And** the Play Again button appears after 2.5s hold (no fade animations)

**Given** reduced motion mode is active
**When** the stats fade out
**Then** the fade is disabled (instant disappearance or very fast 100ms fade)

## Tasks / Subtasks

- [ ] Detect prefers-reduced-motion in config.js
  - [ ] Use window.matchMedia('(prefers-reduced-motion: reduce)').matches
  - [ ] Store in CONFIG.REDUCED_MOTION flag
- [ ] Update showCognitiveStats() to check REDUCED_MOTION
  - [ ] If true: skip stagger delays (all stats appear instantly)
  - [ ] If true: disable fade-in animations
  - [ ] Maintain 2.5s hold duration for readability
- [ ] Update hideCognitiveStats() to check REDUCED_MOTION
  - [ ] If true: instant disappearance (no 500ms fade)
  - [ ] Or very fast fade (100ms max)
- [ ] Update CSS animations to respect prefers-reduced-motion
  - [ ] Use @media (prefers-reduced-motion: reduce) query
  - [ ] Disable or shorten animations
- [ ] Test reduced motion mode
  - [ ] Enable prefers-reduced-motion in browser
  - [ ] Die with 3 stats
  - [ ] Verify all stats appear instantly (no stagger)
  - [ ] Verify stats hold for 2.5s
  - [ ] Verify instant disappearance (no fade)
  - [ ] Verify Play Again button appears immediately after

---

## Developer Context

### 🎯 STORY OBJECTIVE

Provide accessibility for players with motion sensitivity by disabling stagger and fade animations while maintaining content visibility and readability. The 2.5s hold duration is preserved so players can still read the stats, but the animations that could cause discomfort are removed.

**CRITICAL SUCCESS FACTORS:**
- Instant appearance (no stagger delays)
- Instant disappearance (no fade-out)
- 2.5s hold duration maintained (readability)
- Automatic detection via prefers-reduced-motion (no manual setting)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/config.js` — Add REDUCED_MOTION flag (already exists from Epic 8)
- `js/cognitive-feedback.js` — Check REDUCED_MOTION in showCognitiveStats and hideCognitiveStats
- `css/style.css` — Add @media query for prefers-reduced-motion

**Module Boundaries:**
- `config.js` owns configuration detection
- `cognitive-feedback.js` owns stats display logic
- `style.css` owns animation styling

**Data Flow:**
```
1. config.js: detect prefers-reduced-motion → REDUCED_MOTION = true
2. Player dies
3. cognitive-feedback.js: check REDUCED_MOTION
4. If true:
   a. Skip stagger delays (all stats appear at once)
   b. Disable fade-in animations
   c. Hold 2500ms
   d. Instant disappearance (no fade-out)
   e. Show Play Again button immediately
5. If false: normal stagger and fade animations
```

---

### 📦 CONFIG.JS UPDATES (already exists from Epic 8)

```javascript
// Detect prefers-reduced-motion media query
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const CONFIG = {
  // ... existing config ...

  // Accessibility (v2 - Epic 8, used in Epic 11)
  REDUCED_MOTION: prefersReducedMotion
};
```

---

### 🎨 IMPLEMENTATION DETAILS

**1. cognitive-feedback.js — Update showCognitiveStats() for reduced motion:**

```javascript
export function showCognitiveStats(gameState) {
  return new Promise((resolve) => {
    const container = document.querySelector('.cognitive-stats');
    const linesContainer = document.querySelector('.cognitive-stats-lines');

    // Clear previous lines
    linesContainer.innerHTML = '';

    // Select top stats
    const topStats = selectTopStats(gameState.cognitiveStats);

    if (topStats.length === 0) {
      container.classList.add('hidden');
      resolve();
      return;
    }

    // Show container
    container.classList.remove('hidden');

    // Create stat line elements
    topStats.forEach((stat, index) => {
      const line = document.createElement('div');
      line.className = 'cognitive-stat-line';
      line.textContent = formatStatLine(stat.key, stat.value);

      // Apply stagger delay ONLY if not reduced motion
      if (!CONFIG.REDUCED_MOTION) {
        line.style.animationDelay = `${index * CONFIG.COGNITIVE_STATS_DISPLAY.staggerDelay}ms`;
      } else {
        // Reduced motion: instant appearance (no delay, no animation)
        line.style.opacity = '1';
        line.style.animation = 'none';
      }

      linesContainer.appendChild(line);
    });

    // Calculate hold duration
    const staggerTime = CONFIG.REDUCED_MOTION ? 0 : topStats.length * CONFIG.COGNITIVE_STATS_DISPLAY.staggerDelay;
    const totalDisplayTime = staggerTime + CONFIG.COGNITIVE_STATS_DISPLAY.holdDuration;

    // Hold visible, then hide
    setTimeout(() => {
      hideCognitiveStats();

      // Resolve after hide completes
      const fadeDuration = CONFIG.REDUCED_MOTION ? 0 : CONFIG.COGNITIVE_STATS_DISPLAY.fadeDuration;
      setTimeout(() => {
        resolve();
      }, fadeDuration);
    }, totalDisplayTime);
  });
}
```

**2. cognitive-feedback.js — Update hideCognitiveStats() for reduced motion:**

```javascript
export function hideCognitiveStats() {
  const container = document.querySelector('.cognitive-stats');
  const header = document.querySelector('.cognitive-stats-header');
  const lines = document.querySelectorAll('.cognitive-stat-line');

  if (CONFIG.REDUCED_MOTION) {
    // Reduced motion: instant disappearance
    container.classList.add('hidden');
  } else {
    // Normal: fade-out animation
    header.classList.add('fade-out');
    lines.forEach(line => line.classList.add('fade-out'));

    setTimeout(() => {
      container.classList.add('hidden');
    }, CONFIG.COGNITIVE_STATS_DISPLAY.fadeDuration);
  }
}
```

**3. style.css — Add @media query for prefers-reduced-motion:**

```css
/* Cognitive Stats animations */
.cognitive-stats-header {
  opacity: 0;
  animation: fadeIn 300ms ease-out forwards;
}

.cognitive-stat-line {
  opacity: 0;
  animation: fadeIn 300ms ease-out forwards;
}

/* Disable animations for prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .cognitive-stats-header {
    opacity: 1 !important;
    animation: none !important;
  }

  .cognitive-stat-line {
    opacity: 1 !important;
    animation: none !important;
  }

  .fade-out {
    animation: none !important;
    opacity: 0 !important;
  }
}
```

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Enable Reduced Motion:**
   - Chrome/Edge: Settings → Accessibility → Prefers reduced motion → Enable
   - Firefox: about:config → ui.prefersReducedMotion → 1
   - Safari: System Preferences → Accessibility → Display → Reduce motion → Enable
   - Verify CONFIG.REDUCED_MOTION = true

2. **Instant Appearance (Reduced Motion ON):**
   - Die with 3 stats
   - Verify all stat lines appear instantly (no stagger)
   - Verify stats are immediately visible (no fade-in)

3. **Hold Duration Maintained (Reduced Motion ON):**
   - Stats appear instantly
   - Start timer
   - Verify stats visible for ~2.5 seconds

4. **Instant Disappearance (Reduced Motion ON):**
   - After 2.5s hold
   - Verify stats disappear instantly (no fade-out)
   - Verify Play Again button appears immediately

5. **Normal Mode Still Works (Reduced Motion OFF):**
   - Disable prefers-reduced-motion
   - Refresh page
   - Die with 3 stats
   - Verify stagger animation (300ms intervals)
   - Verify fade-in and fade-out animations work

**Edge Cases:**
- Toggle prefers-reduced-motion during gameplay (may require refresh)
- Reduced motion with 1 stat (still instant appearance)
- Reduced motion with 0 stats (no display, no error)

---

### 📚 CRITICAL DATA FORMATS

**Reduced motion check:**
```javascript
if (CONFIG.REDUCED_MOTION) { /* instant */ }  // CORRECT
if (prefersReducedMotion) { /* instant */ }   // WRONG (variable not in scope)
```

**Stagger time calculation:**
```javascript
const staggerTime = CONFIG.REDUCED_MOTION ? 0 : statCount * 300;  // CORRECT
const staggerTime = statCount * 300;                               // WRONG (ignores reduced motion)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- WCAG 2.1 Guideline 2.3.3 — Animation from Interactions (Level AAA)
- `_bmad-output/planning-artifacts/game-ux-principles.md` — Accessibility principles

**Key Accessibility Principles:**
- **Respect user preferences:** Honor prefers-reduced-motion automatically
- **Maintain content:** Stats still display, just without animations
- **Preserve readability:** 2.5s hold duration maintained
- **No manual settings:** Browser-level setting is sufficient

---

### 📋 FRs COVERED

Accessibility requirement (not numbered FR, but referenced in Epic 11)

**Detailed Requirement Mapping:**
- Reduced motion mode for cognitive stats → CONFIG.REDUCED_MOTION check

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] CONFIG.REDUCED_MOTION detects prefers-reduced-motion (already exists from Epic 8)
- [ ] showCognitiveStats() checks REDUCED_MOTION
- [ ] If reduced motion: skip stagger delays (staggerTime = 0)
- [ ] If reduced motion: disable fade-in animations (opacity = 1, animation = none)
- [ ] hideCognitiveStats() checks REDUCED_MOTION
- [ ] If reduced motion: instant disappearance (no fade-out)
- [ ] @media (prefers-reduced-motion: reduce) added to CSS
- [ ] CSS disables animations for header and stat lines
- [ ] 2.5s hold duration maintained in reduced motion mode
- [ ] All stats appear instantly (verified)
- [ ] Stats disappear instantly (verified)
- [ ] Play Again button appears immediately after hold (verified)
- [ ] Normal mode still works (stagger and fades active)
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (toggle motion preference, 1 stat, 0 stats)

**Common Mistakes to Avoid:**
- ❌ Not checking REDUCED_MOTION (animations always play)
- ❌ Removing 2.5s hold in reduced motion mode (content disappears too fast)
- ❌ Partial animation removal (e.g., fade-in disabled but fade-out still active)
- ❌ Hardcoding animation removal (should use CONFIG.REDUCED_MOTION check)
- ❌ Not testing both modes (normal and reduced motion)

---

## Dev Agent Record

### Agent Model Used

_To be filled by implementing agent_

### Debug Log References

_To be filled during implementation_

### Completion Notes List

_To be filled on completion_

### File List

- js/config.js (verify - REDUCED_MOTION flag from Epic 8)
- js/cognitive-feedback.js (modified - check REDUCED_MOTION in show/hide functions)
- css/style.css (modified - add @media query for prefers-reduced-motion)
