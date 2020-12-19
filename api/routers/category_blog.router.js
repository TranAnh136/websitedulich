'use strict'
const category_blog_controller = require('../controllers/category_blog.controller');
module.exports = (app) => {
    app.route('/category-blog')
        .get(category_blog_controller.getCategoryBlog);
    app.route('/category-blog/all/:page')
        .get(category_blog_controller.getAll);
    app.route('/category-blog/name/:id')
        .get(category_blog_controller.getNameByID)   
        
}