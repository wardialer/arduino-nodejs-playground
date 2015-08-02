var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var repeat = require('repeat');
var five = require("johnny-five");
var config = require(__dirname +'/conf/config');
var routes = require(__dirname +'/routes/routes');
var Reading = require(__dirname +'/models/reading');

var app = express();

// all environments
mongoose.connect("mongodb://"+config.username+":"+config.password+"@ds063892.mongolab.com:63892/friendly-killer-robot");
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));

app.get('/get', routes.get);

app.get('*', function(req, res) {
    res.sendfile('public/index.html');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var board = new five.Board();
var temp, light, humidity;
board.on("ready", function() {
    temp = new five.Temperature({
        pin: "A0",
        controller: "LM35"
    });

    light = new five.Sensor({
        pin: "A1",
        freq: 250
    }).scale(0, 100);

    humidity = new five.Sensor({
        pin: "A2",
        freq: 250
    }).scale(0, 100);

});

var readSensors = function(){
    var reading = new Reading({
        temp: temp.celsius,
        light: {
            raw: light.raw,
            scaled: light.scaled
        },
        humidity: {
            raw: humidity.raw,
            scaled: humidity.scaled
        }
    });

    reading.save(function(err, reading){
        console.log('saved '+JSON.stringify(reading));
    })
}

repeat(readSensors).every(1,'h').start.in(30, 's');

