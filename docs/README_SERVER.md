# UrbanGO Server (Backend)

Backend de UrbanGO para cálculo de rutas, consulta de rutas base, POIs y utilidades (walking directions), con base de datos PostGIS y servicios auxiliares en Docker.

## Tecnologías
- **Node.js 20 + Express** (API HTTP) — migrado desde Python/FastAPI.
- **PostgreSQL 16 + PostGIS 3.4** (base de datos geoespacial).
- **Flyway** (migraciones automáticas de base de datos).
- **Traccar** (tracking GPS).
- **pgAdmin** (administración de base de datos, opcional).

## Servicios (docker-compose)
- `db`: PostgreSQL con PostGIS (puerto 5432).
- `node`: API Node.js/Express (puerto 3000).
- `flyway`: Migraciones SQL automáticas (init container, se apaga solo).
- `traccar`: Servicio de tracking GPS (puertos 8082 y 5013).
- `pgadmin`: Panel web de administración (puerto 8080).

## Requisitos
- Docker y Docker Compose instalados en el servidor.

## Configuración
1. Copia el archivo de ejemplo: `cp .env.example .env`
2. Rellena los valores en `.env` (ver [VARIABLES DE ENTORNO](ENVIROMENT.md)).

## Levantar el servidor
# Primera vez o tras cambios en el código
docker compose up -d

# Ver logs en tiempo real
docker compose logs -f node

# Ver estado de todos los contenedores
docker compose ps
Puertos por defecto
Servicio	Puerto
API Node.js	3000
PostgreSQL	5432
pgAdmin	8080
Traccar web	8082
Traccar GPS	5013
Flujo de arranque
La base de datos arranca primero → Flyway aplica las migraciones → Node.js y Traccar arrancan cuando las migraciones terminan.

text

## `docs/INFRAESTRUCTURA.md`
```md
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