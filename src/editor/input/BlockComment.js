/**
 * BlockComment — Phase 4.3
 *
 * `Ctrl+/` toggles a line-comment prefix on the cursor line, or on every
 * line touched by the current selection. Comment marker is derived from
 * the active language:
 *
 *   python                → `# `
 *   cpp, java             → `// `
 *   glossa                → `! `
 */
const BlockComment = (function () {

    function markerFor(lang) {
        switch (lang) {
            case 'python': return '# ';
            case 'glossa': return '! ';
            case 'cpp':
            case 'java':
            default:       return '// ';
        }
    }

    function currentLanguage() {
        if (typeof LanguageManager !== 'undefined' && LanguageManager.getCurrentLanguage) {
            return LanguageManager.getCurrentLanguage() || 'glossa';
        }
        return 'glossa';
    }

    function selectionRowRange(editor) {
        if (editor.selection.size === 0) {
            return [editor.cursor.row, editor.cursor.row];
        }
        let min = Infinity, max = -Infinity;
        for (const key of editor.selection) {
            const r = +key.split(',')[0];
            if (r < min) min = r;
            if (r > max) max = r;
        }
        return [min, max];
    }

    return {
        enabled: true,

        handleKeyDown(editor, e) {
            if (!this.enabled) return false;
            const ctrl = e.ctrlKey || e.metaKey;
            if (!ctrl) return false;
            if (e.key !== '/' && e.key !== '?') return false;
            e.preventDefault();
            if (editor.readOnly) return true;

            const marker = markerFor(currentLanguage());
            const trimmedMarker = marker.trimEnd();
            const [startRow, endRow] = selectionRowRange(editor);

            // Decide: if EVERY non-empty line in the range starts with the
            // marker, we uncomment; otherwise we comment.
            let shouldComment = false;
            for (let r = startRow; r <= endRow; r++) {
                const line = editor.lines[r] || '';
                if (!line.trim()) continue;
                if (!line.trimStart().startsWith(trimmedMarker)) { shouldComment = true; break; }
            }

            const newLines = [];
            for (let r = startRow; r <= endRow; r++) {
                const line = editor.lines[r] || '';
                if (shouldComment) {
                    if (!line.trim()) { newLines.push(line); continue; }
                    const lead = line.match(/^[\t ]*/)[0];
                    newLines.push(lead + marker + line.slice(lead.length));
                } else {
                    const lead = line.match(/^[\t ]*/)[0];
                    const rest = line.slice(lead.length);
                    if (rest.startsWith(marker)) newLines.push(lead + rest.slice(marker.length));
                    else if (rest.startsWith(trimmedMarker)) newLines.push(lead + rest.slice(trimmedMarker.length));
                    else newLines.push(line);
                }
            }

            editor.replaceLines(startRow, endRow, newLines);
            return true;
        }
    };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = BlockComment;
