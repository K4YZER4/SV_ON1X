const pool  = require('../db');
const axios = require('axios');
const env   = require('../config/env');

const TIPOS_PRINCIPALES = [
  'school','primary_school','secondary_school','university',
  'hospital','doctor','pharmacy',
  'supermarket','convenience_store','bank','atm',
  'restaurant','cafe','bakery',
  'park','shopping_mall','city_hall','church',
  'clothing_store','gym','stadium','gas_station','hotel'
];

const NEARBY_URL  = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json';
const DETAILS_URL = 'https://maps.googleapis.com/maps/api/place/details/json';

// Consulta horarios desde Place Details
const getHorarios = async (placeId) => {
  if (!placeId) return '';
  try {
    const { data } = await axios.get(DETAILS_URL, {
      params: { placeid: placeId, fields: 'opening_hours', key: env.google.placesKey }
    });
    const weekday = data?.result?.opening_hours?.weekday_text;
    return weekday ? weekday.join(', ') : '';
  } catch { return ''; }
};

// Consulta Google Places Nearby
const getNearbyPois = async (lat, lon, tipo, radio = 300) => {
  try {
    const { data } = await axios.get(NEARBY_URL, {
      params: { location: `${lat},${lon}`, radius: radio, type: tipo, key: env.google.placesKey }
    });
    return data?.results || [];
  } catch { return []; }
};

// Guarda/actualiza POIs en la DB
const guardarPois = async (poisData) => {
  if (!poisData.length) return;
  const client = await pool.connect();
  try {
    for (const poi of poisData) {
      await client.query(
        `INSERT INTO urb.urbpoi (id, title, categoria, direccion, icono, horario, rating, userratingstotal, geom, fechaactualizacion)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8, ST_SetSRID(ST_MakePoint($9,$10), 4326), NOW())
         ON CONFLICT (id) DO UPDATE SET
           title=EXCLUDED.title, categoria=EXCLUDED.categoria, direccion=EXCLUDED.direccion,
           icono=EXCLUDED.icono, horario=EXCLUDED.horario, rating=EXCLUDED.rating,
           userratingstotal=EXCLUDED.userratingstotal, geom=EXCLUDED.geom, fechaactualizacion=NOW()`,
        [poi.id, poi.title, poi.categoria, poi.direccion, poi.icono,
         poi.horario, poi.rating, poi.userratingstotal, poi.longitud, poi.latitud]
      );
      await client.query(
        `INSERT INTO urb.urb_ruta_poi (ruta_id, poi_id) VALUES ($1,$2) ON CONFLICT DO NOTHING`,
        [poi.rutaId, poi.id]
      );
    }
  } finally { client.release(); }
};

// Modo lectura — lee de la DB local
const getPoisDB = async () => {
  const { rows } = await pool.query(
    `SELECT rp.ruta_id AS rutaid, p.id, p.title, p.categoria, p.direccion,
            p.icono, p.horario, p.rating, p.userratingstotal,
            ST_Y(p.geom) AS latitud, ST_X(p.geom) AS longitud, p.fechaactualizacion
     FROM urb.urbpoi p
     JOIN urb.urb_ruta_poi rp ON p.id = rp.poi_id
     ORDER BY rp.ruta_id, p.categoria`
  );
  const resultado = {};
  for (const row of rows) {
    if (!resultado[row.rutaid]) resultado[row.rutaid] = [];
    resultado[row.rutaid].push(row);
  }
  const { rows: [{ max }] } = await pool.query('SELECT MAX(fechaactualizacion) FROM urb.urbpoi');
  return {
    rutas: Object.entries(resultado).map(([rutaid, pois]) => ({ rutaid, pois })),
    total: Object.keys(resultado).length,
    actualizadodesde: 'base_datos_local',
    ultimaactualizacion: max
  };
};

// Modo actualización — consulta Google y guarda
const actualizarPoisGoogle = async (intervalometros = 500, poislimit = 20) => {
  const { rows } = await pool.query(
    `SELECT ruta_id, id_ruta_base, idx, latitud, longitud
     FROM urb.fn_rutas_interpoladas_api($1)`,
    [intervalometros]
  );

  // Agrupar por ruta
  const rutasMap = {};
  for (const row of rows) {
    if (!rutasMap[row.ruta_id]) rutasMap[row.ruta_id] = [];
    rutasMap[row.ruta_id].push(row);
  }

  const todosLosPois = [];

  for (const [rutaId, coordenadas] of Object.entries(rutasMap)) {
    const coordsFiltradas = coordenadas.filter((_, i) => i % 5 === 0);
    const poisPorCategoria = {};
    const idsVistos = new Set();

    for (const { latitud: lat, longitud: lon } of coordsFiltradas) {
      for (const tipo of TIPOS_PRINCIPALES) {
        if ((poisPorCategoria[tipo]?.length || 0) >= poislimit) continue;
        const poisRaw = await getNearbyPois(lat, lon, tipo);
        for (const raw of poisRaw) {
          if (!raw.place_id || idsVistos.has(raw.place_id)) continue;
          const horario = await getHorarios(raw.place_id);
          await new Promise(r => setTimeout(r, 100)); // pausa anti-rate-limit
          const poi = {
            id:               raw.place_id,
            title:            raw.name,
            latitud:          raw.geometry.location.lat,
            longitud:         raw.geometry.location.lng,
            categoria:        tipo,
            direccion:        raw.vicinity || raw.formatted_address || '',
            icono:            raw.icon || '',
            horario,
            rating:           raw.rating || null,
            userratingstotal: raw.user_ratings_total || null,
            rutaId:           parseInt(rutaId)
          };
          if (!poisPorCategoria[tipo]) poisPorCategoria[tipo] = [];
          poisPorCategoria[tipo].push(poi);
          idsVistos.add(raw.place_id);
          todosLosPois.push(poi);
        }
      }
    }
  }

  await guardarPois(todosLosPois);

  return {
    rutas: Object.entries(
      todosLosPois.reduce((acc, p) => {
        if (!acc[p.rutaId]) acc[p.rutaId] = [];
        acc[p.rutaId].push(p);
        return acc;
      }, {})
    ).map(([rutaid, pois]) => ({ rutaid, pois })),
    total: todosLosPois.length,
    actualizadodesde: 'google_places'
  };
};

module.exports = { getPoisDB, actualizarPoisGoogle };
