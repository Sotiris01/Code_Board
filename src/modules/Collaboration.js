/**
 * AEPP Board - WebSocket Collaboration Client
 * Συγχρονισμός κώδικα σε πραγματικό χρόνο
 */

/**
 * Throttle utility - limits how often a function can be called
 * @param {Function} func - Function to throttle
 * @param {number} limit - Minimum ms between calls
 * @returns {Function} Throttled function
 */
function throttle(func, limit) {
    let lastCall = 0;
    let lastArgs = null;
    let timeoutId = null;
    
    return function(...args) {
        const now = Date.now();
        lastArgs = args;
        
        if (now - lastCall >= limit) {
            lastCall = now;
            func.apply(this, args);
        } else if (!timeoutId) {
            // Schedule a call for the end of the throttle period
            timeoutId = setTimeout(() => {
                lastCall = Date.now();
                timeoutId = null;
                func.apply(this, lastArgs);
            }, limit - (now - lastCall));
        }
    };
}

const Collaboration = {
    ws: null,
    connected: false,
    myId: null,
    myRole: null,
    connectedUsers: [],
    isUpdatingFromRemote: false,
    reconnectAttempts: 0,
    maxReconnectAttempts: Infinity, // Never give up
    reconnectDelay: 0, // Current delay for UI display
    reconnectTimer: null, // Timer for countdown display
    
    // Teacher tools state
    remoteCursors: {},  // Store cursor positions of other users
    cursorUpdateInterval: null,
    highlightSyncEnabled: true, // Sync text selection/highlight
    
    // Hand raise & reactions state
    handRaised: false,
    raisedHands: new Map(), // userId -> userName
    reactions: new Map(), // reaction type -> Set of userIds
    focusModeEnabled: false, // Focus mode state
    
    // Session timer
    sessionStartTime: null,
    sessionTimerInterval: null,
    
    // Throttled functions (initialized in init)
    _throttledSendCursor: null,
    _throttledSendLaser: null,
    _throttledSendPdfLaser: null,
    _throttledSendHighlightTiles: null,
    
    // Network traffic tracking
    _bytesSentThisSecond: 0,
    _bytesReceivedThisSecond: 0,
    _bytesSentPerSec: 0,
    _bytesReceivedPerSec: 0,
    _trafficInterval: null,
    
    /**
     * Αρχικοποίηση WebSocket σύνδεσης
     */
    init() {
        // Initialize throttled functions
        this._throttledSendCursor = throttle(this._sendCursorUpdateImmediate.bind(this), 100);
        this._throttledSendLaser = throttle(this._sendLaserPointImmediate.bind(this), 50);
        this._throttledSendPdfLaser = throttle(this._sendPdfLaserImmediate.bind(this), 50);
        this._throttledSendHighlightTiles = throttle(this._sendHighlightTilesImmediate.bind(this), 100);
        
        // Initialize reactions map
        this.reactions.set('understood', new Set());
        this.reactions.set('confused', new Set());
        this.reactions.set('repeat', new Set());
        
        // Start traffic monitor
        this._startTrafficMonitor();
        
        // Initialize offline detection
        this._initOfflineDetection();
        
        // Προσδιορισμός αν είναι teacher ή student
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role') || 'student';
        
        // Check if teacher password is required
        if (role === 'teacher') {
            this._checkAndPromptPassword(role);
        } else {
            this._connectWithRole(role, null);
        }
    },
    
    /**
     * Initialize offline detection
     */
    _initOfflineDetection() {
        this.isOnline = navigator.onLine;
        this._updateOfflineIndicator();
        
        window.addEventListener('online', () => {
            console.log('🌐 Network: Online');
            this.isOnline = true;
            this._updateOfflineIndicator();
            
            // Try to reconnect if was disconnected
            if (!this.connected && !this.reconnecting) {
                this._reconnect();
            }
        });
        
        window.addEventListener('offline', () => {
            console.log('📴 Network: Offline');
            this.isOnline = false;
            this._updateOfflineIndicator();
        });
    },
    
    /**
     * Update offline indicator UI
     */
    _updateOfflineIndicator() {
        let indicator = document.getElementById('offline-indicator');
        
        if (!this.isOnline) {
            if (!indicator) {
                indicator = document.createElement('div');
                indicator.id = 'offline-indicator';
                indicator.className = 'offline-indicator';
                indicator.innerHTML = `
                    <span class="offline-icon">📴</span>
                    <span class="offline-text">Εκτός σύνδεσης</span>
                `;
                document.body.appendChild(indicator);
            }
            indicator.classList.add('visible');
        } else {
            if (indicator) {
                indicator.classList.remove('visible');
            }
        }
    },
    
    /**
     * Check if teacher password is required and prompt if needed
     */
    async _checkAndPromptPassword(role) {
        try {
            const response = await fetch('/api/auth-config');
            const config = await response.json();
            
            if (config.teacherPasswordRequired) {
                const password = prompt('🔐 Εισάγετε τον κωδικό καθηγητή:');
                if (!password) {
                    alert('Δεν εισήχθη κωδικός. Συνδεθείτε ως μαθητής.');
                    window.location.href = window.location.pathname; // Reload as student
                    return;
                }
                this._connectWithRole(role, password);
            } else {
                this._connectWithRole(role, null);
            }
        } catch (error) {
            console.error('Error checking auth config:', error);
            this._connectWithRole(role, null);
        }
    },
    
    /**
     * Connect with role and optional password
     */
    _connectWithRole(role, password) {
        // Δημιουργία WebSocket URL
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        let wsUrl = `${protocol}//${window.location.host}?role=${role}`;
        if (password) {
            wsUrl += `&password=${encodeURIComponent(password)}`;
        }
        
        this.connect(wsUrl);
    },
    
    /**
     * Start traffic monitoring (updates every second)
     */
    _startTrafficMonitor() {
        if (this._trafficInterval) clearInterval(this._trafficInterval);
        
        this._trafficInterval = setInterval(() => {
            this._bytesSentPerSec = this._bytesSentThisSecond;
            this._bytesReceivedPerSec = this._bytesReceivedThisSecond;
            this._bytesSentThisSecond = 0;
            this._bytesReceivedThisSecond = 0;
            
            // Update UI
            this._updateTrafficDisplay();
        }, 1000);
    },
    
    /**
     * Track bytes sent
     */
    _trackSend(data) {
        const bytes = new Blob([data]).size;
        this._bytesSentThisSecond += bytes;
    },
    
    /**
     * Track bytes received
     */
    _trackReceive(data) {
        const bytes = new Blob([data]).size;
        this._bytesReceivedThisSecond += bytes;
    },
    
    /**
     * Format bytes to human readable
     */
    _formatBytes(bytes) {
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    },
    
    /**
     * Update traffic display in UI (upload and download separately)
     */
    _updateTrafficDisplay() {
        const uploadEl = document.getElementById('network-upload');
        const downloadEl = document.getElementById('network-download');
        
        if (uploadEl) {
            uploadEl.textContent = `↑ ${this._formatBytes(this._bytesSentPerSec)}/s`;
            uploadEl.classList.remove('low', 'medium', 'high');
            if (this._bytesSentPerSec > 50000) {
                uploadEl.classList.add('high');
            } else if (this._bytesSentPerSec > 10000) {
                uploadEl.classList.add('medium');
            } else {
                uploadEl.classList.add('low');
            }
        }
        
        if (downloadEl) {
            downloadEl.textContent = `↓ ${this._formatBytes(this._bytesReceivedPerSec)}/s`;
            downloadEl.classList.remove('low', 'medium', 'high');
            if (this._bytesReceivedPerSec > 50000) {
                downloadEl.classList.add('high');
            } else if (this._bytesReceivedPerSec > 10000) {
                downloadEl.classList.add('medium');
            } else {
                downloadEl.classList.add('low');
            }
        }
    },
    
    /**
     * Wrapped send that tracks bytes
     */
    _send(data) {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
            this._trackSend(data);
            this.ws.send(data);
        }
    },
    
    /**
     * Σύνδεση στον WebSocket server
     */
    connect(url) {
        console.log('🔌 Σύνδεση στον server...', url);
        
        try {
            this.ws = new WebSocket(url);
            
            this.ws.onopen = () => {
                console.log('✅ Συνδέθηκε στον server!');
                this.connected = true;
                this.reconnectAttempts = 0;
                this.updateConnectionStatus(true);
                
                // Καθαρισμός τυχόν υπολειμμάτων από προηγούμενες συνεδρίες
                this.cleanupRemoteElements();
            };
            
            this.ws.onmessage = (event) => {
                // Track received bytes
                this._trackReceive(event.data);
                this.handleMessage(JSON.parse(event.data));
            };
            
            this.ws.onclose = () => {
                console.log('❌ Αποσυνδέθηκε από τον server');
                this.connected = false;
                this.updateConnectionStatus(false);
                this.attemptReconnect(url);
            };
            
            this.ws.onerror = (error) => {
                console.error('WebSocket error:', error);
            };
        } catch (error) {
            console.error('Σφάλμα σύνδεσης:', error);
            this.updateConnectionStatus(false);
        }
    },
    
    /**
     * Προσπάθεια επανασύνδεσης με exponential backoff
     */
    attemptReconnect(url) {
        this.reconnectAttempts++;
        // Exponential backoff: 2s, 4s, 8s, 16s, max 30s
        const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        this.reconnectDelay = delay;
        
        console.log(`🔄 Επανασύνδεση σε ${delay/1000}s... (προσπάθεια ${this.reconnectAttempts})`);
        
        // Show countdown in UI
        this.updateReconnectCountdown(delay / 1000);
        
        // Start countdown timer
        let remaining = delay / 1000;
        if (this.reconnectTimer) clearInterval(this.reconnectTimer);
        this.reconnectTimer = setInterval(() => {
            remaining--;
            if (remaining > 0) {
                this.updateReconnectCountdown(remaining);
            } else {
                clearInterval(this.reconnectTimer);
                this.reconnectTimer = null;
            }
        }, 1000);
        
        setTimeout(() => this.connect(url), delay);
    },
    
    /**
     * Update reconnection countdown in status bar
     */
    updateReconnectCountdown(seconds) {
        let statusEl = document.getElementById('collab-status');
        if (statusEl) {
            statusEl.innerHTML = `<span style="color: #ffa500;">⏳ Επανασύνδεση σε ${seconds}s (προσπ. ${this.reconnectAttempts})</span>`;
        }
    },
    
    /**
     * Διαχείριση εισερχόμενων μηνυμάτων
     */
    handleMessage(message) {
        switch (message.type) {
            case 'auth_error':
                // Authentication failed
                alert('❌ ' + (message.message || 'Σφάλμα αυθεντικοποίησης'));
                console.error('Auth error:', message.message);
                // Redirect to student mode
                window.location.href = window.location.pathname;
                break;
                
            case 'init':
                this.myId = message.yourId;
                this.myRole = message.yourRole;
                this.connectedUsers = message.connectedUsers;
                
                // Καθαρισμός remote elements - σημαντικό ειδικά για teacher
                this.cleanupRemoteElements();
                
                // Handle based on role
                if (this.myRole === 'teacher') {
                    // Teacher: Send current code to server to sync state
                    // Don't overwrite teacher's code with server state
                    if (typeof gridEditor !== 'undefined' && gridEditor) {
                        const currentCode = gridEditor.getValue();
                        if (currentCode && currentCode.trim()) {
                            console.log('👨‍🏫 Teacher sending initial code to server');
                            this.sendCodeUpdate(currentCode);
                        }
                    }
                } else {
                    // Student: Load code from server state
                    if (message.state.code) {
                        console.log('👨‍🎓 Student loading code from server');
                        this.updateEditorContent(message.state.code, false); // No undo for initial load
                    }
                }
                
                this.updateUserList();
                console.log(`📍 Συνδέθηκες ως ${message.yourRole} (ID: ${message.yourId})`);
                showToast(`👋 Καλωσήρθες!`, 'success');
                break;
                
            case 'code_update':
                // Άλλος χρήστης άλλαξε τον κώδικα
                if (!this.isUpdatingFromRemote) {
                    this.updateEditorContent(message.code);
                    // Update line numbers
                    if (typeof updateLineNumbers === 'function') {
                        updateLineNumbers();
                    }
                    // Update remote cursor if provided
                    if (message.cursorRow !== undefined && message.cursorCol !== undefined) {
                        this.showRemoteCursor({
                            userId: message.userId,
                            line: message.cursorRow,
                            column: message.cursorCol
                        });
                    }
                    // Μικρή ένδειξη ότι κάποιος έγραψε
                    this.showRemoteEdit(message.updaterName);
                }
                break;
                
            case 'template_loaded':
                this.updateEditorContent(message.code);
                // Update line numbers
                if (typeof updateLineNumbers === 'function') {
                    updateLineNumbers();
                }
                showToast(`📁 Ο ${message.loadedBy} φόρτωσε: ${message.templateName}`, 'info');
                break;
                
            case 'user_joined':
                this.connectedUsers = message.connectedUsers;
                this.updateUserList();
                showToast(`👋 ${message.user.name} συνδέθηκε`, 'info');
                break;
                
            case 'user_left':
                this.connectedUsers = message.connectedUsers;
                this.updateUserList();
                showToast(`👋 ${message.userName} αποσυνδέθηκε`, 'info');
                break;
                
            case 'cursor_update':
                // Εμφάνιση cursor άλλου χρήστη (μόνο για teacher)
                if (this.myRole === 'teacher' && message.userId !== this.myId) {
                    this.showRemoteCursor(message);
                }
                break;
                
            case 'highlight_selection':
                // LEGACY: Εμφάνιση highlight επιλογής (ΜΟΝΟ για students)
                if (this.myRole === 'student' && message.userId !== this.myId) {
                    this.showRemoteHighlight(message);
                }
                break;
                
            case 'highlight_tiles':
                // ΝΕΟ: Εμφάνιση tile-based highlight (ΜΟΝΟ για students)
                if (this.myRole === 'student' && message.userId !== this.myId) {
                    this.showRemoteHighlightTiles(message);
                }
                break;
                
            case 'laser_point':
                // Laser pointer from teacher (shown on ALL screens)
                if (message.userId !== this.myId) {
                    this.showRemoteLaserPoint(message);
                }
                break;
            
            case 'pdf_load':
                // Teacher loaded a PDF
                if (message.userId !== this.myId) {
                    this.handlePdfLoad(message);
                }
                break;
            
            case 'pdf_sync':
                // Teacher synced PDF state
                if (message.userId !== this.myId) {
                    this.handlePdfSync(message);
                }
                break;
            
            case 'pdf_laser':
                // Teacher's laser on PDF
                if (message.userId !== this.myId) {
                    this.handlePdfLaser(message);
                }
                break;
            
            case 'mode_change':
                // Teacher changed mode
                if (message.userId !== this.myId) {
                    this.handleModeChange(message);
                }
                break;
            
            case 'hand_raise':
                // Student raised/lowered hand (teacher receives)
                this.handleHandRaise(message);
                break;
            
            case 'reaction':
                // Student sent reaction (teacher receives)
                this.handleReaction(message);
                break;
            
            case 'clear_reactions':
                // Teacher cleared reactions (students receive)
                this.handleClearReactions();
                break;
            
            case 'focus_mode':
                // Teacher toggled focus mode (students receive)
                this.handleFocusMode(message);
                break;
            
            case 'breakpoints':
                // Teacher set breakpoints (students receive)
                this.handleBreakpoints(message);
                break;
            
            case 'scroll_to_line':
                // Teacher sent scroll-to-line command (students receive)
                this.handleScrollToLine(message);
                break;
                
            case 'pong':
                // Keep-alive response
                break;
        }
    },
    
    /**
     * Handle hand raise from student
     */
    handleHandRaise(message) {
        if (message.raised) {
            this.raisedHands.set(message.userId, message.userName);
        } else {
            this.raisedHands.delete(message.userId);
        }
        this.updateRaisedHandsDisplay();
    },
    
    /**
     * Handle reaction from student
     */
    handleReaction(message) {
        // Add user to the reaction set
        const reactionSet = this.reactions.get(message.reaction);
        if (reactionSet) {
            reactionSet.add(message.userId);
            this.updateReactionCounts();
        }
    },
    
    /**
     * Handle clear reactions from teacher
     */
    handleClearReactions() {
        // Reset reaction buttons
        document.querySelectorAll('.reaction-btn').forEach(btn => {
            btn.classList.remove('active');
        });
    },
    
    /**
     * Update raised hands display for teacher
     */
    updateRaisedHandsDisplay() {
        const container = document.getElementById('raised-hands');
        const countEl = document.getElementById('raised-hands-count');
        if (container && countEl) {
            const count = this.raisedHands.size;
            countEl.textContent = count;
            container.style.display = count > 0 ? 'inline-flex' : 'none';
            
            // Build tooltip with names
            if (count > 0) {
                const names = Array.from(this.raisedHands.values()).join(', ');
                container.title = `Σηκωμένα χέρια: ${names}`;
            }
        }
    },
    
    /**
     * Update reaction counts display for teacher
     */
    updateReactionCounts() {
        const container = document.getElementById('reaction-counts');
        if (container) {
            container.style.display = 'inline-flex';
            
            ['understood', 'confused', 'repeat'].forEach(reaction => {
                const countEl = container.querySelector(`[data-reaction="${reaction}"] span`);
                const count = this.reactions.get(reaction)?.size || 0;
                if (countEl) {
                    countEl.textContent = count;
                    countEl.parentElement.classList.toggle('has-count', count > 0);
                }
            });
        }
    },
    
    /**
     * Send hand raise (student)
     */
    sendHandRaise(raised) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this.handRaised = raised;
            this._send(JSON.stringify({
                type: 'hand_raise',
                raised: raised
            }));
        }
    },
    
    /**
     * Send reaction (student)
     */
    sendReaction(reaction, emoji) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this._send(JSON.stringify({
                type: 'reaction',
                reaction: reaction,
                emoji: emoji
            }));
        }
    },
    
    /**
     * Clear all reactions (teacher)
     */
    clearReactions() {
        // Clear local state
        this.reactions.forEach(set => set.clear());
        this.updateReactionCounts();
        
        // Notify students
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this._send(JSON.stringify({
                type: 'clear_reactions'
            }));
        }
    },
    
    /**
     * Start session timer
     */
    startSessionTimer() {
        if (this.sessionTimerInterval) return;
        
        this.sessionStartTime = Date.now();
        this.sessionTimerInterval = setInterval(() => {
            const elapsed = Date.now() - this.sessionStartTime;
            const minutes = Math.floor(elapsed / 60000);
            const seconds = Math.floor((elapsed % 60000) / 1000);
            const timerEl = document.getElementById('session-timer');
            if (timerEl) {
                timerEl.textContent = `⏱️ ${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            }
        }, 1000);
    },
    
    /**
     * Handle focus mode from teacher (student receives)
     */
    handleFocusMode(message) {
        this.focusModeEnabled = message.enabled;
        
        // Show/hide focus mode overlay
        let overlay = document.getElementById('focus-mode-overlay');
        if (message.enabled) {
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.id = 'focus-mode-overlay';
                overlay.className = 'focus-mode-overlay';
                overlay.innerHTML = `
                    <div class="focus-mode-content">
                        <span class="focus-icon">👁️</span>
                        <span class="focus-text">Λειτουργία Προσοχής</span>
                        <span class="focus-hint">Ο καθηγητής παρουσιάζει - παρακαλώ προσέξτε</span>
                    </div>
                `;
                document.body.appendChild(overlay);
            }
            overlay.classList.add('active');
            
            // Disable editor
            if (typeof gridEditor !== 'undefined' && gridEditor) {
                gridEditor.setReadOnly(true);
            }
        } else {
            if (overlay) {
                overlay.classList.remove('active');
            }
            
            // Re-enable editor
            if (typeof gridEditor !== 'undefined' && gridEditor) {
                gridEditor.setReadOnly(false);
            }
        }
    },
    
    /**
     * Handle breakpoints from teacher
     */
    handleBreakpoints(message) {
        if (typeof gridEditor !== 'undefined' && gridEditor) {
            gridEditor.setRemoteBreakpoints(message.rows || []);
            // Trigger line number update
            if (typeof updateLineNumbers === 'function') {
                updateLineNumbers();
            }
        }
    },
    
    /**
     * Handle scroll-to-line command from teacher
     */
    handleScrollToLine(message) {
        const lineNumber = message.lineNumber;
        if (typeof gridEditor !== 'undefined' && gridEditor && lineNumber) {
            // Scroll to the line with highlight animation
            gridEditor.scrollToLine(lineNumber, true);
            
            // Show toast notification to student
            if (typeof showToast === 'function') {
                showToast(`📍 Ο καθηγητής σας πηγαίνει στη γραμμή ${lineNumber}`, 'info');
            }
        }
    },
    
    /**
     * Toggle focus mode (teacher)
     */
    sendFocusMode(enabled) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this.focusModeEnabled = enabled;
            this._send(JSON.stringify({
                type: 'focus_mode',
                enabled: enabled
            }));
        }
    },
    
    /**
     * Send breakpoints to students (teacher)
     */
    sendBreakpoints(rows) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this._send(JSON.stringify({
                type: 'breakpoints',
                rows: rows
            }));
        }
    },
    
    /**
     * Send scroll-to-line command to students (teacher)
     * @param {number} lineNumber - 1-indexed line number
     */
    sendScrollToLine(lineNumber) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN && this.myRole === 'teacher') {
            this._send(JSON.stringify({
                type: 'scroll_to_line',
                lineNumber: lineNumber
            }));
        }
    },
    
    /**
     * Αποστολή αλλαγής κώδικα στον server
     */
    sendCodeUpdate(code) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            // Include cursor position for remote cursor display
            let cursorRow = 1, cursorCol = 1;
            if (typeof gridEditor !== 'undefined' && gridEditor) {
                const cursor = gridEditor.getCursor();
                cursorRow = cursor.row + 1; // Convert to 1-based
                cursorCol = cursor.col + 1;
            }
            
            this._send(JSON.stringify({
                type: 'code_update',
                code: code,
                cursorRow: cursorRow,
                cursorCol: cursorCol
            }));
        }
    },
    
    /**
     * Αποστολή φόρτωσης template
     */
    sendTemplateLoaded(code, templateName) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this._send(JSON.stringify({
                type: 'template_loaded',
                code: code,
                templateName: templateName
            }));
        }
    },
    
    /**
     * Ενημέρωση του editor με νέο περιεχόμενο
     * Υποστηρίζει και GridEditor και legacy textarea
     * @param {string} code - Ο νέος κώδικας
     * @param {boolean} saveUndo - Αν θα αποθηκευτεί στο undo stack (default: true)
     */
    updateEditorContent(code, saveUndo = true) {

        
        this.isUpdatingFromRemote = true;
        
        // Check if using GridEditor
        if (typeof gridEditor !== 'undefined' && gridEditor) {
            // Use skipNotify to prevent feedback loop
            // Use preserveCursor to keep student's cursor position
            // skipUndo: Οι remote αλλαγές ΠΡΕΠΕΙ να αποθηκεύονται στο undo stack
            // ώστε το Ctrl+Z να λειτουργεί σωστά για όλους τους χρήστες
            gridEditor.setValue(code, { skipNotify: true, preserveCursor: true, skipUndo: !saveUndo });
        } else {
            // Legacy textarea editor
            const editor = document.getElementById('code-editor');
            const cursorPos = editor.selectionStart;
            
            editor.value = code;
            
            // Προσπάθεια διατήρησης της θέσης του cursor
            editor.selectionStart = Math.min(cursorPos, code.length);
            editor.selectionEnd = Math.min(cursorPos, code.length);
            
            // Trigger update για highlighting
            if (typeof updateEditor === 'function') {
                updateEditor();
            }
        }
        
        this.isUpdatingFromRemote = false;
    },
    
    /**
     * Ενημέρωση της κατάστασης σύνδεσης στο UI
     */
    updateConnectionStatus(connected) {
        let statusEl = document.getElementById('collab-status');
        
        if (!statusEl) {
            // Δημιουργία status element αν δεν υπάρχει
            const footer = document.querySelector('.status-bar');
            if (footer) {
                statusEl = document.createElement('div');
                statusEl.id = 'collab-status';
                statusEl.className = 'collab-status';
                footer.querySelector('.status-left').appendChild(statusEl);
            }
        }
        
        if (statusEl) {
            if (connected) {
                statusEl.innerHTML = `<span class="status-dot connected"></span> Συνδεδεμένος`;
                statusEl.className = 'collab-status connected';
            } else {
                statusEl.innerHTML = `<span class="status-dot disconnected"></span> Αποσυνδεδεμένος`;
                statusEl.className = 'collab-status disconnected';
            }
        }
    },
    
    /**
     * Καθαρισμός remote elements (highlight, cursor) - για νέα session
     */
    cleanupRemoteElements() {
        // Αφαίρεση highlight container
        const highlightContainer = document.getElementById('remote-highlight-container');
        if (highlightContainer) {
            highlightContainer.remove();
        }
        
        // Απόκρυψη visual cursor
        const visualCursor = document.getElementById('visual-cursor');
        if (visualCursor) {
            visualCursor.style.display = 'none';
        }
        
        console.log('🧹 Καθαρισμός remote elements');
    },
    
    /**
     * Ενημέρωση λίστας συνδεδεμένων χρηστών
     */
    updateUserList() {
        let userListEl = document.getElementById('user-list');
        
        if (!userListEl) {
            // Δημιουργία user list element
            const toolbar = document.querySelector('.toolbar-right');
            if (toolbar) {
                userListEl = document.createElement('div');
                userListEl.id = 'user-list';
                userListEl.className = 'user-list';
                toolbar.insertBefore(userListEl, toolbar.firstChild);
            }
        }
        
        if (userListEl) {
            const users = this.connectedUsers.map(u => {
                const icon = u.role === 'teacher' ? '👨‍🏫' : '👨‍🎓';
                const isMe = u.id === this.myId ? ' (εσύ)' : '';
                return `<span class="user-badge ${u.role}" title="${u.name}">${icon}${isMe}</span>`;
            }).join('');
            
            userListEl.innerHTML = users || '👤';
        }
        
        // Update student list panel (for teacher)
        this.updateStudentListPanel();
    },
    
    /**
     * Update the student list panel (teacher only)
     */
    updateStudentListPanel() {
        const countEl = document.getElementById('student-count');
        const contentEl = document.getElementById('student-list-content');
        
        // Count students only (not teachers)
        const students = this.connectedUsers.filter(u => u.role === 'student');
        
        if (countEl) {
            countEl.textContent = students.length;
        }
        
        if (contentEl) {
            if (students.length === 0) {
                contentEl.innerHTML = '<div class="no-students">Κανένας μαθητής συνδεδεμένος</div>';
            } else {
                contentEl.innerHTML = students.map(student => {
                    const initials = student.name.split(' ')
                        .map(w => w.charAt(0).toUpperCase())
                        .slice(0, 2)
                        .join('');
                    return `
                        <div class="student-item" data-student-id="${student.id}">
                            <div class="student-avatar">${initials || '👤'}</div>
                            <span class="student-name">${student.name}</span>
                            <div class="student-status" title="Online"></div>
                        </div>
                    `;
                }).join('');
            }
        }
    },
    
    /**
     * Αποστολή θέσης cursor στον server (throttled - 100ms)
     */
    sendCursorUpdate(position, line, column) {
        if (this._throttledSendCursor) {
            this._throttledSendCursor(position, line, column);
        }
    },
    
    /**
     * Immediate cursor update (called by throttle)
     */
    _sendCursorUpdateImmediate(position, line, column) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this._send(JSON.stringify({
                type: 'cursor_update',
                position: position,
                line: line,
                column: column
            }));
        }
    },
    
    /**
     * Εμφάνιση cursor άλλου χρήστη (για teacher ΜΟΝΟ)
     */
    showRemoteCursor(data) {
        // Only teacher should see student's cursor
        if (this.myRole !== 'teacher') return;
        
        // Αποθήκευση τελευταίας θέσης για scroll updates
        this.remoteCursors[data.userId] = {
            line: data.line,
            column: data.column
        };
        
        // Use GridEditor if available
        if (typeof gridEditor !== 'undefined' && gridEditor) {
            // Convert from 1-based (collaboration) to 0-based (GridEditor)
            gridEditor.setRemoteCursor(data.line - 1, data.column - 1);
            return;
        }
        
        // Legacy: Εμφάνιση απλού visual cursor στον editor
        const editor = document.getElementById('code-editor');
        if (!editor) return;
        
        this.showVisualCursor(data.userId, data.line, data.column);
    },
    
    /**
     * Εμφάνιση απλού visual cursor στον editor
     */
    showVisualCursor(userId, line, column) {
        const codeArea = document.querySelector('.code-area');
        const editor = document.getElementById('code-editor');
        if (!codeArea || !editor) return;
        
        // Βρες ή δημιούργησε το cursor element
        let cursorEl = document.getElementById(`visual-cursor-${userId}`);
        if (!cursorEl) {
            cursorEl = document.createElement('div');
            cursorEl.id = `visual-cursor-${userId}`;
            cursorEl.className = 'visual-cursor';
            codeArea.appendChild(cursorEl);
            
            // Ενημέρωση θέσης cursor όταν ο teacher κάνει scroll
            editor.addEventListener('scroll', () => {
                const cursorData = this.remoteCursors[userId];
                if (cursorData && cursorEl.style.display === 'block') {
                    this.updateCursorPosition(cursorEl, cursorData.line, cursorData.column);
                }
            });
        }
        
        this.updateCursorPosition(cursorEl, line, column);
        cursorEl.style.display = 'block';
        
        // Απόκρυψη μετά από 5 δευτερόλεπτα αδράνειας
        clearTimeout(cursorEl.hideTimeout);
        cursorEl.hideTimeout = setTimeout(() => {
            cursorEl.style.display = 'none';
        }, 5000);
    },
    
    /**
     * Ενημέρωση θέσης cursor element
     */
    updateCursorPosition(cursorEl, line, column) {
        const editor = document.getElementById('code-editor');
        if (!editor) return;
        
        const dims = this.getEditorDimensions(editor);
        const padding = 15; // Editor padding
        
        // Υπολόγισε τη θέση βάσει row/column (1-based) + padding - scroll
        const top = padding + (line - 1) * dims.lineHeight - editor.scrollTop;
        const left = padding + (column - 1) * dims.charWidth - editor.scrollLeft;
        
        cursorEl.style.top = `${top}px`;
        cursorEl.style.left = `${left}px`;
    },
    
    /**
     * Υπολογισμός πλάτους χαρακτήρα στο editor (cached)
     */
    _cachedCharWidth: null,
    _cachedLineHeight: null,
    _cachedFontSize: null,
    
    getEditorDimensions(editor) {
        if (!editor) editor = document.getElementById('code-editor');
        if (!editor) return { charWidth: 10, lineHeight: 24 };
        
        const computedStyle = getComputedStyle(editor);
        const currentFontSize = computedStyle.fontSize;
        
        // Αν η γραμματοσειρά άλλαξε, επανυπολόγισε
        if (this._cachedFontSize !== currentFontSize || !this._cachedCharWidth) {
            this._cachedFontSize = currentFontSize;
            
            // Υπολογισμός line-height
            let lineHeight = parseFloat(computedStyle.lineHeight);
            if (isNaN(lineHeight)) {
                lineHeight = parseFloat(currentFontSize) * 1.5;
            }
            this._cachedLineHeight = lineHeight;
            
            // Υπολογισμός character width μέσω hidden span
            const testSpan = document.createElement('span');
            testSpan.style.font = computedStyle.font;
            testSpan.style.visibility = 'hidden';
            testSpan.style.position = 'absolute';
            testSpan.style.whiteSpace = 'pre';
            testSpan.textContent = 'ΜΜΜΜΜΜΜΜΜΜ'; // 10 Greek chars for better accuracy
            document.body.appendChild(testSpan);
            this._cachedCharWidth = testSpan.offsetWidth / 10;
            document.body.removeChild(testSpan);
            

        }
        
        return {
            charWidth: this._cachedCharWidth,
            lineHeight: this._cachedLineHeight
        };
    },
    
    getCharWidth(editor) {
        return this.getEditorDimensions(editor).charWidth;
    },
    
    getLineHeight(editor) {
        return this.getEditorDimensions(editor).lineHeight;
    },
    
    /**
     * Μετατροπή character index σε row/column
     */
    indexToRowCol(text, index) {
        const lines = text.substring(0, index).split('\n');
        const row = lines.length;
        const col = lines[lines.length - 1].length;
        return { row, col };
    },
    
    /**
     * Μετατροπή row/column σε character index
     */
    rowColToIndex(text, row, col) {
        const lines = text.split('\n');
        let index = 0;
        for (let i = 0; i < row - 1 && i < lines.length; i++) {
            index += lines[i].length + 1; // +1 for newline
        }
        if (row <= lines.length) {
            index += Math.min(col, lines[row - 1].length);
        }
        return index;
    },
    
    // ============================================
    // TEACHER TOOLS - Highlight Selection
    // ============================================
    
    /**
     * Αποστολή επιλογής κώδικα στον server (Teacher → Student)
     * ΝΕΟΣ ΤΡΟΠΟΣ: Στέλνει Array<{row,col}> για exact tile highlighting
     * Throttled to 100ms
     */
    sendHighlightTiles(tiles) {
        if (this._throttledSendHighlightTiles) {
            this._throttledSendHighlightTiles(tiles);
        }
    },
    
    /**
     * Immediate highlight tiles (called by throttle)
     */
    _sendHighlightTilesImmediate(tiles) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN && this.highlightSyncEnabled) {
            this._send(JSON.stringify({
                type: 'highlight_tiles',
                tiles: tiles,
                active: tiles.length > 0
            }));
        }
    },
    
    /**
     * Αποστολή laser pointer position (Teacher - Ctrl+hover)
     * Εμφανίζεται και στις δύο οθόνες (teacher + students)
     * Throttled to 50ms
     */
    sendLaserPoint(position) {
        if (this._throttledSendLaser) {
            this._throttledSendLaser(position);
        }
    },
    
    /**
     * Immediate laser point (called by throttle)
     */
    _sendLaserPointImmediate(position) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this._send(JSON.stringify({
                type: 'laser_point',
                row: position ? position.row : null,
                col: position ? position.col : null,
                active: position !== null
            }));
        }
    },
    
    // ============================================
    // PDF SHARING METHODS
    // ============================================
    
    /**
     * Send PDF data to students (Teacher only)
     */
    sendPdfLoad(pdfData, fileName) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this._send(JSON.stringify({
                type: 'pdf_load',
                pdfData: pdfData,
                fileName: fileName
            }));
        }
    },
    
    /**
     * Send PDF sync state (page, scroll, zoom) - Teacher only
     */
    sendPdfSync(state) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this._send(JSON.stringify({
                type: 'pdf_sync',
                page: state.page,
                scrollTop: state.scrollTop,
                scrollLeft: state.scrollLeft,
                scale: state.scale
            }));
        }
    },
    
    /**
     * Send PDF laser pointer position - Teacher only
     * Throttled to 50ms
     */
    sendPdfLaser(x, y, active) {
        if (this._throttledSendPdfLaser) {
            this._throttledSendPdfLaser(x, y, active);
        }
    },
    
    /**
     * Immediate PDF laser (called by throttle)
     */
    _sendPdfLaserImmediate(x, y, active) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this._send(JSON.stringify({
                type: 'pdf_laser',
                x: x,
                y: y,
                active: active
            }));
        }
    },
    
    /**
     * Send mode change (code/pdf) - Teacher only
     */
    sendModeChange(mode) {
        if (this.connected && this.ws.readyState === WebSocket.OPEN) {
            this._send(JSON.stringify({
                type: 'mode_change',
                mode: mode
            }));
        }
    },
    
    /**
     * Handle PDF load from teacher (Student)
     */
    handlePdfLoad(data) {
        console.log('📄 Receiving PDF from teacher:', data.fileName);
        
        // Switch to PDF mode if not already
        if (window.LayoutManager) {
            window.LayoutManager.switchToMode('pdf');
        }
        
        // Load PDF in viewer
        if (typeof PdfViewer !== 'undefined') {
            PdfViewer.loadPdf(data.pdfData, true).then(() => {
                showToast(`📄 ${data.userName} φόρτωσε: ${data.fileName}`, 'info');
            });
        }
    },
    
    /**
     * Handle PDF sync from teacher (Student)
     */
    handlePdfSync(data) {
        if (typeof PdfViewer !== 'undefined' && PdfViewer.isActive) {
            PdfViewer.applySyncState({
                page: data.page,
                scrollTop: data.scrollTop,
                scrollLeft: data.scrollLeft,
                scale: data.scale
            });
        }
    },
    
    /**
     * Handle PDF laser from teacher (Student)
     */
    handlePdfLaser(data) {
        if (typeof PdfViewer !== 'undefined' && PdfViewer.isActive) {
            PdfViewer.showLaser(data.x, data.y, data.active);
        }
    },
    
    /**
     * Handle mode change from teacher (Student)
     */
    handleModeChange(data) {
        console.log('🔄 Mode change from teacher:', data.mode);
        if (window.LayoutManager) {
            window.LayoutManager.switchToMode(data.mode);
        }
    },
    
    /**
     * LEGACY: Αποστολή επιλογής κώδικα στον server (Teacher → Student)
     * Στέλνει row/column για ακριβή αναπαραγωγή
     * @deprecated Use sendHighlightTiles instead
     */
    sendHighlightSelection(startRow, startCol, endRow, endCol, text) {

        if (this.connected && this.ws.readyState === WebSocket.OPEN && this.highlightSyncEnabled) {
            const active = startRow > 0 && endRow > 0;
            this._send(JSON.stringify({
                type: 'highlight_selection',
                startRow: startRow,
                startCol: startCol,
                endRow: endRow,
                endCol: endCol,
                text: text,
                active: active
            }));
        }
    },
    
    /**
     * ΝΕΟ: Εμφάνιση remote highlight tiles (από teacher) σε GridEditor
     * ΜΟΝΟ για students
     */
    showRemoteHighlightTiles(data) {
        if (this.myRole === 'teacher') {
            return;
        }
        
        // Αν υπάρχει GridEditor, χρησιμοποίησέ τον
        if (typeof gridEditor !== 'undefined' && gridEditor) {
            if (data.active && data.tiles && data.tiles.length > 0) {
                gridEditor.setRemoteHighlights(data.tiles);
            } else {
                gridEditor.clearRemoteHighlights();
            }
            return;
        }
        
        // Fallback για legacy editor
        this.showRemoteHighlight(data);
    },
    
    /**
     * Εμφάνιση remote laser pointer (από teacher)
     * Εμφανίζεται σε ΟΛΑ τα screens (teacher + students)
     */
    showRemoteLaserPoint(data) {
        // Αν υπάρχει GridEditor, χρησιμοποίησέ τον
        if (typeof gridEditor !== 'undefined' && gridEditor) {
            if (data.active && data.row !== null && data.col !== null) {
                gridEditor.setRemoteLaserPoint(data.row, data.col);
            } else {
                gridEditor.clearRemoteLaserPoint();
            }
        }
    },
    
    /**
     * LEGACY: Εμφάνιση remote highlight (από teacher)
     * Δημιουργεί visual highlight overlay (όχι selection)
     * ΜΟΝΟ για students - ο teacher δεν θα έπρεπε να καλέσει αυτή τη function
     */
    showRemoteHighlight(data) {
        // Μόνο students βλέπουν highlights
        if (this.myRole === 'teacher') return;
        

        const editor = document.getElementById('code-editor');
        const highlightedCode = document.getElementById('highlighted-code');
        if (!editor || !highlightedCode) return;
        
        // Βρες ή δημιούργησε το highlight container μέσα στο highlighted-code
        let highlightContainer = document.getElementById('remote-highlight-container');
        if (!highlightContainer) {
            highlightContainer = document.createElement('div');
            highlightContainer.id = 'remote-highlight-container';
            highlightContainer.style.cssText = 'position: absolute; top: 15px; left: 15px; pointer-events: none; z-index: 0;';
            highlightedCode.appendChild(highlightContainer);
        }
        
        // Καθάρισε παλιά highlights
        highlightContainer.innerHTML = '';
        
        if (!data.active) {
            return;
        }
        
        // Υπολογισμός διαστάσεων
        const dims = this.getEditorDimensions(editor);
        
        // Για κάθε γραμμή που καλύπτει η επιλογή
        const lines = editor.value.split('\n');
        for (let row = data.startRow; row <= data.endRow; row++) {
            if (row > lines.length || row < 1) continue;
            
            const lineText = lines[row - 1] || '';
            let startCol, endCol;
            
            if (row === data.startRow && row === data.endRow) {
                // Μία γραμμή
                startCol = data.startCol;
                endCol = data.endCol;
            } else if (row === data.startRow) {
                // Πρώτη γραμμή
                startCol = data.startCol;
                endCol = lineText.length + 1;
            } else if (row === data.endRow) {
                // Τελευταία γραμμή
                startCol = 1;
                endCol = data.endCol;
            } else {
                // Ενδιάμεση γραμμή
                startCol = 1;
                endCol = lineText.length + 1;
            }
            
            // Minimum width
            if (endCol <= startCol) continue;
            
            // Δημιούργησε highlight element για αυτή τη γραμμή
            const highlightEl = document.createElement('div');
            
            // Θέσεις σχετικά με το content (το highlighted-code κάνει sync scroll)
            const top = (row - 1) * dims.lineHeight;
            const left = (startCol - 1) * dims.charWidth;
            const width = (endCol - startCol) * dims.charWidth;
            
            highlightEl.style.cssText = `
                position: absolute;
                top: ${top}px;
                left: ${left}px;
                width: ${width}px;
                height: ${dims.lineHeight}px;
                background-color: rgba(255, 213, 0, 0.4);
                border-radius: 2px;
                pointer-events: none;
            `;
            
            highlightContainer.appendChild(highlightEl);
        }
    },
    
    /**
     * Εμφάνιση ένδειξης ότι κάποιος άλλος επεξεργάζεται
     */
    showRemoteEdit(userName) {
        let indicator = document.getElementById('remote-edit-indicator');
        
        if (!indicator) {
            indicator = document.createElement('div');
            indicator.id = 'remote-edit-indicator';
            indicator.className = 'remote-edit-indicator';
            document.querySelector('.editor-wrapper').appendChild(indicator);
        }
        
        indicator.textContent = `✏️ ${userName} γράφει...`;
        indicator.classList.add('visible');
        
        // Κρύψε μετά από 1.5 δευτερόλεπτα
        clearTimeout(this.editIndicatorTimeout);
        this.editIndicatorTimeout = setTimeout(() => {
            indicator.classList.remove('visible');
        }, 1500);
    }
};

// Debounce function για να μην στέλνουμε updates σε κάθε keystroke
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Δημιουργία debounced version της sendCodeUpdate
const debouncedSendCode = debounce((code) => {
    Collaboration.sendCodeUpdate(code);
}, 150); // 150ms delay

// Αρχικοποίηση όταν φορτώσει η σελίδα
document.addEventListener('DOMContentLoaded', () => {
    // Αρχικοποίηση collaboration μόνο αν δεν είμαστε σε απλή λειτουργία
    const urlParams = new URLSearchParams(window.location.search);
    
    // Περίμενε λίγο για να φορτώσει το app.js και το GridEditor
    setTimeout(() => {
        Collaboration.init();
        
        // Αν χρησιμοποιείται GridEditor, τα events είναι ήδη ρυθμισμένα στο app.js
        // Αλλιώς, hook στο legacy textarea editor
        if (typeof gridEditor === 'undefined' || !gridEditor) {
            const editor = document.getElementById('code-editor');
            if (editor) {
                editor.addEventListener('input', () => {
                    if (!Collaboration.isUpdatingFromRemote) {
                        debouncedSendCode(editor.value);
                    }
                });
                
                // Αποστολή cursor position (για students)
                const sendCursorPosition = () => {
                    const pos = editor.selectionStart;
                    const text = editor.value.substring(0, pos);
                    const lines = text.split('\n');
                    const line = lines.length;
                    const column = lines[lines.length - 1].length + 1; // 1-based column
                    Collaboration.sendCursorUpdate(pos, line, column);
                };
                
                // Debounced cursor update
                const debouncedCursorUpdate = debounce(sendCursorPosition, 100);
                
                editor.addEventListener('click', debouncedCursorUpdate);
                editor.addEventListener('keyup', debouncedCursorUpdate);
                editor.addEventListener('select', debouncedCursorUpdate);
                
                // Αποστολή selection highlight (μόνο για teacher)
                const sendSelectionHighlight = () => {
                    if (Collaboration.myRole !== 'teacher') return;
                    
                    const start = editor.selectionStart;
                    const end = editor.selectionEnd;
                    
                    if (start !== end) {
                        // Μετατροπή σε row/col
                        const startPos = Collaboration.indexToRowCol(editor.value, start);
                        const endPos = Collaboration.indexToRowCol(editor.value, end);
                        const selectedText = editor.value.substring(start, end);
                        
                        Collaboration.sendHighlightSelection(
                            startPos.row, startPos.col + 1,  // 1-based
                            endPos.row, endPos.col + 1,
                            selectedText
                        );
                    } else {
                        // Clear selection
                        Collaboration.sendHighlightSelection(0, 0, 0, 0, '');
                    }
                };
                
                // Debounced selection update
                const debouncedSelectionUpdate = debounce(sendSelectionHighlight, 200);
                
                editor.addEventListener('mouseup', debouncedSelectionUpdate);
                editor.addEventListener('keyup', (e) => {
                    if (e.shiftKey) debouncedSelectionUpdate();
                });
            }
        }
    }, 500);
});

// Keep-alive ping κάθε 30 δευτερόλεπτα
setInterval(() => {
    if (Collaboration.connected && Collaboration.ws.readyState === WebSocket.OPEN) {
        Collaboration.ws.send(JSON.stringify({ type: 'ping' }));
    }
}, 30000);
