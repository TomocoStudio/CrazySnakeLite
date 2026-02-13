# Story 12.9: Implement Session ID Generation and Persistence

**Epic:** 12 - Cognitive Analytics System
**Story ID:** 12.9
**Status:** 🔴 not started
**Created:** 2026-02-08

---

## Story

**As a** developer,
**I want** a unique session ID that persists across games,
**So that** I can correlate multiple games from the same player visit.

## Acceptance Criteria

**Given** I load the game for the first time
**When** getSessionId() is called
**Then** a new UUID is generated
**And** the UUID is stored in sessionStorage as 'crazysnake_session_id'

**Given** I play multiple games in the same browser session
**When** getSessionId() is called
**Then** the same UUID is returned for all games

**Given** I close the browser and return later
**When** I load the game
**Then** a NEW session ID is generated (sessionStorage cleared)

**Given** the UUID is generated
**When** checking the format
**Then** it follows UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx

## Tasks / Subtasks

- [ ] Implement getSessionId() in analytics.js
  - [ ] Check sessionStorage for 'crazysnake_session_id'
  - [ ] If exists, return stored value
  - [ ] If not exists, generate UUID v4
  - [ ] Store UUID in sessionStorage
  - [ ] Return UUID
- [ ] Implement UUID v4 generation
  - [ ] Use 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx' template
  - [ ] Replace x with random hex digit [0-9a-f]
  - [ ] Replace y with [8, 9, a, b] (UUID v4 variant bits)
  - [ ] Ensure '4' in 3rd group (version 4 indicator)
- [ ] Test getSessionId() generates UUID
  - [ ] Clear sessionStorage
  - [ ] Call getSessionId()
  - [ ] Verify UUID format
  - [ ] Check sessionStorage for 'crazysnake_session_id'
  - [ ] Verify stored UUID matches returned UUID
- [ ] Test getSessionId() persists across calls
  - [ ] Call getSessionId() → UUID1
  - [ ] Call getSessionId() again → UUID2
  - [ ] Verify UUID1 === UUID2 (same UUID)
- [ ] Test getSessionId() persists across games
  - [ ] Play 3 games in same browser session
  - [ ] Log session_id from each game's events
  - [ ] Verify all 3 games have same session_id
- [ ] Test new session on browser close
  - [ ] Play game → session_id = UUID1
  - [ ] Close browser tab
  - [ ] Reopen game → session_id = UUID2
  - [ ] Verify UUID1 !== UUID2 (new session)

---

## Developer Context

### 🎯 STORY OBJECTIVE

Implement getSessionId() helper function that generates and persists a UUID v4 session identifier. This session ID is the PRIMARY KEY for correlating all analytics events — it links multiple games, food consumption events, phone calls, and the final session_end event into a cohesive player journey. Without this, we can't answer "How many games per session?" or "Does the player return?". The session ID MUST persist across games but reset when the browser tab closes (sessionStorage behavior).

**CRITICAL SUCCESS FACTORS:**
- UUID v4 format strictly followed (important for analytics system compatibility)
- getSessionId() generates UUID only on first call
- UUID persists in sessionStorage (key: 'crazysnake_session_id')
- Same UUID returned on all subsequent calls (same browser session)
- New UUID generated when sessionStorage clears (browser close/reopen)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `js/analytics.js` — getSessionId() implementation (already implemented in Story 12.3)

**Module Dependencies:**
- `sessionStorage` → Session ID persistence

**Data Flow:**
```
1. First call to getSessionId():
   - Check sessionStorage['crazysnake_session_id']
   - Not found → Generate UUID v4
   - Store in sessionStorage
   - Return UUID

2. Subsequent calls to getSessionId():
   - Check sessionStorage['crazysnake_session_id']
   - Found → Return stored UUID

3. Browser close/reopen:
   - sessionStorage cleared
   - Next getSessionId() generates NEW UUID
```

---

### 📦 CONFIG.JS UPDATES

No config changes needed.

---

### 🎨 IMPLEMENTATION DETAILS

**1. analytics.js — getSessionId() implementation (from Story 12.3):**

Already implemented in Story 12.3. For reference:

```javascript
/**
 * Get or generate session ID (UUID v4).
 * Stored in sessionStorage, persists across games in same browser session.
 * @returns {string} UUID v4 session identifier
 */
function getSessionId() {
  const STORAGE_KEY = 'crazysnake_session_id';
  let sessionId = sessionStorage.getItem(STORAGE_KEY);

  if (!sessionId) {
    // Generate UUID v4
    sessionId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
    sessionStorage.setItem(STORAGE_KEY, sessionId);
  }

  return sessionId;
}
```

**UUID v4 Format Explanation:**

```
xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
         ↑    ↑   ↑
         |    |   └─ y = variant bits [8, 9, a, b] → (r & 0x3 | 0x8)
         |    └───── 4 = version 4 indicator (fixed)
         └────────── x = random hex [0-9a-f] → r.toString(16)
```

