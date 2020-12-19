'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tour_design = new Schema({
    user_id: {
        type: String,
      
    },
    name_tour: {
        type: String,
        required: [true, "can't be blank"],
        index: true,
    },
    provider_id: {
        type: String,
        required: [true, "can't be blank"],
    },
    description: {
        type: String,
        default: "",
    },
    start_time: {
        type: Date,
        required: true,
        default: Date.now
    },
    end_time: {
        type: Date,
        required: true,
        default: Date.now
    },
    price: {
        type:Number,
        default: 0, 
      
    },
    palace_depart: {
        type: String,
        required: [true, "can't be blank"],
    },
    messages: {
        type: String,
        required: [true, "can't be blank"],
    },
    status: {
        type: Boolean,
        default: false,
    },
    route: {
        type: [
            {
                location_id: String,
                province_id: String,
                date_happen: Date,
                description: String, 
                images: [String],
            }
        ],
        required : true,
        minlength: 1,
    },
});
module.exports = mongoose.model('tour_design', tour_design);


