/**
 * UIManager Component
 * Handles UI utilities, theme toggling, sidebar resizing, and general DOM helpers
 * 
 * Exports (global):
 * - showToast(message, type)
 * - escapeHtml(text)
 * - SidebarResizer
 * - ThemeManager
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
// SIDEBAR RESIZER  (Phase 3.2/3.7 — drag/dblclick/Ctrl+B + ResizeObserver)
// ============================================

const SidebarResizer = {
    handle: null,
    panel: null,
    container: null,
    isResizing: false,
    startX: 0,
    startWidth: 0,
    defaultWidth: 280,
    _autoCollapsed: false,
    _userExpanded: false,

    storageKey() {
        const active = document.querySelector('.sidebar-panel.active');
        const id = active ? active.id.replace(/-panel$/, '') : 'default';
        return `aepp-sidebar-width:${id}`;
    },

    init() {
        this.handle = document.getElementById('sidebar-resize-handle');
        this.panel = document.getElementById('side-panel');
        this.container = document.getElementById('sidebar-container');
        if (!this.handle || !this.panel) return;

        this.applyStoredWidth();

        this.handle.addEventListener('mousedown', (e) => this.startResize(e));
        document.addEventListener('mousemove', (e) => this.resize(e));
        document.addEventListener('mouseup', () => this.stopResize());
        this.handle.addEventListener('dblclick', () => this.resetWidth());

        window.addEventListener('sidebarPanelChanged', () => this.applyStoredWidth());

        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && !e.shiftKey && !e.altKey && (e.key === 'b' || e.key === 'B')) {
                e.preventDefault();
                this.toggle();
            }
        });

        // Auto-collapse on narrow viewports; auto-expand again on wide ones unless
        // the user has explicitly collapsed it themselves.
        if ('ResizeObserver' in window) {
            const root = document.querySelector('.app-container');
            if (root) {
                const ro = new ResizeObserver((entries) => {
                    const w = entries[0].contentRect.width;
                    if (w < 1100 && !this.panel.classList.contains('collapsed') && !this._userExpanded) {
                        this.collapse(true);
                    } else if (w >= 1200 && this._autoCollapsed) {
                        this.expand(true);
                    }
                    window.dispatchEvent(new CustomEvent('layoutChanged', { detail: { width: w } }));
                });
                ro.observe(root);
            }
        }

        console.log('📐 Sidebar Resizer initialized');
    },

    applyStoredWidth() {
        if (!this.panel) return;
        const saved = localStorage.getItem(this.storageKey());
        this.panel.style.width = saved ? `${parseInt(saved, 10)}px` : '';
    },

    resetWidth() {
        if (!this.panel) return;
        this.panel.style.width = '';
        localStorage.removeItem(this.storageKey());
        if (typeof showToast === 'function') showToast('Sidebar width reset', 'info');
    },

    startResize(e) {
        if (!this.panel) return;
        this.isResizing = true;
        this.startX = e.clientX;
        this.startWidth = this.panel.offsetWidth;
        this.handle.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    },

    resize(e) {
        if (!this.isResizing) return;
        const deltaX = this.startX - e.clientX;
        const newWidth = Math.min(Math.max(this.startWidth + deltaX, 200), 600);
        this.panel.style.width = `${newWidth}px`;
    },

    stopResize() {
        if (!this.isResizing) return;
        this.isResizing = false;
        this.handle.classList.remove('dragging');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        localStorage.setItem(this.storageKey(), this.panel.offsetWidth);
    },

    toggle() {
        if (!this.panel) return;
        if (this.panel.classList.contains('collapsed')) this.expand();
        else this.collapse();
    },

    collapse(auto = false) {
        if (!this.panel) return;
        this.panel.classList.add('collapsed');
        if (auto) this._autoCollapsed = true;
        else { this._userExpanded = false; this._autoCollapsed = false; }
    },

    expand(auto = false) {
        if (!this.panel) return;
        this.panel.classList.remove('collapsed');
        this._autoCollapsed = false;
        if (!auto) this._userExpanded = true;
    }
};

// ============================================
// THEME MANAGER  (Phase 2 — data-theme on <html>)
// ============================================

const ThemeManager = {
    button: null,
    current: 'dark',

    init() {
        this.button = document.getElementById('theme-toggle-btn');
        const saved = localStorage.getItem('aepp-theme');
        this.apply(saved === 'light' ? 'light' : 'dark', { persist: false, broadcast: false });

        if (this.button) {
            this.button.addEventListener('click', () => this.toggle());
        }
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && (e.key === 'T' || e.key === 't')) {
                e.preventDefault();
                this.toggle();
            }
        });

        console.log('🎨 ThemeManager initialized');
    },

    toggle() {
        this.apply(this.current === 'light' ? 'dark' : 'light');
    },

    apply(theme, { persist = true, broadcast = true } = {}) {
        if (theme !== 'light' && theme !== 'dark') return;
        this.current = theme;
        document.documentElement.setAttribute('data-theme', theme);
        // Legacy body class kept off in case any old rule still references it.
        document.body.classList.remove('light-theme');
        this.updateIcon(theme === 'light');
        if (persist) localStorage.setItem('aepp-theme', theme);
        if (broadcast && typeof Collaboration !== 'undefined' && Collaboration.sendThemeChange) {
            Collaboration.sendThemeChange(theme);
        }
    },

    updateIcon(isLight) {
        const themeIcon = document.querySelector('.theme-icon');
        if (themeIcon) themeIcon.textContent = isLight ? '☀️' : '🌙';
    }
};

// Backwards-compatible alias for any external caller.
const ThemeToggle = ThemeManager;

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
     * Initialize reaction buttons
     * @param {boolean} isTeacher - Whether the current user is a teacher
     */
    init(isTeacher) {
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
// SOFT-WRAP TOGGLE  (Phase 3.3) — Alt+Z / toolbar button
// ============================================

const SoftWrap = {
    KEY: 'aepp-soft-wrap',

    init(isTeacher) {
        const stored = localStorage.getItem(this.KEY);
        const defaultOn = !isTeacher; // students get wrap on by default
        const enabled = stored === null ? defaultOn : stored === '1';
        this.apply(enabled);

        document.addEventListener('keydown', (e) => {
            if (e.altKey && !e.ctrlKey && !e.shiftKey && (e.key === 'z' || e.key === 'Z')) {
                e.preventDefault();
                this.toggle();
            }
        });

        const btn = document.getElementById('toggle-wrap-btn');
        if (btn) btn.addEventListener('click', () => this.toggle());
    },

    apply(on) {
        document.body.classList.toggle('soft-wrap-on', !!on);
        const btn = document.getElementById('toggle-wrap-btn');
        if (btn) btn.classList.toggle('active', !!on);
    },

    toggle() {
        const on = !document.body.classList.contains('soft-wrap-on');
        this.apply(on);
        localStorage.setItem(this.KEY, on ? '1' : '0');
        if (typeof showToast === 'function') showToast(`Soft wrap ${on ? 'on' : 'off'}`, 'info');
    }
};

// ============================================
// OVERFLOW INDICATOR  (Phase 3.3/3.7) — fade hint when editor scrolls
// ============================================

const OverflowIndicator = {
    init() {
        const container = document.querySelector('.editor-container');
        if (!container) return;
        const targets = [
            document.getElementById('grid-editor-container'),
            container.querySelector('.code-editor'),
            container.querySelector('.md-content')
        ].filter(Boolean);
        if (!targets.length) return;

        const update = () => {
            const overflow = targets.some(el => el.scrollWidth > el.clientWidth + 1);
            container.classList.toggle('has-overflow-x', overflow);
        };

        if ('ResizeObserver' in window) {
            const ro = new ResizeObserver(update);
            ro.observe(container);
            targets.forEach(el => ro.observe(el));
        }
        window.addEventListener('layoutChanged', update);
        targets.forEach(el => el.addEventListener('scroll', update, { passive: true }));
        // Initial check after first paint.
        requestAnimationFrame(update);
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
        ThemeManager.init();
        ShortcutsHelp.init();
        SidebarResizer.init();
        SoftWrap.init(isTeacher);
        OverflowIndicator.init();
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
        ThemeManager,
        ThemeToggle,
        ShortcutsHelp,
        StudentListPanel,
        HandRaiseAndReactions,
        showToast,
        escapeHtml
    };
}
