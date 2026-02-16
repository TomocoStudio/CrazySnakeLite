# Story 13.9: Implement Storage Persistence and Retrieval

**Epic:** 13 - Cognitive Metrics Data Engine

**As a** player,
**I want** my cognitive data to persist across browser sessions,
**So that** my progress is never lost.

---

## Acceptance Criteria

**Given** a game session completes
**When** metrics are calculated
**Then** save session object to IndexedDB "sessions" object store
**And** operation completes within 200ms (per NFR55)
**And** no gameplay interruption occurs during save

**Given** player reopens the game
**When** Skill Map is accessed
**Then** query IndexedDB for all sessions (or last 100 for performance)
**And** retrieve sessions in < 500ms (per NFR52)
**And** calculate current rolling averages for all 6 metrics

**Given** IndexedDB storage exceeds 4.5MB (approaching 5MB limit)
**When** new session is stored
**Then** delete oldest sessions beyond 100 total
**And** maintain chronological order via timestamp index

**Given** browser is in private browsing mode
**When** IndexedDB write fails
**Then** catch error gracefully
**And** display "Private browsing: metrics not saved" in Skill Map
**And** current session metrics still available until page refresh

**Per NFR56-NFR58:** localStorage/IndexedDB stores minimum 100 sessions, < 5MB total, persists across restarts

---

## Development

### Files to Create/Modify

- **`js/storage.js`** - Already implemented in Story 13.1, add profile methods
- **`js/game.js`** - Call storage methods in `onDeath()` lifecycle
- **`test/storage.test.js`** - Unit tests for persistence and retrieval

### API Surface

```javascript
// storage.js (Story 13.1 + 13.9 combined)

// Session operations (Story 13.1)
export async function initStorage(): Promise<IDBDatabase|null>
export async function saveSession(sessionData): Promise<boolean>
export async function getSessions(limit = 10): Promise<Array>

// Profile operations (Story 13.9)
export function getProfile(): Object
export function updateProfile(profileData): void

// Profile schema
{
  calibrationComplete: boolean,
  sessionsCompleted: number,
  lastPlayedDate: string,  // YYYY-MM-DD
  rollingAverages: {
    reactionTime: number | null,
    spatialAwareness: number | null,
    cognitiveFlexibility: number | null,
    dividedAttention: number | null,
    impulseControl: number | null,
    workingMemory: number | null
  }
}
```

### Integration Points

- **`main.js`** - Initialize storage on app load:
  ```javascript
  await initStorage();
  ```

- **`game.js`** - Save session and update profile on death:
  ```javascript
  async function onDeath() {
    const sessionRecord = buildSessionRecord(gameState);
    const saved = await saveSession(sessionRecord);

    if (saved) {
      const sessions = await getSessions(10);
      const rollingAvgs = metrics.calculateRollingAverages(sessions);

      updateProfile({
        sessionsCompleted: sessions.length,
        lastPlayedDate: getTodayDateString(),
        rollingAverages: rollingAvgs
      });
    }
  }
  ```

- **`dashboard.js`** - Read profile for Skill Map display:
  ```javascript
  const profile = getProfile();
  const { rollingAverages, calibrationComplete } = profile;
  ```

### Test Strategy

**Unit Tests (`storage.test.js`):**
1. **Save and retrieve:** Save session → getSessions(10) → verify returned
2. **Chronological order:** Save 3 sessions → verify newest first
3. **Limit enforcement:** Save 15 sessions → getSessions(10) → verify only 10 returned
4. **Pruning:** Save 105 sessions → verify only 100 stored (NFR57)
5. **Profile persistence:** updateProfile → reload page → verify data persists
6. **Profile merge:** updateProfile partial → verify existing fields preserved
7. **IndexedDB unavailable:** Private browsing → verify graceful degradation
8. **Performance:** saveSession < 200ms, getSessions < 500ms (NFR55, NFR52)

**Manual Testing:**
1. Play game → DevTools → Application → IndexedDB → verify session saved
2. Play 10 games → Skill Map → verify rolling averages calculated
3. Close browser → reopen → verify profile persists
4. Private browsing → play game → verify no errors, game playable
5. DevTools → Network → verify zero server requests (NFR59)

### Dependencies

- **Story 13.1** - IndexedDB schema (already implemented)
- **Story 13.8** - Rolling average calculation

### Implementation Notes

1. **Async/await pattern** - All IndexedDB ops are async, localStorage is sync
2. **Performance targets** - saveSession < 200ms, getSessions < 500ms
3. **Non-blocking** - Don't block game restart while saving
4. **Graceful degradation** - IndexedDB unavailable → game still playable, no errors
5. **Profile in localStorage** - Small data, fast sync access for dashboard
6. **Sessions in IndexedDB** - Large data, async access, 100+ sessions
7. **Zero network** - All storage is local-only (NFR59, NFR60)
8. **Auto-pruning** - Delete oldest sessions when > 100 to stay under 5MB
9. **Date format** - Use `YYYY-MM-DD` strings for `lastPlayedDate` (timezone-aware)
10. **Call from game loop** - `onDeath()` is the natural integration point
