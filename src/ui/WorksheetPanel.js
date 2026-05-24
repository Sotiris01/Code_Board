/**
 * WorksheetPanel — Phase 9.4
 * A private notes/code scratch pad for students. Persisted server-side per id,
 * so it survives reconnects. The teacher never receives the content.
 */
const WorksheetPanel = {
    panel: null,
    textarea: null,
    statusEl: null,
    btn: null,
    closeBtn: null,
    saveTimer: null,
    loaded: false,

    init() {
        this.panel    = document.getElementById('worksheet-panel');
        this.textarea = document.getElementById('worksheet-textarea');
        this.statusEl = document.getElementById('worksheet-status');
        this.btn      = document.getElementById('worksheet-btn');
        this.closeBtn = document.getElementById('worksheet-close');
        if (!this.panel || !this.btn) return;

        this.btn.addEventListener('click', () => this.toggle());
        if (this.closeBtn) this.closeBtn.addEventListener('click', () => this.hide());
        this.textarea.addEventListener('input', () => {
            this._setStatus('editing…');
            clearTimeout(this.saveTimer);
            this.saveTimer = setTimeout(() => this.save(), 600);
        });
    },

    _id() {
        // Stable per-student id: prefer Collaboration.myId, fall back to localStorage uuid.
        if (typeof Collaboration !== 'undefined' && Collaboration.myId) {
            return 'u_' + String(Collaboration.myId).replace(/[^a-zA-Z0-9]/g, '').slice(0, 24);
        }
        let id = localStorage.getItem('aepp-worksheet-id');
        if (!id) {
            id = 'l_' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-6);
            localStorage.setItem('aepp-worksheet-id', id);
        }
        return id;
    },

    _setStatus(text) {
        if (this.statusEl) this.statusEl.textContent = text;
    },

    async toggle() {
        if (!this.panel) return;
        if (this.panel.style.display === 'none' || !this.panel.style.display) {
            await this.show();
        } else {
            this.hide();
        }
    },

    async show() {
        if (!this.panel) return;
        this.panel.style.display = 'flex';
        if (!this.loaded) await this.load();
        this.textarea.focus();
    },

    hide() {
        if (this.panel) this.panel.style.display = 'none';
    },

    async load() {
        try {
            const r = await fetch('/api/worksheet/' + this._id());
            if (r.ok) {
                const data = await r.json();
                this.textarea.value = data?.content || '';
            }
        } catch (e) { console.warn('[Worksheet] load failed:', e); }
        this.loaded = true;
        this._setStatus('saved');
    },

    async save() {
        try {
            this._setStatus('saving…');
            const r = await fetch('/api/worksheet/' + this._id(), {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content: this.textarea.value })
            });
            this._setStatus(r.ok ? 'saved' : 'save failed');
        } catch (e) {
            console.warn('[Worksheet] save failed:', e);
            this._setStatus('offline');
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => WorksheetPanel.init(), 150);
});

window.WorksheetPanel = WorksheetPanel;
