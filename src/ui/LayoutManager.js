/**
 * LayoutManager Component
 * Handles sidebar resizing and mode switching (Code vs PDF)
 * 
 * Dependencies:
 * - PdfViewer
 * - Collaboration (for sync)
 * - UIManager (for showToast)
 */

const LayoutManager = {
    elements: {
        // Mode toggle
        modeCode: null,
        modePdf: null,
        // Containers
        gridEditorContainer: null,
        pdfViewerContainer: null,
        lineNumbers: null,
        // Controls
        pdfControls: null,
        codeControls: null,
        // PDF specific
        pdfFileInput: null,
        pdfPrev: null,
        pdfNext: null,
        pdfPageDisplay: null,
        pdfZoomIn: null,
        pdfZoomOut: null,
        pdfZoomDisplay: null,
        // Sidebar
        sidebarResizeHandle: null,
        keywordSidebar: null
    },
    
    // Current mode: 'code' or 'pdf'
    currentMode: 'code',
    
    // Teacher mode flag
    isTeacher: false,
    
    // Sidebar resizing state
    _resizing: false,
    _startX: 0,
    _startWidth: 0,
    
    // Reference to editor
    gridEditor: null,
    
    /**
     * Initialize the layout manager
     * @param {Object} options - { gridEditor, isTeacher }
     */
    init(options = {}) {
        this.gridEditor = options.gridEditor || null;
        this.isTeacher = options.isTeacher || false;
        
        // Cache DOM elements
        this._cacheElements();
        
        // Initialize components
        this._initModeToggle();
        this._initPdfViewer();
        this._initSidebarResizer();
        
        console.log('📐 LayoutManager initialized');
    },
    
    /**
     * Cache DOM element references
     */
    _cacheElements() {
        this.elements.modeCode = document.getElementById('mode-code');
        this.elements.modePdf = document.getElementById('mode-pdf');
        this.elements.gridEditorContainer = document.getElementById('grid-editor-container');
        this.elements.pdfViewerContainer = document.getElementById('pdf-viewer-container');
        this.elements.lineNumbers = document.getElementById('line-numbers');
        this.elements.pdfControls = document.getElementById('pdf-controls');
        this.elements.codeControls = document.getElementById('code-controls');
        this.elements.pdfFileInput = document.getElementById('pdf-file-input');
        this.elements.pdfPrev = document.getElementById('pdf-prev');
        this.elements.pdfNext = document.getElementById('pdf-next');
        this.elements.pdfPageDisplay = document.getElementById('pdf-page-display');
        this.elements.pdfZoomIn = document.getElementById('pdf-zoom-in');
        this.elements.pdfZoomOut = document.getElementById('pdf-zoom-out');
        this.elements.pdfZoomDisplay = document.getElementById('pdf-zoom-display');
        this.elements.sidebarResizeHandle = document.getElementById('sidebar-resize-handle');
        this.elements.keywordSidebar = document.getElementById('keyword-sidebar');
    },
    
    /**
     * Initialize mode toggle buttons
     */
    _initModeToggle() {
        if (this.elements.modeCode) {
            this.elements.modeCode.addEventListener('click', () => {
                this.switchToMode('code');
                if (this.isTeacher && typeof Collaboration !== 'undefined') {
                    Collaboration.sendModeChange('code');
                }
            });
        }
        
        if (this.elements.modePdf) {
            this.elements.modePdf.addEventListener('click', () => {
                this.switchToMode('pdf');
                if (this.isTeacher && typeof Collaboration !== 'undefined') {
                    Collaboration.sendModeChange('pdf');
                }
            });
        }
        
        // Students: hide mode toggle (teacher controls)
        if (!this.isTeacher) {
            const modeToggle = document.querySelector('.mode-toggle');
            if (modeToggle) {
                modeToggle.style.display = 'none';
            }
        }
    },
    
    /**
     * Initialize PDF viewer and controls
     */
    _initPdfViewer() {
        // Initialize PdfViewer component
        if (typeof PdfViewer !== 'undefined') {
            PdfViewer.init('pdf-viewer-container', this.isTeacher);
            
            // Set up container class based on role
            const container = document.getElementById('pdf-viewer-container');
            if (container) {
                container.classList.add(this.isTeacher ? 'teacher-view' : 'student-view');
            }
            
            // Teacher-only: PDF file input
            if (this.isTeacher && this.elements.pdfFileInput) {
                this.elements.pdfFileInput.addEventListener('change', async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        showToast('📄 Φόρτωση PDF...', 'info');
                        
                        try {
                            const base64 = await PdfViewer.fileToBase64(file);
                            await PdfViewer.loadPdf(base64, true);
                            
                            if (typeof Collaboration !== 'undefined') {
                                Collaboration.sendPdfLoad(base64, file.name);
                            }
                            
                            this._updatePdfControls();
                            showToast(`✅ Φορτώθηκε: ${file.name}`, 'success');
                        } catch (err) {
                            console.error('Error loading PDF:', err);
                            showToast('❌ Σφάλμα φόρτωσης PDF', 'error');
                        }
                        
                        e.target.value = '';
                    }
                });
            }
            
            // Teacher-only: Navigation and zoom controls
            if (this.isTeacher) {
                this._initPdfControls();
            } else {
                // Student: hide load button
                const loadBtn = document.querySelector('.pdf-load-btn');
                if (loadBtn) loadBtn.style.display = 'none';
            }
            
            console.log('📄 PDF Viewer ready');
        }
    },
    
    /**
     * Initialize PDF navigation controls (teacher only)
     */
    _initPdfControls() {
        if (this.elements.pdfPrev) {
            this.elements.pdfPrev.addEventListener('click', async () => {
                await PdfViewer.prevPage();
                this._updatePdfControls();
            });
        }
        
        if (this.elements.pdfNext) {
            this.elements.pdfNext.addEventListener('click', async () => {
                await PdfViewer.nextPage();
                this._updatePdfControls();
            });
        }
        
        if (this.elements.pdfZoomIn) {
            this.elements.pdfZoomIn.addEventListener('click', async () => {
                await PdfViewer.setZoom(PdfViewer.scale + 0.25);
                this._updatePdfControls();
            });
        }
        
        if (this.elements.pdfZoomOut) {
            this.elements.pdfZoomOut.addEventListener('click', async () => {
                await PdfViewer.setZoom(PdfViewer.scale - 0.25);
                this._updatePdfControls();
            });
        }
    },
    
    /**
     * Update PDF control displays
     */
    _updatePdfControls() {
        if (typeof PdfViewer !== 'undefined') {
            if (this.elements.pdfPageDisplay) {
                this.elements.pdfPageDisplay.textContent = `${PdfViewer.currentPage}/${PdfViewer.totalPages || '-'}`;
            }
            if (this.elements.pdfZoomDisplay) {
                this.elements.pdfZoomDisplay.textContent = `${Math.round(PdfViewer.scale * 100)}%`;
            }
        }
    },
    
    /**
     * Initialize sidebar resizer
     */
    _initSidebarResizer() {
        if (!this.elements.sidebarResizeHandle || !this.elements.keywordSidebar) return;
        
        // Load saved width from localStorage
        const savedWidth = localStorage.getItem('sidebarWidth');
        if (savedWidth) {
            this.elements.keywordSidebar.style.width = savedWidth + 'px';
        }
        
        this.elements.sidebarResizeHandle.addEventListener('mousedown', (e) => this._startResize(e));
        document.addEventListener('mousemove', (e) => this._resize(e));
        document.addEventListener('mouseup', () => this._stopResize());
        
        console.log('📐 Sidebar Resizer initialized');
    },
    
    /**
     * Start sidebar resize
     */
    _startResize(e) {
        this._resizing = true;
        this._startX = e.clientX;
        this._startWidth = this.elements.keywordSidebar.offsetWidth;
        this.elements.sidebarResizeHandle.classList.add('dragging');
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
        e.preventDefault();
    },
    
    /**
     * Handle sidebar resize
     */
    _resize(e) {
        if (!this._resizing) return;
        
        const deltaX = this._startX - e.clientX;
        const newWidth = Math.min(Math.max(this._startWidth + deltaX, 150), 400);
        this.elements.keywordSidebar.style.width = newWidth + 'px';
    },
    
    /**
     * Stop sidebar resize
     */
    _stopResize() {
        if (!this._resizing) return;
        
        this._resizing = false;
        this.elements.sidebarResizeHandle.classList.remove('dragging');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        
        // Save width to localStorage
        localStorage.setItem('sidebarWidth', this.elements.keywordSidebar.offsetWidth);
    },
    
    /**
     * Switch between code and PDF mode
     * @param {string} mode - 'code' or 'pdf'
     */
    switchToMode(mode) {
        if (mode === this.currentMode) return;
        this.currentMode = mode;
        
        if (mode === 'pdf') {
            // Switch to PDF mode
            this.elements.modeCode?.classList.remove('active');
            this.elements.modePdf?.classList.add('active');
            
            // Hide code elements
            if (this.elements.gridEditorContainer) this.elements.gridEditorContainer.style.display = 'none';
            if (this.elements.lineNumbers) this.elements.lineNumbers.style.display = 'none';
            if (this.elements.codeControls) this.elements.codeControls.style.display = 'none';
            
            // Show PDF elements
            if (this.elements.pdfViewerContainer) this.elements.pdfViewerContainer.style.display = 'block';
            if (this.elements.pdfControls) this.elements.pdfControls.style.display = 'flex';
            
            // Activate PDF viewer
            if (typeof PdfViewer !== 'undefined') {
                PdfViewer.show();
            }
            
            console.log('📄 Switched to PDF mode');
        } else {
            // Switch to code mode
            this.elements.modePdf?.classList.remove('active');
            this.elements.modeCode?.classList.add('active');
            
            // Hide PDF elements
            if (this.elements.pdfViewerContainer) this.elements.pdfViewerContainer.style.display = 'none';
            if (this.elements.pdfControls) this.elements.pdfControls.style.display = 'none';
            
            // Show code elements
            if (this.elements.gridEditorContainer) this.elements.gridEditorContainer.style.display = 'block';
            if (this.elements.lineNumbers) this.elements.lineNumbers.style.display = 'block';
            if (this.elements.codeControls) this.elements.codeControls.style.display = 'flex';
            
            // Deactivate PDF viewer
            if (typeof PdfViewer !== 'undefined') {
                PdfViewer.hide();
            }
            
            // Focus editor
            if (this.gridEditor) {
                this.gridEditor.focus();
            }
            
            console.log('💻 Switched to Code mode');
        }
    },
    
    /**
     * Get current mode
     */
    getCurrentMode() {
        return this.currentMode;
    },
    
    /**
     * Set editor reference (for late binding)
     */
    setGridEditor(gridEditor) {
        this.gridEditor = gridEditor;
    }
};

// Expose globally for cross-module access
window.LayoutManager = LayoutManager;

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LayoutManager;
}
