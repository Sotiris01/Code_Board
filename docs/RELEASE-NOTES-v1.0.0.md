# Code Board v1.0.0

> First stable release. Closes Phases 0 → 10 of the project
> [ROADMAP](../ROADMAP.md).

## Highlights

- **Real-time collaborative editor** — teacher drives, students
  follow; per-language plugins for GLOSSA, Python, C++, and Java.
- **Onboarding wizard + Settings dialog** — `data/settings.json` is
  the single source of truth; can be pre-seeded headlessly via
  `CODE_BOARD_*` env vars.
- **Lobby + access codes** — `fixed` / `rotate` / `free` policies,
  WS handshake rate-limited per IP.
- **Rotating snapshots + append-only event log** — `data/sessions/`
  rolls daily; every code mutation is journaled in
  `*.events.jsonl`.
- **Classroom features (Phase 9)** — multi-tab editor, hand-raise
  with note, run button (godbolt / JDoodle / Trinket), private
  per-student worksheets, in-app replay with scrubber, exportable
  self-contained HTML replay, mobile-friendly student view.
- **Operational hardening (Phase 7)** — helmet-style headers, body
  limits, rate-limited uploads + WS handshakes, structured logging
  (pino fallback to console), daily uploads GC, graceful shutdown.
- **Tests + CI (Phase 10)** — 27 `node:test` cases across server &
  client; GitHub Action runs lint + tests on Node 20.x and 22.x.

## Installation

```bash
git clone <repo-url> code_board
cd code_board
npm install
npm start
# → http://localhost:3000/?role=teacher
```

For a guided tour see [TEACHER-GUIDE.md](TEACHER-GUIDE.md).
Internals & sequence diagrams live in
[ARCHITECTURE.md](ARCHITECTURE.md).

## Upgrade notes

This is the first tagged release; there is no previous version to
migrate from. `data/` is the only runtime-mutable directory and is
forward-compatible — `settingsStore.loadMerged()` deep-merges new
default fields automatically.

## Breaking changes from pre-release `main`

- `server/index.js` no longer calls `server.listen()` when
  `require()`d — only when run directly. Anyone importing the file
  from another script needs to call `server.listen(PORT)`
  themselves. (Test harness pattern: see
  [`tests/server/ws.test.js`](../tests/server/ws.test.js).)
- The module now exports `{ app, server, wss }`.

## Cutting the tag

After review, the maintainer publishes the tag with:

```bash
git tag -a v1.0.0 -m "v1.0.0 — Phases 0–10 complete"
git push origin v1.0.0
```

> ⚠ Public, hard-to-reverse. Do not run automatically from CI or an
> assistant — it pushes a permanent tag that downstream consumers
> may pin against.

## Acknowledgements

Built for the AEPP teaching workflow. Thanks to every classroom that
tolerated mid-lesson iteration during the Phase 4–9 push.
