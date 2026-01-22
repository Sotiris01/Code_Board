/**
 * LocalFileBrowser - Open local files from teacher's computer
 * Allows teacher to browse and load program files (.gls, .glo, .py, etc.) onto the board
 */

const LocalFileBrowser = {
    // DOM Elements
    openBtn: null,
    fileInput: null,
    dropZone: null,
    fileInfo: null,
    loadBtn: null,
    
    // State
    selectedFile: null,
    fileContent: null,
    
    // Callbacks
    onFileLoad: null,
    
    /**
     * Initialize the LocalFileBrowser component
     * @param {Object} options - Configuration options
     * @param {Function} options.onFileLoad - Callback when file is loaded (content, filename)
     */
    init(options = {}) {
        this.onFileLoad = options.onFileLoad || null;
        
        // Get DOM elements
        this.openBtn = document.getElementById('open-local-file-btn');
        this.fileInput = document.getElementById('local-file-input');
        this.dropZone = document.getElementById('local-drop-zone');
        this.fileInfo = document.getElementById('local-file-info');
        this.loadBtn = document.getElementById('load-local-file-btn');
        
        if (!this.openBtn || !this.fileInput) {
            console.warn('LocalFileBrowser: Required elements not found');
            return;
        }
        
        this._setupEventListeners();
        console.log('💻 LocalFileBrowser initialized');
    },
    
    /**
     * Set up all event listeners
     */
    _setupEventListeners() {
        // Browse button click
        this.openBtn.addEventListener('click', () => {
            this.fileInput.click();
        });
        
        // File input change
        this.fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this._handleFileSelect(e.target.files[0]);
            }
        });
        
        // Load button click
        if (this.loadBtn) {
            this.loadBtn.addEventListener('click', () => {
                this._loadFileToBoard();
            });
        }
        
        // Drag & Drop events
        if (this.dropZone) {
            this.dropZone.addEventListener('dragover', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.dropZone.classList.add('drag-over');
            });
            
            this.dropZone.addEventListener('dragleave', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.dropZone.classList.remove('drag-over');
            });
            
            this.dropZone.addEventListener('drop', (e) => {
                e.preventDefault();
                e.stopPropagation();
                this.dropZone.classList.remove('drag-over');
                
                if (e.dataTransfer.files.length > 0) {
                    this._handleFileSelect(e.dataTransfer.files[0]);
                }
            });
        }
    },
    
    /**
     * Handle file selection
     * @param {File} file - Selected file
     */
    async _handleFileSelect(file) {
        // Validate file extension
        const validExtensions = ['.gls', '.glo', '.py', '.cpp', '.c', '.h', '.hpp', '.java', '.txt'];
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!validExtensions.includes(ext)) {
            if (typeof showToast === 'function') {
                showToast(`❌ Unsupported file type: ${ext}`, 'error');
            }
            return;
        }
        
        this.selectedFile = file;
        
        try {
            // Read file content
            this.fileContent = await this._readFileContent(file);
            
            // Update UI
            this._showFileInfo(file, this.fileContent);
            
        } catch (error) {
            console.error('Error reading file:', error);
            if (typeof showToast === 'function') {
                showToast('❌ Error reading file', 'error');
            }
        }
    },
    
    /**
     * Read file content as text
     * @param {File} file - File to read
     * @returns {Promise<string>} File content
     */
    _readFileContent(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve(e.target.result);
            reader.onerror = (e) => reject(e);
            reader.readAsText(file, 'UTF-8');
        });
    },
    
    /**
     * Show file info in the panel
     * @param {File} file - Selected file
     * @param {string} content - File content
     */
    _showFileInfo(file, content) {
        if (!this.fileInfo) return;
        
        const fileName = document.getElementById('local-file-name');
        const fileSize = document.getElementById('local-file-size');
        const fileLines = document.getElementById('local-file-lines');
        const fileIcon = this.fileInfo.querySelector('.file-info-icon');
        
        // Set file name
        if (fileName) {
            fileName.textContent = file.name;
        }
        
        // Set file size
        if (fileSize) {
            const sizeKB = (file.size / 1024).toFixed(1);
            fileSize.textContent = sizeKB < 1 ? `${file.size} B` : `${sizeKB} KB`;
        }
        
        // Set line count
        if (fileLines) {
            const lines = content.split('\n').length;
            fileLines.textContent = `${lines} lines`;
        }
        
        // Set icon based on file extension
        if (fileIcon) {
            const ext = file.name.split('.').pop().toLowerCase();
            fileIcon.textContent = this._getFileIcon(ext);
        }
        
        // Show the file info section
        this.fileInfo.style.display = 'block';
    },
    
    /**
     * Get icon for file extension
     * @param {string} ext - File extension
     * @returns {string} Icon emoji
     */
    _getFileIcon(ext) {
        const icons = {
            'gls': '📘',
            'glo': '📘',
            'py': '🐍',
            'cpp': '⚙️',
            'c': '⚙️',
            'h': '📋',
            'hpp': '📋',
            'java': '☕',
            'txt': '📄'
        };
        return icons[ext] || '📄';
    },
    
    /**
     * Load file content to the board
     */
    _loadFileToBoard() {
        if (!this.fileContent || !this.selectedFile) {
            if (typeof showToast === 'function') {
                showToast('❌ No file selected', 'error');
            }
            return;
        }
        
        // Call the callback
        if (this.onFileLoad) {
            this.onFileLoad(this.fileContent, this.selectedFile.name);
        }
        
        // Show success message
        if (typeof showToast === 'function') {
            showToast(`✅ Loaded: ${this.selectedFile.name}`, 'success');
        }
        
        // Reset state
        this._reset();
    },
    
    /**
     * Reset the component state
     */
    _reset() {
        this.selectedFile = null;
        this.fileContent = null;
        this.fileInput.value = '';
        
        if (this.fileInfo) {
            this.fileInfo.style.display = 'none';
        }
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocalFileBrowser;
}
