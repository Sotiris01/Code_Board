/**
 * LocalFileBrowser - Browse local files from teacher's computer
 * Uses File System Access API to browse folders and load files onto the board
 */

const LocalFileBrowser = {
    // DOM Elements
    browseInitial: null,
    folderBrowser: null,
    folderBtn: null,
    fileBtn: null,
    fileInput: null,
    changeFolderBtn: null,
    folderNameEl: null,
    breadcrumbEl: null,
    fileListEl: null,
    
    // State
    rootHandle: null,        // Root directory handle
    currentHandle: null,     // Current directory handle
    currentPath: [],         // Path from root as array of names
    
    // Callbacks
    onFileLoad: null,
    
    // Valid file extensions
    validExtensions: ['.gls', '.glo', '.py', '.cpp', '.c', '.h', '.hpp', '.java', '.txt', '.md', '.pdf'],
    
    /**
     * Initialize the LocalFileBrowser component
     * @param {Object} options - Configuration options
     * @param {Function} options.onFileLoad - Callback when file is loaded (content, filename)
     */
    init(options = {}) {
        this.onFileLoad = options.onFileLoad || null;
        
        // Get DOM elements
        this.browseInitial = document.getElementById('local-browse-initial');
        this.folderBrowser = document.getElementById('local-folder-browser');
        this.folderBtn = document.getElementById('open-local-folder-btn');
        this.fileBtn = document.getElementById('open-local-file-btn');
        this.fileInput = document.getElementById('local-file-input');
        this.changeFolderBtn = document.getElementById('local-folder-change');
        this.folderNameEl = document.getElementById('local-folder-name');
        this.breadcrumbEl = document.getElementById('local-breadcrumb');
        this.fileListEl = document.getElementById('local-file-list');
        
        if (!this.folderBtn && !this.fileBtn) {
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
        // Open folder button
        if (this.folderBtn) {
            this.folderBtn.addEventListener('click', () => this._openFolderPicker());
        }
        
        // Open single file button (fallback)
        if (this.fileBtn) {
            this.fileBtn.addEventListener('click', () => {
                if (this.fileInput) {
                    this.fileInput.click();
                }
            });
        }
        
        // Single file input change
        if (this.fileInput) {
            this.fileInput.addEventListener('change', (e) => {
                if (e.target.files.length > 0) {
                    this._handleSingleFile(e.target.files[0]);
                }
            });
        }
        
        // Change folder button
        if (this.changeFolderBtn) {
            this.changeFolderBtn.addEventListener('click', () => this._openFolderPicker());
        }
    },
    
    /**
     * Open folder picker using File System Access API
     */
    async _openFolderPicker() {
        // Check if File System Access API is supported
        if (!('showDirectoryPicker' in window)) {
            if (typeof showToast === 'function') {
                showToast('❌ Folder browsing not supported in this browser. Use "Open Single File" instead.', 'error');
            }
            return;
        }
        
        try {
            const handle = await window.showDirectoryPicker({
                mode: 'read'
            });
            
            this.rootHandle = handle;
            this.currentHandle = handle;
            this.currentPath = [];
            
            // Update UI
            this._showFolderBrowser(handle.name);
            await this._loadCurrentFolder();
            
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error opening folder:', error);
                if (typeof showToast === 'function') {
                    showToast('❌ Error opening folder', 'error');
                }
            }
        }
    },
    
    /**
     * Show the folder browser UI
     */
    _showFolderBrowser(folderName) {
        if (this.browseInitial) {
            this.browseInitial.style.display = 'none';
        }
        if (this.folderBrowser) {
            this.folderBrowser.style.display = 'block';
        }
        if (this.folderNameEl) {
            this.folderNameEl.textContent = folderName;
        }
    },
    
    /**
     * Load and display current folder contents
     */
    async _loadCurrentFolder() {
        if (!this.currentHandle || !this.fileListEl) return;
        
        // Show loading
        this.fileListEl.innerHTML = '<div class="file-empty">Loading...</div>';
        
        try {
            const items = [];
            
            // Iterate through directory entries
            for await (const entry of this.currentHandle.values()) {
                const item = {
                    name: entry.name,
                    type: entry.kind === 'directory' ? 'folder' : 'file',
                    handle: entry
                };
                
                // Filter files by extension
                if (entry.kind === 'file') {
                    const ext = '.' + entry.name.split('.').pop().toLowerCase();
                    if (!this.validExtensions.includes(ext)) {
                        continue; // Skip unsupported files
                    }
                }
                
                items.push(item);
            }
            
            // Sort: folders first, then alphabetically
            items.sort((a, b) => {
                if (a.type !== b.type) {
                    return a.type === 'folder' ? -1 : 1;
                }
                return a.name.localeCompare(b.name);
            });
            
            this._renderFileList(items);
            this._updateBreadcrumb();
            
        } catch (error) {
            console.error('Error loading folder:', error);
            this.fileListEl.innerHTML = '<div class="file-empty">❌ Error loading folder</div>';
        }
    },
    
    /**
     * Render file list
     */
    _renderFileList(items) {
        if (!this.fileListEl) return;
        
        if (items.length === 0) {
            this.fileListEl.innerHTML = '<div class="file-empty">No supported files</div>';
            return;
        }
        
        this.fileListEl.innerHTML = items.map(item => `
            <div class="file-item ${item.type}" data-name="${item.name}" data-type="${item.type}">
                <span class="file-icon">${this._getFileIcon(item.name, item.type)}</span>
                <span class="file-name">${item.name}</span>
            </div>
        `).join('');
        
        // Store handles for click handlers
        const handleMap = new Map();
        items.forEach(item => handleMap.set(item.name, item.handle));
        
        // Add click handlers
        this.fileListEl.querySelectorAll('.file-item').forEach(el => {
            el.addEventListener('click', async () => {
                const name = el.dataset.name;
                const type = el.dataset.type;
                const handle = handleMap.get(name);
                
                if (type === 'folder') {
                    await this._navigateToFolder(handle);
                } else {
                    await this._loadFile(handle);
                }
            });
        });
    },
    
    /**
     * Navigate to a subfolder
     */
    async _navigateToFolder(handle) {
        this.currentPath.push(this.currentHandle.name);
        this.currentHandle = handle;
        await this._loadCurrentFolder();
    },
    
    /**
     * Navigate to a specific path index
     */
    async _navigateToPathIndex(index) {
        if (index < 0) {
            // Go to root
            this.currentHandle = this.rootHandle;
            this.currentPath = [];
        } else {
            // Navigate to specific level
            this.currentHandle = this.rootHandle;
            const targetPath = this.currentPath.slice(0, index + 1);
            this.currentPath = [];
            
            for (let i = 0; i < targetPath.length; i++) {
                const name = targetPath[i];
                // Skip the root name
                if (i === 0 && name === this.rootHandle.name) continue;
                this.currentPath.push(this.currentHandle.name);
                this.currentHandle = await this.currentHandle.getDirectoryHandle(name);
            }
        }
        
        await this._loadCurrentFolder();
    },
    
    /**
     * Update breadcrumb navigation
     */
    _updateBreadcrumb() {
        if (!this.breadcrumbEl) return;
        
        let html = `<span class="breadcrumb-item breadcrumb-root" data-index="-1">📂 ${this.rootHandle.name}</span>`;
        
        this.currentPath.forEach((name, index) => {
            if (name !== this.rootHandle.name) {
                html += `<span class="breadcrumb-separator">/</span>`;
                html += `<span class="breadcrumb-item" data-index="${index}">${name}</span>`;
            }
        });
        
        // Add current folder if not root
        if (this.currentHandle !== this.rootHandle) {
            html += `<span class="breadcrumb-separator">/</span>`;
            html += `<span class="breadcrumb-item current">${this.currentHandle.name}</span>`;
        }
        
        this.breadcrumbEl.innerHTML = html;
        
        // Add click handlers (except for current)
        this.breadcrumbEl.querySelectorAll('.breadcrumb-item:not(.current)').forEach(el => {
            el.addEventListener('click', async () => {
                const index = parseInt(el.dataset.index);
                await this._navigateToPathIndex(index);
            });
        });
    },
    
    /**
     * Load a file and send to editor
     */
    async _loadFile(handle) {
        try {
            const file = await handle.getFile();
            const ext = file.name.split('.').pop().toLowerCase();
            
            // Handle PDF files
            if (ext === 'pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const base64 = this._arrayBufferToBase64(arrayBuffer);
                
                // Switch to PDF mode
                if (window.LayoutManager) {
                    window.LayoutManager.switchToMode('pdf');
                }
                if (typeof PdfViewer !== 'undefined') {
                    await PdfViewer.loadPdf(base64, true);
                    
                    if (typeof Collaboration !== 'undefined' && Collaboration.connected) {
                        Collaboration.sendModeChange('pdf');
                        Collaboration.sendPdfLoad(base64, file.name);
                    }
                }
                
                if (typeof showToast === 'function') {
                    showToast(`📄 Loaded: ${file.name}`, 'success');
                }
                return;
            }
            
            // Handle Markdown files
            if (ext === 'md') {
                const content = await file.text();
                
                if (window.LayoutManager) {
                    window.LayoutManager.switchToMode('markdown');
                }
                if (typeof MarkdownViewer !== 'undefined') {
                    await MarkdownViewer.loadMarkdown(content, true, file.name);
                }
                
                if (typeof Collaboration !== 'undefined' && Collaboration.connected) {
                    Collaboration.sendModeChange('markdown');
                }
                
                if (typeof showToast === 'function') {
                    showToast(`📝 Loaded: ${file.name}`, 'success');
                }
                return;
            }
            
            // Handle code files
            const content = await file.text();
            
            // Use callback if provided
            if (this.onFileLoad) {
                this.onFileLoad(content, file.name);
            }
            
            if (typeof showToast === 'function') {
                showToast(`✅ Loaded: ${file.name}`, 'success');
            }
            
        } catch (error) {
            console.error('Error loading file:', error);
            if (typeof showToast === 'function') {
                showToast('❌ Error loading file', 'error');
            }
        }
    },
    
    /**
     * Handle single file selection (fallback for browsers without folder support)
     */
    async _handleSingleFile(file) {
        const ext = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!this.validExtensions.includes(ext)) {
            if (typeof showToast === 'function') {
                showToast(`❌ Unsupported file type: ${ext}`, 'error');
            }
            return;
        }
        
        try {
            // Handle PDF
            if (ext === '.pdf') {
                const arrayBuffer = await file.arrayBuffer();
                const base64 = this._arrayBufferToBase64(arrayBuffer);
                
                if (window.LayoutManager) {
                    window.LayoutManager.switchToMode('pdf');
                }
                if (typeof PdfViewer !== 'undefined') {
                    await PdfViewer.loadPdf(base64, true);
                    
                    if (typeof Collaboration !== 'undefined' && Collaboration.connected) {
                        Collaboration.sendModeChange('pdf');
                        Collaboration.sendPdfLoad(base64, file.name);
                    }
                }
                
                if (typeof showToast === 'function') {
                    showToast(`📄 Loaded: ${file.name}`, 'success');
                }
                return;
            }
            
            // Handle Markdown
            if (ext === '.md') {
                const content = await file.text();
                
                if (window.LayoutManager) {
                    window.LayoutManager.switchToMode('markdown');
                }
                if (typeof MarkdownViewer !== 'undefined') {
                    await MarkdownViewer.loadMarkdown(content, true, file.name);
                }
                
                if (typeof Collaboration !== 'undefined' && Collaboration.connected) {
                    Collaboration.sendModeChange('markdown');
                }
                
                if (typeof showToast === 'function') {
                    showToast(`📝 Loaded: ${file.name}`, 'success');
                }
                return;
            }
            
            // Handle code files
            const content = await file.text();
            
            if (this.onFileLoad) {
                this.onFileLoad(content, file.name);
            }
            
            if (typeof showToast === 'function') {
                showToast(`✅ Loaded: ${file.name}`, 'success');
            }
            
            // Reset file input
            if (this.fileInput) {
                this.fileInput.value = '';
            }
            
        } catch (error) {
            console.error('Error reading file:', error);
            if (typeof showToast === 'function') {
                showToast('❌ Error reading file', 'error');
            }
        }
    },
    
    /**
     * Convert ArrayBuffer to base64
     */
    _arrayBufferToBase64(buffer) {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    },
    
    /**
     * Get icon for file based on extension
     */
    _getFileIcon(filename, type) {
        if (type === 'folder') return '📁';
        
        const ext = filename.split('.').pop().toLowerCase();
        const iconMap = {
            'gls': '📘',
            'glo': '📘',
            'py': '🐍',
            'cpp': '⚙️',
            'c': '⚙️',
            'h': '📋',
            'hpp': '📋',
            'java': '☕',
            'txt': '📄',
            'md': '📝',
            'pdf': '📕'
        };
        return iconMap[ext] || '📄';
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LocalFileBrowser;
}
