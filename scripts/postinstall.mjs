#!/usr/bin/env node
/**
 * Phase 6.C — Headless install helper.
 *
 * Runs automatically after `npm install` (via package.json's
 * "postinstall" script). By default it just ensures data/ exists and
 * prints a friendly setup hint with the local URL. Pass --interactive
 * (or run `npm run setup`) to run a CLI version of the onboarding
 * wizard that writes data/settings.json directly, so the in-browser
 * wizard is skipped on first boot.
 */

import { existsSync, mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output, argv, env, exit } from 'node:process';

const require = createRequire(import.meta.url);
const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT_DIR  = join(__dirname, '..');
const DATA_DIR  = join(ROOT_DIR, 'data');

mkdirSync(DATA_DIR, { recursive: true });

const settingsStore   = require(join(ROOT_DIR, 'server', 'services', 'settingsStore.js'));
const languageRegistry = require(join(ROOT_DIR, 'server', 'services', 'languageRegistry.js'));
const pkg              = require(join(ROOT_DIR, 'package.json'));

const PORT = env.PORT || 3000;
const INTERACTIVE = argv.includes('--interactive');

function banner() {
    const line = '─'.repeat(58);
    console.log('');
    console.log(`╭${line}╮`);
    console.log(`│  🎓 Code Board v${pkg.version.padEnd(40, ' ')}│`);
    console.log(`├${line}┤`);
    console.log(`│  Local URL:  http://localhost:${String(PORT).padEnd(26)}│`);
    console.log(`│  Teacher:    http://localhost:${PORT}/?role=teacher`.padEnd(60) + '│');
    console.log(`│  Student:    http://localhost:${PORT}/`.padEnd(60) + '│');
    console.log(`├${line}┤`);
    if (settingsStore.exists()) {
        const s = settingsStore.load();
        console.log(`│  Settings:   data/settings.json  ✓ (${(s?.profile?.name || '—').padEnd(18, ' ')})│`);
    } else {
        console.log(`│  Settings:   not yet configured.                         │`);
        console.log(`│              → npm start, then complete the wizard.      │`);
        console.log(`│              → or:  npm run setup   (CLI version)        │`);
    }
    console.log(`╰${line}╯`);
    console.log('');
}

async function interactiveWizard() {
    if (settingsStore.exists()) {
        console.log('⚠  data/settings.json already exists. Edit through the in-app Settings dialog.');
        return;
    }
    const rl = createInterface({ input, output });
    const ask = async (q, def) => {
        const ans = (await rl.question(def ? `${q} [${def}]: ` : `${q}: `)).trim();
        return ans || def || '';
    };
    const askChoice = async (q, choices, def) => {
        const list = choices.join(' / ');
        let v;
        do {
            v = (await rl.question(`${q} (${list}) [${def}]: `)).trim() || def;
        } while (!choices.includes(v));
        return v;
    };
    const askBool = async (q, def = false) => {
        const v = (await rl.question(`${q} (y/N): `)).trim().toLowerCase();
        if (!v) return def;
        return /^(y|yes|true|1)$/.test(v);
    };

    console.log('\n🧙  Code Board — first-run setup\n');
    const langIds = languageRegistry.ids();
    const defaultLang = langIds[0] || 'glossa';

    const name    = await ask('Your name (required)');
    if (!name) { console.log('Name is required. Aborting.'); rl.close(); return; }
    const email   = await ask('Email (optional)');
    const phone   = await ask('Phone (optional)');
    const discord = await ask('Discord handle (optional)');

    const policy   = await askChoice('Access-code policy', ['fixed', 'rotate', 'free'], 'fixed');
    const language = await askChoice('Default language', langIds, defaultLang);
    const theme    = await askChoice('Default theme',    ['dark', 'light', 'system'], 'dark');
    const mode     = await askChoice('Sharing mode',     ['local', 'ngrok'], 'local');

    let authtoken = '';
    let region    = 'eu';
    if (mode === 'ngrok') {
        authtoken = await ask('ngrok authtoken (leave blank to skip)');
        region    = await askChoice('ngrok region', ['us', 'eu', 'ap', 'au', 'sa', 'jp', 'in'], 'eu');
    }

    rl.close();

    const seed = settingsStore.defaults();
    seed.profile   = { name, email, phone, discord };
    seed.classroom.accessCodePolicy = policy;
    seed.defaults  = { language, theme };
    seed.sharing.mode   = mode;
    seed.sharing.region = region;

    const saved = settingsStore.save(seed);
    if (authtoken) settingsStore.saveNgrok({ authtoken, region });

    console.log(`\n✅ Wrote ${settingsStore.SETTINGS_FILE}`);
    if (authtoken) console.log(`✅ Wrote ${settingsStore.NGROK_FILE}`);
    console.log(`\nStart the server with:  npm start\n`);
    return saved;
}

async function main() {
    try {
        if (INTERACTIVE) await interactiveWizard();
        banner();
    } catch (e) {
        // Never fail the install on this script — it's purely informational.
        console.warn('postinstall: skipped (', e.message, ')');
        exit(0);
    }
}

main();
