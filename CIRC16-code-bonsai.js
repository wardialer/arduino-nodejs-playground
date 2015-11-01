var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

var pin = new five.Pin(8);
pin.low();

var humidity = new five.Sensor({
            pin: "A0",
            freq: 250
        })
        .on('change', function() {
            var status = this.value;
            console.log(status);
            if (status > 300) pin.high();
            else pin.low();
        });

    this.repl.inject({
      pin: humidity
  });    
});

