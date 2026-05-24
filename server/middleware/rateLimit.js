/**
 * Phase 7.2 — Tiny in-memory rate limiter (no external dependency).
 *
 * Sliding-window counter keyed by client IP. Suitable for the small
 * scale Code Board runs at; swap for `express-rate-limit` if you need
 * cluster-wide buckets.
 */

function rateLimit({ windowMs = 60_000, max = 30, keyFn, name = 'rate' } = {}) {
    const buckets = new Map();

    function clientIp(req) {
        return (req.headers['x-forwarded-for']?.split(',')[0].trim())
            || req.socket?.remoteAddress
            || 'unknown';
    }

    function hit(key) {
        const now = Date.now();
        let entry = buckets.get(key);
        if (!entry || now > entry.resetAt) {
            entry = { count: 0, resetAt: now + windowMs };
            buckets.set(key, entry);
        }
        entry.count++;
        return entry;
    }

    // Periodic sweep to keep the map bounded.
    setInterval(() => {
        const now = Date.now();
        for (const [k, v] of buckets) if (now > v.resetAt) buckets.delete(k);
    }, windowMs).unref?.();

    function middleware(req, res, next) {
        const key = (keyFn ? keyFn(req) : clientIp(req)) || 'unknown';
        const entry = hit(`${name}:${key}`);
        if (entry.count > max) {
            res.setHeader('Retry-After', Math.ceil((entry.resetAt - Date.now()) / 1000));
            return res.status(429).json({
                success: false,
                error: `Too many requests. Try again in a few seconds.`
            });
        }
        next();
    }

    /** For non-HTTP callers (e.g. WS handshake): returns true when allowed. */
    middleware.allow = (key) => {
        const entry = hit(`${name}:${key || 'unknown'}`);
        return entry.count <= max;
    };

    return middleware;
}

module.exports = { rateLimit };
