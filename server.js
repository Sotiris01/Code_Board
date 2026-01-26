/**
 * Code Board - Collaborative Server
 * WebSocket server for real-time collaboration between teacher and students
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const archiver = require('archiver');
const iconv = require('iconv-lite');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Session file path for state persistence
const SESSION_FILE = path.join(__dirname, '.session-state.json');

// Unique session ID for this server run (isolates uploaded files)
const UPLOAD_SESSION_ID = Date.now().toString();
const UPLOADS_DIR = path.join(__dirname, 'uploads', UPLOAD_SESSION_ID);

// Ensure uploads directory exists
fs.mkdirSync(UPLOADS_DIR, { recursive: true });
console.log(`📁 Upload directory: uploads/${UPLOAD_SESSION_ID}/`);

// Metadata file to store upload info (uploadedBy, timestamps, etc.)
const UPLOADS_METADATA_FILE = path.join(UPLOADS_DIR, '.metadata.json');

// Load or initialize uploads metadata
function loadUploadsMetadata() {
    try {
        if (fs.existsSync(UPLOADS_METADATA_FILE)) {
            return JSON.parse(fs.readFileSync(UPLOADS_METADATA_FILE, 'utf8'));
        }
    } catch (e) {
        console.error('Error loading uploads metadata:', e);
    }
    return {};
}

// Save uploads metadata
function saveUploadsMetadata(metadata) {
    try {
        fs.writeFileSync(UPLOADS_METADATA_FILE, JSON.stringify(metadata, null, 2), 'utf8');
    } catch (e) {
        console.error('Error saving uploads metadata:', e);
    }
}

// In-memory uploads metadata (persisted to disk)
let uploadsMetadata = loadUploadsMetadata();

// Multer storage configuration - preserve folder structure
// Helper function to decode filename from latin1 to UTF-8
function decodeFilename(filename) {
    try {
        // Try to decode from latin1 (ISO-8859-1) to UTF-8
        // This fixes filenames with Greek/special characters
        return Buffer.from(filename, 'latin1').toString('utf8');
    } catch (e) {
        return filename;
    }
}

/**
 * Read file content with automatic encoding detection
 * Supports UTF-8, UTF-16 LE/BE (with BOM), and Windows-1253 (Greek) for .glo files
 * @param {string} filePath - Path to file
 * @returns {string} File content as UTF-8 string
 */
function readFileWithEncoding(filePath) {
    const buffer = fs.readFileSync(filePath);
    const ext = path.extname(filePath).toLowerCase();
    
    // Check for UTF-16 BOM (Byte Order Mark)
    // UTF-16 LE: FF FE
    // UTF-16 BE: FE FF
    if (buffer.length >= 2) {
        if (buffer[0] === 0xFF && buffer[1] === 0xFE) {
            console.log('📖 Decoded file with UTF-16 LE encoding:', filePath);
            return buffer.toString('utf16le').replace(/^\uFEFF/, ''); // Remove BOM
        }
        if (buffer[0] === 0xFE && buffer[1] === 0xFF) {
            // UTF-16 BE - need to swap bytes
            const swapped = Buffer.alloc(buffer.length);
            for (let i = 0; i < buffer.length - 1; i += 2) {
                swapped[i] = buffer[i + 1];
                swapped[i + 1] = buffer[i];
            }
            console.log('📖 Decoded file with UTF-16 BE encoding:', filePath);
            return swapped.toString('utf16le').replace(/^\uFEFF/, ''); // Remove BOM
        }
    }
    
    // Check for UTF-8 BOM: EF BB BF
    if (buffer.length >= 3 && buffer[0] === 0xEF && buffer[1] === 0xBB && buffer[2] === 0xBF) {
        console.log('📖 Decoded file with UTF-8 BOM:', filePath);
        return buffer.toString('utf8').replace(/^\uFEFF/, ''); // Remove BOM
    }
    
    // Try UTF-8 first
    let content = buffer.toString('utf8');
    
    // Check if content has replacement characters (indicates wrong encoding)
    // Common sign: Greek text encoded as Windows-1253 shows as garbage in UTF-8
    const hasReplacementChars = content.includes('\ufffd') || 
        (ext === '.glo' && /[\x80-\xff]/.test(content) && !/[\u0370-\u03ff]/.test(content));
    
    if (hasReplacementChars || (ext === '.glo' && !isValidUtf8(buffer))) {
        // Try Windows-1253 (Greek) encoding
        try {
            content = iconv.decode(buffer, 'windows-1253');
            console.log('📖 Decoded file with Windows-1253 encoding:', filePath);
        } catch (e) {
            console.warn('⚠️ Failed to decode with Windows-1253, using UTF-8:', e.message);
        }
    }
    
    return content;
}

/**
 * Check if buffer is valid UTF-8
 * @param {Buffer} buffer 
 * @returns {boolean}
 */
function isValidUtf8(buffer) {
    try {
        const str = buffer.toString('utf8');
        // Check for replacement character which indicates invalid UTF-8
        return !str.includes('\ufffd');
    } catch (e) {
        return false;
    }
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Decode the filename for proper UTF-8 handling
        const decodedName = decodeFilename(file.originalname);
        file.originalname = decodedName;
        
        // Get the relative path from webkitRelativePath (sent as separate field)
        const relativePath = req.body[`path_${file.fieldname}_${decodedName}`] || 
                            req.body[`path_${file.fieldname}_${file.originalname}`] || '';
        const dirPath = path.dirname(relativePath);
        const fullDir = path.join(UPLOADS_DIR, dirPath);
        
        // Create directory if it doesn't exist
        fs.mkdirSync(fullDir, { recursive: true });
        cb(null, fullDir);
    },
    filename: (req, file, cb) => {
        // Use the decoded original filename
        cb(null, file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max per file
        files: 500 // Max 500 files per upload
    }
});

