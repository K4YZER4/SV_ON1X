const router = require('express').Router();

router.use('/rutas',              require('./rutas.routes'));
router.use('/rutas-pois',         require('./pois.routes'));
router.use('/rutas-base',         require('./rutaBase.routes'));
router.use('/rutas-optimas-base', require('./rutasOptimas.routes')); // 1 solo endpoint limpio
router.use('/directions',         require('./directions.routes'));

module.exports = router;
                                                                                                                                                   