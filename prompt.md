# Copilot Prompt: Status Bar UX Modernization

**Role:** Frontend UI/UX Specialist
**Task:** Modernize the application's Status Bar (Footer) to match VS Code standards and improve teacher awareness.

**Objectives:**

1.  **Cursor Position Indicator:**
    *   **Target:** `src/ui/StatusBar.js`, `index.html`.
    *   **Action:** Replace the separate "Lines: X" and "Characters: Y" elements with a single `cursor-position` element.
    *   **Logic:**
        *   Default display: "Ln 1, Col 1".
        *   On cursor movement: Update to "Ln {row}, Col {col}".
        *   On selection: Append selection info, e.g., "Ln 10, Col 5 (20 selected)".
    *   **Implementation:** Expose an `updateCursor(row, col, selectionLen)` method in `StatusBar.js` and trigger it from `gridEditor` events in `main.js`.

2.  **Active Language Badge:**
    *   **Target:** `src/ui/StatusBar.js`, `index.html`.
    *   **Action:** Add a new `#status-language` element to the right side of the status bar.
    *   **Logic:** Show the current language name in uppercase (e.g., "GLOSSA", "PYTHON").
    *   **Implementation:** Add a `setLanguage(langName)` method to `StatusBar.js`. Call this from `LanguageManager` whenever the language changes.

3.  **Smart Teacher Alerts (Pulsing):**
    *   **Target:** `styles.css`.
    *   **Action:** Create a CSS animation class `.status-alert` that pulses (e.g., flashes orange/red background).
    *   **Logic:** Apply this class to the `#raised-hands` element in the status bar whenever the hand-raise count is greater than 0.

4.  **Visual Polish:**
    *   **Target:** `styles.css`, `index.html`.
    *   **Action:** Remove the text-based pipe separators (`|`) from the HTML.
    *   **Style:** Use CSS borders or margins on `.status-item` classes to create clean visual separation between elements.
    *   **Color:** Ensure the background matches the VS Code blue (`#007acc`) or the current theme variable.

5.  **Student Hand-Raise Button:**
    *   **Target:** `styles.css`.
    *   **Action:** Style the `#hand-raise-btn.active` state to have high contrast (e.g., white background, black text) so students clearly see when their hand is raised.

**Deliverables:**
*   `src/ui/StatusBar.js` (Modified)
*   `index.html` (Modified)
*   `styles.css` (Modified)
*   `src/main.js` (Modified to wire up cursor events)

**Constraint:**
*   First create 'Todos', do not attempt to do all at once. Finally, update the file structure in `GEMINI.md`, explicitly marking **new** files as `(new)` and **modified** files as `(modified)`.
