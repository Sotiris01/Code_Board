/**
 * FindReplace — Phase 4.7
 *
 * Floating panel docked at the top-right of the editor container.
 *   - Ctrl+F            → open Find
 *   - Ctrl+H            → open Find + Replace
 *   - Enter / F3        → next match (Shift+Enter / Shift+F3 → previous)
 *   - Esc               → close
 *   - "Replace" button  → replace current match
 *   - "Replace All"     → replace every match
 *
 * Options: case-sensitive, whole-word, regex. Matches are highlighted by
 * appending `.find-match` (current → `.find-match-current`) on the grid
 * cells.
 */
const FindReplace = (function () {

    let editor = null;
    let panel = null;
    let inputFind = null;
    let inputReplace = null;
    let chkCase = null;
    let chkWord = null;
    let chkRegex = null;
    let counter = null;

    let matches = [];           // [{ row, colStart, colEnd }]
    let currentIndex = -1;

    function buildPanel() {
        panel = document.createElement('div');
        panel.className = 'find-replace-panel';
        panel.hidden = true;
        panel.innerHTML = `
            <div class="fr-row">
                <input type="text" class="fr-find" placeholder="Εύρεση…" />
                <span class="fr-counter">0/0</span>
                <button class="fr-prev"  title="Προηγούμενο (Shift+Enter)">‹</button>
                <button class="fr-next"  title="Επόμενο (Enter)">›</button>
                <button class="fr-close" title="Κλείσιμο (Esc)">✕</button>
            </div>
            <div class="fr-row fr-replace-row">
                <input type="text" class="fr-replace" placeholder="Αντικατάσταση…" />
                <button class="fr-replace-one">Αντικ.</button>
                <button class="fr-replace-all">Όλα</button>
            </div>
            <div class="fr-row fr-opts">
                <label><input type="checkbox" class="fr-case"> Aa</label>
                <label><input type="checkbox" class="fr-word"> ⏚</label>
                <label><input type="checkbox" class="fr-regex"> .*</label>
            </div>
        `;
        const host = editor.gridElement.closest('.editor-container') || editor.gridElement.parentElement;
        host.style.position = host.style.position || 'relative';
        host.appendChild(panel);

        inputFind    = panel.querySelector('.fr-find');
        inputReplace = panel.querySelector('.fr-replace');
        counter      = panel.querySelector('.fr-counter');
        chkCase      = panel.querySelector('.fr-case');
        chkWord      = panel.querySelector('.fr-word');
        chkRegex     = panel.querySelector('.fr-regex');

        panel.querySelector('.fr-close').addEventListener('click', close);
        panel.querySelector('.fr-prev').addEventListener('click',  () => step(-1));
        panel.querySelector('.fr-next').addEventListener('click',  () => step( 1));
        panel.querySelector('.fr-replace-one').addEventListener('click', replaceOne);
        panel.querySelector('.fr-replace-all').addEventListener('click', replaceAll);

        for (const el of [inputFind, chkCase, chkWord, chkRegex]) {
            el.addEventListener('input', recompute);
        }
        inputFind.addEventListener('keydown', (e) => {
            if (e.key === 'Enter')      { e.preventDefault(); step(e.shiftKey ? -1 : 1); }
            else if (e.key === 'Escape'){ e.preventDefault(); close(); }
        });
        inputReplace.addEventListener('keydown', (e) => {
            if (e.key === 'Enter')      { e.preventDefault(); replaceOne(); }
            else if (e.key === 'Escape'){ e.preventDefault(); close(); }
        });
    }

    function open(withReplace) {
        if (!panel) buildPanel();
        panel.hidden = false;
        panel.classList.toggle('fr-with-replace', !!withReplace);
        inputFind.focus();
        inputFind.select();
        recompute();
    }

    function close() {
        if (!panel) return;
        panel.hidden = true;
        matches = [];
        currentIndex = -1;
        repaint();
        editor.hiddenInput && editor.hiddenInput.focus();
    }

    function buildRegex() {
        const q = inputFind.value;
        if (!q) return null;
        const flags = 'g' + (chkCase.checked ? '' : 'i');
        let pattern;
        if (chkRegex.checked) {
            pattern = q;
        } else {
            pattern = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
        if (chkWord.checked) pattern = '\\b' + pattern + '\\b';
        try { return new RegExp(pattern, flags); } catch { return null; }
    }

    function recompute() {
        matches = [];
        const re = buildRegex();
        if (re) {
            for (let r = 0; r < editor.lines.length; r++) {
                const line = editor.lines[r];
                re.lastIndex = 0;
                let m;
                while ((m = re.exec(line)) !== null) {
                    if (m[0].length === 0) { re.lastIndex++; continue; }
                    matches.push({ row: r, colStart: m.index, colEnd: m.index + m[0].length });
                }
            }
        }
        currentIndex = matches.length ? 0 : -1;
        updateCounter();
        repaint();
        if (currentIndex >= 0) revealCurrent();
    }

    function step(delta) {
        if (!matches.length) return;
        currentIndex = (currentIndex + delta + matches.length) % matches.length;
        updateCounter();
        repaint();
        revealCurrent();
    }

    function revealCurrent() {
        const m = matches[currentIndex];
        if (!m) return;
        if (editor.scrollToLine) editor.scrollToLine(m.row + 1, false);
    }

    function updateCounter() {
        counter.textContent = matches.length ? `${currentIndex + 1}/${matches.length}` : '0/0';
    }

    function repaint() {
        const root = editor.gridElement;
        if (!root) return;
        root.querySelectorAll('.find-match, .find-match-current').forEach(el => {
            el.classList.remove('find-match', 'find-match-current');
        });
        matches.forEach((m, i) => {
            const cls = i === currentIndex ? 'find-match-current' : 'find-match';
            for (let c = m.colStart; c < m.colEnd; c++) {
                const cell = root.querySelector(`.grid-editor-cell[data-row="${m.row}"][data-col="${c}"]`);
                if (cell) cell.classList.add(cls);
            }
        });
    }

    function replaceOne() {
        if (editor.readOnly) return;
        if (currentIndex < 0) return;
        const m = matches[currentIndex];
        editor.replaceRange(
            { row: m.row, col: m.colStart },
            { row: m.row, col: m.colEnd },
            inputReplace.value
        );
        recompute();
    }

    function replaceAll() {
        if (editor.readOnly) return;
        if (!matches.length) return;
        const replacement = inputReplace.value;
        // Replace last-to-first to keep offsets stable.
        const sorted = matches.slice().sort((a, b) =>
            b.row - a.row || b.colStart - a.colStart);
        // We want one undo entry, but replaceRange saves undo on each call.
        // Acceptable trade-off for now; users can Ctrl+Z repeatedly.
        for (const m of sorted) {
            editor.replaceRange(
                { row: m.row, col: m.colStart },
                { row: m.row, col: m.colEnd },
                replacement
            );
        }
        recompute();
    }

    return {
        init(ed) {
            editor = ed;
            // Re-apply highlights after each render (the grid is rebuilt).
            const prevContent = editor.onContentChange;
            editor.onContentChange = (v) => {
                if (prevContent) prevContent(v);
                if (panel && !panel.hidden) requestAnimationFrame(repaint);
            };
        },
        handleKeyDown(ed, e) {
            const ctrl = e.ctrlKey || e.metaKey;
            if (!ctrl) return false;
            if (e.key === 'f' || e.key === 'F') { e.preventDefault(); open(false); return true; }
            if (e.key === 'h' || e.key === 'H') { e.preventDefault(); open(true);  return true; }
            return false;
        },
        // Exposed for manual scripting / tests.
        _open: open,
        _close: close
    };
})();

if (typeof module !== 'undefined' && module.exports) module.exports = FindReplace;
