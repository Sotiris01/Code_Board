/**
 * RunnerRegistry — Phase 9.7
 *
 * Pluggable per-language "Run" actions. Each runner is a function that
 * accepts ({ code, language }) and may open an external tool, evaluate
 * in-browser, or perform any other action. Multiple runners may be
 * registered for the same language id; the most-recently registered wins.
 *
 * Default runners ship for cpp, java, python and glossa. They open a
 * compatible online IDE in a new tab so the teacher can demonstrate
 * execution without installing toolchains locally.
 *
 *   RunnerRegistry.register('python', ({code}) => {...});
 *   RunnerRegistry.runFor('python', code);
 *   RunnerRegistry.has('cpp') → true
 */
const RunnerRegistry = (function () {
    const runners = new Map();

    function register(languageId, runner) {
        if (!languageId || typeof runner !== 'function') return;
        runners.set(String(languageId).toLowerCase(), runner);
    }

    function has(languageId) {
        return runners.has(String(languageId || '').toLowerCase());
    }

    function runFor(languageId, code) {
        const id = String(languageId || '').toLowerCase();
        const runner = runners.get(id);
        if (!runner) {
            if (typeof Toasts !== 'undefined') {
                Toasts.show(`No runner registered for ${id || 'this language'}`, 'warn');
            }
            return false;
        }
        try {
            runner({ code: code || '', language: id });
            return true;
        } catch (err) {
            console.error('[RunnerRegistry] runner failed:', err);
            if (typeof Toasts !== 'undefined') Toasts.show('Runner failed: ' + err.message, 'error');
            return false;
        }
    }

    // --- Default runners (open external playgrounds in a new tab) ---
    const openExternal = (url) => window.open(url, '_blank', 'noopener');

    register('cpp', ({ code }) => {
        // Compiler Explorer accepts source via fragment-encoded URL.
        const u = 'https://godbolt.org/clientstate/' +
            encodeURIComponent(JSON.stringify({
                sessions: [{ id: 1, language: 'c++', source: code,
                    compilers: [{ id: 'g142', options: '-std=c++17 -O2' }] }]
            }));
        openExternal(u);
    });

    register('java', ({ code }) => {
        openExternal('https://www.jdoodle.com/online-java-compiler/');
        if (typeof Toasts !== 'undefined') {
            Toasts.show('Opened JDoodle — paste the code to run', 'info');
        }
    });

    register('python', ({ code }) => {
        // Trinket "embed code" link doesn't accept inline source; open a fresh REPL.
        openExternal('https://trinket.io/embed/python3');
        if (typeof Toasts !== 'undefined') {
            Toasts.show('Opened Trinket — paste the code to run', 'info');
        }
    });

    register('glossa', () => {
        if (typeof Toasts !== 'undefined') {
            Toasts.show('Glossa has no built-in runner yet', 'info');
        }
    });

    return { register, has, runFor };
})();

if (typeof window !== 'undefined') window.RunnerRegistry = RunnerRegistry;
