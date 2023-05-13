const UserDAO = require("../repository/userDAO");
const authTokenService = require("../services/authTokenService");
const validationService = require("../services/validationService");
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
const removeUserByEmail = async (email) => {
  return UserDAO.deleteByEmail(email).catch((err) => {
    throw new Error(err.message);
  });
};
const removeUserById = async (id) => {
  return UserDAO.deleteById(id).catch((err) => {
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
const getUserDetails = (email) => {
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
const getUserByEmail = (email) => {
  return UserDAO.findOne({
    email: email,
  }).catch((err) => {
    throw new Error(err.message);
  });
};
const getIdByEmail = async (email) => {
  let user = await UserDAO.findOne({
    email: email,
  }).catch((err) => {
    throw new Error(err.message);
  });
  return user._id;
};
const generateUnlimitedAuthTokenByEmail = (email) => {
  return new Promise((resolve, reject) => {
    UserDAO.findOne({
      email: email,
    })
      .then((user) => {
        authTokenService
          .generateUnlimitedToken(user)
          .then((token) => {
            resolve(token);
          })
          .catch((err) => {
            reject(new Error(err.message));
          });
      })
      .catch((err) => {
        reject(new Error(err.message));
      });
  });
};
const updateUserKeyByEmail = async (email, publicKey) => {
  try {
    validationService.validatePublicKey(publicKey);
    await UserDAO.updateByEmail(email, { public_key: publicKey });
  } catch (err) {
    throw new Error(err.message);
  }
};
const updateUserDetailsById = async (userId, userDetail) => {
  try {
    let userData = {}
    if (userDetail.public_key){
      validationService.validatePublicKey(userDetail.public_key);
      userData.public_key = userDetail.public_key
    }
    if (userDetail.name){
      validationService.validateName(userDetail.name);
      userData.name = userDetail.name
    }
    await UserDAO.updateById(userId, userData);
  } catch (err) {
    throw new Error(err.message);
  }
};
module.exports = {
  getAllUsers,
  getUserDetails,
  removeAllUsers,
  removeUserByEmail,
  removeUserById,
  getUserPublicKey,
  getUserByUserId,
  getUserByEmail,
  getIdByEmail,
  generateUnlimitedAuthTokenByEmail,
  updateUserKeyByEmail,
  updateUserDetailsById,
};
