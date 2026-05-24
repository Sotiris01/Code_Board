# CODE Board - Start Teaching Session
# Launches the collaborative server (in its own window), waits for it
# to bind to port 3000, opens the teacher view, and starts an ngrok tunnel.

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       🎓 CODE Board - Start Teaching Session              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Navigate to script folder
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Sanity check: canonical entry point exists
if (-not (Test-Path "server/index.js")) {
    Write-Host "❌ Error: server/index.js not found" -ForegroundColor Red
    exit 1
}

# Install dependencies if missing
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Yellow
    npm install
}

# Abort if port 3000 is already in use (avoid silent EADDRINUSE)
$portInUse = Get-NetTCPConnection -LocalPort 3000 -State Listen -ErrorAction SilentlyContinue
if ($portInUse) {
    Write-Host "❌ Port 3000 is already in use (PID $($portInUse.OwningProcess))." -ForegroundColor Red
    Write-Host "   Stop the existing server first, then re-run this script." -ForegroundColor Red
    exit 1
}

# Start the server in its own visible PowerShell window so logs are
# readable and Ctrl+C works naturally. Start-Job is intentionally
# avoided — node servers in background jobs often fail to bind.
Write-Host "🚀 Starting server in a new window..." -ForegroundColor Green
$shell = if (Get-Command pwsh -ErrorAction SilentlyContinue) { "pwsh" } else { "powershell" }
$serverProc = Start-Process -FilePath $shell `
    -ArgumentList "-NoExit", "-Command", "Set-Location '$scriptPath'; npm start" `
    -WorkingDirectory $scriptPath `
    -PassThru

# Wait for the server to actually accept TCP connections (max ~15s)
Write-Host "⏳ Waiting for server on http://localhost:3000 ..." -ForegroundColor Yellow
$ready = $false
for ($i = 0; $i -lt 30; $i++) {
    Start-Sleep -Milliseconds 500
    try {
        $tcp = New-Object System.Net.Sockets.TcpClient
        $tcp.Connect('127.0.0.1', 3000)
        $tcp.Close()
        $ready = $true
        break
    } catch { }
}

if (-not $ready) {
    Write-Host "❌ Server did not start within 15s. Check the server window for errors." -ForegroundColor Red
    exit 1
}
Write-Host "✅ Server is up." -ForegroundColor Green

# Open browser for teacher
Start-Process "http://localhost:3000?role=teacher"

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║  📋 INSTRUCTIONS:                                          ║" -ForegroundColor Yellow
Write-Host "║                                                            ║" -ForegroundColor Yellow
Write-Host "║  1. ngrok will start in this window                       ║" -ForegroundColor Yellow
Write-Host "║  2. Copy the 'Forwarding' URL (https://xxxx.ngrok-free…)  ║" -ForegroundColor Yellow
Write-Host "║  3. Send this link to students                            ║" -ForegroundColor Yellow
Write-Host "║                                                            ║" -ForegroundColor Yellow
Write-Host "║  To stop: Ctrl+C here, then close the server window       ║" -ForegroundColor Yellow
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""

# Run ngrok (blocking)
ngrok http 3000

# Cleanup when ngrok exits
Write-Host ""
Write-Host "🛑 Stopping session..." -ForegroundColor Red
if ($serverProc -and -not $serverProc.HasExited) {
    Stop-Process -Id $serverProc.Id -Force -ErrorAction SilentlyContinue
}
Write-Host "✅ Session terminated" -ForegroundColor Green
