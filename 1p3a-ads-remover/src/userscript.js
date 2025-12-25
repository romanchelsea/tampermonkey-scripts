// ==UserScript==
// @name         1point3acres Ads Remover
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Remove ads from 1point3acres.com/bbs/
// @author       Roman Wang
// @match        https://www.1point3acres.com/bbs/*
// @match        https://*.1point3acres.com/bbs/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=1point3acres.com
// @grant        GM_addStyle
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        debug: true,
        autoProcess: true,
        removedCount: 0,
        checkInterval: 1000, // Check for new ads every 1 second
        maxChecks: 10 // Maximum number of checks after page load
    };

    // Utility Functions
    const utils = {
        log: (message, data = null) => {
            if (CONFIG.debug) {
                console.log(`[1p3a Ads Remover] ${message}`, data || '');
            }
        },

        error: (message, error = null) => {
            console.error(`[1p3a Ads Remover] ${message}`, error || '');
        }
    };

    // Common ad selectors - can be extended as needed
    const adSelectors = [
        // Common ad class/ID patterns
        '[class*="ad"]',
        '[class*="advertisement"]',
        '[class*="advert"]',
        '[id*="ad"]',
        '[id*="advertisement"]',
        '[id*="advert"]',
        '[class*="banner"]',
        '[id*="banner"]',
        '[class*="sponsor"]',
        '[id*="sponsor"]',
        '[class*="promo"]',
        '[id*="promo"]',
        
        // Common ad container patterns
        '.ad-container',
        '.ad-wrapper',
        '.ad-box',
        '.advertisement-container',
        '.ads-container',
        '.ads-wrapper',
        '#ad-container',
        '#ad-wrapper',
        '#ad-box',
        
        // Iframe ads
        'iframe[src*="ad"]',
        'iframe[src*="ads"]',
        'iframe[src*="advertisement"]',
        'iframe[src*="doubleclick"]',
        'iframe[src*="googlead"]',
        
        // Common Chinese ad patterns (1point3acres specific)
        '[class*="广告"]',
        '[id*="广告"]',
        '[class*="推广"]',
        '[id*="推广"]',
        
        // Sidebar and header ads
        '.sidebar-ad',
        '.header-ad',
        '.footer-ad',
        '.top-ad',
        '.bottom-ad',
        
        // Specific to common forum structures
        '.ad-block',
        '.ad-unit',
        '.ad-slot',
        '[data-ad]',
        '[data-ad-slot]'
    ];

    // Ad Removal Functions
    const adRemover = {
        // Remove ads by selector
        removeAdsBySelector: (selector) => {
            try {
                const elements = document.querySelectorAll(selector);
                let removed = 0;
                
                elements.forEach((element) => {
                    // Check if element is visible and likely an ad
                    const rect = element.getBoundingClientRect();
                    const isVisible = rect.width > 0 && rect.height > 0;
                    
                    if (isVisible || selector.includes('iframe')) {
                        // Check if it's likely an ad by checking parent/child relationships
                        const hasAdInClass = element.className && 
                            (element.className.toLowerCase().includes('ad') || 
                             element.className.toLowerCase().includes('广告') ||
                             element.className.toLowerCase().includes('推广'));
                        const hasAdInId = element.id && 
                            (element.id.toLowerCase().includes('ad') || 
                             element.id.toLowerCase().includes('广告') ||
                             element.id.toLowerCase().includes('推广'));
                        
                        if (hasAdInClass || hasAdInId || selector.includes('iframe') || selector.includes('ad')) {
                            element.remove();
                            removed++;
                            utils.log(`Removed ad element: ${selector}`);
                        }
                    }
                });
                
                return removed;
            } catch (error) {
                utils.error(`Error removing ads with selector ${selector}:`, error);
                return 0;
            }
        },

        // Remove all ads
        removeAllAds: () => {
            utils.log('Starting ad removal process...');
            let totalRemoved = 0;

            adSelectors.forEach((selector) => {
                const removed = adRemover.removeAdsBySelector(selector);
                totalRemoved += removed;
            });

            CONFIG.removedCount += totalRemoved;
            if (totalRemoved > 0) {
                utils.log(`Removed ${totalRemoved} ad elements. Total: ${CONFIG.removedCount}`);
            }
            
            return totalRemoved;
        },

        // Watch for dynamically added ads
        observeAndRemove: () => {
            const observer = new MutationObserver((mutations) => {
                let shouldCheck = false;
                
                mutations.forEach((mutation) => {
                    if (mutation.addedNodes.length) {
                        mutation.addedNodes.forEach((node) => {
                            if (node.nodeType === 1) { // Element node
                                const element = node;
                                // Check if the added node or its children might be ads
                                if (element.className && (
                                    element.className.toLowerCase().includes('ad') ||
                                    element.className.toLowerCase().includes('广告') ||
                                    element.className.toLowerCase().includes('推广')
                                )) {
                                    shouldCheck = true;
                                } else if (element.id && (
                                    element.id.toLowerCase().includes('ad') ||
                                    element.id.toLowerCase().includes('广告') ||
                                    element.id.toLowerCase().includes('推广')
                                )) {
                                    shouldCheck = true;
                                } else if (element.tagName === 'IFRAME') {
                                    shouldCheck = true;
                                } else if (element.querySelector && (
                                    element.querySelector('iframe') ||
                                    element.querySelector('[class*="ad"]') ||
                                    element.querySelector('[id*="ad"]')
                                )) {
                                    shouldCheck = true;
                                }
                            }
                        });
                    }
                });

                if (shouldCheck) {
                    utils.log('New content detected, checking for ads...');
                    setTimeout(() => adRemover.removeAllAds(), 100);
                }
            });

            observer.observe(document.body, {
                childList: true,
                subtree: true,
                attributes: true,
                attributeFilter: ['class', 'id']
            });

            utils.log('DOM observer activated for dynamic ad removal');
        },

        // Periodic check for ads (fallback)
        periodicCheck: () => {
            let checkCount = 0;
            const interval = setInterval(() => {
                checkCount++;
                const removed = adRemover.removeAllAds();
                
                if (checkCount >= CONFIG.maxChecks) {
                    clearInterval(interval);
                    utils.log('Periodic check completed');
                }
            }, CONFIG.checkInterval);
        }
    };

    // UI Components
    const ui = {
        // Create status notification
        showNotification: (removedCount) => {
            if (removedCount === 0) return;
            
            const notification = document.createElement('div');
            notification.id = '1p3a-ads-remover-notification';
            notification.innerHTML = `
                <div class="notification-content">
                    <strong>✓ Ads Removed</strong>
                    <p>Removed ${removedCount} ad element${removedCount !== 1 ? 's' : ''}</p>
                    <button id="close-notification">×</button>
                </div>
            `;
            document.body.appendChild(notification);

            // Auto-hide after 3 seconds
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            }, 3000);

            document.getElementById('close-notification')?.addEventListener('click', () => {
                notification.style.opacity = '0';
                setTimeout(() => notification.remove(), 300);
            });
        }
    };

    // Styles - Hide ads with CSS as well
    GM_addStyle(`
        /* Hide common ad patterns */
        [class*="ad"],
        [id*="ad"],
        [class*="advertisement"],
        [id*="advertisement"],
        [class*="广告"],
        [id*="广告"],
        [class*="推广"],
        [id*="推广"],
        .ad-container,
        .ad-wrapper,
        .ad-box,
        .advertisement-container,
        .ads-container,
        .ads-wrapper,
        .ad-block,
        .ad-unit,
        .ad-slot,
        .sidebar-ad,
        .header-ad,
        .footer-ad,
        .top-ad,
        .bottom-ad,
        iframe[src*="ad"],
        iframe[src*="ads"],
        iframe[src*="advertisement"],
        iframe[src*="doubleclick"],
        iframe[src*="googlead"] {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            height: 0 !important;
            width: 0 !important;
            overflow: hidden !important;
        }

        /* Notification styles */
        #1p3a-ads-remover-notification {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 280px;
            background: #fff;
            border-left: 4px solid #4CAF50;
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
        utils.log('1point3acres Ads Remover initialized');
        
        // Remove existing ads
        const removed = adRemover.removeAllAds();
        
        // Show notification if ads were removed
        if (removed > 0) {
            ui.showNotification(removed);
        }
        
        // Start observing for dynamic content
        adRemover.observeAndRemove();
        
        // Start periodic check as fallback
        adRemover.periodicCheck();
    };

    // Wait for page to be fully loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();

