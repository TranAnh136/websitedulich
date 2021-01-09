
const province = require('../models/province.model');

exports.getAllProvince = async (req, res) => {
   province.find({}, (err, docs) => {
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

exports.getNameByID = async (req, res) => {
    if(req.params.id === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    console.log(req.params.id)
    let result
    try {
        result = await province.findById(req.params.id);
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