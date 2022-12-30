const verificationTokenModel = require("../models/verificationToken");
const userModel = require("../models/user");

const verifyUser = (req, res, next) => {
  verificationTokenModel
    .findOne({ userId: req.params, token: req.params.token })
    .then((token) => {
        userModel
          .findByIdAndUpdate(token.userId, { verified: true })
          .then((user) => {
            console.log("User verified: ", user);
          })
          .catch((err) => next(err));
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
};

module.exports = { verifyUser };
