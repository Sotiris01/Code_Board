/**
 * ReplayModal — Phase 9.3 / 9.5
 * Loads recorded events for a past session and lets the teacher scrub
 * through the lesson. Also exposes an "Export HTML" link that downloads
 * a self-contained replay file from the server (Phase 9.5).
 */
const ReplayModal = {
    modal: null, select: null, slider: null, view: null, info: null,
    btnPlay: null, btnStep: null, btnReset: null, btnLoad: null, btnExport: null,
    frames: [], idx: 0, playing: false, timer: null,

    init() {
        this.modal     = document.getElementById('replay-modal');
        this.select    = document.getElementById('replay-session-select');
        this.slider    = document.getElementById('replay-slider');
        this.view      = document.getElementById('replay-view');
        this.info      = document.getElementById('replay-info');
        this.btnPlay   = document.getElementById('replay-play');
        this.btnStep   = document.getElementById('replay-step');
        this.btnReset  = document.getElementById('replay-reset');
        this.btnLoad   = document.getElementById('replay-load');
        this.btnExport = document.getElementById('replay-export');
        const opener  = document.getElementById('replay-btn');
        const closeBtn = document.getElementById('replay-modal-close');
        const overlay  = this.modal?.querySelector('.modal-overlay');
        if (!this.modal || !opener) return;

        opener.addEventListener('click', () => this.open());
        closeBtn?.addEventListener('click', () => this.close());
        overlay?.addEventListener('click', () => this.close());
        this.btnLoad.addEventListener('click', () => this.loadSelected());
        this.btnStep.addEventListener('click', () => this.step());
        this.btnReset.addEventListener('click', () => { this.idx = 0; this.render(); });
        this.btnPlay.addEventListener('click', () => this.togglePlay());
        this.slider.addEventListener('input', () => { this.idx = Number(this.slider.value); this.render(); });
    },

    async open() {
        this.modal.classList.remove('hidden');
        await this.refreshSessions();
    },

    close() {
        this.modal.classList.add('hidden');
        this._stopTimer();
    },

    async refreshSessions() {
        try {
            const r = await fetch('/api/sessions');
            const data = await r.json();
            this.select.innerHTML = '';
            (data?.sessions || []).forEach(s => {
                const opt = document.createElement('option');
                opt.value = s.key;
                opt.textContent = `${s.key}  (${(s.bytes / 1024).toFixed(1)} KB)`;
                this.select.appendChild(opt);
            });
            if (!data?.sessions?.length) {
                this.info.textContent = 'No recorded sessions yet.';
            }
        } catch (e) {
            this.info.textContent = 'Failed to list sessions: ' + e.message;
        }
    },

    async loadSelected() {
        const key = this.select.value;
        if (!key) return;
        this.info.textContent = 'Loading…';
        try {
            const r = await fetch('/api/sessions/' + key + '/events');
            const data = await r.json();
            const events = data?.events || [];
            this.frames = this._buildFrames(events);

            // Also fetch snapshot to append final state if missing.
            try {
                const rs = await fetch('/api/sessions/' + key);
                const sd = await rs.json();
                const finalCode = sd?.snapshot?.code;
                if (finalCode && (!this.frames.length ||
                    this.frames[this.frames.length - 1].code !== finalCode)) {
                    this.frames.push({ t: Date.now(), code: finalCode, label: 'snapshot' });
                }
            } catch { /* ignore */ }

            this.idx = 0;
            this.slider.max = Math.max(0, this.frames.length - 1);
            this.slider.value = 0;
            this.slider.disabled = this.frames.length < 2;
            this.btnPlay.disabled = this.frames.length < 2;
            this.btnStep.disabled = this.frames.length < 2;
            this.btnReset.disabled = this.frames.length < 2;
            this.btnExport.href = '/api/sessions/' + key + '/export';
            this.btnExport.style.display = '';
            this.render();
        } catch (e) {
            this.info.textContent = 'Load failed: ' + e.message;
        }
    },

    _buildFrames(events) {
        const frames = [];
        let baseline = '';
        const b = events.find(e => e && e.type === 'baseline');
        if (b && typeof b.code === 'string') baseline = b.code;
        frames.push({ t: b?.t || (events[0]?.t ?? Date.now()), code: baseline, label: 'baseline' });
        let cur = baseline;
        for (const ev of events) {
            if (!ev || ev.type === 'baseline') continue;
            if (ev.type === 'code_update' && ev.patch) {
                cur = this._applyPatch(cur, ev.patch);
                frames.push({ t: ev.t, code: cur, label: ev.by || 'code_update' });
            }
        }
        return frames;
    },

    _applyPatch(oldStr, patch) {
        if (!Array.isArray(patch)) return oldStr;
        let result = '', i = 0;
        for (const [op, text] of patch) {
            const t = String(text || '');
            if (op === 0)      { result += oldStr.substr(i, t.length); i += t.length; }
            else if (op === -1){ i += t.length; }
            else if (op === 1) { result += t; }
        }
        return result;
    },

    step() {
        if (this.idx < this.frames.length - 1) { this.idx++; this.render(); }
    },

    togglePlay() {
        this.playing = !this.playing;
        this.btnPlay.textContent = this.playing ? '⏸ Pause' : '▶ Play';
        this._stopTimer();
        if (this.playing) {
            this.timer = setInterval(() => {
                if (this.idx >= this.frames.length - 1) {
                    this.playing = false;
                    this.btnPlay.textContent = '▶ Play';
                    this._stopTimer();
                    return;
                }
                this.idx++; this.render();
            }, 350);
        }
    },

    _stopTimer() {
        if (this.timer) { clearInterval(this.timer); this.timer = null; }
    },

    render() {
        const f = this.frames[this.idx];
        this.view.textContent = f ? f.code : '';
        this.slider.value = this.idx;
        if (f) {
            const ts = new Date(f.t).toLocaleTimeString();
            this.info.textContent = `${ts} · frame ${this.idx + 1} / ${this.frames.length} · ${f.label}`;
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => ReplayModal.init(), 150);
});

window.ReplayModal = ReplayModal;
