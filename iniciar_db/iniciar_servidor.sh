#!/usr/bin/env bash
set -euo pipefail

# Ir a la raíz del repo (padre de la carpeta donde está este script)
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$ROOT_DIR"

# 1) Migraciones
docker compose run --rm flyway

# 2) Copiar dump (ruta absoluta al archivo en el repo)
docker cp "$ROOT_DIR/iniciar_db/urb_data_only.dump" 0NIX_db:/tmp/urb_data_only.dump

# 3) Restore data-only excluyendo flyway_schema_history
docker exec -t --env-file "$ROOT_DIR/.env" 0NIX_db sh -lc \
'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --data-only -n urb -n urb_sistema \
  -T urb.flyway_schema_history -T urb_sistema.flyway_schema_history \
  /tmp/urb_data_only.dump'
