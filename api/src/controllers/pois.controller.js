const { getPoisDB, actualizarPoisGoogle } = require('../services/pois.service');

const getPois = async (req, res, next) => {
  try {
    const {
      actualizar = 'false',
      intervalometros = 500,
      poislimit = 20
    } = req.query;

    const resultado = actualizar === 'true'
      ? await actualizarPoisGoogle(parseInt(intervalometros), parseInt(poislimit))
      : await getPoisDB();

    res.json(resultado);
  } catch (e) { next(e); }
};

module.exports = { getPois };
