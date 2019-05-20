const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let SliceModel = new Schema({
    name: {
        type: String
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String
    },
    start_longitude: {
        type: String
    },
    start_latitude: {
        type: String
    },
    end_longitude: {
        type: String
    },
    end_latitude: {
        type: String
    },
    start_depth: {
        type: String
    },
    end_depth: {
        type: String
    },
    article: {
        type: String
    }
});

module.exports = mongoose.model('SliceModel', SliceModel);