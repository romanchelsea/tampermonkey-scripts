/**
 * HTML Parser Utilities
 * Advanced functions for parsing and extracting information from HTML
 */

const HTMLParser = {
    /**
     * Parse table data into structured format
     * @param {string} tableSelector - CSS selector for the table
     * @returns {Array} Array of objects representing table rows
     */
    parseTable: (tableSelector) => {
        const table = document.querySelector(tableSelector);
        if (!table) return [];

        const headers = Array.from(table.querySelectorAll('thead th, thead td'))
            .map(th => th.textContent.trim());

        const rows = Array.from(table.querySelectorAll('tbody tr'));
        return rows.map(row => {
            const cells = Array.from(row.querySelectorAll('td, th'));
            const rowData = {};
            cells.forEach((cell, index) => {
                const key = headers[index] || `column_${index}`;
                rowData[key] = cell.textContent.trim();
            });
            return rowData;
        });
    },

    /**
     * Parse list items into array
     * @param {string} listSelector - CSS selector for ul/ol
     * @returns {Array} Array of list items
     */
    parseList: (listSelector) => {
        const list = document.querySelector(listSelector);
        if (!list) return [];

        return Array.from(list.querySelectorAll('li')).map(li => ({
            text: li.textContent.trim(),
            html: li.innerHTML,
            links: Array.from(li.querySelectorAll('a')).map(a => ({
                text: a.textContent.trim(),
                href: a.href
            }))
        }));
    },

    /**
     * Extract all links from page or specific container
     * @param {string} containerSelector - Optional container selector
     * @returns {Array} Array of link objects
     */
    extractLinks: (containerSelector = 'body') => {
        const container = document.querySelector(containerSelector);
        if (!container) return [];

        return Array.from(container.querySelectorAll('a')).map(a => ({
            text: a.textContent.trim(),
            href: a.href,
            title: a.title,
            target: a.target
        })).filter(link => link.href);
    },

    /**
     * Extract all images from page or specific container
     * @param {string} containerSelector - Optional container selector
     * @returns {Array} Array of image objects
     */
    extractImages: (containerSelector = 'body') => {
        const container = document.querySelector(containerSelector);
        if (!container) return [];

        return Array.from(container.querySelectorAll('img')).map(img => ({
            src: img.src,
            alt: img.alt,
            title: img.title,
            width: img.width,
            height: img.height
        }));
    },

    /**
     * Parse forms and their inputs
     * @param {string} formSelector - CSS selector for the form
     * @returns {Object} Form data structure
     */
    parseForm: (formSelector) => {
        const form = document.querySelector(formSelector);
        if (!form) return null;

        const inputs = Array.from(form.querySelectorAll('input, select, textarea'));
        const formData = {
            action: form.action,
            method: form.method,
            fields: inputs.map(input => ({
                name: input.name,
                type: input.type,
                value: input.value,
                placeholder: input.placeholder,
                required: input.required
            }))
        };

        return formData;
    },

    /**
     * Extract breadcrumb navigation
     * @param {string} breadcrumbSelector - CSS selector for breadcrumb container
     * @returns {Array} Array of breadcrumb items
     */
    parseBreadcrumbs: (breadcrumbSelector) => {
        const breadcrumb = document.querySelector(breadcrumbSelector);
        if (!breadcrumb) return [];

        return Array.from(breadcrumb.querySelectorAll('a, span')).map(item => ({
            text: item.textContent.trim(),
            href: item.href || null,
            isActive: item.classList.contains('active')
        }));
    },

    /**
     * Extract definition lists (dl, dt, dd)
     * @param {string} dlSelector - CSS selector for dl element
     * @returns {Object} Key-value pairs from definition list
     */
    parseDefinitionList: (dlSelector) => {
        const dl = document.querySelector(dlSelector);
        if (!dl) return {};

        const result = {};
        let currentKey = null;

        Array.from(dl.children).forEach(child => {
            if (child.tagName === 'DT') {
                currentKey = child.textContent.trim();
                result[currentKey] = [];
            } else if (child.tagName === 'DD' && currentKey) {
                result[currentKey].push(child.textContent.trim());
            }
        });

        return result;
    },

    /**
     * Extract code blocks from page
     * @param {string} codeSelector - CSS selector for code blocks
     * @returns {Array} Array of code snippets
     */
    extractCodeBlocks: (codeSelector = 'pre code, pre, code') => {
        return Array.from(document.querySelectorAll(codeSelector)).map((code, index) => ({
            index,
            language: code.className.match(/language-(\w+)/)?.[1] || 'unknown',
            content: code.textContent,
            lines: code.textContent.split('\n').length
        }));
    },

    /**
     * Parse article content with metadata
     * @param {Object} selectors - Selectors for article elements
     * @returns {Object} Article data
     */
    parseArticle: (selectors = {}) => {
        const defaults = {
            title: 'h1',
            author: '.author',
            date: '.date, time',
            content: 'article, .content',
            tags: '.tags a, .tag'
        };

        const sels = { ...defaults, ...selectors };

        return {
            title: document.querySelector(sels.title)?.textContent.trim(),
            author: document.querySelector(sels.author)?.textContent.trim(),
            date: document.querySelector(sels.date)?.textContent.trim(),
            content: document.querySelector(sels.content)?.textContent.trim(),
            tags: Array.from(document.querySelectorAll(sels.tags))
                .map(tag => tag.textContent.trim()),
            wordCount: document.querySelector(sels.content)?.textContent.trim().split(/\s+/).length || 0
        };
    },

    /**
     * Extract social media links
     * @returns {Object} Social media links by platform
     */
    extractSocialLinks: () => {
        const links = Array.from(document.querySelectorAll('a'));
        const social = {
            twitter: [],
            facebook: [],
            linkedin: [],
            instagram: [],
            youtube: [],
            github: [],
            other: []
        };

        links.forEach(link => {
            const href = link.href.toLowerCase();
            if (href.includes('twitter.com') || href.includes('x.com')) {
                social.twitter.push(link.href);
            } else if (href.includes('facebook.com')) {
                social.facebook.push(link.href);
            } else if (href.includes('linkedin.com')) {
                social.linkedin.push(link.href);
            } else if (href.includes('instagram.com')) {
                social.instagram.push(link.href);
            } else if (href.includes('youtube.com')) {
                social.youtube.push(link.href);
            } else if (href.includes('github.com')) {
                social.github.push(link.href);
            }
        });

        return social;
    },

    /**
     * Extract all headings with hierarchy
     * @returns {Array} Array of heading objects with levels
     */
    extractHeadings: () => {
        const headings = Array.from(document.querySelectorAll('h1, h2, h3, h4, h5, h6'));
        return headings.map(heading => ({
            level: parseInt(heading.tagName.charAt(1)),
            text: heading.textContent.trim(),
            id: heading.id,
            tag: heading.tagName.toLowerCase()
        }));
    },

    /**
     * Create a DOM tree structure
     * @param {HTMLElement} element - Root element to parse
     * @param {number} maxDepth - Maximum depth to traverse
     * @returns {Object} Tree structure
     */
    createDOMTree: (element, maxDepth = 5, currentDepth = 0) => {
        if (!element || currentDepth >= maxDepth) return null;

        const tree = {
            tag: element.tagName?.toLowerCase(),
            id: element.id || null,
            classes: Array.from(element.classList || []),
            text: element.childNodes.length === 1 && element.childNodes[0].nodeType === 3
                ? element.textContent.trim()
                : null,
            children: []
        };

        if (element.children) {
            Array.from(element.children).forEach(child => {
                const childTree = HTMLParser.createDOMTree(child, maxDepth, currentDepth + 1);
                if (childTree) {
                    tree.children.push(childTree);
                }
            });
        }

        return tree;
    },

    /**
     * Get element statistics
     * @returns {Object} Statistics about page elements
     */
    getPageStats: () => {
        return {
            totalElements: document.querySelectorAll('*').length,
            divs: document.querySelectorAll('div').length,
            spans: document.querySelectorAll('span').length,
            links: document.querySelectorAll('a').length,
            images: document.querySelectorAll('img').length,
            forms: document.querySelectorAll('form').length,
            inputs: document.querySelectorAll('input').length,
            buttons: document.querySelectorAll('button').length,
            tables: document.querySelectorAll('table').length,
            scripts: document.querySelectorAll('script').length,
            styles: document.querySelectorAll('style, link[rel="stylesheet"]').length
        };
    }
};

// Export for use in userscript
if (typeof module !== 'undefined' && module.exports) {
    module.exports = HTMLParser;
}
