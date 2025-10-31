#!/usr/bin/env bash
set -euo pipefail

BACKUP_DIR=${1:-infra/backups}
mkdir -p "$BACKUP_DIR"
STAMP=$(date +%Y%m%d-%H%M%S)
OUT="$BACKUP_DIR/mongo-$STAMP.gz"

cd "$(dirname "$0")/.."  # to infra

docker compose exec -T mongodb bash -c 'mongodump --archive --gzip --db app' > "$OUT"
echo "Backup written: $OUT"


