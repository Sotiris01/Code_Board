/**
 * Python Language Module - Syntax Highlighting
 * Provides syntax highlighting for Python code
 */

(function() {
    // Ensure namespace exists
    window.Languages = window.Languages || {};
    window.Languages.Python = window.Languages.Python || {};

    /**
     * Get keywords from keywords.js module (with fallback)
     */
    function getKeywords() {
        if (window.Languages.Python.keywords && window.Languages.Python.keywords.KEYWORDS) {
            return window.Languages.Python.keywords.KEYWORDS;
        }
        // Fallback if keywords.js not loaded yet
        return [
            'if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'pass',
            'match', 'case',  // Python 3.10+ structural pattern matching
            'try', 'except', 'finally', 'raise', 'with', 'as',
            'def', 'return', 'yield', 'lambda', 'class',
            'import', 'from',
            'and', 'or', 'not', 'in', 'is',
            'True', 'False', 'None',
            'global', 'nonlocal', 'del', 'assert'
        ];
    }

    /**
     * Built-in functions
     */
    const BUILTINS = [
        'print', 'input', 'len', 'range', 'str', 'int', 'float', 'list',
        'dict', 'set', 'tuple', 'bool', 'type', 'isinstance', 'open',
        'abs', 'max', 'min', 'sum', 'sorted', 'reversed', 'enumerate',
        'zip', 'map', 'filter', 'any', 'all', 'round', 'pow', 'hex', 'bin'
    ];

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} - Escaped text
     */
    function escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    /**
     * Highlight Python syntax
     * @param {string} code - Python code to highlight
     * @returns {string} - HTML with syntax highlighting spans
     */
    function highlightSyntax(code) {
        if (!code) return '';

        // Escape HTML first
        let escaped = escapeHtml(code);
        
        // Track positions to avoid double-highlighting
        let highlighted = escaped;

        // 1. Highlight comments (# to end of line)
        highlighted = highlighted.replace(
            /(#[^\n]*)/g,
            '<span class="syntax-comment">$1</span>'
        );

        // 2. Highlight triple-quoted strings (docstrings)
        highlighted = highlighted.replace(
            /("""[\s\S]*?"""|'''[\s\S]*?''')/g,
            '<span class="syntax-string">$1</span>'
        );

        // 3. Highlight f-strings
        highlighted = highlighted.replace(
            /\b(f)(["'])((?:(?!\2)[^\\]|\\.)*)(\2)/g,
            '<span class="syntax-keyword">$1</span><span class="syntax-string">$2$3$4</span>'
        );

        // 4. Highlight regular strings (single and double quotes)
        highlighted = highlighted.replace(
            /(?<!<span class="syntax-[^"]*)(["'])((?:(?!\1)[^\\]|\\.)*)(\1)/g,
            '<span class="syntax-string">$1$2$3</span>'
        );

        // 5. Highlight decorators (@something)
        highlighted = highlighted.replace(
            /(@\w+)/g,
            '<span class="syntax-decorator">$1</span>'
        );

        // 6. Highlight numbers (integers and floats)
        highlighted = highlighted.replace(
            /\b(\d+\.?\d*)\b/g,
            '<span class="syntax-number">$1</span>'
        );

        // 7. Highlight 'self' as special variable
        highlighted = highlighted.replace(
            /\b(self)\b/g,
            '<span class="syntax-self">$1</span>'
        );

        // 8. Highlight keywords
        const KEYWORDS = getKeywords();
        KEYWORDS.forEach(keyword => {
            const regex = new RegExp(`\\b(${keyword})\\b`, 'g');
            highlighted = highlighted.replace(
                regex,
                '<span class="syntax-keyword">$1</span>'
            );
        });

        // 9. Highlight built-in functions
        BUILTINS.forEach(builtin => {
            const regex = new RegExp(`\\b(${builtin})(?=\\s*\\()`, 'g');
            highlighted = highlighted.replace(
                regex,
                '<span class="syntax-builtin">$1</span>'
            );
        });

        return highlighted;
    }

    // Register to namespace
    window.Languages.Python.syntax = {
        highlight: highlightSyntax,  // LanguageManager expects 'highlight'
        highlightSyntax,             // Keep for backward compatibility
        
        /**
         * Get CSS classes used by this highlighter
         * @returns {Object} - Map of class names to descriptions
         */
        getStyleClasses() {
            return {
                'syntax-keyword': 'Keywords (if, def, class, etc.)',
                'syntax-string': 'String literals',
                'syntax-comment': 'Comments',
                'syntax-number': 'Numeric literals',
                'syntax-decorator': 'Decorators (@)',
                'syntax-self': 'Self reference',
                'syntax-builtin': 'Built-in functions'
            };
        }
    };

    console.log('🐍 Python syntax module loaded');
})();
