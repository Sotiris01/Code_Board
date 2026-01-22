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
        // Set up activity bar panel switching
        const activityBtns = document.querySelectorAll('.activity-btn[data-panel]');
        activityBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchPanel(btn.dataset.panel));
        });
        
        // Set up toggle sidebar button
        const toggleBtn = document.querySelector('.activity-btn[data-action="toggle-sidebar"]');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleSidePanel());
        }
        
        // Legacy: Set up old tab switching (fallback)
        const tabs = document.querySelectorAll('.sidebar-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => this.switchPanel(tab.dataset.tab));
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
     * Switch between panels (Activity Bar)
     * If sidebar is collapsed, clicking a panel tab will expand it
     * If clicking the same active panel, toggle sidebar visibility
     */
    switchPanel(panelId) {
        const sidePanel = document.getElementById('side-panel');
        const isCollapsed = sidePanel && sidePanel.classList.contains('collapsed');
        const currentActiveBtn = document.querySelector('.activity-btn[data-panel].active');
        const isClickingActivePanel = currentActiveBtn && currentActiveBtn.dataset.panel === panelId;
        
        // If clicking the currently active panel and sidebar is open, collapse it
        if (isClickingActivePanel && !isCollapsed) {
            this.toggleSidePanel();
            return;
        }
        
        // If sidebar is collapsed, expand it
        if (isCollapsed) {
            this.expandSidePanel();
        }
        
        // Update activity bar buttons
        document.querySelectorAll('.activity-btn[data-panel]').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.panel === panelId);
        });
        
        // Update panels
        document.querySelectorAll('.sidebar-panel').forEach(panel => {
            panel.classList.toggle('active', panel.id === `${panelId}-panel`);
        });
        
        // Load files if switching to files panel
        if (panelId === 'files') {
            this.loadFolder(this.currentPath);
        }
    },
    
    /**
     * Expand side panel (show it)
     */
    expandSidePanel() {
        const sidePanel = document.getElementById('side-panel');
        const toggleBtn = document.querySelector('.activity-btn[data-action="toggle-sidebar"] .activity-icon');
        
        if (sidePanel && sidePanel.classList.contains('collapsed')) {
            sidePanel.classList.remove('collapsed');
            if (toggleBtn) {
                toggleBtn.textContent = '◀';
            }
        }
    },
    
    /**
     * Collapse side panel (hide it)
     */
    collapseSidePanel() {
        const sidePanel = document.getElementById('side-panel');
        const toggleBtn = document.querySelector('.activity-btn[data-action="toggle-sidebar"] .activity-icon');
        
        if (sidePanel && !sidePanel.classList.contains('collapsed')) {
            sidePanel.classList.add('collapsed');
            if (toggleBtn) {
                toggleBtn.textContent = '▶';
            }
        }
    },

    /**
     * Toggle side panel visibility
     */
    toggleSidePanel() {
        const sidePanel = document.getElementById('side-panel');
        const toggleBtn = document.querySelector('.activity-btn[data-action="toggle-sidebar"] .activity-icon');
        
        if (sidePanel) {
            sidePanel.classList.toggle('collapsed');
            if (toggleBtn) {
                toggleBtn.textContent = sidePanel.classList.contains('collapsed') ? '▶' : '◀';
            }
        }
    },
    
    /**
     * Legacy alias for switchPanel
     */
    switchTab(tabId) {
        this.switchPanel(tabId);
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
        fileList.innerHTML = '<div class="file-empty">Loading...</div>';
        
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
            fileList.innerHTML = `<div class="file-empty">❌ Connection error: ${error.message}</div>`;
        }
    },
    
    /**
     * Get file icon based on extension
     */
    getFileIcon(filename, type) {
        if (type === 'folder') return '📁';
        
        const ext = filename.split('.').pop().toLowerCase();
        const iconMap = {
            'gls': '📘',      // GLOSSA files - blue book
            'glo': '📘',      // GLOSSA files - blue book
            'py': '🐍',       // Python files - snake
            'cpp': '⚙️',      // C++ files - gear
            'h': '📋',        // Header files - clipboard
            'hpp': '📋',      // C++ header files
            'c': '©️',        // C files
            'java': '☕',     // Java files - coffee cup
            'js': '📜',       // JavaScript
            'json': '📦',     // JSON config
            'md': '📝',       // Markdown
            'pdf': '📕',      // PDF files
            'txt': '📄',      // Text files
            'tex': '📐'       // LaTeX files
        };
        
        return iconMap[ext] || '📄';
    },
    
    /**
     * Render file list
     */
    renderFileList(items) {
        const fileList = document.getElementById('file-list');
        
        if (!items || items.length === 0) {
            fileList.innerHTML = '<div class="file-empty">Empty folder</div>';
            return;
        }
        
        fileList.innerHTML = items.map(item => `
            <div class="file-item ${item.type}" data-path="${item.path}" data-type="${item.type}">
                <span class="file-icon">${this.getFileIcon(item.name, item.type)}</span>
                <span class="file-name">${item.name.replace(/\.(gls|glo|py|cpp|h|md|pdf)$/, '')}</span>
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
     * Load file content into editor or viewer
     * @param {string} path - Path to the file
     * @param {Object} options - Optional: { gridEditor, elements, updateEditor }
     */
    async loadFile(path, options = {}) {
        // Get references from window if not provided (for backward compatibility)
        const gridEditor = options.gridEditor || window.gridEditor;
        const elements = options.elements || window.elements;
        const updateEditor = options.updateEditor || window.updateEditor;
        
        // Get file extension
        const ext = path.split('.').pop().toLowerCase();
        
        try {
            const response = await fetch(`/api/files/content?path=${encodeURIComponent(path)}`);
            if (!response.ok) throw new Error('Failed to load file');
            
            const data = await response.json();
            
            // Handle markdown files specially
            if (ext === 'md') {
                // Switch to Markdown mode and load content
                if (window.LayoutManager) {
                    window.LayoutManager.switchToMode('markdown');
                }
                if (typeof MarkdownViewer !== 'undefined') {
                    await MarkdownViewer.loadMarkdown(data.content, true, data.name);
                }
                
                // Sync mode change
                if (typeof Collaboration !== 'undefined' && Collaboration.connected) {
                    Collaboration.sendModeChange('markdown');
                }
                
                // Show toast notification
                if (typeof showToast === 'function') {
                    showToast(`📝 Loaded: ${data.name}`, 'success');
                }
                return;
            }
            
            // Handle PDF files
            if (ext === 'pdf' && data.type === 'binary') {
                // Switch to PDF mode and load content
                if (window.LayoutManager) {
                    window.LayoutManager.switchToMode('pdf');
                }
                if (typeof PdfViewer !== 'undefined' && data.content) {
                    await PdfViewer.loadPdf(data.content, true);
                    
                    if (typeof Collaboration !== 'undefined' && Collaboration.connected) {
                        Collaboration.sendModeChange('pdf');
                        Collaboration.sendPdfLoad(data.content, data.name);
                    }
                }
                
                if (typeof showToast === 'function') {
                    showToast(`📄 Loaded: ${data.name}`, 'success');
                }
                return;
            }
            
            // Default: Load into code editor
            // Make sure we're in code mode
            if (window.LayoutManager && window.LayoutManager.currentMode !== 'code') {
                window.LayoutManager.switchToMode('code');
                if (typeof Collaboration !== 'undefined' && Collaboration.connected) {
                    Collaboration.sendModeChange('code');
                }
            }
            
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
                showToast(`📄 Loaded: ${data.name.replace(/\.(gls|glo)$/, '')}`, 'success');
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
                showToast('❌ Error loading file', 'error');
            }
        }
    }
};

// Export for module systems if available
if (typeof module !== 'undefined' && module.exports) {
    module.exports = FileBrowser;
}
