/**
 * Python Language Module - Keywords
 * Defines keywords and sidebar configuration for Python
 */

(function() {
    // Ensure namespace exists
    window.Languages = window.Languages || {};
    window.Languages.Python = window.Languages.Python || {};

    /**
     * Python Keywords
     */
    const KEYWORDS = [
        // Control Flow
        'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'pass',
        'match', 'case',  // Python 3.10+ structural pattern matching
        'try', 'except', 'finally', 'raise', 'with', 'as',
        // Functions & Classes
        'def', 'return', 'yield', 'lambda', 'class',
        // Imports
        'import', 'from', 'as',
        // Logical
        'and', 'or', 'not', 'in', 'is',
        // Values
        'True', 'False', 'None',
        // Other
        'global', 'nonlocal', 'del', 'assert'
    ];

    /**
     * Sidebar Configuration
     * Categories of keywords displayed in the sidebar
     * Format matches GLOSSA for compatibility with main.js generateKeywordSidebar()
     */
    const SIDEBAR_CONFIG = [
        {
            id: 'structure',
            title: '🏗️ Structure',
            keywords: [
                { text: '🆕 def', insert: 'def', smart: 'def', desc: 'Define a new function' },
                { text: 'class', insert: 'class', smart: 'class', desc: 'Define a new class' },
                { text: 'import', insert: 'import ', desc: 'Import a module' },
                { text: 'from', insert: 'from ', desc: 'Import from a module' },
                { text: 'return', insert: 'return ', desc: 'Return a value from function' },
                { text: 'yield', insert: 'yield ', desc: 'Yield a value (generator)' }
            ]
        },
        {
            id: 'control',
            title: '🔀 Control',
            keywords: [
                { text: '🆕 if...', insert: 'if', smart: 'if', desc: 'If conditional statement' },
                { text: '🆕 if...else', insert: 'if', smart: 'if-else', desc: 'If-else conditional statement' },
                { text: 'elif', insert: 'elif ', desc: 'Else if condition' },
                { text: 'else', insert: 'else:', desc: 'Else clause' },
                { text: 'match', insert: 'match ', smart: 'match', desc: 'Pattern matching (3.10+)' },
                { text: 'case', insert: 'case ', desc: 'Match case clause' },
                { text: 'pass', insert: 'pass', desc: 'Do nothing placeholder' }
            ]
        },
        {
            id: 'loops',
            title: '🔁 Loops',
            keywords: [
                { text: '🆕 for...', insert: 'for', smart: 'for', desc: 'For loop iteration' },
                { text: '🆕 while...', insert: 'while', smart: 'while', desc: 'While loop' },
                { text: 'break', insert: 'break', desc: 'Exit the loop' },
                { text: 'continue', insert: 'continue', desc: 'Skip to next iteration' }
            ]
        },
        {
            id: 'io',
            title: '📥 I/O',
            keywords: [
                { text: 'print()', insert: 'print()', smart: 'print', desc: 'Print to console' },
                { text: 'input()', insert: 'input()', smart: 'input', desc: 'Read user input' },
                { text: 'open()', insert: 'open()', smart: 'open', desc: 'Open a file' }
            ]
        },
        {
            id: 'exceptions',
            title: '⚠️ Exceptions',
            keywords: [
                { text: '🆕 try...', insert: 'try', smart: 'try', desc: 'Try-except block' },
                { text: 'except', insert: 'except ', desc: 'Catch an exception' },
                { text: 'finally', insert: 'finally:', desc: 'Always execute cleanup' },
                { text: 'raise', insert: 'raise ', desc: 'Raise an exception' },
                { text: 'with', insert: 'with ', smart: 'with', desc: 'Context manager' }
            ]
        },
        {
            id: 'operators',
            title: '🔣 Operators',
            keywords: [
                { text: 'and', insert: ' and ', desc: 'Logical AND' },
                { text: 'or', insert: ' or ', desc: 'Logical OR' },
                { text: 'not', insert: 'not ', desc: 'Logical NOT' },
                { text: 'in', insert: ' in ', desc: 'Membership test' },
                { text: 'is', insert: ' is ', desc: 'Identity test' }
            ]
        },
        {
            id: 'values',
            title: '💎 Values',
            keywords: [
                { text: 'True', insert: 'True', desc: 'Boolean true' },
                { text: 'False', insert: 'False', desc: 'Boolean false' },
                { text: 'None', insert: 'None', desc: 'Null value' }
            ]
        },
        {
            id: 'data',
            title: '📦 Data',
            keywords: [
                { text: '[]', insert: '[]', smart: 'list', desc: 'Empty list' },
                { text: '{}', insert: '{}', smart: 'dict', desc: 'Empty dictionary' },
                { text: '()', insert: '()', desc: 'Empty tuple' },
                { text: 'set()', insert: 'set()', desc: 'Empty set' },
                { text: 'range()', insert: 'range()', smart: 'range', desc: 'Generate number range' },
                { text: 'len()', insert: 'len()', desc: 'Get length of object' }
            ]
        }
    ];

    // Register to namespace
    window.Languages.Python.keywords = {
        KEYWORDS,
        SIDEBAR_CONFIG,
        
        /**
         * Check if a word is a keyword
         * @param {string} word - Word to check
         * @returns {boolean}
         */
        isKeyword(word) {
            return KEYWORDS.includes(word);
        },
        
        /**
         * Get all keywords
         * @returns {string[]}
         */
        getKeywords() {
            return [...KEYWORDS];
        },
        
        /**
         * Get sidebar configuration
         * @returns {Object}
         */
        getSidebarConfig() {
            return SIDEBAR_CONFIG;
        }
    };

    console.log('🐍 Python keywords module loaded');
})();
