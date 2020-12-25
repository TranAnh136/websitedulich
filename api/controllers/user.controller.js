'use strict'
const user = require('../models/user.model');
const nodemailer = require('../utils/nodemailer');
const randomstring = require('randomstring');
const bcrypt = require('bcrypt');
const util = require("util");
const multer = require("multer");
const jwt = require('jsonwebtoken');
const otp = require('../utils/otp');
const tour_design = require('../models/tour_design.model');
const booking = require('../models/booking.model');
//luu hinh
    // var storage = new GridFsStorage({
    //     url: "mongodb://localhost:27017/bezkoder_files_db",
    //     options: { useNewUrlParser: true, useUnifiedTopology: true },
    //     file: (req, file) => {
    //       const match = ["image/png", "image/jpeg","image/jpg"];
      
    //       if (match.indexOf(file.mimetype) === -1) {
    //         const filename = `${Date.now()}-bezkoder-${file.originalname}`;
    //         return filename;
    //       }
      
    //       return {
    //         bucketName: "photos",
    //         filename: `${Date.now()}-bezkoder-${file.originalname}`
    //       };
    //     }
    //   });
      
    //   var uploadFile = multer({ storage: storage }).single("avatar"); //name cua muc input file
    //   var uploadFilesMiddleware = util.promisify(uploadFile);
    //   module.exports = uploadImage;


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
    
exports.register = async (req, res) => {
    if ((typeof req.body.name === 'undefined')
        || (typeof req.body.email === 'undefined')
        || (typeof req.body.password === 'undefined')
        || typeof req.body.phone === 'undefined'
        || typeof req.body.address === 'undefined'
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { name, email, password, phone, address} = req.body;
    if (email.indexOf("@")=== -1 && email.indexOf('.') === -1 
        || password.length < 6 ){
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let userFind = null;
    try {
        userFind = await user.find({ 'email': email });
    }
    catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    if (userFind.length > 0) {
        res.status(409).json({ msg: 'Email already exist' }); 
        return;
    }
    const token = randomstring.generate();
  //  let sendEmail = await nodemailer.sendEmail(email, token);
 //   if (!sendEmail) {
 //       res.status(500).json({ msg: 'Send email fail' });
  //      return;
 //   }   
    password = bcrypt.hashSync(password, 10);
    const newUser = new user({
        name: name,
        email: email,
        password: password,
        phone: phone,
        address: address,
        role: 0,
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
    res.status(201).json({ msg: 'success' })
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

exports.login = async (req, res) => {
    if(typeof req.body.email === 'undefined'
    || typeof req.body.password == 'undefined'){
        res.status(402).json({msg: "Invalid data"});
        return;
    }
    let { email, password } = req.body;
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
    
    if(!bcrypt.compareSync(password, userFind.password)){
        res.status(422).json({msg: 'Invalid data'});
        return;
    }
    let token = jwt.sign({email: email,  iat: Math.floor(Date.now() / 1000) - 60 * 30}, 'shhhhh');
    res.status(200).json({msg: 'success', token: token, user: {
        name: userFind.name,
        email: userFind.email,
        phone: userFind.phone,
        address: userFind.address,
        avatar: userFind.avatar,
        id: userFind._id
    }});
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

exports.updateInfor = async (req, res) => {
    if ( typeof req.body.name === 'undefined'
        || typeof req.body.email === 'undefined'
        || typeof req.body.phone === 'undefined'
        || typeof req.body.address === 'undefined'
        || typeof req.body.avatar === 'undefined'
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    
    let { name, email, phone, address, avatar} = req.body;
    let userFind
    try {
        userFind = await user.findOne({'email': email})
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
    upload(req, res, function(err){
        if(err instanceof multer.MulterError){
            res.json({"kq":0,"errMsg":"A Multer error occurred when uploading."});
        } else if(err){
            res.json({"kq":0,"errMsg":"An unknown error occurred when uploading." +err});
        } else{
            userFind.avatar = req.file.filename;
        }
    });

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
        phoner: userFind.phone,
        address: userFind.address,
        avatar: userFind.avatar,
        id: userFind._id
    }});
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

exports.showProfile =  (req, res) => {
  
    try{
        userFind = user.findOne({'user_id': user_id});
        return res.user;
    }
    catch(err){
        res.json({msg: err});
        return;
    }
   
}

//thiet ke 1 tour moi
exports.CreateNewTourDesign = async (req, res) => {
    if ( typeof req.body.user_id === "undefined"
        || typeof req.body.name_tour === 'undefined'
        || typeof req.body.provider_id === 'undefined'
        || typeof req.body.description === 'undefined'
        || typeof req.body.start_time === 'undefined'
        || typeof req.body.end_time === 'undefined'
        || typeof req.body.price === 'undefined'
        || typeof req.body.place_depart === 'undefined'
        || typeof req.body.messages === 'undefined'
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }

    const {
        user_id,
        name_tour,
        provider_id,
        description,
        start_time,
        end_time,
        price,
        place_depart,
        messages,
        route
      } = req.body;
      try {
        userFind = await user.findOne({ user_id: user_id });
      } catch (err) {
        console.log("error ", err);
        res.status(500).json({ msg: err });
        return;
      }
      if (userFind === null) {
        res.status(404).json({ msg: "user not found" });
        return;
      }
    const userTour = new tour_design({
        user_id: user_id,
        name_tour: name_tour,
        provider_id: provider_id,
        description: description,
        start_time: start_time,
        end_time: end_time,
        price : price,
        place_depart: place_depart,
        messages: messages,
        status: false,
        route: route

    })
    try{
        userTour.save();
    }
    catch(err){
        res.status(500).json({ msg: err });
        console.log("create fail");
        return;
    }
    res.status(201).json({ msg: "success" });
   
}

//lich su dat tour
exports.getHistoryByUser = async (req, res) => {
    if (typeof req.params.user_id === "undefined") {
        res.status(402).json({ msg: "data invalid" });
        return;
      }
      let historyBooking = null;
   
      try {
        historyBooking = await booking
          .find({ user_id: req.params.user_id })
        //   .sort({ date: -1 });
      } catch (err) {
        console.log(err);
        res.status(500).json({ msg: "Server error" });
        return;
      }
      res.status(200).json({ data: historyBooking });
   
}

//xem tour da thiet ke
exports.showTourDesign = async (req, res) => {
   
      try {
        userFind = await tour_design.findOne({ user_id: user_id });
      } catch (err) {
        console.log("error ", err);
        res.status(500).json({ msg: err });
        return;
      }
      if (userFind === null) {
        res.status(404).json({ msg: "user not found" });
        return;
      }
    
    try{
        return req.tour_design;
    }
    catch(err){
        res.status(500).json({ msg: err });
        console.log("return tour_design fail");
        return;
    }
   
} 





