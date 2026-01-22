/**
 * UIManager Component
 * Handles UI utilities, theme toggling, sidebar resizing, and general DOM helpers
 * 
 * Exports (global):
 * - showToast(message, type)
 * - escapeHtml(text)
 * - SidebarResizer
 * - ThemeToggle
 * - ShortcutsHelp
 */

// ============================================
// UTILITY FUNCTIONS (Global)
// ============================================

/**
 * Escapes HTML special characters to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped HTML string
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Shows a toast notification
 * @param {string} message - Message to display
 * @param {string} type - Toast type: 'info', 'success', 'error', 'warning'
 */
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (!toast || !toastMessage) {
        console.warn('Toast elements not found');
        return;
    }
    
    toastMessage.textContent = message;
    toast.className = `toast ${type}`; // This removes 'hidden' class
    toast.classList.remove('hidden'); // Ensure hidden is removed
    
    // Force reflow for animation
    void toast.offsetWidth;
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 2500);
}

// ============================================
// SIDEBAR RESIZER
// ============================================

const SidebarResizer = {
    handle: null,
    sidebar: null,
    isResizing: false,
    startX: 0,
    startWidth: 0,
    
    /**
     * Initialize the sidebar resizer
     */
    init() {
        this.handle = document.getElementById('sidebar-resize-handle');
        this.sidebar = document.getElementById('keyword-sidebar');
        
        if (!this.handle || !this.sidebar) return;
        
        // Load saved width from localStorage
        const savedWidth = localStorage.getItem('sidebarWidth');
        if (savedWidth) {
            this.sidebar.style.width = savedWidth + 'px';
        }
        
        this.handle.addEventListener('mousedown', (e) => this.startResize(e));
        document.addEventListener('mousemove', (e) => this.resize(e));
        document.addEventListener('mouseup', () => this.stopResize());
        
        console.log('📐 Sidebar Resizer initialized');
    },
    
    /**
     * Start resize operation
     */
    startResize(e) {
        this.isResizing = true;
        this.startX = e.clientX;
        this.startWidth = this.sidebar.offsetWidth;
        this.handle.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    },
    
    /**
     * Handle resize movement
     */
    resize(e) {
        if (!this.isResizing) return;
        
        const deltaX = this.startX - e.clientX;
        const newWidth = Math.min(Math.max(this.startWidth + deltaX, 150), 400);
        this.sidebar.style.width = newWidth + 'px';
    },
    
    /**
     * Stop resize operation
     */
    stopResize() {
        if (!this.isResizing) return;
        
        this.isResizing = false;
        this.handle.classList.remove('dragging');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        
        // Save width to localStorage
        localStorage.setItem('sidebarWidth', this.sidebar.offsetWidth);
    }
};

// ============================================
// THEME TOGGLE
// ============================================

const ThemeToggle = {
    button: null,
    
    /**
     * Initialize theme toggle functionality
     */
    init() {
        this.button = document.getElementById('theme-toggle-btn');
        if (!this.button) return;
        
        // Load saved theme preference
        const savedTheme = localStorage.getItem('aepp-theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            this.updateIcon(true);
        }
        
        this.button.addEventListener('click', () => this.toggle());
        
        // Keyboard shortcut: Ctrl+Shift+T
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'T') {
                e.preventDefault();
                this.toggle();
            }
        });
        
        console.log('🎨 Theme Toggle initialized');
    },
    
    /**
     * Toggle theme between light and dark
     */
    toggle() {
        const isLight = document.body.classList.toggle('light-theme');
        localStorage.setItem('aepp-theme', isLight ? 'light' : 'dark');
        this.updateIcon(isLight);
    },
    
    /**
     * Update the theme icon
     */
    updateIcon(isLight) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) {
            themeIcon.textContent = isLight ? '☀️' : '🌙';
        }
    }
};

// ============================================
// SHORTCUTS HELP MODAL
// ============================================

const ShortcutsHelp = {
    modal: null,
    
    /**
     * Initialize keyboard shortcuts help modal
     */
    init() {
        const helpBtn = document.getElementById('shortcuts-help-btn');
        this.modal = document.getElementById('shortcuts-modal');
        const closeBtn = document.getElementById('shortcuts-modal-close');
        const overlay = this.modal?.querySelector('.modal-overlay');
        
        if (!helpBtn || !this.modal) return;
        
        helpBtn.addEventListener('click', () => this.show());
        closeBtn?.addEventListener('click', () => this.hide());
        overlay?.addEventListener('click', () => this.hide());
        
        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.key === 'F1') {
                e.preventDefault();
                this.show();
            } else if (e.key === 'Escape' && !this.modal.classList.contains('hidden')) {
                this.hide();
            }
        });
        
        console.log('⌨️ Shortcuts Help initialized');
    },
    
    /**
     * Show the shortcuts modal
     */
    show() {
        if (this.modal) {
            this.modal.classList.remove('hidden');
        }
    },
    
    /**
     * Hide the shortcuts modal
     */
    hide() {
        if (this.modal) {
            this.modal.classList.add('hidden');
        }
    }
};

