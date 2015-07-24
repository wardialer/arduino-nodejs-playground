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
    });
    humidity = new five.Pin({
        pin: "A2"
    });

});

exports.test = function(req, res, next){
    var obj = {temp: temp.celsius, 
               light: light.value,
               humidity: humidity.value};
    res.json(obj);
};