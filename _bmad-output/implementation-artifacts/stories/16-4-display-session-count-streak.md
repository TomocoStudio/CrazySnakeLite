# Story 16.4: Display Session Count and Streak

**Epic:** 16 - Skill Map Dashboard (The Cognitive Mirror)

**As a** player,
**I want** to see how many sessions I've played and my current streak,
**So that** I understand my engagement level and habit consistency.

---

## Acceptance Criteria

**Given** Skill Map displays
**When** session metadata renders
**Then** show below callout cards:
```
Sessions: 47     Streak: 12 days 🔥
```
**And** text in 14px Jersey20, light grey
**And** centered or left-aligned below growth area callout

**Given** sessionsCompleted is retrieved from storage
**When** displaying session count
**Then** show total sessions played (includes calibration sessions)
**And** format: "Sessions: {count}"

**Given** currentStreak is retrieved from storage
**When** displaying streak
**Then** show current streak in days
**And** format: "Streak: {days} day{s} 🔥"
**And** flame emoji only if streak >= 1 day

**Given** streak is 7 days or 30 days (milestone)
**When** displaying streak
**Then** use gold color #FFD700 instead of light grey
**And** subtle pulsing animation (scale 1.0 → 1.05 → 1.0, 2s cycle)

**Given** streak is 0 (just broken)
**When** displaying streak
**Then** show: "Streak: 0 days — ready to start fresh?"
**And** no flame emoji
**And** gentle tone (no guilt per ethical guardrails)

**Per FR177-FR178:** Session count displayed prominently, current streak displayed prominently

---

## Dev Section

### Technical Context

**Story Purpose:** Integrate the streak.js module into the Skill Map dashboard. Displays session count and current streak with milestone detection and celebration states. This is a pure read operation — all streak logic lives in streak.js, dashboard.js just renders the stored values.

**Architecture Pattern:** Dashboard reads pre-calculated values from storage (via streak.js). No streak calculation happens in dashboard.js. Milestone detection (7-day, 30-day) triggers visual emphasis (gold color, pulsing animation).

**Key Dependencies:**
- Epic 15 complete (calibrationComplete boolean, totalSessions counter)
- Epic 17 complete (streak.js module with checkAndUpdateStreak(), currentStreak field in profile)

### Files to Modify

**MODIFY:**
- `js/dashboard.js` — Add `renderSessionStats()` function, milestone detection logic
- `js/streak.js` — Already exists from Epic 17, read-only access here
- `css/style.css` — Add session/streak display styles, milestone pulsing animation

**READ (context):**
- `js/storage.js` — Understand profile shape (totalSessions, currentStreak)

### Implementation Guidance

#### 1. Session & Streak Rendering (js/dashboard.js)

**Add to `renderFullSkillMap()`:**

```javascript
// dashboard.js — renderFullSkillMap()
function renderFullSkillMap(profile) {
  const barsContainer = document.getElementById('skill-map-bars-container');
  const { domainScores, totalSessions, currentStreak } = profile;

  // ... existing block bar rendering from 16.2 ...
  // ... existing callout rendering from 16.3 ...

  // NEW: Render session stats
  renderSessionStats(totalSessions, currentStreak);
}

/**
 * Render session count and streak below callouts
 * @param {number} totalSessions - Total games played (includes calibration)
 * @param {number} currentStreak - Current streak in days
 */
function renderSessionStats(totalSessions, currentStreak) {
  const statsContainer = document.getElementById('skill-map-stats');
  statsContainer.innerHTML = '';

  const statsRow = document.createElement('div');
  statsRow.className = 'session-stats-row';

  // Session count
  const sessionsEl = document.createElement('span');
  sessionsEl.className = 'session-count';
  sessionsEl.textContent = `Sessions: ${totalSessions}`;
  statsRow.appendChild(sessionsEl);

  // Streak
  const streakEl = document.createElement('span');
  streakEl.className = 'streak-count';

  const isMilestone = currentStreak === 7 || currentStreak === 30;

  if (currentStreak === 0) {
    // Gentle tone on streak break (no flame emoji)
    streakEl.textContent = 'Streak: 0 days — ready to start fresh?';
    streakEl.classList.add('streak-broken');
  } else {
    const dayLabel = currentStreak === 1 ? 'day' : 'days';
    streakEl.textContent = `Streak: ${currentStreak} ${dayLabel} 🔥`;

    if (isMilestone) {
      streakEl.classList.add('milestone');
    }
  }

  statsRow.appendChild(streakEl);

  statsContainer.appendChild(statsRow);
}
```

**Calibration placeholder:**

