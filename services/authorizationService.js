const userService = require("./userService");
const authTokenService = require("./authTokenService");

const checkAuthTokenThenGetUserId = async (token) => {
  let userId = authTokenService.getUserIdFromToken(token);
  if (userId == null) {
    throw new Error("Invalid auth token!");
  }
  await userService.checkUserExistence(userId).catch((err) => {
    throw new Error(
      "Faulty token, authorization failed! Token does not belongs to any user"
    );
  });
  return userId;
};

module.exports = {
  checkAuthTokenThenGetUserId,
};
