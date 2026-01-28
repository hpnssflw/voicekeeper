#!/bin/bash
# VoiceKeeper - Development Start Script (Linux/Mac)
# Usage: ./scripts/dev-start.sh

set -e

echo "🚀 VoiceKeeper Development Environment"
echo "======================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi
echo "✅ Docker is running"

# Navigate to infra directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR/../infra"

# Start infrastructure
echo ""
echo "📦 Starting MongoDB and Redis..."
docker-compose up -d mongodb redis

# Wait for services
echo "⏳ Waiting for services to be ready..."
sleep 5

# Check services
if docker ps --filter "name=voicekeeper-mongo" --format "{{.Names}}" | grep -q "voicekeeper-mongo"; then
    echo "✅ MongoDB running on localhost:27017"
else
    echo "❌ MongoDB failed to start"
fi

if docker ps --filter "name=voicekeeper-redis" --format "{{.Names}}" | grep -q "voicekeeper-redis"; then
    echo "✅ Redis running on localhost:6379"
else
    echo "❌ Redis failed to start"
fi

# Instructions
echo ""
echo "📋 Next steps:"
echo "1. Configure packages/bot/.env (see DEVELOPMENT.md)"
echo "2. Open 3 terminals and run:"
echo ""
echo "   Terminal 1 (Bot API):"
echo "   cd packages/bot && npm run dev"
echo ""
echo "   Terminal 2 (Admin Panel):"
echo "   cd packages/admin && npm run dev"
echo ""
echo ""
echo "🌐 URLs:"
echo "   Admin Panel:  http://localhost:3001"
echo "   Bot API:      http://localhost:4000"
echo ""
echo "📖 Full documentation: DEVELOPMENT.md"

