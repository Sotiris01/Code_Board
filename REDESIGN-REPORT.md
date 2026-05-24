# Code Board — Redesign Report

_Date: 24 May 2026_
_Author: redesign pass after exploring the running app (teacher + student) on http://localhost:3000_

Screenshots referenced below are saved in [.screenshots/](.screenshots).

---

## 0. Method

1. Read `server.js`, `index.html`, every file under `src/`, and surveyed
   `content/`.
2. Started `node server.js` and opened two browser sessions:
   teacher (`/?role=teacher`) and student (`/`).
3. Drove the UI through: language switching, mode switching, file explorer,
   shared files, shortcuts modal, lobby join, file load, theme toggle,
   sidebar collapse, two viewport widths (1366 and 1600).
4. Captured 11 screenshots (see table at the end).

---

## 1. The honest current state

What works well today — keep it:

- **Lobby card** ([06-student-view.png](.screenshots/06-student-view.png)) —
  big, friendly, teacher contact card, single clear CTA. Good first impression.
- **Activity-bar + side-panel** pattern (Keywords / Files / Shared / Local).
  Familiar to anyone who's used VS Code.
- **WebSocket protocol coverage** is surprisingly complete: editor, cursor,
  highlights, breakpoints, PDF/MD sync, presence, reactions, admin.
- **Per-language module shape** (`keywords / syntax / snippets / content`) is
  consistent across glossa / python / cpp / java — easy to extend.
- **Session persistence** survives a restart (`.session-state.json`).
- **Encoding auto-detection** for `.glo` (Windows-1253) is a real classroom
  win for Greek schools.

What's actively hurting the product — fix:

### 1.1 Toolbar overflow

- Visible in [08-teacher-wide-1600.png](.screenshots/08-teacher-wide-1600.png):
  on a 1600 px viewport the toolbar already pushes elements off-screen.
  At a normal teacher laptop (1366 px) the "📝 Code Board" title is clipped
  ([01-teacher-initial.png](.screenshots/01-teacher-initial.png),
  [09-teacher-with-code.png](.screenshots/09-teacher-with-code.png)).
- Root cause: too many flex items in one row, no priority, no overflow menu.
  Order today: title • mode-toggle • language • presence avatars • access-code
  block • free-enter toggle • theme • help • copy • clear (≥ 11 items).

### 1.2 Editor cropping

- [09-teacher-with-code.png](.screenshots/09-teacher-with-code.png) shows
  Python lines silently cut at the right (`algorith`, `lst[j`, `numbers.copy()`).
- The grid editor renders one DOM cell per character and the row width is
  bound to the editor area; long lines just disappear because horizontal
  overflow is hidden and there's no soft-wrap and no scrollbar style.
- This is a **teaching blocker**: a student literally cannot read the demo.

### 1.3 Sidebar takes too much space

- The right sidebar (activity bar + panel) consumes ~38 % of a 1366 px
  screen. Combined with `~40 px` line-number gutter, the code area is < 50 %
  of the screen.
- It has a resize handle, but no remembered width, no min-width on the editor
  side, no double-click-to-reset.

### 1.4 Light theme is half-done

- [10-light-theme.png](.screenshots/10-light-theme.png): line numbers, the
  editor background, the gutter and the right code area are white/very light;
  toolbar controls largely lose their styling. The screenshot also shows
  horizontal scroll has appeared on the page itself — a layout bug, not a
  scrollbar style bug.

### 1.5 Small but visible polish bugs

- **Theme button doubles its emoji** to `☀️☀️` after first toggle
  (snapshot from accessibility tree on click). The text content is set twice.
- **Lobby code input** shows 3 placeholder dots for a 4-digit field
  ([06-student-view.png](.screenshots/06-student-view.png)).
- **Ngrok stats** shows `?-ms` and a broken-glyph emoji for "Active
  Connections" when ngrok isn't running.
  ([01-teacher-initial.png](.screenshots/01-teacher-initial.png)).
- **Shortcuts modal** has massive empty space between `kbd`s — `Ctrl` and
  `Z` sit on opposite ends of the row
  ([05-shortcuts-modal.png](.screenshots/05-shortcuts-modal.png)).
