# 🎓 Code Board - Teaching Guide for Remote Lessons

## 📋 Quick Start

### Method 1: PowerShell Script (Recommended)

```powershell
# Open PowerShell and run:
cd "path/to/code-board"
.\start-session.ps1
```

### Method 2: Manual Setup

```powershell
# Terminal 1: Start the server
cd "path/to/code-board"
npm start

# Terminal 2: Start ngrok
ngrok http 3000
```

---

## 🔄 Step-by-Step Instructions

### 1️⃣ Before the Lesson

1. Open **VS Code**
2. Open a terminal and run the startup script
3. Your browser will automatically open as **teacher**

### 2️⃣ Starting the Lesson

1. In the **ngrok** terminal you will see:
   ```
   Forwarding   https://xxxx-xx-xxx-xxx-xx.ngrok-free.app -> http://localhost:3000
   ```
2. **Copy** the `https://...ngrok-free.app` link
3. **Send** the link to your student (e.g., via chat)

### 3️⃣ During the Lesson

- ✏️ Both of you can write code
- 🔄 Changes sync automatically in real-time
- 📁 Use **Templates** to load examples
- 🎯 Use **Exercises** for assessment
- 📄 Share **PDF** or **Markdown** documents with laser pointer

### 4️⃣ End of Lesson

1. Press **Ctrl+C** in the ngrok terminal
2. The server will stop automatically

---

## 🖥️ What the Student Sees

The student:

- **Does not need** to download anything
- Simply opens the link you send
- Sees the board with syntax highlighting
- Can write code (if you allow it)

---

## ⚙️ Settings

### For the Teacher

- URL: `http://localhost:3000?role=teacher`
- Shows the 👨‍🏫 icon

### For the Student

- URL: The ngrok link (without parameters)
- Shows the 👨‍🎓 icon

---

## 🛠️ Troubleshooting

### "Student cannot connect"

1. Make sure ngrok is running
2. Share the HTTPS link, not HTTP
3. Have the student refresh the page

### "Changes are not syncing"

1. Check the connection status (green dot)
2. Refresh the page
3. Restart the server

### "Connection is slow"

- The free version of ngrok may have slight latency
- For better performance, consider ngrok pro

---

## 📌 Useful Links

| Description     | Link                               |
| --------------- | ---------------------------------- |
| Teacher (local) | http://localhost:3000?role=teacher |
| ngrok Dashboard | https://dashboard.ngrok.com        |
| Status API      | http://localhost:3000/api/status   |

---

## 🎓 Tips for Effective Teaching

1. **Before the lesson**: Prepare the examples you will use
2. **Use Templates**: Quick loading of code structures
3. **Practice with exercises**: Use incomplete exercises for hands-on learning
4. **Increase font size**: A+ button for dyslexia-friendly display
5. **Copy code**: 📋 button to copy code to clipboard
6. **Use laser pointer**: Point at specific code sections in PDF/Markdown views

---

*Last updated: January 2026*
