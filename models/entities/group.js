const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const groupSchema = new Schema({
  //TODO
});
var Group = mongoose.model("Group", userSchema);
var schemaObj = groupSchema.obj;
//Export schema obj
module.exports = { Group, schemaObj };
