var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var config = require(__dirname +'/conf/config');
var readings = require(__dirname +'/routes/reading');

var botTelegram = require(__dirname + '/controllers/telegramBot');
var board = require(__dirname + '/controllers/board');

var app = express();

// all environments
mongoose.connect("mongodb://"+config.username+":"+config.password+"@ds063892.mongolab.com:63892/friendly-killer-robot");
app.set('port', process.env.PORT || 3000);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(__dirname + '/public'));

app.get('/get', readings.get);

app.get('*', function(req, res) {
    res.sendfile('public/index.html');
});

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

botTelegram.poll(0);
board.init();