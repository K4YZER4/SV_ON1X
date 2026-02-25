const router = require('express').Router();
const { getPois } = require('../controllers/pois.controller');

router.get('/', getPois);

module.exports = router;
