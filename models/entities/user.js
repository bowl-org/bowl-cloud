//Schema is ODM (Similar to ORM)
//Includes functionality of mongodb driver too
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  public_key: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  verified: {
    type: Boolean,
    default: false,
  },
  //active_conversations: [conversationSchema],
});
var User = mongoose.model("User", userSchema);
var schemaObj = userSchema.obj;
//Export schema obj
module.exports = { User, schemaObj };
