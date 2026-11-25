#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PROTOTYPE="$DIR/workspace/figma-make-ui-prototype"

if [ ! -d "$PROTOTYPE" ]; then
  "$DIR/scripts/prepare-sources.sh"
fi

cd "$PROTOTYPE"
pnpm install
mkdir -p node_modules/.vite-temp
pnpm dev --host 0.0.0.0 --port 8443
