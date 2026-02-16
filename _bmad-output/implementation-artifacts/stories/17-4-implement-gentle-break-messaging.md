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
