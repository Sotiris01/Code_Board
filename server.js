/**
 * Code Board - Collaborative Server
 * WebSocket server για real-time συνεργασία μεταξύ καθηγητή και μαθητή
 */

const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

// Session file path for state persistence
const SESSION_FILE = path.join(__dirname, '.session-state.json');

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

// Store current state
let currentState = {
    code: '',
    cursorPosition: 0,
    lastUpdatedBy: null,
    connectedUsers: []
};

// Teacher password from environment variable (optional)
const TEACHER_PASSWORD = process.env.TEACHER_PASSWORD || null;

// Connected clients
const clients = new Map();
let clientIdCounter = 0;

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
    const clientId = ++clientIdCounter;
    const urlParams = new URLSearchParams(req.url.split('?')[1] || '');
    const isTeacher = urlParams.get('role') === 'teacher';
    const providedPassword = urlParams.get('password');
    
    // Validate teacher password if set
    if (isTeacher && TEACHER_PASSWORD) {
        if (providedPassword !== TEACHER_PASSWORD) {
            console.log(`❌ Απόπειρα σύνδεσης teacher με λάθος κωδικό`);
            ws.send(JSON.stringify({
                type: 'auth_error',
                message: 'Λάθος κωδικός πρόσβασης'
            }));
            ws.close(4001, 'Invalid password');
            return;
        }
    }
    
    const clientInfo = {
        id: clientId,
        role: isTeacher ? 'teacher' : 'student',
        name: isTeacher ? 'Καθηγητής' : `Μαθητής ${clientId}`,
        ws: ws
    };
    
    clients.set(ws, clientInfo);
    currentState.connectedUsers.push({
        id: clientId,
        role: clientInfo.role,
        name: clientInfo.name
    });
    
    console.log(`✅ ${clientInfo.name} συνδέθηκε (${clientInfo.role})`);
    if (isTeacher && TEACHER_PASSWORD) {
        console.log(`🔐 Teacher authenticated with password`);
    }
    
    // Send current state to new client
    ws.send(JSON.stringify({
        type: 'init',
        state: {
            code: currentState.code,
            cursorPosition: currentState.cursorPosition
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
                    // Broadcast cursor position (μόνο στον teacher)
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
                    // ΝΕΟ: Broadcast tile-based highlights to all others
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
                    // Teacher changed mode (code/pdf)
                    broadcast({
                        type: 'mode_change',
                        userId: client.id,
                        mode: message.mode
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
                    
                case 'hand_raise':
                    // Student raised/lowered hand - notify teacher
                    console.log(`${message.raised ? '✋' : '👇'} ${client.name} ${message.raised ? 'σήκωσε' : 'κατέβασε'} το χέρι`);
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
                    console.log(`${message.emoji} ${client.name} αντέδρασε: ${message.reaction}`);
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
                    
                case 'focus_mode':
                    // Teacher toggled focus mode - notify all students
                    if (client.role === 'teacher') {
                        console.log(`${message.enabled ? '🔒' : '🔓'} Focus mode ${message.enabled ? 'enabled' : 'disabled'}`);
                        broadcast({
                            type: 'focus_mode',
                            enabled: message.enabled
                        }, ws);
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
            console.log(`❌ ${client.name} αποσυνδέθηκε`);
            
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
            .filter(item => item.isDirectory() || item.name.endsWith('.gls'))
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
    
    // Only allow .gls files
    if (!filePath.endsWith('.gls')) {
        return res.status(400).json({ error: `Only .gls files are allowed: ${filePath}` });
    }
    
    try {
        if (!fs.existsSync(fullPath)) {
            console.log('❌ File not found:', fullPath);
            return res.status(404).json({ error: `File not found: ${filePath}` });
        }
        
        const content = fs.readFileSync(fullPath, 'utf-8');
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
    console.log('║  📝 Για να μοιραστείς με τον μαθητή:                       ║');
    console.log('║     Τρέξε: ngrok http 3000                                 ║');
    console.log('║     Και στείλε το link που θα δημιουργηθεί:                ║');
    console.log('║    https://terence-homophonic-arnulfo.ngrok-free.dev/ link ║');
    console.log('║                                                            ║');
    console.log('║  👨‍🏫 Καθηγητής: http://localhost:3000?role=teacher         ║');
    console.log('║  👨‍🎓 Μαθητής:   Χρησιμοποιεί το ngrok link                 ║');
    console.log('╚════════════════════════════════════════════════════════════╝');
    if (currentState.code) {
        console.log('📂 Previous session restored - code ready');
    }
    console.log('');
});
