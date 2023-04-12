const express = require("express");

const userController = require("../controllers/userControlller");

const userRouter = express.Router();

//Body parser
userRouter.use(express.json());

userRouter
  .route("/")
  .get(userController.getAllUsers)
  .post((req, res, next) => {
    res
      .status(403)
      .json(messageGenerator(true, "POST operation not supported on /user"));
  })
  .put((req, res, next) => {
    res
      .status(403)
      .json(messageGenerator(true, "PUT operation not supported on /user"));
  })
  .delete(userController.removeUserByEmail);

userRouter.get(
  "/getPublicKeyWithEmail",
  userController.getUserPublicKey
);
userRouter.get(
  "/getUserByUserId",
  userController.getUserByUserId
);
userRouter.post(
  "/generateUnlimitedAuthToken",
  userController.generateUnlimitedAuthToken
);
module.exports = userRouter;
