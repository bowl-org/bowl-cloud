const express = require("express");
const signUpController = require("../controllers/signUpController");
const messageGenerator = require("../util/messageGenerator");

const signUpRouter = express.Router();

//Body parser
signUpRouter.use(express.json());

signUpRouter
  .route("/")
  .get(signUpController.getAllUsers)
  .post(signUpController.signUpNewUser)
  .put((req, res, next) => {
    res
      .status(403)
      .json(messageGenerator(true, "PUT operation not supported on /signup"));
  })
  .delete(signUpController.removeAllUsers);

module.exports = signUpRouter;
