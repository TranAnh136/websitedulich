'use strict'
const tour = require('../models/tour.model');
const tour_design = require('../models/tour_design.model');
const providerController = require('../controllers/provider.controller');
const categoryTourController = require('../controllers/category_tour.controller');


exports.getTotalPage = (req, res) => {
    tour.find({}, (err, docs) => {
        if (err) {
            console.log(err);
            res.status(500).json({ msg: err });
            return;
        }
        res.status(200).json({ data: parseInt((docs.length - 1) / 9) + 1 })
    })
}

//tìm kiếm tour
exports.getNameTourBySearchText = async(req, res) => {
    if(req.params.search === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let result
    try {
        result = await tour.findByName(req.params.search);
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
    res.status(200).json({name_tour: result.name_tour})
}

exports.getAllTour = async (req, res) => {
    if ((typeof req.body.page === 'undefined')) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    //Khoang gia
 /*   let range = null;
    let objRange = null;
    if (typeof req.body.range !== 'undefined') {
        range = req.body.range;
        //objRange = JSON.parse(range);
        objRange = range;
    }
    //Search Text*/
    let searchText = "";
    if (typeof req.body.searchtext !== 'undefined') {
        searchText = req.body.searchtext;
    }
    let datedepart = null;
    if (typeof req.body.datedepart !== 'undefined') {
        datedepart = req.body.datedepart;
    }
    /*let searchProvider = null;
    searchProvider = await providerController.getIDBySearchText(searchText);
    let searchCategory = null;
    searchCategory = await categoryTourController.getIDBySearchText(searchText);
    //Sap xep
    let sortType = "time_start";
    let sortOrder = "-1";
    if (typeof req.body.sorttype !== 'undefined') {
        sortType = req.body.sorttype;
    }
    if (typeof req.body.sortorder !== 'undefined') {
        sortOrder = req.body.sortorder;
    }
    if ((sortType !== "price")
        && (sortType !== "time_start")
        && (sortType !== "capaity")) {
        res.status(422).json({ msg: 'Invalid sort type' });
        return;
    }
    if ((sortOrder !== "1")
        && (sortOrder !== "-1")) {
        res.status(422).json({ msg: 'Invalid sort order' });
        return;
    }*/
    //Trang va tong so trang
    let tourCount = null;
    try {
        if(datedepart !== null){
            tourCount = await tour.countDocuments({name_tour : new RegExp(searchText, "i"), time_start :{$gte: datedepart }});
        }
        else{
            tourCount = await tour.countDocuments({name_tour : new RegExp(searchText, "i")});
        }
        
    }
    catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    let totalPage = parseInt(((tourCount - 1) / 9) + 1);
    let { page } = req.body;
    console.log("Tổng trang: " + totalPage)
    if ((parseInt(page) < 1) ) {
        res.status(200).json({ data: [], msg: 'Invalid page', totalPage });
        return;
    }
    //De sort
    //let sortQuery = {}
   // sortQuery[sortType] = sortOrder;
    //Lay du lieu
    if(datedepart !== null){
        tour
            .find({name_tour : new RegExp(searchText, "i"), time_start :{$gte: datedepart },is_discount: false})
            .skip(9 * (parseInt(page) - 1))
            .limit(9)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage });
            });
    }
    else{
        tour
            .find({name_tour : new RegExp(searchText, "i"),is_discount: false})
            .skip(9 * (parseInt(page) - 1))
            .limit(9)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage });
            });
    }
        
}

exports.getTourHome =  (req, res) => {
         tour
            .find({is_discount: false})
            .limit(8)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs});
            });

    
}

exports.getTourDiscount =  (req, res) => {
    //Lay du lieu
        tour
            .find({is_discount: true})
            .limit(3)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs});
            });
}

exports.getTourByProvider= async (req, res) => {
    if ((typeof req.body.page === 'undefined')
        || (typeof req.body.id === 'undefined')) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { id, page } = req.body;
    //Khoang gia
    let range = null;
    let objRange = null;
    if (typeof req.body.range !== 'undefined') {
        range = req.body.range;
        //objRange = JSON.parse(range);
        objRange = range;
    }
    //Search Text
    let searchText = "";
    if (typeof req.body.searchtext !== 'undefined') {
        searchText = req.body.searchtext;
    }
    //Sap xep
    let sortType = "time_start";
    let sortOrder = "-1";
    if (typeof req.body.sorttype !== 'undefined') {
        sortType = req.body.sorttype;
    }
    if (typeof req.body.sortorder !== 'undefined') {
        sortOrder = req.body.sortorder;
    }
    if ((sortType !== "price")
        && (sortType !== "time_start")
        && (sortType !== "capacity")) {
        res.status(422).json({ msg: 'Invalid sort type' });
        return;
    }
    if ((sortOrder !== "1")
        && (sortOrder !== "-1")) {
        res.status(422).json({ msg: 'Invalid sort order' });
        return;
    }
    //Trang va tong so trang
    let tourCount = null;
    try {
        if (range !== null) {
            tourCount = await tour
                .count({ name_tour: new RegExp(searchText, "i"), provider_id: id, price: { $gte: objRange.low, $lte: objRange.high } });
        }
        else {
            tourCount = await tour.count({ name_tour: new RegExp(searchText, "i"), provider_id: id });
        }
    }
    catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    let totalPage = parseInt(((tourCount - 1) / 9) + 1);
    if ((parseInt(page) < 1) || (parseInt(page) > totalPage)) {
        res.status(200).json({ data: [], msg: 'Invalid page', totalPage });
        return;
    }
    //De sort
    let sortQuery = {}
    sortQuery[sortType] = sortOrder;
    //Lay du lieu
    if (range !== null) {
        tour
            .find({ name_tour: new RegExp(searchText, "i"), provider_id: id, price: { $gte: objRange.low, $lte: objRange.high } })
            .skip(9 * (parseInt(page) - 1))
            .limit(9)
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage });
            });
    }
    else {
        tour
            .find({ name: new RegExp(searchText, "i"), provider_id: id })
            .skip(9 * (parseInt(page) - 1))
            .limit(9)
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage });
            });
    }
}

