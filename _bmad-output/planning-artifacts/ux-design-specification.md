---
stepsCompleted: [1, 2]
inputDocuments:
  - '_bmad-output/planning-artifacts/product-brief-CrazySnakeLite-2026-01-13.md'
  - '_bmad-output/planning-artifacts/prd.md'
---

# UX Design Specification CrazySnakeLite

**Author:** Tomoco
**Date:** 2026-01-13

---

## Executive Summary

### Project Vision

CrazySnakeLite reimagines the classic Nokia Snake game by transforming a beloved but predictable formula into a fresh, chaotic experience. The product delivers two core mechanical innovations that inject strategic depth and unpredictable chaos into the traditional Snake gameplay:

1. **6 Strategic Food Types** - Growing, shrinking, invincibility, teleport, speed boost, and reverse controls create meaningful decision-making where players must choose which foods to pursue based on their current situation.

2. **Phone Call Interruption Mechanic** - Random "phone calls" interrupt gameplay while the game continues running underneath, forcing split-attention and quick reactions. This meta-commentary on phone distraction behavior is both thematically resonant and mechanically innovative.

The product aims to answer the question: "What if Snake wasn't boring?" by fusing strategic depth with chaotic unpredictability, creating higher cognitive engagement than traditional Snake variants while maintaining quick, accessible session lengths (5-10 minutes) perfect for break-time entertainment.

**Platform:** Web-first (desktop primary, mobile responsive), retro pixel art aesthetic honoring Nokia origins.

**Success Vision:** Coworkers play it, love it, and come back for more sessions - validating that chaos mechanics create replayability.

### Target Users

**Primary User: Alex, The Office Break Gamer**

- **Demographics:** Office workers, mid-20s to late 30s
- **Context:** At work computer, brain-fried from meetings/spreadsheets, seeking quick mental reset
- **Background:** Nostalgic memories of Nokia Snake, not hardcore gamers, comfortable with browsers and basic controls
- **Problem:** Traditional Snake is predictable and boring after 30 seconds; current break options (social media scrolling, repetitive mobile games) feel empty or mindless
- **Goal:** Fun, engaging break entertainment that's quick (5-10 minutes), guilt-free, and provides genuine mental refresh
- **Success Moment:** Within 30 seconds of playing, experiences first unexpected food effect or phone call interruption and thinks "This is NOT regular Snake!"
- **Play Pattern:** Quick work breaks, instant load essential, zero friction tolerance, multiple short sessions over time
- **Primary Device:** Desktop browser with keyboard controls (arrow keys/WASD/Space), mobile as secondary use case

**User Motivation:** Seeking surprise, variety, and cognitive engagement wrapped in nostalgic familiarity.

### Key Design Challenges

**1. Visual Clarity Under Chaos**

Six distinct food types must be instantly recognizable when:
- Snake is moving at varying speeds (normal vs speed boost)
- Phone call overlays are interrupting screen space
- Multiple effects are active simultaneously on the snake
- Player is making split-second decisions under pressure

**Challenge:** Color + shape/icon system must work at small sizes, in motion, and under partial occlusion. Food types need to be distinguishable within 100-200ms of visual scan.

**Additional Complexity:** Snake visual changes based on consumed food (snake itself becomes status indicator), so food appearance → snake appearance relationship must be clear and learnable through play alone.

**2. Phone Call Timing Balance**

Interruptions must create tension without creating frustration:
- Too frequent → annoying, players quit
- Too infrequent → mechanic feels tacked-on, not impactful
- Poor visual clarity → players don't understand game continues underneath

**Challenge:** The "game continues running during interruption" mechanic needs crystal-clear visual feedback so players understand the stakes. Phone overlay must be obvious enough to demand attention but transparent/clear enough to show game state underneath.

**3. Learning Without Teaching**

No tutorial in MVP - players must learn through play:
- Food effects must be immediately understandable from visual feedback alone
- Snake appearance changes must teach players what effect is active
- Phone call mechanic must be self-explanatory on first occurrence
- Edge cases (reverse controls, teleportation) must be learnable through experimentation without causing rage-quit

**Challenge:** First 30 seconds are critical - players must understand basic mechanics (food types differ, phone calls happen) without explicit instruction, or they'll bounce.

**4. Effect Stacking Clarity on Snake Visual**

When snake has multiple active effects simultaneously (e.g., invincibility + speed boost + shrinking):
- How does the snake visually communicate all active states?
- What's the visual hierarchy when effects conflict or overlap?
- Can players glance at their snake and instantly know their current state?

