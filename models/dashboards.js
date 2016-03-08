exports.get = function (query, cb) {
  var data = [];
  var meta = {};

  if (query.geography === 'countries') {
    
    if (!query.geo_value) {
      // set to global
      query.geo_value = "GLOBAL";
    }

    if (query.goal && query.target_id) {
      var country = DASHBOARDS.filter(function (d) {
        return query.geo_value === d.country_code;
      });
      
      if (country && country[0]) {
        country = country[0];
        meta.country_name = country.country_name;
        meta.goal = query.goal;

        if (country.dashboards[query.goal]) {
          if (country.dashboards[query.goal][query.target_id]) {
            data = country.dashboards[query.goal][query.target_id].levels;
          }
        }
      }
    } else if (query.goal) {
      // var g = parseInt(query.goal);
      // var dash = DASHBOARDS_SDG_INDEX.filter(function (d) {
      //   return g === d.goal;
      // });

      // if (dash && dash[0]) {
      //   data = dash[0].dashboard;
      // }
      
      data = DASHBOARDS_SDG_INDEX[0].dashboard;
    }

  } else if (query.geography === 'cities') {
    var city = DASHBOARDS_CITIES.filter(function (d) {
      return query.geo_value === d.city_name;
    });

    if (city && city[0]) {
      city = city[0];
      meta.city_name = city.city_name;
      meta.goal = parseInt(query.goal);

      if (city.dashboards[query.goal]) {
        if (city.dashboards[query.goal][query.target_id]) {
          data = city.dashboards[query.goal][query.target_id].levels;
        }
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