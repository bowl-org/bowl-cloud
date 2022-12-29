const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const userModel = require("../models/user");
require("dotenv").config({ path: "../.env" });
const mailTransporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.TRANSPORTER_MAIL,
    pass: process.env.TRANSPORTER_PASS,
  },
});
const authenticateUser = (req, res, next) => {
  let body = req.body;
  console.log(req.query);
  userModel
    .findOne({ email: body.email })
    .then((candidateUser) => {
      bcrypt
        .compare(body.password, candidateUser.password)
        .then((isValid) => {
          if (isValid) {
            verificationCode = Math.floor(1000 + Math.random() * 9000);
            console.log(verificationCode);
            link = `http://${req.get("host")}/verify?id=${verificationCode}`;
            mailOptions = {
              to: body.email,
              subject: "Please confirm your account",
              html: `<p>Please click the link to login your account.</p><a href="${link}">Click here to verify</a>`,
            };
            mailTransporter.sendMail(mailOptions, (err, info) => {
              if (err) {
                console.log(err);
                res
                  .status(404)
                  .json({ msg: "Couldn't sent verification mail!" });
              } else {
                console.log("Verification mail sent!: ", info);
                res.status(200).json({ msg: "Verification mail sent!" });
              }
            });
            //res.statusCode = 200;
            //res.setHeader('Content-Type', 'application/json');
            //res.json(candidateUser)
          } else {
            res.statusCode = 404;
            res.end("Invalid credentials!");
          }
        })
        .catch((err) => next(err));
    })
    .catch((err) =>
      res.status(404).json({ msg: "Email doesn't match any account!" })
    );
};
module.exports = { authenticateUser };
