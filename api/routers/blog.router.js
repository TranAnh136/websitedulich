'use strict'
const blog_controller = require('../controllers/blog.controller');
module.exports = (app) => {
    app.route('/blog/totalpage')
    .get(blog_controller.getTotalPage);

    app.route('/blog/allblog')
    .post(blog_controller.getAllBlog);

    app.route('/blog/:id')
    .get(blog_controller.getBlogByID);

    app.route('/blog/related/:id')
    .get(blog_controller.getBlogRelated);

    app.route('/blog/newpost')
    .post(blog_controller.getNewPost);
}


   