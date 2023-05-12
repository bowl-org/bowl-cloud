const crypto = require("crypto");
const {Buffer} = require("buffer")

const validatePublicKey = (publicKey) => {
  try {
    if(publicKey == null)
      throw new Error("Public key is null!")
    crypto.createPublicKey({
      key: Buffer.from(publicKey, "base64"),
      type: "spki",
      length: 2048 / 8,
      format: "der",
    });
  } catch (err) {
    throw new Error(`Invalid public key: ${err}`);
  }
};

module.exports = { validatePublicKey };
