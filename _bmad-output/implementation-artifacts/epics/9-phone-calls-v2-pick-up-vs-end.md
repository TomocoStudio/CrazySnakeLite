# Epic 9: Phone Calls v2 — Pick Up vs End

**Status:** 🟢 COMPLETED
**Created:** 2026-02-08
**Completed:** 2026-02-16

---

## Overview

Transform phone interruptions from reflex-only dismissals into strategic micro-decisions. Players choose between End (+1, safe, instant) or Pick Up (+Fibonacci bonus, risky, 1-3s blur). Pick Up bonuses escalate per game: +2, +3, +5, +8, +13, +21, +34 (cap). 21 tech-pun callers with retro pixel portraits and one-liners (revealed only on Pick Up) make risk-taking entertaining. Score-based grace period (no calls until score 3) and frequency tiers (12-20s down to 4-8s) ensure calls arrive when the player's brain is ready. This trains divided attention, rapid context-switching, and risk assessment under pressure.

**FRs covered:** FR50-FR67 (Phone call system v2)

**Value:** Biggest gameplay enhancement. Transforms a simple interruption into a strategic choice with escalating stakes. Comedy (caller portraits + one-liners) makes cognitive challenge fun.

---

## Stories

### Story 9.1: Refactor Phone Overlay to Two-Button Layout

**As a** player,
**I want** to choose between ending or picking up phone calls,
**So that** I can decide between safety and risk/reward.

**Acceptance Criteria:**

**Given** a phone call arrives
**When** the phone overlay appears
**Then** I see two buttons side by side:
- "End" button (left): grey background, black text, +1 pt label below
- "Pick Up +N" button (right): green background, white text, displays current Fibonacci bonus value

**Given** the phone overlay is visible
**When** I hover over the End button (desktop)
**Then** the button darkens and scales to 1.05x

**Given** the phone overlay is visible
**When** I hover over the Pick Up button (desktop)
**Then** the button darkens, scales to 1.05x, and gold glow intensifies

**Given** the phone overlay is visible on desktop
**When** I press Space bar
**Then** the End button is activated immediately

**Given** the phone overlay is visible on desktop
**When** I press Enter key
**Then** the Pick Up button is activated immediately

**Given** the phone overlay is visible on mobile
**When** I tap the End button
**Then** the End action triggers

**Given** the phone overlay is visible on mobile
**When** I tap the Pick Up button
**Then** the Pick Up action triggers

**Given** both buttons are equal size
**When** I view the overlay
**Then** neither button appears visually "correct" or "default"
**And** the buttons preserve player autonomy (no coercion)

**Technical Notes:**
- Update phone.html structure with two buttons
- Add #phone-btn-end and #phone-btn-pickup IDs
- Implement flex layout with 15px gap
- Add keyboard handlers: Space → End, Enter → Pick Up
- Mobile: ensure 44px minimum touch targets

**FRs:** FR52-FR53, FR63-FR64

---

### Story 9.2: Implement Fibonacci Pick Up Bonus System

**As a** player,
**I want** Pick Up bonuses to escalate as I pick up more calls,
**So that** I feel increasing stakes and strategic tension.

**Acceptance Criteria:**

**Given** I start a new game
**When** the game initializes
**Then** phoneCall.pickUpCount is set to 0

**Given** I pick up my 1st call this game
**When** the Pick Up timer expires
**Then** I receive +2 points (Fibonacci position 3)
**And** phoneCall.pickUpCount increments to 1

**Given** I pick up my 2nd call this game
**When** the Pick Up timer expires
**Then** I receive +3 points
**And** phoneCall.pickUpCount increments to 2

**Given** I pick up my 3rd call
**Then** I receive +5 points

**Given** I pick up my 4th call
**Then** I receive +8 points

**Given** I pick up my 5th call
**Then** I receive +13 points

**Given** I pick up my 6th call
**Then** I receive +21 points

**Given** I pick up my 7th call
**Then** I receive +34 points

**Given** I pick up my 8th or more calls
**When** the Pick Up timer expires
**Then** I receive +34 points (capped)
**And** the bonus never exceeds +34

**Given** I End any call
**When** the call is dismissed
**Then** I receive +1 point (flat, always)
**And** phoneCall.pickUpCount does NOT increment
**And** my Fibonacci streak is preserved (pickUpCount not reset)

