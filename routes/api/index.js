const router = require('express').Router();
const userRoutes = require('./user-routes');
const thoughtRoutes = require('./thought-routes');
const apiRoutes = require('./api');

router.use('/users', userRoutes);
router.use('/thoughts', thoughtRoutes);

module.exports = router;