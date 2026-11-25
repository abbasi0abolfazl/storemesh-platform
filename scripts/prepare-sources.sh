#!/usr/bin/env bash
set -e

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGE_ROOT="$DIR"
SOURCE_ROOT="$PACKAGE_ROOT/source"
WORKSPACE_ROOT="$PACKAGE_ROOT/workspace"

mkdir -p "$WORKSPACE_ROOT"

REPOSITORIES=(
  "storemesh-cloud"
  "storemesh-contracts"
  "storemesh-e2e"
  "storemesh-infrastructure"
  "storemesh-pda"
  "storemesh-platform"
  "storemesh-site-server"
  "storemesh-terminal"
  "storemesh-web"
)

for repo in "${REPOSITORIES[@]}"; do
  archive="$SOURCE_ROOT/$repo-source.zip"
  dest="$WORKSPACE_ROOT/$repo"
  if [ ! -f "$archive" ]; then
    echo "Missing source archive: $archive"
    exit 1
  fi
  mkdir -p "$dest"
  unzip -q -o "$archive" -d "$dest"
  echo "Prepared $repo"
done

prototype_archive="$SOURCE_ROOT/figma-make-ui-prototype-source.zip"
prototype_dest="$WORKSPACE_ROOT/figma-make-ui-prototype"
mkdir -p "$prototype_dest"
unzip -q -o "$prototype_archive" -d "$prototype_dest"
echo "Prepared Figma Make UI prototype"

coordination_archive="$SOURCE_ROOT/storemesh-platform-local-coordination-files.zip"
unzip -q -o "$coordination_archive" -d "$WORKSPACE_ROOT/storemesh-platform"
echo "Applied local Fix Request and coordination files"

echo "Sources are ready in: $WORKSPACE_ROOT"
