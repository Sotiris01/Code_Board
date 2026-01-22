/**
 * FileTransfer.js
 * Module for handling file uploads and downloads
 * Phase 6: Folder Upload & Sharing
 */

const FileTransfer = {
    // Upload in progress flag
    isUploading: false,
    
    // Current upload progress (0-100)
    progress: 0,
    
    // Progress callback
    onProgress: null,
    
    /**
     * Upload files to the server
     * @param {FileList|File[]} files - Files to upload
     * @param {Function} onProgress - Optional progress callback (percent)
     * @param {string} uploadedBy - Optional uploader name
     * @returns {Promise} Resolves with server response
     */
    uploadFiles(files, onProgress = null, uploadedBy = null) {
        return new Promise((resolve, reject) => {
            if (!files || files.length === 0) {
                reject(new Error('No files provided'));
                return;
            }
            
            if (this.isUploading) {
                reject(new Error('Upload already in progress'));
                return;
            }
            
            this.isUploading = true;
            this.progress = 0;
            this.onProgress = onProgress;
            
            // Determine uploader name
            const uploaderName = uploadedBy || this._getUploaderName();
            
            // Create FormData with files and their paths
            const formData = new FormData();
            
            // Add uploader info
            formData.append('uploadedBy', uploaderName);
            
            for (let i = 0; i < files.length; i++) {
                const file = files[i];
                
                // Get relative path (webkitRelativePath for folder uploads)
                const relativePath = file.webkitRelativePath || file.name;
                
                // Append file
                formData.append('files', file, file.name);
                
                // Append path info as separate field
                // Using a unique key that includes the original filename
                formData.append(`path_files_${file.name}`, relativePath);
            }
            
            // Create XMLHttpRequest for progress tracking
            const xhr = new XMLHttpRequest();
            
            // Progress event
            xhr.upload.addEventListener('progress', (e) => {
                if (e.lengthComputable) {
                    this.progress = Math.round((e.loaded / e.total) * 100);
                    if (this.onProgress) {
                        this.onProgress(this.progress);
                    }
                }
            });
            
            // Load complete
            xhr.addEventListener('load', () => {
                this.isUploading = false;
                this.progress = 100;
                
                if (xhr.status >= 200 && xhr.status < 300) {
                    try {
                        const response = JSON.parse(xhr.responseText);
                        if (response.success) {
                            console.log(`📤 Upload complete: ${response.fileCount} files`);
                            resolve(response);
                        } else {
                            reject(new Error(response.error || 'Upload failed'));
                        }
                    } catch (e) {
                        reject(new Error('Invalid server response'));
                    }
                } else {
                    reject(new Error(`HTTP ${xhr.status}: ${xhr.statusText}`));
                }
            });
            
            // Error event
            xhr.addEventListener('error', () => {
                this.isUploading = false;
                reject(new Error('Network error during upload'));
            });
            
            // Abort event
            xhr.addEventListener('abort', () => {
                this.isUploading = false;
                reject(new Error('Upload cancelled'));
            });
            
            // Start upload
            xhr.open('POST', '/api/upload');
            xhr.send(formData);
            
            console.log(`📤 Uploading ${files.length} files...`);
        });
    },
    
    /**
     * Fetch list of shared folders from server
     * @returns {Promise} Resolves with folders array
     */
    async getSharedFolders() {
        try {
            const response = await fetch('/api/shared-folders');
            const data = await response.json();
            
            if (data.success) {
                return data.folders || [];
            } else {
                throw new Error(data.error || 'Failed to fetch folders');
            }
        } catch (error) {
            console.error('❌ Failed to fetch shared folders:', error);
            return [];
        }
    },
    
    /**
     * Extract files from a drag & drop DataTransfer object
     * Handles both files and directory entries
     * @param {DataTransfer} dataTransfer - Drop event dataTransfer
     * @returns {Promise<File[]>} Array of files
     */
    async extractFilesFromDrop(dataTransfer) {
        const files = [];
        const items = dataTransfer.items;
        
        if (!items) {
            // Fallback for older browsers
            return Array.from(dataTransfer.files);
        }
        
        // Process each item
        const promises = [];
        
        for (let i = 0; i < items.length; i++) {
            const item = items[i];
            
            if (item.kind === 'file') {
                // Try to get as directory entry (modern API)
                const entry = item.webkitGetAsEntry?.();
                
                if (entry) {
                    promises.push(this._readEntry(entry, ''));
                } else {
                    // Fallback: just get the file
                    const file = item.getAsFile();
                    if (file) files.push(file);
                }
            }
        }
        
        // Wait for all directory reads to complete
        const results = await Promise.all(promises);
        
        // Flatten results
        for (const result of results) {
            if (Array.isArray(result)) {
                files.push(...result);
            } else if (result) {
                files.push(result);
            }
        }
        
        return files;
    },
    
    /**
     * Read a FileSystem entry (file or directory)
     * @param {FileSystemEntry} entry - Entry to read
     * @param {string} path - Current path prefix
     * @returns {Promise<File|File[]>}
     */
    async _readEntry(entry, path) {
        if (entry.isFile) {
            return new Promise((resolve) => {
                entry.file((file) => {
                    // Create a new file with the relative path
                    const relativePath = path + file.name;
                    
                    // We can't modify webkitRelativePath, so we'll store it differently
                    // Create a wrapper object that preserves the path
                    Object.defineProperty(file, 'webkitRelativePath', {
                        value: relativePath,
                        writable: false
                    });
                    
                    resolve(file);
                }, () => resolve(null));
            });
        } else if (entry.isDirectory) {
            const dirReader = entry.createReader();
            const entries = await this._readAllEntries(dirReader);
            
            const newPath = path + entry.name + '/';
            const promises = entries.map(e => this._readEntry(e, newPath));
            const results = await Promise.all(promises);
            
            // Flatten and filter nulls
            return results.flat().filter(f => f !== null);
        }
        
        return null;
    },
    
    /**
     * Read all entries from a directory reader
     * @param {DirectoryReader} reader - Directory reader
     * @returns {Promise<FileSystemEntry[]>}
     */
    _readAllEntries(reader) {
        return new Promise((resolve) => {
            const entries = [];
            
            const readBatch = () => {
                reader.readEntries((batch) => {
                    if (batch.length === 0) {
                        resolve(entries);
                    } else {
                        entries.push(...batch);
                        readBatch(); // Continue reading
                    }
                }, () => resolve(entries));
            };
            
            readBatch();
        });
    },
    
    /**
     * Get the current user's name for upload attribution
     * @returns {string} Uploader name
     */
    _getUploaderName() {
        // Check Collaboration module for user info
        if (typeof Collaboration !== 'undefined' && Collaboration.myName) {
            return Collaboration.myName;
        }
        
        // Fallback to URL params
        const urlParams = new URLSearchParams(window.location.search);
        const role = urlParams.get('role');
        if (role === 'teacher') {
            return 'Teacher';
        }
        
        return 'Unknown';
    }
};

// Export for global access
window.FileTransfer = FileTransfer;
