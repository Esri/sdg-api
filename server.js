var fs = require('fs');
var express = require('express');
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

// .json files
app.get('/', function (req, res) {
  res.send('hi!');
});

app.get('/goals', function (req, res) {
  var return_goals = JSON.parse( JSON.stringify( GOALS ) );;

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
  var q = req.query;
  var indicators = [];
  if (q.goal) {
    indicators = filter_machine(INDICATORS, parseInt(q.goal), 'goal');
  } else if (q.targets) {
    indicators = filter_machine(INDICATORS, q.targets, 'targets');
  } else {
    indicators = INDICATORS;
  }

  res.json(indicators);
});

app.get('/targets', function (req, res) {
  var q = req.query;
  console.log(q);
  var targets = [];
  if (q.goal) {
    targets = filter_machine(TARGETS, parseInt(q.goal), 'goal');
  } else if (q.id) {
    targets = filter_machine(TARGETS, q.id, 'id');
  } else {
    targets = TARGETS;
  }
  res.json(targets);
});

var port = process.env.PORT || 3000;

var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('loading JSON for SDGs ..');
    TARGETS = JSON.parse( fs.readFileSync('data/targets.json') ).targets;
    GOALS = JSON.parse( fs.readFileSync('data/goals.json') ).goals;
    INDICATORS = JSON.parse( fs.readFileSync('data/indicators.json') ).indicators;

    console.log('Example app listening at http://%s:%s', host, port);
});