/**
 * SyntaxHighlighter - Multi-language syntax highlighting for GridEditor
 * Supports GLOSSA, Python, C++, and Java
 */

class SyntaxHighlighter {
    
    /**
     * Get syntax highlighting for all lines
     * @param {string[]} lines - Array of code lines
     * @param {string} language - Current language ('glossa', 'python', 'cpp', 'java')
     * @returns {string[][]} - 2D array of CSS class names per character
     */
    static highlight(lines, language = 'glossa') {
        const result = [];
        
        for (let row = 0; row < lines.length; row++) {
            const line = lines[row];
            const lineClasses = new Array(line.length).fill('');
            
            // Language-specific highlighting
            if (language === 'glossa') {
                this.highlightGlossaLine(line, lineClasses);
            } else if (language === 'python') {
                this.highlightPythonLine(line, lineClasses);
            } else if (language === 'cpp') {
                this.highlightCppLine(line, lineClasses);
            } else if (language === 'java') {
                this.highlightJavaLine(line, lineClasses);
            }
            
            result.push(lineClasses);
        }
        
        return result;
    }
    
    // ============================================
    // GLOSSA HIGHLIGHTING
    // ============================================
    
    static highlightGlossaLine(line, lineClasses) {
        // Check for comment (! anywhere in line)
        const commentIndex = line.indexOf('!');
        if (commentIndex !== -1) {
            // Everything from ! to end is comment
            for (let i = commentIndex; i < line.length; i++) {
                lineClasses[i] = 'syntax-comment';
            }
            // Only highlight the part before the comment
            if (commentIndex === 0) return;
            line = line.substring(0, commentIndex);
        }
        
        // Use detailed GLOSSA highlighting logic
        this.highlightGlossaTokens(line, lineClasses);
    }
    
    static highlightGlossaTokens(line, lineClasses) {
        // Original GLOSSA highlighting logic
        if (typeof GLOSSA_KEYWORDS === 'undefined') return;
        
        let pos = 0;
        
        while (pos < line.length) {
            // Skip whitespace
            if (/\s/.test(line[pos])) {
                pos++;
                continue;
            }
            
            // Check for string (single quotes)
            if (line[pos] === "'") {
                const start = pos;
                pos++;
                while (pos < line.length && line[pos] !== "'") {
                    pos++;
                }
                if (pos < line.length) pos++; // Include closing quote
                for (let i = start; i < pos; i++) {
                    lineClasses[i] = 'syntax-string';
                }
                continue;
            }
            
            // Check for number
            if (/\d/.test(line[pos])) {
                const start = pos;
                while (pos < line.length && /[\d.]/.test(line[pos])) {
                    pos++;
                }
                for (let i = start; i < pos; i++) {
                    lineClasses[i] = 'syntax-number';
                }
                continue;
            }
            
            // Check for operators
            const twoChar = line.substring(pos, pos + 2);
            if (twoChar === '<-' || twoChar === '<>' || twoChar === '<=' || twoChar === '>=') {
                lineClasses[pos] = 'syntax-operator';
                lineClasses[pos + 1] = 'syntax-operator';
                pos += 2;
                continue;
            }
            
            if ('+-*/^=<>'.includes(line[pos])) {
                lineClasses[pos] = 'syntax-operator';
                pos++;
                continue;
            }
            
            // Check for brackets
            if ('[]()'.includes(line[pos])) {
                lineClasses[pos] = 'syntax-bracket';
                pos++;
                continue;
            }
            
            // Check for punctuation
            if (':,'.includes(line[pos])) {
                lineClasses[pos] = 'syntax-punctuation';
                pos++;
                continue;
            }
            
            // Check for word (identifier or keyword)
            if (/[α-ωά-ώΑ-ΩΆ-Ώa-zA-Z_]/.test(line[pos])) {
                const start = pos;
                while (pos < line.length && /[α-ωά-ώΑ-ΩΆ-Ώa-zA-Z0-9_]/.test(line[pos])) {
                    pos++;
                }
                const word = line.substring(start, pos);
                const syntaxClass = this.getGlossaKeywordClass(word);
                
                if (syntaxClass) {
                    for (let i = start; i < pos; i++) {
                        lineClasses[i] = syntaxClass;
                    }
                }
                continue;
            }
            
            // Skip unknown character
            pos++;
        }
    }
    
