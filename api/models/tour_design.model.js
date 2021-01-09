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
    time_start: {
        type: Date,
        required: true,
        default: Date.now
    },
    time_end: {
        type: Date,
        required: true,
        default: Date.now
    },
    price: {
        type:Number,
        default: 0, 
      
    },
    image_cover: {
        type: String,
        default: "..\\assets\\img\\tour\\design-tour-cover.jpg"
    },
    place_depart: {
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
    confirm: {
        type: Boolean,
        default: null
    },
    route: {
        type: [
            {
                location_id: String,
                date_happen: Date,
                title: String,
                description: String, 
                images: {
                    type :String,
                    default : "..\\assets\\img\\tour\\rsz_design-tour-slider.jpg"
                }
            }
        ],
        required : true,
        minlength: 1,
    },
});
module.exports = mongoose.model('tour_design', tour_design);


