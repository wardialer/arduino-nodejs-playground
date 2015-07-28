var mongoose = require('mongoose');

var readingSchema = mongoose.Schema({
    temp: String,
    light: {
        raw: String,
        scaled: String
    },
    humidity: {
        raw: String,
        scaled: String
    }
});

exports.reading = mongoose.model('Reading', readingSchema);
