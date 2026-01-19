# 📝 Code Board

A real-time collaborative coding whiteboard designed for teaching programming. Originally built for the **GLOSSA** (ΓΛΩΣΣΑ) programming language taught in Greek high schools, but architected to support multiple languages.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14.0.0-green.svg)

## ✨ Features

### Real-Time Collaboration
- **Live Code Sync** — WebSocket-based real-time code synchronization between teacher and students
- **Cursor Tracking** — See where students are typing in real-time
- **Tile Highlighting** — Teachers can highlight code sections that sync to all students

### Teacher Tools
- **PDF Sharing** — Load and share PDF documents (manuals, exercises) with students
- **Laser Pointer** — Point at specific parts of code or PDFs during explanations
- **Focus Mode** — Temporarily disable student input during demonstrations
- **Code Templates** — Quick-insert common code patterns and algorithms

### Student Interaction
- **Hand Raising** — Students can raise their hand to ask questions
- **Reactions** — Quick emoji reactions for feedback (👍, ❓, ✅, etc.)
- **Follow Mode** — Automatically follow teacher's view and selections

### Editor Features
- **Syntax Highlighting** — Language-aware code coloring
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
   - Load exercises and templates
   - Switch between Code and PDF modes
   - Control student interaction (Focus mode)
   - Use the laser pointer for demonstrations

### For Students

1. Open the link provided by your teacher
2. The interface will automatically connect to the teacher's session
3. Use the sidebar buttons to:
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
├── content/                 # Educational content
│   └── glossa/             # GLOSSA language content
│       ├── exercises/      # Practice exercises (levels 1-10)
│       ├── templates/      # Code templates (.gls files)
│       └── *.pdf           # Reference manuals
├── src/                    # Source code
│   ├── components/         # UI components (GridEditor, FileBrowser, etc.)
│   ├── core/              # Core modules (LanguageManager, SmartInserter)
│   ├── languages/         # Language definitions (glossa/, python/, etc.)
│   ├── modules/           # Feature modules (Collaboration)
│   ├── ui/                # UI controllers (Toolbar, StatusBar, LayoutManager)
│   └── main.js            # Application entry point
├── server.js              # Express + WebSocket server
├── index.html             # Main HTML file
└── styles.css             # Global styles
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file (optional):

```env
PORT=3000
```

### Language Support

Currently supported:
- **GLOSSA** (ΓΛΩΣΣΑ) — Greek educational programming language

Planned:
- Python
- C++

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built for teaching GLOSSA in Greek secondary education
- Inspired by the need for better remote teaching tools
- Uses [PDF.js](https://mozilla.github.io/pdf.js/) for PDF rendering

---

Made with ❤️ for educators
