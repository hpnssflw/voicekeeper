#!/usr/bin/env bash
set -euo pipefail

REPO_DIR=${REPO_DIR:-$HOME/telegram-voronka}

cd "$REPO_DIR"
git pull --rebase

cd infra
docker compose pull
docker compose build
docker compose up -d

docker compose ps


