//Schema is ODM (Similar to ORM)
//Includes functionality of mongodb driver too
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const contactSchema = new Schema({
  contact_public_key: {
    type: String,
    required: true
  }
});
const groupSchema = new Schema({
  //TODO
});
const conversationSchema = new Schema({
  contacts: [contactSchema],
  groups: [groupSchema]
});
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
      unique: true
    },
    password: {
      type: String,
      required: true
    },
    active_conversations: [ conversationSchema ]
},
{
  timestamps: true
});

var User = mongoose.model('User', userSchema);

module.exports = User;
