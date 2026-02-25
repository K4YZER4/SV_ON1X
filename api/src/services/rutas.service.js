const pool = require('../db');

// fn_obtener_todas_rutas ahora requiere p_id_ciudad
const obtenerTodasRutas = async (idCiudad) => {
  const { rows } = await pool.query(
    `SELECT idruta, nombre, ciudad FROM urb.fn_obtener_todas_rutas($1)`,
    [idCiudad]
  );
  return rows;
};

module.exports = { obtenerTodasRutas };
