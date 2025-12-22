# Tampermonkey HTML Processor

A powerful Tampermonkey userscript for processing and extracting information from website HTML. This project provides a comprehensive toolkit for web scraping, DOM manipulation, and data extraction directly in your browser.

## Features

- 🎯 **Easy HTML Extraction** - Extract text, attributes, and structured data from any webpage
- 📊 **Table Parser** - Convert HTML tables into structured JSON data
- 🔗 **Link & Image Extraction** - Automatically gather all links and images from pages
- 📝 **Form Analysis** - Parse form structures and input fields
- 🎨 **Built-in UI Panel** - Control panel for real-time data extraction and export
- 📤 **Data Export** - Export extracted data as JSON files
- ⚡ **Performance Optimized** - Efficient DOM traversal and data processing
- 🛠️ **Extensible Architecture** - Easy to customize for specific websites

## Project Structure

```
tampermonkey-project/
├── src/
│   ├── userscript.js       # Main Tampermonkey script with UI and core logic
│   └── html-parser.js      # HTML parsing utilities and helper functions
├── dist/                   # Build output directory
├── package.json            # NPM configuration and scripts
└── README.md              # This file
```

## Installation

### 1. Install Tampermonkey

First, install the Tampermonkey browser extension:
- [Chrome/Edge](https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo)
- [Firefox](https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/)
- [Safari](https://apps.apple.com/us/app/tampermonkey/id1482490089)

### 2. Install the Userscript

1. Open `src/userscript.js` in your editor
2. Copy the entire contents
3. Click the Tampermonkey icon in your browser → "Create a new script"
4. Paste the code and save (Ctrl+S or Cmd+S)

### 3. Configure for Your Target Website

Edit the `@match` line in the script header to match your target website:

```javascript
// @match        https://example.com/*
```

Replace `example.com` with the domain you want to process.

## Usage

### Basic Usage

Once installed, the script will automatically run on matching pages. A control panel will appear in the bottom-right corner of the page.

**Control Panel Features:**
- **Extract Info** - Extract page information based on configured selectors
- **Export Data** - Download extracted data as a JSON file
- **Clear Log** - Clear the output display

### Configuration

Edit the `CONFIG` object in `userscript.js` to customize behavior:

```javascript
const CONFIG = {
    debug: true,              // Enable console logging
    autoProcess: true,        // Auto-process on page load
    targetSelectors: {
        title: 'h1',          // Selector for page title
        content: '.content',  // Selector for main content
        metadata: '.meta'     // Selector for metadata
    }
};
```

### HTML Parser Utilities

The `html-parser.js` file provides advanced parsing functions:

#### Parse Tables
```javascript
const tableData = HTMLParser.parseTable('#myTable');
// Returns: [{column1: 'value1', column2: 'value2'}, ...]
```

#### Extract Links
```javascript
const links = HTMLParser.extractLinks('.content');
// Returns: [{text: 'Link Text', href: 'url', ...}, ...]
```

#### Parse Lists
```javascript
const listItems = HTMLParser.parseList('ul.items');
// Returns: [{text: 'Item 1', html: '<a>...</a>', links: [...]}, ...]
```

#### Extract Images
```javascript
const images = HTMLParser.extractImages('.gallery');
// Returns: [{src: 'url', alt: 'text', width: 100, height: 100}, ...]
```

#### Parse Forms
```javascript
const formData = HTMLParser.parseForm('#contactForm');
// Returns: {action: '/submit', method: 'POST', fields: [...]}
```

#### Parse Articles
```javascript
const article = HTMLParser.parseArticle({
    title: 'h1.article-title',
    author: '.author-name',
    date: 'time.published',
    content: 'article.content',
    tags: '.tag'
});
// Returns: {title: '...', author: '...', date: '...', content: '...', tags: [...], wordCount: 500}
```

#### Extract All Headings
```javascript
const headings = HTMLParser.extractHeadings();
// Returns: [{level: 1, text: 'Title', id: 'title', tag: 'h1'}, ...]
```

#### Get Page Statistics
```javascript
const stats = HTMLParser.getPageStats();
// Returns: {totalElements: 1234, divs: 456, links: 78, ...}
```

#### Extract Social Media Links
```javascript
const social = HTMLParser.extractSocialLinks();
// Returns: {twitter: [...], facebook: [...], linkedin: [...], ...}
```

#### Create DOM Tree
```javascript
const tree = HTMLParser.createDOMTree(document.querySelector('.container'), 3);
// Returns: {tag: 'div', id: 'container', classes: [...], children: [...]}
```

### Utility Functions

The main script includes utility functions for common tasks:

#### Wait for Element
```javascript
utils.waitForElement('.dynamic-content', 5000)
    .then(element => {
        // Element found, process it
    })
    .catch(error => {
        // Timeout or error
    });
```

#### Extract Text
```javascript
const title = utils.extractText('h1.title');
```

#### Extract Attribute
```javascript
const href = utils.extractAttribute('a.download', 'href');
```

#### Extract All Matching Elements
```javascript
const items = utils.extractAll('.product');
// Returns: [{text: '...', html: '...', attributes: {...}}, ...]
```

## Custom Processing

### Process Specific Elements

```javascript
const results = htmlProcessor.processElements('.product-card', (element, index) => {
    return {
        id: index,
        name: element.querySelector('.name')?.textContent,
        price: element.querySelector('.price')?.textContent,
        image: element.querySelector('img')?.src
    };
});
```

### Extract Structured Data

```javascript
const structuredData = htmlProcessor.extractStructuredData();
// Extracts JSON-LD and other structured data from the page
```

### Export Data

```javascript
const data = {
    url: window.location.href,
    extractedAt: new Date().toISOString(),
    content: { /* your data */ }
};
htmlProcessor.exportData(data, 'my-data.json');
```

## Development

### Prerequisites

```bash
npm install
```

### Available Scripts

- `npm run build` - Concatenate source files
- `npm run watch` - Watch for changes and rebuild
- `npm run lint` - Check code quality
- `npm run format` - Format code with Prettier

### Debugging

Set `CONFIG.debug = true` to enable console logging. All messages will be prefixed with `[HTML Processor]`.

## Examples

### Example 1: Extract Product Information

```javascript
// Add to your userscript
const products = htmlProcessor.processElements('.product', (el) => ({
    name: el.querySelector('.name')?.textContent.trim(),
    price: el.querySelector('.price')?.textContent.trim(),
    rating: el.querySelector('.rating')?.getAttribute('data-rating'),
    image: el.querySelector('img')?.src
}));

console.log(products);
htmlProcessor.exportData({ products }, 'products.json');
```

### Example 2: Monitor Page Changes

```javascript
// Watch for dynamic content
utils.waitForElement('.ajax-loaded-content')
    .then(element => {
        const info = htmlProcessor.extractPageInfo();
        console.log('New content loaded:', info);
    });
```

### Example 3: Extract Article Content

```javascript
const article = HTMLParser.parseArticle({
    title: 'h1.post-title',
    author: '.author-name',
    date: 'time.published',
    content: '.post-content',
    tags: '.tag-list a'
});

console.log(`Article: "${article.title}" by ${article.author}`);
console.log(`Word count: ${article.wordCount}`);
htmlProcessor.exportData(article, `article-${Date.now()}.json`);
```

## Customization Tips

1. **Update Selectors**: Modify `CONFIG.targetSelectors` to match your target website's structure
2. **Add Custom Processors**: Create new functions in `htmlProcessor` for site-specific extraction
3. **Style the UI**: Customize the `GM_addStyle` section to match your preferences
4. **Auto-Processing**: Enable `CONFIG.autoProcess` and add logic in the `init()` function

## Permissions

The script uses these Tampermonkey grants:
- `GM_addStyle` - Inject custom CSS for the UI panel
- `GM_getValue` / `GM_setValue` - Store user preferences (optional)
- `GM_xmlhttpRequest` - Make cross-origin requests (optional)

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari (with Tampermonkey)
- ✅ Opera

## Troubleshooting

**Script not running?**
- Check that the `@match` pattern matches your current URL
- Ensure Tampermonkey is enabled for the site
- Check browser console for errors

**Elements not found?**
- Verify selectors using browser DevTools
- Try `utils.waitForElement()` for dynamically loaded content
- Enable debug mode to see detailed logs

**UI panel not appearing?**
- Check if the site has conflicting CSS
- Adjust the z-index in the styles section
- Verify `GM_addStyle` grant is enabled

## Contributing

Feel free to customize this script for your needs. Common enhancements:
- Add database storage for extracted data
- Implement scheduled/automatic extraction
- Add data transformation pipelines
- Create site-specific extraction profiles

## License

MIT License - Feel free to use and modify for your projects.

## Disclaimer

This tool is for educational and personal use. Always respect website Terms of Service and robots.txt. Be mindful of server load when extracting data at scale.
