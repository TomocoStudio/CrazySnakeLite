# DataViz Principles for CrazySnakeLite Cognitive Dashboard

_Mandatory reference for ALL agents making UX/UI decisions about data visualization in the dashboard._
_Synthesized from "The Architecture of Comprehension" (Tomoco, 2026) — a comparative study of Tufte, Knaflic, McCandless, and Rosling._

---

## Purpose

CrazySnakeLite's cognitive dashboard displays post-game stats that reveal the player's cognitive performance — reverse-control survival, phone call management, mystery food decisions, combo multipliers, and more. These are not vanity metrics; they are *cognitive fitness feedback*. Every visualization must help the player **understand what their brain just did** and **feel motivated to play again**.

---

## The Five Universal Tenets

These are non-negotiable. Every dashboard visualization must satisfy all five.

### 1. Graphical Integrity

> "A visualization that sacrifices accuracy for visual flair breaches the ethical contract between the analyst and the audience." — Tufte

- **Proportional representation:** Visual size/length/area MUST map proportionally to the underlying number. A bar showing 8 RC foods eaten must be visibly 4x a bar showing 2. No exaggeration.
- **No Lie Factor:** Never truncate axes, manipulate baselines, or use 3D effects that distort proportions.
- **Dimensional constraint:** Do not add visual dimensions that don't exist in the data. A single score value is 1D — display it as a bar or number, never a 3D pie slice.
- **Contextualization:** Always show data in context. A score of 5 RC survivals means nothing without showing it relative to opportunities or personal bests.

### 2. Cognitive Empathy

> "Effective visualization never begins with the data alone; it begins with the audience's psychological state." — Knaflic / Rosling

- **Know the player's state:** The dashboard appears at game-over. The player may be frustrated (death) or triumphant (high score). Design for both emotional states.
- **Finite working memory:** Players have ~4 chunks of working memory available post-game. The dashboard MUST NOT present more than 4-5 distinct data points simultaneously without clear grouping.
- **Counter the Negativity Instinct:** Players tend to fixate on failure. Use longitudinal/trend data to show improvement over time, not just single-game snapshots.
- **Counter the Size Instinct:** Always provide denominators or context. "3 RC survivals" is less meaningful than "3/4 RC survivals (75%)."

### 3. Signal-to-Noise Optimization

> "Maximize the data-ink ratio. Erase non-data-ink. Erase redundant data-ink. Revise and edit." — Tufte

