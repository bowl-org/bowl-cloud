const jwt = require("jsonwebtoken");
require("dotenv").config();
const env = process.env;

const generateAuthToken = (user) => {
  return new Promise((resolve, reject) => {
    let payload = {
      userId: user.id,
      email: user.email,
    };
    jwt.sign(payload, env.SECRET_KEY, { expiresIn: "1w" }, (err, token) => {
      if (err) {
        reject(new Error("Auth token generation error!"));
      } else {
        resolve(token);
      }
    });
  });
};
//TODO after user logout add token to blacklist with expire date
const verifyAuthToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, env.SECRET_KEY, (err, decoded) => {
      if (err) {
        reject(new Error("Invalid auth token!"));
      } else {
        resolve(decoded);
      }
    });
  });
};
//DEV
const generateUnlimitedToken = (user) => {
  return new Promise((resolve, reject) => {
    let payload = {
      userId: user.id,
    };
    return jwt.sign(payload, env.SECRET_KEY, (err, token) => {
      if (err) {
        reject(new Error("Auth token generation error!"));
      } else {
        resolve(token);
      }
    });
  });
};
const getUserIdFromToken = (token) => {
  return jwt.decode(token)?.userId;
};
const getUserEmailFromToken = (token) => {
  return jwt.decode(token)?.email;
};

module.exports = {
  generateAuthToken,
  verifyAuthToken,
  generateUnlimitedToken,
  getUserIdFromToken,
  getUserEmailFromToken,
};
