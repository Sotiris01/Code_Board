# AEPP Board - Start Teaching Session
# Ξεκινά τον collaborative server και το ngrok

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║       🎓 CODE Board - Εκκίνηση Συνεδρίας Διδασκαλίας      ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Μετάβαση στον φάκελο
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

# Έλεγχος αν υπάρχει ο server.js
if (-not (Test-Path "server.js")) {
    Write-Host "❌ Σφάλμα: Δεν βρέθηκε το server.js" -ForegroundColor Red
    exit 1
}

# Έλεγχος αν είναι εγκατεστημένα τα dependencies
if (-not (Test-Path "node_modules")) {
    Write-Host "📦 Εγκατάσταση dependencies..." -ForegroundColor Yellow
    npm install
}

# Ξεκίνα τον Node.js server στο background
Write-Host "🚀 Εκκίνηση server..." -ForegroundColor Green
$serverJob = Start-Job -ScriptBlock {
    param($path)
    Set-Location $path
    node server.js
} -ArgumentList $scriptPath

# Περίμενε λίγο να ξεκινήσει ο server
Start-Sleep -Seconds 2

# Ξεκίνα το ngrok
Write-Host "🌐 Εκκίνηση ngrok tunnel..." -ForegroundColor Green
Write-Host ""

# Άνοιξε το browser για τον καθηγητή
Start-Process "http://localhost:3000?role=teacher"

Write-Host "╔════════════════════════════════════════════════════════════╗" -ForegroundColor Yellow
Write-Host "║  📋 ΟΔΗΓΙΕΣ:                                               ║" -ForegroundColor Yellow
Write-Host "║                                                            ║" -ForegroundColor Yellow
Write-Host "║  1. Θα ανοίξει νέο παράθυρο με το ngrok                   ║" -ForegroundColor Yellow
Write-Host "║  2. Αντίγραψε το 'Forwarding' URL (https://xxxx.ngrok.io) ║" -ForegroundColor Yellow
Write-Host "║  3. Στείλε αυτό το link στον μαθητή                       ║" -ForegroundColor Yellow
Write-Host "║                                                            ║" -ForegroundColor Yellow
Write-Host "║  Για να σταματήσεις: Πάτα Ctrl+C στο ngrok παράθυρο       ║" -ForegroundColor Yellow
Write-Host "╚════════════════════════════════════════════════════════════╝" -ForegroundColor Yellow
Write-Host ""

# Εκτέλεση ngrok (blocking - θα κρατήσει ανοιχτό το terminal)
ngrok http 3000

# Cleanup όταν κλείσει το ngrok
Write-Host ""
Write-Host "🛑 Τερματισμός session..." -ForegroundColor Red
Stop-Job $serverJob -ErrorAction SilentlyContinue
Remove-Job $serverJob -ErrorAction SilentlyContinue
Write-Host "✅ Η συνεδρία τερματίστηκε" -ForegroundColor Green
