/**
 * OnboardingWizard — Phase 6.A.
 *
 * Shown the first time the app starts with no data/settings.json.
 * Teacher-only: students always skip the wizard.
 *
 * Steps:
 *   1. Profile  (name, email, phone, discord)
 *   2. Classroom (access-code policy)
 *   3. Default language  (radio list, from LanguageRegistry)
 *   4. Default theme     (dark / light / follow OS)
 *   5. Sharing           (local network / ngrok + optional token)
 *   6. Done — POST /api/onboarding/complete then reload.
 */
const OnboardingWizard = (function () {
    'use strict';

    const ROLE = new URLSearchParams(location.search).get('role');
    const IS_TEACHER = ROLE === 'teacher';

    const state = {
        step: 0,
        languages: [],
        data: {
            profile: { name: '', email: '', phone: '', discord: '' },
            classroom: { accessCodePolicy: 'fixed' },
            defaults: { language: 'glossa', theme: 'dark' },
            sharing: { mode: 'local', authtoken: '', region: 'eu' }
        }
    };

    let host = null;

    async function checkAndMaybeRun() {
        if (!IS_TEACHER) return false;
        try {
            const res = await fetch('/api/onboarding/status', { cache: 'no-cache' });
            if (!res.ok) return false;
            const json = await res.json();
            if (json.completed) return false;
            state.languages = json.languages || [];
            if (state.languages.length && !state.languages.find(l => l.id === state.data.defaults.language)) {
                state.data.defaults.language = state.languages[0].id;
            }
            render();
            return true;
        } catch (e) {
            console.warn('[Onboarding] status check failed:', e);
            return false;
        }
    }

    function close() {
        if (host && host.parentNode) host.parentNode.removeChild(host);
        host = null;
    }

    function render() {
        if (!host) {
            host = document.createElement('div');
            host.id = 'onboarding-wizard';
            host.className = 'onboarding-overlay';
            document.body.appendChild(host);
        }
        const steps = [renderProfile, renderClassroom, renderLanguage, renderTheme, renderSharing, renderDone];
        const total = steps.length;
        host.innerHTML = `
            <div class="onboarding-card" role="dialog" aria-modal="true" aria-labelledby="onb-title">
                <header class="onboarding-header">
                    <h2 id="onb-title">Welcome to Code Board</h2>
                    <div class="onboarding-progress">Step ${state.step + 1} of ${total}</div>
                    <div class="onboarding-bar"><div class="onboarding-bar-fill" style="width:${((state.step + 1) / total) * 100}%"></div></div>
                </header>
                <section class="onboarding-body" id="onb-body"></section>
                <footer class="onboarding-footer">
                    <button type="button" class="onb-btn onb-btn-secondary" id="onb-back" ${state.step === 0 ? 'disabled' : ''}>Back</button>
                    <button type="button" class="onb-btn onb-btn-primary" id="onb-next">${state.step === total - 1 ? 'Finish' : 'Next'}</button>
                </footer>
            </div>
        `;
        steps[state.step](host.querySelector('#onb-body'));
        host.querySelector('#onb-back').addEventListener('click', () => { if (state.step > 0) { state.step--; render(); } });
        host.querySelector('#onb-next').addEventListener('click', onNext);
    }

    function onNext() {
        const stepEl = host.querySelector('#onb-body');
        const total = 6;
        // Validate + harvest the current step.
        if (state.step === 0) {
            const name = stepEl.querySelector('#onb-name').value.trim();
            if (!name) { showError(stepEl, 'Please tell us your name.'); return; }
            state.data.profile = {
                name,
                email:   stepEl.querySelector('#onb-email').value.trim(),
                phone:   stepEl.querySelector('#onb-phone').value.trim(),
                discord: stepEl.querySelector('#onb-discord').value.trim()
            };
        } else if (state.step === 1) {
            const sel = stepEl.querySelector('input[name="onb-policy"]:checked');
            state.data.classroom.accessCodePolicy = sel ? sel.value : 'fixed';
        } else if (state.step === 2) {
            const sel = stepEl.querySelector('input[name="onb-lang"]:checked');
            if (sel) state.data.defaults.language = sel.value;
        } else if (state.step === 3) {
            const sel = stepEl.querySelector('input[name="onb-theme"]:checked');
            if (sel) state.data.defaults.theme = sel.value;
        } else if (state.step === 4) {
            const mode = stepEl.querySelector('input[name="onb-share"]:checked');
            state.data.sharing.mode = mode ? mode.value : 'local';
            if (state.data.sharing.mode === 'ngrok') {
                state.data.sharing.authtoken = stepEl.querySelector('#onb-ngrok-token').value.trim();
                state.data.sharing.region    = stepEl.querySelector('#onb-ngrok-region').value;
            }
        } else if (state.step === 5) {
            return finish();
        }
        if (state.step < total - 1) { state.step++; render(); }
    }

    function showError(parent, msg) {
        let el = parent.querySelector('.onb-error');
        if (!el) { el = document.createElement('div'); el.className = 'onb-error'; parent.appendChild(el); }
        el.textContent = msg;
    }

    async function finish() {
        const btn = host.querySelector('#onb-next');
        btn.disabled = true; btn.textContent = 'Saving…';
        try {
            const res = await fetch('/api/onboarding/complete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state.data)
            });
            if (!res.ok) {
                const err = await res.json().catch(() => ({}));
                throw new Error(err.error || ('HTTP ' + res.status));
            }
            // Honour the chosen theme immediately, then reload so the
            // rest of the app rebuilds against the new settings.
            try { document.documentElement.setAttribute('data-theme', state.data.defaults.theme === 'light' ? 'light' : 'dark'); } catch {}
            close();
            location.reload();
        } catch (e) {
            btn.disabled = false; btn.textContent = 'Finish';
            showError(host.querySelector('#onb-body'), 'Could not save: ' + e.message);
        }
    }

    // ---- step renderers ------------------------------------------------
    function renderProfile(root) {
        const p = state.data.profile;
        root.innerHTML = `
            <p class="onb-lead">Tell us a bit about yourself. This is shown to students in the lobby card.</p>
            <label class="onb-field"><span>Name *</span>    <input id="onb-name"    type="text" value="${esc(p.name)}"    autocomplete="name"></label>
            <label class="onb-field"><span>Email</span>     <input id="onb-email"   type="email" value="${esc(p.email)}"  autocomplete="email"></label>
            <label class="onb-field"><span>Phone</span>     <input id="onb-phone"   type="tel" value="${esc(p.phone)}"    autocomplete="tel"></label>
            <label class="onb-field"><span>Discord</span>   <input id="onb-discord" type="text" value="${esc(p.discord)}"></label>
        `;
    }
    function renderClassroom(root) {
        const cur = state.data.classroom.accessCodePolicy;
        root.innerHTML = `
            <p class="onb-lead">How should students authenticate when they join?</p>
            <label class="onb-radio"><input type="radio" name="onb-policy" value="fixed"  ${cur === 'fixed'  ? 'checked' : ''}> <span><strong>Fixed 4-digit code</strong><br><small>You set one code and students type it in.</small></span></label>
            <label class="onb-radio"><input type="radio" name="onb-policy" value="rotate" ${cur === 'rotate' ? 'checked' : ''}> <span><strong>Auto-rotate per session</strong><br><small>A new code is generated every time the server starts.</small></span></label>
            <label class="onb-radio"><input type="radio" name="onb-policy" value="free"   ${cur === 'free'   ? 'checked' : ''}> <span><strong>Free Enter</strong><br><small>No code required — anyone with the link can join.</small></span></label>
        `;
    }
    function renderLanguage(root) {
        const cur = state.data.defaults.language;
        const items = (state.languages.length ? state.languages : [{ id: 'glossa', label: 'ΓΛΩΣΣΑ' }]);
        root.innerHTML = `
            <p class="onb-lead">Pick the language students will see by default. You can switch any time from the toolbar.</p>
            <div class="onb-radio-grid">
                ${items.map(l => `
                    <label class="onb-radio">
                        <input type="radio" name="onb-lang" value="${esc(l.id)}" ${cur === l.id ? 'checked' : ''}>
                        <span><strong>${esc(l.label)}</strong></span>
                    </label>`).join('')}
            </div>
        `;
    }
    function renderTheme(root) {
        const cur = state.data.defaults.theme;
        root.innerHTML = `
            <p class="onb-lead">Default appearance.</p>
            <label class="onb-radio"><input type="radio" name="onb-theme" value="dark"   ${cur === 'dark'   ? 'checked' : ''}> <span><strong>Dark</strong></span></label>
            <label class="onb-radio"><input type="radio" name="onb-theme" value="light"  ${cur === 'light'  ? 'checked' : ''}> <span><strong>Light</strong></span></label>
            <label class="onb-radio"><input type="radio" name="onb-theme" value="system" ${cur === 'system' ? 'checked' : ''}> <span><strong>Follow OS</strong></span></label>
        `;
    }
    function renderSharing(root) {
        const cur = state.data.sharing;
        root.innerHTML = `
            <p class="onb-lead">How will students reach the board?</p>
            <label class="onb-radio"><input type="radio" name="onb-share" value="local" ${cur.mode === 'local' ? 'checked' : ''}> <span><strong>Local network only</strong><br><small>Students join via your machine's IP. No public exposure.</small></span></label>
            <label class="onb-radio"><input type="radio" name="onb-share" value="ngrok" ${cur.mode === 'ngrok' ? 'checked' : ''}> <span><strong>Public tunnel (ngrok)</strong><br><small>Share a public URL with students anywhere.</small></span></label>
            <div class="onb-ngrok-fields" id="onb-ngrok-fields" ${cur.mode === 'ngrok' ? '' : 'hidden'}>
                <label class="onb-field"><span>ngrok authtoken</span><input id="onb-ngrok-token" type="password" value="${esc(cur.authtoken)}" placeholder="paste from dashboard.ngrok.com"></label>
                <label class="onb-field"><span>Region</span>
                    <select id="onb-ngrok-region">
                        <option value="eu" ${cur.region === 'eu' ? 'selected' : ''}>Europe</option>
                        <option value="us" ${cur.region === 'us' ? 'selected' : ''}>United States</option>
                        <option value="ap" ${cur.region === 'ap' ? 'selected' : ''}>Asia/Pacific</option>
                        <option value="au" ${cur.region === 'au' ? 'selected' : ''}>Australia</option>
                        <option value="sa" ${cur.region === 'sa' ? 'selected' : ''}>South America</option>
                        <option value="jp" ${cur.region === 'jp' ? 'selected' : ''}>Japan</option>
                        <option value="in" ${cur.region === 'in' ? 'selected' : ''}>India</option>
                    </select>
                </label>
                <p class="onb-hint">The token is stored locally in <code>data/ngrok.json</code> (gitignored). You can change it later in Settings → Sharing.</p>
            </div>
        `;
        root.querySelectorAll('input[name="onb-share"]').forEach(r => r.addEventListener('change', () => {
            const show = root.querySelector('input[name="onb-share"]:checked').value === 'ngrok';
            root.querySelector('#onb-ngrok-fields').hidden = !show;
        }));
    }
    function renderDone(root) {
        const d = state.data;
        const langLabel = (state.languages.find(l => l.id === d.defaults.language) || {}).label || d.defaults.language;
        root.innerHTML = `
            <p class="onb-lead">All set! Review your choices:</p>
            <ul class="onb-summary">
                <li><strong>Name:</strong> ${esc(d.profile.name)}</li>
                ${d.profile.email   ? `<li><strong>Email:</strong> ${esc(d.profile.email)}</li>` : ''}
                ${d.profile.phone   ? `<li><strong>Phone:</strong> ${esc(d.profile.phone)}</li>` : ''}
                ${d.profile.discord ? `<li><strong>Discord:</strong> ${esc(d.profile.discord)}</li>` : ''}
                <li><strong>Access code:</strong> ${esc(d.classroom.accessCodePolicy)}</li>
                <li><strong>Language:</strong> ${esc(langLabel)}</li>
                <li><strong>Theme:</strong> ${esc(d.defaults.theme)}</li>
                <li><strong>Sharing:</strong> ${esc(d.sharing.mode)}${d.sharing.mode === 'ngrok' && d.sharing.authtoken ? ' (token saved)' : ''}</li>
            </ul>
            <p class="onb-hint">Click <strong>Finish</strong> to save and reload the board.</p>
        `;
    }

    function esc(s) {
        return String(s == null ? '' : s)
            .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    }

    return { checkAndMaybeRun };
})();

if (typeof window !== 'undefined') window.OnboardingWizard = OnboardingWizard;
