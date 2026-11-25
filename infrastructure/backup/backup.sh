#!/bin/sh
set -eu
: "${PGHOST:?PGHOST is required}" "${PGDATABASE:?PGDATABASE is required}" "${PGUSER:?PGUSER is required}" "${BACKUP_DIR:=/backups}" "${RETENTION_DAYS:=14}"
mkdir -p "$BACKUP_DIR"
stamp="$(date -u +%Y%m%dT%H%M%SZ)"
target="$BACKUP_DIR/${SITE_CODE:-site}-$stamp.dump"
pg_dump --format=custom --no-owner --file="$target" "$PGDATABASE"
pg_restore --list "$target" >/dev/null
find "$BACKUP_DIR" -type f -name '*.dump' -mtime "+$RETENTION_DAYS" -delete
echo "$target"
