const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const verificationTokenSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  token: {
    type: String,
    required: true
  },
  //Token expires after 2 minutes
  expireAt: {
    type: Date,
    default: Date.now,
    expires: 120 
  }
});

var VerificationToken = mongoose.model('VerificationToken', verificationTokenSchema);

module.exports = {VerificationToken};
