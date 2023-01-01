const validateEmail = (email) => {
  if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return;
  }
  throw new Error("Email validation failed! Invalid email pattern!");
};
const validatePassword = (password) => {
  //Minimum 8 character must include at least one uppercase letter
  if (/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/.test(password)) {
    return;
  }
  throw new Error("Password must be at least 8 characters long contain a number and an uppercase letter.");
};
const validateName = (name) => {
  //Minimum 3 character
  if (/^.{3,}$/.test(name)) {
    return;
  }
  throw new Error("Name validation failed! Name must be at least 3 characters long.");
};
const validatePublicKey = (publicKey) => {
  //TODO
  return;
};
const validateUser = (user) => {
  try {
    validateEmail(user.email);
    validateName(user.name);
    validatePassword(user.password);
    validatePublicKey(user.publicKey);
  } catch (err) {
    throw err;
  }
};
module.exports = {validateUser, validatePassword, validateEmail};
