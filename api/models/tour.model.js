'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const tour = new Schema({
   
    name_tour: {
        type: String,
        required: [true, "can't be blank"],
        index: true,
    },
    provider_id: {
        type: String,

    },
    description: {
        type: String,
        default: "",
    },
    time_start: {
        type: Date,
        required: false,
        default: Date.now
    },
    time_end: {
        type: Date,
        required: false,
        default: Date.now
    },
    price: {
        type:Number,
        default: 0, 
      
    },
    is_discount: {
        type: Boolean,
        default: false,
    },
    capacity: { //so luong nguoi toi da
        type:Number,
        default: 0, 
        validate : {
            validator : Number.isInteger,
            message   : '{VALUE} is not an integer value'
          }
    },
    image_cover: {
        type: String,
        required: [true, "can't be blank"],
    },
    place_depart: {
        type: String,
        required: [true, "can't be blank"],
    },
    category_tour_id: {
        type: String,
        required: [true, "can't be blank"],
    },
    route: {
        type: [
            {
                location_id: String,
                date_happen: Date,
                title: String,
                description: String, 
                images: String
            }
        ],
        required : true,
        minlength: 1,
    },
});
module.exports = mongoose.model('tour', tour);