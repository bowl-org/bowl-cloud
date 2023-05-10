const ContactBufferDAO = require("../repository/contactBufferDAO");
const { mapToContactBufferDTO } = require("../models/dtos/contactBufferDTO");

const addToContactBuffer = (socketBufferData) => {
    return new Promise((resolve, reject) => {
        let contactBuffer = mapToContactBufferDTO(socketBufferData);
        try {
            ContactBufferDAO.insert(contactBuffer)
                .then((insertContactBufferResponse) => {
                    return insertContactBufferResponse;
                });
        } catch (err) {
            reject(new Error(err.message));
        }
    });
}

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

const insertContactBuffer = (contactBufferData) => {
    return new Promise((resolve, reject) => {

    });
}

module.exports = {
    addToContactBuffer,
    getAllContactBuffers,
    removeAllContactBuffers,
    getContactBuffersByReceiverEmail,
    getContactBuffersBySenderEmail,
};