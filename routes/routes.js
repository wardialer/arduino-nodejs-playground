var five = require("johnny-five");
var board = new five.Board();

var temp;
board.on("ready", function() {
    temp = new five.Temperature({
        pin: "A0",
        controller: "LM35"
    });
});

exports.test = function(req, res, next){
    res.json(temp.celsius);
};