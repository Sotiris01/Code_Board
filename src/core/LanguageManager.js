/**
 * Language Manager - Dynamic Language Loading & Switching
 * 
 * This module manages the loading and switching of programming languages
 * in the Code Board IDE. It provides a unified interface for syntax highlighting,
 * snippets, and keywords across different languages.
 * 
 * @module core/LanguageManager
 */

// Initialize global namespace
window.Languages = window.Languages || {};

/**
 * LanguageManager - Singleton for managing language modules
 * 
 * Responsibilities:
 * - Registry of available languages
 * - Dynamic loading of language modules
 * - State management (current language)
 * - Unified interface for language features
 */
const LanguageManager = (function() {
    'use strict';

    // ===========================================
    // Private State
    // ===========================================
    
    /**
     * Registry of available languages with their metadata
     * @private
     */
    const registry = {
        glossa: {
            code: 'glossa',
            name: 'ΓΛΩΣΣΑ',
            displayName: 'ΓΛΩΣΣΑ',
            files: [
                'src/languages/glossa/keywords.js',
                'src/languages/glossa/snippets.js',
                'src/languages/glossa/syntax.js',
                'src/languages/glossa/content.js'
            ],
            namespace: 'Glossa',
            loaded: false
        },
        python: {
            code: 'python',
            name: 'Python',
            displayName: 'Python',
            files: [
                'src/languages/python/keywords.js',
                'src/languages/python/snippets.js',
                'src/languages/python/syntax.js',
                'src/languages/python/content.js'
            ],
            namespace: 'Python',
            loaded: false
        },
        cpp: {
            code: 'cpp',
            name: 'C++',
            displayName: 'C++',
            files: [
                'src/languages/cpp/keywords.js',
                'src/languages/cpp/snippets.js',
                'src/languages/cpp/syntax.js',
                'src/languages/cpp/content.js'
            ],
            namespace: 'Cpp',
            loaded: false
        },
        java: {
            code: 'java',
            name: 'Java',
            displayName: 'Java',
            files: [
                'src/languages/java/keywords.js',
                'src/languages/java/snippets.js',
                'src/languages/java/syntax.js',
                'src/languages/java/content.js'
            ],
            namespace: 'Java',
            loaded: false
        }
    };

    /**
     * Currently active language code
     * @private
     */
    let currentLanguageCode = null;

    /**
     * Loading state for preventing concurrent loads
     * @private
     */
    const loadingPromises = {};

    // ===========================================
    // Private Methods
    // ===========================================

    /**
     * Dynamically loads a script file
     * @private
     * @param {string} src - Script source URL
     * @returns {Promise} Resolves when script is loaded
     */
    function loadScript(src) {
        return new Promise((resolve, reject) => {
            // Add cache-busting version
            const versionedSrc = src + '?v=' + Date.now();
            
            // Check if script already exists
            const existing = document.querySelector(`script[src^="${src}"]`);
            if (existing) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = versionedSrc;
            script.async = false; // Maintain load order
            
            script.onload = () => {
                console.log(`[LanguageManager] Loaded: ${src}`);
                resolve();
            };
            
            script.onerror = () => {
                reject(new Error(`Failed to load script: ${src}`));
            };

            document.head.appendChild(script);
        });
    }

    /**
     * Loads all files for a language sequentially
     * @private
     * @param {string} langCode - Language code
     * @returns {Promise} Resolves when all files are loaded
     */
    async function loadLanguageFiles(langCode) {
        const lang = registry[langCode];
        if (!lang) {
            throw new Error(`Unknown language: ${langCode}`);
        }

        if (lang.loaded) {
            return; // Already loaded
        }

        // Prevent concurrent loads of the same language
        if (loadingPromises[langCode]) {
            return loadingPromises[langCode];
        }

        console.log(`[LanguageManager] Loading language: ${lang.name}`);

        loadingPromises[langCode] = (async () => {
            try {
                // Load files sequentially to maintain dependencies
                for (const file of lang.files) {
                    await loadScript(file);
                }
                
                lang.loaded = true;
                console.log(`[LanguageManager] Language ready: ${lang.name}`);
            } catch (error) {
                console.error(`[LanguageManager] Failed to load ${lang.name}:`, error);
                throw error;
            } finally {
                delete loadingPromises[langCode];
            }
        })();

        return loadingPromises[langCode];
    }

    /**
     * Gets the language module from the global namespace
     * @private
     * @param {string} langCode - Language code
     * @returns {Object|null} Language module or null
     */
    function getLanguageModule(langCode) {
        const lang = registry[langCode];
        if (!lang || !lang.loaded) {
            console.warn('[LanguageManager] getLanguageModule: Language not loaded', {
                langCode,
                inRegistry: !!lang,
                loaded: lang?.loaded
            });
            return null;
        }
        const module = window.Languages[lang.namespace] || null;
        console.log('[LanguageManager] getLanguageModule:', {
            langCode,
            namespace: lang.namespace,
            moduleFound: !!module,
            moduleKeys: module ? Object.keys(module) : []
        });
        return module;
    }

    // ===========================================
    // Public API
    // ===========================================

    return {
        /**
         * Gets list of available language codes
         * @returns {string[]} Array of language codes
         */
        getAvailableLanguages() {
            return Object.keys(registry);
        },

        /**
         * Gets metadata for all registered languages
         * @returns {Object[]} Array of language metadata objects
         */
        getLanguageList() {
            return Object.values(registry).map(lang => ({
                code: lang.code,
                name: lang.name,
                displayName: lang.displayName,
                loaded: lang.loaded
            }));
        },

        /**
         * Gets the current language code
         * @returns {string|null} Current language code or null
         */
        getCurrentLanguage() {
            return currentLanguageCode;
        },

        /**
         * Gets the current language metadata
         * @returns {Object|null} Current language metadata or null
         */
        getCurrentLanguageInfo() {
            if (!currentLanguageCode) return null;
            const lang = registry[currentLanguageCode];
            return lang ? {
                code: lang.code,
                name: lang.name,
                displayName: lang.displayName
            } : null;
        },

        /**
         * Loads a language module (if not already loaded)
         * @param {string} langCode - Language code to load
         * @returns {Promise} Resolves when language is ready
         */
        async loadLanguage(langCode) {
            if (!registry[langCode]) {
                throw new Error(`Unknown language: ${langCode}`);
            }
            await loadLanguageFiles(langCode);
        },

        /**
         * Sets the current active language
         * @param {string} langCode - Language code to activate
         * @param {Object} options - Optional settings
         * @param {boolean} options.isRemoteSync - If true, this change came from remote sync (don't clear editor)
         * @returns {Promise} Resolves when language is active
         */
        async setLanguage(langCode, options = {}) {
            if (!registry[langCode]) {
                throw new Error(`Unknown language: ${langCode}`);
            }

            // Load if not already loaded
            if (!registry[langCode].loaded) {
                await loadLanguageFiles(langCode);
            }

            currentLanguageCode = langCode;
            console.log(`[LanguageManager] Active language: ${registry[langCode].name}`);

            // Dispatch event for listeners
            window.dispatchEvent(new CustomEvent('languageChanged', {
                detail: { 
                    language: langCode,
                    info: this.getCurrentLanguageInfo(),
                    isRemoteSync: options.isRemoteSync || false
                }
            }));

            return this.getCurrentLanguageInfo();
        },

        /**
         * Checks if a language is loaded
         * @param {string} langCode - Language code
         * @returns {boolean} True if loaded
         */
        isLanguageLoaded(langCode) {
            return registry[langCode]?.loaded || false;
        },

        // ===========================================
        // Language Feature Interface
        // ===========================================

        /**
         * Applies syntax highlighting using the current language
         * @param {string} code - Code to highlight
         * @returns {string} Highlighted HTML string
         */
        highlight(code) {
            if (!currentLanguageCode) {
                console.warn('[LanguageManager] No language set, returning plain code');
                return code;
            }

            const langModule = getLanguageModule(currentLanguageCode);
            if (!langModule || !langModule.syntax || !langModule.syntax.highlight) {
                // Fallback to global function for backward compatibility
                if (typeof window.highlightSyntax === 'function') {
                    return window.highlightSyntax(code);
                }
                console.warn('[LanguageManager] No highlight function available');
                return code;
            }

            return langModule.syntax.highlight(code);
        },

        /**
         * Gets keywords for the current language
         * @returns {Object|null} Keywords object or null
         */
        getKeywords() {
            if (!currentLanguageCode) return null;

            const langModule = getLanguageModule(currentLanguageCode);
            if (!langModule || !langModule.keywords) {
                // Fallback to global for backward compatibility
                return window.GLOSSA_KEYWORDS || null;
            }

            return langModule.keywords.GLOSSA_KEYWORDS || langModule.keywords;
        },

        /**
         * Gets snippets/smart insertion rules for the current language
         * @returns {Object|null} Snippets object or null
         */
        getSnippets() {
            if (!currentLanguageCode) return null;

            const langModule = getLanguageModule(currentLanguageCode);
            if (!langModule || !langModule.snippets) {
                // Fallback to global for backward compatibility
                return {
                    INDENT: window.INDENT,
                    SMART_INSERTION: window.SMART_INSERTION
                };
            }

            return langModule.snippets;
        },

        /**
         * Gets sidebar configuration for the current language
         * @returns {Array|null} Sidebar config array or null
         */
        getSidebarConfig() {
            if (!currentLanguageCode) {
                console.warn('[LanguageManager] getSidebarConfig: No current language');
                return null;
            }

            const langModule = getLanguageModule(currentLanguageCode);
            console.log('[LanguageManager] getSidebarConfig:', {
                currentLanguage: currentLanguageCode,
                langModule: !!langModule,
                hasKeywords: !!(langModule && langModule.keywords),
                hasSidebarConfig: !!(langModule && langModule.keywords && langModule.keywords.SIDEBAR_CONFIG)
            });
            
            if (!langModule || !langModule.keywords || !langModule.keywords.SIDEBAR_CONFIG) {
                console.warn('[LanguageManager] Falling back to global SIDEBAR_CONFIG');
                return window.SIDEBAR_CONFIG || null;
            }

            return langModule.keywords.SIDEBAR_CONFIG;
        },

        /**
         * Gets content provider for the current language
         * Provides initialCode, exercises, algorithms, templates
         * @returns {Object|null} Content provider object or null
         */
        getContent() {
            if (!currentLanguageCode) return null;

            const langModule = getLanguageModule(currentLanguageCode);
            if (!langModule || !langModule.content) {
                // Return a minimal content object for backward compatibility
                return {
                    initialCode: '',
                    algorithms: { getDropdownData: () => [], get: () => null },
                    exercises: { getDropdownData: () => [], get: () => null },
                    templates: { getDropdownData: () => [], get: () => null }
                };
            }

            return langModule.content;
        },

        /**
         * Registers a new language (for runtime additions)
         * @param {Object} langConfig - Language configuration
         */
        registerLanguage(langConfig) {
            if (!langConfig.code || !langConfig.name || !langConfig.files) {
                throw new Error('Invalid language configuration');
            }
            
            registry[langConfig.code] = {
                ...langConfig,
                loaded: false
            };
            
            console.log(`[LanguageManager] Registered language: ${langConfig.name}`);
        }
    };
})();

// Make LanguageManager globally available
window.LanguageManager = LanguageManager;

// ===========================================
// Export for Node.js (if needed)
// ===========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LanguageManager;
}
