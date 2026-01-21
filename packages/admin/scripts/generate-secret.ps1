# Скрипт для генерации NEXTAUTH_SECRET
# Использование: .\scripts\generate-secret.ps1

$secret = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes([System.Guid]::NewGuid().ToString() + [System.Guid]::NewGuid().ToString()))
Write-Host "===========================================" -ForegroundColor Green
Write-Host "Сгенерированный NEXTAUTH_SECRET:" -ForegroundColor Green
Write-Host "===========================================" -ForegroundColor Green
Write-Host $secret -ForegroundColor Yellow
Write-Host "===========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Скопируйте это значение в .env.local:" -ForegroundColor Cyan
Write-Host "NEXTAUTH_SECRET=$secret" -ForegroundColor Yellow

