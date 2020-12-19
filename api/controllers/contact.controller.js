const contact = require('../models/contact.model');

exports.addContact = async (req, res) => {  
    if( typeof req.body.name_contact === 'undefined' 
    || typeof req.body.phone_contact === 'undefined' 
    || typeof req.body.email_contact === 'undefined' 
    || typeof req.body.messages === 'undefined' 
    ) {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    const {name_contact, phone_contact, email_contact, messages} = req.body;

    const newContact = new contact({
        name_contact: name_contact,
        phone_contact: phone_contact,
        email_contact: email_contact,
        messages: messages
    })
try{
    newContact.save()
}
catch(err) {
    res.status(500).json({msg: 'server error'});
    return;
}

res.status(201).json({msg: 'success'})

}