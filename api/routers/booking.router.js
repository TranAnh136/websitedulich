'use strict'
const booking_controller = require('../controllers/booking.controller');
module.exports = (app) => {
    app.route('/booking/addbooking')
    .post(booking_controller.addBooking);

    app.route('/booking/getbookingbytoken/:token')
    .get(booking_controller.getBookingByToken)
}
