'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const category_blog = new Schema({
    name: {
        type: String,
        required: [true, "can't be blank"],
    },
});
module.exports = mongoose.model('category_blog', category_blog);