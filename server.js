var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
var repeat = require('repeat');
var five = require("johnny-five");
var config = require(__dirname +'/conf/config');
var routes = require(__dirname +'/routes/routes');
var Reading = require(__dirname +'/models/reading');
var unirest = require('unirest');

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
/*
var board = new five.Board();
var temp, light, humidity;
board.on("ready", function() {
    temp = new five.Temperature({
        pin: "A0",
        controller: "LM35"
    });

    light = new five.Sensor({
        pin: "A2",
        freq: 250
    }).scale(0, 100);

    humidity = new five.Sensor({
        pin: "A4",
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
*/
var five = require("johnny-five");
var board = new five.Board();
var prev = -100;
var BASE_URL = "https://api.telegram.org/"+config.botKey+"/";
var POLLING_URL = BASE_URL + "getUpdates?offset=:offset:&timeout=60";
var SEND_MESSAGE_URL = BASE_URL + "sendMessage";
var relay;
var messageSent = false;

board.on("ready", function() {

relay = new five.Pin(8);
relay.high();


var saveSensorData = function(humidity){
    var reading = new Reading({
        humidity: {
            raw: humidity.raw,
            scaled: humidity.scaled
        }
    });

    reading.save(function(err, reading){
        console.log('saved '+JSON.stringify(reading));
    })
}

var humidity = new five.Sensor({
            pin: "A0",
            freq: 250
        })
        .scale(0, 100)
        .on('change', function() {
            var value = this.raw;

            if (Math.abs(value-prev) <= 5) return;

            prev = value;
            saveSensorData(this);

            if ( value > 30 ) {
                relay.high();
                messageSent = false;
            }
            else if(!messageSent) {
                messageSent = true;
                sendMessage("Your plant needs water! Do you want to irrigate it?");
            }
            //else relay.low();
        });    
});


function poll(offset) {
    var url = POLLING_URL.replace(":offset:", offset);
    var max_offset = 0;

    unirest.get(url)
        .end(function(response) {
            var body = response.raw_body;
            if (response.status == 200) {
                var jsonData = JSON.parse(body);
                var result = jsonData.result;
 
                if (result.length > 0) {
                    for (i in result) {
                        if (runCommand(result[i].message)) continue;
                    }
                    
                    if (result && result[result.length-1]) 
                        max_offset = (parseInt(result[result.length - 1].update_id) + 1); // update max offset
                }
                poll(max_offset);
            }
        });
};

var irrigate = function(message) {
    relay.low();    
    sendMessage("Done");
}

var sendMessage = function(text) {
    for (var i in config.ids) {
        var message = {
            chat_id: config.ids[i],
            text: text
        }

        unirest.post(SEND_MESSAGE_URL)
        .send(message)
        .end(function(res) {
            if (res.status == 200) console.log("Successfully sent message");
        });
    }
}
 
var COMMANDS = {
    "irrigate" : irrigate
};

function runCommand(message) {
    var msgtext = message.text;
    
    if (!msgtext) return false;
    if (msgtext.indexOf("/") != 0) return false; // no slash at beginning?
    var command = msgtext.substring(1);
    if (COMMANDS[command] == null) return false; // not a valid command?

    COMMANDS[command](message);

    return true;
}

poll(0);