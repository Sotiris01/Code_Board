/**
 * Smart Inserter - Universal Code Insertion Logic
 * 
 * This module handles the intelligent placement of code snippets and keywords
 * based on context and language-specific rules. It provides a pure, stateless
 * interface that can be used by any editor implementation.
 * 
 * @module core/SmartInserter
 */

const SmartInserter = (function() {
    'use strict';

    // ===========================================
    // Helper Functions
    // ===========================================

    /**
     * Gets the current line's indentation at a given position
     * @param {string} code - The full code string
     * @param {number} cursorPos - Linear cursor position
     * @returns {string} The indentation string (spaces/tabs)
     */
    function getCurrentIndent(code, cursorPos) {
        const beforeCursor = code.substring(0, cursorPos);
        const lines = beforeCursor.split('\n');
        const currentLine = lines[lines.length - 1];
        const match = currentLine.match(/^(\s*)/);
        return match ? match[1] : '';
    }

    /**
     * Finds the indentation of a matching opening keyword
     * Searches backwards from cursor position for a keyword that starts a block
     * 
     * @param {string} code - The full code string
     * @param {number} cursorPos - Linear cursor position
     * @param {string|string[]} matchKeywords - Keyword(s) to match
     * @returns {string} The indentation of the matching keyword, or empty string
     */
    function findMatchingIndent(code, cursorPos, matchKeywords) {
        const beforeCursor = code.substring(0, cursorPos);
        const lines = beforeCursor.split('\n');
        const keywords = Array.isArray(matchKeywords) ? matchKeywords : [matchKeywords];
        
        // Search backwards for the opening keyword
        for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i];
            for (const kw of keywords) {
                if (line.trim().startsWith(kw)) {
                    const indent = line.match(/^(\s*)/);
                    return indent ? indent[1] : '';
                }
            }
        }
        return ''; // No match found, no indentation
    }

    /**
     * Adds base indentation to all lines of a template except the first
     * @param {string} template - Multi-line template string
     * @param {string} baseIndent - Indentation to add
     * @returns {string} Indented template
     */
    function indentTemplate(template, baseIndent) {
        return template.split('\n').map((line, idx) => {
            // First line doesn't get extra indent (it's at cursor position)
            if (idx === 0) return line;
            return baseIndent + line;
        }).join('\n');
    }

    /**
     * Finds the position right after variable declarations
     * @param {string} code - The full code string
     * @returns {number} Position after variables, or -1 if not found
     */
    function findAfterVariablesPosition(code) {
        const varLines = code.split('\n');
        let lastTypeLineIdx = -1;
        
        // Look for the last type declaration line
        for (let i = 0; i < varLines.length; i++) {
            if (varLines[i].match(/^\s*(ΑΚΕΡΑΙΕΣ|ΠΡΑΓΜΑΤΙΚΕΣ|ΧΑΡΑΚΤΗΡΕΣ|ΛΟΓΙΚΕΣ)/)) {
                lastTypeLineIdx = i;
            }
        }
        
        if (lastTypeLineIdx >= 0) {
            let charCount = 0;
            for (let i = 0; i <= lastTypeLineIdx; i++) {
                charCount += varLines[i].length + 1;
            }
            return charCount - 1;
        }
        
        // Check if ΜΕΤΑΒΛΗΤΕΣ exists
        const metabMatch = code.match(/^ΜΕΤΑΒΛΗΤΕΣ\s*$/m);
        if (metabMatch) {
            return code.indexOf(metabMatch[0]) + metabMatch[0].length;
        }
        
        return -1;
    }

    /**
     * Finds the position right after program/algorithm declaration
     * @param {string} code - The full code string
     * @returns {number} Position after declaration, or -1 if not found
     */
    function findAfterDeclarationPosition(code) {
        const declMatch = code.match(/^(ΑΛΓΟΡΙΘΜΟΣ|Αλγόριθμος|ΠΡΟΓΡΑΜΜΑ)\s+\S+.*$/m);
        if (declMatch) {
            return code.indexOf(declMatch[0]) + declMatch[0].length;
        }
        return -1;
    }

    /**
     * Finds the position before the ending keyword (ΤΕΛΟΣ/ΤΕΛΟΣ_ΠΡΟΓΡΑΜΜΑΤΟΣ)
     * @param {string} code - The full code string
     * @returns {number} Position before ending, or code.length if not found
     */
    function findBeforeEndingPosition(code) {
        const telosMatch = code.match(/\n(ΤΕΛΟΣ(_ΠΡΟΓΡΑΜΜΑΤΟΣ)?|Τέλος)\s*\S*\s*$/);
        if (telosMatch) {
            return telosMatch.index;
        }
        return code.length;
    }

    // ===========================================
    // Main Calculation Function
    // ===========================================

    /**
     * Calculates the insertion result based on code context and rules
     * 
     * @param {string} code - Current code in the editor
     * @param {number} cursorPos - Current cursor position (linear)
     * @param {string} keyword - The keyword/text to insert
     * @param {Object} rule - Smart insertion rule from SMART_INSERTION
     * @param {Object} [options] - Additional options
     * @param {Function} [options.promptFn] - Function for prompting user (receives message, default)
     * @returns {{ newCode: string, newCursorPos: number, cancelled?: boolean }}
     */
    function calculateInsertion(code, cursorPos, keyword, rule, options = {}) {
        const { promptFn = null } = options;
        
        let insertText = keyword;
        let insertPos = cursorPos;
        let newCursorPos = cursorPos;
        
        // No rule - simple insertion at cursor
        if (!rule) {
            return {
                newCode: code.substring(0, cursorPos) + keyword + code.substring(cursorPos),
                newCursorPos: cursorPos + keyword.length
            };
        }

        // Handle template-based insertion
        if (rule.template) {
            let template = rule.template;
            
            // If template needs a name, prompt for it
            if (rule.promptName && promptFn) {
                const name = promptFn(rule.promptName, rule.defaultName);
                if (name === null) {
                    // User cancelled
                    return { newCode: code, newCursorPos: cursorPos, cancelled: true };
                }
                template = template.replace(/\{\{NAME\}\}/g, name || rule.defaultName);
            } else if (rule.promptName) {
                // No prompt function, use default name
                template = template.replace(/\{\{NAME\}\}/g, rule.defaultName);
            }
            
            // Get base indentation from current position
            const baseIndent = getCurrentIndent(code, cursorPos);
            
            // Apply indentation to template
            template = indentTemplate(template, baseIndent);
            
            // Find cursor position marker
            const cursorMarker = '{{CURSOR}}';
            const cursorOffset = template.indexOf(cursorMarker);
            
            // Remove cursor marker
            template = template.replace(cursorMarker, '');
            
            // Determine insert position based on placement
            switch (rule.placement) {
                case 'start':
                    insertPos = 0;
                    if (code.length > 0) {
                        template = template + '\n';
                    }
                    newCursorPos = cursorOffset >= 0 ? cursorOffset : template.length;
                    break;
                    
                case 'end-of-file': {
                    const beforeEnd = findBeforeEndingPosition(code);
                    if (beforeEnd < code.length) {
                        insertPos = beforeEnd;
                        template = '\n' + template + '\n';
                    } else {
                        insertPos = code.length;
                        template = '\n\n' + template;
                    }
                    // Calculate cursor position in the inserted text
                    const insertedCursorOffset = template.indexOf(cursorMarker) >= 0 ? 
                        template.indexOf(cursorMarker) : 
                        (cursorOffset >= 0 ? cursorOffset + (template.startsWith('\n\n') ? 2 : 1) : template.length);
                    newCursorPos = insertPos + insertedCursorOffset;
                    break;
                }
                    
                case 'cursor-indent':
                default: {
                    // Insert at cursor with proper indentation
                    insertPos = cursorPos;
                    
                    // Ensure we're on a new line
                    const beforeInsert = code.substring(0, insertPos);
                    if (beforeInsert.length > 0 && !beforeInsert.endsWith('\n')) {
                        template = '\n' + baseIndent + template;
                        newCursorPos = insertPos + 1 + baseIndent.length + (cursorOffset >= 0 ? cursorOffset : 0);
                    } else {
                        newCursorPos = insertPos + (cursorOffset >= 0 ? cursorOffset : template.length);
                    }
                    break;
                }
            }
            
            insertText = template;
        } else {
            // Non-template insertion (keyword-based)
            insertText = rule.getText ? rule.getText(code) : keyword;
            
            switch (rule.placement) {
                case 'end':
                    insertPos = code.length;
                    if (code.length > 0 && !code.endsWith('\n')) {
                        insertText = '\n\n' + insertText;
                    } else if (code.length > 0) {
                        insertText = '\n' + insertText;
                    }
                    newCursorPos = insertPos + insertText.length;
                    break;
                    
                case 'start':
                    insertPos = 0;
                    newCursorPos = insertText.length;
                    break;
                    
                case 'after-declaration': {
                    const declPos = findAfterDeclarationPosition(code);
                    if (declPos >= 0) {
                        insertPos = declPos;
                        insertText = '\n\n' + insertText;
                        newCursorPos = insertPos + insertText.length;
                    } else {
                        insertPos = cursorPos;
                        newCursorPos = cursorPos + insertText.length;
                    }
                    break;
                }
                    
                case 'after-variables': {
                    const varPos = findAfterVariablesPosition(code);
                    if (varPos >= 0) {
                        insertPos = varPos;
                        insertText = '\n\n' + insertText;
                        newCursorPos = insertPos + insertText.length;
                    } else {
                        insertPos = cursorPos;
                        newCursorPos = cursorPos + insertText.length;
                    }
                    break;
                }
                    
                case 'match-indent': {
                    const indent = rule.matchStart ? 
                        findMatchingIndent(code, cursorPos, rule.matchStart) : 
                        getCurrentIndent(code, cursorPos);
                        
                    const beforePos = code.substring(0, cursorPos);
                    if (!beforePos.endsWith('\n') && beforePos.length > 0) {
                        insertText = '\n' + indent + insertText;
                    } else {
                        insertText = indent + insertText;
                    }
                    newCursorPos = cursorPos + insertText.length;
                    break;
                }
                    
                case 'end-of-file': {
                    const beforeEnd = findBeforeEndingPosition(code);
                    if (beforeEnd < code.length) {
                        insertPos = beforeEnd;
                        insertText = '\n\n' + insertText;
                    } else {
                        insertPos = code.length;
                        insertText = '\n\n' + insertText;
                    }
                    newCursorPos = insertPos + insertText.length;
                    break;
                }
                    
                case 'cursor':
                default:
                    insertPos = cursorPos;
                    newCursorPos = cursorPos + insertText.length;
                    break;
            }
        }
        
        // Perform the insertion
        const newCode = code.substring(0, insertPos) + insertText + code.substring(insertPos);
        
        return { newCode, newCursorPos };
    }

    // ===========================================
    // Utility Functions
    // ===========================================

    /**
     * Converts a linear position to row/column
     * @param {string} code - The code string
     * @param {number} linearPos - Linear position
     * @returns {{ row: number, col: number }}
     */
    function linearToRowCol(code, linearPos) {
        const lines = code.split('\n');
        let remaining = linearPos;
        
        for (let i = 0; i < lines.length; i++) {
            if (remaining <= lines[i].length) {
                return { row: i, col: remaining };
            }
            remaining -= lines[i].length + 1; // +1 for newline
        }
        
        // If past end, return last position
        const lastRow = lines.length - 1;
        return { row: lastRow, col: lines[lastRow].length };
    }

    /**
     * Converts row/column to linear position
     * @param {string} code - The code string
     * @param {number} row - Row index (0-based)
     * @param {number} col - Column index (0-based)
     * @returns {number} Linear position
     */
    function rowColToLinear(code, row, col) {
        const lines = code.split('\n');
        let pos = 0;
        
        for (let i = 0; i < row && i < lines.length; i++) {
            pos += lines[i].length + 1; // +1 for newline
        }
        
        // Add column position (clamped to line length)
        if (row < lines.length) {
            pos += Math.min(col, lines[row].length);
        }
        
        return pos;
    }

    // ===========================================
    // Public API
    // ===========================================

    return {
        /**
         * Main entry point for calculating smart insertion
         */
        calculateInsertion,
        
        /**
         * Utility: Get current line indentation
         */
        getCurrentIndent,
        
        /**
         * Utility: Find matching keyword indentation
         */
        findMatchingIndent,
        
        /**
         * Utility: Add indentation to template lines
         */
        indentTemplate,
        
        /**
         * Utility: Convert linear position to row/col
         */
        linearToRowCol,
        
        /**
         * Utility: Convert row/col to linear position
         */
        rowColToLinear
    };
})();

// Make SmartInserter globally available
window.SmartInserter = SmartInserter;

// Export for Node.js (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SmartInserter;
}