    static getGlossaKeywordClass(word) {
        const upperWord = word.toUpperCase();
        
        // Structure keywords
        if (GLOSSA_KEYWORDS.structure?.includes(upperWord) || 
            GLOSSA_KEYWORDS.structure?.includes(word)) {
            return 'syntax-keyword';
        }
        
        // Algorithm keywords
        if (GLOSSA_KEYWORDS.algorithm?.some(k => k.toUpperCase() === upperWord)) {
            return 'syntax-keyword';
        }
        
        // Control flow - IF
        if (GLOSSA_KEYWORDS.ifStatement?.includes(upperWord) ||
            GLOSSA_KEYWORDS.ifStatement?.includes(word)) {
            return 'syntax-control';
        }
        
        // Control flow - SELECT
        if (GLOSSA_KEYWORDS.selectStatement?.includes(upperWord) ||
            GLOSSA_KEYWORDS.selectStatement?.includes(word)) {
            return 'syntax-control';
        }
        
        // Control flow - FOR
        if (GLOSSA_KEYWORDS.forLoop?.includes(upperWord) ||
            GLOSSA_KEYWORDS.forLoop?.includes(word)) {
            return 'syntax-control';
        }
        
        // Control flow - WHILE
        if (GLOSSA_KEYWORDS.whileLoop?.includes(upperWord) ||
            GLOSSA_KEYWORDS.whileLoop?.includes(word)) {
            return 'syntax-control';
        }
        
        // Control flow - DO-WHILE
        if (GLOSSA_KEYWORDS.doWhileLoop?.includes(upperWord) ||
            GLOSSA_KEYWORDS.doWhileLoop?.includes(word)) {
            return 'syntax-control';
        }
        
        // I/O
        if (GLOSSA_KEYWORDS.io?.includes(upperWord) ||
            GLOSSA_KEYWORDS.io?.includes(word)) {
            return 'syntax-io';
        }
        
        // Types - Declaration
        if (GLOSSA_KEYWORDS.typesDeclaration?.includes(upperWord) ||
            GLOSSA_KEYWORDS.typesDeclaration?.includes(word)) {
            return 'syntax-type';
        }
        
        // Types - Return
        if (GLOSSA_KEYWORDS.typesReturn?.includes(upperWord) ||
            GLOSSA_KEYWORDS.typesReturn?.includes(word)) {
            return 'syntax-type';
        }
        
        // Boolean literals
        if (GLOSSA_KEYWORDS.booleanLiterals?.includes(upperWord) ||
            GLOSSA_KEYWORDS.booleanLiterals?.includes(word)) {
            return 'syntax-logical';
        }
        
        // Logical operators
        if (GLOSSA_KEYWORDS.logicalOperators?.includes(upperWord) ||
            GLOSSA_KEYWORDS.logicalOperators?.includes(word)) {
            return 'syntax-logical';
        }
        
        // Arithmetic operators (DIV, MOD)
        if (GLOSSA_KEYWORDS.arithmeticOperators?.includes(upperWord) ||
            GLOSSA_KEYWORDS.arithmeticOperators?.includes(word)) {
            return 'syntax-logical';
        }
        
        // Subprograms
        if (GLOSSA_KEYWORDS.subprograms?.includes(upperWord) ||
            GLOSSA_KEYWORDS.subprograms?.includes(word)) {
            return 'syntax-keyword';
        }
        
        // Built-in functions
        if (GLOSSA_KEYWORDS.builtinFunctions?.includes(word) ||
            GLOSSA_KEYWORDS.builtinFunctions?.includes(upperWord)) {
            return 'syntax-function';
        }
        
        return null;
    }
    
    // ============================================
    // PYTHON HIGHLIGHTING
    // ============================================
    
