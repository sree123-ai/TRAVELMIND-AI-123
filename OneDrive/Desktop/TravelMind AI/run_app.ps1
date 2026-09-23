# PowerShell launcher for TRAVELMIND-AI
Write-Host "Starting TRAVELMIND-AI Services..." -ForegroundColor Green

$projectRoot = $PSScriptRoot
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$projectRoot\frontend\backend'; python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$projectRoot\frontend'; npm run dev"

Write-Host "TRAVELMIND-AI launched! Access frontend at http://localhost:5173" -ForegroundColor Cyan
