'use strict'
const category_tour_controller = require('../controllers/category_tour.controller');
module.exports = (app) => {
    app.route('/category-tour')
        .get(category_tour_controller.getCategoryTour);
    app.route('/category-tour/all/:page')
        .get(category_tour_controller.getAll);
    app.route('/category-tour/name/:id')
        .get(category_tour_controller.getNameByID)   
        
}