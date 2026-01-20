/**
 * Java Language Module - Snippets & Smart Insertion
 * Defines code templates and auto-completion for Java
 * Phase 5.4: Java Smart Insertion & Snippets
 */

(function() {
    'use strict';
    
    // Ensure namespace exists
    window.Languages = window.Languages || {};
    window.Languages.Java = window.Languages.Java || {};

    /**
     * Smart Insertion Rules
     * When user types a keyword and presses Tab/Enter, insert the template
     * 
     * {{CURSOR}} - Where cursor should be placed
     * {{NAME}} - Prompt user for a name (class/method name)
     * Java style: braces + 4-space indentation
     */
    const SMART_INSERTION = {
        // Class & Structure
        'class': {
            template: 'public class {{NAME}} {\n    {{CURSOR}}\n}',
            description: 'Class definition',
            promptName: true,
            promptMessage: 'Class name:'
        },
        'interface': {
            template: 'public interface {{NAME}} {\n    {{CURSOR}}\n}',
            description: 'Interface definition',
            promptName: true,
            promptMessage: 'Interface name:'
        },
        'enum': {
            template: 'public enum {{NAME}} {\n    {{CURSOR}}\n}',
            description: 'Enum definition',
            promptName: true,
            promptMessage: 'Enum name:'
        },
        
        // Main & Methods
        'main': {
            template: 'public static void main(String[] args) {\n    {{CURSOR}}\n}',
            description: 'Main method'
        },
        'method': {
            template: 'public {{CURSOR}} {{NAME}}() {\n    \n}',
            description: 'Method definition',
            promptName: true,
            promptMessage: 'Method name:'
        },
        'void': {
            template: 'public void {{NAME}}() {\n    {{CURSOR}}\n}',
            description: 'Void method',
            promptName: true,
            promptMessage: 'Method name:'
        },
        
        // I/O
        'print': {
            template: 'System.out.println({{CURSOR}});',
            description: 'Print to console'
        },
        'printf': {
            template: 'System.out.printf("{{CURSOR}}%n");',
            description: 'Formatted print'
        },
        'scanner': {
            template: 'Scanner scanner = new Scanner(System.in);',
            description: 'Scanner for input'
        },
        'scanner-import': {
            template: 'import java.util.Scanner;',
            description: 'Import Scanner'
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
        'else-if': {
            template: 'else if ({{CURSOR}}) {\n    \n}',
            description: 'Else-if clause'
        },
        'switch': {
            template: 'switch ({{CURSOR}}) {\n    case value:\n        break;\n    default:\n        break;\n}',
            description: 'Switch statement'
        },
        
        // Loops
        'for': {
            template: 'for (int i = 0; i < {{CURSOR}}; i++) {\n    \n}',
            description: 'For loop'
        },
        'for-each': {
            template: 'for (var item : {{CURSOR}}) {\n    \n}',
            description: 'Enhanced for loop'
        },
        'while': {
            template: 'while ({{CURSOR}}) {\n    \n}',
            description: 'While loop'
        },
        'do-while': {
            template: 'do {\n    {{CURSOR}}\n} while ();',
            description: 'Do-while loop'
        },
        
        // Exception Handling
        'try': {
            template: 'try {\n    {{CURSOR}}\n} catch (Exception e) {\n    e.printStackTrace();\n}',
            description: 'Try-catch block'
        },
        'try-finally': {
            template: 'try {\n    {{CURSOR}}\n} catch (Exception e) {\n    e.printStackTrace();\n} finally {\n    \n}',
            description: 'Try-catch-finally block'
        },
        'try-resources': {
            template: 'try ({{CURSOR}}) {\n    \n} catch (Exception e) {\n    e.printStackTrace();\n}',
            description: 'Try-with-resources'
        },
        'throw': {
            template: 'throw new {{CURSOR}}Exception("");',
            description: 'Throw exception'
        },
        
        // Common Patterns
        'constructor': {
            template: 'public {{NAME}}() {\n    {{CURSOR}}\n}',
            description: 'Constructor',
            promptName: true,
            promptMessage: 'Class name:'
        },
        'getter': {
            template: 'public {{CURSOR}} get{{NAME}}() {\n    return this.;\n}',
            description: 'Getter method',
            promptName: true,
            promptMessage: 'Property name (capitalized):'
        },
        'setter': {
            template: 'public void set{{NAME}}({{CURSOR}} value) {\n    this. = value;\n}',
            description: 'Setter method',
            promptName: true,
            promptMessage: 'Property name (capitalized):'
        },
        'tostring': {
            template: '@Override\npublic String toString() {\n    return "{{CURSOR}}";\n}',
            description: 'toString override'
        },
        
        // Imports
        'import': {
            template: 'import {{CURSOR}};',
            description: 'Import statement'
        },
        'import-util': {
            template: 'import java.util.*;',
            description: 'Import java.util'
        },
        'import-io': {
            template: 'import java.io.*;',
            description: 'Import java.io'
        }
    };

    /**
     * Code Templates
     * Larger code snippets for common patterns
     */
    const TEMPLATES = {
        'main-class': {
            name: 'Main Class Template',
            code: `public class Main {
    public static void main(String[] args) {
        // Your code here
        System.out.println("Hello, World!");
    }
}`
        },
        'generic-class': {
            name: 'Generic Class Template',
            code: `public class ClassName {
    // Private fields
    private String name;
    private int value;
    
    // Constructor
    public ClassName(String name, int value) {
        this.name = name;
        this.value = value;
    }
    
    // Getters
    public String getName() {
        return this.name;
    }
    
    public int getValue() {
        return this.value;
    }
    
    // Setters
    public void setName(String name) {
        this.name = name;
    }
    
    public void setValue(int value) {
        this.value = value;
    }
    
    // toString
    @Override
    public String toString() {
        return "ClassName{name='" + name + "', value=" + value + "}";
    }
}`
        },
        'singleton': {
            name: 'Singleton Pattern',
            code: `public class Singleton {
    private static Singleton instance;
    
    private Singleton() {
        // Private constructor
    }
    
    public static Singleton getInstance() {
        if (instance == null) {
            instance = new Singleton();
        }
        return instance;
    }
}`
        },
        'interface-impl': {
            name: 'Interface Implementation',
            code: `public interface MyInterface {
    void doSomething();
    String getValue();
}

public class MyClass implements MyInterface {
    @Override
    public void doSomething() {
        // Implementation
    }
    
    @Override
    public String getValue() {
        return "value";
    }
}`
        },
        'file-reader': {
            name: 'File Reader Template',
            code: `import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;

public class FileReaderExample {
    public static void main(String[] args) {
        try (BufferedReader reader = new BufferedReader(new FileReader("file.txt"))) {
            String line;
            while ((line = reader.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }
}`
        }
    };

    // ============================================
    // EXPORT TO NAMESPACE
    // ============================================
    
    window.Languages.Java.snippets = {
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

    console.log('☕ Java snippets module loaded');
})();
