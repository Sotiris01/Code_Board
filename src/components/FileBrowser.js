/**
 * FileBrowser Component
 * Handles file system navigation and loading within the sidebar
 * 
 * Dependencies:
 * - UIManager (for showToast)
 * - Collaboration (for sync when loading files)
 */

const FileBrowser = {
    currentPath: '',
    rootPath: '',
    
    /**
     * Initialize file browser
     */
    init() {
        // Set up tab switching
        const tabs = document.querySelectorAll('.sidebar-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchTab(tab.dataset.tab));
        });
        
        // Set up root breadcrumb click
        const rootBreadcrumb = document.querySelector('.breadcrumb-root');
        if (rootBreadcrumb) {
            rootBreadcrumb.addEventListener('click', () => this.loadFolder(this.rootPath));
        }
        
        // Load root folder when files tab is clicked for the first time
        console.log('📁 File Browser initialized');
    },
    
    /**
     * Set root path for the file browser
     * @param {string} path - Root path to use (e.g., 'glossa')
     */
    setRoot(path) {
        this.rootPath = path;
        this.loadFolder(path);
    },
    
    /**
     * Switch between tabs
     */
    switchTab(tabId) {
        // Update tab buttons
        document.querySelectorAll('.sidebar-tab').forEach(tab => {
            tab.classList.toggle('active', tab.dataset.tab === tabId);
        });
        
        // Update panels
        document.querySelectorAll('.sidebar-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${tabId}-panel`);
        });
        
        // Load files if switching to files tab
        if (tabId === 'files') {
            this.loadFolder(this.currentPath);
        }
    },
    
    /**
     * Load folder contents
     */
    async loadFolder(path) {
        // Normalize path - remove leading slashes
        path = path ? path.replace(/^\/+/, '') : '';
        this.currentPath = path;
        const fileList = document.getElementById('file-list');
        
        if (!fileList) return;
        
        // Show loading state
        fileList.innerHTML = '<div class="file-empty">Φόρτωση...</div>';
        
        console.log('📁 FileBrowser.loadFolder:', { path, rootPath: this.rootPath });
        
        try {
            const response = await fetch(`/api/files?path=${encodeURIComponent(path)}`);
            const data = await response.json();
            
            if (!response.ok) {
                // Display specific error from server
                const errorMsg = data.error || 'Failed to load folder';
                console.error('❌ FileBrowser error:', errorMsg);
                fileList.innerHTML = `<div class="file-empty">❌ ${errorMsg}</div>`;
                return;
            }
            
            this.renderFileList(data.items);
            this.updateBreadcrumb(path);
        } catch (error) {
            console.error('❌ FileBrowser network error:', error);
            fileList.innerHTML = `<div class="file-empty">❌ Σφάλμα σύνδεσης: ${error.message}</div>`;
        }
    },
    
    /**
     * Render file list
     */
    renderFileList(items) {
        const fileList = document.getElementById('file-list');
        
        if (!items || items.length === 0) {
            fileList.innerHTML = '<div class="file-empty">Κενός φάκελος</div>';
            return;
        }
        
        fileList.innerHTML = items.map(item => `
            <div class="file-item ${item.type}" data-path="${item.path}" data-type="${item.type}">
                <span class="file-icon">${item.type === 'folder' ? '📁' : '📄'}</span>
                <span class="file-name">${item.name.replace('.gls', '')}</span>
            </div>
        `).join('');
        
        // Add click handlers
        fileList.querySelectorAll('.file-item').forEach(item => {
            item.addEventListener('click', () => {
                const path = item.dataset.path;
                const type = item.dataset.type;
                
                if (type === 'folder') {
                    this.loadFolder(path);
                } else {
                    this.loadFile(path);
                }
            });
        });
    },
    
    /**
     * Update breadcrumb navigation
     */
    updateBreadcrumb(path) {
        const breadcrumb = document.getElementById('file-breadcrumb');
        if (!breadcrumb) return;
        
        // Root breadcrumb always points to rootPath
        let html = `<span class="breadcrumb-item breadcrumb-root" data-path="${this.rootPath}">📂 Home</span>`;
        
        if (path) {
            // Remove rootPath prefix from visual display
            let displayPath = path;
            if (this.rootPath && path.startsWith(this.rootPath)) {
                displayPath = path.slice(this.rootPath.length);
                if (displayPath.startsWith('/')) {
                    displayPath = displayPath.slice(1);
                }
            }
            
            // Only show parts after rootPath
            if (displayPath) {
                const parts = displayPath.split('/');
                let currentPath = this.rootPath;
                
                parts.forEach((part, index) => {
                    currentPath = currentPath ? `${currentPath}/${part}` : part;
                    html += `<span class="breadcrumb-separator">/</span>`;
                    html += `<span class="breadcrumb-item" data-path="${currentPath}">${part}</span>`;
                });
            }
        }
        
        breadcrumb.innerHTML = html;
        
        // Add click handlers to breadcrumb items
        breadcrumb.querySelectorAll('.breadcrumb-item').forEach(item => {
            item.addEventListener('click', () => {
                this.loadFolder(item.dataset.path);
            });
        });
    },
    
    /**
     * Load file content into editor
     * @param {string} path - Path to the file
     * @param {Object} options - Optional: { gridEditor, elements, updateEditor }
     */
    async loadFile(path, options = {}) {
        // Get references from window if not provided (for backward compatibility)
        const gridEditor = options.gridEditor || window.gridEditor;
        const elements = options.elements || window.elements;
        const updateEditor = options.updateEditor || window.updateEditor;
        
        try {
            const response = await fetch(`/api/files/content?path=${encodeURIComponent(path)}`);
            if (!response.ok) throw new Error('Failed to load file');
            
            const data = await response.json();
            
            // Update editor (GridEditor or legacy)
            if (gridEditor) {
                gridEditor.setValue(data.content);
            } else if (elements?.codeEditor) {
                elements.codeEditor.value = data.content;
                if (typeof updateEditor === 'function') {
                    updateEditor();
                }
            }
            
            // Sync with collaboration
            if (typeof Collaboration !== 'undefined' && Collaboration.connected) {
                Collaboration.sendTemplateLoaded(data.content, `📄 ${data.name}`);
            }
            
            // Show toast notification
            if (typeof showToast === 'function') {
                showToast(`📄 Φορτώθηκε: ${data.name.replace('.gls', '')}`, 'success');
            }
            
            // Focus the editor
            if (gridEditor) {
                gridEditor.focus();
            } else if (elements?.codeEditor) {
                elements.codeEditor.focus();
            }
            
        } catch (error) {
            console.error('Error loading file:', error);
            if (typeof showToast === 'function') {
                showToast('❌ Σφάλμα φόρτωσης αρχείου', 'error');
            }
        }
    }
};

// Export for module systems if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FileBrowser;
}
