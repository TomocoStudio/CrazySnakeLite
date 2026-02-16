# Story 18.6: Verify No Clinical Language Across Dashboard UI

**Epic:** 18 - Dashboard Comedy Integration

**As a** player,
**I want** all dashboard text to feel like a game, not a medical report,
**So that** cognitive tracking is fun and approachable.

---

## Acceptance Criteria

**Given** any dashboard screen displays (post-game, Skill Map, calibration)
**When** reviewing all text content
**Then** verify NO clinical/medical terminology:

**❌ FORBIDDEN TERMS:**
- "cognitive deficit", "impairment", "dysfunction"
- "clinical assessment", "diagnostic"
- "neurological", "neuropsychological"
- "brain age", "mental acuity score"
- "percentile ranking" (competitive clinical framing)

**✅ ALLOWED GAME-NATIVE TERMS:**
- "Skill Map" (not "Brain Map" in player-facing UI)
- "Recap" (not "Cognitive Assessment")
- "Warming up..." (not "Calibrating brain...")
- "Top Skill" / "Level Up" (not "Strongest" / "Weakest")
- "Rest day logged" (not "Streak broken")

**Given** domain labels display on Skill Map
**When** rendering 6 cognitive domains
**Then** use game-friendly labels:
- "Reaction" or "Reaction Time" ✅ (not "Processing Speed" ❌)
- "Spatial" ✅ (not "Spatial Cognition" ❌)
- "Flexibility" ✅ (not "Executive Function" ❌)
- "Attention" ✅ (not "Divided Attention Capacity" ❌)
- "Impulse" ✅ (not "Inhibitory Control" ❌)
- "Memory" or "Working Memory" ✅ (not "Working Memory Capacity" ❌)

**Given** achievement labels display
**When** celebrating player performance
**Then** use humor, not clinical precision:
```
✅ "Your prefrontal cortex just filed a pull request. Merged without conflicts."
❌ "Executive function performance increased by 12.3% (p < 0.05)."

✅ "Survived 4 Reverse Controls — brain on fire 🔥"
❌ "Cognitive flexibility score: 0.87 (above average)"
```

**Per FR202-FR203:** Achievement-style labels use humor not clinical language, no medical terminology anywhere in dashboard

---

## Development

### Files to Create/Modify

- **`_bmad-output/implementation-artifacts/validation/18-6-clinical-language-audit.md`** - NEW - Audit report documenting language review
- **CODEBASE SCAN** - Review all dashboard-related files for clinical terminology

### Validation Scope

**Files to Audit:**
- `js/comedy.js` - All CALLER_QUOTES text content
- `js/cognitive-feedback.js` - Post-game highlights text
- `js/dashboard.js` - Skill Map labels, domain names, callouts
- `js/calibration.js` - Calibration messages
- `js/metrics.js` - Any UI-facing labels (metric names, descriptions)
- `index.html` - All dashboard overlay text content
- `css/style.css` - CSS class names and comments (should avoid clinical terms)

### Forbidden Terms Checklist

**❌ MEDICAL/CLINICAL TERMS (must NOT appear):**

| Category | Forbidden Terms |
|----------|----------------|
| **Diagnostic** | cognitive deficit, impairment, dysfunction, disorder |
| **Clinical** | clinical assessment, diagnostic, neuropsychological, psychometric |
| **Medical** | neurological, brain age, mental acuity, percentile ranking |
| **Analytical** | z-score, standard deviation, normal distribution, outlier |
| **Research** | control group, experimental, p-value, significance |

### Allowed Game-Native Terms

**✅ GAME-FRIENDLY ALTERNATIVES:**

| Use This (✅) | Not This (❌) |
|-------------|-------------|
| Skill Map | Brain Assessment, Cognitive Profile |
| Session Recap | Cognitive Assessment, Test Results |
| Warming up... (sessions 1-4) | Calibrating brain, Baseline measurement |
| Top Skill / Level Up | Strongest Domain / Weakest Domain |
| Rest day logged | Streak broken, Compliance gap |
| Reaction Time | Processing Speed |
| Spatial | Spatial Cognition |
| Flexibility | Executive Function, Cognitive Flexibility |
| Attention | Divided Attention Capacity |
| Impulse | Inhibitory Control |
| Working Memory | Working Memory Capacity |

### Domain Label Validation

```javascript
// Verify domain labels in dashboard.js
const DOMAIN_LABELS = {
  reactionTime: 'Reaction Time',     // ✅ (or "Reaction")
  spatialAwareness: 'Spatial',       // ✅
  cognitiveFlexibility: 'Flexibility', // ✅ (NOT "Executive Function")
  dividedAttention: 'Attention',     // ✅ (NOT "Divided Attention Capacity")
  impulseControl: 'Impulse',         // ✅ (NOT "Inhibitory Control")
  workingMemory: 'Working Memory'    // ✅ (or "Memory")
};
```

### Caller Quote Content Review

```javascript
// Example validation for CALLER_QUOTES

// ✅ GOOD - Humorous, game-native language
"Your prefrontal cortex just filed a pull request. Merged without conflicts."
"Survived 4 Reverse Controls — brain on fire 🔥"
"12 days straight? Your brain is now officially a gym rat."

// ❌ BAD - Clinical/medical language
"Executive function performance increased by 12.3% (p < 0.05)."
"Cognitive flexibility score: 0.87 (above average)"
"Your neural pathways show improved myelination."
```

