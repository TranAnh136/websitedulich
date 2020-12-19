'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const location = new Schema({
    name_location: {
        type: String,
        required: [true, "can't be blank"]
    },
    province_id:{
        type: String,
        required: [true, "can't be blank"]
    }
})
module.exports = mongoose.model('location', location);