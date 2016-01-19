var utils = require('../utils/utils');

exports.get = function (query, cb) {
  var return_goals = utils.deep_copy( GOALS );
  if (query.ids) {
    var ids = query.ids.split(',').map(function (i) { return parseInt(i)});
    return_goals = utils.filter_by(return_goals, ids, 'goal'); 
  }

  if (query.targets === 'true') {
    return_goals.forEach(function (g) {
      g.targets = utils.get_targets(g);
    });
  }

  if (query.indicators === 'true') {
    if (query.relateIndicatorsToTargets === 'true' && query.targets === 'true'){
      return_goals.forEach(function (goal) {
        goal.targets.forEach(function(target) {
          target.indicators = utils.get_indicators_by_target(target.id);
        });
      });
    } else {
      return_goals.forEach(function (g) {
        g.indicators = utils.get_indicators(g);
      });
    }
  }

  var json = {
    data: return_goals,
    meta: 'goals',
    errors: ''
  };
  
  cb(null, json );
}