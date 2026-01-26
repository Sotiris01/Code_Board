/**
 * LayoutManager Component
 * Handles sidebar resizing and mode switching (Code, PDF, Markdown)
 * 
 * Dependencies:
 * - PdfViewer
 * - MarkdownViewer
 * - Collaboration (for sync)
 * - UIManager (for showToast)
 */

const LayoutManager = {
    elements: {
        // Mode toggle
        modeCode: null,
        modePdf: null,
        modeMarkdown: null,
        // Containers
        gridEditorContainer: null,
        pdfViewerContainer: null,
        mdViewerContainer: null,
        lineNumbers: null,
        // Controls
        pdfControls: null,
        codeControls: null,
        mdControls: null,
        // PDF specific
        pdfFileInput: null,
        pdfPageDisplay: null,
        // Markdown specific
        mdFileInput: null,
        mdScrollTop: null,
        mdScrollBottom: null,
        // Sidebar
        sidebarResizeHandle: null,
        keywordSidebar: null
    },
    
    // Current mode: 'code', 'pdf', or 'markdown'
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
        this._initMarkdownViewer();
        this._initSidebarResizer();
        
        console.log('📐 LayoutManager initialized');
    },
    
    /**
     * Cache DOM element references
     */
    _cacheElements() {
        this.elements.modeCode = document.getElementById('mode-code');
        this.elements.modePdf = document.getElementById('mode-pdf');
        this.elements.modeMarkdown = document.getElementById('mode-markdown');
        this.elements.gridEditorContainer = document.getElementById('grid-editor-container');
        this.elements.pdfViewerContainer = document.getElementById('pdf-viewer-container');
        this.elements.mdViewerContainer = document.getElementById('md-viewer-container');
        this.elements.lineNumbers = document.getElementById('line-numbers');
        this.elements.pdfControls = document.getElementById('pdf-controls');
        this.elements.codeControls = document.getElementById('code-controls');
        this.elements.mdControls = document.getElementById('md-controls');
        this.elements.pdfFileInput = document.getElementById('pdf-file-input');
        this.elements.mdFileInput = document.getElementById('md-file-input');
        this.elements.mdScrollTop = document.getElementById('md-scroll-top');
        this.elements.mdScrollBottom = document.getElementById('md-scroll-bottom');
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
                if (this.isTeacher) {
                    const hasPdf = typeof PdfViewer !== 'undefined' && PdfViewer.pdfDoc;
                    const isCurrentMode = this.currentMode === 'pdf';
                    
                    // Open file browser if: no PDF loaded OR already on PDF mode (to load new file)
                    if (!hasPdf || isCurrentMode) {
                        if (this.elements.pdfFileInput) {
                            this.elements.pdfFileInput.click();
                        }
                    }
                }
                
                this.switchToMode('pdf');
                if (this.isTeacher && typeof Collaboration !== 'undefined') {
                    Collaboration.sendModeChange('pdf');
                }
            });
        }
        
        if (this.elements.modeMarkdown) {
            this.elements.modeMarkdown.addEventListener('click', () => {
                if (this.isTeacher) {
                    const hasMd = typeof MarkdownViewer !== 'undefined' && MarkdownViewer.hasContent();
                    const isCurrentMode = this.currentMode === 'markdown';
                    
                    // Open file browser if: no MD loaded OR already on MD mode (to load new file)
                    if (!hasMd || isCurrentMode) {
                        if (this.elements.mdFileInput) {
                            this.elements.mdFileInput.click();
                        }
                    }
                }
                
                this.switchToMode('markdown');
                if (this.isTeacher && typeof Collaboration !== 'undefined') {
                    Collaboration.sendModeChange('markdown');
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
                        showToast('📄 Loading PDF...', 'info');
                        
                        try {
                            const base64 = await PdfViewer.fileToBase64(file);
                            await PdfViewer.loadPdf(base64, true);
                            
                            if (typeof Collaboration !== 'undefined') {
                                Collaboration.sendPdfLoad(base64, file.name);
                            }
                            
                            this._updatePdfControls();
                            showToast(`✅ Loaded: ${file.name}`, 'success');
                        } catch (err) {
                            console.error('Error loading PDF:', err);
                            showToast('❌ Error loading PDF', 'error');
                        }
                        
                        e.target.value = '';
                    }
                });
            }
            
            // Teacher-only: Navigation and zoom controls
            if (this.isTeacher) {
                this._initPdfControls();
            }
            
            console.log('📄 PDF Viewer ready');
        }
    },
    
    /**
     * Initialize Markdown viewer and controls
     */
    _initMarkdownViewer() {
        // Initialize MarkdownViewer component
        if (typeof MarkdownViewer !== 'undefined') {
            MarkdownViewer.init('md-viewer-container', this.isTeacher);
            
            // Set up container class based on role
            const container = document.getElementById('md-viewer-container');
            if (container) {
                container.classList.add(this.isTeacher ? 'teacher-view' : 'student-view');
            }
            
            // Teacher-only: Markdown file input
            if (this.isTeacher && this.elements.mdFileInput) {
                this.elements.mdFileInput.addEventListener('change', async (e) => {
                    const file = e.target.files[0];
                    if (file) {
                        showToast('📝 Loading Markdown...', 'info');
                        
                        try {
                            await MarkdownViewer.loadFromFile(file);
                            showToast(`✅ Loaded: ${file.name}`, 'success');
                        } catch (err) {
                            console.error('Error loading Markdown:', err);
                            showToast('❌ Error loading Markdown', 'error');
                        }
                        
                        e.target.value = '';
                    }
                });
            }
            
            // Teacher-only: Navigation and zoom controls
            if (this.isTeacher) {
                this._initMarkdownControls();
            }
            
            console.log('📝 Markdown Viewer ready');
        }
    },
    
    /**
     * Initialize Markdown navigation controls (teacher only)
     */
    _initMarkdownControls() {
        if (this.elements.mdScrollTop) {
            this.elements.mdScrollTop.addEventListener('click', () => {
                MarkdownViewer.scrollToTop();
            });
        }
        
        if (this.elements.mdScrollBottom) {
            this.elements.mdScrollBottom.addEventListener('click', () => {
                MarkdownViewer.scrollToBottom();
            });
        }
    },
    
    /**
     * Initialize PDF navigation controls (teacher only)
     */
    _initPdfControls() {
        // Zoom controls removed - use Ctrl+wheel to zoom
    },
    
    /**
     * Update PDF control displays
     */
    _updatePdfControls() {
        if (typeof PdfViewer !== 'undefined') {
            if (this.elements.pdfPageDisplay) {
                this.elements.pdfPageDisplay.textContent = `${PdfViewer.currentPage}/${PdfViewer.totalPages || '-'}`;
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
     * Switch between code, PDF, and markdown modes
     * @param {string} mode - 'code', 'pdf', or 'markdown'
     */
    switchToMode(mode) {
        if (mode === this.currentMode) return;
        this.currentMode = mode;
        
        // Reset all mode buttons
        this.elements.modeCode?.classList.remove('active');
        this.elements.modePdf?.classList.remove('active');
        this.elements.modeMarkdown?.classList.remove('active');
        
        // Hide all containers and controls
        if (this.elements.gridEditorContainer) this.elements.gridEditorContainer.style.display = 'none';
        if (this.elements.pdfViewerContainer) this.elements.pdfViewerContainer.style.display = 'none';
        if (this.elements.mdViewerContainer) this.elements.mdViewerContainer.style.display = 'none';
        if (this.elements.lineNumbers) this.elements.lineNumbers.style.display = 'none';
        if (this.elements.codeControls) this.elements.codeControls.style.display = 'none';
        if (this.elements.pdfControls) this.elements.pdfControls.style.display = 'none';
        if (this.elements.mdControls) this.elements.mdControls.style.display = 'none';
        
        // Deactivate all viewers
        if (typeof PdfViewer !== 'undefined') PdfViewer.hide();
        if (typeof MarkdownViewer !== 'undefined') MarkdownViewer.hide();
        
        if (mode === 'pdf') {
            // Switch to PDF mode
            this.elements.modePdf?.classList.add('active');
            if (this.elements.pdfViewerContainer) this.elements.pdfViewerContainer.style.display = 'block';
            if (this.elements.pdfControls) this.elements.pdfControls.style.display = 'flex';
            if (typeof PdfViewer !== 'undefined') PdfViewer.show();
            console.log('📄 Switched to PDF mode');
            
        } else if (mode === 'markdown') {
            // Switch to Markdown mode
            this.elements.modeMarkdown?.classList.add('active');
            if (this.elements.mdViewerContainer) this.elements.mdViewerContainer.style.display = 'flex';
            if (this.elements.mdControls) this.elements.mdControls.style.display = 'flex';
            if (typeof MarkdownViewer !== 'undefined') MarkdownViewer.show();
            console.log('📝 Switched to Markdown mode');
            
        } else {
            // Switch to code mode (default)
            this.elements.modeCode?.classList.add('active');
            if (this.elements.gridEditorContainer) this.elements.gridEditorContainer.style.display = 'block';
            if (this.elements.lineNumbers) this.elements.lineNumbers.style.display = 'block';
            if (this.elements.codeControls) this.elements.codeControls.style.display = 'flex';
            
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
