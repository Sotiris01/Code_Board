# Code Board - AI Agent Instructions

This file defines the global configuration for AI agent behavior and coding standards for the Code Board project.

---

## 1. Project Context

- **Name:** Code Board (Code Board for Teaching)
- **Domain:** Educational Technology (EdTech)
- **Target Audience:** Students & Teachers (remote course)
- **Primary Language (UI):** Greek (Ελληνικά)
- **Primary Language (Code/Comments):** English

---

## 2. Technology Stack

- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+)
- **No Build Tools:** The project runs directly in the browser. Avoid `require`, `import` (unless native modules), or TypeScript syntax.
- **Libraries:** PDF.js (for PDF viewing)

---

## 3. Coding Standards

### Naming Conventions

| Element            | Convention         | Example              |
|--------------------|--------------------|-----------------------|
| Variables/Functions | `camelCase`        | `getUserName`         |
| Constants          | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT`     |
| CSS Classes/IDs    | `kebab-case`       | `main-container`      |
| Filenames          | `kebab-case` or `snake_case` | `grid-editor.js`, `glossa_keywords.js` |

> **Note:** Maintain existing filename consistency within the project.

### Comments

- Use **JSDoc** for functions:
  ```javascript
  /**
   * Calculates the sum of two numbers.
   * @param {number} a - The first number.
   * @param {number} b - The second number.
   * @returns {number} The sum of a and b.
   */
  function add(a, b) {
    return a + b;
  }
  ```
- Comments must explain **WHY**, not just **WHAT**.

### Structure

- Keep logic separate from data.
- Avoid tight coupling between the UI and specific language logic (prepare for multi-language support).

---

## 4. Behavioral Rules

- **Safety:** Never remove existing features without explicit instruction.
- **UI Text:** All user-facing text must be in **Greek**.
- **Refactoring:** When refactoring, ensure backward compatibility.

---
