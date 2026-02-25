module.exports = (req, res, next) => {
  const { lato, lono, latd, lond } = req.query;
  if (!lato || !lono || !latd || !lond)
    return res.status(400).json({ error: 'lato, lono, latd y lond son requeridos' });
  if (lato < -90 || lato > 90 || latd < -90 || latd > 90)
    return res.status(400).json({ error: 'Latitud fuera de rango (-90 a 90)' });
  if (lono < -180 || lono > 180 || lond < -180 || lond > 180)
    return res.status(400).json({ error: 'Longitud fuera de rango (-180 a 180)' });
  next();
};
