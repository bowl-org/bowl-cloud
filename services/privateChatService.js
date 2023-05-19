const PrivateChatDAO = require("../repository/privateChatDAO");
const { mapToPrivateChatDTO } = require("../models/dtos/privateChatDTO");

const getAll = () => {
  return PrivateChatDAO.getAll();
};

const findOne = (privateChat) => {
  let chat = mapToPrivateChatDTO(privateChat);
  return PrivateChatDAO.findOne(chat);
};

//Find private chat that two users talking with each other(Sequence of user id arguments does not matter)
const findByUsersIds = (user1Id, user2Id) => {
  return PrivateChatDAO.findByUsersIds(user1Id, user2Id);
};
const getContactEmails = async(userId) => {
  try{
  let contactEmails = await PrivateChatDAO.getContactEmails(userId);
    console.log("Contact emails:", contactEmails)
    if(contactEmails == null){
      throw new Error("User does not have any private chat!")
    }
    return contactEmails;
  }catch(err){
    console.log(err.message);
    throw new Error(err.message);
  }
}

const findAll = (privateChat) => {
  let chat = mapToPrivateChatDTO(privateChat);
  return PrivateChatDAO.findAll(chat);
};

const deleteAll = () => {
  return PrivateChatDAO.deleteAll();
};
//Delete private chat that two users talking with each other(Sequence of user id arguments does not matter)
const deleteByUsersIds = (user1Id, user2Id) => {
  return PrivateChatDAO.deleteByUsersIds(user1Id, user2Id);
};
const findById = (id) => {
  return PrivateChatDAO.findById(id);
};
const insert = (privateChatDTO) => {
  let chat = mapToPrivateChatDTO(privateChatDTO);
  return PrivateChatDAO.insert(chat);
};
const setActive = (id, isActive) => {
  return PrivateChatDAO.setActive(id, isActive);
};
const isPrivateChatExists = (privateChatDTO) => {
  return PrivateChatDAO.isPrivateChatExists(privateChatDTO);
}

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
  isPrivateChatExists
};
