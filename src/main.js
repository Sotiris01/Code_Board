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
    templateSelect: document.getElementById('template-select'),
    exerciseSelect: document.getElementById('exercise-select'),
    algorithmSelect: document.getElementById('algorithm-select'),
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

function populateDropdownFromData(select, items) {
    if (!select || !items) return;
    while (select.options.length > 1) select.remove(1);
    
    items.forEach(item => {
        if (!item.id || item.id === '') return;
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.label;
        if (item.type === 'separator') {
            option.disabled = true;
            option.style.fontWeight = item.style?.fontWeight || 'bold';
            option.style.color = item.style?.color || '#888';
        }
        select.appendChild(option);
    });
}

function populateExerciseDropdown() {
    const content = typeof LanguageManager !== 'undefined' ? LanguageManager.getContent() : null;
    if (content?.exercises) {
        populateDropdownFromData(elements.exerciseSelect, content.exercises.getDropdownData());
    }
}

function populateAlgorithmDropdown() {
    const content = typeof LanguageManager !== 'undefined' ? LanguageManager.getContent() : null;
    if (content?.algorithms) {
        populateDropdownFromData(elements.algorithmSelect, content.algorithms.getDropdownData());
    }
}

function loadTemplate() {
    const templateKey = elements.templateSelect.value;
    if (!templateKey || templateKey.startsWith('separator_')) {
        elements.templateSelect.value = '';
        return;
    }
    
    const content = typeof LanguageManager !== 'undefined' ? LanguageManager.getContent() : null;
    const template = content?.templates?.get(templateKey);
    
    if (!template) {
        showToast(`❌ Πρότυπο "${templateKey}" δεν βρέθηκε`, 'error');
        elements.templateSelect.value = '';
        return;
    }
    
    if (gridEditor) gridEditor.setValue(template);
    else { elements.codeEditor.value = template; updateEditor(); }
    
    if (typeof Collaboration !== 'undefined' && Collaboration.connected) {
        Collaboration.sendTemplateLoaded(template, elements.templateSelect.options[elements.templateSelect.selectedIndex].text);
    }
    
    showToast(`📁 Φορτώθηκε: ${elements.templateSelect.options[elements.templateSelect.selectedIndex].text}`, 'success');
    if (gridEditor) gridEditor.focus(); else elements.codeEditor.focus();
    elements.templateSelect.value = '';
}

function loadExercise() {
    const exerciseId = elements.exerciseSelect.value;
    if (!exerciseId || exerciseId.startsWith('separator_')) {
        elements.exerciseSelect.value = '';
        return;
    }
    
    const content = typeof LanguageManager !== 'undefined' ? LanguageManager.getContent() : null;
    const exercise = content?.exercises?.get(exerciseId);
    
    if (!exercise) {
        showToast(`❌ Άσκηση "${exerciseId}" δεν βρέθηκε`, 'error');
        elements.exerciseSelect.value = '';
        return;
    }
    
    if (gridEditor) gridEditor.setValue(exercise.code);
    else { elements.codeEditor.value = exercise.code; updateEditor(); }
    
    if (typeof Collaboration !== 'undefined' && Collaboration.connected) {
        Collaboration.sendTemplateLoaded(exercise.code, `🎯 ${exercise.name}`);
    }
    
    showToast(`🎯 Άσκηση: ${exercise.name}`, 'success');
    if (gridEditor) gridEditor.focus(); else elements.codeEditor.focus();
    elements.exerciseSelect.value = '';
}

function loadAlgorithm() {
    const algorithmId = elements.algorithmSelect.value;
    if (!algorithmId || algorithmId.startsWith('separator_')) {
        elements.algorithmSelect.value = '';
        return;
    }
    
    const content = typeof LanguageManager !== 'undefined' ? LanguageManager.getContent() : null;
    const result = content?.algorithms?.get(algorithmId);
    
    if (result?.code) {
        if (gridEditor) gridEditor.setValue(result.code);
        else { elements.codeEditor.value = result.code; updateEditor(); }
        
        if (typeof Collaboration !== 'undefined' && Collaboration.connected) {
            Collaboration.sendTemplateLoaded(result.code, result.name);
        }
        showToast(`📖 Αλγόριθμος: ${result.name}`, 'success');
        if (gridEditor) gridEditor.focus(); else elements.codeEditor.focus();
    } else {
        showToast(`❌ Αλγόριθμος δεν βρέθηκε`, 'error');
    }
    elements.algorithmSelect.value = '';
}

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
    populateExerciseDropdown();
    populateAlgorithmDropdown();
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
        
        // Expose globally for FileBrowser and other modules
        window.gridEditor = gridEditor;
        
        // Debounce timer for collaboration sync
        let syncDebounceTimer = null;
        const SYNC_DEBOUNCE_MS = 150;
        
        // Set up GridEditor callbacks for collaboration
        gridEditor.onContentChange = (code) => {
            // Update line numbers immediately (UI feedback)
            StatusBar.updateLineNumbers();
            
            // Debounce collaboration sync to reduce WebSocket flooding
            if (typeof Collaboration !== 'undefined' && Collaboration.connected && !Collaboration.isUpdatingFromRemote) {
                if (syncDebounceTimer) {
                    clearTimeout(syncDebounceTimer);
                }
                syncDebounceTimer = setTimeout(() => {
                    Collaboration.sendCodeUpdate(code);
                    syncDebounceTimer = null;
                }, SYNC_DEBOUNCE_MS);
            }
        };
        
        gridEditor.onSelectionChange = (tiles) => {
            if (typeof Collaboration !== 'undefined' && Collaboration.connected && Collaboration.myRole === 'teacher') {
                Collaboration.sendHighlightTiles(tiles);
            }
        };
        
        gridEditor.onCursorChange = (cursor) => {
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
    
    // 5. Set up dropdown event listeners
    if (elements.templateSelect) elements.templateSelect.addEventListener('change', loadTemplate);
    if (elements.exerciseSelect) elements.exerciseSelect.addEventListener('change', loadExercise);
    if (elements.algorithmSelect) elements.algorithmSelect.addEventListener('change', loadAlgorithm);
    
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
            
            // Update selector if needed
            const selector = document.getElementById('language-selector');
            if (selector && selector.value !== newLang) {
                selector.value = newLang;
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
            
            // Regenerate keyword sidebar and dropdowns for new language
            generateKeywordSidebar();
            populateExerciseDropdown();
            populateAlgorithmDropdown();
            
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
