/**
 * RunButton — wires the toolbar Run button (Phase 9.7) to RunnerRegistry.
 */
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        const btn = document.getElementById('run-btn');
        if (!btn) return;
        btn.addEventListener('click', () => {
            const code = (window.gridEditor && window.gridEditor.getValue)
                ? window.gridEditor.getValue() : '';
            const lang = (typeof LanguageManager !== 'undefined' && LanguageManager.getCurrentLanguage)
                ? LanguageManager.getCurrentLanguage() : 'glossa';
            RunnerRegistry.runFor(lang, code);
        });
    }, 200);
});
