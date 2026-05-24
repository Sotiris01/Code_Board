# 📝 Code Board — v1.0.0

A self-hosted, real-time collaborative coding whiteboard for the classroom.
The teacher writes / loads code, opens PDFs and Markdown notes, and every connected student
sees the same thing live, with cursor sharing, laser pointer, breakpoints, reactions,
hand-raise, lesson replay, private worksheets, and a first-run onboarding wizard.

Originally built for **ΓΛΩΣΣΑ** (the pseudocode language taught in Greek high schools),
now also supports **Python**, **C++** and **Java** — with a plugin system for adding more.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D18-green.svg)
![Express](https://img.shields.io/badge/express-5.x-lightgrey.svg)
![WS](https://img.shields.io/badge/websocket-ws%208.x-orange.svg)
![Tests](https://img.shields.io/badge/tests-passing-brightgreen.svg)

---

## 1. What's inside (one-screen overview)

```
┌─ Toolbar ──────────────────────────────────────────────────────────────────┐
│ 📝 Code Board │ [Code][PDF][MD] │ Language ▾ │ 👨‍🏫 👨‍🎓 │ CODE 4759 📋 🔄 │ 🌙 ❓ Copy Clear │
├──────────────────────────────────────────────────────────┬─────────────────┤
│ 1                                                        │ ⌨  KEYWORDS     │
│ 2  # code area                                           │ 📁  FILE EXPLOR │
│ 3  (Grid editor / PDF viewer / Markdown viewer)          │ 📤  SHARED      │
│ 4                                                        │ 💻  LOCAL FILES │
│ …                                                        │   (teacher)     │
├──────────────────────────────────────────────────────────┴─────────────────┤
│ Ln 1, Col 1   ↑0 B/s ↓0 B/s   ⏱ 00:00   👥 0   ✅ ❓ 🔄   PYTHON           │
└────────────────────────────────────────────────────────────────────────────┘
```

The right column is an **activity bar + side panel** (VS-Code style). The status
bar at the bottom shows live cursor position, per-second network throughput,
session timer, connected students, ngrok latency, reactions and the active
language.

---

## 2. Feature matrix

| Area | Teacher | Student |
|---|---|---|
| Live code sync (WebSocket) | ✅ write/edit | ✅ read-only mirror |
| Cursor sharing | ✅ | ✅ |
| Tile / range highlight | ✅ broadcast | ✅ receive |
| Laser pointer (Ctrl + hover) | ✅ | — |
| Breakpoints (click line number) | ✅ | ✅ see |
| Scroll-to-line | ✅ | follow |
| Mode switch — Code / PDF / Markdown | ✅ | follows teacher |
| PDF viewer with sync scroll + laser | ✅ load | ✅ follow |
| Markdown viewer with sync scroll + laser | ✅ load | ✅ follow |
| Drag-and-drop **shared files** panel | ✅ upload | ✅ open / download |
| **Local-folder browser** (File System Access API) | ✅ | — |
| Reactions ✅ ❓ 🔄 | sees counters | sends |
| Hand-raise ✋ (+ optional short note) | sees list + notes | sends |
| Window-focus indicator (red glow when student tabs away) | ✅ | broadcasts |
| Language switch (ΓΛΩΣΣΑ / Python / C++ / Java) | ✅ | follows teacher |
| **Plugin system** — add a language with `npm run new:lang` | ✅ | — |
| **Access code** (4-digit, regenerable) + Free-Enter toggle | ✅ control | required to join |
| **First-run onboarding wizard** (6-step modal) | ✅ | — |
| **Settings dialog** (⚙ / Ctrl+,) — 6 tabs, QR code for student link | ✅ | — |
| **Multi-tab editor** — multiple code buffers per session | ✅ | mirrors active tab |
| **Lesson replay** — scrub any past session frame-by-frame | ✅ | — |
| **HTML replay export** — self-contained, no dependencies | ✅ | — |
| **Private worksheet** — scratch pad, autosaved per student | — | ✅ |
| **▶ Run button** — opens code in Compiler Explorer / JDoodle / Trinket | ✅ | — |
| **Mobile read-only** — enlarged touch targets, reflowed worksheet | — | ✅ |
| Rotating daily session snapshots + append-only event log | survives restart | — |
| Offline outbox — queues WS messages when disconnected, flushes on reconnect | ✅ | ✅ |
| Theme toggle (dark / light) | ✅ | ✅ |
| Per-session upload sandbox (`uploads/<timestamp>/`) with daily GC | ✅ | ✅ |
| CI / lint / tests (`npm test`, `npm run lint`, `npm run doctor`) | ✅ | — |

---

## 3. Tech stack

- **Backend**: Node.js ≥ 18 + Express 5, `ws` 8 WebSocket server, `multer` for uploads,
  `archiver` for zip downloads, `iconv-lite` for Windows-1253 (`.glo`) decoding,
  `fast-diff` for incremental code-update diffing + replay compression.
- **Security / ops**: optional `helmet` with graceful header fallback, dependency-free
  sliding-window rate limiter, optional `pino` logger with `console` fallback,
  daily uploads GC, graceful SIGINT/SIGTERM shutdown, optional PM2 manifest.
- **Frontend**: vanilla JS modules, CDN-loaded `marked.js` (Markdown),
  `pdf.js` 3.11 (PDF), `JSZip` (client-side zipping). No build step.
- **CSS**: split into design tokens + per-component files under `styles/` (reset, base,
  tokens, layout, components, themes). No more monolithic stylesheet.
- **Persistence**: `data/sessions/YYYY-MM-DD.json` rotating snapshots + `current` pointer,
  append-only `.events.jsonl` for replay, `data/settings.json` (wizard output),
  `data/ngrok.json` (auth-token vault, gitignored), `data/worksheets/<id>.txt`.
- **Dev tooling**: `supertest` for HTTP/WS tests, zero-dependency lint script
  (`node --check`), `scripts/doctor.mjs` preflight, `scripts/new-language.mjs` scaffolder.
- **CI**: GitHub Actions (`.github/workflows/ci.yml`) — `npm ci` + lint + test on
  Node 20.x and 22.x, every push and PR.

---

## 4. Repository layout

```
code_board/
├── server/
│   ├── index.js               Express + WebSocket server (entry point)
│   ├── middleware/
│   │   ├── security.js        Helmet headers, CORS allowlist, body-size cap
│   │   ├── rateLimit.js       Sliding-window limiter (uploads + WS handshakes)
│   │   └── logging.js         pino / console logger + HTTP access log
│   └── services/
│       ├── sessionStore.js    Rotating daily snapshots + event-log writer
│       ├── settingsStore.js   data/settings.json CRUD + deepMerge + env-seed
│       ├── languageRegistry.js Server-side registry reader (extension allowlists)
│       ├── replayBuilder.js   Self-contained HTML replay export generator
│       └── uploadsGc.js       Scheduled daily uploads garbage collector
│
├── public/
│   ├── index.html             Single-page shell (toolbar, lobby, sidebar, modals)
│   ├── favicon.svg
│   └── assets/
│       └── icons/             Language SVG monogram icons (glossa, python, cpp, java)
│
├── styles/
│   ├── main.css               Imports all partials (cache-versioned)
│   ├── base/                  reset.css, base.css, tokens.css, legacy.css
│   ├── layout/                toolbar.css, sidebar.css, footer.css
│   ├── components/            editor, lobby, modal, onboarding, settings, viewers,
│   │                          collaboration, reactions, shared-files, toast …
│   └── themes/                dark.css, light.css
│
├── src/
│   ├── main.js                Bootstrap — wires DOM ↔ modules, builds lang selector
│   │
│   ├── core/
│   │   ├── LanguageManager.js Dynamic language switching (loads per-lang scripts)
│   │   ├── LanguageRegistry.js Fetches registry.json; register / get / list / ids
│   │   ├── RunnerRegistry.js  Pluggable run-target registry (Compiler Explorer etc.)
│   │   └── SmartInserter.js   Smart keyword insertion (auto-indent, snippets)
│   │
│   ├── components/
│   │   ├── GridEditor.js      Custom grid-based code editor (cell-per-char)
│   │   ├── SyntaxHighlighter.js Per-language tokenizer / colorizer
│   │   ├── PdfViewer.js       Continuous-scroll PDF.js wrapper
│   │   ├── MarkdownViewer.js  marked.js wrapper with scroll / laser sync
│   │   ├── FileBrowser.js     Server-side content/<lang>/ file browser
│   │   ├── SharedFilesBrowser.js Drag-drop upload + per-session shared store
│   │   ├── LocalFileBrowser.js   File System Access API folder browser (teacher)
│   │   └── UIManager.js       Toasts, theme, shortcuts modal, lobby helpers
│   │
│   ├── editor/
│   │   └── input/             AutoIndent, AutoPairs (lang-aware), BlockComment,
│   │                          BracketMatch, FindReplace, GutterDragSelect,
│   │                          MultiCursor, SmartPaste
│   │
│   ├── ui/
│   │   ├── Toolbar.js         Copy / clear / theme / settings / tabs / run bindings
│   │   ├── StatusBar.js       Cursor pos, network stats, ngrok poll, timer
│   │   ├── LayoutManager.js   Mode switching, sidebar resize, activity bar
│   │   ├── LobbyManager.js    4-digit-code waiting room
│   │   ├── OnboardingWizard.js 6-step first-run modal (teacher only)
│   │   ├── SettingsDialog.js  6-tab settings modal (⚙ / Ctrl+,, teacher only)
│   │   ├── TabsBar.js         Multi-tab editor strip (teacher only)
│   │   ├── HandRaise.js       ✋ raise + optional note, teacher badge with list
│   │   ├── ReplayModal.js     Load / play / scrub / export past sessions
│   │   ├── RunButton.js       ▶ Run toolbar button (opens in external runner)
│   │   ├── WorksheetPanel.js  Student scratch-pad, autosaved to server
│   │   └── SettingsDialog.js  ⚙ six-tab modal (profile, classroom, editor …)
│   │
│   ├── modules/
│   │   ├── Collaboration.js   WebSocket client + all message handlers
│   │   └── FileTransfer.js    Chunked upload helpers
│   │
│   └── languages/
│       ├── registry.json      Single source of truth (id, label, exts, autoPairs …)
│       ├── glossa/  (plugin.js, keywords.js, syntax.js, snippets.js, content.js)
│       ├── python/  (same 5-file shape)
│       ├── cpp/     (same)
│       └── java/    (same)
│
├── data/                      Runtime data — gitignored
│   ├── settings.json          Wizard / settings-dialog output
│   ├── ngrok.json             Auth-token vault (gitignored)
│   ├── sessions/              YYYY-MM-DD.json snapshots + .events.jsonl logs
│   └── worksheets/            Per-student scratch-pad files
│
├── docs/
│   ├── TEACHER-GUIDE.md       Onboarding → lobby → sharing → replay → troubleshooting
│   ├── ARCHITECTURE.md        Module map, layering rules, Mermaid sequence diagrams
│   ├── EXTENDING-LANGUAGES.md Step-by-step guide + scaffolder reference
│   └── RELEASE-NOTES-v1.0.0.md Full v1.0.0 release notes
│
├── tests/
│   ├── server/                api.test.js, ws.test.js, replayBuilder.test.js,
│   │                          settingsStore.test.js  (supertest + node:test)
│   └── client/                autopairs.test.js, runnerRegistry.test.js,
│                              themeManager.test.js  (node:test + vm)
│
├── scripts/
│   ├── new-language.mjs       Scaffolder: npm run new:lang -- <id> [label] [ext]
│   ├── postinstall.mjs        Banner + data/ setup run after npm install
│   ├── doctor.mjs             Preflight: Node version, port free, ngrok on PATH …
│   ├── lint.mjs               Zero-dependency node --check linter
│   └── ecosystem.config.cjs   PM2 fork-mode config with graceful shutdown
│
├── content/                   ~1.4 K exercise files served to the File Explorer
│   ├── glossa/   exercises 01–12, tetradio, vivlio, manual PDFs, templates/*.gls
│   ├── python/   exercises + 22 .py templates
│   ├── cpp/      4 exercise sets + ~26 .cpp templates by topic
│   └── java/     templates only (5 .java files)
│
├── uploads/<timestamp>/       Per-session sandbox; GC'd after TTL days
├── .env.example               Documents all CODE_BOARD_* env-var knobs
├── start-session.ps1          Windows convenience: starts node + ngrok
├── CHANGELOG.md               Phase-by-phase change log (Phases 0–10)
├── REDESIGN-REPORT.md         Original audit and redesign plan
├── ROADMAP.md                 10-phase feature roadmap
└── package.json               type: commonjs; scripts: start / dev / tunnel /
                               new:lang / setup / doctor / test / lint
```

---

## 5. WebSocket protocol (current)

All messages are JSON, `{ type, … }`. Implemented on both ends
([server/index.js](server/index.js) and [src/modules/Collaboration.js](src/modules/Collaboration.js)):

| Category | `type` values |
|---|---|
| Auth / lobby | `auth_required`, `auth_failed`, `auth_error`, `verify_code`, `admin_code`, `admin_get_code`, `admin_set_public`, `admin_cycle_code` |
| Editor | `init`, `code_update`, `template_loaded`, `cursor_update`, `highlight_selection`, `highlight_tiles`, `breakpoints`, `scroll_to_line`, `laser_point`, `language_change` |
| Catch-up | `request_since`, `state_sync` |
| PDF | `pdf_load`, `pdf_sync`, `pdf_laser` |
| Markdown | `markdown_content`, `markdown_state`, `markdown_laser` |
| Presence | `user_joined`, `user_left`, `window_focus`, `hand_raise` (+ `note`), `reaction`, `clear_reactions` |
| Files | `folder_shared`, `file_deleted` |
| View mode | `mode_change` |
| Settings | `settings_changed` |
| Server lifecycle | `server_shutdown` |
| Keep-alive | `ping` / `pong` |

HTTP endpoints (selected):

| Method | Path | Description |
|---|---|---|
| GET | `/api/ping` | Health check |
| GET | `/api/ngrok-stats` | Ngrok latency poll |
| GET/POST | `/api/teacher-info` | Lobby card data |
| GET | `/api/auth-config` | Access-code config |
| POST | `/api/access-control` | Toggle free-enter / cycle code |
| POST | `/api/upload` | File upload (rate-limited) |
| GET | `/api/shared-folders` | List shared uploads |
| GET | `/api/uploads/files` | Files in active session sandbox |
| GET | `/api/uploads/download` | Single file download |
| GET | `/api/download-folder` | Folder as zip |
| GET | `/api/files` | Content library browse |
| GET | `/api/files/content` | Read exercise file |
| GET | `/api/status` | Server status |
| GET | `/api/sessions` | List session snapshots |
| GET | `/api/sessions/:key` | Snapshot + event count |
| GET | `/api/sessions/:key/events` | JSONL event log |
| GET | `/api/sessions/:key/export` | Self-contained HTML replay |
| POST | `/api/clear-session` | Wipe current session state |
| GET | `/api/onboarding/status` | Wizard completion check |
| POST | `/api/onboarding/complete` | Save wizard output |
| GET | `/api/settings` | Merged settings |
| PATCH | `/api/settings` | Deep-merge update (400 on field error) |
| POST | `/api/settings/ngrok` | Save ngrok authtoken |
| GET | `/api/settings/ngrok/test` | Probe ngrok agent at :4040 |
| GET | `/api/storage/stats` | Upload sizes + data-dir usage |
| POST | `/api/storage/clear-uploads` | Wipe old upload sessions |
| GET/PUT | `/api/worksheet/:id` | Student scratch-pad (512 KB cap) |

---

## 6. Quick start

```bash
git clone <this-repo>
cd code_board
npm install          # also runs postinstall banner + data/ setup
npm run doctor       # optional: check Node version, port, ngrok on PATH
node server/index.js
# → http://localhost:3000?role=teacher   (teacher UI — onboarding wizard on first boot)
# → http://localhost:3000                (student UI, asks for 4-digit code)
```

On Windows, `./start-session.ps1` starts the server and launches `ngrok http 3000`,
then opens the teacher URL.

### First-run configuration

On first boot the teacher sees a **6-step onboarding wizard** (Profile → Access-code
policy → Default language → Theme → Sharing / ngrok → Review). Output is saved to
`data/settings.json` and skipped on subsequent boots.

Alternative — **CLI wizard**: `npm run setup` (Node `readline` version, no browser needed).

Alternative — **env-var seeding**: set `CODE_BOARD_*` variables before starting;
the server writes `data/settings.json` and skips the wizard automatically.
See [`.env.example`](.env.example) for the full list of supported knobs.

After setup, the **Settings dialog** (⚙ in the toolbar or `Ctrl+,`) covers the
same six tabs at any time without restarting.

---

## 7. Roles & access

| URL | Role | Default behaviour |
|---|---|---|
| `/?role=teacher` | Teacher | Full toolbar, file explorer, classroom controls, can edit |
| `/` | Student | Lobby first → enter 4-digit code shown on the teacher screen |

Teacher controls (top-right of toolbar) include:

- **CODE 4759** — current access code, copy button, regenerate button.
- **Free Enter** toggle — when on, students bypass the code.
- **Theme**, **Shortcuts (F1)**, **Copy**, **Clear**.

---

## 8. Keyboard shortcuts (from the F1 modal)

| Keys | Action |
|---|---|
| `Ctrl+Z` / `Ctrl+Shift+Z` | Undo / Redo |
| `Ctrl+C` / `Ctrl+X` / `Ctrl+V` / `Ctrl+A` | Copy / Cut / Paste / Select-all |
| `Tab` | Insert tab |
| `Ctrl+Shift+T` | Toggle theme |
| `Ctrl+Shift+C` | Copy whole board |
| `Ctrl+,` | Open Settings dialog (teacher) |
| `F1` | Show shortcuts |
| `Esc` | Close current modal |
| Teacher: `Ctrl + hover` | Laser pointer |
| Teacher: click line number | Toggle breakpoint |

---

## 9. npm scripts

| Script | Purpose |
|---|---|
| `npm start` / `npm run dev` | Start `server/index.js` |
| `npm run tunnel` | `ngrok http 3000` |
| `npm run doctor` | Preflight check (Node ≥ 18, port, ngrok, data/ writable) |
| `npm run setup` | Interactive CLI onboarding wizard |
| `npm run new:lang -- <id> [label] [ext]` | Scaffold a new language plugin |
| `npm test` | All tests (`tests/**/*.test.js`) via `node --test` |
| `npm run test:server` | Server-side tests only |
| `npm run test:client` | Client-side tests only |
| `npm run lint` | Zero-dependency `node --check` on all JS sources |

---

## 10. Adding a new language

The fastest path: `npm run new:lang -- <id> [label] [ext]` — the scaffolder creates
`src/languages/<id>/{plugin,keywords,snippets,syntax,content}.js`, a monogram SVG in
`public/assets/icons/`, appends the entry to `src/languages/registry.json`, and inserts
the `<script>` tag into `public/index.html`. Then add sample exercises to `content/<id>/`.

Manual steps for full control: see [docs/EXTENDING-LANGUAGES.md](docs/EXTENDING-LANGUAGES.md).

---

## 11. Documentation

| File | Contents |
|---|---|
| [docs/TEACHER-GUIDE.md](docs/TEACHER-GUIDE.md) | Onboarding, lobby, access codes, sharing (LAN / ngrok), editor, feedback channels, replay, settings, troubleshooting |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Module map, layering rules, Mermaid sequence diagrams |
| [docs/EXTENDING-LANGUAGES.md](docs/EXTENDING-LANGUAGES.md) | Plugin shape, registry fields, scaffolder reference |
| [docs/RELEASE-NOTES-v1.0.0.md](docs/RELEASE-NOTES-v1.0.0.md) | Full v1.0.0 release notes and migration notes |
| [CHANGELOG.md](CHANGELOG.md) | Phase-by-phase change log (Phases 0 → 10) |
| [ROADMAP.md](ROADMAP.md) | Original 10-phase feature plan |

---

## License

ISC — see [package.json](package.json). Author: **Σωτήρης Μπαλατσιάς**.
