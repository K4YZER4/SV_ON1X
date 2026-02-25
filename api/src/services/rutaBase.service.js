const pool = require('../db');

const getPuntosService = async (idRutaBase) => {
  const { rows } = await pool.query(
    `SELECT latitud, longitud, orden, nombre
     FROM urb.fn_obtener_puntos_por_ruta_base($1)`,
    [idRutaBase]
  );
  if (!rows.length) return null;
  return {
    idrutabase: parseInt(idRutaBase),
    nombreruta: rows[0].nombre,
    puntos: rows.map(r => ({
      latitud:  parseFloat(r.latitud),
      longitud: parseFloat(r.longitud),
      orden:    parseInt(r.orden)
    })),
    total: rows.length
  };
};

module.exports = { getPuntosService };
