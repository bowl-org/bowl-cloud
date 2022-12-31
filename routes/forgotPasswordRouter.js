const express = require("express");
const forgotPasswordController = require("../controllers/forgotPasswordController");
const { generateMessage } = require("../util/messageGenerator");

const forgotPasswordRouter = express.Router();

forgotPasswordRouter.use(express.json());

forgotPasswordRouter
  .route("/")
  .get((req, res, next) => {
    //Not supported status code
    res
      .status(403)
      .json(generateMessage(true, "GET operation not supported on /forgotpassword"));
  })
  .post(forgotPasswordController.forgotPassword)
  .put((req, res, next) => {
    res
      .status(403)
      .json(generateMessage(true, "PUT operation not supported on /forgotpassword"));
  })
  .delete((req, res, next) => {
    res
      .status(403)
      .json(generateMessage(true, "DELETE operation not supported on /forgotpassword"));
  });
forgotPasswordRouter
  .route("/resetpassword/:user_id/:token")
  .get((req, res, next) => {
    //Not supported status code
    res
      .status(403)
      .json(generateMessage(true, "GET operation not supported on /forgotpassword/resetpassword"));
  })
  .post(forgotPasswordController.resetPassword)
  .put((req, res, next) => {
    res
      .status(403)
      .json(generateMessage(true, "PUT operation not supported on /forgotpassword/resetpassword"));
  })
  .delete((req, res, next) => {
    res
      .status(403)
      .json(generateMessage(true, "DELETE operation not supported on /forgotpassword/resetpassword"));
  });


module.exports = forgotPasswordRouter;
