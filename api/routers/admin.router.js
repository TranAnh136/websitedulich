'use strict'
const admin_controller = require('../controllers/admin.controller');

module.exports = (app) => {
    app.route('/admin/contact')
        .get( admin_controller.getContact);

    app.route('/admin/addtour')
        .post( admin_controller.addTour);

    app.route('/admin/updatetour')
        .post( admin_controller.updateTour);

    app.route('/admin/deletetour/:id')
        .get(admin_controller.deleteTour);

    app.route('/admin/adduser')
    .post(admin_controller.addUser);
    
    app.route('/admin/updateuser')
        .post(admin_controller.updateUser);

    app.route('/admin/deleteuser')
        .post(admin_controller.deleteUser);

    app.route('/admin/addcategoryblog')
        .post(admin_controller.addCategoryBlog);

    app.route('/admin/updatecategoryblog')
        .post(admin_controller.updateCategoryBlog);

    app.route('/admin/addcategorytour')
    .post(admin_controller.addCategoryTour);

    app.route('/admin/updatecategorytour')
    .post(admin_controller.updateCategoryTour);  
        
    app.route('/admin/addprovider')
        .post(admin_controller.addProvider);

    app.route('/admin/updateprovider')
        .post(admin_controller.updaterProvider);

    app.route('/admin/deleteprovider')
       .post(admin_controller.deleteProvider);

    app.route('/admin/getAllUser/:page')
       .get(admin_controller.getAllUser);

    app.route('/admin/login')
       .post(admin_controller.login);


}