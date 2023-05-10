//Maps to message buffer DTO
const mapToMessageBufferDTO = (messageBufferData) => {
    try {
        let messageBuffer = {
            data: messageBufferData?.data?.trim(),
            sender_email: messageBufferData?.sender_email?.trim(),
            receiver_email: messageBufferData?.receiver_email?.trim(),
        };
        return messageBuffer;
    } catch (err) {
        throw err;
    }
};
module.exports = { mapToMessageBufferDTO };