    static highlightPythonLine(line, lineClasses) {
        let pos = 0;
        
        // Check for comment (# to end of line)
        const commentIndex = line.indexOf('#');
        const lineEnd = commentIndex !== -1 ? commentIndex : line.length;
        
        if (commentIndex !== -1) {
            for (let i = commentIndex; i < line.length; i++) {
                lineClasses[i] = 'syntax-comment';
            }
        }
        
        while (pos < lineEnd) {
            // Skip whitespace
            if (/\s/.test(line[pos])) {
                pos++;
                continue;
            }
            
            // Check for triple-quoted string
            if (line.substring(pos, pos + 3) === '"""' || line.substring(pos, pos + 3) === "'''") {
                const quote = line.substring(pos, pos + 3);
                const start = pos;
                pos += 3;
                const end = line.indexOf(quote, pos);
                if (end !== -1) {
                    pos = end + 3;
                } else {
                    pos = line.length;
                }
                for (let i = start; i < pos && i < lineEnd; i++) {
                    lineClasses[i] = 'syntax-string';
                }
                continue;
            }
            
            // Check for string (single or double quotes)
            if (line[pos] === '"' || line[pos] === "'") {
                const quote = line[pos];
                const start = pos;
                pos++;
                while (pos < lineEnd && line[pos] !== quote) {
                    if (line[pos] === '\\') pos++; // Skip escaped char
                    pos++;
                }
                if (pos < lineEnd) pos++; // Include closing quote
                for (let i = start; i < pos; i++) {
                    lineClasses[i] = 'syntax-string';
                }
                continue;
            }
            
            // Check for number
            if (/\d/.test(line[pos])) {
                const start = pos;
                while (pos < lineEnd && /[\d.eE+-]/.test(line[pos])) {
                    pos++;
                }
                for (let i = start; i < pos; i++) {
                    lineClasses[i] = 'syntax-number';
                }
                continue;
            }
            
            // Check for decorator
            if (line[pos] === '@') {
                const start = pos;
                pos++;
                while (pos < lineEnd && /[a-zA-Z0-9_]/.test(line[pos])) {
                    pos++;
                }
                for (let i = start; i < pos; i++) {
                    lineClasses[i] = 'syntax-decorator';
                }
                continue;
            }
            
            // Check for word (identifier or keyword)
            if (/[a-zA-Z_]/.test(line[pos])) {
                const start = pos;
                while (pos < lineEnd && /[a-zA-Z0-9_]/.test(line[pos])) {
                    pos++;
                }
                const word = line.substring(start, pos);
                const syntaxClass = this.getPythonKeywordClass(word);
                
                if (syntaxClass) {
                    for (let i = start; i < pos; i++) {
                        lineClasses[i] = syntaxClass;
                    }
                }
                continue;
            }
            
            // Check for operators
            if ('+-*/%=<>!&|^~'.includes(line[pos])) {
                lineClasses[pos] = 'syntax-operator';
                pos++;
                continue;
            }
            
            // Skip unknown character
            pos++;
        }
    }
    
    static getPythonKeywordClass(word) {
        const keywords = ['if', 'elif', 'else', 'for', 'while', 'break', 'continue', 'pass',
            'match', 'case', 'try', 'except', 'finally', 'raise', 'with', 'as',
            'def', 'return', 'yield', 'lambda', 'class', 'import', 'from',
            'and', 'or', 'not', 'in', 'is', 'global', 'nonlocal', 'del', 'assert'];
        const values = ['True', 'False', 'None'];
        const builtins = ['print', 'input', 'len', 'range', 'str', 'int', 'float', 'list',
            'dict', 'set', 'tuple', 'bool', 'type', 'open', 'abs', 'max', 'min', 'sum', 'sorted'];
        
        if (keywords.includes(word)) return 'syntax-keyword';
        if (values.includes(word)) return 'syntax-logical';
        if (builtins.includes(word)) return 'syntax-builtin';
        if (word === 'self') return 'syntax-self';
        return '';
    }
    
    // ============================================
    // C++ HIGHLIGHTING
    // ============================================
    
