const bcrypt = require("bcrypt")
const userModel = require("../models/user")
const authenticateUser = (req, res, next) => {
  let body = req.body
  userModel.findOne({"email": body.email})
    .then((candidateUser) => {
      bcrypt.compare(body.password, candidateUser.password)
        .then((isValid) => {
          if(isValid){
              res.statusCode = 200;
              res.setHeader('Content-Type', 'application/json');
              res.json({"msg":`Welcome ${candidateUser.name}!`})
          }else{
              res.statusCode = 404;
              res.end("Invalid credentials!")
          }
        })
        .catch((err) => next(err));
    })
    .catch((err) => next(err));
};
module.exports = { authenticateUser };
