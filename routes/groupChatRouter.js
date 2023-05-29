const express = require("express");
const { generateMessage } = require("../util/messageGenerator");
const groupChatController = require("../controllers/groupChatController");

const groupChatRouter = express.Router();

//Body parser
groupChatRouter.use(express.json());

groupChatRouter
  .route("/")
  .get(groupChatController.getAllGroupChats)
  .post(groupChatController.createGroupChat)
  .put(groupChatController.updateGroupChat)
  .delete(groupChatController.removeGroupChat);
groupChatRouter.get("/groupMember", groupChatController.getAllMembersOfGroup)
groupChatRouter.post("/groupMember", groupChatController.addMemberToGroup)
groupChatRouter.put("/groupMember", groupChatController.setAdminStatusOfMember)
groupChatRouter.delete("/groupMember", groupChatController.removeGroupMember)

//DEV
groupChatRouter.get("/members", groupChatController.getAllMembers)
groupChatRouter.delete("/members", groupChatController.deleteAllMembers)
groupChatRouter.get("/relationalMembers", groupChatController.getAllRelationalMembersEmailOfUser)

module.exports = groupChatRouter;
