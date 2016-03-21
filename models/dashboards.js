/* Copyright 2016 Esri
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.​ */
 
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