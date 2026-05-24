/**
 * Phase 10.2 — RunnerRegistry smoke test.
 *
 * Validates that custom runners can be registered, that the default
 * runners exist for the four bundled languages, and that runFor
 * invokes the registered callback exactly once.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

function loadRunnerRegistry() {
    const source = fs.readFileSync(
        path.join(__dirname, '..', '..', 'src', 'core', 'RunnerRegistry.js'),
        'utf8'
    );
    // Provide a window stub so the default cpp/java/python runners can register
    // (they call `window.open` only at *runtime*, not at registration time).
    const ctx = {
        window: { open: () => null },
        console,
        Toasts: undefined
    };
    vm.createContext(ctx);
    vm.runInContext(source + ';this.RunnerRegistry = RunnerRegistry;', ctx);
    return { registry: ctx.RunnerRegistry, ctx };
}

test('default runners are registered for the four bundled languages', () => {
    const { registry } = loadRunnerRegistry();
    for (const id of ['cpp', 'java', 'python', 'glossa']) {
        assert.equal(registry.has(id), true, `expected default runner for ${id}`);
    }
});

test('register + runFor invokes the registered callback', () => {
    const { registry } = loadRunnerRegistry();
    let calls = 0;
    let received = null;
    registry.register('robot', (payload) => { calls++; received = payload; });
    const ok = registry.runFor('robot', 'beep();');
    assert.equal(ok, true);
    assert.equal(calls, 1);
    assert.equal(received.code, 'beep();');
    assert.equal(received.language, 'robot');
});

test('runFor returns false when no runner is registered', () => {
    const { registry } = loadRunnerRegistry();
    assert.equal(registry.runFor('nonexistent-lang', ''), false);
});
