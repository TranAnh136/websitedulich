'use strict'
const location_controller = require('../controllers/location.controller');
module.exports = (app) => {
    app.route('/location/all')
    .get(location_controller.getAllLocation);

    app.route('/location/add')
    .post(location_controller.addLocation);

    app.route('/location/update')
    .post(location_controller.updateLocation);

    app.route('/location/delete')
    .post(location_controller.deleteLocation);

}