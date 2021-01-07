
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