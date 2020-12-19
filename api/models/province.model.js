'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const province = new Schema({
    name_province: {
        type: String,
        required: [true, "can't be blank"]
    }
})
module.exports = mongoose.model('province', province);