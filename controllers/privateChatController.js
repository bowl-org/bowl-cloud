const { generateMessage } = require("../util/messageGenerator");
const privateChatService = require("../services/privateChatService");

const getAllPrivateChats = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  privateChatService
    .getAllPrivateChatDetails()
    .then((privateChats) => {
      res.status(200).json(privateChats);
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};
const removeAllPrivateChats = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  privateChatService
    .deleteAll()
    .then((privateChats) => {
      res.status(200).json(generateMessage(false, "All privateChats deleted!"));
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};
const removePrivateChat = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  let body = req.body;
  privateChatService
    .deleteById(body.id)
    .then(() => {
      res.status(200).json(generateMessage(false, "Private Chat deleted!"));
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};

module.exports = {
  getAllPrivateChats,
  removeAllPrivateChats,
  removePrivateChat,
};
