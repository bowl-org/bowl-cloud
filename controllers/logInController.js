const { generateMessage } = require("../util/messageGenerator");
const logInService = require("../services/logInService");

const authenticateUser = (req, res, next) => {
  let body = req.body;
  res.setHeader("Content-Type", "application/json");
  logInService
    .authenticateUser(body)
    .then((authData) => {
      res
        .status(200)
        .json({...generateMessage(false, "Authentication success!", authData.token), user: authData.user});
    })
    .catch((err) => {
      res.status(400).json(generateMessage(true, err.message));
    });
};
module.exports = { authenticateUser };
