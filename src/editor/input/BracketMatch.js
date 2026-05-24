/**
 * BracketMatch — Phase 4.9
 *
 * When the caret sits immediately to the right of `( [ {` (or immediately
 * to the left of `) ] }`), highlight the matching partner with a CSS class
 * `bracket-match` applied to the cell `<span>` in the grid.
 *
 * The match is recomputed after every render via a small post-render hook
 * that subscribes to `onCursorChange`.
 */
const BracketMatch = (function () {

    const OPEN  = { '(': ')', '[': ']', '{': '}' };
    const CLOSE = { ')': '(', ']': '[', '}': '{' };

    function findMatch(lines, row, col, dir, open, close) {
        let depth = 1;
        if (dir === 1) {
            for (let r = row; r < lines.length; r++) {
                const line = lines[r];
                const start = r === row ? col : 0;
                for (let c = start; c < line.length; c++) {
                    const ch = line[c];
                    if (ch === open) depth++;
                    else if (ch === close) {
                        depth--;
                        if (depth === 0) return { row: r, col: c };
                    }
                }
            }
        } else {
            for (let r = row; r >= 0; r--) {
                const line = lines[r];
                const start = r === row ? col : line.length - 1;
                for (let c = start; c >= 0; c--) {
                    const ch = line[c];
                    if (ch === close) depth++;
                    else if (ch === open) {
                        depth--;
                        if (depth === 0) return { row: r, col: c };
                    }
                }
            }
        }
        return null;
    }

    function highlight(editor) {
        const root = editor.gridElement;
        if (!root) return;
        // Clear any previous markers.
        root.querySelectorAll('.bracket-match').forEach(el => el.classList.remove('bracket-match'));

        const { row, col } = editor.cursor;
        const line = editor.lines[row] || '';
        // Prefer the character immediately to the LEFT of the caret, then to the right.
        let here = null, dir = 0, open, close;
        const leftCh = line[col - 1];
        const rightCh = line[col];
        if (leftCh && OPEN[leftCh])       { here = { row, col: col - 1 }; dir = 1;  open = leftCh;  close = OPEN[leftCh]; }
        else if (leftCh && CLOSE[leftCh]) { here = { row, col: col - 1 }; dir = -1; open = CLOSE[leftCh]; close = leftCh; }
        else if (rightCh && OPEN[rightCh])  { here = { row, col }; dir = 1;  open = rightCh;  close = OPEN[rightCh]; }
        else if (rightCh && CLOSE[rightCh]) { here = { row, col }; dir = -1; open = CLOSE[rightCh]; close = rightCh; }
        if (!here) return;

        // Walk from the character AFTER `here` (in the search direction).
        const startSearch = dir === 1
            ? { row: here.row, col: here.col + 1 }
            : { row: here.row, col: here.col - 1 };
        const partner = findMatch(editor.lines, startSearch.row, startSearch.col, dir, open, close);
        if (!partner) return;

        const mark = (r, c) => {
            const cell = root.querySelector(`.grid-editor-cell[data-row="${r}"][data-col="${c}"]`);
            if (cell) cell.classList.add('bracket-match');
        };
        mark(here.row, here.col);
        mark(partner.row, partner.col);
    }

    return {
        enabled: true,
        init(editor) {
            const refresh = () => { if (this.enabled) requestAnimationFrame(() => highlight(editor)); };
            const prevCursorCb = editor.onCursorChange;
            editor.onCursorChange = (c) => { if (prevCursorCb) prevCursorCb(c); refresh(); };
            const prevContentCb = editor.onContentChange;
            editor.onContentChange = (v) => { if (prevContentCb) prevContentCb(v); refresh(); };
            refresh();
        }
    };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = BracketMatch;
