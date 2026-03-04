# Servidor_UGO

Backend de UrbanGO para cálculo de rutas óptimas, consulta de POIs y walking directions.  
Migrado de **Python/FastAPI** a **Node.js/Express** .

## Stack actual
- **Node.js 20 + Express** — API REST
- **PostgreSQL 16 + PostGIS 3.4** — Base de datos geoespacial
- **Flyway 10.10** — Migraciones automáticas de DB
- **Traccar 6.5** — Tracking GPS
- **pgAdmin 4** — Administración de base de datos
- **node-cron** — Tareas programadas (reemplaza contenedor cron separado)

## Documentación
- **[Iniciar servidor](docs/iniciar_db.md)** — Cómo configurar y levantar desde cero
- **[API Reference](docs/API_REFERENCE.md)** — Endpoints, parámetros y ejemplos
- **[Infraestructura](docs/infraestructura/INFRAESTRUCTURA.md)** — Servicios Docker y arquitectura
- **[Variables de entorno](docs/ENVIROMENT.md)** — Todas las variables necesarias
- **[Jobs / Cron](docs/JOBS.md)** — Tareas programadas automáticas
- **[Modelo DB](docs/MODELO_DB.md)** — Diagrama de la base de datos
- **[Problemas conocidos](docs/problems/problems.md)** — Errores frecuentes y sus soluciones