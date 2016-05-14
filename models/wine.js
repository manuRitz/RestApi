var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var wineSchema = new Schema({
    year: {type: String, required: true},
    name: {type: String, required: true},
    type: {type: String, required: true, enum: ['red', 'white', 'rose']},
    country: {type: String, required: true},
    description: {type: String, required: false}
}, {versionKey: false});

//validate year
wineSchema.path('year').validate(function (v) {
    return !isNaN(v) && v.length === 4;
}, 'not a number');

module.exports = mongoose.model('wines', wineSchema);