'use strict'
const location = require('../models/location.model');

exports.getAllLocation = async (req, res) => {
    location.find({}, (err, docs) => {
        if(err){
            res.status(500).json({msg: err});
            return;
        }
        let data = [];
        for(let i = 0; i < docs.length; i++) {
            data.push(docs[i])
        }
        res.status(200).json({data: data})
    })
}
