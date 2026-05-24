/**
 * Phase 7.1 — Security middleware bundle.
 *
 * Wires (when available) `helmet`, JSON/urlencoded body limits and a
 * minimal same-origin CORS allowlist. `helmet` is an OPTIONAL
 * dependency — if it is not installed we fall back to a handful of
 * essential security headers so the app still runs after a stock
 * `npm install`. Install with `npm i helmet` to get the full set.
 */

const express = require('express');
const settingsStore = require('../services/settingsStore');

let helmet = null;
try { helmet = require('helmet'); } catch { /* optional */ }

/** Always-allowed local origins (any port). */
const LOCAL_ORIGIN_RE = /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/i;

/** Read the tunnel host configured by Settings → Sharing. */
function tunnelOrigins() {
    try {
        const ng = settingsStore.loadNgrok() || {};
        const out = [];
        if (ng.publicUrl) out.push(String(ng.publicUrl).replace(/\/+$/, ''));
        const s = settingsStore.loadMerged();
        if (s?.sharing?.customDomain) {
            const cd = String(s.sharing.customDomain).trim();
            if (cd) out.push(cd.startsWith('http') ? cd : `https://${cd}`);
        }
        return out;
    } catch { return []; }
}

function isAllowedOrigin(origin) {
    if (!origin) return true;                // same-origin / curl / native ws
    if (LOCAL_ORIGIN_RE.test(origin)) return true;
    const tunnels = tunnelOrigins();
    return tunnels.some(t => origin === t || origin.startsWith(t));
}

/** Apply the middleware bundle to the given express app. */
function apply(app) {
    if (helmet) {
        app.use(helmet({
            contentSecurityPolicy: false,    // app inlines several styles/scripts
            crossOriginEmbedderPolicy: false,
            crossOriginResourcePolicy: { policy: 'cross-origin' }
        }));
    } else {
        app.use((req, res, next) => {
            res.setHeader('X-Content-Type-Options', 'nosniff');
            res.setHeader('X-Frame-Options', 'SAMEORIGIN');
            res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
            res.setHeader('X-XSS-Protection', '0');
            next();
        });
    }

    // CORS allowlist — defaults to localhost + the tunnel host.
    app.use((req, res, next) => {
        const origin = req.headers.origin;
        if (origin && isAllowedOrigin(origin)) {
            res.setHeader('Access-Control-Allow-Origin', origin);
            res.setHeader('Vary', 'Origin');
            res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
            res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        }
        if (req.method === 'OPTIONS') return res.sendStatus(204);
        next();
    });

    // Global body limits — uploads use multer, so JSON bodies stay small.
    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
}

module.exports = { apply, isAllowedOrigin, tunnelOrigins, hasHelmet: !!helmet };
