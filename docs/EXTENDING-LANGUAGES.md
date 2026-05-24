# Extending Code Board with a new language

This guide walks through adding a brand-new language (Ruby in the
example) end-to-end. Following it should take under ten minutes.

## TL;DR

```pwsh
npm run new:lang -- ruby Ruby .rb
npm start
```

Open <http://localhost:3000/?role=teacher>, choose **Ruby** from the
Language drop-down, and you're editing `.rb` files.

---

## What the scaffolder does

`npm run new:lang -- <id> [label] [ext]` runs
[`scripts/new-language.mjs`](../scripts/new-language.mjs) and performs:

1. Appends `<id>` to [`src/languages/registry.json`](../src/languages/registry.json)
   (the single source of truth shared by client + server).
2. Creates `src/languages/<id>/`:
   - `plugin.js`     — descriptor; self-registers with `LanguageRegistry`.
   - `keywords.js`   — keyword list (stub).
   - `snippets.js`   — snippet map (stub).
   - `syntax.js`     — `highlight(code) → html` stub.
   - `content.js`    — sidebar config + initial code.
3. Drops a placeholder monogram SVG into
   `public/assets/icons/<id>.svg`.
4. Inserts a `<script src="src/languages/<id>/plugin.js">` tag into
   [`public/index.html`](../public/index.html) right after the existing
   plugin descriptors.

Restart the server and reload. The Language drop-down is populated
from `LanguageRegistry.list()`, so the new entry appears automatically,
and the server picks up the new extension from `registry.json` for
`/api/files` and `/api/files/content`.

---

## The LanguagePlugin contract

Each plugin descriptor must include:

| Field            | Type                  | Purpose                                                     |
| ---------------- | --------------------- | ----------------------------------------------------------- |
| `id`             | `string`              | Unique slug (`'ruby'`).                                     |
| `label`          | `string`              | Display name shown in the toolbar.                          |
| `namespace`      | `string`              | Key under `window.Languages` (`'Ruby'`).                    |
| `fileExtensions` | `string[]`            | Lowercase, dot-prefixed (`['.rb']`).                        |
| `commentSyntax`  | `{line, block?}`      | Used by the block-comment plugin (Ctrl+/).                  |
| `indentTriggers` | `string[]`            | Tokens that increase indent on the next line.               |
| `dedentTriggers` | `string[]`            | Tokens that decrease indent for the current line.           |
| `autoPairs`      | `Record<string,string>` | Auto-closing characters used by `AutoPairs`.              |
| `icon`           | `string`              | Filename under `public/assets/icons/`.                      |

A minimal example:

```js
LanguageRegistry.register({
    id: 'ruby',
    label: 'Ruby',
    namespace: 'Ruby',
    fileExtensions: ['.rb'],
    commentSyntax: { line: '#', block: ['=begin', '=end'] },
    indentTriggers: ['do', '{'],
    dedentTriggers: ['end', '}'],
    autoPairs: { '(': ')', '[': ']', '{': '}', '"': '"', "'": "'" },
    icon: 'ruby.svg'
});
```

---

## Where each piece is consumed

| Subsystem                             | File                                    | Reads                                                |
| ------------------------------------- | --------------------------------------- | ---------------------------------------------------- |
| Toolbar drop-down                     | [`src/main.js`](../src/main.js)         | `LanguageRegistry.list()` → label + id.              |
| Toolbar icon                          | [`src/main.js`](../src/main.js)         | `plugin.icon` on `languageChanged`.                  |
| Auto-pair typing                      | [`src/editor/input/AutoPairs.js`](../src/editor/input/AutoPairs.js) | `plugin.autoPairs`.   |
| File browser whitelist                | [`server/index.js`](../server/index.js) | `languageRegistry.browseAllowedExtensions()`.        |
| `/api/files/content` whitelist        | [`server/index.js`](../server/index.js) | `languageRegistry.contentAllowedExtensions()`.       |
| `/api/uploads` text/binary split      | [`server/index.js`](../server/index.js) | `languageRegistry.uploadsTextExtensions()`.          |
| Heavy syntax/keywords/snippets        | [`src/core/LanguageManager.js`](../src/core/LanguageManager.js) | dynamic `<script>` loading. |

The server-side helper lives at
[`server/services/languageRegistry.js`](../server/services/languageRegistry.js).
It synchronously reads `src/languages/registry.json` at boot, so adding
a language only requires a server restart — no edits to `server/index.js`.

---

## Doing it by hand (without the scaffolder)

If you prefer to skip the script:

1. Add an entry to `src/languages/registry.json`.
2. Create the five files under `src/languages/<id>/`.
3. Drop `<id>.svg` into `public/assets/icons/`.
4. Add `<script src="src/languages/<id>/plugin.js">` to
   `public/index.html`, after the other plugin descriptors and before
   `src/main.js`.
5. Restart the server.

That's it — the registry handles the rest.
