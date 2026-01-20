/**
 * C++ Language Module - Snippets & Smart Insertion
 * Defines code templates and auto-completion for C++
 */

(function() {
    // Ensure namespace exists
    window.Languages = window.Languages || {};
    window.Languages.Cpp = window.Languages.Cpp || {};

    /**
     * Smart Insertion Rules
     * When user clicks a keyword with smart attribute, insert the template
     * 
     * {{CURSOR}} - Where cursor should be placed
     * {{NAME}} - Prompt user for a name
     * C++ style: braces {} with proper indentation
     */
    const SMART_INSERTION = {
        // Structure
        'include': {
            template: '#include <{{CURSOR}}>',
            description: 'Include header file'
        },
        'include-local': {
            template: '#include "{{CURSOR}}"',
            description: 'Include local header'
        },
        'main': {
            template: 'int main() {\n    {{CURSOR}}\n    return 0;\n}',
            description: 'Main function'
        },
        'main-args': {
            template: 'int main(int argc, char* argv[]) {\n    {{CURSOR}}\n    return 0;\n}',
            description: 'Main with arguments'
        },
        'namespace': {
            template: 'namespace {{NAME}} {\n    {{CURSOR}}\n}',
            description: 'Namespace definition',
            promptName: true,
            promptMessage: 'Namespace name:'
        },
        
        // Control Flow
        'if': {
            template: 'if ({{CURSOR}}) {\n    \n}',
            description: 'If statement'
        },
        'if-else': {
            template: 'if ({{CURSOR}}) {\n    \n} else {\n    \n}',
            description: 'If-else statement'
        },
        'switch': {
            template: 'switch ({{CURSOR}}) {\n    case 1:\n        break;\n    default:\n        break;\n}',
            description: 'Switch statement'
        },
        
        // Loops
        'for': {
            template: 'for (int i = 0; i < {{CURSOR}}; i++) {\n    \n}',
            description: 'For loop'
        },
        'for-range': {
            template: 'for (auto& item : {{CURSOR}}) {\n    \n}',
            description: 'Range-based for loop'
        },
        'while': {
            template: 'while ({{CURSOR}}) {\n    \n}',
            description: 'While loop'
        },
        'do-while': {
            template: 'do {\n    {{CURSOR}}\n} while ();',
            description: 'Do-while loop'
        },
        
        // I/O
        'cout': {
            template: 'cout << {{CURSOR}} << endl;',
            description: 'Output to console'
        },
        'cin': {
            template: 'cin >> {{CURSOR}};',
            description: 'Input from console'
        },
        'printf': {
            template: 'printf("{{CURSOR}}\\n");',
            description: 'C-style print'
        },
        'scanf': {
            template: 'scanf("{{CURSOR}}", &);',
            description: 'C-style input'
        },
        
        // OOP
        'class': {
            template: 'class {{NAME}} {\npublic:\n    {{NAME}}() {\n        {{CURSOR}}\n    }\n    \nprivate:\n    \n};',
            description: 'Class definition',
            promptName: true,
            promptMessage: 'Class name:'
        },
        'struct': {
            template: 'struct {{NAME}} {\n    {{CURSOR}}\n};',
            description: 'Struct definition',
            promptName: true,
            promptMessage: 'Struct name:'
        },
        'function': {
            template: 'void {{NAME}}() {\n    {{CURSOR}}\n}',
            description: 'Function definition',
            promptName: true,
            promptMessage: 'Function name:'
        },
        
        // Exceptions
        'try': {
            template: 'try {\n    {{CURSOR}}\n} catch (const exception& e) {\n    cerr << e.what() << endl;\n}',
            description: 'Try-catch block'
        },
        
        // Templates
        'template-func': {
            template: 'template <typename T>\nT {{NAME}}(T {{CURSOR}}) {\n    return ;\n}',
            description: 'Template function',
            promptName: true,
            promptMessage: 'Function name:'
        },
        'template-class': {
            template: 'template <typename T>\nclass {{NAME}} {\npublic:\n    {{CURSOR}}\n};',
            description: 'Template class',
            promptName: true,
            promptMessage: 'Class name:'
        }
    };

    /**
     * Code Templates
     */
    const TEMPLATES = {
        'hello': {
            name: 'Hello World',
            code: `#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}`
        },
        'input-output': {
            name: 'Input/Output',
            code: `#include <iostream>
#include <string>
using namespace std;

int main() {
    string name;
    int age;
    
    cout << "Enter your name: ";
    getline(cin, name);
    
    cout << "Enter your age: ";
    cin >> age;
    
    cout << "Hello, " << name << "! You are " << age << " years old." << endl;
    
    return 0;
}`
        },
        'class-example': {
            name: 'Class Example',
            code: `#include <iostream>
#include <string>
using namespace std;

class Person {
public:
    string name;
    int age;
    
    Person(string n, int a) : name(n), age(a) {}
    
    void introduce() {
        cout << "Hi, I'm " << name << " and I'm " << age << " years old." << endl;
    }
};

int main() {
    Person person("Alice", 25);
    person.introduce();
    
    return 0;
}`
        },
        'vector-example': {
            name: 'Vector Example',
            code: `#include <iostream>
#include <vector>
#include <algorithm>
using namespace std;

int main() {
    vector<int> numbers = {5, 2, 8, 1, 9, 3};
    
    // Print all elements
    cout << "Numbers: ";
    for (int n : numbers) {
        cout << n << " ";
    }
    cout << endl;
    
    // Sort the vector
    sort(numbers.begin(), numbers.end());
    
    cout << "Sorted: ";
    for (int n : numbers) {
        cout << n << " ";
    }
    cout << endl;
    
    return 0;
}`
        }
    };

    // Register to namespace
    window.Languages.Cpp.snippets = {
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

    console.log('⚡ C++ snippets module loaded');
})();
