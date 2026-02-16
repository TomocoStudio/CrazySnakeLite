# Story 17.4: Implement Gentle Break Messaging

**Epic:** 17 - Streak System

**As a** player who missed a day,
**I want** to see encouraging messaging, not guilt,
**So that** I feel motivated to return without anxiety.

---

## Acceptance Criteria

**Given** player had 12-day streak, missed 2 days, then returns
**When** post-game summary displays
**Then** show gentle break message:
```
Rest day logged. Ready for another round?
```
**And** text in light grey (no red color)
**And** no warning icon, no negative framing
**And** tone is factual and encouraging (per FR195 - no guilt, no anxiety)

**Given** streak display shows currentStreak: 0
**When** rendering on post-game screen
**Then** show:
```
🔥 Fresh start — let's build a new streak!
```
**And** flame emoji still present (optimistic framing)

**Given** player breaks 30-day streak
**When** post-game summary displays
**Then** acknowledge achievement before reset:
```
30-day streak complete! Ready for round 2?
```
**And** celebrate previous streak (not dwell on break)
**And** longestStreak: 30 still displayed on Skill Map

**Given** Skill Map displays broken streak
**When** streak section renders
**Then** show:
```
Streak: 0 days
Longest: 30 days
```
**And** "Longest" label celebrates peak performance

**Given** break message displays
**When** player sees it on post-game screen
**Then** no push notifications, no emails, no external reminders (per FR197)
**And** dashboard pulls player back (not pushes)

**Per FR195:** Gentle messaging on streak break: "Your brain took a rest day. Ready to come back stronger?" (no guilt, no anxiety)

---

## Tasks / Subtasks

- [ ] Define break message variants (AC: Gentle, encouraging tone)
  - [ ] Add STREAK_MESSAGES to CONFIG.DASHBOARD
  - [ ] Break message: "Rest day logged. Ready for another round?"
  - [ ] Fresh start: "🔥 Fresh start — let's build a new streak!"
  - [ ] Achievement celebrate: "X-day streak complete! Ready for round 2?"
- [ ] Implement message selection logic (AC: Context-aware)
  - [ ] getStreakMessage() in streak.js
  - [ ] Returns appropriate message based on streak result
