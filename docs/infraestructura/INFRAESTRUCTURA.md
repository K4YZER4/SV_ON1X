# Infraestructura del Servidor — UrbanGO

El servidor corre completamente con **Docker Compose**. Cada servicio tiene
una responsabilidad única y se comunican entre sí a través de una red bridge interna.

---

## Orden de Arranque

El orden de inicio está controlado por dependencias (`depends_on`):

db (healthy) ──┬──► flyway (completed) ──┬──► node
│ └──► traccar
└──► pgadmin

text

---

## Servicios

### `db` — Base de Datos

| Propiedad    | Valor                        |
|--------------|------------------------------|
| Imagen       | `postgis/postgis:16-3.4`     |
| Puerto       | `5432:5432`                  |
| Volumen      | `db_data` (persistente)      |
| Healthcheck  | `pg_isready`                 |

Motor principal de datos. Usa **PostGIS** para manejo de geometrías y
consultas geoespaciales (rutas, paradas, zonas). Todos los demás servicios
esperan a que esté `healthy` antes de arrancar.

---

### `flyway` — Migraciones SQL

| Propiedad    | Valor                          |
|--------------|--------------------------------|
| Imagen       | `flyway/flyway:10.10`          |
| Restart      | `no` (corre una sola vez)      |
| Fuente       | `./db/migrations/*.sql`        |
| Depende de   | `db` (healthy)                 |

Aplica automáticamente los archivos `.sql` de migraciones al iniciar el
stack. Se apaga al terminar. `node` y `traccar` no arrancan hasta que
Flyway complete exitosamente, garantizando que el esquema esté listo.

---

### `node` — API REST

| Propiedad    | Valor                                        |
|--------------|----------------------------------------------|
| Imagen       | `node:20-alpine`                             |
| Puerto       | `3000:3000`                                  |
| Código fuente| `./api` (montado como volumen)               |
| Comando      | `npm install && node src/index.js`           |
| Depende de   | `db` (healthy) + `flyway` (completed)        |

Expone la API REST del sistema. Incluye un **job programado con node-cron**
integrado para la actualización periódica de POIs. El código se monta
directamente desde el host para facilitar el desarrollo.

---

### `traccar` — Tracking GPS

| Propiedad    | Valor                              |
|--------------|------------------------------------|
| Imagen       | `traccar/traccar:6.5`              |
| Puerto web   | `8082:8082`                        |
| Puerto GPS   | `5013:5013`                        |
| Config       | `./traccar.xml` (montado)          |
| Volumen      | `traccar_data` (persistente)       |
| Depende de   | `db` (healthy) + `flyway` (completed) |

Recibe y procesa señales GPS de los dispositivos en tiempo real a través
del puerto `5013`. El panel de administración web está disponible en el
puerto `8082`. Su configuración de conexión a la DB se define en `traccar.xml`.

---

### `pgadmin` — Administración de Base de Datos

| Propiedad    | Valor                    |
|--------------|--------------------------|
| Imagen       | `dpage/pgadmin4`         |
| Puerto       | `8080:80`                |
| Volumen      | `pgadmin_data`           |
| Depende de   | `db` (healthy)           |

Interfaz web para inspeccionar y administrar PostgreSQL visualmente.
Accesible desde el navegador en `http://<IP>:8080`.

---

## Red Interna

| Propiedad | Valor              |
|-----------|--------------------|
| Nombre    | `urbango_network`  |
| Driver    | `bridge`           |

Todos los servicios se comunican entre sí usando el **nombre del contenedor**
como hostname (ej. `node` se conecta a `db` usando `host: db`).
Ningún servicio necesita conocer IPs directas.

---

## Volúmenes Persistentes

| Volumen         | Usado por  | Propósito                              |
|-----------------|------------|----------------------------------------|
| `db_data`       | `db`       | Datos de PostgreSQL/PostGIS            |
| `pgadmin_data`  | `pgadmin`  | Configuración y sesiones de pgAdmin    |
| `traccar_data`  | `traccar`  | Datos históricos de tracking GPS       |

---

## Puertos Expuestos al Exterior

| Puerto | Servicio   | Descripción              |
|--------|------------|--------------------------|
| `3000` | node       | API REST                 |
| `5013` | traccar    | Recepción señales GPS    |
| `8082` | traccar    | Panel web Traccar        |
| `8080` | pgadmin    | Panel web pgAdmin        |
| `5432` | db         | PostgreSQL (solo interno, no exponer en producción) |