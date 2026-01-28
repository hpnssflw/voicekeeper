# VoiceKeeper - Development Start Script (Windows PowerShell)
# Usage: .\scripts\dev-start.ps1

Write-Host "🚀 VoiceKeeper Development Environment" -ForegroundColor Cyan
Write-Host "=======================================" -ForegroundColor Cyan

# Check if Docker is running
try {
    docker info | Out-Null
    Write-Host "✅ Docker is running" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Start infrastructure
Write-Host "`n📦 Starting MongoDB and Redis..." -ForegroundColor Yellow
Set-Location -Path "$PSScriptRoot\..\infra"
docker-compose up -d mongodb redis

# Wait for services
Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

# Check services
$mongoRunning = docker ps --filter "name=voicekeeper-mongo" --format "{{.Names}}" | Select-String "voicekeeper-mongo"
$redisRunning = docker ps --filter "name=voicekeeper-redis" --format "{{.Names}}" | Select-String "voicekeeper-redis"

if ($mongoRunning) {
    Write-Host "✅ MongoDB running on localhost:27017" -ForegroundColor Green
} else {
    Write-Host "❌ MongoDB failed to start" -ForegroundColor Red
}

if ($redisRunning) {
    Write-Host "✅ Redis running on localhost:6379" -ForegroundColor Green
} else {
    Write-Host "❌ Redis failed to start" -ForegroundColor Red
}

# Instructions
Write-Host "`n📋 Next steps:" -ForegroundColor Cyan
Write-Host "1. Configure packages/bot/.env (see DEVELOPMENT.md)" -ForegroundColor White
Write-Host "2. Open 3 terminals and run:" -ForegroundColor White
Write-Host ""
Write-Host "   Terminal 1 (Bot API):" -ForegroundColor Yellow
Write-Host "   cd packages/bot; npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host "   Terminal 2 (Admin Panel):" -ForegroundColor Yellow
Write-Host "   cd packages/admin; npm run dev" -ForegroundColor Gray
Write-Host ""
Write-Host ""
Write-Host "🌐 URLs:" -ForegroundColor Cyan
Write-Host "   Admin Panel:  http://localhost:3001" -ForegroundColor White
Write-Host "   Bot API:      http://localhost:4000" -ForegroundColor White
Write-Host ""
Write-Host "📖 Full documentation: DEVELOPMENT.md" -ForegroundColor Cyan

