var utils = require('../utils/utils');

exports.get = function (query, cb) {
  var return_indicators = utils.deep_copy( INDICATORS );
  
  if (query.goals) {
    var goals = query.goals.split(',').map(function(g) { return parseInt(g); });
    return_indicators = utils.filter_by(return_indicators, goals, 'goal');
  }
  if (query.targets) {
    var targets = query.targets.split(',');
    return_indicators = utils.filter_by(return_indicators, targets, 'target');
  } 

  var json = {
    data: return_indicators,
    meta: 'indicators',
    errors: ''
  };

  cb(null, json );
}