**Challenge:** Avoid visual mudiness or confusion when effects stack. Need clear design system for combining visual indicators on the snake body.

### Design Opportunities

**1. Retro Aesthetic as Clarity Tool**

Pixel art isn't just nostalgia - it's a functional constraint that forces simple, recognizable shapes:
- Low-res pixel art demands bold, clear shapes that read instantly
- Limited color palette creates stronger visual distinction between food types
- Constraints drive clarity rather than visual complexity
- Nostalgic aesthetic creates immediate emotional connection with target demographic

**Opportunity:** Use retro aesthetic as design discipline - if a food type or effect isn't readable in pixel art, it won't work under chaos either.

**2. Progressive Chaos Discovery**

Players can naturally learn by starting cautious (eating only safe foods), then gradually embracing chaos:
- Early game: Stick to familiar growing food (traditional Snake)
- Mid game: Experiment with one or two chaotic foods (shrinking, teleport)
- Late game: Intentionally pursue chaos for tactical advantage (invincibility to plow through walls, speed boost in open space)

**Opportunity:** Design visual confidence cues that encourage experimentation. Make "safe" foods visually familiar (green apple = traditional), make "chaos" foods visually exciting/risky (glowing, unusual colors).

**3. Split-Attention UX Innovation**

Phone call mechanic is unexplored design territory:
- No existing design patterns for "game continues during interruption" in casual web games
- Opportunity to create novel visual language around maintained game state
- Transparency, motion blur, visual "peek" at game underneath phone overlay
- Potential for iconic, meme-worthy moments ("I died because of a phone call!")

**Opportunity:** This mechanic could become the signature UX innovation that differentiates CrazySnakeLite. Get this right and it's instantly recognizable and shareable.

**4. Snake as Living Status Display**

Snake visual changes based on consumed food eliminate need for traditional status bars or UI indicators:
- Players always look at the snake (focal point) - no need to scan UI corners
- Immersive, diegetic feedback (snake IS the indicator, not separate UI)
- Reinforces cause and effect instantly (eat blue food → snake glows blue → "I'm invincible!")
- Adds to chaotic aesthetic dynamically as snake appearance shifts

**Opportunity:** This approach is cleaner, more immersive, and more learnable than traditional HUD elements. Doubles down on "show, don't tell" design philosophy.

---

## Design System & Visual Consistency Standards

**Purpose:** This section establishes the unified visual language for CrazySnakeLite. All UI elements must follow these standards to ensure a polished, cohesive experience.

**Design Philosophy:** Modern elegance meets retro gaming. Clean, harmonious, and intentional.

**Core Principles:**
- **One Purple Shade:** `rgb(157, 178, 221)` throughout all UI - no color chaos
- **Rounded Elegance:** 12px corners on frames, 8px on buttons - softens the aesthetic
- **Transparent Depth:** Layered opacity creates visual depth and sophistication
- **Consistent Interaction:** All buttons scale identically - `1.05x` on hover, `0.98x` on click
- **White Always:** Button text never changes color - always crisp white
- **No Decoration:** Every visual element serves clarity and usability

**Visual Hierarchy:**
1. **Gameplay (Sharp & Bold):** Canvas and score remain sharp-cornered `border-radius: 0` - retro gaming aesthetic
2. **UI Menus (Soft & Modern):** All menus/buttons use rounded corners - contemporary feel
3. **Result:** Best of both worlds - nostalgic gameplay with polished modern UI

---

### Color Palette

**Primary Colors:**
- **Background Canvas:** `#E8E8E8` (Light grey - game area)
- **Primary Purple:** `#800080` (Deep purple - canvas border only)
- **UI Purple:** `rgb(157, 178, 221)` (Light purple-blue - ALL UI elements: menu frames, button borders, text highlights)
- **Background Dark:** `#1A1A2E` (Dark blue-grey - outer border layer)
- **Button Inactive Background:** `#000000` (Pure black)
- **Button Active Background:** `rgb(157, 178, 221)` (Same as UI Purple)

**Overlay & Container Backgrounds:**
- **Full-screen overlays:** `rgba(0, 0, 0, 0.8)` (80% black - Feedback/Thank You modals)
- **Menu containers (no overlay):** `rgba(0, 0, 0, 0.9)` (90% black - Menu/Game Over screens)
- **Modal containers (with overlay):** `rgba(0, 0, 0, 0.6)` (60% black - Feedback/Thank You transparent containers)