// Debounce utility for saving state
function debounce(func, wait) {
    let timeout;
    return function(...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(this, args), wait);
    };
}

// Save state to file (debounced to avoid excessive writes)
const saveState = debounce(() => {
    try {
        const stateToSave = {
            code: currentState.code,
            savedAt: new Date().toISOString(),
            lastUpdatedBy: currentState.lastUpdatedBy
        };
        fs.writeFileSync(SESSION_FILE, JSON.stringify(stateToSave, null, 2), 'utf8');
        console.log('💾 Session state saved');
    } catch (error) {
        console.error('❌ Failed to save session state:', error.message);
    }
}, 2000); // Save 2 seconds after last change

// Load state from file on startup
function loadSavedState() {
    try {
        if (fs.existsSync(SESSION_FILE)) {
            const savedData = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
            if (savedData.code) {
                currentState.code = savedData.code;
                console.log(`📂 Loaded saved session from ${savedData.savedAt}`);
                return true;
            }
        }
    } catch (error) {
        console.error('❌ Failed to load saved session:', error.message);
    }
    return false;
}

// Serve static files
app.use(express.static(__dirname));

// Simple ping endpoint for latency measurement
app.get('/api/ping', (req, res) => {
    res.json({ pong: Date.now() });
});

// API endpoint for ngrok stats (teacher only)
app.get('/api/ngrok-stats', async (req, res) => {
    try {
        // Fetch tunnel info
        const tunnelResponse = await fetch('http://127.0.0.1:4040/api/tunnels');
        if (!tunnelResponse.ok) {
            throw new Error('Ngrok API not available');
        }
        const tunnelData = await tunnelResponse.json();
        const tunnel = tunnelData.tunnels?.find(t => t.proto === 'https') || tunnelData.tunnels?.[0];
        
        let tunnelLatency = null;
        
        // Measure actual tunnel latency by pinging through ngrok
        if (tunnel?.public_url) {
            try {
                const pingUrl = tunnel.public_url + '/api/ping';
                const startTime = Date.now();
                const pingResponse = await fetch(pingUrl, { 
                    method: 'GET',
                    headers: { 'ngrok-skip-browser-warning': 'true' }
                });
                if (pingResponse.ok) {
                    tunnelLatency = Date.now() - startTime;
                }
            } catch (e) {
                // Ping failed, try requests API as fallback
            }
        }
        
        // Fallback: get latency from recent requests
        if (tunnelLatency === null) {
            try {
                const requestsResponse = await fetch('http://127.0.0.1:4040/api/requests/http?limit=5');
                if (requestsResponse.ok) {
                    const requestsData = await requestsResponse.json();
                    const requests = requestsData.requests || [];
                    
                    if (requests.length > 0) {
                        const latencies = requests
                            .filter(r => r.duration)
                            .map(r => r.duration / 1000000);
                        
                        if (latencies.length > 0) {
                            tunnelLatency = Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length);
                        }
                    }
                }
            } catch (e) {}
        }
        
        if (tunnel) {
            res.json({
                success: true,
                publicUrl: tunnel.public_url,
                region: tunnel.config?.region || tunnel.region || 'unknown',
                proto: tunnel.proto,
                latency: tunnelLatency,
                connections: wss.clients.size
            });
        } else {
            res.json({ success: false, error: 'No tunnel found' });
        }
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// API endpoint to clear saved session (teacher only)
app.post('/api/clear-session', (req, res) => {
    try {
        if (fs.existsSync(SESSION_FILE)) {
            fs.unlinkSync(SESSION_FILE);
        }
        currentState.code = '';
        currentState.lastUpdatedBy = null;
        console.log('🗑️ Session cleared');
        res.json({ success: true, message: 'Session cleared' });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// API endpoint to check if teacher password is required
app.get('/api/auth-config', (req, res) => {
    res.json({
        teacherPasswordRequired: !!TEACHER_PASSWORD
    });
});

// API endpoint to get teacher info (public)
app.get('/api/teacher-info', (req, res) => {
    res.json(loadTeacherInfo());
});

// API endpoint to update teacher info (teacher only - should be protected in production)
app.post('/api/teacher-info', express.json(), (req, res) => {
    const { name, email, phone, discord } = req.body;
    const info = { name, email, phone, discord };
    
    if (saveTeacherInfo(info)) {
        res.json({ success: true, info });
    } else {
        res.status(500).json({ success: false, error: 'Failed to save teacher info' });
    }
});

// API endpoint to get access control status (teacher only)
app.get('/api/access-control', (req, res) => {
    res.json({
        accessCode: accessControl.accessCode,
        publicAccess: accessControl.publicAccess
    });
});

// API endpoint for folder upload (multipart/form-data)
app.post('/api/upload', upload.array('files', 500), (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ 
                success: false, 
                error: 'No files uploaded' 
            });
        }
        
        // Get uploader info from request body or query
        const uploadedBy = req.body.uploadedBy || req.query.uploadedBy || 'Unknown';
        
        // Build list of uploaded files with their paths
        const uploadedFiles = req.files.map(file => {
            const relativePath = path.relative(UPLOADS_DIR, file.path);
            return {
                name: file.originalname,
                path: relativePath,
                size: file.size
            };
        });
        
        // Get folder name from first file's path
        // If it's a single file (no folder structure), use the file name without extension
        const firstPath = uploadedFiles[0]?.path || '';
        const pathParts = firstPath.split(path.sep);
        let folderName;
        
        if (pathParts.length > 1) {
            // Has folder structure - use the top folder name
            folderName = pathParts[0];
        } else {
            // Single file upload - the file IS the "folder" for display purposes
            // Use the filename (with extension) as the folder name
            folderName = firstPath || 'upload';
        }
        
        console.log(`📤 Upload complete: ${req.files.length} files in folder "${folderName}" by ${uploadedBy}`);
        
        // Store metadata for this folder/file
        uploadsMetadata[folderName] = {
            uploadedBy: uploadedBy,
            uploadedAt: new Date().toISOString(),
            fileCount: req.files.length
        };
        saveUploadsMetadata(uploadsMetadata);
        
        // Broadcast to ALL connected clients (including sender) about new shared folder
        broadcastAll({
            type: 'folder_shared',
            folder: {
                name: folderName,
                fileCount: req.files.length,
                files: uploadedFiles,
                uploadedBy: uploadedBy,
                sharedAt: new Date().toISOString()
            }
        });
        
        res.json({
            success: true,
            message: `Uploaded ${req.files.length} files`,
            folder: folderName,
            fileCount: req.files.length,
            files: uploadedFiles
        });
    } catch (error) {
        console.error('❌ Upload error:', error);
        res.status(500).json({ 
            success: false, 
            error: error.message 
        });
    }
});

// API endpoint to list shared folders (and single files)
app.get('/api/shared-folders', (req, res) => {
    try {
        if (!fs.existsSync(UPLOADS_DIR)) {
            return res.json({ success: true, folders: [] });
        }
        
        const items = fs.readdirSync(UPLOADS_DIR, { withFileTypes: true });
        const folders = [];
        
        for (const item of items) {
            // Skip metadata file
            if (item.name === '.metadata.json') continue;
            
            // Get metadata for this item
            const itemMeta = uploadsMetadata[item.name] || {};
            
            if (item.isDirectory()) {
                // It's a folder - get all files recursively
                const folderPath = path.join(UPLOADS_DIR, item.name);
                const files = getFilesRecursively(folderPath, folderPath);
                folders.push({
                    name: item.name,
                    fileCount: files.length,
                    files: files,
                    isFolder: true,
                    uploadedBy: itemMeta.uploadedBy,
                    uploadedAt: itemMeta.uploadedAt
                });
            } else {
                // It's a single file - treat it as a "folder" with one file
                const filePath = path.join(UPLOADS_DIR, item.name);
                const stats = fs.statSync(filePath);
                folders.push({
                    name: item.name,
                    fileCount: 1,
                    files: [{
                        name: item.name,
                        path: item.name,
                        size: stats.size
                    }],
                    isFolder: false,
                    uploadedBy: itemMeta.uploadedBy,
                    uploadedAt: itemMeta.uploadedAt
                });
            }
        }
        
        res.json({ success: true, folders: folders });
    } catch (error) {
        res.json({ success: false, error: error.message });
    }
});

// API endpoint to get uploaded file content or directory listing
app.get('/api/uploads/files', (req, res) => {
    try {
        const requestedPath = req.query.path || '';
        
        // Security: Prevent path traversal attacks
        const normalizedPath = path.normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, '');
        const fullPath = path.join(UPLOADS_DIR, normalizedPath);
        
        // Ensure the resolved path is within UPLOADS_DIR
        if (!fullPath.startsWith(UPLOADS_DIR)) {
            return res.status(403).json({ 
                success: false, 
                error: 'Access denied: Invalid path' 
            });
        }
        
        // Check if path exists
        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({ 
                success: false, 
                error: 'File or directory not found' 
            });
        }
        
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
            // Return directory listing
            const items = fs.readdirSync(fullPath, { withFileTypes: true });
            const listing = items.map(item => ({
                name: item.name,
                isDirectory: item.isDirectory(),
                path: path.join(normalizedPath, item.name).replace(/\\/g, '/'),
                size: item.isFile() ? fs.statSync(path.join(fullPath, item.name)).size : null
            }));
            
            res.json({ 
                success: true, 
                type: 'directory',
                path: normalizedPath,
                items: listing 
            });
        } else {
            // Return file content
            const ext = path.extname(fullPath).toLowerCase();
            const textExtensions = ['.txt', '.md', '.gls', '.glo', '.py', '.cpp', '.java', '.js', '.html', '.css', '.json', '.xml', '.csv'];
            
            if (textExtensions.includes(ext)) {
                // Text file - return content as string with encoding detection
                const content = readFileWithEncoding(fullPath);
                res.json({ 
                    success: true, 
                    type: 'file',
                    path: normalizedPath,
                    name: path.basename(fullPath),
                    content: content,
                    size: stats.size
                });
            } else if (ext === '.pdf') {
                // PDF - return base64 or direct download
                res.json({
                    success: true,
                    type: 'binary',
                    path: normalizedPath,
                    name: path.basename(fullPath),
                    mimeType: 'application/pdf',
                    downloadUrl: `/api/uploads/download?path=${encodeURIComponent(normalizedPath)}`
                });
            } else {
                // Other binary files - offer download
                res.json({
                    success: true,
                    type: 'binary',
                    path: normalizedPath,
                    name: path.basename(fullPath),
                    size: stats.size,
                    downloadUrl: `/api/uploads/download?path=${encodeURIComponent(normalizedPath)}`
                });
            }
        }
    } catch (error) {
        console.error('Error serving uploaded file:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API endpoint to download uploaded files
app.get('/api/uploads/download', (req, res) => {
    try {
        const requestedPath = req.query.path || '';
        
        // Security: Prevent path traversal attacks
        const normalizedPath = path.normalize(requestedPath).replace(/^(\.\.(\/|\\|$))+/, '');
        const fullPath = path.join(UPLOADS_DIR, normalizedPath);
        
        // Ensure the resolved path is within UPLOADS_DIR
        if (!fullPath.startsWith(UPLOADS_DIR)) {
            return res.status(403).send('Access denied');
        }
        
        if (!fs.existsSync(fullPath) || fs.statSync(fullPath).isDirectory()) {
            return res.status(404).send('File not found');
        }
        
        res.download(fullPath);
    } catch (error) {
        res.status(500).send('Download failed');
    }
});

// API endpoint to download entire folder as ZIP (or single file)
app.get('/api/download-folder', (req, res) => {
    try {
        const folderName = req.query.folderName || '';
        
        if (!folderName) {
            return res.status(400).json({ success: false, error: 'Folder name required' });
        }
        
        // Security: Prevent path traversal attacks
        const normalizedName = path.normalize(folderName).replace(/^(\.\.(\\|\/|$))+/, '');
        const fullPath = path.join(UPLOADS_DIR, normalizedName);
        
        // Ensure the resolved path is within UPLOADS_DIR
        if (!fullPath.startsWith(UPLOADS_DIR)) {
            return res.status(403).json({ success: false, error: 'Access denied' });
        }
        
        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({ success: false, error: 'Folder not found' });
        }
        
        const stats = fs.statSync(fullPath);
        
        // Check if it's a file (single file upload) or directory
        if (stats.isFile()) {
            // Single file - just download it directly
            console.log(`📥 Single file download: ${normalizedName}`);
            res.download(fullPath);
            return;
        }
        
        // It's a directory - create ZIP
        // Set response headers for ZIP download
        res.setHeader('Content-Type', 'application/zip');
        res.setHeader('Content-Disposition', `attachment; filename="${normalizedName}.zip"`);
        
        // Create archive and pipe to response
        const archive = archiver('zip', { zlib: { level: 9 } });
        
        archive.on('error', (err) => {
            console.error('Archive error:', err);
            res.status(500).end();
        });
        
        archive.pipe(res);
        
        // Add the folder contents to the archive
        archive.directory(fullPath, normalizedName);
        
        // Finalize the archive
        archive.finalize();
        
        console.log(`📦 ZIP download: ${normalizedName}`);
    } catch (error) {
        console.error('ZIP download error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// API endpoint to delete a shared file/folder
app.delete('/api/shared-files/:name', (req, res) => {
    try {
        const fileName = req.params.name;
        
        if (!fileName) {
            return res.status(400).json({ success: false, error: 'File name required' });
        }
        
        // Security: Prevent path traversal attacks
        const normalizedName = path.normalize(fileName).replace(/^(\.\.(\\|\/|$))+/, '');
        const fullPath = path.join(UPLOADS_DIR, normalizedName);
        
        // Ensure the resolved path is within UPLOADS_DIR
        if (!fullPath.startsWith(UPLOADS_DIR)) {
            return res.status(403).json({ success: false, error: 'Access denied' });
        }
        
        if (!fs.existsSync(fullPath)) {
            return res.status(404).json({ success: false, error: 'File not found' });
        }
        
        const stats = fs.statSync(fullPath);
        
        if (stats.isDirectory()) {
            // Delete directory recursively
            fs.rmSync(fullPath, { recursive: true, force: true });
        } else {
            // Delete single file
            fs.unlinkSync(fullPath);
        }
        
        console.log(`🗑️ Deleted: ${normalizedName}`);
        
        // Broadcast deletion to all clients
        broadcastAll({
            type: 'file_deleted',
            fileName: normalizedName
        });
        
        res.json({ success: true, message: `Deleted: ${normalizedName}` });
    } catch (error) {
        console.error('Delete error:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// Helper: Get all files in a directory recursively
function getFilesRecursively(dir, baseDir) {
    const files = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        if (item.isDirectory()) {
            files.push(...getFilesRecursively(fullPath, baseDir));
        } else {
            files.push({
                name: item.name,
                path: path.relative(baseDir, fullPath),
                size: fs.statSync(fullPath).size
            });
        }
    }
    
    return files;
}

// Store current state
let currentState = {
    code: '',
    cursorPosition: 0,
    lastUpdatedBy: null,
    connectedUsers: [],
    language: 'glossa' // Current language (synced from teacher)
};

// ============================================
// ACCESS CONTROL - Waiting Room / Lobby System
// ============================================

// Generate a random 4-digit access code
function generateAccessCode() {
    return String(Math.floor(1000 + Math.random() * 9000));
}

// Access control state
let accessControl = {
    accessCode: generateAccessCode(),
    publicAccess: false  // false = code required, true = free enter
};

// Track authenticated students (socket -> true/false)
const authenticatedClients = new WeakMap();

// Teacher info file path
const TEACHER_INFO_FILE = path.join(__dirname, 'teacher-info.json');

// Default teacher info
const DEFAULT_TEACHER_INFO = {
    name: "Sotiris Mpalatsias",
    email: "sotiris.mp@gmail.com",
    phone: "6983733346",
    discord: "sotiris01"
};

// Load teacher info from file or use defaults
function loadTeacherInfo() {
    try {
        if (fs.existsSync(TEACHER_INFO_FILE)) {
            return JSON.parse(fs.readFileSync(TEACHER_INFO_FILE, 'utf8'));
        }
    } catch (e) {
        console.error('Error loading teacher info:', e);
    }
    return DEFAULT_TEACHER_INFO;
}

// Save teacher info to file
function saveTeacherInfo(info) {
    try {
        fs.writeFileSync(TEACHER_INFO_FILE, JSON.stringify(info, null, 2), 'utf8');
        console.log('💾 Teacher info saved');
        return true;
    } catch (e) {
        console.error('Error saving teacher info:', e);
        return false;
    }
}

console.log(`🔐 Access Code: ${accessControl.accessCode}`);
console.log(`🚪 Public Access: ${accessControl.publicAccess ? 'ON' : 'OFF'}`);

// Teacher password from environment variable (optional)
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || null;

// Connected clients
const clients = new Map();
let clientIdCounter = 0;

// Known student identities for reconnection persistence
// Maps stored studentId -> { name, lastSeen }
const knownStudents = new Map();

// Broadcast to all clients except sender
function broadcast(message, excludeClient = null) {
    const data = JSON.stringify(message);
    wss.clients.forEach(client => {
        if (client !== excludeClient && client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

// Broadcast to ALL clients including sender
function broadcastAll(message) {
    const data = JSON.stringify(message);
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

wss.on('connection', (ws, req) => {
    const urlParams = new URLSearchParams(req.url.split('?')[1] || '');
    const isTeacher = urlParams.get('role') === 'teacher';
    const providedPassword = urlParams.get('password');
    const providedStudentId = urlParams.get('studentId');
    
    // Validate teacher password if set
    if (isTeacher && TEACHER_PASSWORD) {
        if (providedPassword !== TEACHER_PASSWORD) {
            console.log(`❌ Teacher connection attempt with wrong password`);
            ws.send(JSON.stringify({
                type: 'auth_error',
                message: 'Wrong password'
            }));
            ws.close(4001, 'Invalid password');
            return;
        }
    }
    
    // Determine client ID and name
    let clientId;
    let clientName;
    
    if (isTeacher) {
        // Teacher always gets a new ID (only one teacher expected)
        clientId = ++clientIdCounter;
        clientName = 'Teacher';
    } else {
        // Student: check for reconnection with saved ID
        if (providedStudentId && knownStudents.has(providedStudentId)) {
            // Reconnecting student - reuse their identity
            const knownStudent = knownStudents.get(providedStudentId);
            clientId = providedStudentId;
            clientName = knownStudent.name;
            console.log(`🔄 Student reconnecting with saved ID: ${clientId} (${clientName})`);
        } else {
            // New student - assign new ID
            clientId = ++clientIdCounter;
            clientName = `Student ${clientId}`;
            // Save to known students for future reconnection
            knownStudents.set(String(clientId), { name: clientName, lastSeen: Date.now() });
            console.log(`🆕 New student assigned ID: ${clientId} (${clientName})`);
        }
    }
    
    const clientInfo = {
        id: clientId,
        role: isTeacher ? 'teacher' : 'student',
        name: clientName,
        ws: ws
    };
    
    clients.set(ws, clientInfo);
    currentState.connectedUsers.push({
        id: clientId,
        role: clientInfo.role,
        name: clientInfo.name
    });
    
    console.log(`✅ ${clientInfo.name} connected (${clientInfo.role})`);
    if (isTeacher && TEACHER_PASSWORD) {
        console.log(`🔐 Teacher authenticated with password`);
    }
    
    // ACCESS CONTROL: Check if student needs to authenticate
    if (!isTeacher && !accessControl.publicAccess) {
        // Student needs to enter code - mark as not authenticated
        authenticatedClients.set(ws, false);
        
        // Send auth_required instead of init
        ws.send(JSON.stringify({
            type: 'auth_required',
            yourId: clientId,
            yourRole: clientInfo.role
        }));
        
        console.log(`🚪 ${clientInfo.name} in waiting room (code required)`);
    } else {
        // Teacher or public access - grant immediate access
        authenticatedClients.set(ws, true);
        
        // Send current state to new client
        ws.send(JSON.stringify({
            type: 'init',
            state: {
                code: currentState.code,
                cursorPosition: currentState.cursorPosition,
                language: currentState.language
            },
            yourId: clientId,
            yourRole: clientInfo.role,
            connectedUsers: currentState.connectedUsers
        }));
        
        // Notify others about new connection
        broadcast({
            type: 'user_joined',
            user: { id: clientId, role: clientInfo.role, name: clientInfo.name },
            connectedUsers: currentState.connectedUsers
        }, ws);
    }
    
    ws.on('message', (data) => {
        try {
            const message = JSON.parse(data);
            const client = clients.get(ws);
            
            switch (message.type) {
                case 'code_update':
                    // Update server state
                    currentState.code = message.code;
                    currentState.lastUpdatedBy = client.id;
                    
                    // Save state to file (debounced)
                    saveState();
                    
                    // Broadcast to others (include cursor position)
                    broadcast({
                        type: 'code_update',
                        code: message.code,
                        updatedBy: client.id,
                        updaterName: client.name,
                        updaterRole: client.role,
                        cursorRow: message.cursorRow,
                        cursorCol: message.cursorCol,
                        userId: client.id
                    }, ws);
                    break;
                    
                case 'cursor_update':
                    // Broadcast cursor position (to teacher only)
                    wss.clients.forEach(targetWs => {
                        const targetClient = clients.get(targetWs);
                        if (targetWs !== ws && 
                            targetWs.readyState === WebSocket.OPEN && 
                            targetClient && targetClient.role === 'teacher') {
                            targetWs.send(JSON.stringify({
                                type: 'cursor_update',
                                userId: client.id,
                                userName: client.name,
                                userRole: client.role,
                                position: message.position,
                                line: message.line,
                                column: message.column
                            }));
                        }
                    });
                    break;
                    
                case 'highlight_selection':
                    // LEGACY: Broadcast highlight selection to all others
                    broadcast({
                        type: 'highlight_selection',
                        userId: client.id,
                        userName: client.name,
                        userRole: client.role,
                        startRow: message.startRow,
                        startCol: message.startCol,
                        endRow: message.endRow,
                        endCol: message.endCol,
                        text: message.text,
                        active: message.active
                    }, ws);
                    break;
                    
                case 'highlight_tiles':
                    // NEW: Broadcast tile-based highlights to all others
                    broadcast({
                        type: 'highlight_tiles',
                        userId: client.id,
                        userName: client.name,
                        userRole: client.role,
                        tiles: message.tiles,
                        active: message.active
                    }, ws);
                    break;
                    
                case 'laser_point':
                    // Broadcast laser pointer position to all others
                    broadcast({
                        type: 'laser_point',
                        userId: client.id,
                        userName: client.name,
                        userRole: client.role,
                        row: message.row,
                        col: message.col,
                        active: message.active
                    }, ws);
                    break;
                
                case 'pdf_load':
                    // Teacher loaded a PDF - broadcast to all students
                    broadcast({
                        type: 'pdf_load',
                        userId: client.id,
                        userName: client.name,
                        pdfData: message.pdfData,
                        fileName: message.fileName
                    }, ws);
                    break;
                
                case 'pdf_sync':
                    // Teacher syncs PDF state (page, scroll, zoom)
                    broadcast({
                        type: 'pdf_sync',
                        userId: client.id,
                        page: message.page,
                        scrollTop: message.scrollTop,
                        scrollLeft: message.scrollLeft,
                        scale: message.scale
                    }, ws);
                    break;
                
                case 'pdf_laser':
                    // Teacher's laser pointer on PDF
                    broadcast({
                        type: 'pdf_laser',
                        userId: client.id,
                        x: message.x,
                        y: message.y,
                        active: message.active
                    }, ws);
                    break;
                
                case 'mode_change':
                    // Teacher changed mode (code/pdf/markdown)
                    broadcast({
                        type: 'mode_change',
                        userId: client.id,
                        mode: message.mode
                    }, ws);
                    break;
                
                case 'markdown_content':
                    // Teacher loaded a Markdown file - broadcast to all students
                    broadcast({
                        type: 'markdown_content',
                        userId: client.id,
                        userName: client.name,
                        content: message.content,
                        fileName: message.fileName
                    }, ws);
                    break;
                
                case 'markdown_state':
                    // Teacher syncs Markdown state (scroll, zoom)
                    broadcast({
                        type: 'markdown_state',
                        userId: client.id,
                        scrollTop: message.scrollTop,
                        scrollHeight: message.scrollHeight,
                        scale: message.scale
                    }, ws);
                    break;
                
                case 'markdown_laser':
                    // Teacher's laser pointer on Markdown
                    broadcast({
                        type: 'markdown_laser',
                        userId: client.id,
                        x: message.x,
                        y: message.y,
                        active: message.active
                    }, ws);
                    break;
                    
                case 'template_loaded':
                    // Broadcast when a template is loaded
                    currentState.code = message.code;
                    broadcast({
                        type: 'template_loaded',
                        code: message.code,
                        templateName: message.templateName,
                        loadedBy: client.name
                    }, ws);
                    break;
                
                case 'language_change':
                    // Teacher changed language - sync to all students
                    if (client.role === 'teacher') {
                        currentState.language = message.language;
                        console.log(`🌐 Language changed to: ${message.language}`);
                        broadcast({
                            type: 'language_change',
                            language: message.language,
                            changedBy: client.name
                        }, ws);
                    }
                    break;
                
                case 'hand_raise':
                    // Student raised/lowered hand - notify teacher
                    console.log(`${message.raised ? '✋' : '👇'} ${client.name} ${message.raised ? 'raised' : 'lowered'} hand`);
                    wss.clients.forEach(targetWs => {
                        const targetClient = clients.get(targetWs);
                        if (targetWs.readyState === WebSocket.OPEN && 
                            targetClient && targetClient.role === 'teacher') {
                            targetWs.send(JSON.stringify({
                                type: 'hand_raise',
                                userId: client.id,
                                userName: client.name,
                                raised: message.raised
                            }));
                        }
                    });
                    break;
                    
                case 'reaction':
                    // Student sent a reaction - notify teacher
                    console.log(`${message.emoji} ${client.name} reacted: ${message.reaction}`);
                    wss.clients.forEach(targetWs => {
                        const targetClient = clients.get(targetWs);
                        if (targetWs.readyState === WebSocket.OPEN && 
                            targetClient && targetClient.role === 'teacher') {
                            targetWs.send(JSON.stringify({
                                type: 'reaction',
                                userId: client.id,
                                userName: client.name,
                                reaction: message.reaction,
                                emoji: message.emoji
                            }));
                        }
                    });
                    break;
                    
                case 'clear_reactions':
                    // Teacher cleared reactions - notify all students
                    if (client.role === 'teacher') {
                        broadcast({
                            type: 'clear_reactions'
                        }, ws);
                    }
                    break;
                
                case 'window_focus':
                    // Student focus state changed - notify teacher
                    if (client.role === 'student') {
                        wss.clients.forEach(targetWs => {
                            const targetClient = clients.get(targetWs);
                            if (targetWs.readyState === WebSocket.OPEN && 
                                targetClient && targetClient.role === 'teacher') {
                                targetWs.send(JSON.stringify({
                                    type: 'window_focus',
                                    userId: client.id,
                                    userName: client.name,
                                    focused: message.focused
                                }));
                            }
                        });
                    }
                    break;
                
                case 'breakpoints':
                    // Teacher set breakpoints - notify all students
                    if (client.role === 'teacher') {
                        broadcast({
                            type: 'breakpoints',
                            rows: message.rows
                        }, ws);
                    }
                    break;
                
                case 'scroll_to_line':
                    // Teacher sends scroll-to-line command - broadcast to all students
                    if (client.role === 'teacher') {
                        broadcast({
                            type: 'scroll_to_line',
                            lineNumber: message.lineNumber
                        }, ws);
                        console.log(`📍 Teacher scrolled students to line ${message.lineNumber}`);
                    }
                    break;
                
                // ============================================
                // ACCESS CONTROL MESSAGES
                // ============================================
                
                case 'verify_code':
                    // Student trying to verify access code
                    if (client.role === 'student') {
                        const providedCode = message.code;
                        
                        if (providedCode === accessControl.accessCode || accessControl.publicAccess) {
                            // Code is correct - grant access
                            authenticatedClients.set(ws, true);
                            console.log(`✅ ${client.name} entered correct code - access granted`);
                            
                            // Send init with current state
                            ws.send(JSON.stringify({
                                type: 'init',
                                state: {
                                    code: currentState.code,
                                    cursorPosition: currentState.cursorPosition,
                                    language: currentState.language
                                },
                                yourId: client.id,
                                yourRole: client.role,
                                connectedUsers: currentState.connectedUsers
                            }));
                            
                            // Notify others about new connection
                            broadcast({
                                type: 'user_joined',
                                user: { id: client.id, role: client.role, name: client.name },
                                connectedUsers: currentState.connectedUsers
                            }, ws);
                        } else {
                            // Wrong code
                            console.log(`❌ ${client.name} entered wrong code: ${providedCode}`);
                            ws.send(JSON.stringify({
                                type: 'auth_failed',
                                message: 'Invalid code. Please try again.'
                            }));
                        }
                    }
                    break;
                
                case 'admin_get_code':
                    // Teacher requesting current access code
                    if (client.role === 'teacher') {
                        ws.send(JSON.stringify({
                            type: 'admin_code',
                            accessCode: accessControl.accessCode,
                            publicAccess: accessControl.publicAccess
                        }));
                    }
                    break;
                
                case 'admin_set_public':
                    // Teacher toggling public access mode
                    if (client.role === 'teacher') {
                        accessControl.publicAccess = !!message.enabled;
                        console.log(`🚪 Public Access: ${accessControl.publicAccess ? 'ON' : 'OFF'}`);
                        
                        // Confirm to teacher
                        ws.send(JSON.stringify({
                            type: 'admin_code',
                            accessCode: accessControl.accessCode,
                            publicAccess: accessControl.publicAccess
                        }));
                        
                        // If public access just turned on, admit all waiting students
                        if (accessControl.publicAccess) {
                            wss.clients.forEach(studentWs => {
                                const studentClient = clients.get(studentWs);
                                if (studentClient && 
                                    studentClient.role === 'student' && 
                                    !authenticatedClients.get(studentWs)) {
                                    
                                    authenticatedClients.set(studentWs, true);
                                    console.log(`✅ ${studentClient.name} auto-admitted (public access)`);
                                    
                                    // Send init to student
                                    studentWs.send(JSON.stringify({
                                        type: 'init',
                                        state: {
                                            code: currentState.code,
                                            cursorPosition: currentState.cursorPosition,
                                            language: currentState.language
                                        },
                                        yourId: studentClient.id,
                                        yourRole: studentClient.role,
                                        connectedUsers: currentState.connectedUsers
                                    }));
                                    
                                    // Notify others
                                    broadcast({
                                        type: 'user_joined',
                                        user: { id: studentClient.id, role: studentClient.role, name: studentClient.name },
                                        connectedUsers: currentState.connectedUsers
                                    }, studentWs);
                                }
                            });
                        }
                    }
                    break;
                
                case 'admin_cycle_code':
                    // Teacher requesting a new access code
                    if (client.role === 'teacher') {
                        accessControl.accessCode = generateAccessCode();
                        console.log(`🔐 New Access Code: ${accessControl.accessCode}`);
                        
                        ws.send(JSON.stringify({
                            type: 'admin_code',
                            accessCode: accessControl.accessCode,
                            publicAccess: accessControl.publicAccess
                        }));
                    }
                    break;
                    
                case 'ping':
                    ws.send(JSON.stringify({ type: 'pong' }));
                    break;
            }
        } catch (error) {
            console.error('Error parsing message:', error);
        }
    });
    
    ws.on('close', () => {
        const client = clients.get(ws);
        if (client) {
            console.log(`❌ ${client.name} disconnected`);
            
            // Remove from connected users
            currentState.connectedUsers = currentState.connectedUsers.filter(u => u.id !== client.id);
            
            // Notify others
            broadcast({
                type: 'user_left',
                userId: client.id,
                userName: client.name,
                connectedUsers: currentState.connectedUsers
            });
            
            clients.delete(ws);
        }
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

// API endpoint for status
app.get('/api/status', (req, res) => {
    res.json({
        status: 'running',
        connectedUsers: currentState.connectedUsers.length,
        users: currentState.connectedUsers.map(u => ({ name: u.name, role: u.role }))
    });
});

// File system for content (language-specific files)
// Note: glossa_programs moved to content/glossa in Phase 2.95
const CONTENT_DIR = path.join(__dirname, 'content');

// API endpoint to list folder contents
app.get('/api/files', (req, res) => {
    const subPath = req.query.path || '';
    const fullPath = path.join(CONTENT_DIR, subPath);
    
    // Debug logging
    console.log('📁 /api/files request:', {
        receivedPath: req.query.path,
        subPath: subPath,
        fullPath: fullPath,
        contentDir: CONTENT_DIR
    });
    
    // Security check - prevent directory traversal
    const securityCheck = fullPath.startsWith(CONTENT_DIR);
    console.log('🔒 Security check:', securityCheck);
    
    if (!securityCheck) {
        return res.status(403).json({ error: `Access denied: path outside content directory` });
    }
    
    try {
        if (!fs.existsSync(fullPath)) {
            console.log('❌ Path not found:', fullPath);
            return res.status(404).json({ error: `Path not found: ${subPath || 'root'}` });
        }
        
        const items = fs.readdirSync(fullPath, { withFileTypes: true });
        const result = items
            .filter(item => item.isDirectory() || item.name.endsWith('.gls') || item.name.endsWith('.glo') || item.name.endsWith('.py') || item.name.endsWith('.cpp') || item.name.endsWith('.h') || item.name.endsWith('.java') || item.name.endsWith('.md') || item.name.endsWith('.pdf'))
            .map(item => ({
                name: item.name,
                type: item.isDirectory() ? 'folder' : 'file',
                path: subPath ? `${subPath}/${item.name}` : item.name
            }))
            .sort((a, b) => {
                // Folders first, then files
                if (a.type !== b.type) return a.type === 'folder' ? -1 : 1;
                return a.name.localeCompare(b.name, 'el');
            });
        
        console.log('✅ Found', result.length, 'items in', subPath || 'root');
        
        res.json({
            currentPath: subPath,
            items: result
        });
    } catch (error) {
        console.error('❌ Error reading directory:', error);
        res.status(500).json({ error: `Failed to read directory: ${error.message}` });
    }
});

// API endpoint to read file content
app.get('/api/files/content', (req, res) => {
    const filePath = req.query.path || '';
    const fullPath = path.join(CONTENT_DIR, filePath);
    
    // Debug logging
    console.log('📄 /api/files/content request:', {
        receivedPath: req.query.path,
        filePath: filePath,
        fullPath: fullPath,
        contentDir: CONTENT_DIR
    });
    
    // Security check - prevent directory traversal
    const securityCheck = fullPath.startsWith(CONTENT_DIR);
    console.log('🔒 Security check:', securityCheck);
    
    if (!securityCheck) {
        return res.status(403).json({ error: `Access denied: path outside content directory` });
    }
    
    // Allow .gls, .glo, .py, .cpp, .h, .hpp, .java, .md files
    const allowedExtensions = ['.gls', '.glo', '.py', '.cpp', '.h', '.hpp', '.c', '.java', '.md'];
    const fileExt = path.extname(filePath).toLowerCase();
    if (!allowedExtensions.includes(fileExt)) {
        return res.status(400).json({ error: `File type not allowed: ${filePath}. Allowed: ${allowedExtensions.join(', ')}` });
    }
    
    try {
        if (!fs.existsSync(fullPath)) {
            console.log('❌ File not found:', fullPath);
            return res.status(404).json({ error: `File not found: ${filePath}` });
        }
        
        const content = readFileWithEncoding(fullPath);
        console.log('✅ Loaded file:', filePath);
        
        res.json({
            path: filePath,
            name: path.basename(filePath),
            content: content
        });
    } catch (error) {
        console.error('❌ Error reading file:', error);
        res.status(500).json({ error: `Failed to read file: ${error.message}` });
    }
});

const PORT = process.env.PORT || 3000;

// Load saved session state before starting server
loadSavedState();

server.listen(PORT, () => {
    console.log('');
    console.log('╔════════════════════════════════════════════════════════════╗');
    console.log('║        🎓 Code Board - Collaborative Server                ║');
    console.log('╠════════════════════════════════════════════════════════════╣');
    console.log(`║  🌐 Local:    http://localhost:${PORT}                        ║`);
    console.log('║                                                            ║');
    console.log('║  📝 To share with students:                               ║');
    console.log('║     Run: ngrok http 3000                                   ║');
    console.log('║     Then share the generated link                          ║');
    console.log('║                                                            ║');
    console.log('║  👨‍🏫 Teacher: http://localhost:3000?role=teacher         ║');
    console.log('║  👨‍🎓 Student: Use the ngrok link                        ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    if (currentState.code) {
        console.log('📂 Previous session restored - code ready');
    }
    console.log('');
});
