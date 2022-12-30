const {User} = require("../models/entities/user");

const getAll = () => {
  return User.find({});
}
const findOne = (userDTO) => {
  return User.findOne(userDTO);
}
const deleteAll = () => {
  return User.remove({});
}
const findById = (id) => {
  return User.findById(id);
}
const insert = (userDTO) => {
  return User.create(userDTO);
}
const updateById = (id) => {
  return User.findByIdAndUpdate(id);
}

module.exports = {getAll, findOne, deleteAll, findById, insert, updateById};