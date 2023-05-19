const express = require("express");
const { generateMessage } = require("../util/messageGenerator");
const groupChatController = require("../controllers/groupChatController");

const groupChatRouter = express.Router();

//Body parser
groupChatRouter.use(express.json());

groupChatRouter
  .route("/")
  .get(groupChatController.getAllGroupChats)
  .post((req, res, next) => {
    res
      .status(403)
      .json(generateMessage(true, "POST operation not supported on /privateChat"));
  })
  // .put(groupChatController.updateUserKeyByEmail)
  // .delete(groupChatController.removeUser);

module.exports = groupChatRouter;
