const encryptionService = require("../services/encryptionService");
const UserDAO = require("../repository/userDAO");
const validationService = require("./validationService");
const { mapToUserDTO } = require("../models/dtos/userDto");

const signUpNewUser = (userData) => {
  return new Promise((resolve, reject) => {
    let user = mapToUserDTO(userData);
    try {
      validationService.validateUser(user);
      encryptionService.encryptPassword(user.password).then((hash) => {
        user.password = hash;
        UserDAO.insert(user)
          .then((insertedUser) => {
            resolve(insertedUser);
          })
          .catch((err) => {
            //Mongodb duplicate key error code
            if (err.code == 11000) {
              reject(new Error("Account exists!"));
            } else {
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
//DEV
const getAllUsers = () => {
  return UserDAO.getAll().catch((err) => {
    throw new Error(err.message);
  });
};
//DEV
const removeAllUsers = () => {
  return UserDAO.deleteAll().catch((err) => {
    throw new Error(err.message);
  });
};
module.exports = { signUpNewUser, getAllUsers, removeAllUsers };
