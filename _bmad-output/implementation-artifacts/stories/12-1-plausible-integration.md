# Story 12.1: Set Up Plausible Integration

**Epic:** 12 - Cognitive Analytics System
**Story ID:** 12.1
**Status:** 🔴 not started
**Created:** 2026-02-08

---

## Story

**As a** developer,
**I want** to integrate Plausible analytics,
**So that** we can track custom events without violating user privacy.

## Acceptance Criteria

**Given** the game loads
**When** the index.html is rendered
**Then** the Plausible tracking script is loaded asynchronously:
```html
<script async src="https://plausible.io/js/pa-5lDK3arREKbPzQ_2_Jhfm.js"></script>
```
**And** the inline queue snippet initializes window.plausible:
```javascript
window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
plausible.init()
```

**Given** Plausible script fails to load
**When** the game runs
**Then** the game continues normally
**And** analytics.js calls fail silently (no errors in console)
**And** gameplay is unaffected

**Given** analytics events are fired
**When** window.plausible() is called
**Then** events are buffered in plausible.q until the script loads
**And** buffered events are sent when Plausible becomes available

**Given** CONFIG.ANALYTICS_ENABLED = false (dev mode)
**When** any analytics function is called
**Then** no events are fired
**And** tracking is disabled

## Tasks / Subtasks

- [ ] Add Plausible script to index.html <head>
  - [ ] Async script tag with Plausible URL
  - [ ] Inline queue snippet for window.plausible initialization
  - [ ] Position before any other scripts that might call analytics
- [ ] Add CONFIG.ANALYTICS_ENABLED to config.js
  - [ ] Default value: true (production)
  - [ ] Comment explaining dev mode usage
- [ ] Verify graceful degradation
  - [ ] Block Plausible script in browser (network tab)
  - [ ] Confirm game loads normally
  - [ ] Confirm no console errors
  - [ ] Confirm gameplay at 60 FPS
- [ ] Test event buffering
  - [ ] Fire analytics event before script loads
  - [ ] Verify event queued in plausible.q
  - [ ] Wait for script to load
  - [ ] Verify queued events sent
- [ ] Test ANALYTICS_ENABLED toggle
  - [ ] Set CONFIG.ANALYTICS_ENABLED = false
  - [ ] Fire analytics events
  - [ ] Verify no events sent to Plausible
  - [ ] Verify no console errors

---

## Developer Context

### 🎯 STORY OBJECTIVE

Integrate Plausible analytics as the privacy-first, cookie-free tracking foundation for the Brain Gym thesis validation. This story establishes the core tracking infrastructure with graceful degradation — the game MUST work perfectly even if Plausible is blocked, unavailable, or disabled. All subsequent analytics stories depend on this integration.

**CRITICAL SUCCESS FACTORS:**
- Plausible script loads asynchronously (non-blocking)
- Game functions normally if Plausible blocked or fails
- CONFIG.ANALYTICS_ENABLED toggle for dev mode
- No console errors if analytics unavailable
- Event buffering works (plausible.q)

---

### 🏗️ ARCHITECTURE COMPLIANCE

**Files to Modify:**
- `index.html` — Add Plausible script in <head>
- `js/config.js` — Add CONFIG.ANALYTICS_ENABLED flag

**External Dependency:**
- Plausible.io analytics service (privacy-first, GDPR-compliant, cookie-free)

**Data Flow:**
```
1. index.html loads Plausible script (async)
2. Inline snippet initializes window.plausible and plausible.q buffer
3. analytics.js calls window.plausible(event, {props})
4. If script not loaded: events queued in plausible.q
5. When script loads: buffered events sent automatically
6. If script blocked: window.plausible is no-op, game continues
```

---

### 📦 CONFIG.JS UPDATES

**Add to config.js:**

```javascript
// Analytics Configuration
export const CONFIG = {
  // ... existing config ...

  // Analytics toggle (set to false in development to disable tracking)
  ANALYTICS_ENABLED: true,
};
```

---

### 🎨 IMPLEMENTATION DETAILS

**1. index.html — Add Plausible script in <head>:**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CrazySnake Lite - Brain Gym</title>

  <!-- Plausible Analytics (privacy-first, cookie-free) -->
  <script async src="https://plausible.io/js/pa-5lDK3arREKbPzQ_2_Jhfm.js"></script>
  <script>
    window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
    plausible.init()
  </script>

  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <!-- ... rest of HTML ... -->
