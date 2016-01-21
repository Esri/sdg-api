exports.get = function (query, cb) {
  var data = [];
  var meta = {};

  if (!query.country_code) {
    // set to global
    query.country_code = "GLOBAL";
  }

  if (query.goal) {
    var country = DASHBOARDS.filter(function (d) {
      return query.country_code === d.country_code;
    });
    
    if (country && country[0]) {
      country = country[0];
      meta.country_name = country.country_name;
      
      var d = country.dashboards.filter(function (cd) {
        return cd.hasOwnProperty(query.goal);
      });

      if (d && d[0]) {
        data = d[0][query.goal];
      }
    }
  } 

  var json = {
    data: data,
    meta: meta,
    errors: {}
  };

  cb(null, json);
}