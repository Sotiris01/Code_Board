/**
 * Server-side mirror of the client `LanguageRegistry` (Phase 5.3).
 *
 * Reads `src/languages/registry.json` synchronously at boot to derive
 * the allowed file-extension whitelist for `/api/files` and
 * `/api/files/content`. Falls back to a sensible default if the file
 * is missing so the server still boots in degraded mode.
 */
const fs = require('fs');
const path = require('path');

const REGISTRY_FILE = path.join(__dirname, '..', '..', 'src', 'languages', 'registry.json');

// Non-language file types the file browser must still serve.
const COMMON_TEXT_EXT = ['.txt', '.md', '.json', '.xml', '.csv', '.js', '.html', '.css'];
const COMMON_BINARY_EXT = ['.pdf'];

let languages = [];

function load() {
    try {
        const raw = fs.readFileSync(REGISTRY_FILE, 'utf-8');
        const data = JSON.parse(raw);
        languages = Array.isArray(data.languages) ? data.languages : [];
    } catch (err) {
        console.warn('[languageRegistry] Could not load registry.json:', err.message);
        languages = [];
    }
}
load();

function ids() { return languages.map(l => l.id); }

function languageExtensions() {
    const set = new Set();
    for (const lang of languages) {
        for (const ext of (lang.fileExtensions || [])) set.add(ext.toLowerCase());
    }
    return Array.from(set);
}

/** Extensions accepted by `/api/files/content` (text-editable). */
function contentAllowedExtensions() {
    return Array.from(new Set([...languageExtensions(), '.md']));
}

/** Extensions surfaced by the shared-files tree (text + pdf + md). */
function browseAllowedExtensions() {
    return Array.from(new Set([
        ...languageExtensions(),
        '.md',
        ...COMMON_BINARY_EXT
    ]));
}

/** Extensions returned as text by /api/uploads (existing behaviour). */
function uploadsTextExtensions() {
    return Array.from(new Set([
        ...languageExtensions(),
        ...COMMON_TEXT_EXT
    ]));
}

module.exports = {
    reload: load,
    languages: () => languages.slice(),
    ids,
    languageExtensions,
    contentAllowedExtensions,
    browseAllowedExtensions,
    uploadsTextExtensions
};
