//Maps to user DTO
const mapToUserDTO = (userData) => {
  try {
    let user = {
      //Check for undefined
      name: userData.name?.trim(),
      email: userData.email?.trim(),
      password: userData.password,
      public_key: userData.public_key?.trim(),
    };
    return user;
  } catch (err) {
    throw err;
  }
};
module.exports = {mapToUserDTO};
