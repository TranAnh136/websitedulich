const nodemailer = require('nodemailer');
const adminEmail = 'paradise.travel.uit@gmail.com'
const adminPassword = 'paradise@123'
//sử dụng host của google - gmail
const mailHost = 'smtp.gmail.com'
// 587 là một cổng tiêu chuẩn và phổ biến trong giao thức SMTP
const mailPort = 587
const transporter = nodemailer.createTransport({
    host: mailHost,
    port: mailPort,
    secure: false, // nếu dùng port 465 (smtps) thì để true, còn lại hãy để false cho tất cả các port khác
    auth: {
      user: adminEmail,
      pass: adminPassword
    }
});
    // 'smtps://confesstionceo%40gmail.com:missing123@smtp.gmail.com'

exports.sendEmail = async (email, token) => {
    let mailOptions = {
        from: '"Admin👻" <paradise.travel.uit@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Account Verification Token', // Subject line
        text: 'Hello my friend',
        html: '<b>verify your account</b>'
            + ' <br/>'
            + '<span>Please verify your account by clicking the link</span>'
            + '<br/>'
            + '<span>http://localhost:3000/confirm/' + token +  '</span>'
    };
    try{
        let send = await transporter.sendMail(mailOptions);
    }
    catch(err){
        console.log(err);
        return false;
    }
    return true;
}

exports.sendEmailForgotPassword = async (email, token) => {
    let mailOptions = {
        from: '"Admin 👻" <paradise.travel.uit@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'Forgot password Verification Token', // Subject line
        html: '<b>Forgot password</b>'
            + ' <br/>'
            + '<span>Please enter OTP below</span>'
            + '<br/>'
            + '<span>' + token +  '</span>'
    };
    try{
        let send = await transporter.sendMail(mailOptions);
    }
    catch(err){
        console.log(err);
        return false;
    }
    return true;
}
exports.sendMailConfirmPayment = async (email, tour_id, token) => {
    let mailOptions = {
        from: '"Admin 👻" <paradise.travel.uit@gmail.com>', // sender address
        to: email, // list of receivers
        subject: 'XÁC NHẬN ĐẶT TOUR', // Subject line
        text: 'Bạn đã đặt tour của chúng tôi. Bạn vui lòng nhấp vào link bên dưới để xác thực thanh toán.',
        html: '<b>Xác thực thanh toán</b>'
            + ' <br/>'
            + '<span>Link để xác thực:</span>'
            + '<br/>'
      
             + '<span>http://localhost:3000/confirmbooking/' + token+ '-' + tour_id  +  '</span>'
    };
    try{
        let send = await transporter.sendMail(mailOptions);
    }
    catch(err){
        console.log(err);
        return false;
    }
    return true;
}

