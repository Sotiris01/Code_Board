# Phase 3: Adding Python Support

We are expanding the platform to support Python. This involves creating the Python language module and registering it in the system.

## 1. Create Directory Structure
Create directory: `src/languages/python/`

## 2. Implement Language Modules
Create the following files in `src/languages/python/`:

### A. `keywords.js`
- Define basic Python keywords (if, else, elif, for, while, def, return, print, input, import, class, True, False, None, and, or, not).
- Define `SIDEBAR_CONFIG` for Python with categories (Control, Loops, I/O, Operators).
- Register to `window.Languages.Python.keywords`.

### B. `syntax.js`
- Implement `highlightSyntax(code)` for Python.
- Rules:
  - Comments: `# ...`
  - Strings: Single `'` and Double `"` quotes.
  - Numbers.
  - Keywords (from `keywords.js`).
- Register to `window.Languages.Python.syntax`.

### C. `snippets.js`
- Define `SMART_INSERTION` rules for Python.
- Focus on Pythonic style (colons and indentation).
- Examples:
  - `if`: `if {{CURSOR}}:\n    pass`
  - `for`: `for i in range({{CURSOR}}):\n    pass`
  - `def`: `def {{NAME}}():\n    {{CURSOR}}`
- Register to `window.Languages.Python.snippets`.

### D. `content.js`
- Define `initialCode`: `print("Hello World")`.
- Define empty placeholders for `exercises` and `algorithms` (so the UI doesn't crash).
- Register to `window.Languages.Python.content`.

## 3. Register Language
- **File:** `src/core/LanguageManager.js`
- **Action:** Update the language registry/loader to include `'python'` and map it to the `src/languages/python/` path.

## 4. UI Update
- **File:** `index.html`
- **Action:** Add `<option value="python">Python</option>` to the `#language-selector`.

First create 'Todos', do not attempt to do all at once. Finally, update the file structure in `GEMINI.md`, explicitly marking **new** files as `(new)` and **modified** files as `(modified)`. 
