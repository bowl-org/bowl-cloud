const contactBufferService = require("../../services/contactBufferService");
const { generateMessage } = require("../../util/messageGenerator");

const addToContactBuffer = () => {
    let body = req.body;
    res.setHeader("Content-Type", "application/json");
    contactBufferService.addToContactBuffer(body).then((response) => {
        res.status(200).json(generateMessage(false, "Buffer added successfully"));
    }).catch((err) => {
        res.status(400).json(generateMessage(true, err.message));
    });
};

module.exports = { addToContactBuffer };