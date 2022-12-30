const nodemailer = require("nodemailer");
require("dotenv").config({ path: "../.env" });

const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.TRANSPORTER_MAIL,
    pass: process.env.TRANSPORTER_PASS,
  },
});

mailOptions = {
  to: body.email,
  subject: "Please confirm your account",
  html: `<p>Please click the link to login your account.</p><a href="${link}">Click here to verify</a>`,
};
const sendMail = (to, subject, htmlBody) => {
  return Promise((resolve, reject) => {
    try {
      mailOptions = {
        to: to,
        subject: subject,
        html: htmlBody,
      };
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
module.exports = { sendMail };
