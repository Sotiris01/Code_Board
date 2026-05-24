/**
 * uploadsGc — prune stale per-session upload folders on boot.
 *
 * Each server boot creates uploads/<UPLOAD_SESSION_ID>/, so historical
 * folders accumulate forever. On startup we drop any subfolder whose mtime
 * is older than UPLOADS_TTL_DAYS (default 7). The active session folder is
 * skipped because it is created later in the boot sequence.
 */

const fs = require('fs');
const path = require('path');

const DAY_MS = 24 * 60 * 60 * 1000;

function run(uploadsDir, options = {}) {
    const ttlDays = Number(
        options.ttlDays ?? process.env.UPLOADS_TTL_DAYS ?? 7
    );
    if (!Number.isFinite(ttlDays) || ttlDays <= 0) return { removed: 0, kept: 0 };

    let entries;
    try {
        entries = fs.readdirSync(uploadsDir, { withFileTypes: true });
    } catch (err) {
        if (err.code === 'ENOENT') return { removed: 0, kept: 0 };
        throw err;
    }

    const cutoff = Date.now() - ttlDays * DAY_MS;
    let removed = 0;
    let kept = 0;

    for (const entry of entries) {
        if (!entry.isDirectory()) continue;
        if (entry.name.startsWith('.')) continue; // .gitkeep, etc.

        const full = path.join(uploadsDir, entry.name);
        let stat;
        try {
            stat = fs.statSync(full);
        } catch {
            continue;
        }

        if (stat.mtimeMs < cutoff) {
            try {
                fs.rmSync(full, { recursive: true, force: true });
                removed++;
            } catch (err) {
                console.warn(`[uploadsGc] failed to remove ${full}:`, err.message);
            }
        } else {
            kept++;
        }
    }

    if (removed > 0) {
        console.log(`🧹 uploadsGc: removed ${removed} stale folder(s) (>${ttlDays}d), kept ${kept}`);
    }
    return { removed, kept };
}

module.exports = run;
module.exports.run = run;

/**
 * Phase 7.3 — schedule a daily run in addition to the boot pass.
 * Returns a cancel() function for tests / graceful shutdown.
 */
module.exports.schedule = function schedule(uploadsDir, options = {}) {
    const periodMs = Number(options.periodMs ?? 24 * 60 * 60 * 1000);
    const timer = setInterval(() => {
        try { run(uploadsDir, options); }
        catch (e) { console.warn('[uploadsGc] daily sweep failed:', e.message); }
    }, periodMs);
    timer.unref?.();
    return () => clearInterval(timer);
};
