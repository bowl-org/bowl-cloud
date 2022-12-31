const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../.env" });

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.TRANSPORTER_MAIL,
    pass: process.env.TRANSPORTER_PASS,
  },
});

const genConfirmationOptions = (mailTo, link) => {
  return mailOptions = {
    to: mailTo,
    subject: "Please confirm your account",
    html: `<p>Please click the link to confirm your account.</p><a href="${link}">Click here to verify</a>`,
  };
}

const sendMail = (options) => {
  return new Promise((resolve, reject) => {
    try {
      mailOptions = {
        to: options.to,
        subject: options.subject,
        html: options.html,
      };
      console.log(mailOptions.html)
      mailTransporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          reject(err);
        } else {
          resolve(info);
        }
      });
    } catch (err) {
      reject(err);
    }
  });
};
module.exports = { sendMail, genConfirmationOptions };
