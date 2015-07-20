var express = require('express');
var routes = require('./routes/routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 80);
app.set('views', __dirname + '/views');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

app.get('/test', routes.test);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});