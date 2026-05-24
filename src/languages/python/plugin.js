/**
 * Python language plugin descriptor (Phase 5.1).
 */
(function () {
    if (typeof LanguageRegistry === 'undefined') return;
    LanguageRegistry.register({
        id: 'python',
        label: 'Python',
        namespace: 'Python',
        fileExtensions: ['.py'],
        commentSyntax: { line: '#', block: ['"""', '"""'] },
        indentTriggers: [':'],
        dedentTriggers: [],
        autoPairs: { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'", '`': '`' },
        icon: 'python.svg'
    });
})();
