const UserDAO = require("../repository/userDAO");
const { mapToUserDTO } = require("../models/dtos/userDto");

const getAllUsers = () => {
    return UserDAO.getAll().catch((err) => {
        throw new Error(err.message);
    });
};

const removeAllUsers = () => {
    return UserDAO.deleteAll().catch((err) => {
        throw new Error(err.message);
    });
};

const getUserPublicKey = (email) => {
    return UserDAO.findOne(mapToUserDTO({
        "email": email
    })).catch((err) => {
        throw new Error(err.message);
    })
}

module.exports = { getAllUsers, removeAllUsers, getUserPublicKey };