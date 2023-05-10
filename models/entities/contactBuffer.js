const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactBufferSchema = new Schema({
  sender_email: {
    type: String,
    required: true,
  },
  receiver_email: {
    type: String,
    required: true,
  },
  is_sender_notified: {
    type: Boolean,
    required: true,
  },
});
let ContactBuffer = mongoose.model("ContactBuffer", contactBufferSchema);
let schemaObj = ContactBuffer.obj;
//Export schema obj
module.exports = { ContactBuffer, schemaObj };
