# Objective: Add Java Content, Server Support & UI Icons (Phase 5.7 - 5.9)

We are adding the necessary content and backend support for Java.

## Tasks:

1.  **Create Directory:** `content/java/templates/`

2.  **Create Java Templates** in `content/java/templates/`:
    -   `program.java`: Basic Hello World.
    -   `class.java`: Basic class structure.
    -   `main.java`: Main class with main method.
    -   `if-else.java`: Control flow example.
    -   `for-loop.java`: Loop example.

3.  **Update `server.js`:**
    -   Update `/api/files` endpoint filter to include `.java` files.
    -   Update `/api/files/content` endpoint `allowedExtensions` to include `.java`.

4.  **Update `src/components/FileBrowser.js`:**
    -   Update `getFileIcon` method to map `java` extension to '☕' (coffee cup).
    -   Update `renderFileList` to handle `.java` extension stripping in the display name (if applicable/desired, or just keep it).

## Constraints:
-   Ensure Java templates are syntactically correct.
-   `server.js` changes should be minimal and safe.
-   `FileBrowser.js` icon should be visible.

First create 'Todos', do not attempt to do all at once. Finally, update the file structure in `GEMINI.md`, explicitly marking **new** files as `(new)` and **modified** files as `(modified)`.