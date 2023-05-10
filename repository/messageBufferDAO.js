const { MessageBuffer } = require("../models/entities/messageBuffer");

const getAll = () => {
  return MessageBuffer.find({});
};
const findOne = (messageBufferDTO) => {
  return new Promise((resolve, reject) => {
    MessageBuffer.findOne(messageBufferDTO).then((mb) => {
      //null or undefined
      if (mb == null) {
        reject(new Error("MessageBuffer not found!"));
      } else {
        resolve(mb);
      }
    });
  });
};
const findAll = (messageBufferDTO) => {
  return new Promise((resolve, reject) => {
    MessageBuffer.findOne(messageBufferDTO).then((mb) => {
      //null or undefined
      if (mb == null) {
        reject(new Error("There isn't any messages in the buffer!"));
      } else {
        resolve(mb);
      }
    });
  });
};
const deleteAll = () => {
  return MessageBuffer.remove({});
};
const deleteByReceiverEmail = (email) => {
  return MessageBuffer.remove({ receiver_email: email });
};
const deleteBySenderEmail = (email) => {
  return MessageBuffer.remove({ sender_email: email });
};
const findById = (id) => {
  return MessageBuffer.findById(id);
};
const insert = (messageBufferDTO) => {
  return MessageBuffer.create(messageBuffer);
};
const updateById = (id, data) => {
  return User.findByIdAndUpdate(id, data);
};

module.exports = {
  getAll,
  findOne,
  findAll,
  deleteAll,
  deleteByReceiverEmail,
  deleteBySenderEmail,
  findById,
  insert,
  updateById,
};
