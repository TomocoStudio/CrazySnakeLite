# Epic 17: Streak System

**Status:** 🔴 NOT STARTED
**Created:** 2026-02-15
**Completed:** —

---

## Overview

Implement a gentle, ethical daily streak system that tracks consecutive days of play, motivates habit formation, and respects player autonomy without creating anxiety. Streak increments on first game completion per calendar day (local timezone), displays on post-game screen (Epic 14) and Skill Map (Epic 16), persists in localStorage, and shows encouraging (never guilt-inducing) messaging on streak breaks. No push notifications, no red warnings, no shame — just facts: "Rest day logged. Ready for another round?" The streak is a **pull mechanic** (player checks dashboard) not a **push mechanic** (game nags player). This aligns with Self-Determination Theory (autonomy) and ethical design guardrails from game-ux-principles.md.

**FRs covered:** FR190-FR198 (Daily streak tracking, calendar day logic, localStorage persistence, gentle break messaging, no notifications, dashboard pulls not pushes)

**NFRs covered:** NFR50 (accurate across timezone/DST), NFR67 (gentle messaging validation)

**Value:** Retention mechanic without dark patterns. Builds daily habit. Provides social proof ("12-day streak" is shareable). Respects player well-being — missing a day is reframed as "rest day," not failure. Duolingo proved streaks drive engagement; CrazySnake proves they can be ethical.

**Dependencies:** Requires Epic 13 (storage.js for persistence), Epic 14 (post-game display), Epic 16 (Skill Map display)

---

## Stories

### Story 17.1: Implement Daily Streak Tracking Logic

**As a** player,
**I want** my streak to track consecutive days I play,
**So that** I can see my habit consistency over time.

**Acceptance Criteria:**

**Given** game initializes for first-ever player
**When** storage.js loads
**Then** initialize streak state in localStorage:
```javascript
{
  currentStreak: 0,
  longestStreak: 0,
  lastPlayedDate: null,  // ISO date string: "2026-02-15"
  streakStartDate: null
}
```

**Given** player completes first game of the day
**When** game-over triggers
**Then** check lastPlayedDate vs. today's date (local timezone)
**And** if dates differ, evaluate streak continuation

**Given** lastPlayedDate is yesterday (consecutive day)
**When** session completes
**Then** increment currentStreak by 1
**And** update lastPlayedDate to today
**And** save to localStorage immediately

**Given** lastPlayedDate is today (already played today)
**When** subsequent games complete
**Then** do NOT increment streak (only first game counts per day per FR193)
**And** lastPlayedDate remains unchanged

**Given** lastPlayedDate is 2+ days ago (gap detected)
**When** session completes
**Then** reset currentStreak to 1 (new streak starts)
**And** update lastPlayedDate to today
**And** save previous currentStreak to longestStreak if higher

**Per FR190-FR191:** Streak tracks consecutive calendar days with at least one completed game, increments on first game per day

---

### Story 17.2: Add Calendar Day Detection (Local Timezone)

**As a** player,
**I want** streaks to recognize calendar days in my local timezone,
**So that** playing at 11:59 PM and 12:01 AM counts as 2 consecutive days.

**Acceptance Criteria:**

**Given** player's browser is in EST timezone (UTC-5)
**When** game session completes at 11:50 PM EST on Feb 15
**Then** lastPlayedDate = "2026-02-15"
**And** streak increments for Feb 15

**Given** player continues playing past midnight
**When** next game session completes at 12:10 AM EST on Feb 16
**Then** detect date change: lastPlayedDate "2026-02-15" ≠ today "2026-02-16"
**And** increment streak (consecutive day)
**And** update lastPlayedDate = "2026-02-16"

**Given** player's system changes timezone (travel from EST to PST)
**When** game session completes
**Then** use current local timezone for calendar day calculation
**And** streak logic remains consistent with new timezone

**Given** Daylight Saving Time transition occurs (e.g., spring forward)
**When** session completes on DST transition day
**Then** calendar day logic uses Date object's local date (DST-aware)
**And** streak continues correctly (per NFR50 - accurate across DST transitions)

**Given** player completes game at 11:59 PM, then another at 12:01 AM
**When** checking streak continuation
**Then** treat as 2 consecutive days (date changed)
**And** increment streak from 5 → 6

**Per FR191:** Streak increments on first game completion per calendar day (local timezone)

---

### Story 17.3: Create Streak Persistence in Storage

**As a** player,
**I want** my streak to persist across browser sessions,
**So that** I don't lose my progress when I close the browser.

**Acceptance Criteria:**

