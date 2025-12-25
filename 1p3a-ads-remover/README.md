# 1point3acres Ads Remover

A Tampermonkey/Greasemonkey userscript that automatically removes advertisements from 1point3acres.com/bbs/ forum pages.

## Purpose

This userscript enhances your browsing experience on the 1point3acres forum by:

1. **Automatically detecting** and removing ad elements from the page
2. **Hiding ads with CSS** for immediate visual removal
3. **Removing ad elements from DOM** to prevent them from loading
4. **Monitoring dynamic content** to catch ads loaded after page initialization
5. **Providing visual feedback** showing how many ads were removed

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

3. **Visit 1point3acres.com/bbs/** - the script will automatically activate!

## Features

### Core Functionality
- **Automatic Ad Detection**: Scans for common ad patterns and selectors
- **CSS Hiding**: Immediately hides ads using CSS for instant visual removal
- **DOM Removal**: Removes ad elements from the DOM to prevent loading
- **Iframe Blocking**: Removes ad iframes including Google AdSense and DoubleClick
- **Chinese Ad Support**: Detects Chinese ad patterns (广告, 推广)

### Dynamic Content Support
- **MutationObserver**: Watches for new content added to the page
- **Real-time Removal**: Automatically removes ads in dynamically loaded content
- **Periodic Checking**: Fallback mechanism to catch ads that might be missed

### User Interface
- **Success Notification**: Appears in the top-right corner after ad removal
- **Removal Count**: Shows how many ad elements were removed
- **Auto-dismiss**: Notification fades away after 3 seconds
- **Manual Close**: Click the × button to dismiss immediately

### Developer Features
- **Debug Mode**: Comprehensive console logging
- **Configuration Options**: Easy-to-modify settings
- **Extensible Selectors**: Easy to add new ad selectors
- **Clean Code Structure**: Well-organized, documented code

## How It Works

```
Page Load → Initialize Script
     ↓
Apply CSS Rules (Hide Ads)
     ↓
Scan DOM for Ad Elements
     ↓
Remove Ad Elements
     ↓
Show Notification
     ↓
Continue Monitoring (MutationObserver + Periodic Check)
```

## Configuration

Customize behavior by editing the `CONFIG` object in `src/userscript.js`:

```javascript
const CONFIG = {
    debug: true,           // Enable console logging
    autoProcess: true,     // Auto-remove on page load
    removedCount: 0,       // Tracks removed ads
    checkInterval: 1000,   // Check for new ads every 1 second
    maxChecks: 10          // Maximum number of periodic checks
};
```

## Ad Selectors

The script targets common ad patterns including:

- Elements with "ad", "advertisement", "advert" in class/id
- Elements with "广告" (advertisement) or "推广" (promotion) in class/id
- Common ad container classes (`.ad-container`, `.ad-wrapper`, etc.)
- Ad iframes (Google AdSense, DoubleClick, etc.)
- Sidebar, header, and footer ads
- Banner and sponsor elements

You can extend the `adSelectors` array to add site-specific selectors.

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
3. Verify you're on a 1point3acres.com/bbs/ page
4. Open browser console to see debug logs (if debug mode is enabled)

**Ads still appearing?**
- Some ads might use different selectors - check the console for debug info
- Add custom selectors to the `adSelectors` array
- The script uses both CSS hiding and DOM removal for maximum effectiveness

**Want to see debug information?**
- Set `debug: true` in the CONFIG object
- Open browser DevTools (F12) and check the Console tab
- Look for messages prefixed with `[1p3a Ads Remover]`

## Project Structure

```
1p3a-ads-remover/
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

