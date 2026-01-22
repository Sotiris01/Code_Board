# CODE Board - Start Teaching Session
# Starts the collaborative server and ngrok

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       🎓 CODE Board - Start Teaching Session              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Navigate to script folder
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Check if server.js exists
if (-not (Test-Path "server.js")) {
    Write-Host "❌ Error: server.js not found" -ForegroundColor Red
    exit 1
}

# Check if dependencies are installed
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Start Node.js server in background
Write-Host "🚀 Starting server..." -ForegroundColor Green
$serverJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location $path
    node server.js
} -ArgumentList $scriptPath

# Wait a bit for server to start
Start-Sleep -Seconds 2

# Start ngrok
Write-Host "🌐 Starting ngrok tunnel..." -ForegroundColor Green
Write-Host ""

# Open browser for teacher
Start-Process "http://localhost:3000?role=teacher"

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║  📋 INSTRUCTIONS:                                          ║" -ForegroundColor Yellow
Write-Host "║                                                            ║" -ForegroundColor Yellow
Write-Host "║  1. A new ngrok window will open                          ║" -ForegroundColor Yellow
Write-Host "║  2. Copy the 'Forwarding' URL (https://xxxx.ngrok.io)     ║" -ForegroundColor Yellow
Write-Host "║  3. Send this link to students                            ║" -ForegroundColor Yellow
Write-Host "║                                                            ║" -ForegroundColor Yellow
Write-Host "║  To stop: Press Ctrl+C in the ngrok window                ║" -ForegroundColor Yellow
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""

# Run ngrok (blocking - keeps the terminal open)
ngrok http 3000

# Cleanup when ngrok closes
Write-Host ""
Write-Host "🛑 Stopping session..." -ForegroundColor Red
Stop-Job $serverJob -ErrorAction SilentlyContinue
Remove-Job $serverJob -ErrorAction SilentlyContinue
Write-Host "✅ Session terminated" -ForegroundColor Green
