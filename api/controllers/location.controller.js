'use strict'
const location = require('../models/location.model');

exports.getAllLocation = async (req, res) => {
    province.find({}, (err, docs) => {
        if(err){
            res.status(500).json({msg: err});
            return;
        }
        let data = [];
        for(let i = 0; i < docs.length; i++) {
            data.push({name_province: docs[i].name_province, province_id: docs[i].province_id})
        }
        res.status(200).json({data: data})
    })
}
