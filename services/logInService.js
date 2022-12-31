const encryptionService = require("./encryptionService");
const { mapToUserDTO } = require("../models/dtos/userDto");
const userDAO = require("../repository/userDAO");

const authenticateUser = (userData) => {
  return new Promise((resolve, reject) => {
    //TODO: validation will be add
    userDAO
      .findOne({ email: userData.email })
      .then((candidateUser) => {
        encryptionService
          .comparePassword(userData.password, candidateUser.password)
          .then((isValid) => {
            if (isValid) {
              resolve(candidateUser);
            } else {
              reject(new Error("Invalid credentials!"));
            }
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(new Error("Email doesn't match any account!"));
      });
  });
};
module.exports = { authenticateUser };
