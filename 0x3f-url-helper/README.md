# LeetCode CN to COM Link Converter

A Tampermonkey/Greasemonkey userscript that automatically converts LeetCode.cn links to LeetCode.com within unordered lists on LeetCode.cn pages.

## Purpose

This userscript helps users seamlessly redirect from LeetCode's Chinese site (leetcode.cn) to the international site (leetcode.com). When browsing LeetCode.cn pages that contain problem links, this script:

1. **Automatically detects** all LeetCode.cn links within unordered lists
2. **Converts** them to their LeetCode.com equivalents
3. **Provides visual feedback** with an orange underline on converted links
4. **Shows a notification** indicating how many links were converted
5. **Monitors dynamically loaded content** to convert new links as they appear

## Installation

1. **Install a userscript manager:**
   - [Tampermonkey](https://www.tampermonkey.net/) (recommended - works on Chrome, Firefox, Edge, Safari, Opera)
   - [Greasemonkey](https://www.greasespot.net/) (Firefox only)
   - [Violentmonkey](https://violentmonkey.github.io/) (Chrome, Firefox, Edge)

2. **Add the userscript:**
   - Open Tampermonkey dashboard
   - Click "Create a new script"
   - Copy the contents of `src/userscript.js`
   - Save the script

3. **Visit LeetCode.cn** - the script will automatically activate!

## Features

### Core Functionality
- **Automatic Link Detection**: Scans all `<ul>` elements on the page for LeetCode.cn links
- **URL Conversion**: Replaces `leetcode.cn` with `leetcode.com` in href attributes
- **Visual Indicators**: Adds a 2px orange bottom border to converted links
- **Tooltip**: Hover over converted links to see the original URL

### Dynamic Content Support
- **MutationObserver**: Watches for new content added to the page
- **Real-time Conversion**: Automatically converts links in dynamically loaded lists
- **Efficient Processing**: Only triggers when new unordered lists are detected

### User Interface
- **Success Notification**: Appears in the top-right corner after conversion
- **Conversion Count**: Shows how many links were converted
- **Auto-dismiss**: Notification fades away after 5 seconds
- **Manual Close**: Click the × button to dismiss immediately

### Developer Features
- **Debug Mode**: Comprehensive console logging
- **Configuration Options**: Easy-to-modify settings
- **Clean Code Structure**: Well-organized, documented code

## How It Works

```
Page Load → Initialize Script
     ↓
Find All <ul> Elements
     ↓
Scan for Links Containing "leetcode.cn"
     ↓
Convert to "leetcode.com"
     ↓
Apply Visual Styling (orange underline)
     ↓
Show Notification
     ↓
Continue Monitoring (MutationObserver)
```

## Configuration

Customize behavior by editing the `CONFIG` object in `src/userscript.js`:

```javascript
const CONFIG = {
    debug: true,           // Enable console logging
    autoProcess: true,     // Auto-convert on page load
    convertedCount: 0      // Tracks converted links
};
```

## Example

**Before:**
```html
<ul>
  <li><a href="https://leetcode.cn/problems/two-sum/">Two Sum</a></li>
  <li><a href="https://leetcode.cn/problems/add-two-numbers/">Add Two Numbers</a></li>
</ul>
```

**After:**
```html
<ul>
  <li><a href="https://leetcode.com/problems/two-sum/" style="border-bottom: 2px solid #FFA116;" title="Converted from: https://leetcode.cn/problems/two-sum/">Two Sum</a></li>
  <li><a href="https://leetcode.com/problems/add-two-numbers/" style="border-bottom: 2px solid #FFA116;" title="Converted from: https://leetcode.cn/problems/add-two-numbers/">Add Two Numbers</a></li>
</ul>
```

## Browser Compatibility

| Browser | Status |
|---------|--------|
| Chrome | ✅ Supported |
| Firefox | ✅ Supported |
| Edge | ✅ Supported |
| Safari | ✅ Supported |
| Opera | ✅ Supported |

## Troubleshooting

**Script not working?**
1. Ensure Tampermonkey is enabled
2. Check that the script is enabled in Tampermonkey dashboard
3. Verify you're on a leetcode.cn page
4. Open browser console to see debug logs (if debug mode is enabled)

**Links not converting?**
- Make sure links are inside `<ul>` elements (unordered lists)
- The script only converts links that contain "leetcode.cn"

**Want to see debug information?**
- Set `debug: true` in the CONFIG object
- Open browser DevTools (F12) and check the Console tab

## Project Structure

```
0x3f-helper/
├── README.md           # This file
└── src/
    └── userscript.js   # Main userscript
```

## Author

Roman Wang

## License

MIT

## Version

**1.0.0** - Initial release
