var utils = require('../utils/utils');

exports.get = function (query, cb) {
  var return_targets = utils.deep_copy( TARGETS );

  if (query.goals) {
    var goals = query.goals.split(',').map(function(g) { return parseInt(g); });
    return_targets = utils.filter_by(return_targets, goals, 'goal');
  }
  if (query.ids) {
    var ids = query.ids.split(',');
    return_targets = utils.filter_by(return_targets, ids, 'id');
  }

  var json = {
    data: return_targets,
    meta: 'targets',
    errors: ''
  };
  
  cb(null, json);
}