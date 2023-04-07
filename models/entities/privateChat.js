const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const privateChatSchema = new Schema({
  user1Id: { type: Schema.Types.ObjectId, ref: "User" },
  user2Id: { type: Schema.Types.ObjectId, ref: "User" },
  active: {
    type: Boolean,
    default: false,
  },
});
var PrivateChat = mongoose.model("PrivateChat", privateChatSchema);
var schemaObj = privateChatSchema.obj;
//Export schema obj
module.exports = { PrivateChat,schemaObj };
