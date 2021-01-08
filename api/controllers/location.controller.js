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

exports.addLocation = async (req, res) => {
    if ((typeof req.body.name_location === 'undefined')
    || (typeof req.body.province_id === 'undefined'))
    {
    res.status(422).json({ msg: 'Invalid data' });
    return;
}
let { name_location, province_id} = req.body;

let locationFind = null;
try {
    locationFind = await location.find({ 'name_location': name_location });
}
catch (err) {
    res.status(500).json({ msg: err });
    return;
}
if (locationFind.length > 0) {
    res.status(409).json({ msg: 'Địa danh đã tồn tại' }); 
    return;
}

const newLocation = new location({
    name_location: name_location,
    province_id: province_id
});
try {
    await newLocation.save();
}
catch (err) {
    console.log(err);
    res.status(500).json({ msg: err });
    return;
}
res.status(201).json({ msg: 'success' })
}

exports.updateLocation =  (req, res) => {

    
            if ( typeof req.body.name_location === 'undefined'
            || typeof req.body.province_id === 'undefined')
            {
            res.status(422).json({ msg: 'Invalid data' });
            return;
            }
     
            let { name_location, province_id} = req.body;
            let locationFind
            try {
                locationFind =  await location.findOne({'name_location':name_location})
            }
            catch(err) {
                res.status(500).json({ msg: err });
                return;
            }
            if(locationFind === null) {
                res.status(422).json({ msg: "not found" });
                return;
            }
            locationFind.name_location = name_location;
            userFind.province_id = province_id
           
            
            try {
                await locationFind.save()
            }
            catch(err) {
                res.status(500).json({ msg: err });
                return;
            }
            
            res.status(200).json({msg: 'success'});
}

exports.deleteLocation = async (req, res) => {
    if (typeof req.params.id === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    let locationFind;
    try {
        locationFind = await location.findById(req.params.id);
    }
    catch (err) {
        console.log(err)
        res.status(500).json({ msg: err })
        return;
    }
    locationFind.remove();
    res.status(200).json({ msg: 'success', });
}
