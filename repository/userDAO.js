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
const deleteByEmail = async(email) => {
  let isDeleted = (await User.remove({ email: email })).deletedCount > 0;
  if(!isDeleted) throw new Error("User delete failed! User email not found");
};
const deleteById = async(id) => {
  let isDeleted = await User.findByIdAndRemove(id);
  if(!isDeleted) throw new Error("User delete failed! User id not found");
};
const findById = (id) => {
  return User.findById(id);
};
const insert = (userDTO) => {
  return User.create(userDTO);
};
const updateById = async (id, data) => {
  let user = await User.findByIdAndUpdate(id, data);
  console.log("Updated user:", user)
  if(!user) throw new Error("User update failed! User id not found");
  return user;
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
  deleteById,
  findById,
  insert,
  updateById,
  updateByEmail
};
