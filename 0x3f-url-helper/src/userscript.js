// ==UserScript==
// @name         LeetCode CN to COM Link Converter
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Convert LeetCode.cn links to LeetCode.com in unordered lists
// @author       Roman Wang
// @match        https://leetcode.cn/*
// @match        https://*.leetcode.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=leetcode.cn
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        debug: true,
        autoProcess: true,
        convertedCount: 0
    };

    // Utility Functions
    const utils = {
        log: (message, data = null) => {
            if (CONFIG.debug) {
                console.log(`[LeetCode Converter] ${message}`, data || '');
            }
        },

        error: (message, error = null) => {
            console.error(`[LeetCode Converter] ${message}`, error || '');
        }
    };

    // Link Conversion Functions
    const linkConverter = {
        // Convert leetcode.cn URL to leetcode.com for problem links
        convertUrl: (url) => {
            if (url.includes('leetcode.cn/problems/')) {
                return url.replace(/leetcode\.cn/g, 'leetcode.com');
            }
            return url;
        },

        // Find and convert all links in unordered lists
        convertLinksInLists: () => {
            utils.log('Starting link conversion process...');
            let convertedCount = 0;

            // Find all unordered lists
            const lists = document.querySelectorAll('ul');
            utils.log(`Found ${lists.length} unordered lists`);

            lists.forEach((list, listIndex) => {
                // Find all links within each list
                const links = list.querySelectorAll('a');
                
                links.forEach((link) => {
                    const originalHref = link.href;
                    
                    // Check if the link contains leetcode.cn/problems/
                    if (originalHref && originalHref.includes('leetcode.cn/problems/')) {
                        const newHref = linkConverter.convertUrl(originalHref);
                        link.href = newHref;
                        
                        // Visual indicator: add a class or style
                        link.style.borderBottom = '2px solid #FFA116';
                        link.title = `Converted from: ${originalHref}`;
                        
                        convertedCount++;
                        utils.log(`Converted: ${originalHref} → ${newHref}`);
                    }
                });
            });

            CONFIG.convertedCount = convertedCount;
            utils.log(`Conversion complete! Total links converted: ${convertedCount}`);
            
            return convertedCount;
        },

        // Watch for dynamically added content
        observeAndConvert: () => {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        // Check if any new nodes contain unordered lists
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) { // Element node
                                if (node.tagName === 'UL' || node.querySelector('ul')) {
                                    utils.log('New list detected, converting links...');
                                    linkConverter.convertLinksInLists();
                                }
                            }
                        });
                    }
                });
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true
            });

            utils.log('DOM observer activated for dynamic content');
        }
    };

    // UI Components
    const ui = {
        // Create status notification
        showNotification: () => {
            const notification = document.createElement('div');
            notification.id = 'leetcode-converter-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <strong>✓ LeetCode Link Converter Active</strong>
                    <p>Converted ${CONFIG.convertedCount} links from .cn to .com</p>
                    <button id="close-notification">×</button>
                </div>
            `;
            document.body.appendChild(notification);

            // Auto-hide after 5 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 5000);

            document.getElementById('close-notification')?.addEventListener('click', () => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            });
        }
    };

    // Styles
    GM_addStyle(`
        #leetcode-converter-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 320px;
            background: #fff;
            border-left: 4px solid #FFA116;
            border-radius: 4px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 10000;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            opacity: 1;
            transition: opacity 0.3s ease;
        }

        .notification-content {
            padding: 16px;
            position: relative;
        }

        .notification-content strong {
            display: block;
            color: #333;
            font-size: 14px;
            margin-bottom: 8px;
        }

        .notification-content p {
            margin: 0;
            color: #666;
            font-size: 13px;
        }

        #close-notification {
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            color: #999;
            font-size: 24px;
            cursor: pointer;
            padding: 0;
            width: 24px;
            height: 24px;
            line-height: 20px;
        }

        #close-notification:hover {
            color: #333;
        }
    `);

    // Initialize
    const init = () => {
        utils.log('LeetCode Link Converter initialized');
        
        // Convert existing links
        const count = linkConverter.convertLinksInLists();
        
        // Show notification if links were converted
        if (count > 0) {
            ui.showNotification();
        }
        
        // Start observing for dynamic content
        linkConverter.observeAndConvert();
    };

    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
