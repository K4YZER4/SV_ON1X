const { getWalkingDirections } = require('../services/directions.service');

const getWalking = async (req, res, next) => {
  try {
    const { lato, lono, latd, lond } = req.query;
    const resultado = await getWalkingDirections(
      parseFloat(lato), parseFloat(lono),
      parseFloat(latd), parseFloat(lond)
    );
    res.json(resultado);
  } catch (e) { next(e); }
};

module.exports = { getWalking };
