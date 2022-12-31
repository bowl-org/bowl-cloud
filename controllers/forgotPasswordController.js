const express = require("express");
const { generateMessage } = require("../util/messageGenerator");
const forgotPasswordService = require("../services/forgotPasswordService");

const forgotPassword = (req, res, next) => {
  let body = req.body;
  res.setHeader("Content-Type", "application/json");
  forgotPasswordService.forgotPassword(body)
    .then((user) => {
      res.status(200).json(generateMessage(false, "Password reset link sent to mail address!"));
    })
    .catch((err) => {
      res.status(400).json(generateMessage(true, err.message));
    })
};
const resetPassword = (req, res, next) => {
  res.setHeader("Content-Type", "application/json");
  let verificationTokenData = req.params;
  let passwordData = req.body;
  forgotPasswordService.resetPassword(verificationTokenData, passwordData)
    .then((user) => {
      res.status(200).json(generateMessage(false, "Password reset successfully!"));
    })
    .catch((err) => {
      res.status(400).json(generateMessage(true, err.message));
    })
};

module.exports = { forgotPassword, resetPassword };
