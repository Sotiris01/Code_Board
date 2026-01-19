/**
 * ΓΛΩΣΣΑ Snippets - Code Templates and Smart Insertion Rules
 * 
 * This module contains code snippets and smart insertion rules
 * for the GLOSSA programming language. These are used by the editor
 * to provide intelligent code completion and template insertion.
 * 
 * @module languages/glossa/snippets
 */

// Initialize global namespace
window.Languages = window.Languages || {};
window.Languages.Glossa = window.Languages.Glossa || {};

(function(Glossa) {
    'use strict';

    /**
     * Standard indentation for ΓΛΩΣΣΑ (3 spaces)
     * @constant {string}
     */
    const INDENT = '   ';

/**
 * Smart insertion rules for ΓΛΩΣΣΑ keywords
 * Determines optimal placement based on context
 * 
 * Properties:
 * - placement: where to insert ('cursor', 'start', 'end', 'after-declaration', etc.)
 * - getText: function that returns the text to insert (can use code context)
 * - template: full structure template with {{CURSOR}} placeholder
 * - matchStart: for closing keywords, which opening keyword to match indent with
 * 
 * @constant {Object}
 */
const SMART_INSERTION = {
    // ========== PROGRAM STRUCTURE ==========
    
    // ΤΕΛΟΣ should go at the end of the program
    'end': {
        placement: 'end',
        getText: (code) => {
            // Extract program/algorithm name for proper ending
            const algMatch = code.match(/Αλγόριθμος\s+(\S+)/);
            const algMatchUpper = code.match(/ΑΛΓΟΡΙΘΜΟΣ\s+(\S+)/);
            const progMatch = code.match(/ΠΡΟΓΡΑΜΜΑ\s+(\S+)/);
            if (algMatch) return `Τέλος ${algMatch[1]}`;
            if (algMatchUpper) return `ΤΕΛΟΣ ${algMatchUpper[1]}`;
            if (progMatch) return `ΤΕΛΟΣ_ΠΡΟΓΡΑΜΜΑΤΟΣ`;
            return 'Τέλος';
        }
    },
    
    // ΑΡΧΗ goes after variable declarations
    'begin': {
        placement: 'after-variables',
        getText: () => 'ΑΡΧΗ'
    },
    
    // ΜΕΤΑΒΛΗΤΕΣ goes after program/algorithm declaration
    'variables': {
        placement: 'after-declaration',
        getText: () => 'ΜΕΤΑΒΛΗΤΕΣ'
    },
    
    // ΑΛΓΟΡΙΘΜΟΣ - full template at start
    'algorithm': {
        placement: 'start',
        template: `ΑΛΓΟΡΙΘΜΟΣ {{NAME}}

ΜΕΤΑΒΛΗΤΕΣ
${INDENT}ΑΚΕΡΑΙΕΣ: {{CURSOR}}

ΑΡΧΗ

ΤΕΛΟΣ {{NAME}}`,
        promptName: 'Όνομα αλγορίθμου:',
        defaultName: 'Παράδειγμα'
    },
    
    // ΠΡΟΓΡΑΜΜΑ - full template at start
    'program': {
        placement: 'start', 
        template: `ΠΡΟΓΡΑΜΜΑ {{NAME}}

ΜΕΤΑΒΛΗΤΕΣ
${INDENT}ΑΚΕΡΑΙΕΣ: {{CURSOR}}

ΑΡΧΗ

ΤΕΛΟΣ_ΠΡΟΓΡΑΜΜΑΤΟΣ`,
        promptName: 'Όνομα προγράμματος:',
        defaultName: 'Παράδειγμα'
    },
    
    // ========== CONTROL STRUCTURES ==========
    
    // ΑΝ - full IF template with indented body
    'if': {
        placement: 'cursor-indent',
        template: `ΑΝ {{CURSOR}} ΤΟΤΕ
${INDENT}
ΤΕΛΟΣ_ΑΝ`
    },
    
    // ΑΝ-ΑΛΛΙΩΣ - full IF-ELSE template
    'if-else': {
        placement: 'cursor-indent',
        template: `ΑΝ {{CURSOR}} ΤΟΤΕ
${INDENT}
ΑΛΛΙΩΣ
${INDENT}
ΤΕΛΟΣ_ΑΝ`
    },
    
    // ΤΕΛΟΣ_ΑΝ closes an open ΑΝ
    'endif': {
        placement: 'match-indent',
        getText: () => 'ΤΕΛΟΣ_ΑΝ',
        matchStart: 'ΑΝ'
    },
    
    // ΕΠΙΛΕΞΕ - full SELECT template
    'select': {
        placement: 'cursor-indent',
        template: `ΕΠΙΛΕΞΕ {{CURSOR}}
${INDENT}ΠΕΡΙΠΤΩΣΗ 
${INDENT}${INDENT}
${INDENT}ΠΕΡΙΠΤΩΣΗ ΑΛΛΙΩΣ
${INDENT}${INDENT}
ΤΕΛΟΣ_ΕΠΙΛΟΓΩΝ`
    },
    
    // ========== LOOP STRUCTURES ==========
    
    // ΓΙΑ - full FOR loop template
    'for': {
        placement: 'cursor-indent',
        template: `ΓΙΑ {{CURSOR}} ΑΠΟ  ΜΕΧΡΙ 
${INDENT}
ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ`
    },
    
    // ΓΙΑ με βήμα - FOR loop with step
    'for-step': {
        placement: 'cursor-indent',
        template: `ΓΙΑ {{CURSOR}} ΑΠΟ  ΜΕΧΡΙ  ΜΕ_ΒΗΜΑ 
${INDENT}
ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ`
    },
    
    // ΟΣΟ - full WHILE loop template
    'while': {
        placement: 'cursor-indent',
        template: `ΟΣΟ {{CURSOR}} ΕΠΑΝΑΛΑΒΕ
${INDENT}
ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ`
    },
    
    // ΑΡΧΗ_ΕΠΑΝΑΛΗΨΗΣ - full DO-WHILE template
    'do-while': {
        placement: 'cursor-indent',
        template: `ΑΡΧΗ_ΕΠΑΝΑΛΗΨΗΣ
${INDENT}{{CURSOR}}
ΜΕΧΡΙΣ_ΟΤΟΥ `
    },
    
    // ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ closes loops
    'endloop': {
        placement: 'match-indent',
        getText: () => 'ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ',
        matchStart: ['ΓΙΑ', 'ΟΣΟ']
    },
    
    // ========== SUBPROGRAMS ==========
    
    // ΔΙΑΔΙΚΑΣΙΑ - full procedure template
    'procedure': {
        placement: 'end-of-file',
        template: `ΔΙΑΔΙΚΑΣΙΑ {{NAME}}
ΜΕΤΑΒΛΗΤΕΣ
${INDENT}{{CURSOR}}
ΑΡΧΗ

ΤΕΛΟΣ_ΔΙΑΔΙΚΑΣΙΑΣ`,
        promptName: 'Όνομα διαδικασίας:',
        defaultName: 'ΜίαΔιαδικασία'
    },
    
    // ΣΥΝΑΡΤΗΣΗ - full function template
    'function': {
        placement: 'end-of-file',
        template: `ΣΥΝΑΡΤΗΣΗ {{NAME}}: ΑΚΕΡΑΙΑ
ΜΕΤΑΒΛΗΤΕΣ
${INDENT}{{CURSOR}}
ΑΡΧΗ

${INDENT}{{NAME}} <- 
ΤΕΛΟΣ_ΣΥΝΑΡΤΗΣΗΣ`,
        promptName: 'Όνομα συνάρτησης:',
        defaultName: 'ΜίαΣυνάρτηση'
    }
};

    // ===========================================
    // Register to namespace
    // ===========================================
    Glossa.snippets = {
        INDENT,
        SMART_INSERTION
    };

    // Also expose at top level for backward compatibility
    window.INDENT = INDENT;
    window.SMART_INSERTION = SMART_INSERTION;

})(window.Languages.Glossa);

// ===========================================
// Export για χρήση σε Node.js (αν χρειαστεί)
// ===========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.Languages.Glossa.snippets;
}
