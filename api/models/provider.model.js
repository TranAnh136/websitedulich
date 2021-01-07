'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const provider = new Schema({
    name: {
        type: String,
        required: [true, "can't be blank"],
    },
    email: {
        type: String,
        required: [true, "can't be blank"],
        index: true,
        lowercase: true,
        match: [/\S+@\S+\.\S+/, 'is invalid'],
    },
    phone: {
        type: String,
    },
    address: {
        type: String
    },
    fax: {
        type: String
    },
    introduce: {
        type: String
    },
    service: {
        type: [String],
        required: true
    },
    traveler: {
        type: Number,
        default: 0, 
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value'
          }
    },
    revenue: {
        type: Number,
        default: 0, 
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value'
          }
    },
    prize: {
        type: [String],
        required: true
    },
    images: {
        type: [String],
        required: true
    }


});
module.exports = mongoose.model('provider', provider);