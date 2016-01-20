exports.get = function (query, cb) {
  var data = [];

  if (query.country_code) {
    data = DASHBOARDS.filter(function (d) {
      return query.country_code === d.country_code;
    })
      [0]
      .dashboards;
  }

  var json = {
    data: data,
    meta: {},
    errors: {}
  };

  cb(null, json);
}