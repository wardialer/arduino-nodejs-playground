var Reading = require('../models/reading');

exports.get = function(req, res, next){
    Reading.find().exec(function(err, readings) {
        res.json(readings);
    });  
};