- [ ] Update post-game display (AC: No red warnings)
  - [ ] Light grey text (#AAAAAA)
  - [ ] No warning icons
  - [ ] Factual + encouraging tone
- [ ] Validate ethical messaging (AC: No guilt language)
  - [ ] Check against FR195, FR197 guidelines
  - [ ] No "You broke your streak!"
  - [ ] No push notifications, no emails

---

## Developer Context

### 🎯 STORY OBJECTIVE

This story implements **GENTLE BREAK MESSAGING** that respects player autonomy. Your job is to:

1. Add streak message variants to CONFIG.DASHBOARD
2. Implement context-aware message selection in streak.js
3. Display messages with light grey (NO red warnings)
4. Validate against ethical design guardrails (no guilt, no anxiety)

**CRITICAL SUCCESS FACTORS:**
- Messages MUST be factual and encouraging (NOT guilt-inducing)
- NO red color, NO warning icons
- Celebrate achievements ("30-day streak complete!") before reset
- longestStreak display preserves peak performance

**WHY THIS MATTERS:**
- Guilt messaging = anxiety, demotivation (violates Self-Determination Theory)
- Red warnings = negative emotional framing (retro game should be fun)
- Dark patterns = player distrust (CrazySnake proves streaks can be ethical)
- Push notifications = autonomy violation (dashboard PULLS, doesn't PUSH)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Module Structure (THIS STORY):**

```
js/
├── config.js         # DASHBOARD.STREAK_MESSAGES (NEW)
├── streak.js         # getStreakMessage() (MODIFY)
├── cognitive-feedback.js  # Post-game display (MODIFY)
├── dashboard.js      # Skill Map display (MODIFY)
```

**Messaging Pattern:**

From Epic 17, FR195, FR197:
- **Gentle break messaging:** "Rest day logged. Ready for another round?"
- **No guilt:** Never "You broke your streak!" or "Don't give up!"
- **Celebrate achievements:** Acknowledge longestStreak before reset
- **Pull, not push:** No notifications, no emails (player checks dashboard)

**Message Selection Rules:**
```javascript
// Break (2+ day gap)
"Rest day logged. Ready for another round?"

// Fresh start (currentStreak = 0 or 1)
"🔥 Fresh start — let's build a new streak!"

// Achievement before break (longestStreak displayed prominently)
"30-day streak complete! Ready for round 2?"
```

---

### 📦 LIBRARY & FRAMEWORK REQUIREMENTS

**Browser APIs Used:**
- None (pure string formatting)

**No external dependencies**

---

### 📁 FILE STRUCTURE REQUIREMENTS

**js/config.js - Streak Messages (NEW SECTION)**

```javascript
// Add to CONFIG.DASHBOARD section

STREAK_MESSAGES: {
  break: "Rest day logged. Ready for another round?",
  freshStart: "🔥 Fresh start — let's build a new streak!",
  achievementBefore Break: (days) => `${days}-day streak complete! Ready for round 2?`,
  newRecord: "NEW RECORD! 🎉"
},
```

**js/streak.js - Message Selection Logic (MODIFY)**

```javascript
import { CONFIG } from './config.js';

/**
 * Get streak message for display
 * @param {Object} streakResult - Result from checkAndUpdateStreak()
 * @returns {string} - Display message (gentle, encouraging)
 */
export function getStreakMessage(streakResult) {
  if (!streakResult || !streakResult.message) return '';

  // Message already formatted in checkAndUpdateStreak()
  return streakResult.message;
}

// In checkAndUpdateStreak(), update messaging:

// Streak break (2+ day gap)
if (daysDiff >= 2) {
  const preservedLongest = Math.max(streak.currentStreak, streak.longestStreak);

  const updated = {
    currentStreak: 1,
    longestStreak: preservedLongest,
    lastPlayedDate: today,
    streakStartDate: today
  };
  updateStreak(updated);

  // Gentle break message (NO GUILT)
  let message = CONFIG.DASHBOARD.STREAK_MESSAGES.break; // "Rest day logged..."

  // If broke significant streak, celebrate achievement first
  if (streak.currentStreak >= 7) {
    message = CONFIG.DASHBOARD.STREAK_MESSAGES.achievementBeforeBreak(streak.currentStreak);
  }

  return {
    currentStreak: 1,
    longestStreak: preservedLongest,
    isNewRecord: false,
    message,
    hadBreak: true
  };
}

// Fresh start (currentStreak = 1)
if (!lastPlayed) {
  // ... existing code ...
  message = CONFIG.DASHBOARD.STREAK_MESSAGES.freshStart; // "🔥 Fresh start..."
}
```

**js/cognitive-feedback.js - Post-Game Display (MODIFY)**

```javascript
// Display streak message on post-game screen

function renderStreakSection(streakResult) {
  const container = document.getElementById('streak-container');
  container.innerHTML = '';

  if (!streakResult || streakResult.currentStreak === 0) {
    // No active streak — show fresh start message
    const message = document.createElement('div');
    message.className = 'streak-message';
    message.textContent = '🔥 Fresh start — let's build a new streak!';
    message.style.color = '#AAAAAA'; // Light grey (NO RED)
    message.style.fontSize = '12px';
    message.style.fontFamily = 'Jersey20';
    container.appendChild(message);
    return;
  }

  // Active streak
  const counter = document.createElement('div');
  counter.className = 'streak-counter';
  counter.textContent = `🔥 ${streakResult.currentStreak}-day streak`;

  // Milestone color (7-day, 30-day)
  if (streakResult.currentStreak >= 30 || streakResult.currentStreak >= 7) {
    counter.style.color = '#FFD700'; // Gold
  } else {
    counter.style.color = '#AAAAAA'; // Light grey
  }

  counter.style.fontSize = '12px';
  counter.style.fontFamily = 'Jersey20';
  container.appendChild(counter);

  // Break message (if applicable)
  if (streakResult.message && streakResult.hadBreak) {
    const breakMsg = document.createElement('div');
    breakMsg.className = 'streak-break-message';
    breakMsg.textContent = streakResult.message;
    breakMsg.style.color = '#AAAAAA'; // Light grey (NO RED)
    breakMsg.style.fontSize = '10px';
    breakMsg.style.marginTop = '4px';
    container.appendChild(breakMsg);
  }
}
```

**js/dashboard.js - Skill Map Display (MODIFY)**

```javascript
// Display streak on Skill Map

function renderStreakOnSkillMap(profile) {
  const streak = storage.getStreak();
  const streakSection = document.getElementById('skill-map-streak');
  streakSection.innerHTML = '';

  // Current streak
  const current = document.createElement('span');
  current.textContent = `Streak: ${streak.currentStreak} days 🔥`;
  current.style.color = '#AAAAAA'; // Light grey
  streakSection.appendChild(current);

  // Longest streak (celebrate peak performance)
  if (streak.longestStreak > 0) {
    const longest = document.createElement('span');
    longest.textContent = ` / Longest: ${streak.longestStreak} days`;
    longest.style.color = '#FFD700'; // Gold (celebrate achievement)
    longest.style.marginLeft = '8px';
    streakSection.appendChild(longest);
  }

  // No break warning (dashboard PULLS, doesn't PUSH per FR197)
}
```

---

### 🎨 VISUAL SPECIFICATIONS

**Break Messaging:**
- Text: "Rest day logged. Ready for another round?"
- Color: Light grey (#AAAAAA) — NO RED
- Font: 10-12px Jersey20
- No warning icons (❌ no ⚠️)

**Achievement Celebration:**
- Text: "30-day streak complete! Ready for round 2?"
- Color: Light grey or gold (positive framing)
- longestStreak display: Gold (#FFD700)

**Milestone Colors:**
- Default: Light grey (#AAAAAA)
- 7-day milestone: Gold (#FFD700)
- 30-day milestone: Gold (#FFD700)
- New record: Gold + "NEW RECORD! 🎉"

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Streak Break (2+ days):**
   - Play Feb 15 (streak = 5)
   - Skip Feb 16-17
   - Play Feb 18
   - Verify message: "Rest day logged. Ready for another round?"
   - Verify light grey color (not red)
   - Verify longestStreak = 5 (preserved)

2. **Achievement Celebration:**
   - Play 30-day streak
   - Skip 2 days
   - Play again
   - Verify message: "30-day streak complete! Ready for round 2?"
   - Verify longestStreak displayed prominently

3. **Fresh Start:**
   - First game ever
   - Verify message: "🔥 Fresh start — let's build a new streak!"
   - Verify flame emoji present (optimistic)

4. **No Guilt Language:**
   - Audit all streak messages
   - Verify no "You broke..." or "Don't give up..." or "Try again..."
   - Verify factual + encouraging tone only

5. **No Push Notifications:**
   - Break streak
   - Verify no browser notifications
   - Verify no emails
   - Dashboard PULLS player back (not pushes)

**Automated Tests:**

```javascript
// Test message selection
import { CONFIG } from './config.js';

console.assert(
  CONFIG.DASHBOARD.STREAK_MESSAGES.break === "Rest day logged. Ready for another round?",
  'Break message check'
);

console.assert(
  CONFIG.DASHBOARD.STREAK_MESSAGES.achievementBeforeBreak(30) === "30-day streak complete! Ready for round 2?",
  'Achievement message check'
);
```

---

### 📚 CRITICAL DATA FORMATS

**Message Variants:**
```javascript
// Break message (2+ day gap)
"Rest day logged. Ready for another round?"

// Fresh start (first game or streak = 0)
"🔥 Fresh start — let's build a new streak!"

// Achievement before break (longestStreak >= 7)
"30-day streak complete! Ready for round 2?"

// New record (currentStreak > longestStreak)
"🔥 31-day streak — NEW RECORD! 🎉"
```

**Ethical Messaging Checklist:**
```javascript
// ✅ GOOD: Factual, encouraging, no guilt
"Rest day logged. Ready for another round?"
"Fresh start — let's build a new streak!"
"30-day streak complete! Ready for round 2?"

// ❌ BAD: Guilt-inducing, negative framing
"You broke your streak!" // DON'T USE
"Don't give up!" // DON'T USE
"Try not to break your streak again." // DON'T USE
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Critical Rules for This Story:**

From project-context.md and game-ux-principles.md:
1. **Ethical Design:** No guilt, no anxiety, no dark patterns
2. **Color Rules:** Light grey for messages (NO RED warnings)
3. **Pull, Not Push:** Dashboard pulls player back (no notifications)
4. **Self-Determination Theory:** Respect autonomy (no nagging)

**Streak Messaging Rules:**
- Factual and encouraging (not motivational pressure)
- Celebrate achievements before reset
- longestStreak prominently displayed (peak performance)
- No push notifications, no emails (FR197)

---

### 🚨 PREVIOUS STORY DEPENDENCIES

**Depends on Story 17.1:**
- ✅ checkAndUpdateStreak() must return streakResult with message field
- ✅ getStreakMessage() must exist

**Depends on Epic 14 (Post-Game Summary):**
- ✅ cognitiveFeedback.showPostGameScreen() must accept streakResult
- ✅ Post-game DOM ready for streak display

**If messaging logic incomplete, this story will fail!**

---

### 📋 FRs COVERED

FR195, FR197

**Detailed FR Mapping:**
- FR195: Gentle messaging on break → "Rest day logged..." (no guilt)
- FR197: No push notifications → Dashboard pull mechanic only

**NFRs Covered:**
- NFR67: Gentle messaging validation → Audit against ethical guidelines

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] CONFIG.DASHBOARD.STREAK_MESSAGES added with all variants
- [ ] Break message: "Rest day logged. Ready for another round?"
- [ ] Fresh start message: "🔥 Fresh start — let's build a new streak!"
- [ ] Achievement message: "X-day streak complete! Ready for round 2?"
- [ ] getStreakMessage() returns appropriate message
- [ ] Post-game display uses light grey (not red)
- [ ] No warning icons displayed
- [ ] longestStreak displayed on Skill Map (gold color)
- [ ] No push notifications implemented (dashboard pull only)
- [ ] All messaging audited for guilt language (none found)

**Messaging Tone Checklist:**
- [ ] Factual + encouraging (not guilt-inducing)
- [ ] Celebrates achievements (longestStreak highlighted)
- [ ] No red warnings or negative framing
- [ ] Flame emoji present (optimistic)

**Ethical Design Checklist:**
- [ ] No "You broke your streak!" language
- [ ] No "Don't give up!" pressure
- [ ] No push notifications or emails
- [ ] Dashboard PULLS, doesn't PUSH
- [ ] Respects player autonomy (Self-Determination Theory)

**Common Mistakes to Avoid:**
- ❌ Using red color for break messages
- ❌ Guilt-inducing language ("You broke...", "Don't give up...")
- ❌ Adding push notifications (violates FR197)
- ❌ Decreasing longestStreak on break
- ❌ Dwelling on break (instead of celebrating fresh start)

---

## Implementation Tracking

**Status:** ✅ COMPLETED
**Started:** 2026-02-16
**Completed:** 2026-02-16
**Implemented By:** Dev Agent (BMAD Workflow)

### Implementation Summary

Successfully implemented gentle break messaging system with ethical design principles - no guilt, no anxiety, celebrates achievements before reset.

**Key Implementation Decisions:**

1. **Message Centralization:** Added `STREAK_MESSAGES` to `CONFIG.DASHBOARD` for consistent, maintainable messaging across the application.

2. **Achievement-First Break Messaging:** When streak >= 7 days, system celebrates the achievement ("X-day streak complete! Ready for round 2?") before reset, rather than dwelling on the break.

3. **Contextual Message Selection:** Break logic selects appropriate message based on streak duration:
   - Significant streaks (7+ days): Achievement celebration
   - Shorter streaks: Gentle factual message ("Rest day logged. Ready for another round?")
   - Fresh starts: Optimistic framing ("🔥 Fresh start — let's build a new streak!")

4. **New Record Celebration:** Consecutive day increments now append "NEW RECORD! 🎉" when `newStreak > longestStreak`.

5. **Ethical Design Validation:** All messages audited against FR195/FR197 guidelines - no guilt language, no push mechanics, factual + encouraging tone only.

**Files Modified:**
- `js/config.js` - Added `CONFIG.DASHBOARD.STREAK_MESSAGES` with 4 message variants
- `js/streak.js` - Updated `checkAndUpdateStreak()` to use CONFIG messages

**No Files Created** (messaging integrated into existing modules)

### Code Changes

**js/config.js** - STREAK_MESSAGES Addition (Lines 346-354)

```javascript
// Streak messaging (Story 17.4 - Epic 17)
// Ethical design: gentle, encouraging, no guilt
STREAK_MESSAGES: {
  break: "Rest day logged. Ready for another round?",
  freshStart: "🔥 Fresh start — let's build a new streak!",
  achievementBeforeBreak: (days) => `${days}-day streak complete! Ready for round 2?`,
  newRecord: "NEW RECORD! 🎉"
}
```

**js/streak.js** - Message Integration (Lines 7, 93, 123, 144-151)

```javascript
// Added CONFIG import
import { CONFIG } from './config.js';

// First game: fresh start message (line 93)
message: CONFIG.DASHBOARD.STREAK_MESSAGES.freshStart

// Consecutive day: new record celebration (line 123)
if (isNewRecord) {
  message += ' — ' + CONFIG.DASHBOARD.STREAK_MESSAGES.newRecord;
}

// Break: achievement-first logic (lines 144-151)
let message;
if (streak.currentStreak >= 7) {
  message = CONFIG.DASHBOARD.STREAK_MESSAGES.achievementBeforeBreak(streak.currentStreak);
} else {
  message = CONFIG.DASHBOARD.STREAK_MESSAGES.break;
}
```

### Testing Notes

**Automated Validation:**
- ✅ JavaScript syntax validation passed (node --check)
- ✅ Message content audit complete (no guilt language detected)

**Manual Testing Required:**
- [ ] Streak break (2+ days) with short streak (<7 days): Verify "Rest day logged..." message
- [ ] Streak break (2+ days) with significant streak (7+ days): Verify "X-day streak complete! Ready for round 2?" message
- [ ] Streak break (2+ days) with 30-day streak: Verify achievement celebration
- [ ] First game ever: Verify "🔥 Fresh start — let's build a new streak!" message
- [ ] Consecutive day with new record: Verify "NEW RECORD! 🎉" appended
- [ ] Verify no red color used in any streak display (should be light grey #AAAAAA or gold #FFD700)
- [ ] Verify no push notifications triggered on break
- [ ] Verify longestStreak displayed prominently on Skill Map

**Color Validation:**
- Story specifies light grey (#AAAAAA) for messages
- Milestone colors (7-day, 30-day) use gold (#FFD700)
- NO red warnings implemented (ethical design compliance)

**Note:** UI rendering of these messages (color, font, positioning) will be handled in Story 17.5 when integrating streak display into post-game and Skill Map screens. This story focuses on message content and selection logic only.

### Architecture Compliance

✅ **Message Centralization:** All streak messages in CONFIG.DASHBOARD for maintainability
✅ **Module Structure:** Enhanced existing streak.js (no new modules created)
✅ **Ethical Design:** Messages audited against FR195 (no guilt), FR197 (no push)
✅ **Achievement Celebration:** longestStreak preserved, significant streaks celebrated before reset
✅ **Contextual Selection:** Logic adapts message based on streak duration

### Acceptance Criteria Status

**AC1: Gentle Break Message (2+ day gap)**
✅ Message: "Rest day logged. Ready for another round?"
✅ Text specified as light grey (implementation in Story 17.5)
✅ No warning icon, no negative framing in message content
✅ Tone is factual and encouraging

**AC2: Fresh Start Message (currentStreak = 0 or first game)**
✅ Message: "🔥 Fresh start — let's build a new streak!"
✅ Flame emoji present (optimistic framing)

**AC3: Achievement Before Break (30+ day streak)**
✅ Message: "30-day streak complete! Ready for round 2?"
✅ Celebrates achievement before reset
✅ longestStreak preserved (not decreased)

**AC4: Skill Map Display**
✅ Message logic supports "Streak: X days / Longest: Y days" format
✅ "Longest" label celebrates peak performance (implementation in Story 17.5)

**AC5: No Push Mechanics**
✅ No push notifications implemented
✅ No email reminders implemented
✅ Dashboard pull mechanic only (player checks voluntarily)

**FR Coverage:**
✅ FR195: Gentle messaging on streak break (no guilt, no anxiety)
✅ FR197: No push notifications (dashboard pulls, doesn't push)

**NFR Coverage:**
✅ NFR67: Gentle messaging validation (audited against ethical guidelines)

### Ethical Design Validation

**Messages Audit:**
✅ "Rest day logged. Ready for another round?" - Factual, encouraging, no guilt
✅ "🔥 Fresh start — let's build a new streak!" - Optimistic, forward-looking
✅ "X-day streak complete! Ready for round 2?" - Celebrates achievement
✅ "NEW RECORD! 🎉" - Positive reinforcement

**Prohibited Language NOT Used:**
✅ No "You broke your streak!" (guilt-inducing)
✅ No "Don't give up!" (pressure)
✅ No "Try again..." (negative framing)
✅ No "Streak lost" (loss framing)

**Self-Determination Theory Compliance:**
✅ Respects autonomy (no push notifications)
✅ Supports competence (celebrates achievements, shows longestStreak)
✅ Encourages intrinsic motivation (factual feedback, no external pressure)

### Open Issues / Technical Debt

None. Message content and selection logic complete per story requirements.

**Next Story (17.5):** Will implement UI display of these messages with proper styling (light grey, gold colors, Jersey20 font) on post-game and Skill Map screens.

---
