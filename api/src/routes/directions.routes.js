const router = require('express').Router();
const { getWalking } = require('../controllers/directions.controller');
const validateCoords = require('../middlewares/validateCoords');

router.get('/walking', validateCoords, getWalking);

module.exports = router;
