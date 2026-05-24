/**
 * SettingsDialog — Phase 6.B.
 *
 * Tabbed settings dialog (teacher only): Profile · Classroom · Editor ·
 * Sharing · Storage · About. Reads from GET /api/settings, persists via
 * PATCH /api/settings, and pushes ngrok/uploads side-effects through the
 * dedicated endpoints. Per-field validation surfaces inline + via toast.
 */
(function () {
    'use strict';

    const TABS = [
        { id: 'profile',   label: 'Profile'   },
        { id: 'classroom', label: 'Classroom' },
        { id: 'editor',    label: 'Editor'    },
        { id: 'sharing',   label: 'Sharing'   },
        { id: 'storage',   label: 'Storage'   },
        { id: 'about',     label: 'About'     }
    ];

    const state = {
        open:       false,
        activeTab:  'profile',
        settings:   null,
        ngrok:      null,
        languages:  [],
        version:    '',
        storage:    null,
        dirty:      false,
        root:       null
    };

    function $ (sel, root) { return (root || document).querySelector(sel); }
    function $$(sel, root) { return Array.from((root || document).querySelectorAll(sel)); }
    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }
    function toast(msg, type) {
        if (typeof window.showToast === 'function') window.showToast(msg, type || 'info');
    }
    function isTeacher() {
        return new URLSearchParams(location.search).get('role') === 'teacher';
    }

    function formatBytes(n) {
        if (!Number.isFinite(n) || n <= 0) return '0 B';
        const u = ['B', 'KB', 'MB', 'GB', 'TB'];
        let i = 0, v = n;
        while (v >= 1024 && i < u.length - 1) { v /= 1024; i++; }
        return `${v.toFixed(v >= 10 || i === 0 ? 0 : 1)} ${u[i]}`;
    }

    async function fetchJSON(url, opts) {
        const r = await fetch(url, opts);
        const text = await r.text();
        let body = null;
        try { body = text ? JSON.parse(text) : null; } catch { /* keep null */ }
        return { ok: r.ok, status: r.status, body };
    }

    // ─────────────────────────── lifecycle ───────────────────────────

    async function load() {
        const { ok, body } = await fetchJSON('/api/settings');
        if (!ok || !body) throw new Error('Failed to load settings');
        state.settings  = body.settings;
        state.ngrok     = body.ngrok;
        state.languages = body.languages || [];
        state.version   = body.version || '';
    }

    async function open() {
        if (!isTeacher()) { toast('Settings are teacher-only.', 'warning'); return; }
        try { await load(); }
        catch (e) { toast('Could not load settings: ' + e.message, 'error'); return; }
        render();
    }

    function close() {
        state.open = false;
        if (state.root) state.root.remove();
        state.root = null;
        document.removeEventListener('keydown', onKeyDown);
    }

    function onKeyDown(e) {
        if (e.key === 'Escape') { e.preventDefault(); close(); }
    }

    // ─────────────────────────── rendering ───────────────────────────

    function render() {
        state.open = true;
        let host = document.getElementById('settings-dialog');
        if (host) host.remove();
        host = document.createElement('div');
        host.id = 'settings-dialog';
        host.className = 'settings-overlay';
        host.innerHTML = `
            <div class="settings-modal" role="dialog" aria-modal="true" aria-label="Settings">
                <div class="settings-sidebar">
                    <div class="settings-title">⚙ Settings</div>
                    <nav class="settings-tabs" role="tablist">
                        ${TABS.map(t => `
                            <button class="settings-tab ${t.id === state.activeTab ? 'is-active' : ''}"
                                    data-tab="${t.id}" role="tab"
                                    aria-selected="${t.id === state.activeTab}">
                                ${esc(t.label)}
                            </button>
                        `).join('')}
                    </nav>
                </div>
                <div class="settings-main">
                    <header class="settings-header">
                        <h2 class="settings-heading">${esc(TABS.find(t => t.id === state.activeTab).label)}</h2>
                        <button class="settings-close" title="Close (Esc)" aria-label="Close">✕</button>
                    </header>
                    <div class="settings-body"></div>
                </div>
            </div>
        `;
        document.body.appendChild(host);
        state.root = host;

        host.addEventListener('click', (e) => { if (e.target === host) close(); });
        host.querySelector('.settings-close').addEventListener('click', close);
        host.querySelectorAll('.settings-tab').forEach(btn => {
            btn.addEventListener('click', () => {
                state.activeTab = btn.dataset.tab;
                render();
            });
        });
        document.addEventListener('keydown', onKeyDown);

        renderTab();
    }

    function renderTab() {
        const body = state.root.querySelector('.settings-body');
        if (!body) return;
        switch (state.activeTab) {
            case 'profile':   renderProfile(body); break;
            case 'classroom': renderClassroom(body); break;
            case 'editor':    renderEditor(body); break;
            case 'sharing':   renderSharing(body); break;
            case 'storage':   renderStorage(body); break;
            case 'about':     renderAbout(body); break;
        }
    }

    // ───── Profile (6.B.2) ─────
    function renderProfile(host) {
        const p = state.settings.profile;
        host.innerHTML = `
            <div class="settings-grid two-col">
                <div class="settings-form">
                    <label class="set-field">
                        <span>Name *</span>
                        <input type="text" data-key="profile.name" value="${esc(p.name)}" />
                        <small class="set-error" data-err="profile.name"></small>
                    </label>
                    <label class="set-field">
                        <span>Email</span>
                        <input type="email" data-key="profile.email" value="${esc(p.email)}" />
                    </label>
                    <label class="set-field">
                        <span>Phone</span>
                        <input type="tel" data-key="profile.phone" value="${esc(p.phone)}" />
                    </label>
                    <label class="set-field">
                        <span>Discord</span>
                        <input type="text" data-key="profile.discord" value="${esc(p.discord)}" />
                    </label>
                </div>
                <aside class="settings-preview">
                    <div class="set-preview-title">Lobby card preview</div>
                    <div class="set-card">
                        <div class="set-card-name" data-bind="profile.name">${esc(p.name || '—')}</div>
                        <div class="set-card-line"><span>Email</span><span data-bind="profile.email">${esc(p.email || '—')}</span></div>
                        <div class="set-card-line"><span>Phone</span><span data-bind="profile.phone">${esc(p.phone || '—')}</span></div>
                        <div class="set-card-line"><span>Discord</span><span data-bind="profile.discord">${esc(p.discord || '—')}</span></div>
                    </div>
                </aside>
            </div>
            <footer class="settings-footer">
                <button class="set-btn set-btn-primary" data-action="save-profile">Save profile</button>
            </footer>
        `;
        // Live preview
        host.querySelectorAll('input[data-key]').forEach(inp => {
            inp.addEventListener('input', () => {
                const key = inp.dataset.key.split('.').pop();
                const target = host.querySelector(`[data-bind="profile.${key}"]`);
                if (target) target.textContent = inp.value || '—';
            });
        });
        host.querySelector('[data-action="save-profile"]').addEventListener('click', async () => {
            const patch = { profile: harvest(host, 'profile') };
            await patchSettings(patch, host, 'Profile saved.');
        });
    }

    // ───── Classroom (6.B.3) ─────
    function renderClassroom(host) {
        const c = state.settings.classroom;
        host.innerHTML = `
            <div class="settings-form">
                <div class="set-field">
                    <span>Access-code policy</span>
                    <div class="set-radio-row">
                        ${[
                            { v: 'fixed',  label: 'Fixed 4-digit code' },
                            { v: 'rotate', label: 'Rotate per session' },
                            { v: 'free',   label: 'Free Enter (no code)' }
                        ].map(o => `
                            <label class="set-radio">
                                <input type="radio" name="accessCodePolicy"
                                       value="${o.v}" ${c.accessCodePolicy === o.v ? 'checked' : ''} />
                                <span>${esc(o.label)}</span>
                            </label>
                        `).join('')}
                    </div>
                    <small class="set-error" data-err="classroom.accessCodePolicy"></small>
                </div>
                <label class="set-field set-toggle">
                    <input type="checkbox" data-key="classroom.freeEnterDefault"
                           ${c.freeEnterDefault ? 'checked' : ''} />
                    <span>Default <em>Free Enter</em> on each boot</span>
                </label>
                <label class="set-field set-toggle">
                    <input type="checkbox" data-key="classroom.autoClearOnNewSession"
                           ${c.autoClearOnNewSession ? 'checked' : ''} />
                    <span>Auto-clear board on a new session</span>
                </label>
                <label class="set-field">
                    <span>Hand-raise timeout (seconds, 0 = no timeout)</span>
                    <input type="number" min="0" max="600" step="5"
                           data-key="classroom.handRaiseTimeoutSec"
                           value="${Number(c.handRaiseTimeoutSec) || 0}" />
                </label>
            </div>
            <footer class="settings-footer">
                <button class="set-btn set-btn-primary" data-action="save-classroom">Save classroom</button>
            </footer>
        `;
        host.querySelector('[data-action="save-classroom"]').addEventListener('click', async () => {
            const policy = host.querySelector('input[name="accessCodePolicy"]:checked')?.value || 'fixed';
            const patch = {
                classroom: {
                    accessCodePolicy: policy,
                    freeEnterDefault: host.querySelector('[data-key="classroom.freeEnterDefault"]').checked,
                    autoClearOnNewSession: host.querySelector('[data-key="classroom.autoClearOnNewSession"]').checked,
                    handRaiseTimeoutSec: Number(host.querySelector('[data-key="classroom.handRaiseTimeoutSec"]').value) || 0
                }
            };
            await patchSettings(patch, host, 'Classroom settings saved.');
        });
    }

    // ───── Editor (6.B.4) ─────
    function renderEditor(host) {
        const e = state.settings.editor;
        host.innerHTML = `
            <div class="settings-form">
                <label class="set-field set-toggle">
                    <input type="checkbox" data-key="editor.softWrap" ${e.softWrap ? 'checked' : ''} />
                    <span>Soft wrap long lines</span>
                </label>
                <label class="set-field">
                    <span>Tab width (1–8)</span>
                    <input type="number" min="1" max="8" data-key="editor.tabSize" value="${e.tabSize}" />
                    <small class="set-error" data-err="editor.tabSize"></small>
                </label>
                <label class="set-field set-toggle">
                    <input type="checkbox" data-key="editor.useTabs" ${e.useTabs ? 'checked' : ''} />
                    <span>Use real tabs instead of spaces</span>
                </label>
                <label class="set-field set-toggle">
                    <input type="checkbox" data-key="editor.autoPairs" ${e.autoPairs ? 'checked' : ''} />
                    <span>Auto-close brackets &amp; quotes</span>
                </label>
                <label class="set-field set-toggle">
                    <input type="checkbox" data-key="editor.autoIndent" ${e.autoIndent ? 'checked' : ''} />
                    <span>Smart auto-indent</span>
                </label>
                <label class="set-field">
                    <span>Font size (10–40)</span>
                    <input type="number" min="10" max="40" data-key="editor.fontSize" value="${e.fontSize}" />
                    <small class="set-error" data-err="editor.fontSize"></small>
                </label>
                <label class="set-field">
                    <span>Font family</span>
                    <input type="text" data-key="editor.fontFamily" value="${esc(e.fontFamily)}" />
                </label>
            </div>
            <footer class="settings-footer">
                <button class="set-btn set-btn-primary" data-action="save-editor">Save editor</button>
            </footer>
        `;
        host.querySelector('[data-action="save-editor"]').addEventListener('click', async () => {
            const patch = { editor: harvest(host, 'editor') };
            await patchSettings(patch, host, 'Editor preferences saved.');
        });
    }

    // ───── Sharing (6.B.5) ─────
    function renderSharing(host) {
        const s = state.settings.sharing;
        const ng = state.ngrok || { configured: false };
        const studentUrl = location.origin;
        host.innerHTML = `
            <div class="settings-form">
                <div class="set-field">
                    <span>Sharing mode</span>
                    <div class="set-radio-row">
                        <label class="set-radio">
                            <input type="radio" name="sharing.mode" value="local" ${s.mode === 'local' ? 'checked' : ''} />
                            <span>Local network only</span>
                        </label>
                        <label class="set-radio">
                            <input type="radio" name="sharing.mode" value="ngrok" ${s.mode === 'ngrok' ? 'checked' : ''} />
                            <span>Public via ngrok</span>
                        </label>
                    </div>
                </div>

                <fieldset class="set-fieldset">
                    <legend>ngrok</legend>
                    <p class="set-hint">
                        Authtoken is stored in <code>data/ngrok.json</code> (gitignored).
                        ${ng.configured ? `Current: <code>${esc(ng.authtokenMasked)}</code>` : 'No token saved yet.'}
                    </p>
                    <label class="set-field">
                        <span>Authtoken</span>
                        <input type="password" data-key="sharing.authtoken"
                               placeholder="${ng.configured ? '••••••••' : 'paste your token'}" />
                    </label>
                    <label class="set-field">
                        <span>Region</span>
                        <select data-key="sharing.region">
                            ${['us', 'eu', 'ap', 'au', 'sa', 'jp', 'in']
                                .map(r => `<option value="${r}" ${((s.region || ng.region) === r) ? 'selected' : ''}>${r.toUpperCase()}</option>`).join('')}
                        </select>
                    </label>
                    <label class="set-field">
                        <span>Custom domain (paid plan)</span>
                        <input type="text" data-key="sharing.customDomain" value="${esc(s.customDomain)}" />
                    </label>
                    <div class="set-actions">
                        <button class="set-btn" data-action="save-ngrok">Save authtoken</button>
                        <button class="set-btn" data-action="test-ngrok">Test tunnel</button>
                        <span class="set-ngrok-status" data-bind="ngrok-status"></span>
                    </div>
                </fieldset>

                <fieldset class="set-fieldset">
                    <legend>Student link</legend>
                    <div class="set-share">
                        <input type="text" readonly value="${esc(studentUrl)}" data-bind="student-url" />
                        <button class="set-btn" data-action="copy-url">Copy</button>
                    </div>
                    <div class="set-qr" data-bind="qr"></div>
                </fieldset>
            </div>
            <footer class="settings-footer">
                <button class="set-btn set-btn-primary" data-action="save-sharing">Save sharing</button>
            </footer>
        `;

        // QR via Google Charts API (no extra dependency).
        const qrHost = host.querySelector('[data-bind="qr"]');
        qrHost.innerHTML = `<img alt="Student link QR"
            src="https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(studentUrl)}" />`;

        host.querySelector('[data-action="copy-url"]').addEventListener('click', async () => {
            try { await navigator.clipboard.writeText(studentUrl); toast('Student link copied.', 'success'); }
            catch { toast('Copy failed.', 'error'); }
        });

        host.querySelector('[data-action="save-sharing"]').addEventListener('click', async () => {
            const mode = host.querySelector('input[name="sharing.mode"]:checked')?.value || 'local';
            const patch = {
                sharing: {
                    mode,
                    region: host.querySelector('[data-key="sharing.region"]').value,
                    customDomain: host.querySelector('[data-key="sharing.customDomain"]').value.trim()
                }
            };
            await patchSettings(patch, host, 'Sharing settings saved.');
        });

        host.querySelector('[data-action="save-ngrok"]').addEventListener('click', async () => {
            const authtoken = host.querySelector('[data-key="sharing.authtoken"]').value.trim();
            const region = host.querySelector('[data-key="sharing.region"]').value;
            if (!authtoken) { toast('Paste a token first.', 'warning'); return; }
            const { ok, body } = await fetchJSON('/api/settings/ngrok', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ authtoken, region })
            });
            if (ok && body && body.success) {
                state.ngrok = body.ngrok;
                toast('Authtoken saved.', 'success');
                renderTab();
            } else {
                toast('Failed to save token: ' + (body?.error || 'unknown'), 'error');
            }
        });

        host.querySelector('[data-action="test-ngrok"]').addEventListener('click', async () => {
            const status = host.querySelector('[data-bind="ngrok-status"]');
            status.textContent = 'Testing…';
            const { body } = await fetchJSON('/api/settings/ngrok/test');
            if (body && body.success) {
                status.innerHTML = `✅ <a href="${esc(body.publicUrl)}" target="_blank" rel="noopener">${esc(body.publicUrl)}</a>`;
            } else {
                status.textContent = '⚠ ' + ((body && body.error) || 'No tunnel detected.');
            }
        });
    }

    // ───── Storage (6.B.6) ─────
    async function renderStorage(host) {
        host.innerHTML = `<div class="set-loading">Loading storage stats…</div>`;
        const { ok, body } = await fetchJSON('/api/storage/stats');
        if (!ok || !body) { host.innerHTML = `<div class="set-error">Failed to load storage stats.</div>`; return; }
        state.storage = body;
        const st = state.settings.storage;
        const u = body.uploads;
        host.innerHTML = `
            <div class="settings-form">
                <label class="set-field">
                    <span>Uploads TTL (days, 0 disables auto-prune)</span>
                    <input type="number" min="0" max="365" data-key="storage.uploadsTtlDays" value="${st.uploadsTtlDays}" />
                    <small class="set-error" data-err="storage.uploadsTtlDays"></small>
                </label>
                <div class="set-stats">
                    <div><strong>Uploads</strong>: ${formatBytes(u.total.bytes)} across ${u.total.files} file(s), ${u.sessions.length} session folder(s).</div>
                    <div><strong>Data</strong>: ${formatBytes(body.data.bytes)} across ${body.data.files} file(s).</div>
                    <div><strong>Session state</strong>: ${body.sessionStateExists ? 'present' : 'none'}.</div>
                </div>
                <table class="set-table">
                    <thead><tr><th>Session ID</th><th>Files</th><th>Size</th><th></th></tr></thead>
                    <tbody>
                        ${u.sessions.map(s => `
                            <tr>
                                <td>${esc(s.id)} ${s.isCurrent ? '<span class="set-pill">current</span>' : ''}</td>
                                <td>${s.files}</td>
                                <td>${formatBytes(s.bytes)}</td>
                                <td></td>
                            </tr>
                        `).join('') || '<tr><td colspan="4" class="set-empty">No upload folders.</td></tr>'}
                    </tbody>
                </table>
                <div class="set-actions">
                    <button class="set-btn set-btn-primary" data-action="save-storage">Save TTL</button>
                    <button class="set-btn set-btn-danger" data-action="clear-uploads">Clear old uploads</button>
                    <button class="set-btn set-btn-danger" data-action="reset-session">Reset session state</button>
                </div>
            </div>
        `;
        host.querySelector('[data-action="save-storage"]').addEventListener('click', async () => {
            const patch = { storage: { uploadsTtlDays: Number(host.querySelector('[data-key="storage.uploadsTtlDays"]').value) } };
            await patchSettings(patch, host, 'Storage settings saved.');
        });
        host.querySelector('[data-action="clear-uploads"]').addEventListener('click', async () => {
            if (!confirm('Delete every uploads/<session> folder except the current one?')) return;
            const { ok, body } = await fetchJSON('/api/storage/clear-uploads', { method: 'POST' });
            if (ok && body && body.success) { toast(`Removed ${body.removed} folder(s).`, 'success'); renderTab(); }
            else toast('Clear failed.', 'error');
        });
        host.querySelector('[data-action="reset-session"]').addEventListener('click', async () => {
            if (!confirm('Reset the saved session state? Active clients will keep their content until next reload.')) return;
            const { ok, body } = await fetchJSON('/api/clear-session', { method: 'POST' });
            if (ok && body && body.success) { toast('Session state cleared.', 'success'); renderTab(); }
            else toast('Reset failed.', 'error');
        });
    }

    // ───── About (6.B.7) ─────
    function renderAbout(host) {
        host.innerHTML = `
            <div class="set-about">
                <h3>Code Board <span class="set-version">v${esc(state.version)}</span></h3>
                <p>Collaborative classroom code-teaching board.</p>
                <ul class="set-links">
                    <li><a href="/README.md" target="_blank" rel="noopener">README</a></li>
                    <li><a href="/ROADMAP.md" target="_blank" rel="noopener">ROADMAP</a></li>
                    <li><a href="/CHANGELOG.md" target="_blank" rel="noopener">CHANGELOG</a></li>
                </ul>
                <p class="set-hint">Settings live in <code>data/settings.json</code>. The ngrok
                token is in <code>data/ngrok.json</code>. Both are git-ignored.</p>
            </div>
        `;
    }

    // ─────────────────────────── helpers ───────────────────────────

    /** Read all inputs whose data-key starts with `prefix.` into a nested object. */
    function harvest(host, prefix) {
        const out = {};
        host.querySelectorAll(`[data-key^="${prefix}."]`).forEach(inp => {
            const key = inp.dataset.key.slice(prefix.length + 1);
            let val;
            if (inp.type === 'checkbox') val = inp.checked;
            else if (inp.type === 'number') val = inp.value === '' ? 0 : Number(inp.value);
            else val = inp.value;
            out[key] = val;
        });
        return out;
    }

    function clearErrors(host) {
        host.querySelectorAll('.set-error').forEach(e => { e.textContent = ''; });
    }

    function showFieldError(host, field, msg) {
        const el = host.querySelector(`[data-err="${field}"]`);
        if (el) el.textContent = msg;
    }

    async function patchSettings(patch, host, successMsg) {
        clearErrors(host);
        const { ok, status, body } = await fetchJSON('/api/settings', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(patch)
        });
        if (ok && body && body.success) {
            state.settings = body.settings;
            toast(successMsg || 'Saved.', 'success');
            // Apply live where the wider app cares.
            if (patch.defaults && patch.defaults.theme) {
                document.documentElement.setAttribute('data-theme', patch.defaults.theme);
            }
            return true;
        }
        if (status === 400 && body && body.field) {
            showFieldError(host, body.field, body.error || 'Invalid value');
            toast(body.error || 'Validation failed.', 'error');
        } else {
            toast('Save failed: ' + ((body && body.error) || `HTTP ${status}`), 'error');
        }
        return false;
    }

    // ─────────────────────────── public API ───────────────────────────

    const SettingsDialog = {
        open,
        close,
        isOpen: () => state.open,
        // Convenience for the toolbar gear button.
        toggle: () => state.open ? close() : open()
    };

    window.SettingsDialog = SettingsDialog;
})();
