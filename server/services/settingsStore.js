/**
 * settingsStore — Phase 6.A.
 *
 * Owns data/settings.json (the post-onboarding teacher preferences) and
 * data/ngrok.json (authtoken kept out of git). Both files live under the
 * runtime-editable data/ directory created in Phase 0.
 */
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.join(__dirname, '..', '..');
const SETTINGS_FILE = path.join(ROOT_DIR, 'data', 'settings.json');
const NGROK_FILE    = path.join(ROOT_DIR, 'data', 'ngrok.json');

function exists() {
    return fs.existsSync(SETTINGS_FILE);
}

function load() {
    try {
        if (!exists()) return null;
        return JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf-8'));
    } catch (e) {
        console.error('[settingsStore] load failed:', e.message);
        return null;
    }
}

function save(settings) {
    const payload = Object.assign({}, settings, {
        version: 1,
        completedAt: settings.completedAt || new Date().toISOString()
    });
    fs.mkdirSync(path.dirname(SETTINGS_FILE), { recursive: true });
    fs.writeFileSync(SETTINGS_FILE, JSON.stringify(payload, null, 2), 'utf-8');
    return payload;
}

function saveNgrok({ authtoken, region }) {
    if (!authtoken) return false;
    fs.mkdirSync(path.dirname(NGROK_FILE), { recursive: true });
    fs.writeFileSync(NGROK_FILE, JSON.stringify({
        authtoken,
        region: region || 'eu',
        savedAt: new Date().toISOString()
    }, null, 2), 'utf-8');
    return true;
}

function loadNgrok() {
    try {
        if (!fs.existsSync(NGROK_FILE)) return null;
        return JSON.parse(fs.readFileSync(NGROK_FILE, 'utf-8'));
    } catch { return null; }
}

// ────────────────────────────────────────────────────────────────────
// Phase 6.B helpers
// ────────────────────────────────────────────────────────────────────

function defaults() {
    return {
        profile: { name: '', email: '', phone: '', discord: '' },
        classroom: {
            accessCodePolicy: 'fixed',     // 'fixed' | 'rotate' | 'free'
            freeEnterDefault: false,
            autoClearOnNewSession: false,
            handRaiseTimeoutSec: 0          // 0 = no timeout
        },
        defaults: { language: 'glossa', theme: 'dark' },
        editor: {
            softWrap: false,
            tabSize: 3,
            useTabs: false,
            autoPairs: true,
            autoIndent: true,
            fontSize: 18,
            fontFamily: "Consolas, 'Courier New', monospace"
        },
        sharing: { mode: 'local', region: 'eu', customDomain: '' },
        storage: { uploadsTtlDays: 7 }
    };
}

function isPlainObject(v) {
    return v && typeof v === 'object' && !Array.isArray(v);
}

function deepMerge(base, patch) {
    if (!isPlainObject(patch)) return base;
    const out = Object.assign({}, base);
    for (const k of Object.keys(patch)) {
        const pv = patch[k];
        if (isPlainObject(pv) && isPlainObject(out[k])) {
            out[k] = deepMerge(out[k], pv);
        } else if (pv !== undefined) {
            out[k] = pv;
        }
    }
    return out;
}

/** Load settings merged on top of defaults (so new fields surface). */
function loadMerged() {
    return deepMerge(defaults(), load() || {});
}

/** Deep-merge a partial patch into settings.json and persist. */
function update(patch) {
    const current = loadMerged();
    const next = deepMerge(current, patch || {});
    return save(next);
}

/**
 * Phase 6.C — pre-seed settings.json from CODE_BOARD_* env vars.
 * Only runs when settings.json is missing AND at least one matching
 * variable is present, so the wizard is skipped on first boot. Returns
 * the saved object or null when nothing was written.
 */
function seedFromEnv(env) {
    if (exists()) return null;
    const E = env || process.env;

    const map = {
        'CODE_BOARD_PROFILE_NAME':                 ['profile', 'name'],
        'CODE_BOARD_PROFILE_EMAIL':                ['profile', 'email'],
        'CODE_BOARD_PROFILE_PHONE':                ['profile', 'phone'],
        'CODE_BOARD_PROFILE_DISCORD':              ['profile', 'discord'],
        'CODE_BOARD_CLASSROOM_ACCESS_CODE_POLICY': ['classroom', 'accessCodePolicy'],
        'CODE_BOARD_CLASSROOM_FREE_ENTER_DEFAULT': ['classroom', 'freeEnterDefault'],
        'CODE_BOARD_CLASSROOM_AUTO_CLEAR':         ['classroom', 'autoClearOnNewSession'],
        'CODE_BOARD_CLASSROOM_HAND_RAISE_TIMEOUT': ['classroom', 'handRaiseTimeoutSec'],
        'CODE_BOARD_DEFAULT_LANGUAGE':             ['defaults', 'language'],
        'CODE_BOARD_DEFAULT_THEME':                ['defaults', 'theme'],
        'CODE_BOARD_EDITOR_SOFT_WRAP':             ['editor', 'softWrap'],
        'CODE_BOARD_EDITOR_TAB_SIZE':              ['editor', 'tabSize'],
        'CODE_BOARD_EDITOR_USE_TABS':              ['editor', 'useTabs'],
        'CODE_BOARD_EDITOR_AUTO_PAIRS':            ['editor', 'autoPairs'],
        'CODE_BOARD_EDITOR_AUTO_INDENT':           ['editor', 'autoIndent'],
        'CODE_BOARD_EDITOR_FONT_SIZE':             ['editor', 'fontSize'],
        'CODE_BOARD_EDITOR_FONT_FAMILY':           ['editor', 'fontFamily'],
        'CODE_BOARD_SHARING_MODE':                 ['sharing', 'mode'],
        'CODE_BOARD_SHARING_REGION':               ['sharing', 'region'],
        'CODE_BOARD_SHARING_CUSTOM_DOMAIN':        ['sharing', 'customDomain'],
        'CODE_BOARD_STORAGE_UPLOADS_TTL_DAYS':     ['storage', 'uploadsTtlDays']
    };

    const present = Object.keys(map).filter(k => E[k] !== undefined && E[k] !== '');
    if (present.length === 0) return null;

    const coerce = (v) => {
        const s = String(v).trim();
        if (/^(true|yes|on|1)$/i.test(s)) return true;
        if (/^(false|no|off|0)$/i.test(s)) return false;
        if (/^-?\d+(\.\d+)?$/.test(s)) return Number(s);
        return s;
    };

    const seed = defaults();
    for (const k of present) {
        const [section, field] = map[k];
        seed[section][field] = coerce(E[k]);
    }

    // Optional ngrok token via env (kept in its own file).
    if (E.CODE_BOARD_NGROK_AUTHTOKEN) {
        saveNgrok({
            authtoken: String(E.CODE_BOARD_NGROK_AUTHTOKEN).trim(),
            region: E.CODE_BOARD_NGROK_REGION || seed.sharing.region
        });
    }

    return save(seed);
}

module.exports = {
    exists, load, save, saveNgrok, loadNgrok,
    defaults, loadMerged, update, deepMerge, seedFromEnv,
    SETTINGS_FILE, NGROK_FILE
};
