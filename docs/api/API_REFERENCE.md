# API Reference — Urbango API

## Base URL
http://localhost:3000

text

## Requisitos
| Requisito | Para qué |
|---|---|
| PostgreSQL + PostGIS | Todos los endpoints que consultan DB |
| `GOOGLE_PLACES_API_KEY` | `/api/rutas-pois?actualizar=true` y `/api/directions/walking` |

---

## Endpoints

### `GET /health`
Verifica que la API y la DB están operativas.

curl "http://localhost:3000/health"
json
{ "status": "ok" }
GET /api/rutas
Lista todas las rutas de una ciudad.

| Parámetro  | Tipo    | Requerido | Descripción       |
|------------|---------|-----------|-------------------|
| id_ciudad  | integer | ✅        | ID de la ciudad   |

```bash
curl "http://localhost:3000/api/rutas?id_ciudad=1"
```

```json
{
  "rutas": [
    { "idruta": 1, "nombre": "Ruta Centro", "ciudad": "Guasave" }
  ],
  "total": 1
}
```

---
### GET /api/rutas-pois
Lee los POIs guardados en la base de datos (sin consultar Google).

```bash
curl "http://localhost:3000/api/rutas-pois"
```

| Campo respuesta      | Descripción                              |
|----------------------|------------------------------------------|
| `rutas[]`            | Lista de rutas con sus POIs              |
| `total`              | Total de rutas                           |
| `actualizadodesde`   | `base_datos_local`                       |
| `ultimaactualizacion`| ISO datetime de la última actualización  |

### `GET /api/rutas-pois?actualizar=true`

Consulta Google Places y actualiza los POIs en la DB (operación lenta).

| Parámetro         | Tipo    | Default | Descripción                      |
|-------------------|---------|---------|----------------------------------|
| `actualizar`      | boolean | `false` | Si `true`, consulta Google       |
| `intervalometros` | integer | `500`   | Densidad de puntos de búsqueda   |
| `poislimit`       | integer | `20`    | Límite de POIs por categoría     |

```bash
curl "http://localhost:3000/api/rutas-pois?actualizar=true&intervalometros=700&poislimit=5"
```

---
### GET /api/rutas-base/:id/puntos
Devuelve los puntos GPS de una ruta base para dibujarla en el mapa.

```bash
curl "http://localhost:3000/api/rutas-base/10/puntos"
```

```json
{
  "idrutabase": 10,
  "nombreruta": "Ruta Centro Base",
  "puntos": [
    { "latitud": 25.57, "longitud": -108.47, "orden": 1 }
  ],
  "total": 120
}
```

---
### GET /api/rutas-optimas-base
Calcula rutas óptimas usando fn_rutas_optima_base(). Soporta rutas directas y con transbordo.

| Parámetro      | Tipo    | Requerido | Default | Descripción                            |
|----------------|---------|-----------|---------|----------------------------------------|
| lato           | float   | ✅        | —       | Latitud origen                         |
| lono           | float   | ✅        | —       | Longitud origen                        |
| latd           | float   | ✅        | —       | Latitud destino                        |
| lond           | float   | ✅        | —       | Longitud destino                       |
| hora           | string  | ✅        | —       | Hora actual HH:MM                      |
| maxwalkm       | float   | ❌        | 500     | Máx. metros caminando                  |
| walkspeedmps   | float   | ❌        | 1.5     | Velocidad caminata (m/s)               |
| maxtransferm   | float   | ❌        | 500     | Máx. metros en transbordo              |
| mintransfm     | integer | ❌        | 100     | Mín. metros en transbordo              |
| buffermin      | integer | ❌        | 10      | Buffer de tiempo transbordo (min)      |
| kroutes        | integer | ❌        | 10      | Rutas candidatas a considerar          |


```bash
curl "http://localhost:3000/api/rutas-optimas-base?lato=25.5697&lono=-108.4731&latd=25.5678&lond=-108.4862&hora=08:00"
```

```json
{
  "status": "success",
  "opciones": [
    {
      "tipo": "directa",
      "idruta": 3,
      "nombre_ruta": "Ruta Norte",
      "score_m": 320.5,
      "lat_subir": 25.569,
      "lon_subir": -108.473,
      "lat_bajar": 25.567,
      "lon_bajar": -108.486,
      "hora_leg1": "08:15:00"
    }
  ],
  "totalopciones": 1
}
```

---
### GET /api/directions/walking
Obtiene instrucciones paso a paso para caminar usando Google Directions API.

| Parámetro | Tipo  | Requerido | Descripción       |
|-----------|-------|-----------|-------------------|
| lato      | float | ✅        | Latitud origen    |
| lono      | float | ✅        | Longitud origen   |
| latd      | float | ✅        | Latitud destino   |
| lond      | float | ✅        | Longitud destino  |


```bash
curl "http://localhost:3000/api/directions/walking?lato=25.57&lono=-108.47&latd=25.58&lond=-108.48"
```

```json
{
  "distance": { "meters": 1200, "text": "1.2 km" },
  "duration": { "seconds": 900, "text": "15 mins" },
  "steps": [...],
  "polyline": "encoded_polyline_string",
  "totalsteps": 8
}
```

Funciones SQL usadas
Función	Endpoint
urb.fn_obtener_todas_rutas(p_id_ciudad)	/api/rutas
urb.fn_rutas_interpoladas_api(intervalo_metros)	/api/rutas-pois?actualizar=true
urb.fn_obtener_puntos_por_ruta_base(p_idruta)	/api/rutas-base/:id/puntos
urb.fn_rutas_optima_base(...)	/api/rutas-optimas-base
text

***

## `docs/MODELO_DB.md`
# Modelo de Base de Datos

Diagrama interactivo (dbdiagram.io): https://dbdiagram.io/d/6995c999bd82f5fce2128071

## Diagrama (SVG)

[![Modelo DB](modelo_db.svg)](https://dbdiagram.io/d/6995c999bd82f5fce2128071)