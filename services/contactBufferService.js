const ContactBufferDAO = require("../repository/contactBufferDAO");

const getAllContactBuffers = () => {
    return ContactBufferDAO.getAll().catch((err) => {
        throw new Error(err.message);
    });
};

const removeAllContactBuffers = () => {
    return ContactBufferDAO.deleteAll().catch((err) => {
        throw new Error(err.message);
    });
};

const getContactBuffersByReceiverEmail = (receiverEmail) => {
    return ContactBufferDAO.findAll({
        receiverEmail: receiverEmail,
    }).catch((err) => {
        throw new Error(err.message);
    });
};

const getContactBuffersBySenderEmail = (senderEmail) => {
    return ContactBufferDAO.findAll({
        senderEmail: senderEmail,
    }).catch((err) => {
        throw new Error(err.message);
    });
};

module.exports = {
    getAllContactBuffers,
    removeAllContactBuffers,
    getContactBuffersByReceiverEmail,
    getContactBuffersBySenderEmail,
};