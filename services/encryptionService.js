const bcrypt = require("bcrypt");
const encryptPassword = (password) => {
  //r -> iteration number of hash(High number of iterations results as better hashing but increase time cost)
  //Generate hash with salt (Protect against rainbow table attacks)
  return bcrypt
    .hash(password, 10)
    .catch((err) => {
      throw new Error("Password encryption error!");
    });
};
const comparePassword = (plainPassword, encryptedPassword) => {
  return bcrypt
    .compare(plainPassword, encryptedPassword)
    .catch((err) => {
      throw new Error("Password compare error!");
    });
}
module.exports = {encryptPassword, comparePassword};
