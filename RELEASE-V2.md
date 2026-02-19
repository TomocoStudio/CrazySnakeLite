# CrazySnake V2 — Release Notes

**The arcade just got a lot more interesting.**

*February 19, 2026 · 109 commits · 17 epics · 0 new dependencies*

---

V1 gave you a snake, some chaos food, and phone calls from tech legends. It was fun. It was wild. But it was just the warm-up.

V2 transforms CrazySnake into something that fights back — and keeps score of how well you handle it. Here's what changed, and more importantly, *why*.

---

## 1. Your Score Now Means Something

**Before:** Eat food. Get points. Every bite worth the same.
**Now:** Every food type has a different value — and the hard ones pay more.

V1 scoring was flat. A reverse-controls food (which flips your entire input mapping and demands you override your own muscle memory) was worth the same as a basic growing food. That felt wrong. If the game is going to challenge you, it should *reward* you for rising to it.

Now scoring follows a **Fibonacci-inspired system** where difficulty = reward:

| Food | Points | The Logic |
|------|--------|-----------|
| Invincibility | 0 | It's a safety net. You don't get paid for playing it safe. |
| Growing | +1 | The baseline. Eat and grow. |
| Speed Decrease | +2 | A small reward for the breather. |
| Wall Phase | +1 / +3 | +1 if you eat it. **+3 if you actually cross a wall with it.** |
| Speed Boost | +5 | Fast is hard. Hard pays. |
| Reverse Controls | +8 | Override your instincts? Big money. |

**Mystery Food** now appears at score 15+. Food starts blinking through random colors — you don't know what you're eating until you eat it. The probability ramps up as you improve, so the uncertainty never goes away.

**Combo Mode** kicks in at score 30+. Two food effects chain together, scores multiply, and the grid goes magenta neon. Sustained, focused play gets rewarded exponentially — not linearly.

---

## 2. The Phone Rings — Will You Answer?

**Before:** Phone rings. You press Space. Call ends. +1 point. Every time.
**Now:** Two buttons. Two choices. One of them is a lot more interesting.

Phone calls were V1's signature interruption — the game keeps running while you deal with a caller. But the decision was always the same: dismiss it. There was no tension, no risk, no reward gradient.

Now every call presents a real choice:

- **End** (Space) — Safe. +1 point. Back to the game.
- **Pick Up** (Enter) — Risky. Your screen blurs for 1-3 seconds while the caller delivers their one-liner. But you earn a **Fibonacci bonus** that grows with every consecutive pickup: +2, +3, +5, +8, +13, +21, +34...

Pick Up is irreversible — once you commit, you're in. The game doesn't pause. Your snake keeps moving through the blur. And if you die mid-call? You still get the bonus. Because courage deserves consolation.

**21 tech-pun callers** now come with 64×64 pixel portraits and comedy one-liners. Al Gorithm. Floppy Phil. Cache Money. Each one a tiny comedy reward for taking the risk.

---

## 3. The Game Remembers

**Before:** Every run was standalone. Die, forget, repeat.
**Now:** CrazySnake tracks how you play — and shows you what you're getting sharper at.

This is the biggest addition in V2. A complete tracking and feedback layer that runs silently in the background and surfaces insights after each run.

### Post-Game Recap
Dynamic highlights after each death. Not generic "nice try" messages — specific observations about *your* run. "New record for reverse-controls survived." "First combo multiplier." Paired with comedy quotes from your callers, because even death should make you smile.

### Skill Map
Six gameplay domains tracked across sessions — Decision Speed, Spatial Awareness, Flexibility, Divided Attention, Impulse Control, and Working Memory — displayed as pixel block bars (0–5 scale) with growth indicators showing whether you're trending up or down. It's your arcade scorecard, built one run at a time.

### Calibration Period
Your first 5 sessions build a baseline. The Skill Map stays locked with a "Warming up..." message until you've played enough for the numbers to mean something. No premature judgments. No fake precision.

### Streak System
Calendar-day tracking with a conscience. Play today, your streak grows. Skip a day? "Rest day logged. Ready for another round?" Not guilt. Not a red warning. Just a fact and an invitation.

### Run Summary Bar
After each death, a compact badge strip shows exactly what you ate — food type glyphs with animated count-ups, staggered left to right. Score tells you *how much*. The Run Summary tells you *what kind of run that was*.

### Comedy Throughout
Dashboard quotes, celebration messages, milestone acknowledgments — all written in CrazySnake's voice. The data is real. The delivery is fun.

**All data stays in your browser.** IndexedDB for session history, localStorage for your profile. Nothing leaves your device. Ever.

---

## 4. Neon Noir — The Arcade Gets Real

**Before:** A light grey grid. Clean. Functional. Forgettable.
**Now:** A dark, glowing, CRT-phosphor-drenched arcade that gets more intense as you improve.

The visual overhaul is the most visible change in V2, and every piece of it serves gameplay.

### Distinctive Food Shapes
Each of the 6 food types now has a unique pixel-art silhouette — square, star, ring, cross, hollow square, X-shape. No more "what color was that?" guessing. You can identify food by shape alone, even when it's blinking as mystery food.

### The Playfield Darkens
Grid lines progressively fade from white to invisible as your score rises through 6 tiers. At score 100+, the grid disappears entirely. The spatial scaffolding recedes as you prove you don't need it anymore.

### CRT Phosphor Glow
Every game object — food, snake, score popups — renders with a multi-layer neon glow that matches its color. Numbers appear to burn off the screen like a real arcade cabinet in a dark room.

