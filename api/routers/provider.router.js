'use strict';
const provider_controller = require('../controllers/provider.controller');
module.exports = app => {
  app.route('/provider/all/:page')
  .get(provider_controller.getAll);

  app.route('/provider')
  .get(provider_controller.getProvider);

  app.route('/tourbyprovider')
  .get(provider_controller.getTourByProvider);

  app.route('/provider/name/:id')
  .get(provider_controller.getNameByID);

  app.route('/provider/verify/:token')
    .get(provider_controller.verifyAccount);

  app.route('/provider/request/forgotpassword/:email')
  .get(provider_controller.requestForgotPassword)

  app.route('/provider/profile/:id')
  .post(provider_controller.showProfileProvider);

  app.route('/provider/tourdesign')
  .post(provider_controller.updateTourDesign);

  app.route('/provider/login')
  .post(provider_controller.login);

  app.route('/provider/verify/forgotpassword')
  .post(provider_controller.verifyForgotPassword)

  app.route('/provider/forgotpassword')
  .post(provider_controller.forgotPassword)

  app.route('/provider/updateinfor')
  .post(provider_controller.updaterProvider)

  app.route('/provider/updatepassword')
  .post(provider_controller.updatePassword)

  app.route('/provider/addtour')
  .post(provider_controller.addTour)

  app.route('/provider/updatetour')
  .post(provider_controller.updateTour)

  app.route('/provider/deletetour')
  .post(provider_controller.deleteTour)





};
