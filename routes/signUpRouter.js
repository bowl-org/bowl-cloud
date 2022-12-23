const express = require("express");
const mongoose = require("mongoose");
const userModel = require("../models/user");
const signUpController = require("../controllers/signUpController");

const signUpRouter = express.Router();

signUpRouter.use(express.json());

signUpRouter
  .route("/")
  .get((req, res, next) => {
    res.statusCode = 403;
    res.end("GET operation not supported on /signup");
  })
  .post(signUpController.newUser)
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation not supported on /signup");
  })
  .delete((req, res, next) => {
    res.statusCode = 403;
    res.end("DELETE operation not supported on /signup");
  });

module.exports = signUpRouter;
