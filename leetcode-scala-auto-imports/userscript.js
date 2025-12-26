// ==UserScript==
// @name         LeetCode Scala Auto Imports
// @namespace    http://roman-wang.com/
// @version      1.0
// @description  Automatically add Scala imports to LeetCode code editor
// @author       Roman Wang
// @match        https://leetcode.com/problems/*
// @grant        none
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/RomanWang0x3F/leetcode-scala-auto-imports/main/userscript.js
// @downloadURL  https://raw.githubusercontent.com/RomanWang0x3F/leetcode-scala-auto-imports/main/userscript.js
// ==/UserScript==

(function () {
    'use strict';

    const IMPORTS = `import scala.collection.mutable._
import scala.math._

`;

    // Function to find the code editor
    function findCodeEditor() {
        // LeetCode uses Monaco Editor, which can be accessed via textarea or the editor instance
        // Try multiple selectors to find the editor
        const selectors = [
            'textarea.monaco-mouse-cursor-text',
            'textarea[data-testid="code-editor"]',
            '.monaco-editor textarea',
            'textarea[placeholder*="code"]',
            'textarea[aria-label*="code"]',
            'textarea.ace_text-input'
        ];

        for (const selector of selectors) {
            const editor = document.querySelector(selector);
            if (editor) {
                return editor;
            }
        }

        // Fallback: try to find any textarea in the editor area
        const editorContainer = document.querySelector('[data-testid="code-editor"]') ||
            document.querySelector('.monaco-editor') ||
            document.querySelector('.editor');

        if (editorContainer) {
            const textarea = editorContainer.querySelector('textarea');
            if (textarea) return textarea;
        }

        return null;
    }

    // Function to check if current language is Scala
    function isScalaLanguage() {
        // Check language selector or button
        const langSelectors = [
            '[data-cy="lang-select"]',
            '.lang-select',
            'button[aria-label*="Scala"]', // this works becuase we have a debug button with aria-label="Scala"
            'button[aria-label*="Language"]',
            '.dropdown-toggle[data-toggle="dropdown"]'
        ];

        for (const selector of langSelectors) {
            const elem = document.querySelector(selector);
            if (elem && (elem.textContent.includes('Scala') || elem.getAttribute('aria-label')?.includes('Scala'))) {
                // console.log('Scala language detected with selector:', selector);
                return true;
            }
        }

        // Check URL or page state for Scala
        if (window.location.href.includes('scala') || window.location.href.includes('Scala')) {
            return true;
        }

        return false;
    }

    // Function to add imports if not present
    function addImportsIfNeeded() {
        // First, try to access Monaco Editor API directly
        const monacoEditor = findMonacoEditor();
        if (monacoEditor) {
            try {
                const code = monacoEditor.getValue();

                // Check if imports are already present
                if (code.includes('import scala.collection.mutable._')) {
                    return false; // Already has the imports
                }

                // Add imports at the beginning
                const newCode = IMPORTS + code;
                monacoEditor.setValue(newCode);

                // Set cursor position after imports
                const lines = IMPORTS.split('\n').length - 1;
                monacoEditor.setPosition({ lineNumber: lines, column: 1 });
                monacoEditor.focus();

                return true;
            } catch (e) {
                console.error('Error accessing Monaco Editor:', e);
            }
        }

        // Fallback: try textarea approach
        const editor = findCodeEditor();
        if (!editor) {
            return false;
        }

        // Try to get the editor value
        let code = editor.value || '';

        // Check if imports are already present
        if (code.includes('import scala.collection.mutable._')) {
            return false; // Already has the imports
        }

        // Add imports at the beginning
        const newCode = IMPORTS + code;

        // Set the value
        editor.value = newCode;

        // Trigger input events to notify Monaco Editor
        const events = ['input', 'change', 'keyup'];
        events.forEach(eventType => {
            editor.dispatchEvent(new Event(eventType, { bubbles: true, cancelable: true }));
        });

        // Try InputEvent for better compatibility
        try {
            const inputEvent = new InputEvent('input', {
                bubbles: true,
                cancelable: true,
                inputType: 'insertText'
            });
            editor.dispatchEvent(inputEvent);
        } catch (e) {
            // InputEvent might not be supported in all browsers
        }

        return true;
    }

    // Function to find Monaco Editor instance
    function findMonacoEditor() {
        // Method 1: Try window.monaco API (if available)
        if (window.monaco && window.monaco.editor) {
            try {
                const editors = window.monaco.editor.getEditors();
                if (editors && editors.length > 0) {
                    return editors[0];
                }
            } catch (e) {
                // getEditors might not be available
            }
        }

        // Method 2: Try to find via React Fiber (LeetCode uses React)
        try {
            const reactFiber = findReactFiber();
            if (reactFiber) {
                const editor = findEditorInFiber(reactFiber);
                if (editor) return editor;
            }
        } catch (e) {
            // React Fiber access might fail
        }

        // Method 3: Try to find via Monaco Editor's container
        const editorContainer = document.querySelector('.monaco-editor');
        if (editorContainer) {
            // Monaco Editor instances might be attached to the container
            for (let key in editorContainer) {
                if (editorContainer[key] &&
                    typeof editorContainer[key].getValue === 'function' &&
                    typeof editorContainer[key].setValue === 'function') {
                    return editorContainer[key];
                }
            }
        }

        return null;
    }

    // Helper to find React Fiber node
    function findReactFiber() {
        const editorContainer = document.querySelector('.monaco-editor') ||
            document.querySelector('[data-testid="code-editor"]');
        if (!editorContainer) return null;

        for (let key in editorContainer) {
            if (key.startsWith('__reactInternalInstance') ||
                key.startsWith('__reactFiber')) {
                return editorContainer[key];
            }
        }
        return null;
    }

    // Helper to find editor in React Fiber tree
    function findEditorInFiber(fiber, depth = 0) {
        if (!fiber || depth > 10) return null; // Limit depth to avoid infinite loops

        // Check current node's state
        if (fiber.memoizedState) {
            const state = fiber.memoizedState;
            if (state && state.editor && typeof state.editor.getValue === 'function') {
                return state.editor;
            }
            // Check nested state
            if (state && state.current && state.current.getValue) {
                return state.current;
            }
        }

        // Check props
        if (fiber.memoizedProps) {
            const props = fiber.memoizedProps;
            if (props.editor && typeof props.editor.getValue === 'function') {
                return props.editor;
            }
            if (props.value !== undefined && props.onChange) {
                // This might be the editor component
            }
        }

        // Traverse children and siblings
        let child = fiber.child;
        while (child) {
            const result = findEditorInFiber(child, depth + 1);
            if (result) return result;
            child = child.sibling;
        }

        return null;
    }

    // Main function to inject imports
    function injectImports() {
        // Check if language is Scala
        if (!isScalaLanguage()) {
            // Still try to inject if we can't detect language (might be Scala but selector not found)
            // We'll proceed anyway
        }

        // Add imports
        const added = addImportsIfNeeded();

        if (added) {
            console.log('Scala imports added successfully');
        }
    }

    // Observe for code editor appearance/changes
    function setupObserver() {
        // Try immediately
        injectImports();

        // Use MutationObserver to watch for DOM changes
        const observer = new MutationObserver(function (mutations) {
            // Debounce: only run after a short delay
            clearTimeout(window.leetcodeScalaImportTimeout);
            window.leetcodeScalaImportTimeout = setTimeout(() => {
                injectImports();
            }, 500);
        });

        // Observe the document body for changes
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: true,
            attributeFilter: ['class', 'data-testid']
        });

        // Also listen for language change events
        document.addEventListener('click', function (e) {
            // If clicking on language selector, wait a bit then inject
            if (e.target.closest('[data-cy="lang-select"]') ||
                e.target.closest('.lang-select') ||
                e.target.closest('button[aria-label*="Language"]')) {
                setTimeout(() => {
                    injectImports();
                }, 1000);
            }
        });

        // Listen for hash change (LeetCode uses hash routing sometimes)
        window.addEventListener('hashchange', () => {
            setTimeout(() => injectImports(), 1000);
        });
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', setupObserver);
    } else {
        setupObserver();
    }

    // Also try after a delay to catch late-loading editors
    setTimeout(setupObserver, 2000);
    setTimeout(setupObserver, 5000);

})();
