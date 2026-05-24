/**
 * SmartPaste — Phase 4.8
 *
 * When pasted text starts with a REPL / shell prompt on every line
 * (`>>> `, `... `, `$ `, `# ` for python sessions / bash sessions),
 * strip the prompt so the snippet is immediately runnable.
 */
const SmartPaste = (function () {

    const PROMPT_RE = /^(\s*)(>>> |\.\.\. |\$ )/;

    function strip(text) {
        const lines = text.split('\n');
        // Detect: AT LEAST one line matches, and every non-blank line either
        // matches OR is blank. This avoids accidentally stripping `$ ` from
        // the middle of normal prose.
        let prompted = 0, total = 0;
        for (const line of lines) {
            if (!line.trim()) continue;
            total++;
            if (PROMPT_RE.test(line)) prompted++;
        }
        if (prompted === 0 || prompted < total) return text;
        return lines.map(l => l.replace(PROMPT_RE, '$1')).join('\n');
    }

    return {
        enabled: true,
        transformPaste(_editor, text) {
            if (!this.enabled) return text;
            return strip(text);
        },
        // Exposed for tests / manual use.
        _strip: strip
    };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = SmartPaste;
