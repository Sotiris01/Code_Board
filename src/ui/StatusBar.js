/**
 * StatusBar Component
 * Handles cursor position, language display, and connection status updates
 * VS Code-style status bar
 * 
 * Dependencies:
 * - GridEditor (optional)
 */

const StatusBar = {
    elements: {
        lineNumbers: null,
        cursorPosition: null,
        languageDisplay: null,
        connectionStatus: null,
        sessionTimer: null,
        ngrokLatency: null,
        ngrokConnections: null,
        raisedHands: null
    },
    
    // Current state
    currentRow: 1,
    currentCol: 1,
    currentSelection: 0,
    currentLanguage: 'GLOSSA',
    
    // Reference to editor
    gridEditor: null,
    legacyEditor: null,
    
    // Teacher mode flag
    isTeacher: false,
    
    /**
     * Initialize the status bar
     * @param {Object} options - { gridEditor, legacyEditor, isTeacher }
     */
    init(options = {}) {
        this.gridEditor = options.gridEditor || null;
        this.legacyEditor = options.legacyEditor || null;
        this.isTeacher = options.isTeacher || false;
        
        // Cache DOM elements
        this.elements.lineNumbers = document.getElementById('line-numbers');
        this.elements.cursorPosition = document.getElementById('cursor-position');
        this.elements.languageDisplay = document.getElementById('status-language');
        this.elements.connectionStatus = document.getElementById('connection-status');
        this.elements.sessionTimer = document.getElementById('session-timer');
        this.elements.ngrokLatency = document.getElementById('ngrok-latency');
        this.elements.ngrokConnections = document.getElementById('ngrok-connections');
        
        // Initial update
        this.updateLineNumbers();
        this.updateCursor(1, 1, 0);
        
        // Initialize ngrok stats for teacher
        if (this.isTeacher) {
            this._initNgrokStats();
        }
        
        console.log('📊 StatusBar initialized');
    },
    
    /**
     * Update cursor position display (VS Code style)
     * @param {number} row - Current line number (1-based)
     * @param {number} col - Current column number (1-based)
     * @param {number} selectionLen - Number of characters selected (0 if none)
     */
    updateCursor(row, col, selectionLen = 0) {
        this.currentRow = row;
        this.currentCol = col;
        this.currentSelection = selectionLen;
        
        if (this.elements.cursorPosition) {
            let text = `Ln ${row}, Col ${col}`;
            if (selectionLen > 0) {
                text += ` (${selectionLen} selected)`;
            }
            this.elements.cursorPosition.textContent = text;
        }
    },
    
    /**
     * Set the current language display
     * @param {string} langName - Language name to display
     */
    setLanguage(langName) {
        this.currentLanguage = langName.toUpperCase();
        
        if (this.elements.languageDisplay) {
            this.elements.languageDisplay.textContent = this.currentLanguage;
        }
    },
    
    /**
     * Update line numbers display (gutter)
     */
    updateLineNumbers() {
        let lineCount;
        
        if (this.gridEditor) {
            lineCount = this.gridEditor.getLineCount();
        } else if (this.legacyEditor) {
            const code = this.legacyEditor.value;
            const lines = code.split('\n');
            lineCount = lines.length;
        } else {
            lineCount = 1;
        }
        
        // Build line numbers HTML
        if (this.elements.lineNumbers) {
            let lineNumbersHtml = '';
            for (let i = 1; i <= lineCount; i++) {
                const hasBreakpoint = this.gridEditor && this.gridEditor.hasBreakpoint(i - 1);
                const breakpointClass = hasBreakpoint ? ' has-breakpoint' : '';
                const breakpointMarker = hasBreakpoint ? '<span class="breakpoint-marker">●</span>' : '';
                lineNumbersHtml += `<div class="line-number${breakpointClass}" data-line="${i-1}">${breakpointMarker}${i}</div>`;
            }
            
            this.elements.lineNumbers.innerHTML = lineNumbersHtml;
            
            // Add click handlers for breakpoints (teacher only)
            if (this.isTeacher && this.gridEditor) {
                this.elements.lineNumbers.querySelectorAll('.line-number').forEach(el => {
                    el.style.cursor = 'pointer';
                    el.addEventListener('click', () => {
                        const row = parseInt(el.dataset.line);
                        this.gridEditor.toggleBreakpoint(row);
                    });
                });
            }
        }
    },
    
    /**
     * Update connection status display
     * @param {boolean} connected - Whether connected
     * @param {string} statusText - Optional status text
     */
    updateConnectionStatus(connected, statusText) {
        if (this.elements.connectionStatus) {
            this.elements.connectionStatus.className = connected ? 'connected' : 'disconnected';
            if (statusText) {
                this.elements.connectionStatus.textContent = statusText;
            }
        }
    },
    
    /**
     * Initialize ngrok stats display (teacher only)
     */
    _initNgrokStats() {
        const statsContainer = document.getElementById('ngrok-stats');
        if (!statsContainer) return;
        
        statsContainer.style.display = 'flex';
        
        // Fetch stats immediately and then every 5 seconds
        this._fetchNgrokStats();
        setInterval(() => this._fetchNgrokStats(), 5000);
    },
    
    /**
     * Fetch ngrok stats from server API
     */
    async _fetchNgrokStats() {
        if (!this.elements.ngrokLatency || !this.elements.ngrokConnections) return;
        
        try {
            const response = await fetch('/api/ngrok-stats');
            const data = await response.json();
            
            if (data.success) {
                const latency = data.latency;
                
                // Update latency display
                if (latency !== null) {
                    this.elements.ngrokLatency.textContent = `${latency}ms`;
                    this.elements.ngrokLatency.classList.remove('warning', 'critical');
                    if (latency > 500) {
                        this.elements.ngrokLatency.classList.add('critical');
                    } else if (latency > 200) {
                        this.elements.ngrokLatency.classList.add('warning');
                    }
                } else {
                    this.elements.ngrokLatency.textContent = '--ms';
                }
                
                // Update connections count
                this.elements.ngrokConnections.textContent = `${data.connections || 0} 👥`;
            } else {
                this.elements.ngrokLatency.textContent = '--ms';
                this.elements.ngrokConnections.textContent = '? 👥';
            }
        } catch (error) {
            console.warn('Failed to fetch ngrok stats:', error);
            this.elements.ngrokLatency.textContent = '--ms';
            this.elements.ngrokConnections.textContent = '? 👥';
        }
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
    module.exports = StatusBar;
}
