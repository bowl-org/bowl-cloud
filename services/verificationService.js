const verificationTokenDAO = require("../repository/verificationTokenDAO");
const userDAO = require("../repository/userDAO");
const {
  mapToVerificationTokenDTO,
} = require("../models/dtos/verificationTokenDTO");
require("dotenv").config({ path: "../.env" });
const uuid = require("uuid");

const genVerificationLink = (userId) => {
  return new Promise((resolve, reject) => {
    //V4 is random
    let token = uuid.v4();
    let link = `${process.env.BASE_URL}${process.env.API_TOKEN}/verify/${userId}/${token}`;
    let verificationToken = {
      user_id: userId,
      token: token,
    };
    verificationTokenDAO
      .insert(verificationToken)
      .then((user) => {
        resolve(link);
      })
      .catch((err) => {
        console.log(err);
        reject(new Error("Verification link generation failed!"));
      });
  });
};
const verifyUser = (verificationData) => {
  return new Promise((resolve, reject) => {
    let verificationToken = mapToVerificationTokenDTO(verificationData);
    console.log("Verify User:");
    console.log(verificationToken);
    try {
      verificationTokenDAO
        .findOne(verificationToken)
        .then((token) => {
          userDAO
            .updateById(token.user_id, { verified: true })
            .then((user) => {
              console.log("User verified: ", token.user_id);
              verificationTokenDAO
                .deleteOne(token)
                .catch((err) =>
                  reject(new Error("Verification token deletion failed!"))
                );
              resolve(token.user_id);
            })
            .catch((err) =>
              reject(new Error("Verification failed! User not found!"))
            );
        })
        .catch((err) =>
          reject(
            err
            //new Error("Verification failed! Verification token not exists!")
          )
        );
    } catch (err) {
      console.log(err);
      reject(new Error("Verifcation failed!"));
    }
  });
};
//DEV
const getAllTokens = () => {
  return verificationTokenDAO.getAll().catch((err) => {
    throw new Error(err.message);
  });
};
//DEV
const removeAllTokens = () => {
  return verificationTokenDAO.deleteAll().catch((err) => {
    throw new Error(err.message);
  });
};
module.exports = { verifyUser, genVerificationLink, getAllTokens, removeAllTokens };
