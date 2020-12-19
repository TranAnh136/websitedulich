'use strict'
const user_controller = require('../controllers/user.controller');

module.exports = (app) => {
    app.route('/user/register')
    .post(user_controller.register);

    app.route('/user/verify/:token')
    .get(user_controller.verifyAccount);

    app.route('/user/login')
    .post(user_controller.login);

    app.route('/user/request/forgotpassword/:email')
    .get(user_controller.requestForgotPassword)

    app.route('/user/verify/forgotpassword')
    .post(user_controller.verifyForgotPassword)

    app.route('/user/forgotpassword')
    .post(user_controller.forgotPassword)

    app.route('/user/updateinfor')
    .post(user_controller.updateInfor)

    app.route('/user/updatepassword')
    .post(user_controller.updatePassword)

    app.route('/user/myhistory')
    .post(user_controller.getHistoryByUser)

    app.route('/user/mytourdesign')
    .post(user_controller.showTourDesign)

    app.route('/user/profile')
    .post(user_controller.showProfile)

    app.route('/user/createtourdesign')
    .post(user_controller.CreateNewTourDesign)

    



}