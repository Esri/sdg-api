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
    base_sql = 'SELECT * FROM ?';
    
  try {
    if (query.goals && !query.ids) {
      base_sql += ' WHERE goal IN('+ utils.string_to_int(query.goals) +')';
      data = alasql(base_sql, [ TARGETS ]);
    }

    if (query.ids) {
      base_sql += ' WHERE id IN ('+ utils.sql_stringify(query.ids) +')';
      data = alasql(base_sql, [ TARGETS ]);
    } else if (!query.goals) {
      data = alasql(base_sql, [ TARGETS ]); 
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