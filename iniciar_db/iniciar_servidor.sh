#!/usr/bin/env bash
set -euo pipefail

# Ir a la raíz del repo (padre de la carpeta donde está este script)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

# 1) Migraciones con Flyway
docker compose run --rm flyway

# 2) Copiar dump al contenedor
docker cp "$ROOT_DIR/iniciar_db/dump_data_only.sql" 0NIX_db:/tmp/dump_data_only.sql

# 3) Restore data-only usando psql (es .sql, NO pg_restore)
docker exec -t 0NIX_db bash -c \
  "PGPASSWORD='0N1X_2025' psql -U 0N1X -d urbango \
    --set ON_ERROR_STOP=on \
    -f /tmp/dump_data_only.sql"