// ============================================
// STUDENT LIST PANEL (Teacher only)
// ============================================

const StudentListPanel = {
    toggle: null,
    popup: null,
    
    /**
     * Initialize student list panel toggle
     */
    init() {
        this.toggle = document.getElementById('student-list-toggle');
        this.popup = document.getElementById('student-list-popup');
        
        if (!this.toggle || !this.popup) return;
        
        this.toggle.addEventListener('click', (e) => {
            e.stopPropagation();
            this.popup.classList.toggle('hidden');
        });
        
        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.popup.contains(e.target) && !this.toggle.contains(e.target)) {
                this.popup.classList.add('hidden');
            }
        });
        
        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.popup.classList.contains('hidden')) {
                this.popup.classList.add('hidden');
            }
        });
        
        console.log('👥 Student List Panel initialized');
    }
};

// ============================================
// HAND RAISE & REACTIONS (Collaboration UI)
// ============================================

const HandRaiseAndReactions = {
    /**
     * Initialize hand raise and reaction buttons
     * @param {boolean} isTeacher - Whether the current user is a teacher
     */
    init(isTeacher) {
        // Hand raise button (students)
        const handRaiseBtn = document.getElementById('hand-raise-btn');
        if (handRaiseBtn && !isTeacher) {
            handRaiseBtn.addEventListener('click', () => {
                if (typeof Collaboration === 'undefined') return;
                
                const newState = !Collaboration.handRaised;
                Collaboration.sendHandRaise(newState);
                handRaiseBtn.classList.toggle('raised', newState);
                handRaiseBtn.textContent = newState ? '🙋' : '✋';
                handRaiseBtn.title = newState ? 'Lower your hand' : 'Raise your hand';
            });
        }
        
        // Raised hands indicator (teacher) - click to see who raised
        const raisedHandsEl = document.getElementById('raised-hands');
        if (raisedHandsEl && isTeacher) {
            raisedHandsEl.addEventListener('click', () => {
                if (typeof Collaboration === 'undefined') return;
                
                const names = Array.from(Collaboration.raisedHands.values());
                if (names.length > 0) {
                    showToast(`✋ Hands: ${names.join(', ')}`);
                }
            });
        }
        
        // Focus mode button (teacher)
        const focusModeBtn = document.getElementById('focus-mode-btn');
        if (focusModeBtn && isTeacher) {
            focusModeBtn.addEventListener('click', () => {
                if (typeof Collaboration === 'undefined') return;
                
                const newState = !Collaboration.focusModeEnabled;
                Collaboration.sendFocusMode(newState);
                focusModeBtn.classList.toggle('active', newState);
                focusModeBtn.title = newState ? 'Disable Focus Mode' : 'Focus Mode - Lock students';
                showToast(newState ? '🔒 Focus Mode enabled' : '🔓 Focus Mode disabled');
            });
        }
        
        // Reaction buttons (students)
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                if (typeof Collaboration === 'undefined') return;
                
                const reaction = btn.dataset.reaction;
                const emoji = btn.textContent;
                
                // Toggle active state
                btn.classList.toggle('active');
                
                // Send reaction
                Collaboration.sendReaction(reaction, emoji);
                
                // Auto-clear after 3 seconds
                setTimeout(() => {
                    btn.classList.remove('active');
                }, 3000);
            });
        });
        
        // Reaction counts (teacher) - double-click to clear
        const reactionCountsEl = document.getElementById('reaction-counts');
        if (reactionCountsEl && isTeacher) {
            reactionCountsEl.addEventListener('dblclick', () => {
                if (typeof Collaboration === 'undefined') return;
                
                if (confirm('Καθαρισμός αντιδράσεων;')) {
                    Collaboration.clearReactions();
                }
            });
        }
        
        // Start session timer when collaboration connects
        if (typeof Collaboration !== 'undefined') {
            const originalUpdateStatus = Collaboration.updateConnectionStatus.bind(Collaboration);
            Collaboration.updateConnectionStatus = function(connected) {
                originalUpdateStatus(connected);
                if (connected) {
                    this.startSessionTimer();
                }
            };
        }
    }
};

// ============================================
// UI MANAGER - Unified Interface
// ============================================

const UIManager = {
    /**
     * Initialize all UI components
     * @param {Object} options - { isTeacher: boolean }
     */
    init(options = {}) {
        const isTeacher = options.isTeacher || false;
        
        // Initialize all UI components
        ThemeToggle.init();
        ShortcutsHelp.init();
        SidebarResizer.init();
        StudentListPanel.init();
        HandRaiseAndReactions.init(isTeacher);
        
        console.log('🎛️ UIManager initialized');
    }
};

// Export for module systems if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        UIManager,
        SidebarResizer,
        ThemeToggle,
        ShortcutsHelp,
        StudentListPanel,
        HandRaiseAndReactions,
        showToast,
        escapeHtml
    };
}
