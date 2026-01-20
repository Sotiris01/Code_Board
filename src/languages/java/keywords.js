/**
 * Java Language - Keywords & Sidebar Configuration
 * Phase 5.1 & 5.2: Java Language Support
 */

(function() {
    'use strict';
    
    // Ensure namespace exists
    window.Languages = window.Languages || {};
    window.Languages.Java = window.Languages.Java || {};
    
    // ============================================
    // JAVA KEYWORDS
    // ============================================
    
    const KEYWORDS = [
        // Control flow
        'if', 'else', 'switch', 'case', 'default', 'break', 'continue', 'return',
        'for', 'while', 'do',
        // Class & Object
        'class', 'interface', 'extends', 'implements', 'new', 'this', 'super',
        'abstract', 'final', 'static', 'native', 'strictfp', 'synchronized', 'transient', 'volatile',
        // Access modifiers
        'public', 'private', 'protected',
        // Exception handling
        'try', 'catch', 'finally', 'throw', 'throws',
        // Package & Import
        'package', 'import',
        // Other
        'instanceof', 'enum', 'assert', 'void'
    ];
    
    // ============================================
    // JAVA TYPES
    // ============================================
    
    const TYPES = [
        // Primitive types
        'int', 'long', 'short', 'byte', 'float', 'double', 'char', 'boolean',
        // Common reference types
        'String', 'Integer', 'Long', 'Short', 'Byte', 'Float', 'Double', 'Character', 'Boolean',
        'Object', 'Class', 'Void',
        // Collections
        'List', 'ArrayList', 'LinkedList', 'Set', 'HashSet', 'TreeSet',
        'Map', 'HashMap', 'TreeMap', 'Queue', 'Stack', 'Vector',
        // Arrays
        'Array', 'Arrays',
        // I/O
        'Scanner', 'System', 'PrintStream', 'InputStream', 'OutputStream',
        'File', 'FileReader', 'FileWriter', 'BufferedReader', 'BufferedWriter'
    ];
    
    // ============================================
    // JAVA VALUES
    // ============================================
    
    const VALUES = [
        'true', 'false', 'null'
    ];
    
    // ============================================
    // JAVA MODIFIERS
    // ============================================
    
    const MODIFIERS = [
        'public', 'private', 'protected',
        'static', 'final', 'abstract',
        'synchronized', 'volatile', 'transient', 'native', 'strictfp'
    ];
    
    // ============================================
    // SIDEBAR CONFIGURATION
    // ============================================
    
    const SIDEBAR_CONFIG = [
        {
            id: 'structure',
            title: '📦 Structure',
            icon: '📦',
            keywords: [
                { text: 'class', insert: 'class ClassName {\n   \n}', desc: 'Class declaration', smart: true },
                { text: 'main', insert: 'public static void main(String[] args) {\n   \n}', desc: 'Main method', smart: true },
                { text: 'method', insert: 'public void methodName() {\n   \n}', desc: 'Method declaration', smart: true },
                { text: 'interface', insert: 'interface InterfaceName {\n   \n}', desc: 'Interface declaration', smart: true },
                { text: 'package', insert: 'package ', desc: 'Package declaration' },
                { text: 'import', insert: 'import ', desc: 'Import statement' }
            ]
        },
        {
            id: 'control',
            title: '🔄 Control Flow',
            icon: '🔄',
            keywords: [
                { text: 'if', insert: 'if () {\n   \n}', desc: 'If statement', smart: true },
                { text: 'if-else', insert: 'if () {\n   \n} else {\n   \n}', desc: 'If-else statement', smart: true },
                { text: 'for', insert: 'for (int i = 0; i < n; i++) {\n   \n}', desc: 'For loop', smart: true },
                { text: 'for-each', insert: 'for (Type item : collection) {\n   \n}', desc: 'Enhanced for loop', smart: true },
                { text: 'while', insert: 'while () {\n   \n}', desc: 'While loop', smart: true },
                { text: 'do-while', insert: 'do {\n   \n} while ();', desc: 'Do-while loop', smart: true },
                { text: 'switch', insert: 'switch () {\n   case :\n      break;\n   default:\n      break;\n}', desc: 'Switch statement', smart: true },
                { text: 'try-catch', insert: 'try {\n   \n} catch (Exception e) {\n   \n}', desc: 'Try-catch block', smart: true }
            ]
        },
        {
            id: 'types',
            title: '📊 Types',
            icon: '📊',
            keywords: [
                { text: 'int', insert: 'int ', desc: 'Integer type (32-bit)' },
                { text: 'long', insert: 'long ', desc: 'Long type (64-bit)' },
                { text: 'double', insert: 'double ', desc: 'Double precision float' },
                { text: 'float', insert: 'float ', desc: 'Single precision float' },
                { text: 'boolean', insert: 'boolean ', desc: 'Boolean type' },
                { text: 'char', insert: 'char ', desc: 'Character type' },
                { text: 'String', insert: 'String ', desc: 'String class' },
                { text: 'int[]', insert: 'int[] ', desc: 'Integer array' },
                { text: 'String[]', insert: 'String[] ', desc: 'String array' },
                { text: 'ArrayList', insert: 'ArrayList<> ', desc: 'ArrayList collection' }
            ]
        },
        {
            id: 'modifiers',
            title: '🔒 Modifiers',
            icon: '🔒',
            keywords: [
                { text: 'public', insert: 'public ', desc: 'Public access' },
                { text: 'private', insert: 'private ', desc: 'Private access' },
                { text: 'protected', insert: 'protected ', desc: 'Protected access' },
                { text: 'static', insert: 'static ', desc: 'Static modifier' },
                { text: 'final', insert: 'final ', desc: 'Final (constant)' },
                { text: 'abstract', insert: 'abstract ', desc: 'Abstract modifier' }
            ]
        },
        {
            id: 'io',
            title: '📥 I/O',
            icon: '📥',
            keywords: [
                { text: 'print', insert: 'System.out.print();', desc: 'Print without newline' },
                { text: 'println', insert: 'System.out.println();', desc: 'Print with newline' },
                { text: 'printf', insert: 'System.out.printf("", );', desc: 'Formatted print' },
                { text: 'Scanner', insert: 'Scanner scanner = new Scanner(System.in);', desc: 'Create Scanner for input', smart: true },
                { text: 'nextInt', insert: 'scanner.nextInt()', desc: 'Read integer' },
                { text: 'nextLine', insert: 'scanner.nextLine()', desc: 'Read line' },
                { text: 'nextDouble', insert: 'scanner.nextDouble()', desc: 'Read double' }
            ]
        },
        {
            id: 'values',
            title: '💎 Values',
            icon: '💎',
            keywords: [
                { text: 'true', insert: 'true', desc: 'Boolean true' },
                { text: 'false', insert: 'false', desc: 'Boolean false' },
                { text: 'null', insert: 'null', desc: 'Null reference' },
                { text: 'this', insert: 'this', desc: 'Current instance' },
                { text: 'super', insert: 'super', desc: 'Parent class reference' }
            ]
        }
    ];
    
    // ============================================
    // EXPORT TO NAMESPACE
    // ============================================
    
    window.Languages.Java.keywords = {
        KEYWORDS,
        TYPES,
        VALUES,
        MODIFIERS,
        SIDEBAR_CONFIG,
        
        // Helper methods
        isKeyword: (word) => KEYWORDS.includes(word),
        isType: (word) => TYPES.includes(word),
        isValue: (word) => VALUES.includes(word),
        isModifier: (word) => MODIFIERS.includes(word),
        
        // Get all keywords for syntax highlighting
        getAllKeywords: () => [...KEYWORDS, ...TYPES, ...VALUES, ...MODIFIERS]
    };
    
    console.log('☕ Java keywords module loaded');
})();
