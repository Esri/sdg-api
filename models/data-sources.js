var utils = require('../utils/utils');

exports.get_all_sources = function (query, cb) {
  var sources = utils.deep_copy( DATA_SOURCES );

  if (query.country_code) {
    sources = utils.filter_by(sources, query.country_code, 'country_code');
  }
  if (query.goals) {
    var g = query.goals.split(',').map(function (g) { return parseInt(g) });
    sources = utils.filter_by(sources, g, 'goal');
  }
  if (query.targets) {
    var t = query.targets.split(',');
    sources = utils.filter_by(sources, t, 'target');
  }
  if (query.indicators) {
    var i = query.indicators.split(',');
    sources = utils.filter_by(sources, i, 'indicator');
  }

  cb( null, sources );
}