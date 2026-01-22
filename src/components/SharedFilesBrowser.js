/**
 * SharedFilesBrowser.js
 * Component for managing shared files between Teacher and Students
 * Phase 6: Folder Upload & Sharing
 */

const SharedFilesBrowser = {
    // Current user role
    role: null,
    
    // Current user name (for upload attribution)
    currentUserName: null,
    
    // Container element
    container: null,
    
    // Shared files list (will be populated from server)
    sharedFiles: [],
    
    // Shared folders list
    sharedFolders: [],
    
    // Hidden file input element
    fileInput: null,
    
    // Upload in progress
    isUploading: false,
    
    // Currently open folder (for navigation)
    currentFolder: null,
    
    // Navigation path stack
    navigationPath: [],
    
    // Notification badge element
    notificationBadge: null,
    
    /**
     * Initialize the Shared Files Browser
     */
    init() {
        this.container = document.getElementById('shared-content');
        if (!this.container) {
            console.warn('⚠️ SharedFilesBrowser: #shared-content not found');
            return;
        }
        
        // Determine role from URL params or Collaboration module
        this.role = this._detectRole();
        
        // Create hidden file input for folder uploads
        this._createFileInput();
        
        // Render appropriate view
        this.render();
        
        // Load existing shared folders
        this._loadSharedFolders();
        
        console.log('📤 SharedFilesBrowser initialized as:', this.role);
    },
    
    /**
     * Create hidden file input for file selection
     */
    _createFileInput() {
        // Remove existing input if any
        if (this.fileInput) {
            this.fileInput.remove();
        }
        
        this.fileInput = document.createElement('input');
        this.fileInput.type = 'file';
        this.fileInput.id = 'file-upload-input';
        this.fileInput.style.display = 'none';
        // Allow multiple file selection (not folder)
        this.fileInput.setAttribute('multiple', '');
        
        // Handle file selection
        this.fileInput.addEventListener('change', (e) => {
            if (e.target.files && e.target.files.length > 0) {
                this._handleUpload(e.target.files);
            }
            // Reset input so same files can be selected again
            e.target.value = '';
        });
        
        document.body.appendChild(this.fileInput);
    },
    
    /**
     * Detect user role (teacher or student)
     * @returns {string} 'teacher' or 'student'
     */
    _detectRole() {
        // First check Collaboration module
        if (typeof Collaboration !== 'undefined' && Collaboration.myRole) {
            return Collaboration.myRole;
        }
        
        // Fallback to URL params
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('role') || 'student';
    },
    
    /**
     * Get the current user's display name
     * @returns {string} User name
     */
    _getCurrentUserName() {
        if (typeof Collaboration !== 'undefined' && Collaboration.myName) {
            return Collaboration.myName;
        }
        return this.role === 'teacher' ? 'Teacher' : 'Unknown';
    },
    
    /**
     * Render the appropriate view based on role
     */
    render() {
        if (!this.container) return;
        
        // Re-detect role in case it changed (e.g., after Collaboration connected)
        this.role = this._detectRole();
        
        if (this.role === 'teacher') {
            this.renderTeacherView();
        } else {
            this.renderStudentView();
        }
    },
    
    /**
     * Render Teacher View
     * - Upload Folder button
     * - List of shared content
     */
    renderTeacherView() {
        this.container.innerHTML = `
            <div class="shared-browser" id="shared-browser">
                <!-- Upload Actions -->
                <div class="shared-actions">
                    <button class="btn-action btn-primary" id="upload-folder-btn" title="Upload file(s) to share with students">
                        <span class="btn-icon">📄</span>
                        <span class="btn-text">Upload File(s)</span>
                    </button>
                </div>
                
                <!-- Drop Zone -->
                <div class="drop-zone" id="drop-zone">
                    <span class="drop-icon">📂</span>
                    <span class="drop-text">Drop file(s) here</span>
                </div>
                
                <!-- Upload Progress -->
                <div class="upload-progress" id="upload-progress" style="display: none;">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill"></div>
                    </div>
                    <span class="progress-text" id="progress-text">Uploading...</span>
                </div>
                
                <!-- Shared Content Section -->
                <div class="shared-section">
                    <div class="section-header">
                        <span class="section-title">📂 Shared Content</span>
                        <span class="section-count" id="shared-count">0</span>
                    </div>
                    <div class="file-list shared-list" id="shared-list">
                        <!-- Shared files will appear here -->
                        <div class="empty-state">
                            <span class="empty-icon">📭</span>
                            <span class="empty-text">No files shared yet</span>
                            <span class="empty-hint">Click "Upload File(s)" or drag & drop</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Attach event listeners
        this._attachTeacherEvents();
        this._attachDragDropEvents();
    },
    
    /**
     * Render Student View
     * - Upload Folder button (same as teacher)
     * - Drop zone for drag & drop uploads
     * - List of files shared with them
     */
    renderStudentView() {
        this.container.innerHTML = `
            <div class="shared-browser" id="shared-browser">
                <!-- Upload Actions (students can also upload) -->
                <div class="shared-actions">
                    <button class="btn-action btn-primary" id="upload-folder-btn" title="Upload file(s) to share">
                        <span class="btn-icon">📄</span>
                        <span class="btn-text">Upload File(s)</span>
                    </button>
                </div>
                
                <!-- Drop Zone -->
                <div class="drop-zone" id="drop-zone">
                    <span class="drop-icon">📂</span>
                    <span class="drop-text">Drop file(s) here</span>
                </div>
                
                <!-- Upload Progress -->
                <div class="upload-progress" id="upload-progress" style="display: none;">
                    <div class="progress-bar">
                        <div class="progress-fill" id="progress-fill"></div>
                    </div>
                    <span class="progress-text" id="progress-text">Uploading...</span>
                </div>
                
                <!-- Shared With Me Section -->
                <div class="shared-section">
                    <div class="section-header">
                        <span class="section-title">📥 Shared Files</span>
                        <span class="section-count" id="shared-count">0</span>
                    </div>
                    <div class="file-list shared-list" id="shared-list">
                        <!-- Shared files will appear here -->
                        <div class="empty-state">
                            <span class="empty-icon">📭</span>
                            <span class="empty-text">No shared files yet</span>
                            <span class="empty-hint">Upload file(s) or wait for others to share</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Attach event listeners (same as teacher)
        this._attachTeacherEvents();
        this._attachDragDropEvents();
    },
    
    /**
     * Attach event listeners for Teacher view
     */
    _attachTeacherEvents() {
        const uploadBtn = document.getElementById('upload-folder-btn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                this.handleUploadFolder();
            });
        }
    },
    
    /**
     * Attach drag & drop event listeners
     */
    _attachDragDropEvents() {
        const dropZone = document.getElementById('drop-zone');
        const sharedBrowser = document.getElementById('shared-browser');
        
        if (!sharedBrowser) return;
        
        // Prevent default drag behaviors on the whole browser area
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            sharedBrowser.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
            });
        });
        
        // Highlight drop zone on drag enter
        sharedBrowser.addEventListener('dragenter', () => {
            if (dropZone) dropZone.classList.add('drag-over');
        });
        
        sharedBrowser.addEventListener('dragleave', (e) => {
            // Only remove highlight if leaving the browser area entirely
            if (!sharedBrowser.contains(e.relatedTarget)) {
                if (dropZone) dropZone.classList.remove('drag-over');
            }
        });
        
        // Handle drop
        sharedBrowser.addEventListener('drop', async (e) => {
            if (dropZone) dropZone.classList.remove('drag-over');
            
            if (this.isUploading) {
                showToast('⏳ Upload already in progress', 'warning');
                return;
            }
            
            // Extract files from drop
            if (typeof FileTransfer !== 'undefined') {
                const files = await FileTransfer.extractFilesFromDrop(e.dataTransfer);
                if (files.length > 0) {
                    this._handleUpload(files);
                }
            }
        });
    },
    
    /**
     * Attach event listeners for Student view
     */
    _attachStudentEvents() {
        // Listen for folder_shared events from Collaboration
        // This will be triggered by WebSocket when teacher uploads
    },
    
    /**
     * Handle folder shared event from WebSocket
     * @param {Object} folder - Folder data from server
     */
    onFolderShared(folder) {
        // Check if this is from someone else (not our own upload)
        const currentUser = this._getCurrentUserName();
        const isFromOther = folder.uploadedBy !== currentUser;
        
        // Add to folders list if not already present
        const existingIndex = this.sharedFolders.findIndex(f => f.name === folder.name);
        if (existingIndex >= 0) {
            // Update existing folder
            this.sharedFolders[existingIndex] = folder;
        } else {
            // Add new folder
            this.sharedFolders.push(folder);
        }
        
        // Re-render list
        this._renderFolderList();
        
        // If from someone else, show notification and open sidebar
        if (isFromOther) {
            // Show notification badge
            this._showNotificationBadge();
            
            // Auto-open the shared files sidebar
            this._openSharedPanel();
            
            // Show toast notification
            if (typeof showToast === 'function') {
                const uploaderInfo = folder.uploadedBy ? ` by ${folder.uploadedBy}` : '';
                showToast(`📂 New file(s): ${folder.name}${uploaderInfo}`, 'info');
            }
        }
    },
    
    /**
     * Show notification badge on the Shared Files button
     */
    _showNotificationBadge() {
        const sharedBtn = document.querySelector('[data-panel="shared"]');
        if (sharedBtn) {
            // Add notification badge if not already present
            if (!sharedBtn.querySelector('.notification-badge')) {
                const badge = document.createElement('span');
                badge.className = 'notification-badge';
                sharedBtn.style.position = 'relative';
                sharedBtn.appendChild(badge);
            }
        }
    },
    
    /**
     * Hide notification badge
     */
    _hideNotificationBadge() {
        const badge = document.querySelector('[data-panel="shared"] .notification-badge');
        if (badge) {
            badge.remove();
        }
    },
    
    /**
     * Open the shared files panel in sidebar
     */
    _openSharedPanel() {
        // Use FileBrowser methods if available for consistent behavior
        if (typeof FileBrowser !== 'undefined') {
            // Expand sidebar if collapsed
            if (FileBrowser.expandSidePanel) {
                FileBrowser.expandSidePanel();
            }
            // Switch to shared panel
            if (FileBrowser.switchPanel) {
                // Temporarily store current active to prevent toggle behavior
                const sidePanel = document.getElementById('side-panel');
                const wasCollapsed = sidePanel && sidePanel.classList.contains('collapsed');
                
                // Update activity bar buttons directly to avoid toggle
                document.querySelectorAll('.activity-btn[data-panel]').forEach(btn => {
                    btn.classList.toggle('active', btn.dataset.panel === 'shared');
                });
                
                // Update panels
                document.querySelectorAll('.sidebar-panel').forEach(panel => {
                    panel.classList.toggle('active', panel.id === 'shared-panel');
                });
            }
        } else {
            // Fallback: manually expand sidebar
            const sidePanel = document.getElementById('side-panel');
            if (sidePanel && sidePanel.classList.contains('collapsed')) {
                sidePanel.classList.remove('collapsed');
                const toggleBtn = document.querySelector('.activity-btn[data-action="toggle-sidebar"] .activity-icon');
                if (toggleBtn) {
                    toggleBtn.textContent = '◀';
                }
            }
            
            // Switch to shared panel
            const sharedBtn = document.querySelector('[data-panel="shared"]');
            if (sharedBtn) {
                sharedBtn.click();
            }
        }
        
        // Hide notification after opening
        setTimeout(() => this._hideNotificationBadge(), 500);
    },
    
    /**
     * Handle file upload button click
     */
    handleUploadFolder() {
        if (this.isUploading) {
            showToast('⏳ Upload already in progress', 'warning');
            return;
        }
        
        // Trigger hidden file input
        if (this.fileInput) {
            this.fileInput.click();
        }
    },
    
    /**
     * Handle the actual upload of files
     * If multiple files selected, create a ZIP first
     * @param {FileList|File[]} files - Files to upload
     */
    async _handleUpload(files) {
        if (!files || files.length === 0) return;
        
        if (typeof FileTransfer === 'undefined') {
            showToast('❌ FileTransfer module not loaded', 'error');
            return;
        }
        
        this.isUploading = true;
        this._showProgress(true);
        
        try {
            let filesToUpload = files;
            let uploadMessage = '';
            
            // If multiple files, create a ZIP
            if (files.length > 1) {
                this._updateProgress(0);
                const progressText = document.getElementById('progress-text');
                if (progressText) progressText.textContent = 'Creating ZIP...';
                
                const zipFile = await this._createZipFromFiles(files);
                filesToUpload = [zipFile];
                uploadMessage = `✅ Uploaded ${files.length} files as "${zipFile.name}"`;
            } else {
                uploadMessage = `✅ Uploaded "${files[0].name}"`;
            }
            
            const result = await FileTransfer.uploadFiles(filesToUpload, (progress) => {
                this._updateProgress(progress);
            });
            
            showToast(uploadMessage, 'success');
            
            // Refresh folder list
            await this._loadSharedFolders();
            
        } catch (error) {
            console.error('Upload failed:', error);
            showToast(`❌ Upload failed: ${error.message}`, 'error');
        } finally {
            this.isUploading = false;
            this._showProgress(false);
        }
    },
    
    /**
     * Create a ZIP file from multiple files using JSZip
     * @param {FileList|File[]} files - Files to zip
     * @returns {Promise<File>} The ZIP file
     */
    async _createZipFromFiles(files) {
        if (typeof JSZip === 'undefined') {
            throw new Error('JSZip library not loaded');
        }
        
        const zip = new JSZip();
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        const zipName = `files_${timestamp}.zip`;
        
        // Add all files to the ZIP
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            zip.file(file.name, file);
        }
        
        // Generate the ZIP blob
        const zipBlob = await zip.generateAsync({ 
            type: 'blob',
            compression: 'DEFLATE',
            compressionOptions: { level: 6 }
        });
        
        // Create a File object from the blob
        return new File([zipBlob], zipName, { type: 'application/zip' });
    },
    
    /**
     * Show/hide upload progress bar
     * @param {boolean} show - Whether to show progress
     */
    _showProgress(show) {
        const progressEl = document.getElementById('upload-progress');
        if (progressEl) {
            progressEl.style.display = show ? 'block' : 'none';
        }
        if (show) {
            this._updateProgress(0);
        }
    },
    
    /**
     * Update progress bar
     * @param {number} percent - Progress percentage (0-100)
     */
    _updateProgress(percent) {
        const fillEl = document.getElementById('progress-fill');
        const textEl = document.getElementById('progress-text');
        
        if (fillEl) {
            fillEl.style.width = `${percent}%`;
        }
        if (textEl) {
            textEl.textContent = percent < 100 ? `Uploading... ${percent}%` : 'Processing...';
        }
    },
    
    /**
     * Load shared folders from server
     */
    async _loadSharedFolders() {
        if (typeof FileTransfer === 'undefined') return;
        
        try {
            this.sharedFolders = await FileTransfer.getSharedFolders();
            this._renderFolderList();
        } catch (error) {
            console.error('Failed to load shared folders:', error);
        }
    },
    
    /**
     * Render the folder list
     */
    _renderFolderList() {
        const listContainer = document.getElementById('shared-list');
        const countEl = document.getElementById('shared-count');
        
        if (!listContainer) return;
        
        // If we're inside a folder, show its contents
        if (this.currentFolder) {
            this._renderFolderContents();
            return;
        }
        
        if (this.sharedFolders.length === 0) {
            // Show empty state
            const emptyText = 'No files shared yet';
            const emptyHint = 'Click "Upload File(s)" or drag & drop';
            
            listContainer.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">📭</span>
                    <span class="empty-text">${emptyText}</span>
                    <span class="empty-hint">${emptyHint}</span>
                </div>
            `;
        } else {
            // Get current user name to check if they uploaded the file
            const currentUser = this._getCurrentUserName();
            
            // Render files with uploader info and download button (only for files NOT uploaded by current user)
            listContainer.innerHTML = this.sharedFolders.map(folder => {
                const icon = folder.isFolder === false ? this._getFileIcon(folder.name) : '📁';
                const typeLabel = folder.isFolder === false ? '1 file' : `${folder.fileCount} files`;
                
                // Only show download button if current user is NOT the uploader
                const isOwnUpload = folder.uploadedBy === currentUser;
                const downloadBtn = isOwnUpload ? '' : `
                    <button class="folder-download-btn" data-folder="${folder.name}" title="Download${folder.isFolder === false ? '' : ' as ZIP'}">
                        <span>⬇️</span>
                    </button>
                `;
                
                return `
                <div class="file-item folder-item ${folder.isFolder === false ? 'single-file-item' : ''} ${isOwnUpload ? 'own-upload' : ''}" data-folder="${folder.name}">
                    <span class="file-icon">${icon}</span>
                    <div class="folder-info">
                        <span class="file-name">${folder.name}</span>
                        <span class="folder-meta">
                            <span class="file-count">${typeLabel}</span>
                            ${folder.uploadedBy ? `<span class="uploaded-by">${isOwnUpload ? '(your upload)' : 'by ' + folder.uploadedBy}</span>` : ''}
                        </span>
                    </div>
                    ${downloadBtn}
                </div>
            `}).join('');
            
            // Attach click handlers
            this._attachFolderClickHandlers();
            this._attachDownloadButtonHandlers();
        }
        
        // Update count
        if (countEl) {
            countEl.textContent = this.sharedFolders.length;
        }
    },
    
    /**
     * Attach click handlers to folder items
     */
    _attachFolderClickHandlers() {
        const listContainer = document.getElementById('shared-list');
        if (!listContainer) return;
        
        listContainer.querySelectorAll('.folder-item').forEach(item => {
            // Only attach click to the folder info area, not the download button
            item.addEventListener('click', (e) => {
                // Don't navigate if clicking on download button
                if (e.target.closest('.folder-download-btn')) return;
                
                const folderName = item.dataset.folder;
                this._openFolder(folderName);
            });
        });
    },
    
    /**
     * Attach click handlers to download buttons
     */
    _attachDownloadButtonHandlers() {
        const listContainer = document.getElementById('shared-list');
        if (!listContainer) return;
        
        listContainer.querySelectorAll('.folder-download-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation(); // Prevent folder navigation
                const folderName = btn.dataset.folder;
                this._downloadFolder(folderName);
            });
        });
    },
    
    /**
     * Download a folder as ZIP
     * @param {string} folderName - Name of folder to download
     */
    async _downloadFolder(folderName) {
        if (!folderName) return;
        
        // Create a hidden iframe to trigger download
        const downloadUrl = `/api/download-folder?folderName=${encodeURIComponent(folderName)}`;
        
        // Use fetch to check if download is successful before deleting
        try {
            // Create a temporary link and click it
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = folderName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            if (typeof showToast === 'function') {
                showToast(`📦 Downloading: ${folderName}`, 'info');
            }
            
            // Wait a moment for download to start, then delete from server
            setTimeout(async () => {
                await this._deleteFile(folderName);
            }, 1500);
            
        } catch (error) {
            console.error('Download failed:', error);
            if (typeof showToast === 'function') {
                showToast(`❌ Download failed: ${error.message}`, 'error');
            }
        }
    },
    
    /**
     * Delete a file/folder from the server
     * @param {string} fileName - Name of file/folder to delete
     */
    async _deleteFile(fileName) {
        try {
            const response = await fetch(`/api/shared-files/${encodeURIComponent(fileName)}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (data.success) {
                // Remove from local list
                this.sharedFolders = this.sharedFolders.filter(f => f.name !== fileName);
                this._renderFolderList();
                
                if (typeof showToast === 'function') {
                    showToast(`🗑️ Removed: ${fileName}`, 'success');
                }
            }
        } catch (error) {
            console.error('Delete failed:', error);
        }
    },
    
    /**
     * Handle file_deleted event from WebSocket
     * @param {string} fileName - Name of deleted file
     */
    onFileDeleted(fileName) {
        // Remove from local list
        this.sharedFolders = this.sharedFolders.filter(f => f.name !== fileName);
        this._renderFolderList();
    },
    
    /**
     * Open a folder and show its contents
     * @param {string} folderName - Name of folder to open
     */
    _openFolder(folderName) {
        const folder = this.sharedFolders.find(f => f.name === folderName);
        if (!folder) return;
        
        this.currentFolder = folder;
        this.navigationPath = [folderName];
        this._renderFolderContents();
    },
    
    /**
     * Render contents of current folder
     */
    _renderFolderContents() {
        const listContainer = document.getElementById('shared-list');
        const countEl = document.getElementById('shared-count');
        
        if (!listContainer || !this.currentFolder) return;
        
        const files = this.currentFolder.files || [];
        
        // Build navigation header with back button
        let html = `
            <div class="folder-nav">
                <button class="nav-back-btn" id="nav-back-btn" title="Go back">
                    <span>◀</span>
                </button>
                <span class="nav-path">📁 ${this.navigationPath.join(' / ')}</span>
            </div>
        `;
        
        if (files.length === 0) {
            html += `
                <div class="empty-state">
                    <span class="empty-icon">📭</span>
                    <span class="empty-text">Empty folder</span>
                </div>
            `;
        } else {
            html += files.map(file => `
                <div class="file-item shared-file-item" data-path="${this.currentFolder.name}/${file.path}" data-name="${file.name}">
                    <span class="file-icon">${this._getFileIcon(file.name)}</span>
                    <span class="file-name">${file.path || file.name}</span>
                    <span class="file-size">${this._formatFileSize(file.size)}</span>
                </div>
            `).join('');
        }
        
        listContainer.innerHTML = html;
        
        // Update count
        if (countEl) {
            countEl.textContent = files.length;
        }
        
        // Attach handlers
        this._attachBackButtonHandler();
        this._attachFileClickHandlers();
    },
    
    /**
     * Attach click handler to back button
     */
    _attachBackButtonHandler() {
        const backBtn = document.getElementById('nav-back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this._navigateBack();
            });
        }
    },
    
    /**
     * Navigate back to folder list
     */
    _navigateBack() {
        this.currentFolder = null;
        this.navigationPath = [];
        this._renderFolderList();
    },
    
    /**
     * Attach click handlers to file items
     */
    _attachFileClickHandlers() {
        const listContainer = document.getElementById('shared-list');
        if (!listContainer) return;
        
        listContainer.querySelectorAll('.shared-file-item').forEach(item => {
            item.addEventListener('click', () => {
                const filePath = item.dataset.path;
                const fileName = item.dataset.name;
                this._openFile(filePath, fileName);
            });
        });
    },
    
    /**
     * Open a file (load into editor or handle appropriately)
     * @param {string} filePath - Path to file
     * @param {string} fileName - Name of file
     */
    async _openFile(filePath, fileName) {
        const ext = fileName.split('.').pop().toLowerCase();
        const codeExtensions = ['gls', 'py', 'cpp', 'java', 'js', 'html', 'css', 'txt', 'md', 'json'];
        
        try {
            // Fetch file content from server
            const response = await fetch(`/api/uploads/files?path=${encodeURIComponent(filePath)}`);
            const data = await response.json();
            
            if (!data.success) {
                showToast(`❌ Failed to load file: ${data.error}`, 'error');
                return;
            }
            
            if (data.type === 'file' && codeExtensions.includes(ext)) {
                // Load code file into editor
                if (typeof gridEditor !== 'undefined' && gridEditor) {
                    gridEditor.setValue(data.content);
                    gridEditor.render();
                    
                    // Detect and set language based on extension
                    const langMap = {
                        'gls': 'glossa',
                        'py': 'python',
                        'cpp': 'cpp',
                        'java': 'java',
                        'js': 'javascript'
                    };
                    
                    if (langMap[ext] && typeof LanguageManager !== 'undefined') {
                        // Only change language if different and reset flag to prevent clearing
                        const currentLang = LanguageManager.getCurrentLanguage();
                        if (currentLang !== langMap[ext]) {
                            // Set flag to prevent clearing (content already loaded)
                            if (typeof Collaboration !== 'undefined') {
                                Collaboration.contentLoadedFromServer = true;
                            }
                            await LanguageManager.setLanguage(langMap[ext], { isRemoteSync: true });
                        }
                    }
                    
                    showToast(`📄 Loaded: ${fileName}`, 'success');
                }
            } else if (data.type === 'binary' && ext === 'pdf') {
                // Open PDF in PDF viewer
                if (typeof PdfViewer !== 'undefined') {
                    showToast(`📕 PDF preview: ${fileName}`, 'info');
                    // Would need to implement PDF loading from uploads
                }
            } else if (data.type === 'binary') {
                // Offer download for binary files
                window.open(data.downloadUrl, '_blank');
                showToast(`📥 Downloading: ${fileName}`, 'info');
            }
        } catch (error) {
            console.error('Failed to open file:', error);
            showToast(`❌ Failed to open file: ${error.message}`, 'error');
        }
    },
    
    /**
     * Format file size for display
     * @param {number} bytes - Size in bytes
     * @returns {string} Formatted size
     */
    _formatFileSize(bytes) {
        if (!bytes) return '';
        if (bytes < 1024) return `${bytes} B`;
        if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
        return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    },
    
    /**
     * Update shared files list (will be called when server sends updates)
     * @param {Array} files - List of shared files
     */
    updateSharedFiles(files) {
        this.sharedFiles = files || [];
        this._renderFileList();
    },
    
    /**
     * Render the file list based on current sharedFiles
     */
    _renderFileList() {
        const listContainer = document.getElementById('shared-list');
        const countEl = document.getElementById('shared-count');
        
        if (!listContainer) return;
        
        if (this.sharedFiles.length === 0) {
            // Show empty state
            const emptyText = this.role === 'teacher' 
                ? 'No files shared yet'
                : 'No shared files yet';
            const emptyHint = this.role === 'teacher'
                ? 'Click "Upload File(s)" to share files with students'
                : 'Your teacher hasn\'t shared any files';
            
            listContainer.innerHTML = `
                <div class="empty-state">
                    <span class="empty-icon">📭</span>
                    <span class="empty-text">${emptyText}</span>
                    <span class="empty-hint">${emptyHint}</span>
                </div>
            `;
        } else {
            // Render files
            listContainer.innerHTML = this.sharedFiles.map(file => `
                <div class="file-item shared-item" data-path="${file.path}">
                    <span class="file-icon">${file.isFolder ? '📁' : this._getFileIcon(file.name)}</span>
                    <span class="file-name">${file.name}</span>
                    ${this.role === 'teacher' ? `
                        <button class="file-action-btn" data-action="unshare" title="Stop sharing">
                            <span>❌</span>
                        </button>
                    ` : ''}
                </div>
            `).join('');
        }
        
        // Update count
        if (countEl) {
            countEl.textContent = this.sharedFiles.length;
        }
    },
    
    /**
     * Get file icon based on extension
     * @param {string} filename - File name
     * @returns {string} Emoji icon
     */
    _getFileIcon(filename) {
        const ext = filename.split('.').pop().toLowerCase();
        const icons = {
            'gls': '📜',
            'py': '🐍',
            'cpp': '⚡',
            'java': '☕',
            'js': '📜',
            'html': '🌐',
            'css': '🎨',
            'pdf': '📕',
            'txt': '📄',
            'md': '📝'
        };
        return icons[ext] || '📄';
    }
};

// Export for global access
window.SharedFilesBrowser = SharedFilesBrowser;
