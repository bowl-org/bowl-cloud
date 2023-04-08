const { generateMessage } = require("../util/messageGenerator");
const userService = require("../services/userService");
const {mapToUserDTO} = require("../models/dtos/userDto");

const getAllUsers = (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    userService.getAllUsers()
        .then((users) => {
            res.status(200).json(users);
        })
        .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};

const getUserPublicKey = (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    userService.getUserPublicKey(req.body.email)
        .then((user) => {
            res.status(200).json({"public_key": mapToUserDTO(user)["public_key"]});
        })
        .catch((err) => res.status(400).json(generateMessage(true, err.message)));
}
const getUserByUserId = (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    userService.getUserByUserId(req.body.id)
        .then((user) => {
            res.status(200).json(user);
        })
        .catch((err) => res.status(400).json(generateMessage(true, err.message)));
}

const removeAllUsers = (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    userService.removeAllUsers()
        .then((users) => {
            res.status(200).json(generateMessage(false, "All users deleted!"));
        })
        .catch((err) => res.status(400).json(generateMessage(true, err.message)));
};
const  removeUserByEmail = (req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    userService.removeUserByEmail(req.body.email)
        .then((user) => {
            res.status(200).json(generateMessage(false, "User deleted!"));
        })
        .catch((err) => res.status(400).json(generateMessage(true, err.message)));
}

module.exports = { getAllUsers, getUserPublicKey, getUserByUserId, removeAllUsers, removeUserByEmail };