**Text Colors:**
- **Text Primary:** `#E8E8E8` (Light grey - readable on dark)
- **Text Secondary:** `#FFFFFF` (Pure white - high contrast, all button text)
- **Text Dark:** `#000000` (Black - on light backgrounds)
- **Text Highlight:** `rgb(157, 178, 221)` (Light purple-blue - scores, titles)
- **Success/Celebration:** `#FFD700` (Gold - new high score indicator only)

**Nokia Phone Call Colors (Special Case):**
- **Phone Background:** `#C0C0C0` (Grey)
- **Phone Border:** `#000000` (Black)
- **Phone Text:** `#000000` and `#333333`

**CRITICAL SIMPLIFICATION:** The entire UI now uses ONE purple shade: `rgb(157, 178, 221)`. This creates visual harmony across all elements. Gold is reserved exclusively for celebration moments (new high scores).

**RULE:** Never introduce new colors without updating this palette. Consistency = professionalism.

---

### Typography

**Font Family:**
- **Primary:** `'Jersey20'` (Custom retro font)
- **Fallback:** `'Courier New', monospace`

**Font Sizes (Hierarchy):**
- **H1 (Game Title):** `36px` (Desktop), `28px` (Mobile)
- **H2 (Screen Titles):** `32px` (Desktop), `24px` (Mobile)
- **H3 (Section Headers):** `24px`
- **Body Text:** `20px` (Desktop), `16px` (Mobile)
- **Buttons:** `20px` (Primary), `16-18px` (Secondary)
- **Small Text:** `14px` (Labels, hints)
- **Score Display:** `20px` (Current), `24px` (High Score)

**Font Weight:**
- **Bold:** Titles, buttons, scores
- **Normal:** Body text, descriptions

**RULE:** All text must use Jersey20 font. No exceptions. Maintain 2px letter-spacing on titles for retro aesthetic.

---

### Layout & Spacing

**Grid System:**
- **Canvas Grid:** 20x20 units (400px × 400px at 20px per unit)
- **UI Spacing:** Use multiples of 8px (8, 16, 24, 32, 40)

**Positioning:**
- **Overlays:** Center with `position: absolute`, `transform: translate(-50%, -50%)`
- **Fixed Elements:** Use `position: fixed` for always-visible UI (feedback button)
- **Z-Index Layers:**
  - Base game: `z-index: 0`
  - Score display: `z-index: 100`
  - Game Over: `z-index: 150`
  - Menu: `z-index: 200`
  - Feedback button: `z-index: 500`
  - Modals/Overlays: `z-index: 1000`
  - Thank You screen: `z-index: 1001`

**RULE:** Respect the z-index hierarchy. Never create overlapping layers with conflicting depths.

---

### Frames & Borders

**Canvas Border (Game Area Only):**
```css
border: 8px solid #800080;           /* Deep purple - canvas only */
box-shadow: 0 0 0 8px #1A1A2E;      /* Outer dark border layer */
border-radius: 0;                    /* Sharp corners for game area */
```

**Standard Menu Frame Pattern (ALL UI Menus & Modals):**
```css
border: 8px solid rgb(157, 178, 221);  /* Light purple-blue border */
box-shadow: 0 0 0 8px #1A1A2E;        /* Outer dark border layer */
border-radius: 12px;                   /* Small rounded corners (12px) */
background-color: rgba(0, 0, 0, 0.9);  /* 90% black for menu/game over */
/* OR */
background-color: rgba(0, 0, 0, 0.6);  /* 60% black for feedback/thank you (transparent over overlay) */
```

**When to Use Standard Menu Frame:**
- Menu screen - `rgba(0, 0, 0, 0.9)` background (no overlay)
- Game Over screen - `rgba(0, 0, 0, 0.9)` background (no overlay)
- Feedback modal - `rgba(0, 0, 0, 0.6)` background (appears over 80% black overlay)
- Thank You screen - `rgba(0, 0, 0, 0.6)` background (appears over 80% black overlay)

**Special Case - Score Display:**
```css
border: 8px solid #800080;           /* Deep purple - matches canvas */
box-shadow: 0 0 0 8px #1A1A2E;
border-radius: 0;                    /* Sharp corners */
background: rgba(255, 255, 255, 0.9); /* White background */
```

