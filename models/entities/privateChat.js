const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const privateChatSchema = new Schema({
  user1Id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  user2Id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  active: {
    type: Boolean,
    default: false,
  },
});
privateChatSchema.index({ user1Id: 1, user2Id: 1 }, { unique: true });
var PrivateChat = mongoose.model("PrivateChat", privateChatSchema);
var schemaObj = privateChatSchema.obj;
//Export schema obj
module.exports = { PrivateChat, schemaObj };
