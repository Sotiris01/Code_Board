/**
 * Phase 10.1 — HTTP route smoke tests.
 *
 * Uses the built-in node:test runner and supertest. Importing
 * server/index.js gives us {app, server, wss}; because we guard
 * server.listen() with `require.main === module`, no port is bound
 * here — supertest spins up an ephemeral listener per request.
 */
const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
const path = require('node:path');
const fs = require('node:fs');

const { app } = require('../../server/index.js');

test('GET /api/ping returns a pong timestamp', async () => {
    const res = await request(app).get('/api/ping').expect(200);
    assert.equal(typeof res.body.pong, 'number');
    assert.ok(res.body.pong > 0);
});

test('GET /api/onboarding/status reports completed + language list', async () => {
    const res = await request(app).get('/api/onboarding/status').expect(200);
    assert.equal(typeof res.body.completed, 'boolean');
    assert.ok(Array.isArray(res.body.languages));
    assert.ok(res.body.languages.length > 0, 'at least one language registered');
    for (const lang of res.body.languages) {
        assert.equal(typeof lang.id, 'string');
        assert.equal(typeof lang.label, 'string');
    }
});

test('GET /api/settings returns merged settings + ngrok masked view', async () => {
    const res = await request(app).get('/api/settings').expect(200);
    assert.ok(res.body.settings, 'settings object present');
    assert.ok(res.body.settings.editor, 'editor section merged from defaults');
    assert.equal(typeof res.body.ngrok.configured, 'boolean');
    assert.equal(typeof res.body.version, 'string');
});

test('PATCH /api/settings rejects invalid theme with 400', async () => {
    const res = await request(app)
        .patch('/api/settings')
        .send({ defaults: { theme: 'rainbow' } })
        .set('Content-Type', 'application/json')
        .expect(400);
    assert.equal(res.body.success, false);
    assert.equal(res.body.field, 'defaults.theme');
});

test('GET /api/sessions lists rotating snapshots', async () => {
    const res = await request(app).get('/api/sessions').expect(200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.sessions));
});

test('GET /api/sessions/:key/events rejects malformed key', async () => {
    const res = await request(app).get('/api/sessions/not-a-date/events').expect(400);
    assert.equal(res.body.success, false);
});

test('GET /api/sessions/:key/events returns empty list for unknown date', async () => {
    const res = await request(app).get('/api/sessions/1999-01-01/events').expect(200);
    assert.equal(res.body.success, true);
    assert.deepEqual(res.body.events, []);
});

test('PUT /api/worksheet/:id then GET round-trips content', async () => {
    const id = 'test' + Date.now();
    const content = 'γεια σου κόσμε\n2 + 2 = 4\n';
    try {
        await request(app)
            .put('/api/worksheet/' + id)
            .send({ content })
            .set('Content-Type', 'application/json')
            .expect(200);
        const res = await request(app).get('/api/worksheet/' + id).expect(200);
        assert.equal(res.body.success, true);
        assert.equal(res.body.content, content);
    } finally {
        // Clean up the test file from data/worksheets/.
        const file = path.join(__dirname, '..', '..', 'data', 'worksheets', id + '.txt');
        try { fs.unlinkSync(file); } catch { /* ignore */ }
    }
});

test('PUT /api/worksheet rejects invalid id', async () => {
    const res = await request(app)
        .put('/api/worksheet/$$$')
        .send({ content: 'x' })
        .set('Content-Type', 'application/json')
        .expect(400);
    assert.equal(res.body.success, false);
});

test('GET /api/auth-config returns boolean flag', async () => {
    const res = await request(app).get('/api/auth-config').expect(200);
    assert.equal(typeof res.body.teacherPasswordRequired, 'boolean');
});

test('GET /api/teacher-info returns a profile object', async () => {
    const res = await request(app).get('/api/teacher-info').expect(200);
    assert.equal(typeof res.body, 'object');
    assert.equal(typeof res.body.name, 'string');
});

test('GET /api/storage/stats returns counters', async () => {
    const res = await request(app).get('/api/storage/stats').expect(200);
    assert.ok(res.body.uploads);
    assert.ok(res.body.data);
    assert.equal(typeof res.body.sessionStateExists, 'boolean');
});
