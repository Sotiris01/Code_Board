# Code Board: Project Architecture & Context

## 1. Project Overview

A web-based IDE and teaching board designed for the "GLOSSA" (ΓΛΩΣΣΑ) programming language taught in Greek schools. It supports code editing, syntax highlighting, templates, and a PDF viewer for manuals.

---

## 2. Current File Structure

```
Code_Board/
├── .github/
│   └── copilot-instructions.md          # AI Agent Configuration
├── content/                              # Educational Content ✅ (new - Phase 2.95)
│   └── glossa/                          # GLOSSA content (moved from glossa_programs)
│       ├── exercises/                    # Level 1-10 exercises by topic
│       │   ├── 01_eisodos_exodos/
│       │   ├── 02_typoi_metavlites/
│       │   ├── 03_epilogi/
│       │   ├── 04_epanalipsi/
│       │   ├── 05_pinakes/
│       │   ├── 06_ypoprogrammata/
│       │   ├── 07_eksfalmatos/
│       │   ├── 08_olokliromenes/
│       │   ├── 09_logikes_synthikes/
│       │   ├── 10_protypa_programmatismou/
│       │   ├── 11_mathimatikoi_typoi/
│       │   ├── Themata/
│       │   └── Λύσεις_Πίνακες/
│       ├── templates/                    # .gls template files
│       │   └── ... (23 template files)
│       ├── tetradio/                     # Workbook content
│       ├── vivlio/                       # Textbook content
│       ├── algorithmos_vs_programma.pdf
│       ├── algorithmos_vs_programma.tex
│       ├── glossa_manual.pdf
│       └── glossa_manual.tex
├── src/                                  # Source Code ✅ (new - Phase 2.95)
│   ├── components/                       # UI Components
│   │   ├── FileBrowser.js               # File system browser (modified)
│   │   ├── GridEditor.js                # Custom Grid Editor
│   │   ├── PdfViewer.js                 # PDF.js wrapper
│   │   └── UIManager.js                 # UI utilities, theme, shortcuts
│   ├── core/                            # Core engine modules
│   │   ├── LanguageManager.js           # Dynamic language switching (modified)
│   │   └── SmartInserter.js             # Universal smart insertion module
│   ├── languages/                        # Language definitions
│   │   ├── glossa/                      # GLOSSA language module
│   │   │   ├── keywords.js              # Keywords & sidebar config
│   │   │   ├── snippets.js              # Code templates & SMART_INSERTION
│   │   │   ├── syntax.js                # Syntax highlighting
│   │   │   └── content.js               # Content provider
│   │   ├── python/                      # Python language module (planned)
│   │   └── cpp/                         # C++ language module (planned)
│   ├── modules/                          # Standalone modules
│   │   └── Collaboration.js             # Real-time collaboration (modified)
│   ├── ui/                              # UI Layer ✅ (new - Phase 2.95)
│   │   ├── Toolbar.js                   # Copy, clear, font size controls (new)
│   │   ├── StatusBar.js                 # Line/char counts, ngrok stats (new)
│   │   └── LayoutManager.js             # Sidebar resize, mode switching (modified)
│   └── main.js                          # Main application bootstrap ✅ (new - Phase 2.95)
├── index.html                            # Main Entry Point (modified)
├── styles.css                            # Global Styles
├── server.js                             # Simple Node backend (modified)
├── package.json                          # Node dependencies
├── package-lock.json
├── start-session.ps1                     # PowerShell script to start session
├── README-TEACHING.md                    # Teaching documentation
├── GEMINI.md                             # This file - Project Architecture
└── .session-state.json                   # Session state persistence
```

---

## 3. Architecture Goals

### Current State
- Monolithic structure with most logic in `app.js`
- Single language support (GLOSSA)
- Keywords/syntax tightly coupled with core editor

### Target State
- **Refactoring:** Move from a monolithic `app.js` to a modular, multi-language architecture.

### Planned Modules

| Module | Description | Files |
|--------|-------------|-------|
| **Core** | Language management, smart insertion | `src/core/LanguageManager.js`, `src/core/SmartInserter.js` |
| **Components** | UI components, editors, viewers | `src/components/GridEditor.js`, `src/components/PdfViewer.js`, etc. |
| **Languages** | Syntax definitions, Snippets, Keywords | `src/languages/glossa/`, `src/languages/python/`, etc. |
| **Modules** | Standalone features | `src/modules/Collaboration.js` |
| **UI** | UI layer controllers | `src/ui/Toolbar.js`, `src/ui/StatusBar.js`, `src/ui/LayoutManager.js` |
| **Content** | Educational content by language | `content/glossa/`, `content/python/`, etc. |

