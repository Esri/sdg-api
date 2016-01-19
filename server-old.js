var fs = require('fs'),
  express = require('express'),
  cors = require('cors'),
  _ = require('underscore');


/** utility functions **/
function deep_copy(inObj) {
  return JSON.parse( JSON.stringify( inObj ) );
}

function filter_by(arr, value, param) {
  if (Array.isArray(value)) {
    return arr.filter(function (item) {
      return value.indexOf(item[param]) !== -1;
    });  
  } else {
    return arr.filter(function (item) {
      return item[param] === value;
    })
  }
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
    return indicator.target === targetId;
  });
}

function get_data_sources(q) {
  var sources = deep_copy( DATA_SOURCES );

  if (q.country_code) {
    sources = filter_by(sources, q.country_code, 'country_code');
  }
  if (q.goals) {
    var g = q.goals.split(',').map(function (g) { return parseInt(g) });
    sources = filter_by(sources, g, 'goal');
  }
  if (q.targets) {
    var t = q.targets.split(',');
    sources = filter_by(sources, t, 'target');
  }
  if (q.indicators) {
    var i = q.indicators.split(',');
    sources = filter_by(sources, i, 'indicator');
  }

  return sources;
}

// start the app and setup the endpoints
var app = express();
app.use(cors());

/**
 * /
 * @param  {null} / return meta information about the API
 * @return {object} info
 */
app.get('/', function (req, res) {
  res.json( { 'meta' : 'info about the api goes here' } );
});

/**
 * /goals
 * @param  {null} / return all goals
 * @param  {array} ids filter goals by a list of ids
 * @param  {array} targets filter goals by a list of target
 * @param  {array} indicators filter goals by a list of indicators
 * @return {array} goals 
 */
app.get('/goals', function (req, res) {
  var return_goals = deep_copy( GOALS );

  if (req.query.ids) {
    var ids = req.query.ids.split(',').map(function (i) { return parseInt(i)});
    return_goals = filter_by(return_goals, ids, 'goal'); 
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

  res.json( return_goals );
});

/**
 * /targets
 * @param  {null} / return all targets
 * @param  {array} goals  filter targets by a list of goal numbers
 * @param  {array} ids filter targets by a list of ids
 * @return {array} targets 
 */
app.get('/targets', function (req, res) {
  var return_targets = deep_copy( TARGETS );

  if (req.query.goals) {
    var goals = req.query.goals.split(',').map(function(g) { return parseInt(g); });
    return_targets = filter_by(return_targets, goals, 'goal');
  }
  if (req.query.ids) {
    var ids = req.query.ids.split(',');
    return_targets = filter_by(return_targets, ids, 'id');
  }
  
  res.json( return_targets );
});

/**
 * /indicators
 * @param  {null} / return all indicators
 * @param  {array} goals  filter indicators by a list of goal numbers
 * @param  {array} targets filter indicators by a list of targets
 * @return {array} indicators 
 */
app.get('/indicators', function (req, res) {
  var return_indicators = deep_copy( INDICATORS );
  
  if (req.query.goals) {
    var goals = req.query.goals.split(',').map(function(g) { return parseInt(g); });
    return_indicators = filter_by(return_indicators, goals, 'goal');
  }
  if (req.query.targets) {
    var targets = req.query.targets.split(',');
    return_indicators = filter_by(return_indicators, targets, 'target');
  } 

  res.json( return_indicators );
});

/**
 * /data-sources
 * @param  {null} / return all data-sources
 * @param  {array} goals  filter indicators by a list of goal numbers
 * @param  {array} targets filter indicators by a list of targets
 * @return {array} data-sources 
 */
app.get('/data-sources', function (req, res) {
  var q = req.query;

  var sources = get_data_sources(q);

  res.json( sources );
});

// fire it up!
var port = process.env.PORT || 3000;
var server = app.listen(port, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('loading JSON for SDGs ..');
    GOALS = JSON.parse( fs.readFileSync('data/goals.json') ).goals;
    TARGETS = JSON.parse( fs.readFileSync('data/targets.json') ).targets;
    INDICATORS = JSON.parse( fs.readFileSync('data/indicators.json') );
    DATA_SOURCES = JSON.parse( fs.readFileSync('data/data-sources.json') );

    console.log('app listening at http://%s:%s', host, port);
});