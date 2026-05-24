/**
 * AEPP Board - Digital Teaching Board for ΓΛΩΣΣΑ
 * Main Application Entry Point
 * 
 * This is the main bootstrap file that initializes all components.
 * Most logic has been extracted to specialized modules:
 * - src/ui/Toolbar.js - Copy, clear, font size
 * - src/ui/StatusBar.js - Line/char counts, ngrok stats
 * - src/ui/LayoutManager.js - Mode switching, sidebar resize, PDF viewer
 * - src/components/UIManager.js - Theme, shortcuts, toasts
 * - src/components/FileBrowser.js - File navigation
 * - src/components/GridEditor.js - Code editor
 */

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
    codeEditor: document.getElementById('code-editor'),
    highlightedCode: document.getElementById('highlighted-code'),
    gridEditorContainer: document.getElementById('grid-editor-container'),
    lineNumbers: document.getElementById('line-numbers'),
    toast: document.getElementById('toast'),
    toastMessage: document.getElementById('toast-message')
};

// Grid Editor instance (global for collaboration access)
let gridEditor = null;

// ============================================
// APPLICATION STATE
// ============================================

const state = {
    savedCursorPos: 0 // Saved cursor position for keyword insertion
};

// ============================================
// SMART KEYWORD INSERTION
// ============================================

/**
 * Inserts a keyword at the smart position
 * Uses SmartInserter module for position calculations
 */
function smartInsertKeyword(keyword, smartType) {
    const code = gridEditor ? gridEditor.getValue() : elements.codeEditor.value;
    
    let cursorPos;
    if (gridEditor) {
        const cursor = gridEditor.getCursor();
        cursorPos = SmartInserter.rowColToLinear(code, cursor.row, cursor.col);
    } else {
        cursorPos = state.savedCursorPos;
    }
    
    const snippets = typeof LanguageManager !== 'undefined' ? LanguageManager.getSnippets() : null;
    const SMART_INSERTION = snippets?.SMART_INSERTION || window.SMART_INSERTION || {};
    const rule = smartType ? SMART_INSERTION[smartType] : null;
    
    const result = SmartInserter.calculateInsertion(code, cursorPos, keyword, rule, {
        promptFn: (message, defaultValue) => prompt(message, defaultValue)
    });
    
    if (result.cancelled) {
        if (gridEditor) gridEditor.focus();
        else elements.codeEditor.focus();
        return;
    }
    
    if (gridEditor) {
        gridEditor.setValue(result.newCode);
        const pos = SmartInserter.linearToRowCol(result.newCode, result.newCursorPos);
        gridEditor.setCursor(pos.row, pos.col);
        gridEditor.focus();
    } else {
        elements.codeEditor.value = result.newCode;
        elements.codeEditor.selectionStart = elements.codeEditor.selectionEnd = result.newCursorPos;
        updateEditor();
        elements.codeEditor.focus();
    }
    
    showToast(`➕ ${keyword.trim()}`, 'success');
}

/**
 * Sets up keyword button click handlers
 */
function initKeywordButtons() {
    document.querySelectorAll('.keyword-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            smartInsertKeyword(btn.dataset.keyword, btn.dataset.smart || null);
        });
    });
}

/**
 * Generates the keyword sidebar from the current language's SIDEBAR_CONFIG
 */
