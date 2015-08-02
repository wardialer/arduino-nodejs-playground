var Reading = require(__dirname + '/models/reading');

exports.get = function(req, res, next){
    Reading.find().exec(function(err, readings) {
        res.json(readings);
    });  
};