#!/bin/bash
# Скрипт для генерации NEXTAUTH_SECRET
# Использование: bash scripts/generate-secret.sh

SECRET=$(openssl rand -base64 32)

echo "==========================================="
echo "Сгенерированный NEXTAUTH_SECRET:"
echo "==========================================="
echo "$SECRET"
echo "==========================================="
echo ""
echo "Скопируйте это значение в .env.local:"
echo "NEXTAUTH_SECRET=$SECRET"

