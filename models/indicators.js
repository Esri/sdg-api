/* Copyright 2016 Esri
 * Licensed under the Apache License, Version 2.0 (the 'License");
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
    fields = 'indicator_id,indicator,target_id,[target],goal,goal_meta_link,goal_meta_link_page,has_metadata',
    search_fields = ['target_id','has_metadata','goal','goal_meta_link','goal_meta_link_page','target','indicator_id','indicator','responsible_entities','definition','method','rationale_interpretation','domain','subdomain','target_linkage','exists_reported','reliability_coverage_comparability_subnational_compute','baseline_value_2015','sources_data_collection','quantifiable_derivatives','frequency','disaggregation','global_regional_monitoring_data','comments_limitations','gender_equality_issues','current_data_availability','supplementary_information','references'],
    search_pre_operator = ' AND (';
    base_sql = 'SELECT ',
    opts = [ INDICATORS ];

  try {
    if (query.includeMetadata === 'true') {
      fields = '*';
    }

    base_sql += fields + ' FROM ?';

    if (query.ids && !query.targets) {
      base_sql += ' WHERE indicator_id IN ('+ utils.sql_stringify(query.ids) +')';
    } else if (query.goals) {
      base_sql += ' WHERE goal IN ('+ utils.string_to_int(query.goals) +')';
    } else if (query.targets) {
      base_sql += ' WHERE target_id IN ('+ utils.sql_stringify(query.targets) +')';
    } else {
      search_pre_operator = ' WHERE (';
    }

    if (query.keywords) {
      var kws = query.keywords.split(',');
      base_sql += search_pre_operator;
      var sf;
      if (query.search_fields) {
        sf = query.search_fields.split(',');
      } else {
        sf = search_fields;
      }

      sf.forEach(function (f, index, arr) {
        if (['target', 'references'].indexOf(f) !== -1) {
          f = '[' + f + ']';
        }
        base_sql += '(' + f + ' LIKE ';
        
        kws.forEach(function(kw, idx, kwarr){
          base_sql += '\'%' + kw + '%\'';
          if (idx !== kwarr.length-1) {
            base_sql += ' OR ';
          } else {
            base_sql += ')';
          }
        });        
        
        if (index !== arr.length-1) {
          base_sql += ' OR ';
        }
      }, this);
     
      base_sql += ')';
      
      // base_sql = 'SEARCH / * WHERE(_ LIKE '%GEMI%') FROM ?';
      console.log(base_sql);
    }

    data = alasql(base_sql, opts);
    
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