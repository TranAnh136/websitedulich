'use strict'
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contact = new Schema ({
  
    name_contact: {
        type: String,
        required: [true, "can't be blank"]
    },
    phone_contact: {
        type: String
    },
    email_contact: {
        type: String
    },
    messages: {
        type: String
    }
});
module.exports = mongoose.model('contact', contact);