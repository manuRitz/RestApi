var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var wineSchema = new Schema({
    year: {type: String, required: true},
    name: {type: String, required: true},
    type: {type: String, required: true, enum: ['red', 'white', 'rose']},
    country: {type: String, required: true},
    description: {type: String, required: false}
}, {
    versionKey: false,
    toJSON: {
        transform: function (doc, ret, options) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

//_id autoincrement
var db = require('../db').mongoose;
autoIncrement.initialize(db);
wineSchema.plugin(autoIncrement.plugin, 'wines');

//validate year (number and length of 4)
wineSchema.path('year').validate(function (v) {
    return !isNaN(v) && v.length === 4;
}, 'not a number');

module.exports = mongoose.model('wines', wineSchema);