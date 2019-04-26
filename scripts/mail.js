var nodemailer = require('nodemailer');

let Mail = {
        sendMail: function(to, subject, text, next) {
                console.log(to, subject, text);
                var transporter = nodemailer.createTransport({
                        service: '', // SERVICE AUTHOR
                        auth: {
                                user: '', // MAIL AUTHOR
                                pass: '' // PASSWORD AUTHOR
                        }
                });
                var mailOptions = {
                        from: '', // MAIL AUTHOR
                        to: to,
                        subject: subject,
                        text: text
                };
                transporter.sendMail(mailOptions, function(err, info) {
                        if (err) throw err;
                        next(false);
                });
        }
};

module.exports = Mail;