### Multi-Language Content Structure

```
content/
├── glossa/                  # GLOSSA educational content
│   ├── exercises/           # Exercises organized by level
│   ├── templates/           # Code templates (.gls files)
│   ├── vivlio/              # Textbook content
│   └── tetradio/            # Workbook content
├── python/                  # Python content (planned - Phase 3)
└── cpp/                     # C++ content (planned - Phase 3)
```

---

## 4. Implementation Roadmap

### Phase 1: Decoupling & Modularization ✅ COMPLETED

**Goal:** Extract "GLOSSA" specific logic from the core engine.

| Step | Task | Status |
|------|------|--------|
| 1.1 | Create directory `languages/glossa/` | ✅ Done |
| 1.2 | Move `glossa_keywords.js` → `languages/glossa/keywords.js` | ✅ Done |
| 1.3 | Extract `highlightSyntax()` from `app.js` → `languages/glossa/syntax.js` | ✅ Done |
| 1.4 | Extract `SMART_INSERTION` (snippets) from `app.js` → `languages/glossa/snippets.js` | ✅ Done |
| 1.5 | Refactor `app.js` to accept modules as external dependencies | ✅ Done |

### Phase 2: Core Engine Refactoring ✅ COMPLETED

**Goal:** Create a `LanguageManager` to handle dynamic language switching.

| Step | Task | Status |
|------|------|--------|
| 2.1 | Create `core/LanguageManager.js` to manage active language state | ✅ Done |
| 2.2 | Implement dynamic script loading (lazy loading) for language files | ✅ Done |
| 2.3 | Add **Language Selector Dropdown** in `index.html` toolbar | ✅ Done |
| 2.4 | Delegate `highlightSyntax` and `smartInsert` to `LanguageManager` | ✅ Done |
| 2.5 | Update `app.js` to use `LanguageManager` API | ✅ Done |
| 2.6 | Refactor language modules to use `window.Languages.{Lang}` namespace | ✅ Done |

### Phase 2.5: Content Abstraction ✅ COMPLETED

**Goal:** Separate GLOSSA-specific content from the universal `app.js`.

| Step | Task | Status |
|------|------|--------|
| 2.5.1 | Create `languages/glossa/content.js` for initialCode, exercises, algorithms, templates | ✅ Done |
| 2.5.2 | Add `getContent()` method to `LanguageManager` | ✅ Done |
| 2.5.3 | Refactor `app.js` dropdowns to be generic (use `LanguageManager.getContent()`) | ✅ Done |
| 2.5.4 | Refactor `init()` to use `initialCode` from content provider | ✅ Done |
| 2.5.5 | Remove hardcoded GLOSSA strings from `app.js` | ✅ Done |
| 2.5.6 | Create `core/SmartInserter.js` - extract smart insertion logic from `app.js` | ✅ Done |
| 2.5.7 | Fix race condition in `generateKeywordSidebar()` (async language loading) | ✅ Done |

### Phase 2.9: Codebase Cleanup & Restructuring ✅ COMPLETED

**Goal:** Organize files into logical directories and decompose `app.js`.

| Step | Task | Status |
|------|------|--------|
| 2.9.1 | Delete obsolete `glossa_keywords.js` | ✅ Done |
| 2.9.2 | Create `components/` and `modules/` directories | ✅ Done |
| 2.9.3 | Move `grid-editor.js` → `components/GridEditor.js` | ✅ Done |
| 2.9.4 | Move `pdf-viewer.js` → `components/PdfViewer.js` | ✅ Done |
| 2.9.5 | Move `collaboration.js` → `modules/Collaboration.js` | ✅ Done |
| 2.9.6 | Extract `FileBrowser` from `app.js` → `components/FileBrowser.js` | ✅ Done |
| 2.9.7 | Extract UI utilities from `app.js` → `components/UIManager.js` | ✅ Done |
| 2.9.8 | Update `index.html` script references | ✅ Done |

### Phase 2.95: Deep Structural Cleanup ✅ COMPLETED

**Goal:** Professional directory structure with src/ and content/ separation.

