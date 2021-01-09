'use strict'
const province_controller = require('../controllers/province.controller');
module.exports = (app) => {
    app.route('/province/all')
    .get(province_controller.getAllProvince);

    app.route('/province/name/:id')
    .get(province_controller.getNameByID)
}