const UserDAO = require("../repository/userDAO")
const authTokenService = require("../services/authTokenService")
const { mapToUserDTO } = require("../models/dtos/userDto")

const getAllUsers = () => {
  return UserDAO.getAll().catch((err) => {
    throw new Error(err.message)
  })
}

const removeAllUsers = () => {
  return UserDAO.deleteAll().catch((err) => {
    throw new Error(err.message)
  })
}
const removeUserByEmail = (email) => {
  return UserDAO.deleteByEmail(email).catch((err) => {
    throw new Error(err.message)
  })
}

const getUserPublicKey = (email) => {
  return UserDAO.findOne({
    email: email,
  }).catch((err) => {
    throw new Error(err.message)
  })
}
const getUserByUserId = (userId) => {
  return UserDAO.findOne({
    _id: userId,
  }).catch((err) => {
    throw new Error(err.message)
  })
}
const getUserByEmail = (email) => {
  return UserDAO.findOne({
    email: email,
  }).catch((err) => {
    throw new Error(err.message)
  })
}
const getIdByEmail = async(email) => {
   let user = await UserDAO.findOne({
    email: email,
  }).catch((err) => {
    throw new Error(err.message)
  })
  return user._id;
}
const generateUnlimitedAuthTokenByEmail = (email) => {
  return new Promise((resolve, reject) => {
    UserDAO.findOne({
      email: email,
    })
      .then((user) => {
        authTokenService
          .generateUnlimitedToken(user)
          .then((token) => {
            resolve(token)
          })
          .catch((err) => {
            reject(new Error(err.message))
          })
      })
      .catch((err) => {
        reject(new Error(err.message))
      })
  })
}
module.exports = {
  getAllUsers,
  removeAllUsers,
  removeUserByEmail,
  getUserPublicKey,
  getUserByUserId,
  getUserByEmail,
  getIdByEmail,
  generateUnlimitedAuthTokenByEmail,
}
