# Infraestructura (Docker)

El servidor se ejecuta con Docker Compose. Cada servicio tiene una responsabilidad única.

## Servicios

### `db` — PostgreSQL + PostGIS
- Imagen: `postgis/postgis:16-3.4`
- Puerto: `5432:5432`
- Healthcheck: `pg_isready` — los demás servicios esperan a que esté listo.
- Datos: persisten en volumen `db_data`.

### `flyway` — Migraciones SQL
- Imagen: `flyway/flyway:10.10`
- Corre una vez y se apaga (`restart: "no"`).
- Aplica los archivos `.sql` de `./db/migrations/` automáticamente.
- Node.js y Traccar no arrancan hasta que Flyway termine exitosamente.

### `node` — API REST
- Imagen: `node:20-alpine`
- Puerto: `3000:3000`
- Código fuente montado desde `./api`.
- Ejecuta `npm install && node src/index.js` al arrancar.
- Incluye el job de actualización de POIs (node-cron) integrado.
- Depende de: `db` (healthy) + `flyway` (completed).

### `traccar` — Tracking GPS
- Imagen: `traccar/traccar:6.5`
- Puertos: `8082:8082` (web) y `5013:5013` (GPS).
- Config: monta `./traccar.xml`.
- Depende de: `db` (healthy) + `flyway` (completed).

### `pgadmin` — Administración DB
- Imagen: `dpage/pgadmin4`
- Puerto: `8080:80`
- Datos: persisten en volumen `pgadmin_data`.
- Depende de: `db` (healthy).

## Red y volúmenes
- Red: `urbango_network` (bridge) — todos los servicios se comunican por nombre de contenedor.
- Volúmenes: `db_data`, `pgadmin_data`, `traccar_data`.