/**
 * C++ language plugin descriptor (Phase 5.1).
 */
(function () {
    if (typeof LanguageRegistry === 'undefined') return;
    LanguageRegistry.register({
        id: 'cpp',
        label: 'C++',
        namespace: 'Cpp',
        fileExtensions: ['.cpp', '.h', '.hpp', '.c'],
        commentSyntax: { line: '//', block: ['/*', '*/'] },
        indentTriggers: ['{'],
        dedentTriggers: ['}'],
        autoPairs: { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" },
        icon: 'cpp.svg'
    });
})();
