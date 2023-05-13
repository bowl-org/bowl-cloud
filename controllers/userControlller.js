const { generateMessage } = require("../util/messageGenerator");
const userService = require("../services/userService");
const authTokenService = require("../services/authTokenService");
const { mapToUserDTO } = require("../models/dtos/userDto");

const getAllUsers = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  userService
    .getAllUsers()
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};

const getUserPublicKey = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  userService
    .getUserPublicKey(req.body.email)
    .then((user) => {
      res.status(200).json({ public_key: mapToUserDTO(user)["public_key"] });
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};
const getUserDetails = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  userService
    .getUserDetails(req.query.email)
    .then((user) => {
      let userDTO = mapToUserDTO(user)
      res.status(200).json({ public_key: userDTO["public_key"], name: userDTO["name"] });
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};
const getUserByUserId = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  userService
    .getUserByUserId(req.body.id)
    .then((user) => {
      res.status(200).json(user);
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};
const generateUnlimitedAuthToken = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  userService
    .generateUnlimitedAuthTokenByEmail(req.body.email)
    .then((token) => {
      res.status(200).json({ token: token });
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};

const removeAllUsers = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  userService
    .removeAllUsers()
    .then((users) => {
      res.status(200).json(generateMessage(false, "All users deleted!"));
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};

const removeUser = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  if (req.body.email) {
    removeUserByEmail(req, res, next);
  } else if (req.body.id) {
    removeUserById(req, res, next)
  } else {
    res.status(400).json(generateMessage(true, "Email or id not given!"));
  }
};
const removeUserById = (req, res ,next) => {
  res.setHeader("Content-Type", "application/json");
  userService
    .removeUserById(req.body.id)
    .then((user) => {
      res.status(200).json(generateMessage(false, "User deleted!"));
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};
const removeUserByEmail = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");

  userService
    .removeUserByEmail(req.body.email)
    .then((user) => {
      res.status(200).json(generateMessage(false, "User deleted!"));
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};

const updateUserKeyByEmail = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  userService
    .updateUserKeyByEmail(req.body.email, req.body.public_key)
    .then(() => {
      res.status(200).json(generateMessage(false, "User public key updated!"));
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};
const updateUser = async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  try {
    let userId = authTokenService.getUserIdFromToken(req.headers.authorization);
    if (userId == null) {
      throw new Error("Invalid auth token!");
    }
    await userService.updateUserDetailsById(userId, req.body);
    res.status(200).json(generateMessage(false, "User updated!"));
  } catch (err) {
    res.status(400).json(generateMessage(true, err.message));
  }
};

module.exports = {
  getAllUsers,
  getUserPublicKey,
  getUserDetails,
  getUserByUserId,
  generateUnlimitedAuthToken,
  removeAllUsers,
  removeUser,
  removeUserByEmail,
  updateUserKeyByEmail,
  updateUser,
};
