'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const blog = new Schema({
    name_blog: {
        type: String,
        required: [true, "can't be blank"]
    },
    id_category_blog: {
        type: String,
        required: [true, "can't be blank"]
    },
    date_post: {
        type: Date,
        required: false,
        default: Date.now
    },
    introduce_summary:{
        type: String,
        required: [true, "can't be blank"]
    },
    images_cover:{
        type: String,
        required: [true, "can't be blank"]
    },
    content:{
        type: 
            {
                first_content: String,
                content_highlight: String,
                title_highlight1: String,
                content_para1: String,
                title_highlight2: String,
                content_highlight2: String,
                images: [String],
            }
        ,
        required : true,
        minlength: 1,
    }

})
module.exports = mongoose.model('blog', blog);