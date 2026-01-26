/**
 * AEPP Board - PDF Viewer Module
 * Synchronized PDF viewing for teacher-student collaboration
 * CONTINUOUS SCROLLING: All pages rendered vertically
 */

const PdfViewer = {
    // State
    pdfDoc: null,
    currentPage: 1,
    totalPages: 0,
    scale: 1.5,
    isActive: false,
    isTeacher: false,
    
    // DOM Elements
    container: null,
    pagesContainer: null,  // Container for all page canvases
    canvases: [],          // Array of canvas elements (one per page)
    laserPointer: null,
    scrollWrapper: null,
    
    // Sync state
    syncThrottle: null,
    lastSyncTime: 0,
    
    /**
     * Initialize the PDF viewer
     */
    init(containerId, isTeacher = false) {
        this.container = document.getElementById(containerId);
        this.isTeacher = isTeacher;
        
        if (!this.container) {
            console.error('PDF container not found:', containerId);
            return;
        }
        
        // Create pages container (holds all page canvases)
        this.pagesContainer = document.createElement('div');
        this.pagesContainer.className = 'pdf-pages-container';
        this.pagesContainer.style.position = 'relative';
        this.pagesContainer.style.display = 'flex';
        this.pagesContainer.style.flexDirection = 'column';
        this.pagesContainer.style.alignItems = 'center';
        this.pagesContainer.style.gap = '20px';
        this.pagesContainer.style.padding = '20px';
        
        // Create laser pointer overlay
        this.laserPointer = document.createElement('div');
        this.laserPointer.className = 'pdf-laser-pointer';
        this.laserPointer.style.display = 'none';
        this.pagesContainer.appendChild(this.laserPointer);
        
        // Create wrapper for scrolling
        this.scrollWrapper = document.createElement('div');
        this.scrollWrapper.className = 'pdf-scroll-wrapper';
        this.scrollWrapper.appendChild(this.pagesContainer);
        this.container.appendChild(this.scrollWrapper);
        
        // Bind events
        this._bindEvents();
        
        console.log('📄 PDF Viewer initialized (continuous scroll)', isTeacher ? '(Teacher)' : '(Student)');
    },
    
    /**
     * Bind event listeners
     */
    _bindEvents() {
        if (this.isTeacher) {
            // Teacher: scroll and mouse events for sync
            this.scrollWrapper.addEventListener('scroll', () => this._onScroll());
            this.pagesContainer.addEventListener('mousemove', (e) => this._onMouseMove(e));
            this.pagesContainer.addEventListener('mouseleave', () => this._onMouseLeave());
            
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
        
        // Keyboard navigation removed - continuous scrolling handles it
    },
    
    /**
     * Load PDF from ArrayBuffer or Base64
     */
    async loadPdf(data, isBase64 = false) {
        try {
            let pdfData;
            if (isBase64) {
                // Convert base64 to ArrayBuffer
                const binaryString = atob(data);
                const bytes = new Uint8Array(binaryString.length);
                for (let i = 0; i < binaryString.length; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                pdfData = bytes.buffer;
            } else {
                pdfData = data;
            }
            
            // Load with PDF.js
            const loadingTask = pdfjsLib.getDocument({ data: pdfData });
            this.pdfDoc = await loadingTask.promise;
            this.totalPages = this.pdfDoc.numPages;
            this.currentPage = 1;
            
            console.log(`📄 PDF loaded: ${this.totalPages} pages (continuous mode)`);
            
            // Render ALL pages for continuous scrolling
            await this.renderAllPages();
            
            return true;
        } catch (error) {
            console.error('Error loading PDF:', error);
            return false;
        }
    },
    
    /**
     * Render all pages for continuous scrolling
     */
    async renderAllPages() {
        if (!this.pdfDoc) return;
        
        // Clear existing canvases
        this.canvases.forEach(c => c.remove());
        this.canvases = [];
        
        // Re-add laser pointer (it gets removed when clearing)
        if (!this.pagesContainer.contains(this.laserPointer)) {
            this.pagesContainer.appendChild(this.laserPointer);
        }
        
        // Render each page
        for (let pageNum = 1; pageNum <= this.totalPages; pageNum++) {
            const page = await this.pdfDoc.getPage(pageNum);
            const viewport = page.getViewport({ scale: this.scale });
            
            // Create canvas for this page
            const canvas = document.createElement('canvas');
            canvas.className = 'pdf-canvas';
            canvas.dataset.page = pageNum;
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            canvas.style.width = viewport.width + 'px';
            canvas.style.height = viewport.height + 'px';
            canvas.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)';
            canvas.style.backgroundColor = 'white';
            
            const ctx = canvas.getContext('2d');
            
            // Render PDF page
            await page.render({
                canvasContext: ctx,
                viewport: viewport
            }).promise;
            
            // Insert before laser pointer
            this.pagesContainer.insertBefore(canvas, this.laserPointer);
            this.canvases.push(canvas);
        }
        
        // Update page info
        this._updateCurrentPage();
        
        // Sync to students if teacher
        if (this.isTeacher && typeof Collaboration !== 'undefined') {
            this._syncState();
        }
    },
    
    /**
     * Update current page based on scroll position
     */
    _updateCurrentPage() {
        if (this.canvases.length === 0) return;
        
        const scrollTop = this.scrollWrapper.scrollTop;
        const wrapperHeight = this.scrollWrapper.clientHeight;
        const scrollCenter = scrollTop + wrapperHeight / 2;
        
        // Find which page is most visible
        let currentPage = 1;
        for (let i = 0; i < this.canvases.length; i++) {
            const canvas = this.canvases[i];
            const canvasTop = canvas.offsetTop;
            const canvasBottom = canvasTop + canvas.height;
            
            if (scrollCenter >= canvasTop && scrollCenter <= canvasBottom) {
                currentPage = i + 1;
                break;
            } else if (scrollCenter < canvasTop) {
                currentPage = Math.max(1, i);
                break;
            } else {
                currentPage = i + 1;
            }
        }
        
        this.currentPage = currentPage;
    },
    
    /**
     * Render a specific page (for compatibility - now just scrolls to it)
     */
    async renderPage(pageNum) {
        if (!this.pdfDoc || pageNum < 1 || pageNum > this.totalPages) return;
        this.goToPage(pageNum);
    },
    
    /**
     * Navigate to next page (scroll to it)
     */
    async nextPage() {
        if (this.currentPage < this.totalPages) {
            this.goToPage(this.currentPage + 1);
        }
    },
    
    /**
     * Navigate to previous page (scroll to it)
     */
    async prevPage() {
        if (this.currentPage > 1) {
            this.goToPage(this.currentPage - 1);
        }
    },
    
    /**
     * Go to specific page (scroll to it)
     */
    async goToPage(pageNum) {
        if (pageNum < 1 || pageNum > this.totalPages) return;
        if (this.canvases.length === 0) return;
        
        const canvas = this.canvases[pageNum - 1];
        if (canvas) {
            canvas.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    },
    
    /**
     * Set zoom level (re-renders all pages)
     */
    async setZoom(newScale) {
        const oldScale = this.scale;
        this.scale = Math.max(0.5, Math.min(3, newScale));
        console.log(`🔍 Zoom: ${Math.round(oldScale*100)}% → ${Math.round(this.scale*100)}%`);
        
        // Remember scroll ratio before re-render
        const scrollRatio = this.scrollWrapper.scrollTop / (this.scrollWrapper.scrollHeight - this.scrollWrapper.clientHeight || 1);
        
        await this.renderAllPages();
        
        // Restore scroll position proportionally
        const newScrollTop = scrollRatio * (this.scrollWrapper.scrollHeight - this.scrollWrapper.clientHeight);
        this.scrollWrapper.scrollTop = newScrollTop;
    },
    
    /**
     * Handle scroll event (teacher only)
     */
    _onScroll() {
        if (!this.isTeacher) return;
        
        // Update current page display
        this._updateCurrentPage();
        
        // Throttle sync
        const now = Date.now();
        if (now - this.lastSyncTime < 50) return;
        this.lastSyncTime = now;
        
        this._syncState();
    },
    
    /**
     * Handle mouse move for laser pointer
     * Position is absolute pixels within pagesContainer
     */
    _onMouseMove(e) {
        if (!this.isTeacher || !this.isActive) return;
        
        const containerRect = this.pagesContainer.getBoundingClientRect();
        
        // getBoundingClientRect already accounts for scroll position
        // So e.clientY - containerRect.top gives the correct position within the container
        const absX = e.clientX - containerRect.left;
        const absY = e.clientY - containerRect.top;
        
        // Send absolute pixel position
        if (typeof Collaboration !== 'undefined') {
            Collaboration.sendPdfLaser(absX, absY, true);
        }
        
        // Also show on teacher's screen
        this._showLocalLaser(absX, absY, true);
    },
    
    /**
     * Show laser on local screen (absolute position in pixels)
     */
    _showLocalLaser(absX, absY, active) {
        if (!this.laserPointer) return;
        
        if (!active) {
            this.laserPointer.style.display = 'none';
            return;
        }
        
        this.laserPointer.style.display = 'block';
        this.laserPointer.style.left = `${absX}px`;
        this.laserPointer.style.top = `${absY}px`;
    },
    
    /**
     * Handle mouse leave - hide laser
     */
    _onMouseLeave() {
        if (!this.isTeacher) return;
        
        // Hide local laser
        this._showLocalLaser(0, 0, false);
        
        // Notify students to hide laser
        if (typeof Collaboration !== 'undefined') {
            Collaboration.sendPdfLaser(0, 0, false);
        }
    },
    
    /**
     * Sync state to students
     */
    _syncState() {
        if (typeof Collaboration !== 'undefined') {
            Collaboration.sendPdfSync({
                page: this.currentPage,
                scrollTop: this.scrollWrapper.scrollTop,
                scrollLeft: this.scrollWrapper.scrollLeft,
                scale: this.scale
            });
        }
    },
    
    /**
     * Apply synced state from teacher (student only)
     */
    async applySyncState(state) {
        if (this.isTeacher) return;
        
        // Apply zoom if different (re-renders all pages)
        if (Math.abs(state.scale - this.scale) > 0.01) {
            this.scale = state.scale;
            await this.renderAllPages();
        }
        
        // Apply scroll position
        this.scrollWrapper.scrollTop = state.scrollTop;
        this.scrollWrapper.scrollLeft = state.scrollLeft;
        
        // Update current page display
        this._updateCurrentPage();
    },
    
    /**
     * Show laser pointer at position (student)
     * absX, absY are absolute pixel positions within pagesContainer
     */
    showLaser(absX, absY, active) {
        if (!this.laserPointer) return;
        
        if (!active) {
            this.laserPointer.style.display = 'none';
            return;
        }
        
        this.laserPointer.style.display = 'block';
        this.laserPointer.style.left = `${absX}px`;
        this.laserPointer.style.top = `${absY}px`;
    },
    
    /**
     * Show/hide PDF viewer
     */
    show() {
        this.isActive = true;
        this.container.style.display = 'block';
    },
    
    hide() {
        this.isActive = false;
        this.container.style.display = 'none';
    },
    
    /**
     * Get current state for serialization
     */
    getState() {
        return {
            page: this.currentPage,
            totalPages: this.totalPages,
            scale: this.scale,
            scrollTop: this.scrollWrapper?.scrollTop || 0,
            scrollLeft: this.scrollWrapper?.scrollLeft || 0
        };
    }
};

/**
 * Convert file to base64 for transmission (standalone function)
 */
PdfViewer.fileToBase64 = function(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            // Remove data URL prefix to get pure base64
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PdfViewer;
}
