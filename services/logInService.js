const encryptionService = require("./encryptionService");
const validationService = require("./validationService");
const userDAO = require("../repository/userDAO");

const authenticateUser = (userData) => {
  return new Promise((resolve, reject) => {
    try{
      validationService.validateEmail(userData.email);
      validationService.validatePassword(userData.password);
    }catch(err){
      reject(err);
    }
    //Check creadentials
    userDAO
      .findOne({ email: userData.email })
      .then((candidateUser) => {
        encryptionService
          .comparePassword(userData.password, candidateUser.password)
          .then((isValid) => {
            if (isValid) {
              if(candidateUser.verified){
                resolve(candidateUser);
              }else{
                reject(new Error("User not verified! Check your mail inbox for verification link"));
              }
            } else {
              reject(new Error("Invalid credentials!"));
            }
          })
          .catch((err) => {
            reject(err);
          });
      })
      .catch((err) => {
        reject(new Error("Email doesn't match any account!"));
      });
  });
};
module.exports = { authenticateUser };
