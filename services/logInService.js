const encryptionService = require("./encryptionService");
const validationService = require("./validationService");
const userDAO = require("../repository/userDAO");
const authTokenService = require("./authTokenService");

const authenticateUser = (userData) => {
  return new Promise((resolve, reject) => {
    try {
      validationService.validateEmail(userData.email);
      validationService.validatePassword(userData.password);
    } catch (err) {
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
              if (candidateUser.verified) {
                authTokenService
                  .generateAuthToken(candidateUser)
                  .then((token) => {
                    let authData = {
                      token: token,
                      user: {
                        publicKey: candidateUser.public_key,
                        name: candidateUser.name,
                      },
                    };
                    resolve(authData);
                  })
                  .catch((err) => {
                    reject(err);
                  });
              } else {
                //TODO resend verification link
                reject(
                  new Error(
                    "User not verified! Check your mail inbox for verification link"
                  )
                );
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
