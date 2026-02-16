# Story 13.10: Create metrics.js Module with Event Capture

**Epic:** 13 - Cognitive Metrics Data Engine

**As a** developer,
**I want** a centralized metrics.js module that captures gameplay events,
**So that** all cognitive calculations happen in one testable module.

---

## Acceptance Criteria

**Given** the game initializes
**When** metrics.js loads
**Then** expose public API:
```javascript
metrics.startSession(sessionId)
metrics.recordEvent({ type, timestamp, ...data })
metrics.endSession(finalScore) → returns calculated metrics object
metrics.getSessionHistory(limit) → returns array of past sessions
metrics.getRollingAverages() → returns current rolling averages for 6 metrics
```

**Given** gameplay events occur (food eaten, phone call, RC, combo)
**When** game.js fires events
**Then** metrics.recordEvent() appends to rawEvents array
**And** no performance impact (< 1ms per event)
**And** events queued in memory until session ends

**Given** session ends (game over)
**When** metrics.endSession() is called
**Then** calculate all 6 metrics from rawEvents array
**And** save session to IndexedDB via storage.js
**And** clear in-memory rawEvents buffer
**And** return metrics object for immediate use (post-game highlights)

**Given** metrics.js unit tests run
**When** deterministic rawEvents are provided
**Then** calculated metrics match expected values within ±1% (per NFR45)
**And** identical input produces identical output (deterministic formulas)

**Per NFR43-NFR44:** Dashboard metric calculations unit testable in isolation, cognitive data engine separable from UI rendering
