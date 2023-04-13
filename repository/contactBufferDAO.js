const { ContactBuffer } = require("../models/entities/contactBuffer");

const getAll = () => {
    return ContactBuffer.find({});
};

const findOne = (contactBufferDTO) => {
    return new Promise((resolve, reject) => {
        ContactBuffer.findOne(contactBufferDTO).then((contactBuffer) => {
            //null or undefined
            if (contactBuffer == null) {
                reject(new Error("There is no friend request!"));
            } else {
                resolve(contactBuffer);
            }
        });
    });
};

const findAll = (contactBufferDTO) => {
    return new Promise((resolve, reject) => {
        ContactBuffer.find(contactBufferDTO).then((contactBuffer) => {
            //null or undefined
            if (contactBuffer == null) {
                reject(new Error("There is no friend request!"));
            } else {
                resolve(contactBuffer);
            }
        });
    });
}

const deleteAll = () => {
    return ContactBuffer.remove({});
};
const deleteByReceiverEmail = (email) => {
    return ContactBuffer.remove({ receiver_email: receiver_email });
};
const findById = (id) => {
    return ContactBuffer.findById(id);
};
const insert = (contactBufferDTO) => {
    return ContactBuffer.create(contactBufferDTO);
};
const updateById = (id, data) => {
    return ContactBuffer.findByIdAndUpdate(id, data);
};

module.exports = { getAll, findOne, findAll, deleteAll, deleteByReceiverEmail, findById, insert, updateById };