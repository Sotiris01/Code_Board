/**
 * Phase 10.1 — replayBuilder smoke test.
 * Verifies the exported HTML is self-contained and includes the payload.
 */
const test = require('node:test');
const assert = require('node:assert/strict');

const { buildReplayHTML } = require('../../server/services/replayBuilder');

test('buildReplayHTML returns a self-contained HTML document', () => {
    const html = buildReplayHTML('2026-05-24',
        { code: 'print("hi")', language: 'python' },
        [{ type: 'baseline', code: '' }, { type: 'code_update', seq: 1, code: 'p' }]
    );
    assert.equal(typeof html, 'string');
    assert.ok(html.startsWith('<!doctype html>'), 'has doctype');
    assert.ok(html.includes('2026-05-24'), 'embeds session key');
    assert.ok(html.includes('python'), 'embeds language');
    // Final code must be embedded inside an escaped JSON payload.
    assert.ok(/print\(\\"hi\\"\)/.test(html) || html.includes('print(&quot;hi&quot;)') || html.includes('print(\\"hi\\")'),
        'final code embedded in payload');
});

test('buildReplayHTML escapes </script> safely', () => {
    const html = buildReplayHTML('2026-05-24',
        { code: '</script><script>alert(1)</script>', language: 'glossa' },
        []
    );
    // The string </script> must NOT appear verbatim inside an embedded JSON payload
    // (it should be escaped to \u003c/script>). We check the payload area only by
    // requiring that no inline </script> appears that closes our embedded data.
    const occurrences = (html.match(/<\/script>/g) || []).length;
    // We expect at most the legitimate closers around the player code itself.
    // Our embedded JSON should have used \u003c so it does NOT bump the count.
    assert.ok(occurrences <= 4, `too many </script> tokens (${occurrences}) — payload may not be escaped`);
});
