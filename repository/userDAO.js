const { User } = require("../models/entities/user");

const getAll = () => {
  return User.find({});
};
const findOne = (userDTO) => {
  return new Promise((resolve, reject) => {
    User.findOne(userDTO).then((user) => {
      //null or undefined
      if (user == null) {
        reject(new Error("User not found!"));
      } else {
        resolve(user);
      }
    });
  });
};
const deleteAll = () => {
  return User.remove({});
};
const deleteByEmail = (email) => {
  return User.remove({ email: email });
};
const findById = (id) => {
  return User.findById(id);
};
const insert = (userDTO) => {
  return User.create(userDTO);
};
const updateById = (id, data) => {
  return User.findByIdAndUpdate(id, data);
};
const updateByEmail = async (email, data) => {
  let user = await findOne({ email: email });
  return User.findByIdAndUpdate(user.id, data);
};

module.exports = {
  getAll,
  findOne,
  deleteAll,
  deleteByEmail,
  findById,
  insert,
  updateById,
  updateByEmail
};
