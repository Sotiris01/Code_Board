/**
 * Python Language Module - Snippets & Smart Insertion
 * Defines code templates and auto-completion for Python
 */

(function() {
    // Ensure namespace exists
    window.Languages = window.Languages || {};
    window.Languages.Python = window.Languages.Python || {};

    /**
     * Smart Insertion Rules
     * When user types a keyword and presses Tab/Enter, insert the template
     * 
     * {{CURSOR}} - Where cursor should be placed
     * {{NAME}} - Prompt user for a name (function/class name)
     * Pythonic style: colons + 4-space indentation
     */
    const SMART_INSERTION = {
        // Control Flow
        'if': {
            template: 'if {{CURSOR}}:\n    pass',
            description: 'If statement'
        },
        'elif': {
            template: 'elif {{CURSOR}}:\n    pass',
            description: 'Elif clause'
        },
        'else': {
            template: 'else:\n    {{CURSOR}}',
            description: 'Else clause'
        },
        'if-else': {
            template: 'if {{CURSOR}}:\n    pass\nelse:\n    pass',
            description: 'If-else statement'
        },
        
        // Pattern Matching (Python 3.10+)
        'match': {
            template: 'match {{CURSOR}}:\n    case pattern:\n        pass',
            description: 'Match statement (Python 3.10+)'
        },
        'case': {
            template: 'case {{CURSOR}}:\n    pass',
            description: 'Case clause'
        },
        
        // Loops
        'for': {
            template: 'for i in range({{CURSOR}}):\n    pass',
            description: 'For loop with range'
        },
        'for-in': {
            template: 'for item in {{CURSOR}}:\n    pass',
            description: 'For-in loop'
        },
        'while': {
            template: 'while {{CURSOR}}:\n    pass',
            description: 'While loop'
        },
        
        // Functions & Classes
        'def': {
            template: 'def {{NAME}}():\n    {{CURSOR}}',
            description: 'Function definition',
            promptName: true,
            promptMessage: 'Function name:'
        },
        'def-args': {
            template: 'def {{NAME}}({{CURSOR}}):\n    pass',
            description: 'Function with arguments',
            promptName: true,
            promptMessage: 'Function name:'
        },
        'class': {
            template: 'class {{NAME}}:\n    def __init__(self):\n        {{CURSOR}}',
            description: 'Class definition',
            promptName: true,
            promptMessage: 'Class name:'
        },
        'lambda': {
            template: 'lambda {{CURSOR}}: ',
            description: 'Lambda expression'
        },
        
        // I/O
        'print': {
            template: 'print({{CURSOR}})',
            description: 'Print function'
        },
        'print-f': {
            template: 'print(f"{{CURSOR}}")',
            description: 'Print with f-string'
        },
        'input': {
            template: 'input("{{CURSOR}}")',
            description: 'Input function'
        },
        
        // Exception Handling
        'try': {
            template: 'try:\n    {{CURSOR}}\nexcept Exception as e:\n    pass',
            description: 'Try-except block'
        },
        'try-finally': {
            template: 'try:\n    {{CURSOR}}\nexcept Exception as e:\n    pass\nfinally:\n    pass',
            description: 'Try-except-finally block'
        },
        
        // Context Manager
        'with': {
            template: 'with {{CURSOR}} as f:\n    pass',
            description: 'With statement (context manager)'
        },
        'with-open': {
            template: 'with open("{{CURSOR}}", "r") as f:\n    content = f.read()',
            description: 'Open file with context manager'
        },
        
        // List Comprehension
        'listcomp': {
            template: '[{{CURSOR}} for x in ]',
            description: 'List comprehension'
        },
        'dictcomp': {
            template: '{{{CURSOR}}: v for k, v in }',
            description: 'Dictionary comprehension'
        },
        
        // Common Patterns
        'main': {
            template: 'if __name__ == "__main__":\n    {{CURSOR}}',
            description: 'Main entry point'
        },
        'import': {
            template: 'import {{CURSOR}}',
            description: 'Import statement'
        },
        'from': {
            template: 'from {{CURSOR}} import ',
            description: 'From-import statement'
        }
    };

    /**
     * Code Templates
     * Larger code snippets for common patterns
     */
    const TEMPLATES = {
        'function': {
            name: 'Function Template',
            code: `def function_name(param1, param2):
    """
    Description of the function.
    
    Args:
        param1: Description
        param2: Description
    
    Returns:
        Description of return value
    """
    # Your code here
    return result`
        },
        'class': {
            name: 'Class Template',
            code: `class ClassName:
    """Description of the class."""
    
    def __init__(self, param):
        """Initialize the class."""
        self.param = param
    
    def method(self):
        """Description of method."""
        pass`
        },
        'script': {
            name: 'Script Template',
            code: `#!/usr/bin/env python3
"""
Script description.
"""

def main():
    """Main function."""
    pass

if __name__ == "__main__":
    main()`
        }
    };

    // Register to namespace
    window.Languages.Python.snippets = {
        SMART_INSERTION,
        TEMPLATES,
        
        /**
         * Get smart insertion for a keyword
         * @param {string} keyword - Keyword to get insertion for
         * @returns {Object|null} - Insertion template or null
         */
        getInsertion(keyword) {
            return SMART_INSERTION[keyword] || null;
        },
        
        /**
         * Get all smart insertion keywords
         * @returns {string[]}
         */
        getInsertionKeywords() {
            return Object.keys(SMART_INSERTION);
        },
        
        /**
         * Get a code template
         * @param {string} name - Template name
         * @returns {Object|null}
         */
        getTemplate(name) {
            return TEMPLATES[name] || null;
        },
        
        /**
         * Get all template names
         * @returns {string[]}
         */
        getTemplateNames() {
            return Object.keys(TEMPLATES);
        }
    };

    console.log('🐍 Python snippets module loaded');
})();