**Special Case - Nokia Phone Overlay:**
```css
border: 4px solid #000000;           /* Black border (Nokia aesthetic) */
border-radius: 0;                    /* Sharp corners */
background: #C0C0C0;                 /* Grey Nokia screen */
```
**Reason:** Phone calls represent a different "device" interrupting the game - distinct visual language is intentional.

**CRITICAL RULES:**
1. ✅ **USE `border-radius: 12px`** on ALL menu frames (Menu, Game Over, Feedback, Thank You)
2. ✅ **Canvas and Score Display remain sharp** (`border-radius: 0`) - gameplay elements stay retro
3. ✅ **ALWAYS use light purple-blue** `rgb(157, 178, 221)` for menu frame borders
4. ✅ **ALWAYS use double-border pattern** (border + box-shadow) for major containers
5. ✅ **Container transparency depends on overlay:** 90% for direct screens, 60% for overlaid modals

---

### Buttons

**Standard Button Style (ALL Menu & Modal Buttons):**
```css
font-family: 'Jersey20', 'Courier New', monospace;
font-size: 20px;
font-weight: bold;
padding: 15px 40px;
border: 2px solid rgb(157, 178, 221);  /* Light purple-blue border */
border-radius: 8px;                     /* Small rounded corners (8px) */
background-color: #000000;              /* Black background (inactive) */
color: #FFFFFF;                         /* White text (always) */
transition: all 0.2s;
min-width: 200px;
```

**Hover State:**
```css
background-color: rgb(157, 178, 221);   /* Fill with light purple-blue */
border-color: rgb(157, 178, 221);       /* Border stays same color */
color: #FFFFFF;                         /* White text (always) */
transform: scale(1.05);                 /* Grow slightly */
```

**Active State (Click/Press):**
```css
background-color: rgb(157, 178, 221);   /* Keep filled */
border-color: rgb(157, 178, 221);       /* Border stays same */
transform: scale(0.98);                 /* Shrink slightly */
```

**Buttons Using This Style:**
- Menu: "New Game" button
- Game Over: "Play Again" and "Menu" buttons (NO default selection)
- Feedback: "Submit Feedback" button
- Thank You: "Back to Game" button

**Special Case - Nokia Phone "End" Button:**
```css
border: 3px solid #000000;              /* Black border */
border-radius: 0;                       /* Sharp corners */
background: #A0A0A0;                    /* Grey background */
color: #000000;                         /* Black text */
/* Nokia-style grey button - intentionally different */
```

**Special Case - Feedback Corner Button:**
```css
font-size: 13px;
padding: 9px 13px;
border: 2px solid rgb(157, 178, 221);
border-radius: 6px;                     /* Slight rounding OK for utility */
background-color: rgba(26, 26, 26, 0.9);
/* Small, unobtrusive, always-visible utility button */
```

**CRITICAL RULES:**
1. ✅ **ALL buttons use `border-radius: 8px`** (rounded corners for modern feel)
2. ✅ **Border color NEVER changes** - always `rgb(157, 178, 221)` in all states
3. ✅ **Text is ALWAYS white** `#FFFFFF` - never changes color
4. ✅ **Background transitions:** Black (inactive) → Light purple-blue (active)
5. ✅ **Scale animation:** `scale(1.05)` on hover, `scale(0.98)` on click
6. ✅ **Consistent timing:** `transition: all 0.2s` for smooth feel
7. ❌ **NO gold borders** on hover - removed for simplicity
8. ❌ **NO default selected states** - all buttons start inactive
9. ❌ **NO glow effects** - keep it clean and simple

**Visual Effect:**
When hovering, buttons "fill in" with the border color - creates elegant, unified interaction where the border appears to bleed into the button.

---

### Modal Overlays & Screens

**Two Screen Types:**

**1. Direct Screens (Menu, Game Over) - No Overlay:**
```css
/* Container appears directly over game canvas */
position: absolute;
top: 50%;
left: 50%;
transform: translate(-50%, -50%);
background-color: rgba(0, 0, 0, 0.9);  /* 90% opacity - darker for readability */
border: 8px solid rgb(157, 178, 221);
box-shadow: 0 0 0 8px #1A1A2E;
border-radius: 12px;
padding: 40px;
text-align: center;
min-width: 300px;
z-index: 150-200;
```

**2. Modal Overlays (Feedback, Thank You) - With Full-Screen Overlay:**
```css
/* Full-screen dimmed overlay */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.8);      /* 80% black overlay */
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000-1001;
}

/* Transparent container on top of overlay */
.modal-container {
  background-color: rgba(0, 0, 0, 0.6); /* 60% opacity - transparent to show layers */
  border: 8px solid rgb(157, 178, 221);
  box-shadow: 0 0 0 8px #1A1A2E;
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  max-width: 500px;
}
```

