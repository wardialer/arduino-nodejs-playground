var five = require("johnny-five");
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

exports.test = function(req, res, next){
    var obj = {
        temp: temp.celsius, 
        light: {
            scaled: light.value, 
            raw: light.raw
        },
        humidity: {
            scaled: humidity.value, 
            raw: humidity.raw
        }
   };
   
    res.json(obj);
};