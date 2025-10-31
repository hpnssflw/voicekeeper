#!/usr/bin/env bash
set -euo pipefail

SERVICE=${1:-nginx}

cd "$(dirname "$0")/.."  # to infra
docker compose logs -f "$SERVICE"


