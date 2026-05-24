/**
 * MultiCursor — Phase 4.6 (scaffold)
 *
 * Alt+click on the grid adds a secondary caret marker on the clicked
 * cell, rendered as a translucent overlay. Press Esc to clear.
 *
 * NOTE: this is intentionally a scaffold — full multi-edit (typing
 * into every secondary caret) requires a deeper refactor of GridEditor's
 * single-cursor edit pipeline and is deferred to a follow-up phase.
 * The scaffold lets the teacher *visually* pin reference points
 * during a live walkthrough.
 */
const MultiCursor = (function () {

    let editor = null;
    let extras = []; // [{ row, col }]
    let layer = null;

    function ensureLayer() {
        if (layer) return layer;
        layer = document.createElement('div');
        layer.className = 'multi-cursor-layer';
        layer.style.cssText = 'position:absolute;inset:0;pointer-events:none;z-index:5;';
        editor.gridElement.style.position = editor.gridElement.style.position || 'relative';
        editor.gridElement.appendChild(layer);
        return layer;
    }

    function repaint() {
        if (!layer) return;
        layer.innerHTML = '';
        for (const c of extras) {
            const cell = editor.gridElement.querySelector(
                `.grid-editor-cell[data-row="${c.row}"][data-col="${c.col}"]`);
            if (!cell) continue;
            const rect = cell.getBoundingClientRect();
            const host = editor.gridElement.getBoundingClientRect();
            const dot = document.createElement('div');
            dot.className = 'multi-cursor-mark';
            dot.style.cssText = `position:absolute;left:${rect.left - host.left}px;top:${rect.top - host.top}px;width:2px;height:${rect.height}px;background:#f59e0b;`;
            layer.appendChild(dot);
        }
    }

    function clear() {
        extras = [];
        if (layer) layer.innerHTML = '';
    }

    return {
        enabled: true,
        init(ed) {
            editor = ed;
            ensureLayer();

            editor.gridElement.addEventListener('mousedown', (e) => {
                if (!this.enabled) return;
                if (!e.altKey) return;
                const cell = e.target.closest('.grid-editor-cell');
                if (!cell) return;
                e.preventDefault();
                e.stopPropagation();
                const row = +cell.dataset.row;
                const col = +cell.dataset.col;
                // Toggle: clicking on an existing marker removes it.
                const idx = extras.findIndex(c => c.row === row && c.col === col);
                if (idx >= 0) extras.splice(idx, 1);
                else extras.push({ row, col });
                repaint();
            }, true);

            // Repaint after each render.
            const prevContent = editor.onContentChange;
            editor.onContentChange = (v) => {
                if (prevContent) prevContent(v);
                if (extras.length) requestAnimationFrame(repaint);
            };
            const prevCursor = editor.onCursorChange;
            editor.onCursorChange = (c) => {
                if (prevCursor) prevCursor(c);
                if (extras.length) requestAnimationFrame(repaint);
            };
        },
        handleKeyDown(_ed, e) {
            if (e.key === 'Escape' && extras.length) {
                clear();
                return true;
            }
            return false;
        }
    };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = MultiCursor;
