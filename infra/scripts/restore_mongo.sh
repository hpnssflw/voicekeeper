#!/usr/bin/env bash
set -euo pipefail

ARCHIVE=${1:?"Usage: restore_mongo.sh <path-to-archive.gz>"}

cd "$(dirname "$0")/.."  # to infra

docker compose exec -T mongodb bash -c 'mongorestore --archive --gzip --drop --nsInclude=app.*' < "$ARCHIVE"
echo "Restore completed from $ARCHIVE"