**Given** a phone call arrives
**When** the Pick Up button is displayed
**Then** the button text shows "Pick Up +N" where N is the current Fibonacci bonus value
**And** the bonus value updates dynamically based on pickUpCount

**Technical Notes:**
- Add phoneCall.pickUpCount to state (resets on new game, NOT on End)
- CONFIG.PHONE_PICKUP_FIBONACCI = [2, 3, 5, 8, 13, 21, 34]
- CONFIG.PHONE_PICKUP_MAX_BONUS = 34
- getPickUpBonus(pickUpCount) → returns fibonacci[pickUpCount] or MAX_BONUS
- Update button text dynamically when call shows

**FRs:** FR56-FR57, FR60

---

### Story 9.3: Implement Variable Pick Up Timer (1-3s with Countdown Bar)

**As a** player,
**I want** Pick Up to last an unpredictable duration,
**So that** I cannot optimize the mechanic and must adapt each time.

**Acceptance Criteria:**

**Given** I press Pick Up
**When** the button is activated
**Then** both buttons hide immediately
**And** a countdown bar appears in their place
**And** the bar displays at 100% width (green to gold gradient)

**Given** the countdown bar appears
**When** time progresses
**Then** the bar shrinks linearly from 100% to 0%
**And** the shrink duration is random between 1000ms and 3000ms

**Given** the countdown bar is active
**When** the game runs underneath
**Then** the canvas remains blurred (4px)
**And** the snake continues moving at normal speed
**And** I cannot see the game board clearly

**Given** the countdown bar reaches 0%
**When** the timer expires
**Then** the phone overlay dismisses automatically
**And** the Fibonacci bonus is awarded
**And** a score popup appears: "+N CALL BONUS" (gold text)
**And** the canvas blur removes smoothly (200ms transition)

**Given** I die during an active Pick Up timer
**When** death triggers
**Then** the countdown bar stops
**And** the Fibonacci bonus is STILL awarded (consolation reward)
**And** the death state proceeds normally

**Given** I press Pick Up
**When** the action is committed
**Then** I cannot End the call anymore (irreversible decision)
**And** the End button does not reappear

**Technical Notes:**
- Random duration: 1000 + Math.random() * 2000
- Add phoneCall.pickedUp (boolean), phoneCall.pickUpEndTime (timestamp)
- Countdown bar: CSS width transition with dynamically set duration
- Check in game loop: if pickedUp && Date.now() >= pickUpEndTime → dismiss
- Store pickUpBonus before timer starts (in case of death during timer)
- Award bonus on death if pickedUp = true

**FRs:** FR55, FR58-FR60

---

### Story 9.4: Implement 21 Caller Portraits and One-Liners

**As a** player,
**I want** each caller to have a unique portrait and funny one-liner,
**So that** picking up feels rewarding beyond just points.

**Acceptance Criteria:**

**Given** a phone call arrives
**When** the overlay appears
**Then** a 64x64 pixel portrait displays for the selected caller
**And** the portrait uses retro pixel art styling
**And** if the portrait asset is missing, a generic phone icon displays (fallback)

**Given** I End a call
**When** the overlay dismisses
**Then** I never see the caller's one-liner (End = no comedy reward)

**Given** I Pick Up a call
**When** the action is committed
**Then** the "Incoming call..." text is replaced by the caller's one-liner
**And** the one-liner fades in smoothly (200ms)
**And** the one-liner remains visible until the countdown expires

**Given** there are 21 unique callers
**When** a call arrives
**Then** the caller is selected randomly from the roster:
1. Al Gorithm - "Have you tried sorting your life out?"
2. Meg A. Byte - "I'm running out of space for this call!"
3. Ali Sing - "Stop giving me mixed signals!"
4. Anna Log - "Everything used to be simpler in my day..."
5. Ray Tracing - "I can see right through your strategy."
6. Pat Ch-Notes - "We need to fix a few things between us."
7. Mac Address - "I'm calling from a very specific location."
8. Artie Ficial - "I'm not a real person, but I play one on TV."
9. Floppy Phil - "I only have 1.44 MB to talk, so quick!"
10. Dot Matrix - "You're looking a bit pixelated today."
11. Gia Hertz - "I'm vibrating with excitement to talk to you!"
12. Terry Byte - "I've got a LOT of data to share with you."
13. Perry Pheral - "I'm just on the side... don't mind me."
14. Cade Ridger - "Let me bridge the gap in your gameplay."
15. Mona Tor - "I've been watching your every move..."
16. Syd Ram - "I forgot what I was gonna say... hold on..."
17. Bessie IOS - "Moo-ve over, I'm updating!"
18. Dee Frag - "Let me help you get your life together."
19. Buffy Ring - "Hold on, I'm buffering..."
20. DJ Snake - "Ssssomeone requested a remix of your game!"
21. GAME OVER - "Just checking if you're still alive..."