exports.getTourByCategory = async (req, res) => {
    if (typeof req.body.id === 'undefined'
        || typeof req.body.page === 'undefined'
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { id, page } = req.body;
    //Khoang gia
    let range = null;
    let objRange = null;
    console.log(req.body.range)
    if (typeof req.body.range !== 'undefined') {
        range = req.body.range;
        objRange = range;
    }
    //Kiem tra text
    let searchText = "";
    if (typeof req.body.searchtext !== 'undefined') {
        searchText = req.body.searchtext;
    }
    //Sap xep
    let sortType = "time_start";
    let sortOrder = "-1";
    if (typeof req.body.sorttype !== 'undefined') {
        sortType = req.body.sorttype;
    }
    if (typeof req.body.sortorder !== 'undefined') {
        sortOrder = req.body.sortorder;
    }
    if ((sortType !== "price")
        && (sortType !== "time_start")
        && (sortType !== "capacity")) {
        res.status(422).json({ msg: 'Invalid sort type' });
        return;
    }
    if ((sortOrder !== "1")
        && (sortOrder !== "-1")) {
        res.status(422).json({ msg: 'Invalid sort order' });
        return;
    }
    //Tinh tong so trang
    let tourCount, tourFind;
    try {
        if (range === null) {
            tourFind = await tour.find({ category_tour_id: id, name_tour: new RegExp(searchText, "i") });
        } else {
            tourFind = await tour.find({ category_tour_id: id, name_tour: new RegExp(searchText, "i"), price: { $gte: objRange.low, $lte: objRange.high } });
        }
    }
    catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    tourCount = tourFind.length;
    let totalPage = parseInt(((tourCount - 1) / 9) + 1);
    if (parseInt(page) < 1 || parseInt(page) > totalPage) {
        res.status(200).json({ data: [], msg: 'Invalid page', totalPage: totalPage });
        return;
    }
    //De sort
    let sortQuery = {}
    sortQuery[sortType] = sortOrder;
    //Lay du lieu
    if (range === null) {
        tour.find({ category_tour_id: id, name_tour: new RegExp(searchText, "i") })
            .limit(9)
            .skip(9 * (page - 1))
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage: totalPage });
            })
    } else {
        tour.find({ category_tour_id: id, name_tour: new RegExp(searchText, "i"), price: { $gte: objRange.low, $lte: objRange.high } })
            .limit(9)
            .skip(9 * (page - 1))
            .sort(sortQuery)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage: totalPage });
            })
    }
}



exports.getTourByID = async (req, res) => {
    if (req.params.id === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let result
    try {
        result = await tour.findById(req.params.id);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: err })
        return;
    }
    if (result === null) {
        try {
             result = await tour_design.findById(req.params.id)
        } catch (error) {
            console.log(err)
            res.status(500).json({ msg: err })
            return;
        }
       if(result === null){
           res.status(404).json({ msg: "not found" })
        return;
       }
        
    }
    
    result.save((err, docs) => {
        if (err) {
            console.log(err);
        }
    });
    res.status(200).json({ data: result })
}

exports.getRelatedTour = async (req, res) => {
    if (typeof req.params.tourId === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { tourId } = req.params;
    let tourObj = null;
    try {
        tourObj = await tour.findById(tourId);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: err })
        return;
    }
    if (tourObj === null) {
        res.status(200).json({ data: [], msg: 'Invalid tourId' });
        return;
    }
    tour
        .find({ $or: [{ $and: [{ category_tour_id: tourObj.category_tour_id }, { _id: { $nin: [tourId] } }] }, { $and: [{ provider_id: tourObj.provider_id }, { _id: { $nin: [tourId] } }] }] })
        .limit(4)
        .sort({ time_start: -1 })
        .exec((err, docs) => {
            if (err) {
                console.log(err);
                res.status(500).json({ msg: err });
                return;
            }
            res.status(200).json({ data: docs });
        });
}

