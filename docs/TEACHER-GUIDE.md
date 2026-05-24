# Teacher Guide — Code Board

A walk-through of every classroom feature for the teacher. Aimed at
someone who has just cloned the repo and wants to run a lesson.

> Phase 10.4 of the project ROADMAP. Screenshots are listed as
> placeholders under `docs/img/` — capture them on your own machine
> the first time you run the wizard (the layouts are stable now).

---

## 1. Install & first boot

```powershell
git clone <repo-url> code_board
cd code_board
npm install
npm start
```

Open <http://localhost:3000/?role=teacher> in your browser.

The very first time the server runs without `data/settings.json`, the
browser shows the **Onboarding Wizard**.

### The 6-step wizard

| Step | Field                       | Notes                                              |
| ---- | --------------------------- | -------------------------------------------------- |
| 1    | Welcome                     | Short summary; nothing to enter.                   |
| 2    | Profile                     | Name (required), email, phone, Discord.            |
| 3    | Classroom defaults          | Access-code policy: `fixed` / `rotate` / `free`.   |
| 4    | Editor defaults             | Language, theme, tab size, font size.              |
| 5    | Sharing                     | `local` (LAN only) or `ngrok` + authtoken.         |
| 6    | Done                        | Saves `data/settings.json`, drops into the lobby.  |

> Placeholder screenshot: `docs/img/onboarding-step-2.png`

You can replay the wizard at any time from the **Settings** dialog
(gear icon, top right).

---

## 2. The lobby & access codes

After the wizard the right sidebar shows the **Lobby card** with a
4-digit access code. Students hitting the same URL get a "waiting
room" prompt until they enter that code (or you flip *Public access*
on the lobby card to let everyone in without one).

* `fixed` — code stays the same until the server restarts.
* `rotate` — server picks a new code on every reboot.
* `free` — public-access on by default; no code at all.

> Placeholder screenshot: `docs/img/lobby-card.png`

---

## 3. Sharing the URL

* **Local only** — share `http://<your-laptop-ip>:3000/` over the
  classroom Wi-Fi.
* **Ngrok** — `npm run tunnel` (assumes ngrok installed + the
  authtoken saved in the wizard). Copy the `https://*.ngrok-free.app`
  URL into chat.

The status bar shows your tunnel state once ngrok is up.

---

## 4. Teaching with the editor

The main grid editor is shared in real time:

| Action                   | How                                                        |
| ------------------------ | ---------------------------------------------------------- |
| Switch language          | Toolbar dropdown — broadcasts to every student.            |
| Switch theme             | Sun/moon icon — also broadcasts.                           |
| Load a template          | Templates panel on the left → click any `*.gls` / `*.py`.  |
| Run the current snippet  | **Run** button (Phase 9.7) — opens the language's online   |
|                          | playground (godbolt / JDoodle / Trinket).                  |
| Scroll students to a line| Right-click a gutter line number → *Scroll students here*. |
| Set breakpoints (visual) | Click the gutter — broadcasts a dotted highlight.          |
| Hide tabs                | **Tabs** button — declutters the toolbar for screenshots.  |

Students get a read-only view. On mobile widths (< 768 px) their
toolbar collapses to the essentials (see `styles/components/phase9.css`).

---

## 5. Student feedback channels

* **Hand raise (with note)** — students click ✋ in the status bar,
  optionally type a 280-char note. Teacher sees a badge with the
  count + tooltip listing names & notes.
* **Reactions** — emoji burst at the top of the teacher screen.
* **Worksheet** — students get a private 512 KB scratch pad
  (`PUT /api/worksheet/:id`); only they can see it.

---

## 6. Replay & export

Every snapshot in `data/sessions/YYYY-MM-DD.json` plus the matching
`*.events.jsonl` can be replayed:

* In-app: toolbar **Replay** button → modal with a scrubber.
* Download: `GET /api/sessions/<date>/export` returns a
  self-contained HTML file (no internet needed at playback).

> Placeholder screenshot: `docs/img/replay-modal.png`

---

## 7. Settings & storage

Open **Settings** (gear icon) any time:

* *Profile / Classroom / Editor / Sharing* tabs map 1:1 to the
  wizard.
* *Storage* tab shows disk usage and a *Clear uploads* button that
  wipes every session folder except the active one.

`data/uploads/<sessionId>/` folders are also pruned automatically
once a day via `services/uploadsGc.schedule` (TTL configurable in
*Settings → Storage*).

---

## 8. Troubleshooting

| Symptom                                          | Fix                                               |
| ------------------------------------------------ | ------------------------------------------------- |
| "Port 3000 in use"                               | `set PORT=3100 && npm start`                      |
| Students stuck on auth screen                    | Toggle **Public access** in the lobby card.       |
| Greek garbled in uploaded `.gls`                 | The server auto-detects Windows-1253 — re-upload. |
| Onboarding wizard re-appears every boot          | Delete `data/settings.json` to redo it.           |
| `npm test` fails locally with `MODULE_NOT_FOUND` | Run `npm install` once to pull in `supertest`.    |

Run `npm run doctor` for a one-shot environment check (Node version,
ports, write permissions in `data/` and `uploads/`).
