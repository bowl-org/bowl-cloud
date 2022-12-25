const bcrypt = require("bcrypt")
const userModel = require("../models/user")
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
