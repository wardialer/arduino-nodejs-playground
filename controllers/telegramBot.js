var unirest = require('unirest');
var config = require('../conf/config');
var board = require('./board');

var BASE_URL = "https://api.telegram.org/"+config.botKey+"/";
var POLLING_URL = BASE_URL + "getUpdates?offset=:offset:&timeout=60";
var SEND_MESSAGE_URL = BASE_URL + "sendMessage";

var poll = exports.poll = function(offset) {
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

var water = function(message) {
    var index = config.ids.indexOf(message.from.id);
    if (index >= 0) {
        board.setRelayToLow();
        sendMessage("Done");
    } else {
        sendMessage("You can't do that")
    }
}

var sendMessage = exports.sendMessage = function(text, keyboard) {
    for (var i in config.ids) {
        var message = {
            chat_id: config.ids[i],
            text: text
        }

        if (keyboard)
            message.reply_markup = JSON.stringify({keyboard: keyboard, one_time_keyboard: true});

        unirest.post(SEND_MESSAGE_URL)
        .send(message)
        .end(function(res) {
            if (res.status == 200) console.log("Successfully sent message");
        });
    }
}
 
var COMMANDS = {
    "water" : water
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