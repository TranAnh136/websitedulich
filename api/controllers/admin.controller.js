'use strict'

const multer = require("multer");
const user = require('../models/user.model');
const category_tour = require('../models/category_tour.model');
const category_blog = require('../models/category_blog.model');
const provider = require('../models/provider.model');
const contact = require('../models/contact.model')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// const fs = require('fs');

//provider
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/provider') //noi luu hinh tu set lai
    },
    filename: function(req, file, cb){
        cb(null, Date.now()+ "-"+ file.originalname)
    }
    });
const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb){
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png" || file.mimetype=="image/jpg" || file.mimetype=="image/jpeg" || file.mimetype=="image/gif" ){
            cb(null, true)
        } else {
            return cb(new Error("Only image are allowed !"))
        }
    }
}).single("file"); //ten cua muc upload hinh

//user
const storage_user = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/avatar') //noi luu hinh tu set lai
    },
    filename: function(req, file, cb){
        cb(null, Date.now()+ "-"+ file.originalname)
    }
    });
const upload_user = multer({
    storage: storage_user,
    fileFilter: function(req, file, cb){
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png" || file.mimetype=="image/jpg" || file.mimetype=="image/jpeg" || file.mimetype=="image/gif" ){
            cb(null, true)
        } else {
            return cb(new Error("Only image are allowed !"))
        }
    }
}).single("file"); //ten cua muc upload hinh

//tour
const storage_tour = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/tour') //noi luu hinh tu set lai
    },
    filename: function(req, file, cb){
        cb(null, Date.now()+ "-"+ file.originalname)
    }
    });
const upload_tour = multer({
    storage: storage_tour,
    fileFilter: function(req, file, cb){
        if(file.mimetype=="image/bmp" || file.mimetype=="image/png" || file.mimetype=="image/jpg" || file.mimetype=="image/jpeg" || file.mimetype=="image/gif" ){
            cb(null, true)
        } else {
            return cb(new Error("Only image are allowed !"))
        }
    }
}).single("file"); //ten cua muc upload hinh
  
//provider
exports.addProvider = async (req, res) => {
        upload(req, res, async function(err){
            if(err instanceof multer.MulterError){
                res.json({"kq":0,"errMsg":"A Multer error occurred when uploading."});
            } else if(err){
                res.json({"kq":0,"errMsg":"An unknown error occurred when uploading." +err});
            } else{
                    if(typeof req.name === 'undefined' 
                    || typeof req.body.email === 'undefined' 
                    || typeof req.body.phone === 'undefined' 
                    || typeof req.body.address === 'undefined' 
                    || typeof req.body.fax === 'undefined' 
                    || typeof req.body.introduce === 'undefined' 
                    || typeof req.body.service === 'undefined' 
                    || typeof req.body.travler === 'undefined' 
                    || typeof req.body.revenue === 'undefined' 
                    || typeof req.body.prize === 'undefined' 
                    || typeof req.body.filename === 'undefined'  //hinh
                ) {
                    res.status(422).json({ msg: 'Invalid data' });
                    return;
                }
                let {name, email, phone, address, fax, introduce, service, travler, revenue, prize, images} = req.body;
                if (email.indexOf("@")=== -1 && email.indexOf('.') === -1 
                    || password.length < 6 ){
                    res.status(422).json({ msg: 'Invalid data' });
                    return;
                }
                let providerFind, userFind = null;;
                try {
                    userFind = await user.findOne({ 'email': email });
                    providerFind = await provider.findOne({ 'email': email });
                }
                catch (err) {
                    console.log(err)
                    res.status(500).json({ msg: err })
                    return;
                }
                if (providerFind.length > 0 || userFind.length > 0) {
                    res.status(409).json({ msg: 'Provider already exist' });
                    return;
                }
                const newProvider = new provider({
                    name: name,
                    email: email,
                    phone: phone,
                    address: address,
                    fax: fax,
                    introduce: introduce,
                    service: service,
                    travler: travler,
                    revenue: 0,
                    prize: "",
            
                })
                    
                const newUser = new user({
                    name: name,
                    email: email,
                    password: password,
                    phone: phone,
                    address: address,
                    role: 1,
                    avatar: avatar.jpg,
                    token: 0
                });

                if(req.file){
                    newProvider.images = req.file.filename
                }
                try {
                    await newProvider.save();
                    await newUser.save();
                }
                catch(err) {
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(201).json({msg: 'success'})
            }
        });
}
exports.updaterProvider = async (req, res) => {

    upload(req, res, async function(err){
        if(err instanceof multer.MulterError){
            res.json({"kq":0,"errMsg":"A Multer error occurred when uploading."});
        } else if(err){
            res.json({"kq":0,"errMsg":"An unknown error occurred when uploading." +err});
        } else{
                if(typeof req.name === 'undefined' 
                || typeof req.body.email === 'undefined' 
                || typeof req.body.phone === 'undefined' 
                || typeof req.body.address === 'undefined' 
                || typeof req.body.fax === 'undefined' 
                || typeof req.body.introduce === 'undefined' 
                || typeof req.body.service === 'undefined' 
                || typeof req.body.travler === 'undefined' 
                || typeof req.body.revenue === 'undefined' 
                || typeof req.body.prize === 'undefined' 
                || typeof req.body.filename === 'undefined'  //hinh
            ) {
                res.status(422).json({ msg: 'Invalid data' });
                return;
            }
            let {name, email, phone, address, fax, introduce, service, travler, revenue, prize, images} = req.body;
            let providerFind;
            try {
                providerFind = await provider.findOne({ 'email': email });
            }
            catch (err) {
                console.log(err)
                res.status(500).json({ msg: err })
                return;
            }
            if (providerFind === null) {
                res.status(404).json({ msg: "Not found" })
                return;
            }
            providerFind.name = name;
            providerFind.email = email;
            providerFind.phone = phone;
            providerFind.address = address;
            providerFind.fax = fax;
            providerFind.introduce = introduce;
            providerFind.service = service;
            providerFind.travler = travler;
            providerFind.revenue = revenue;
            providerFind.prize = prize;
    
            if(req.file){
                providerFind.images = req.file.filename
            }
            else providerFind.images = images
            
            try {
                await providerFind.save()
            }
            catch(err) {
                res.status(500).json({ msg: err });
                return;
            }
            res.status(200).json({ msg: 'success', data: providerFind});
        }
    });
}

exports.deleteProvider = async (req, res) => {
    if (typeof req.params.id === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let providerFind;
    try {
        providerFind = await provider.findById(req.params.id);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: err })
        return;
    }
    providerFind.remove();
    res.status(200).json({ msg: 'success', });
}