function generateKeywordSidebar() {
    const container = document.getElementById('keywords-content');
    if (!container) return;
    
    // Get SIDEBAR_CONFIG from the current language module
    let sidebarConfig = null;
    const currentLang = typeof LanguageManager !== 'undefined' ? LanguageManager.getCurrentLanguage() : 'unknown';
    
    if (typeof LanguageManager !== 'undefined') {
        sidebarConfig = LanguageManager.getSidebarConfig();
        console.log('📋 generateKeywordSidebar: Got config for', currentLang, ':', 
            sidebarConfig ? `${sidebarConfig.length} groups` : 'null');
    }
    
    // Fallback to global SIDEBAR_CONFIG for backward compatibility
    if (!sidebarConfig && typeof SIDEBAR_CONFIG !== 'undefined') {
        console.warn('📋 generateKeywordSidebar: Falling back to global SIDEBAR_CONFIG');
        sidebarConfig = SIDEBAR_CONFIG;
    }
    
    if (!sidebarConfig) {
        console.error('SIDEBAR_CONFIG not available for current language');
        container.innerHTML = '<div class="error">Error loading keywords</div>';
        return;
    }
    
    // Log first group title to identify which config is being used
    console.log('📋 First group title:', sidebarConfig[0]?.title);
    
    let html = '';
    sidebarConfig.forEach(group => {
        html += `<div class="keyword-group" data-group="${group.id}">`;
        html += `<div class="group-title">${group.title}</div>`;
        html += '<div class="keyword-buttons">';
        group.keywords.forEach(kw => {
            const className = kw.className ? `keyword-btn ${kw.className}` : 'keyword-btn';
            const smartAttr = kw.smart ? ` data-smart="${kw.smart}"` : '';
            const titleAttr = kw.desc ? ` title="${kw.desc}"` : '';
            html += `<button class="${className}" data-keyword="${kw.insert}"${smartAttr}${titleAttr}>${kw.text}</button>`;
        });
        html += '</div></div>';
    });
    
    container.innerHTML = html;
    initKeywordButtons();
    console.log('📋 Keyword sidebar generated for:', currentLang);
}

// ============================================
// EDITOR UPDATE (Legacy support)
// ============================================

function updateEditor() {
    if (gridEditor) {
        StatusBar.updateLineNumbers();
        return;
    }
    
    const code = elements.codeEditor.value;
    if (elements.highlightedCode) {
        const highlightFn = typeof LanguageManager !== 'undefined' 
            ? LanguageManager.highlight.bind(LanguageManager)
            : highlightSyntax;
        elements.highlightedCode.innerHTML = highlightFn(code);
    }
    StatusBar.updateLineNumbers();
}

function syncScroll() {
    requestAnimationFrame(() => {
        elements.highlightedCode.scrollTop = elements.codeEditor.scrollTop;
        elements.highlightedCode.scrollLeft = elements.codeEditor.scrollLeft;
        elements.lineNumbers.scrollTop = elements.codeEditor.scrollTop;
    });
}

function saveCursorPosition() {
    state.savedCursorPos = elements.codeEditor.selectionStart;
}

// ============================================
// DROPDOWN MANAGEMENT
// ============================================
// Template / exercise / algorithm dropdowns were removed from the toolbar;
// content is now loaded through the file browser instead.


// ============================================
// LEGACY EDITOR KEYDOWN
// ============================================

function handleKeydown(e) {
    if (e.key === 'Tab') {
        e.preventDefault();
        const start = elements.codeEditor.selectionStart;
        const end = elements.codeEditor.selectionEnd;
        const spaces = '   ';
        elements.codeEditor.value = 
            elements.codeEditor.value.substring(0, start) + spaces + elements.codeEditor.value.substring(end);
        elements.codeEditor.selectionStart = elements.codeEditor.selectionEnd = start + spaces.length;
        updateEditor();
    }
}

// ============================================
// LANGUAGE-DEPENDENT UI
// ============================================

function initLanguageDependentUI() {
    const content = typeof LanguageManager !== 'undefined' ? LanguageManager.getContent() : null;
    
    // Set initial code if editor is empty
    const currentCode = gridEditor ? gridEditor.getValue() : elements.codeEditor.value;
    if (!currentCode || currentCode.trim() === '') {
        const initialCode = content?.initialCode || 'Αλγόριθμος Παράδειγμα\n\nΔιάβασε χ\n\nΕμφάνισε χ\n\nΤέλος Παράδειγμα';
        if (gridEditor) gridEditor.setValue(initialCode);
        else { elements.codeEditor.value = initialCode; updateEditor(); }
    }
    
    generateKeywordSidebar();
    console.log('📋 Language-dependent UI initialized');
}

