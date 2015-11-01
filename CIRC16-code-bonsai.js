var five = require("johnny-five");
var board = new five.Board();

board.on("ready", function() {

var humidity = new five.Sensor({
        	pin: "A0",
	        freq: 250
	    }).on('change', function() {
            console.log(this.value);
        })

    var pin = new five.Pin(8);
    pin.low();
    this.loop(500, function() {
	   var status = humidity.value;
	   if (status > 300) pin.high();
	   else pin.low();
    });

    this.repl.inject({
      pin: humidity
  });    
});

