# Photo Adjuster Guide - DJ Appz Website

## Overview
The photo adjuster allows you to fine-tune how service card images display on the website. All adjustments are stored in `src/imageConfig.js` which can be version-controlled and deployed.

---

## 🎯 How to Use

### Step 1: View Services Page
1. Go to http://localhost:3000
2. Click **"SERVICES"** in the navigation menu or **"VIEW SERVICES →"** button
3. You should see 4 service cards:
   - Private Events
   - Weddings  
   - Corporate
   - Club & Bar

### Step 2: Show Configuration
1. At the top of the Services section, click **"Show Config"**
2. You'll see a JSON display of current image positioning values
3. This will update in real-time as you adjust sliders

### Step 3: Adjust Individual Service Images
For each service card, you'll see:

**▶ Image Adjuster** (click to expand)

Then adjust these sliders:

| Slider | Range | Purpose |
|--------|-------|---------|
| **X Position** | 0-100% | Horizontal positioning (0=left, 50=center, 100=right) |
| **Y Position** | 0-100% | Vertical positioning (0=top, 50=center, 100=bottom) |
| **Scale** | 50%-200% | Zoom level (50%=zoomed out, 100%=normal, 200%=zoomed in) |

### Step 4: Fine-Tune Values

**For Private Events Photo:**
- Adjust to show the best part of the event
- Typical: x: 50, y: 40-50, scale: 1-1.2

**For Wedding Photo:**
- Focus on couple/ceremony moment
- Typical: x: 50, y: 45-55, scale: 1-1.1

**For Corporate Photo:**
- Show professional DJ setup
- Typical: x: 50, y: 50, scale: 1-1.1

**For Club/Bar Photo:**
- Emphasize crowd energy
- Typical: x: 50, y: 50-60, scale: 1.1-1.2

### Step 5: Save Configuration

1. Once you're happy with all adjustments, click "Show Config" to display the JSON
2. **Copy the entire JSON output** (you can select and Ctrl+C)
3. Open `src/imageConfig.js` in your code editor
4. Replace the `export const IMAGE_POSITIONS = { ... }` section with your new values
5. Keep the comment lines at the top

Example format:
```javascript
export const IMAGE_POSITIONS = {
  private: {
    x: 50,
    y: 40,
    scale: 1.1,
  },
  wedding: {
    x: 50,
    y: 45,
    scale: 1.05,
  },
  // ... etc
};
```

### Step 6: Commit and Deploy

```bash
cd C:\Users\jesse\djappz
git add src/imageConfig.js
git commit -m "Optimize image positioning for service cards"
git push origin master
```

---

## 📊 Adjustment Tips

| Issue | Solution |
|-------|----------|
| Image shows too much empty space | Increase **Scale** |
| Image is cut off | Decrease **Scale** |
| Image is too far left | Increase **X Position** |
| Image is too far right | Decrease **X Position** |
| Image is too high | Increase **Y Position** |
| Image is too low | Decrease **Y Position** |
| Image looks dark | Increase **Y Position** (move down) |
| Image looks washed out | Decrease **Y Position** (move up) |

---

## 💾 Quick Save Checklist

- [ ] Adjusted all 4 service images to look good
- [ ] Clicked "Show Config" to see final values
- [ ] Copied the JSON configuration
- [ ] Updated `src/imageConfig.js` with new values
- [ ] Saved the file
- [ ] Committed changes: `git commit -m "..."`
- [ ] Pushed to remote: `git push origin master`
- [ ] Verified on live site (after deployment)

---

## 🔄 Reverting Changes

If you need to revert to previous settings:
1. Check git history: `git log --oneline src/imageConfig.js`
2. View previous version: `git show COMMIT_ID:src/imageConfig.js`
3. Copy those values back and commit again

---

## 📝 Notes

- The interactive photo adjuster panel only appears on **desktop view** (not mobile)
- All changes are stored in `src/imageConfig.js` - this is the source of truth
- The configuration is loaded by `src/App.js` on page load
- Each service has independent positioning settings
- Changes are instant - no page reload needed while adjusting

