# Story 17.5: Display Streak on Post-Game and Skill Map

**Epic:** 17 - Streak System

**As a** player,
**I want** to see my current streak in both post-game summary and Skill Map,
**So that** I'm reminded of my consistency without it being intrusive.

---

## Acceptance Criteria

**Given** player completes a game with active streak
**When** post-game summary displays
**Then** show streak counter at bottom:
```
🔥 12-day streak
```
**And** positioned below "Play Again" / "Skill Map" buttons (per Epic 14 Story 14.6)
**And** flame emoji + text in 12px Jersey20, light grey

**Given** player achieves 7-day or 30-day milestone
**When** post-game streak counter displays
**Then** use gold color #FFD700 instead of light grey
**And** subtle pulsing animation (scale 1.0 → 1.05 → 1.0, 2s cycle)

**Given** Skill Map displays
**When** session metadata renders
**Then** show streak alongside session count:
```
Sessions: 47     Streak: 12 days 🔥
```
**And** centered or left-aligned below growth area callout (per Epic 16 Story 16.4)

**Given** streak is 0 (just broken)
**When** post-game displays
**Then** show gentle encouragement (per Story 17.4)
**And** Skill Map shows: "Streak: 0 days / Longest: 30 days"

**Given** currentStreak > longestStreak
**When** streak counter displays
**Then** highlight as new personal best:
```
🔥 31-day streak — NEW RECORD! 🎉
```
**And** gold color, brief confetti animation on post-game

**Per FR192:** Streak counter displays on post-game screen and brain map dashboard

---

## Tasks / Subtasks

