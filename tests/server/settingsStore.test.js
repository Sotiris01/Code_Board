/**
 * Phase 10.1 — settings deep-merge round-trip (covers the "settings save
 * round-trip" check listed under client tests in Phase 10.2, exercised
 * against the canonical store on the server side where the merge lives).
 */
const test = require('node:test');
const assert = require('node:assert/strict');

const store = require('../../server/services/settingsStore');

test('loadMerged surfaces every default section', () => {
    const merged = store.loadMerged();
    for (const section of ['profile', 'classroom', 'defaults', 'editor', 'sharing', 'storage']) {
        assert.ok(merged[section], `expected merged.${section}`);
    }
    assert.equal(typeof merged.editor.tabSize, 'number');
    assert.equal(typeof merged.editor.fontSize, 'number');
});

test('deepMerge leaves untouched siblings intact', () => {
    // Build a patch in-memory using update()'s deep-merge semantics:
    // we only verify the merge function via loadMerged → patch → loadMerged
    // without actually persisting (use a snapshot/restore pattern).
    const fs = require('node:fs');
    const path = require('node:path');
    const SETTINGS = path.join(__dirname, '..', '..', 'data', 'settings.json');

    const had = fs.existsSync(SETTINGS);
    const backup = had ? fs.readFileSync(SETTINGS) : null;

    try {
        store.update({ editor: { tabSize: 7 } });
        const after = store.loadMerged();
        assert.equal(after.editor.tabSize, 7);
        // Other editor fields preserved from defaults / prior values.
        assert.equal(typeof after.editor.fontSize, 'number');
        // Other top-level sections untouched.
        assert.ok(after.defaults);
    } finally {
        if (backup !== null) fs.writeFileSync(SETTINGS, backup);
        else if (fs.existsSync(SETTINGS)) fs.unlinkSync(SETTINGS);
    }
});
