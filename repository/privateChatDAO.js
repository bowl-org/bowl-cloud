const { PrivateChat } = require("../models/entities/privateChat");

const getAll = () => {
  return PrivateChat.find({});
};

const findOne = (privateChat) => {
  return new Promise((resolve, reject) => {
    PrivateChat.findOne(privateChat).then((chat) => {
      //null or undefined
      if (chat == null) {
        reject(new Error("Private Chat does not exists!"));
      } else {
        resolve(chat);
      }
    });
  });
};

//Find private chat that two users talking with each other(Sequence of user id arguments does not matter)
const findByUsersIds = async (user1Id, user2Id) => {
  let chat;
  chat = await PrivateChat.findOne({ user1Id: user1Id, user2Id: user2Id });
  if (chat != null) {
    return chat;
  }
  chat = await PrivateChat.findOne({ user1Id: user2Id, user2Id: user1Id });
  if (chat == null) {
    throw new Error("There isn't any Private Chat!");
  } else {
    return chat;
  }
};

const findAll = (privateChat) => {
  return new Promise((resolve, reject) => {
    PrivateChat.find(privateChat).then((chat) => {
      //null or undefined
      if (chat == null) {
        reject(new Error("There isn't any Private Chat!"));
      } else {
        resolve(chat);
      }
    });
  });
};

const deleteAll = () => {
  return PrivateChat.remove({});
};
//Delete private chat that two users talking with each other(Sequence of user id arguments does not matter)
const deleteByUsersIds = (user1Id, user2Id) => {
  return new Promise((resolve, reject) => {
    let chatId;
    chatId = PrivateChat.exists({ user1Id: user1Id, user2Id: user2Id });
    if (chatId) {
      return PrivateChat.remove({ user1Id: user1Id, user2Id: user2Id }).then(
        (chat) => {
          resolve(chat);
        }
      );
    } else {
      return PrivateChat.remove({ user1Id: user2Id, user2Id: user1Id }).then(
        (chat) => {
          //null or undefined
          if (chat == null) {
            reject(new Error("There isn't any Private Chat To Remove!"));
          } else {
            resolve(chat);
          }
        }
      );
    }
  });
};
const findById = (id) => {
  return PrivateChat.findById(id);
};
const insert = (privateChatDTO) => {
  return PrivateChat.create(privateChatDTO);
};
const setActive = (id, isActive) => {
  return PrivateChat.findByIdAndUpdate(id, { active: isActive });
};

module.exports = {
  getAll,
  findOne,
  findByUsersIds,
  findAll,
  deleteAll,
  deleteByUsersIds,
  findById,
  insert,
  setActive,
};
