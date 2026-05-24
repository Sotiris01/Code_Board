/**
 * TabsBar — Phase 9.1
 * Minimal teacher-local multi-tab editor. Each tab holds its own
 * { name, language, code } buffer. Switching tabs swaps the editor's
 * content; the active tab's code is what gets broadcast through the
 * normal code_update flow. Tabs persist to localStorage so a teacher
 * can keep multiple snippets handy during a lesson.
 *
 * Students never see this bar (teacher-only). The shared board still
 * shows just one stream; tabs are scratch areas for the teacher.
 */
const TabsBar = {
    bar: null,
    toggleBtn: null,
    tabs: [],          // { id, name, language, code }
    activeId: null,
    visible: false,
    storageKey: 'aepp-tabs-v1',
    _suspendCapture: false,

    init() {
        this.bar = document.getElementById('tab-bar');
        this.toggleBtn = document.getElementById('tabs-toggle-btn');
        if (!this.bar || !this.toggleBtn) return;
        this.toggleBtn.addEventListener('click', () => this.toggle());
        this._load();
        // Render lazily once user opens the strip.
    },

    toggle() {
        this.visible = !this.visible;
        this.bar.style.display = this.visible ? 'flex' : 'none';
        if (this.visible) {
            if (this.tabs.length === 0) this._seedFromCurrent();
            this._render();
        }
    },

    _seedFromCurrent() {
        const code = (window.gridEditor && window.gridEditor.getValue) ? window.gridEditor.getValue() : '';
        const lang = (typeof LanguageManager !== 'undefined' && LanguageManager.getCurrentLanguage)
            ? LanguageManager.getCurrentLanguage() : 'glossa';
        const t = this._makeTab('Tab 1', lang, code);
        this.tabs.push(t);
        this.activeId = t.id;
        this._save();
    },

    _makeTab(name, language, code) {
        return { id: 't_' + Math.random().toString(36).slice(2, 9), name, language, code };
    },

    _captureCurrentIntoActive() {
        if (this._suspendCapture) return;
        const t = this.tabs.find(x => x.id === this.activeId);
        if (!t) return;
        if (window.gridEditor && window.gridEditor.getValue) t.code = window.gridEditor.getValue();
        if (typeof LanguageManager !== 'undefined' && LanguageManager.getCurrentLanguage) {
            t.language = LanguageManager.getCurrentLanguage();
        }
        this._save();
    },

    addTab() {
        this._captureCurrentIntoActive();
        const t = this._makeTab('Tab ' + (this.tabs.length + 1),
            (typeof LanguageManager !== 'undefined' ? LanguageManager.getCurrentLanguage() : 'glossa'),
            '');
        this.tabs.push(t);
        this.switchTo(t.id);
    },

    switchTo(id) {
        if (id === this.activeId) return;
        this._captureCurrentIntoActive();
        const t = this.tabs.find(x => x.id === id);
        if (!t) return;
        this.activeId = t.id;
        this._suspendCapture = true;
        try {
            if (typeof LanguageManager !== 'undefined' && LanguageManager.setLanguage
                && LanguageManager.getCurrentLanguage && LanguageManager.getCurrentLanguage() !== t.language) {
                LanguageManager.setLanguage(t.language);
            }
            if (window.gridEditor && window.gridEditor.setValue) {
                window.gridEditor.setValue(t.code || '');
            }
            // Broadcast the tab's content so students see the swap.
            if (typeof Collaboration !== 'undefined' && Collaboration.sendCodeUpdate) {
                Collaboration.sendCodeUpdate(t.code || '');
            }
        } finally {
            setTimeout(() => { this._suspendCapture = false; }, 50);
        }
        this._save();
        this._render();
    },

    closeTab(id) {
        if (this.tabs.length <= 1) return; // keep at least one
        const idx = this.tabs.findIndex(t => t.id === id);
        if (idx < 0) return;
        const wasActive = id === this.activeId;
        this.tabs.splice(idx, 1);
        if (wasActive) {
            const next = this.tabs[Math.max(0, idx - 1)];
            this.activeId = next.id;
            this._suspendCapture = true;
            try {
                if (window.gridEditor && window.gridEditor.setValue) {
                    window.gridEditor.setValue(next.code || '');
                }
                if (typeof Collaboration !== 'undefined' && Collaboration.sendCodeUpdate) {
                    Collaboration.sendCodeUpdate(next.code || '');
                }
            } finally {
                setTimeout(() => { this._suspendCapture = false; }, 50);
            }
        }
        this._save();
        this._render();
    },

    renameTab(id) {
        const t = this.tabs.find(x => x.id === id);
        if (!t) return;
        const name = window.prompt('Tab name:', t.name);
        if (name && name.trim()) {
            t.name = name.trim().slice(0, 24);
            this._save();
            this._render();
        }
    },

    _render() {
        if (!this.bar) return;
        this.bar.innerHTML = '';
        this.tabs.forEach(t => {
            const el = document.createElement('div');
            el.className = 'tab' + (t.id === this.activeId ? ' active' : '');
            el.dataset.id = t.id;
            el.innerHTML = `<span class="tab-name"></span><button class="tab-close" title="Close">×</button>`;
            el.querySelector('.tab-name').textContent = t.name;
            el.addEventListener('click', (e) => {
                if (e.target.classList.contains('tab-close')) {
                    e.stopPropagation();
                    this.closeTab(t.id);
                } else if (e.detail === 2) {
                    this.renameTab(t.id);
                } else {
                    this.switchTo(t.id);
                }
            });
            this.bar.appendChild(el);
        });
        const add = document.createElement('button');
        add.className = 'tab-add';
        add.textContent = '+';
        add.title = 'New tab';
        add.addEventListener('click', () => this.addTab());
        this.bar.appendChild(add);
    },

    _save() {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify({
                activeId: this.activeId,
                tabs: this.tabs
            }));
        } catch { /* ignore quota */ }
    },

    _load() {
        try {
            const raw = localStorage.getItem(this.storageKey);
            if (!raw) return;
            const data = JSON.parse(raw);
            if (Array.isArray(data?.tabs) && data.tabs.length > 0) {
                this.tabs = data.tabs;
                this.activeId = data.activeId || this.tabs[0].id;
            }
        } catch { /* ignore parse error */ }
    },

    // Called from editor input handlers (optional) — keeps active tab in sync.
    captureActive() { this._captureCurrentIntoActive(); }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => TabsBar.init(), 250);
});

window.TabsBar = TabsBar;
