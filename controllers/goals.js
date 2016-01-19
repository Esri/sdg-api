var express = require('express'),
    router = express.Router(),
    utils = require('../utils/utils'),
    Goals = require('../models/goals');

/**
 * /goals
 * @name  goals
 * @param  {null} / return all goals
 * @param  {array} ids filter goals by a list of ids
 * @param  {array} targets filter goals by a list of target
 * @param  {array} indicators filter goals by a list of indicators
 * @return {array} goals 
 */
router.get('/', function (req, res) {
  Goals.get(req.query, function (err, response) {
    res.json( response );
  });
});

module.exports = router;