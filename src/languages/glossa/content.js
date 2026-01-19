/**
 * ΓΛΩΣΣΑ Content Provider
 * 
 * This module provides language-specific content for the GLOSSA language:
 * - Initial code (default editor content)
 * - Exercises data (EXERCISE_LIST, EXERCISES)
 * - Algorithms data (Vivlio/Tetradio chapters)
 * - Templates data (CODE_TEMPLATES)
 * 
 * All content is registered to window.Languages.Glossa.content
 * 
 * @module languages/glossa/content
 */

// Initialize global namespace
window.Languages = window.Languages || {};
window.Languages.Glossa = window.Languages.Glossa || {};

(function(Glossa) {
    'use strict';

    // ===========================================
    // Initial Code - Default Editor Content
    // ===========================================
    
    const initialCode = `Αλγόριθμος Παράδειγμα

Διάβασε χ

Εμφάνισε χ

Τέλος Παράδειγμα`;

    // ===========================================
    // Algorithms Data Structure
    // ===========================================
    
    /**
     * Chapter metadata with icons and titles
     */
    const chapterMeta = {
        chapter3: { icon: '📊', title: 'Κεφ.3: Δομές Δεδομένων', source: 'vivlio' },
        chapter7: { icon: '💻', title: 'Κεφ.7: Βασικές Έννοιες', source: 'vivlio' },
        chapter8: { icon: '🔀', title: 'Κεφ.8: Επιλογή & Επανάληψη', source: 'vivlio' },
        chapter9: { icon: '📋', title: 'Κεφ.9: Πίνακες', source: 'vivlio' },
        chapter10: { icon: '🔧', title: 'Κεφ.10: Υποπρογράμματα', source: 'vivlio' }
    };

    /**
     * Algorithms from Βιβλίο Μαθητή (Student's Book - Theory)
     * Structure: { chapterKey: { algoKey: { title, code } } }
     */
    const vivlioAlgorithms = {
        // These will be populated from external files or dynamically
        // The structure allows for:
        // chapter3: {
        //     algorithm1: { title: 'Τίτλος', code: '...' },
        //     algorithm2: { title: 'Τίτλος', code: '...' }
        // }
    };

    /**
     * Algorithms from Τετράδιο Μαθητή (Student's Workbook - Exercises)
     * Structure: Array of { key, name, chapter, code }
     */
    const tetradioAlgorithms = [
        // Example structure:
        // { key: 'ALGORITHM_EXAMPLE', name: 'Παράδειγμα', chapter: 3, code: '...' }
    ];

    /**
     * Builds the algorithm dropdown data in a generic format
     * @returns {Array} Array of dropdown items with categories
     */
    function getAlgorithmDropdownData() {
        const items = [];
        
        // === ΒΙΒΛΙΟ ΜΑΘΗΤΗ (Θεωρία) ===
        const vivlioHasContent = Object.keys(vivlioAlgorithms).length > 0 ||
            (typeof window.algorithmsGlossa !== 'undefined');
        
        if (vivlioHasContent) {
            items.push({
                type: 'separator',
                id: 'separator_vivlio',
                label: '📘 ─── ΒΙΒΛΙΟ ΜΑΘΗΤΗ ───',
                style: { fontWeight: 'bold', color: '#2196F3' }
            });
            
            // Use external algorithmsGlossa if available, otherwise use local
            const algos = typeof window.algorithmsGlossa !== 'undefined' 
                ? window.algorithmsGlossa 
                : vivlioAlgorithms;
            
            for (const chapterKey in algos) {
                const chapter = algos[chapterKey];
                const meta = chapterMeta[chapterKey] || { icon: '📄', title: chapterKey };
                
                // Chapter separator
                items.push({
                    type: 'separator',
                    id: `separator_${chapterKey}`,
                    label: `${meta.icon} ${meta.title}`,
                    style: { fontStyle: 'italic' }
                });
                
                // Algorithms in chapter
                for (const algoKey in chapter) {
                    if (algoKey === 'title') continue;
                    const algo = chapter[algoKey];
                    if (algo && algo.title && algo.code) {
                        items.push({
                            type: 'item',
                            id: `vivlio_${chapterKey}_${algoKey}`,
                            label: `  📖 ${algo.title}`,
                            code: algo.code
                        });
                    }
                }
            }
        }
        
        // === ΤΕΤΡΑΔΙΟ ΜΑΘΗΤΗ (Ασκήσεις) ===
        // Check for Tetradio algorithms (from globals or local)
        const tetradioRegistry = [
            { key: 'ALGORITHM_MEGALYTEROS_MISTHOS', name: 'Μεγαλύτερος Μισθός', chapter: 3 },
            { key: 'ALGORITHM_SYNDUASMOS', name: 'Συνδυασμός', chapter: 3 },
            { key: 'ALGORITHM_SYNDUASMOS2', name: 'Συνδυασμός (Βελτιστοποιημένο)', chapter: 3 },
            { key: 'ALGORITHM_MESOS_OROS', name: 'Μέσος Όρος', chapter: 3 },
            { key: 'ALGORITHM_ATHROYSMA_PINAKWN', name: 'Άθροισμα Πινάκων', chapter: 3 },
            { key: 'ALGORITHM_ARAIOS', name: 'Αραιός Πίνακας', chapter: 3 },
            { key: 'PROGRAM_TROXIA_MPALAS', name: 'Τροχιά Μπάλας', chapter: 7 },
            { key: 'PROGRAM_DOSEIS_AYTOKINITOU', name: 'Δόσεις Αυτοκινήτου', chapter: 7 },
            { key: 'PROGRAM_LOGARIASMOS_NEROU', name: 'Λογαριασμός Νερού', chapter: 8 },
            { key: 'PROGRAM_TROXIA_MPALAS2', name: 'Τροχιά Μπάλας 2', chapter: 8 },
            { key: 'PROGRAM_AEROPORIKES_ETAIREIES', name: 'Αεροπορικές Εταιρείες', chapter: 9 },
            { key: 'PROGRAM_AUTOKINITA_THORIVOS', name: 'Θόρυβος Αυτοκινήτων', chapter: 9 },
            { key: 'PROGRAM_SYGXONEYSI', name: 'Συγχώνευση Πινάκων', chapter: 9 },
            { key: 'PROGRAM_STATISTIKI', name: 'Στατιστική', chapter: 10 },
            { key: 'PROGRAM_PYRGOI_ANOI', name: 'Πύργοι του Ανόι', chapter: 10 }
        ];
        
        const availableTetradio = tetradioRegistry.filter(algo => 
            typeof window[algo.key] !== 'undefined'
        );
        
        if (availableTetradio.length > 0) {
            items.push({
                type: 'separator',
                id: 'separator_tetradio',
                label: '📗 ─── ΤΕΤΡΑΔΙΟ ΜΑΘΗΤΗ ───',
                style: { fontWeight: 'bold', color: '#4CAF50' }
            });
            
            const chapterIcons = { 3: '📊', 7: '💻', 8: '🔀', 9: '📋', 10: '🔧' };
            let currentChapter = 0;
            
            availableTetradio.forEach(algo => {
                // Add chapter separator if changed
                if (algo.chapter !== currentChapter) {
                    currentChapter = algo.chapter;
                    items.push({
                        type: 'separator',
                        id: `separator_tetradio_ch${algo.chapter}`,
                        label: `${chapterIcons[algo.chapter] || '📄'} Κεφ.${algo.chapter}`,
                        style: { fontStyle: 'italic' }
                    });
                }
                
                items.push({
                    type: 'item',
                    id: `tetradio_${algo.key}`,
                    label: `  📝 ${algo.name}`,
                    code: window[algo.key]
                });
            });
        }
        
        return items;
    }

    /**
     * Gets algorithm code by ID
     * @param {string} algorithmId - The algorithm identifier
     * @returns {{ code: string, name: string } | null}
     */
    function getAlgorithm(algorithmId) {
        if (!algorithmId || algorithmId.startsWith('separator_')) {
            return null;
        }
        
        if (algorithmId.startsWith('vivlio_')) {
            const parts = algorithmId.split('_');
            const chapterKey = parts[1];
            const algoKey = parts.slice(2).join('_');
            
            const algos = typeof window.algorithmsGlossa !== 'undefined' 
                ? window.algorithmsGlossa 
                : vivlioAlgorithms;
            
            if (algos[chapterKey] && algos[chapterKey][algoKey]) {
                const algo = algos[chapterKey][algoKey];
                return {
                    code: algo.code.trim(),
                    name: `📘 ${algo.title}`
                };
            }
        } else if (algorithmId.startsWith('tetradio_')) {
            const constName = algorithmId.replace('tetradio_', '');
            if (typeof window[constName] !== 'undefined') {
                // Find the name from registry
                const registry = [
                    { key: 'ALGORITHM_MEGALYTEROS_MISTHOS', name: 'Μεγαλύτερος Μισθός' },
                    { key: 'ALGORITHM_SYNDUASMOS', name: 'Συνδυασμός' },
                    { key: 'ALGORITHM_SYNDUASMOS2', name: 'Συνδυασμός (Βελτιστοποιημένο)' },
                    { key: 'ALGORITHM_MESOS_OROS', name: 'Μέσος Όρος' },
                    { key: 'ALGORITHM_ATHROYSMA_PINAKWN', name: 'Άθροισμα Πινάκων' },
                    { key: 'ALGORITHM_ARAIOS', name: 'Αραιός Πίνακας' },
                    { key: 'PROGRAM_TROXIA_MPALAS', name: 'Τροχιά Μπάλας' },
                    { key: 'PROGRAM_DOSEIS_AYTOKINITOU', name: 'Δόσεις Αυτοκινήτου' },
                    { key: 'PROGRAM_LOGARIASMOS_NEROU', name: 'Λογαριασμός Νερού' },
                    { key: 'PROGRAM_TROXIA_MPALAS2', name: 'Τροχιά Μπάλας 2' },
                    { key: 'PROGRAM_AEROPORIKES_ETAIREIES', name: 'Αεροπορικές Εταιρείες' },
                    { key: 'PROGRAM_AUTOKINITA_THORIVOS', name: 'Θόρυβος Αυτοκινήτων' },
                    { key: 'PROGRAM_SYGXONEYSI', name: 'Συγχώνευση Πινάκων' },
                    { key: 'PROGRAM_STATISTIKI', name: 'Στατιστική' },
                    { key: 'PROGRAM_PYRGOI_ANOI', name: 'Πύργοι του Ανόι' }
                ];
                const found = registry.find(r => r.key === constName);
                return {
                    code: window[constName].trim(),
                    name: `📗 ${found ? found.name : constName}`
                };
            }
        }
        
        return null;
    }

    // ===========================================
    // Exercises Data Structure
    // ===========================================
    
    /**
     * Exercise list for dropdown (display only)
     * Structure: Array of { id, name, disabled? }
     */
    const exerciseList = [
        // Will be populated from external source or defined here
        // Example:
        // { id: 'ex_01_01', name: 'Άσκηση 1.1: Είσοδος/Έξοδος' },
        // { id: 'separator_02', name: '── Κεφάλαιο 2 ──', disabled: true }
    ];

    /**
     * Exercises with their code
     * Structure: { exerciseId: { name, description, code } }
     */
    const exercises = {
        // Will be populated from external source
        // Example:
        // ex_01_01: {
        //     name: 'Άσκηση 1.1',
        //     description: 'Είσοδος και έξοδος δεδομένων',
        //     code: '...'
        // }
    };

    /**
     * Gets the exercise dropdown data
     * @returns {Array} Array of dropdown items
     */
    function getExerciseDropdownData() {
        // Use external EXERCISE_LIST if available, otherwise use local
        const list = typeof window.EXERCISE_LIST !== 'undefined' 
            ? window.EXERCISE_LIST 
            : exerciseList;
        
        return list.map(item => ({
            type: item.disabled || item.id.startsWith('separator_') ? 'separator' : 'item',
            id: item.id,
            label: item.name,
            style: item.disabled ? { fontWeight: 'bold', color: '#888' } : undefined
        }));
    }

    /**
     * Gets exercise by ID
     * @param {string} exerciseId - The exercise identifier
     * @returns {{ code: string, name: string, description?: string } | null}
     */
    function getExercise(exerciseId) {
        if (!exerciseId || exerciseId.startsWith('separator_')) {
            return null;
        }
        
        // Use external EXERCISES if available, otherwise use local
        const exData = typeof window.EXERCISES !== 'undefined' 
            ? window.EXERCISES 
            : exercises;
        
        const exercise = exData[exerciseId];
        if (exercise) {
            return {
                code: exercise.code,
                name: exercise.name,
                description: exercise.description
            };
        }
        
        return null;
    }

    // ===========================================
    // Templates Data Structure
    // ===========================================
    
    /**
     * Code templates for quick insertion
     * Structure: { templateKey: codeString }
     */
    const templates = {
        // Use external CODE_TEMPLATES if available, these are fallbacks
        algorithm: `Αλγόριθμος Όνομα

! Περιγραφή αλγορίθμου

Τέλος Όνομα`,
        
        program: `ΠΡΟΓΡΑΜΜΑ Όνομα
ΜΕΤΑΒΛΗΤΕΣ
   ΑΚΕΡΑΙΕΣ: χ
ΑΡΧΗ
   ΔΙΑΒΑΣΕ χ
   ΓΡΑΨΕ χ
ΤΕΛΟΣ_ΠΡΟΓΡΑΜΜΑΤΟΣ`,
        
        if_simple: `ΑΝ συνθήκη ΤΟΤΕ
   ! εντολές
ΤΕΛΟΣ_ΑΝ`,
        
        if_else: `ΑΝ συνθήκη ΤΟΤΕ
   ! εντολές αν αληθής
ΑΛΛΙΩΣ
   ! εντολές αν ψευδής
ΤΕΛΟΣ_ΑΝ`,
        
        for_loop: `ΓΙΑ μετρητής ΑΠΟ αρχή ΜΕΧΡΙ τέλος
   ! εντολές
ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ`,
        
        while_loop: `ΟΣΟ συνθήκη ΕΠΑΝΑΛΑΒΕ
   ! εντολές
ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ`,
        
        repeat_until: `ΑΡΧΗ_ΕΠΑΝΑΛΗΨΗΣ
   ! εντολές
ΜΕΧΡΙΣ_ΟΤΟΥ συνθήκη`,
        
        function: `ΣΥΝΑΡΤΗΣΗ Όνομα(παράμετροι): ΤΥΠΟΣ
ΜΕΤΑΒΛΗΤΕΣ
   ! δηλώσεις
ΑΡΧΗ
   ! εντολές
   Όνομα <- αποτέλεσμα
ΤΕΛΟΣ_ΣΥΝΑΡΤΗΣΗΣ`,
        
        procedure: `ΔΙΑΔΙΚΑΣΙΑ Όνομα(παράμετροι)
ΜΕΤΑΒΛΗΤΕΣ
   ! δηλώσεις
ΑΡΧΗ
   ! εντολές
ΤΕΛΟΣ_ΔΙΑΔΙΚΑΣΙΑΣ`
    };

    /**
     * Template categories for organized display
     */
    const templateCategories = [
        {
            id: 'basic',
            label: '📝 Βασικά',
            items: [
                { key: 'algorithm', label: 'Αλγόριθμος' },
                { key: 'program', label: 'Πρόγραμμα' }
            ]
        },
        {
            id: 'selection',
            label: '🔀 Επιλογή',
            items: [
                { key: 'if_simple', label: 'Απλή ΑΝ' },
                { key: 'if_else', label: 'ΑΝ-ΑΛΛΙΩΣ' }
            ]
        },
        {
            id: 'loops',
            label: '🔄 Επανάληψη',
            items: [
                { key: 'for_loop', label: 'ΓΙΑ' },
                { key: 'while_loop', label: 'ΟΣΟ' },
                { key: 'repeat_until', label: 'ΜΕΧΡΙΣ_ΟΤΟΥ' }
            ]
        },
        {
            id: 'subprograms',
            label: '🔧 Υποπρογράμματα',
            items: [
                { key: 'function', label: 'Συνάρτηση' },
                { key: 'procedure', label: 'Διαδικασία' }
            ]
        }
    ];

    /**
     * Gets the template dropdown data
     * @returns {Array} Array of dropdown items with categories
     */
    function getTemplateDropdownData() {
        const items = [];
        
        templateCategories.forEach(category => {
            // Add category separator
            items.push({
                type: 'separator',
                id: `separator_${category.id}`,
                label: category.label,
                style: { fontWeight: 'bold' }
            });
            
            // Add items in category
            category.items.forEach(item => {
                items.push({
                    type: 'item',
                    id: item.key,
                    label: `  ${item.label}`
                });
            });
        });
        
        return items;
    }

    /**
     * Gets template code by key
     * @param {string} templateKey - The template identifier
     * @returns {string | null} Template code or null
     */
    function getTemplate(templateKey) {
        if (!templateKey || templateKey.startsWith('separator_')) {
            return null;
        }
        
        // Use external CODE_TEMPLATES if available, otherwise use local
        const tmpl = typeof window.CODE_TEMPLATES !== 'undefined' 
            ? window.CODE_TEMPLATES 
            : templates;
        
        return tmpl[templateKey] || null;
    }

    // ===========================================
    // Content Provider API
    // ===========================================
    
    /**
     * Register content provider to namespace
     */
    Glossa.content = {
        // Initial code
        initialCode: initialCode,
        
        // Algorithms
        algorithms: {
            getDropdownData: getAlgorithmDropdownData,
            get: getAlgorithm,
            chapterMeta: chapterMeta
        },
        
        // Exercises
        exercises: {
            getDropdownData: getExerciseDropdownData,
            get: getExercise
        },
        
        // Templates
        templates: {
            getDropdownData: getTemplateDropdownData,
            get: getTemplate,
            categories: templateCategories
        },
        
        // Direct access (for backward compatibility during transition)
        getInitialCode: () => initialCode,
        getAlgorithm: getAlgorithm,
        getExercise: getExercise,
        getTemplate: getTemplate
    };

    // ===========================================
    // Backward Compatibility - Global Exports
    // ===========================================
    
    // Export templates for backward compatibility (if not already defined)
    if (typeof window.CODE_TEMPLATES === 'undefined') {
        window.CODE_TEMPLATES = templates;
    }
    
    // Export exercise list for backward compatibility (if not already defined)
    if (typeof window.EXERCISE_LIST === 'undefined') {
        window.EXERCISE_LIST = exerciseList;
    }
    
    // Export exercises for backward compatibility (if not already defined)
    if (typeof window.EXERCISES === 'undefined') {
        window.EXERCISES = exercises;
    }

    console.log('[GLOSSA Content] Module loaded');

})(window.Languages.Glossa);

