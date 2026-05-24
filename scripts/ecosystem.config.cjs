/**
 * Phase 7.7 — Optional PM2 process manifest.
 *
 * Usage:
 *   npm i -g pm2
 *   pm2 start scripts/ecosystem.config.cjs
 *   pm2 save && pm2 startup
 *
 * Environment variables can be overridden in the `env_*` blocks or
 * inherited from a project-level .env (see .env.example).
 */
module.exports = {
    apps: [
        {
            name:        'code-board',
            script:      'server/index.js',
            cwd:         __dirname + '/..',
            exec_mode:   'fork',
            instances:   1,
            watch:       false,
            max_memory_restart: '512M',
            kill_timeout: 5000,         // give the server time to flush state on SIGTERM
            env: {
                NODE_ENV: 'production',
                PORT:     3000
            },
            env_development: {
                NODE_ENV: 'development',
                DEBUG:    '1'
            }
        }
    ]
};
