exports.deep_copy = function (inObj) {
  return JSON.parse( JSON.stringify( inObj ) );
}

exports.filter_by = function(arr, value, param) {
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

exports.get_targets = function(goal) {
  return TARGETS.filter(function (t){
    return t.goal === goal.goal;
  });
}

exports.get_indicators = function(goal) {
  return INDICATORS.filter(function (i){
    return i.goal === goal.goal;
  });
}

exports.get_indicators_by_target = function(targetId) {
  return INDICATORS.filter(function (indicator) {
    return indicator.target === targetId;
  });
}

exports.get_data_sources = function(q) {
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