var five = require("johnny-five");
var board = new five.Board();
var Reading = require('../models/reading');

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

var makeReading = exports.makeReading = function() {
    var reading = {};
    
    reading.temp = temp.celsius;
    reading.light = {
        scaled: light.value, 
        raw: light.raw
    };
    reading.humidity = {
        scaled: humidity.value, 
        raw: humidity.raw
    };

    return reading;
}

// <3
exports.test = function(req, res, next){
    var reading = new Reading(makeReading());
    
    reading.save(function(err, reading) {
        res.json(reading);
    });
};