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
 
var alasql = require('alasql'),
  utils = require('../utils/utils');

exports.get = function (query, cb) {
  var out_json = {},
    data = [],
    meta = {},
    opts = { data : GOALS },
    base_fields = 'indicator_id,indicator,target_id,[target],goal,goal_meta_link,goal_meta_link_page,has_metadata';

  try {
    if (query.ids) {
      opts.query_ids = utils.string_to_int(query.ids);
      data = alasql('SELECT * FROM $data WHERE goal IN @($query_ids)', opts);
    } else {
      data = alasql('SELECT * FROM $data', opts); 
    }

    if (query.targets === 'true' || query.indicators === 'true') {
      opts.data = TARGETS;
      data = data.map(function (goal) {
        opts.goal_id = goal.goal;
        goal.targets = alasql('SELECT * FROM $data WHERE goal=$goal_id', opts);
        return goal;
      },this);
    }

    if (query.indicators === 'true') {
      if (query.includeMetadata === 'true') {
        base_fields = '*';
      }

      data = data.map(function (goal) {
        goal.targets.map(function (target) {
          target.indicators = alasql('SELECT '+ base_fields +' FROM ? WHERE target_id=?', [ INDICATORS, target.id]);
          return target;
        },this);
        return goal;
      },this);      
    }

    out_json['data'] = data;
    out_json['meta'] = {};
  }
  catch (e) {
    console.log(e);
    out_json.errors = [];
    out_json.errors.push({
      status: '',
      detail: e,
      source: ''
    });
  }

  cb(null, out_json);
}