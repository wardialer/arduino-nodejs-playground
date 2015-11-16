var Reading = require('../models/reading');

exports.get = function(req, res, next){
    Reading.find().sort({date: 1})
    .exec(function(err, readings) {
        res.json(readings);
    });  
};