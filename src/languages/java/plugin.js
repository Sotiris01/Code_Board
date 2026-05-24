/**
 * Java language plugin descriptor (Phase 5.1).
 */
(function () {
    if (typeof LanguageRegistry === 'undefined') return;
    LanguageRegistry.register({
        id: 'java',
        label: 'Java',
        namespace: 'Java',
        fileExtensions: ['.java'],
        commentSyntax: { line: '//', block: ['/*', '*/'] },
        indentTriggers: ['{'],
        dedentTriggers: ['}'],
        autoPairs: { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" },
        icon: 'java.svg'
    });
})();
