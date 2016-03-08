var express = require('express'),
    router = express.Router(),
    utils = require('../utils/utils'),
    Geographies = require('../models/available-geographies');

router.get('/', function (req, res) {
  Geographies.get(req.query, function (err, response) {
    res.json( response );
  });
});

module.exports = router;