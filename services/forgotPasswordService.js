const encryptionService = require("./encryptionService");
const validationService = require("./validationService");
const verificationService = require("./verificationService");
const verificationTokenDAO = require("../repository/verificationTokenDAO");
const mailService = require("./mailService");
const userDAO = require("../repository/userDAO");
const {
  mapToVerificationTokenDTO,
} = require("../models/dtos/verificationTokenDTO");

const forgotPassword = (userData) => {
  return new Promise((resolve, reject) => {
    //Check creadentials
    userDAO
      .findOne({ email: userData.email })
      .then((candidateUser) => {
        verificationService
          .genVerificationLink(
            candidateUser.id,
            "/forgotpassword/resetpassword"
          )
          .then((link) => {
            mailService
              .sendMail(
                mailService.genResetPasswordOptions(
                  candidateUser.email,
                  candidateUser.name,
                  link
                )
              )
              .then((info) => {
                resolve(info);
              })
              .catch((err) => {
                console.log(err);
                reject(err);
              });
          });
      })
      .catch((err) => {
        console.log(err);
        reject(new Error("Email doesn't match any account!"));
      });
  });
};
const resetPassword = (verificationTokenData, newPasswordData) => {
  return new Promise((resolve, reject) => {
    let verificationToken = mapToVerificationTokenDTO(verificationTokenData);
    verificationTokenDAO
      .findOne(verificationToken)
      .then((token) => {
        try {
          validationService.validatePassword(newPasswordData.password);
        } catch (err) {
          reject(err);
        }
        encryptionService
          .encryptPassword(newPasswordData.password)
          .then((hash) => {
            userDAO
              .updateById(token.user_id, { password: hash })
              .then((user) => {
                verificationTokenDAO.deleteOne(token).catch((err) => {
                  console.log(err);
                  reject(new Error("Verification token deletion failed!"));
                });
                resolve(user);
              })
              .catch((err) => {
                reject(new Error("Reset password failed! User not found!"));
              });
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(
          new Error(
            "Reset password failed! Verification token expired or invalid!"
          )
        );
      });
  });
};

module.exports = { forgotPassword, resetPassword };