    static highlightCppLine(line, lineClasses) {
        let pos = 0;
        
        // Check for single-line comment
        const commentIndex = line.indexOf('//');
        const lineEnd = commentIndex !== -1 ? commentIndex : line.length;
        
        if (commentIndex !== -1) {
            for (let i = commentIndex; i < line.length; i++) {
                lineClasses[i] = 'syntax-comment';
            }
        }
        
        // Check for preprocessor directive
        const trimmed = line.trimStart();
        if (trimmed.startsWith('#')) {
            for (let i = 0; i < line.length; i++) {
                lineClasses[i] = 'syntax-preprocessor';
            }
            return;
        }
        
        while (pos < lineEnd) {
            // Skip whitespace
            if (/\s/.test(line[pos])) {
                pos++;
                continue;
            }
            
            // Check for string
            if (line[pos] === '"') {
                const start = pos;
                pos++;
                while (pos < lineEnd && line[pos] !== '"') {
                    if (line[pos] === '\\') pos++;
                    pos++;
                }
                if (pos < lineEnd) pos++;
                for (let i = start; i < pos; i++) {
                    lineClasses[i] = 'syntax-string';
                }
                continue;
            }
            
            // Check for char literal
            if (line[pos] === "'") {
                const start = pos;
                pos++;
                while (pos < lineEnd && line[pos] !== "'") {
                    if (line[pos] === '\\') pos++;
                    pos++;
                }
                if (pos < lineEnd) pos++;
                for (let i = start; i < pos; i++) {
                    lineClasses[i] = 'syntax-string';
                }
                continue;
            }
            
            // Check for number
            if (/\d/.test(line[pos])) {
                const start = pos;
                while (pos < lineEnd && /[\d.xXeEfFlLuU]/.test(line[pos])) {
                    pos++;
                }
                for (let i = start; i < pos; i++) {
                    lineClasses[i] = 'syntax-number';
                }
                continue;
            }
            
            // Check for word (identifier or keyword)
            if (/[a-zA-Z_]/.test(line[pos])) {
                const start = pos;
                while (pos < lineEnd && /[a-zA-Z0-9_]/.test(line[pos])) {
                    pos++;
                }
                const word = line.substring(start, pos);
                const syntaxClass = this.getCppKeywordClass(word);
                
                if (syntaxClass) {
                    for (let i = start; i < pos; i++) {
                        lineClasses[i] = syntaxClass;
                    }
                }
                continue;
            }
            
            // Check for operators
            if ('+-*/%=<>!&|^~?:'.includes(line[pos])) {
                lineClasses[pos] = 'syntax-operator';
                pos++;
                continue;
            }
            
            // Skip unknown character
            pos++;
        }
    }
    
    static getCppKeywordClass(word) {
        const keywords = ['if', 'else', 'switch', 'case', 'default', 'break', 'continue', 'return', 'goto',
            'for', 'while', 'do', 'class', 'struct', 'union', 'enum', 'public', 'private', 'protected',
            'virtual', 'override', 'final', 'friend', 'this', 'new', 'delete',
            'template', 'typename', 'namespace', 'using', 'typedef',
            'try', 'catch', 'throw', 'noexcept', 'sizeof', 'inline', 'constexpr'];
        const types = ['int', 'float', 'double', 'char', 'bool', 'void', 'long', 'short',
            'unsigned', 'signed', 'auto', 'string', 'vector', 'map', 'set', 'const', 'static'];
        const values = ['true', 'false', 'nullptr'];
        const builtins = ['std', 'cout', 'cin', 'endl'];
        
        if (keywords.includes(word)) return 'syntax-keyword';
        if (types.includes(word)) return 'syntax-type';
        if (values.includes(word)) return 'syntax-logical';
        if (builtins.includes(word)) return 'syntax-builtin';
        return '';
    }
    
    // ============================================
    // JAVA HIGHLIGHTING
    // ============================================
    
