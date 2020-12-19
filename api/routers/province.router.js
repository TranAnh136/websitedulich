'use strict'
const province_controller = require('../controllers/province.controller');
module.exports = (app) => {
    app.route('/province/all')
    .get(province_controller.getAllProvince);

}