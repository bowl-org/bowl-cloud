const crypto = require("crypto");
const { Buffer } = require("buffer");

const validatePublicKey = (publicKey) => {
  try {
    if (publicKey == null) throw new Error("Public key is null!");
  } catch (err) {
    throw new Error(`Invalid public key: ${err}`);
  }
  try {
    crypto.createPublicKey({
      key: Buffer.from(publicKey, "base64"),
      type: "spki",
      length: 2048 / 8,
      format: "der",
    });
    return publicKey;
  } catch (err) {
    console.log("Public Key:", publicKey)
    console.log("Public key format wrong, trying to convert...");
    try {
      return Buffer.from(
        crypto
          .createPublicKey({
            key: Buffer.from(publicKey, "base64"),
            type: "pkcs1",
            length: 2048 / 8,
            format: "der",
          })
          .export({
            format: "der",
            type: "spki",
          })
      ).toString("base64");
    } catch (err) {
      throw new Error(`Invalid public key: ${err}`);
    }
  }
};

module.exports = { validatePublicKey };