    static highlightJavaLine(line, lineClasses) {
        let pos = 0;
        
        // Check for single-line comment
        const commentIndex = line.indexOf('//');
        const lineEnd = commentIndex !== -1 ? commentIndex : line.length;
        
        if (commentIndex !== -1) {
            for (let i = commentIndex; i < line.length; i++) {
                lineClasses[i] = 'syntax-comment';
            }
        }
        
        while (pos < lineEnd) {
            // Skip whitespace
            if (/\s/.test(line[pos])) {
                pos++;
                continue;
            }
            
            // Check for annotation (@Override, @Deprecated, etc.)
            if (line[pos] === '@') {
                const start = pos;
                pos++;
                while (pos < lineEnd && /[a-zA-Z0-9_]/.test(line[pos])) {
                    pos++;
                }
                for (let i = start; i < pos; i++) {
                    lineClasses[i] = 'syntax-decorator';
                }
                continue;
            }
            
            // Check for string
            if (line[pos] === '"') {
                const start = pos;
                pos++;
                while (pos < lineEnd && line[pos] !== '"') {
                    if (line[pos] === '\\') pos++;
                    pos++;
                }
                if (pos < lineEnd) pos++;
                for (let i = start; i < pos; i++) {
                    lineClasses[i] = 'syntax-string';
                }
                continue;
            }
            
            // Check for char literal
            if (line[pos] === "'") {
                const start = pos;
                pos++;
                while (pos < lineEnd && line[pos] !== "'") {
                    if (line[pos] === '\\') pos++;
                    pos++;
                }
                if (pos < lineEnd) pos++;
                for (let i = start; i < pos; i++) {
                    lineClasses[i] = 'syntax-string';
                }
                continue;
            }
            
            // Check for number
            if (/\d/.test(line[pos])) {
                const start = pos;
                while (pos < lineEnd && /[\d.xXeEfFlLdD]/.test(line[pos])) {
                    pos++;
                }
                for (let i = start; i < pos; i++) {
                    lineClasses[i] = 'syntax-number';
                }
                continue;
            }
            
            // Check for word (identifier or keyword)
            if (/[a-zA-Z_]/.test(line[pos])) {
                const start = pos;
                while (pos < lineEnd && /[a-zA-Z0-9_]/.test(line[pos])) {
                    pos++;
                }
                const word = line.substring(start, pos);
                const syntaxClass = this.getJavaKeywordClass(word);
                
                if (syntaxClass) {
                    for (let i = start; i < pos; i++) {
                        lineClasses[i] = syntaxClass;
                    }
                }
                continue;
            }
            
            // Check for operators
            if ('+-*/%=<>!&|^~?:'.includes(line[pos])) {
                lineClasses[pos] = 'syntax-operator';
                pos++;
                continue;
            }
            
            // Skip unknown character
            pos++;
        }
    }
    
    static getJavaKeywordClass(word) {
        const keywords = [
            'if', 'else', 'switch', 'case', 'default', 'break', 'continue', 'return',
            'for', 'while', 'do', 'class', 'interface', 'extends', 'implements',
            'new', 'this', 'super', 'instanceof', 'enum', 'assert',
            'public', 'private', 'protected', 'abstract', 'final', 'static',
            'native', 'strictfp', 'synchronized', 'transient', 'volatile',
            'try', 'catch', 'finally', 'throw', 'throws',
            'package', 'import', 'void'
        ];
        const types = [
            'int', 'long', 'short', 'byte', 'float', 'double', 'char', 'boolean',
            'String', 'Integer', 'Long', 'Short', 'Byte', 'Float', 'Double', 'Character', 'Boolean',
            'Object', 'Class', 'Void', 'List', 'ArrayList', 'LinkedList',
            'Set', 'HashSet', 'TreeSet', 'Map', 'HashMap', 'TreeMap',
            'Queue', 'Stack', 'Vector', 'Array', 'Arrays',
            'Scanner', 'File', 'Exception'
        ];
        const values = ['true', 'false', 'null'];
        const builtins = ['System', 'Math', 'out', 'in', 'err', 'println', 'print', 'printf'];
        
        if (keywords.includes(word)) return 'syntax-keyword';
        if (types.includes(word)) return 'syntax-type';
        if (values.includes(word)) return 'syntax-logical';
        if (builtins.includes(word)) return 'syntax-builtin';
        return '';
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SyntaxHighlighter;
}
