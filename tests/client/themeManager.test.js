/**
 * Phase 10.2 — ThemeManager persistence smoke test.
 *
 * ThemeManager lives inside UIManager.js as a self-contained object
 * literal. We extract just that block and evaluate it against a
 * minimal DOM stub, then assert that toggling persists the value
 * under `aepp-theme` (the contract every client relies on).
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadThemeManager() {
    const source = fs.readFileSync(
        path.join(__dirname, '..', '..', 'src', 'components', 'UIManager.js'),
        'utf8'
    );
    // Slice ThemeManager from the file (object-literal block between its
    // declaration and the ThemeToggle alias on the line below).
    const start = source.indexOf('const ThemeManager = {');
    const end   = source.indexOf('const ThemeToggle = ThemeManager;');
    if (start < 0 || end < 0) throw new Error('ThemeManager block not found in UIManager.js');
    const snippet = source.slice(start, end);

    const storage = new Map();
    const docEl = { attrs: {}, setAttribute(k, v) { this.attrs[k] = v; } };
    const body  = { classList: { remove() {} } };
    const ctx = {
        document: {
            documentElement: docEl,
            body,
            getElementById: () => null,
            querySelector: () => null,
            addEventListener: () => {}
        },
        localStorage: {
            getItem: (k) => storage.has(k) ? storage.get(k) : null,
            setItem: (k, v) => storage.set(k, String(v)),
            removeItem: (k) => storage.delete(k)
        },
        console,
        Collaboration: undefined
    };
    vm.createContext(ctx);
    vm.runInContext(snippet + ';this.ThemeManager = ThemeManager;', ctx);
    return { ThemeManager: ctx.ThemeManager, storage, docEl };
}

test('ThemeManager.apply persists the theme under aepp-theme', () => {
    const { ThemeManager, storage, docEl } = loadThemeManager();
    ThemeManager.apply('light');
    assert.equal(storage.get('aepp-theme'), 'light');
    assert.equal(docEl.attrs['data-theme'], 'light');

    ThemeManager.apply('dark');
    assert.equal(storage.get('aepp-theme'), 'dark');
    assert.equal(docEl.attrs['data-theme'], 'dark');
});

test('ThemeManager.toggle flips between light and dark', () => {
    const { ThemeManager, storage } = loadThemeManager();
    ThemeManager.apply('light');
    ThemeManager.toggle();
    assert.equal(storage.get('aepp-theme'), 'dark');
    ThemeManager.toggle();
    assert.equal(storage.get('aepp-theme'), 'light');
});

test('ThemeManager.apply ignores invalid theme names', () => {
    const { ThemeManager, storage, docEl } = loadThemeManager();
    ThemeManager.apply('dark');
    ThemeManager.apply('rainbow');
    assert.equal(storage.get('aepp-theme'), 'dark', 'invalid theme did not overwrite');
    assert.equal(docEl.attrs['data-theme'], 'dark');
});
