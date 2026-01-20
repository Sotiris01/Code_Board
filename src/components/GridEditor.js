/**
 * AEPP Board - Grid-Based Code Editor
 * Κάθε χαρακτήρας είναι ένα "tile" στο grid
 * Επιτρέπει tile-based selection για ακριβή συγχρονισμό teacher-student
 */

class GridEditor {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            fontSize: options.fontSize || 18,
            lineHeight: options.lineHeight || 1.6,
            tabSize: options.tabSize || 3,
            ...options
        };
        
        // Editor state
        this.lines = ['']; // Array of strings, one per line
        this.cursor = { row: 0, col: 0 }; // 0-indexed cursor position
        this.selection = new Set(); // Set of "row,col" strings for selected tiles
        this.selectionAnchor = null; // Starting point of selection
        
        // Remote highlights (from teacher)
        this.remoteHighlights = new Set(); // Set of "row,col" for teacher highlights
        this.remoteCursor = null; // { row, col } for teacher's cursor
        
        // Laser pointer (Ctrl+hover)
        this.laserPoint = null; // { row, col } for laser pointer position
        this.remoteLaserPoint = null; // { row, col } from remote teacher
        this.isCtrlHeld = false;
        
        // Breakpoint markers (important lines)
        this.breakpoints = new Set(); // Set of row numbers with breakpoints
        this.remoteBreakpoints = new Set(); // Breakpoints from teacher
        
        // DOM elements
        this.gridElement = null;
        this.hiddenInput = null;
        this.cursorElement = null;
        
        // Character dimensions (calculated after render)
        this.charWidth = 0;
        this.charHeight = 0;
        
        // Event callbacks
        this.onContentChange = null;
        this.onSelectionChange = null;
        this.onCursorChange = null;
        this.onLaserPoint = null;
        this.onBreakpointChange = null;
        this.onScrollToLine = null; // Callback for Ctrl+dblclick to sync students
        
        // Undo/Redo stacks
        this.undoStack = [];
        this.redoStack = [];
        this.maxUndoLevels = 50;
        this._lastUndoSaveTime = 0;
        this._undoDebounceMs = 300; // Minimum ms between undo saves (groups rapid typing)
        
        // Drag selection state
        this.isDragging = false;
        
        // Initialize
        this._init();
    }
    
    // ============================================
    // INITIALIZATION
    // ============================================
    
    _init() {
        // Create DOM structure
        this._createDOM();
        
        // Calculate character dimensions
        this._calculateCharDimensions();
        
        // Bind events
        this._bindEvents();
        
        // Initial render
        this.render();
    }
    
    _createDOM() {
        // Clear container
        this.container.innerHTML = '';
        this.container.classList.add('grid-editor-container');
        
        // Create grid element
        this.gridElement = document.createElement('div');
        this.gridElement.className = 'grid-editor-grid';
        this.gridElement.setAttribute('tabindex', '0');
        
        // Create hidden input for capturing keyboard
        this.hiddenInput = document.createElement('textarea');
        this.hiddenInput.className = 'grid-editor-hidden-input';
        this.hiddenInput.setAttribute('autocomplete', 'off');
        this.hiddenInput.setAttribute('autocorrect', 'off');
        this.hiddenInput.setAttribute('autocapitalize', 'off');
        this.hiddenInput.setAttribute('spellcheck', 'false');
        
        // Create cursor element
        this.cursorElement = document.createElement('div');
        this.cursorElement.className = 'grid-editor-cursor';
        
        // Create laser pointer element
        this.laserElement = document.createElement('div');
        this.laserElement.className = 'grid-editor-laser-pointer';
        this.laserElement.style.display = 'none';
        
        // Append to container
        this.container.appendChild(this.gridElement);
        this.container.appendChild(this.hiddenInput);
        this.gridElement.appendChild(this.cursorElement);
        this.gridElement.appendChild(this.laserElement);
    }
    
    _calculateCharDimensions() {
        // Create a test span to measure character size
        const testSpan = document.createElement('span');
        testSpan.className = 'grid-editor-cell';
        testSpan.style.position = 'absolute';
        testSpan.style.visibility = 'hidden';
        testSpan.style.fontFamily = "'JetBrains Mono', 'Consolas', 'Courier New', monospace";
        testSpan.style.fontSize = `${this.options.fontSize}px`;
        testSpan.style.lineHeight = `${this.options.lineHeight}`;
        testSpan.style.display = 'inline-block';
        testSpan.textContent = 'M'; // Use M for width (widest char in most fonts)
        document.body.appendChild(testSpan);
        
        // Force layout calculation
        const rect = testSpan.getBoundingClientRect();
        this.charWidth = rect.width || this.options.fontSize * 0.6;
        this.charHeight = rect.height || this.options.fontSize * this.options.lineHeight;
        
        document.body.removeChild(testSpan);
        
        // Fallback values if still 0
        if (this.charWidth === 0) this.charWidth = this.options.fontSize * 0.6;
        if (this.charHeight === 0) this.charHeight = this.options.fontSize * this.options.lineHeight;
        

        
        // Update CSS variables
        this.container.style.setProperty('--char-width', `${this.charWidth}px`);
        this.container.style.setProperty('--char-height', `${this.charHeight}px`);
        this.container.style.setProperty('--editor-font-size', `${this.options.fontSize}px`);
    }
    
    // ============================================
    // EVENT BINDING
    // ============================================
    
    _bindEvents() {
        // Click on grid - focus hidden input and handle position
        this.gridElement.addEventListener('mousedown', (e) => {
            // Don't intercept scrollbar clicks
            const rect = this.gridElement.getBoundingClientRect();
            const isOnVerticalScrollbar = e.clientX > rect.right - 17;
            const isOnHorizontalScrollbar = e.clientY > rect.bottom - 17;
            
            if (isOnVerticalScrollbar || isOnHorizontalScrollbar) {
                // Let the scrollbar handle it
                return;
            }
            
            e.preventDefault(); // Prevent default focus behavior
            this.hiddenInput.focus();
            this._handleMouseDown(e);
        });
        
        // Also handle click on hidden input (covers whole area)
        this.hiddenInput.addEventListener('mousedown', (e) => {
            // Get click position and convert to grid position
            const rect = this.container.getBoundingClientRect();
            const x = e.clientX - rect.left - 15; // 15px padding
            const y = e.clientY - rect.top - 15;
            
            const col = Math.max(0, Math.floor(x / this.charWidth));
            const row = Math.max(0, Math.floor(y / this.charHeight));
            
            // Clamp to valid range
            const clampedRow = Math.min(row, this.lines.length - 1);
            const clampedCol = Math.min(col, this.lines[clampedRow]?.length || 0);
            
            if (!e.shiftKey) {
                this.selection.clear();
                this.selectionAnchor = { row: clampedRow, col: clampedCol };
            }
            
            this.cursor = { row: clampedRow, col: clampedCol };
            this.isDragging = true;
            
            this.render();
            this._notifyCursorChange();
        });
        
        this.hiddenInput.addEventListener('mousemove', (e) => {
            if (this.isDragging) {
                const rect = this.container.getBoundingClientRect();
                const x = e.clientX - rect.left - 15;
                const y = e.clientY - rect.top - 15;
                
                const col = Math.max(0, Math.floor(x / this.charWidth));
                const row = Math.max(0, Math.floor(y / this.charHeight));
                
                const clampedRow = Math.min(row, this.lines.length - 1);
                const clampedCol = Math.min(col, this.lines[clampedRow]?.length || 0);
                
                const pos = { row: clampedRow, col: clampedCol };
                
                if (this.selectionAnchor) {
                    this._selectRange(this.selectionAnchor, pos);
                }
                this.cursor = pos;
                
                this.render();
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.isDragging = false;
        });
        
        // Scroll sync - sync line numbers when scrolling
        this.gridElement.addEventListener('scroll', () => {
            this._syncLineNumbersScroll();
        });
        
        // Keyboard events on hidden input
        // Use capture phase for Ctrl+Z to prevent browser's native undo
        this.hiddenInput.addEventListener('keydown', (e) => this._handleKeyDown(e), true);
        this.hiddenInput.addEventListener('input', (e) => this._handleInput(e));
        this.hiddenInput.addEventListener('paste', (e) => this._handlePaste(e));
        this.hiddenInput.addEventListener('copy', (e) => this._handleCopy(e));
        this.hiddenInput.addEventListener('cut', (e) => this._handleCut(e));
        
        // Capture Ctrl+Z/Y at document level to prevent browser's native undo on hiddenInput
        document.addEventListener('keydown', (e) => {
            // Only handle if our editor is focused
            if (document.activeElement === this.hiddenInput || 
                document.activeElement === this.gridElement) {
                const ctrl = e.ctrlKey || e.metaKey;
                if (ctrl && (e.key === 'z' || e.key === 'Z')) {
                    e.preventDefault();
                    e.stopPropagation();
                    if (e.shiftKey) {
                        this.redo();
                    } else {
                        this.undo();
                    }
                    return;
                }
                if (ctrl && (e.key === 'y' || e.key === 'Y')) {
                    e.preventDefault();
                    e.stopPropagation();
                    this.redo();
                    return;
                }
            }
        }, true); // capture phase
        
        // Track Ctrl key for laser pointer mode
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Control' && !this.isCtrlHeld) {
                this.isCtrlHeld = true;
            }
        });
        
        document.addEventListener('keyup', (e) => {
            if (e.key === 'Control') {
                this.isCtrlHeld = false;
                if (this.laserPoint) {
                    this.laserPoint = null;
                    this._updateLaserElement();
                    this._notifyLaserPoint(); // Notify to clear remote laser
                }
            }
        });
        
        // Also track mouse movement on the whole grid for laser pointer
        this.gridElement.addEventListener('mousemove', (e) => {
            if (this.isCtrlHeld && !this.isDragging) {
                this._handleMouseMove(e);
            } else if (this.isDragging) {
                this._handleMouseMove(e);
            }
        });
        
        // Clear laser when mouse leaves grid
        this.gridElement.addEventListener('mouseleave', () => {
            if (this.laserPoint) {
                this.laserPoint = null;
                this._updateLaserElement();
                this._notifyLaserPoint();
            }
        });
        
        // Keep hidden input focused when grid is focused
        this.gridElement.addEventListener('focus', () => {
            this.hiddenInput.focus();
        });
        
        // Ctrl+double-click to send scroll-to-line command (teacher only)
        this.gridElement.addEventListener('dblclick', (e) => {
            if (e.ctrlKey || e.metaKey) {
                const pos = this._getCellFromEvent(e);
                if (pos && this.onScrollToLine) {
                    // Send 1-indexed line number to match line numbers display
                    this.onScrollToLine(pos.row + 1);
                }
            }
        });
    }
    
    // ============================================
    // MOUSE HANDLING
    // ============================================
    
    _handleMouseDown(e) {
        const pos = this._getCellFromEvent(e);
        if (!pos) return;
        
        // If Ctrl is held, we're in laser mode - don't start selection
        if (e.ctrlKey || e.metaKey) {
            return;
        }
        
        this.isDragging = true;
        
        if (e.shiftKey && this.selectionAnchor) {
            // Extend selection
            this._selectRange(this.selectionAnchor, pos);
        } else {
            // Start new selection
            this.selection.clear();
            this.selectionAnchor = pos;
            this.cursor = { ...pos };
        }
        
        this.render();
        this._notifySelectionChange();
        this._notifyCursorChange();
    }
    
    _handleMouseMove(e) {
        // For laser mode, allow pointing beyond line length
        const pos = this._getCellFromEvent(e, this.isCtrlHeld && !this.isDragging);
        if (!pos) return;
        
        // Laser pointer mode (Ctrl held without dragging)
        if (this.isCtrlHeld && !this.isDragging) {
            this.laserPoint = pos;
            this._updateLaserElement();
            this._notifyLaserPoint();
            return;
        }
        
        // Normal selection drag
        if (!this.selectionAnchor) return;
        
        this._selectRange(this.selectionAnchor, pos);
        this.cursor = { ...pos };
        
        this.render();
        this._notifySelectionChange();
    }
    
    _getCellFromEvent(e, allowBeyondLine = false) {
        const rect = this.gridElement.getBoundingClientRect();
        // Account for the 15px padding in .grid-editor-grid
        const padding = 15;
        const x = e.clientX - rect.left + this.gridElement.scrollLeft - padding;
        const y = e.clientY - rect.top + this.gridElement.scrollTop - padding;
        
        const row = Math.floor(y / this.charHeight);
        const col = Math.floor(x / this.charWidth);
        
        // Clamp to valid range
        const maxRow = Math.max(0, this.lines.length - 1);
        const clampedRow = Math.max(0, Math.min(row, maxRow));
        
        // For laser pointer, allow pointing beyond line length
        let clampedCol;
        if (allowBeyondLine) {
            clampedCol = Math.max(0, col); // Just ensure non-negative
        } else {
            const maxCol = this.lines[clampedRow] ? this.lines[clampedRow].length : 0;
            clampedCol = Math.max(0, Math.min(col, maxCol));
        }
        
        return { row: clampedRow, col: clampedCol };
    }
    
    // ============================================
    // SELECTION MANAGEMENT
    // ============================================
    
    _selectRange(from, to) {
        this.selection.clear();
        
        const startRow = Math.min(from.row, to.row);
        const endRow = Math.max(from.row, to.row);
        const startCol = Math.min(from.col, to.col);
        const endCol = Math.max(from.col, to.col);
        
        // For multi-line selection, select full lines in between
        for (let row = startRow; row <= endRow; row++) {
            const line = this.lines[row] || '';
            let colStart, colEnd;
            
            if (startRow === endRow) {
                // Single line
                colStart = startCol;
                colEnd = endCol;
            } else if (row === startRow) {
                // First line - from startCol to end of line
                colStart = from.row <= to.row ? from.col : to.col;
                colEnd = line.length;
            } else if (row === endRow) {
                // Last line - from start to endCol
                colStart = 0;
                colEnd = from.row <= to.row ? to.col : from.col;
            } else {
                // Middle lines - full line
                colStart = 0;
                colEnd = line.length;
            }
            
            for (let col = colStart; col < colEnd; col++) {
                this.selection.add(`${row},${col}`);
            }
        }
    }
    
    _toggleCellSelection(row, col) {
        const key = `${row},${col}`;
        if (this.selection.has(key)) {
            this.selection.delete(key);
        } else {
            this.selection.add(key);
        }
    }
    
    clearSelection() {
        this.selection.clear();
        this.selectionAnchor = null;
        this.render();
    }
    
    getSelectedText() {
        if (this.selection.size === 0) return '';
        
        // Convert selection to sorted array
        const cells = Array.from(this.selection).map(key => {
            const [row, col] = key.split(',').map(Number);
            return { row, col };
        }).sort((a, b) => a.row - b.row || a.col - b.col);
        
        let text = '';
        let lastRow = cells[0].row;
        
        for (const cell of cells) {
            if (cell.row > lastRow) {
                text += '\n'.repeat(cell.row - lastRow);
                lastRow = cell.row;
            }
            const char = this.lines[cell.row]?.[cell.col] || '';
            text += char;
        }
        
        return text;
    }
    
    getSelectionTiles() {
        // Return array of {row, col} for collaboration sync
        return Array.from(this.selection).map(key => {
            const [row, col] = key.split(',').map(Number);
            return { row, col };
        });
    }
    
    // ============================================
    // KEYBOARD HANDLING
    // ============================================
    
    _handleKeyDown(e) {
        const key = e.key;
        const ctrl = e.ctrlKey || e.metaKey;
        const shift = e.shiftKey;
        
        // Navigation keys
        if (key === 'ArrowLeft') {
            e.preventDefault();
            this._moveCursor(0, -1, shift);
        } else if (key === 'ArrowRight') {
            e.preventDefault();
            this._moveCursor(0, 1, shift);
        } else if (key === 'ArrowUp') {
            e.preventDefault();
            this._moveCursor(-1, 0, shift);
        } else if (key === 'ArrowDown') {
            e.preventDefault();
            this._moveCursor(1, 0, shift);
        } else if (key === 'Home') {
            e.preventDefault();
            if (ctrl) {
                this._moveCursorTo(0, 0, shift);
            } else {
                this._moveCursorTo(this.cursor.row, 0, shift);
            }
        } else if (key === 'End') {
            e.preventDefault();
            if (ctrl) {
                const lastRow = this.lines.length - 1;
                this._moveCursorTo(lastRow, this.lines[lastRow].length, shift);
            } else {
                this._moveCursorTo(this.cursor.row, this.lines[this.cursor.row].length, shift);
            }
        } else if (key === 'PageUp') {
            e.preventDefault();
            const visibleRows = Math.floor(this.gridElement.clientHeight / this.charHeight);
            this._moveCursor(-visibleRows, 0, shift);
        } else if (key === 'PageDown') {
            e.preventDefault();
            const visibleRows = Math.floor(this.gridElement.clientHeight / this.charHeight);
            this._moveCursor(visibleRows, 0, shift);
        }
        // Edit keys
        else if (key === 'Backspace') {
            e.preventDefault();
            this._handleBackspace();
        } else if (key === 'Delete') {
            e.preventDefault();
            this._handleDelete();
        } else if (key === 'Enter') {
            e.preventDefault();
            this._handleEnter();
        } else if (key === 'Tab') {
            e.preventDefault();
            this._handleTab(shift);
        }
        // Undo/Redo
        else if (ctrl && key === 'z') {
            e.preventDefault();
            if (shift) {
                this.redo();
            } else {
                this.undo();
            }
        } else if (ctrl && key === 'y') {
            e.preventDefault();
            this.redo();
        }
        // Select all
        else if (ctrl && key === 'a') {
            e.preventDefault();
            this._selectAll();
        }
    }
    
    _handleInput(e) {
        // Get typed text from hidden input
        const text = this.hiddenInput.value;
        this.hiddenInput.value = '';
        
        if (!text) return;
        
        this._saveUndo();
        this._deleteSelection();
        this._insertText(text);
        this.render();
        this._notifyContentChange();
    }
    
    _handlePaste(e) {
        e.preventDefault();
        const text = e.clipboardData.getData('text/plain');
        if (!text) return;
        
        this._saveUndo();
        this._deleteSelection();
        this._insertText(text);
        this.render();
        this._notifyContentChange();
    }
    
    _handleCopy(e) {
        e.preventDefault();
        const text = this.getSelectedText();
        e.clipboardData.setData('text/plain', text);
    }
    
    _handleCut(e) {
        e.preventDefault();
        const text = this.getSelectedText();
        e.clipboardData.setData('text/plain', text);
        
        this._saveUndo();
        this._deleteSelection();
        this.render();
        this._notifyContentChange();
    }
    
    // ============================================
    // CURSOR MOVEMENT
    // ============================================
    
    _moveCursor(deltaRow, deltaCol, extendSelection) {
        let newRow = this.cursor.row + deltaRow;
        let newCol = this.cursor.col + deltaCol;
        
        // Handle moving left from start of line
        if (newCol < 0 && newRow > 0) {
            newRow--;
            newCol = this.lines[newRow].length;
        }
        // Handle moving right from end of line
        else if (newCol > this.lines[this.cursor.row].length && newRow < this.lines.length - 1) {
            newRow++;
            newCol = 0;
        }
        
        this._moveCursorTo(newRow, newCol, extendSelection);
    }
    
    _moveCursorTo(row, col, extendSelection) {
        // Clamp values
        row = Math.max(0, Math.min(row, this.lines.length - 1));
        col = Math.max(0, Math.min(col, this.lines[row].length));
        
        const oldPos = { ...this.cursor };
        this.cursor = { row, col };
        
        if (extendSelection) {
            if (!this.selectionAnchor) {
                this.selectionAnchor = oldPos;
            }
            this._selectRange(this.selectionAnchor, this.cursor);
        } else {
            this.selection.clear();
            this.selectionAnchor = null;
        }
        
        this.render();
        this._scrollToCursor();
        this._notifyCursorChange();
        this._notifySelectionChange();
    }
    
    _scrollToCursor() {
        const cursorX = this.cursor.col * this.charWidth;
        const cursorY = this.cursor.row * this.charHeight;
        
        const viewLeft = this.gridElement.scrollLeft;
        const viewRight = viewLeft + this.gridElement.clientWidth - 20;
        const viewTop = this.gridElement.scrollTop;
        const viewBottom = viewTop + this.gridElement.clientHeight - 20;
        
        if (cursorX < viewLeft) {
            this.gridElement.scrollLeft = cursorX;
        } else if (cursorX > viewRight) {
            this.gridElement.scrollLeft = cursorX - this.gridElement.clientWidth + 40;
        }
        
        if (cursorY < viewTop) {
            this.gridElement.scrollTop = cursorY;
        } else if (cursorY > viewBottom) {
            this.gridElement.scrollTop = cursorY - this.gridElement.clientHeight + 40;
        }
    }
    
    // ============================================
    // TEXT EDITING
    // ============================================
    
    _insertText(text) {
        const textLines = text.split('\n');
        const { row, col } = this.cursor;
        const currentLine = this.lines[row];
        
        if (textLines.length === 1) {
            // Single line insert
            this.lines[row] = currentLine.slice(0, col) + text + currentLine.slice(col);
            this.cursor.col = col + text.length;
        } else {
            // Multi-line insert
            const before = currentLine.slice(0, col);
            const after = currentLine.slice(col);
            
            // First line
            this.lines[row] = before + textLines[0];
            
            // Middle lines
            for (let i = 1; i < textLines.length - 1; i++) {
                this.lines.splice(row + i, 0, textLines[i]);
            }
            
            // Last line
            const lastLineIdx = row + textLines.length - 1;
            this.lines.splice(lastLineIdx, 0, textLines[textLines.length - 1] + after);
            
            // Update cursor
            this.cursor.row = lastLineIdx;
            this.cursor.col = textLines[textLines.length - 1].length;
        }
    }
    
    _deleteSelection() {
        if (this.selection.size === 0) return false;
        
        // Sort selection cells
        const cells = Array.from(this.selection).map(key => {
            const [row, col] = key.split(',').map(Number);
            return { row, col };
        }).sort((a, b) => b.row - a.row || b.col - a.col); // Reverse order
        
        // Group by row
        const rowGroups = new Map();
        for (const cell of cells) {
            if (!rowGroups.has(cell.row)) {
                rowGroups.set(cell.row, []);
            }
            rowGroups.get(cell.row).push(cell.col);
        }
        
        // Delete characters from each row (in reverse order)
        for (const [row, cols] of rowGroups) {
            cols.sort((a, b) => b - a); // Reverse order within row
            for (const col of cols) {
                if (col < this.lines[row].length) {
                    this.lines[row] = this.lines[row].slice(0, col) + this.lines[row].slice(col + 1);
                }
            }
        }
        
        // Set cursor to first selected position
        const firstCell = cells[cells.length - 1];
        this.cursor = { row: firstCell.row, col: firstCell.col };
        
        this.selection.clear();
        this.selectionAnchor = null;
        
        return true;
    }
    
    _handleBackspace() {
        this._saveUndo();
        
        if (this._deleteSelection()) {
            this.render();
            this._notifyContentChange();
            return;
        }
        
        const { row, col } = this.cursor;
        
        if (col > 0) {
            // Delete character before cursor
            this.lines[row] = this.lines[row].slice(0, col - 1) + this.lines[row].slice(col);
            this.cursor.col--;
        } else if (row > 0) {
            // Merge with previous line
            const prevLineLength = this.lines[row - 1].length;
            this.lines[row - 1] += this.lines[row];
            this.lines.splice(row, 1);
            this.cursor.row--;
            this.cursor.col = prevLineLength;
        }
        
        this.render();
        this._notifyContentChange();
    }
    
    _handleDelete() {
        this._saveUndo();
        
        if (this._deleteSelection()) {
            this.render();
            this._notifyContentChange();
            return;
        }
        
        const { row, col } = this.cursor;
        
        if (col < this.lines[row].length) {
            // Delete character at cursor
            this.lines[row] = this.lines[row].slice(0, col) + this.lines[row].slice(col + 1);
        } else if (row < this.lines.length - 1) {
            // Merge with next line
            this.lines[row] += this.lines[row + 1];
            this.lines.splice(row + 1, 1);
        }
        
        this.render();
        this._notifyContentChange();
    }
    
    _handleEnter() {
        this._saveUndo();
        this._deleteSelection();
        
        const { row, col } = this.cursor;
        const currentLine = this.lines[row];
        
        // Split line at cursor
        this.lines[row] = currentLine.slice(0, col);
        this.lines.splice(row + 1, 0, currentLine.slice(col));
        
        // Move cursor to start of new line
        this.cursor.row++;
        this.cursor.col = 0;
        
        this.render();
        this._notifyContentChange();
    }
    
    _handleTab(shift) {
        this._saveUndo();
        
        const spaces = ' '.repeat(this.options.tabSize);
        
        if (shift) {
            // Unindent - remove spaces from start of line
            const { row } = this.cursor;
            const line = this.lines[row];
            let removeCount = 0;
            
            for (let i = 0; i < this.options.tabSize && i < line.length; i++) {
                if (line[i] === ' ') removeCount++;
                else break;
            }
            
            if (removeCount > 0) {
                this.lines[row] = line.slice(removeCount);
                this.cursor.col = Math.max(0, this.cursor.col - removeCount);
            }
        } else {
            // Indent - insert spaces
            this._deleteSelection();
            this._insertText(spaces);
        }
        
        this.render();
        this._notifyContentChange();
    }
    
    _selectAll() {
        this.selection.clear();
        
        for (let row = 0; row < this.lines.length; row++) {
            for (let col = 0; col < this.lines[row].length; col++) {
                this.selection.add(`${row},${col}`);
            }
        }
        
        this.selectionAnchor = { row: 0, col: 0 };
        this.cursor = { row: this.lines.length - 1, col: this.lines[this.lines.length - 1].length };
        
        this.render();
        this._notifySelectionChange();
    }
    
    // ============================================
    // UNDO/REDO
    // ============================================
    
    _saveUndo() {
        const now = Date.now();
        const timeSinceLastSave = now - this._lastUndoSaveTime;
        
        // Debounce: Αν έχει περάσει αρκετός χρόνος από το τελευταίο save,
        // αποθηκεύουμε ΑΜΕΣΑ την τρέχουσα κατάσταση (ΠΡΙΝ γίνει η αλλαγή).
        // Αλλιώς ΑΓΝΟΟΥΜΕ - η προηγούμενη αποθηκευμένη κατάσταση είναι αρκετή.
        if (timeSinceLastSave >= this._undoDebounceMs) {
            this._doSaveUndo();
            this._lastUndoSaveTime = now;
        }
        // Αν δεν έχει περάσει αρκετός χρόνος, απλά αγνοούμε.
        // Η τελευταία αποθηκευμένη κατάσταση καλύπτει αυτές τις αλλαγές.
    }
    
    _doSaveUndo() {
        this._doSaveUndoState({
            lines: [...this.lines],
            cursor: { ...this.cursor },
            selection: new Set(this.selection)
        });
    }
    
    _doSaveUndoState(state) {
        this.undoStack.push(state);
        
        if (this.undoStack.length > this.maxUndoLevels) {
            this.undoStack.shift();
        }
        
        this.redoStack = [];
    }
    
    undo() {
        if (this.undoStack.length === 0) return;
        
        // Save current state for redo
        this.redoStack.push({
            lines: [...this.lines],
            cursor: { ...this.cursor },
            selection: new Set(this.selection)
        });
        
        const state = this.undoStack.pop();
        this.lines = state.lines;
        this.cursor = state.cursor;
        this.selection = state.selection;
        
        this.render();
        this._notifyContentChange();
    }
    
    redo() {
        if (this.redoStack.length === 0) return;
        
        // Save current state for undo
        this.undoStack.push({
            lines: [...this.lines],
            cursor: { ...this.cursor },
            selection: new Set(this.selection)
        });
        
        const state = this.redoStack.pop();
        this.lines = state.lines;
        this.cursor = state.cursor;
        this.selection = state.selection;
        
        this.render();
        this._notifyContentChange();
    }
    
    // ============================================
    // RENDERING
    // ============================================
    
    render() {
        // Get syntax highlighting data for all lines
        const highlightData = this._getSyntaxHighlighting();
        
        // Build grid HTML
        let html = '';
        
        for (let row = 0; row < this.lines.length; row++) {
            const line = this.lines[row];
            const lineHighlight = highlightData[row] || [];
            
            html += `<div class="grid-editor-row" data-row="${row}" style="height: ${this.charHeight}px;">`;
            
            // Render each character as a cell (including one extra for cursor at end)
            // Also extend if laser point or remote laser is beyond the line
            let lineLen = Math.max(line.length, 1); // At least 1 cell per line
            
            // Extend row if laser pointer is on this row and beyond current length
            if (this.laserPoint && this.laserPoint.row === row && this.laserPoint.col > lineLen) {
                lineLen = this.laserPoint.col;
            }
            if (this.remoteLaserPoint && this.remoteLaserPoint.row === row && this.remoteLaserPoint.col > lineLen) {
                lineLen = this.remoteLaserPoint.col;
            }
            
            for (let col = 0; col <= lineLen; col++) {
                const char = line[col] || '';
                const isSelected = this.selection.has(`${row},${col}`);
                const isRemoteHighlight = this.remoteHighlights.has(`${row},${col}`);
                const isCursor = row === this.cursor.row && col === this.cursor.col;
                const syntaxClass = lineHighlight[col] || '';
                
                let classes = 'grid-editor-cell';
                if (syntaxClass) classes += ` ${syntaxClass}`;
                if (isSelected) classes += ' selected';
                if (isRemoteHighlight) classes += ' remote-highlight';
                if (isCursor) classes += ' cursor-cell';
                
                // Escape HTML and handle special characters
                let displayChar;
                if (char === '' || char === undefined) {
                    displayChar = '\u00A0'; // Non-breaking space (better than &nbsp; for inline)
                } else if (char === '<') {
                    displayChar = '&lt;';
                } else if (char === '>') {
                    displayChar = '&gt;';
                } else if (char === '&') {
                    displayChar = '&amp;';
                } else if (char === ' ') {
                    displayChar = '\u00A0'; // Preserve spaces
                } else {
                    displayChar = char;
                }
                
                html += `<span class="${classes}" data-row="${row}" data-col="${col}" style="width: ${this.charWidth}px; height: ${this.charHeight}px; line-height: ${this.charHeight}px;">${displayChar}</span>`;
            }
            
            html += '</div>';
        }
        
        // Preserve scroll position
        const scrollTop = this.gridElement.scrollTop;
        const scrollLeft = this.gridElement.scrollLeft;

        this.gridElement.innerHTML = html;
        this.gridElement.appendChild(this.cursorElement);
        this.gridElement.appendChild(this.laserElement);
        
        // Add remote cursor if exists
        if (this.remoteCursor) {
            this._renderRemoteCursor();
        }
        
        // Update laser pointer position
        this._updateLaserElement();
        
        // Restore scroll
        this.gridElement.scrollTop = scrollTop;
        this.gridElement.scrollLeft = scrollLeft;
        
        // Update cursor element position
        this._updateCursorElement();
    }
    
    _renderRemoteCursor() {
        let remoteCursorEl = this.gridElement.querySelector('.grid-editor-remote-cursor');
        if (!remoteCursorEl) {
            remoteCursorEl = document.createElement('div');
            remoteCursorEl.className = 'grid-editor-remote-cursor';
            this.gridElement.appendChild(remoteCursorEl);
        }
        
        // Add padding offset (15px from grid padding) - same as local cursor
        const padding = 15;
        const x = this.remoteCursor.col * this.charWidth + padding;
        const y = this.remoteCursor.row * this.charHeight + padding;
        
        remoteCursorEl.style.left = `${x}px`;
        remoteCursorEl.style.top = `${y}px`;
        remoteCursorEl.style.height = `${this.charHeight}px`;
        remoteCursorEl.style.display = 'block';
    }
    
    // ============================================
    // SYNTAX HIGHLIGHTING
    // ============================================
    
    _getSyntaxHighlighting() {
        // Delegate to SyntaxHighlighter class
        const currentLang = typeof LanguageManager !== 'undefined' 
            ? LanguageManager.getCurrentLanguage() 
            : 'glossa';
        
        if (typeof SyntaxHighlighter !== 'undefined') {
            return SyntaxHighlighter.highlight(this.lines, currentLang);
        }
        
        // Fallback: return empty highlighting
        return this.lines.map(line => new Array(line.length).fill(''));
    }
    
    _updateCursorElement() {
        // Add padding offset (15px from grid padding)
        const padding = 15;
        const x = this.cursor.col * this.charWidth + padding;
        const y = this.cursor.row * this.charHeight + padding;
        
        this.cursorElement.style.left = `${x}px`;
        this.cursorElement.style.top = `${y}px`;
        this.cursorElement.style.height = `${this.charHeight}px`;
    }
    
    _updateLaserElement() {
        // Show laser for local or remote laser point
        const laserPoint = this.laserPoint || this.remoteLaserPoint;
        
        if (!laserPoint) {
            this.laserElement.style.display = 'none';
            return;
        }
        
        // Position at center of the cell
        const padding = 15;
        const x = laserPoint.col * this.charWidth + padding + (this.charWidth / 2);
        const y = laserPoint.row * this.charHeight + padding + (this.charHeight / 2);
        
        this.laserElement.style.left = `${x}px`;
        this.laserElement.style.top = `${y}px`;
        this.laserElement.style.display = 'block';
    }
    
    /**
     * Sync line numbers scroll with grid scroll
     */
    _syncLineNumbersScroll() {
        const lineNumbers = document.getElementById('line-numbers');
        if (lineNumbers) {
            lineNumbers.scrollTop = this.gridElement.scrollTop;
        }
    }
    
    _escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
    
    // ============================================
    // PUBLIC API
    // ============================================
    
    getValue() {
        return this.lines.join('\n');
    }
    
    setValue(text, options = {}) {
        // Save undo state IMMEDIATELY (no debounce) for setValue calls
        // This is important for remote updates so Ctrl+Z works correctly
        if (!options.skipUndo) {
            this._doSaveUndo(); // Direct save, bypasses debounce
        }
        
        this.lines = text.split('\n');
        
        // Only reset cursor for local changes, not remote
        if (!options.preserveCursor) {
            this.cursor = { row: 0, col: 0 };
        } else {
            // Clamp cursor to valid position
            this.cursor.row = Math.min(this.cursor.row, this.lines.length - 1);
            this.cursor.col = Math.min(this.cursor.col, this.lines[this.cursor.row]?.length || 0);
        }
        
        this.selection.clear();
        this.selectionAnchor = null;
        
        // Don't clear remote highlights - they're managed separately
        
        this.render();
        
        // Only notify content change for local edits, not remote updates
        if (!options.skipNotify) {
            this._notifyContentChange();
        }
    }
    
    getCursor() {
        return { ...this.cursor };
    }
    
    setCursor(row, col) {
        this._moveCursorTo(row, col, false);
    }
    
    getLineCount() {
        return this.lines.length;
    }
    
    getCharCount() {
        return this.lines.reduce((sum, line) => sum + line.length, 0) + (this.lines.length - 1);
    }
    
    focus() {
        this.hiddenInput.focus();
    }
    
    blur() {
        this.hiddenInput.blur();
    }
    
    // ============================================
    // REMOTE HIGHLIGHTS (Teacher → Student)
    // ============================================
    
    setRemoteHighlights(tiles) {
        this.remoteHighlights.clear();
        for (const tile of tiles) {
            this.remoteHighlights.add(`${tile.row},${tile.col}`);
        }
        this.render();
    }
    
    clearRemoteHighlights() {
        this.remoteHighlights.clear();
        this.render();
    }
    
    setRemoteCursor(row, col) {
        this.remoteCursor = { row, col };
        this.render();
    }
    
    clearRemoteCursor() {
        this.remoteCursor = null;
        this.render();
    }
    
    // ============================================
    // LASER POINTER (Teacher Ctrl+hover)
    // ============================================
    
    setRemoteLaserPoint(row, col) {
        if (row === null || col === null) {
            this.remoteLaserPoint = null;
        } else {
            this.remoteLaserPoint = { row, col };
        }
        this._updateLaserElement();
    }
    
    clearRemoteLaserPoint() {
        this.remoteLaserPoint = null;
        this._updateLaserElement();
    }
    
    // ============================================
    // FONT SIZE
    // ============================================
    
    setFontSize(size) {
        this.options.fontSize = size;
        this.container.style.setProperty('--editor-font-size', `${size}px`);
        this._calculateCharDimensions();
        this.render();
    }
    
    // ============================================
    // READ-ONLY MODE
    // ============================================
    
    setReadOnly(readOnly) {
        this.readOnly = readOnly;
        this.container.classList.toggle('read-only', readOnly);
        if (this.hiddenInput) {
            this.hiddenInput.disabled = readOnly;
        }
    }
    
    isReadOnly() {
        return this.readOnly || false;
    }
    
    // ============================================
    // CALLBACKS / NOTIFICATIONS
    // ============================================
    
    _notifyContentChange() {
        if (this.onContentChange) {
            this.onContentChange(this.getValue());
        }
    }
    
    _notifySelectionChange() {
        if (this.onSelectionChange) {
            this.onSelectionChange(this.getSelectionTiles());
        }
    }
    
    _notifyCursorChange() {
        if (this.onCursorChange) {
            this.onCursorChange(this.getCursor());
        }
    }
    
    _notifyLaserPoint() {
        if (this.onLaserPoint) {
            this.onLaserPoint(this.laserPoint);
        }
    }
    
    _notifyBreakpointChange() {
        if (this.onBreakpointChange) {
            this.onBreakpointChange(this.getBreakpoints());
        }
    }
    
    // ============================================
    // BREAKPOINT MARKERS
    // ============================================
    
    toggleBreakpoint(row) {
        if (this.breakpoints.has(row)) {
            this.breakpoints.delete(row);
        } else {
            this.breakpoints.add(row);
        }
        this._notifyBreakpointChange();
        // Update line numbers display
        if (typeof updateLineNumbers === 'function') {
            updateLineNumbers();
        }
    }
    
    setBreakpoint(row, enabled) {
        if (enabled) {
            this.breakpoints.add(row);
        } else {
            this.breakpoints.delete(row);
        }
    }
    
    hasBreakpoint(row) {
        return this.breakpoints.has(row) || this.remoteBreakpoints.has(row);
    }
    
    getBreakpoints() {
        return Array.from(this.breakpoints);
    }
    
    setRemoteBreakpoints(rows) {
        this.remoteBreakpoints.clear();
        for (const row of rows) {
            this.remoteBreakpoints.add(row);
        }
        // Update line numbers display
        if (typeof updateLineNumbers === 'function') {
            updateLineNumbers();
        }
    }
    
    clearBreakpoints() {
        this.breakpoints.clear();
        this._notifyBreakpointChange();
    }
    
    // ============================================
    // SCROLL TO LINE
    // ============================================
    
    /**
     * Scroll the editor so that the given line is visible (centered or near top)
     * @param {number} lineNumber - 1-indexed line number
     * @param {boolean} highlight - Whether to highlight the line temporarily
     */
    scrollToLine(lineNumber, highlight = false) {
        // Convert to 0-indexed row
        const row = lineNumber - 1;
        
        // Clamp to valid range
        const maxRow = Math.max(0, this.lines.length - 1);
        const targetRow = Math.max(0, Math.min(row, maxRow));
        
        // Calculate scroll position to center the line
        const lineY = targetRow * this.charHeight;
        const viewportHeight = this.gridElement.clientHeight;
        const scrollTop = Math.max(0, lineY - (viewportHeight / 3)); // Place line at 1/3 from top
        
        // Smooth scroll
        this.gridElement.scrollTo({
            top: scrollTop,
            behavior: 'smooth'
        });
        
        // Optionally highlight the line temporarily
        if (highlight) {
            this._highlightLineTemporarily(targetRow);
        }
    }
    
    /**
     * Highlight a line temporarily with animation
     * @param {number} row - 0-indexed row number
     */
    _highlightLineTemporarily(row) {
        // Add a temporary highlight element
        const highlightEl = document.createElement('div');
        highlightEl.className = 'grid-editor-scroll-highlight';
        highlightEl.style.top = `${row * this.charHeight + 15}px`; // 15px padding
        highlightEl.style.height = `${this.charHeight}px`;
        
        this.gridElement.appendChild(highlightEl);
        
        // Trigger animation
        requestAnimationFrame(() => {
            highlightEl.classList.add('active');
        });
        
        // Remove after animation
        setTimeout(() => {
            highlightEl.classList.add('fade-out');
            setTimeout(() => {
                highlightEl.remove();
            }, 500);
        }, 1500);
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GridEditor;
}
