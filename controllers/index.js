var express = require('express'),
    router = express.Router();

router.use('/goals', require('./goals'));
router.use('/targets', require('./targets'));
router.use('/indicators', require('./indicators'));
router.use('/data-sources', require('./data-sources'));
router.use('/providers', require('./providers'));
router.use('/dashboards', require('./dashboards'));

router.get('/', function (req, res) {
  res.json( { 'meta' : 'info about the api goes here' } );
});

module.exports = router;