### Automated Validation Script

```javascript
// test/validate-language.js (NEW test script)

const fs = require('fs');
const path = require('path');

const FORBIDDEN_TERMS = [
  'cognitive deficit', 'impairment', 'dysfunction', 'disorder',
  'clinical assessment', 'diagnostic', 'neuropsychological',
  'brain age', 'mental acuity', 'percentile ranking',
  'z-score', 'standard deviation', 'p-value', 'significance',
  'control group', 'experimental'
];

const FILES_TO_SCAN = [
  'js/comedy.js',
  'js/cognitive-feedback.js',
  'js/dashboard.js',
  'js/calibration.js',
  'js/metrics.js',
  'index.html'
];

function scanForForbiddenTerms() {
  const violations = [];

  FILES_TO_SCAN.forEach(file => {
    const content = fs.readFileSync(path.join(__dirname, '..', file), 'utf8');

    FORBIDDEN_TERMS.forEach(term => {
      const regex = new RegExp(term, 'gi');
      const matches = content.match(regex);

      if (matches) {
        violations.push({
          file,
          term,
          count: matches.length
        });
      }
    });
  });

  return violations;
}

// Run validation
const violations = scanForForbiddenTerms();

if (violations.length > 0) {
  console.error('❌ CLINICAL LANGUAGE VIOLATIONS FOUND:');
  violations.forEach(v => {
    console.error(`  ${v.file}: "${v.term}" (${v.count} occurrences)`);
  });
  process.exit(1);
} else {
  console.log('✅ No clinical language detected. All clear!');
  process.exit(0);
}
```

### Manual Review Checklist

**Post-Game Highlights:**
- [ ] Highlight labels use achievement language (🎯, ⬆, 🔥) not clinical terms
- [ ] Caller quotes are humorous, not medical
- [ ] No percentile comparisons or normative language

**Skill Map Dashboard:**
- [ ] Domain names use game-friendly labels
- [ ] "Top Skill" / "Level Up" (NOT "Strongest" / "Weakest")
- [ ] Session count and streak labels are neutral/celebratory
- [ ] Caller quotes maintain humor tone

**Calibration Experience:**
- [ ] "Warming up..." messaging (NOT "Calibrating brain")
- [ ] Session counter shows progress neutrally
- [ ] Unlock message is celebratory, not clinical

**General UI:**
- [ ] Screen titles use game language ("Skill Map", "Session Recap")
- [ ] Button labels are action-oriented ("PLAY NOW", not "Begin Assessment")
- [ ] Help text (if any) avoids medical framing

### Audit Report Template

```markdown
# Clinical Language Audit Report
**Story:** 18.6
**Date:** [Date]
**Auditor:** [Name]

## Automated Scan Results
- Files scanned: 6
- Forbidden terms found: 0
- Status: ✅ PASS

## Manual Review Results

### Post-Game Highlights
- Achievement labels: ✅ Game-native
- Caller quotes: ✅ Humorous, not clinical

### Skill Map
- Domain labels: ✅ Approved terms only
- Callouts: ✅ "Top Skill" / "Level Up"

### Calibration
- Messaging: ✅ "Warming up..." (not clinical)

## Issues Found
[List any violations with file:line references]

## Recommendations
[Any suggested improvements]

## Sign-Off
- [ ] All dashboard text reviewed
- [ ] No clinical/medical terminology present
- [ ] Game-native language consistent throughout
```

### Test Strategy

**Automated Tests:**
1. Run `node test/validate-language.js` → MUST exit 0 (no violations)
2. Grep codebase for forbidden terms → MUST return empty
3. Check all CALLER_QUOTES for clinical language → MUST pass content guidelines

**Manual Tests:**
1. Play 5 sessions → review all dashboard text
2. Open Skill Map → verify domain labels use approved terms
3. Read all caller quotes → verify humorous tone
4. Check calibration messaging → verify "Warming up..." not "Calibrating brain"
5. Compare to Lumosity/BrainHQ → verify CrazySnake feels like game, not medical tool

### Dependencies

**BEFORE this story:**
- Story 18.1-18.5 (all dashboard content implemented)

**AFTER this story:**
- BLOCKING for Epic 18 sign-off (must validate before shipping)

### Implementation Notes

1. **Automated + manual review** - Script catches obvious violations, manual review ensures tone
2. **Case-insensitive matching** - "Cognitive Deficit" and "cognitive deficit" both forbidden
3. **Context matters** - "Working Memory" is OK (game-native), "Working Memory Capacity" is NOT (clinical)
4. **CSS class names** - Avoid clinical terms even in code (`.skill-bar` ✅, `.cognitive-metric` ❌)
5. **Comments in code** - Keep developer comments clinical if needed, but NO clinical terms in UI strings
6. **Documentation exception** - metrics.js INTERNAL calculations can reference clinical terms in comments, but ZERO clinical terms in UI-facing strings
7. **Future content** - Add validation script to CI/CD to prevent clinical language regression
