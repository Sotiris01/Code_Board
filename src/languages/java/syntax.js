/**
 * Java Language Module - Syntax Highlighting
 * Phase 5.3: Provides syntax highlighting for Java code
 */

(function() {
    'use strict';
    
    // Ensure namespace exists
    window.Languages = window.Languages || {};
    window.Languages.Java = window.Languages.Java || {};

    /**
     * Java Keywords for highlighting
     */
    const KEYWORDS = [
        'abstract', 'assert', 'break', 'case', 'catch', 'class', 'const', 'continue',
        'default', 'do', 'else', 'enum', 'extends', 'final', 'finally', 'for', 'goto',
        'if', 'implements', 'import', 'instanceof', 'interface', 'native', 'new',
        'package', 'private', 'protected', 'public', 'return', 'static', 'strictfp',
        'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient',
        'try', 'void', 'volatile', 'while'
    ];

    /**
     * Java Types for highlighting
     */
    const TYPES = [
        'boolean', 'byte', 'char', 'double', 'float', 'int', 'long', 'short',
        'String', 'Integer', 'Double', 'Boolean', 'Long', 'Short', 'Byte', 'Float', 'Character',
        'List', 'ArrayList', 'LinkedList', 'Map', 'HashMap', 'TreeMap',
        'Set', 'HashSet', 'TreeSet', 'Object', 'Class', 'Void',
        'Queue', 'Stack', 'Vector', 'Arrays', 'Collections'
    ];

    /**
     * Java Values for highlighting
     */
    const VALUES = ['true', 'false', 'null'];

    /**
     * Java Built-in classes/objects for highlighting
     */
    const BUILTINS = ['System', 'Math', 'Scanner', 'out', 'in', 'err', 'println', 'print', 'printf'];

    /**
     * Escape HTML special characters
     * @param {string} text - Text to escape
     * @returns {string} Escaped text
     */
    function escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
    }

    /**
     * Highlight Java syntax
     * @param {string} code - Code to highlight
     * @returns {string} HTML with syntax highlighting
     */
    function highlightSyntax(code) {
        if (!code) return '';
        
        const lines = code.split('\n');
        let inBlockComment = false;
        
        const highlightedLines = lines.map(line => {
            let result = '';
            let i = 0;
            
            while (i < line.length) {
                // Check if we're inside a block comment
                if (inBlockComment) {
                    const endIdx = line.indexOf('*/', i);
                    if (endIdx !== -1) {
                        result += `<span class="syntax-comment">${escapeHtml(line.substring(i, endIdx + 2))}</span>`;
                        i = endIdx + 2;
                        inBlockComment = false;
                    } else {
                        result += `<span class="syntax-comment">${escapeHtml(line.substring(i))}</span>`;
                        break;
                    }
                    continue;
                }
                
                // Check for Javadoc comment start /** (before block comment)
                if (line.substring(i, i + 3) === '/**') {
                    const endIdx = line.indexOf('*/', i + 3);
                    if (endIdx !== -1) {
                        result += `<span class="syntax-comment syntax-javadoc">${escapeHtml(line.substring(i, endIdx + 2))}</span>`;
                        i = endIdx + 2;
                    } else {
                        result += `<span class="syntax-comment syntax-javadoc">${escapeHtml(line.substring(i))}</span>`;
                        inBlockComment = true;
                        break;
                    }
                    continue;
                }
                
                // Check for block comment start /*
                if (line.substring(i, i + 2) === '/*') {
                    const endIdx = line.indexOf('*/', i + 2);
                    if (endIdx !== -1) {
                        result += `<span class="syntax-comment">${escapeHtml(line.substring(i, endIdx + 2))}</span>`;
                        i = endIdx + 2;
                    } else {
                        result += `<span class="syntax-comment">${escapeHtml(line.substring(i))}</span>`;
                        inBlockComment = true;
                        break;
                    }
                    continue;
                }
                
                // Check for single-line comment //
                if (line.substring(i, i + 2) === '//') {
                    result += `<span class="syntax-comment">${escapeHtml(line.substring(i))}</span>`;
                    break;
                }
                
                // Check for annotations @Something
                if (line[i] === '@') {
                    let end = i + 1;
                    while (end < line.length && /[a-zA-Z0-9_]/.test(line[end])) {
                        end++;
                    }
                    if (end > i + 1) {
                        result += `<span class="syntax-decorator">${escapeHtml(line.substring(i, end))}</span>`;
                        i = end;
                        continue;
                    }
                }
                
                // Check for strings "..."
                if (line[i] === '"') {
                    let end = i + 1;
                    while (end < line.length && (line[end] !== '"' || line[end - 1] === '\\')) {
                        end++;
                    }
                    if (end < line.length) end++; // Include closing quote
                    result += `<span class="syntax-string">${escapeHtml(line.substring(i, end))}</span>`;
                    i = end;
                    continue;
                }
                
                // Check for character literals '...'
                if (line[i] === "'") {
                    let end = i + 1;
                    while (end < line.length && (line[end] !== "'" || line[end - 1] === '\\')) {
                        end++;
                    }
                    if (end < line.length) end++; // Include closing quote
                    result += `<span class="syntax-string">${escapeHtml(line.substring(i, end))}</span>`;
                    i = end;
                    continue;
                }
                
                // Check for numbers
                if (/[0-9]/.test(line[i]) && (i === 0 || !/[a-zA-Z_]/.test(line[i - 1]))) {
                    let end = i;
                    // Match integers, floats, hex (0x), binary (0b), long (L), float (f), double (d)
                    while (end < line.length && /[0-9a-fA-FxXbB.eE_uUlLfFdD+-]/.test(line[end])) {
                        end++;
                    }
                    result += `<span class="syntax-number">${escapeHtml(line.substring(i, end))}</span>`;
                    i = end;
                    continue;
                }
                
                // Check for identifiers (keywords, types, variables)
                if (/[a-zA-Z_]/.test(line[i])) {
                    let end = i;
                    while (end < line.length && /[a-zA-Z0-9_]/.test(line[end])) {
                        end++;
                    }
                    const word = line.substring(i, end);
                    
                    if (KEYWORDS.includes(word)) {
                        result += `<span class="syntax-keyword">${escapeHtml(word)}</span>`;
                    } else if (TYPES.includes(word)) {
                        result += `<span class="syntax-type">${escapeHtml(word)}</span>`;
                    } else if (VALUES.includes(word)) {
                        result += `<span class="syntax-logical">${escapeHtml(word)}</span>`;
                    } else if (BUILTINS.includes(word)) {
                        result += `<span class="syntax-builtin">${escapeHtml(word)}</span>`;
                    } else {
                        result += escapeHtml(word);
                    }
                    i = end;
                    continue;
                }
                
                // Check for operators
                if (['<', '>', '=', '+', '-', '*', '/', '%', '&', '|', '^', '!', '~', '?', ':'].includes(line[i])) {
                    let opEnd = i + 1;
                    // Check for multi-character operators
                    const twoChar = line.substring(i, i + 2);
                    const threeChar = line.substring(i, i + 3);
                    if (['<<', '>>', '<=', '>=', '==', '!=', '&&', '||', '++', '--', '->'].includes(twoChar)) {
                        opEnd = i + 2;
                    }
                    if (['<<=', '>>=', '>>>'].includes(threeChar)) {
                        opEnd = i + 3;
                    }
                    result += `<span class="syntax-operator">${escapeHtml(line.substring(i, opEnd))}</span>`;
                    i = opEnd;
                    continue;
                }
                
                // Default: just add the character
                result += escapeHtml(line[i]);
                i++;
            }
            
            return result;
        });
        
        return highlightedLines.join('\n');
    }

    // Register to namespace
    window.Languages.Java.syntax = {
        highlight: highlightSyntax,  // LanguageManager expects 'highlight'
        highlightSyntax,             // Keep for backward compatibility
        escapeHtml,
        KEYWORDS,
        TYPES,
        VALUES,
        BUILTINS
    };

    console.log('☕ Java syntax module loaded');
})();