</body>
</html>
```

**2. config.js — Add ANALYTICS_ENABLED flag:**

```javascript
// Analytics Configuration
export const CONFIG = {
  // ... existing config values ...

  // Analytics toggle
  // Set to false in development to disable all tracking
  // Set to true in production to enable Plausible events
  ANALYTICS_ENABLED: true,
};
```

**3. Graceful Degradation Test:**

To verify graceful degradation:
1. Open browser DevTools → Network tab
2. Block `plausible.io` domain
3. Reload game
4. Verify:
   - Game loads normally
   - No console errors
   - Gameplay runs at 60 FPS
   - All features work (food, phone, effects)

---

### 🧪 TESTING REQUIREMENTS

**Manual Testing Checklist:**

1. **Plausible Script Loads:**
   - Open DevTools → Network tab
   - Load game
   - Verify `pa-5lDK3arREKbPzQ_2_Jhfm.js` loads
   - Verify script status: 200 OK
   - Verify async attribute present

2. **Event Buffering (Before Script Loads):**
   - Add `console.log(window.plausible.q)` in analytics.js
   - Fire analytics event immediately on page load
   - Verify event queued in plausible.q array
   - Wait for Plausible script to load
   - Verify queue clears (events sent)

3. **Graceful Degradation (Script Blocked):**
   - Block `plausible.io` in DevTools
   - Reload game
   - Verify no console errors
   - Verify game loads normally
   - Play for 30 seconds
   - Verify 60 FPS maintained
   - Verify all features work

4. **CONFIG.ANALYTICS_ENABLED = false:**
   - Set CONFIG.ANALYTICS_ENABLED = false in config.js
   - Reload game
   - Fire analytics events (in later stories)
   - Verify no events sent to Plausible
   - Verify no console errors

5. **window.plausible Availability:**
   - Open browser console
   - Type `window.plausible`
   - Verify function exists (even if script not loaded)
   - Call `window.plausible('test', {props: {foo: 'bar'}})`
   - Verify no errors (buffered or sent)

**Edge Cases:**
- Plausible domain blocked by ad-blocker (graceful degradation)
- Network offline when script loads (buffering works)
- Multiple events fired before script loads (all buffered)
- ANALYTICS_ENABLED toggled mid-session (respects current value)

---

### 📚 CRITICAL DATA FORMATS

**Plausible script URL:**
```html
<script async src="https://plausible.io/js/pa-5lDK3arREKbPzQ_2_Jhfm.js"></script>
```
IMPORTANT: Use the exact URL above (pa-5lDK3arREKbPzQ_2_Jhfm.js) — this is the custom event endpoint.

**Inline queue snippet:**
```javascript
window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)},plausible.init=plausible.init||function(i){plausible.o=i||{}};
plausible.init()
```
IMPORTANT: This snippet MUST be placed AFTER the async script tag.

**CONFIG.ANALYTICS_ENABLED values:**
```javascript
ANALYTICS_ENABLED: true   // Production (tracking enabled)
ANALYTICS_ENABLED: false  // Development (tracking disabled)
```

---

### 🔗 PROJECT CONTEXT REFERENCE

**Read before implementing:**
- `_bmad-output/planning-artifacts/analytics-requirements.md` — Plausible integration spec
- `_bmad-output/planning-artifacts/cognitive-analytics-requirements.md` — Why privacy-first analytics

**Key Design Principles:**
- **Privacy-first:** No cookies, no personal data, GDPR-compliant
- **Non-blocking:** Async script, no impact on game load time
- **Graceful degradation:** Game works perfectly even if analytics fails
- **Dev-friendly:** ANALYTICS_ENABLED toggle for local development

---

### 📋 FRs COVERED

FR95 (Plausible analytics integration)

**Detailed FR Mapping:**
- FR95: Integrate Plausible for custom event tracking → index.html + config.js
- NFR: Non-blocking, privacy-first, graceful degradation → async script + guard clauses

---

### ✅ STORY COMPLETION CHECKLIST

**Before marking this story as DONE, verify:**

- [ ] Plausible script added to index.html <head>
- [ ] Script URL: https://plausible.io/js/pa-5lDK3arREKbPzQ_2_Jhfm.js
- [ ] Async attribute present on script tag
- [ ] Inline queue snippet added after script tag
- [ ] window.plausible function initialized
- [ ] plausible.q buffer array created
- [ ] CONFIG.ANALYTICS_ENABLED added to config.js
- [ ] Default value: true
- [ ] Comment explaining dev mode usage
- [ ] Graceful degradation tested (script blocked)
- [ ] No console errors when script unavailable
- [ ] Game loads normally without Plausible
- [ ] Gameplay maintains 60 FPS
- [ ] Event buffering tested (events queued before script loads)
- [ ] ANALYTICS_ENABLED = false tested (no events fired)
- [ ] window.plausible callable without errors

**Common Mistakes to Avoid:**
- ❌ Forgetting `async` attribute (blocks page load)
- ❌ Wrong Plausible script URL (standard script, not custom events endpoint)
- ❌ Queue snippet before script tag (window.plausible undefined)
- ❌ No CONFIG.ANALYTICS_ENABLED toggle (can't disable in dev)
- ❌ Console errors when Plausible blocked (not graceful)

---

## Dev Agent Record

### Agent Model Used

_To be filled by implementing agent_

### Debug Log References

_To be filled during implementation_

### Completion Notes List

_To be filled on completion_

### File List

- index.html (modified - add Plausible script and queue snippet)
- js/config.js (modified - add ANALYTICS_ENABLED flag)
