# 📝 Code Board

A real-time collaborative coding whiteboard designed for teaching programming. Originally built for the **GLOSSA** (ΓΛΩΣΣΑ) programming language taught in Greek high schools, now expanded to support **Python**, **C++**, and **Java**.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)
![Languages](https://img.shields.io/badge/languages-4-brightgreen.svg)

## ✨ Features

### 🌐 Multi-Language Support
- **GLOSSA** (ΓΛΩΣΣΑ) — Greek educational programming language
- **Python** — General-purpose programming with full syntax support
- **C++** — Systems programming with preprocessor highlighting
- **Java** — Object-oriented programming with annotation support

Each language includes:
- Syntax highlighting (keywords, types, strings, comments, operators)
- Smart code insertion and auto-complete
- Keyword sidebar with quick-insert buttons
- Code templates and examples

### Real-Time Collaboration
- **Live Code Sync** — WebSocket-based real-time code synchronization between teacher and students
- **Cursor Tracking** — See where students are typing in real-time
- **Tile Highlighting** — Teachers can highlight code sections that sync to all students
- **Language Sync** — Language changes by teacher automatically sync to all students

### Teacher Tools
- **PDF Sharing** — Load and share PDF documents (manuals, exercises) with students
- **Laser Pointer** — Point at specific parts of code or PDFs during explanations
- **Focus Mode** — Temporarily disable student input during demonstrations
- **Code Templates** — Quick-insert common code patterns and algorithms
- **Breakpoints** — Set visual breakpoints to highlight important lines
- **Scroll-to-Line** — Navigate all students to a specific line

### Student Interaction
- **Hand Raising** — Students can raise their hand to ask questions
- **Reactions** — Quick emoji reactions for feedback (👍 Understood, ❓ Confused, 🔄 Repeat)
- **Follow Mode** — Automatically follow teacher's view and selections

### Editor Features
- **Syntax Highlighting** — Language-aware code coloring for all 4 languages
- **Smart Insertion** — Auto-complete keywords and code structures
- **Grid-Based Editor** — Clean, whiteboard-style code presentation
- **File Browser** — Navigate and load exercises from the content library

## 🚀 Quick Start

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher)
- [ngrok](https://ngrok.com/) (for remote student access)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/code-board.git
cd code-board

# Install dependencies
npm install

# Start the server
npm start
```

The server will start at `http://localhost:3000`

## 📖 Usage

### For Teachers

1. Open the teacher interface:
   ```
   http://localhost:3000?role=teacher
   ```

2. Share your session with students using ngrok (see below)

3. Use the toolbar to:
   - Switch between languages (GLOSSA, Python, C++, Java)
   - Load exercises and templates
   - Switch between Code and PDF modes
   - Control student interaction (Focus mode)
   - Use the laser pointer for demonstrations

### For Students

1. Open the link provided by your teacher
2. The interface will automatically connect to the teacher's session
3. Language changes sync automatically from the teacher
4. Use the sidebar buttons to:
   - Raise your hand (✋)
   - Send reactions
   - Follow the teacher's cursor

## 🌐 Remote Access with ngrok

To allow students to connect from outside your local network, use **ngrok** to create a secure tunnel.

### Setting Up ngrok

1. **Create a free account** at [ngrok.com](https://ngrok.com/)

2. **Get your authtoken** from the [ngrok dashboard](https://dashboard.ngrok.com/get-started/your-authtoken)

3. **Install ngrok** and authenticate:
   ```bash
   # Install (choose your method)
   # Windows: choco install ngrok
   # macOS: brew install ngrok
   # Or download from https://ngrok.com/download

   # Authenticate with your token
   ngrok config add-authtoken YOUR_AUTH_TOKEN
   ```

4. **Start the tunnel** (after starting the Code Board server):
   ```bash
   ngrok http 3000
   ```

5. **Share the URL** — ngrok will display a forwarding URL like:
   ```
   Forwarding    https://abc123.ngrok-free.app -> http://localhost:3000
   ```
   Share this `https://...ngrok-free.app` URL with your students.

### Quick Start Script (Windows)

For convenience, use the included PowerShell script:

```powershell
.\start-session.ps1
```

This will:
- Start the Node.js server
- Open the teacher interface in your browser
- Launch ngrok automatically

## 📁 Project Structure

```
Code_Board/
├── content/                 # Educational content (per language)
│   ├── glossa/             # GLOSSA language content
│   │   ├── exercises/      # Practice exercises (levels 1-10)
│   │   ├── templates/      # Code templates (.gls files)
│   │   └── *.pdf           # Reference manuals
│   ├── python/             # Python content
│   │   └── templates/      # Code templates (.py files)
│   ├── cpp/                # C++ content
│   │   └── templates/      # Code templates (.cpp files)
│   └── java/               # Java content
│       └── templates/      # Code templates (.java files)
├── src/                    # Source code
│   ├── components/         # UI components
│   │   ├── GridEditor.js       # Grid-based code editor
│   │   ├── FileBrowser.js      # File system navigator
│   │   ├── PdfViewer.js        # PDF.js wrapper
│   │   ├── SyntaxHighlighter.js # Multi-language syntax highlighting
│   │   └── UIManager.js        # UI utilities & shortcuts
│   ├── core/              # Core modules
│   │   ├── LanguageManager.js  # Dynamic language switching
│   │   └── SmartInserter.js    # Auto-complete engine
│   ├── languages/         # Language definitions
│   │   ├── glossa/        # GLOSSA (keywords, syntax, snippets, content)
│   │   ├── python/        # Python module
│   │   ├── cpp/           # C++ module
│   │   └── java/          # Java module
│   ├── modules/           # Feature modules
│   │   └── Collaboration.js    # WebSocket real-time sync
│   ├── ui/                # UI controllers
│   │   ├── Toolbar.js          # Copy, clear, font size
│   │   ├── StatusBar.js        # Line counts, network stats
│   │   └── LayoutManager.js    # Sidebar, mode switching
│   └── main.js            # Application entry point
├── server.js              # Express + WebSocket server
├── index.html             # Main HTML file
├── styles.css             # Global styles
└── start-session.ps1      # Quick start script (Windows)
```

## 🗣️ Language Support Details

### File Extensions & Icons

| Language | Extension | Icon | Description |
|----------|-----------|------|-------------|
| GLOSSA   | `.gls`    | 📘   | Greek educational language |
| Python   | `.py`     | 🐍   | General-purpose scripting |
| C++      | `.cpp`    | ⚙️   | Systems programming |
| Java     | `.java`   | ☕   | Object-oriented programming |

### Templates Included

- **GLOSSA**: 23 templates (program, arrays, loops, functions, algorithms)
- **Python**: 22 templates (classes, files, data structures, algorithms)
- **C++**: 26 templates (pointers, structs, vectors, STL)
- **Java**: 5 templates (classes, control flow, I/O)

## 🔧 Configuration

### Environment Variables

Create a `.env` file (optional):

```env
PORT=3000
```

### Teacher Password Protection

To protect the teacher interface, set `TEACHER_PASSWORD` environment variable:

```env
TEACHER_PASSWORD=your_secure_password
```

## 🛠️ Technology Stack

- **Backend**: Node.js, Express.js, WebSocket (ws)
- **Frontend**: Vanilla JavaScript, Custom Grid Editor
- **PDF**: PDF.js for document rendering
- **Communication**: WebSocket for real-time collaboration

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Adding a New Language

To add support for a new programming language:

1. Create `src/languages/[lang]/` directory with:
   - `keywords.js` — Keywords, types, and SIDEBAR_CONFIG
   - `syntax.js` — Syntax highlighting rules
   - `snippets.js` — Smart insertion and templates
   - `content.js` — Content provider

2. Register in `src/core/LanguageManager.js`

3. Add to UI selector in `index.html`

4. Add highlighting in `src/components/SyntaxHighlighter.js`

5. Update `server.js` to allow file extension

6. Create `content/[lang]/templates/` with example files

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for teaching GLOSSA in Greek secondary education
- Inspired by the need for better remote teaching tools
- Uses [PDF.js](https://mozilla.github.io/pdf.js/) for PDF rendering

---

Made with ❤️ for educators
