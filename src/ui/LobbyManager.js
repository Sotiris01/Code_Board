/**
 * Lobby Manager - Waiting Room for Student Access Control
 * Handles the lobby UI where students must enter a 4-digit code to join
 */

const LobbyManager = {
    elements: {
        overlay: null,
        codeInput: null,
        joinBtn: null,
        errorMessage: null,
        teacherName: null,
        teacherEmail: null,
        teacherPhone: null,
        teacherDiscord: null
    },
    
    isVisible: false,
    teacherInfo: null,
    
    /**
     * Initialize the Lobby Manager
     */
    init() {
        this.elements.overlay = document.getElementById('lobby-overlay');
        this.elements.codeInput = document.getElementById('lobby-code-input');
        this.elements.joinBtn = document.getElementById('lobby-join-btn');
        this.elements.errorMessage = document.getElementById('lobby-error');
        this.elements.teacherName = document.getElementById('lobby-teacher-name');
        this.elements.teacherEmail = document.getElementById('lobby-teacher-email');
        this.elements.teacherPhone = document.getElementById('lobby-teacher-phone');
        this.elements.teacherDiscord = document.getElementById('lobby-teacher-discord');
        
        if (!this.elements.overlay) {
            console.warn('⚠️ Lobby overlay not found in DOM');
            return;
        }
        
        this._bindEvents();
        this._loadTeacherInfo();
        
        console.log('🚪 LobbyManager initialized');
    },
    
    /**
     * Bind event listeners
     */
    _bindEvents() {
        // Join button click
        if (this.elements.joinBtn) {
            this.elements.joinBtn.addEventListener('click', () => this._handleJoin());
        }
        
        // Code input - auto-focus and handle Enter key
        if (this.elements.codeInput) {
            this.elements.codeInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this._handleJoin();
                }
            });
            
            // Only allow digits, max 4 characters
            this.elements.codeInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '').slice(0, 4);
                e.target.value = value;
                
                // Clear error when typing
                this._hideError();
            });
        }
    },
    
    /**
     * Load teacher info from server
     */
    async _loadTeacherInfo() {
        try {
            const response = await fetch('/api/teacher-info');
            if (response.ok) {
                this.teacherInfo = await response.json();
                this._updateTeacherDisplay();
            }
        } catch (error) {
            console.error('Failed to load teacher info:', error);
        }
    },
    
    /**
     * Update teacher info display
     */
    _updateTeacherDisplay() {
        if (!this.teacherInfo) return;
        
        if (this.elements.teacherName) {
            this.elements.teacherName.textContent = this.teacherInfo.name || 'Teacher';
        }
        if (this.elements.teacherEmail && this.teacherInfo.email) {
            this.elements.teacherEmail.innerHTML = `📧 <a href="mailto:${this.teacherInfo.email}">${this.teacherInfo.email}</a>`;
        }
        if (this.elements.teacherPhone && this.teacherInfo.phone) {
            this.elements.teacherPhone.innerHTML = `📱 <a href="tel:${this.teacherInfo.phone}">${this.teacherInfo.phone}</a>`;
        }
        if (this.elements.teacherDiscord && this.teacherInfo.discord) {
            this.elements.teacherDiscord.innerHTML = `💬 Discord: <strong>${this.teacherInfo.discord}</strong>`;
        }
    },
    
    /**
     * Handle join button click
     */
    _handleJoin() {
        const code = this.elements.codeInput?.value || '';
        
        if (code.length !== 4) {
            this._showError('Please enter a 4-digit code');
            return;
        }
        
        // Disable button while verifying
        if (this.elements.joinBtn) {
            this.elements.joinBtn.disabled = true;
            this.elements.joinBtn.textContent = 'Verifying...';
        }
        
        // Send verification request via Collaboration
        if (typeof Collaboration !== 'undefined') {
            Collaboration.sendVerifyCode(code);
        }
    },
    
    /**
     * Show the lobby overlay
     */
    show() {
        if (this.elements.overlay) {
            this.elements.overlay.classList.add('visible');
            this.isVisible = true;
            
            // Focus the code input
            setTimeout(() => {
                this.elements.codeInput?.focus();
            }, 100);
            
            console.log('🚪 Lobby shown - waiting for access code');
        }
    },
    
    /**
     * Hide the lobby overlay (access granted)
     */
    hide() {
        if (this.elements.overlay) {
            this.elements.overlay.classList.remove('visible');
            this.isVisible = false;
            
            // Clear input
            if (this.elements.codeInput) {
                this.elements.codeInput.value = '';
            }
            
            console.log('✅ Lobby hidden - access granted');
        }
    },
    
    /**
     * Handle authentication failure
     * @param {string} message - Error message to display
     */
    onAuthFailed(message) {
        this._showError(message || 'Invalid code. Please try again.');
        
        // Re-enable button
        if (this.elements.joinBtn) {
            this.elements.joinBtn.disabled = false;
            this.elements.joinBtn.textContent = 'Enter Class';
        }
        
        // Clear and focus input
        if (this.elements.codeInput) {
            this.elements.codeInput.value = '';
            this.elements.codeInput.focus();
        }
    },
    
    /**
     * Show error message
     */
    _showError(message) {
        if (this.elements.errorMessage) {
            this.elements.errorMessage.textContent = message;
            this.elements.errorMessage.classList.add('visible');
        }
    },
    
    /**
     * Hide error message
     */
    _hideError() {
        if (this.elements.errorMessage) {
            this.elements.errorMessage.classList.remove('visible');
        }
    },
    
    /**
     * Check if lobby is currently visible
     */
    isLobbyVisible() {
        return this.isVisible;
    }
};

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LobbyManager;
}
