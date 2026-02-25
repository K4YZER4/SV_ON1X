const { obtenerTodasRutas } = require('../services/rutas.service');

const getRutas = async (req, res, next) => {
  try {
    const { id_ciudad } = req.query;
    if (!id_ciudad) return res.status(400).json({ error: 'id_ciudad es requerido' });
    const rutas = await obtenerTodasRutas(id_ciudad);
    res.json({ rutas, total: rutas.length });
  } catch (e) { next(e); }
};

module.exports = { getRutas };
