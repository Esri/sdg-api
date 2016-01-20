var express = require('express'),
    router = express.Router(),
    utils = require('../utils/utils'),
    Dashboards = require('../models/dashboards');

router.get('/', function (req, res) {
  Dashboards.get(req.query, function (err, response) {
    res.json( response );
  });
});

module.exports = router;