var express = require('express'),
    router = express.Router(),
    utils = require('../utils/utils'),
    Indicators = require('../models/indicators');

router.get('/', function (req, res) {
  Indicators.get(req.query, function (err, response) {
    res.json( response );
  });
});

module.exports = router;