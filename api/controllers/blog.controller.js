'use strict'
const blog = require('../models/blog.model');


exports.getTotalPage = (req, res) => {
    blog.find({}, (err, docs) => {
        if (err) {
            console.log(err);
            res.status(500).json({ msg: err });
            return;
        }
        res.status(200).json({ data: parseInt((docs.length - 1) / 9) + 1 })
    })
}


exports.getAllBlog = async (req, res) => {
    if ((typeof req.body.page === 'undefined')) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let blogCount
    try {
         blogCount = await blog.countDocuments();
    }
    catch (err) {
        res.status(500).json({ msg: err });
        return;
    }
    let totalPage = parseInt(((blogCount - 1) / 6) + 1);
    let { page } = req.body;
    
    if ((parseInt(page) < 1) ) {
        res.status(200).json({ data: [], msg: 'Invalid page', totalPage });
        return;
    }
    //Lay du lieu
        blog
            .find({})
            .skip(6 * (parseInt(page) - 1))
            .limit(6)
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs, totalPage });
            });
}

exports.getNewPost =  (req, res) => {
    //Lay du lieu
        blog
            .find({})
            .limit(3)
            .sort({ date_post: -1})
            .exec((err, docs) => {
                if (err) {
                    console.log(err);
                    res.status(500).json({ msg: err });
                    return;
                }
                res.status(200).json({ data: docs});
            });
}

exports.getBlogByID = async (req, res) => {
    if (req.params.id === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let result
    try {
        result = await blog.findById(req.params.id);
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

exports.getBlogRelated = async (req, res) => {
    if (typeof req.params.id === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let { id } = req.params;
    let blogObj = null;
    try {
        blogObj = await blog.findById(id);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: err })
        return;
    }
    if (blogObj === null) {
        res.status(200).json({ data: [], msg: 'Invalid tourId' });
        return;
    }
    blog
        .find({ _id: { $nin: [id] }})
        .limit(2)
        .sort({ date_post: -1 })
        .exec((err, docs) => {
            if (err) {
                console.log(err);
                res.status(500).json({ msg: err });
                return;
            }
            res.status(200).json({ data: docs });
        });
}