### Snake Personality
The snake head now has pupils that track movement direction. It *looks* where it's heading. At score 50+ (when the background is dark enough), body segments gain a subtle outline for visibility. Black snake? White glow and white border — always visible, always sharp.

### Reactive Border
The canvas border is no longer decoration. It **communicates**:

| Border State | Color | Meaning |
|-------------|-------|---------|
| Default | Black | Wall = death |
| Wall Phase | Purple glow | You can cross safely |
| Invincibility | Yellow blink | Nothing can hurt you |
| Phone ringing | Gold pulse | Reward opportunity |
| Phone picked up | Green | You're committed |
| Combo active | Magenta breathing | Flow state, go fast |

You know what's happening without looking away from your snake.

### CRT Scanlines
A subtle `repeating-linear-gradient` overlay at 3% opacity. Felt more than seen. The texture of a real arcade screen, not a simulation trying too hard.

---

## 5. The Details That Make It Feel Right

The big features get headlines. These don't — but you'd notice if they were missing.

- **Milestone Blinks** — Every 50 points, the score display flashes white 6 times over 1 second, then settles back to Electric Blue. A quick pulse that says *you just crossed a threshold*.

- **Screen Shake** — Wall crossings (during wall phase or invincibility) trigger a physical shake of the game container. You *feel* the boundary being broken.

- **Snake Mosaic Background** — The page behind the game is filled with randomly packed, static black snakes at 50% opacity. The food-color glow washes over them, tinting the entire page with whatever's on screen.

- **Semi-Transparent Phone Overlay** — The phone card and backdrop are now translucent. Your blurred snake is visible beneath the call screen — watching it move while you decide is part of the pressure.

- **Keyboard Navigation** — Full arrow-key navigation across all screens. Menu (up/down), Game Over (left/right), Skill Map (left/right). Always-visible `[SPACE]` and `[ENTER]` badge pills on phone buttons, hidden on touch devices.

- **Unified Visual Language** — Every screen shares the same design system: Electric Blue `#00B4FF` for interactive chrome, Jersey20 retro font, consistent button styles, neon glow halos, and a unified title treatment across Menu, Game Over, Skill Map, and Feedback screens.

- **Combo Mode Visuals** — When combo activates: grid lines snap to magenta neon, the border breathes with a magenta glow, and a 72px "COMBO MODE!" announcement floats up from center. The background stays dark. The grid does the talking.

- **Victory Flash System** — Rotating celebratory messages on food pickup with power flashes. Invincibility gets its own golden flash. Every good move gets a nod.

- **Game Over Redesign** — Clearer hierarchy. No artificial delays. Your score, your highlights, your callers' best lines, your Run Summary — all visible immediately. Two buttons: Play Again or Skill Map. No clutter.

- **Accessibility** — `prefers-reduced-motion` respected throughout. All animations, blinks, and shakes are suppressed when the user's system requests it.

---

## 6. Bugs Squashed

Because shipping fast means fixing fast.

| What Broke | What Happened | How We Fixed It |
|-----------|---------------|-----------------|
| **Combo lifecycle** | Activation and progression fired on the same food eat, skipping a step | Enforced strict 3-step lifecycle: activate → stripe → exit |
| **Phone controls** | Controls locked up during Pick Up blur timer | Timing mismatch resolved, input state properly restored |
| **Screen shake vs. invincibility** | Shake animation was silently suppressed — invincibility border had higher CSS specificity | Moved shake to parent container with no conflicting animations |
| **Overlays flying off-screen** | Screen shake (`transform`) broke `position: fixed` on all overlays (CSS spec behavior) | Moved all fixed overlays to `<body>` level, outside the shaking container |
| **Game unplayable after analytics update** | `const` variable shadowed a `let` at module scope — no food spawned | Removed redundant declaration; module-level variable handles it |
| **Music after feedback** | Background music didn't resume after submitting the feedback form | Audio context properly resumed on modal close |
| **Feedback form** | Empty email sent "undefined"; star ratings couldn't be deselected | Input validation + toggle behavior fixed |
| **Phone +0 badges** | Zero-value bonus badges still displayed on phone buttons during invincibility | Badges hidden when value is 0 |

---

## By the Numbers

| | |
|---|---|
| Commits since V1 | **109** |
| Epics shipped | **17** |
| Development window | **19 days** (Feb 1 – Feb 19, 2026) |
| External dependencies added | **0** |
| Data sent to servers | **0 bytes** |
| Tech-pun callers | **21** |
| Unique food shapes | **6** |
| Reactive border states | **6** |
| Neon Noir tiers | **6** |
| Phone pickup bonus range | **+2 → +34** (Fibonacci) |
| Comedy one-liners | **21** |

---

## The Philosophy, Unchanged

Some things didn't change in V2 — on purpose.

- **Score-based, never time-based.** Every system rewards what you *achieve*, not how long you survive.
- **Difficulty is the product.** The challenge is what you came for. V2 just got better at rewarding you for meeting it.
- **Comedy is a system.** Tech puns, pixel portraits, one-liners — humor isn't decoration. It's why you pick up the phone.
- **Teach by encounter.** No tutorials. No instruction screens. Every mechanic is learned by playing.
- **Zero external dependencies. Zero data collection. Zero accounts.** Open the game. Play. Close it. Everything stays on your machine.

---

*Level up your game. Laugh while you do it. Come back tomorrow.*
