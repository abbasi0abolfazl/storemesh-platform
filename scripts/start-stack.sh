#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
INFRA="$DIR/workspace/storemesh-infrastructure"

if [ ! -d "$INFRA" ]; then
  "$DIR/scripts/prepare-sources.sh"
fi

cd "$INFRA"
if [ ! -f ".env" ]; then
  cp .env.example .env
  echo "A .env file was created. Please fill in placeholders before running again."
  exit 1
fi

if grep -q "replace-" .env; then
  echo "Error: The .env file still contains placeholder secrets."
  exit 1
fi

docker compose --env-file .env up -d --build
docker compose ps
