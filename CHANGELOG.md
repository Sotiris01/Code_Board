# Changelog

All notable changes to Code Board are tracked here.
The project follows the phased plan in [ROADMAP.md](ROADMAP.md).

## [Unreleased]

## [1.0.0] — 2026-05-24

First stable release. Closes Phases 0 → 10 of [ROADMAP.md](ROADMAP.md).

### Phase 10 — Tests, docs, release

- **10.1 Server tests** — `tests/server/` covers every `/api/*` route
  via [`supertest`](https://github.com/ladjs/supertest) plus a real
  WebSocket handshake. `server/index.js` now exports
  `{ app, server, wss }` and only calls `server.listen()` when run
  directly (`require.main === module`), so tests can drive the HTTP
  surface without binding a port.
- **10.2 Client tests** — `tests/client/` runs in plain `node:test`
  using the built-in `vm` module: AutoPairs auto-closes brackets,
  RunnerRegistry's pluggable run-target contract, ThemeManager
  persists `aepp-theme` in `localStorage`. Settings round-trip is
  covered server-side in `tests/server/settingsStore.test.js` against
  the canonical deep-merge implementation.
- **10.3 CI** — new [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
  runs `npm ci`, `npm run lint`, `npm test` on every push / PR
  against Node 20.x and 22.x. The lint script
  ([`scripts/lint.mjs`](scripts/lint.mjs)) is zero-dependency: it
  `node --check`s every `*.js` under `server/`, `src/`, `scripts/`,
  `tests/`.
- **10.4 Teacher guide** — [`docs/TEACHER-GUIDE.md`](docs/TEACHER-GUIDE.md)
  walks through onboarding, lobby + access codes, sharing (LAN /
  ngrok), the editor, feedback channels (hand raise + reactions +
  worksheet), replay export, settings + storage, and a
  troubleshooting matrix. Screenshot slots reference `docs/img/*` —
  teachers capture their own once on first boot since UI layout is
  now stable.
- **10.5 Architecture doc** — [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md)
  with a full module map, the project's layering rules, and
  Mermaid sequence diagrams for boot, student join, code-edit
  broadcast + event log, and replay export.
- **10.6 Release** — version pinned at `1.0.0`. Release notes in
  [`docs/RELEASE-NOTES-v1.0.0.md`](docs/RELEASE-NOTES-v1.0.0.md). The
  actual `git tag v1.0.0 && git push origin v1.0.0` is left to the
  maintainer (public + hard-to-reverse, see the release notes for the
  exact command).

### Phase 9 — Classroom features

Seven independent classroom tools, each shipped as a small
self-contained module.

- **9.1 Multi-tab editor** — new
  [`src/ui/TabsBar.js`](src/ui/TabsBar.js) plus a `#tab-bar` strip
  above the editor (teacher-only, hidden by default). The new 🗂 Tabs
  toolbar button toggles the strip. Each tab keeps its own
  `{ name, language, code }` buffer; switching swaps the editor
  content and broadcasts via the normal `code_update` flow. Tabs
  persist to `localStorage` (`aepp-tabs-v1`).
- **9.2 Hand-raise + note** — new
  [`src/ui/HandRaise.js`](src/ui/HandRaise.js) adds the missing ✋
  student button next to the reactions row. On raise, an optional
  short note (≤280 chars) is collected; the `hand_raise` WS message
  carries `note`; the teacher badge `#raised-hands` tooltip lists
  names and notes. Both the server handler at
  [`server/index.js`](server/index.js) and the client
  [`Collaboration.handleHandRaise`](src/modules/Collaboration.js)
  were extended.
- **9.3 Lesson replay** — new
  [`src/ui/ReplayModal.js`](src/ui/ReplayModal.js) and endpoint
  `GET /api/sessions/:key/events`. The modal loads any past session,
  rebuilds frames by walking the JSONL event log and applying
  `fast-diff` patches, and offers play / step / scrub / reset.
  [`server/services/sessionStore.js`](server/services/sessionStore.js)
  now writes a one-line `baseline` marker so replays reconstruct
  non-empty starts.
- **9.4 Private worksheet** — new
  [`src/ui/WorksheetPanel.js`](src/ui/WorksheetPanel.js) (student-only
  floating panel) + endpoints `GET/PUT /api/worksheet/:id` persist a
  per-student scratch pad to `data/worksheets/<id>.txt` (512KB cap).
  Identity uses `Collaboration.myId` when connected, otherwise a
  stable `localStorage` UUID. Debounced autosave.
- **9.5 HTML replay export** — new
  [`server/services/replayBuilder.js`](server/services/replayBuilder.js)
  emits a fully self-contained HTML player (inline JS, no external
  deps) embedding the snapshot, events, and a minimal scrubber.
  Exposed at `GET /api/sessions/:key/export`; surfaced as the ⬇
  Export HTML link inside the replay modal.
- **9.6 Mobile read-only** — new
  [`styles/components/phase9.css`](styles/components/phase9.css)
  `@media (max-width: 768px)` rules disable editor pointer events
  for `body[data-role="student"]`, enlarge reactions to 44px touch
  targets, and reflow the worksheet to full width.
  [`Collaboration.js`](src/modules/Collaboration.js) now stamps the
  role onto `document.body.dataset.role` on init.
- **9.7 Pluggable runners** — new
  [`src/core/RunnerRegistry.js`](src/core/RunnerRegistry.js) provides
  `register(id, fn)` / `has(id)` / `runFor(id, code)`. Default runners
  open the cpp source in Compiler Explorer (URL-encoded session JSON),
  java in JDoodle, python in Trinket, with a no-op for glossa. New
  toolbar ▶ Run button (teacher) wired via
  [`src/ui/RunButton.js`](src/ui/RunButton.js).

Cache bust: `styles/main.css?v=49`, `Collaboration.js?v=55`; all new
scripts loaded at `?v=1`.

### Phase 8 — Persistence & reliability

- **Rotating snapshots:** new
  [`server/services/sessionStore.js`](server/services/sessionStore.js)
  replaces the single `data/.session-state.json` with
  `data/sessions/YYYY-MM-DD.json` snapshots plus a `current` pointer
  (real symlink when permitted, JSON fallback otherwise). Both the
  debounced `saveState()` and the shutdown-time `saveStateImmediate()`
  in [`server/index.js`](server/index.js) write through it; the boot
  loader prefers the latest snapshot and falls back to the legacy
  file.
- **Append-only event log:** every `code_update` / `template_loaded`
  is appended to `data/sessions/YYYY-MM-DD.events.jsonl`.
  `code_update` payloads are compressed with
  [`fast-diff`](https://www.npmjs.com/package/fast-diff) so a long
  lesson stays compact — basis for the Phase 9 replay UI. Two new
  endpoints expose the data: `GET /api/sessions` lists snapshots with
  size + mtime, `GET /api/sessions/:key` returns the snapshot and an
  event count.
- **Offline outbox:**
  [`src/modules/Collaboration.js`](src/modules/Collaboration.js) now
  queues whitelisted outbound messages (`code_update`, `cursor_update`,
  `highlight_update`, `hand_raise`, `reaction`, `pdf_sync`,
  `markdown_sync`, `scroll_sync`, `template_loaded`) into
  `localStorage` (`aepp-collab-outbox`, 256 KB cap) when the
  WebSocket is down, dedupes chatty per-keystroke ops to keep only
  the latest, and flushes everything on the next `onopen`.
- **Seq counter for catch-up:** `currentState.seq` is bumped on every
  code mutation server-side and included in every `init` payload (all
  three init code paths) and in the broadcast frame. The client
  tracks `_lastSeq`, sends a `request_since` on reconnect, and the
  server replies with a new `state_sync` frame carrying the latest
  code if the client is behind. CSS-aside, the script cache for
  [`Collaboration.js`](src/modules/Collaboration.js) is bumped to
  `?v=54`.

### Phase 7 — Server hardening & ops

- **Security middleware:** new
  [`server/middleware/security.js`](server/middleware/security.js)
  optionally loads `helmet` (with graceful console-fallback headers
  when the dependency is absent), caps `express.json()` and
  `express.urlencoded()` at 1 MB, and installs a CORS allowlist that
  defaults to any localhost port plus the ngrok tunnel host from
  `data/ngrok.json` and the Settings dialog's custom domain.
- **Rate-limit:** new
  [`server/middleware/rateLimit.js`](server/middleware/rateLimit.js)
  is a dependency-free sliding-window limiter — applied to
  `/api/upload` (30 req / min) and exposed via `.allow(ip)` for the
  WS connection handler (20 handshakes / min per IP) to slow down
  password brute-force.
- **Logging:** new
  [`server/middleware/logging.js`](server/middleware/logging.js)
  exposes a `logger` that uses `pino` when present and falls back to
  `console`; an HTTP access log is registered but silent unless
  `DEBUG=1` is set.
- **Daily uploads GC:**
  [`server/services/uploadsGc.js`](server/services/uploadsGc.js)
  gains a `schedule(uploadsDir, opts)` helper that runs the existing
  sweep on a 24-hour `unref`-ed `setInterval`. Wired at boot in
  [`server/index.js`](server/index.js).
- **Doctor preflight:** new
  [`scripts/doctor.mjs`](scripts/doctor.mjs) (run via `npm run
  doctor`) checks Node ≥ 18, that the configured `PORT` is free,
  that `ngrok` is on the `PATH`, that `data/` and `uploads/` are
  writable, and whether `data/settings.json` already exists. Accepts
  `--strict` to exit non-zero for CI.
- **Graceful shutdown:** SIGINT/SIGTERM handler in
  [`server/index.js`](server/index.js) now broadcasts a new
  `server_shutdown` WS frame, flushes session state synchronously
  through the new `saveStateImmediate()` helper, closes WS + HTTP
  cleanly, and force-exits after 5 s.
- **PM2 manifest:** optional
  [`scripts/ecosystem.config.cjs`](scripts/ecosystem.config.cjs)
  ships fork-mode config with `kill_timeout: 5000` so the graceful
  shutdown path has time to run.

### Phase 6.C — Headless fallbacks

- **Postinstall banner:** new
  [`scripts/postinstall.mjs`](scripts/postinstall.mjs) runs
  automatically after `npm install` (wired through
  [`package.json`](package.json)'s `postinstall` script). It ensures
  `data/` exists and prints the local URL, teacher/student links,
  and a hint about the in-app wizard or `npm run setup` (the new
  `--interactive` flow). The script is wrapped in a catch-all so it
  can never break `npm install`.
- **CLI wizard:** `npm run setup` re-uses the same script to drive a
  Node `readline/promises` version of the onboarding wizard —
  prompts for profile, access-code policy, default language (sourced
  from `languageRegistry.ids()`), theme, sharing mode and optional
  ngrok authtoken, then writes `data/settings.json` (and
  `data/ngrok.json` when relevant) directly, so the in-browser
  wizard is skipped.
- **Env-var pre-seeding:**
  [`server/services/settingsStore.js`](server/services/settingsStore.js)
  gains `seedFromEnv(env)`, which on first boot (when
  `data/settings.json` is missing) reads `CODE_BOARD_*` variables —
  one per setting field — and writes a merged settings object,
  coercing booleans (`true/yes/on/1`) and numbers. Hook installed at
  the top of [`server/index.js`](server/index.js) so deployments can
  skip both the GUI and the CLI wizards entirely.
- **`.env.example`:** new [`.env.example`](.env.example) documents
  every supported runtime knob (`PORT`, `TEACHER_PASSWORD`,
  `UPLOADS_TTL_DAYS`) plus the full `CODE_BOARD_*` seed family
  covering profile, classroom, defaults, editor, sharing, ngrok and
  storage.

### Phase 6.B — Always-available Settings dialog

- **Settings dialog:** new
  [`src/ui/SettingsDialog.js`](src/ui/SettingsDialog.js) ships a
  teacher-only, six-tab modal (Profile · Classroom · Editor ·
  Sharing · Storage · About) opened from the new ⚙ button in the
  toolbar (`#settings-btn`) or via `Ctrl+,`. Tabs render on demand
  with inline error slots, live profile-card preview, a Sharing-tab
  QR code for the student link, and a Storage-tab disk breakdown.
- **API:** four new endpoints in
  [`server/index.js`](server/index.js):
  - `GET /api/settings` → merged settings + masked ngrok info +
    installed languages + app version.
  - `PATCH /api/settings` → whitelisted deep-merge with per-field
    validation; mirrors profile into `data/teacher-info.json` and
    broadcasts a `settings_changed` WS frame on success. Bad
    payloads return HTTP 400 with `{ field, error }` so the dialog
    can show inline errors.
  - `POST /api/settings/ngrok` saves the authtoken to the gitignored
    `data/ngrok.json`. `GET /api/settings/ngrok/test` probes the
    local ngrok agent at `:4040`.
  - `GET /api/storage/stats` reports per-session upload sizes + data
    dir usage; `POST /api/storage/clear-uploads` wipes every
    `uploads/<session>` folder except the active one.
- **Settings store:**
  [`server/services/settingsStore.js`](server/services/settingsStore.js)
  gained `defaults()`, `deepMerge()`, `loadMerged()`, and `update()`
  so new top-level sections (`editor`, `storage`, extended
  `classroom`/`sharing`) surface immediately without a migration.
- **Styling:** scoped
  [`styles/components/settings.css`](styles/components/settings.css)
  using existing CSS variables; imported through
  [`styles/main.css`](styles/main.css). CSS cache bumped to `?v=48`.
- **Toolbar:** gear button wired in
  [`src/ui/Toolbar.js`](src/ui/Toolbar.js)' teacher-only init
  (alongside the existing classroom controls). Students never see
  the button.

### Phase 6.A — First-run onboarding wizard

- **Settings store:** new
  [`server/services/settingsStore.js`](server/services/settingsStore.js)
  owns `data/settings.json` (the wizard output) and `data/ngrok.json`
  (auth-token vault). Both files stay out of git via the existing
  `data/*` rule.
- **API:** two endpoints in
  [`server/index.js`](server/index.js) — `GET /api/onboarding/status`
  (reports completion + advertises the installed languages from
  `LanguageRegistry`) and `POST /api/onboarding/complete` (validates
  the payload, persists settings, mirrors the profile fields into
  `data/teacher-info.json` so the lobby card keeps working, and
  optionally saves an ngrok authtoken).
- **Wizard UI:** new
  [`src/ui/OnboardingWizard.js`](src/ui/OnboardingWizard.js) ships a
  full-screen six-step modal (Profile → Access-code policy →
  Default language → Default theme → Sharing/ngrok → Review) with a
  progress bar, Back/Next navigation, and inline validation. On
  finish it POSTs the bundle, applies the chosen theme, and reloads.
- **Styling:** scoped
  [`styles/components/onboarding.css`](styles/components/onboarding.css)
  using existing CSS variables; imported through
  [`styles/main.css`](styles/main.css). CSS cache bumped to `?v=47`.
- **Gating:** the wizard is teacher-only — booted from
  [`src/main.js`](src/main.js)' `init()` only when the URL carries
  `?role=teacher`, and silently skipped once `data/settings.json`
  exists. Students never see it.

### Phase 5 — Ready for new languages (plugin-friendly)

- **Single source of truth:**
  [`src/languages/registry.json`](src/languages/registry.json) lists
  every installed language with id, label, namespace, file extensions,
  comment syntax, indent/dedent triggers, auto-pair map and icon.
  Both the client and the server read from it, so adding a language
  no longer means editing scattered constants.
- **Client `LanguageRegistry`
  ([src/core/LanguageRegistry.js](src/core/LanguageRegistry.js)):**
  fetches `registry.json` once, exposes `register(plugin)`, `get(id)`,
  `list()`, `ids()`, `extensions()`, `forExtension(ext)`, and a
  `ready` Promise. Each language ships a self-registering descriptor
  at `src/languages/<id>/plugin.js`
  ([glossa](src/languages/glossa/plugin.js),
  [python](src/languages/python/plugin.js),
  [cpp](src/languages/cpp/plugin.js),
  [java](src/languages/java/plugin.js)). Coexists with the existing
  `LanguageManager`, which still owns dynamic script loading.
- **Server registry
  ([server/services/languageRegistry.js](server/services/languageRegistry.js)):**
  synchronously reads the same JSON file at boot and exposes
  `contentAllowedExtensions()`, `browseAllowedExtensions()` and
  `uploadsTextExtensions()`. The three hard-coded extension arrays in
  [server/index.js](server/index.js) (file browser, `/api/files/content`,
  `/api/uploads`) now derive from the registry — the server picks up
  new languages on the next restart with zero edits.
- **Toolbar wired to the registry
  ([src/main.js](src/main.js)):** `#language-selector` is rebuilt from
  `LanguageRegistry.list()` once `ready` resolves; on `languageChanged`
  the toolbar swaps a new SVG icon (`<img id="language-selector-icon">`,
  styled in [styles/layout/toolbar.css](styles/layout/toolbar.css)).
  Monogram icons ship under
  [`public/assets/icons/{glossa,python,cpp,java}.svg`](public/assets/icons/).
- **Per-language auto-pairs:**
  [`AutoPairs`](src/editor/input/AutoPairs.js) now reads
  `LanguageRegistry.get(id).autoPairs` so quote and bracket behaviour
  follows the active language (Python keeps `` ` ``, Glossa drops `{`).
- **Scaffolder
  ([scripts/new-language.mjs](scripts/new-language.mjs)):**
  `npm run new:lang -- <id> [label] [ext]` creates
  `src/languages/<id>/{plugin,keywords,snippets,syntax,content}.js`,
  drops a monogram SVG into `public/assets/icons/`, appends the
  language to `registry.json`, and inserts the `<script>` tag into
  `public/index.html`. Refuses to overwrite an existing id.
- **Documentation:**
  [`docs/EXTENDING-LANGUAGES.md`](docs/EXTENDING-LANGUAGES.md) walks
  through the Ruby example, the `LanguagePlugin` contract, where each
  field is consumed, and the manual fallback path.
- Cache hints bumped: `styles/main.css?v=46`, AutoPairs `?v=2`,
  new plugin scripts `?v=1`. Smoke test green (all new asset URLs
  return 200; `/api/files?path=glossa` returns 7 items).

### Phase 4 — Better code-writing experience

- **New plugin pipeline on `GridEditor`
  ([src/components/GridEditor.js](src/components/GridEditor.js)):**
  `editor.use(plugin)` registers an object exposing any of
  `init(editor)`, `handleInput(editor, text)`, `handleKeyDown(editor, e)`,
  `handleBackspace(editor)`, `handleEnter(editor)`, `transformPaste(editor, text)`.
  Returning truthy from a handler swallows the default behaviour. Public
  helpers were added so plugins can edit the buffer cleanly:
  `insertTextAtCursor`, `replaceRange`, `replaceLines`, `getIndentUnit`,
  `setTabSize`, `setUseTabs`.
- **4.1 AutoPairs**
  ([src/editor/input/AutoPairs.js](src/editor/input/AutoPairs.js)) —
  auto-closes `( [ { " ' \``, skips over a matching closer when the user
  types it, deletes both halves on backspace, and skips quote-pairing
  inside identifiers (so `don't` still works).
- **4.2 AutoIndent**
  ([src/editor/input/AutoIndent.js](src/editor/input/AutoIndent.js)) —
  on Enter copies the leading whitespace of the previous line and adds
  one indent step after Python `:`, C/Java `{` or any of the GLOSSA
  block openers (`ΑΡΧΗ`, `ΑΝ … ΤΟΤΕ`, `ΓΙΑ`, `ΟΣΟ`, `ΕΠΙΛΕΞΕ`,
  `ΣΥΝΑΡΤΗΣΗ`, `ΔΙΑΔΙΚΑΣΙΑ`, `ΑΛΛΙΩΣ`). Auto-dedents an otherwise
  whitespace-only line when the user types `}` or any `ΤΕΛΟΣ_*`.
- **4.3 BlockComment**
  ([src/editor/input/BlockComment.js](src/editor/input/BlockComment.js))
  — `Ctrl+/` toggles a `# `, `// ` or `! ` prefix per active language on
  the cursor line or every line touched by the current selection.
- **4.4 Soft tabs** — `Tab` already produced spaces; we now expose
  `gridEditor.setTabSize(n)` and `setUseTabs(bool)`, and `src/main.js`
  restores a saved width from `localStorage.aepp-tab-size` on boot. A
  visible settings UI is rolled into Phase 6.
- **4.5 Origin-aware Ctrl+Z** — `_handleBackspace/_handleEnter/`
  `_handleInput/_handlePaste/undo()/redo()` all early-return when
  `this.readOnly` is true, so a student's `Ctrl+Z` is a silent no-op.
  Their `Ctrl+Shift+Z` is repurposed to scroll to the teacher's caret
  via `scrollToLine(remoteCursor.row + 1, true)`. The existing
  `Collaboration.setValue(remote, {skipUndo:true, …})` path already
  prevents remote echoes from polluting the teacher's history; the
  full `editor/model/History.js` extraction is deferred. The undo
  coalescing window was tightened from 300 ms → 200 ms per spec.
- **4.6 MultiCursor (scaffold, teacher-only)**
  ([src/editor/input/MultiCursor.js](src/editor/input/MultiCursor.js))
  — `Alt+click` adds a translucent caret marker; click again to remove,
  `Esc` clears all. Typing into secondary carets is intentionally not
  wired (engine refactor deferred).
- **4.7 Find/Replace overlay**
  ([src/editor/input/FindReplace.js](src/editor/input/FindReplace.js))
  — `Ctrl+F` opens find, `Ctrl+H` opens find + replace. Case-sensitive,
  whole-word and regex toggles. `Enter`/`Shift+Enter` cycle matches;
  `Esc` closes. Matches highlight via `.find-match` /
  `.find-match-current`; replace-all walks bottom-up to keep offsets
  stable.
- **4.8 SmartPaste**
  ([src/editor/input/SmartPaste.js](src/editor/input/SmartPaste.js))
  — strips `>>> `, `... ` and `$ ` prompts on paste *only* when every
  non-blank line in the pasted text starts with one of them (so normal
  prose containing `$` is left alone).
- **4.9 BracketMatch**
  ([src/editor/input/BracketMatch.js](src/editor/input/BracketMatch.js))
  — when the caret sits at `( [ {` (or just past `) ] }`) the partner is
  highlighted via `.bracket-match`; rehighlight is hooked into
  `onCursorChange` / `onContentChange`.
- **4.10 GutterDragSelect**
  ([src/editor/input/GutterDragSelect.js](src/editor/input/GutterDragSelect.js))
  — `mousedown` on the line-number gutter selects the whole clicked
  line; dragging extends the selection to all intermediate lines.
- **CSS** added in
  [styles/components/editor.css](styles/components/editor.css)
  for `.bracket-match`, `.find-match`, `.find-match-current`,
  `.multi-cursor-mark` and the `.find-replace-panel` overlay.
- **Wiring.** Plugins are loaded from
  [public/index.html](public/index.html) and installed at boot in
  [src/main.js](src/main.js#L247) right after `new GridEditor(...)`.
  CSS cache hint bumped to `?v=45`; `GridEditor.js` to `?v=28`.
- **Smoke test.** `npm start` boots clean and `styles/main.css?v=45`,
  `src/components/GridEditor.js?v=28` and all eight
  `src/editor/input/*.js` modules return `200 OK`.

### Phase 3 — Robust, responsive UI

- **Breakpoint tokens added to
  [styles/tokens.css](styles/tokens.css):** `--bp-sm: 1100px`,
  `--bp-md: 1440px`, `--bp-lg: 1920px` plus `--editor-min-width: 60ch`.
  All Phase 3 media queries now reference these tokens so the
  team-wide breakpoints live in one place.
- **Two-row, overflow-aware toolbar
  ([styles/layout/toolbar.css](styles/layout/toolbar.css)).** `.toolbar`
  now uses `flex-wrap: wrap`, `min-height: var(--toolbar-height)` and
  small row/column gaps so controls flow onto a second row instead of
  clipping. Below `--bp-sm` (1100 px) `.toolbar-right` is pushed onto
  its own row and side padding tightens to 12 px.
- **Sidebar overhaul
  ([src/components/UIManager.js](src/components/UIManager.js)).**
  `SidebarResizer` was rewritten to bind to the live `#side-panel`
  (the previous `#keyword-sidebar` target was orphaned by the Phase 1
  HTML refactor). Width is persisted **per active panel** in
  `localStorage` under `aepp-sidebar-width:<panelId>`; the resize
  handle supports double-click → reset; a global `Ctrl+B` toggles the
  panel; a `ResizeObserver` on `.app-container` auto-collapses below
  1100 px and re-expands above 1200 px unless the user explicitly
  collapsed. `FileBrowser.switchPanel` now broadcasts
  `sidebarPanelChanged` so the resizer can re-apply the per-panel
  width on tab switches. _Note:_ promotion of these widths into
  `data/settings.json` is intentionally deferred to Phase 6 alongside
  the SettingsPanel work.
- **Editor area
  ([styles/components/editor.css](styles/components/editor.css) +
  [src/components/UIManager.js](src/components/UIManager.js)).**
  `.code-area` and `#grid-editor-container` now carry `min-width:
  var(--editor-min-width)`. A new `OverflowIndicator` module observes
  the editor container plus its scrollable children with
  `ResizeObserver` and toggles `.has-overflow-x`, which lights up a
  right-edge fade overlay (`.editor-container::after`). A new
  `SoftWrap` module exposes the soft-wrap toggle via `Alt+Z` and a new
  ↩ toolbar button in [public/index.html](public/index.html); default
  is ON for students / OFF for teachers, persisted in `localStorage`.
- **Status bar
  ([styles/layout/footer.css](styles/layout/footer.css)).** Below
  `--bp-sm` the bar becomes `overflow-x: auto` and the centre cluster
  is hidden so the bar never pushes the editor down. The full
  ⋯-popover variant from the original spec is deferred to Phase 6
  (SettingsPanel) because it needs a generic popover primitive.
- **Modals as bottom-sheets
  ([styles/components/modal.css](styles/components/modal.css)).** When
  `max-height ≤ 700px`, modals stick to the bottom of the viewport,
  span the full width, and slide up via a new `cb-slide-up` keyframe —
  much more usable on laptops with the dock on the side.
- **No `window.onresize` spam.** All layout reactions in Phase 3 are
  driven by `ResizeObserver`s; a `layoutChanged` custom event is
  dispatched from the sidebar observer so other modules can subscribe
  without registering their own listeners.
- **Cache bump:** `<link href="styles/main.css?v=44">` in
  [public/index.html](public/index.html). Smoke test: `npm start`
  boots clean; all touched assets return HTTP 200.

### Phase 2 — Themeable design system

- **`styles/legacy.css` is gone.** The 3477-line monolith was split by
  `scripts/split-css.ps1` into a tokens + reset + base trio, two theme
  files under `styles/themes/`, three `styles/layout/*.css` files
  (toolbar, sidebar, footer), and 13 `styles/components/*.css` files
  (editor, syntax, toast, modal, keywords, file-tree, shared-files,
  collaboration, viewers, role-visibility, reactions, session, lobby).
- **`styles/main.css` barrel.** One `<link rel="stylesheet"
  href="styles/main.css?v=43">` in `public/index.html` now `@import`s the
  whole stack in the right order (tokens → themes → reset → base →
  layout → components).
- **`ThemeManager` replaces `ThemeToggle`.** Themes are now driven by
  `document.documentElement[data-theme="dark|light"]` instead of
  `body.light-theme`. The light theme is a single `:root[data-theme=
  "light"] { … }` token-override block under `styles/themes/light.css`;
  dark is the default in `styles/tokens.css`. `Ctrl+Shift+T` still
  toggles; preference still persists in `localStorage("aepp-theme")`.
  `ThemeToggle` is kept as an alias for any external caller.
- **Theme syncs across the room.** Teacher's toggle sends
  `{ type: 'theme_change', theme }` over WS; the server stores it on
  `currentState.theme`, broadcasts to peers, and folds it into the
  `init` payload so freshly-joining students adopt the teacher's theme
  automatically (without rebroadcasting it back).
- **High-contrast tokens lifted into `tokens.css`.** The orphan
  `@media (prefers-contrast: high)` block that was stranded inside the
  remote-highlight section now lives next to the other root tokens.

### Phase 1 — Triage & polish

- **Theme toggle double-emoji fixed.** Removed the `body.light-theme
  .theme-icon::before { content: '☀️' }` rule that was stacking a second
  sun on top of the JS-managed `textContent`.
- **Lobby placeholder now derived from `maxlength`.** `LobbyManager` sets
  `input.placeholder` to one `•` per allowed character at init time, so
  the placeholder always matches the input width (4 dots for a 4-digit
  code, no manual HTML edits needed).
- **Ngrok status block hides when no tunnel.** `StatusBar` no longer
  shows `--ms` / `? 👥` when `/api/ngrok-stats` returns `success:false`
  or fails — the whole `#ngrok-stats` element gets `display:none` until
  a live tunnel is detected.
- **Shortcuts modal aligned on a grid.** `.shortcut-row` switched from
  `flex / space-between` to `grid-template-columns: max-content 1fr` so
  the `kbd` chips stay tight on the left and the labels stay right-aligned.
- **Toolbar title collapses to icon-only below 1100 px.** The "Code Board"
  text was wrapped in `<span class="app-title-text">` and hidden via a
  `@media (max-width: 1100px)` rule; the 📝 icon stays visible.
- **`uploadsGc` service added.** New `server/services/uploadsGc.js`
  scans `uploads/` on boot and removes per-session folders whose mtime
  is older than `UPLOADS_TTL_DAYS` (default 7, env-overridable). Called
  from `server/index.js` before the new session folder is created. First
  run pruned 31 stale folders.
- **Dead dropdown plumbing removed from `src/main.js`.** Deleted the
  `templateSelect`, `exerciseSelect`, `algorithmSelect` element handles
  plus the `loadTemplate` / `loadExercise` / `loadAlgorithm` handlers,
  `populateDropdownFromData`, `populateExerciseDropdown`, and
  `populateAlgorithmDropdown` — none of those DOM IDs exist anymore.
- **`public/favicon.svg` added** (dark CB monogram, accent blue `#4d8eff`)
  and wired into `public/index.html` in place of the `data:` stub. The
  legacy stylesheet query-bumped to `?v=42` so caches refresh.

Smoke-tested: server boots, `uploadsGc` reports its cleanup line, teacher
and student pages reconnect to the restored session, live WS connections
work end-to-end.

## [Phase 0]

- **Folder skeleton** created for every later phase: `server/{routes,ws,services,middleware}`,
  `public/{assets/icons,assets/fonts}`, `styles/{layout,components,themes}`,
  `src/{net,editor/{model,view,input},viewers,panels}`, `data/`, `docs/`,
  `scripts/`, `tests/{server,client}`. Empty folders get a `.gitkeep` placeholder.
- **`server.js` moved to `server/index.js`** with a compatibility shim left at the
  repo root so `node server.js` still works. All `__dirname` references were
  rebased on a new `ROOT_DIR = path.join(__dirname, '..')` constant.
- **Static-file middleware** now serves `public/` first, then the repo root for
  back-compat with existing `src/`, `styles/`, `content/`, `uploads/` URLs.
- **`index.html` moved to `public/index.html`** (its `<link rel="stylesheet">`
  was retargeted to `styles/legacy.css`).
- **`styles.css` moved to `styles/legacy.css`** unchanged; it will be split into
  tokens + components in Phase 2.
- **`teacher-info.json` and `.session-state.json` moved into `data/`.** The
  server creates `data/` on boot if missing.
- **`package.json`** `main` + `scripts.start` + `scripts.dev` now point at
  `server/index.js`.
- **`.gitignore`** updated: ignores everything under `data/` and `uploads/`
  except `.gitkeep` and `data/teacher-info.json`.

No user-visible behaviour changes. Smoke-tested: server boots, teacher and
student pages render, file explorer loads, language switch works.
