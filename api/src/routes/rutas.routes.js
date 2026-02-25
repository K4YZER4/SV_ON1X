const router = require('express').Router();
const { getRutas } = require('../controllers/rutas.controller');

router.get('/', getRutas);

module.exports = router;
