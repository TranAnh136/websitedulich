const booking = require('../models/booking.model');

//thanh toán
exports.addBooking = async (req, res) => {
    if (
      typeof req.body.user_id === "undefined" ||
      typeof req.body.tour_id === "undefined" ||
      typeof req.body.name_user_booking === "undefined" ||
      typeof req.body.email_user_booking === "undefined" ||
      typeof req.body.phone_user_booking === "undefined" ||
      typeof req.body.address_user_booking === "undefined" ||
      typeof req.body.total_price === "undefined" ||
      typeof req.body.number_of_customer === "undefined" ||
      typeof req.body.token === "undefined" ||
      typeof req.body.list_customer === "undefined" 
    ) {
      res.status(422).json({ msg: "Invalid data" });
      return;
    }
    const {
      user_id,
      tour_id,
      name_user_booking,
      email_user_booking,
      phone_user_booking,
      address_user_booking,
      total_price,
      number_of_customer,
      payment_methods,
      list_customer,
      token,
      note
    } = req.body;
   
   /* let sendEmail = await nodemailer.sendMailConfirmPayment(email_user_booking, token);
    if (!sendEmail) {
      res.status(500).json({ msg: "Send email fail" });
      return;
    }*/
    const addBooking  = new booking({
      user_id : user_id,
      tour_id : tour_id,
      name_user_booking : name_user_booking,
      email_user_booking : email_user_booking,
      phone_user_booking : phone_user_booking,
      address_user_booking : address_user_booking,
      total_price : total_price,
      number_of_customer : number_of_customer,
      payment_methods : payment_methods,
      list_customer : list_customer,
      token : token,
      note : note,
      status_booking : 'Chờ thanh toán'

    });
     try {
      addBooking.save();
    } catch (err) {
      res.status(500).json({ msg: err });
      console.log("save booking fail");
      return;
    }
    res.status(201).json({ msg: "success" });
  };

  exports.getBookingByToken = async (req, res) => {
    if (req.params.token === 'undefined') {
        res.status(422).json({ msg: 'Invalid data' });
        return;
    }
    booking.findOne({token :req.params.token }, (err, docs) => {
      if(err) {
          console.log(err)
      }
      res.status(200).json({data: docs})
  })
}