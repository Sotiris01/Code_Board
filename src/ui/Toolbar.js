/**
 * Toolbar Component
 * Handles all toolbar events: copy, clear, font size controls
 * 
 * Dependencies:
 * - UIManager (for showToast)
 * - Collaboration (for sync)
 */

const Toolbar = {
    elements: {
        copyBtn: null,
        clearBtn: null,
        fontSizeDisplay: null,
        fontIncreaseBtn: null,
        fontDecreaseBtn: null
    },
    
    // Font size state
    fontSize: 18,
    minFontSize: 12,
    maxFontSize: 36,
    fontStep: 2,
    
    // Reference to editor (GridEditor or null for legacy)
    gridEditor: null,
    legacyEditor: null,
    
    /**
     * Initialize the toolbar
     * @param {Object} options - { gridEditor, legacyEditor, onEditorUpdate }
     */
    init(options = {}) {
        this.gridEditor = options.gridEditor || null;
        this.legacyEditor = options.legacyEditor || null;
        this.onEditorUpdate = options.onEditorUpdate || (() => {});
        
        // Cache DOM elements
        this.elements.copyBtn = document.getElementById('copy-btn');
        this.elements.clearBtn = document.getElementById('clear-btn');
        this.elements.fontSizeDisplay = document.getElementById('font-size-display');
        this.elements.fontIncreaseBtn = document.getElementById('font-increase');
        this.elements.fontDecreaseBtn = document.getElementById('font-decrease');
        
        // Set up event listeners
        this._bindEvents();
        
        // Initialize font size
        this.updateFontSize(this.fontSize);
        
        console.log('🔧 Toolbar initialized');
    },
    
    /**
     * Bind event listeners
     */
    _bindEvents() {
        // Copy button
        if (this.elements.copyBtn) {
            this.elements.copyBtn.addEventListener('click', () => this.copyCode());
        }
        
        // Clear button
        if (this.elements.clearBtn) {
            this.elements.clearBtn.addEventListener('click', () => this.clearEditor());
        }
        
        // Font size controls
        if (this.elements.fontIncreaseBtn) {
            this.elements.fontIncreaseBtn.addEventListener('click', () => {
                this.updateFontSize(this.fontSize + this.fontStep);
            });
        }
        
        if (this.elements.fontDecreaseBtn) {
            this.elements.fontDecreaseBtn.addEventListener('click', () => {
                this.updateFontSize(this.fontSize - this.fontStep);
            });
        }
        
        // Global keyboard shortcuts
        document.addEventListener('keydown', (e) => this._handleGlobalKeydown(e));
    },
    
    /**
     * Handle global keyboard shortcuts
     */
    _handleGlobalKeydown(e) {
        // Ctrl/Cmd + Shift + C - Copy code
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'c') {
            e.preventDefault();
            this.copyCode();
        }
    },
    
    /**
     * Copy code to clipboard
     */
    async copyCode() {
        try {
            const code = this.gridEditor 
                ? this.gridEditor.getValue() 
                : (this.legacyEditor?.value || '');
            
            await navigator.clipboard.writeText(code);
            showToast('✅ Code copied!', 'success');
        } catch (err) {
            // Fallback for older browsers
            if (this.legacyEditor) {
                this.legacyEditor.select();
                document.execCommand('copy');
                showToast('✅ Code copied!', 'success');
            }
        }
    },
    
    /**
     * Clear the editor
     */
    clearEditor() {
        const currentCode = this.gridEditor 
            ? this.gridEditor.getValue() 
            : (this.legacyEditor?.value || '');
        
        if (currentCode.trim() === '') {
            showToast('Board is already empty', 'info');
            return;
        }
        
        if (confirm('Are you sure you want to clear the board?')) {
            if (this.gridEditor) {
                this.gridEditor.setValue('');
            } else if (this.legacyEditor) {
                this.legacyEditor.value = '';
                this.onEditorUpdate();
            }
            
            // Sync with collaboration
            if (typeof Collaboration !== 'undefined' && Collaboration.connected) {
                Collaboration.sendTemplateLoaded('', '🗑️ Clear');
            }
            
            showToast('🗑️ Board cleared', 'info');
            
            // Focus editor
            if (this.gridEditor) {
                this.gridEditor.focus();
            } else if (this.legacyEditor) {
                this.legacyEditor.focus();
            }
        }
    },
    
    /**
     * Update font size
     * @param {number} newSize - New font size in pixels
     */
    updateFontSize(newSize) {
        // Clamp the value
        this.fontSize = Math.max(this.minFontSize, Math.min(this.maxFontSize, newSize));
        
        // Update CSS custom property
        document.documentElement.style.setProperty('--font-size-default', `${this.fontSize}px`);
        
        // Update GridEditor if exists
        if (this.gridEditor) {
            this.gridEditor.setFontSize(this.fontSize);
        }
        
        // Update display
        if (this.elements.fontSizeDisplay) {
            this.elements.fontSizeDisplay.textContent = `${this.fontSize}px`;
        }
        
        // Trigger line numbers update
        if (typeof StatusBar !== 'undefined') {
            StatusBar.updateLineNumbers();
        }
    },
    
    /**
     * Get current font size
     */
    getFontSize() {
        return this.fontSize;
    },
    
    /**
     * Set editor references (for late binding)
     */
    setEditors(gridEditor, legacyEditor) {
        this.gridEditor = gridEditor;
        this.legacyEditor = legacyEditor;
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = Toolbar;
}
