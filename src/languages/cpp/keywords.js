/**
 * C++ Language Module - Keywords
 * Defines keywords and sidebar configuration for C++
 */

(function() {
    // Ensure namespace exists
    window.Languages = window.Languages || {};
    window.Languages.Cpp = window.Languages.Cpp || {};

    /**
     * C++ Keywords
     */
    const KEYWORDS = [
        // Control Flow
        'if', 'else', 'switch', 'case', 'default', 'break', 'continue', 'return', 'goto',
        // Loops
        'for', 'while', 'do',
        // Types
        'int', 'float', 'double', 'char', 'bool', 'void', 'long', 'short', 'unsigned', 'signed',
        'auto', 'const', 'static', 'extern', 'register', 'volatile', 'mutable',
        // Classes & OOP
        'class', 'struct', 'union', 'enum', 'public', 'private', 'protected',
        'virtual', 'override', 'final', 'friend', 'this', 'new', 'delete',
        // Templates & Modern C++
        'template', 'typename', 'namespace', 'using', 'typedef',
        // Exception Handling
        'try', 'catch', 'throw', 'noexcept',
        // Other
        'sizeof', 'true', 'false', 'nullptr', 'inline', 'constexpr'
    ];

    /**
     * C++ Types for highlighting
     */
    const TYPES = [
        'int', 'float', 'double', 'char', 'bool', 'void', 'long', 'short',
        'unsigned', 'signed', 'auto', 'string', 'vector', 'map', 'set',
        'array', 'list', 'pair', 'tuple', 'size_t', 'nullptr_t'
    ];

    /**
     * Sidebar Configuration
     * Format matches GLOSSA/Python for compatibility with main.js generateKeywordSidebar()
     */
    const SIDEBAR_CONFIG = [
        {
            id: 'structure',
            title: '🏗️ Structure',
            keywords: [
                { text: '🆕 #include', insert: '#include', smart: 'include', desc: 'Include header file' },
                { text: '🆕 main()', insert: 'int main', smart: 'main', desc: 'Main function entry point' },
                { text: 'namespace', insert: 'namespace ', smart: 'namespace', desc: 'Define namespace' },
                { text: 'using', insert: 'using namespace std;', desc: 'Using namespace directive' },
                { text: 'return', insert: 'return ', desc: 'Return from function' }
            ]
        },
        {
            id: 'types',
            title: '📝 Types',
            keywords: [
                { text: 'int', insert: 'int ', desc: 'Integer type' },
                { text: 'float', insert: 'float ', desc: 'Floating point type' },
                { text: 'double', insert: 'double ', desc: 'Double precision float' },
                { text: 'char', insert: 'char ', desc: 'Character type' },
                { text: 'bool', insert: 'bool ', desc: 'Boolean type' },
                { text: 'string', insert: 'string ', desc: 'String type (std::string)' },
                { text: 'void', insert: 'void ', desc: 'Void type' },
                { text: 'auto', insert: 'auto ', desc: 'Auto type deduction' }
            ]
        },
        {
            id: 'control',
            title: '🔀 Control',
            keywords: [
                { text: '🆕 if...', insert: 'if', smart: 'if', desc: 'If statement with braces' },
                { text: '🆕 if...else', insert: 'if', smart: 'if-else', desc: 'If-else statement' },
                { text: '🆕 switch', insert: 'switch', smart: 'switch', desc: 'Switch statement' },
                { text: 'case', insert: 'case ', desc: 'Switch case' },
                { text: 'default', insert: 'default:', desc: 'Default case' },
                { text: 'break', insert: 'break;', desc: 'Break statement' }
            ]
        },
        {
            id: 'loops',
            title: '🔁 Loops',
            keywords: [
                { text: '🆕 for...', insert: 'for', smart: 'for', desc: 'For loop with braces' },
                { text: '🆕 while...', insert: 'while', smart: 'while', desc: 'While loop' },
                { text: '🆕 do-while', insert: 'do', smart: 'do-while', desc: 'Do-while loop' },
                { text: 'continue', insert: 'continue;', desc: 'Continue to next iteration' }
            ]
        },
        {
            id: 'io',
            title: '📥 I/O',
            keywords: [
                { text: 'cout <<', insert: 'cout << ', smart: 'cout', desc: 'Output to console' },
                { text: 'cin >>', insert: 'cin >> ', smart: 'cin', desc: 'Input from console' },
                { text: 'endl', insert: 'endl', desc: 'End line and flush' },
                { text: 'printf()', insert: 'printf()', smart: 'printf', desc: 'C-style print' },
                { text: 'scanf()', insert: 'scanf()', smart: 'scanf', desc: 'C-style input' }
            ]
        },
        {
            id: 'oop',
            title: '🎯 OOP',
            keywords: [
                { text: '🆕 class', insert: 'class', smart: 'class', desc: 'Define a class' },
                { text: '🆕 struct', insert: 'struct', smart: 'struct', desc: 'Define a struct' },
                { text: 'public:', insert: 'public:', desc: 'Public access specifier' },
                { text: 'private:', insert: 'private:', desc: 'Private access specifier' },
                { text: 'protected:', insert: 'protected:', desc: 'Protected access specifier' },
                { text: 'new', insert: 'new ', desc: 'Allocate memory' },
                { text: 'delete', insert: 'delete ', desc: 'Deallocate memory' }
            ]
        },
        {
            id: 'exceptions',
            title: '⚠️ Exceptions',
            keywords: [
                { text: '🆕 try...', insert: 'try', smart: 'try', desc: 'Try-catch block' },
                { text: 'catch', insert: 'catch ', desc: 'Catch exception' },
                { text: 'throw', insert: 'throw ', desc: 'Throw exception' }
            ]
        },
        {
            id: 'values',
            title: '💎 Values',
            keywords: [
                { text: 'true', insert: 'true', desc: 'Boolean true' },
                { text: 'false', insert: 'false', desc: 'Boolean false' },
                { text: 'nullptr', insert: 'nullptr', desc: 'Null pointer' },
                { text: 'const', insert: 'const ', desc: 'Constant qualifier' }
            ]
        }
    ];

    // Register to namespace
    window.Languages.Cpp.keywords = {
        KEYWORDS,
        TYPES,
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
         * Check if a word is a type
         * @param {string} word - Word to check
         * @returns {boolean}
         */
        isType(word) {
            return TYPES.includes(word);
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
         * @returns {Array}
         */
        getSidebarConfig() {
            return SIDEBAR_CONFIG;
        }
    };

    console.log('⚡ C++ keywords module loaded');
})();
