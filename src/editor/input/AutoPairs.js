/**
 * AutoPairs — Phase 4.1
 *
 * Auto-closes `( [ { " ' \``; skips over the closer if the user types it;
 * deletes the matching pair on backspace when the caret sits between the
 * two halves.
 */
const AutoPairs = (function () {

    // Per-language overrides come from LanguageManager when available; fall back
    // to a sensible default that works for all of Python/C++/Java/GLOSSA.
    const DEFAULT_PAIRS = {
        '(': ')',
        '[': ']',
        '{': '}',
        '"': '"',
        "'": "'",
        '`': '`'
    };

    function pairsForCurrentLanguage() {
        if (typeof LanguageRegistry !== 'undefined' && typeof LanguageManager !== 'undefined') {
            const id = LanguageManager.getCurrentLanguage && LanguageManager.getCurrentLanguage();
            const plugin = id && LanguageRegistry.get && LanguageRegistry.get(id);
            if (plugin && plugin.autoPairs) return plugin.autoPairs;
        }
        return DEFAULT_PAIRS;
    }

    function charAt(editor, row, col) {
        const line = editor.lines[row] || '';
        return line[col] || '';
    }

    return {
        enabled: true,

        handleInput(editor, text) {
            if (!this.enabled || text.length !== 1) return false;
            const pairs = pairsForCurrentLanguage();
            const opener = text;
            const next = charAt(editor, editor.cursor.row, editor.cursor.col);

            // Skip-over: typing the same closer that already sits to the right
            // simply hops the caret over it instead of duplicating it.
            const isCloser = Object.values(pairs).includes(opener);
            if (isCloser && next === opener) {
                editor.cursor.col += 1;
                editor.render();
                editor._notifyCursorChange && editor._notifyCursorChange();
                return true;
            }

            // Auto-close: insert opener + closer, leave caret between them.
            if (pairs[opener]) {
                // For quote characters, do NOT auto-pair when the previous char
                // is alphanumeric (avoids `don't` becoming `don''t`).
                if (opener === '"' || opener === "'") {
                    const prev = charAt(editor, editor.cursor.row, editor.cursor.col - 1);
                    if (/[A-Za-zΑ-Ωα-ω0-9_]/.test(prev)) return false;
                }
                const closer = pairs[opener];
                editor.insertTextAtCursor(opener + closer);
                // Move caret back into the pair.
                editor.cursor.col -= closer.length;
                editor.render();
                editor._notifyCursorChange && editor._notifyCursorChange();
                return true;
            }

            return false;
        },

        handleBackspace(editor) {
            if (!this.enabled) return false;
            if (editor.selection.size > 0) return false;
            const pairs = pairsForCurrentLanguage();
            const { row, col } = editor.cursor;
            const prev = charAt(editor, row, col - 1);
            const next = charAt(editor, row, col);
            if (pairs[prev] && pairs[prev] === next) {
                // Delete both halves of the pair in one undo step.
                editor.replaceRange({ row, col: col - 1 }, { row, col: col + 1 }, '');
                return true;
            }
            return false;
        }
    };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = AutoPairs;
