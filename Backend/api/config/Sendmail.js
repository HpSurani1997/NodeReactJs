const Constants = require('./Constants');
let nodemailer = require('nodemailer');

function sendMail(mailData) {
    try {
        var transporter = nodemailer.createTransport(Constants.smtp);
        transporter.sendMail(mailData);
        return;
    } catch (error) {
        console.log(error, 'error');
        throw error;
    }
}


module.exports = { sendMail }