const express = require('express');
const app = express();
const port = process.env.PORT || 8080;
// const path = require('path');
var fs = require('fs');
// require('dotenv/config');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const morgan = require('morgan');
const flash = require('connect-flash');
const cors = require('cors');
// const cors = require('cors');
const userRouter = require('./api/routers/user.router');
const categoryTourRouter = require('./api/routers/category_tour.router');
const categoryBlogRouter = require('./api/routers/category_blog.router');
const providerRouter = require('./api/routers/provider.router');
const bookingRouter = require('./api/routers/booking.router');
const commentRouter = require('./api/routers/comment.router');
const locationRouter = require('./api/routers/location.router');
const adminRouter = require('./api/routers/admin.router');
const tourRouter = require('./api/routers/tour.router');
const provinceRouter = require('./api/routers/province.router');
const blogRouter = require('./api/routers/blog.router')
// mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://admin:admin@cluster0.v7yzg.mongodb.net/webdulich?retryWrites=true&w=majority', {useNewUrlParser: true, useNewUrlParser: true,  useUnifiedTopology: true}, function(err){
    if(err){
        console.log("Khong the ket noi "+ err)
    }else{
        console.log("Ket noi thanh cong ")
    }
}); // kết nối tới db

// cài đặt ứng dung express
app.use(morgan('dev')); // log tất cả request ra console log
// app.use(cookieParser()); // đọc cookie (cần cho xác thực)
app.use(bodyParser.json()); // lấy thông tin từ html forms
app.use(bodyParser.urlencoded({extended: true}));
app.use(flash()); // use connect-flash for flash messages stored in session

app.set('view engine', 'ejs'); // cài đặt ejs là templating
app.use(cors())
app.use(express.static('public'))
userRouter(app);
categoryTourRouter(app);
categoryBlogRouter(app);
providerRouter(app);
bookingRouter(app);
commentRouter(app);
tourRouter(app);
locationRouter(app);
adminRouter(app);
provinceRouter(app);
blogRouter(app);
app.get('/', (req, res) => {res.send('welcome to our website')})

app.listen(port, () => console.log("server running on port " + port));