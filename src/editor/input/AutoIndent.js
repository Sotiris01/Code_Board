/**
 * AutoIndent — Phase 4.2
 *
 * On Enter, copy the previous line's leading whitespace; add one extra
 * indent step if the previous line ends with a language-specific
 * "open block" trigger:
 *
 *   - Python   : trailing `:`
 *   - C++/Java : trailing `{`
 *   - GLOSSA   : starts with `ΑΡΧΗ`, `ΑΝ … ΤΟΤΕ`, `ΓΙΑ …`, `ΟΣΟ …`,
 *                `ΑΡΧΗ_ΕΠΑΝΑΛΗΨΗΣ`, `ΕΠΙΛΕΞΕ`, `ΣΥΝΑΡΤΗΣΗ`, `ΔΙΑΔΙΚΑΣΙΑ`.
 *
 * When the user types a "close block" trigger (`}` for C/Java,
 * `ΤΕΛΟΣ_…` keywords for GLOSSA) on an otherwise blank, fully
 * whitespace line, dedent that line by one indent step.
 */
const AutoIndent = (function () {

    const GLOSSA_OPEN_RE = /^\s*(ΑΡΧΗ|ΑΝ\s+.+\s+ΤΟΤΕ\s*$|ΓΙΑ\b|ΟΣΟ\b|ΑΡΧΗ_ΕΠΑΝΑΛΗΨΗΣ\b|ΕΠΙΛΕΞΕ\b|ΣΥΝΑΡΤΗΣΗ\b|ΔΙΑΔΙΚΑΣΙΑ\b|ΑΛΛΙΩΣ\s*$|ΑΛΛΙΩΣ_ΑΝ\b|ΠΕΡΙΠΤΩΣΗ\b)/;
    const GLOSSA_CLOSE_RE = /^\s*(ΤΕΛΟΣ_ΕΠΑΝΑΛΗΨΗΣ|ΤΕΛΟΣ_ΑΝ|ΤΕΛΟΣ_ΕΠΙΛΟΓΩΝ|ΤΕΛΟΣ_ΣΥΝΑΡΤΗΣΗΣ|ΤΕΛΟΣ_ΔΙΑΔΙΚΑΣΙΑΣ|ΤΕΛΟΣ_ΠΡΟΓΡΑΜΜΑΤΟΣ|ΜΕΧΡΙΣ_ΟΤΟΥ\b)/;

    function currentLanguage() {
        if (typeof LanguageManager !== 'undefined' && LanguageManager.getCurrentLanguage) {
            return LanguageManager.getCurrentLanguage() || 'glossa';
        }
        return 'glossa';
    }

    function leadingWhitespace(line) {
        const m = line.match(/^[\t ]*/);
        return m ? m[0] : '';
    }

    function shouldIndentMore(prevLine, lang) {
        const trimmed = prevLine.replace(/\s+$/, '');
        if (!trimmed) return false;
        switch (lang) {
            case 'python':
                return /:\s*(#.*)?$/.test(trimmed);
            case 'cpp':
            case 'java':
                return /\{\s*(\/\/.*)?$/.test(trimmed);
            case 'glossa':
                return GLOSSA_OPEN_RE.test(prevLine);
            default:
                return /[\{:]\s*$/.test(trimmed);
        }
    }

    function shouldDedentClose(line, typedChar, lang) {
        // The line consists only of whitespace + the typed close-token.
        const after = line; // current line content AFTER the just-typed char insertion
        if (lang === 'cpp' || lang === 'java') {
            return typedChar === '}' && /^\s*\}\s*$/.test(after);
        }
        if (lang === 'glossa') {
            return GLOSSA_CLOSE_RE.test(after);
        }
        return false;
    }

    return {
        enabled: true,

        handleEnter(editor) {
            if (!this.enabled) return false;
            if (editor.selection.size > 0) return false;
            const lang = currentLanguage();
            const { row, col } = editor.cursor;
            const line = editor.lines[row] || '';
            const indent = leadingWhitespace(line);
            const before = line.slice(0, col);
            const extra = shouldIndentMore(before, lang) ? editor.getIndentUnit() : '';
            const insertion = '\n' + indent + extra;
            editor.insertTextAtCursor(insertion);
            return true;
        },

        // Called AFTER text is inserted via handleInput (we let AutoPairs +
        // default insert run first; this hook is invoked from the input
        // pipeline by returning false then post-processing via handleInput
        // wrap-around). To keep things simple we react on the immediate
        // post-state via a microtask.
        handleInput(editor, text) {
            if (!this.enabled) return false;
            if (text.length !== 1) return false;
            const lang = currentLanguage();
            if (lang !== 'cpp' && lang !== 'java' && lang !== 'glossa') return false;
            // We don't swallow the input — let it insert normally, then
            // dedent on the next tick if appropriate.
            queueMicrotask(() => {
                const { row } = editor.cursor;
                const line = editor.lines[row] || '';
                if (!shouldDedentClose(line, text, lang)) return;
                const unit = editor.getIndentUnit();
                if (!line.startsWith(unit)) return;
                const newLine = line.slice(unit.length);
                editor.replaceLines(row, row, [newLine]);
                editor.cursor = { row, col: Math.max(0, newLine.length) };
                editor.render();
                editor._notifyCursorChange && editor._notifyCursorChange();
            });
            return false;
        }
    };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = AutoIndent;
