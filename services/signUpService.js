const encryptionService = require("../services/encryptionService");
const UserDAO = require("../repository/userDAO");
const validationService = require("./validationService");
const verificationService = require("./verificationService");
const mailService = require("./mailService");
const { mapToUserDTO } = require("../models/dtos/userDto");

const signUpNewUser = (userData) => {
  return new Promise((resolve, reject) => {
    let user = mapToUserDTO(userData);
    try {
      let publicKey = validationService.validateUser(user);
      user.public_key = publicKey;
      encryptionService.encryptPassword(user.password).then((hash) => {
        user.password = hash;
        UserDAO.insert(user)
          .then((insertedUser) => {
            verificationService
              .genVerificationLink(insertedUser.id, "/verify")
              .then((link) => {
                mailService
                  .sendMail(
                    mailService.genConfirmationOptions(insertedUser.email, link)
                  )
                  .then((info) => {
                    //resolve(insertedUser);
                    resolve(info);
                  })
                  .catch((err) => {
                    console.log(err);
                    reject(err);
                  });
              })
              .catch((err) => {
                reject(err);
              });
          })
          .catch((err) => {
            //Mongodb duplicate key error code
            if (err.code == 11000) {
              reject(new Error("Account exists!"));
            } else {
              console.log(err);
              reject(err);
            }
          });
      });
      //.catch((err) => next(err));
    } catch (err) {
      reject(new Error(err.message));
    }
  });
};

module.exports = { signUpNewUser };
