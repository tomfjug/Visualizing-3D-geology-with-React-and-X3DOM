const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let WellModel = new Schema({
    name: {
        type: String
    },
    des: {
        type: String
    },
    subwell : [{
        x: Number,
        y: Number,
        z: Number,
        x2: Number,
        y2: Number,
        z2: Number,
        property: Array
      }],
    type: {
        type: Array
    },
    article: {
        type: String
    },
    longitude: {
        type: String
    },
    latitude: {
        type: String
    },
    depth: {
        type: String
    },
});

module.exports = mongoose.model('WellModel', WellModel);