**Technical Notes:**
- Define CALLERS array in phone.js with {name, portrait, line}
- Random caller selection on each call
- Portrait path: assets/callers/{caller-slug}.png
- Fallback: <img onerror="this.src='assets/PhoneIcone01_256px.png'">
- One-liner replaces #phone-status-text content on Pick Up
- Add .one-liner-reveal CSS fade animation

**FRs:** FR52, FR59, FR61-FR62

---

### Story 9.5: Implement Score-Based Grace Period and Frequency Tiers

**As a** player,
**I want** phone calls to start simple and escalate with my score,
**So that** I'm not overwhelmed before I understand the mechanic.

**Acceptance Criteria:**

**Given** I start a new game
**When** my score is between 0-2
**Then** no phone calls arrive (grace period)

**Given** my score reaches 3
**When** I eat my 3rd food
**Then** phone calls become active
**And** the first call schedules within the score 3-14 tier interval

**Given** my score is between 3-14
**When** scheduling the next call
**Then** the delay is random between 12s and 20s

**Given** my score is between 15-39
**When** scheduling the next call
**Then** the delay is random between 8s and 15s

**Given** my score is between 40-59
**When** scheduling the next call
**Then** the delay is random between 6s and 12s

**Given** my score is between 60-99
**When** scheduling the next call
**Then** the delay is random between 5s and 10s

**Given** my score is 100 or above
**When** scheduling the next call
**Then** the delay is random between 4s and 8s (peak cognitive demand)

**Given** I am at score 50 and a call is scheduled in 10 seconds
**When** I reach score 60 before the call arrives
**Then** the scheduled call still arrives (no recalculation mid-timer)
**And** the NEXT call after dismissal uses the new tier (60-99: 5-10s)

**Technical Notes:**
- Add CONFIG.PHONE_GRACE_SCORE = 3
- Add CONFIG.PHONE_CALL_TIERS array with {minScore, minDelay, maxDelay}
- On game start: phoneCall.graceActive = true
- On score >= PHONE_GRACE_SCORE: phoneCall.graceActive = false, schedule first call
- getTierForScore(score) → returns {minDelay, maxDelay}
- Random delay: minDelay + Math.random() * (maxDelay - minDelay)

**FRs:** FR50-FR51, FR54

---

### Story 9.6: Integrate Phone Bonus Popup and Cross-System Interactions

**As a** player,
**I want** phone bonuses to display clearly alongside other score events,
**So that** I understand where my points came from.

**Acceptance Criteria:**

