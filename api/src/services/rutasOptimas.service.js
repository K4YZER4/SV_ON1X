const pool = require('../db');

// fn_rutas_optima_base reemplaza v8, v10 y v11 en un solo servicio
// Parámetros: lat_o, lon_o, lat_d, lon_d, hora_actual::time,
//             max_walk_m, walk_speed_mps, max_transf_m, min_transf_m, buffer_min, k_routes
const obtenerRutasOptimas = async ({
  lato, lono, latd, lond,
  hora,
  maxWalkM    = 500,
  walkSpeedMps = 1.5,
  maxTransfM  = 500,
  minTransfM  = 100,
  bufferMin   = 10,
  kRoutes     = 10
}) => {
  const { rows } = await pool.query(
    `SELECT tipo, idruta, nombre_ruta, idruta_base,
            idruta_a, nombre_ruta_a, idruta_base_a,
            idruta_b, nombre_ruta_b, idruta_base_b,
            dist_origen_m, dist_transbordo_m, dist_destino_m, score_m,
            lat_subir, lon_subir,
            lat_bajar, lon_bajar,
            lat_bajada_transf, lon_bajada_transf,
            lat_subida_transf, lon_subida_transf,
            hora_leg1, hora_leg2,
            metros_transbordo
     FROM urb.fn_rutas_optima_base($1,$2,$3,$4,$5::time,$6,$7,$8,$9,$10,$11)`,
    [lato, lono, latd, lond, hora,
     maxWalkM, walkSpeedMps, maxTransfM, minTransfM, bufferMin, kRoutes]
  );
  return rows;
};

module.exports = { obtenerRutasOptimas };
