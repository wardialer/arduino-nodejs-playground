var constants = require("./../conf/cons");
var five = require("johnny-five");
var botTelegram = require("./telegramBot");
var Reading = require("./../models/reading");
var board;
var prevT = -100;
var prevH = -100;
var messageSent = false;
var relay;

var isChanged = function(previousValue, currentValue, treshold) {
    if (Math.abs(currentValue-previousValue) <= treshold)
        return false;
    else
        return true;
}

var saveSensorData = function(sensor, type){
    var reading = new Reading();
    switch (type) {
        case constants.sensorNames.humidity:
            reading.humidity = {
                raw: sensor.raw,
                scaled: sensor.scaled
            }
            break;
        case constants.sensorNames.temperature:
            reading.temp = {
                temp: sensor.celsius
            }
            break;
        default:
            break;
    }
    reading.save(function(err, reading){
        console.log('saved '+JSON.stringify(reading));
    })
}

exports.getBoard = function() {
    return board;
}

exports.setRelayToLow = function() {
    relay.low();
}

exports.init = function(){
    var board = new five.Board();
    board.on("ready", function() {
        relay = new five.Pin(constants.relayPin);
        relay.high();

        var temp = new five.Temperature({
            pin: constants.temperaturePin,
            controller: constants.temperatureController
        }).on('change', function() {
            if (isChanged(prevT, this.celsius, 1)) {
                prevT = this.celsius;
                saveSensorData(this, constants.sensorNames.temperature);
            }
        });

        var humidity = new five.Sensor({
            pin: constants.humidityPin,
            freq: constants.humidityFrequency
        })
        .scale(0, 100)
        .on('change', function(){
            if (isChanged(prevH, this.raw, 5)) {
                prevH = value;
                saveSensorData(this, constants.sensorsNames.humidity);

                if ( value > 30 ) {
                    relay.high();
                    messageSent = false;
                }
                else if(!messageSent) {
                    messageSent = true;
                    botTelegram.sendMessage("Your plant needs water! Do you want to irrigate it?");
                }
            }
        });
    })
}