**Given** player achieves 12-day streak
**When** browser is closed
**Then** localStorage persists:
```javascript
{
  currentStreak: 12,
  longestStreak: 12,
  lastPlayedDate: "2026-02-15",
  streakStartDate: "2026-02-04"
}
```

**Given** player reopens browser next day (Feb 16)
**When** first game completes
**Then** retrieve lastPlayedDate from localStorage
**And** compare to today: "2026-02-15" vs "2026-02-16" (1 day gap, consecutive)
**And** increment currentStreak to 13
**And** save updated state

**Given** player reopens browser 3 days later (Feb 19)
**When** first game completes
**Then** detect gap: lastPlayedDate "2026-02-15" vs today "2026-02-19" (3-day gap)
**And** reset currentStreak to 1
**And** save longestStreak = 12 (previous peak)

**Given** localStorage is unavailable (private browsing)
**When** game initializes
**Then** use sessionStorage as fallback (lasts for tab session)
**And** display warning: "Private browsing: streak not saved across sessions"

**Given** player clears browser data (localStorage wiped)
**When** game reinitializes
**Then** streak state resets to defaults (currentStreak: 0)
**And** player starts fresh streak

**Per FR196:** Streak data stored locally alongside cognitive metrics (localStorage/IndexedDB)

---

### Story 17.4: Implement Gentle Break Messaging

**As a** player who missed a day,
**I want** to see encouraging messaging, not guilt,
**So that** I feel motivated to return without anxiety.

**Acceptance Criteria:**

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

### Story 17.5: Display Streak on Post-Game and Skill Map

**As a** player,
**I want** to see my current streak in both post-game summary and Skill Map,
**So that** I'm reminded of my consistency without it being intrusive.

**Acceptance Criteria:**

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

### Story 17.6: Implement Streak Reset and New Streak Start

**As a** player who breaks a streak,
**I want** to easily start a new streak,
**So that** I can rebuild my habit without penalty.

**Acceptance Criteria:**

**Given** player breaks streak (gap detected)
**When** next game completes
**Then** reset currentStreak to 1 (new streak starts per FR198)
**And** update streakStartDate to today
**And** preserve longestStreak (never decreases)

**Given** currentStreak resets to 1
**When** post-game summary displays
**Then** show:
```
🔥 1-day streak — keep it going!
```
**And** optimistic framing (celebrate restart, not dwell on break)

**Given** player achieves new streak after break
**When** currentStreak reaches 5 days
**Then** display normally (no reference to previous break)
**And** show: "🔥 5-day streak"

**Given** player's new streak surpasses previous longestStreak
**When** currentStreak = 31 (previous longest was 30)
**Then** update longestStreak = 31
**And** celebrate: "🔥 31-day streak — NEW RECORD! 🎉"

**Given** player has multiple streak cycles (break → rebuild → break → rebuild)
**When** Skill Map displays longestStreak
**Then** show all-time highest streak achieved
**And** celebrate peak performance regardless of current status

**Per FR198:** Streak resets to 0 on break, new streak starts on next game

---

### Story 17.7: Test Streak Edge Cases and Timezone Handling

**As a** developer,
**I want** comprehensive tests for streak logic edge cases,
**So that** streaks are calculated accurately across all scenarios.

**Acceptance Criteria:**

**Given** player completes 3 games in one day
**When** streak logic runs
**Then** only first game increments streak (games 2-3 ignored per FR193)
**And** lastPlayedDate remains unchanged after games 2-3

**Given** player plays at 11:58 PM, then 12:02 AM (crosses midnight)
**When** second session completes
**Then** detect new calendar day
**And** increment streak (consecutive days)

**Given** player's system clock is manually changed backward 1 day
**When** session completes
**Then** use system's current date (no tampering detection)
**And** calculate streak based on system date (player could "cheat" but unlikely)

**Given** player travels across timezones (EST → PST, 3-hour difference)
**When** session completes in new timezone
**Then** use new local timezone for calendar day calculation
**And** streak continues if calendar dates are consecutive in new timezone

**Given** Daylight Saving Time "spring forward" occurs (2 AM → 3 AM)
**When** player plays at 1:50 AM, then 3:10 AM (same night, different dates)
**Then** calendar day unchanged (still same date despite clock jump)
**And** streak does NOT increment (same day)

**Given** Daylight Saving Time "fall back" occurs (2 AM → 1 AM)
**When** player plays at 1:50 AM first occurrence, then 1:10 AM second occurrence
**Then** calendar day unchanged (Date object handles DST automatically)
**And** streak logic remains consistent

**Per NFR50:** Streak tracking accurate across browser timezone changes and daylight saving time transitions

---
