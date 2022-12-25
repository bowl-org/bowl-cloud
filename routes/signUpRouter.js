const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../models/user");
const signUpController = require("../controllers/signUpController");

const signUpRouter = express.Router();

signUpRouter.use(express.json());

signUpRouter
  .route("/")
  .get(signUpController.getAllUsers)
  .post(signUpController.newUser)
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /signup");
  })
  .delete(signUpController.removeAllUsers);

module.exports = signUpRouter;
