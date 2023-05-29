const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const groupSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
});
var Group = mongoose.model("Group", groupSchema);
var schemaObj = groupSchema.obj;
//Export schema obj
module.exports = { Group, schemaObj };
