var fs = require('fs');
var express = require('express');
var cors = require('cors');
var _ = require('underscore');

var app = express();

var TARGETS = null;
var GOALS = null;
var INDICATORS = null;


function filter_machine(arr, value, param) {
  return arr.filter(function (item) {
    if (param === 'targets') {
      var ts = item[param].split(',');
      var val = value.split(',');
      var out = _.intersection(ts, val);
      return out.length > 0 ? true : false;
    } else {
      return item[param] === value;  
    }    
  },this);
}

function get_goals(ids) {
  return GOALS.filter(function (g) {
    return ids.indexOf(g.goal) !== -1;
  })
}

function get_targets(goal) {
  return TARGETS.filter(function (t){
    return t.goal === goal.goal;
  });
}

function get_indicators(goal) {
  return INDICATORS.filter(function (i){
    return i.goal === goal.goal;
  });
}

function get_indicators_by_target(targetId) {
  return INDICATORS.filter(function (indicator) {
    return indicator.targets.split(',').indexOf(targetId) !== -1;
  });
}

function deep_copy(inObj) {
  return JSON.parse( JSON.stringify( inObj ) );
}

app.use(cors());

app.get('/', function (req, res) {
  res.send('hi!');
});

app.get('/goals', function (req, res) {
  var return_goals = deep_copy( GOALS );

  if (req.query.ids) {
    console.log('goal ids', req.query.ids);
    var ids = req.query.ids.split(',').map(function (i) { return parseInt(i)});
    return_goals = deep_copy( get_goals(ids) );
  }
  
  if (req.query.targets === 'true') {
    return_goals.forEach(function (g) {
      g.targets = get_targets(g);
    });
  }

  if (req.query.indicators === 'true') {
    if (req.query.relateIndicatorsToTargets === 'true' && req.query.targets === 'true'){
      return_goals.forEach(function (goal) {
        goal.targets.forEach(function(target) {
          target.indicators = get_indicators_by_target(target.id);
        });
      });
    } else {
      return_goals.forEach(function (g) {
        g.indicators = get_indicators(g);
      });
    }
  }

  res.send( return_goals );
  
});

app.get('/indicators', function (req, res) {
  var return_indicators = deep_copy( INDICATORS );
  
  if (req.query.goal) {
    return_indicators = filter_machine(INDICATORS, parseInt(req.query.goal), 'goal');
  }
  if (req.query.targets) {
    return_indicators = filter_machine(INDICATORS, req.query.targets, 'targets');
  } 

  res.send( return_indicators );
});

app.get('/targets', function (req, res) {
  var return_targets = deep_copy( TARGETS );

  if (req.query.goal) {
    return_targets = filter_machine(TARGETS, parseInt(req.query.goal), 'goal');
  }
  if (req.query.id) {
    return_targets = filter_machine(TARGETS, req.query.id, 'id');
  }
  
  res.send( return_targets );
});

function get_data_sources(country_code, goal, target, indicator) {
  return DATA_SOURCES[country_code][goal][target][indicator];
}

app.get('/data-sources', function (req, res) {
  var query = req.query;

  var country_code = query.country;
  var goal = query.goal;
  var target = query.target;
  var indicator = query.indicator;

  var sources = get_data_sources(country_code, goal, target, indicator);

  res.send( sources );
});

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('loading JSON for SDGs ..');
    TARGETS = JSON.parse( fs.readFileSync('data/targets.json') ).targets;
    GOALS = JSON.parse( fs.readFileSync('data/goals.json') ).goals;
    INDICATORS = JSON.parse( fs.readFileSync('data/indicators.json') ).indicators;
    DATA_SOURCES = JSON.parse( fs.readFileSync('data/data-sources.json') );

    console.log('app listening at http://%s:%s', host, port);
});