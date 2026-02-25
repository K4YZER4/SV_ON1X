const router = require('express').Router();
const { getRutasOptimas } = require('../controllers/rutasOptimas.controller');
const validateCoords = require('../middlewares/validateCoords');

// Un solo endpoint limpio que reemplaza /base, /base2 y /base11
router.get('/', validateCoords, getRutasOptimas);

module.exports = router;