| Step | Task | Status |
|------|------|--------|
| 2.95.1 | Create `content/` folder, move `glossa_programs/` → `content/glossa/` | ✅ Done |
| 2.95.2 | Create `src/` folder structure | ✅ Done |
| 2.95.3 | Move `core/`, `components/`, `modules/`, `languages/` into `src/` | ✅ Done |
| 2.95.4 | Create `src/ui/Toolbar.js` (copy, clear, font size controls) | ✅ Done |
| 2.95.5 | Create `src/ui/StatusBar.js` (line/char counts, ngrok stats) | ✅ Done |
| 2.95.6 | Create `src/ui/LayoutManager.js` (sidebar resize, mode switching, PDF viewer) | ✅ Done |
| 2.95.7 | Create `src/main.js` (~350 lines), delete old `app.js` (~1270 lines) | ✅ Done |
| 2.95.8 | Update `server.js` (CONTENT_DIR for content/) | ✅ Done |
| 2.95.9 | Update `index.html` (all script paths to src/...) | ✅ Done |
| 2.95.10 | Update `FileBrowser.js` and `LanguageManager.js` paths | ✅ Done |

### Phase 3: Multi-Language Expansion (Next)

**Goal:** Add support for Python and C++.

| Step | Task | Status |
|------|------|--------|
| 3.1 | Create `languages/python/` structure (keywords, syntax, snippets) | ⬜ Pending |
| 3.2 | Create `languages/cpp/` structure | ⬜ Pending |
| 3.3 | Verify instant switching between GLOSSA, Python, and C++ | ⬜ Pending |

### Phase 4: UI/UX Redesign

**Goal:** Modernize the interface.

| Step | Task | Status |
|------|------|--------|
| 4.1 | Refactor `styles.css` to use CSS Variables for theming | ⬜ Pending |
| 4.2 | Redesign Sidebar with folder-tree view (VS Code style) | ⬜ Pending |
| 4.3 | Refresh Toolbar and Status bar aesthetics | ⬜ Pending |

---

## 5. Key Files Reference

| File | Purpose | Status |
|------|---------|--------|
| `src/main.js` | Main application bootstrap | ✅ **New** (Phase 2.95) |
| `index.html` | Main entry point | Modified (Phase 2.95) |
| `styles.css` | Global styles | Active |
| `server.js` | Express server for file serving & collaboration | Modified (Phase 2.95) |
| **Core** | | |
| `src/core/LanguageManager.js` | Dynamic language management | ✅ Active (modified) |
| `src/core/SmartInserter.js` | Universal smart code insertion module | ✅ Active |
| **Components** | | |
| `src/components/GridEditor.js` | Custom grid-based code editor | ✅ Active |
| `src/components/PdfViewer.js` | PDF.js integration for manual viewing | ✅ Active |
| `src/components/FileBrowser.js` | File system navigation sidebar | ✅ Active (modified) |
| `src/components/UIManager.js` | UI utilities (theme, shortcuts, toast) | ✅ Active |
| **UI Layer** | | |
| `src/ui/Toolbar.js` | Copy, clear, font size controls | ✅ **New** (Phase 2.95) |
| `src/ui/StatusBar.js` | Line/char counts, connection stats | ✅ **New** (Phase 2.95) |
| `src/ui/LayoutManager.js` | Sidebar resize, mode switching, PDF viewer | ✅ **New** (Phase 2.95) |
| **Modules** | | |
| `src/modules/Collaboration.js` | WebSocket-based real-time collaboration | ✅ Active |
| **Languages** | | |
| `src/languages/glossa/keywords.js` | GLOSSA keywords & sidebar config | ✅ Active |
| `src/languages/glossa/snippets.js` | GLOSSA code templates & smart insertion | ✅ Active |
| `src/languages/glossa/syntax.js` | GLOSSA syntax highlighting | ✅ Active |
| `src/languages/glossa/content.js` | GLOSSA content provider | ✅ Active |
| `src/languages/python/*` | Python language modules | Planned (Phase 3) |
| `src/languages/cpp/*` | C++ language modules | Planned (Phase 3) |
| **Content** | | |
| `content/glossa/` | GLOSSA educational content | ✅ Active (moved) |
| `content/python/` | Python educational content | Planned (Phase 3) |
| **Other** | | |
| `.github/copilot-instructions.md` | AI agent coding standards | Active |

---

*Last updated: January 19, 2025*
