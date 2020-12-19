'use strict'
const booking_controller = require('../controllers/booking.controller');
module.exports = (app) => {
    app.route('/booking/payment')
    .post(booking_controller.addPayment);

}