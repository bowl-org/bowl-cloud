const MessageBufferDAO = require("../repository/messageBufferDAO");

const addToMessageBuffer = (socketBufferData) => {
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
const getAllMessageBuffers = () => {
    return MessageBufferDAO.getAll().catch((err) => {
        throw new Error(err.message);
    });
};

const removeAllMessageBuffers = () => {
    return MessageBufferDAO.deleteAll().catch((err) => {
        throw new Error(err.message);
    });
};

const getMessageBuffersByReceiverEmail = (receiverEmail) => {
    return MessageBufferDAO.findAll({
        receiverEmail: receiverEmail,
    }).catch((err) => {
        throw new Error(err.message);
    });
};

const getMessageBuffersBySenderEmail = (senderEmail) => {
    return MessageBufferDAO.findAll({
        senderEmail: senderEmail,
    }).catch((err) => {
        throw new Error(err.message);
    });
};

module.exports = {
    getAllMessageBuffers,
    removeAllMessageBuffers,
    getMessageBuffersByReceiverEmail,
    getMessageBuffersBySenderEmail,
};