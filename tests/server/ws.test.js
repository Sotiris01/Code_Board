/**
 * Phase 10.1 — WebSocket handshake smoke test.
 *
 * Binds the imported http server to an ephemeral port, opens a teacher
 * client, and asserts the first server frame is an `init` payload with
 * the expected role + connectedUsers list.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const WebSocket = require('ws');

const { server } = require('../../server/index.js');

function listen() {
    return new Promise((resolve) => {
        server.listen(0, '127.0.0.1', () => resolve(server.address().port));
    });
}
function close() {
    return new Promise((resolve) => server.close(() => resolve()));
}

test('WebSocket teacher handshake yields an init frame', async (t) => {
    const port = await listen();
    t.after(async () => { await close(); });

    const ws = new WebSocket(`ws://127.0.0.1:${port}/?role=teacher`);
    const firstMessage = await new Promise((resolve, reject) => {
        const to = setTimeout(() => reject(new Error('timeout waiting for first ws frame')), 2000);
        ws.on('message', (data) => {
            clearTimeout(to);
            resolve(JSON.parse(data.toString()));
        });
        ws.on('error', (err) => { clearTimeout(to); reject(err); });
    });

    assert.equal(firstMessage.type, 'init');
    assert.equal(firstMessage.yourRole, 'teacher');
    assert.equal(typeof firstMessage.yourId, 'number');
    assert.ok(Array.isArray(firstMessage.connectedUsers));
    assert.ok(firstMessage.state && typeof firstMessage.state.seq === 'number');

    ws.close();
    // Give the server a tick to clean up the socket before close().
    await new Promise(r => setTimeout(r, 50));
});
