/**
 * ΓΛΩΣΣΑ Syntax Highlighting
 * 
 * This module provides syntax highlighting for the GLOSSA programming language.
 * It transforms plain code text into HTML with appropriate CSS classes for styling.
 * 
 * Dependencies:
 * - GLOSSA_KEYWORDS (from keywords.js) - must be loaded before this file
 * - escapeHtml (from app.js) - utility function for HTML escaping
 * 
 * @module languages/glossa/syntax
 */

// Initialize global namespace
window.Languages = window.Languages || {};
window.Languages.Glossa = window.Languages.Glossa || {};

(function(Glossa) {
    'use strict';

    // Get keywords from our namespace (with fallback to global for compatibility)
    const GLOSSA_KEYWORDS = (Glossa.keywords && Glossa.keywords.GLOSSA_KEYWORDS) || window.GLOSSA_KEYWORDS;

    /**
     * Applies syntax highlighting to GLOSSA code
     * Order matters: comments and strings first, then keywords
     * ALL HTML spans are protected with placeholders to prevent nested replacements
     * Uses Unicode-aware word boundaries for Greek characters
     * 
     * @param {string} code - The raw code to highlight
     * @returns {string} HTML string with syntax highlighting spans
     */
    function highlightSyntax(code) {
    // First, escape HTML to prevent XSS
    let highlighted = escapeHtml(code);
    
    // Use placeholders to protect ALL generated HTML spans
    const placeholders = [];
    function protect(html) {
        const index = placeholders.length;
        placeholders.push(html);
        return `___PLACEHOLDER_${index}___`;
    }
    function restore(text) {
        return text.replace(/___PLACEHOLDER_(\d+)___/g, (_, i) => placeholders[parseInt(i)]);
    }
    
    // Helper function to create word boundary pattern for Greek/Latin text
    // \b doesn't work with Greek characters, so we use lookbehind/lookahead
    function wordBoundaryRegex(words) {
        const escaped = words.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
        const pattern = escaped.join('|');
        // Match word that is not preceded or followed by Greek/Latin letters or underscore
        return new RegExp(`(?<![α-ωά-ώΑ-ΩΆ-Ώa-zA-Z_])(${pattern})(?![α-ωά-ώΑ-ΩΆ-Ώa-zA-Z_])`, 'g');
    }
    
    // STEP 1: Protect comments first (highest priority)
    // Match ! and everything after it (inline comments too)
    highlighted = highlighted.replace(
        /(!.*)$/gm,
        (match) => protect(`<span class="syntax-comment">${match}</span>`)
    );
    
    // STEP 2: Protect strings (single quotes)
    highlighted = highlighted.replace(
        /('(?:[^'\\]|\\.)*')/g,
        (match) => protect(`<span class="syntax-string">${match}</span>`)
    );
    
    // STEP 3: Assignment operator <- (convert to arrow)
    highlighted = highlighted.replace(
        /(&lt;-|<-)/g,
        (match) => protect('<span class="syntax-operator">←</span>')
    );
    
    // STEP 4: Comparison operators (PROTECT to prevent = from being matched later)
    highlighted = highlighted.replace(
        /(&lt;&gt;|&lt;=|&gt;=|&lt;|&gt;)/g,
        (match) => protect(`<span class="syntax-operator">${match}</span>`)
    );
    
    // STEP 5: Arithmetic operators (PROTECT each one)
    highlighted = highlighted.replace(
        /(\+|-|\*|\/|\^|=)/g,
        (match) => protect(`<span class="syntax-operator">${match}</span>`)
    );
    
    // STEP 6: Numbers (integers and decimals)
    highlighted = highlighted.replace(
        /(?<![α-ωά-ώΑ-ΩΆ-Ώa-zA-Z_])(\d+\.?\d*)(?![α-ωά-ώΑ-ΩΆ-Ώa-zA-Z_])/g,
        (match) => protect(`<span class="syntax-number">${match}</span>`)
    );
    
    // STEP 7: Keywords - Program Structure (Blue, Bold)
    highlighted = highlighted.replace(
        wordBoundaryRegex(GLOSSA_KEYWORDS.structure),
        (match, p1) => protect(`<span class="syntax-keyword">${p1}</span>`)
    );
    
    // STEP 8: Keywords - Algorithm (for pseudocode)
    highlighted = highlighted.replace(
        wordBoundaryRegex(GLOSSA_KEYWORDS.algorithm),
        (match, p1) => protect(`<span class="syntax-keyword">${p1}</span>`)
    );
    
    // STEP 9: Keywords - Control Flow: IF (Purple)
    highlighted = highlighted.replace(
        wordBoundaryRegex(GLOSSA_KEYWORDS.ifStatement),
        (match, p1) => protect(`<span class="syntax-control">${p1}</span>`)
    );
    
    // STEP 10: Keywords - Control Flow: SELECT (Purple)
    highlighted = highlighted.replace(
        wordBoundaryRegex(GLOSSA_KEYWORDS.selectStatement),
        (match, p1) => protect(`<span class="syntax-control">${p1}</span>`)
    );
    
    // STEP 11: Keywords - Loops: FOR (Purple)
    highlighted = highlighted.replace(
        wordBoundaryRegex(GLOSSA_KEYWORDS.forLoop),
        (match, p1) => protect(`<span class="syntax-control">${p1}</span>`)
    );
    
    // STEP 12: Keywords - Loops: WHILE (Purple)
    highlighted = highlighted.replace(
        wordBoundaryRegex(GLOSSA_KEYWORDS.whileLoop),
        (match, p1) => protect(`<span class="syntax-control">${p1}</span>`)
    );
    
    // STEP 13: Keywords - Loops: DO-WHILE (Purple)
    highlighted = highlighted.replace(
        wordBoundaryRegex(GLOSSA_KEYWORDS.doWhileLoop),
        (match, p1) => protect(`<span class="syntax-control">${p1}</span>`)
    );
    
    // STEP 14: Keywords - I/O (Yellow)
    highlighted = highlighted.replace(
        wordBoundaryRegex(GLOSSA_KEYWORDS.io),
        (match, p1) => protect(`<span class="syntax-io">${p1}</span>`)
    );
    
    // STEP 15: Keywords - Data Types Declaration (Cyan)
    highlighted = highlighted.replace(
        wordBoundaryRegex(GLOSSA_KEYWORDS.typesDeclaration),
        (match, p1) => protect(`<span class="syntax-type">${p1}</span>`)
    );
    
    // STEP 16: Keywords - Data Types Return (Cyan)
    highlighted = highlighted.replace(
        wordBoundaryRegex(GLOSSA_KEYWORDS.typesReturn),
        (match, p1) => protect(`<span class="syntax-type">${p1}</span>`)
    );
    
    // STEP 17: Keywords - Boolean literals
    highlighted = highlighted.replace(
        wordBoundaryRegex(GLOSSA_KEYWORDS.booleanLiterals),
        (match, p1) => protect(`<span class="syntax-logical">${p1}</span>`)
    );
    
    // STEP 18: Keywords - Logical operators
    highlighted = highlighted.replace(
        wordBoundaryRegex(GLOSSA_KEYWORDS.logicalOperators),
        (match, p1) => protect(`<span class="syntax-logical">${p1}</span>`)
    );
    
    // STEP 19: Keywords - Arithmetic operators (DIV, MOD)
    highlighted = highlighted.replace(
        wordBoundaryRegex(GLOSSA_KEYWORDS.arithmeticOperators),
        (match, p1) => protect(`<span class="syntax-logical">${p1}</span>`)
    );
    
    // STEP 20: Keywords - Subprograms (procedures, functions)
    highlighted = highlighted.replace(
        wordBoundaryRegex(GLOSSA_KEYWORDS.subprograms),
        (match, p1) => protect(`<span class="syntax-keyword">${p1}</span>`)
    );
    
    // STEP 21: Built-in functions (Α_Τ, Α_Μ, Τ_Ρ, etc.)
    highlighted = highlighted.replace(
        wordBoundaryRegex(GLOSSA_KEYWORDS.builtinFunctions),
        (match, p1) => protect(`<span class="syntax-function">${p1}</span>`)
    );
    
    // STEP 22: Array brackets highlighting
    highlighted = highlighted.replace(
        /(\[|\])/g,
        (match) => protect(`<span class="syntax-bracket">${match}</span>`)
    );
    
    // STEP 23: Parentheses
    highlighted = highlighted.replace(
        /(\(|\))/g,
        (match) => protect(`<span class="syntax-bracket">${match}</span>`)
    );
    
    // STEP 24: Colons after type declarations
    highlighted = highlighted.replace(
        /(:)/g,
        (match) => protect(`<span class="syntax-punctuation">${match}</span>`)
    );
    
    // STEP 25: Commas
    highlighted = highlighted.replace(
        /(,)/g,
        (match) => protect(`<span class="syntax-punctuation">${match}</span>`)
    );
    
    // Restore ALL protected HTML spans
    highlighted = restore(highlighted);
    
    return highlighted;
}

    // ===========================================
    // Register to namespace
    // ===========================================
    Glossa.syntax = {
        highlight: highlightSyntax
    };

    // Also expose at top level for backward compatibility
    window.highlightSyntax = highlightSyntax;

})(window.Languages.Glossa);

// ===========================================
// Export για χρήση σε Node.js (αν χρειαστεί)
// ===========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.Languages.Glossa.syntax;
}
