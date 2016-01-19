var utils = require('../utils/utils');

exports.get_all_sources = function (query, cb) {
  var sources = utils.deep_copy( DATA_SOURCES );

  var json = {
    data: [],
    meta: 'providers',
    errors: ''
  };

  cb( null, json );
}