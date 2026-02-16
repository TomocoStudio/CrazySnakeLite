# Epic 20 Test Screenshots

## How to Capture Screenshots

### macOS
- **Full Screen:** `Cmd + Shift + 3`
- **Selection:** `Cmd + Shift + 4` (drag to select area)
- **Window:** `Cmd + Shift + 4`, then press `Space`, click window

### Windows
- **Full Screen:** `PrtScn` or `Win + PrtScn`
- **Active Window:** `Alt + PrtScn`
- **Snipping Tool:** `Win + Shift + S`

### Browser DevTools
- Right-click canvas → "Capture node screenshot" (saves PNG)

---

## Required Screenshots

### Background Tiers (6 screenshots)
- `tier-0-score-0.png` - Score 0-14, background #e8e8e8 (light grey)
- `tier-1-score-15.png` - Score 15-29, background #d0d0d0
- `tier-2-score-30.png` - Score 30-49, background #b8b8b8
- `tier-3-score-50.png` - Score 50-74, background #808080
- `tier-4-score-75.png` - Score 75-99, background #505050
- `tier-5-score-100.png` - Score 100+, background #1a1a1a (near-black)

**Tips:**
- Capture when score is at the tier threshold (15, 30, 50, 75, 100)
- Include score display in screenshot
- Verify grid opacity is also fading in each screenshot

---

### Border States (5 screenshots)
- `border-death.png` - Death flash (red border for 500ms)
- `border-phone-ring.png` - Phone call active (gold border)
- `border-phone-pickup.png` - Phone answered (green border during timer)
- `border-combo.png` - Combo mode active (purple/blue/red/green border)
- `border-effects.png` - Effects active (orange RC, yellow invincibility)

**Tips:**
- Use browser's screenshot tool to capture exact moment
- For death flash, be quick! It only lasts 500ms
- Include any active UI elements (phone overlay, etc.)

---

### Performance Screenshots (optional)
- `devtools-fps.png` - Performance tab showing FPS during transition
- `devtools-gpu.png` - Rendering tab with paint flashing disabled (no green)
- `devtools-memory.png` - Memory tab heap snapshots comparison

---

## Screenshot Best Practices

1. **Consistency:** Use same browser zoom level for all screenshots
2. **Clarity:** Capture at 1920x1080 or higher resolution
3. **Context:** Include score display and any relevant UI
4. **Timing:** Capture after transition completes (not mid-fade)
5. **Naming:** Use exact names from checklist for easy verification

---

## After Capturing

1. Save all screenshots to this directory
2. Reference them in `epic-20-test-report.md`
3. Check off screenshot checklist in test report
4. Upload screenshots if sharing test results

---

## Example Screenshot Layout

```
📁 screenshots/
├── tier-0-score-0.png         ✓
├── tier-1-score-15.png        ✓
├── tier-2-score-30.png        ✓
├── tier-3-score-50.png        ✓
├── tier-4-score-75.png        ✓
├── tier-5-score-100.png       ✓
├── border-death.png           ✓
├── border-phone-ring.png      ✓
├── border-phone-pickup.png    ✓
├── border-combo.png           ✓
├── border-effects.png         ✓
├── devtools-fps.png           (optional)
├── devtools-gpu.png           (optional)
└── devtools-memory.png        (optional)
```

---

## Questions?

- See `TESTING-GUIDE.md` for full testing instructions
- See `epic-20-test-report.md` for where to record results
