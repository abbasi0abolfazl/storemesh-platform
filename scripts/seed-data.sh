#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
echo "Populating comprehensive test data for StoreMesh..."
node "$DIR/seed-all-data.mjs"
echo "Done! You can verify endpoints at http://localhost:3000/api/master-data/products"