**CRITICAL RULES:**
1. ✅ **All containers use `border-radius: 12px`** - rounded corners for modern elegance
2. ✅ **All frames use light purple-blue** `rgb(157, 178, 221)` borders
3. ✅ **Opacity varies by type:**
   - Direct screens (no overlay) = 90% opacity
   - Modal containers (with overlay) = 60% opacity (creates depth effect)
4. ✅ **Modal overlays** = `rgba(0, 0, 0, 0.8)` (80% black)
5. ✅ **Center positioning** with flexbox for modals, absolute positioning for direct screens
6. ❌ **NO glow effects** - clean borders only
7. ❌ **NO gold borders** except for celebration moments

**Layering Effect:**
Modals create beautiful depth through transparency layers:
- Game/screen background (100%)
- Dark overlay (80% black)
- Transparent container (60% black)
= You can see through everything, creating visual depth!

---

### Animations & Transitions

**Standard Transition:**
```css
transition: all 0.2s ease;
```
Use for: Buttons, hover states, color changes

**Transform Transitions:**
- **Hover lift:** `transform: translateY(-2px)`
- **Active press:** `transform: translateY(0)` or `scale(0.98)`
- **Button grow:** `transform: scale(1.05)`

**Timing:**
- **Fast interactions:** `0.2s` (buttons, hovers)
- **Fade-ins:** `0.3s` (modals appearing)
- **Strobe effects:** `100ms` (invincibility flash)

**RULES:**
1. ❌ **NEVER use animations** on static game elements (canvas, snake, food) - they render per frame
2. ✅ **ALWAYS use transitions** on interactive elements (buttons, modals)
3. ❌ **NEVER exceed 0.3s** transition duration - feels sluggish
4. ✅ **Use `ease` or `ease-out`** - feels natural

---

### Accessibility & Touch Targets

**Minimum Touch Targets:**
- **Mobile buttons:** `44px × 44px` minimum (iOS guideline)
- **Desktop buttons:** `200px × 48px` recommended for primary actions

**Focus States:**
```css
:focus {
  outline: 2px solid #FFD700;
  outline-offset: 2px;
}
```

**Contrast Requirements:**
- **Text on dark backgrounds:** Use `#E8E8E8` or `#FFFFFF` (AAA contrast)
- **Text on light backgrounds:** Use `#000000` (AAA contrast)

**ARIA Labels:**
- Add `aria-label` to icon-only buttons (feedback button, close buttons)

---

### Visual Effects

**Blur Effect (Background during interruptions):**
```css
filter: blur(4px);
transition: filter 0.2s;
```
Use for: Canvas when phone overlay or feedback modal is active

**Opacity States:**
- **Visible:** `opacity: 1`
- **Hidden class:** `display: none` (preferred over opacity: 0)
- **Semi-transparent overlays:** `rgba(0, 0, 0, 0.8-0.9)`

**Shadow Usage:**
- **Structural borders:** `box-shadow: 0 0 0 8px #1A1A2E` (simulates double border)
- **Depth/elevation:** ❌ **AVOID** - not retro aesthetic
- **Glows:** ❌ **AVOID** on primary UI - breaks retro feel

**RULE:** Effects should enhance clarity, not add decoration. Retro aesthetic = clean and sharp.

---

### Responsive Breakpoints

**Mobile:** `max-width: 768px`

**Adjustments at mobile:**
- Reduce font sizes by 15-25%
- Increase touch targets to 44px minimum
- Reduce padding (40px → 30px → 20px)
- Hide decorative text, show icons only (feedback button)
- Simplify layouts (single column)

**RULE:** Desktop is primary platform. Mobile is secondary but must be fully functional.

---

### Component-Specific Guidelines

**Score Display:**
- Position: `top: -61px` above canvas
- Layout: Flexbox, space-between, 40px gap
- Colors: Current score = black, Top score = purple
- Frame: Standard double-border pattern

**Menu Screen:**
- Background: `rgba(0, 0, 0, 0.9)` overlay
- Frame: Standard double-border pattern
- Buttons: Primary button style (purple, sharp corners)
- Title: 36px, purple, 2px letter-spacing

**Game Over Screen:**
- Match Menu Screen styling exactly
- Add gold highlight only for "New High Score" text
- Buttons: Primary button style

