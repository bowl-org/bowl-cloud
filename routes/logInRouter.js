const express = require("express");
const logInController = require("../controllers/logInController");
const messageGenerator = require("../util/messageGenerator");

const logInRouter = express.Router();

logInRouter.use(express.json());

logInRouter
  .route("/")
  .get((req, res, next) => {
    //Not supported status code
    res
      .status(403)
      .json(messageGenerator(true, "GET operation not supported on /login"));
  })
  .post(logInController.authenticateUser)
  .put((req, res, next) => {
    res
      .status(403)
      .json(messageGenerator(true, "PUT operation not supported on /login"));
  })
  .delete((req, res, next) => {
    res
      .status(403)
      .json(messageGenerator(true, "DELETE operation not supported on /login"));
  });

module.exports = logInRouter;