- [ ] Add streak counter to post-game screen (AC: Visible below buttons)
  - [ ] Update cognitive-feedback.js renderPostGameScreen()
  - [ ] Position: Below "Play Again" / "Skill Map" buttons
  - [ ] Style: 12px Jersey20, light grey (#AAAAAA)
  - [ ] Flame emoji 🔥 prefix
- [ ] Implement milestone highlighting (AC: Gold at 7-day, 30-day)
  - [ ] Check currentStreak >= 7 or >= 30
  - [ ] Apply gold color (#FFD700)
  - [ ] Subtle pulsing animation (scale 1.0 → 1.05 → 1.0, 2s cycle)
- [ ] Add streak to Skill Map dashboard (AC: Alongside session count)
  - [ ] Update dashboard.js renderSkillMap()
  - [ ] Display: "Sessions: 47     Streak: 12 days 🔥"
  - [ ] Position: Below growth area callout
- [ ] Implement new record celebration (AC: Confetti + gold text)
  - [ ] Check if currentStreak > longestStreak
  - [ ] Display: "🔥 31-day streak — NEW RECORD! 🎉"
  - [ ] Brief confetti animation on post-game
- [ ] Test visual consistency (AC: Retro aesthetic maintained)

---

## Developer Context

### 🎯 STORY OBJECTIVE

This story implements **STREAK VISUAL DISPLAY** on post-game and Skill Map screens. Your job is to:

1. Add streak counter to post-game screen (below buttons)
2. Implement milestone highlighting (gold at 7-day, 30-day)
3. Add streak to Skill Map (alongside session count)
4. Celebrate new records (confetti + "NEW RECORD!" message)

**CRITICAL SUCCESS FACTORS:**
- Streak MUST be visible on both post-game and Skill Map
- Milestone colors MUST match spec (gold #FFD700)
- New record MUST celebrate with confetti + special message
- Retro aesthetic MUST be maintained (Jersey20 font, pixel-perfect layout)

**WHY THIS MATTERS:**
- No visual display = invisible system (player doesn't see progress)
- Wrong positioning = cluttered UI (disrupts post-game flow)
- No celebration = missed motivational moment (new records are achievements)
- Inconsistent styling = breaks retro aesthetic (visual coherence critical)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Module Structure (THIS STORY):**

```
js/
├── cognitive-feedback.js  # Post-game streak display (MODIFY)
├── dashboard.js          # Skill Map streak display (MODIFY)
├── config.js             # DASHBOARD.STREAK_MILESTONES (NEW)
css/
└── style.css             # Streak styling + animations (MODIFY)
```

**Display Pattern:**

From Epic 17, Epic 14, Epic 16:
- **Post-game:** Below "Play Again" / "Skill Map" buttons
- **Skill Map:** Below growth area callout, alongside session count
- **Styling:** 12px Jersey20, light grey default, gold at milestones
- **Animation:** Subtle pulsing at 7-day, 30-day milestones

**Visual Hierarchy:**
```
Post-Game Screen:
├── "RECAP" header
├── Highlights (3 items)
├── Comedy quote
├── "Play Again" / "Skill Map" buttons
└── 🔥 Streak counter (THIS STORY)

Skill Map:
├── Brain visualization
├── 6 domain block bars
├── Strongest / Growth callouts
├── Sessions: 47     Streak: 12 days 🔥 (THIS STORY)
└── "Play Now" / "Back to Menu" buttons
```

---

### 📦 LIBRARY & FRAMEWORK REQUIREMENTS

**Browser APIs Used:**
- DOM manipulation (createElement, appendChild)
- CSS animations (pulsing, confetti)

**No external dependencies** (no confetti.js — simple CSS particle effect)

---

### 📁 FILE STRUCTURE REQUIREMENTS

**js/config.js - Streak Milestones (NEW)**

```javascript
// Add to CONFIG.DASHBOARD section

STREAK_MILESTONES: [7, 14, 30, 60], // Highlight these streaks in gold
```

**js/cognitive-feedback.js - Post-Game Streak Display (MODIFY)**

```javascript
import { getStreak } from './storage.js';
import { CONFIG } from './config.js';

/**
 * Render streak counter on post-game screen
 * @param {Object} streakResult - From checkAndUpdateStreak()
 */
function renderStreakCounter(streakResult) {
  const container = document.getElementById('post-game-streak');
  container.innerHTML = '';

  if (!streakResult || streakResult.currentStreak === 0) {
    // No active streak — show fresh start message
    const message = document.createElement('div');
    message.className = 'streak-counter fresh-start';
    message.textContent = CONFIG.DASHBOARD.STREAK_MESSAGES.freshStart;
    message.style.color = '#AAAAAA';
    container.appendChild(message);
    return;
  }

  const { currentStreak, longestStreak, isNewRecord } = streakResult;

  // Streak counter
  const counter = document.createElement('div');
  counter.className = 'streak-counter';

  // Text content
  let text = `🔥 ${currentStreak}-day streak`;
  if (isNewRecord) {
    text += ` — ${CONFIG.DASHBOARD.STREAK_MESSAGES.newRecord}`;
  }
  counter.textContent = text;

  // Styling
  const isMilestone = CONFIG.DASHBOARD.STREAK_MILESTONES.includes(currentStreak);
  if (isNewRecord || isMilestone) {
    counter.style.color = '#FFD700'; // Gold
    counter.classList.add('milestone'); // Pulsing animation
  } else {
    counter.style.color = '#AAAAAA'; // Light grey
  }

  counter.style.fontSize = '12px';
  counter.style.fontFamily = 'Jersey20';
  counter.style.textAlign = 'center';
  counter.style.marginTop = '16px';

  container.appendChild(counter);

  // Confetti on new record
  if (isNewRecord) {
    triggerConfetti(container);
  }
}

/**
 * Trigger confetti animation (simple CSS particles)
 */
function triggerConfetti(container) {
  const confetti = document.createElement('div');
  confetti.className = 'confetti-burst';
  container.appendChild(confetti);

  // Auto-remove after animation (2s)
  setTimeout(() => confetti.remove(), 2000);
}
```

**js/dashboard.js - Skill Map Streak Display (MODIFY)**

```javascript
import { getStreak } from './storage.js';

/**
 * Render streak on Skill Map (alongside session count)
 */
function renderStreakSection(profile) {
  const streak = getStreak();
  const container = document.getElementById('skill-map-metadata');
  container.innerHTML = '';

  // Session count
  const sessions = document.createElement('span');
  sessions.textContent = `Sessions: ${profile.sessionsCompleted}`;
  sessions.style.color = '#AAAAAA';
  sessions.style.fontSize = '12px';
  sessions.style.fontFamily = 'Jersey20';
  container.appendChild(sessions);

  // Spacing
  const spacer = document.createElement('span');
  spacer.textContent = '     '; // 5 spaces
  container.appendChild(spacer);

  // Streak
  const streakSpan = document.createElement('span');
  streakSpan.textContent = `Streak: ${streak.currentStreak} days 🔥`;
  streakSpan.style.color = '#AAAAAA';
  streakSpan.style.fontSize = '12px';
  streakSpan.style.fontFamily = 'Jersey20';
  container.appendChild(streakSpan);

  // Longest streak (if different from current)
  if (streak.longestStreak > streak.currentStreak && streak.longestStreak > 0) {
    const longest = document.createElement('span');
    longest.textContent = ` / Longest: ${streak.longestStreak} days`;
    longest.style.color = '#FFD700'; // Gold (celebrate peak)
    longest.style.fontSize = '10px';
    longest.style.marginLeft = '8px';
    container.appendChild(longest);
  }
}
```

**css/style.css - Streak Styling (MODIFY)**

```css
/* Streak Counter - Post-Game */
.streak-counter {
  font-family: 'Jersey20', monospace;
  font-size: 12px;
  text-align: center;
  margin-top: 16px;
  color: #AAAAAA;
}

/* Milestone Pulsing Animation */
.streak-counter.milestone {
  animation: streak-pulse 2s ease-in-out infinite;
}

@keyframes streak-pulse {
  0%, 100% {
    transform: scale(1.0);
  }
  50% {
    transform: scale(1.05);
  }
}

/* Confetti Burst (Simple CSS Particles) */
.confetti-burst {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 100%;
  height: 100%;
  pointer-events: none;
  animation: confetti-fall 2s ease-out forwards;
}

.confetti-burst::before,
.confetti-burst::after {
  content: '🎉';
  position: absolute;
  font-size: 24px;
  animation: confetti-spin 2s ease-out forwards;
}

.confetti-burst::before {
  left: 20%;
  animation-delay: 0s;
}

.confetti-burst::after {
  right: 20%;
  animation-delay: 0.3s;
}

@keyframes confetti-fall {
  0% {
    opacity: 1;
    transform: translateY(0);
  }
  100% {
    opacity: 0;
    transform: translateY(100px);
  }
}

@keyframes confetti-spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(720deg);
  }
}

/* Fresh Start Message */
.streak-counter.fresh-start {
  color: #AAAAAA;
  font-size: 12px;
}

/* Skill Map Metadata Section */
#skill-map-metadata {
  text-align: center;
  margin-top: 12px;
  font-family: 'Jersey20', monospace;
  font-size: 12px;
}
```

**index.html - Streak DOM Containers (VERIFY EXISTING)**

```html
<!-- Post-Game Screen -->
<div id="gameover-screen" class="screen hidden">
  <h1>RECAP</h1>
  <div id="post-game-highlights"></div>
  <div id="post-game-quote"></div>
  <div class="button-row">
    <button id="play-again-btn">Play Again</button>
    <button id="skill-map-btn">Skill Map</button>
  </div>
  <div id="post-game-streak"></div> <!-- NEW: Streak counter -->
</div>

<!-- Skill Map Screen -->
<div id="skill-map-screen" class="screen hidden">
  <div id="skill-map-bars"></div>
  <div id="skill-map-callouts"></div>
  <div id="skill-map-metadata"></div> <!-- NEW: Sessions + Streak -->
  <div class="button-row">
    <button id="skill-map-play-now-btn">Play Now</button>
    <button id="skill-map-back-btn">Back to Menu</button>
  </div>
</div>
```

---

### 🎨 VISUAL SPECIFICATIONS

**Post-Game Streak Counter:**
- Position: Below "Play Again" / "Skill Map" buttons, 16px margin-top
- Font: 12px Jersey20, light grey (#AAAAAA)
- Flame emoji: 🔥 prefix
- Milestone (7-day, 30-day): Gold (#FFD700), pulsing animation (1.0 → 1.05 → 1.0, 2s cycle)
- New record: Gold + "NEW RECORD! 🎉" + brief confetti

**Skill Map Streak Display:**
- Position: Below growth area callout, centered
- Format: "Sessions: 47     Streak: 12 days 🔥"
- Font: 12px Jersey20, light grey (#AAAAAA)
- Longest streak: "/ Longest: 30 days" in gold (#FFD700), 10px font

**Confetti Animation:**
- Simple CSS particle effect (🎉 emoji spinning + falling)
- Duration: 2s
- Auto-remove after animation completes

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Post-Game Display:**
   - Complete game → verify streak counter appears below buttons
   - Check flame emoji 🔥 prefix
   - Verify 12px Jersey20 font, light grey color

2. **Milestone Highlighting:**
   - Achieve 7-day streak → verify gold color (#FFD700)
   - Verify pulsing animation (scale 1.0 → 1.05)
   - Test 14-day, 30-day, 60-day milestones

3. **New Record Celebration:**
   - Achieve new longestStreak → verify "NEW RECORD! 🎉" text
   - Verify confetti animation appears
   - Verify gold color applied

4. **Skill Map Display:**
   - Open Skill Map → verify "Sessions: X     Streak: Y days 🔥"
   - Check positioning (below growth callout, centered)
   - Verify longest streak shown if higher than current

5. **Visual Consistency:**
   - Verify Jersey20 font used (retro aesthetic)
   - Check spacing matches other UI elements
   - Confirm no layout shifts (streak doesn't push other elements)

**Automated Tests:**

```javascript
// Test milestone detection
import { CONFIG } from './config.js';

const milestones = CONFIG.DASHBOARD.STREAK_MILESTONES;
console.assert(milestones.includes(7), '7-day milestone');
console.assert(milestones.includes(30), '30-day milestone');
console.assert(milestones.length === 4, '4 milestones total');
```

---

### 📚 CRITICAL DATA FORMATS

**Streak Display Format:**
```javascript
// Post-game
"🔥 5-day streak"                       // Default
"🔥 7-day streak"                       // Milestone (gold)
"🔥 31-day streak — NEW RECORD! 🎉"    // New record

// Skill Map
"Sessions: 47     Streak: 12 days 🔥"
"Sessions: 47     Streak: 12 days 🔥 / Longest: 30 days"
```

**Milestone Thresholds:**
```javascript
// From CONFIG.DASHBOARD.STREAK_MILESTONES
[7, 14, 30, 60]
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Critical Rules for This Story:**

From project-context.md:
1. **DOM Rendering:** Use .hidden class for screen visibility
2. **Typography:** Jersey20 font for all retro text
3. **Colors:** Light grey (#AAAAAA) default, gold (#FFD700) milestones
4. **Reduced Motion:** Respect prefers-reduced-motion (no pulsing if set)

**Visual Hierarchy Rules:**
- Post-game: Streak below buttons (non-intrusive)
- Skill Map: Streak alongside session count (balanced)
- No layout shifts (fixed positioning)

---

### 🚨 PREVIOUS STORY DEPENDENCIES

**Depends on Story 17.1:**
- ✅ checkAndUpdateStreak() must return streakResult with isNewRecord flag
- ✅ Streak data must be available

**Depends on Epic 14 (Post-Game Summary):**
- ✅ cognitiveFeedback.showPostGameScreen() must be functional
- ✅ Post-game DOM structure must exist

**Depends on Epic 16 (Skill Map Dashboard):**
- ✅ dashboard.renderSkillMap() must be functional
- ✅ Skill Map DOM structure must exist

**If UI screens incomplete, this story will fail!**

---

### 📋 FRs COVERED

FR192

**Detailed FR Mapping:**
- FR192: Streak counter on post-game screen → renderStreakCounter()
- FR192: Streak counter on brain map dashboard → renderStreakSection()

**NFRs Covered:**
- NFR40: Visual feedback → Milestone colors, pulsing animation
- NFR67: Gentle messaging → Celebrate achievements (NEW RECORD!)

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] Post-game streak counter appears below buttons
- [ ] Flame emoji 🔥 prefix displayed
- [ ] 12px Jersey20 font applied
- [ ] Light grey (#AAAAAA) color default
- [ ] Gold (#FFD700) color at milestones (7, 14, 30, 60 days)
- [ ] Pulsing animation on milestones (scale 1.0 → 1.05, 2s cycle)
- [ ] New record shows "NEW RECORD! 🎉"
- [ ] Confetti animation on new record
- [ ] Skill Map shows "Sessions: X     Streak: Y days 🔥"
- [ ] Longest streak displayed if higher than current
- [ ] Positioning correct on both screens
- [ ] No layout shifts
- [ ] Retro aesthetic maintained

**Visual Display Checklist:**
- [ ] Post-game: Below buttons, centered
- [ ] Skill Map: Below callouts, centered
- [ ] Jersey20 font used
- [ ] Spacing matches UI standards

**Animation Checklist:**
- [ ] Pulsing animation smooth (2s cycle)
- [ ] Confetti auto-removes after 2s
- [ ] Reduced motion support (no animation if prefers-reduced-motion set)

**Common Mistakes to Avoid:**
- ❌ Positioning streak above buttons (disrupts flow)
- ❌ Using wrong font (not Jersey20)
- ❌ Wrong milestone thresholds
- ❌ Confetti not auto-removing (DOM bloat)
- ❌ Layout shifts when streak appears

---
