const { PrivateChat } = require("../models/entities/privateChat");
const { User } = require("../models/entities/user");

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
const getContactUserIds = async (userId) => {
  return (
    await PrivateChat.find()
      .or([{ user1Id: userId }, { user2Id: userId }])
      .select({
        _id: 0,
        userId: {
          $cond: [{ $eq: ["$user1Id", userId] }, "$user2Id", "$user1Id"],
        },
      })
      .lean()
  ).map((data) => data.userId);
};
const getContactEmails = async (userId) => {
  let contactUserIds = await getContactUserIds(userId);
  return await User.find().where("_id").in(contactUserIds).distinct("email");
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
const isPrivateChatExists = async (privateChatDTO) => {
  let isExists =
    ((await PrivateChat.exists({
      user1Id: privateChatDTO?.user1Id,
      user2Id: privateChatDTO?.user2Id,
    }).exec()) ||
      (await PrivateChat.exists({
        user1Id: privateChatDTO?.user2Id,
        user2Id: privateChatDTO?.user1Id,
      }).exec())) != null;
  console.log("Is exists:", isExists);
  return isExists;
};

const deleteById = async (privateChatId) => {
  let isDeleted = await PrivateChat.findByIdAndRemove(privateChatId);
  if(!isDeleted) throw new Error("PrivateChat delete failed! PrivateChat id not found");
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
  getContactEmails,
  isPrivateChatExists,
  deleteById,
};
