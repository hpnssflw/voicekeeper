#!/usr/bin/env bash
set -euo pipefail

read -p "This will prune unused Docker data. Continue? [y/N] " yn
case $yn in
    [Yy]*) ;;
    *) echo "Aborted"; exit 1;;
esac

docker system prune -af --volumes