```javascript
function renderCalibrationPlaceholder(profile) {
  const barsContainer = document.getElementById('skill-map-bars-container');
  const calloutsContainer = document.getElementById('skill-map-callouts');
  const statsContainer = document.getElementById('skill-map-stats');

  // ... existing empty bars rendering from 16.2 ...

  calloutsContainer.innerHTML = `
    <p class="calibration-message">
      Warming up...<br>
      Session ${profile?.totalSessions || 0}/5
    </p>
  `;

  // Show session count during calibration (no streak until unlocked)
  statsContainer.innerHTML = `
    <div class="session-stats-row">
      <span class="session-count">Sessions: ${profile?.totalSessions || 0}</span>
    </div>
  `;
}
```

#### 2. CSS Styling (css/style.css)

**Add session/streak styles:**

```css
/* === Session & Streak Stats === */
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

/* Milestone styling (7-day, 30-day) */
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

/* Streak broken state */
.streak-count.streak-broken {
  color: #B0B0B0;  /* Same light grey, no red */
  font-style: italic;
}

/* Mobile responsive */
@media (max-width: 768px) {
  .session-stats-row {
    flex-direction: column;
    align-items: center;
    gap: 12px;
  }

  .session-count,
  .streak-count {
    font-size: 12px;
  }
}
```

**Reduced motion handling:**

```css
/* Disable milestone animation if prefers-reduced-motion */
@media (prefers-reduced-motion: reduce) {
  .streak-count.milestone {
    animation: none;
  }
}
```

#### 3. Milestone Detection Logic (js/dashboard.js)

**Milestone thresholds** (from CONFIG.DASHBOARD or hardcoded):

```javascript
// dashboard.js — Milestone detection helper
const MILESTONE_THRESHOLDS = [7, 14, 30, 60];

function isMilestoneStreak(streak) {
  return MILESTONE_THRESHOLDS.includes(streak);
}

// Usage in renderSessionStats:
const isMilestone = isMilestoneStreak(currentStreak);
```

**Optional:** Add milestone detection to CONFIG.DASHBOARD for consistency:

```javascript
// config.js — DASHBOARD section
DASHBOARD: {
  // ... existing fields ...

  STREAK_MILESTONES: [7, 14, 30, 60]
}
```

### Testing Guidance

**Manual Testing Checklist:**

1. **Session Count Display:**
   - [ ] Open Skill Map after 10 sessions → shows "Sessions: 10"
   - [ ] Session count matches profile.totalSessions
   - [ ] Includes calibration sessions (shows 3/5 during calibration)

2. **Streak Display:**
   - [ ] 1-day streak → "Streak: 1 day 🔥" (singular "day")
   - [ ] 5-day streak → "Streak: 5 days 🔥" (plural "days")
   - [ ] 0-day streak → "Streak: 0 days — ready to start fresh?" (no flame, gentle tone)
   - [ ] Flame emoji appears for all streaks >= 1 day

3. **Milestone Detection:**
   - [ ] 7-day streak → gold color #FFD700, pulsing animation
   - [ ] 30-day streak → gold color #FFD700, pulsing animation
   - [ ] Non-milestone (e.g., 8 days) → light grey, no pulse

4. **Milestone Animation:**
   - [ ] Pulse cycle: scale 1.0 → 1.05 → 1.0, 2s duration
   - [ ] No jank or dropped frames (60 FPS maintained)
   - [ ] Animation disabled if user has prefers-reduced-motion enabled

5. **Calibration State:**
   - [ ] During calibration → only session count shown
   - [ ] After calibration → session count + streak shown

6. **Mobile Layout:**
   - [ ] Stats stack vertically on < 768px
   - [ ] Text remains readable (12px minimum)

### Definition of Done

- [ ] `renderSessionStats()` implemented in dashboard.js
- [ ] Session count displays with correct total (includes calibration)
- [ ] Streak displays with flame emoji (except on 0-day streak)
- [ ] Singular/plural "day"/"days" logic correct
- [ ] Milestone detection for 7-day and 30-day streaks
- [ ] Milestone styling: gold color #FFD700, pulsing animation
- [ ] Streak break message: gentle tone, no guilt
- [ ] CSS styles for .session-stats-row, .streak-count, .milestone added
- [ ] Reduced motion handling: no animation if prefers-reduced-motion
- [ ] Manual testing checklist passed (6/6 scenarios)
- [ ] No console errors

### Dependencies

**Blocked By:**
- Story 16.3 complete (callouts render correctly, stats appear below)
- Epic 17 complete (streak.js module exists, currentStreak in profile)

**Blocks:**
- Story 16.5 (quote rendering appears below stats)

### References

- [Source: ux-design-cognitive-dashboard.md — Session & Streak Display, Milestone Celebration]
- [Source: project-context.md — V3 Streak System, Ethical Guardrails]
- [Source: streak.js — checkAndUpdateStreak(), getStreakMessage()]
