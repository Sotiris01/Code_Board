/**
 * C++ Language Module - Syntax Highlighting
 * Provides syntax highlighting for C++ code
 */

(function() {
    // Ensure namespace exists
    window.Languages = window.Languages || {};
    window.Languages.Cpp = window.Languages.Cpp || {};

    /**
     * C++ Keywords for highlighting
     */
    const KEYWORDS = [
        'if', 'else', 'switch', 'case', 'default', 'break', 'continue', 'return', 'goto',
        'for', 'while', 'do',
        'class', 'struct', 'union', 'enum', 'public', 'private', 'protected',
        'virtual', 'override', 'final', 'friend', 'this', 'new', 'delete',
        'template', 'typename', 'namespace', 'using', 'typedef',
        'try', 'catch', 'throw', 'noexcept',
        'sizeof', 'true', 'false', 'nullptr', 'inline', 'constexpr',
        'const', 'static', 'extern', 'register', 'volatile', 'mutable'
    ];

    /**
     * C++ Types for highlighting
     */
    const TYPES = [
        'int', 'float', 'double', 'char', 'bool', 'void', 'long', 'short',
        'unsigned', 'signed', 'auto', 'string', 'vector', 'map', 'set',
        'array', 'list', 'pair', 'tuple', 'size_t', 'nullptr_t', 'wchar_t'
    ];

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
     * Highlight C++ syntax
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
                
                // Check for preprocessor directives #
                if (line[i] === '#' && line.substring(0, i).trim() === '') {
                    result += `<span class="syntax-preprocessor">${escapeHtml(line.substring(i))}</span>`;
                    break;
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
                    // Match integers, floats, hex (0x), binary (0b)
                    while (end < line.length && /[0-9a-fA-FxXbB.eEuUlLfF]/.test(line[end])) {
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
                    } else if (word === 'std' || word === 'cout' || word === 'cin' || word === 'endl') {
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
                    if (['<<', '>>', '<=', '>=', '==', '!=', '&&', '||', '++', '--', '->', '::'].includes(twoChar)) {
                        opEnd = i + 2;
                    }
                    if (['<<=', '>>='].includes(threeChar)) {
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
    window.Languages.Cpp.syntax = {
        highlight: highlightSyntax,  // LanguageManager expects 'highlight'
        highlightSyntax,             // Keep for backward compatibility
        escapeHtml,
        KEYWORDS,
        TYPES
    };

    console.log('⚡ C++ syntax module loaded');
})();
