var express = require('express'),
    router = express.Router(),
    utils = require('../utils/utils'),
    Providers = require('../models/providers');

router.get('/', function (req, res) {
  Providers.get_all_sources(req.query, function (err, response) {
    res.json( response );
  });
});

module.exports = router;