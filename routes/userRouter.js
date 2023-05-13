const express = require("express");
const { generateMessage } = require("../util/messageGenerator");
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
      .json(generateMessage(true, "POST operation not supported on /user"));
  })
  .put(userController.updateUserKeyByEmail)
  .delete(userController.removeUser);

userRouter.put("/update", userController.updateUser);
userRouter.get("/getPublicKeyWithEmail", userController.getUserPublicKey);
userRouter.get("/getUserByUserId", userController.getUserByUserId);
userRouter.post(
  "/generateUnlimitedAuthToken",
  userController.generateUnlimitedAuthToken
);
module.exports = userRouter;
