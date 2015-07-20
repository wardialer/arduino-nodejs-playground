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
    console.log(temp);
    res.json(temp);
};

/*
board.on("ready", function() {
  var temp = new five.Temperature({
    pin: "A0",
    controller: "LM35"
  });

  temp.on("change", function() {
    console.log("Temp: %d", this.celsius);
  });
});*/