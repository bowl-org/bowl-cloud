const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { generateMessage } = require("../util/messageGenerator");
const userModel = require("../models/user");
const User = userModel.User;

const validateEmail = (email) => {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return;
  }
  throw new Error("Email validation failed!");
};
const validatePassword = (password) => {
  //Minimum 8 character must include at least one uppercase letter
  if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)) {
    return;
  }
  throw new Error("Password validation failed!");
};
const validateName = (name) => {
  //Minimum 3 character
  if (/^.{3,}$/.test(name)) {
    return;
  }
  throw new Error("Name validation failed!");
};
const validatePublicKey = (publicKey) => {
  //TODO
  return;
};
const validateUser = (user) => {
  try {
    validateEmail(user.email);
    validateName(user.name);
    validatePassword(user.password);
    validatePublicKey(user.publicKey);
  } catch (err) {
    throw err;
  }
};
//Maps to user DTO
const userMapper = (userData) => {
  try {
    let user = {
      name: userData.name.trim(),
      email: userData.email.trim(),
      password: userData.password,
      public_key: userData.public_key.trim(),
    };
    return user;
  } catch (err) {
    throw err;
  }
};
const newUser = (req, res, next) => {
  let body = req.body;
  let user = userMapper(body);
  try {
    validateUser(user);
    res.setHeader("Content-Type", "application/json");
    //r -> iteration number of hash(High number of iterations results as better hashing but increase time cost)
    //Generate hash with salt (Protect against rainbow table attacks)
    bcrypt
      .hash(user.password, 10)
      .then((hash) => {
        user.password = hash;
        User.create(user)
          .then((createdUser) => {
            res.statusCode = 200;
            res.json(createdUser);
          })
          .catch((err) => {
            //Mongodb duplicate key error code
            if (err.code == 11000) {
              res.status(400).json(generateMessage(true, "Account exists!"));
            } else {
              next(err);
            }
          });
      })
      .catch((err) => next(err));
  } catch (err) {
    res.status(400).json(generateMessage(true, err.message));
  }
};
const getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(users);
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};
const removeAllUsers = (req, res, next) => {
  User.remove({})
    .then((users) => {
      res.statusCode = 200;
      res.setHeader("Content-Type", "application/json");
      res.json(users);
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};
module.exports = { newUser, getAllUsers, removeAllUsers };
