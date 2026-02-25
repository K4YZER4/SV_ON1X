const router = require('express').Router();
const { getPuntosRutaBase } = require('../controllers/rutaBase.controller');

router.get('/:id/puntos', getPuntosRutaBase);

module.exports = router;
