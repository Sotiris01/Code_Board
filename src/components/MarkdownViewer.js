/**
 * Code Board - Markdown Viewer Module
 * Synchronized Markdown viewing for teacher-student collaboration
 * With laser pointer and scroll sync like PDF viewer
 */

const MarkdownViewer = {
    // State
    content: '',
    isActive: false,
    isTeacher: false,
    scale: 1.0,
    fileName: '',
    
    // DOM Elements
    container: null,
    scrollWrapper: null,
    contentWrapper: null,
    contentDiv: null,
    laserPointer: null,
    
    // Sync state
    syncThrottle: null,
    lastSyncTime: 0,
    
    // Throttled functions
    _throttledSendLaser: null,
    
    /**
     * Initialize the Markdown viewer
     */
    init(containerId, isTeacher = false) {
        this.container = document.getElementById(containerId);
        this.isTeacher = isTeacher;
        
        if (!this.container) {
            console.error('Markdown container not found:', containerId);
            return;
        }
        
        // Create scroll wrapper
        this.scrollWrapper = document.createElement('div');
        this.scrollWrapper.className = 'md-scroll-wrapper';
        
        // Create content wrapper (for positioning laser relative to content)
        this.contentWrapper = document.createElement('div');
        this.contentWrapper.className = 'md-content-wrapper';
        this.contentWrapper.style.position = 'relative';
        this.contentWrapper.style.display = 'inline-block';
        this.contentWrapper.style.width = '100%';
        
        // Create content div for rendered markdown
        this.contentDiv = document.createElement('div');
        this.contentDiv.className = 'md-content';
        this.contentWrapper.appendChild(this.contentDiv);
        
        // Create laser pointer overlay (inside content wrapper for correct positioning)
        this.laserPointer = document.createElement('div');
        this.laserPointer.className = 'md-laser-pointer';
        this.laserPointer.style.display = 'none';
        this.contentWrapper.appendChild(this.laserPointer);
        
        this.scrollWrapper.appendChild(this.contentWrapper);
        this.container.appendChild(this.scrollWrapper);
        
        // Set up throttled laser send
        this._throttledSendLaser = this._throttle((x, y, active) => {
            this._sendLaserImmediate(x, y, active);
        }, 50);
        
        // Bind events
        this._bindEvents();
        
        console.log('📝 Markdown Viewer initialized', isTeacher ? '(Teacher)' : '(Student)');
    },
    
    /**
     * Simple throttle function
     */
    _throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function(...args) {
            if (!lastRan) {
                func.apply(this, args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func.apply(this, args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    },
    
    /**
     * Bind event listeners
     */
    _bindEvents() {
        if (this.isTeacher) {
            // Teacher: scroll events for sync
            this.scrollWrapper.addEventListener('scroll', () => this._onScroll());
            
            // Teacher: mouse events for laser pointer
            this.contentWrapper.addEventListener('mousemove', (e) => this._onMouseMove(e));
            this.contentWrapper.addEventListener('mouseleave', () => this._onMouseLeave());
            
            // Zoom with Ctrl+Wheel
            this.scrollWrapper.addEventListener('wheel', (e) => {
                if (e.ctrlKey) {
                    e.preventDefault();
                    const delta = e.deltaY > 0 ? -0.1 : 0.1;
                    this.setZoom(this.scale + delta);
                }
            }, { passive: false });
        } else {
            // Student: disable manual scrolling (teacher controls)
            this.scrollWrapper.style.overflow = 'hidden';
        }
    },
    
    /**
     * Handle mouse move for laser pointer (teacher only)
     * Calculate position relative to content dimensions
     */
    _onMouseMove(e) {
        if (!this.isTeacher || !this.isActive) return;
        
        const rect = this.contentDiv.getBoundingClientRect();
        
        // Mouse position relative to content (in screen pixels)
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        
        // Convert to percentage of content dimensions
        const xPercent = screenX / rect.width;
        const yPercent = screenY / rect.height;
        
        // Only send if within content bounds
        if (xPercent >= 0 && xPercent <= 1 && yPercent >= 0 && yPercent <= 1) {
            // Show local laser
            this._showLaserAt(screenX, screenY);
            
            // Send to students (throttled)
            if (this._throttledSendLaser) {
                this._throttledSendLaser(xPercent, yPercent, true);
            }
        }
    },
    
    /**
     * Handle mouse leave - hide laser
     */
    _onMouseLeave() {
        if (!this.isTeacher) return;
        
        this.laserPointer.style.display = 'none';
        
        // Send hide to students
        if (typeof Collaboration !== 'undefined') {
            Collaboration.sendMarkdownLaser(0, 0, false);
        }
    },
    
    /**
     * Send laser position immediately
     */
    _sendLaserImmediate(x, y, active) {
        if (typeof Collaboration !== 'undefined') {
            Collaboration.sendMarkdownLaser(x, y, active);
        }
    },
    
    /**
     * Show laser at screen coordinates (relative to content)
     */
    _showLaserAt(x, y) {
        if (this.laserPointer) {
            this.laserPointer.style.display = 'block';
            this.laserPointer.style.left = `${x}px`;
            this.laserPointer.style.top = `${y}px`;
        }
    },
    
    /**
     * Show laser from percentage coordinates (student receives)
     */
    showLaser(xPercent, yPercent, active) {
        if (!this.laserPointer || !this.contentDiv) return;
        
        if (!active) {
            this.laserPointer.style.display = 'none';
            return;
        }
        
        // Convert percentage to screen coordinates
        const rect = this.contentDiv.getBoundingClientRect();
        const x = xPercent * rect.width;
        const y = yPercent * rect.height;
        
        this._showLaserAt(x, y);
    },
    
    /**
     * Load Markdown content from string
     * @param {string} content - Markdown content
     * @param {boolean} sync - Whether to sync to students
     * @param {string} fileName - Optional file name
     */
    async loadMarkdown(content, sync = true, fileName = '') {
        try {
            this.content = content;
            this.fileName = fileName;
            
            // Parse markdown to HTML using marked.js
            if (typeof marked !== 'undefined') {
                // Configure marked for safety
                marked.setOptions({
                    breaks: true,
                    gfm: true,
                    headerIds: true,
                    mangle: false
                });
                
                this.contentDiv.innerHTML = marked.parse(content);
            } else {
                // Fallback: show as preformatted text
                this.contentDiv.innerHTML = `<pre>${this._escapeHtml(content)}</pre>`;
            }
            
            // Apply current zoom
            this._applyZoom();
            
            // Reset scroll
            if (this.scrollWrapper) {
                this.scrollWrapper.scrollTop = 0;
            }
            
            console.log(`📝 Markdown loaded: ${content.length} characters`);
            
            // Sync to students if teacher
            if (sync && this.isTeacher && typeof Collaboration !== 'undefined') {
                Collaboration.sendMarkdownContent(content, fileName);
            }
            
            return true;
        } catch (error) {
            console.error('Error loading Markdown:', error);
            return false;
        }
    },
    
    /**
     * Load Markdown from file
     * @param {File} file - File object
     */
    async loadFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = async (e) => {
                const content = e.target.result;
                const success = await this.loadMarkdown(content, true, file.name);
                resolve(success);
            };
            
            reader.onerror = () => {
                reject(new Error('Failed to read file'));
            };
            
            reader.readAsText(file, 'UTF-8');
        });
    },
    
    /**
     * Escape HTML for safe display
     */
    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    /**
     * Set zoom level
     */
    setZoom(newScale) {
        const oldScale = this.scale;
        this.scale = Math.max(0.5, Math.min(2.0, newScale));
        console.log(`🔍 MD Zoom: ${Math.round(oldScale*100)}% → ${Math.round(this.scale*100)}%`);
        this._applyZoom();
        
        // Update zoom display
        const zoomDisplay = document.getElementById('md-zoom-display');
        if (zoomDisplay) {
            zoomDisplay.textContent = `${Math.round(this.scale * 100)}%`;
        }
        
        // Sync zoom to students
        if (this.isTeacher && typeof Collaboration !== 'undefined') {
            this._syncState();
        }
    },
    
    /**
     * Apply current zoom to content
     */
    _applyZoom() {
        if (this.contentDiv) {
            this.contentDiv.style.fontSize = `${this.scale}rem`;
        }
    },
    
    /**
     * Scroll to top
     */
    scrollToTop() {
        if (this.scrollWrapper) {
            this.scrollWrapper.scrollTop = 0;
            if (this.isTeacher) {
                this._syncState();
            }
        }
    },
    
    /**
     * Scroll to bottom
     */
    scrollToBottom() {
        if (this.scrollWrapper) {
            this.scrollWrapper.scrollTop = this.scrollWrapper.scrollHeight;
            if (this.isTeacher) {
                this._syncState();
            }
        }
    },
    
    /**
     * Handle scroll event (teacher only)
     */
    _onScroll() {
        if (!this.isTeacher) return;
        
        // Throttle sync
        const now = Date.now();
        if (now - this.lastSyncTime < 50) return;
        this.lastSyncTime = now;
        
        this._syncState();
    },
    
    /**
     * Sync current state to students
     */
    _syncState() {
        if (!this.isTeacher || typeof Collaboration === 'undefined') return;
        
        const state = {
            scrollTop: this.scrollWrapper ? this.scrollWrapper.scrollTop : 0,
            scrollHeight: this.scrollWrapper ? this.scrollWrapper.scrollHeight : 0,
            scale: this.scale
        };
        
        Collaboration.sendMarkdownState(state);
    },
    
    /**
     * Apply state from teacher (student only)
     */
    applyState(state) {
        if (this.isTeacher) return;
        
        // Apply zoom
        if (state.scale !== undefined && state.scale !== this.scale) {
            this.scale = state.scale;
            this._applyZoom();
            
            const zoomDisplay = document.getElementById('md-zoom-display');
            if (zoomDisplay) {
                zoomDisplay.textContent = `${Math.round(this.scale * 100)}%`;
            }
        }
        
        // Apply scroll position (proportional)
        if (this.scrollWrapper && state.scrollTop !== undefined) {
            // Calculate proportional scroll position
            const ratio = state.scrollHeight > 0 ? state.scrollTop / state.scrollHeight : 0;
            this.scrollWrapper.scrollTop = ratio * this.scrollWrapper.scrollHeight;
        }
    },
    
    /**
     * Show the markdown viewer
     */
    show() {
        this.isActive = true;
        if (this.container) {
            this.container.style.display = 'flex';
        }
    },
    
    /**
     * Hide the markdown viewer
     */
    hide() {
        this.isActive = false;
        if (this.container) {
            this.container.style.display = 'none';
        }
        // Hide laser when hiding viewer
        if (this.laserPointer) {
            this.laserPointer.style.display = 'none';
        }
    },
    
    /**
     * Clear the viewer
     */
    clear() {
        this.content = '';
        this.fileName = '';
        if (this.contentDiv) {
            this.contentDiv.innerHTML = '<div class="md-empty-state">📝 No markdown file loaded</div>';
        }
    },
    
    /**
     * Get current content
     */
    getContent() {
        return this.content;
    },
    
    /**
     * Check if content is loaded
     */
    hasContent() {
        return this.content && this.content.length > 0;
    }
};

// Export for module systems if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = MarkdownViewer;
}
