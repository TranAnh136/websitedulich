'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const user = new Schema({
    name: {
        type: String,
    },
    email: {
        type: String,
        required: [true, "can't be blank"],
        index: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    password: {
        type: String,
        required: [true, "can't be blank"]
    },
    phone: {
        type: String,
    },
    address: {
        type: String
    },
    role: {
        type: Number,
        default: 0,
    },
    avatar: {
        type: String,
    },
    is_verify: {
        type: Boolean,
        default: false
    },
    token: {
        type: String
    }
});
module.exports = mongoose.model('user', user);