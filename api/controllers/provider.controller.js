'use strict'

var mongodb = require('mongodb');
var MongoClient = require('mongodb').MongoClient;  // connect online
var uri = "mongodb+srv://admin:admin@cluster0.v7yzg.mongodb.net/webdulich?retryWrites=true&w=majority"; // connect online

const provider = require('../models/provider.model');
const tour = require('../models/tour.model');
const tour_design = require('../models/tour_design.model');
const user = require('../models/user.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const multer = require("multer");


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'public/upload') //noi luu hinh tu set lai
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
}).single("avatar"); //ten cua muc upload hinh

//chap nhan tour design tu nguoi dung
exports.acceptTourDesign= async(req,res) =>{
    if ( typeof req.body.user_id === "undefined"
        || typeof req.body.name_tour === 'undefined'
        || typeof req.body.provider_id === 'undefined'
        || typeof req.body.description === 'undefined'
        || typeof req.body.time_start === 'undefined'
        || typeof req.body.time_end === 'undefined'
        || typeof req.body.price === 'undefined'
        || typeof req.body.place_depart === 'undefined'
        || typeof req.body.messages === 'undefined'
        || typeof req.body.route === 'undefined'
        || typeof req.body.id === 'undefined'
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    
    let {id, user_id, name_tour, provider_id, description, time_start, time_end, price, place_depart, messages, route} = req.body;
    let tourDesignFind
    try {
        tourDesignFind = await tour_design.findOne({'_id': id})
    }
    catch(err) {
        res.status(500).json({ msg: err });
        return;
    }
    if(tourDesignFind === null) {
        res.status(422).json({ msg: "not found" });
        return;
    }
    let oldRoute  = tourDesignFind.route;
    let newRoute = []
    for(let i = 0 ; i< oldRoute.length ;  i++){
        objRoute = {
            ...oldRoute[i],
            "date_happen" : route[i].date_happen,
            "title" : route[i].title,
            "description" : route[i].description
        }
        newRoute.push(objRoute)
    }
    tourDesignFind.user_id = user_id;
    tourDesignFind.name_tour = name_tour;
    tourDesignFind.provider_id = provider_id;
    tourDesignFind.description = description;
    tourDesignFind.time_start = time_start;
    tourDesignFind.time_end = time_end;
    tourDesignFind.price = price;
    tourDesignFind.place_depart = place_depart;
    tourDesignFind.messages = messages;
    tourDesignFind.status = true;
    tourDesignFind.confirm = true;
    tourDesignFind.route = newRoute

    try {
        await tourDesignFind.save()
    }
    catch(err) {
        res.status(500).json({ msg: err });
        return;
    }
    res.status(201).json({ msg: "success" });
} 

exports.rejectTourDesign = async (req, res) => {
    if (  typeof req.body.id === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let tourDesignFind
    try {
        tourDesignFind = await tour_design.findOne({'_id': req.body.id})
    }
    catch(err) {
        res.status(500).json({ msg: err });
        return;
    }
    if(tourDesignFind === null) {
        res.status(422).json({ msg: "not found" });
        return;
    }
    tourDesignFind.status = true;
    tourDesignFind.confirm = false;
    try {
        await tourDesignFind.save()
    }
    catch(err) {
        res.status(500).json({ msg: err });
        return;
    }
    res.status(201).json({ msg: "success" });
}

exports.getProvider = (req, res) => {
    provider.find({}, (err, docs) => {
        if(err) {
            console.log(err)
        }
        res.status(200).json({data: docs})
    })
}

exports.showProfileProvider = async (req, res) => {
  
    if (req.params.id === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let result
    try {
        result = await provider.findById(req.params.id);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: err })
        return;
    }
    if (result === null) {
        res.status(404).json({ msg: "not found" })
        return;
    }
    
    result.save((err, docs) => {
        if (err) {
            console.log(err);
        }
    });
    res.status(200).json({ data: result })
   
}

exports.getAll = async (req, res) => {
    if(typeof req.params.page === 'undefined') {
        res.status(402).json({msg: 'Data invalid'});
        return;
    }
    let count = null;
    try {
        count = await provider.count({});
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
    provider.find({})
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

exports.getNameByID = async (req, res) => {
    if(req.params.id === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    console.log(req.params.id)
    let result
    try {
        result = await provider.findById(req.params.id);
    }
    catch(err) {
        console.log(err)
        res.status(500).json({msg: err})
        return;
    }
    if(result === null){
        res.status(404).json({msg: "not found"})
        return;
    }
    res.status(200).json({name: result.name})
}

exports.getProviderById = async (req, res) => {
    if(req.params.id === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let result
    try {
        result = await provider.findById(req.params.id);
    }
    catch(err) {
        console.log(err)
        res.status(500).json({msg: err})
        return;
    }
    if(result === null){
        res.status(404).json({msg: "not found"})
        return;
    }
    res.status(200).json({data: result})
}

exports.getIDBySearchText = async (searchText) => {
    let arr = [];
    try {
        arr = await provider
            .find({name: new RegExp(searchText, "i")},{name: 0})
    }
    catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    return arr.map(i => i.id);
}

//hien thi tour theo provider
exports.getTourByProvider = async (req, res) => {
    if(req.params.provider_id === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let providerFind
    try{
        providerFind = await tour.findById(provider_id);
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if ( providerFind === null) {
        res.status(404).json({ msg: "Not found" })
        return;
    }
}

exports.login = async (req, res) => {
    if(typeof req.body.email === 'undefined'
    || typeof req.body.password == 'undefined'){
        res.status(402).json({msg: "Invalid data"});
        return;
    }
    let { email, password } = req.body;
    let userFind = null; //role =1 for provider
    try{
        userFind = await user.findOne({'email': email, 'role': 1});
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
        phoner: userFind.phone,
        id: userFind._id }});
    }
   
}

exports.requestForgotPassword = async (req, res) => {
    if(typeof req.params.email === 'undefined'){
        res.json({msg: "Invalid data"});
        return;
    }   
    let email = req.params.email;
    let userFind = null;
    try{
        userFind = await user.findOne({'email': email});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(userFind == null) {
        res.status(422).json({msg: "Invalid data"});
    }
    if(!userFind.is_verify){
        res.status(401).json({msg: 'no_registration_confirmation'});
        return;
    }
    let token = otp.generateOTP();
    let sendEmail = await nodemailer.sendEmailForgotPassword(email, token);
    if (!sendEmail) {
        res.status(500).json({ msg: 'Send email fail' });
        return;
    }   
    userFind.token = token;
    try {
        await userFind.save();
    }
    catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    res.status(201).json({ msg: 'success', email: email })
}

exports.verifyForgotPassword = async (req, res) => {
    if(typeof req.body.email === 'undefined'
    || typeof req.body.otp === 'undefined'){
        res.status(402).json({msg: "Invalid data"});
        return;
    }

    let { email, otp } = req.body;
    let userFind = null;
    try{
        userFind = await user.findOne({'email': email});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(userFind == null){
        res.status(422).json({msg: "Invalid data"});
        return;
    }
    if(userFind.token != otp) {
        res.status(422).json({msg: "OTP fail"});
        return;
    }
    res.status(200).json({msg: "success", otp: otp});
}

exports.forgotPassword = async (req, res) => {
    if(typeof req.body.email === 'undefined'
    || typeof req.body.otp === 'undefined'
    || typeof req.body.newPassword === 'undefined'){
        res.status(402).json({msg: "Invalid data"});
        return;
    }
    let { email, otp, newPassword } = req.body;
    let userFind = null;
    try{
        userFind = await user.findOne({'email': email});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(userFind == null){
        res.status(422).json({msg: "Invalid data"});
        return;
    }
    if(userFind.token != otp) {
        res.status(422).json({msg: "OTP fail"});
        return;
    }

    userFind.password = bcrypt.hashSync(newPassword, 10);
    try {
        await userFind.save();
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ msg: err });
        return;
    }
    res.status(201).json({ msg: 'success' })
}

exports.updatePassword = async (req, res) => {
    if ( typeof req.body.oldpassword === 'undefined'
        || typeof req.body.newpassword === 'undefined'
        || typeof req.body.email === 'undefined'
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { email, oldpassword, newpassword } = req.body;
    let userFind = null;
    try{
        userFind = await user.findOne({'email': email});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(userFind == null){
        res.status(422).json({msg: "Invalid data"});
        return;
    }
    if(!bcrypt.compareSync(oldpassword, userFind.password)){
        res.status(422).json({msg: 'Invalid data'});
        return;
    }
    userFind.password = bcrypt.hashSync(newpassword, 10);
    try {
        await userFind.save()
    }
    catch(err) {
        res.status(500).json({ msg: err });
        return;
    }
    res.status(200).json({msg: 'success'});
}

exports.verifyAccount = async (req, res) => {
    if(typeof req.params.token === 'undefined'){
        res.status(402).json({msg: "!invalid"});
        return;
    }
    let token = req.params.token;
    let tokenFind = null;
    try{
        tokenFind = await user.findOne({'token': token});
    }
    catch(err){
        res.status(500).json({msg: err});
        return;
    }
    if(tokenFind == null){
        res.status(404).json({msg: "not found!!!"});
        return;
    }
    try{
        await user.findByIdAndUpdate(tokenFind._id ,
            { $set: { is_verify: true }}, { new: true });
    }
    catch(err){
        res.status(500).json({msg: err});
        return;
    }
    res.status(200).json({msg:"success!"});
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

exports.getAllTourDesign = async(req, res) => {
    if(typeof req.params.page === 'undefined'
    || typeof req.body.id === 'undefined') {
        res.status(402).json({msg: 'Data invalid'});
        return;
    }
    let count = null;
    try { 
        count = await tour_design.count({'provider_id' : provider_id});
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
    tour_design.find({'provider_id' : provider_id})
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

exports.getProviderId = async (req, res) => {
    if(typeof req.params.id === 'undefined'){
        res.status(402).json({msg: "Invalid data"});
        return;
    }
    let providerFind = null;
    try{
        providerFind = await provider.findOne({'account_id': id});
    }
    catch(err){
        res.json({msg: err});
        return;
    }
    if(providerFind == null){
        res.status(422).json({msg: "Not found"});
        return;
    }
    else{
        res.status(200).json({id : providerFind._id})
    }
   
}