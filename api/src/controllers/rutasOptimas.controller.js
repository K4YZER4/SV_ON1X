const { obtenerRutasOptimas } = require('../services/rutasOptimas.service');

const getRutasOptimas = async (req, res, next) => {
  try {
    const {
      lato, lono, latd, lond, hora,
      maxwalkm, walkspeedmps, maxtransferm,
      mintransfm, buffermin, kroutes
    } = req.query;

    if (!lato || !lono || !latd || !lond || !hora)
      return res.status(400).json({ error: 'lato, lono, latd, lond y hora son requeridos' });

    const opciones = await obtenerRutasOptimas({
      lato, lono, latd, lond, hora,
      maxWalkM:     maxwalkm     && parseFloat(maxwalkm),
      walkSpeedMps: walkspeedmps && parseFloat(walkspeedmps),
      maxTransfM:   maxtransferm && parseFloat(maxtransferm),
      minTransfM:   mintransfm   && parseFloat(mintransfm),
      bufferMin:    buffermin    && parseInt(buffermin),
      kRoutes:      kroutes      && parseInt(kroutes),
    });

    res.json({ status: 'success', opciones, totalopciones: opciones.length });
  } catch (e) { next(e); }
};

module.exports = { getRutasOptimas };
