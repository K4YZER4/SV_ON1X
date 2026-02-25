const { getPuntosService } = require('../services/rutaBase.service');

const getPuntosRutaBase = async (req, res, next) => {
  try {
    const { id } = req.params;
    const resultado = await getPuntosService(id);
    if (!resultado) return res.status(404).json({ error: 'Ruta base no encontrada', idrutabase: id });
    res.json(resultado);
  } catch (e) { next(e); }
};

module.exports = { getPuntosRutaBase };
