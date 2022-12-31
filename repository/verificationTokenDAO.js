const {VerificationToken} = require("../models/entities/verificationToken");

const getAll = () => {
  return VerificationToken.find({});
}
const findOne = (verificationTokenDTO) => {
  return VerificationToken.findOne(verificationTokenDTO);
}
const deleteAll = () => {
  return VerificationToken.remove({});
}
const deleteOne = (verificationTokenDTO) => {
  return VerificationToken.remove(verificationTokenDTO);
}
const findById = (id) => {
  return VerificationToken.findById(id);
}
const insert = (verificationTokenDTO) => {
  return VerificationToken.create(verificationTokenDTO);
}
const updateById = (id) => {
  return VerificationToken.findByIdAndUpdate(id);
}

module.exports = {getAll, findOne, deleteAll, deleteOne, findById, insert, updateById};
