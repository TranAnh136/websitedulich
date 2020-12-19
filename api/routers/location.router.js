'use strict'
const location_controller = require('../controllers/location.controller');
module.exports = (app) => {
    app.route('/location/all')
    .get(location_controller.getAllLocation);

}