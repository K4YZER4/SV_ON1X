# Jobs y tareas programadas (cron)

## Objetivo
Automatizar la actualización de POIs (lugares cercanos a las rutas) consultando Google Places API y guardando los resultados en la base de datos.

## Implementación actual
El job está integrado directamente en el servicio `node` usando **node-cron**.  
Archivo: `api/src/jobs/actualizarPois.js`

> No existe un contenedor `cron` separado. El job corre dentro del mismo proceso Node.js.

## Programación
0 3 1 * *

text
Se ejecuta el **día 1 de cada mes a las 03:00**.

## Qué hace
Llama al endpoint interno:
GET http://localhost:3000/api/rutas-pois?actualizar=true&intervalometros=700&poislimit=5

text
Esto activa la consulta a Google Places y guarda los POIs actualizados en la DB.

## Requisitos
- `GOOGLE_PLACES_API_KEY` configurada en `.env`.

## Monitoreo
Los logs del job aparecen en el stdout del contenedor `node`:
docker compose logs node | grep CRON
text


## `docs/ENVIROMENT.md`
# Variables de entorno

El proyecto usa un archivo `.env` en la raíz (junto al `docker-compose.yml`).  
Copia `.env.example` como plantilla: `cp .env.example .env`

## Base de datos (PostgreSQL)
| Variable | Descripción |
|---|---|
| `POSTGRES_DB` | Nombre de la base de datos |
| `POSTGRES_USER` | Usuario de PostgreSQL |
| `POSTGRES_PASSWORD` | Contraseña de PostgreSQL |

## API Node.js
| Variable | Descripción | Default |
|---|---|---|
| `DB_HOST` | Host de la DB (nombre del servicio Docker) | `db` |
| `DB_PORT` | Puerto de la DB | `5432` |
| `DB_NAME` | Nombre de la base (igual a `POSTGRES_DB`) | — |
| `DB_USER` | Usuario (igual a `POSTGRES_USER`) | — |
| `DB_PASS` | Contraseña (igual a `POSTGRES_PASSWORD`) | — |
| `DB_POOL_MIN` | Mínimo de conexiones en el pool | `1` |
| `DB_POOL_MAX` | Máximo de conexiones en el pool | `100` |
| `PORT` | Puerto donde corre Express | `3000` |
| `NODE_ENV` | Entorno (`production` / `development`) | `production` |

## APIs externas
| Variable | Descripción |
|---|---|
| `GOOGLE_PLACES_API_KEY` | Key para Google Places (POIs) y Google Directions (walking) |

## pgAdmin
| Variable | Descripción |
|---|---|
| `PGADMIN_EMAIL` | Email de acceso a pgAdmin |
| `PGADMIN_PASSWORD` | Contraseña de acceso a pgAdmin |