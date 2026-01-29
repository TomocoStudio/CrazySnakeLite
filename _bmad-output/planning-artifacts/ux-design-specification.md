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
