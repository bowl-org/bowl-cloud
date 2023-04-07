const UserDAO = require("../repository/userDAO");
const { mapToUserDTO } = require("../models/dtos/userDto");

const getAllUsers = () => {
  return UserDAO.getAll().catch((err) => {
    throw new Error(err.message);
  });
};

const removeAllUsers = () => {
  return UserDAO.deleteAll().catch((err) => {
    throw new Error(err.message);
  });
};

const getUserPublicKey = (email) => {
  return UserDAO.findOne({
    email: email,
  }).catch((err) => {
    throw new Error(err.message);
  });
};
const getUserByUserId = (userId) => {
  return UserDAO.findOne({
    _id: userId,
  }).catch((err) => {
    throw new Error(err.message);
  });
};

module.exports = {
  getAllUsers,
  removeAllUsers,
  getUserPublicKey,
  getUserByUserId,
};
