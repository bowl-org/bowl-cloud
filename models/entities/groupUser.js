const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const groupUserSchema = new Schema({
  //TODO
});
var GroupUser = mongoose.model("GroupUser", userSchema);
var schemaObj = groupUserSchema.obj;
//Export schema obj
module.exports = { GroupUser, schemaObj };