// ============================================
// INITIALIZATION
// ============================================

let initialized = false;

function init() {
    if (initialized) return;
    initialized = true;
    
    // Determine role
    const urlParams = new URLSearchParams(window.location.search);
    const isTeacher = urlParams.get('role') === 'teacher';
    document.body.classList.add(isTeacher ? 'is-teacher' : 'is-student');

    // Phase 6.A — first-run onboarding wizard (teacher only, fire-and-forget).
    if (isTeacher && typeof OnboardingWizard !== 'undefined') {
        OnboardingWizard.checkAndMaybeRun().catch(err =>
            console.warn('Onboarding check failed:', err)
        );
    }

    // 1. Initialize UI Manager (theme, shortcuts, toasts)
    if (typeof UIManager !== 'undefined') {
        UIManager.init({ isTeacher });
    }
    
    // 2. Initialize GridEditor
    if (elements.gridEditorContainer && typeof GridEditor !== 'undefined') {
        console.log('🎮 Initializing Grid Editor...');
        gridEditor = new GridEditor(elements.gridEditorContainer, {
            fontSize: 18,
            lineHeight: 1.6,
            tabSize: 3
        });
        gridEditor.setValue('');

        // Phase 4 — install editor extensions (AutoPairs, AutoIndent, etc.).
        try {
            if (typeof AutoPairs       !== 'undefined') gridEditor.use(AutoPairs);
            if (typeof AutoIndent      !== 'undefined') gridEditor.use(AutoIndent);
            if (typeof BlockComment    !== 'undefined') gridEditor.use(BlockComment);
            if (typeof SmartPaste      !== 'undefined') gridEditor.use(SmartPaste);
            if (typeof BracketMatch    !== 'undefined') gridEditor.use(BracketMatch);
            if (typeof FindReplace     !== 'undefined') gridEditor.use(FindReplace);
            if (typeof GutterDragSelect!== 'undefined') gridEditor.use(GutterDragSelect);
            // MultiCursor scaffold: teacher only.
            if (isTeacher && typeof MultiCursor !== 'undefined') gridEditor.use(MultiCursor);
            // Restore preferred tab size if user has set one.
            const savedTab = parseInt(localStorage.getItem('aepp-tab-size'), 10);
            if (Number.isFinite(savedTab) && savedTab > 0) gridEditor.setTabSize(savedTab);
        } catch (err) {
            console.warn('⚠️ Phase 4 editor extensions failed to install:', err);
        }

        // Expose globally for FileBrowser and other modules
        window.gridEditor = gridEditor;
        
        // Set up GridEditor callbacks for collaboration
        gridEditor.onContentChange = (code) => {
            // Update line numbers immediately (UI feedback)
            StatusBar.updateLineNumbers();
            
            // Send every change immediately to all connected clients
            if (typeof Collaboration !== 'undefined' && Collaboration.connected && !Collaboration.isUpdatingFromRemote) {
                Collaboration.sendCodeUpdate(code);
            }
        };
        
        gridEditor.onSelectionChange = (tiles) => {
            // Update StatusBar with selection count
            if (typeof StatusBar !== 'undefined') {
                const selectionLen = gridEditor.getSelectionLength ? gridEditor.getSelectionLength() : 0;
                StatusBar.updateCursor(gridEditor.cursor.row + 1, gridEditor.cursor.col + 1, selectionLen);
            }
            
            // Send highlight tiles to all (teacher ↔ student)
            if (typeof Collaboration !== 'undefined' && Collaboration.connected) {
                Collaboration.sendHighlightTiles(tiles);
            }
        };
        
        gridEditor.onCursorChange = (cursor) => {
            // Update StatusBar with cursor position (VS Code style: 1-based line numbers)
            if (typeof StatusBar !== 'undefined') {
                const selectionLen = gridEditor.getSelectionLength ? gridEditor.getSelectionLength() : 0;
                StatusBar.updateCursor(cursor.row + 1, cursor.col + 1, selectionLen);
            }
            
            if (typeof Collaboration !== 'undefined' && Collaboration.connected && Collaboration.myRole === 'student') {
                Collaboration.sendCursorUpdate(0, cursor.row + 1, cursor.col + 1);
            }
        };
        
        gridEditor.onLaserPoint = (position) => {
            if (typeof Collaboration !== 'undefined' && Collaboration.connected && Collaboration.myRole === 'teacher') {
                Collaboration.sendLaserPoint(position);
            }
        };
        
        gridEditor.onBreakpointChange = (rows) => {
            if (typeof Collaboration !== 'undefined' && Collaboration.connected && Collaboration.myRole === 'teacher') {
                Collaboration.sendBreakpoints(rows);
            }
        };
        
        gridEditor.onScrollToLine = (lineNumber) => {
            if (typeof Collaboration !== 'undefined' && Collaboration.connected && Collaboration.myRole === 'teacher') {
                Collaboration.sendScrollToLine(lineNumber);
                showToast(`📍 Μετάβαση στη γραμμή ${lineNumber}`, 'info');
            }
        };
        
        console.log('✅ Grid Editor initialized!');
    } else {
        console.log('📝 Using legacy textarea editor');
        if (elements.highlightedCode) elements.highlightedCode.innerHTML = '';
        elements.codeEditor.value = '';
    }
    
    // 3. Initialize UI components
    if (typeof Toolbar !== 'undefined') {
        Toolbar.init({
            gridEditor,
            legacyEditor: elements.codeEditor,
            onEditorUpdate: updateEditor
        });
    }
    
    if (typeof StatusBar !== 'undefined') {
        StatusBar.init({
            gridEditor,
            legacyEditor: elements.codeEditor,
            isTeacher
        });
    }
    
    if (typeof LayoutManager !== 'undefined') {
        LayoutManager.init({ gridEditor, isTeacher });
    }
    
    // Initialize LobbyManager (waiting room for students)
    if (typeof LobbyManager !== 'undefined') {
        LobbyManager.init();
    }
    
    // 4. Set up legacy editor events
    if (!gridEditor && elements.codeEditor) {
        elements.codeEditor.addEventListener('input', updateEditor);
        elements.codeEditor.addEventListener('scroll', syncScroll);
        elements.codeEditor.addEventListener('keydown', handleKeydown);
        elements.codeEditor.addEventListener('click', saveCursorPosition);
        elements.codeEditor.addEventListener('keyup', saveCursorPosition);
        elements.codeEditor.addEventListener('input', saveCursorPosition);
        elements.codeEditor.addEventListener('focus', saveCursorPosition);
    }
    
    // 5. Dropdown event listeners removed — dropdowns no longer exist in the toolbar.
    
    // 6. Initialize FileBrowser (must be before language init so setRoot works)
    if (typeof FileBrowser !== 'undefined') {
        FileBrowser.init();
    }
    
    // 6.5 Initialize SharedFilesBrowser
    if (typeof SharedFilesBrowser !== 'undefined') {
        SharedFilesBrowser.init();
    }
    
    // 6.6 Initialize LocalFileBrowser (Teacher only - open local files)
    if (typeof LocalFileBrowser !== 'undefined') {
        LocalFileBrowser.init({
            onFileLoad: (content, filename) => {
                // Load content into the GridEditor
                if (gridEditor) {
                    gridEditor.setValue(content);
                    console.log(`📂 Loaded local file: ${filename}`);
                    
                    // Trigger collaboration sync if connected
                    if (typeof Collaboration !== 'undefined' && Collaboration.connected) {
                        Collaboration.sendCodeUpdate(content);
                    }
                }
            }
        });
    }
    
    // 7. Initialize LanguageManager and language-dependent UI
    if (typeof LanguageManager !== 'undefined') {
        LanguageManager.setLanguage('glossa').then(() => {
            const currentLang = LanguageManager.getCurrentLanguage();
            console.log('🌐 Language initialized:', currentLang);
            initLanguageDependentUI();
            
            // Set initial StatusBar language
            if (typeof StatusBar !== 'undefined') {
                StatusBar.setLanguage(currentLang);
            }
            
            // Set FileBrowser root to current language content folder
            if (typeof FileBrowser !== 'undefined') {
                FileBrowser.setRoot(currentLang);
            }
        }).catch(err => {
            console.warn('Language initialization warning:', err);
            initLanguageDependentUI();
        });
        
        const languageSelector = document.getElementById('language-selector');
        if (languageSelector) {
            // Phase 5.4 — populate from LanguageRegistry instead of hard-coded <option>s.
            if (typeof LanguageRegistry !== 'undefined') {
                LanguageRegistry.ready.then(() => {
                    const langs = LanguageRegistry.list();
                    if (!langs.length) return;
                    const currentVal = languageSelector.value;
                    languageSelector.innerHTML = langs.map(l =>
                        `<option value="${l.id}">${l.label}</option>`
                    ).join('');
                    // Preserve current selection if still available.
                    if (langs.some(l => l.id === currentVal)) languageSelector.value = currentVal;
                });
            }
            languageSelector.addEventListener('change', async (e) => {
                // User manually changed language - reset the flag so initial code loads
                if (typeof Collaboration !== 'undefined') {
                    Collaboration.contentLoadedFromServer = false;
                }
                await LanguageManager.setLanguage(e.target.value);
            });
        }
        
        window.addEventListener('languageChanged', (e) => {
            const newLang = e.detail.language;
            const isRemoteSync = e.detail.isRemoteSync || false;
            console.log('🔄 Language changed to:', newLang, isRemoteSync ? '(remote sync)' : '(local)');
            
            // Update StatusBar language badge
            if (typeof StatusBar !== 'undefined') {
                StatusBar.setLanguage(newLang);
            }
            
            // Update selector if needed
            const selector = document.getElementById('language-selector');
            if (selector && selector.value !== newLang) {
                selector.value = newLang;
            }

            // Update language icon (Phase 5.4)
            const iconEl = document.getElementById('language-selector-icon');
            if (iconEl && typeof LanguageRegistry !== 'undefined') {
                const plugin = LanguageRegistry.get(newLang);
                if (plugin && plugin.icon) {
                    iconEl.src = 'public/assets/icons/' + plugin.icon;
                    iconEl.alt = plugin.label || newLang;
                }
            }
            
            // Sync language to students (teacher only)
            if (typeof Collaboration !== 'undefined' && Collaboration.myRole === 'teacher') {
                Collaboration.sendLanguageChange(newLang);
            }
            
            // Update FileBrowser root to new language's content folder
            if (typeof FileBrowser !== 'undefined') {
                FileBrowser.setRoot(newLang);
            }
            
            // Clear editor and set new language's initial code
            // BUT ONLY if:
            // 1. This is NOT a remote sync (we already have the code from server)
            // 2. Collaboration hasn't already loaded content from server
            const collaborationLoadedContent = typeof Collaboration !== 'undefined' && Collaboration.contentLoadedFromServer;
            
            if (!isRemoteSync && !collaborationLoadedContent) {
                const content = LanguageManager.getContent();
                const initialCode = content?.initialCode || '';
                if (gridEditor) {
                    gridEditor.setValue(initialCode);
                    gridEditor.render();
                } else {
                    elements.codeEditor.value = initialCode;
                    updateEditor();
                }
            } else {
                // Remote sync or already loaded from server - just re-render for syntax highlighting
                if (gridEditor) {
                    gridEditor.render();
                }
                if (collaborationLoadedContent) {
                    console.log('📡 Skipping initial code - content already loaded from server');
                }
            }
            
            // Regenerate keyword sidebar for new language
            generateKeywordSidebar();
            
            console.log('✅ UI refreshed for language:', newLang);
        });
    } else {
        initLanguageDependentUI();
    }
    
    // 8. Focus editor
    if (gridEditor) gridEditor.focus();
    else elements.codeEditor.focus();
    
    console.log('🎓 Code Board initialized successfully!');
}

// Start the app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
