// CrazySnakeLite - Run Summary Bar (Epic 23)
// Story 23.2: Render badge strip on Game Over screen
// Story 23.3: Count-up animation with ease-out + landing flash
import { CONFIG } from './config.js';

// Fixed display order (Story 23.2 AC)
const FOOD_ORDER = [
  'growing', 'speedDecrease', 'wallPhase',
  'speedBoost', 'reverseControls', 'invincibility'
];

// Story 23.3: Cubic ease-out helper
function easeOut(t) {
  return 1 - Math.pow(1 - t, 3);
}

// Story 23.3: Brightness flash when counter lands on final value
function triggerLandingFlash(el) {
  el.classList.remove('run-count-flash');
  void el.offsetWidth; // Force reflow to restart animation
  el.classList.add('run-count-flash');
  el.addEventListener('animationend', () => {
    el.classList.remove('run-count-flash');
  }, { once: true });
}

// Story 23.3: Animate badge entry + count-up
function animateRunSummaryBar(badges) {
  if (CONFIG.REDUCED_MOTION) {
    // Fade in only — final values already set in DOM, no scale or count-up
    badges.forEach((badge, i) => {
      badge.el.style.animation = `runBadgeFadeIn 150ms ease-out ${i * 80}ms forwards`;
    });
    return;
  }

  // Step 1: Staggered entry (fade + scale 0.7→1.0)
  badges.forEach((badge, i) => {
    badge.el.style.animation = `runBadgeEnter 150ms ease-out ${i * 80}ms forwards`;
    badge.countEl.textContent = '0';
  });

  // Step 2: All counters start simultaneously after entry animations complete
  const entryDuration = badges.length * 80 + 150;
  setTimeout(() => {
    const startTime = performance.now();

    badges.forEach(badge => {
      // finalValue === 1: display immediately, no count-up
      if (badge.finalValue === 1) {
        badge.countEl.textContent = '1';
        triggerLandingFlash(badge.countEl);
        return;
      }

      const duration = Math.min(Math.max(badge.finalValue * 120, 600), 2000);

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

/**
 * Story 23.2: Render Run Summary Bar on Game Over screen.
 * Builds badge strip from cognitiveStats, then triggers animation (Story 23.3).
 * @param {Object} cognitiveStats - gameState.cognitiveStats at death
 */
export function renderRunSummaryBar(cognitiveStats) {
  const bar = document.getElementById('run-summary-bar');
  bar.innerHTML = '';

  const badges = [];

  for (const foodType of FOOD_ORDER) {
    const count = cognitiveStats.foodsEaten[foodType];
    if (count > 0) badges.push({ foodType, count });
  }

  if (cognitiveStats.phoneCallsManaged > 0) {
    badges.push({ foodType: 'phone', count: cognitiveStats.phoneCallsManaged });
  }

  if (badges.length === 0) {
    bar.classList.add('hidden');
    return;
  }

  bar.classList.remove('hidden');

  badges.forEach(({ foodType, count }) => {
    const badge = document.createElement('span');
    badge.className = `run-badge run-badge--${foodType}`;
    badge.dataset.finalValue = count;

    const glyph = document.createElement('span');
    glyph.className = 'run-badge__glyph';

    // Phone glyph: unicode character; all others: CSS shape via class
    if (foodType === 'phone') {
      glyph.textContent = '\u260E';
    }

    const number = document.createElement('span');
    number.className = 'run-badge__count';
    number.textContent = count; // Story 23.3 will animate this from 0

    badge.appendChild(glyph);
    badge.appendChild(number);
    bar.appendChild(badge);
  });

  // Wire up Story 23.3 animation
  const animatableBadges = Array.from(bar.children).map(el => ({
    el,
    countEl: el.querySelector('.run-badge__count'),
    finalValue: parseInt(el.dataset.finalValue, 10)
  }));

  animateRunSummaryBar(animatableBadges);
}
