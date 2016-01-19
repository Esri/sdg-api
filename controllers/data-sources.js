var express = require('express'),
    router = express.Router(),
    utils = require('../utils/utils'),
    Data_Sources = require('../models/data-sources');

router.get('/', function (req, res) {
  Data_Sources.get_all_sources(req.query, function (err, response) {
    res.json( response );
  });
});

module.exports = router;