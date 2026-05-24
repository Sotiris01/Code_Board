/**
 * Phase 7.4 — Structured logging behind a DEBUG env flag.
 *
 * Exports a small logger with info/warn/error/debug, plus an Express
 * request-logger middleware. Uses `pino` when installed (optional
 * dependency), otherwise falls back to plain console. Per-request and
 * debug() output is silenced unless the DEBUG env var is set.
 */

let pino = null;
try { pino = require('pino'); } catch { /* optional dependency */ }

const DEBUG = !!process.env.DEBUG;

const logger = pino
    ? pino({
        level: DEBUG ? 'debug' : 'info',
        transport: process.stdout.isTTY
            ? { target: 'pino-pretty', options: { colorize: true, translateTime: 'HH:MM:ss' } }
            : undefined
    })
    : {
        info:  (...a) => console.log(...a),
        warn:  (...a) => console.warn(...a),
        error: (...a) => console.error(...a),
        debug: (...a) => { if (DEBUG) console.log('[debug]', ...a); },
        child: () => logger
    };

/** Express middleware: log each HTTP request when DEBUG is on. */
function requestLogger() {
    return (req, res, next) => {
        if (!DEBUG) return next();
        const start = Date.now();
        res.on('finish', () => {
            const ms = Date.now() - start;
            logger.debug(`${req.method} ${req.originalUrl} → ${res.statusCode} (${ms}ms)`);
        });
        next();
    };
}

module.exports = { logger, requestLogger, DEBUG, hasPino: !!pino };
