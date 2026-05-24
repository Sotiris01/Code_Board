/**
 * Phase 10.2 — AutoPairs smoke test.
 *
 * AutoPairs is a UMD-ish browser script (no module exports). We load it
 * inside a fresh vm context with a minimal editor stub and assert that
 * typing `(` auto-closes to `()` with the caret left between the pair.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadAutoPairs() {
    const source = fs.readFileSync(
        path.join(__dirname, '..', '..', 'src', 'editor', 'input', 'AutoPairs.js'),
        'utf8'
    );
    const ctx = { LanguageRegistry: undefined, LanguageManager: undefined, console };
    vm.createContext(ctx);
    vm.runInContext(source + ';this.AutoPairs = AutoPairs;', ctx);
    return ctx.AutoPairs;
}

function makeEditor(lineText = '') {
    return {
        lines: [lineText],
        cursor: { row: 0, col: lineText.length },
        selection: { size: 0 },
        renderCount: 0,
        cursorNotifyCount: 0,
        insertTextAtCursor(text) {
            const line = this.lines[this.cursor.row];
            this.lines[this.cursor.row] =
                line.slice(0, this.cursor.col) + text + line.slice(this.cursor.col);
            this.cursor.col += text.length;
        },
        render() { this.renderCount++; },
        _notifyCursorChange() { this.cursorNotifyCount++; }
    };
}

test('AutoPairs auto-closes ( and leaves caret between the pair', () => {
    const AutoPairs = loadAutoPairs();
    const editor = makeEditor('');
    const handled = AutoPairs.handleInput(editor, '(');
    assert.equal(handled, true, 'AutoPairs should consume the keystroke');
    assert.equal(editor.lines[0], '()');
    assert.equal(editor.cursor.col, 1, 'caret sits between ( and )');
    assert.ok(editor.renderCount >= 1, 'editor.render was invoked');
});

test('AutoPairs auto-closes brackets and braces', () => {
    const AutoPairs = loadAutoPairs();
    for (const [open, close] of [['[', ']'], ['{', '}']]) {
        const editor = makeEditor('');
        assert.equal(AutoPairs.handleInput(editor, open), true);
        assert.equal(editor.lines[0], open + close);
        assert.equal(editor.cursor.col, 1);
    }
});

test('AutoPairs skips over an existing closer instead of duplicating', () => {
    const AutoPairs = loadAutoPairs();
    const editor = makeEditor('()');
    editor.cursor.col = 1; // caret between ( and )
    const handled = AutoPairs.handleInput(editor, ')');
    assert.equal(handled, true);
    assert.equal(editor.lines[0], '()');
    assert.equal(editor.cursor.col, 2, 'caret hopped past the closer');
});

test('AutoPairs does NOT auto-quote after a letter (apostrophe inside word)', () => {
    const AutoPairs = loadAutoPairs();
    const editor = makeEditor('don');
    const handled = AutoPairs.handleInput(editor, "'");
    assert.equal(handled, false, 'apostrophe should fall through to the editor');
    assert.equal(editor.lines[0], 'don', 'editor untouched (host handles the keystroke)');
});