//user
exports.addUser = async (req, res) => {
    if ((typeof req.body.name === 'undefined')
    || (typeof req.body.email === 'undefined')
    || (typeof req.body.password === 'undefined')
    || typeof req.body.phone === 'undefined'
    || typeof req.body.address === 'undefined'
 
   
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { name, email, password, phone, address, avatar, role } = req.body;
    let userFind = null;
    try {
        userFind = await user.find({ 'email': email });
    }
    catch (err) {
        res.status(500).json({ msg: err });
        console.log(1)
        return;
    }
    if (userFind.length > 0) {
        res.status(409).json({ msg: 'Email đã tồn tại !' });
        return;
    }
    password = bcrypt.hashSync(password, 10);
    const token = randomstring.generate();
    const newUser = new user({
        name: name,
        email: email,
        password: password,
        phone: phone,
        address: address,
        role: 0,
        avatar: avatar.jpg,
        token: token
    });
    try {
        await newUser.save();
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
    }
    res.status(201).json({ msg: 'success' });
} 

exports.updateUser = async (req, res) => {
    upload_user(req, res, async function(err){
        if(err instanceof multer.MulterError){
            res.json({"kq":0,"errMsg":"A Multer error occurred when uploading."});
        } else if(err){
            res.json({"kq":0,"errMsg":"An unknown error occurred when uploading." +err});
        } else{
                if ( typeof req.body.name === 'undefined'
                || typeof req.body.email === 'undefined'
                || typeof req.body.phone === 'undefined'
                || typeof req.body.address === 'undefined'
                || typeof req.body.avatar === 'undefined'
            ) {
                res.status(422).json({ msg: 'Invalid data' });
                return;
            }
            //console.log(req.body)
            let { name, email, phone, address, avatar} = req.body;
            let userFind
            try {
                userFind =  await user.findOne({'email': email})
            }
            catch(err) {
                res.status(500).json({ msg: err });
                return;
            }
            if(userFind === null) {
                res.status(422).json({ msg: "not found" });
                return;
            }
            userFind.name = name;
            userFind.phone = phone
            userFind.address = address;
            if(req.file){
                userFind.avatar = req.file.filename
            }
            else userFind.avatar = avatar
            
            try {
                await userFind.save()
            }
            catch(err) {
                res.status(500).json({ msg: err });
                return;
            }
            let token = jwt.sign({email: email}, 'shhhhh');
            res.status(200).json({msg: 'success', token: token, user: {
                name: userFind.name,
                email: userFind.email,
                phone: userFind.phone,
                address: userFind.address,
                avatar: userFind.avatar,
                id: userFind._id
            }});
        }
    });
}


exports.deleteUser = async (req, res) => {
    if (typeof req.body.email === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let userFind;
    try {
        userFind = await user.findOne({'email': req.body.email})
    }
    catch(err) {
        res.status(500).json({ msg: err });
        return;
    }
    userFind.remove();
    res.status(200).json({ msg: 'success'});
}

//category_tour
exports.addCategoryTour = async (req, res) => {
    if (typeof req.body.name === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { name } = req.body;
    let categoryFind;
    try {
        categoryFind = await category_tour.find({ 'name': name });
    }
    catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    if (categoryFind.length > 0) {
        res.status(409).json({ msg: 'Category tour already exist' });
        return;
    }
    const newCategoryTour = new category_tour({ name: name });
    try {
        await newCategoryTour.save();
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
    }
    res.status(201).json({ msg: 'success' });
}

exports.updateCategoryTour = async (req, res) => {
    if (typeof req.body.id === 'undefined'
        || typeof req.body.name === 'undefined'
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { id, name } = req.body;
    let categoryFind;
    try {
        categoryFind = await category_tour.findById(id);
    }
    catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    if (categoryFind === null) {
        res.status(422).json({ msg: "not found" });
        return;
    }
    categoryFind.name = name;
    try {
        await categoryFind.save();
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
    }
    res.status(201).json({ msg: 'success', category_tour: { name: name } });
}


exports.getAllUser = async(req, res) => {
    if(typeof req.params.page === 'undefined') {
        res.status(402).json({msg: 'Data invalid'});
        return;
    }
    let count = null;
    try { 
        count = await user.count({});
    }
    catch(err) {
        console.log(err);
        res.status(500).json({msg: err});
        return;
    }
    let totalPage = parseInt(((count - 1) / 9) + 1);
    let { page } = req.params;
    if ((parseInt(page) < 1) || (parseInt(page) > totalPage)) {
        res.status(200).json({ data: [], msg: 'Invalid page', totalPage });
        return;
    }
    user.find({})
    .skip(9 * (parseInt(page) - 1))
    .limit(9)
    .exec((err, docs) => {
        if(err) {
            console.log(err);
                    res.status(500).json({ msg: err });
                    return;
        }
        res.status(200).json({ data: docs, totalPage });
    })
}
exports.login = async (req, res) => {
    if(typeof req.body.email === 'undefined'
    || typeof req.body.password == 'undefined'){
        res.status(402).json({msg: "Invalid data"});
        return;
    }
    let { email, password } = req.body;
    let userFind = null; 
    try{
        userFind = await user.findOne({'email': email, role: { $nin: [0] }}); 
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(userFind == null){
        res.status(422).json({msg: "Invalid data"});
        return;
    }

    
    if(!bcrypt.compareSync(password, userFind.password)){
        res.status(422).json({msg: 'Invalid data'});
        return;
    }
  
    let token = jwt.sign({email: email,  iat: Math.floor(Date.now() / 1000) - 60 * 30}, 'shhhhh');
    if(userFind != null){
    res.status(200).json({msg: 'success', token: token, user: {
        name: userFind.name,
        email: userFind.email,
        address: userFind.address,
        phone: userFind.phone,
        id: userFind._id,
        role: role 
    }});
    }
   
}

exports.addTour = async (req, res) => { 
    upload_tour(req, res, async function(err){
        if(err instanceof multer.MulterError){
            res.json({"kq":0,"errMsg":"A Multer error occurred when uploading."});
        } else if(err){
            res.json({"kq":0,"errMsg":"An unknown error occurred when uploading." +err});
        } else{
            if(typeof req.file === 'undefined' 
            || typeof req.body.name_tour === 'undefined' 
            || typeof req.body.provider_id === 'undefined' 
            || typeof req.body.price === 'undefined' 
            || typeof req.body.time_start === 'undefined' 
            || typeof req.body.time_end === 'undefined' 
            || typeof req.body.description === 'undefined' 
            || typeof req.body.id_discount=== 'undefined' 
            || typeof req.body.capacity === 'undefined' 
            || typeof req.body.category_tour_id=== 'undefined' 
            || typeof req.body.place_depart === 'undefined' 
            ) {
                res.status(422).json({ msg: 'Invalid data' });
                return;
            }
            const {name_tour, provider_id, price, time_end, description,time_start, id_discount, category_tour_id, capacity,place_depart, route} = req.body;
            const newTour = new tour({
                name_tour: name_tour,
                provider_id: provider_id,
                description: description,
                time_start: time_start,
                time_end: time_end,
                price: price,
                id_discount: id_discount,
                capacity: capacity,
                place_depart: place_depart,
                category_tour_id:category_tour_id,
                route: route
            })
            if(req.file){
                newTour.image_cover = req.file.filename
            }
            try {
                await newTour.save()
         
            }
            catch(err) {
                res.status(500).json({ msg: err });
                return;
            }
            res.status(201).json({msg: 'success'})
        }
    }); 
}

exports.updateTour = async (req, res) => {  
    upload_tour(req, res, async function(err){
        if(err instanceof multer.MulterError){
            res.json({"kq":0,"errMsg":"A Multer error occurred when uploading."});
        } else if(err){
            res.json({"kq":0,"errMsg":"An unknown error occurred when uploading." +err});
        } else{
            if(typeof req.file === 'undefined' 
            || typeof req.body.name_tour === 'undefined' 
            || typeof req.body.provider_id === 'undefined' 
            || typeof req.body.price === 'undefined' 
            || typeof req.body.time_start === 'undefined' 
            || typeof req.body.time_end === 'undefined' 
            || typeof req.body.description === 'undefined' 
            || typeof req.body.id_discount=== 'undefined' 
            || typeof req.body.capacity === 'undefined' 
            || typeof req.body.category_tour_id=== 'undefined' 
            || typeof req.body.place_depart === 'undefined' 
            ) {
                res.status(422).json({ msg: 'Invalid data' });
                return;
            }
            let {name_tour, provider_id, price, time_end, description,time_start, id_discount, category_tour_id, capacity,place_depart, route} = req.body;
            let tourFind;
            try {
                tourFind = await tour.findOne({ 'name_tour': name_tour })
            }
            catch (err) {
                res.status(500).json({ msg: err });
                return;
            }
            if (tourFind === null) {
                res.status(422).json({ msg: "not found" });
                return;
            }
          
            tourFind.name_tour = name_tour;
            tourFind.provider_id = provider_id;
            tourFind.description = description;
            tourFind.time_start = time_start;
            tourFind.time_end = time_end;
            tourFind.price = price;
            tourFind.id_discount = id_discount;
            tourFind.capacity = capacity;
            tourFind.place_depart = place_depart;
            tourFind.category_tour_id =category_tour_id;
            tourFind.route = route;
    
            if(req.file){
                tourFind.image_cover = req.file.filename
            }
            else tourFind.image_cover = image_cover
            
            try {
                await tourFind.save()
            }
            catch(err) {
                res.status(500).json({ msg: err });
                return;
            }
            res.status(200).json({ msg: 'success'});
        }
    });

}


exports.deleteTour= async (req, res) => {
    if (typeof req.body.id === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let tourFind;
    try {
        tourFind = await tour.findOne({ _id: req.params.id});
    }
    catch(err) {
        res.status(500).json({ msg: err });
        return;
    }
    tourFind.remove();
    res.status(200).json({ msg: 'success'});
}


//blog
exports.addCategoryBlog = async (req, res) => {
    if (typeof req.body.name === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { name } = req.body;
    let categoryBlogFind;
    try {
        categoryBlogFind = await category_blog.find({ 'name': name });
    }
    catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    if (categoryBlogFind.length > 0) {
        res.status(409).json({ msg: 'Category blog already exist' });
        return;
    }
    const newCategoryBlog = new category_blog({ name: name });
    try {
        await newCategoryBlog.save();
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
    }
    res.status(201).json({ msg: 'success' });
}

exports.updateCategoryBlog = async (req, res) => {
    if (typeof req.body.id === 'undefined'
        || typeof req.body.name === 'undefined'
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { id, name } = req.body;
    let categoryBlogFind;
    try {
        categoryBlogFind = await category_blog.findById(id);
    }
    catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    if (categoryBlogFind === null) {
        res.status(422).json({ msg: "not found" });
        return;
    }
    categoryBlogFind.name = name;
    try {
        await categoryBlogFind.save();
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
    }
    res.status(201).json({ msg: 'success', category_blog: { name: name } });
}

//contact
exports.getContact = (req, res) => {
    contact.find({}, (err, docs) => {
        if(err) {
            console.log(err)
        }
        res.status(200).json({data: docs})
    })
}