**Phone Call Overlay:**
- Unique Nokia aesthetic (grey screen, black borders)
- Intentionally different from game UI
- Blur canvas underneath

**Feedback Button (Corner):**
- Small, unobtrusive, always visible
- Slight rounding OK (utility element)
- Purple theme

**Feedback Modal & Thank You Screen:**
- **MUST MATCH** Menu/Game Over aesthetic
- Standard frame pattern (thick borders, sharp corners, no glows)
- No gold borders (except thank you icon can be gold)
- No rounded corners
- No glow effects

---

### Implementation Checklist for Developers

**Before implementing ANY new UI element, verify:**

✅ **Frames & Borders:**
- [ ] Using 8px thick borders for all menu containers
- [ ] Using `rgb(157, 178, 221)` for ALL menu frame borders (light purple-blue)
- [ ] Using double-border pattern (`border` + `box-shadow: 0 0 0 8px #1A1A2E`)
- [ ] Using `border-radius: 12px` for menu/modal frames
- [ ] Using `border-radius: 0` for canvas and score display only

✅ **Colors:**
- [ ] Using ONLY `rgb(157, 178, 221)` for all UI purple elements
- [ ] Text contrast meets accessibility standards
- [ ] Button text is ALWAYS white `#FFFFFF`
- [ ] No colors outside the defined palette

✅ **Typography:**
- [ ] Using Jersey20 font family
- [ ] Font size matches hierarchy
- [ ] Bold weight for titles/buttons

✅ **Buttons:**
- [ ] Border: `2px solid rgb(157, 178, 221)` in ALL states
- [ ] Border-radius: `8px` for rounded corners
- [ ] Background: Black (inactive) → `rgb(157, 178, 221)` (active)
- [ ] Text: White in ALL states
- [ ] Scale animation: `scale(1.05)` hover, `scale(0.98)` active
- [ ] Transition: `all 0.2s`
- [ ] NO default selected states
- [ ] NO gold borders on hover
- [ ] NO glow effects

✅ **Opacity & Transparency:**
- [ ] Direct screens (Menu/Game Over): `rgba(0, 0, 0, 0.9)` - no overlay
- [ ] Modal overlays (Feedback/Thank You): `rgba(0, 0, 0, 0.8)` background
- [ ] Modal containers: `rgba(0, 0, 0, 0.6)` - transparent over overlay

✅ **Layout:**
- [ ] Z-index respects layer hierarchy
- [ ] Spacing uses 8px multiples
- [ ] Centered overlays use standard positioning pattern

✅ **Consistency:**
- [ ] One purple color throughout: `rgb(157, 178, 221)`
- [ ] Rounded corners on menus/buttons for modern elegance
- [ ] Smooth animations on all interactive elements
- [ ] Visual depth through transparency layering

---

### Design System Status

**✅ ALL VISUAL INCONSISTENCIES RESOLVED**

The design system has been fully implemented and all UI elements are now consistent:

**Completed Updates:**

1. **✅ Color Simplification:**
   - Single purple shade `rgb(157, 178, 221)` used throughout all UI
   - Removed conflicting purple variants
   - Clean, harmonious color palette

2. **✅ Rounded Corners:**
   - All menu frames: `border-radius: 12px`
   - All buttons: `border-radius: 8px`
   - Canvas/Score remain sharp for retro game aesthetic

3. **✅ Button Consistency:**
   - Unified border color in all states
   - Consistent scale animations
   - No default selected states
   - White text always

4. **✅ Transparency Layers:**
   - Direct screens: 90% opacity (readable)
   - Modal overlays: 80% black background
   - Modal containers: 60% opacity (creates depth)

5. **✅ Frame Borders:**
   - All menus use light purple-blue `rgb(157, 178, 221)`
   - Double-border pattern throughout
   - Consistent 8px thickness

**Result:** The entire UI now feels like one cohesive, intentionally-designed system. Users experience visual harmony across all screens with elegant transparency effects and smooth interactions.

---

### Design System Maintenance

**When adding new features:**
1. Read this Design System section FIRST
2. Match existing patterns before inventing new ones
3. If unsure, reference Menu Screen or Game Over Screen as the "source of truth"
4. Test on both desktop and mobile
5. Verify no new colors, fonts, or border patterns are introduced

**When in doubt:** Sharp corners, thick borders, purple theme, Jersey20 font, no glows = retro consistency.
