const express = require("express");
const { generateMessage } = require("../util/messageGenerator");
const privateChatController = require("../controllers/privateChatController");

const privateChatRouter = express.Router();

//Body parser
privateChatRouter.use(express.json());

privateChatRouter
  .route("/")
  .get(privateChatController.getAllPrivateChats)
  .post((req, res, next) => {
    res
      .status(403)
      .json(generateMessage(true, "POST operation not supported on /privateChat"));
  })
  // .put(privateChatController.updateUserKeyByEmail)
  .delete(privateChatController.removeAllPrivateChats);
privateChatRouter.delete("/id",privateChatController.removePrivateChat)

module.exports = privateChatRouter;
