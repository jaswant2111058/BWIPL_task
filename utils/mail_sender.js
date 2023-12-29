const nodemailer = require("nodemailer");

/**
 * Sends an email for registration email verification.
 * @param {string} name - User's name.
 * @param {string} email - User's email address.
 * @param {string} phone_number - User's phone number.
 * @param {string} token - Verification token.
 */
function sendMail(name, email, phone_number, token,role) {
    // Create a nodemailer transporter
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: "jkstar0123@gmail.com",
            pass: process.env.EMAIL_PASS,
        }
    });

    // Define mail options
    var mailOptions = {
        from: 'jkstar0123@gmail.com',
        to: `${email}`,
        subject: 'Register Email Verification',
        html: `<html><a href="${process.env.ORIGIN_URL}/${role}/email/verification?token=${token}&name=${name}&email=${email}&phone_number=${phone_number}">Verify</a></html>`
    };

    // Log the mail options (for debugging)
    console.log(mailOptions);

    // Send the email
    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            // Log any errors that occur during email sending
            console.log(error);
        } else {
            // Log a success message if the email is sent successfully
            console.log('Email sent: ' + info.response);
        }
    });
}

// Export the sendMail function for external use
module.exports = sendMail;