**Why UUID v4?**
- **Universally unique:** Collision probability < 1 in 5 billion (acceptable for our scale)
- **No server required:** Generated client-side, no API call
- **Standard format:** Compatible with all analytics systems
- **Privacy-friendly:** No user tracking, session-scoped only

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **getSessionId() Generates UUID v4:**
   - Clear sessionStorage
   - Call getSessionId()
   - Verify format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
   - Verify '4' in 3rd group (version indicator)
   - Verify first char of 4th group is [8, 9, a, b] (variant bits)

2. **UUID Stored in sessionStorage:**
   - Clear sessionStorage
   - Call getSessionId() → UUID1
   - Check sessionStorage.getItem('crazysnake_session_id')
   - Verify stored value === UUID1

3. **UUID Persists Across Calls:**
   - Call getSessionId() → UUID1
   - Call getSessionId() again → UUID2
   - Verify UUID1 === UUID2

4. **UUID Persists Across Games:**
   - Play game 1, check session_id in game_start event → UUID1
   - Play game 2, check session_id in game_start event → UUID2
   - Verify UUID1 === UUID2 (same session)

5. **New UUID on Browser Close:**
   - Play game, note session_id → UUID1
   - Close browser tab
   - Reopen game
   - Play new game, note session_id → UUID2
   - Verify UUID1 !== UUID2 (new session, new UUID)

6. **UUID Format Validation:**
   - Generate 10 UUIDs (call getSessionId() in 10 fresh sessions)
   - Verify all follow UUID v4 format
   - Verify all have '4' in 3rd group
   - Verify all have [8, 9, a, b] in 4th group first char

**Edge Cases:**
- sessionStorage disabled (getSessionId() generates new UUID each call, acceptable)
- Multiple tabs (each tab has separate sessionStorage, each gets own UUID)
- UUID collision (astronomically unlikely, < 1 in 5 billion)

---

### 📚 CRITICAL DATA FORMATS

**UUID v4 format:**
```javascript
// CORRECT (UUID v4)
'a3f8d1c2-4b5e-4d2a-9c3f-8e1d2a3b4c5f'
'12345678-90ab-4cde-8fgh-ijklmnopqrst'  // (hypothetical valid format)

// Key characteristics:
// - 8-4-4-4-12 hex digit groups
// - '4' in 3rd group (version 4)
// - [8, 9, a, b] in 4th group first char (variant 1)

// WRONG (not UUID v4)
'a3f8d1c2-4b5e-3d2a-9c3f-8e1d2a3b4c5f'  // '3' instead of '4' (version 3)
'a3f8d1c24b5e4d2a9c3f8e1d2a3b4c5f'      // No hyphens (not standard format)
```

**sessionStorage key:**
```javascript
const STORAGE_KEY = 'crazysnake_session_id';  // CORRECT
const STORAGE_KEY = 'session_id';             // WRONG (too generic, conflicts)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/analytics-requirements.md` — Session ID requirement
- `_bmad-output/planning-artifacts/cognitive-analytics-requirements.md` — Q6 (session tracking)

**Key Design Principles:**
- **Session = browser session:** sessionStorage clears on tab close
- **UUID v4 = client-side, no server:** Privacy-friendly, no tracking
- **Primary key for correlation:** Links all events from same session
- **No collision risk:** UUID v4 collision probability negligible at our scale

---

### 📋 FRs COVERED

Supports all analytics events (FR95-FR99) — session_id is required for every event

**Detailed FR Mapping:**
- FR95-FR99: All events include session_id → getSessionId() provides value

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] getSessionId() implemented in analytics.js
- [ ] UUID v4 generation implemented (correct format)
- [ ] UUID stored in sessionStorage with key 'crazysnake_session_id'
- [ ] getSessionId() checks sessionStorage first
- [ ] If UUID exists, return stored value
- [ ] If UUID not exists, generate and store new UUID
- [ ] UUID format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
- [ ] '4' in 3rd group (version 4 indicator)
- [ ] [8, 9, a, b] in 4th group first char (variant bits)
- [ ] UUID persists across multiple calls (same session)
- [ ] UUID persists across multiple games (same session)
- [ ] New UUID generated on browser close/reopen
- [ ] Manual testing checklist completed
- [ ] Edge cases tested (sessionStorage disabled, multiple tabs)

**Common Mistakes to Avoid:**
- ❌ Wrong UUID format (not v4, missing '4' in 3rd group)
- ❌ Using localStorage instead of sessionStorage (persists across browser closes)
- ❌ Not checking sessionStorage before generating (creates new UUID each call)
- ❌ Generic storage key ('session_id' instead of 'crazysnake_session_id')
- ❌ Not returning UUID after generating (function returns undefined)

---

## Dev Agent Record

### Agent Model Used

_To be filled by implementing agent_

### Debug Log References

_To be filled during implementation_

### Completion Notes List

_To be filled on completion_

### File List

- js/analytics.js (modified - getSessionId() implementation, already done in Story 12.3)
