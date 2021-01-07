'use strict'
const tour_controller = require('../controllers/tour.controller');
module.exports = (app) => {
    app.route('/tour/totalpage')
    .get(tour_controller.getTotalPage);

    app.route('/tour/alltour')
    .post(tour_controller.getAllTour);

    app.route('/tour/provider')
    .get(tour_controller.getTourByProvider);

    app.route('/tour/category')
    .get(tour_controller.getTourByCategory);

    app.route('/tour/:id')
    .get(tour_controller.getTourByID);

    app.route('/tour/related/:tourId')
    .get(tour_controller.getRelatedTour);

    app.route('/tour/tourdiscount')
    .post(tour_controller.getTourDiscount);

    app.route('/tour/getTourHome')
    .post(tour_controller.getTourHome);
}