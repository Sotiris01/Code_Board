#!/usr/bin/env node
/**
 * Phase 10.3 — tiny zero-dependency lint script.
 *
 * Runs `node --check` on every `.js` file under server/, src/, scripts/,
 * tests/. This catches syntax errors without pulling in eslint as a
 * dependency. Used by the CI workflow (`npm run lint`).
 */
import { readdirSync, statSync } from 'node:fs';
import { join, extname } from 'node:path';
import { spawnSync } from 'node:child_process';

const ROOTS = ['server', 'src', 'scripts', 'tests'];
const SKIP_DIRS = new Set(['node_modules', '.git', 'data', 'uploads']);

function walk(dir, acc) {
    let entries;
    try { entries = readdirSync(dir); } catch { return acc; }
    for (const name of entries) {
        if (SKIP_DIRS.has(name)) continue;
        const full = join(dir, name);
        let s;
        try { s = statSync(full); } catch { continue; }
        if (s.isDirectory()) walk(full, acc);
        else if (extname(name) === '.js' || extname(name) === '.mjs') acc.push(full);
    }
    return acc;
}

const files = ROOTS.flatMap(r => walk(r, []));
let failed = 0;

for (const file of files) {
    const res = spawnSync(process.execPath, ['--check', file], { encoding: 'utf8' });
    if (res.status !== 0) {
        failed++;
        process.stderr.write(`✗ ${file}\n${res.stderr || res.stdout}\n`);
    }
}

if (failed) {
    process.stderr.write(`\nLint failed: ${failed}/${files.length} file(s) had syntax errors.\n`);
    process.exit(1);
}
process.stdout.write(`Lint OK: ${files.length} file(s) parsed cleanly.\n`);
