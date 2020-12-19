const booking = require('../models/booking.model');

//thanh toán
exports.addPayment = async (req, res) => {
    if (
      typeof req.body.user_id === "undefined" ||
      typeof req.body.date_booking === "undefined" ||
      typeof req.body.tour_id === "undefined" ||
      typeof req.body.name_user_booking === "undefined" ||
      typeof req.body.email_user_booking === "undefined" ||
      typeof req.body.phone_user_booking === "undefined" ||
      typeof req.body.address_user_booking === "undefined" ||
      typeof req.body.total_price === "undefined" ||
      typeof req.body.number_of_customer === "undefined"
    ) {
      res.status(422).json({ msg: "Invalid data" });
      return;
    }
    const {
      user_id,
      date_booking,
      tour_id,
      name_user_booking,
      email_user_booking,
      phone_user_booking,
      address_user_booking,
      total_price,
      number_of_customer,
      note
    } = req.body;
    var bookingFind = null;
    try {
      bookingFind = await booking.findOne({ user_id: user_id });
    } catch (err) {
      console.log("error ", err);
      res.status(500).json({ msg: err });
      return;
    }
    if (bookingFind === null) {
      res.status(404).json({ msg: "user not found" });
      return;
    }
    const token = randomstring.generate();
    let sendEmail = await nodemailer.sendMailConfirmPayment(email, token);
    if (!sendEmail) {
      res.status(500).json({ msg: "Send email fail" });
      return;
    }
    const addBooking  = new booking({
      user_id: user_id,
      date_booking: date_booking,
      tour_id: tour_id,
      name_user_booking: name_user_booking,
      email_user_booking: email_user_booking,
      phone_user_booking: phone_user_booking,
      address_user_booking: address_user_booking,
      total_price: total_price,
      number_of_customer: number_of_customer,
      status_booking: "payment done",
      note: note,
      list_customer: bookingFind.list_customer,

    });
    try {
      await bookingFind.remove();
    } catch (err) {
      res.status(500).json({ msg: err });
      console.log("booking remove fail");
      return;
    }
    try {
      addBooking.save();
    } catch (err) {
      res.status(500).json({ msg: err });
      console.log("save booking fail");
      return;
    }
    res.status(201).json({ msg: "success" });
  };