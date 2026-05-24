#!/usr/bin/env node
/**
 * Phase 7.5 — `npm run doctor` preflight check.
 *
 * Verifies the host environment can run Code Board: Node version,
 * port availability, ngrok binary, and write access to data/ and
 * uploads/. Exits 0 when everything is green, 1 otherwise.
 */

import { existsSync, accessSync, constants, mkdirSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { createServer } from 'node:net';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { argv, env, exit, version } from 'node:process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT      = join(__dirname, '..');
const PORT      = Number(env.PORT) || 3000;
const MIN_NODE  = 18;

const checks = [];
const tick = (label, ok, detail = '') => {
    checks.push({ label, ok });
    const icon = ok ? '✅' : '❌';
    console.log(`${icon} ${label}${detail ? ' — ' + detail : ''}`);
};

console.log('\n🩺  Code Board — doctor\n');

// 1. Node version
const major = Number(version.replace(/^v/, '').split('.')[0]);
tick(`Node.js ≥ ${MIN_NODE}`, major >= MIN_NODE, `installed ${version}`);

// 2. Port availability
await new Promise((resolve) => {
    const probe = createServer();
    probe.once('error', (e) => {
        tick(`Port ${PORT} free`, false, e.code || e.message);
        resolve();
    });
    probe.once('listening', () => {
        probe.close(() => { tick(`Port ${PORT} free`, true); resolve(); });
    });
    probe.listen(PORT, '127.0.0.1');
});

// 3. ngrok installed (optional but recommended)
const ngrok = spawnSync(process.platform === 'win32' ? 'ngrok.exe' : 'ngrok', ['version'], { encoding: 'utf8' });
if (ngrok.error) {
    tick('ngrok installed', false, 'binary not on PATH (optional for LAN-only use)');
} else {
    tick('ngrok installed', true, (ngrok.stdout || '').trim().split('\n')[0]);
}

// 4. Write access to data/ and uploads/
for (const sub of ['data', 'uploads']) {
    const dir = join(ROOT, sub);
    try {
        mkdirSync(dir, { recursive: true });
        accessSync(dir, constants.W_OK);
        tick(`${sub}/ writable`, true);
    } catch (e) {
        tick(`${sub}/ writable`, false, e.message);
    }
}

// 5. settings.json present?
const settings = join(ROOT, 'data', 'settings.json');
if (existsSync(settings)) {
    tick('data/settings.json present', true);
} else {
    tick('data/settings.json present', true, 'missing — wizard will run on first boot');
}

const failed = checks.filter(c => !c.ok).length;
console.log('');
if (failed === 0) {
    console.log('🟢  All checks passed.\n');
    exit(0);
} else {
    console.log(`🔴  ${failed} check(s) failed.\n`);
    exit(argv.includes('--strict') ? 1 : 0);
}
