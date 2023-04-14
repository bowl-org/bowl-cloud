const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageBufferSchema = new Schema({
  data: {
    type: String,
    required: true,
  },
  receiver_email: {
    type: String,
    required: true,
  },
  sender_email: {
    type: String,
    required: true,
  },
});
let messageBuffer = mongoose.model("messageBuffer", messageBufferSchema);
let schemaObj = messageBuffer.obj;
//Export schema obj
module.exports = { messageBuffer, schemaObj };
