/**
 * Phase 8.1 / 8.2 — Rotating session snapshots + append-only event log.
 *
 * Layout (all under data/sessions/):
 *   YYYY-MM-DD.json        snapshot (latest known code state for that day)
 *   YYYY-MM-DD.events.jsonl  append-only ops log (one JSON per line)
 *   current.json | current  pointer (symlink when permitted, JSON fallback)
 *
 * The snapshot is rotated by date (one per calendar day) so a teacher
 * can recover yesterday's board even if today's gets clobbered. The
 * event log carries `fast-diff` patches for `code_update` and is the
 * basis for the Phase 9 replay feature.
 */

const fs = require('fs');
const path = require('path');
const diff = require('fast-diff');

const SESSIONS_DIR  = path.join(__dirname, '..', '..', 'data', 'sessions');
const CURRENT_JSON  = path.join(SESSIONS_DIR, 'current.json');
const CURRENT_LINK  = path.join(SESSIONS_DIR, 'current');

fs.mkdirSync(SESSIONS_DIR, { recursive: true });

function todayKey(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
}

function snapshotPath(key = todayKey()) {
    return path.join(SESSIONS_DIR, `${key}.json`);
}
function eventsPath(key = todayKey()) {
    return path.join(SESSIONS_DIR, `${key}.events.jsonl`);
}

/** Write today's snapshot synchronously and refresh the `current` pointer. */
function saveSnapshot(state) {
    const key = todayKey();
    const file = snapshotPath(key);
    const payload = {
        key,
        savedAt: new Date().toISOString(),
        code: state.code ?? '',
        lastUpdatedBy: state.lastUpdatedBy ?? null,
        language: state.language ?? null,
        theme: state.theme ?? null
    };
    fs.writeFileSync(file, JSON.stringify(payload, null, 2), 'utf8');
    updateCurrentPointer(file);
    return payload;
}

/** Try a real symlink; on EPERM/EEXIST/ENOTSUP fall back to a JSON pointer. */
function updateCurrentPointer(target) {
    const name = path.basename(target);
    try {
        try { fs.unlinkSync(CURRENT_LINK); } catch {}
        fs.symlinkSync(name, CURRENT_LINK, 'file');
    } catch {
        try {
            fs.writeFileSync(CURRENT_JSON, JSON.stringify({ file: name }, null, 2), 'utf8');
        } catch (e) {
            console.warn('[sessionStore] could not update current pointer:', e.message);
        }
    }
}

/** Resolve the latest snapshot — symlink, JSON pointer, or newest by mtime. */
function loadLatest() {
    try {
        if (fs.existsSync(CURRENT_LINK)) {
            const real = fs.readlinkSync(CURRENT_LINK);
            const full = path.isAbsolute(real) ? real : path.join(SESSIONS_DIR, real);
            return JSON.parse(fs.readFileSync(full, 'utf8'));
        }
    } catch {}
    try {
        if (fs.existsSync(CURRENT_JSON)) {
            const ptr = JSON.parse(fs.readFileSync(CURRENT_JSON, 'utf8'));
            const full = path.join(SESSIONS_DIR, ptr.file);
            return JSON.parse(fs.readFileSync(full, 'utf8'));
        }
    } catch {}
    // Fallback: newest YYYY-MM-DD.json
    const list = listSessions();
    if (list.length === 0) return null;
    try { return JSON.parse(fs.readFileSync(snapshotPath(list[0].key), 'utf8')); }
    catch { return null; }
}

/** Sorted (newest first) list of available daily snapshots. */
function listSessions() {
    let entries;
    try { entries = fs.readdirSync(SESSIONS_DIR); }
    catch { return []; }
    return entries
        .filter(f => /^\d{4}-\d{2}-\d{2}\.json$/.test(f))
        .map(f => {
            const key = f.replace(/\.json$/, '');
            const full = path.join(SESSIONS_DIR, f);
            const stat = (() => { try { return fs.statSync(full); } catch { return null; } })();
            return { key, file: f, bytes: stat?.size || 0, mtime: stat?.mtimeMs || 0 };
        })
        .sort((a, b) => b.mtime - a.mtime);
}

let lastCode = '';
function setBaseline(code) {
    lastCode = String(code ?? '');
    // Phase 9.3 — record the baseline so replay can reconstruct from a non-empty start.
    try {
        const file = eventsPath(todayKey());
        // Only seed once per file: skip if a baseline already exists.
        let alreadySeeded = false;
        if (fs.existsSync(file)) {
            // Cheap check: scan the first ~4KB for a baseline marker.
            try {
                const head = fs.readFileSync(file, 'utf8').slice(0, 4096);
                alreadySeeded = head.includes('"type":"baseline"');
            } catch { /* ignore */ }
        }
        if (!alreadySeeded && lastCode.length > 0) {
            fs.appendFile(file,
                JSON.stringify({ t: Date.now(), type: 'baseline', code: lastCode }) + '\n',
                (err) => { if (err) console.warn('[sessionStore] baseline write:', err.message); });
        }
    } catch (e) {
        console.warn('[sessionStore] setBaseline marker failed:', e.message);
    }
}

/**
 * Append one event to today's log. For `code_update` we record a
 * `fast-diff` patch against the previous code so the file stays
 * compact even for long sessions.
 */
function appendEvent(event) {
    try {
        const key = todayKey();
        const file = eventsPath(key);
        let line = { t: Date.now(), ...event };

        if (event.type === 'code_update' && typeof event.code === 'string') {
            const patch = diff(lastCode, event.code);
            line = { t: line.t, type: 'code_update', by: event.by ?? null, patch };
            lastCode = event.code;
        }

        fs.appendFile(file, JSON.stringify(line) + '\n', (err) => {
            if (err) console.warn('[sessionStore] appendEvent:', err.message);
        });
    } catch (e) {
        console.warn('[sessionStore] appendEvent failed:', e.message);
    }
}

module.exports = {
    SESSIONS_DIR,
    todayKey,
    snapshotPath, eventsPath,
    saveSnapshot, loadLatest, listSessions,
    setBaseline, appendEvent,
    updateCurrentPointer
};
