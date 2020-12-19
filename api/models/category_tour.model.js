'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const category_tour = new Schema({
    name: {
        type: String,
        required: [true, "can't be blank"],
    },
});
module.exports = mongoose.model('category_tour', category_tour);