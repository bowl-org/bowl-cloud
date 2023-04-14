const MessageBufferService = require("../../services/messageBufferService")

const addToMessageBuffer = () => {
    return MessageBufferService.in
    
}
const removeMessageBufferOfUser = (id) => {
    return MessageBufferService.deleteMessageBuffer
}
const getMessageBufferOfReceiver = (receiverEmail) => {
    return  MessageBufferService.getMessageBuffersByReceiverEmail(receiverEmail);
}
const getMessageBufferOfSender = (senderEmail) => {
    return  MessageBufferService.getMessageBuffersBySenderEmail(senderEmail);
}


module.exports = {
    addToMessageBuffer,
    getMessageBufferOfUser,
    removeFromMessageBuffer,
    getMessageBufferOfReceiver,
    getMessageBufferOfSender

};