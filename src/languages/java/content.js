/**
 * Java Language - Content Provider
 * Phase 5.1: Java Language Support
 * Provides exercises and templates for the Java language
 */

(function() {
    'use strict';
    
    // Ensure namespace exists
    window.Languages = window.Languages || {};
    window.Languages.Java = window.Languages.Java || {};
    
    // ============================================
    // INITIAL CODE
    // ============================================
    
    const initialCode = `// Java Program
public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`;
    
    // ============================================
    // EXERCISES PROVIDER
    // ============================================
    
    const exercises = {
        /**
         * Get dropdown data for exercises selector
         * @returns {Object} { levels: [], chapters: [] }
         */
        getDropdownData() {
            return {
                levels: [],
                chapters: []
            };
        },
        
        /**
         * Get exercises for a specific chapter and level
         * @param {string} chapter - Chapter identifier
         * @param {string} level - Level identifier
         * @returns {Array} Array of exercise objects
         */
        getExercises(chapter, level) {
            return [];
        },
        
        /**
         * Load a specific exercise
         * @param {string} exerciseId - Exercise identifier
         * @returns {Object|null} Exercise object or null
         */
        loadExercise(exerciseId) {
            return null;
        }
    };
    
    // ============================================
    // TEMPLATES PROVIDER
    // ============================================
    
    const templates = {
        /**
         * Get a template by filename
         * @param {string} filename - Template filename (e.g., 'program.java')
         * @returns {string|null} Template content or null
         */
        get(filename) {
            return null;
        },
        
        /**
         * Get all available templates
         * @returns {Array} Array of template objects with { id, name, filename }
         */
        getAll() {
            return [];
        },
        
        /**
         * Get template categories
         * @returns {Array} Array of category objects
         */
        getCategories() {
            return [];
        }
    };
    
    // ============================================
    // EXPORT TO NAMESPACE
    // ============================================
    
    window.Languages.Java.content = {
        initialCode,
        exercises,
        templates
    };
    
    console.log('☕ Java content module loaded');
})();
