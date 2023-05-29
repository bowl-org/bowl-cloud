const { generateMessage } = require("../util/messageGenerator");
const groupChatService = require("../services/groupChatService");
const authorizationService = require("../services/authorizationService");
const socketHandlerService = require("../services/socketHandlerService")

const createGroupChat = async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  try {
    let userId = await authorizationService.checkAuthTokenThenGetUserId(req.headers.authorization);
    let group = await groupChatService.createGroup(userId, req.body);
    await socketHandlerService.joinToChannelIfOnline(userId, group.groupId );
    res.status(200).json(group);
  } catch (err) {
    res.status(400).json(generateMessage(true, err.message));
  }
};
const updateGroupChat = async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  try {
    let userId = await authorizationService.checkAuthTokenThenGetUserId(req.headers.authorization);
    await groupChatService.updateGroupDetailsByAdmin(userId, req.body);
    res.status(200).json(generateMessage(false, "Group updated!"));
  } catch (err) {
    res.status(400).json(generateMessage(true, err.message));
  }
};
const getAllGroupChats = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  groupChatService
    .getAll()
    .then((groupChats) => {
      res.status(200).json(groupChats);
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};
const getAllRelationalMembersDataOfUser = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  groupChatService
    .getAllRelationalMembersDataOfUser(req.body.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};
const getAllRelationalMembersEmailOfUser = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  groupChatService
    .getAllRelationalMembersEmailOfUser(req.body.id)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};
const removeGroupChat = async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  try {
    let userId = await authorizationService.checkAuthTokenThenGetUserId(req.headers.authorization);
    await groupChatService.removeGroup(req.body.id);
    res.status(200).json(generateMessage(false, "Group Chat deleted!"));
  } catch (err) {
    res.status(400).json(generateMessage(true, err.message));
  }
};
//DEV
const getAllMembers = async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  try {
    let groupMembers = await groupChatService.getAllMembers();
    res.status(200).json(groupMembers);
  } catch (err) {
    res.status(400).json(generateMessage(true, err.message));
  }
};
const deleteAllMembers = async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  try {
    await groupChatService.deleteAllMembers();
    res.status(200).json(generateMessage(false, "All members deleted!"));
  } catch (err) {
    res.status(400).json(generateMessage(true, err.message));
  }
};
const getAllMembersOfGroup = async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  try {
    let userId = await authorizationService.checkAuthTokenThenGetUserId(req.headers.authorization);
    let groupMembers = await groupChatService.getAllMembersOfGroup(
      req.query.id
    );
    res.status(200).json(groupMembers);
  } catch (err) {
    res.status(400).json(generateMessage(true, err.message));
  }
};
const addMemberToGroup = async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Type", "application/json");
  try {
    let userId = await authorizationService.checkAuthTokenThenGetUserId(req.headers.authorization);
    await groupChatService.addMemberToGroup(req.body);
    res.status(200).json(generateMessage(false, "Group member added!"));
  } catch (err) {
    res.status(400).json(generateMessage(true, err.message));
  }
};
const removeGroupMember = async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  try {
    let userId = await authorizationService.checkAuthTokenThenGetUserId(req.headers.authorization);
    await groupChatService.removeMemberFromGroup(userId, req.body);
    res.status(200).json(generateMessage(false, "Group member removed!"));
  } catch (err) {
    res.status(400).json(generateMessage(true, err.message));
  }
};
const setAdminStatusOfMember = async (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  res.setHeader("Content-Type", "application/json");
  try {
    let userId = await authorizationService.checkAuthTokenThenGetUserId(req.headers.authorization);
    await groupChatService.setAdminStatusOfMember(req.body);
    res.status(200).json(generateMessage(false, "Group member added!"));
  } catch (err) {
    res.status(400).json(generateMessage(true, err.message));
  }
};

module.exports = {
  createGroupChat,
  deleteAllMembers,
  setAdminStatusOfMember,
  updateGroupChat,
  getAllGroupChats,
  removeGroupChat,
  getAllMembersOfGroup,
  getAllMembers,
  addMemberToGroup,
  removeGroupMember,
  getAllRelationalMembersDataOfUser,
  getAllRelationalMembersEmailOfUser
};
