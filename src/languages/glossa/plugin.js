/**
 * GLOSSA language plugin descriptor (Phase 5.1).
 * Self-registers with LanguageRegistry. Heavy script loading is still
 * driven by LanguageManager; this descriptor only carries metadata.
 */
(function () {
    if (typeof LanguageRegistry === 'undefined') return;
    LanguageRegistry.register({
        id: 'glossa',
        label: 'ΓΛΩΣΣΑ',
        namespace: 'Glossa',
        fileExtensions: ['.gls', '.glo'],
        commentSyntax: { line: '!', block: null },
        indentTriggers: ['ΑΡΧΗ', 'ΑΝ', 'ΓΙΑ', 'ΟΣΟ', 'ΕΠΙΛΕΞΕ', 'ΣΥΝΑΡΤΗΣΗ', 'ΔΙΑΔΙΚΑΣΙΑ', 'ΑΛΛΙΩΣ'],
        dedentTriggers: ['ΤΕΛΟΣ_'],
        autoPairs: { '(': ')', '[': ']', '"': '"', "'": "'" },
        icon: 'glossa.svg'
    });
})();