- **PDF mode button** opens a file picker every time it's clicked, even when
  already in PDF mode (README calls this a feature — "click again to load
  new" — but it surprises and there's no way to *just enter* the mode).
- **Greek code in the GLOSSA template** renders OK but the "ΔΙΑΒΑΣΕ α"
  is presented in italic and the `α` is in a different visual style than
  uppercase identifiers — there's no token rule for lowercase Greek
  identifiers ([01-teacher-initial.png](.screenshots/01-teacher-initial.png)).

### 1.6 Code-quality smells

- `src/modules/Collaboration.js` is **69 KB / ~1900 lines** — it is the
  transport, every message handler, the reaction logic, the breakpoint
  logic, the admin commands and ping/pong, all in one file.
- `src/components/GridEditor.js` is **49 KB** — the editor, the selection
  model, the highlight model, the breakpoint model.
- `styles.css` is **75 KB monolithic**, no CSS variables for the brand
  colors (`#4d8eff`, the blue badges), no theming layer.
- `src/main.js` (24 KB) still grabs `document.getElementById` for
  things that other modules already own (`templateSelect`, `exerciseSelect`,
  `algorithmSelect` — these IDs are no longer in `index.html`, dead refs).
- `uploads/` already has **38 timestamped folders** from prior sessions
  and no cleanup task.

---

## 2. Redesign proposal

I'd structure this redesign as **three layers** so the work can ship
incrementally and each layer is independently valuable.

### Layer A — Visual & layout (1–2 days, highest user-visible payoff)

**A1. Compact, two-row, responsive toolbar.**

```
Row 1 (always visible):
  📝 Code Board     [Code|PDF|MD]     Language ▾                ⋯ overflow menu
Row 2 (teacher only, can collapse into "Class ▾"):
  CODE 4759 📋 🔄   ☐ Free Enter    👥 1    🔗 ngrok ok    🌙  ❓
```

- Group `Copy` / `Clear` / `Theme` / `Help` into an overflow `⋯` menu when
  width < 1280 px.
- Make "Code Board" title a logo-only `📝` icon below 1100 px.
- Move `Copy` / `Clear` into a per-mode action group (Copy in Code mode,
  Clear in Code mode only — they're meaningless in PDF mode).

**A2. Editor that always shows the code.**

- Add a real horizontal scrollbar on the grid editor.
- Add a "Soft wrap" toggle (default ON for student, OFF for teacher).
- Add a min-width on the editor area so the sidebar can never push it below
  ~55 % of viewport. Sidebar resize already exists — just add `min-width:
  60ch` on `.code-area` and `max-width: 480px` on `.sidebar-container`.

**A3. Design tokens.**

- Extract `styles.css` into `styles/tokens.css` + `styles/components/*.css`.
- Token set: `--cb-bg`, `--cb-bg-elev`, `--cb-fg`, `--cb-fg-muted`,
  `--cb-accent` (`#4d8eff` today), `--cb-danger`, `--cb-warn`, `--cb-ok`,
  `--cb-border`, `--cb-line-number-bg`, `--cb-line-number-fg`,
  `--cb-syntax-keyword/-string/-number/-comment/-type`.
- Define both `[data-theme="dark"]` and `[data-theme="light"]` overrides
  for **every** token. Today the light theme misses about a dozen.

**A4. Fix the polish bugs.**

- Theme toggle: replace `innerHTML += emoji` with `textContent = emoji`.
- Lobby placeholder: use 4 dots, or generate them dynamically from the
  `maxlength`.
- Ngrok block: hide entirely when `/api/ngrok-stats` returns
  `success:false`; don't render `--ms ?`.
- Shortcuts modal: change `.shortcut-row` from `space-between` to a
  `grid-template-columns: max-content 1fr` so kbd's stay tight on the left.

### Layer B — Architecture (3–5 days)

**B1. Split `Collaboration.js`.**

```
src/net/
  ├── socket.js           Connection, reconnect, ping/pong
  ├── auth.js             verify_code, admin_set_public, admin_cycle_code
  ├── presence.js         user_joined/left, window_focus, hand_raise, reaction
  ├── editorSync.js       code_update, cursor_update, highlights, breakpoints,
  │                       scroll_to_line, language_change, template_loaded
  ├── pdfSync.js          pdf_load/sync/laser
  ├── mdSync.js           markdown_content/state/laser
  └── files.js            folder_shared, file_deleted
```

A thin `index.js` exports a single `Collaboration` facade so existing
call-sites don't change. Each module < 200 lines.

**B2. Split `GridEditor.js` similarly.**

```
src/components/editor/
  ├── GridEditor.js       Public API (init, getValue, setValue, focus…)
  ├── model/              Document, Selection, History, Breakpoints
  ├── view/               Cells, LineNumbers, Cursors, Highlights
  └── input/              KeyMap, IME, Paste
```

**B3. Replace ad-hoc state in `main.js` with a small store.**

A 30-line pub/sub store holds `{ language, mode, theme, role, students,
reactions }`. UI modules subscribe. Removes the brittle "find element by id
and update it" pattern in `main.js` and the dead element references.

**B4. Server housekeeping.**

- Add an `uploads-gc.js` step on startup: delete any `uploads/<id>/`
  directory older than N days (configurable).
- Move the `/api/...` handlers into `server/routes/*.js`; keep
  `server.js` as the bootstrapper.
- Add `helmet`, `compression`, body-size limits and a CORS allowlist.
  Today the server is wide open — fine for LAN, scary on ngrok.

### Layer C — Product (ongoing, pick from menu)

Ordered by impact for an actual teacher:

1. **Multi-tab editor.** Today loading a second file replaces the first.
   Add tabs at the top of the editor (`file1.gls × | file2.gls × | + new`).
2. **Student "ask the teacher" inline.** When a student raises their hand,
   let them attach a 1–2 line note ("I get an error at line 17"). Teacher
   sees it in the student popup.
3. **Replay / scrollback.** Append every `code_update` to a per-session
   log and let the teacher scrub a timeline at end of class to show
   "before / after". Cheap with `fast-diff` already in deps.
4. **Run code (sandboxed).** GLOSSA has a public WASM interpreter;
   Python via Pyodide; C++ via clang-wasm is heavier so leave it as
   "Copy to Compiler Explorer" link.
5. **Mobile / tablet student view.** Today the editor is desktop-only.
   A read-only, swipe-friendly student view would let kids follow on phones.
6. **Per-student private worksheet** alongside the shared board, that the
   teacher can flip into to check a single student's work.
7. **Recording mode.** Teacher hits Rec, gets an MP4-equivalent (HTML
   replay) of the whole lesson.

### Layer D — Brand / identity (parallel, half a day)

The name "Code Board" plus the 📝 emoji is generic. A small mark
(monogram `CB` in a rounded square, accent blue) would:

- replace the emoji in the toolbar (no more font-emoji rendering
  inconsistencies),
- give the lobby card a real header,
- be the favicon (currently `data:,` — blank).

---

## 3. Proposed milestone plan

| Milestone | Deliverable | Verifies |
|---|---|---|
| **M1 — Triage (1 day)** | A1 + A4 polish bugs + B4 uploads-gc | Toolbar fits on 1366, no `☀️☀️`, lobby dots = 4, uploads stop accumulating |
| **M2 — Themeable shell (2 days)** | A3 token system + complete light theme | `data-theme="light"` looks deliberate; one place to retheme |
| **M3 — Editor that respects long lines (2 days)** | A2 horizontal scroll + soft wrap + min-width | Python `sort-bubble` template renders without clipping |
| **M4 — Module split (3 days)** | B1 + B2 + B3 | `Collaboration.js` < 200 lines per file, no behavior change |
| **M5 — Server hardening (1 day)** | B4 routes, helmet, GC, CORS | `npm audit` clean, prod-safe on ngrok |
| **M6 — Pick one product item from C** | Suggest C1 multi-tab — biggest "felt" upgrade | New file load adds a tab |

Total ~10 focused days for M1–M5, then product work.

---

## 4. Open questions for you

Before I touch code, I'd like to confirm:

1. **Target screen size?** Should I optimise for 1366 × 768 (Greek school
   laptops) or for 1920 × 1080 / projector?
2. **Mobile/tablet student** — yes / no / later?
3. **Branding**: are you happy to keep the `📝 Code Board` name or do you
   want me to suggest a wordmark?
4. **Light theme** — keep both, or commit to dark only?
5. **Multi-tab editor (C1)** vs **Run code (C4)** — which would move the
   needle more in your classroom?
6. **Uploads retention policy** — delete after class? after 7 days? keep
   forever and add an "Archive session" button?

---

## 5. Screenshot index

| File | What it shows |
|---|---|
| [01-teacher-initial.png](.screenshots/01-teacher-initial.png) | Teacher dashboard on first load (GLOSSA). Title clipping, broken `?` glyph in footer. |
| [02-teacher-files.png](.screenshots/02-teacher-files.png) | File Explorer panel with `content/glossa/` tree. |
| [03-teacher-shared.png](.screenshots/03-teacher-shared.png) | Shared Files panel — drop-zone, empty state. |
| [04-teacher-python.png](.screenshots/04-teacher-python.png) | After switching language to Python; keyword sidebar reloads. |
| [05-shortcuts-modal.png](.screenshots/05-shortcuts-modal.png) | Shortcuts modal — note huge gaps between `kbd` blocks. |
| [06-student-view.png](.screenshots/06-student-view.png) | Student lobby with teacher contact card and (3-dot) code input. |
| [07-student-joined.png](.screenshots/07-student-joined.png) | Student inside the room — cleaner toolbar (no teacher controls). |
| [08-teacher-wide-1600.png](.screenshots/08-teacher-wide-1600.png) | Teacher at 1600 px — toolbar already overflowing. |
| [09-teacher-with-code.png](.screenshots/09-teacher-with-code.png) | Loaded `sort-bubble.py` — code lines visibly cut off on the right. |
| [10-light-theme.png](.screenshots/10-light-theme.png) | Light theme — incomplete, page now has horizontal scroll. |
| [11-sidebar-collapsed.png](.screenshots/11-sidebar-collapsed.png) | Sidebar collapsed; layout still broken because root cause is the toolbar. |

---

_Ready to start on M1 whenever you give the go-ahead, or to first answer the
questions in §4._
