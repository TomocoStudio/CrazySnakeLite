# Story 13.1: Define Metrics Data Model and Storage Schema

**Epic:** 13 - Cognitive Metrics Data Engine

**As a** developer,
**I want** to define the cognitive metrics data model and IndexedDB schema,
**So that** all session data is structured, queryable, and efficient for 100+ sessions.

---

## Acceptance Criteria

**Given** the game initializes
**When** storage.js loads
**Then** IndexedDB database "CrazySnakeMetrics" is created with version 1
**And** object store "sessions" exists with keyPath "sessionId"
**And** index "timestamp" exists on sessions.timestamp for chronological queries
**And** index "score" exists on sessions.score for performance queries

**Given** a game session completes
**When** session data is stored
**Then** the session object contains:
```javascript
{
  sessionId: string,           // UUID
  timestamp: number,           // Date.now()
  score: number,               // Final score
  metrics: {
    reactionTime: number,      // Rolling avg input response time (ms)
    spatialAwareness: number,  // Snake length / grid coverage ratio
    cognitiveFlexibility: number, // RC score rate / normal score rate
    dividedAttention: number,  // Phone survival rate + decision speed composite
    impulseControl: number,    // Weighted Pick Up vs End ratio by context
    workingMemory: number      // Combo score rate / normal score rate
  },
  rawEvents: [                 // Array of gameplay events for metric calculation
    { type: 'food_eaten', timestamp, foodType, scoreGained },
    { type: 'phone_call', timestamp, decision, bonus },
    { type: 'rc_start', timestamp },
    { type: 'rc_end', timestamp, survived },
    { type: 'combo_start', timestamp },
    { type: 'combo_end', timestamp, multiplier },
    ...
  ]
}
```
**And** total storage footprint < 50KB per session (target < 5MB for 100 sessions per NFR57)

**Given** IndexedDB is unavailable (private browsing mode)
**When** storage initialization fails
**Then** graceful degradation: metrics still calculated but not persisted
**And** dashboard features show "local storage required" message
**And** game remains fully playable

---

## Development

### Files to Create/Modify

- **`js/storage.js`** - Extend existing file with IndexedDB schema initialization
- **`test/storage.test.js`** - Unit tests for storage operations

### API Surface

```javascript
// storage.js (NEW exports for V3)

// IndexedDB initialization
export async function initStorage(): Promise<IDBDatabase|null>

// Session persistence
export async function saveSession(sessionData: Object): Promise<boolean>
export async function getSessions(limit: number = 10): Promise<Array<Object>>

// Schema: CrazySnakeMetrics DB, version 1
// Object Store: "sessions" with keyPath "sessionId"
// Indexes: "timestamp" (chronological), "score" (performance queries)
```

### Session Record Schema

```javascript
{
  sessionId: string,           // UUID v4
  timestamp: number,           // Date.now()
  score: number,               // Final score
  metrics: {
    reactionTime: number | null,
    spatialAwareness: number | null,
    cognitiveFlexibility: number | null,
    dividedAttention: number | null,
    impulseControl: number | null,
    workingMemory: number | null
  },
  rawEvents: [
    { type: 'food_eaten', timestamp, foodType, scoreGained },
    { type: 'phone_call', timestamp, decision, bonus, survived },
    { type: 'rc_start', timestamp },
    { type: 'rc_end', timestamp, survived },
    { type: 'combo_start', timestamp },
    { type: 'combo_end', timestamp, multiplier }
  ]
}
```

### Integration Points

- **`main.js`** - Call `initStorage()` on app initialization
- **`game.js`** - Will call `saveSession()` in `onDeath()` lifecycle
- **Future stories** - `metrics.js` will read via `getSessions()`

### Test Strategy

**Unit Tests (`storage.test.js`):**
1. Test `initStorage()` creates database with correct schema
2. Test `saveSession()` stores session with all fields
3. Test `getSessions(10)` returns newest sessions first
4. Test pruning beyond 100 sessions (NFR57)
5. Test graceful degradation when IndexedDB unavailable
6. Test storage footprint < 50KB per session

**Manual Testing:**
- Open DevTools → Application → IndexedDB → verify "CrazySnakeMetrics" exists
- Play game → check session saved with correct timestamp/score
- Test in private browsing → verify no errors, game playable

### Dependencies

**NONE** - This is the foundation story. Implement first.

### Implementation Notes

1. **Use existing storage.js structure** - Already has `initStorage()` scaffold
2. **Async/await pattern** - All IndexedDB operations return Promises
3. **Graceful degradation** - Return `null` on failure, never throw
4. **Auto-pruning** - Delete oldest sessions when count > 100
5. **Module boundaries** - Only storage.js touches IndexedDB directly
6. **Session ID generation** - Use `crypto.randomUUID()` for sessionId
7. **Null metrics** - Use `null` for absent metrics, NOT 0 (per architecture Pattern 7)
