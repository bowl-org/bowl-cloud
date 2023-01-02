const verificationService = require("../services/verificationService");
const { generateMessage } = require("../util/messageGenerator");

const verifyUser = (req, res, next) => {
  let verificationData = req.params;
  verificationService.verifyUser(verificationData)
    .then((user_id) => {
      //res.status(200).json(generateMessage(false, `User verified! user_id:${user_id}`));
      res.status(200).render('../views/pages/verifyUser',{
        success: true
      });
    })
    .catch((err) => {
      //res.status(400).json(generateMessage(true, err.message));
      res.status(400).render('../views/pages/verifyUser', {
        success: false,
        msg: err.message
      })
    });
};
//DEV
const getAllTokens = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  verificationService.getAllTokens()
    .then((tokens) => {
      res.status(200).json(tokens);
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
}
//DEV
const removeAllTokens = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  verificationService.removeAllTokens()
    .then((tokens) => {
      res.status(200).json(generateMessage(false, "All tokens deleted!"));
    })
    .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};

module.exports = { verifyUser, getAllTokens, removeAllTokens };
