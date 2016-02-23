var express = require('express'),
    app = express(),
    fs = require('fs'),
    cors = require('cors'),
    port = process.env.PORT || 3000;

app.use(cors());

app.use( require('./controllers') );

app.listen(port, function () {
  console.log('loading JSON for SDGs ..');

  GOALS = JSON.parse( fs.readFileSync('data/goals.json') ).goals;
  TARGETS = JSON.parse( fs.readFileSync('data/targets.json') ).targets;
  INDICATORS = JSON.parse( fs.readFileSync('data/indicators.json') );
  DATA_SOURCES = JSON.parse( fs.readFileSync('data/data-sources.json') );
  DASHBOARDS = JSON.parse( fs.readFileSync('data/dashboards.json') );
  SUMMARY_DASHBOARDS = JSON.parse( fs.readFileSync('data/sdg-summary-dashboards.json') );

  console.log('ready!');
});