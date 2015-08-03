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
    },
    date: { type: Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Reading', readingSchema);
