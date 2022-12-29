const bcrypt = require("bcrypt");
const userModel = require("../models/user");
const validateEmail = (email) => {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return true;
  }
  return false;
}
const validatePassword = (password) => {
  //Minimum 8 character must include at least one uppercase letter
  if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)) {
    return true;
  }
  return false;
}
const validateName = (name) => {
  //Minimum 3 character
  if (/^.{3,}$/.test(name)){
    return true;
  }
  return false;
}
const validatePublicKey = (publicKey) => {

}
const validateAllFields = (name, password, email, publicKey) => {
  validateName(name)
}
const newUser = (req, res, next) => {
  //res.statusCode = 200;
  //res.setHeader("Content-Type", "application/json");
  //res.json({
    //POST: "signup",
  //});
  //r -> iteration number of hash(High number of iterations results as better hashing but increase time cost)
  //Generate hash with salt (Protect against rainbow table attacks)
  let body = req.body
  bcrypt.hash(req.body.password, 10)
    .then((hash) => {
      body.password = hash;
      userModel.create(body)
        .then((user) => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json(user);
        }, (err) => next(err))
        .catch((err) => next(err));
    }, (err) => next(err))
    .catch((err) => next(err))
};
const getAllUsers = (req, res, next) => {
  userModel.find({})
    .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    }, (err) => next(err))
    .catch((err) => next(err))
}
const removeAllUsers = (req, res, next) => {
  userModel.remove({})
    .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(users);
    }, (err) => next(err))
			.catch((err) => next(err))
}
module.exports = { newUser, getAllUsers, removeAllUsers };
