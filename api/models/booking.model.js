'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const booking  = new Schema ({
    user_id: {
        type: String,
    },
    date_booking: {
        type: Date,
        default: Date.now
    },
    tour_id: {
        type: String,
    },
    name_user_booking: {
        type: String,
    },
    email_user_booking: {
        type: String,
    },
    phone_user_booking: {
        type: String,
    },
    address_user_booking: {
        type: String,
    },
    total_price:{
        type:Number,
        default: 0,
    },
    number_of_customer:{
        type:Number,
        default: 0,
    },
    status_booking: {
        type: String,
    },
    note: {
        type: String,
    },
    list_customer: {
        type: [
            {
                name: String,
                gender: String,
                birthdate: Date,
                identify: Number,
                type_age: String,
            }
        ],
        required : true,
        minlength: 1,
    },
})

module.exports = mongoose.model('booking', booking);