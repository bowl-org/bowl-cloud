//Maps to contact buffer DTO
const mapToContactBufferDTO = (contactBufferData) => {
    try {
        let contactBuffer = {
            sender_email: contactBufferData?.sender_email?.trim(),
            receiver_email: contactBufferData?.receiver_email?.trim(),
        };
        return contactBuffer;
    } catch (err) {
        throw err;
    }
};
module.exports = { mapToContactBufferDTO };
