const { generateMessage } = require("../util/messageGenerator");
const signUpService = require("../services/signUpService");

const signUpNewUser = (req, res, next) => {
  let body = req.body;
  res.setHeader("Content-Type", "application/json");
  signUpService.signUpNewUser(body).then(user => {
    res.status(200).json(generateMessage(false, "Verification link sent to mail address!"));
  }).catch(err => {
    res.status(400).json(generateMessage(true, err.message));
  });
};

module.exports = { signUpNewUser };