**Given** a phone call is dismissed (End or Pick Up)
**When** the bonus is awarded
**Then** a score popup appears:
- Content: "+N CALL BONUS" (e.g., "+13 CALL BONUS")
- Font: 24px, gold color (#FFD700)
- Animation: Similar to +5 popup (bounce + glow)
- Duration: 800ms

**Given** I Pick Up during active combo mode
**When** the countdown bar is running
**Then** the combo canvas color remains visible under the blur
**And** the combo state is preserved (striped snake, Effect A/B)
**And** combo timer is paused while phone overlay is active

**Given** the phone dismisses during combo mode
**When** the overlay closes
**Then** combo mode resumes with all state intact
**And** the striped snake pattern continues
**And** the combo timer resumes counting

**Given** I die during Pick Up AND combo mode is active
**When** death triggers
**Then** the combo multiplier is awarded (A × B if food B was eaten)
**And** the Pick Up Fibonacci bonus is awarded (consolation)
**And** both popups appear:
  - Combo popup: "+24 COMBO" (center)
  - Phone popup: "+13 CALL BONUS" (50px below, 300ms stagger)

**Given** a combo score popup and phone bonus popup fire within 500ms
**When** both render
**Then** they stack vertically (combo first, phone below)
**And** the phone popup waits 300ms before appearing (stagger rule)

**Technical Notes:**
- Create .score-popup-phone CSS class
- Extend score-popup.js with spawnPhoneBonusPopup(value)
- Format: "+{value} CALL BONUS"
- Integrate with popup queue (300ms stagger)
- Combo + phone interaction: pause combo timer when phoneCall.active = true

**FRs:** FR60, FR65-FR67

---

### Story 9.7: Track Phone Stats for Analytics and Cognitive Feedback

**As a** developer,
**I want** to track phone call interactions,
**So that** we can validate divided attention training and display cognitive stats.

**Acceptance Criteria:**

**Given** a phone call arrives
**When** the overlay shows
**Then** analyticsState.totalPhoneCalls increments by 1
**And** analyticsState.phoneCallShowTime = Date.now()

**Given** I dismiss a call (End or Pick Up)
**When** the action completes
**Then** cognitiveStats.phoneCallsManaged increments by 1

**Given** I Pick Up a call
**When** the Pick Up action is committed
**Then** cognitiveStats.pickUpStreak increments by 1
**And** analyticsState.totalPickUps increments by 1

**Given** I End a call
**When** the End action completes
**Then** cognitiveStats.pickUpStreak resets to 0
**And** analyticsState.totalEnds increments by 1

**Given** the phone dismisses (End or Pick Up)
**When** the action completes
**Then** analyticsState computes reaction time: Date.now() - phoneCallShowTime

**Given** I die during a Pick Up
**When** death triggers
**Then** analyticsState records survived = false for this call

**Given** I survive a Pick Up
**When** the countdown expires
**Then** analyticsState records survived = true for this call

**Technical Notes:**
- Add cognitiveStats.phoneCallsManaged counter
- Add cognitiveStats.pickUpStreak (longest streak, reset on End)
- Add analyticsState.totalPhoneCalls, totalPickUps, totalEnds
- Add analyticsState.phoneCallShowTime (timestamp)
- Track action ('end' | 'pickup'), reaction time, survived flag
- Pass to analytics.js trackPhoneCall() (Epic 12)

**FRs:** Prepares for Epic 11 and Epic 12

---

## Assets Required

- 21 caller portraits (64x64 PNG, retro pixel art)
- Naming: al-gorithm.png, meg-a-byte.png, ali-sing.png, etc.
- Fallback: PhoneIcone01_256px.png (already exists)

---

## Technical Architecture

**Modified Modules:**
- `js/phone.js` — Refactor to two-button system, Pick Up logic, CALLERS array, countdown timer
- `js/state.js` — Add phoneCall fields: pickedUp, pickUpEndTime, pickUpBonus, pickUpCount, graceActive
- `js/config.js` — Add PHONE_GRACE_SCORE, PHONE_CALL_TIERS, PHONE_PICKUP_FIBONACCI, PHONE_PICKUP_MAX_BONUS
- `js/game.js` — Integrate grace period check, tier-based scheduling, Pick Up timer expiration check
- `js/input.js` — Add Enter key binding for Pick Up
- `js/score-popup.js` — Add spawnPhoneBonusPopup(value, x, y)
- `css/style.css` — Two-button layout, countdown bar, mobile responsive

**HTML:**
- Update phone overlay with two buttons
- Add countdown bar element

---

## Definition of Done

- [ ] All 7 stories complete with passing acceptance criteria
- [ ] Two-button phone overlay implemented (End / Pick Up)
- [ ] Fibonacci Pick Up bonus system functional (+2 to +34 cap)
- [ ] Variable Pick Up timer (1-3s) with countdown bar
- [ ] 21 caller portraits displayed with fallback
- [ ] One-liners revealed only on Pick Up, with fade-in
- [ ] Score-based grace period (no calls until score 3)
- [ ] Score-based frequency tiers functional (5 tiers)
- [ ] Consolation reward: bonus awarded on death during Pick Up
- [ ] Pick Up is irreversible once committed
- [ ] Desktop controls work (Space=End, Enter=Pick Up)
- [ ] Mobile touch targets functional (44px minimum)
- [ ] Phone bonus popup displays with "CALL BONUS" label
- [ ] Combo mode + phone call interaction works (pause/resume)
- [ ] Death during combo + Pick Up awards both rewards
- [ ] Popup stagger functional (300ms delay)
- [ ] cognitiveStats tracking: phoneCallsManaged, pickUpStreak
- [ ] analyticsState tracking: totalCalls, totalPickUps, totalEnds, reaction times
- [ ] Code reviewed and merged

---

**Epic Owner:** John (Dev)
**Estimated Effort:** 2.5 weeks
**Priority:** HIGH — Major gameplay transformation
**Dependencies:** Existing phone.js, Epic 7 (score popup system)
