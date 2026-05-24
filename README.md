# 📝 Code Board

A self-hosted, real-time collaborative coding whiteboard for the classroom.
The teacher writes / loads code, opens PDFs and Markdown notes, and every connected student
sees the same thing live, with cursor sharing, laser pointer, breakpoints, reactions and
a hand-raise system.

Originally built for **ΓΛΩΣΣΑ** (the pseudocode language taught in Greek high schools),
now also supports **Python**, **C++** and **Java**.

![License](https://img.shields.io/badge/license-ISC-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14-green.svg)
![Express](https://img.shields.io/badge/express-5.x-lightgrey.svg)
![WS](https://img.shields.io/badge/websocket-ws%208.x-orange.svg)

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
| Hand-raise ✋ | sees list | sends |
| Window-focus indicator (red glow when student tabs away) | ✅ | broadcasts |
| Language switch (ΓΛΩΣΣΑ / Python / C++ / Java) | ✅ | follows teacher |
| **Access code** (4-digit, regenerable) + Free-Enter toggle | ✅ control | required to join |
| Session persistence on disk (`.session-state.json`) | survives restart | — |
| Theme toggle (dark / light) | ✅ | ✅ |
| Per-session upload sandbox (`uploads/<timestamp>/`) | ✅ | ✅ |

---

## 3. Tech stack

- **Backend**: Node.js + Express 5, `ws` 8 WebSocket server, `multer` for uploads,
  `archiver` for zip downloads, `iconv-lite` for Windows-1253 (`.glo`) decoding,
  `fast-diff` for incremental code-update diffing.
- **Frontend**: vanilla JS modules, CDN-loaded `marked.js` (Markdown),
  `pdf.js` 3.11 (PDF), `JSZip` (client-side zipping). No build step.
- **Persistence**: plain JSON files on disk
  (`.session-state.json`, `teacher-info.json`, `uploads/<id>/.metadata.json`).

---

## 4. Repository layout

```
code_board/
├── server.js                  Express + WebSocket server (~1400 lines)
├── index.html                 Single-page shell (toolbar, lobby, sidebar, modals)
├── styles.css                 Global stylesheet (~75 KB, monolithic)
├── teacher-info.json          Name / email / phone / Discord shown in lobby
├── start-session.ps1          Windows convenience: starts node + ngrok
├── package.json               type: commonjs, scripts: start / dev / tunnel
│
├── src/
│   ├── main.js                Bootstrap, wires DOM ↔ modules
│   │
│   ├── core/
│   │   ├── LanguageManager.js Dynamic language switching (glossa/python/cpp/java)
│   │   └── SmartInserter.js   Smart keyword insertion engine (auto-indent, snippets)
│   │
│   ├── components/
│   │   ├── GridEditor.js      Custom grid-based code editor (cell per char)
│   │   ├── SyntaxHighlighter.js  Per-language tokenizer / colorizer
│   │   ├── PdfViewer.js       Continuous-scroll PDF.js wrapper
│   │   ├── MarkdownViewer.js  marked.js wrapper with scroll/laser sync
│   │   ├── FileBrowser.js     Server-side content/<lang>/ browser
│   │   ├── SharedFilesBrowser.js  Drag-drop upload + per-session shared store
│   │   ├── LocalFileBrowser.js    File System Access API folder browser (teacher)
│   │   └── UIManager.js       Toasts, theme, shortcuts modal, lobby helpers
│   │
│   ├── ui/
│   │   ├── Toolbar.js         Copy / clear / theme bindings
│   │   ├── StatusBar.js       Cursor pos, network stats, ngrok poll, timer
│   │   ├── LayoutManager.js   Mode switching, sidebar resize, activity bar
│   │   └── LobbyManager.js    4-digit-code waiting room
│   │
│   ├── modules/
│   │   ├── Collaboration.js   WebSocket client + all message handlers (~1900 lines)
│   │   └── FileTransfer.js    Chunked upload helpers
│   │
│   └── languages/
│       ├── glossa/  (keywords.js, syntax.js, snippets.js, content.js)
│       ├── python/  (same 4-file shape)
│       ├── cpp/     (same)
│       └── java/    (same)
│
├── content/                   ~1.4 K files, served to the File Explorer
│   ├── glossa/   exercises 01–12, tetradio, vivlio, manual PDFs, templates/*.gls
│   ├── python/   exercises + 22 .py templates
│   ├── cpp/      4 exercise sets + ~26 .cpp templates by topic
│   └── java/     templates only (5 .java files)
│
└── uploads/<timestamp>/       New folder per server run; not garbage-collected
```

---

## 5. WebSocket protocol (current)

All messages are JSON, `{ type, … }`. Implemented on both ends
([server.js](server.js) and [src/modules/Collaboration.js](src/modules/Collaboration.js)):

| Category | `type` values |
|---|---|
| Auth / lobby | `auth_required`, `auth_failed`, `auth_error`, `verify_code`, `admin_code`, `admin_get_code`, `admin_set_public`, `admin_cycle_code` |
| Editor | `init`, `code_update`, `template_loaded`, `cursor_update`, `highlight_selection`, `highlight_tiles`, `breakpoints`, `scroll_to_line`, `laser_point`, `language_change` |
| PDF | `pdf_load`, `pdf_sync`, `pdf_laser` |
| Markdown | `markdown_content`, `markdown_state`, `markdown_laser` |
| Presence | `user_joined`, `user_left`, `window_focus`, `hand_raise`, `reaction`, `clear_reactions` |
| Files | `folder_shared`, `file_deleted` |
| View mode | `mode_change` |
| Keep-alive | `ping` / `pong` |

HTTP endpoints (selected):
`/api/ping`, `/api/ngrok-stats`, `/api/clear-session`, `/api/auth-config`,
`/api/teacher-info` (GET/POST), `/api/access-control`, `/api/upload`,
`/api/shared-folders`, `/api/uploads/files`, `/api/uploads/download`,
`/api/download-folder`, `/api/files`, `/api/files/content`, `/api/status`.

---

## 6. Quick start

```bash
git clone <this-repo>
cd code_board
npm install
node server.js
# → http://localhost:3000?role=teacher   (teacher UI)
# → http://localhost:3000                (student UI, asks for 4-digit code)
```

On Windows, `./start-session.ps1` will also launch `ngrok http 3000` and open
the teacher URL.

Edit [teacher-info.json](teacher-info.json) to change the name / email / phone
/ Discord shown on the student lobby card.

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
| `F1` | Show shortcuts |
| `Esc` | Close current modal |
| Teacher: `Ctrl + hover` | Laser pointer |
| Teacher: click line number | Toggle breakpoint |

---

## 9. Known limitations (May 2026 — driving the redesign)

- **Toolbar overflows on 1366 px laptop screens** in the teacher view (Code /
  PDF / MD + language + classroom controls + theme / help / copy / clear do
  not fit). The "📝 Code Board" title gets clipped.
- **Code area is squeezed** by a wide right sidebar (~400 px). Long Python /
  C++ lines are silently cut off — no soft-wrap and the grid editor has no
  visible horizontal scrollbar.
- **Light theme is incomplete** — line numbers, gutters and some toolbar
  controls render white-on-white.
- **Theme toggle button** can render the emoji twice (`☀️☀️`) after a switch.
- **Keyboard-shortcut modal** has unusually large gaps between `kbd` elements.
- **Single 75 KB `styles.css`** — no design tokens, hard to retheme.
- **One 1900-line `Collaboration.js`** mixes transport, presence, editor
  sync and admin commands.
- **Per-session uploads** accumulate under `uploads/` and are never
  garbage-collected.

These are addressed in [REDESIGN-REPORT.md](REDESIGN-REPORT.md).

---

## 10. Adding a new language

1. Create `src/languages/<lang>/` with `keywords.js`, `syntax.js`,
   `snippets.js`, `content.js` (copy any existing one as a template).
2. Register the module in [src/core/LanguageManager.js](src/core/LanguageManager.js).
3. Add an `<option>` to `#language-selector` in [index.html](index.html).
4. Add the tokenizer hook in [src/components/SyntaxHighlighter.js](src/components/SyntaxHighlighter.js).
5. Whitelist the file extension in [server.js](server.js)
   (`/api/files`, `/api/files/content`, `/api/uploads/files`).
6. Drop sample templates in `content/<lang>/templates/`.

---

## License

ISC — see [package.json](package.json). Author: **Σωτήρης Μπαλατσιάς**.
