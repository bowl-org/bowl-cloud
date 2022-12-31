const { VerificationToken } = require("../models/entities/verificationToken");

const getAll = () => {
  return VerificationToken.find({});
};
const findOne = (verificationTokenDTO) => {
  return new Promise((resolve, reject) => {
    VerificationToken.findOne(verificationTokenDTO).then((token) => {
      //null or undefined
      if (token == null) {
        reject(new Error("Verification token not found!"));
      } else {
        resolve(token);
      }
    });
  });
};
const deleteAll = () => {
  return VerificationToken.remove({});
};
const deleteOne = (verificationTokenDTO) => {
  return VerificationToken.remove(verificationTokenDTO);
};
const findById = (id) => {
  return VerificationToken.findById(id);
};
const insert = (verificationTokenDTO) => {
  return VerificationToken.create(verificationTokenDTO);
};
const updateById = (id) => {
  return VerificationToken.findByIdAndUpdate(id);
};

module.exports = {
  getAll,
  findOne,
  deleteAll,
  deleteOne,
  findById,
  insert,
  updateById,
};
