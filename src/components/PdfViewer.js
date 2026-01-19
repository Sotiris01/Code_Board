/**
 * AEPP Board - PDF Viewer Module
 * Synchronized PDF viewing for teacher-student collaboration
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
    canvas: null,
    ctx: null,
    laserPointer: null,
    pageInfo: null,
    
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
        
        // Create canvas for PDF rendering
        this.canvas = document.createElement('canvas');
        this.canvas.className = 'pdf-canvas';
        this.ctx = this.canvas.getContext('2d');
        
        // Create canvas wrapper (for positioning laser relative to canvas)
        this.canvasWrapper = document.createElement('div');
        this.canvasWrapper.className = 'pdf-canvas-wrapper';
        this.canvasWrapper.style.position = 'relative';
        this.canvasWrapper.style.display = 'inline-block';
        this.canvasWrapper.appendChild(this.canvas);
        
        // Create laser pointer overlay (inside canvas wrapper for correct positioning)
        this.laserPointer = document.createElement('div');
        this.laserPointer.className = 'pdf-laser-pointer';
        this.laserPointer.style.display = 'none';
        this.canvasWrapper.appendChild(this.laserPointer);
        
        // Create wrapper for scrolling
        this.scrollWrapper = document.createElement('div');
        this.scrollWrapper.className = 'pdf-scroll-wrapper';
        this.scrollWrapper.appendChild(this.canvasWrapper);
        this.container.appendChild(this.scrollWrapper);
        
        // Create page info display
        this.pageInfo = document.createElement('div');
        this.pageInfo.className = 'pdf-page-info';
        this.pageInfo.textContent = 'Σελίδα: -/-';
        this.container.appendChild(this.pageInfo);
        
        // Bind events
        this._bindEvents();
        
        console.log('📄 PDF Viewer initialized', isTeacher ? '(Teacher)' : '(Student)');
    },
    
    /**
     * Bind event listeners
     */
    _bindEvents() {
        if (this.isTeacher) {
            // Teacher: scroll and mouse events for sync
            this.scrollWrapper.addEventListener('scroll', () => this._onScroll());
            this.scrollWrapper.addEventListener('mousemove', (e) => this._onMouseMove(e));
            this.scrollWrapper.addEventListener('mouseleave', () => this._onMouseLeave());
            
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
        
        // Keyboard navigation (teacher only)
        document.addEventListener('keydown', (e) => {
            if (!this.isActive || !this.isTeacher || !this.pdfDoc) return;
            
            if (e.key === 'ArrowRight' || e.key === 'PageDown') {
                e.preventDefault();
                this.nextPage();
            } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
                e.preventDefault();
                this.prevPage();
            }
        });
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
            
            console.log(`📄 PDF loaded: ${this.totalPages} pages`);
            
            // Render first page
            await this.renderPage(this.currentPage);
            
            return true;
        } catch (error) {
            console.error('Error loading PDF:', error);
            return false;
        }
    },
    
    /**
     * Render a specific page
     */
    async renderPage(pageNum) {
        if (!this.pdfDoc || pageNum < 1 || pageNum > this.totalPages) return;
        
        this.currentPage = pageNum;
        
        const page = await this.pdfDoc.getPage(pageNum);
        const viewport = page.getViewport({ scale: this.scale });
        
        // Set canvas dimensions (both the internal size AND the display size)
        this.canvas.width = viewport.width;
        this.canvas.height = viewport.height;
        
        // Also set CSS style to match (important for zoom to be visible!)
        this.canvas.style.width = viewport.width + 'px';
        this.canvas.style.height = viewport.height + 'px';
        
        // Render PDF page
        const renderContext = {
            canvasContext: this.ctx,
            viewport: viewport
        };
        
        await page.render(renderContext).promise;
        
        // Update page info
        this.pageInfo.textContent = `Σελίδα: ${this.currentPage}/${this.totalPages}`;
        
        // Sync to students if teacher
        if (this.isTeacher && typeof Collaboration !== 'undefined') {
            this._syncState();
        }
    },
    
    /**
     * Navigate to next page
     */
    async nextPage() {
        if (this.currentPage < this.totalPages) {
            await this.renderPage(this.currentPage + 1);
            this.scrollWrapper.scrollTop = 0;
        }
    },
    
    /**
     * Navigate to previous page
     */
    async prevPage() {
        if (this.currentPage > 1) {
            await this.renderPage(this.currentPage - 1);
            this.scrollWrapper.scrollTop = 0;
        }
    },
    
    /**
     * Go to specific page
     */
    async goToPage(pageNum) {
        await this.renderPage(pageNum);
        this.scrollWrapper.scrollTop = 0;
    },
    
    /**
     * Set zoom level
     */
    async setZoom(newScale) {
        const oldScale = this.scale;
        this.scale = Math.max(0.5, Math.min(3, newScale));
        console.log(`🔍 Zoom: ${Math.round(oldScale*100)}% → ${Math.round(this.scale*100)}%`);
        await this.renderPage(this.currentPage);
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
     * Handle mouse move for laser pointer
     * 
     * NEW APPROACH: Calculate position relative to PDF CANVAS dimensions
     * (canvas.width/height) not viewport (getBoundingClientRect).
     * This ensures coordinates are consistent regardless of zoom/scroll.
     */
    _onMouseMove(e) {
        if (!this.isTeacher || !this.isActive) return;
        
        const rect = this.canvas.getBoundingClientRect();
        
        // Mouse position relative to visible canvas (in screen pixels)
        const screenX = e.clientX - rect.left;
        const screenY = e.clientY - rect.top;
        
        // Convert to PDF canvas coordinates (internal pixels)
        // This accounts for the difference between display size and canvas size
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;
        
        // Position in PDF canvas units (0 to canvas.width/height)
        const pdfX = screenX * scaleX;
        const pdfY = screenY * scaleY;
        
        // Send as ratio of canvas dimensions (0.0 to 1.0)
        const x = pdfX / this.canvas.width;
        const y = pdfY / this.canvas.height;
        
        // Send laser position
        if (typeof Collaboration !== 'undefined') {
            Collaboration.sendPdfLaser(x, y, true);
        }
        
        // Also show on teacher's screen
        this._showLocalLaser(x, y, true);
    },
    
    /**
     * Show laser on local screen (teacher sees their own laser)
     */
    _showLocalLaser(x, y, active) {
        if (!this.laserPointer) return;
        
        if (!active) {
            this.laserPointer.style.display = 'none';
            return;
        }
        
        // Convert PDF ratio to screen position
        const rect = this.canvas.getBoundingClientRect();
        const screenX = x * rect.width;
        const screenY = y * rect.height;
        
        this.laserPointer.style.display = 'block';
        this.laserPointer.style.left = `${screenX}px`;
        this.laserPointer.style.top = `${screenY}px`;
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
        
        // Change page if needed
        if (state.page !== this.currentPage) {
            await this.renderPage(state.page);
        }
        
        // Apply zoom if different
        if (Math.abs(state.scale - this.scale) > 0.01) {
            this.scale = state.scale;
            await this.renderPage(this.currentPage);
        }
        
        // Apply scroll position
        this.scrollWrapper.scrollTop = state.scrollTop;
        this.scrollWrapper.scrollLeft = state.scrollLeft;
    },
    
    /**
     * Show laser pointer at position (student)
     * 
     * x, y are ratios (0.0 to 1.0) of the PDF canvas dimensions
     * This ensures the laser points to the same PDF content regardless
     * of the student's zoom level or window size.
     */
    showLaser(x, y, active) {
        if (!this.laserPointer) return;
        
        if (!active) {
            this.laserPointer.style.display = 'none';
            return;
        }
        
        // Convert PDF ratio to screen position on student's canvas
        const rect = this.canvas.getBoundingClientRect();
        const screenX = x * rect.width;
        const screenY = y * rect.height;
        
        this.laserPointer.style.display = 'block';
        this.laserPointer.style.left = `${screenX}px`;
        this.laserPointer.style.top = `${screenY}px`;
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
