# Story 23.3: Implement Count-Up Animation

**Epic:** 23 - Run Summary Bar (Post-Game Food Counter)

**As a** player,
**I want** the food counts to animate upward from zero when the Game Over screen appears,
**So that** each number feels earned and the summary moment is celebratory rather than static.

---

## Acceptance Criteria

**Given** the Game Over screen renders and the Run Summary Bar has one or more badges
**When** the animation sequence begins
**Then** badges enter staggered left-to-right with 80ms offset between each
**And** each badge entry is: fade-in + scale from 0.7 → 1.0 over 150ms, ease-out
**And** after all badges have entered (~300ms from sequence start), all counters begin counting simultaneously

**Given** counters begin counting
**When** animating each badge count
**Then** all visible counters start from 0 at the same `startTime` timestamp
**And** each counter increments toward its `finalValue` using ease-out easing
**And** easing formula: `currentDisplay = Math.round(easeOut(elapsed / duration) * finalValue)`
**And** animation duration per badge: `Math.max(finalValue * 80, 400)` ms, capped at 1200ms
**And** animation is driven by `requestAnimationFrame` — not `setInterval` or `setTimeout`

**Given** a badge has `finalValue === 1`
**When** the animation sequence runs for that badge
**Then** skip the count-up animation — display `1` immediately on badge entry
**And** still apply the entry fade-in + scale animation

**Given** a counter reaches its `finalValue`
**When** the final number lands
**Then** trigger a single brightness flash: 1 white pulse over 200ms
**And** implement flash as a CSS class added then removed (same pattern as `.milestone-blink`)
**And** after flash, number settles at final value with standard neon glow

**Given** `CONFIG.REDUCED_MOTION === true`
**When** the Game Over screen renders
**Then** skip count-up animation — display all final values immediately on badge entry
**And** skip entry scale animation — badges fade in only (no scale transform)
**And** skip final-number flash
**And** read `CONFIG.REDUCED_MOTION` — do NOT call `window.matchMedia()` directly

---

## Development

### Files to Modify

- **`js/main.js`** (or **`js/run-summary.js`** if extracted in Story 23.2) — Add animation logic to the Run Summary Bar render module

### Implementation Notes

**Ease-out helper:**
```javascript
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3); // Cubic ease-out
}
```

**Full animation sequence:**
```javascript
function animateRunSummaryBar(badges) {
  if (CONFIG.REDUCED_MOTION) {
    badges.forEach((badge, i) => {
      badge.el.style.animation = `runBadgeFadeIn 150ms ease-out ${i * 80}ms forwards`;
    });
    return;
  }

  // Step 1: Staggered badge entry (fade + scale)
  badges.forEach((badge, i) => {
    badge.el.style.animation =
      `runBadgeEnter 150ms ease-out ${i * 80}ms forwards`;
    badge.countEl.textContent = '0';
  });

  // Step 2: Start all count-ups simultaneously after entries complete
  const entryDuration = badges.length * 80 + 150;
  setTimeout(() => {
    const startTime = performance.now();

    badges.forEach(badge => {
      if (badge.finalValue === 1) {
        badge.countEl.textContent = '1';
        triggerLandingFlash(badge.countEl);
        return;
      }

      const duration = Math.min(Math.max(badge.finalValue * 80, 400), 1200);

      function tick(now) {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.round(easeOut(progress) * badge.finalValue);
        badge.countEl.textContent = current;

        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          badge.countEl.textContent = badge.finalValue;
          triggerLandingFlash(badge.countEl);
        }
      }

      requestAnimationFrame(tick);
    });
  }, entryDuration);
}

function triggerLandingFlash(el) {
  el.classList.remove('run-count-flash');
  void el.offsetWidth; // Force reflow to restart animation
  el.classList.add('run-count-flash');
  el.addEventListener('animationend', () => {
    el.classList.remove('run-count-flash');
  }, { once: true });
}
```

**CSS — entry animation and landing flash:**
```css
@keyframes runBadgeEnter {
  from { opacity: 0; transform: scale(0.7); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes runBadgeFadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes runCountFlash {
  0%   { color: #ffffff; text-shadow: 0 0 12px #ffffff; }
  100% { color: inherit; text-shadow: inherit; }
}

.run-count-flash {
  animation: runCountFlash 200ms ease-out forwards;
}

.run-badge {
  opacity: 0; /* Start hidden, animation reveals */
}
```

**Wiring into render call (Story 23.2 render function, after DOM is built):**
```javascript
const animatableBadges = Array.from(bar.children).map((el, i) => ({
  el,
  countEl: el.querySelector('.run-badge__count'),
  finalValue: parseInt(el.dataset.finalValue, 10)
}));

animateRunSummaryBar(animatableBadges);
```

**No `setInterval`:** Use `requestAnimationFrame` exclusively for the count-up loop. `setTimeout` is acceptable only for the initial entry delay — it is not part of the animation loop itself.

### Dependencies

**BLOCKS:** Story 23.4
**BLOCKED BY:** Story 23.2

---

## Implementation Status

**Status:** 🟢 DONE

---

## Dev Agent Record

### Implementation Plan
- Animation integrated directly into `js/run-summary.js` (same module as Story 23.2 render)
- `animateRunSummaryBar(badges)` called at end of `renderRunSummaryBar()` after DOM is built
- CSS keyframes appended to `style.css` Run Summary Bar section

### Completion Notes
- `easeOut(t)`: cubic ease-out `1 - (1-t)^3` in `run-summary.js`
- `triggerLandingFlash(el)`: adds `.run-count-flash`, uses `void el.offsetWidth` reflow, removes on `animationend` (same pattern as `.milestone-blink`)
- `animateRunSummaryBar(badges)`: staggered entry at 80ms offset → all counters fire simultaneously after entry completes → `requestAnimationFrame` tick loop (no setInterval)
- `finalValue === 1`: no count-up, shows `1` immediately + flash
- `REDUCED_MOTION` path: fade-in only, no scale, no count-up, no flash (reads `CONFIG.REDUCED_MOTION`)
- Duration: `Math.min(Math.max(finalValue * 80, 400), 1200)` — floor 400ms, cap 1200ms
- CSS added: `@keyframes runBadgeEnter`, `@keyframes runBadgeFadeIn`, `@keyframes runCountFlash`, `.run-count-flash`

---

## File List
- `js/run-summary.js` — Animation logic integrated (Stories 23.2 + 23.3 co-located)
- `css/style.css` — Animation keyframes added in Run Summary Bar section
- `_bmad-output/implementation-artifacts/stories/23-3-implement-count-up-animation.md` — Status updated
- `_bmad-output/implementation-artifacts/sprint-status.yaml` — Status: review

---

## Change Log
- 2026-02-19: Story 23.3 implemented — count-up animation with staggered entry, ease-out RAF loop, reduced-motion compliance
