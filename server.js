var express = require('express');
var routes = require('./routes/routes');
var http = require('http');
var path = require('path');
var mongoose = require('mongoose');
var Reading = require('models/reading');
var repeat = require('repeat');

var app = express();

// all environments
mongoose.connect("mongodb://<dbuser>:<dbpassword>@ds063892.mongolab.com:63892/friendly-killer-robot");
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));

app.get('/test', routes.test);

app.get('*', function(req, res) {
    res.sendfile('public/index.html');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var readSensors = function(){
    var reading = new Reading(routes.makeReading());
    reading.save(function(err, reading){
        console.log('saved '+JSON.stringify(reading));
    })
}

repeat(readSensors).every(1,'m').start.now();

