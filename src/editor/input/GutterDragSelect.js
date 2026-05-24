/**
 * GutterDragSelect — Phase 4.10
 *
 * Mousedown on the line-number gutter selects the entire clicked line.
 * Dragging extends the selection to all intermediate whole lines.
 */
const GutterDragSelect = (function () {

    let editor = null;
    let gutter = null;
    let dragging = false;
    let anchorRow = -1;

    function selectRange(from, to) {
        const [start, end] = from <= to ? [from, to] : [to, from];
        editor.selection.clear();
        for (let r = start; r <= end; r++) {
            const line = editor.lines[r] || '';
            for (let c = 0; c < Math.max(1, line.length); c++) {
                editor.selection.add(`${r},${c}`);
            }
        }
        editor.cursor = { row: end, col: editor.lines[end] ? editor.lines[end].length : 0 };
        editor.selectionAnchor = { row: start, col: 0 };
        editor.render();
        editor._notifyContentChange && editor._notifyContentChange();
        if (editor.onSelectionChange) editor.onSelectionChange(Array.from(editor.selection));
        if (editor.onCursorChange) editor.onCursorChange(editor.cursor);
    }

    function rowFromEvent(e) {
        // Line-number children are stacked top-to-bottom; pick the closest.
        const items = gutter.children;
        for (let i = 0; i < items.length; i++) {
            const r = items[i].getBoundingClientRect();
            if (e.clientY >= r.top && e.clientY <= r.bottom) return i;
        }
        // Fallback: last line.
        return Math.max(0, items.length - 1);
    }

    return {
        init(ed) {
            editor = ed;
            gutter = document.getElementById('line-numbers');
            if (!gutter) return;
            gutter.style.cursor = 'pointer';

            gutter.addEventListener('mousedown', (e) => {
                if (e.button !== 0) return;
                e.preventDefault();
                dragging = true;
                anchorRow = rowFromEvent(e);
                selectRange(anchorRow, anchorRow);
                editor.hiddenInput && editor.hiddenInput.focus();
            });

            document.addEventListener('mousemove', (e) => {
                if (!dragging) return;
                const row = rowFromEvent(e);
                selectRange(anchorRow, row);
            });

            document.addEventListener('mouseup', () => {
                dragging = false;
            });
        }
    };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = GutterDragSelect;