- **Maximize data-ink ratio:** Every pixel must serve a communicative purpose. If removing a visual element does not reduce the player's understanding, remove it.
- **Erase chartjunk:** No decorative borders, heavy gridlines, background shading, drop shadows, or 3D effects on data elements. The game itself is playful — the dashboard earns trust through clarity.
- **No redundant encoding:** Do not show the same value as both the height of a bar AND a label on the bar AND a tooltip. Pick the most effective encoding; one is enough.
- **Direct labeling over legends:** Place labels directly on or adjacent to data elements (Knaflic's Proximity principle). Never force the player to look at a separate legend and then back at the chart.

### 4. Aesthetic Affordance

> "Beauty is not the enemy of accuracy; it is an indispensable mechanism for clarity." — McCandless

- **Beauty invites engagement:** The dashboard must be visually harmonious with CrazySnakeLite's retro-arcade aesthetic. Aesthetics lower the barrier to cognitive entry — players will *want* to read a beautiful dashboard.
- **Knowledge compression:** Use visual metaphor and spatial arrangement to compress complex cognitive data into immediately digestible forms. The McCandless Four Elements must all be present:
  - **Information** — accurate cognitive stats
  - **Story** — "here's what your brain excelled at"
  - **Goal** — motivate the next play session
  - **Visual Form** — colors, shapes, and layout that match the game's identity
- **Affordances:** The design must intuitively communicate how to read it. Progress bars afford "filling up." Sparklines afford "trend over time." The visual form tells the player *how* to interpret without instructions.

### 5. Narrative Integration

> "Data does not speak for itself; it must be given a voice." — Knaflic / Rosling

- **Takeaway titles, not descriptive titles:** Use "You survived 3 of 4 Reverse Control challenges" not "Reverse Control Stats." The title IS the insight.
- **Narrative arc:** The dashboard should flow: opening (summary/headline) -> middle (breakdown by cognitive domain) -> end (call to action / play again motivation).
- **Answer questions before they're asked:** Proactively address "what does this mean?" through annotations, contextual labels, and clear visual hierarchy.
- **Sequential flow:** Guide the eye through the data in a logical order using Knaflic's preattentive attributes (contrast, size, position) — not random scattershot.

---

## Operational Design Rules

Derived from the five tenets, these are the concrete rules for implementation.

### Visual Hierarchy (Knaflic's Preattentive Attributes)

| Attribute | Dashboard Application |
|-----------|----------------------|
| **Color saturation** | Use a single bold accent color to highlight the most important stat. All other elements in muted/grey tones. |
| **Size** | The headline stat (total score, cognitive highlight) gets the largest visual treatment. |
| **Position** | Most critical insight goes top-left (Z-pattern reading flow). Secondary details flow right and downward. |
| **Contrast** | "Hawk in a sky of pigeons" — one element pops, the rest recede. Never make everything bold. |
| **Alignment** | Strict grid alignment. No diagonal text (52% slower to read per Knaflic). |

### Gestalt Principles in Practice

| Principle | Dashboard Application |
|-----------|----------------------|
| **Proximity** | Group related stats physically close. RC survival + RC opportunities together. Phone pickups + phone streak together. |
| **Similarity** | Use consistent color coding: same cognitive domain = same hue family. |
| **Enclosure** | Use subtle background shading (not heavy borders) to group stat categories. |
| **Closure** | Let the data form boundaries. Remove chart borders — the bars/lines themselves create shape. |
| **Continuity** | Align elements along clear horizontal or vertical axes to guide the eye. |
| **Connection** | Use connecting lines only where actual relationships exist (e.g., trend over sessions). |

### Chart Type Selection

| Data Type | Recommended Visual | Avoid |
|-----------|-------------------|-------|
| Single metric (e.g., total score) | Large number + contextual label | Pie chart, gauge |
| Comparison across categories (e.g., food types eaten) | Horizontal bar chart | Pie chart, radar chart |
| Part-of-whole (e.g., food distribution) | Stacked bar (if few categories) | 3D pie, donut |
| Trend over time (e.g., score history) | Sparkline or small line chart | Area chart with heavy fill |
| Single ratio (e.g., RC survival rate) | Progress bar or fraction label | Pie chart |
| Highlight a single achievement | Icon + number + takeaway label | Complex chart |

### Color Rules

- **Primary accent:** One bold color for the single most important data point per view.
- **Supporting palette:** Muted tones (greys, desaturated versions of game colors) for secondary data.
- **Semantic consistency:** Reuse the game's existing food-type colors where referencing food types (green for growing, orange for RC, red for speed boost, etc.).
- **Accessible contrast:** Minimum 4.5:1 contrast ratio for text on backgrounds. Never rely on color alone to encode meaning — always pair with shape, label, or position.
- **Combo/phone colors:** When referencing combo mode or phone calls, use the existing game palette (combo purples/blues, phone overlay tones).

### Typography and Labeling

- **Takeaway titles:** Every stat group gets a title that IS the insight, not a generic label.
- **Units always visible:** Never display a number without its unit or context ("3" is meaningless; "3 RC survived" communicates).
- **No rotated text:** All labels horizontal. If a label doesn't fit, abbreviate or restructure the layout.
- **Hierarchy through weight:** Bold for headlines, regular for data, light for secondary context. Maximum 2-3 weight levels.

### The Shrink Principle (Tufte)

- The dashboard exists in a constrained space (game-over overlay). Apply the Shrink Principle: most graphics can be significantly reduced in size without losing legibility.
- Prefer sparklines and compact indicators over full-sized charts.
- Dense, information-rich small elements are better than large, sparse ones.

### Small Multiples (Tufte)

- When comparing across sessions or cognitive domains, use small multiples: same chart structure repeated with different data, aligned on a common axis.
- Same scale, same axes, different data slices — the brain does the comparison automatically.

---

## The Dashboard Design Checklist

Before approving any dashboard visualization, verify:

- [ ] **Graphical Integrity:** Is every visual proportion truthful? Lie Factor = 1.0?
- [ ] **Data-Ink Maximized:** Can any element be removed without reducing understanding?
- [ ] **Cognitive Load:** Does the view present <= 4-5 chunks? Can a player grasp the key insight in < 3 seconds?
- [ ] **Takeaway Title:** Does the title state the insight, not just describe the data?
- [ ] **Direct Labels:** Are all labels directly on/adjacent to their data? No separate legend?
- [ ] **Single Accent:** Is exactly one element highlighted as the focal point?
- [ ] **Context Provided:** Does every number have a denominator, comparison, or trend?
- [ ] **Affordance Clear:** Does the visual form tell the player HOW to read it?
- [ ] **Narrative Flow:** Does the layout guide the eye in a logical sequence?
- [ ] **McCandless Complete:** Are all four elements present (Information + Story + Goal + Form)?
- [ ] **Emotional Design:** Does the visualization motivate another play session?
- [ ] **Accessible:** Color is never the sole encoding. Contrast ratios met. No rotated text.

---

## Theoretical Lineage

| Principle | Primary Source | Supporting Sources |
|-----------|--------------|-------------------|
| Data-Ink Ratio | Tufte | Knaflic (decluttering) |
| Graphical Integrity / Lie Factor | Tufte | Rosling (proportional scaling) |
| Cognitive Load Management | Knaflic | Hodent (game-ux-principles.md) |
| Gestalt Grouping | Knaflic | Tufte (small multiples) |
| Preattentive Attributes | Knaflic | McCandless (visual hierarchy) |
| Knowledge Compression | McCandless | Tufte (data density) |
| Four Elements Framework | McCandless | — |
| Narrative Arc | Knaflic (6-step) | Rosling (performative presentation) |
| Counter Cognitive Bias | Rosling (10 instincts) | Hodent (game-ux-principles.md) |
| Sparklines / Shrink Principle | Tufte | — |
| Aesthetic as Function | McCandless | Rosling (beauty invites engagement) |

---

_Source: "The Architecture of Comprehension: Synthesizing the Core Principles of Data Visualization" (Tomoco, 2026). Adapted for CrazySnakeLite cognitive dashboard by Sally (UX Designer)._
_Companion document: `game-ux-principles.md` (cognitive science baseline from Hodent)._

Last Updated: 2026-02-15
